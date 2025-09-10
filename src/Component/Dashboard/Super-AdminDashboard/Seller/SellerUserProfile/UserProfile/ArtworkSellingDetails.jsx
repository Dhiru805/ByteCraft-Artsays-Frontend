import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';
import getAPI from '../../../../../../api/getAPI';

const ArtworkPricingDetails = ({ userId }) => {
    const [loading,setLoading]=useState(false);

    const [formData, setFormData] = useState({
        sampleArtwork: null,
        typeOfSeller: [],
        categoryOfArt: [],
        artStyleSpecialization: [],
        experienceInSellingArt: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!userId) {
                console.warn("User ID is undefined. Cannot fetch details.");
                return;
            }
            try {
                const url = `/auth/getsellartwork/${userId}`;
                const result = await getAPI(url);

                if (result?.data?.artwork) {
                    const artworkData = result.data.artwork;
                    setFormData({
                        sampleArtwork: artworkData.sampleArtwork ? ensureBase64Format(artworkData.sampleArtwork) : null,
                        typeOfSeller: artworkData.typeOfSeller || [],
                        categoryOfArt: artworkData.categoryOfArt || [],
                        artStyleSpecialization: artworkData.artStyleSpecialization || [],
                        experienceInSellingArt: artworkData.experienceInSellingArt || ''
                    });
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
        return base64String.startsWith("data:image") ? base64String : `data:image/jpeg;base64,${base64String}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `/auth/updatesellartwork/${userId}`;
            const result = await putAPI(url, formData);
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

    const handleChange = (selectedOptions, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOptions
                ? selectedOptions.map(option => option.value.charAt(0).toUpperCase() + option.value.slice(1))
                : []
        }));
    };


    const handleSingleSelectChange = (selectedOption, field) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleImageClick = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const sellerOptions = [
        { value: 'artist', label: 'Artist' },
        { value: 'gallery', label: 'Gallery' },
        { value: 'collector', label: 'Collector' },
        { value: 'business', label: 'Business' },
    ];

    const categoryOptions = [
        { value: 'painting', label: 'Painting' },
        { value: 'sculpture', label: 'Sculpture' },
        { value: 'photography', label: 'Photography' },
        { value: 'digital', label: 'Digital Art' },
        { value: 'handicrafts', label: 'Handicrafts' }
    ];

    const artStyleOptions = [
        { value: 'abstract', label: 'Abstract' },
        { value: 'contemporary', label: 'Contemporary' },
        { value: 'realism', label: 'Realism' },
        { value: 'impressionism', label: 'Impressionism' }
    ];


    const experienceOptions = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'professional', label: 'Professional' },
    ];

    const validateRequiredFields = () => {
    const missing = [];

    if (!formData.typeOfSeller || formData.typeOfSeller.length === 0)
        missing.push("Type of Seller");

    if (!formData.categoryOfArt || formData.categoryOfArt.length === 0)
        missing.push("Category of Art");

    if (!formData.artStyleSpecialization || formData.artStyleSpecialization.length === 0)
        missing.push("Art Style Specialization");

    if (!formData.experienceInSellingArt)
        missing.push("Experience in Selling Art");

    if (!formData.sampleArtwork)
        missing.push("Sample Artwork");

    if (missing.length > 0) {
        toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
        return false;
    }

    return true;
};


    return (
        <div className="body">
            <h5 className="mb-2">Artwork And Selling Details</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Type of Seller <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                options={sellerOptions}
                                value={sellerOptions.find(option => option.value === formData.typeOfSeller)}
                                onChange={(selectedOption) => handleSingleSelectChange(selectedOption, 'typeOfSeller')}
                                classNamePrefix="select"
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Category of Art <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={categoryOptions}
                                value={formData.categoryOfArt.map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}
                                onChange={(selectedOptions) => handleChange(selectedOptions, 'categoryOfArt')}
                                classNamePrefix="select"
                            />
                        </div>
                    </div>


                </div>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Art Style Specialization <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={artStyleOptions}
                                value={formData.artStyleSpecialization.map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}
                                onChange={(selectedOptions) => handleChange(selectedOptions, 'artStyleSpecialization')}
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
                            <label>Experience in Selling Art <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                options={experienceOptions}
                                value={experienceOptions.find(option => option.value === formData.experienceInSellingArt)}
                                onChange={(selectedOption) => handleSingleSelectChange(selectedOption, 'experienceInSellingArt')}
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
                    disabled={loading}
                    onClick={(e) => {
                        if (!validateRequiredFields()) return;
                        setLoading(true);
                        Promise.resolve(handleSubmit(e))
                            .catch(console.error)
                            .finally(() => setLoading(false));
                    }}
                >{loading ? "Updating..." : "Update"}</button>
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
