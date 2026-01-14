import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';
import { DEFAULT_PROFILE_IMAGE } from './constant';
import PersonalInformationSkeleton from '../../../../../../../Component/Skeleton/Home/Account/PersonalInformationSkeleton';
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

  useEffect(() => {
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

          // Set preview image
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
        setProfileImage(reader.result); // for preview
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleDeleteImage = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const userId = localStorage.getItem('userId');

  //     if (!token || !userId) {
  //       toast.error('Please log in again.');
  //       return;
  //     }

  //     setLoading(true);
  //     await putAPI(
  //       `/auth/users/${userId}`,
  //       { profilePhoto: null },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setProfileImage(DEFAULT_PROFILE_IMAGE);
  //     setImageFile(null);

  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = '';
  //     }

  //     toast.success('Profile image deleted successfully!');
  //   } catch (error) {
  //     console.error('Error deleting profile image:', error.response?.data || error.message);
  //     toast.error(error?.response?.data?.message || 'Failed to delete profile image');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      // Update localStorage and dispatch custom event
      localStorage.setItem('profilePhoto', DEFAULT_PROFILE_IMAGE);
      window.dispatchEvent(new Event('profilePhotoUpdated')); // Dispatch event

      toast.success('Profile image deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile image:', error.response?.data || error.message);
      toast.error(error?.response?.data?.message || 'Failed to delete profile image');
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('Form submitted');

  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('lastName', lastName);
  //   formData.append('username', username);
  //   formData.append('email', email);
  //   formData.append('phone', phone);
  //   formData.append('gender', gender);
  //   formData.append('birthdate', birthdate);
  //   formData.append('bio', bio);

  //   if (imageFile) {
  //     formData.append('profilePhoto', imageFile);
  //   }
  //   try {
  //     const token = localStorage.getItem('token');
  //     const userId = localStorage.getItem('userId');
  //     if (!token) {
  //       toast.error('No token found. Please log in again.');
  //       return;
  //     }
  //     if (!userId) {
  //       toast.error('User ID not found. Please log in again.');
  //       return;
  //     }
  //     setLoading(true);
  //     const res = await putAPI(
  //       `/auth/users/${userId}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     toast.success(res.message || 'Profile updated successfully!');

  //     console.log('Updated user:', res.data.user);

  //     if (res.hasError) {
  //       toast.error(res.message);
  //     } else {
  //       const fetchUpdatedProfile = async () => {
  //         try {
  //           const updated = await getAPI(`/auth/userid/${userId}`, {}, true, false);
  //           const user = updated.data.user;
  //           setName(user.name || '');
  //           setLastName(user.lastName || '');
  //           setUsername(user.username || '');
  //           setEmail(user.email || '');
  //           setPhone(user.phone || '');
  //           setGender(user.gender || 'Male');
  //           setBio(user.bio || '');
  //           const formattedBirthdate = user.birthdate
  //             ? new Date(user.birthdate).toISOString().split('T')[0]
  //             : '';
  //           setBirthdate(formattedBirthdate);

  //           const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  //           const profilePhotoUrl = user.profilePhoto
  //             ? `${BASE_URL}${user.profilePhoto}`
  //             : DEFAULT_PROFILE_IMAGE;
  //           setProfileImage(profilePhotoUrl);
  //         } catch (e) {
  //           console.error('Error refreshing profile after update:', e);
  //           toast.error(e?.response?.data?.message || 'Error refreshing profile');
  //         }
  //       };
  //       fetchUpdatedProfile();
  //     }
  //   } catch (error) {
  //     console.error('Update failed:', error.response?.data || error.message);
  //     toast.error(error?.response?.data?.message || 'Failed to update profile');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
        const fetchUpdatedProfile = async () => {
          try {
            const updated = await getAPI(`/auth/userid/${userId}`, {}, true, false);
            const user = updated.data.user;
            setName(user.name || '');
            setLastName(user.lastName || '');
            setUsername(user.username || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setGender(user.gender || 'Male');
            setBio(user.bio || '');
            const formattedBirthdate = user.birthdate
              ? new Date(user.birthdate).toISOString().split('T')[0]
              : '';
            setBirthdate(formattedBirthdate);

            const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
            const profilePhotoUrl = user.profilePhoto
              ? `${BASE_URL}${user.profilePhoto}`
              : DEFAULT_PROFILE_IMAGE;
            setProfileImage(profilePhotoUrl);

            // Update localStorage and dispatch custom event
            localStorage.setItem('profilePhoto', profilePhotoUrl);
            window.dispatchEvent(new Event('profilePhotoUpdated')); // Dispatch event
          } catch (e) {
            console.error('Error refreshing profile after update:', e);
            toast.error(e?.response?.data?.message || 'Error refreshing profile');
          }
        };
        fetchUpdatedProfile();
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
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Personal Information
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
          <div className='grid md:grid-cols-3 gap-8'>
            <div className="flex flex-col md:col-span-1 items-center gap-6">
              <div className="relative group">
                <div className="w-36 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-lg ring-4 ring-white">
                  <img
                    src={profileImage || DEFAULT_PROFILE_IMAGE}
                    alt="Profile Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {profileImage && profileImage !== DEFAULT_PROFILE_IMAGE && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all duration-300 active:scale-90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-white"
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
                  className="inline-flex items-center gap-2 bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm font-bold py-3 px-6 rounded-2xl cursor-pointer shadow-lg shadow-[#5C4033]/20 transition-all duration-300 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Photo
                </label>
              </div>
            </div>
            <div className='md:col-span-2 space-y-6'>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nelson"
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="D."
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                />
              </div>
            </div>
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
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 93656 00000"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
              />
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              placeholder="Write something about yourself..."
              className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none resize-none"
            />
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
    </div>
  );
};