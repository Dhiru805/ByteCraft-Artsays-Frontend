import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import useUserType from '../../../urlconfig';
import NegotiateModal from "./Negotiate";

function BuyerManageTable({ buyerRequests, handleRejectBuyerRequest, updateBuyerRequestStatus }) {
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
  handleCloseModal();
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
                                        {buyerRequests.map((request, index) => (
                                            <tr key={request._id}>
                                                <td>
                                                    <h6 className="mb-0">{index + 1}</h6>
                                                </td>
                                                <td>
                                                    <img
                                                        src={`${process.env.REACT_APP_API_URL}${request.Buyer.id.profilePhoto}`}
                                                        className="rounded-circle avatar"
                                                        alt=""
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
                                                            navigate(`/${userType}/Dashboard/customRequest/viewrequest/${request._id}`, {
                                                                state: { request },
                                                            })
                                                        }
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
                                        ))}
                                    </tbody>
                                </table>
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
