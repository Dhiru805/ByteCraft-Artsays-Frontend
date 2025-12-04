import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Pereferences/Pereferences';
import Billings from './Billings/Billings';
import getAPI from '../../../../api/getAPI';
import putAPI from '../../../../api/putAPI';
import Settings from './UserProfile/BasicInformation';

const UserProfileForm = () => {
  const navigate = useNavigate(); 
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('DashboardAssets/assets/images/user.png');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    gender: '',
    birthdate: '',
    website: ''
  });

  const location = useLocation();
  const userId = location.state?._id || localStorage.getItem('userId');
  

  useEffect(() => {
    if (location.state?._id) {
      localStorage.setItem('userId', location.state._id);
    }
  }, [location.state]);

  const fetchProfile = async () => {
    try {
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      if (result.data.user) {
        const userData = result.data.user;
        const formattedBirthdate = userData.birthdate 
          ? new Date(userData.birthdate).toISOString().split('T')[0] 
          : '';
        const parsedAddress = userData.address 
          ? (typeof userData.address === 'string' ? JSON.parse(userData.address) : userData.address)
          : {};

        setProfileData({
          ...userData,
          birthdate: formattedBirthdate,
          address: parsedAddress
        });

        const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
        const profilePhotoUrl = userData.profilePhoto
          ? `${BASE_URL}${userData.profilePhoto}`
          : 'DashboardAssets/assets/images/user.png';

        setPreviewImage(profilePhotoUrl);

        // Remove old photo and save the current one
        localStorage.removeItem("profilePhoto");
        localStorage.setItem("username", userData.username || userData.name || "");
        console.log("Fetched name:", userData.name);
console.log("Fetched username:", userData.username);

        window.dispatchEvent(new Event("usernameUpdated"));
        localStorage.setItem("profilePhoto", profilePhotoUrl);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile data");
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
    // Load from localStorage if available
    const storedImage = localStorage.getItem("profilePhoto");
    if (storedImage) setPreviewImage(storedImage);
  }, [userId]);

  const [activeTab, setActiveTab] = useState('Settings');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabFromUrl = queryParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    navigate({
      pathname: location.pathname,
      search: `?tab=${tabName}`,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const [, subKey] = name.split('.');

    setProfileData((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [subKey]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('lastName', profileData.lastName);
      formData.append('address', JSON.stringify(profileData.address));
      formData.append('gender', profileData.gender);
      formData.append('birthdate', profileData.birthdate);
      formData.append('bio', profileData.bio);
      formData.append('username', profileData.username || '');
      formData.append('email', profileData.email || '');
      formData.append('phone', profileData.phone || '');
      if (
        passwordData.currentPassword ||
        passwordData.newPassword ||
        passwordData.confirmPassword
      ) {
        formData.append('currentPassword', passwordData.currentPassword);
        formData.append('newPassword', passwordData.newPassword);
        formData.append('confirmPassword', passwordData.confirmPassword);
      }
      if (imageFile) {
        formData.append('profilePhoto', imageFile);
      }

      const response = await putAPI(`/auth/users/${userId}`, formData, {
        'Content-Type': 'multipart/form-data',
      });

      // Update image locally & navbar
      if (response.data?.user?.profilePhoto) {
        const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
        const fullImageUrl = `${BASE_URL}${response.data.user.profilePhoto}`;

        setPreviewImage(fullImageUrl);

        // Remove old image and update new one
        localStorage.removeItem("profilePhoto");
        localStorage.setItem("profilePhoto", fullImageUrl);

        // Notify NavBar to update immediately
        window.dispatchEvent(new Event("profilePhotoUpdated"));
      }
      if (response.data?.user?.name) {
  localStorage.setItem("username", response.data.user.name);
  window.dispatchEvent(new Event("usernameUpdated"));
}

      toast.success(response.message || 'Profile updated successfully!');

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  const tabs = [
    { name: 'Settings', component: Settings },
    { name: 'Billings', component: Billings },
    { name: 'Preferences', component: Preferences },
  ];

  return (
    <div className="container-fluid">
      {/* Tabs and form layout */}
      {/* ...Keep the rest of your form code as it is... */}
    </div>
  );
};

export default UserProfileForm;
