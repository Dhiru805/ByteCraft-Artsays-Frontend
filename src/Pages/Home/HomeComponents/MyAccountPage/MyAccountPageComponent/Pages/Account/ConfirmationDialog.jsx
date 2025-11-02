import React, { useEffect } from "react";
import deleteAPI from "../../../../../../../api/deleteAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DELETE_CONFIG = {
  admin: {
    getEndpoint: (id) => `/auth/users/${id}`,
    successMessage: "Super-Admin successfully deleted!",
    errorMessage: "Failed to delete super-admin.",
    idKey: "AdminId",
  },
  blog: {
    getEndpoint: (id) => `/Blog-Post/${id}`,
    successMessage: "Blog successfully deleted!",
    errorMessage: "Failed to delete Blog.",
    idKey: "BlogId",
  },
  artist: {
    getEndpoint: (id) => `/auth/users/${id}`,
    successMessage: "Artist successfully deleted!",
    errorMessage: "Failed to delete Artist.",
    idKey: "ArtistId",
  },
  buyer: {
    getEndpoint: (id) => `/auth/users/${id}`,
    successMessage: "Buyer successfully deleted!",
    errorMessage: "Failed to delete Buyer.",
    idKey: "BuyerId",
  },
  buyerRequest: {
    getEndpoint: (id) => `/api/delete-buyer-requests/${id}`,
    successMessage: "Buyer request successfully deleted!",
    errorMessage: "Failed to delete buyer request.",
    idKey: "BuyerRequestId",
  },
  seller: {
    getEndpoint: (id) => `/api/Delete-seller/${id}`,
    successMessage: "Seller successfully deleted!",
    errorMessage: "Failed to delete Seller.",
    idKey: "SellerId",
  },
  productRequest: {
    getEndpoint: (id) => `/api/deleteproduct/${id}`,
    successMessage: "Product request successfully deleted!",
    errorMessage: "Failed to delete product request.",
    idKey: "ProductRequestId",
  },
  product: {
    getEndpoint: (id) => `/api/deleteproductbyid/${id}`,
    successMessage: "Product successfully deleted!",
    errorMessage: "Failed to delete product.",
    idKey: "ProductRequestId",
  },
  subCategory: {
    getEndpoint: (id) => `/api/sub-category/${id}`,
    successMessage: "Product Category successfully deleted!",
    errorMessage: "Failed to delete Product Category.",
    idKey: "ProductCategoryId",
  },
  blogcategory: {
    getEndpoint: (id) => `/api/deleteblogcategory/${id}`,
    successMessage: "Blog Category successfully deleted!",
    errorMessage: "Failed to delete Blog Category.",
    idKey: "BlogCategoryId",
  },
  address: {
    getEndpoint: (id) => null, // No direct endpoint; deletion handled by parent component
    successMessage: "Address successfully deleted!",
    errorMessage: "Failed to delete address.",
    idKey: "AddressIndex",
  },
};

function ConfirmationDialog({ onClose, deleteType, id, onDeleted }) {
  const handleDelete = async () => {
    const config = DELETE_CONFIG[deleteType];

    if (!config) {
      console.error("Invalid delete type:", deleteType);
      toast.error("Invalid delete type.");
      onClose();
      return;
    }

    if (id === null || id === undefined) {
      console.error(`${config.idKey} is missing.`);
      toast.error(`${config.idKey} is required.`);
      onClose();
      return;
    }

    try {
      if (deleteType === "address") {
        // For address, skip API call and directly call onDeleted
        if (typeof onDeleted === "function") {
          onDeleted(id);
        }
        toast.success(config.successMessage);
        onClose();
      } else {
        const endpoint = config.getEndpoint(id);
        const response = await deleteAPI(endpoint, {}, true);

        if (!response.hasError) {
          console.log(`${deleteType} deleted successfully`, response.data);
          toast.success(config.successMessage);

          if (typeof onDeleted === "function") {
            onDeleted(id);
          }

          onClose();
        } else {
          console.error(config.errorMessage, response.message);
          toast.error(`${config.errorMessage}: ${response.message}`);
          onClose();
        }
      }
    } catch (error) {
      console.error(`Error while deleting ${deleteType}:`, error);
      toast.error(`An error occurred while deleting the ${deleteType}.`);
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("confirmation-dialog");
      const modalContent = document.querySelector(".swal2-popup");

      if (modalElement && modalContent && !modalContent.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
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
        <img className="swal2-image" style={{ display: "none" }} alt="Description" />
        <h2 className="swal2-title" id="swal2-title" style={{ display: "block" }}>
          Are you sure?
        </h2>
        <div
          className="swal2-html-container"
          id="swal2-html-container"
          style={{ display: "block" }}
        >
          This action cannot be undone. Do you want to continue?
        </div>
        <input className="swal2-input" style={{ display: "none" }} />
        <input type="file" className="swal2-file" style={{ display: "none" }} />
        <div className="swal2-range" style={{ display: "none" }}>
          <input type="range" />
          <output />
        </div>
        <select className="swal2-select" style={{ display: "none" }} />
        <div className="swal2-radio" style={{ display: "none" }} />
        <label htmlFor="swal2-checkbox" className="swal2-checkbox" style={{ display: "none" }}>
          <input type="checkbox" />
          <span className="swal2-label" />
        </label>
        <textarea className="swal2-textarea" style={{ display: "none" }} defaultValue={""} />
        <div className="swal2-validation-message" id="swal2-validation-message" style={{ display: "none" }} />
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
            onClick={handleDelete}
          >
            Yes
          </button>
          <div className="swal2-loader" />
        </div>
        <div className="swal2-footer" style={{ display: "none" }} />
        <div className="swal2-timer-progress-bar-container">
          <div className="swal2-timer-progress-bar" style={{ display: "none" }} />
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;