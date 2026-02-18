import React, { useState } from "react";
import ConfirmationDialog from "../../../ConfirmationDialog";
import TokenStandardModal from "./UpdateTokenStandard";

function TokenStandardTable({ tokenStandards, setTokenStandards, refreshTokenStandards }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTokenStandardToDelete, setSelectedTokenStandardToDelete] = useState(null);
  const [isTokenStandardModalOpen, setIsTokenStandardModalOpen] = useState(false);
  const [selectedTokenStandard, setSelectedTokenStandard] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedTokenStandardToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setTokenStandards((prevTokenStandards) =>
      prevTokenStandards.filter((tokenStandard) => tokenStandard._id !== id)
    );
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (tokenStandard) => {
    setSelectedTokenStandardToDelete(tokenStandard);
    setIsDeleteDialogOpen(true);
  };

  const openEditModal = (tokenStandard) => {
    setSelectedTokenStandard(tokenStandard);
    setIsTokenStandardModalOpen(true);
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

  const filteredTokenStandards = tokenStandards.filter(tokenStandard =>
    tokenStandard.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTokenStandards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTokenStandards = filteredTokenStandards.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
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
                      <th>Token Standard</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTokenStandards.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      currentTokenStandards.map((tokenStandard, index) => (
                        <tr key={tokenStandard._id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{tokenStandard.name}</td>
                          <td>{new Date(tokenStandard.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(tokenStandard)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mr-2"
                              title="Delete"
                              onClick={() => openDeleteDialog(tokenStandard)}
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
                  Showing {filteredTokenStandards.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * itemsPerPage, filteredTokenStandards.length)} of {filteredTokenStandards.length} entries
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
          deleteType="tokenstandard"
          id={selectedTokenStandardToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
      {isTokenStandardModalOpen && (
        <TokenStandardModal
          onClose={() => setIsTokenStandardModalOpen(false)}
          refreshTokenStandards={refreshTokenStandards}
          selectedTokenStandard={selectedTokenStandard}
        />
      )}
    </>
  );
}

export default TokenStandardTable;