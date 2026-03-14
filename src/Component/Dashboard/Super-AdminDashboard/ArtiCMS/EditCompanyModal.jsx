// import React, { useState, useEffect } from "react";

// const EditCompanyModal = ({ isOpen, onClose, company, companies, setCompanies }) => {
//   const [companyName, setCompanyName] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Prefill input with existing company info
//   useEffect(() => {
//     if (company && company.info) {
//       setCompanyName(company.info); // use company.info from ArtiCMSTable
//     }
//   }, [company]);

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     if (!companyName.trim()) return;

//     setLoading(true);
//     const updatedCompanies = companies.map((c, index) =>
//       index === company.index ? companyName.trim() : c
//     );
//     setCompanies(updatedCompanies);
//     setLoading(false);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
//       <div className="modal-dialog modal-md">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Edit Company Info</h5>
//             <button
//               className="btn"
//               onClick={onClose}
//               style={{ border: "none", background: "transparent", fontSize: "1.2rem" }}
//             >
//               ✕
//             </button>
//           </div>

//           <form onSubmit={handleUpdate}>
//             <div className="modal-body">
//               <div className="form-group">
//                 <label>Company Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={companyName}
//                   onChange={(e) => setCompanyName(e.target.value)}
//                   placeholder="Enter company info"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" onClick={onClose}>
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary" disabled={loading}>
//                 {loading ? "Updating..." : "Update"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditCompanyModal;
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";

const EditCompanyModal = ({ isOpen, onClose, company, fetchCompanies }) => {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company && company.description) {
      setCompanyName(company.description);
    }
  }, [company]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    try {
      // Correct backend update route
      const response = await putAPI(`/api/company-info/update/${company._id}`, {
        description: companyName.trim(),
      });

      if (!response.hasError) {
        toast.success("Company updated successfully");
        fetchCompanies();
        onClose();
      } else {
        toast.error(response.message || "Failed to update company");
      }
    } catch (error) {
      toast.error("Error updating company");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Company Info</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{ border: "none", background: "transparent", fontSize: "1.2rem" }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="modal-body">
              <div className="form-group">
                <label>Company Info</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company info"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyModal;
