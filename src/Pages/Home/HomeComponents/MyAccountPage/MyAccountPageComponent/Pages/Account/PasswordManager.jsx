import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordManager = () => {
  const [oldPwdVisible, setOldPwdVisible] = useState(false);
  const [newPwdVisible, setNewPwdVisible] = useState(false);
  const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);

  return (
    <div className="space-y-6 w-[856px]">
      <h2 className="text-2xl text-gray-900 font-semibold">Password Manager</h2>

      <form className="space-y-8">
        {/* Current password */}
        <div>
          <label className="block mb-2 font-medium">
            Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              type={oldPwdVisible ? 'text' : 'password'}
              placeholder="Enter Password"
              className="w-full border-2 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            />
            <button
              type="button"
              onClick={() => setOldPwdVisible(!oldPwdVisible)}
              className="absolute border-none right-4 top-1/2 -translate-y-1/2 text-[#6F3E2D]"
            >
              {oldPwdVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <div className="text-right mt-2">
            <button type="button" className="text-sm text-[#6F3E2D] underline">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block mb-2 font-medium">
            New Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              type={newPwdVisible ? 'text' : 'password'}
              placeholder="Enter Password"
              className="w-full border-2 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            />
            <button
              type="button"
              onClick={() => setNewPwdVisible(!newPwdVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 [#6F3E2D]"
            >
              {newPwdVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block mb-2 font-medium">
            Confirm New Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              type={confirmPwdVisible ? 'text' : 'password'}
              placeholder="Enter Password"
              className="w-full border-2 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
            /> 
            <button
              type="button"
              onClick={() => setConfirmPwdVisible(!confirmPwdVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F3E2D]"
            >
              {confirmPwdVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#6F4D34] text-white px-10 py-3 rounded-full text-sm font-medium"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default PasswordManager;
