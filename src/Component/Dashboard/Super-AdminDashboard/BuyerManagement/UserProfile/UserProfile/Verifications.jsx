import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import getAPI from '../../../../../../api/getAPI';

const AccountVerification = ({ userId }) => {
    const [verificationType, setVerificationType] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const [loading,setLoading]=useState(false);


    useEffect(() => {
        const fetchVerificationData = async () => {
            try {
                const response = await getAPI(`/auth/verificationdetails/${userId}`);
                const data = response.data.verification;
    
                if (data) {
                    setVerificationType(data.documentType || '');  
                    setDocNumber(data.documentNumber || ''); 
                    if (data.documentFile) {  
                        setFilePreview(`${BASE_URL}/${data.documentFile}`);
                        setFileType(data.documentFile.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching verification details');
            }
        };
    
        fetchVerificationData();
    }, [userId]);

    const handleVerificationChange = (event) => {
        setVerificationType(event.target.value);
        setDocNumber('');
        setFile(null);
        setFilePreview(null);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.warn('Only PDF, JPG, and PNG files are allowed');
                return;
            }
            setFile(selectedFile);
            setFileType(selectedFile.type);

            if (selectedFile.type === 'application/pdf') {
                setFilePreview(URL.createObjectURL(selectedFile));
            } else {
                const reader = new FileReader();
                reader.onload = () => setFilePreview(reader.result);
                reader.readAsDataURL(selectedFile);
            }
        }
    };

    const validateDocumentNumber = () => {
        if (verificationType === 'Aadhar Card') {
            const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
            if (!aadhaarRegex.test(docNumber)) {
                toast.error('Please enter a valid 12-digit Aadhaar number');
                return false;
            }
        } else if (verificationType === 'Driving License') {
            const drivingLicenseRegex = /^[A-Z]{2}-\d{2}-\d{8}$/;
            if (!drivingLicenseRegex.test(docNumber)) {
                toast.error('Please enter a valid Driving License number (e.g., DL-01-12356458)');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

    
        if (!validateDocumentNumber()) {
            return;
        }

        if (!verificationType || !docNumber || !file) {
            toast.warn('Please complete all fields');
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('verificationType', verificationType);
        formData.append('docNumber', docNumber);
        formData.append('file', file);

        try {
            const url = `/auth/updateverificationdetails/${userId}`;
            const response = await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Verification details updated successfully');
            } else {
                toast.error('Failed to update verification details');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating verification details');
        }
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const validateRequiredFields = () => {
        const missing = [];
    
        if (!verificationType) {
            missing.push("Document Type");
        }
    
        if (!docNumber.trim()) {
            missing.push("Document Number");
        }
    
        if (!file) {
            missing.push("Document File (please upload a new file)");
        }
    
        if (missing.length > 0) {
            toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
            return false;
        }
    
        return true;
    };
    
    return (
        <div className="body">
            <h5 className="mb-2">Account Verification</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Document Type <span style={{ color: 'red' }}>*</span></label>
                    <select
                        className="form-control"
                        value={verificationType}
                        onChange={handleVerificationChange}
                        required
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
                            <label>{verificationType} Number <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={docNumber}
                                onChange={(e) => setDocNumber(e.target.value)}
                                placeholder={`Enter ${verificationType} Number`}
                                required
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label>Upload Document (PDF, JPG, PNG) <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                accept=".pdf, .jpg, .jpeg, .png"
                                onChange={handleFileChange}
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
        <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading}
          onClick={(e) => {
            if (!validateRequiredFields()) return;
            setLoading(true);
            Promise.resolve(handleSubmit(e))
              .then(() => {
                 window.location.reload();
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }}
        >{loading ? "Updating..." : "Update"}</button>
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
