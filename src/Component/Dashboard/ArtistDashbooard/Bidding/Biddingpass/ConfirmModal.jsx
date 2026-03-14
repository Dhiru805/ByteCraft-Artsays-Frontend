const ConfirmSwal = ({
  show,
  title = "Are you sure?",
  message = "This action can not be undone. Do you want to continue?",
  confirmText = "Yes",
  cancelText = "No",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null; // 🔥 THIS FIXES IT

  return (
    <div
      className="swal2-container swal2-center swal2-backdrop-show"
      style={{ overflowY: "auto" }}
    >
      <div
        className="swal2-popup swal2-modal swal2-icon-warning swal2-show"
        role="dialog"
        aria-modal="true"
        style={{ display: "grid" }}
      >
        {/* Icon */}
    <div
              className="swal2-icon swal2-warning swal2-icon-show"
              style={{ display: "flex" }}
            >
          <div className="swal2-icon-content">!</div>
        </div>

        {/* Title */}
        <h2 className="swal2-title">{title}</h2>

        {/* Message */}
        <div className="swal2-html-container">{message}</div>

        {/* Actions */}
        <div className="swal2-actions">
          <button
            type="button"
            className="swal2-cancel btn btn-danger mx-4"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="swal2-confirm btn btn-success"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSwal;
