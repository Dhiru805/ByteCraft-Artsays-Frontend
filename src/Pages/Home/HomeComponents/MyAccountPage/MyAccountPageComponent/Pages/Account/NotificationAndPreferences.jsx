import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import Select from "react-select";

const NotificationAndPreferences = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    preferredArtCategories: [],
    subscribeNewsletters: "no",
    smsEmailAlerts: false,
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

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

  const fetchPreferences = async () => {
  try {
    if (!userId) {
      console.warn("User ID is undefined. Cannot fetch preferences.");
      return;
    }

    const url = `/auth/getpreferences/${userId}`;
    const result = await getAPI(url);
    const preferencesData = result?.data?.data;
    console.log("pref data", preferencesData);

    if (preferencesData) {
      const { preferredArtCategories, subscribeNewsletters, smsEmailAlerts } = preferencesData;

      const formattedPreferences = [];

      // Fetch and find main category
      const mainResponse = await getAPI(`/api/main-category`, {}, true);
      const mainList = mainResponse.data.data.map((cat) => ({
        value: cat._id,
        label: cat.mainCategoryName,
      }));
      const mainCategory = mainList.find(item => item.value === preferredArtCategories[0]);
      formattedPreferences[0] = {
        value: preferredArtCategories[0],
        label: mainCategory?.label || "Unknown",
      };

      // Fetch and find category
      const categoryResponse = await getAPI(`/api/category/${preferredArtCategories[0]}`, {}, true);
      const categoryList = categoryResponse.data.data.map((cat) => ({
        value: cat.id,
        label: cat.categoryName,
      }));
      const category = categoryList.find(item => item.value === preferredArtCategories[1]);
      formattedPreferences[1] = {
        value: preferredArtCategories[1],
        label: category?.label || "Unknown",
      };

      // Fetch and find subcategory
      const subCategoryResponse = await getAPI(`/api/sub-category/${preferredArtCategories[1]}`, {}, true);
      const subCategoryList = subCategoryResponse.data.data.map((cat) => ({
        value: cat.id,
        label: cat.subCategoryName,
      }));
      const subCategory = subCategoryList.find(item => item.value === preferredArtCategories[2]);
      formattedPreferences[2] = {
        value: preferredArtCategories[2],
        label: subCategory?.label || "Unknown",
      };

      // Update dropdown options too
      setMainCategories(mainList);
      setCategories(categoryList);
      setSubCategories(subCategoryList);

      // Set form data
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

  const handleCategoryChange = (selectedOptions, categoryLevel) => {
    setFormData((prevData) => {
      const updatedCategories = [...prevData.preferredArtCategories];

      if (categoryLevel === "main") {
        updatedCategories[0] = selectedOptions;
        updatedCategories[1] = null;
        updatedCategories[2] = null;
        setCategories([]);
        setSubCategories([]);
        if (selectedOptions) {
          fetchCategoryData(selectedOptions.value);
        }
      } else if (categoryLevel === "category") {
        updatedCategories[1] = selectedOptions;
        updatedCategories[2] = null;
        setSubCategories([]);
        if (selectedOptions) {
          fetchSubCategoryData(selectedOptions.value);
        }
      } else if (categoryLevel === "subcategory") {
        updatedCategories[2] = selectedOptions;
      }

      return {
        ...prevData,
        preferredArtCategories: updatedCategories.filter(Boolean),
      };
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      smsEmailAlerts: !prevData.smsEmailAlerts,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!userId) {
        toast.error("User not logged in.");
        return;
      }

      if (formData.preferredArtCategories.length < 3) {
        toast.error("Please select all category levels.");
        return;
      }

      const payload = {
        preferences: {
          preferredArtCategories: formData.preferredArtCategories.map(category => category.value),
          subscribeNewsletters: formData.subscribeNewsletters,
          smsEmailAlerts: formData.smsEmailAlerts,
        },
      };

      const response = await putAPI(`/auth/updatepreferences/${userId}`, payload);

      if (response.data?.success) {
        toast.success("Preferences updated successfully!");
      } else {
        toast.error("Failed to update preferences.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Error updating preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[1208px] mx-auto text-gray-800 text-[16px]">
      <h2 className="text-xl text-gray-950 font-semibold mb-6">Notification and Preferences</h2>

      {/* Main Category Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Main Category</label>
        <Select
          className="w-full text-gray-500"
          value={formData.preferredArtCategories[0] || null}
          onChange={(option) => handleCategoryChange(option, "main")}
          options={mainCategories}
          placeholder="Select main category..."
        />
      </div>

      {/* Category Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Category</label>
        <Select
          className="w-full text-gray-500"
          value={formData.preferredArtCategories[1] || null}
          onChange={(option) => handleCategoryChange(option, "category")}
          options={categories}
          placeholder="Select category..."
          isDisabled={!formData.preferredArtCategories[0]}
        />
      </div>

      {/* Sub Category Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Subcategory</label>
        <Select
          className="w-full text-gray-500"
          value={formData.preferredArtCategories[2] || null}
          onChange={(option) => handleCategoryChange(option, "subcategory")}
          options={subCategories}
          placeholder="Select subcategory..."
          isDisabled={!formData.preferredArtCategories[1]}
        />
      </div>

      {/* Newsletter */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Subscribe to Newsletters</label>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="subscribeNewsletters"
              value="yes"
              checked={formData.subscribeNewsletters === "yes"}
              onChange={handleInputChange}
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="subscribeNewsletters"
              value="no"
              checked={formData.subscribeNewsletters === "no"}
              onChange={handleInputChange}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {/* Alerts Toggle */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">SMS/Email Alerts for Bids & Offers</label>
        <div
          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.smsEmailAlerts ? 'bg-[#6B5A5C]' : 'bg-gray-300'}`}
          onClick={handleToggle}
        >
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.smsEmailAlerts ? 'translate-x-4' : ''}`}></div>
        </div>
      </div>

      <button
        className="bg-[#6F4D34] text-white px-9 py-2 rounded-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default NotificationAndPreferences;