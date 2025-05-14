import React, { useState } from 'react';

export const AccountForm = () => {
  const [gender, setGender] = useState('Male'); // Default is 'Male'

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  return (
    <form className="space-y-6">
      <h3 className="text-xl font-semibold">Personal Information</h3>

      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          {/* Replace with actual image */}
          <span className="text-xl"></span>
        </div>
        <button type="button" className="text-sm text-[#5F3E2D] underline">Edit</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">First Name *</label>
          <input type="text" placeholder="Nelson" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Last Name *</label>
          <input type="text" placeholder="D." className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Email *</label>
          <input type="email" placeholder="example@gmail.com" className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Phone *</label>
          <input type="tel" placeholder="+91 93656 00000" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">Gender</label>
        <div className="flex gap-4 text-lg text-gray-500 font-normal">
          <button
            type="button"
            onClick={() => handleGenderSelect('Male')}
            className={`w-[130px] py-2 rounded-xl ${
              gender === 'Male'
                ? 'bg-[#5F3E2D] text-white'
                : 'border border-gray-300 '
            }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect('Female')}
            className={`w-[130px] py-2 rounded-xl ${
              gender === 'Female'
                ? 'bg-[#5F3E2D] text-white'
                : 'border border-gray-300 text-black'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#5F3E2D] text-white text-sm w-[170px] py-2 rounded-3xl"
      >
        Update Changes
      </button>
    </form>
  );
};
