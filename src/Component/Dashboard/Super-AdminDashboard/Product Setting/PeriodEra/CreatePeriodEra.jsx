import React, { useState } from "react";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePeriodEraModal = ({ onClose, refreshPeriodEras }) => {
  const [periodEraName, setPeriodEraName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!periodEraName.trim()) {
      toast.error("Period/Era Name is required");
      return;
    }

    const payload = {
      name: periodEraName,
    };

    setLoading(true);

    try {
      const response = await postAPI("/api/createperiodera", payload, {}, true);
      toast.success(response.message);
      refreshPeriodEras();
      onClose();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal"
      style={{
        display: "block",
        paddingLeft: "0px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1040,
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Period/Era</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              &#x2715;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="periodEraName" className="form-label">
                  Period/Era Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="periodEraName"
                  name="periodEraName"
                  value={periodEraName}
                  onChange={(e) => setPeriodEraName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Period/Era"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePeriodEraModal;