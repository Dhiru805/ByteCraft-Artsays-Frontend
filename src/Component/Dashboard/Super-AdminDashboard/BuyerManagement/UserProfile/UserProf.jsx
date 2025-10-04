import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Pereferences/Pereferences';
import Billings from './Billings/Billings';
import ProductPurchased from './ProductPurchased/ProductPurchased';
import Customrequest from './CustomRequest/Customorder'
import Transaction from './Transaction/BuyerTransaction'
import Packagingmaterial from './PackagingMaterial/ProductPurchasedBuyer'
import RsellProduct from './ResellProductRequest/ProductRequestTable'
import SodlProduct from './Soldproduct/SoldProduct'
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { Link } from 'react-router-dom';
import Settings from './UserProfile/BasicInformation';
import useUserType from '../../../urlconfig'

const UserProfileForm = () => {
  const userType = useUserType();
  // const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const buyerFromState = location?.state?.buyer || null;
  const buyerFromStorage = localStorage.getItem("selectedbuyer");
  const buyer = buyerFromState || (buyerFromStorage && JSON.parse(buyerFromStorage)) || null;

  const userId =
    buyer?.['_id'] ||
    (() => {
      try {
        const storedbuyer = JSON.parse(localStorage.getItem('selectedbuyer'));
        return storedbuyer?._id || localStorage.getItem('selectedbuyerId');
      } catch (e) {
        return localStorage.getItem('selectedbuyerId');
      }
    })();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!buyer || !userId) {
        toast.error("Invalid access. Redirecting...");
        navigate("/super-admin/buyer/management");
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [buyer, userId, navigate]);

  useEffect(() => {
    if (buyerFromState && buyerFromState._id) {
      localStorage.setItem("selectedbuyerId", buyerFromState._id);
      localStorage.setItem("selectedbuyer", JSON.stringify(buyerFromState));
    }
  }, [buyerFromState]);

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

  const fetchProfile = async () => {
    try {
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      console.log(result.data.user);
      if (result.data.user) {
        const userData = result.data.user;
        const formattedBirthdate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';
        let parsedAddress = {};

        if (Array.isArray(userData.address) && userData.address.length > 0) {
          parsedAddress = userData.address[0];
        } else if (typeof userData.address === 'string') {
          try {
            parsedAddress = JSON.parse(userData.address);
          } catch (err) {
            parsedAddress = {};
          }
        } else if (typeof userData.address === 'object') {
          parsedAddress = userData.address;
        }

        setProfileData({
          ...userData,
          birthdate: formattedBirthdate,
          address: parsedAddress,
        });


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
    }
  };

  const tabs = [
    { name: 'Settings', component: Settings },
    { name: 'Product Purchased', component: ProductPurchased },
    { name: 'Custom Request', component: Customrequest },
    { name: 'Transaction', component: Transaction },
    { name: 'Packaging Material', component: Packagingmaterial },
    { name: 'Resell Product', component: RsellProduct },
    { name: 'Sold Product', component: SodlProduct },
    { name: 'Billings', component: Billings },
    { name: 'Preferences', component: Preferences },
  ];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Buyer Profile</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/super-admin/buyer/management')}
                  style={{ cursor: 'pointer' }}
                >
                  BuyerManageTable
                </span>
              </li>
              <li className="breadcrumb-item">Buyer Profile</li>
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
