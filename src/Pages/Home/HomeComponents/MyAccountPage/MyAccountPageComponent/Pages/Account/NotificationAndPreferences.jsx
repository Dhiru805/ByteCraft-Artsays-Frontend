import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import Select from "react-select";

const NotificationAndPreferences = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Store all categories for all main categories
  const [allSubCategories, setAllSubCategories] = useState([]); // Store all subcategories for all categories
  const [categories, setCategories] = useState([]); // For dropdown display
  const [subCategories, setSubCategories] = useState([]); // For dropdown display
  const [formData, setFormData] = useState({
    preferredArtCategories: [null, null, null], // Initialize with nulls for main, category, subcategory
    subscribeNewsletters: "no",
    smsEmailAlerts: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const userId = localStorage.getItem("userId");

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
        // Fetch categories for all main categories
        await Promise.all(
          formattedCategories.map(async (mainCat) => {
            await fetchCategoryData(mainCat.value, false);
          })
        );
      } else {
        toast.error("Failed to load main categories.");
      }
    } catch (err) {
      console.error("Error fetching main categories:", err);
      toast.error("Error fetching main categories.");
    }
  };

  // Fetch categories by main category
  const fetchCategoryData = async (mainCategoryId, setDropdown = true) => {
    try {
      setSearchLoading(true);
      const response = await getAPI(`/api/category/${mainCategoryId}`, {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        const formattedCategories = response.data.data.map((category) => ({
          value: category.id,
          label: category.categoryName,
          mainCategoryId: mainCategoryId,
        }));
        setAllCategories((prev) => [
          ...prev.filter((cat) => cat.mainCategoryId !== mainCategoryId), // Remove old categories for this main category
          ...formattedCategories,
        ]);
        if (setDropdown) {
          setCategories(formattedCategories);
        }
        // Fetch subcategories for all categories
        await Promise.all(
          formattedCategories.map(async (cat) => {
            await fetchSubCategoryData(cat.value, false);
          })
        );
      } else {
        toast.error(`Failed to load categories for main category ID ${mainCategoryId}.`);
      }
    } catch (err) {
      console.error(`Error fetching categories for main category ID ${mainCategoryId}:`, err);
      toast.error("Error fetching categories.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch subcategories by category
  const fetchSubCategoryData = async (categoryId, setDropdown = true) => {
    try {
      setSearchLoading(true);
      const response = await getAPI(`/api/sub-category/${categoryId}`, {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        const formattedSubCategories = response.data.data.map((category) => ({
          value: category.id,
          label: category.subCategoryName,
          categoryId: categoryId,
        }));
        setAllSubCategories((prev) => [
          ...prev.filter((sub) => sub.categoryId !== categoryId), // Remove old subcategories for this category
          ...formattedSubCategories,
        ]);
        if (setDropdown) {
          setSubCategories(formattedSubCategories);
        }
      } else {
        toast.error(`Failed to load subcategories for category ID ${categoryId}.`);
      }
    } catch (err) {
      console.error(`Error fetching subcategories for category ID ${categoryId}:`, err);
      toast.error("Error fetching subcategories.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch user preferences
  const fetchPreferences = async () => {
    try {
      if (!userId) {
        console.warn("User ID is undefined. Cannot fetch preferences.");
        toast.error("User not logged in.");
        return;
      }

      setLoading(true);
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
        const mainCategory = mainList.find(item => item.value === preferredArtCategories[0]);
        formattedPreferences[0] = mainCategory ? { value: mainCategory.value, label: mainCategory.label } : null;

        // Fetch categories
        let categoryList = [];
        if (preferredArtCategories[0]) {
          const categoryResponse = await getAPI(`/api/category/${preferredArtCategories[0]}`, {}, true);
          categoryList = categoryResponse.data.data.map((cat) => ({
            value: cat.id,
            label: cat.categoryName,
            mainCategoryId: preferredArtCategories[0],
          }));
          const category = categoryList.find(item => item.value === preferredArtCategories[1]);
          formattedPreferences[1] = category ? { value: category.value, label: category.label } : null;
        }

        // Fetch subcategories
        let subCategoryList = [];
        if (preferredArtCategories[1]) {
          const subCategoryResponse = await getAPI(`/api/sub-category/${preferredArtCategories[1]}`, {}, true);
          subCategoryList = subCategoryResponse.data.data.map((cat) => ({
            value: cat.id,
            label: cat.subCategoryName,
            categoryId: preferredArtCategories[1],
          }));
          const subCategory = subCategoryList.find(item => item.value === preferredArtCategories[2]);
          formattedPreferences[2] = subCategory ? { value: subCategory.value, label: subCategory.label } : null;
        }

        // Update dropdown options
        setMainCategories(mainList);
        setCategories(categoryList);
        setSubCategories(subCategoryList);

        // Set form data
        setFormData({
          preferredArtCategories: formattedPreferences,
          subscribeNewsletters: subscribeNewsletters || "no",
          smsEmailAlerts: smsEmailAlerts || false,
        });

        // Fetch all categories and subcategories for search
        await Promise.all(
          mainList.map(async (mainCat) => {
            await fetchCategoryData(mainCat.value, false);
          })
        );
      } else {
        console.warn("No preference data found.");
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Error fetching preferences.");
    } finally {
      setLoading(false);
    }
  };

  // Memoized searchable categories
  const searchableCategories = useMemo(() => {
    const main = mainCategories.map(cat => ({
      ...cat,
      type: 'mainCategory',
      fullLabel: cat.label,
    }));

    const cats = allCategories.map(cat => ({
      ...cat,
      type: 'category',
      fullLabel: `${mainCategories.find(main => main.value === cat.mainCategoryId)?.label || 'Unknown'} - ${cat.label}`,
      mainCategoryId: cat.mainCategoryId,
    }));

    const sub = allSubCategories.map(sub => {
      const cat = allCategories.find(c => c.value === sub.categoryId);
      const mainLabel = mainCategories.find(main => main.value === cat?.mainCategoryId)?.label;
      return {
        ...sub,
        type: 'subCategory',
        fullLabel: `${mainLabel || 'Unknown'} - ${cat?.label || 'Unknown'} - ${sub.label}`,
        categoryId: sub.categoryId,
        mainCategoryId: cat?.mainCategoryId,
      };
    });

    return [...main, ...cats, ...sub].sort((a, b) => a.fullLabel.localeCompare(b.fullLabel));
  }, [mainCategories, allCategories, allSubCategories]);

  useEffect(() => {
    fetchMainCategoryData();
    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  const handleCategoryChange = (selectedOption, categoryLevel) => {
    setFormData((prevData) => {
      const updatedCategories = [...prevData.preferredArtCategories];

      if (categoryLevel === "main") {
        updatedCategories[0] = selectedOption;
        updatedCategories[1] = null;
        updatedCategories[2] = null;
        const newCategories = allCategories.filter(cat => cat.mainCategoryId === selectedOption?.value);
        setCategories(newCategories);
        setSubCategories([]);
      } else if (categoryLevel === "category") {
        updatedCategories[1] = selectedOption;
        updatedCategories[2] = null;
        const newSubCategories = allSubCategories.filter(sub => sub.categoryId === selectedOption?.value);
        setSubCategories(newSubCategories);
      } else if (categoryLevel === "subcategory") {
        updatedCategories[2] = selectedOption;
      }

      return {
        ...prevData,
        preferredArtCategories: updatedCategories,
      };
    });
  };

  const handleSearchCategoryChange = async (selectedOption) => {
    if (!selectedOption) {
      setFormData((prevData) => ({
        ...prevData,
        preferredArtCategories: [null, null, null],
      }));
      setCategories([]);
      setSubCategories([]);
      return;
    }

    const { type, value, mainCategoryId, categoryId } = selectedOption;

    let mainCat = null, cat = null, subCat = null;

    if (type === 'mainCategory') {
      mainCat = mainCategories.find(m => m.value === value);
      const newCategories = allCategories.filter(c => c.mainCategoryId === value);
      setCategories(newCategories);
      setSubCategories([]);
    } else if (type === 'category') {
      cat = allCategories.find(c => c.value === value);
      mainCat = mainCategories.find(m => m.value === mainCategoryId);
      const newSubCategories = allSubCategories.filter(s => s.categoryId === value);
      setSubCategories(newSubCategories);
    } else if (type === 'subCategory') {
      subCat = allSubCategories.find(s => s.value === value);
      cat = allCategories.find(c => c.value === categoryId);
      mainCat = mainCategories.find(m => m.value === mainCategoryId);
      setCategories(allCategories.filter(c => c.mainCategoryId === mainCategoryId));
      setSubCategories(allSubCategories.filter(s => s.categoryId === categoryId));
    }

    setFormData((prevData) => ({
      ...prevData,
      preferredArtCategories: [mainCat, cat, subCat],
    }));
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

      if (formData.preferredArtCategories.length < 3 || !formData.preferredArtCategories[2]) {
        toast.error("Please select all category levels.");
        return;
      }

      const payload = {
        preferences: {
          preferredArtCategories: formData.preferredArtCategories.map(category => category?.value).filter(Boolean),
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
    <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 text-gray-800 text-[16px] space-y-6">
      <h2 className="text-2xl font-semibold text-gray-950">Notification and Preferences</h2>

      {/* Search Category */}
      <div>
        <label className="block mb-2 font-medium">Search Category</label>
        <Select
          className="w-full text-gray-700"
          options={searchableCategories}
          getOptionLabel={e => e.fullLabel}
          getOptionValue={e => e.value}
          placeholder="Search for any category..."
          isClearable
          onChange={handleSearchCategoryChange}
          isDisabled={loading}
          isLoading={searchLoading}
          formatOptionLabel={(option) => (
            <div style={{ paddingLeft: option.type === 'subCategory' ? 20 : option.type === 'category' ? 10 : 0 }}>
              {option.fullLabel}
            </div>
          )}
        />
      </div>

      {/* Main Category */}
      <div>
        <label className="block mb-2 font-medium">Main Category</label>
        <Select
          className="w-full text-gray-700"
          value={formData.preferredArtCategories[0] || null}
          onChange={(option) => handleCategoryChange(option, "main")}
          options={mainCategories}
          placeholder="Select main category..."
          isDisabled={loading}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2 font-medium">Category</label>
        <Select
          className="w-full text-gray-700"
          value={formData.preferredArtCategories[1] || null}
          onChange={(option) => handleCategoryChange(option, "category")}
          options={categories}
          placeholder="Select category..."
          isDisabled={!formData.preferredArtCategories[0] || loading}
        />
      </div>

      {/* Subcategory */}
      <div>
        <label className="block mb-2 font-medium">Subcategory</label>
        <Select
          className="w-full text-gray-700"
          value={formData.preferredArtCategories[2] || null}
          onChange={(option) => handleCategoryChange(option, "subcategory")}
          options={subCategories}
          placeholder="Select subcategory..."
          isDisabled={!formData.preferredArtCategories[1] || loading}
        />
      </div>

      {/* Newsletter */}
      <div>
        <label className="block mb-2 font-medium">Subscribe to Newsletters</label>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="subscribeNewsletters"
              value="yes"
              checked={formData.subscribeNewsletters === "yes"}
              onChange={handleInputChange}
              className="accent-[#6F4D34]"
              disabled={loading}
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
              className="accent-[#6F4D34]"
              disabled={loading}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {/* Alerts Toggle */}
      <div>
        <label className="block mb-2 font-medium">SMS/Email Alerts for Bids & Offers</label>
        <div
          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.smsEmailAlerts ? 'bg-[#6B5A5C]' : 'bg-gray-300'}`}
          onClick={handleToggle}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.smsEmailAlerts ? 'translate-x-4' : ''}`}
          ></div>
        </div>
      </div>

      {/* Submit */}
      <div>
        <button
          className="bg-[#6F4D34] text-white px-9 py-2 rounded-full disabled:opacity-60"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default NotificationAndPreferences;