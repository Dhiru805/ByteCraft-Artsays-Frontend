import React from 'react';

const AccountVerification = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Account Verification</h2>
      <form className="space-y-4">
        <select className="border p-2 rounded w-full">
          <option>Driving License</option>
        </select>
        <input className="border p-2 rounded w-full" placeholder="Driving License Number" defaultValue="DL-45-67564567" />
        <input type="file" className="border p-2 rounded w-full" />
        <div className='flex flex-col gap-7 w-[120px]'>
          <button className="bg-gray-200 text-sm px-4 py-2 rounded-xl border border-pink-900">View PDF</button>
          <button className="bg-[#5F3E2D] text-white px-6 py-2 rounded-3xl">Update</button>

        </div>
      </form>
    </div>
  );
};

export default AccountVerification;
