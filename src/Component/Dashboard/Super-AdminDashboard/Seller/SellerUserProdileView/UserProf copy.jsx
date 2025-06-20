import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Pereferences/Pereferences';
import Billings from './Billings/Billings';
import Products from './Products/Product';
import Transaction from './Transaction/Transaction';
import SoldProduct  from './SoldProduct/SoldProduct'
import Packagingmaterial from './PackagingMaterial/ProductPurchasedSeller'
import getAPI from '../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import Settings from './UserProfile/BasicInformation';
import useUserType from '../../../urlconfig'

const UserProfileForm = () => {
  const userType = useUserType();
  // const { userId } = useParams();
  const location = useLocation();
    const { seller } = location.state || {};

  const navigate = useNavigate(); 
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('DashboardAssets/assets/images/user.png');
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

    const userId = seller?._id;


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('lastName', profileData.lastName);
      formData.append('address', JSON.stringify(profileData.address));
      formData.append('gender', profileData.gender);
      formData.append('birthdate', profileData.birthdate);
      formData.append('website', profileData.website);

      if (imageFile) {
        formData.append('profilePhoto', imageFile);
      }

      const response = await fetch(`/auth/users/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        toast.error(`Failed to update profile: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  const tabs = [
    { name: 'Settings', component: Settings },
    { name: 'Products', component: Products },
    { name: 'Transaction', component: Transaction },
    { name: 'Sold Products', component: SoldProduct },
    { name: 'Packaging Material', component: Packagingmaterial },
    { name: 'Billings', component: Billings },
    { name: 'Preferences', component: Preferences },

  ];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Seller Profile View</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
<span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
    <i className="fa fa-dashboard"></i>
</span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/super-admin/seller/management')}
                  style={{ cursor: 'pointer' }}
                >
                  SellerManageTable
                </span>
              </li>
              <li className="breadcrumb-item">Seller Profile View</li>
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
