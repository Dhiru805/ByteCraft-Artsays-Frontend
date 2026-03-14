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
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Password Manager
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Change Your Password</h3>
            <p className="text-sm text-gray-500">Ensure your account stays secure by using a strong password</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={oldPwdVisible ? 'text' : 'password'}
                placeholder="Enter your current password"
                className="w-full border border-gray-200 px-4 py-3 pr-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setOldPwdVisible(!oldPwdVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#5C4033] hover:bg-[#5C4033]/5 transition-all duration-300"
              >
                {oldPwdVisible ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <button type="button" className="text-sm font-medium text-[#5C4033] hover:text-[#4b3327] transition-colors">
                Forgot Password?
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={newPwdVisible ? 'text' : 'password'}
                placeholder="Enter new password"
                className="w-full border border-gray-200 px-4 py-3 pr-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setNewPwdVisible(!newPwdVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#5C4033] hover:bg-[#5C4033]/5 transition-all duration-300"
              >
                {newPwdVisible ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={confirmPwdVisible ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="w-full border border-gray-200 px-4 py-3 pr-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setConfirmPwdVisible(!confirmPwdVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#5C4033] hover:bg-[#5C4033]/5 transition-all duration-300"
              >
                {confirmPwdVisible ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            Update Password
          </button>
        </form>
      </div>

      <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Password Tips</h4>
            <ul className="text-xs text-amber-800/80 space-y-1">
              <li>Use at least 8 characters with uppercase, lowercase, and numbers</li>
              <li>Avoid using personal information like your name or birthday</li>
              <li>Don't reuse passwords from other accounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PasswordManager;
