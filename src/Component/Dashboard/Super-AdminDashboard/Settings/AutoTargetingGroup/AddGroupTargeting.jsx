import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";

const AddGroupTargeting = ({ onClose, fetchGroupTargetingData }) => {
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });
  const [targetingRows, setTargetingRows] = useState([
    {
      mainCategoryId: "",
      categoryId: "",
      subCategoryId: "",
      closeMatch: { minRange: "", maxRange: "" },
      looseMatch: { minRange: "", maxRange: "" },
      substitutes: { minRange: "", maxRange: "" },
      complements: { minRange: "", maxRange: "" },
    },
  ]);
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

  const handleRowChange = (index, field, value, category = null, rangeType = null) => {
    const updatedRows = [...targetingRows];
    if (category && rangeType) {
      updatedRows[index][category][rangeType] = value === "" ? "" : parseFloat(Number(value).toFixed(2));
    } else {
      updatedRows[index][field] = value;
    }
    setTargetingRows(updatedRows);
  };

  const addRow = () => {
    setTargetingRows([
      ...targetingRows,
      {
        mainCategoryId: "",
        categoryId: "",
        subCategoryId: "",
        closeMatch: { minRange: "", maxRange: "" },
        looseMatch: { minRange: "", maxRange: "" },
        substitutes: { minRange: "", maxRange: "" },
        complements: { minRange: "", maxRange: "" },
      },
    ]);
  };

  const removeRow = (index) => {
    if (targetingRows.length > 1) {
      const updatedRows = targetingRows.filter((_, i) => i !== index);
      setTargetingRows(updatedRows);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validRows = targetingRows.filter((row) => {
        const isValidCategory =
          row.mainCategoryId && row.categoryId && row.subCategoryId;
        const isValidRange = (rangeObj) =>
          !isNaN(rangeObj.minRange) &&
          rangeObj.minRange >= 0 &&
          !isNaN(rangeObj.maxRange) &&
          rangeObj.maxRange >= rangeObj.minRange;
        return (
          isValidCategory &&
          isValidRange(row.closeMatch) &&
          isValidRange(row.looseMatch) &&
          isValidRange(row.substitutes) &&
          isValidRange(row.complements)
        );
      });

      if (validRows.length === 0) {
        toast.error("Please provide at least one valid group targeting entry with all fields filled correctly.");
        setLoading(false);
        return;
      }

      const targetingData = validRows.map((row) => ({
        mainCategoryId: row.mainCategoryId,
        categoryId: row.categoryId,
        subCategoryId: row.subCategoryId,
        closeMatch: {
          minRange: Number(row.closeMatch.minRange),
          maxRange: Number(row.closeMatch.maxRange),
        },
        looseMatch: {
          minRange: Number(row.looseMatch.minRange),
          maxRange: Number(row.looseMatch.maxRange),
        },
        substitutes: {
          minRange: Number(row.substitutes.minRange),
          maxRange: Number(row.substitutes.maxRange),
        },
        complements: {
          minRange: Number(row.complements.minRange),
          maxRange: Number(row.complements.maxRange),
        },
      }));

      const response = await postAPI("/api/create-group-targeting", targetingData, {}, true);
      if (!response.hasError) {
        toast.success("Group targeting setting(s) created successfully.");
        await fetchGroupTargetingData();
        onClose();
      } else {
        toast.error(`Failed to create group targeting settings: ${response.message}`);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred while creating the group targeting settings.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTargetingRows([{
      mainCategoryId: "",
      categoryId: "",
      subCategoryId: "",
      closeMatch: { minRange: "", maxRange: "" },
      looseMatch: { minRange: "", maxRange: "" },
      substitutes: { minRange: "", maxRange: "" },
      complements: { minRange: "", maxRange: "" },
    }]);
    onClose();
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Group Targeting Settings</h5>
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
            <form onSubmit={handleSubmit}>
              {targetingRows.map((row, index) => (
                <div className="mb-4" key={index}>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label htmlFor={`mainCategoryId-${index}`} className="form-label">
                        Main Category
                      </label>
                      <select
                        required
                        className="form-control"
                        id={`mainCategoryId-${index}`}
                        value={row.mainCategoryId}
                        onChange={(e) => handleRowChange(index, "mainCategoryId", e.target.value)}
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
                      <label htmlFor={`categoryId-${index}`} className="form-label">
                        Category
                      </label>
                      <select
                        required
                        className="form-control"
                        id={`categoryId-${index}`}
                        value={row.categoryId}
                        onChange={(e) => handleRowChange(index, "categoryId", e.target.value)}
                        disabled={!row.mainCategoryId}
                      >
                        <option value="">Select Category</option>
                        {categoryData.categories
                          .filter((cat) => cat.mainCategoryId === row.mainCategoryId)
                          .map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor={`subCategoryId-${index}`} className="form-label">
                        Sub Category
                      </label>
                      <select
                        required
                        className="form-control"
                        id={`subCategoryId-${index}`}
                        value={row.subCategoryId}
                        onChange={(e) => handleRowChange(index, "subCategoryId", e.target.value)}
                        disabled={!row.categoryId}
                      >
                        <option value="">Select Sub Category</option>
                        {categoryData.subCategories
                          .filter((subCat) => subCat.categoryId === row.categoryId)
                          .map((subCategory) => (
                            <option key={subCategory.value} value={subCategory.value}>
                              {subCategory.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                      {targetingRows.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm mr-2"
                          onClick={() => removeRow(index)}
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      )}
                      {index === targetingRows.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={addRow}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      )}
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
                                id={`${category}-minRange-${index}`}
                                value={row[category].minRange}
                                onChange={(e) => handleRowChange(index, null, e.target.value, category, "minRange")}
                                disabled={!row.subCategoryId}
                                placeholder={row.subCategoryId ? "Min" : ""}
                                min="0"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                id={`${category}-maxRange-${index}`}
                                value={row[category].maxRange}
                                onChange={(e) => handleRowChange(index, null, e.target.value, category, "maxRange")}
                                disabled={!row.subCategoryId}
                                placeholder={row.subCategoryId ? "Max" : ""}
                                min={row[category].minRange || 0}
                                required
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
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
                  {loading ? "Adding..." : "Add Group Targeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGroupTargeting;