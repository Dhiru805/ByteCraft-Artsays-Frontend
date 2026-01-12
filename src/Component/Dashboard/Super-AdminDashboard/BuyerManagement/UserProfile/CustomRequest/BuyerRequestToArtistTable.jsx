import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from '../../../../ConfirmationDialog';
import useUserType from '../../../../urlconfig';
import { DEFAULT_PROFILE_IMAGE } from "../../../../../../Constants/ConstantsVariables";

function BuyerManageTable({ buyerRequests, setBuyerRequests, handleRejectBuyerRequest, updateBuyerRequestStatus, userId }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBuyerRequestToDelete, setSelectedBuyerRequestToDelete] = useState(null);
    const [selectedRequestDescription, setSelectedRequestDescription] = useState(null);

    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    const navigate = useNavigate();
    const userType = useUserType();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setSelectedBuyerRequestToDelete(null);
    };

    const handleDeleteConfirmed = (id) => {
        setBuyerRequests((prevRequests) =>
            prevRequests.filter((request) => request._id !== id)
        );
        setIsDeleteDialogOpen(false);
    };

    const openDeleteDialog = (buyerRequest) => {
        setSelectedBuyerRequestToDelete(buyerRequest);
        setIsDeleteDialogOpen(true);
    };

    const filteredRequests = (buyerRequests || []).filter(request => {
        const buyerName = request.Buyer?.id ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}` : '';
        const artistName = request.Artist?.id ? `${request.Artist.id.name} ${request.Artist.id.lastName}` : '';
        
        return (
            buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artistName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredRequests.length / productsPerPage);
    const displayedBuyerRequests = filteredRequests.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
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

    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(Number(event.target.value));
        setCurrentPage(1);
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
                                    <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Buyer Name</th>
                                                <th>Artist Name</th>
                                                <th>Budget </th>
                                                <th>Negotiated Budget</th>
                                                <th>Request Date</th>
                                                <th>Request Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedBuyerRequests.map((request, index) => (
                                                <tr key={request._id}>
                                                    <td>
                                                        <h6 className="mb-0">{(currentPage - 1) * productsPerPage + index + 1}</h6>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={request?.Buyer?.id?.profilePhoto ? `${BASE_URL}${request.Buyer.id.profilePhoto}` : DEFAULT_PROFILE_IMAGE}
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <p className="c_name">
                                                            {request.Buyer?.id ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}` : 'N/A'}
                                                        </p>

                                                    </td>
                                                    <td>
                                                        <img
                                                            src={request?.Artist?.id?.profilePhoto ? `${BASE_URL}${request.Artist.id.profilePhoto}` : DEFAULT_PROFILE_IMAGE}
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <p className="c_name">
                                                            {request.Artist?.id ? `${request.Artist.id.name} ${request.Artist.id.lastName}` : 'N/A'}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(request.MinBudget || 0).replace(/\.00$/, '')} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(request.MaxBudget || 0).replace(/\.00$/, '')}
                                                    </td>
                                                    <td>
                                                        {(() => {
                                                            const artistBudgets = request.ArtistNegotiatedBudgets || [];
                                                            const buyerBudgets = request.BuyerNegotiatedBudgets || [];
                                                            const latestBudget = artistBudgets.length >= buyerBudgets.length && artistBudgets.length > 0
                                                                ? artistBudgets[artistBudgets.length - 1]
                                                                : buyerBudgets.length > 0
                                                                    ? buyerBudgets[buyerBudgets.length - 1]
                                                                    : request.NegotiatedBudget || 0;
                                                            
                                                            return latestBudget > 0 
                                                                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(latestBudget).replace(/\.00$/, '')
                                                                : "—";
                                                        })()}
                                                    </td>
                                                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <button className={`btn btn-sm ${request.RequestStatus === 'Pending' ? 'btn-outline-warning' : request.RequestStatus === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                            {request.RequestStatus}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm mr-2"
                                                            title="Navigate"
                                                            onClick={() => {
                                                                console.log('Navigating to request with ID:', request._id);
                                                                const type = userType?.toLowerCase();
                                                                const targetPath = type === 'super-admin'
                                                                    ? '/super-admin/customordertable/view-request'
                                                                    : `/${type}/custom-order/view-request`;

                                                                navigate(targetPath, {
                                                                    state: { request, userId },
                                                                });
                                                            }}
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-success w-2 mr-2"
                                                            title="Approve"
                                                            onClick={() => updateBuyerRequestStatus(request._id, 'Approved')}
                                                        >
                                                            <i className="fa fa-check"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger  w-2 mr-2"
                                                            title="Reject"
                                                            onClick={() => handleRejectBuyerRequest(request._id)}
                                                        >
                                                            <i className="fa fa-ban"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm mr-2"
                                                            title="Delete"
                                                            onClick={() => openDeleteDialog(request)}
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
                                        Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredRequests.length)} of {filteredRequests.length} entries
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

                {selectedRequestDescription && (
                    <div className="description-modal">
                        <h4>Description</h4>
                        <p>{selectedRequestDescription}</p>
                        <button onClick={() => setSelectedRequestDescription(null)}>Close</button>
                    </div>
                )}
            </div>

            {isDeleteDialogOpen && (
                <ConfirmationDialog
                    onClose={handleDeleteCancel}
                    deleteType="buyerRequest"
                    id={selectedBuyerRequestToDelete._id}
                    onDeleted={handleDeleteConfirmed}
                />
            )}
        </>
    );
}

export default BuyerManageTable;
