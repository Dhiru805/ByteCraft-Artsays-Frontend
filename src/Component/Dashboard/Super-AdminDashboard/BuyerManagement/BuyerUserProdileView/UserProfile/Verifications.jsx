import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AccountVerification = ({ userId }) => {
    const [verificationType, setVerificationType] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchVerificationData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/verificationdetails/${userId}`);
                const data = response.data.verification;
    
                if (data) {
                    setVerificationType(data.documentType || '');  
                    setDocNumber(data.documentNumber || ''); 
                    if (data.documentFile) {  
                        setFilePreview(`${process.env.REACT_APP_API_URL}/${data.documentFile}`);
                        setFileType(data.documentFile.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching verification details');
            }
        };
    
        fetchVerificationData();
    }, [userId]);


    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="body">
            <h5 className="mb-2">Account Verification</h5>
            <hr className="mt-1" />
            <form >
                <div className="form-group">
                    <label>Select Document Type</label>
                    <select
                        className="form-control"
                        value={verificationType}
                        disabled
                    >
                        <option value="">Select</option>
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Passport">Passport</option>
                    </select>
                </div>
                {verificationType && (
                    <>
                        <div className="form-group mt-2">
                            <label>{verificationType} Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={docNumber}
                                disabled
                                placeholder={`Enter ${verificationType} Number`}
                                
                            />
                        </div>
                        
                        {filePreview && (
                            <div className="mt-3">
                                {fileType === 'application/pdf' ? (
                                    <div>
                                        <a
                                            href={filePreview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            View PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img src={filePreview} alt="Uploaded Document" 
                                    onClick={handleImageClick}
                                    className="img-fluid" style={{ width: '250px', height: '150px' }} />
                                )}
                            </div>
                        )}
                    </>
                )}
                
            </form>
            {isModalOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: "transparent", position: "relative" }}>
                            <div className="align-items-center" style={{ height: "100%", backgroundColor: "transparent" }}>
                                <img
                                    src={filePreview}
                                    alt="Document Preview"
                                    className="img-fluid"
                                    style={{ width: "100%", height: "400px", backgroundColor: "transparent" }}
                                />
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

export default AccountVerification;
