import React, { useState, useEffect } from 'react';


const SocialLink = ({ userId, profileData }) => {
    const [formData, setFormData] = useState({
        instagram: '',
        facebook: '',
        youtube: '',
        linkdin: ''
    });

    useEffect(() => {
        if (profileData) {
            setFormData({
                instagram: profileData.instagram || '',
                facebook: profileData.facebook || '',
                youtube: profileData.youtube || '',
                linkdin: profileData.linkdin || ''
            });
        }
    }, [profileData]); 


  
    return (
        <div className="body">
            <h5 className="mb-2">Social Media Promotion</h5>
            <hr className="mt-1" />
            <form>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="instagram">Instagram</label>
                            <input
                                type="url"
                                className="form-control"
                                id="instagram"
                                placeholder="Instagram"
                                name="instagram"
                                value={formData.instagram}
                               disabled
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="facebook">Facebook</label>
                            <input
                                type="url"
                                className="form-control"
                                id="facebook"
                                placeholder="Facebook"
                                name="facebook"
                                value={formData.facebook}
                               disabled
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label htmlFor="youtube">Youtube</label>
                            <input
                                type="url"
                                className="form-control"
                                id="youtube"
                                placeholder="Youtube"
                                name="youtube"
                                value={formData.youtube}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="linkdin">LinkedIn</label>
                            <input
                                type="url"
                                className="form-control"
                                id="linkdin"
                                placeholder="LinkedIn"
                                name="linkdin"
                                value={formData.linkdin}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SocialLink;
