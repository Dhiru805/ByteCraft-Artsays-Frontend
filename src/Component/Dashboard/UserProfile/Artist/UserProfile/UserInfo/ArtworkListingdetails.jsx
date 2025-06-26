import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';
import getAPI from '../../../../../../api/getAPI';

const ArtworkPricingDetails = ({ userId,loading }) => {
    const [formData, setFormData] = useState({
        minArtworkPrice: '',
        customOrders: false,
        commissionTerms: [],
        preferredPaymentMethod: [],
        sampleArtwork: null
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (!userId) {
                    console.warn("User ID is undefined. Cannot fetch details.");
                    return;
                }

                const url = `/auth/artworkdetails/${userId}`;
                const result = await getAPI(url);

                if (result?.data?.artwork) {
                    const artworkData = result.data.artwork;

                    setFormData({
                        minArtworkPrice: artworkData.minArtworkPrice || '',
                        customOrders: artworkData.customOrders || false,
                        commissionTerms: artworkData.commissionTerms || [],
                        preferredPaymentMethod: artworkData.preferredPaymentMethod || [],
                        sampleArtwork: artworkData.sampleArtwork
                            ? ensureBase64Format(artworkData.sampleArtwork)
                            : null
                    });

                    console.log("Updated Form Data:", artworkData);
                } else {
                    console.warn("No artwork data found in API response.");
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };

        fetchDetails();
    }, [userId]);

    const ensureBase64Format = (base64String) => {
        if (!base64String.startsWith("data:image")) {
            return `data:image/jpeg;base64,${base64String}`;
        }
        return base64String;
    };

    const handleRadioChange = (event) => {
        setFormData(prevData => ({
            ...prevData,
            customOrders: event.target.value === 'yes'
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFormData(prevData => ({
                    ...prevData,
                    sampleArtwork: reader.result
                }));
            };
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.minArtworkPrice) {
            toast.error("Minimum Artwork Price is required.");
            return;
        }

        const dataToSend = {
            minArtworkPrice: formData.minArtworkPrice,
            customOrders: formData.customOrders,
            commissionTerms: formData.commissionTerms,
            preferredPaymentMethod: formData.preferredPaymentMethod,
            sampleArtwork: formData.sampleArtwork
        };

        try {
            const url = `/auth/updateartworkdetails/${userId}`;
            const result = await putAPI(url, dataToSend);

            if (result) {
                toast.success('Artwork details updated successfully');
            } else {
                toast.error('Failed to update artwork details');
            }
        } catch (error) {
            console.error("Error updating artwork details:", error);
            toast.error('Error updating artwork details');
        }
    };

    const commissionOptions = [
        { value: "FIXED PRICING", label: "FIXED PRICING" },
        { value: "NEGOTIABLE", label: "NEGOTIABLE" },
        { value: "HOURLY RATE", label: "HOURLY RATE" }
    ];

    const paymentOptions = [
        { value: "BANK TRANSFER", label: "BANK TRANSFER" },
        { value: "UPI", label: "UPI" }
    ];


    const handleImageClick = () => {
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const validateRequiredFields = () => {
    const missing = [];

    const requiredMap = {
        'Minimum Artwork Price': formData.minArtworkPrice,
        'Commission Terms'     : formData.commissionTerms.length,
        'Preferred Payment Method': formData.preferredPaymentMethod.length,
        'Sample Artwork'       : formData.sampleArtwork,
    };

    Object.entries(requiredMap).forEach(([label, value]) => {
        if (!value || String(value).trim?.() === '' || value === 0) {
            missing.push(label);
        }
    });

    if (missing.length > 0) {
        toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
        return false;
    }

    return true;
};

    return (
        <div className="body">
            <h5 className="mb-2">Artwork Listing And Details</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Minimum Artwork Price <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                name="minArtworkPrice"
                                value={formData.minArtworkPrice}
                                onChange={(e) => setFormData({ ...formData, minArtworkPrice: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Available for Custom Orders? <span style={{ color: 'red' }}>*</span></label>
                            <div className="d-flex align-items-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="customOrders"
                                        value="yes"
                                        checked={formData.customOrders}
                                        onChange={handleRadioChange}
                                    />
                                    <label className="form-check-label">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="customOrders"
                                        value="no"
                                        checked={!formData.customOrders}
                                        onChange={handleRadioChange}
                                    />
                                    <label className="form-check-label">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Commission Terms <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={commissionOptions}
                                value={formData.commissionTerms.map(term => ({
                                    value: term,
                                    label: term.charAt(0).toUpperCase() + term.slice(1).toLowerCase()
                                }))}
                                onChange={(selectedOptions) => {
                                    setFormData(prevData => ({
                                        ...prevData,
                                        commissionTerms: selectedOptions.map(option =>
                                            option.value.toUpperCase()
                                        )
                                    }));
                                }}
                                classNamePrefix="select"
                            />
                        </div>
                        <div className="form-group">
                            <label>Sample Artwork <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Preferred Payment Method <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                isMulti
                                options={paymentOptions}
                                value={formData.preferredPaymentMethod.map(method => ({
                                    value: method,
                                    label: method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
                                }))}
                                onChange={(selectedOptions) => {
                                    setFormData(prevData => ({
                                        ...prevData,
                                        preferredPaymentMethod: selectedOptions.map(option =>
                                            option.value.toUpperCase()
                                        )
                                    }));
                                }}
                                classNamePrefix="select"
                            />
                        </div>
                        {formData.sampleArtwork && (
                            <div
                                className="col-lg-4 d-flex justify-content-center align-items-center"
                                onClick={handleImageClick}
                            >
                                <img
                                    src={formData.sampleArtwork}
                                    alt="Sample Artwork"
                                    className="img-fluid border rounded shadow"
                                    style={{ width: "250px", height: "100px", objectFit: "cover", cursor: 'pointer' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <button type="button"
                    className="btn btn-primary mx-2"
                    disabled={load}
                    onClick={(e) => {
                        if (!validateRequiredFields()) return;
                        setLoad(true);
                        Promise.resolve(handleSubmit(e))
                            .then(() => {
                                window.location.reload();
                            })
                            .catch(console.error)
                            .finally(() => setLoad(false));
                    }}
                >{load ? "Updating..." : "Update"}</button>
            </form>


            {isModalOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered" >
                        <div className="modal-content" style={{ backgroundColor: 'transparent', position: 'relative' }}>
                            <div className="align-items-center" style={{ height: '100%', backgroundColor: 'transparent' }}>
                                <img
                                    src={formData.sampleArtwork}
                                    alt="Sample Artwork"
                                    className="img-fluid"
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary "
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        zIndex: 10,
                                    }}
                                >
                                    <i className="fa fa-times" ></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ArtworkPricingDetails;
