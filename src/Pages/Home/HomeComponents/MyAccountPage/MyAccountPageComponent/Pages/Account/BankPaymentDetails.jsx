import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';
const BankPaymentDetails = () => {

  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  });
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
  const fetchBankDetails = async () => {
    const storedUserId = localStorage.getItem('userId');

    if (!storedUserId) {
      console.warn("User ID is undefined. Cannot fetch bank details.");
      return;
    }

    try {
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
      toast.error("Failed to fetch bank details");
    }
  };

  fetchBankDetails();
}, []);



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const url = `/auth/updatebankdetails/${userId}`;
      const result = await putAPI(url, formData);

      if (result) {
        setLoading(false);
        toast.success('Bank details updated successfully');
      } else {
        setLoading(false);
        toast.error('Failed to update bank details');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error updating bank details');
    }
  };


  return (
  <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
    <h2 className="text-2xl text-gray-950 font-semibold">
      Bank/Payment Details (For Payments & Withdrawals)
    </h2>

    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit}
    >
      {/* Account Holder Name */}
      <div>
        <label className="block mb-2 font-medium text-sm text-gray-800">
          Account Holder Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="Account Holder Name"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Bank Name */}
      <div>
        <label className="block mb-2 font-medium text-sm text-gray-800">
          Bank Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="Bank Name"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Account Number */}
      <div>
        <label className="block mb-2 font-medium text-sm text-gray-800">
          Account Number <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="1234567890"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          required
        />
      </div>

      {/* IFSC Code */}
      <div>
        <label className="block mb-2 font-medium text-sm text-gray-800">
          IFSC Code <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="IFSC Code"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          required
        />
      </div>

      {/* UPI ID */}
      <div>
        <label className="block mb-2 font-medium text-sm text-gray-800">
          UPI ID
        </label>
        <input
          type="text"
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="UPI Id"
          name="upiId"
          value={formData.upiId}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="bg-[#6F4D34] text-white px-10 py-2 rounded-full text-sm font-medium"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  </div>
);

};

export default BankPaymentDetails;
