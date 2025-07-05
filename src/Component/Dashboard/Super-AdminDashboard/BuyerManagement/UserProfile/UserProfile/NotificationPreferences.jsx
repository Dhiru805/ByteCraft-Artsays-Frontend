import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import putAPI from "../../../../../../api/putAPI";
import getAPI from "../../../../../../api/getAPI";
import Switch from "react-switch";
import axios from "axios";
import Select from "react-select";

const AccountPreferences = () => {
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
          mainCategoryId: mainCategoryId,
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
          categoryId: categoryId,
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

      if (preferencesData) {
        const { preferredArtCategories, subscribeNewsletters, smsEmailAlerts } = preferencesData;

        const formattedPreferences = [];

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

        const categoryResponse = await getAPI(`/api/category/${preferredArtCategories[0]}`, {}, true);
        const categoryList = categoryResponse.data.data.map((cat) => ({
          value: cat.id,
          label: cat.categoryName,
          mainCategoryId: preferredArtCategories[0],
        }));
        const category = categoryList.find(item => item.value === preferredArtCategories[1]);
        formattedPreferences[1] = {
          value: preferredArtCategories[1],
          label: category?.label || "Unknown",
        };

        const subCategoryResponse = await getAPI(`/api/sub-category/${preferredArtCategories[1]}`, {}, true);
        const subCategoryList = subCategoryResponse.data.data.map((cat) => ({
          value: cat.id,
          label: cat.subCategoryName,
          categoryId: preferredArtCategories[1],
        }));
        const subCategory = subCategoryList.find(item => item.value === preferredArtCategories[2]);
        formattedPreferences[2] = {
          value: preferredArtCategories[2],
          label: subCategory?.label || "Unknown",
        };

        setMainCategories(mainList);
        setCategories(categoryList);
        setSubCategories(subCategoryList);

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

  const categoryData = {
    mainCategories: mainCategories || [],
    categories: categories || [],
    subCategories: subCategories || [],
  };

  // [Updated] Flattened searchable categories with proper labels
  const searchableCategories = React.useMemo(() => {
    const main = categoryData.mainCategories.map(cat => ({
      ...cat,
      type: 'mainCategory',
      fullLabel: cat.label
    }));

    const cats = categoryData.categories.map(cat => {
      const mainLabel = categoryData.mainCategories.find(main => main.value === cat.mainCategoryId)?.label || '';
      return {
        ...cat,
        type: 'category',
        fullLabel: `${mainLabel} - ${cat.label}`,
        mainCategoryId: cat.mainCategoryId
      };
    });

    const sub = categoryData.subCategories.map(sub => {
      const cat = categoryData.categories.find(c => c.value === sub.categoryId);
      const mainLabel = categoryData.mainCategories.find(main => main.value === cat?.mainCategoryId)?.label || '';
      return {
        ...sub,
        type: 'subCategory',
        fullLabel: `${mainLabel} - ${cat?.label || ''} - ${sub.label}`,
        categoryId: sub.categoryId,
        mainCategoryId: cat?.mainCategoryId
      };
    });

    return [...main, ...cats, ...sub].sort((a, b) => a.fullLabel.localeCompare(b.fullLabel));
  }, [mainCategories, categories, subCategories]);

  return (
    <div className="body">
      <h5 className="mb-2">Notification And Preferences</h5>
      <hr className="mt-1" />
      <form>
        <div className="form-group">
          <label>Search Category</label>
          <Select
            options={searchableCategories}
            getOptionLabel={(e) => e.fullLabel}
            getOptionValue={(e) => e.value}
            placeholder="Search for any category..."
            isClearable
            isSearchable // [Ensures dynamic typing works]
            onChange={(selectedOption) => {
              if (!selectedOption) return;

              let mainCat = null, cat = null, subCat = null;

              if (selectedOption.type === 'mainCategory') {
                mainCat = mainCategories.find(m => m.value === selectedOption.value);
              }

              if (selectedOption.type === 'category') {
                cat = categories.find(c => c.value === selectedOption.value);
                mainCat = mainCategories.find(m => m.value === cat?.mainCategoryId);
              }

              if (selectedOption.type === 'subCategory') {
                subCat = subCategories.find(s => s.value === selectedOption.value);
                cat = categories.find(c => c.value === subCat?.categoryId);
                mainCat = mainCategories.find(m => m.value === cat?.mainCategoryId);
              }

              setFormData((prev) => ({
                ...prev,
                preferredArtCategories: [mainCat, cat, subCat].filter(Boolean),
              }));

              if (mainCat) fetchCategoryData(mainCat.value);
              if (cat) fetchSubCategoryData(cat.value);
            }}
          />
        </div>
        <div className="form-group">
          <label className="mx-2">Main Category</label>
          <Select
            name="mainCategory"
            value={formData.preferredArtCategories[0] || null}
            onChange={(option) => handleCategoryChange(option, "main")}
            options={mainCategories}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select main category..."
          />
        </div>

        <div className="form-group">
          <label className="mx-2">Category</label>
          <Select
            name="category"
            value={formData.preferredArtCategories[1] || null}
            onChange={(option) => handleCategoryChange(option, "category")}
            options={categories}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select category..."
            isDisabled={!formData.preferredArtCategories[0]}
          />
        </div>

        <div className="form-group">
          <label className="mx-2">Subcategory</label>
          <Select
            name="subcategory"
            value={formData.preferredArtCategories[2] || null}
            onChange={(option) => handleCategoryChange(option, "subcategory")}
            options={subCategories}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select subcategory..."
            isDisabled={!formData.preferredArtCategories[1]}
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
              checked={formData.smsEmailAlerts}
              onChange={handleToggle}
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

        <button
          className="btn btn-primary mx-2"
          fdprocessedid="p8q93b"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default AccountPreferences;