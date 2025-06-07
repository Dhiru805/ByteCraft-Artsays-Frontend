import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';

const AccountSecurityAgreement = ({ userId }) => {
    const [formData, setFormData] = useState({});

    const checkboxLabels = {
        agreeTerms: "Agree to Terms & Conditions, Privacy Policy",
        agreeCommissionFees: "Agree to Commission Fees (Platform commission percentage per sale)",
        agreeNoFakeArtwork: "Agree to No Fake Artwork Policy"
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
                        name="agreeTerms" 
                        checked={!!formData.agreeTerms} 
                        disabled
                        
                    />
                    <label className="mx-2">{checkboxLabels.agreeTerms}</label>
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="agreeCommissionFees" 
                        checked={!!formData.agreeCommissionFees} 
                        disabled
                        
                    />
                    <label className="mx-2">{checkboxLabels.agreeCommissionFees}</label>
                </div>
                <div className="form-group">
                    <input 
                        type="checkbox" 
                        name="agreeNoFakeArtwork" 
                        checked={!!formData.agreeNoFakeArtwork} 
                        disabled
                    />
                    <label className="mx-2">{checkboxLabels.agreeNoFakeArtwork}</label>
                </div>
            </form>
        </div>
    );
};

export default AccountSecurityAgreement;