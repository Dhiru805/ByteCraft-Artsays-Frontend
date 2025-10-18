import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';
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

const ArtistInfo = ({ userId, loading }) => {
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
                const response = await getAPI(`/auth/getartistdetails/${userId}`);
                if (response.data) {
                    setFormData({
                        ...response.data,
                        artCategories: response.data.artCategories.length ? response.data.artCategories[0].split(',') : [],
                        mediumUsed: response.data.mediumUsed.length ? response.data.mediumUsed[0].split(',') : [],
                        achievements: response.data.achievements.length ? response.data.achievements[0].split(',') : [],
                    });
                    console.log("Artist details fetched successfully:", response.data);
                }
            } catch (error) {
                console.log("Fetch attempt completed");
            }
        };

        if (userId) {
            fetchArtistData();
        }
    }, [userId]);
    const [mainCategories, setMainCategories] = useState([]);
    useEffect(() => {
        const fetchMainCategories = async () => {
            try {
                const response = await getAPI("/api/main-category", true);
                if (!response.hasError) {
                    setMainCategories(response.data.data);
                    console.log("Main Categories fetched successfully:", response.data.data);
                } else {
                    toast.error(`Failed to fetch Main Categories: ${response.message}`);
                }
            } catch (error) {
                toast.error("An error occurred while fetching main categories.");
            }
        };
        fetchMainCategories();
    }, []);

    const capitalize = (text) => {
        return text
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const handleMultiSelectChange = (selectedOptions, field) => {
        if (selectedOptions && selectedOptions.length > 0) {
            const values = selectedOptions.map(option => capitalize(option.value));
            setFormData(prevState => ({ ...prevState, [field]: values }));
        }
    };

    const [load, setLoad] = useState(false);

    console.log(formData)
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Form data to be submitted:", formData);
        try {
            // First update artist details
            const url = `/auth/updateartistdetails/${userId}`;
            const result = await putAPI(url, {
                ...formData,
                mediumUsed: formData.mediumUsed.join(','),
                achievements: formData.achievements.join(','),
            });

            if (result) {
                toast.success('Artist details updated successfully');

                // ✅ Now call set-artist-categories API
                const categoryResult = await putAPI("/api/set-artist-categories", {
                    userId,
                    artCategories: formData.artCategories, // send as array of IDs
                });

                if (!categoryResult.hasError) {
                    toast.success("Artist categories updated successfully");
                } else {
                    toast.error("Failed to update artist categories");
                }
            } else {
                toast.error('Failed to update artist details');
            }
        } catch (error) {
            toast.error('Error updating artist details');
        }
    };


    const validateRequiredFields = () => {
        const missing = [];
        const requiredMap = {
            'Art Categories': formData.artCategories.length,
            'Medium Used': formData.mediumUsed.length,
            'Years of Experience': formData.yearsOfExperience,
            'Portfolio Link': formData.portfolioLink,
            'Achievements': formData.achievements.length
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
            <h5 className="mb-2">Artist Professional Info</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="artCategories">Art Categories/Styles <span style={{ color: 'red' }}>*</span></label>
                            <CreatableSelect
                                isMulti
                                options={mainCategories.map(item => ({
                                    value: item._id,
                                    label: capitalize(item?.mainCategoryName),
                                }))}
                                value={formData.artCategories.map(catId => {
                                    const matched = mainCategories.find(cat => cat._id === catId);
                                    return matched
                                        ? { value: matched._id, label: capitalize(matched.mainCategoryName) }
                                        : { value: catId, label: catId };
                                })}
                                onChange={(selectedOptions) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        artCategories: selectedOptions.map(opt => opt.value),
                                    }))
                                }
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
                            <label htmlFor="achievements">Achievements (List of notable works, exhibitions, or awards)</label>
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
        </div>
    );
};

export default ArtistInfo;