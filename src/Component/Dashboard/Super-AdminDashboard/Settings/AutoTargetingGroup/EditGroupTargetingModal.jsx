import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";

const EditGroupTargetingModal = ({
  isOpen,
  onClose,
  groupTargeting,
  fetchGroupTargetingData,
}) => {
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [closeMatch, setCloseMatch] = useState({ minRange: "", maxRange: "" });
  const [looseMatch, setLooseMatch] = useState({ minRange: "", maxRange: "" });
  const [substitutes, setSubstitutes] = useState({ minRange: "", maxRange: "" });
  const [complements, setComplements] = useState({ minRange: "", maxRange: "" });
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
    if (groupTargeting) {
      setMainCategoryId(groupTargeting.mainCategoryId?._id || groupTargeting.mainCategoryId || "");
      setCategoryId(groupTargeting.categoryId?._id || groupTargeting.categoryId || "");
      setSubCategoryId(groupTargeting.subCategoryId?._id || groupTargeting.subCategoryId || "");
      setCloseMatch({
        minRange: groupTargeting.closeMatch?.minRange !== undefined ? groupTargeting.closeMatch.minRange : "",
        maxRange: groupTargeting.closeMatch?.maxRange !== undefined ? groupTargeting.closeMatch.maxRange : "",
      });
      setLooseMatch({
        minRange: groupTargeting.looseMatch?.minRange !== undefined ? groupTargeting.looseMatch.minRange : "",
        maxRange: groupTargeting.looseMatch?.maxRange !== undefined ? groupTargeting.looseMatch.maxRange : "",
      });
      setSubstitutes({
        minRange: groupTargeting.substitutes?.minRange !== undefined ? groupTargeting.substitutes.minRange : "",
        maxRange: groupTargeting.substitutes?.maxRange !== undefined ? groupTargeting.substitutes.maxRange : "",
      });
      setComplements({
        minRange: groupTargeting.complements?.minRange !== undefined ? groupTargeting.complements.minRange : "",
        maxRange: groupTargeting.complements?.maxRange !== undefined ? groupTargeting.complements.maxRange : "",
      });
    }
  }, [groupTargeting]);

  const handleRangeChange = (category, rangeType, value) => {
    const setter = {
      closeMatch: setCloseMatch,
      looseMatch: setLooseMatch,
      substitutes: setSubstitutes,
      complements: setComplements,
    }[category];
    setter((prev) => ({
      ...prev,
      [rangeType]: value === "" ? "" : parseFloat(Number(value).toFixed(2)),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mainCategoryId || !categoryId || !subCategoryId) {
        toast.error("Please select all categories.");
        setLoading(false);
        return;
      }
      const ranges = { closeMatch, looseMatch, substitutes, complements };
      for (const [cat, range] of Object.entries(ranges)) {
        if (isNaN(range.minRange) || Number(range.minRange) < 0) {
          toast.error(`Please enter a valid non-negative number for ${cat.replace(/([A-Z])/g, " $1")} minimum range.`);
          setLoading(false);
          return;
        }
        if (isNaN(range.maxRange) || Number(range.maxRange) < Number(range.minRange)) {
          toast.error(`Please enter a valid number for ${cat.replace(/([A-Z])/g, " $1")} maximum range, greater than or equal to minimum range.`);
          setLoading(false);
          return;
        }
      }

      const response = await putAPI(
        `/api/update-group-targeting/${groupTargeting._id}`,
        {
          mainCategoryId,
          categoryId,
          subCategoryId,
          closeMatch: {
            minRange: Number(closeMatch.minRange),
            maxRange: Number(closeMatch.maxRange),
          },
          looseMatch: {
            minRange: Number(looseMatch.minRange),
            maxRange: Number(looseMatch.maxRange),
          },
          substitutes: {
            minRange: Number(substitutes.minRange),
            maxRange: Number(substitutes.maxRange),
          },
          complements: {
            minRange: Number(complements.minRange),
            maxRange: Number(complements.maxRange),
          },
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Group targeting setting updated successfully!");
        await fetchGroupTargetingData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update group targeting setting.");
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
    setMainCategoryId("");
    setCategoryId("");
    setSubCategoryId("");
    setCloseMatch({ minRange: "", maxRange: "" });
    setLooseMatch({ minRange: "", maxRange: "" });
    setSubstitutes({ minRange: "", maxRange: "" });
    setComplements({ minRange: "", maxRange: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Group Targeting Setting</h5>
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
            <form onSubmit={handleUpdate}>
              <div className="row mb-3">
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-3">
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
              <div className="mt-3">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">Min</th>
                      <th scope="col">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["closeMatch", "looseMatch", "substitutes", "complements"].map((category) => (
                      <tr key={category}>
                        <td>{category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={eval(category).minRange}
                            onChange={(e) => handleRangeChange(category, "minRange", e.target.value)}
                            disabled={!subCategoryId}
                            placeholder={subCategoryId ? "Min" : ""}
                            min="0"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={eval(category).maxRange}
                            onChange={(e) => handleRangeChange(category, "maxRange", e.target.value)}
                            disabled={!subCategoryId}
                            placeholder={subCategoryId ? "Max" : ""}
                            min={eval(category).minRange || 0}
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
    </div>
  );
};

export default EditGroupTargetingModal;