import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import CreatableSelect from 'react-select/creatable';

const AddCategory = ({ onClose, fetchSubCategoryData }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categoryRows, setCategoryRows] = useState([
    { mainCategoryName: "", categoryName: "", subCategoryName: "" },
  ]);
  const [showOtherFields, setShowOtherFields] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getAPI("/api/main-category", true);
        if (!response.hasError) {
          setMainCategories(response.data.data);
        } else {
          toast.error(`Failed to fetch Main Categories: ${response.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while fetching main categories.");
      }
    };
    fetchMainCategories();
  }, []);

  const handleMainCategoryChange = async (index, selectedMainCategoryId, selectedMainCategoryName = null) => {
    const updatedRows = [...categoryRows];

    if (selectedMainCategoryId) {
      updatedRows[index].mainCategoryId = selectedMainCategoryId;
      updatedRows[index].mainCategoryName = "";
      updatedRows[index].categories = [];
      updatedRows[index].categoryId = "";

      try {
        const response = await getAPI(
          `/api/category/${selectedMainCategoryId}`,
          {},
          true
        );
        if (!response.hasError && Array.isArray(response.data.data)) {
          updatedRows[index].categories = response.data.data;
        } else {
          toast.error("Failed to load categories.");
        }
      } catch (err) {
        toast.error("Error fetching categories.");
      }
    } else if (selectedMainCategoryName) {
      updatedRows[index].mainCategoryId = "";
      updatedRows[index].mainCategoryName = selectedMainCategoryName;
      updatedRows[index].categories = [];
      updatedRows[index].categoryId = "";
    }

    setCategoryRows(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...categoryRows];
    updatedRows[index][field] = value;
    setCategoryRows(updatedRows);
  };

  const addRow = () => {
    if (categoryRows.length > 0) {
      const firstRowData = { ...categoryRows[0] };
      firstRowData.subCategoryName = "";
      setCategoryRows([...categoryRows, firstRowData]);
    }
  };

  const removeRow = (index) => {
    const updatedRows = categoryRows.filter((_, i) => i !== index);
    setCategoryRows(updatedRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const row of categoryRows) {
        let subCategoryData = {};

        if (row.mainCategoryId && row.categoryId) {
          subCategoryData = {
            subCategoryName: row.subCategoryName,
            categoryId: row.categoryId,
            mainCategoryId: row.mainCategoryId,
          };
          await postAPI("/api/sub-category", subCategoryData, {}, true);
        } else if (row.mainCategoryId && !row.categoryId) {
          subCategoryData = {
            subCategoryName: row.subCategoryName,
            categoryName: row.categoryName,
            mainCategoryId: row.mainCategoryId,
          };
          await postAPI("/api/sub-category-without-category-id", subCategoryData, {}, true);
        } else if (!row.mainCategoryId && !row.categoryId) {
          subCategoryData = {
            subCategoryName: row.subCategoryName,
            categoryName: row.categoryName,
            mainCategoryName: row.mainCategoryName,
          };
          await postAPI("/api/sub-category-without-ids", subCategoryData, {}, true);
        }
      }
      toast.success("Product Category Created Successfully");
      await fetchSubCategoryData();
      onClose();
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred while processing the request.";
      toast.error(errorMessage);
    }
  };

  const mainCategoryOptions = mainCategories.map(mainCategory => ({
    value: mainCategory._id,
    label: mainCategory.mainCategoryName
  }));

  // Function to generate category options for CreatableSelect
  const getCategoryOptions = (row) => {
    if (row.mainCategoryId && row.categories) {
      return row.categories.map(category => ({
        value: category.id,
        label: category.categoryName
      }));
    }
    return [];
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Product Category</h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {categoryRows.map((row, index) => (
                <div className="row mb-2" key={index}>
                  <div className="col-md-4">
                    {showOtherFields ? (
                      <>
                        <label htmlFor={`mainCategory-${index}`} className="form-label">
                          Main Category
                        </label>
                        <CreatableSelect
                          id={`mainCategory-${index}`}
                          options={mainCategoryOptions}
                          value={
                            row.mainCategoryId
                              ? mainCategoryOptions.find(opt => opt.value === row.mainCategoryId)
                              : row.mainCategoryName
                                ? { value: null, label: row.mainCategoryName }
                                : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              if (selectedOption.__isNew__) {
                                handleMainCategoryChange(index, null, selectedOption.label);
                              } else {
                                handleMainCategoryChange(index, selectedOption.value);
                              }
                            } else {
                              handleMainCategoryChange(index, "");
                            }
                          }}
                          isClearable
                          placeholder="Select or create..."
                          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                          noOptionsMessage={() => "Type to create new main category"}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </>
                    ) : (
                      <>
                        <label htmlFor={`mainCategoryId-${index}`} className="form-label">
                          Main Category
                        </label>
                        <select
                          required
                          className="form-control"
                          id={`mainCategoryId-${index}`}
                          value={row.mainCategoryId || ""}
                          onChange={(e) =>
                            handleMainCategoryChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Main Category</option>
                          {mainCategories.map((mainCategory) => (
                            <option
                              key={mainCategory._id}
                              value={mainCategory._id}
                            >
                              {mainCategory.mainCategoryName}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>

                  <div className="col-md-4">
                    {showOtherFields ? (
                      <>
                        <label htmlFor={`category-${index}`} className="form-label">
                          Category
                        </label>
                        <CreatableSelect
                          id={`category-${index}`}
                          options={getCategoryOptions(row)}
                          value={
                            row.categoryId
                              ? getCategoryOptions(row).find(opt => opt.value === row.categoryId)
                              : row.categoryName
                                ? { value: null, label: row.categoryName }
                                : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              if (selectedOption.__isNew__) {
                                handleRowChange(index, "categoryName", selectedOption.label);
                                handleRowChange(index, "categoryId", "");
                              } else {
                                handleRowChange(index, "categoryId", selectedOption.value);
                                handleRowChange(index, "categoryName", "");
                              }
                            } else {
                              handleRowChange(index, "categoryId", "");
                              handleRowChange(index, "categoryName", "");
                            }
                          }}
                          isClearable
                          placeholder="Select or create..."
                          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                          noOptionsMessage={() => "Type to create new category"}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </>
                    ) : !showOtherFields && row.mainCategoryId && row.categories.length > 0 ? (
                      <>
                        <label htmlFor={`categoryId-${index}`} className="form-label">
                          Category
                        </label>
                        <select
                          required
                          className="form-control"
                          id={`categoryId-${index}`}
                          value={row.categoryId || ""}
                          onChange={(e) =>
                            handleRowChange(index, "categoryId", e.target.value)
                          }
                        >
                          <option value="">Select Category</option>
                          {row.categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <label htmlFor={`categoryName-${index}`} className="form-label">
                          Category
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`categoryName-${index}`}
                          value={row.categoryName}
                          onChange={(e) =>
                            handleRowChange(index, "categoryName", e.target.value)
                          }
                          required
                          placeholder="Enter category name"
                        />
                      </>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label htmlFor={`subCategoryName-${index}`} className="form-label">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`subCategoryName-${index}`}
                      value={row.subCategoryName}
                      onChange={(e) =>
                        handleRowChange(index, "subCategoryName", e.target.value)
                      }
                      required
                      placeholder="Enter sub category"
                    />
                  </div>


                  <div className="col-md-1 d-flex align-items-end">
                    {!showOtherFields && (
                      <>
                        {index === 0 ? (
                          <button
                            type="button"
                            className="btn btn-success btn-md"
                            onClick={addRow}
                          >
                            +
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-danger btn-md"
                            onClick={() => removeRow(index)}
                          >
                            -
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3 mx-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (!showOtherFields) {
                      setCategoryRows([{ mainCategoryName: "", categoryName: "", subCategoryName: "" }]);
                    }
                    setShowOtherFields(!showOtherFields);
                  }}
                >
                  {showOtherFields
                    ? "Use Existing Categories"
                    : "Add Custom Categories"}
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;