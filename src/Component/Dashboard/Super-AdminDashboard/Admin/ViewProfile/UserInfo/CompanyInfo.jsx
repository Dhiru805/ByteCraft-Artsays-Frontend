import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';

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
                const response = await getAPI(`/api/getcompanyinfo/${userId}`);
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
    
    return (
        <div className="body">
            <h5 className="mb-2">Company Information</h5>
            <hr className="mt-1" />
            <form >
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
                                    disabled
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default CompanyProfile;
