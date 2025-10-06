import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/axiosConfig";
import ConfirmationDialog from "../../ConfirmationDialog";

const PolicyTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
   const [deleteType, setDeleteType] = useState("");
  const [policiesPerPage, setPoliciesPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPolicyToDelete, setSelectedPolicyToDelete] = useState(null);

 
  const fetchPolicies = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return toast.error("User ID missing");

      const response = await axiosInstance.get(`/api/getPolicies/${userId}`);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPolicies(data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error(error.response?.data?.message || "Failed to fetch policies");
    }
  };

  useEffect(() => {
    fetchPolicies(); 
  }, []);

 
  useEffect(() => {
    if (location.state?.updatedPolicy) {
      const updated = location.state.updatedPolicy;
      setPolicies(prev =>
        prev.map(p => (p._id === updated._id ? updated : p))
      );
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);


  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPolicyToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/deletePolicy/${id}`);
      setPolicies(prevPolicies =>
        prevPolicies.filter(policy => policy._id !== id)
      );
      toast.success("Policy deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete policy.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPolicyToDelete(null);
    }
  };

  const openDeleteDialog = (policy) => {
    setSelectedPolicyToDelete(policy);
    setIsDeleteDialogOpen(true);
    setDeleteType("policy");
  };

 
  const filteredPolicies = policies.filter(
    policy =>
      (policy.title && policy.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (policy.status && policy.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPolicies.length / policiesPerPage);
  const displayedPolicies = filteredPolicies.slice(
    (currentPage - 1) * policiesPerPage,
    currentPage * policiesPerPage
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handlePoliciesPerPageChange = (e) => {
    setPoliciesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Policies</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Policies</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() =>
                    navigate("/super-admin/policy/create-policy")
                  }
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={policiesPerPage}
                  onChange={handlePoliciesPerPageChange}
                  style={{ minWidth: "70px" }}
                >
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
              </div>
            </div>

            <div className="body">

              <div className="table-responsive d-flex justify-content-center">
                <table
                  className="table table-hover text-center mx-auto"
                  style={{ width: "80%" }}
                >
                  <thead className="thead-dark">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "30%" }}>Title</th>
                      <th style={{ width: "20%" }}>Status</th>
                      <th style={{ width: "25%", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPolicies.map((policy, index) => (
                      <tr key={policy._id}>
                        <td>
                          {(currentPage - 1) * policiesPerPage + index + 1}
                        </td>
                        <td>{policy.title || "-"}</td>
                        <td>{policy.status || "-"}</td>
                        <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                          {/* <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mr-1"
                            title="View"
                            onClick={() =>
                              navigate(`/super-admin/policy/view-policy`, {
                                state: {
                                  policy: {
                                    ...policy,
                                    description:
                                      policy.description || policy.content || "",
                                  },
                                },
                              })
                            }
                          >
                            <i className="fa fa-eye"></i>
                          </button> */}
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm mr-2"
                            title="Edit"
                            onClick={() =>
                              navigate(`/super-admin/policy/update-policy`, {
                                state: { policy },
                              })
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
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredPolicies.length === 0
                    ? 0
                    : (currentPage - 1) * policiesPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * policiesPerPage,
                    filteredPolicies.length
                  )}{" "}
                  of {filteredPolicies.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`paginate_button page-item ${
                          currentPage === pageNumber ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    )
                  )}
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

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedPolicyToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default PolicyTable;
