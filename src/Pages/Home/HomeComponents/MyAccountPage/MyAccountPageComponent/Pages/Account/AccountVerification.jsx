import React from 'react';

const AccountVerification = () => {
  return (
    <div className="w-[856px]">
      <h2 className="text-2xl text-gray-950 pb-4 font-semibold">Account Verification</h2>

      <form className="space-y-8 text-sm font-semibold">
        {/* ID Type */}
        <div>
          <label className="block mb-2 font-medium">
            Select Document Type <span className="text-red-600">*</span>
          </label>
          <select className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]">
            <option>Driving License</option>
            {/* You can add more options here */}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Driving License Number <span className="text-red-600">*</span>
          </label>
          <input
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            placeholder="DL-45-67564567"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Upload Document <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-6 mt-4">
          <button
            type="button" 
            className="bg-gray-200 text-sm w-[120px] px-6 py-2 rounded-xl border "
          >
            View PDF
          </button>

          <button
            type="submit"
            className="bg-[#6F4D34] text-white w-[120px] px-8 py-2 rounded-full text-base font-medium"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountVerification;
