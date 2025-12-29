// import React from "react";

// const PolicyConfirmationDialog = ({ onClose, id, onDeleted }) => {
//   return (
//     <div
//       className="modal show d-block flex align-items-center justify-content-center"
//       style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered"> {/* Centered vertically */}
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Confirm Delete</h5>
//             <button type="button" className="close" onClick={onClose}>
//               <span>&times;</span>
//             </button>
//           </div>
//           <div className="modal-body">
//             <p>Are you sure you want to delete this policy?</p>
//           </div>
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="btn btn-danger"
//               onClick={() => onDeleted(id)}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PolicyConfirmationDialog;
// PolicyConfirmationDialog.jsx
import React from "react";
import deleteAPI from "../../api/deleteAPI"; // make sure the path is correct
import { toast } from "react-toastify";

const PolicyConfirmationDialog = ({ onClose, id, onDeleted }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteAPI(`/api/deletePolicy/${id}`, true); // include token if needed
      if (!response.data.hasError) {
        toast.success("Policy deleted successfully!");
        onDeleted(id); // remove it from frontend state
        onClose(); // close modal
      } else {
        toast.error(`Failed to delete Policy: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast.error("An error occurred while deleting the policy.");
    }
  };

  return (
    <div
      className="modal show d-block flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this policy?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyConfirmationDialog;
