import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';
import postAPI from '../../../../../../../api/postAPI';
import { DEFAULT_PROFILE_IMAGE } from './constant';
import PersonalInformationSkeleton from '../../../../../../../Component/Skeleton/Home/Account/PersonalInformationSkeleton';
import { FaCheck } from 'react-icons/fa';

export const AccountForm = () => {
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');

  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [verifyingPhoneOtp, setVerifyingPhoneOtp] = useState(false);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      if (result.data.user) {
        const userData = result.data.user;
        const formattedBirthdate = userData.birthdate
          ? new Date(userData.birthdate).toISOString().split('T')[0]
          : '';

        setProfileData(userData);
        setName(userData.name || '');
        setLastName(userData.lastName || '');
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setBio(userData.bio || '');
        setGender(userData.gender || 'Male');
        setBirthdate(formattedBirthdate);

        setEmailVerified(userData.emailVerified || false);
        setPhoneVerified(userData.numberVerified || false);
        setOriginalEmail(userData.email || '');
        setOriginalPhone(userData.phone || '');

        const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
        const profilePhotoUrl = userData.profilePhoto
          ? `${BASE_URL}${userData.profilePhoto}`
          : DEFAULT_PROFILE_IMAGE;
        setProfileImage(profilePhotoUrl);
        localStorage.setItem('profilePhoto', profilePhotoUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error?.response?.data?.message || 'Error fetching profile data');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Please log in again.');
        return;
      }

      setLoading(true);
      await putAPI(
        `/auth/users/${userId}`,
        { profilePhoto: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileImage(DEFAULT_PROFILE_IMAGE);
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      localStorage.setItem('profilePhoto', DEFAULT_PROFILE_IMAGE);
      window.dispatchEvent(new Event('profilePhotoUpdated'));

      toast.success('Profile image deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile image:', error.response?.data || error.message);
      toast.error(error?.response?.data?.message || 'Failed to delete profile image');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail !== originalEmail) {
      setEmailVerified(false);
    }
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (newPhone !== originalPhone) {
      setPhoneVerified(false);
    }
  };

    const handleSendEmailOtp = async () => {
      if (!email) {
        toast.error('Please enter an email address');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      try {
        setSendingEmailOtp(true);
        const userId = localStorage.getItem('userId');
        const response = await postAPI('/auth/send-otp', { email, mode: 'profile', userId });
        if (response.data?.success) {
          toast.success('OTP sent to your email');
          setShowEmailOtpModal(true);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to send OTP');
      } finally {
        setSendingEmailOtp(false);
      }
    };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setVerifyingEmailOtp(true);
      const response = await postAPI('/auth/verify-otp', { email, otp: emailOtp });
      if (response.data?.success) {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        await putAPI(`/auth/users/${userId}`, { email, emailVerified: true }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Email verified successfully');
        setEmailVerified(true);
        setOriginalEmail(email);
        setShowEmailOtpModal(false);
        setEmailOtp('');
        fetchProfile();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

    const handleSendPhoneOtp = async () => {
      if (!phone) {
        toast.error('Please enter a phone number');
        return;
      }
      const cleanPhone = phone.replace(/\D/g, '').replace(/^(\+91|91)/, '');
      if (cleanPhone.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
      try {
        setSendingPhoneOtp(true);
        const userId = localStorage.getItem('userId');
        const response = await postAPI('/auth/send-otp', { phone, mode: 'profile', userId });
        if (response.data?.success) {
          toast.success('OTP sent to your phone');
          setShowPhoneOtpModal(true);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to send OTP');
      } finally {
        setSendingPhoneOtp(false);
      }
    };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setVerifyingPhoneOtp(true);
      const response = await postAPI('/auth/verify-otp', { phone, otp: phoneOtp });
      if (response.data?.success) {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        await putAPI(`/auth/users/${userId}`, { phone, numberVerified: true }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Phone verified successfully');
        setPhoneVerified(true);
        setOriginalPhone(phone);
        setShowPhoneOtpModal(false);
        setPhoneOtp('');
        fetchProfile();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setVerifyingPhoneOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastName', lastName);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('gender', gender);
    formData.append('birthdate', birthdate);
    formData.append('bio', bio);

    if (imageFile) {
      formData.append('profilePhoto', imageFile);
    }
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) {
        toast.error('No token found. Please log in again.');
        return;
      }
      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }
      setLoading(true);
      const res = await putAPI(
        `/auth/users/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.message || 'Profile updated successfully!');

      console.log('Updated user:', res.data.user);

      if (res.hasError) {
        toast.error(res.message);
      } else {
        fetchProfile();
        localStorage.setItem('profilePhoto', profileImage);
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      }
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return <PersonalInformationSkeleton />;
  }

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold">Personal Information</h3>

      <div className='grid md:grid-cols-3'>
        <div className="flex flex-col md:col-span-1 items-center gap-4">
          <div className="relative">
            <div className="w-[10rem] h-[10rem] bg-gray-300 rounded-full overflow-hidden">
              <img
                src={profileImage || DEFAULT_PROFILE_IMAGE}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {profileImage && profileImage !== DEFAULT_PROFILE_IMAGE && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#6F3E2D] rounded-full flex items-center justify-center border border-white cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white hover:text-red-500 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m4 0H5m1 0v12a2 2 0 002 2h8a2 2 0 002-2V6"
                  />
                </svg>

              </button>
            )}

          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mrstark"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="example@gmail.com"
                    readOnly={emailVerified && email === originalEmail}
                    className={`w-full border border-gray-200 px-4 py-3 pr-24 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none ${emailVerified && email === originalEmail ? 'bg-green-50 border-green-200' : ''}`}
                  />
                  {emailVerified && email === originalEmail && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-lg">
                      <FaCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                {(!emailVerified || email !== originalEmail) && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={sendingEmailOtp}
                    className="px-4 py-3 bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm font-semibold rounded-2xl transition-all duration-300 whitespace-nowrap"
                  >
                    {sendingEmailOtp ? 'Sending...' : 'Verify'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+91 93656 00000"
                    readOnly={phoneVerified && phone === originalPhone}
                    className={`w-full border border-gray-200 px-4 py-3 pr-24 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none ${phoneVerified && phone === originalPhone ? 'bg-green-50 border-green-200' : ''}`}
                  />
                  {phoneVerified && phone === originalPhone && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-lg">
                      <FaCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                {(!phoneVerified || phone !== originalPhone) && (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={sendingPhoneOtp}
                    className="px-4 py-3 bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm font-semibold rounded-2xl transition-all duration-300 whitespace-nowrap"
                  >
                    {sendingPhoneOtp ? 'Sending...' : 'Verify'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleGenderSelect('Male')}
                  className={`flex-1 py-3 rounded-2xl text-center font-semibold transition-all duration-300 ${gender === 'Male' 
                    ? 'bg-[#5C4033] text-white shadow-lg shadow-[#5C4033]/20' 
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderSelect('Female')}
                  className={`flex-1 py-3 rounded-2xl text-center font-semibold transition-all duration-300 ${gender === 'Female' 
                    ? 'bg-[#5C4033] text-white shadow-lg shadow-[#5C4033]/20' 
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
          <h3 className="text-lg font-bold text-gray-900 mb-6">About You</h3>
          <div>
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="profileUpload"
              className="bg-[#6F4D34] text-white text-sm font-semibold py-2 px-4 rounded-3xl cursor-pointer"
            >
              Upload Profile Image
            </label>
          </div>
        </div>
        <div className='md:col-span-2 space-y-6 content-center'>
          <div>
            <label className="block text-sm">First Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nelson"
              className="w-full border-2 px-3 py-2 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="D."
              className="w-full border-2 px-3 py-2 rounded-xl"
            />
          </div>
        </div>
      </div>

        <button
          type="submit"
          className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
          disabled={loading}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          {loading ? 'Updating...' : 'Update Changes'}
        </button>
      </form>

      {showEmailOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setShowEmailOtpModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Email</h3>
            <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to {email}</p>
            <input
              type="text"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              className="w-full border border-gray-200 px-4 py-3 rounded-xl mb-4 text-center text-2xl tracking-widest"
              maxLength={6}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowEmailOtpModal(false); setEmailOtp(''); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyEmailOtp}
                disabled={verifyingEmailOtp || emailOtp.length !== 6}
                className="flex-1 py-3 bg-[#5C4033] text-white rounded-xl font-semibold hover:bg-[#4b3327] disabled:opacity-50"
              >
                {verifyingEmailOtp ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSendEmailOtp}
              disabled={sendingEmailOtp}
              className="w-full mt-3 text-[#5C4033] text-sm font-medium hover:underline"
            >
              {sendingEmailOtp ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      )}

      {showPhoneOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setShowPhoneOtpModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Phone</h3>
            <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to {phone}</p>
            <input
              type="text"
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              className="w-full border border-gray-200 px-4 py-3 rounded-xl mb-4 text-center text-2xl tracking-widest"
              maxLength={6}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowPhoneOtpModal(false); setPhoneOtp(''); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyPhoneOtp}
                disabled={verifyingPhoneOtp || phoneOtp.length !== 6}
                className="flex-1 py-3 bg-[#5C4033] text-white rounded-xl font-semibold hover:bg-[#4b3327] disabled:opacity-50"
              >
                {verifyingPhoneOtp ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSendPhoneOtp}
              disabled={sendingPhoneOtp}
              className="w-full mt-3 text-[#5C4033] text-sm font-medium hover:underline"
            >
              {sendingPhoneOtp ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};