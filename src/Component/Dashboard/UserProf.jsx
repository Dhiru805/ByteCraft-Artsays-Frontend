import React, { useEffect, useState } from 'react';
import './UserProfile.css'
import {jwtDecode} from 'jwt-decode';
import Navbar from '../../Component/Dashboard/Dashboardcomponents/Navbar';
import UserAccount from './Dashboardcomponents/Sidebar/LeftSide';
import RightIconBar from './Dashboardcomponents/RightIconBar';
// import toastr from 'toastr'; // Uncomment to use toastr for notifications

const loadStyle = (href) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

function UserProf() {
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('DashboardAssets/assets/images/user.png'); // Default preview image

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
      pincode: '',
    },
    gender: 'male',
    birthdate: '',
    website: '',
    
  });
  const [userId, setUserId] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null);

  

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    loadStyle('/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css');
    loadStyle('/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css');
    loadStyle('/DashboardAssets/assets/vendor/bootstrap-datepicker/css/bootstrap-datepicker3.min.css');
    loadStyle('/DashboardAssets/assets/css/main.css');

    Promise.all([
      loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
      loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
      loadScript('/DashboardAssets/assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js'),
    ]).then(() => {
 
    }).catch(err => console.error('Failed to load script:', err));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
  
          const response = await fetch(`http://localhost:3001/auth/user/${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
  
          if (response.ok) {
            const userData = await response.json();
            console.log(userData.profilePhoto);
            setProfileData({
              name: userData.name || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              userType: userData.userType || '',
              address: {
                line1: userData.address?.line1 || '',
                line2: userData.address?.line2 || '',
                city: userData.address?.city || '',
                state: userData.address?.state || '',
                country: userData.address?.country || '',
                pincode: userData.address?.pincode || '',
              },
              gender: userData.gender || 'male',
              birthdate: userData.birthdate || '',
              website: userData.website || '',
              
            });
            
            // Set profile image URL or use default if not available
            const BASE_URL = 'http://localhost:3001'; 
setPreviewImage(userData.profilePhoto ? `${BASE_URL}${userData.profilePhoto}` : 'DashboardAssets/assets/images/user.png');

            console.log(userData.profilePhoto);
         
          } else {
            console.error('Failed to fetch profile data:', response.status, response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchProfile();
  }, []);
  
  useEffect(() => {
    console.log("Preview Image:", previewImage);
  }, [previewImage]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [addressField]: value },
      }));
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Update preview
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('lastName', profileData.lastName);
        formData.append('email', profileData.email);
        formData.append('phone', profileData.phone);
        formData.append('userType', profileData.userType);
        formData.append('address', JSON.stringify(profileData.address));
        formData.append('gender', profileData.gender);
        formData.append('birthdate', profileData.birthdate);
        formData.append('website', profileData.website);
        if (imageFile) formData.append('profilePhoto', imageFile);

        const response = await fetch(`http://localhost:3001/auth/user/${encodeURIComponent(userId)}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        if (response.ok) {
          setUpdateStatus('Profile updated successfully!');
        } else {
          setUpdateStatus(`Failed to update profile: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus('Error updating profile. Please try again.');
    }
  };


 

  return (
    <>
      <div id="wrapper" className="theme-cyan">
        <Navbar />
        <UserAccount />
        <RightIconBar />
        <div id="main-content">
          <div className="container-fluid">
            <div className="block-header">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <h2>User Profile</h2>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
                    <li className="breadcrumb-item">Extra</li>
                    <li className="breadcrumb-item active">User Profile</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="body">
                    <ul className="nav nav-tabs">
                      <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#Settings">Settings</a></li>
                      <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#billings">Billings</a></li>
                      <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#preferences">Preferences</a></li>
                    </ul>
                  </div>
                  <div className="tab-content">

                    {/* Settings Tab */}
                    <div className="tab-pane active" id="Settings">'
                    {updateStatus && <p>{updateStatus}</p>}'
                      <form onSubmit={handleSubmit}>
                      <div className="body">
                      <h6>Profile Photo</h6>
              <div className="media">
                <img src={previewImage} className="user-photo media-object" alt="User" />
                <div>
                  <p>Upload your photo. <br /> <em>Image should be at least 140px x 140px</em></p>
                  <button type="button" className="btn btn-default">
                    <label htmlFor="filePhoto">Upload Photo</label>
                  </button>
                  <input type="file"name="profilePhoto" id="filePhoto" className="sr-only" onChange={handleImageChange} />
                </div>
              </div>
                      </div>
                        <div className="body">
                          <h6>Basic Information</h6>
                          <div className="row clearfix">
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="name" 
                                  placeholder="First Name" 
                                  value={profileData.name} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="lastName" 
                                  placeholder="Last Name" 
                                  value={profileData.lastName} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <div>
                                  <label className="fancy-radio">
                                    <input 
                                      name="gender" 
                                      value="male" 
                                      type="radio" 
                                      checked={profileData.gender === 'male'} 
                                      onChange={handleChange} 
                                    />
                                    <span><i></i>Male</span>
                                  </label>
                                  <label className="fancy-radio">
                                    <input 
                                      name="gender" 
                                      value="female" 
                                      type="radio" 
                                      checked={profileData.gender === 'female'} 
                                      onChange={handleChange} 
                                    />
                                    <span><i></i>Female</span>
                                  </label>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="icon-calendar"></i></span>
                                  </div>
                                  <input 
                                    data-provide="datepicker" 
                                    data-date-autoclose="true" 
                                    className="form-control" 
                                    name="birthdate" 
                                    placeholder="Birthdate" 
                                    value={profileData.birthdate} 
                                    onChange={handleChange} 
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="website" 
                                  placeholder="Website" 
                                  value={profileData.website} 
                                  onChange={handleChange} 
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="address.line1" 
                                  placeholder="Address line1" 
                                  value={profileData.address.line1} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="address.line2" 
                                  placeholder="Address Line2" 
                                  value={profileData.address.line2} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="address.city" 
                                  placeholder="address.City" 
                                  value={profileData.address.city} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="address.state" 
                                  placeholder="address.State" 
                                  value={profileData.address.state} 
                                  onChange={handleChange} 
                                />
                              </div>
                            </div>
                          </div>
                          <h6>Account Settings</h6>
                          <div className="row clearfix">
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="username" 
                                  placeholder="Username" 
                                  value={profileData.username} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="email" 
                                  placeholder="Email" 
                                  value={profileData.email} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="phone" 
                                  placeholder="Phone" 
                                  value={profileData.phone} 
                                  onChange={handleChange} 
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  name="currentPassword" 
                                  placeholder="Current Password" 
                                  value={profileData.currentPassword} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  name="newPassword" 
                                  placeholder="New Password" 
                                  value={profileData.newPassword} 
                                  onChange={handleChange} 
                                />
                              </div>
                              <div className="form-group">
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  name="confirmPassword" 
                                  placeholder="Confirm Password" 
                                  value={profileData.confirmPassword} 
                                  onChange={handleChange} 
                                />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Billing and Preferences Tab Content Here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProf;
