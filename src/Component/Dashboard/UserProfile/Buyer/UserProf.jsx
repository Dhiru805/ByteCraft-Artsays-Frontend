import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Pereferences/Pereferences';
import getAPI from '../../../../api/getAPI';
import putAPI from '../../../../api/putAPI';
import postAPI from '../../../../api/postAPI';
import Settings from './UserProfile/BasicInformation';
import { getImageUrl } from '../../../../utils/getImageUrl';

// ─── Delete Account Popup ─────────────────────────────────────────────────────
const DeleteAccountPopup = ({ onClose, onConfirm, loading }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '36px 32px',
      maxWidth: '520px', width: '92%', boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
      position: 'relative',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg,#e53e3e,#c53030)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <i className="fa fa-trash" style={{ fontSize: 26, color: '#fff' }} />
      </div>
      <h3 style={{ textAlign: 'center', marginBottom: 8, color: '#2d3748', fontWeight: 700, fontSize: 20 }}>
        Delete Account
      </h3>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: 20, lineHeight: 1.6, fontSize: 14 }}>
        Are you sure you want to delete your account? Please read the following carefully before confirming.
      </p>
      <div style={{
        background: '#FFF3E0', borderLeft: '4px solid #FF6B35',
        borderRadius: 8, padding: '14px 16px', marginBottom: 16,
      }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#E65100', fontSize: 14 }}>
          ⏳ 3-Day Grace Period
        </p>
        <p style={{ margin: 0, color: '#bf360c', fontSize: 13, lineHeight: 1.6 }}>
          Your account will be scheduled for deletion after <strong>3 days</strong>.
          If you <strong>log in again within 3 days</strong>, your account deletion will be
          <strong> automatically cancelled</strong> — no extra steps needed.
        </p>
      </div>
      <div style={{
        background: '#FFEBEE', border: '1px solid #EF9A9A',
        borderRadius: 8, padding: '12px 16px', marginBottom: 16,
      }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#C62828', fontSize: 13 }}>
          ⚠️ After 3 days, the following will be permanently deleted:
        </p>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#b71c1c', fontSize: 12, lineHeight: 1.8 }}>
          <li>Your profile and all personal information</li>
          <li>Orders, transactions, and wallet data</li>
          <li>Community posts, followers, and connections</li>
        </ul>
      </div>
      <div style={{
        background: '#E8F5E9', border: '1px solid #A5D6A7',
        borderRadius: 8, padding: '12px 16px', marginBottom: 24,
      }}>
        <p style={{ margin: 0, color: '#2E7D32', fontSize: 13, lineHeight: 1.6 }}>
          ✅ A <strong>confirmation email</strong> will be sent to your registered email address
          with instructions on how to cancel the deletion by logging in.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={onClose} disabled={loading} style={{
          background: '#f4f4f4', color: '#555', border: 'none',
          borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
        }}>
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} style={{
          background: loading ? '#ccc' : 'linear-gradient(135deg,#e53e3e,#c53030)',
          color: '#fff', border: 'none', borderRadius: 8,
          padding: '10px 28px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14,
        }}>
          {loading ? 'Processing...' : 'Yes, Delete My Account'}
        </button>
      </div>
    </div>
  </div>
);

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

  // ── Delete Account state ──────────────────────────────────────────────────────
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
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

        const BASE_URL = getImageUrl(null);
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

  const handleRequestDeletion = async () => {
    setDeleteLoading(true);
    try {
      const res = await postAPI(`/auth/request-deletion/${userId}`, {});
      toast.success(res.message || 'Account deletion scheduled. Check your email for details.');
      setShowDeletePopup(false);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to schedule account deletion.';
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { name: 'Settings', component: Settings },
    { name: 'Preferences', component: Preferences },
  ];

  return (
    <div className="container-fluid">
      {/* Delete Account Popup */}
      {showDeletePopup && (
        <DeleteAccountPopup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleRequestDeletion}
          loading={deleteLoading}
        />
      )}

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
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{
        marginTop: 24, padding: '20px 24px',
        border: '1px solid #FFCDD2', borderRadius: 8, background: '#FFF5F5',
      }}>
        <h4 style={{ color: '#C62828', fontWeight: 700, marginBottom: 6, fontSize: 15 }}>
          Danger Zone
        </h4>
        <p style={{ color: '#b71c1c', fontSize: 13, marginBottom: 12 }}>
          Once you request account deletion, you have <strong>3 days</strong> to cancel by logging in.
          After that, all your data will be permanently removed.
        </p>
        <button
          onClick={() => setShowDeletePopup(true)}
          style={{
            background: 'linear-gradient(135deg,#e53e3e,#c53030)',
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}
        >
          <i className="fa fa-trash" style={{ marginRight: 8 }} />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserProfileForm;
