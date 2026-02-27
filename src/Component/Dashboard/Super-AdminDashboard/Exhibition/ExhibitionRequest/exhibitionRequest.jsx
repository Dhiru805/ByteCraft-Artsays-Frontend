
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";
import ConfirmationDialog from "../../../ConfirmationDialog";

const ExhibitionRequestTable = () => {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exhibitionsPerPage, setExhibitionsPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExhibitionToDelete, setSelectedExhibitionToDelete] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [selectedExhibitionToReject, setSelectedExhibitionToReject] = useState(null);
  const [loadingExhibitionId, setLoadingExhibitionId] = useState(null);

  const fetchExhibitions = async () => {
    try {
      const response = await getAPI(`/api/get-exhibition-artistseller`);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setExhibitions(data);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch exhibitions");
      setExhibitions([]);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const updateExhibitionStatus = async (exhibitionId, status) => {
    setLoadingExhibitionId(exhibitionId);

    try {
      await putAPI(
        `/api/update-exhibition-status/${exhibitionId}`,
        { status },
        {},
        true
      );

      setExhibitions((prevExhibitions) =>
        prevExhibitions.map((exhibition) =>
          exhibition._id === exhibitionId ? { ...exhibition, status } : exhibition
        )
      );

      toast.success("Exhibition Request is Approved");
    } catch (error) {
      console.error("Error updating exhibition status:", error);
      toast.error(error.response?.data?.message || "Failed to update exhibition status");
    } finally {
      setLoadingExhibitionId(null);
    }
  };

  const handleReject = (exhibitionId) => {
    setSelectedExhibitionToReject(exhibitionId);
    setIsRejectModalOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectionComment.trim()) {
      toast.error("Rejection comment is required.");
      return;
    }

    setLoadingExhibitionId(selectedExhibitionToReject);

    try {
      await putAPI(
        `/api/update-exhibition-status/${selectedExhibitionToReject}`,
        {
          status: "Rejected",
          rejectComment: rejectionComment.trim(),
        },
        {},
        true
      );

      setExhibitions((prevExhibitions) =>
        prevExhibitions.map((exhibition) =>
          exhibition._id === selectedExhibitionToReject
            ? { ...exhibition, status: "Rejected", rejectComment: rejectionComment.trim() }
            : exhibition
        )
      );

      toast.error("Exhibition Request is Rejected");
      setIsRejectModalOpen(false);
      setRejectionComment("");
      setSelectedExhibitionToReject(null);
    } catch (error) {
      console.error("Error rejecting exhibition:", error);
      toast.error(error.response?.data?.message || "Failed to reject exhibition");
    } finally {
      setLoadingExhibitionId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedExhibitionToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setExhibitions((prevExhibitions) =>
      prevExhibitions.filter((exhibition) => exhibition._id !== id)
    );
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (exhibition) => {
    setSelectedExhibitionToDelete(exhibition);
    setIsDeleteDialogOpen(true);
  };

  const filteredExhibitions = exhibitions.filter(
    (exhibition) =>
      exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.hostedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExhibitions.length / exhibitionsPerPage);
  const displayedExhibitions = filteredExhibitions.slice(
    (currentPage - 1) * exhibitionsPerPage,
    currentPage * exhibitionsPerPage
  );

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

  const handleExhibitionsPerPageChange = (event) => {
    setExhibitionsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Exhibitions Request</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Exhibitions Request</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/super-admin/exhibition/create-exhibition")}
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
                  value={exhibitionsPerPage}
                  onChange={handleExhibitionsPerPageChange}
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
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Artist/Seller</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Hosted By</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedExhibitions.map((exhibition, index) => (
                      <tr key={exhibition._id}>
                        <td>{(currentPage - 1) * exhibitionsPerPage + index + 1}</td>
                        <td>{exhibition.userName}</td>
                        <td>{exhibition.title || "-"}</td>
                        <td>{exhibition.type || "-"}</td>
                        <td>{exhibition.hostedBy || "-"}</td>
                        <td>
                          {new Date(exhibition.startDate).toLocaleDateString() || "-"}
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${exhibition.status === "Pending"
                                ? "btn-outline-warning"
                                : exhibition.status === "Approved"
                                  ? "btn-outline-success"
                                  : "btn-outline-danger"
                              }`}
                          >
                            {exhibition.status}
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mr-1"
                            title="View"
                            onClick={() =>
                              navigate(`/super-admin/exhibition-request/view-exhibition`, {
                                state: { exhibition },
                              })
                            }
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm mr-1"
                            title="Edit"
                            onClick={() =>
                              navigate(`/super-admin/exhibition-request/update-exhibition`, {
                                state: { exhibition },
                              })
                            }
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mr-1"
                            title="Delete"
                            onClick={() => openDeleteDialog(exhibition)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                          {exhibition.status !== "Approved" && exhibition.status !== "Rejected" && (

                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm mr-1"
                              title="Approve"
                              onClick={() => updateExhibitionStatus(exhibition._id, "Approved")}
                              disabled={loadingExhibitionId}
                            >
                              {loadingExhibitionId === exhibition._id ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fa fa-check"></i>
                              )}
                            </button>
                          )}
                          {exhibition.status !== "Rejected" && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Reject"
                              onClick={() => handleReject(exhibition._id)}
                              disabled={loadingExhibitionId}
                            >
                              {loadingExhibitionId === exhibition._id ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fa fa-ban"></i>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredExhibitions.length === 0
                    ? 0
                    : (currentPage - 1) * exhibitionsPerPage + 1}{" "}
                  to {Math.min(currentPage * exhibitionsPerPage, filteredExhibitions.length)} of{" "}
                  {filteredExhibitions.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""
                          }`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    )
                  )}
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
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="exhibition"
          id={selectedExhibitionToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
      {isRejectModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Exhibition</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionComment("");
                    setSelectedExhibitionToReject(null);
                  }}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="rejectComment">Rejection Comment</label>
                  <textarea
                    className="form-control"
                    id="rejectComment"
                    rows="4"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="Enter reason for rejection"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionComment("");
                    setSelectedExhibitionToReject(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={submitRejection}
                  disabled={loadingExhibitionId === selectedExhibitionToReject || !rejectionComment.trim()}
                >
                  {loadingExhibitionId === selectedExhibitionToReject
                    ? "Rejecting..."
                    : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionRequestTable;
