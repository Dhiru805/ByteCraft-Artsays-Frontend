
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NegotiateModal from "./Negotiate";
import updateBuyerStatus from "./buyerRequestAPI";
import { toast } from "react-toastify";
import { getImageUrl } from '../../../../../../utils/getImageUrl';

function BuyerManageTable({ buyerRequests }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ✅ FIX: BUTTON-SCOPED LOADING (NOT ROW-SCOPED)
  const [loadingAction, setLoadingAction] = useState({
    requestId: null,
    action: null, // "approve"
  });

  /* ---------- FILTERING ---------- */
  const filteredProducts = buyerRequests.filter(
    (request) =>
      request.Buyer?.id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.Buyer?.id?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  /* ---------- HANDLERS ---------- */
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  // ✅ ONLY APPROVE BUTTON LOADS
  const handleApproveRequest = async (requestId) => {
    try {
      setLoadingAction({ requestId, action: "approve" });

      await updateBuyerStatus(requestId);

      toast.success("Product Request has been Approved!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to approve request!");
    } finally {
      setLoadingAction({ requestId: null, action: null });
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <div className="d-none d-md-flex align-items-center">
                  <label className="mb-0 mr-2">Show</label>
                  <select
                    className="form-control form-control-sm"
                    value={productsPerPage}
                    onChange={handleProductsPerPageChange}
                    style={{ minWidth: "70px" }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label className="mb-0 ml-2">entries</label>
                </div>

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
                  />
                </div>
              </div>

              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Product Name</th>
                        <th>Buyer Negotiated Budget</th>
                        <th>Request Date</th>
                        <th>Artist Request Status</th>
                        <th>Buyer Request Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {displayedProducts.map((request, index) => {
                        const isApproveLoading =
                          loadingAction.requestId === request._id &&
                          loadingAction.action === "approve";

                        return (
                          <tr key={request._id}>
                            <td>
                              {(currentPage - 1) * productsPerPage + index + 1}
                            </td>

                            <td className="d-flex align-items-center">
                              <img
                                src={getImageUrl(request.BuyerImage?.replace(
                                  /\\/g,
                                  "/"
                                ))}
                                alt=""
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  marginRight: "10px",
                                }}
                              />
                              <span>{request.ProductName}</span>
                            </td>

                            <td>
                              {request.BuyerNegotiatedBudgets.length > 0
                                ? `₹${request.BuyerNegotiatedBudgets.at(-1)}`
                                : "-"}
                            </td>

                            <td>
                              {new Date(
                                request.createdAt
                              ).toLocaleDateString("en-IN")}
                            </td>

                            <td>
                              <button
                                className={`btn btn-sm ${
                                  request.RequestStatus === "Pending"
                                    ? "btn-outline-warning"
                                    : request.RequestStatus === "Approved"
                                    ? "btn-outline-success"
                                    : "btn-outline-danger"
                                }`}
                              >
                                {request.RequestStatus}
                              </button>
                            </td>

                            <td>
                              <button
                                className={`btn btn-sm ${
                                  request.BuyerStatus === "Pending"
                                    ? "btn-outline-warning"
                                    : request.BuyerStatus === "Approved"
                                    ? "btn-outline-success"
                                    : "btn-outline-danger"
                                }`}
                              >
                                {request.BuyerStatus}
                              </button>
                            </td>

                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() =>
                                    navigate(
                                      "/artist/custom-order/view-request",
                                      { state: { request } }
                                    )
                                  }
                                >
                                  <i className="fa fa-eye" />
                                </button>

                                {request.RequestStatus === "Pending" &&
                                  loadingAction.requestId !== request._id && (
                                    <button
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={() =>
                                        handleOpenModal(request)
                                      }
                                    >
                                      <i className="fas fa-handshake" />
                                    </button>
                                  )}

                                {request.RequestStatus === "Pending" &&
                                  request.BuyerNegotiatedBudgets.length > 0 &&
                                  request.ArtistNegotiatedBudgets.length >
                                    0 && (
                                    <button
                                      className="btn btn-sm btn-outline-success"
                                      disabled={isApproveLoading}
                                      onClick={() =>
                                        handleApproveRequest(request._id)
                                      }
                                    >
                                      {isApproveLoading ? (
                                        <i className="fa fa-spinner fa-spin" />
                                      ) : (
                                        <i className="fa fa-check" />
                                      )}
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pagination d-flex justify-content-between mt-4">
                  <span className="d-none d-sm-inline">
                    Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * productsPerPage,
                      filteredProducts.length
                    )}{" "}
                    of {filteredProducts.length} entries
                  </span>

                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                      onClick={handlePrevious}
                    >
                      <button className="page-link">Previous</button>
                    </li>

                    <li
                      className={`page-item ${
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

      {showModal && (
        <NegotiateModal request={selectedRequest} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default BuyerManageTable;
