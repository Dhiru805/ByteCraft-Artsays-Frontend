import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';

const SocialLink = ({ userId, profileData }) => {
    const [loading,setLoading]=useState(false);

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


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

   
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `/auth/updatesociallink/${userId}`;
            const result = await putAPI(url, formData);

            if (result) {
                toast.success('Social links updated successfully');
            } else {
                toast.error('Failed to update social links');
            }
        } catch (error) {
            toast.error('Error updating social links');
        }
    };

    return (
        <div className="body">
            <h5 className="mb-2">Social Media Promotion</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
       <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading}
          onClick={(e) => {
            setLoading(true);
            Promise.resolve(handleSubmit(e))
              .catch(console.error)
              .finally(() => setLoading(false));
          }}
        >{loading ? "Updating..." : "Update"}</button>

            </form>
        </div>
    );
};

export default SocialLink;
