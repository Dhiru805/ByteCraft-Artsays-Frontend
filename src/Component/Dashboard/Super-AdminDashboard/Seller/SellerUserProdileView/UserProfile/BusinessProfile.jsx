import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getAPI from '../../../../../../api/getAPI';


const BusinessProfile = ({ userId }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        businessDescription: '',
        website: '',
    });

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await getAPI(`/auth/getbusinessprofile/${userId}`);
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

 

    return (
        <div className="body">
            <h5 className="mb-2">Business Profile</h5>
            <hr className="mt-1" />
            <form >
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
                                disabled
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
                                disabled
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
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BusinessProfile;
