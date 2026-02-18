import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AccountVerification = ({ userId }) => {
    const [verificationType, setVerificationType] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState('');

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
                toast.error('Please enter a valid Driving License number (e.g., DL-01-1234567890123)');
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
            const url = `${process.env.REACT_APP_API_URL}/auth/updateverificationdetails/${userId}`;
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

    return (
        <div className="body">
            <h5 className="mb-2">Account Verification</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Document Type</label>
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
                            <label>{verificationType} Number</label>
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
                            <label>Upload Document (PDF, JPG, PNG)</label>
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
                                    <img src={filePreview} alt="Uploaded Document" className="img-fluid" style={{ width: '250px', height: '150px' }} />
                                )}
                            </div>
                        )}
                    </>
                )}
                <button type="submit" className="btn btn-primary mt-3">Update</button>
            </form>
        </div>
    );
};

export default AccountVerification;
