import React, { useState } from "react";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../ConfirmationDialog";
import EditExhibitionPlan from "./Editexhibition";

const ExhibitionTable = ({
  plans,
  setPlans,
  selectedPlan,
  setSelectedPlan,
  fetchExhibitionPlans,
  setShowAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.planType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleDeleteConfirmed = (id) => {
    setPlans((prev) => prev.filter((p) => p._id !== id));
    setDeleteDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
              {}
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

              {}
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search by name or type..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap table-custom m-b-0">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Plan Name</th>
                      <th>Plan Type</th>
                      <th>Price (₹)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlans.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No exhibition plans found
                        </td>
                      </tr>
                    ) : (
                      currentPlans.map((plan, index) => (
                        <tr key={plan._id}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{plan.planName || "—"}</td>
                          <td>{plan.planType || "—"}</td>
                          <td>
                            ₹{" "}
                            {Number(plan.price || 0).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                plan.isActive ? "badge-success" : "badge-danger"
                              }`}
                            >
                              {plan.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => openEditModal(plan)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(plan)}
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

              {}
              {filteredPlans.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                  <div className="text-muted">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredPlans.length)} of{" "}
                    {filteredPlans.length} entries
                  </div>

                  <ul className="pagination mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button className="page-link" onClick={handlePrevious}>
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <li
                          key={pageNum}
                          className={`page-item ${
                            currentPage === pageNum ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      )
                    )}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button className="page-link" onClick={handleNext}>
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      {deleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="exhibitionplan"
          id={selectedPlan?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {}
      {editModalOpen && selectedPlan && (
        <EditExhibitionPlan
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          plan={selectedPlan}
          fetchExhibitionPlans={fetchExhibitionPlans}
        />
      )}
    </>
  );
};

export default ExhibitionTable;
