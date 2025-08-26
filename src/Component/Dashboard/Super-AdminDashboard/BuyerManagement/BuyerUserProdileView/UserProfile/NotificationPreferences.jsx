import React, { useState, useEffect } from "react";
import getAPI from "../../../../../../api/getAPI";
import Switch from "react-switch";
import Select from "react-select";

const AccountPreferences = ({ userId }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    preferredArtCategories: [null, null, null], // Array to hold main, category, subcategory
    subscribeNewsletters: "no",
    smsEmailAlerts: false,
  });

  // Fetch main categories
  const fetchMainCategoryData = async () => {
    try {
      const response = await getAPI(`/api/main-category`, {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        const formattedCategories = response.data.data.map((category) => ({
          value: category._id,
          label: category.mainCategoryName,
        }));
        setMainCategories(formattedCategories);
      }
    } catch (err) {
      console.error("Error fetching main categories:", err);
    }
  };

  // Fetch categories based on main category ID
  const fetchCategoryData = async (mainCategoryId) => {
    try {
      const response = await getAPI(`/api/category/${mainCategoryId}`, {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        const formattedCategories = response.data.data.map((category) => ({
          value: category.id,
          label: category.categoryName,
        }));
        setCategories(formattedCategories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch subcategories based on category ID
  const fetchSubCategoryData = async (categoryId) => {
    try {
      const response = await getAPI(`/api/sub-category/${categoryId}`, {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        const formattedCategories = response.data.data.map((category) => ({
          value: category.id,
          label: category.subCategoryName,
        }));
        setSubCategories(formattedCategories);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  // Fetch user preferences
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

        const formattedPreferences = [null, null, null];

        // Fetch main categories
        const mainResponse = await getAPI(`/api/main-category`, {}, true);
        const mainList = mainResponse.data.data.map((cat) => ({
          value: cat._id,
          label: cat.mainCategoryName,
        }));
        const mainCategory = mainList.find((item) => item.value === preferredArtCategories[0]);
        formattedPreferences[0] = mainCategory
          ? { value: mainCategory.value, label: mainCategory.label }
          : null;

        // Fetch categories if main category exists
        if (preferredArtCategories[0]) {
          const categoryResponse = await getAPI(`/api/category/${preferredArtCategories[0]}`, {}, true);
          const categoryList = categoryResponse.data.data.map((cat) => ({
            value: cat.id,
            label: cat.categoryName,
          }));
          const category = categoryList.find((item) => item.value === preferredArtCategories[1]);
          formattedPreferences[1] = category
            ? { value: category.value, label: category.label }
            : null;

          // Fetch subcategories if category exists
          if (preferredArtCategories[1]) {
            const subCategoryResponse = await getAPI(`/api/sub-category/${preferredArtCategories[1]}`, {}, true);
            const subCategoryList = subCategoryResponse.data.data.map((cat) => ({
              value: cat.id,
              label: cat.subCategoryName,
            }));
            const subCategory = subCategoryList.find((item) => item.value === preferredArtCategories[2]);
            formattedPreferences[2] = subCategory
              ? { value: subCategory.value, label: subCategory.label }
              : null;

            setSubCategories(subCategoryList);
          }
          setCategories(categoryList);
        }
        setMainCategories(mainList);

        setFormData({
          preferredArtCategories: formattedPreferences,
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

  useEffect(() => {
    fetchMainCategoryData();
    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  return (
    <div className="body">
      <h5 className="mb-2">Notification And Preferences</h5>
      <hr className="mt-1" />
      <form>
        <div className="form-group">
          <label className="mx-2">Main Category</label>
          <Select
            name="mainCategory"
            value={formData.preferredArtCategories[0] || null}
            // options={mainCategories}
            // className="basic-multi-select"
            // classNamePrefix="select"
            // placeholder="Select main category..."
            isDisabled
          />
        </div>

        <div className="form-group">
          <label className="mx-2">Category</label>
          <Select
            name="category"
            value={formData.preferredArtCategories[1] || null}
            // options={categories}
            // className="basic-multi-select"
            // classNamePrefix="select"
            // placeholder="Select category..."
            isDisabled
          />
        </div>

        <div className="form-group">
          <label className="mx-2">Subcategory</label>
          <Select
            name="subcategory"
            value={formData.preferredArtCategories[2] || null}
            // options={subCategories}
            // className="basic-multi-select"
            // classNamePrefix="select"
            // placeholder="Select subcategory..."
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
              disabled
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountPreferences;