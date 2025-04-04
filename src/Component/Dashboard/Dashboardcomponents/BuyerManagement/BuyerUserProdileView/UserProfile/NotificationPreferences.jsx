import React, { useState, useEffect } from "react";
import getAPI from "../../../../../../api/getAPI";
import Switch from "react-switch";
import axios from "axios";
import Select from "react-select";

const AccountPreferences = ({ userId }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    preferredArtCategories: [],
    subscribeNewsletters: "no",
    smsEmailAlerts: false,
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/getproductcategory");
      const formattedCategories = response.data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (!userId) {
          console.warn("User ID is undefined. Cannot fetch preferences.");
          return;
        }
  
        const url = `http://localhost:3001/auth/getpreferences/${userId}`;
        const result = await getAPI(url);
        const preferencesData = result?.data?.data;
  
        if (preferencesData) {
          const { preferredArtCategories, subscribeNewsletters, smsEmailAlerts } = preferencesData;
  
          setFormData({
            preferredArtCategories: preferredArtCategories.map((category) => ({
              value: category._id,
              label: category.name,
            })),
            subscribeNewsletters: subscribeNewsletters || "no",
            smsEmailAlerts: smsEmailAlerts || false,
          });
        } else {
          console.warn("No preference data found.");
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
  
    if (userId) {
      fetchPreferences();
    }
  }, [userId]);
  
  
  



  
  
  

  return (
    <div className="body">
      <h5 className="mb-2">Notification And Preferences</h5>
      <hr className="mt-1" />
      <form >
        <div className="form-group">
          <label className="mx-2">Preferred Art Categories</label>
          <Select
            name="preferredArtCategories"
            value={formData.preferredArtCategories}
            options={categories}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select categories..."
            isDisabled
          />
        </div>

        <div className="form-group">
          <label className="mx-2">Subscription to Newsletters & Offers</label>
          <div className="mx-2">
            <input
              type="radio"
              name="subscribeNewsletters"
              value="yes"
              checked={formData.subscribeNewsletters === "yes"}
             disabled
            />{" "}
            Yes
            <input
              type="radio"
              name="subscribeNewsletters"
              value="no"
              checked={formData.subscribeNewsletters === "no"}
              disabled
              className="mx-2"
            />{" "}
            No
          </div>
        </div>

        <div className="form-group">
          <label className="mx-2 text-sm">SMS/Email Alerts for Bids & Offers</label>
          <div className="mt-1 mx-2">
            <Switch
              checked={formData.smsEmailAlerts}
              onColor="#0d6efd"
              offColor="#ccc"
              uncheckedIcon={false}
              checkedIcon={false}
              handleDiameter={12}
              height={16}
              width={32}
              isDisabled
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountPreferences;
