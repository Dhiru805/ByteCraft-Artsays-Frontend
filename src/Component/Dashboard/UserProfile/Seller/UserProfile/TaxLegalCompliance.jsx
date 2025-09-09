import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { toast } from 'react-toastify';

const TaxLegalCompliance = ({ userId }) => {
    const [formData, setFormData] = useState({
        gstNumber: '',
        panNumber: '',
        tanNumber: '',
        cinNumber: '',
        aadhaarNumber: '',
        businessCertNumber: '',
        documents: {
            gst: null,
            pan: null,
            tan: null,
            cin: null,
            aadhaar: null,
            businessCert: null,
        },
    });

    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await getAPI(`/auth/gettaxlegalcompliance/${userId}`);
                if (response.data && response.data.compliance) {
                    const complianceData = response.data.compliance;
                    setFormData((prev) => ({
                        ...prev,
                        ...complianceData,
                        documents: { ...prev.documents, ...complianceData.documents },
                    }));
                }
            } catch (error) {
                console.log("Fetch attempt completed");
            }
        };

        if (userId) {
            fetchBusinessData();
        }
    }, [userId]);
    const handleFileChange = (event, field) => {
        const file = event.target.files[0];
        setFormData((prev) => ({
            ...prev,
            documents: {
                ...prev.documents,
                [field]: file
            }
        }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateForm = () => {
        const requiredFields = ['gst', 'pan', 'tan', 'cin', 'aadhaar'];
        let newErrors = {};

        requiredFields.forEach(field => {
            if (!formData[`${field}Number`]) {
                newErrors[`${field}Number`] = `${field.toUpperCase()} number is required.`;
            }
            if (!formData.documents[field]) {
                newErrors[field] = `${field.toUpperCase()} document is required.`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please upload all required documents.");
            return;
        }

        try {
            const url = `/auth/updatetaxlegalcompliance/${userId}`;
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (key !== 'documents') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            Object.keys(formData.documents).forEach(key => {
                const fileOrUrl = formData.documents[key];
                if (fileOrUrl instanceof File) {
                    formDataToSend.append(key, fileOrUrl);
                } else if (typeof fileOrUrl === 'string') {
                    formDataToSend.append(`${key}_existing`, fileOrUrl);
                }
            });

            const result = await putAPI(url, formDataToSend, {
                'Content-Type': 'multipart/form-data'
            });

            if (result) {
                toast.success(result.data.message || 'Tax and Legal Compliance details updated successfully');
            } else {
                toast.error(result.data.message.error || 'Failed to update details');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                Object.values(validationErrors).forEach(errorMessage => {
                    toast.error(errorMessage);
                });
            } else {
                toast.error(error.response?.data?.message || 'Error updating details');
            }
        }

    };


    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const renderDocumentPreview = (fileOrUrl) => {
        if (!fileOrUrl) return null;

        if (typeof fileOrUrl === 'string') {
            if (fileOrUrl.includes('.pdf')) {
                return (
                    <a href={`${BASE_URL}${fileOrUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                        View PDF
                    </a>
                );
            } else {
                return (
                    <img
                        src={`${BASE_URL}${fileOrUrl}`}
                        alt="Uploaded Document"
                        className="img-thumbnail"
                        width="100"
                        onClick={() => openModal(`${BASE_URL}${fileOrUrl}`)}
                        style={{ cursor: 'pointer' }}
                    />
                );
            }
        } else if (fileOrUrl instanceof File) {
            const fileType = fileOrUrl.type;
            if (fileType.includes('pdf')) {
                return (
                    <a href={URL.createObjectURL(fileOrUrl)} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                        View PDF
                    </a>
                );
            } else if (fileType.includes('image')) {
                return (
                    <img
                        src={URL.createObjectURL(fileOrUrl)}
                        alt="Uploaded Document"
                        className="img-thumbnail"
                        width="100"
                        onClick={() => openModal(URL.createObjectURL(fileOrUrl))}
                        style={{ cursor: 'pointer' }}
                    />
                );
            }
        }
        return null;
    };

    const validateRequiredFields = () => {
    const missing = [];

    const requiredMap = {
        'GST Number': formData.gstNumber,
        'PAN Number': formData.panNumber,
        'TAN Number': formData.tanNumber,
        'CIN Number': formData.cinNumber,
        'Aadhaar Number': formData.aadhaarNumber,
        'GST Document': formData.documents.gst,
        'PAN Document': formData.documents.pan,
        'TAN Document': formData.documents.tan,
        'CIN Document': formData.documents.cin,
        'Aadhaar Document': formData.documents.aadhaar
    };

    Object.entries(requiredMap).forEach(([label, value]) => {
        if (!value || String(value).trim?.() === '') {
            missing.push(label);
        }
    });

    if (missing.length > 0) {
        toast.warn(`Please fill the required fields.`);
        return false;
    }

    return true;
};

    return (
        <div className="body">
            <h5 className="mb-2">Tax & Legal Compliance</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                {['gst', 'pan', 'tan', 'cin', 'aadhaar', 'businessCert'].map((field, index) => (
                    <div key={index} className="row clearfix mb-3">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label htmlFor={field}>{field.toUpperCase()} Number {field === 'businessCert' ? "(Optional)" : <span style={{ color: 'red' }}>*</span>}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={field}
                                    placeholder={`${field.toUpperCase()} Number`}
                                    name={field}
                                    value={formData[`${field}Number`] || ''}
                                    onChange={(e) => setFormData({ ...formData, [`${field}Number`]: e.target.value })}
                                />
                                {/* {errors[`${field}Number`] && <small className="text-danger">{errors[`${field}Number`]}</small>} */}

                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label>
                                    Upload Document {field === 'businessCert' ? "(Optional)" : <span style={{ color: 'red' }}>*</span>}
                                </label>

                                <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(e, field)} />
                                {/* {errors[field] && <small className="text-danger">{errors[field]}</small>} */}
                                <div className="mt-2">{renderDocumentPreview(formData.documents[field])}</div>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button"
                    className="btn btn-primary mx-2"
                    disabled={loading}
                    onClick={(e) => {
                         if (!validateRequiredFields()) return;
                        setLoading(true);
                        Promise.resolve(handleSubmit(e))
.then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000 ms = 2 second delay
        })                            .catch(console.error)
                            .finally(() => setLoading(false));
                    }}
                >{loading ? "Updating..." : "Update"}</button>
            </form>

            {/* Modal */}
            {isModalOpen && selectedImage && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: 'transparent', position: 'relative' }}>
                            <div className="align-items-center" style={{ height: '100%', backgroundColor: 'transparent' }}>
                                <img
                                    src={selectedImage}
                                    alt="Sample Artwork"
                                    className="img-fluid"
                                    style={{ width: '100%', height: '400px', backgroundColor: 'transparent' }}
                                />
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
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

export default TaxLegalCompliance;
