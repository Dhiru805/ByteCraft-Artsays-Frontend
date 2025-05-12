import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';

const BusinessProfile = ({ userId }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        businessDescription: '',
        website: '',
    });

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/auth/getbusinessprofile/${userId}`);
                if (response.data) {
                    setFormData({
                        ...response.data,
                    });
                }
            } catch (error) {
                console.log("Fetch attempt completed");
            }
        };

        if (userId) {
            fetchBusinessData();
        }
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `http://localhost:3001/auth/updatebusinessprofile/${userId}`;
            const result = await putAPI(url, {
                ...formData,
            });

            if (result) {
                toast.success('Business details updated successfully');
            } else {
                toast.error('Failed to update business details');
            }
        } catch (error) {
            toast.error('Error updating business details');
        }
    };

    return (
        <div className="body">
            <h5 className="mb-2">Business Profile</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                            <label htmlFor="businessName">Business Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="businessName"
                                placeholder="Business Name"
                                name="businessName"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <input
                                type="url"
                                className="form-control"
                                id="website"
                                placeholder="Website URL"
                                name="website"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                            <label htmlFor="businessDescription">Business Description</label>
                            <textarea
                                className="form-control"
                                id="businessDescription"
                                placeholder="Business Description"
                                name="businessDescription"
                                rows="4"
                                value={formData.businessDescription}
                                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mx-2">Update</button>
            </form>
        </div>
    );
};

export default BusinessProfile;
