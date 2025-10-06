import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Preferences/Pereferences';
import Billings from './Billings/Billings';
// import ViewBlogRequest from './BlogRequest/ViewBlogRequest';
// import Blogs from "./Blogs/Blogs"
// import Products from "./Products/Product"
// import Productrequest  from "./ProductRequest/ProductRequestTable"
// import Transaction from "./Transaction/Transaction"
// import Packagingmaterial from "./PackagingMaterial/ProductPurchasedArtist"
// import Soldproduct  from "./SoldProduct/SoldProduct"
import getAPI from '../../../../../api/getAPI';
import Settings from './UserInfo/BasicInformation';
import putAPI from '../../../../../api/putAPI';

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
    username: '', 
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
  const [loading, setLoading] = useState(false);

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
        const formattedBirthdate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';
        const parsedAddress = userData.address ? (typeof userData.address === 'string' ? JSON.parse(userData.address) : userData.address) : {};

        setProfileData({
          ...userData,
          birthdate: formattedBirthdate,
          address: parsedAddress,
        });

        const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
        const profilePhotoUrl = result.data.user.profilePhoto ? `${BASE_URL}${result.data.user.profilePhoto}` : 'DashboardAssets/assets/images/user.png';
        setPreviewImage(profilePhotoUrl);
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
    setLoading(true);

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

      if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
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
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Settings', component: Settings },
    // { name: 'Blogs', component: Blogs},
    // { name: 'Blog Request', component: ViewBlogRequest },
    // { name: 'Products', component: Products },
    // { name: 'Product Request', component: Productrequest },
    // { name: 'Transaction', component: Transaction },
    // { name: 'Packaging Material', component: Packagingmaterial },
    // { name: 'Sold Product', component: Soldproduct },
    { name: 'Billings', component: Billings },
    { name: 'Preferences', component: Preferences },
  ];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Profile</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Profile</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <ul className="nav nav-tabs">
                {tabs.map((tab) => (
                  <li className="nav-item" key={tab.name}>
                    <a
                      className={`nav-link ${activeTab === tab.name ? 'active' : ''}`}
                      onClick={() => handleTabClick(tab.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tab.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tab-content">
              {tabs.map((tab) => (
                <div
                  key={tab.name}
                  className={`tab-pane ${activeTab === tab.name ? 'active' : ''}`}
                  id={tab.name}
                >
                  <tab.component
                    userId={userId}
                    profileData={profileData}
                    previewImage={previewImage}
                    handleImageUpload={handleImageUpload}
                    handleChange={handleChange}
                    handleAddressChange={handleAddressChange}
                    handleSubmit={handleSubmit}
                    passwordData={passwordData}
                    handlePasswordChange={handlePasswordChange}
                    loading={loading}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
