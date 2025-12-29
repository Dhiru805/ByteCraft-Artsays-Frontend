
import React, { useState } from "react";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";

const AddCompanyModal = ({ onClose, fetchCompanies }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // Correct route for ADD
      const response = await postAPI("/api/company-info/add", { description: input.trim() });

      if (!response.hasError) {
        toast.success("Company added successfully");
        fetchCompanies(); // Refresh table
        setInput("");
        onClose();
      } else {
        toast.error(response.message || "Failed to add company");
      }
    } catch (error) {
      toast.error("Error adding company");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Company Info</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label>Company Info</label>
              <input
                type="text"
                className="form-control"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter company info"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="button" className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
