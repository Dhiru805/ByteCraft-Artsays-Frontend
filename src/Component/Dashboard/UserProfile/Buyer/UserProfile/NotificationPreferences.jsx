import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import putAPI from "../../../../../api/putAPI";
import getAPI from "../../../../../api/getAPI";
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
    const [loading, setLoading] = useState(false);
  

  // const fetchCategories = async () => {
  //   try {
  //     const response = await axios.get("/api/getproductcategory");
  //     const formattedCategories = response.data.map((category) => ({
  //       value: category._id,
  //       label: category.name,
  //     }));
  //     setCategories(formattedCategories);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (!userId) {
          console.warn("User ID is undefined. Cannot fetch preferences.");
          return;
        }
  
        const url = `/auth/getpreferences/${userId}`;
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
  
  
  const handleChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      preferredArtCategories: selectedOptions,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      smsEmailAlerts: !prevData.smsEmailAlerts,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const url = `/auth/updatepreferences/${userId}`;
      const payload = {
        preferences: {
          ...formData,
          preferredArtCategories: formData.preferredArtCategories.map(category => category.value),
        },
      };
  
      console.log("Submitting payload:", payload);
  
      const result = await putAPI(url, payload);
      console.log("API Response:", result);
  
      if (result ) {
        toast.success(result.message || "Preferences updated successfully");
      } else {
        toast.error(result?.message || "Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Error updating preferences");
    }
  };
  
  

  return (
    <div className="body">
      <h5 className="mb-2">Notification And Preferences</h5>
      <hr className="mt-1" />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="mx-2">Preferred Art Categories</label>
          <Select
            name="preferredArtCategories"
            value={formData.preferredArtCategories}
            onChange={handleChange}
            options={categories}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select categories..."
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
              onChange={handleInputChange}
            />{" "}
            Yes
            <input
              type="radio"
              name="subscribeNewsletters"
              value="no"
              checked={formData.subscribeNewsletters === "no"}
              onChange={handleInputChange}
              className="mx-2"
            />{" "}
            No
          </div>
        </div>

        <div className="form-group">
          <label className="mx-2 text-sm">SMS/Email Alerts for Bids & Offers</label>
          <div className="mt-1 mx-2">
            <Switch
              onChange={handleToggle}
              checked={formData.smsEmailAlerts}
              onColor="#0d6efd"
              offColor="#ccc"
              uncheckedIcon={false}
              checkedIcon={false}
              handleDiameter={12}
              height={16}
              width={32}
            />
          </div>
        </div>

        <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading}
          onClick={(e) => {
            setLoading(true);
            Promise.resolve(handleSubmit(e))
              .then(() => {
                 window.location.reload();
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }}
        >{loading ? "Updating..." : "Update"}</button>
      </form>
    </div>
  );
};

export default AccountPreferences;
