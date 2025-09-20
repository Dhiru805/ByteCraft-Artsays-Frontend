import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import deleteAPI from "../../../../api/deleteAPI";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../ConfirmationDialog";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPolicyToDelete, setSelectedPolicyToDelete] = useState(null);
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(policies.length / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // ✨ Helper to truncate words
  const truncateText = (text, wordLimit = 10) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Fetch policies from API
  const fetchPolicies = async () => {
    try {
      const response = await getAPI("/api/social-policies", {}, true);
      setPolicies(response.data.data || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to load policies");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Delete dialog handlers
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPolicyToDelete(null);
  };

const handleDeleteConfirmed = async (id) => {
  try {
    await deleteAPI(`/api/social-policies/${id}`, {}, true);

    fetchPolicies(); // 👈 refetch fresh list
  } catch (error) {
    console.error("Error deleting policy:", error);
    
  } finally {
    setIsDeleteDialogOpen(false);
  }
};


  const openDeleteDialog = (policy) => {
    setSelectedPolicyToDelete(policy);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Policies Management</h2>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() =>
                    navigate("/super-admin/community-cms/policies/create")
                  }
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <label className="mb-0 mr-2">Show</label>
                  <select
                    className="form-control form-control-sm"
                    onChange={(e) =>
                      setItemsPerPage(parseInt(e.target.value, 10))
                    }
                    value={itemsPerPage}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label className="mb-0 ml-2">entries</label>
                </div>
              </div>

              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover table-custom m-b-0 c_list">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Policies Question</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policies.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        policies
                          .slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          )
                          .map((policy, index) => (
                            <tr key={policy._id}>
                              <td>{index + 1}</td>
                              <td>{truncateText(policy.question, 10)}</td>
                              <td>{truncateText(policy.description, 10)}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    policy.status === "published"
                                      ? "badge-success"
                                      : "badge-warning"
                                  }`}
                                >
                                  {policy.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm mr-2"
                                  title="View"
                                  onClick={() =>
                                    navigate(
                                      "/super-admin/community-cms/policies/view",
                                      { state: { policy } }
                                    )
                                  }
                                >
                                  <i className="fa fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-info btn-sm mr-2"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(
                                      "/super-admin/community-cms/policies/edit",
                                      { state: { policy } }
                                    )
                                  }
                                >
                                  <i className="fa fa-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete"
                                  onClick={() => openDeleteDialog(policy)}
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
                <div className="pagination d-flex justify-content-end mt-4">
                  <ul className="pagination">
                    <li
                      className={`paginate_button page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                      onClick={handlePrevious}
                    >
                      <button className="page-link">Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((pageNumber) => pageNumber === currentPage)
                      .map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <button className="page-link">{pageNumber}</button>
                        </li>
                      ))}
                    <li
                      className={`paginate_button page-item ${
                        currentPage === totalPages ? "disabled" : ""
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
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="policy"   // 👈 added
          id={selectedPolicyToDelete._id}
          onDeleted={() => handleDeleteConfirmed(selectedPolicyToDelete._id)}
        />
      )}
    </>
  );
}

export default Policies;
