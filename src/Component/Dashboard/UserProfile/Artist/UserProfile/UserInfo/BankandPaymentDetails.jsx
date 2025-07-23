import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';
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
    
    const [loading, setLoading] = useState(false);

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
            const url = `/auth/updatebankdetails/${userId}`;
            const result = await putAPI(url, formData);

            if (result) {
                toast.success('Bank details updated successfully');
            } else {
                toast.error('Failed to update bank details');
            }
        } catch (error) {
            toast.error('Error updating bank details');
        }
    };

    const validateRequiredFields = () => {
  const missing = [];
  const requiredMap = {
    'Account Holder Name': formData.accountHolderName,
    'Bank Name'          : formData.bankName,
    'Account Number'     : formData.accountNumber,
    'IFSC Code'          : formData.ifscCode,
  };

  Object.entries(requiredMap).forEach(([label, value]) => {
    if (!value || String(value).trim() === '') {
      missing.push(label);
    }
  });

  if (missing.length > 0) {
    toast.warn(`Please fill the required fields: ${missing.join(', ')}`);
    return false;
  }

  return true;
};

    return (
        <div className="body">
            <h5 className="mb-2">Bank/Payment Details (For Payments & Withdrawals)</h5>
            <hr className="mt-1" />
            <form onSubmit={handleSubmit}>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                            <label>Account Holder Name <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="accountHolderName" 
                                value={formData.accountHolderName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Bank Name <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="bankName" 
                                value={formData.bankName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>UPI ID</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="upiId" 
                                value={formData.upiId} 
                                onChange={handleChange} 
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
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>IFSC Code <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="ifscCode" 
                                value={formData.ifscCode} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                </div>
        <button type="button"
          className="btn btn-primary mx-2"
          disabled={loading}
          onClick={(e) => {
            if (!validateRequiredFields()) return;

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

export default BankPaymentDetails;
