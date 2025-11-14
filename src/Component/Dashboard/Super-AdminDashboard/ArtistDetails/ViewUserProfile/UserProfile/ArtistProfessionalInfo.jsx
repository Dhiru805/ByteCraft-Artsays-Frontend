import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';
 

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



    return (
        <div className="body">
            <h5 className="mb-2">Artist Professional Info</h5>
            <hr className="mt-1" />
            <form >
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="artistName">Artist Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="artistName"
                                placeholder="Artist Name"
                                name="artistName"
                                value={formData.artistName}
                               disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="artCategories">Art Categories/Styles</label>
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
                                isDisabled
                                classNamePrefix="select"
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="mediumUsed">Medium Used</label>
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
                                isDisabled
                                classNamePrefix="select"
                            />

                        </div>


                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="portfolioLink">Portfolio Link</label>
                            <input
                                type="url"
                                className="form-control"
                                id="portfolioLink"
                                placeholder="Portfolio Link"
                                name="portfolioLink"
                                value={formData.portfolioLink}
                                disabled
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
                                isDisabled
                                classNamePrefix="select"
                            />

                        </div>
                        <div className="form-group">
                            <label htmlFor="yearsOfExperience">Years of Experience</label>
                            <input
                                type="number"
                                className="form-control"
                                id="yearsOfExperience"
                                placeholder="Years of Experience"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                disabled
                            />
                        </div>

                    </div>

                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        placeholder="Enter a brief description about the artist"
                        value={formData.description}
                        disabled
                    ></textarea>
                </div>
            </form>
        </div>
    );
};

export default ArtistInfo;