import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import putAPI from "../../../../../../../api/putAPI";
import getAPI from "../../../../../../../api/getAPI";
const BankPaymentDetails = () => {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBankDetails = async () => {
      const storedUserId = localStorage.getItem("userId");

      if (!storedUserId) {
        console.warn("User ID is undefined. Cannot fetch bank details.");
        return;
      }

      try {
        const url = `/auth/bankdetails/${userId}`;
        const result = await getAPI(url);

        if (result && result.data && result.data.bankDetails) {
          setFormData({
            accountHolderName: result.data.bankDetails.accountHolderName || "",
            bankName: result.data.bankDetails.bankName || "",
            accountNumber: result.data.bankDetails.accountNumber || "",
            ifscCode: result.data.bankDetails.ifscCode || "",
            upiId: result.data.bankDetails.upiId || "",
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
      [name]: value,
    }));
  };

  const formValidation = () => {
    const { accountHolderName, bankName, accountNumber, ifscCode, upiId } =
      formData;

    // Account Holder Name
    if (!accountHolderName.trim()) {
      toast.error("Account Holder Name is required");
      return false;
    }

    // Bank Name
    if (!bankName.trim()) {
      toast.error("Bank Name is required");
      return false;
    }

    // Account Number (numeric & length)
    if (!accountNumber) {
      toast.error("Account Number is required");
      return false;
    }

    if (!/^\d{9,18}$/.test(accountNumber)) {
      toast.error("Account Number must be between 9 and 18 digits");
      return false;
    }

    // IFSC Code (Indian format)
    if (!ifscCode.trim()) {
      toast.error("IFSC Code is required");
      return false;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      toast.error("Invalid IFSC Code format");
      return false;
    }

    // UPI ID (optional)
    if (upiId && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      toast.error("Invalid UPI ID format");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValidation()) return;
    setLoading(true);
    try {
      const url = `/auth/updatebankdetails/${userId}`;
      const result = await putAPI(url, formData);

      if (result) {
        setLoading(false);
        toast.success("Bank details updated successfully");
      } else {
        setLoading(false);
        toast.error("Failed to update bank details");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error updating bank details");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Bank Payment Details
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Payment & Withdrawals</h3>
            <p className="text-sm text-gray-500">Manage your bank account details for seamless transactions</p>
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Holder Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder="Enter account holder name"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bank Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder="Enter bank name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder="Enter account number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                IFSC Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder="Enter IFSC code"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                required
              />
            </div>

            {/* UPI ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder="Enter UPI ID (e.g., username@bank)"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? "Updating..." : "Update Bank Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankPaymentDetails;
