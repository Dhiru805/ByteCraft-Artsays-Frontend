import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from '../../../../ConfirmationDialog';
import { DEFAULT_PROFILE_IMAGE } from "../../../../../../Constants/ConstantsVariables";
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';
import { useConfirm } from '../../../../StatusConfirm';


function BuyerManageTable({ buyerRequests, setBuyerRequests, handleRejectBuyerRequest, updateBuyerRequestStatus }) {
    console.log("Buyer Requests:", buyerRequests);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBuyerRequestToDelete, setSelectedBuyerRequestToDelete] = useState(null);
    const [selectedRequestDescription, setSelectedRequestDescription] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [loadingIds, setLoadingIds] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    const confirm = useConfirm();
    const navigate = useNavigate();


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

    // const handleReject = (productId) => {
    //     confirm(() => updateProductStatus(productId, 'Rejected'), "Are you sure you want to reject this product?");
    // };

    // const updateProductStatus = async (productId, status) => {
    //     try {
    //         await putAPI(
    //             `/api/updateproductstatus/${productId}`,
    //             { status: status },
    //             {},
    //             true
    //         );

    //         setProducts((prevProducts) =>
    //             prevProducts.map((product) =>
    //                 product._id === productId ? { ...product, status: status } : product
    //             )
    //         );

    //         if (status === 'Approved') {
    //             toast.success('Product Request is Approved');
    //         } else if (status === 'Rejected') {
    //             toast.error('Product Request is Rejected');
    //         }
    //     } catch (error) {
    //         console.error("Error updating product status:", error);
    //     }
    // };

    const filteredRequests = buyerRequests.filter((request) => {
        const buyerName = request.Buyer?.id?.name && request.Buyer?.id?.lastName
            ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}`.toLowerCase() : '';

        const artistName = request.Artist?.id?.name && request.Artist?.id?.lastName
            ? `${request.Artist.id.name} ${request.Artist.id.lastName}`.toLowerCase()
            : '';
        return (
            buyerName.includes(searchTerm.toLowerCase()) ||
            artistName.includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredRequests.length / productsPerPage);

    const displayedProducts = filteredRequests.slice(
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

    const handleImageClick = (product) => {
        const images = [product.BuyerImage];
        setCurrentImages(images);
        setCurrentImageIndex(0);
        setShowPopup(true);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>Seller Product Request</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                        <i className="fa fa-dashboard"></i>
                                    </span>                                </li>
                                <li className="breadcrumb-item">Seller Product Request</li>
                            </ul>
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
                                        name="DataTables_Table_0_length"
                                        aria-controls="DataTables_Table_0"
                                        className="form-control form-control-sm"
                                        value={productsPerPage}
                                        onChange={handleProductsPerPageChange}
                                        style={{ minWidth: '70px' }}
                                    >
                                        {/* <option value="5">5</option> */}
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
                                        <thead className="thead-dark text-nowrap">
                                            <tr>
                                                <th>#</th>
                                                <th>Buyer Name</th>
                                                <th>Artist Name</th>
                                                <th>Reference Image</th>
                                                <th>Buyer Negotiated Budget</th>
                                                <th>Artist Negotiated Budget</th>
                                                <th>Request Date</th>
                                                <th>Request Status</th>
                                                <th>Buyer Request Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedProducts.map((request, index) => (
                                                <tr key={request._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={
                                                                request?.Buyer?.id?.profilePhoto
                                                                    ? `${BASE_URL}${request.Buyer.id.profilePhoto}`
                                                                    : DEFAULT_PROFILE_IMAGE
                                                            }
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <p className="c_name">
                                                            {request?.Buyer?.id
                                                                ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}`
                                                                : 'N/A'}
                                                        </p>

                                                    </td>
                                                    <td>
                                                        <img
                                                            src={
                                                                request?.Artist?.id?.profilePhoto
                                                                    ? `${BASE_URL}${request.Artist.id.profilePhoto}`
                                                                    : DEFAULT_PROFILE_IMAGE
                                                            } className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <p className="c_name">
                                                            {request?.Artist?.id
                                                                ? `${request.Artist.id.name} ${request.Artist.id.lastName}`
                                                                : 'N/A'}
                                                        </p>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <img
                                                            src={`${BASE_URL}/${request.BuyerImage?.replace(/\\/g, '/')}`}
                                                            className="rounded-circle avatar"
                                                            onClick={() => handleImageClick(request)}
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                                marginRight: '10px',
                                                                cursor: 'pointer',
                                                            }}
                                                        />

                                                        {/* <img
                                                            src={
                                                                request?.BuyerImage
                                                                    ? `${BASE_URL}${request.BuyerImage}`
                                                                    : DEFAULT_PROFILE_IMAGE
                                                            }
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            onClick={() => handleImageClick(request)}
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                                marginRight: '10px',
                                                                cursor: 'pointer'
                                                            }}
                                                        /> */}
                                                        {/* <img
                                                            src={
                                                                request?.Artist?.id?.profilePhoto
                                                                    ? `${BASE_URL}${request.Artist.id.profilePhoto}`
                                                                    : DEFAULT_PROFILE_IMAGE
                                                            } className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                                alignItems: 'center',
                                                            }}
                                                        /> */}
                                                    </td>
                                                    <td>
                                                        {request.BuyerNegotiatedBudgets?.length > 0
                                                            ? new Intl.NumberFormat('en-IN', {
                                                                style: 'currency',
                                                                currency: 'INR'
                                                            }).format(
                                                                request.BuyerNegotiatedBudgets[request.BuyerNegotiatedBudgets.length - 1]
                                                            ).replace(/\.00$/, '')
                                                            : '—'}
                                                    </td>

                                                    <td>
                                                        {request.ArtistNegotiatedBudgets?.length > 0
                                                            ? new Intl.NumberFormat('en-IN', {
                                                                style: 'currency',
                                                                currency: 'INR'
                                                            }).format(
                                                                request.ArtistNegotiatedBudgets[request.ArtistNegotiatedBudgets.length - 1]
                                                            ).replace(/\.00$/, '')
                                                            : '—'}
                                                    </td>
                                                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <button className={`btn btn-sm ${request.RequestStatus === 'Pending' ? 'btn-outline-warning' : request.RequestStatus === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
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
                                                            className="btn btn-outline-primary btn-sm mr-2"
                                                            title="Navigate"
                                                            onClick={() => {
                                                                console.log('Navigating to request with ID:', request._id);
                                                                navigate(`/super-admin/customordertable/view-request`, {
                                                                    state: { request },
                                                                });
                                                            }}
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        {/* <button
                                                            type="button"
                                                            className="btn btn-outline-info btn-sm mr-2"
                                                            title="Edit"
                                                            onClick={() =>
                                                                navigate(`/${userType}/Dashboard/BuyerCustomrequest/UpdateCustomrequest/${request._id}`, {
                                                                    state: { request },
                                                                })
                                                            }
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </button> */}
                                                        {/* <button
                                                            className="btn btn-sm btn-outline-success mr-2"
                                                            title="Approved"
                                                            disabled={loadingIds.includes(request._id)}
                                                            onClick={async () => {
                                                                setLoadingIds(prev => [...prev, request._id]);
                                                                await updateProductStatus(request._id, 'Approved');
                                                                setLoadingIds(prev => prev.filter(id => id !== request._id));
                                                            }}
                                                        >
                                                            {loadingIds.includes(request._id) ? (
                                                                <i className="fa fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <i className="fa fa-check"></i>
                                                            )}
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger mr-2"
                                                            title="Declined"
                                                            disabled={loadingIds.includes(request._id)}
                                                            onClick={() => handleReject(request._id)}
                                                        >
                                                            {loadingIds.includes(request._id) ? (
                                                                <i className="fa fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <i className="fa fa-ban"></i>
                                                            )}
                                                        </button> */}
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
            {showPopup && (
                <div
                    onClick={() => setShowPopup(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            height: '50%',
                            backgroundColor: '#111',
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Image */}
                        <img
                            src={`${BASE_URL}/${currentImages[currentImageIndex]?.replace(/\\/g, '/')}`}
                            alt="Popup"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                            }}
                        />
                    </div>
                </div>
            )}


        </>

    );
}

export default BuyerManageTable;
