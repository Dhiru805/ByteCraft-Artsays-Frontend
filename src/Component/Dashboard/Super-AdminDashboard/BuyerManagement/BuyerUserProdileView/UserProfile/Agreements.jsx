import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';

const AccountSecurityAgreement = ({ userId }) => {
    const [formData, setFormData] = useState({});

    const checkboxLabels = {
        twoStepAuthentication: "2-Step Authentication (OTP, Email verification, etc.)",
        termsConditionsAgreement: "Terms & Conditions Agreement",
        privacyPolicyAgreement: "Privacy Policy Agreement"
    };

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

    

  

    return (
        <div className="body">
            <h5 className="mb-2">Account Security And Agreements</h5>
            <hr className="mt-1" />
            <form >
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="twoStepAuthentication" 
                        checked={!!formData.twoStepAuthentication} 
                        disabled
                        
                    />
                    <label className="mx-2">{checkboxLabels.twoStepAuthentication}</label>
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="termsConditionsAgreement" 
                        checked={!!formData.termsConditionsAgreement} 
                        disabled
                        
                    />
                    <label className="mx-2">{checkboxLabels.termsConditionsAgreement}</label>
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="privacyPolicyAgreement" 
                        checked={!!formData.privacyPolicyAgreement} 
                        disabled
                    />
                    <label className="mx-2">{checkboxLabels.privacyPolicyAgreement}</label>
                </div>
            </form>
        </div>
    );
};

export default AccountSecurityAgreement;