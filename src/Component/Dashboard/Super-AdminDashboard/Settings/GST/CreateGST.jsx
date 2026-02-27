import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";

const AddGST = ({ onClose, fetchSubGSTData }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [gstRows, setGSTRows] = useState([
    { mainCategoryId: "", percentage: "" },
  ]);
  const [loading, setLoading] = useState(false);

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

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...gstRows];
    updatedRows[index][field] = field === "percentage" ? (value === "" ? "" : parseFloat(value)) : value;
    setGSTRows(updatedRows);
  };

  const addRow = () => {
    setGSTRows([...gstRows, { mainCategoryId: "", percentage: "" }]);
  };

  const removeRow = (index) => {
    if (gstRows.length > 1) {
      const updatedRows = gstRows.filter((_, i) => i !== index);
      setGSTRows(updatedRows);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validRows = gstRows.filter(
        (row) => row.mainCategoryId && Number.isFinite(row.percentage) && row.percentage >= 0
      );

      if (validRows.length === 0) {
        toast.error("Please provide at least one valid GST setting with a main category and non-negative percentage.");
        setLoading(false);
        return;
      }

      const gstData = validRows.map((row) => ({
        mainCategoryId: row.mainCategoryId,
        percentage: row.percentage,
      }));

      const response = await postAPI("/api/create-gst-setting", gstData, {}, true);
      if (!response.hasError) {
        toast.success("GST setting(s) created successfully.");
        await fetchSubGSTData();
        onClose();
      } else {
        toast.error(`Failed to create GST settings: ${response.message}`);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred while creating the GST settings.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add GST Settings</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {gstRows.map((row, index) => (
                <div className="row mb-2" key={index}>
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
                      {mainCategories.map((mainCategory) => (
                        <option key={mainCategory._id} value={mainCategory._id}>
                          {mainCategory.mainCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor={`percentage-${index}`} className="form-label">
                      Percentage
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`percentage-${index}`}
                      value={row.percentage}
                      onChange={(e) => handleRowChange(index, "percentage", e.target.value)}
                      disabled={!row.mainCategoryId}
                      placeholder={row.mainCategoryId ? "Enter percentage" : "Select main category first"}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    {gstRows.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mr-2"
                        onClick={() => removeRow(index)}
                      >
                        <i className="fa fa-trash-o"></i>
                      </button>
                    )}
                    {index === gstRows.length - 1 && (
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
              ))}
              <div className="d-flex justify-content-end mt-3 mx-2">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add GST Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGST;