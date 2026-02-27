import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../../ConfirmationDialog";
import AddCompanyModal from "./AddCompanyModal";
import EditCompanyModal from "./EditCompanyModal";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";

const ArtiCMSTable = ({ companyInfo, fetchCompanyInfo }) => {
  const [companies, setCompanies] = useState(companyInfo || []);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sync internal state when parent updates
  useEffect(() => {
    setCompanies(companyInfo || []);
  }, [companyInfo]);

  // Delete company API
  const confirmDelete = async (id) => {
    if (!id) return;

    try {
      const response = await postAPI(`/api/company-info/delete/${id}`, {}, "DELETE");

      if (!response.hasError) {
        toast.success("Company deleted successfully");
        fetchCompanyInfo(); // refresh list instantly
      } else {
        toast.error(response.message || "Failed to delete company");
      }
    } catch (err) {
      toast.error("Error deleting company");
    }
  };

  const openEditModal = (company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const filteredCompanies = companies.filter((company) =>
    company.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredCompanies.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-2">

              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
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
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: "150px" }}
                />
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Company Info</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedCompanies.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No company info added yet
                        </td>
                      </tr>
                    ) : (
                      displayedCompanies.map((company, index) => (
                        <tr key={company._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{company.description}</td>

                          <td>
                            <button
                              className="btn btn-outline-info btn-sm mr-2"
                              onClick={() => openEditModal(company)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setDeleteId(company._id);
                                setIsDeleteDialogOpen(true);
                              }}
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
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of{" "}
                  {filteredCompanies.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>

                  <li
                    className={`paginate_button page-item ${
                      currentPage === Math.ceil(filteredCompanies.length / itemsPerPage)
                        ? "disabled"
                        : ""
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

      {/* Delete Dialog */}
      {isDeleteDialogOpen && deleteId && (
        <ConfirmationDialog
          id={deleteId}
          deleteType="company"
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
          }}
          onDeleted={() => {
            fetchCompanyInfo();
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCompany && (
        <EditCompanyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          company={selectedCompany}
          fetchCompanies={fetchCompanyInfo}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddCompanyModal
          onClose={() => setIsAddModalOpen(false)}
          fetchCompanies={fetchCompanyInfo}
        />
      )}
    </>
  );
};

export default ArtiCMSTable;
