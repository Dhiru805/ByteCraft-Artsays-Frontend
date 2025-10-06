import React, { useState } from "react";
import { toast } from "react-toastify";
import EditKeywordTargetingModal from "./EditKeywordTargetingModal";
import ConfirmationDialog from "../../../ConfirmationDialog";

const KeywordTargetingTable = ({
  setSelectedKeywordTargeting,
  setKeywordTargetings,
  keywordTargetings,
  selectedKeywordTargeting,
  fetchKeywordTargetingData,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedKeywordTargetings = [...keywordTargetings].sort((a, b) => {
    const mainCatCompare = (a.mainCategoryId?.mainCategoryName || "").localeCompare(b.mainCategoryId?.mainCategoryName || "");
    if (mainCatCompare !== 0) return mainCatCompare;
    const catCompare = (a.categoryId?.categoryName || "").localeCompare(b.categoryId?.categoryName || "");
    if (catCompare !== 0) return catCompare;
    const subCatCompare = (a.subCategoryId?.subCategoryName || "").localeCompare(b.subCategoryId?.subCategoryName || "");
    if (subCatCompare !== 0) return subCatCompare;
    return (a.keyword || "").localeCompare(b.keyword || "");
  });

  const filteredKeywordTargetings = sortedKeywordTargetings.filter((targeting) =>
    (targeting.mainCategoryId?.mainCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (targeting.categoryId?.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (targeting.subCategoryId?.subCategoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (targeting.keyword || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKeywordTargetings.length / itemsPerPage);
  const displayedKeywordTargetings = filteredKeywordTargetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteDialog = (targeting) => {
    setSelectedKeywordTargeting(targeting);
    setIsDeleteDialogOpen(true);
    setDeleteType("keywordtargetingsetting");
  };

  const openEditModal = (targeting) => {
    setSelectedKeywordTargeting(targeting);
    setIsEditModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedKeywordTargeting(null);
  };

  const handleDeleteConfirmed = (id) => {
    setKeywordTargetings((prev) => prev.filter((targeting) => targeting._id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedKeywordTargeting(null);
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
                      <th>Keyword</th>
                      <th>Broad Range</th>
                      <th>Phrase Range</th>
                      <th>Exact Range</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedKeywordTargetings.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No keyword targeting settings available
                        </td>
                      </tr>
                    ) : (
                      displayedKeywordTargetings.map((targeting, index) => (
                        <tr key={targeting._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{targeting.mainCategoryId?.mainCategoryName || "N/A"}</td>
                          <td>{targeting.categoryId?.categoryName || "N/A"}</td>
                          <td>{targeting.subCategoryId?.subCategoryName || "N/A"}</td>
                          <td>{targeting.keyword || "N/A"}</td>
                          <td>{targeting.broad?.range ?? "N/A"}</td>
                          <td>{targeting.phrase?.range ?? "N/A"}</td>
                          <td>{targeting.exact?.range ?? "N/A"}</td>
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredKeywordTargetings.length)} of {filteredKeywordTargetings.length} entries
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
          id={selectedKeywordTargeting?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      <EditKeywordTargetingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        keywordTargeting={selectedKeywordTargeting}
        fetchKeywordTargetingData={fetchKeywordTargetingData}
      />
    </>
  );
};

export default KeywordTargetingTable;