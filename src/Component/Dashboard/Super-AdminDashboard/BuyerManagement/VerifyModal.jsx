import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import putAPI from "../../../../api/putAPI";
import { useConfirm } from '../../StatusConfirm';

const VerifyModal = ({ buyer, onClose, refreshBuyers }) => {
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const confirm = useConfirm();
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    const updateUserStatus = async (userId, status) => {
        try {
            await putAPI(
                `/auth/updateuserstatus/${userId}`,
                { status: status },
                {},
                true
            );

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, status: status } : user
                )
            );

            if (status === 'Verified') {
                toast.success('User status is Verified');
            } else if (status === 'Unverified') {
                toast.error('User status is Unverified');
            }
            refreshBuyers();
            onClose();
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    const handleReject = (userId) => {
        confirm(() => updateUserStatus(userId, 'Unverified'), "Are you sure you want to reject this user?");
    };

    useEffect(() => {
        if (buyer?.verification?.documentFile) {
            setFilePreview(`${BASE_URL}/${buyer.verification.documentFile}`);
            setFileType(buyer.verification.documentFile.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
        }
    }, [buyer]);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Verified Buyer</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="row clearfix">
                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" className="form-control" id="firstName" value={buyer.name} readOnly />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" className="form-control" id="lastName" value={buyer.lastName} readOnly />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" id="email" value={buyer.email} readOnly />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="text" className="form-control" id="phone" value={buyer.phone} readOnly />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label htmlFor="documentType">Document Type</label>
                                    <input type="text" className="form-control" id="documentType" value={buyer.verification.documentType} readOnly />
                                    {filePreview && (
                                        <div className="mt-3">
                                            {fileType === "application/pdf" ? (
                                                <div>
                                                    <a href={filePreview} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                        View PDF
                                                    </a>
                                                </div>
                                            ) : (
                                                <img
                                                    src={filePreview}
                                                    alt="Uploaded Document"
                                                    onClick={handleImageClick}
                                                    className="img-fluid"
                                                    style={{ width: "250px", height: "150px" }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Document Number</label>
                                    <input type="text" className="form-control" id="documentType" value={buyer.verification.documentNumber} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {buyer.status !== 'Verified' && (
                            <button type="button" className="btn btn-success" onClick={() => updateUserStatus(buyer._id, 'Verified')}>
                                Verified
                            </button>
                        )}
                        {buyer.status !== 'Unverified' && (
                            <button type="button" className="btn btn-danger" onClick={() => handleReject(buyer._id)}>
                                Unverified
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "#000" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: "transparent", position: "relative" }}>
                            <div className="align-items-center" style={{ height: "100%", backgroundColor: "transparent" }}>
                                <img src={filePreview} alt="Document Preview" className="img-fluid" style={{ width: "100%", height: "400px", backgroundColor: "transparent" }} />
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        zIndex: 10,
                                    }}
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default VerifyModal;
