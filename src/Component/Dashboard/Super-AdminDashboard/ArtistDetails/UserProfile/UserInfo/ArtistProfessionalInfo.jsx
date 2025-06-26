import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';
import putAPI from '../../../../../../api/putAPI';

const predefinedArtCategories = [
    { value: 'Mandala', label: 'Mandala' },
    { value: 'Abstract', label: 'Abstract' },
    { value: 'Watercolor', label: 'Watercolor' },
    { value: 'Digital', label: 'Digital' },
];

const predefinedMediumUsed = [
    { value: 'Canvas', label: 'Canvas' },
    { value: 'Acrylic', label: 'Acrylic' },
    { value: 'Digital', label: 'Digital' },
    { value: 'Oil', label: 'Oil' },
    { value: 'Pencil Sketch', label: 'Pencil Sketch' },
];

const predefinedAchievements = [
    { value: 'List of notable works', label: 'List of notable works' },
    { value: 'Exhibitions', label: 'Exhibitions' },
    { value: 'Awards', label: 'Awards' },
];

const ArtistInfo = ({ userId }) => {
    const [formData, setFormData] = useState({
        artCategories: [],
        mediumUsed: [],
        yearsOfExperience: '',
        portfolioLink: '',
        achievements: [],
    });

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const response = await axios.get(`/auth/getartistdetails/${userId}`);
                if (response.data) {
                    setFormData({
                        ...response.data,
                        artCategories: response.data.artCategories.length ? response.data.artCategories[0].split(',') : [],
                        mediumUsed: response.data.mediumUsed.length ? response.data.mediumUsed[0].split(',') : [],
                        achievements: response.data.achievements.length ? response.data.achievements[0].split(',') : [],
                    });
                }
            } catch (error) {
                console.log("Fetch attempt completed");
            }
        };

        if (userId) {
            fetchArtistData();
        }
    }, [userId]);

    const capitalize = (text) => {
        return text
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

const [loading,setLoading]=useState(false);

    const handleMultiSelectChange = (selectedOptions, field) => {
        if (selectedOptions && selectedOptions.length > 0) {
            const values = selectedOptions.map(option => capitalize(option.value));
            setFormData(prevState => ({ ...prevState, [field]: values }));
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `/auth/updateartistdetails/${userId}`;
            const result = await putAPI(url, {
                ...formData,
                artCategories: formData.artCategories.join(','),
                mediumUsed: formData.mediumUsed.join(','),
                achievements: formData.achievements.join(','),
            });

            if (result) {
                toast.success('Artist details updated successfully');
            } else {
                toast.error('Failed to update artist details');
            }
        } catch (error) {
            toast.error('Error updating artist details');
        }
    };

    const validateRequiredFields = () => {
    const requiredFields = {
        'Artist Name': formData.artistName,
        'Art Categories': formData.artCategories?.length,
        'Medium Used': formData.mediumUsed?.length,
        'Portfolio Link': formData.portfolioLink,
        'Achievements': formData.achievements?.length,
        'Years of Experience': formData.yearsOfExperience,
        'Description': formData.description,
    };

    const missing = Object.entries(requiredFields)
        .filter(([_, value]) => !value || (typeof value === 'string' && value.trim() === ''))
        .map(([key]) => key);

    if (missing.length > 0) {
        toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
        return false;
    }

    return true;
};

    return (
        <div className="body">
            <h5 className="mb-2">Artist Professional Info</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="artistName">Artist Name <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="artistName"
                                placeholder="Artist Name"
                                name="artistName"
                                value={formData.artistName}
                                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="artCategories">Art Categories/Styles <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={predefinedArtCategories.map(item => ({
                                    value: capitalize(item.value),
                                    label: capitalize(item.label)
                                }))}
                                value={formData.artCategories.map(item => ({
                                    value: capitalize(item),
                                    label: capitalize(item)
                                }))}
                                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'artCategories')}
                                classNamePrefix="select"
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="mediumUsed">Medium Used <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={predefinedMediumUsed.map(item => ({
                                    value: capitalize(item.value),
                                    label: capitalize(item.label)
                                }))}
                                value={formData.mediumUsed.map(item => ({
                                    value: capitalize(item),
                                    label: capitalize(item)
                                }))}
                                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'mediumUsed')}
                                classNamePrefix="select"
                            />

                        </div>


                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="portfolioLink">Portfolio Link <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="url"
                                className="form-control"
                                id="portfolioLink"
                                placeholder="Portfolio Link"
                                name="portfolioLink"
                                value={formData.portfolioLink}
                                onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="achievements">Achievements (List of notable works, exhibitions, or awards) <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={predefinedAchievements.map(item => ({
                                    value: capitalize(item.value),
                                    label: capitalize(item.label)
                                }))}
                                value={formData.achievements.map(item => ({
                                    value: capitalize(item),
                                    label: capitalize(item)
                                }))}
                                onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'achievements')}
                                classNamePrefix="select"
                            />

                        </div>
                        <div className="form-group">
                            <label htmlFor="yearsOfExperience">Years of Experience <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                id="yearsOfExperience"
                                placeholder="Years of Experience"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                            />
                        </div>

                    </div>

                </div>
                <div className="form-group">
                    <label htmlFor="description">Description <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        placeholder="Enter a brief description about the artist"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>
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
        </div>
    );
};

export default ArtistInfo;