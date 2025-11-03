import React, { useEffect } from "react";
import deleteAPI from "../../api/deleteAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DELETE_CONFIG = {
  admin: {
    getEndpoint: (id) => `/auth/users/${id}`,
    successMessage: "Super-Admin successfully deleted!",
    errorMessage: "Failed to delete super-admin.",
    idKey: "AdminId",
  },
    // ... other configs ...
  policy: {
    getEndpoint: (id) => `/api/social-policies/${id}`, // 👈 correct API route
    successMessage: "Policy successfully deleted!",
    errorMessage: "Failed to delete Policy.",
    idKey: "PolicyId",
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
 buyerRequest : {
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
  productRequest :{
    getEndpoint: (id) => `/api/deleteproduct/${id}`,
    successMessage: "Product request successfully deleted!",
    errorMessage: "Failed to delete product request.",
    idKey: "ProductRequestId",
},
product:{
  getEndpoint: (id) => `/api/deleteproductbyid/${id}`,
  successMessage: "Product  successfully deleted!",
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
buyerRequest: {
  getEndpoint: (id) => `/api/delete-buyer-requests/${id}`,
  successMessage: "Buyer request successfully deleted!",
  errorMessage: "Failed to delete buyer request.",
  idKey: "BuyerRequestId",
},

certificationsetting:{
   getEndpoint: (id) => `/api/delete-certification-setting/${id}`,
  successMessage: "Certification setting successfully deleted!",
  errorMessage: "Failed to delete certification setting .",
  idKey: "certificationsettingId",
},
certification: {
    getEndpoint: (id) => `/api/delete-certification/${id}`,
    successMessage: "Certification successfully deleted!",
    errorMessage: "Failed to delete certification.",
    idKey: "CertificationId",
  },

certificateCMS: {
    getEndpoint: (id) => `/api/certificate/delete/${id}`,
    successMessage: "Certification successfully deleted!",
    errorMessage: "Failed to delete certification.",
    idKey: "CertificateCMSId",
  },

  faq : {
  getEndpoint: (id) => `/api/delete-FAQ/${id}`,
  successMessage: "FAQ successfully deleted!",
  errorMessage: "Failed to delete FAQ.",
  idKey: "FAQId",
},

policy : {
  getEndpoint: (id) => `/api/deletePolicy/${id}`,
  successMessage: "Policy successfully deleted!",
  errorMessage: "Failed to delete Policy.",
  idKey: "PolicyId",
},

howtobuy : {
  getEndpoint: (id) => `/api/howtobuy/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "HowToBuyId",
},

howtosell : {
  getEndpoint: (id) => `/api/howtosell/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "HowToSellId",
},

howtoresell : {
  getEndpoint: (id) => `/api/how-to-resell/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "HowToResellId",
},

whyartsays: {
 getEndpoint: (id) => `/api/whyartsays/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "WhyArtSaysId",
},

challenge: {
 getEndpoint: (id) => `/api/deleteChallenge/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "ChallengesId",
},

licensing: {
  getEndpoint: (id) => `/api/licensing/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "LicensingId",
},

commission: {
  getEndpoint: (id) => `/api/commission/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "CommissionId",
},

howtobid: {
  getEndpoint: (id) => `/api/how-to-bid/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "BidId",
},

aboutus: {
  getEndpoint: (id) => `/api/about-us/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
 idKey: "AboutUsId",

},

homepageSection: {
 getEndpoint: (id) => `/api/homepage/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
 idKey: "HomePageId",
},

affiliate: {
  getEndpoint: (id) => `/api/affiliate/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "AffiliateId",
},

affiliatebp: {
   getEndpoint: (id) => `/api/affiliate-bp/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "AffiliatebpId",
},

career: {
  getEndpoint: (id) => `/api/delete-career/${id}`,
  successMessage: "Career successfully deleted!",
  errorMessage: "Failed to delete career.",
  idKey: "careerId",
},
exhibition: {
  getEndpoint: (id) => `/api/delete-exhibition/${id}`,
  successMessage: "Exhibitionsuccessfully deleted!",
  errorMessage: "Failed to delete Exhibition.",
  idKey: "exhibitionId",
},
enquiry: {
  getEndpoint: (id) => `/api/enquiry/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "EnquiryId",
},
artsaysgallery: {
  getEndpoint: (id) => `/api/artsays-gallery/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "ArtsaysGalleryId",
},
cmsartgallery: {
  getEndpoint: (id) => `/api/CMS-artsays-gallery/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "CMSArtsaysGalleryId",
},
contactus:{
  getEndpoint: (id) => `/api/contactus/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
  idKey: "ContactusId",
},

autotargetingsetting:{
  getEndpoint: (id) => `/api/delete-auto-targeting/${id}`,
  successMessage: "Auto Targeting successfully deleted!",
  errorMessage: "Failed to delete auto targeting.",
  idKey: "autotargetingId",
},

homepageSection: {
 getEndpoint: (id) => `/api/homepage/delete/${id}`,
  successMessage: "Successfully deleted!",
  errorMessage: "Failed to delete.",
 idKey: "HomePageId",
},

grouptargetingsetting:{
  getEndpoint: (id) => `/api/delete-group-targeting/${id}`,
  successMessage: "Group Targeting successfully deleted!",
  errorMessage: "Failed to delete group targeting.",
  idKey: "grouptargetingId",
},
keywordtargetingsetting:{
  getEndpoint: (id) => `/api/delete-keyword-targeting/${id}`,
  successMessage: "Keyword Targeting successfully deleted!",
  errorMessage: "Failed to delete keyword targeting.",
  idKey: "keywordtargetingId",
},
campaign: {
  getEndpoint: (id) => `/api/campaigns/${id}`,
  successMessage: "Campaign deleted successfully!",
  errorMessage: "Failed to delete campaign.",
  idKey: "CampaignId",
},
challenge: {
    getEndpoint: (id) => `/api/deleteChallenge/${id}`,
    successMessage: "Challenge successfully deleted!",
    errorMessage: "Failed to delete challenge.",
    idKey: "ChallengeId",
  },

partner: {
    getEndpoint: (id) => `/api/partner/delete/${id}`,
    successMessage: "Partner Page successfully deleted!",
    errorMessage: "Failed to delete Partner Page",
    idKey: "PartnerId",
  },

  insurance: {
    getEndpoint: (id) => `/api/insurance/delete/${id}`,
    successMessage: "Insurance Page successfully deleted!",
    errorMessage: "Failed to delete Insurance Page",
    idKey: "InsuranceId",
  },
materialCard: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-card/delete/${id}`,
  successMessage: "material card successfully deleted!",
  errorMessage: "Failed to delete material card.",
  idKey: "MaterialCardId",
},
materialCapacity: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-capacity/delete/${id}`,
  successMessage: "material capacity successfully deleted!",
  errorMessage: "Failed to delete material capacity.",
  idKey: "MaterialCapacityId",
},
materialName: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-name/delete/${id}`,
  successMessage: "material name successfully deleted!",
  errorMessage: "Failed to delete material name.",
  idKey: "MaterialNameId",
},
materialSize: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-size/delete/${id}`,
  successMessage: "material size successfully deleted!",
  errorMessage: "Failed to delete material size.",
  idKey: "MaterialSizeId",
},
materialStamp: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-stamp/delete/${id}`,
  successMessage: "material stamp successfully deleted!",
  errorMessage: "Failed to delete material stamp.",
  idKey: "MaterialStampId",
},
materialStickers: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-stickers/delete/${id}`,
  successMessage: "material sticker successfully deleted!",
  errorMessage: "Failed to delete material sticker.",
  idKey: "MaterialStickerId",
},
materialVouchers: {
  getEndpoint: (id) => `/api/packaging-material-setting/material-vouchers/delete/${id}`,
  successMessage: "material voucher successfully deleted!",
  errorMessage: "Failed to delete material voucher.",
  idKey: "MaterialVoucherId",
},
packageMaterial: {
  getEndpoint: (id) => `/api/package-material/material/delete/${id}`,
  successMessage: "material successfully deleted!",
  errorMessage: "Failed to delete material.",
  idKey: "MaterialId",
},
sellerOrder: {
  getEndpoint: (id) => `/api/package-material/seller/order/delete/${id}`,
  successMessage: "order successfully deleted!",
  errorMessage: "Failed to delete order.",
  idKey: "OrderId",
},
artistOrder: {
  getEndpoint: (id) => `/api/package-material/order/delete/${id}`,
  successMessage: "order successfully deleted!",
  errorMessage: "Failed to delete order.",
  idKey: "OrderId",
}
};

function ConfirmationDialog({ onClose, deleteType, id, onDeleted }) {
  const handleDelete = async () => {
    const config = DELETE_CONFIG[deleteType];

    if (!config) {
      console.error("Invalid delete type.");
      toast.error("Invalid delete type.");
      return;
    }

    const endpoint = config.getEndpoint(id);
    if (!id) {
      console.error(`${config.idKey} is missing.`);
      toast.error(`${config.idKey} is required.`);
      return;
    }

    try {
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
      }
    } catch (error) {
      console.error(`Error while deleting ${deleteType}:`, error);
      toast.error(`An error occurred while deleting the ${deleteType}.`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("confirmation-dialog");
      const modalContent = document.querySelector(".swal2-popup");

      if (modalElement && !modalContent.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
