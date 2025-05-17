import React from 'react';

const BankPaymentDetails = () => {
  return (
    <div className="space-y-6 w-[856px]">
      <h2 className="text-2xl text-gray-950 font-semibold">Bank/Payment Details (For Payments & Withdrawals)</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram */}
        <div>
          <label className="block mb-2 font-lg">
            Account Holder Name <span className="text-red-600">*</span>
          </label>
          <input
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            placeholder="Instagram"
          />
        </div>

        {/* YouTube */}
        <div>
          <label className="block mb-2 font-lg">
            Account Number <span className="text-red-600">*</span>
          </label>
          <input
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            placeholder="YouTube"
          />
        </div>

        {/* Facebook */}
        <div>
          <label className="block mb-2 font-lg">
            Bank Name <span className="text-red-600">*</span>
          </label>
          <input
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            placeholder="Facebook"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block mb-2 font-lg">
            IFSC Code <span className="text-red-600">*</span>
          </label>
          <input
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            placeholder="LinkedIn"
          />
        </div>
        <div>
          <label className="block mb-2 font-lg">
            UPI ID 
          </label>
          <input
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            placeholder="LinkedIn"
          />
        </div>

        {/* Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-[#6F4D34] text-white px-10 py-2 rounded-full text-sm font-medium"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankPaymentDetails;
