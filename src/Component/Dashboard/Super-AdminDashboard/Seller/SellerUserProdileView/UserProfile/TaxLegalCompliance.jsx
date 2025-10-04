import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;


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

    return (
        <div className="body">
            <h5 className="mb-2">Tax & Legal Compliance</h5>
            <hr className="mt-1" />
            <form >
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
                                    disabled
                                />
                                {/* {errors[`${field}Number`] && <small className="text-danger">{errors[`${field}Number`]}</small>} */}

                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                                <label>
                                    Upload Document {field === 'businessCert' ? "(Optional)" : <span style={{ color: 'red' }}>*</span>}
                                </label>


                                {/* {errors[field] && <small className="text-danger">{errors[field]}</small>} */}
                                <div className="mt-2">{renderDocumentPreview(formData.documents[field])}</div>
                            </div>
                        </div>
                    </div>
                ))}
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
