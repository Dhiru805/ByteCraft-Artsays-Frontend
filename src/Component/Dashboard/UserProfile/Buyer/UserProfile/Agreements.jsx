import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../api/putAPI';
import getAPI from '../../../../../api/getAPI';

const AccountSecurityAgreement = ({ userId }) => {
    const [formData, setFormData] = useState({});

    const checkboxLabels = {
        twoStepAuthentication: "2-Step Authentication (OTP, Email verification, etc.)",
        termsConditionsAgreement: "Terms & Conditions Agreement",
        privacyPolicyAgreement: "Privacy Policy Agreement"
    };
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAgreementDetails = async () => {
            try {
                if (!userId) {
                    console.warn("User ID is undefined. Cannot fetch agreement details.");
                    return;
                }

                const url = `/auth/agreementdetails/${userId}`;
                const result = await getAPI(url);

                if (result && result.data && Array.isArray(result.data.agreements)) {
                    const storedData = {};
                    Object.keys(checkboxLabels).forEach(key => {
                        storedData[key] = result.data.agreements.includes(checkboxLabels[key]);
                    });
                    setFormData(storedData);
                }
            } catch (error) {
                console.error("Error fetching agreement details:", error);
            }
        };
        fetchAgreementDetails();
    }, [userId]);

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const allSelected = Object.keys(checkboxLabels).every(key => formData[key]);
        
        if (!allSelected) {
            toast.warn('Please agree to all agreements.');
            return;
        }

        const selectedAgreements = Object.keys(formData)
            .filter((key) => formData[key])
            .map((key) => checkboxLabels[key]);

        try {
            const url = `/auth/updateagreementdetails/${userId}`;
            const result = await putAPI(url, { agreements: selectedAgreements });

            if (result) {
                toast.success('Agreement details updated successfully');
            } else {
                toast.error('Failed to update agreement details');
            }
        } catch (error) {
            toast.error('Error updating agreement details');
        }
    };

    const validateRequiredAgreements = () => {
        const missing = [];
        const requiredMap = {
            'Terms & Conditions'   : formData.agreeTerms,
            'Commission Fees'      : formData.agreeCommissionFees,
            'No Fake Artwork'      : formData.agreeNoFakeArtwork,
        };
    
        Object.entries(requiredMap).forEach(([label, value]) => {
            if (!value) missing.push(label);
        });
    
        if (missing.length) {
            toast.warn(`Please agree to: ${missing.join(', ')}`);
            return false;
        }
        return true;
    };
    
    
    return (
        <div className="body">
            <h5 className="mb-2">Account Security And Agreements</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="twoStepAuthentication" 
                        checked={!!formData.twoStepAuthentication} 
                        onChange={handleChange} 
                        
                    />
                    <label className="mx-2">{checkboxLabels.twoStepAuthentication} <span style={{ color: 'red' }}>*</span></label>
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="termsConditionsAgreement" 
                        checked={!!formData.termsConditionsAgreement} 
                        onChange={handleChange} 
                        
                    />
                    <label className="mx-2">{checkboxLabels.termsConditionsAgreement} <span style={{ color: 'red' }}>*</span></label>
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="privacyPolicyAgreement" 
                        checked={!!formData.privacyPolicyAgreement} 
                        onChange={handleChange} 
                    />
                    <label className="mx-2">{checkboxLabels.privacyPolicyAgreement} <span style={{ color: 'red' }}>*</span></label>
                </div>
        <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading}
          onClick={(e) => {
            if (!validateRequiredAgreements()) return;
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

export default AccountSecurityAgreement;