import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';

const CompanyProfile = ({ userId }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyType: '',
        gstin: '',
        tan: '',
        cin: '',
        pan: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        country: '',
        pin: '',
        contactNo: '',
        emailAddress: '',
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/getcompanyinfo/${userId}`);
                if (response.data && response.data.length > 0) {
                    setFormData(response.data[0]);
                }
            } catch (error) {
                console.log("Fetch attempt completed");
            }
        };
    
        if (userId) {
            fetchCompanyData();
        }
    }, [userId]);
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = `http://localhost:3001/api/updatecompanyinfo/${userId}`;
            const result = await putAPI(url, { ...formData });
    
            if (result.errors) {
                Object.values(result.errors).forEach((error) => {
                    toast.error(error.message);
                });
            } else if (result.message) {
                toast.success(result.message);
            } else {
                toast.error('Failed to update Company details');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).forEach((err) => {
                    toast.error(err.message);
                });
            } else {
                toast.error('Error updating Company details');
            }
        }
    };
    
    
    

    return (
        <div className="body">
            <h5 className="mb-2">Company Information</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="row clearfix">
                    {[ 
                        { label: 'Company Name', name: 'companyName', type: 'text' },
                        { label: 'Company Type', name: 'companyType', type: 'text' },
                        { label: 'GSTIN', name: 'gstin', type: 'text' },
                        { label: 'TAN', name: 'tan', type: 'text' },
                        { label: 'CIN', name: 'cin', type: 'text' },
                        { label: 'PAN', name: 'pan', type: 'text' },
                        { label: 'Address', name: 'address', type: 'text' },
                        { label: 'Landmark', name: 'landmark', type: 'text' },
                        { label: 'City', name: 'city', type: 'text' },
                        { label: 'State', name: 'state', type: 'text' },
                        { label: 'Country', name: 'country', type: 'text' },
                        { label: 'PIN', name: 'pin', type: 'text' },
                        { label: 'Contact Number', name: 'contactNo', type: 'text' },
                        { label: 'Email Address', name: 'emailAddress', type: 'email' }
                    ].map((field, index) => (
                        <div className="col-lg-6 col-md-6" key={index}>
                            <div className="form-group">
                                <label htmlFor={field.name}>{field.label} <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type={field.type}
                                    className="form-control"
                                    id={field.name}
                                    placeholder={field.label}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary mx-2">Update</button>
            </form>
        </div>
    );
};

export default CompanyProfile;
