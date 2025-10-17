import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NegotiateModal from "./Negotiate";
import updateBuyerStatus from "./buyerRequestAPI";
import { toast } from "react-toastify";

function BuyerManageTable({ buyerRequests, handleRejectBuyerRequest, updateBuyerRequestStatus }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    console.log("Buyer Requests:", buyerRequests);

    const filteredProducts = buyerRequests.filter(request =>
        request.Buyer?.id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.Buyer?.id?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const displayedProducts = filteredProducts.slice(
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

    const handleUpdateBuyerStatus = async (requestId) => {
        try {
            setLoadingIds((prev) => [...prev, requestId]);

            const response = await updateBuyerStatus(requestId);

            toast.success("Product Request has been Approved!");
            window.location.reload();
            setUpdatedRequests((prev) => ({
                ...prev,
                [requestId]: "Approved",
            }));

            setLoadingIds((prev) => prev.filter((itemId) => itemId !== requestId));
        } catch (error) {
            toast.error("Failed to approve request!");
            setLoadingIds((prev) => prev.filter((itemId) => itemId !== requestId));
        }
    };

    return (
        <>
            <div className="container-fluid">
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
                                        value={productsPerPage}
                                        onChange={handleProductsPerPageChange}
                                        style={{ minWidth: '70px' }}
                                    >
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
                                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                                const isLoading = loadingIds.includes(request._id);
                                                return (
                                                    <tr key={request._id}>
                                                        <td>
                                                            <h6 className="mb-0">{index + 1}</h6>
                                                        </td>
                                                        <td>{`${request.Buyer.id.name} ${request.Buyer.id.lastName}`}</td>
                                                        <td>
                                                            <img
                                                                src={`${BASE_URL}/${request.BuyerImage?.replace(/\\/g, '/')}`}
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
                                                        {/* <td>{request.Buyer.id.email}</td>
                                                        <td>{request.Buyer.id.phone}</td> */}
                                                        <td>{request.ProductName}</td>
                                                                {/* {request.ProductName}
                                                            </p>
                                                        </td> */}
                                                        <td>
                                                            {request.BuyerNegotiatedBudgets.length > 0
                                                                ? `₹${request.BuyerNegotiatedBudgets[request.BuyerNegotiatedBudgets.length - 1]}`
                                                                : '-'}
                                                        </td>
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
                                                        <td style={{ minWidth: '250px' }}>
                                                            <div
                                                                className="d-flex align-items-center flex-wrap"
                                                                style={{ gap: '6px' }}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-info btn-sm"
                                                                    title="View"
                                                                    onClick={() =>
                                                                        navigate(`/artist/custom-order/view-request`, {
                                                                            state: { request },
                                                                        })
                                                                    }
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </button>

                                                                {(request.BuyerNegotiatedBudgets.length !== 0 &&
                                                                    request.ArtistNegotiatedBudgets.length !== 0 &&
                                                                    ((request.BuyerNegotiatedBudgets.length === 1 && request.ArtistNegotiatedBudgets.length === 1) ||
                                                                        (request.BuyerNegotiatedBudgets.length === 2 && request.ArtistNegotiatedBudgets.length === 2)) &&
                                                                    request.RequestStatus === "Pending") && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-success"
                                                                            title="Approve"
                                                                            disabled={isLoading}
                                                                            onClick={async () => {
                                                                                await handleUpdateBuyerStatus(request._id);
                                                                            
                                                                                setUpdatedRequests((prev) => ({
                                                                                    ...prev,
                                                                                    [request._id]: 'Approved',
                                                                                }));
                                                                            }}
                                                                        >
                                                                            {isLoading ? (
                                                                                <i className="fa fa-spinner fa-spin"></i>
                                                                            ) : (
                                                                                <i className="fa fa-check"></i>
                                                                            )}
                                                                        </button>
                                                                    )}

                                                                {((request.BuyerNegotiatedBudgets.length === 0 && request.ArtistNegotiatedBudgets.length === 0) ||
                                                                    (request.BuyerNegotiatedBudgets.length === 1 && request.ArtistNegotiatedBudgets.length === 1) ||
                                                                    (request.BuyerNegotiatedBudgets.length === 2 && request.ArtistNegotiatedBudgets.length === 2)) &&
                                                                    request.RequestStatus === "Pending" && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-secondary btn-sm"
                                                                            title="Negotiate"
                                                                            onClick={() => handleOpenModal(request)}
                                                                        >
                                                                            <i className="fas fa-handshake"></i>
                                                                        </button>
                                                                    )}

                                                                {request.RequestStatus === "Approved" && request.BuyerStatus === "Approved" && (
                                                                    <select
                                                                        className="form-control form-control-sm"
                                                                        style={{
                                                                            width: '160px',
                                                                            minWidth: '150px',
                                                                            display: 'inline-block',
                                                                        }}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="Work in Progress">Work in Progress</option>
                                                                        <option value="Ready for Transit">Ready for Transit</option>
                                                                        <option value="In-Transit">In-Transit</option>
                                                                        <option value="Delivered">Delivered</option>
                                                                    </select>
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
                                    <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                        Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
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
                    onClose={() => {
                        handleCloseModal();
                        handleUpdateBuyerStatus();
                    }}
                    onSubmit={() => {
                        handleSaveChanges();
                    }}
                />
            )}

        </>
    );
}

export default BuyerManageTable;
