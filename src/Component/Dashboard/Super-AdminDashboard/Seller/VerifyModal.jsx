import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import putAPI from "../../../../api/putAPI";
import axios from 'axios';
import { useConfirm } from '../../StatusConfirm';

const VerifyModal = ({ seller, onClose, refreshSellers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const confirm = useConfirm();
    const [loading, setLoading] = useState(false); 

    const [formData, setFormData] = useState({
        gstNumber: '',
        panNumber: '',
        documents: {
            gst: null,
            pan: null
        }
    });

    useEffect(() => {
        if (seller?._id) {
            axios.get(`http://localhost:3001/auth/gettaxlegalcompliance/${seller._id}`)
                .then(response => {
                    if (response.data?.compliance) {
                        setFormData(prev => ({
                            ...prev,
                            ...response.data.compliance,
                            documents: { ...prev.documents, ...response.data.compliance.documents }
                        }));
                    }
                })
                .catch(() => console.log("Fetch attempt completed"));
        }
    }, [seller]);

    const updateUserStatus = async (userId, status) => {
        setLoading(true);
        try {
            await putAPI(`http://localhost:3001/auth/updateuserstatus/${userId}`, { status }, {}, true);
            toast[status === 'Verified' ? 'success' : 'error'](`User status is ${status}`);
            refreshSellers();
            onClose();
        } catch (error) {
            console.error("Error updating user status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = (userId) => {
        confirm(() => updateUserStatus(userId, 'Unverified'), "Are you sure you want to reject this user?");
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderDocumentPreview = (fileOrUrl) => {
        if (!fileOrUrl) return null;

        const fileUrl = typeof fileOrUrl === 'string' ? `http://localhost:3001${fileOrUrl}` : URL.createObjectURL(fileOrUrl);

        return fileUrl.includes('.pdf') ? (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                View PDF
            </a>
        ) : (
            <img
                src={fileUrl}
                alt="Uploaded Document"
                className="img-thumbnail"
                width="100"
                onClick={() => openModal(fileUrl)}
                style={{ cursor: 'pointer' }}
            />
        );
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Verified Seller</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="row clearfix">
                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" value={seller?.name} readOnly />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control" value={seller?.lastName} readOnly />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" value={seller?.email} readOnly />
                                </div>
                            </div>
                                 
                        <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="text" className="form-control" id="phone" value={seller?.phone} readOnly />
                                </div>
                            </div>
                        </div>

                   

                        <form>
                            {['gst', 'pan'].map((field, index) => (
                                <div key={index} className="row clearfix mb-3">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <label>
                                                {field.toUpperCase()} Number <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData[`${field}Number`] || ''}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <label>Upload Document</label>
                                            <div className="mt-2">{renderDocumentPreview(formData.documents[field])}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>

                   
                    <div className="modal-footer">
                        {seller.status !== 'Verified' && (
                            <button type="button" className="btn btn-success" onClick={() => updateUserStatus(seller._id, 'Verified')}>
                                Verified
                            </button>
                        )}
                        {seller.status !== 'Unverified' && (
                            <button type="button" className="btn btn-danger" onClick={() => handleReject(seller._id)}>
                                Unverified
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && selectedImage && (
                <div className="modal fade show d-block" style={{ backgroundColor: "#000" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: 'transparent', position: 'relative' }}>
                            <div className="align-items-center">
                                <img
                                    src={selectedImage}
                                    alt="Document Preview"
                                    className="img-fluid"
                                    style={{ width: '100%', height: '400px' }}
                                />
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
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
