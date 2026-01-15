import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from '../../../ConfirmationDialog';
import useUserType from '../../../urlconfig';
import NegotiateModal from './Negotiate'

function BuyerManageTable({ buyerRequests, setBuyerRequests }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBuyerRequestToDelete, setSelectedBuyerRequestToDelete] = useState(null);
    const [selectedRequestDescription, setSelectedRequestDescription] = useState(null);

    const navigate = useNavigate();
    const userType = useUserType();
        const [showModal, setShowModal] = useState(false);
        const [selectedRequest, setSelectedRequest] = useState(null);
    
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
        setBuyerRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === updatedData._id ? { ...request, ...updatedData } : request
          )
        );
        handleCloseModal();
      };
      

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

   
    return (
        <>
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h2>Buyer Request List</h2>
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
                                        <thead className="thead-dark text-nowrap">
                                            <tr>
                                                <th>#</th>
                                                <th>Product Name</th>
                                                <th>Artist Name</th>
                                                <th>Max Budget </th>
                                                <th>Min Budget </th>
                                                <th>Negotiated Budget</th>
                                                <th>Request Date</th>
                                                <th>Request Status</th>
                                                <th>Buyer Request Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {buyerRequests.map((request, index) => (
                                                <tr key={request._id}>
                                                    <td>
                                                        <h6 className="mb-0">{index + 1}</h6>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}/${request.BuyerImage}`}
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <p className="c_name">
                                                            {request.ProductName}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        {request.Artist ? `${request.Artist.id.name} ${request.Artist.id.lastName}` : 'N/A'}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(request.MaxBudget).replace(/\.00$/, '')}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(request.MinBudget).replace(/\.00$/, '')}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(request.NegotiatedBudget).replace(/\.00$/, '')}
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
                                                            onClick={() =>
                                                                navigate(`/${userType}/Dashboard/customrequest/viewCustomrequest/${request._id}`, {
                                                                    state: { request },
                                                                })
                                                            }
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-info btn-sm mr-2"
                                                            title="Edit"
                                                            onClick={() =>
                                                                navigate(`/${userType}/Dashboard/customrequest/updatecustomrequest/${request._id}`, {
                                                                    state: { request },
                                                                })
                                                            }
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm mr-2"
                                                            title="Delete"
                                                            onClick={() => openDeleteDialog(request)}
                                                        >
                                                            <i className="fa fa-trash-o"></i>
                                                        </button>
                                                        {request.NegotiatedBudget && (
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
                                            ))}
                                        </tbody>
                                    </table>
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
            {showModal && (
  <NegotiateModal 
    request={selectedRequest}
    onClose={handleCloseModal}
    onSubmit={handleSaveChanges}
  />
)}
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
