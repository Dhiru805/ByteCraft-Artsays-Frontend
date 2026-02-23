import React, { useState } from "react";
import ConfirmationDialog from "../../../ConfirmationDialog";
import EditAutoTargetingModal from "./UpdateDefaultAutoTargeting";
import axios from "axios";
import { toast } from "react-toastify";

const AutoTargetingTable = ({
  setSelectedAutoTargeting,
  setAutoTargetings,
  autoTargetings,
  selectedAutoTargeting,
  fetchAutoTargetingData,
  showImportModal,
  setShowImportModal,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleDownloadTemplate = () => {
    window.open("/api/export-auto-targeting-template", "_blank");
  };

  const handleImport = async () => {
    if (!importFile) return toast.error("Please select a file first");
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      const res = await axios.post("/api/import-auto-targeting", formData);
      toast.success(res.data.message || "Imported successfully");
      if (res.data.errors?.length) {
        res.data.errors.forEach((e) => toast.warn(e));
      }
      setShowImportModal(false);
      setImportFile(null);
      fetchAutoTargetingData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const sortedAutoTargetings = [...autoTargetings].sort((a, b) => {
    const mainCatCompare = (a.mainCategoryId?.mainCategoryName || "").localeCompare(b.mainCategoryId?.mainCategoryName || "");
    if (mainCatCompare !== 0) return mainCatCompare;
    const catCompare = (a.categoryId?.categoryName || "").localeCompare(b.categoryId?.categoryName || "");
    if (catCompare !== 0) return catCompare;
    return (a.subCategoryId?.subCategoryName || "").localeCompare(b.subCategoryId?.subCategoryName || "");
  });

  const filteredAutoTargetings = sortedAutoTargetings.filter((targeting) =>
    (targeting.mainCategoryId?.mainCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (targeting.categoryId?.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (targeting.subCategoryId?.subCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAutoTargetings.length / itemsPerPage);
  const displayedAutoTargetings = filteredAutoTargetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteDialog = (targeting) => {
    setSelectedAutoTargeting(targeting);
    setIsDeleteDialogOpen(true);
    setDeleteType("autotargetingsetting");
  };

  const openEditModal = (targeting) => {
    setSelectedAutoTargeting(targeting);
    setIsEditModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAutoTargeting(null);
  };

  const handleDeleteConfirmed = (id) => {
    setAutoTargetings((prev) => prev.filter((targeting) => targeting._id !== id));
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

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
                  style={{ minWidth: '70px' }}
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
                <div className="input-group" style={{ maxWidth: '150px' }}>
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
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  ></i>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm ml-2"
                  onClick={() => setShowImportModal(true)}
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
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>Min Range</th>
                      <th>Max Range</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedAutoTargetings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No auto-targeting settings available
                        </td>
                      </tr>
                    ) : (
                      displayedAutoTargetings.map((targeting, index) => (
                        <tr key={targeting._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{targeting.mainCategoryId?.mainCategoryName || "N/A"}</td>
                          <td>{targeting.categoryId?.categoryName || "N/A"}</td>
                          <td>{targeting.subCategoryId?.subCategoryName || "N/A"}</td>
                          <td>{targeting.minRange}</td>
                          <td>{targeting.maxRange}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(targeting)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(targeting)}
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
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAutoTargetings.length)} of {filteredAutoTargetings.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter((pageNumber) => pageNumber === currentPage)
                    .map((pageNumber, index, array) => {
                      const prevPage = array[index - 1];
                      if (prevPage && pageNumber - prevPage > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${pageNumber}`}>
                            <li className="page-item disabled"><span className="page-link">...</span></li>
                            <li
                              key={pageNumber}
                              className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              <button className="page-link">{pageNumber}</button>
                            </li>
                          </React.Fragment>
                        );
                      }
                      return (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <button className="page-link">{pageNumber}</button>
                        </li>
                      );
                    })}
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
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

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedAutoTargeting?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      <EditAutoTargetingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        autoTargeting={selectedAutoTargeting}
        fetchAutoTargetingData={fetchAutoTargetingData}
      />

      {showImportModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Import Auto Targeting</h5>
                <button type="button" className="close" onClick={() => { setShowImportModal(false); setImportFile(null); }}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <button className="btn btn-outline-primary btn-sm" onClick={handleDownloadTemplate}>
                    <i className="fa fa-download mr-1"></i> Download Template
                  </button>
                  <small className="d-block mt-1 text-muted">
                    Columns: Main Category, Category, Sub Category, Min Range, Max Range
                  </small>
                </div>
                <div className="form-group">
                  <label>Select Excel File (.xlsx)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".xlsx"
                    onChange={(e) => setImportFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => { setShowImportModal(false); setImportFile(null); }}>Cancel</button>
                <button className="btn btn-success btn-sm" onClick={handleImport} disabled={importing}>
                  {importing ? "Importing..." : "Import"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoTargetingTable;