import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";

const EditKeywordTargetingModal = ({
  isOpen,
  onClose,
  keywordTargeting,
  fetchKeywordTargetingData,
}) => {
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });
  const [formData, setFormData] = useState({
    mainCategoryId: "",
    categoryId: "",
    subCategoryId: "",
    keyword: "",
    broad: { range: "" },
    phrase: { range: "" },
    exact: { range: "" },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await getAPI("/api/sub-category", {}, true);
        const categoryItems = response.data.data;
        if (categoryItems && categoryItems.length > 0) {
          const mainCategoriesMap = new Map();
          const categoriesMap = new Map();
          const subCategoriesList = [];

          categoryItems.forEach((item) => {
            if (item.mainCategoryId && !mainCategoriesMap.has(item.mainCategoryId)) {
              mainCategoriesMap.set(item.mainCategoryId, {
                value: item.mainCategoryId,
                label: item.mainCategoryName,
              });
            }
            if (item.categoryId && !categoriesMap.has(item.categoryId)) {
              categoriesMap.set(item.categoryId, {
                value: item.categoryId,
                label: item.categoryName,
                mainCategoryId: item.mainCategoryId,
              });
            }
            if (item.subCategoryId) {
              subCategoriesList.push({
                value: item.subCategoryId,
                label: item.subCategoryName,
                categoryId: item.categoryId,
                mainCategoryId: item.mainCategoryId,
              });
            }
          });

          setCategoryData({
            mainCategories: Array.from(mainCategoriesMap.values()),
            categories: Array.from(categoriesMap.values()),
            subCategories: subCategoriesList,
          });
        } else {
          toast.warn("No category items found.");
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to load category data.");
      }
    };
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (keywordTargeting) {
      setFormData({
        mainCategoryId: keywordTargeting.mainCategoryId?._id || keywordTargeting.mainCategoryId || "",
        categoryId: keywordTargeting.categoryId?._id || keywordTargeting.categoryId || "",
        subCategoryId: keywordTargeting.subCategoryId?._id || keywordTargeting.subCategoryId || "",
        keyword: keywordTargeting.keyword || "",
        broad: { range: keywordTargeting.broad?.range !== undefined ? keywordTargeting.broad.range : "" },
        phrase: { range: keywordTargeting.phrase?.range !== undefined ? keywordTargeting.phrase.range : "" },
        exact: { range: keywordTargeting.exact?.range !== undefined ? keywordTargeting.exact.range : "" },
      });
    }
  }, [keywordTargeting]);

  const handleInputChange = (field, value, category = null) => {
    if (category) {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          range: value === "" ? "" : parseFloat(Number(value).toFixed(2)),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { mainCategoryId, categoryId, subCategoryId, keyword, broad, phrase, exact } = formData;
      if (!mainCategoryId || !categoryId || !subCategoryId || !keyword) {
        toast.error("Please fill in all category and keyword fields.");
        setLoading(false);
        return;
      }
      const ranges = { broad, phrase, exact };
      for (const [cat, rangeObj] of Object.entries(ranges)) {
        if (isNaN(rangeObj.range) || Number(rangeObj.range) < 0) {
          toast.error(`Please enter a valid non-negative number for ${cat} range.`);
          setLoading(false);
          return;
        }
      }

      const response = await putAPI(
        `/api/update-keyword-targeting/${keywordTargeting._id}`,
        {
          mainCategoryId,
          categoryId,
          subCategoryId,
          keyword,
          broad: { range: Number(broad.range) },
          phrase: { range: Number(phrase.range) },
          exact: { range: Number(exact.range) },
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Keyword targeting setting updated successfully!");
        await fetchKeywordTargetingData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update keyword targeting setting.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      mainCategoryId: "",
      categoryId: "",
      subCategoryId: "",
      keyword: "",
      broad: { range: "" },
      phrase: { range: "" },
      exact: { range: "" },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Keyword Targeting Setting</h5>
            <button
              type="button"
              className="close"
              onClick={handleClose}
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <div>
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Main Category</label>
                  <select
                    className="form-control"
                    value={formData.mainCategoryId}
                    onChange={(e) => handleInputChange("mainCategoryId", e.target.value)}
                    required
                  >
                    <option value="">Select Main Category</option>
                    {categoryData.mainCategories.map((mainCategory) => (
                      <option key={mainCategory.value} value={mainCategory.value}>
                        {mainCategory.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    disabled={!formData.mainCategoryId}
                    required
                  >
                    <option value="">Select Category</option>
                    {categoryData.categories
                      .filter((cat) => cat.mainCategoryId === formData.mainCategoryId)
                      .map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Sub Category</label>
                  <select
                    className="form-control"
                    value={formData.subCategoryId}
                    onChange={(e) => handleInputChange("subCategoryId", e.target.value)}
                    disabled={!formData.categoryId}
                    required
                  >
                    <option value="">Select Sub Category</option>
                    {categoryData.subCategories
                      .filter((subCat) => subCat.categoryId === formData.categoryId)
                      .map((subCategory) => (
                        <option key={subCategory.value} value={subCategory.value}>
                          {subCategory.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Keyword</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.keyword}
                    onChange={(e) => handleInputChange("keyword", e.target.value)}
                    disabled={!formData.subCategoryId}
                    placeholder={formData.subCategoryId ? "Enter Keyword" : ""}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Match Type</th>
                      <th scope="col">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["broad", "phrase", "exact"].map((category) => (
                      <tr key={category}>
                        <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={formData[category].range}
                            onChange={(e) => handleInputChange(null, e.target.value, category)}
                            disabled={!formData.subCategoryId || !formData.keyword}
                            placeholder={formData.subCategoryId && formData.keyword ? "Range" : ""}
                            min="0"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditKeywordTargetingModal;