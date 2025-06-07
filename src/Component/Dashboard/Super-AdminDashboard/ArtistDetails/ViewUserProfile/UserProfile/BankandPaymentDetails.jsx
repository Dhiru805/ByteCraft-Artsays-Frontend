import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';

const BankPaymentDetails = ({ userId }) => {
    const [formData, setFormData] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
    });

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                if (!userId) {
                    console.warn("User ID is undefined. Cannot fetch bank details.");
                    return;
                }
    
                const url = `/auth/bankdetails/${userId}`;
                const result = await getAPI(url);

                if (result && result.data && result.data.bankDetails) { 
                    setFormData({
                        accountHolderName: result.data.bankDetails.accountHolderName || '',
                        bankName: result.data.bankDetails.bankName || '',
                        accountNumber: result.data.bankDetails.accountNumber || '',
                        ifscCode: result.data.bankDetails.ifscCode || '',
                        upiId: result.data.bankDetails.upiId || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching bank details:", error);
                // toast.error("Failed to fetch bank details");
            }
        };
    
        fetchBankDetails();
    }, [userId]);
    

   

    return (
        <div className="body">
            <h5 className="mb-2">Bank/Payment Details (For Payments & Withdrawals)</h5>
            <hr className="mt-1" />
            <form>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Account Holder Name <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="accountHolderName" 
                                value={formData.accountHolderName} 
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Bank Name <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="bankName" 
                                value={formData.bankName} 
                               disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>UPI ID</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="upiId" 
                               disabled
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Account Number <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="number" 
                                className="form-control" 
                                name="accountNumber" 
                                value={formData.accountNumber} 
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>IFSC Code <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="ifscCode" 
                                value={formData.ifscCode} 
                               disabled
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BankPaymentDetails;
