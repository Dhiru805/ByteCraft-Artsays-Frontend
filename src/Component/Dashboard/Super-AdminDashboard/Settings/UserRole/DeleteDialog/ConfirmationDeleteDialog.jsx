import React from "react";
import deleteAPI from "../.././../../../../api/deleteAPI";
import { toast } from "react-toastify";

function ConfirmationDialog({ id, onClose, onDeleteSuccess }) {
  const handleDelete = async () => {
    try {
      const res = await deleteAPI(`/api/delete-role/${id}`);
      toast.success(res.message || "Role deleted successfully");
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  return (
    <>
      <>
        <div
          id="confirmation-dialog"
          className="swal2-container swal2-center swal2-backdrop-show"
          style={{ overflowY: "auto" }}
        >
          <div
            aria-labelledby="swal2-title"
            aria-describedby="swal2-html-container"
            className="swal2-popup swal2-modal swal2-icon-warning swal2-show"
            tabIndex={-1}
            role="dialog"
            aria-live="assertive"
            aria-modal="true"
            style={{ display: "grid" }}
          >
            <button
              type="button"
              className="swal2-close"
              aria-label="Close this dialog"
              style={{ display: "none" }}
            >
              ×
            </button>
            <ul className="swal2-progress-steps" style={{ display: "none" }} />
            <div
              className="swal2-icon swal2-warning swal2-icon-show"
              style={{ display: "flex" }}
            >
              <div className="swal2-icon-content">!</div>
            </div>
            <img
              className="swal2-image"
              style={{ display: "none" }}
              alt="Description"
            />

            <h2
              className="swal2-title"
              id="swal2-title"
              style={{ display: "block" }}
            >
              Are you sure?
            </h2>
            <div
              className="swal2-html-container"
              id="swal2-html-container"
              style={{ display: "block" }}
            >
              This action can not be undone. Do you want to continue?
            </div>
            <input className="swal2-input" style={{ display: "none" }} />
            <input
              type="file"
              className="swal2-file"
              style={{ display: "none" }}
            />
            <div className="swal2-range" style={{ display: "none" }}>
              <input type="range" />
              <output />
            </div>
            <select className="swal2-select" style={{ display: "none" }} />
            <div className="swal2-radio" style={{ display: "none" }} />
            <label
              htmlFor="swal2-checkbox"
              className="swal2-checkbox"
              style={{ display: "none" }}
            >
              <input type="checkbox" />
              <span className="swal2-label" />
            </label>
            <textarea
              className="swal2-textarea"
              style={{ display: "none" }}
              defaultValue={""}
            />
            <div
              className="swal2-validation-message"
              id="swal2-validation-message"
              style={{ display: "none" }}
            />
            <div className="swal2-actions" style={{ display: "flex" }}>
              <button
                type="button"
                className="swal2-cancel btn btn-danger mr-2"
                aria-label=""
                style={{ display: "inline-block" }}
                onClick={onClose}
              >
                No
              </button>

              <button
                type="button"
                className="swal2-confirm btn btn-success"
                aria-label=""
                style={{ display: "inline-block" }}
                onClick={() => {
                  handleDelete();
                }}
              >
                Yes
              </button>
              <div className="swal2-loader" />
            </div>
            <div className="swal2-footer" style={{ display: "none" }} />
            <div className="swal2-timer-progress-bar-container">
              <div
                className="swal2-timer-progress-bar"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default ConfirmationDialog;
