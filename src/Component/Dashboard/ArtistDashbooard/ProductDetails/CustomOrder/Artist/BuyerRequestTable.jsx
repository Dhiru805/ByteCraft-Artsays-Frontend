import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NegotiateModal from "./Negotiate";

function BuyerManageTable({ buyerRequests, handleRejectBuyerRequest, updateBuyerRequestStatus }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;


    // pagination helpers 
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);


    const totalPages = Math.ceil(buyerRequests.length / productsPerPage);

    const displayedProducts = buyerRequests.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(Number(event.target.value));
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

    const handleSaveChanges = (updatedData) => {
        console.log("Updated Data:", updatedData);
        handleCloseModal();
    };


    const [loadingIds, setLoadingIds] = useState([]);

    const [updatedRequests, setUpdatedRequests] = useState({});

    return (
        <>
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="header d-flex justify-content-between align-items-center">
                                {/* <h2>Buyer Request List</h2> */}
                                <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                                    <label className="mb-0 mr-2">Show</label>
                                    <select
                                        name="DataTables_Table_0_length"
                                        aria-controls="DataTables_Table_0"
                                        className="form-control form-control-sm"
                                        value={productsPerPage}
                                        onChange={handleProductsPerPageChange}
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
                                <div className="d-flex">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Search"
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-sm btn-outline-secondary">
                                                <i className="fa fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="body">
                                <div className="table-responsive">
                                    <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Product Name</th>
                                                <th>Request Date</th>
                                                <th>Request Status</th>
                                                <th>Buyer Request Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedProducts.map((request, index) => {
                                                const isLoading = loadingIds.includes(request._id);
                                                return (
                                                    <tr key={request._id}>
                                                        <td>
                                                            <h6 className="mb-0">{index + 1}</h6>
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={`${BASE_URL}${request.Buyer?.id?.profilePhoto}`}
                                                                className="rounded-circle avatar"
                                                                alt="Profile"
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                            <p className="c_name">
                                                                {`${request.Buyer.id.name} ${request.Buyer.id.lastName}`}
                                                            </p>
                                                        </td>
                                                        <td>{request.Buyer.id.email}</td>
                                                        <td>{request.Buyer.id.phone}</td>
                                                        <td>{request.ProductName}</td>
                                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <button
                                                                className={`btn btn-sm ${request.RequestStatus === 'Pending'
                                                                    ? 'btn-outline-warning'
                                                                    : request.RequestStatus === 'Approved'
                                                                        ? 'btn-outline-success'
                                                                        : 'btn-outline-danger'
                                                                    }`}
                                                            >
                                                                {request.RequestStatus}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button className={`btn btn-sm ${request.BuyerStatus === 'Pending' ? 'btn-outline-warning' : request.BuyerStatus === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                                {request.BuyerStatus}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-info btn-sm mr-2"
                                                                title="View"
                                                                onClick={() =>
                                                                    navigate(`/artist/custom-order/view-request`, {
                                                                        state: { request },
                                                                    })
                                                                }
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                            {/* Approve button logic */}
                                                            {updatedRequests[request._id] !== 'approved' && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-success w-2 mr-2"
                                                                    title="Approve"
                                                                    disabled={isLoading}
                                                                    onClick={async () => {
                                                                        setLoadingIds((prev) => [...prev, request._id]);
                                                                        await updateBuyerRequestStatus(request._id, 'Approved');
                                                                        setUpdatedRequests((prev) => ({ ...prev, [request._id]: 'approved' }));
                                                                        setLoadingIds((prev) => prev.filter((itemId) => itemId !== request._id));
                                                                    }}
                                                                >
                                                                    {isLoading ? (
                                                                        <i className="fa fa-spinner fa-spin"></i>
                                                                    ) : (
                                                                        <i className="fa fa-check"></i>
                                                                    )}
                                                                </button>
                                                            )}

                                                            {/* Reject button logic */}
                                                            {updatedRequests[request._id] !== 'rejected' && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger w-2 mr-2"
                                                                    title="Reject"
                                                                    disabled={isLoading}
                                                                    onClick={async () => {
                                                                        setLoadingIds((prev) => [...prev, request._id]);
                                                                        await handleRejectBuyerRequest(request._id);
                                                                        setUpdatedRequests((prev) => ({ ...prev, [request._id]: 'rejected' }));
                                                                        setLoadingIds((prev) => prev.filter((itemId) => itemId !== request._id));
                                                                    }}
                                                                >
                                                                    {isLoading ? (
                                                                        <i className="fa fa-spinner fa-spin"></i>
                                                                    ) : (
                                                                        <i className="fa fa-ban"></i>
                                                                    )}
                                                                </button>
                                                            )}

                                                            {request.RequestStatus === 'Approved' && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    title="Negotiate"
                                                                    onClick={() => handleOpenModal(request)}
                                                                >
                                                                    <i className="fas fa-handshake"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pagination d-flex justify-content-between mt-4">
                                    <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                        Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, buyerRequests.length)} of {buyerRequests.length} entries
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
            </div>
            {showModal && (
                <NegotiateModal
                    request={selectedRequest}
                    onClose={handleCloseModal}
                    onSubmit={handleSaveChanges}
                />
            )}

        </>
    );
}

export default BuyerManageTable;
