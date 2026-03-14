import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";

const EditAutoTargetingModal = ({
  isOpen,
  onClose,
  autoTargeting,
  fetchAutoTargetingData,
}) => {
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");
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
    if (autoTargeting) {
      setMainCategoryId(autoTargeting.mainCategoryId?._id || autoTargeting.mainCategoryId || "");
      setCategoryId(autoTargeting.categoryId?._id || autoTargeting.categoryId || "");
      setSubCategoryId(autoTargeting.subCategoryId?._id || autoTargeting.subCategoryId || "");
      setMinRange(autoTargeting.minRange !== undefined ? autoTargeting.minRange : "");
      setMaxRange(autoTargeting.maxRange !== undefined ? autoTargeting.maxRange : "");
    }
  }, [autoTargeting]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mainCategoryId || !categoryId || !subCategoryId) {
        toast.error("Please select all categories.");
        setLoading(false);
        return;
      }
      if (isNaN(minRange) || Number(minRange) < 0) {
        toast.error("Please enter a valid non-negative number for minimum range.");
        setLoading(false);
        return;
      }
      if (isNaN(maxRange) || Number(maxRange) < Number(minRange)) {
        toast.error("Please enter a valid number for maximum range, greater than or equal to minimum range.");
        setLoading(false);
        return;
      }

      const response = await putAPI(
        `/api/update-auto-targeting/${autoTargeting._id}`,
        {
          mainCategoryId,
          categoryId,
          subCategoryId,
          minRange: Number(Number(minRange).toFixed(2)),
          maxRange: Number(Number(maxRange).toFixed(2)),
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Auto-targeting setting updated successfully!");
        await fetchAutoTargetingData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update auto-targeting setting.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Auto-Targeting Setting</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="row mb-3 ml-2">
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Main Category</label>
                  <select
                    className="form-control"
                    value={mainCategoryId}
                    onChange={(e) => setMainCategoryId(e.target.value)}
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
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={!mainCategoryId}
                    required
                  >
                    <option value="">Select Category</option>
                    {categoryData.categories
                      .filter((cat) => cat.mainCategoryId === mainCategoryId)
                      .map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Sub Category</label>
                  <select
                    className="form-control"
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    disabled={!categoryId}
                    required
                  >
                    <option value="">Select Sub Category</option>
                    {categoryData.subCategories
                      .filter((subCat) => subCat.categoryId === categoryId)
                      .map((subCategory) => (
                        <option key={subCategory.value} value={subCategory.value}>
                          {subCategory.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Min Range</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={minRange}
                    onChange={(e) => setMinRange(e.target.value)}
                    disabled={!subCategoryId}
                    placeholder={subCategoryId ? "Enter min range" : ""}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Max Range</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={maxRange}
                    onChange={(e) => setMaxRange(e.target.value)}
                    disabled={!subCategoryId}
                    placeholder={subCategoryId ? "Enter max range" : ""}
                    min={minRange || 0}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAutoTargetingModal;