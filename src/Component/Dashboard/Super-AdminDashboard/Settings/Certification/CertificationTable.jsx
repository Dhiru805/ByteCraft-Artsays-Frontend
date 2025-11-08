// import React, { useState } from "react";
// import ConfirmationDialog from "../../../ConfirmationDialog";
// import EditCertificationModal from "./Updatecertification";

// const CertificationTable = ({
//   setSelectedSubCertification,
//   setSubCertifications,
//   subCertifications,
//   selectedSubCertification,
//   fetchSubCertificationData,
// }) => {
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [deleteType, setDeleteType] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const sortedSubCertifications = [...subCertifications].sort((a, b) => {
//     const mainCatCompare = (a.mainCategoryId?.mainCategoryName || "").localeCompare(b.mainCategoryId?.mainCategoryName || "");
//     if (mainCatCompare !== 0) return mainCatCompare;
//     return a.certificationName.localeCompare(b.certificationName);
//   });

//   const filteredSubCertifications = sortedSubCertifications.filter(certification =>
//     (certification.mainCategoryId?.mainCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//     certification.certificationName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredSubCertifications.length / itemsPerPage);
//   const displayedSubCertifications = filteredSubCertifications.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const openDeleteDialog = (certification) => {
//     setSelectedSubCertification(certification);
//     setIsDeleteDialogOpen(true);
//     setDeleteType("certificationsetting");
//   };

//   const openEditModal = (certification) => {
//     setSelectedSubCertification(certification);
//     setIsEditModalOpen(true);
//   };

//   const handleDeleteCancel = () => {
//     setIsDeleteDialogOpen(false);
//     setSelectedSubCertification(null);
//   };

//   const handleDeleteConfirmed = (id) => {
//     setSubCertifications((prevSubCertifications) =>
//       prevSubCertifications.filter((certification) => certification._id !== id)
//     );
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handleItemsPerPageChange = (event) => {
//     setItemsPerPage(Number(event.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <>
//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
//               <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//                 <label className="mb-0 mr-2">Show</label>
//                 <select
//                   name="DataTables_Table_0_length"
//                   aria-controls="DataTables_Table_0"
//                   className="form-control form-control-sm"
//                   value={itemsPerPage}
//                   onChange={handleItemsPerPageChange}
//                   style={{ minWidth: '70px' }}
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//                 <label className="mb-0 ml-2">entries</label>
//               </div>
//               <div className="w-100 w-md-auto d-flex justify-content-end">
//                 <div className="input-group" style={{ maxWidth: '150px' }}>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     placeholder="Search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <i
//                     className="fa fa-search"
//                     style={{
//                       position: 'absolute',
//                       right: '10px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       pointerEvents: 'none',
//                     }}
//                   ></i>
//                 </div>

//                 {/* Import Button */}
//                 <button
//                   type="button"
//                   className="btn btn-outline-success btn-sm ml-2"
//                   // onClick={() => setIsImportModalOpen(true)}
//                 >
//                   <i className="fa fa-upload mr-1"></i> Import
//                 </button>
//               </div>
//             </div>
//             <div className="body">
//               <div className="table-responsive">
//                 <table className="table table-hover text-nowrap js-basic-example dataTable table-custom m-b-0 c_list">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th>#</th>
//                       <th>Main Category</th>
//                       <th>Certification Name</th>
//                       <th>Estimated Days</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedSubCertifications.length === 0 ? (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No certifications available
//                         </td>
//                       </tr>
//                     ) : (
//                       displayedSubCertifications.map((certification, index) => (
//                         <tr key={certification._id}>
//                           <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                           <td>{certification.mainCategoryId?.mainCategoryName || "N/A"}</td>
//                           <td>{certification.certificationName}</td>
//                           <td>{certification.estimatedDays}</td>
//                           <td>
//                             <button
//                               type="button"
//                               className="btn btn-outline-info btn-sm mr-2"
//                               title="Edit"
//                               onClick={() => openEditModal(certification)}
//                             >
//                               <i className="fa fa-pencil"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn btn-outline-danger btn-sm mr-2"
//                               title="Delete"
//                               onClick={() => openDeleteDialog(certification)}
//                             >
//                               <i className="fa fa-trash-o"></i>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="pagination d-flex justify-content-between mt-4">
//                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubCertifications.length)} of {filteredSubCertifications.length} entries
//                 </span>
//                 <ul className="pagination d-flex justify-content-end w-100">
//                   <li
//                     className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
//                     onClick={handlePrevious}
//                   >
//                     <button className="page-link">Previous</button>
//                   </li>
//                   {Array.from({ length: totalPages }, (_, index) => index + 1)
//                     .filter((pageNumber) => pageNumber === currentPage)
//                     .map((pageNumber, index, array) => {
//                       const prevPage = array[index - 1];
//                       if (prevPage && pageNumber - prevPage > 1) {
//                         return (
//                           <React.Fragment key={`ellipsis-${pageNumber}`}>
//                             <li className="page-item disabled"><span className="page-link">...</span></li>
//                             <li
//                               key={pageNumber}
//                               className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                               onClick={() => setCurrentPage(pageNumber)}
//                             >
//                               <button className="page-link">{pageNumber}</button>
//                             </li>
//                           </React.Fragment>
//                         );
//                       }
//                       return (
//                         <li
//                           key={pageNumber}
//                           className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                           onClick={() => setCurrentPage(pageNumber)}
//                         >
//                           <button className="page-link">{pageNumber}</button>
//                         </li>
//                       );
//                     })}
//                   <li
//                     className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
//                     onClick={handleNext}
//                   >
//                     <button className="page-link">Next</button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isDeleteDialogOpen && (
//         <ConfirmationDialog
//           onClose={handleDeleteCancel}
//           deleteType={deleteType}
//           id={selectedSubCertification?._id}
//           onDeleted={handleDeleteConfirmed}
//         />
//       )}

//       <EditCertificationModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         certification={selectedSubCertification}
//         fetchSubCertificationData={fetchSubCertificationData}
//       />
//     </>
//   );
// };

// export default CertificationTable;


import React, { useState } from "react";
import ConfirmationDialog from "../../../ConfirmationDialog";
import EditCertificationModal from "./Updatecertification";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const CertificationTable = ({
  setSelectedSubCertification,
  setSubCertifications,
  subCertifications,
  selectedSubCertification,
  fetchSubCertificationData,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const sortedSubCertifications = [...subCertifications].sort((a, b) => {
    const mainCatCompare = (a.mainCategoryId?.mainCategoryName || "").localeCompare(
      b.mainCategoryId?.mainCategoryName || ""
    );
    if (mainCatCompare !== 0) return mainCatCompare;
    return a.certificationName.localeCompare(b.certificationName);
  });

  const filteredSubCertifications = sortedSubCertifications.filter((certification) =>
    (certification.mainCategoryId?.mainCategoryName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    certification.certificationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubCertifications.length / itemsPerPage);
  const displayedSubCertifications = filteredSubCertifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteDialog = (certification) => {
    setSelectedSubCertification(certification);
    setIsDeleteDialogOpen(true);
    setDeleteType("certificationsetting");
  };

  const openEditModal = (certification) => {
    setSelectedSubCertification(certification);
    setIsEditModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSubCertification(null);
  };

  const handleDeleteConfirmed = (id) => {
    setSubCertifications((prev) =>
      prev.filter((certification) => certification._id !== id)
    );
  };

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // ===== IMPORT HANDLERS =====
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleImport = async () => {
    if (!file) {
      toast.error("Please choose a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/api/import-certifications", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "File imported successfully!");
        setIsImportModalOpen(false);
        fetchSubCertificationData();
      } else {
        toast.error(result.message || "Failed to import file.");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("An error occurred while importing.");
    }
  };

  // ====== RENDER ======
  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{ minWidth: "70px" }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>

              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "150px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i
                    className="fa fa-search"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  ></i>
                </div>

                {/*  Import Button */}
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <i className="fa fa-upload mr-1"></i> Import
                </button>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap js-basic-example dataTable table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Main Category</th>
                      <th>Certification Name</th>
                      <th>Estimated Days</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSubCertifications.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No certifications available
                        </td>
                      </tr>
                    ) : (
                      displayedSubCertifications.map((certification, index) => (
                        <tr key={certification._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{certification.mainCategoryId?.mainCategoryName || "N/A"}</td>
                          <td>{certification.certificationName}</td>
                          <td>{certification.estimatedDays}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(certification)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(certification)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredSubCertifications.length)} of{" "}
                  {filteredSubCertifications.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                    onClick={handleNext}
                  >
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedSubCertification?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {/* Edit Modal */}
      <EditCertificationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        certification={selectedSubCertification}
        fetchSubCertificationData={fetchSubCertificationData}
      />

      {/*  Import Modal */}
      <Modal show={isImportModalOpen} onHide={() => setIsImportModalOpen(false)} centered>
        <div className="p-4">
          <h5 className="mb-3">Import Certifications</h5>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={async () => {
                try {
                  const response = await fetch(
                    "http://localhost:3001/api/export-certification-template",
                    { method: "GET" }
                  );

                  if (!response.ok) throw new Error("Failed to fetch template");

                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Certification_Template.xlsx";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Error downloading template:", error);
                  alert("Failed to download template. Please try again.");
                }
              }}
            >
              <i className="fa fa-download mr-2"></i> Download Template
            </button>
          </div>

          <label className="mb-2">Upload your filled Excel file:</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="form-control mb-3"
          />

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button variant="success" onClick={handleImport}>
              Import
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CertificationTable;
