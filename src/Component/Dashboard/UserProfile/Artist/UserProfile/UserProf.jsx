import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Preferences/Pereferences';
import getAPI from '../../../../../api/getAPI';
import Settings from './UserInfo/BasicInformation';
import putAPI from '../../../../../api/putAPI';
import { getImageUrl } from '../../../../../utils/getImageUrl';
import postAPI from '../../../../../api/postAPI';

// ─── Complete Profile Popup ───────────────────────────────────────────────────
const CompleteProfilePopup = ({ onClose, onCheckNow, missingFields }) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <div
      style={{
        background: '#fff', borderRadius: '16px', padding: '36px 32px',
        maxWidth: '480px', width: '90%', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        textAlign: 'center', position: 'relative',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg,#AD6449,#c97a4e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <i className="fa fa-user-circle" style={{ fontSize: 30, color: '#fff' }} />
      </div>

      <h3 style={{ marginBottom: 8, color: '#2d3748', fontWeight: 700 }}>
        Complete Your Profile
      </h3>
      <p style={{ color: '#718096', marginBottom: 20, lineHeight: 1.6 }}>
        Welcome to Artsays! Please complete all profile sections to activate your artist account and get verified by the admin.
      </p>

      {missingFields && missingFields.length > 0 && (
        <div style={{
          background: '#FFF3E0', borderLeft: '4px solid #FFA000',
          borderRadius: 6, padding: '12px 16px', marginBottom: 20,
          textAlign: 'left',
        }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#E65100', fontSize: 13 }}>
            Sections still needed:
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {missingFields.map((f) => (
              <li key={f} style={{ color: '#E65100', fontSize: 13 }}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={onCheckNow}
          style={{
            background: 'linear-gradient(135deg,#AD6449,#c97a4e)',
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}
        >
          Complete Profile
        </button>
        <button
          onClick={onClose}
          style={{
            background: '#f4f4f4', color: '#555', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontWeight: 600,
            cursor: 'pointer', fontSize: 14,
          }}
        >
          Later
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const UserProfileForm = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('/DashboardAssets/assets/images/user.png');
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

  // ── Popup state ──────────────────────────────────────────────────────────────
  const [showPopup, setShowPopup] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [profileCompleted, setProfileCompleted] = useState(false);

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

        const profilePhotoUrl = result.data.user.profilePhoto ? getImageUrl(result.data.user.profilePhoto) : '/DashboardAssets/assets/images/user.png';
        setPreviewImage(profilePhotoUrl);
        setProfileCompleted(result.data.user.profileCompleted || false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile data");
    }
  };

  // ── Check completion status ──────────────────────────────────────────────────
  const checkProfileCompletion = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getAPI(`/auth/profile-completion-status/${userId}`, {}, true, false);
      const data = res.data;
      setMissingFields(data.missingFields || []);
      setProfileCompleted(data.profileCompleted || false);

      if (data.complete && !data.profileCompleted) {
        // All fields filled → notify super-admin
        try {
          await postAPI(`/auth/notify-profile-complete/${userId}`, {});
          setProfileCompleted(true);
          toast.success('Profile completed! Admin has been notified for verification.');
        } catch (_) {}
      }
      return data;
    } catch (err) {
      console.error('Profile completion check error:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // ── Show popup on first visit after signup ───────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const shouldShow = sessionStorage.getItem('showCompleteProfilePopup') === 'true';
    if (shouldShow) {
      sessionStorage.removeItem('showCompleteProfilePopup');
      // Slight delay so profile data loads first
      const t = setTimeout(async () => {
        const data = await checkProfileCompletion();
        if (data && !data.complete) {
          setShowPopup(true);
        }
      }, 600);
      return () => clearTimeout(t);
    } else {
      // Also check on every load if profile not yet marked complete
      checkProfileCompletion();
    }
  }, [userId, checkProfileCompletion]);

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

      // Re-check profile completion after every save
      await checkProfileCompletion();

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
    { name: 'Preferences', component: Preferences },
  ];

  return (
    <div className="container-fluid">
      {/* Complete Profile Popup */}
      {showPopup && (
        <CompleteProfilePopup
          missingFields={missingFields}
          onClose={() => setShowPopup(false)}
          onCheckNow={() => {
            setShowPopup(false);
            handleTabClick('Settings');
          }}
        />
      )}

      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Profile</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Profile</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile incomplete banner */}
      {!profileCompleted && missingFields.length > 0 && (
        <div
          style={{
            background: '#FFF3E0', border: '1px solid #FFA000',
            borderRadius: 8, padding: '12px 20px', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 8,
          }}
        >
          <span style={{ color: '#E65100', fontWeight: 500 }}>
            <i className="fa fa-exclamation-circle" style={{ marginRight: 8 }} />
            Your profile is incomplete. Please fill in all sections to get verified.
            <span style={{ marginLeft: 8, fontSize: 13, color: '#bf360c' }}>
              ({missingFields.length} section{missingFields.length !== 1 ? 's' : ''} remaining)
            </span>
          </span>
          <button
            onClick={() => setShowPopup(true)}
            style={{
              background: '#FFA000', color: '#fff', border: 'none',
              borderRadius: 6, padding: '6px 16px', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
            }}
          >
            View Details
          </button>
        </div>
      )}

      {/* Profile complete badge */}
      {profileCompleted && (
        <div
          style={{
            background: '#E8F5E9', border: '1px solid #4CAF50',
            borderRadius: 8, padding: '10px 20px', marginBottom: 16,
            color: '#2E7D32', fontWeight: 500,
          }}
        >
          <i className="fa fa-check-circle" style={{ marginRight: 8 }} />
          Profile complete! Admin has been notified for verification.
        </div>
      )}

      <div className="clearfix row">
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
                    fetchProfile={fetchProfile}
                    onProfileSaved={checkProfileCompletion}
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
