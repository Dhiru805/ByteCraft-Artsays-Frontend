import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewBlogRequest from "./BlogRequest/ViewBlogRequest"
import Blogs from "./Blogs/Blogs"
import Preferences from './Pereferences/Pereferences';
import Products from './Products/Product';
import Productrequest from './ProductRequest/ProductRequestTable'
import SoldProduct from './SoldProduct/SoldProduct'
import Customrequest from '../../BuyerManagement/BuyerUserProdileView/CustomRequest/Customorder'
import getAPI from '../../../../../api/getAPI';
import Settings from './UserProfile/BasicInformation';
import useUserType from '../../../urlconfig'
import { getImageUrl } from '../../../../../utils/getImageUrl';


const UserProfileForm = () => {
  const userType = useUserType();
  const location = useLocation();
  const navigate = useNavigate();

  const artistFromState = location?.state?.artist;
  useEffect(() => {
    if (artistFromState && artistFromState._id) {
      localStorage.setItem("selectedArtist", JSON.stringify(artistFromState));
      localStorage.setItem("selectedArtistId", artistFromState._id);
    }
  }, [artistFromState]);

  const artist = JSON.parse(localStorage.getItem("selectedArtist"));
  const userId = artist?._id || localStorage.getItem("selectedArtistId");

  useEffect(() => {
    if (!artist || !userId) {
      toast.error("Invalid access. Redirecting...");
      navigate("/super-admin/artist/management");
    }
  }, [artist, userId, navigate]);

  const [previewImage, setPreviewImage] = useState('/DashboardAssets/assets/images/user.png');
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

  // const userId = artist?._id;


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

        const BASE_URL = getImageUrl(null)

        const profilePhotoUrl = result.data.user.profilePhoto ? getImageUrl(result.data.user.profilePhoto) : '/DashboardAssets/assets/images/user.png';
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
    navigate(
      {
        pathname: location.pathname,
        search: `?tab=${tabName}`,
      },
      {
        state: { artist },
      }
    );
  };

  // const handleAddressChange = (e) => {
  //   const { name, value } = e.target;
  //   const [, subKey] = name.split('.');

  //   setProfileData((prevState) => ({
  //     ...prevState,
  //     address: {
  //       ...prevState.address,
  //       [subKey]: value
  //     }
  //   }));
  // };

  // const handleTabClick = (tabName) => {
  //   setActiveTab(tabName);
  //   navigate({
  //     pathname: location.pathname,
  //     search: `?tab=${tabName}`,
  //   });
  // };

  // const handleAddressChange = (e) => {
  //   const { name, value } = e.target;
  //   const [, subKey] = name.split('.');

  //   setProfileData((prevState) => ({
  //     ...prevState,
  //     address: {
  //       ...prevState.address,
  //       [subKey]: value
  //     }
  //   }));
  // };


  const tabs = [
    { name: 'Settings', component: Settings },
    { name: 'Blogs', component: Blogs },
    { name: 'Blog Request', component: ViewBlogRequest },
    { name: 'Products', component: Products },
    { name: 'Product Request', component: Productrequest },
    { name: 'Sold Product', component: SoldProduct },
    { name: 'Custom Request', component: Customrequest },
    { name: 'Preferences', component: Preferences },
  ];


  // const handleExport = () => {
  //   try {
  //     const a = profileData || artist;

  //     if (!a || Object.keys(a).length === 0) {
  //       toast.error("No profile data to export");
  //       return;
  //     }


  //     const csvHeaders = [
  //       " Name",
  //       "Email",
  //       "Role",
  //       "Phone",
  //       "Address",
  //       "PAN No",
  //       "Aadhaar Number",
  //       "Bank Account Number"
  //     ];


  //     const address = a.address
  //       ? [
  //         a.address.line1,
  //         a.address.line2,
  //         a.address.city,
  //         a.address.state,
  //         a.address.country,
  //         a.address.pincode
  //       ]
  //         .filter(Boolean)
  //         .join(", ")
  //       : "";


  //     const csvRow = [
  //       a.name || a.username || "",
  //       a.email || "",
  //       a.userType || a.role || "",
  //       a.phone || "",
  //       address,
  //       a.panNumber || a.pan || "",
  //       a.aadhaarNumber || a.adhar || "",
  //       a.bankAccountNumber || a.bankAccount || ""
  //     ];

  //     //  Generate CSV
  //     const csvString = "\uFEFF" + csvHeaders.join(",") + "\n" + csvRow.join(",");

  //     //   download
  //     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;

  //     //  Artist-based file name
  //     const fileName = `${(a.name || "artist").replace(/\s+/g, "_")}_profile.csv`;
  //     link.setAttribute("download", fileName);

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Export failed:", error);
  //     toast.error("Failed to export artist details");
  //   }
  // };




  return (

    <div className="container-fluid">

      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Artist Profile</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/super-admin/artist/management')}
                  style={{ cursor: 'pointer' }}
                >
                  ArtistManageTable
                </span>
              </li>
              <li className="breadcrumb-item">Artist Profile</li>
            </ul>
          </div>
        </div>
      </div>

      
      {/*  Export Button  */}
      {/* <div className="d-flex justify-content-end align-items-start mt-8 mb-2 pe-3">
        <button
          onClick={handleExport}
          className="btn btn-success btn-sm d-flex align-items-center gap-2"
        >
          <i className="fa fa-download"></i> Export
        </button>
      </div> */}




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
                    artist={artist}
                    profileData={profileData}
                    previewImage={previewImage}
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
