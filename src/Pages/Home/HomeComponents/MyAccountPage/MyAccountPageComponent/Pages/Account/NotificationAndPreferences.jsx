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
      }
    } catch (err) {
      console.warn(`Could not fetch categories for main category ID ${mainCategoryId}`);
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
        }
      } catch (err) {
      console.warn(`Could not fetch subcategories for category ID ${categoryId}`);
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

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  
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
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Notification & Preferences
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Personalize Your Experience</h3>
            <p className="text-sm text-gray-500">Choose your interests and how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Categories Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Category</label>
              <Select
                options={searchableCategories}
                getOptionLabel={e => e.fullLabel}
                getOptionValue={e => e.value}
                placeholder="Quick search for any category..."
                isClearable
                onChange={handleSearchCategoryChange}
                isDisabled={loading}
                isLoading={searchLoading}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: "1rem",
                    borderWidth: "1px",
                    borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                    padding: "6px 4px",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                    backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                    "&:hover": { borderColor: "#5C4033" },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                    color: state.isSelected ? "white" : "black",
                    borderRadius: "0.5rem",
                    margin: "2px 4px",
                    width: "calc(100% - 8px)",
                  }),
                }}
                formatOptionLabel={(option) => (
                  <div className={`px-2 py-1 ${option.type === 'subCategory' ? 'pl-8' : option.type === 'category' ? 'pl-4' : 'font-bold'}`}>
                    {option.fullLabel}
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Category</label>
              <Select
                value={formData.preferredArtCategories[0] || null}
                onChange={(option) => handleCategoryChange(option, "main")}
                options={mainCategories}
                placeholder="Select main category"
                isDisabled={loading}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: "1rem",
                    borderWidth: "1px",
                    borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                    padding: "6px 4px",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                    backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                    "&:hover": { borderColor: "#5C4033" },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                    color: state.isSelected ? "white" : "black",
                    borderRadius: "0.5rem",
                    margin: "2px 4px",
                    width: "calc(100% - 8px)",
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <Select
                value={formData.preferredArtCategories[1] || null}
                onChange={(option) => handleCategoryChange(option, "category")}
                options={categories}
                placeholder="Select category"
                isDisabled={!formData.preferredArtCategories[0] || loading}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: "1rem",
                    borderWidth: "1px",
                    borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                    padding: "6px 4px",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                    backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                    "&:hover": { borderColor: "#5C4033" },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                    color: state.isSelected ? "white" : "black",
                    borderRadius: "0.5rem",
                    margin: "2px 4px",
                    width: "calc(100% - 8px)",
                  }),
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
              <Select
                value={formData.preferredArtCategories[2] || null}
                onChange={(option) => handleCategoryChange(option, "subcategory")}
                options={subCategories}
                placeholder="Select subcategory"
                isDisabled={!formData.preferredArtCategories[1] || loading}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: "1rem",
                    borderWidth: "1px",
                    borderColor: state.isFocused ? "#5C4033" : "rgb(229, 231, 235)",
                    padding: "6px 4px",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(92, 64, 51, 0.1)" : "none",
                    backgroundColor: state.isFocused ? "white" : "rgb(249, 250, 251)",
                    "&:hover": { borderColor: "#5C4033" },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#5C4033" : state.isFocused ? "#f3f4f6" : "white",
                    color: state.isSelected ? "white" : "black",
                    borderRadius: "0.5rem",
                    margin: "2px 4px",
                    width: "calc(100% - 8px)",
                  }),
                }}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 my-8"></div>

          {/* Subscriptions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Email Newsletters</h4>
              <p className="text-sm text-gray-500">Stay updated with the latest art trends, exhibitions, and community news.</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, subscribeNewsletters: "yes" }))}
                  className={`flex-1 py-3 rounded-2xl text-center font-semibold transition-all duration-300 ${formData.subscribeNewsletters === 'yes' 
                    ? 'bg-[#5C4033] text-white shadow-lg shadow-[#5C4033]/20' 
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  disabled={loading}
                >
                  Subscribed
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, subscribeNewsletters: "no" }))}
                  className={`flex-1 py-3 rounded-2xl text-center font-semibold transition-all duration-300 ${formData.subscribeNewsletters === 'no' 
                    ? 'bg-[#5C4033] text-white shadow-lg shadow-[#5C4033]/20' 
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  disabled={loading}
                >
                  Unsubscribed
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Real-time Alerts</h4>
              <p className="text-sm text-gray-500">Get instant SMS and Email notifications for bids, offers, and order status updates.</p>
              <div 
                className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${formData.smsEmailAlerts ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-blue-200'}`}
                onClick={handleToggle}
              >
                <span className={`font-semibold ${formData.smsEmailAlerts ? 'text-emerald-700' : 'text-gray-600'}`}>
                  {formData.smsEmailAlerts ? 'Alerts Enabled' : 'Alerts Disabled'}
                </span>
                <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${formData.smsEmailAlerts ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.smsEmailAlerts ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden mt-8"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? "Updating..." : "Update Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationAndPreferences;