import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";

const AddCertification = ({ onClose, fetchSubCertificationData }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [certificationRows, setCertificationRows] = useState([
    { mainCategoryId: "", certificationName: "", estimatedDays: "" },
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
    const updatedRows = [...certificationRows];
    updatedRows[index][field] = field === "estimatedDays" ? (value === "" ? "" : parseInt(value)) : value;
    setCertificationRows(updatedRows);
  };

  const addRow = () => {
    setCertificationRows([...certificationRows, { mainCategoryId: "", certificationName: "", estimatedDays: "" }]);
  };

  const removeRow = (index) => {
    if (certificationRows.length > 1) {
      const updatedRows = certificationRows.filter((_, i) => i !== index);
      setCertificationRows(updatedRows);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validRows = certificationRows.filter(
        (row) => row.mainCategoryId && row.certificationName.trim() && Number.isInteger(row.estimatedDays) && row.estimatedDays > 0
      );

      if (validRows.length === 0) {
        toast.error("Please provide at least one valid certification with a main category, name, and positive estimated days.");
        setLoading(false);
        return;
      }

      const certificationData = validRows.map((row) => ({
        certificationName: row.certificationName.trim(),
        mainCategoryId: row.mainCategoryId,
        estimatedDays: row.estimatedDays,
      }));

      const response = await postAPI("/api/create-certification-setting", certificationData, {}, true);
      if (!response.hasError) {
        toast.success("Certification(s) created successfully.");
        await fetchSubCertificationData();
        onClose();
      } else {
        toast.error(`Failed to create certifications: ${response.message}`);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred while creating the certifications.";
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
            <h5 className="modal-title">Add Certifications</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {certificationRows.map((row, index) => (
                <div className="row mb-2" key={index}>
                  <div className="col-md-4">
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
                    <label htmlFor={`certificationName-${index}`} className="form-label">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`certificationName-${index}`}
                      value={row.certificationName}
                      onChange={(e) => handleRowChange(index, "certificationName", e.target.value)}
                      disabled={!row.mainCategoryId}
                      placeholder={row.mainCategoryId ? "Enter certification name" : "Select main category first"}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor={`estimatedDays-${index}`} className="form-label">
                      Estimated Days
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`estimatedDays-${index}`}
                      value={row.estimatedDays}
                      onChange={(e) => handleRowChange(index, "estimatedDays", e.target.value)}
                      disabled={!row.mainCategoryId}
                      placeholder={row.mainCategoryId ? "Enter days" : ""}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    {certificationRows.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mr-2"
                        onClick={() => removeRow(index)}
                      >
                        <i className="fa fa-trash-o"></i>
                      </button>
                    )}
                    {index === certificationRows.length - 1 && (
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
                  {loading ? "Adding..." : "Add Certifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCertification;