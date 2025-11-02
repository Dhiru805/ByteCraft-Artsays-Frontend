import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";

const AddInsuranceSetting = ({ onClose, fetchInsuranceSettingData }) => {
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
  });
  const [insuranceRows, setInsuranceRows] = useState([
    {
      mainCategoryId: "",
      insuranceName: "",
      oneYear: { percentage: "", gst: "" },
      lifeTime: { percentage: "", gst: "" },
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

          categoryItems.forEach((item) => {
            if (item.mainCategoryId && !mainCategoriesMap.has(item.mainCategoryId)) {
              mainCategoriesMap.set(item.mainCategoryId, {
                value: item.mainCategoryId,
                label: item.mainCategoryName,
              });
            }
          });

          setCategoryData({
            mainCategories: Array.from(mainCategoriesMap.values()),
          });
        } else {
          toast.warn("No main categories found.");
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to load category data.");
      }
    };
    fetchCategoryData();
  }, []);

  const handleRowChange = (index, field, value, option = null) => {
    const updatedRows = [...insuranceRows];
    if (option) {
      updatedRows[index][option][field] = value === "" ? "" : parseFloat(Number(value).toFixed(2));
    } else {
      updatedRows[index][field] = value;
    }
    setInsuranceRows(updatedRows);
  };

  const addRow = () => {
    setInsuranceRows([
      ...insuranceRows,
      {
        mainCategoryId: "",
        insuranceName: "",
        oneYear: { percentage: "", gst: "" },
        lifeTime: { percentage: "", gst: "" },
      },
    ]);
  };

  const removeRow = (index) => {
    if (insuranceRows.length > 1) {
      const updatedRows = insuranceRows.filter((_, i) => i !== index);
      setInsuranceRows(updatedRows);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const validRows = insuranceRows.filter((row) => {
        const isValidCategory = row.mainCategoryId && row.insuranceName;
        const isValidOption = (optionObj) =>
          !isNaN(optionObj.percentage) &&
          optionObj.percentage >= 0 &&
          !isNaN(optionObj.gst) &&
          optionObj.gst >= 0;
        return (
          isValidCategory &&
          isValidOption(row.oneYear) &&
          isValidOption(row.lifeTime)
        );
      });

      if (validRows.length === 0) {
        toast.error("Please provide at least one valid insurance setting entry with all fields filled correctly.");
        setLoading(false);
        return;
      }

      const insuranceData = validRows.map((row) => ({
        mainCategoryId: row.mainCategoryId,
        insuranceName: row.insuranceName,
        oneYear: {
          percentage: Number(row.oneYear.percentage),
          gst: Number(row.oneYear.gst),
        },
        lifeTime: {
          percentage: Number(row.lifeTime.percentage),
          gst: Number(row.lifeTime.gst),
        },
      }));

      const response = await postAPI("/api/create-insurance-setting", insuranceData, {}, true);
      if (!response.hasError) {
        toast.success("Insurance setting(s) created successfully.");
        await fetchInsuranceSettingData();
        onClose();
      } else {
        toast.error(`Failed to create insurance settings: ${response.message}`);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred while creating the insurance settings.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInsuranceRows([
      {
        mainCategoryId: "",
        insuranceName: "",
        oneYear: { percentage: "", gst: "" },
        lifeTime: { percentage: "", gst: "" },
      },
    ]);
    onClose();
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Insurance Settings</h5>
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
              {insuranceRows.map((row, index) => (
                <div className="mb-4" key={index}>
                  <div className="row mb-3">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <label htmlFor={`insuranceName-${index}`} className="form-label">
                        Insurance Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`insuranceName-${index}`}
                        value={row.insuranceName}
                        onChange={(e) => handleRowChange(index, "insuranceName", e.target.value)}
                        disabled={!row.mainCategoryId}
                        placeholder={row.mainCategoryId ? "Enter Insurance Name" : ""}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 d-flex align-items-end">
                      {insuranceRows.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm mr-2"
                          onClick={() => removeRow(index)}
                        >
                          <i className="fa fa-trash-o"></i>
                        </button>
                      )}
                      {index === insuranceRows.length - 1 && (
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
                          <th scope="col">Insurance Option</th>
                          <th scope="col">Percentage</th>
                          <th scope="col">GST (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["oneYear", "lifeTime"].map((option) => (
                          <tr key={option}>
                            <td>{option === "oneYear" ? "1 Year" : "Life Time"}</td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                id={`${option}-percentage-${index}`}
                                value={row[option].percentage}
                                onChange={(e) => handleRowChange(index, "percentage", e.target.value, option)}
                                disabled={!row.mainCategoryId || !row.insuranceName}
                                placeholder={row.mainCategoryId && row.insuranceName ? "Percentage" : ""}
                                min="0"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                id={`${option}-gst-${index}`}
                                value={row[option].gst}
                                onChange={(e) => handleRowChange(index, "gst", e.target.value, option)}
                                disabled={!row.mainCategoryId || !row.insuranceName}
                                placeholder={row.mainCategoryId && row.insuranceName ? "GST (%)" : ""}
                                min="0"
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
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Insurance Setting"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInsuranceSetting;