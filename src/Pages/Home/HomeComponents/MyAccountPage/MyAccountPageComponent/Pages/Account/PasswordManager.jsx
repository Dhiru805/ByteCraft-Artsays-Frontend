import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../../api/putAPI';

const PasswordManager = () => {
  const userId = localStorage.getItem('userId');

  const [oldPwdVisible, setOldPwdVisible] = useState(false);
  const [newPwdVisible, setNewPwdVisible] = useState(false);
  const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Submitted Passwords:', {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const payload = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      const url = `/auth/users/${userId}`;
      console.log('Sending PUT request to:', url);
      console.log('Payload being sent:', payload);

      const result = await putAPI(url, payload);

      console.log('Response from putAPI:', result);

      if (result.hasError) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error during password update:', error);
      toast.error('Error changing password');
    }
  };

  return (
  <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
    <h2 className="text-2xl text-gray-900 font-semibold">Password Manager</h2>

    <form className="space-y-8" onSubmit={handleSubmit}>
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
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
            Forgot Password?
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
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setNewPwdVisible(!newPwdVisible)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F3E2D]"
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
