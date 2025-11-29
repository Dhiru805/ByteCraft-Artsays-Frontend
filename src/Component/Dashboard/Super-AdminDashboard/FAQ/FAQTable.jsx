import React, { useState } from "react";
import ConfirmationDialog from "../../ConfirmationDialog";
import EditFAQModal from "./UpdateFAQ";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const FAQTable = ({
  setSelectedSubFAQ,
  setSubFAQs,
  subFAQs,
  selectedSubFAQ,
  fetchSubFAQData,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const sortedSubFAQs = [...subFAQs].sort((a, b) => {
    const faqTypeCompare = (a.faqType || "").localeCompare(b.faqType || "");
    if (faqTypeCompare !== 0) return faqTypeCompare;
    return a.question.localeCompare(b.question);
  });

  const filteredSubFAQs = sortedSubFAQs.filter((faq) =>
    (faq.faqType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubFAQs.length / itemsPerPage);
  const displayedSubFAQs = filteredSubFAQs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteDialog = (faq) => {
    setSelectedSubFAQ(faq);
    setIsDeleteDialogOpen(true);
    setDeleteType("faq");
  };

  const openEditModal = (faq) => {
    setSelectedSubFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSubFAQ(null);
  };

  const handleDeleteConfirmed = (id) => {
    setSubFAQs((prevSubFAQs) =>
      prevSubFAQs.filter((faq) => faq._id !== id)
    );
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // -------------------- IMPORT MODAL COMPONENT --------------------
  const ImportFAQModal = ({ isOpen, onClose, fetchSubFAQData }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    const handleImport = async () => {
      if (!selectedFile) {
        alert("Please select a file before importing.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("http://localhost:3001/api/import-faqs", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to import FAQs");

        const data = await response.json();
        toast.success(data.message || "FAQs imported successfully!");

        await fetchSubFAQData();
        onClose();
      } catch (error) {
        console.error("Error importing FAQ Excel:", error);
        toast.error("Failed to import FAQs. Please check your file and try again.");
      }
    };

    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <div className="p-4">
          <h5 className="mb-3">Import FAQs</h5>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={async () => {
                try {
                  const response = await fetch("http://localhost:3001/api/export-faqs");
                  if (!response.ok) throw new Error("Failed to fetch FAQ Excel file");

                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "FAQ_Data.xlsx";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Error downloading FAQ Excel:", error);
                  alert("Failed to download FAQ data. Please try again.");
                }
              }}
            >
              <i className="fa fa-download mr-2"></i> Download Template
            </button>
          </div>

          <label className="mb-2">Upload your filled Excel file:</label>
          <div className="d-flex align-items-center mb-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="form-control"
            />
            {selectedFile && (
              <span className="ml-3 text-success">
                <i className="fa fa-file-excel-o mr-1"></i>
                {selectedFile.name}
              </span>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button variant="success" onClick={handleImport}>
              Import FAQs
            </Button>
          </div>
        </div>
      </Modal>
    );
  };
  // ----------------------------------------------------------------

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
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

                {/*  Import button */}
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <i className="fa fa-upload mr-1"></i> Import FAQs
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap js-basic-example dataTable table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>FAQ Type</th>
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSubFAQs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No FAQs available
                        </td>
                      </tr>
                    ) : (
                      displayedSubFAQs.map((faq, index) => (
                        <tr key={faq._id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{faq.faqType}</td>
                          <td>{faq.question}</td>
                          <td>{faq.answer}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(faq)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(faq)}
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

              {/* PAGINATION */}
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredSubFAQs.length)}{" "}
                  of {filteredSubFAQs.length} entries
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

      {/*  MODALS SECTION */}
      {isImportModalOpen && (
        <ImportFAQModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          fetchSubFAQData={fetchSubFAQData}
        />
      )}

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedSubFAQ?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {isEditModalOpen && (
        <EditFAQModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          faq={selectedSubFAQ}
          fetchSubFAQData={fetchSubFAQData}
        />
      )}
    </>
  );
};

export default FAQTable;
