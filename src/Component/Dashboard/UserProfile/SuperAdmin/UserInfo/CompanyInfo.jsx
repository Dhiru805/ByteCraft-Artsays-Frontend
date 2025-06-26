import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { toast } from 'react-toastify';
import putAPI from '../../../../../api/putAPI';

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
    const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await getAPI(`/api/getcompanyinfo/${userId}`,{},true);
                if (response.data && response.data.length > 0) {
                    setFormData(response.data[0]);
                    const storedEmail = localStorage.getItem("email");
                    setIsAuthorized(storedEmail === 'shantu131201@gmail.com');
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
        if (!isAuthorized) return;

        try {
            const url = `/api/updatecompanyinfo/${userId}`;
            const result = await putAPI(url, { ...formData },true);
    
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

    const validateRequiredCompanyFields = () => {
    const missing = [];
    const requiredMap = {
        'Company Name'     : formData.companyName,
        'Company Type'     : formData.companyType,
        'GSTIN'            : formData.gstin,
        'TAN'              : formData.tan,
        'CIN'              : formData.cin,
        'PAN'              : formData.pan,
        'Address'          : formData.address,
        'Landmark'         : formData.landmark,
        'City'             : formData.city,
        'State'            : formData.state,
        'Country'          : formData.country,
        'PIN'              : formData.pin,
        'Contact Number'   : formData.contactNo,
        'Email Address'    : formData.emailAddress,
    };

    Object.entries(requiredMap).forEach(([label, value]) => {
        if (!value || String(value).trim() === '') {
            missing.push(label);
        }
    });

    if (missing.length) {
        toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
        return false;
    }
    return true;
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
                                    disabled={!isAuthorized}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {isAuthorized && 
                        <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading}
          onClick={(e) => {
             if (!validateRequiredCompanyFields()) return;

            setLoading(true);
            Promise.resolve(handleSubmit(e))
              .then(() => {
                 window.location.reload();
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }}
        >{loading ? "Updating..." : "Update"}</button>
}
            </form>
        </div>
    );
};

export default CompanyProfile;
