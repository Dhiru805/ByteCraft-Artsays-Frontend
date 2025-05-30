import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import putAPI from '../../../../../../../api/putAPI'
import getAPI from '../../../../../../../api/getAPI'

export const AccountForm = () => {
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
        const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
        if (result.data.user) {
          const userData = result.data.user;
          const formattedBirthdate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';

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
          const profilePhotoUrl = userData.profilePhoto ? `${BASE_URL}${userData.profilePhoto}` : 'DashboardAssets/assets/images/user.png';
          setProfileImage(profilePhotoUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error fetching profile data");
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
      setImageFile(file); // for sending to backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // for preview
      };
      reader.readAsDataURL(file);
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
        alert('No token found. Please log in again.');
        return;
      }

      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }


      setLoading(true);
      const res = await putAPI(`/auth/users/${userId}`,
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
        // toast.success(res.message);
        // Refresh data
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
            const formattedBirthdate = user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '';
            setBirthdate(formattedBirthdate);

            const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
            const profilePhotoUrl = user.profilePhoto ? `${BASE_URL}${user.profilePhoto}` : 'DashboardAssets/assets/images/user.png';
            setProfileImage(profilePhotoUrl);
          } catch (e) {
            console.error("Error refreshing profile after update", e);
          }
        };

        fetchUpdatedProfile();
      }

    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      alert(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <form className="w-[856px] space-y-6" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold">Personal Information</h3>

      <div className="relative w-24 h-24">
  <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
    {profileImage && (
      <img
        src={profileImage}
        alt="Profile Preview"
        className="w-full h-full object-cover"
      />
    )}
  </div>

  <input
    id="profileUpload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageUpload}
  />
  <label
    htmlFor="profileUpload"
    className="absolute bottom-0 right-0 w-8 h-8 bg-[#6F3E2D] rounded-full flex items-center justify-center border-2 border-white cursor-pointer"
  >
    <svg
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  </label>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="md:col-span-2">
          <label className="block text-sm">Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="mrstark"
            className="w-full border-2 px-3 py-2 rounded-xl"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full border-2 px-3 py-2 rounded-xl"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Phone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 93656 00000"
            className="w-full border-2 px-3 py-2 rounded-xl"
          />
        </div>
      </div>

      {/* Gender and DOB side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Gender</label>
          <div className="flex gap-4 text-lg text-gray-500 font-normal">
            <button
              type="button"
              onClick={() => handleGenderSelect('Male')}
              className={`w-[130px] py-1 rounded-xl ${gender === 'Male'
                ? 'bg-[#6F3E2D] text-white'
                : 'border-2 border-gray-300'
                }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect('Female')}
              className={`w-[130px] py-1 rounded-xl ${gender === 'Female'
                ? 'bg-[#6F3E2D] text-white'
                : 'border-2 border-gray-400 text-black'
                }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-2">Date of Birth</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border-2 px-3 py-2 rounded-xl"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
          placeholder="Write something about yourself..."
          className="w-full border-2 px-3 py-2 rounded-xl resize-none"
        />
      </div>

      <button
        type="submit"
        className="bg-[#6F4D34] text-white text-[17px] font-semibold w-[200px] py-2 px-4 rounded-3xl"
        fdprocessedid="3awnjs"
      >
        {loading ? 'Updating...' : 'Update Changes'}
      </button>
    </form>
  );
};
