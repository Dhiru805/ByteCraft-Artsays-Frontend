import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import getAPI from '../../../../../../api/getAPI';

const ArtworkPricingDetails = ({ userId }) => {
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

    return (
        <div className="body">
            <h5 className="mb-2">Artwork And Selling Details</h5>
            <hr className="mt-1" />
            <form  encType="multipart/form-data">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Type of Seller</label>
                            <Select
                                options={sellerOptions}
                                value={sellerOptions.find(option => option.value === formData.typeOfSeller)}
                                isDisabled
                                classNamePrefix="select"
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Category of Art</label>
                            <CreatableSelect
                                isMulti
                                options={categoryOptions}
                                value={formData.categoryOfArt.map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}
                                isDisabled
                                classNamePrefix="select"
                            />
                        </div>
                    </div>


                </div>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Art Style Specialization</label>
                            <CreatableSelect
                                isMulti
                                options={artStyleOptions}
                                value={formData.artStyleSpecialization.map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}
                                isDisabled
                                classNamePrefix="select"
                            />
                        </div>
                        <div className="form-group">
                            <label>Sample Artwork</label>
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
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Experience in Selling Art</label>
                            <Select
                                options={experienceOptions}
                                value={experienceOptions.find(option => option.value === formData.experienceInSellingArt)}
                              isDisabled
                                classNamePrefix="select"
                            />
                        </div>
                      
                    </div>
                </div>

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
