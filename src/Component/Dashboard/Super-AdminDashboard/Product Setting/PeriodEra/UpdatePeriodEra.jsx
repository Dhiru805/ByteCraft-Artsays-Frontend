import React, { useState, useEffect } from "react";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PeriodEraModal = ({ onClose, refreshPeriodEras, selectedPeriodEra }) => {
  const [periodEraName, setPeriodEraName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPeriodEra) {
      setPeriodEraName(selectedPeriodEra.name);
    }
  }, [selectedPeriodEra]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!periodEraName.trim()) {
      toast.error("Period/Era Name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await putAPI(`/api/updateperiodera/${selectedPeriodEra._id}`, {
        name: periodEraName,
      });

      toast.success(response.data.message);
      refreshPeriodEras();
      onClose();
    } catch (error) {
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
            <h5 className="modal-title">Update Period/Era</h5>
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
                {loading ? "Updating..." : "Update Period/Era"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PeriodEraModal;