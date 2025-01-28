import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Pereferences';
import Billings from './Billings';
import Password from './Password';

const UserProfileForm = () => {
  // const { userId: paramUserId } = useParams(); 
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('DashboardAssets/assets/images/user.png'); 

  const [profileData, setProfileData] = useState({
    // http://localhost:3001/api/buyers/get-Allbuyer'
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
            const address = userData.address ? JSON.parse(userData.address) : {};
            const formattedDate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';
            setProfileData({
              name: userData.name || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              userType: userData.userType || '',
              address: {
                line1: address.line1 || '',
                line2: address.line2 || '',
                city: address.city || '',
                state: address.state || '',
                country: address.country || '',
                pincode: address.pincode || '',
              },
              gender: userData.gender || 'male',
              birthdate: formattedDate,
              website: userData.website || '',
              username:userData.username || '',
              
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
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token && userId) {
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
            toast.success('Profile updated successfully!');
        } else {
              toast.error(`Failed to update profile: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };


  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>User Profile</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <i className="fa fa-dashboard" />
                </a>
              </li>
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
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#Settings">Settings</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#billings">Billings</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#preferences">Preferences</a>
                </li>
              </ul>
            </div>

            <div className="tab-content">
              <div className="tab-pane active" id="Settings">
                <div className="body">
                  <h6>Profile Photo</h6>
                  <div className="media">
                    <div className="media-left m-r-15">
                      <img src={previewImage} className="user-photo media-object" alt="User" />
                    </div>
                    <div className="media-body">
                      <p>Upload your photo.<br /> <em>Image should be at least 140px x 140px</em></p>
                      <button type="button" className="btn btn-default" id="btn-upload-photo"
                        onClick={() => document.getElementById('filePhoto').click()} >Upload Photo
                      </button>
                      <input type="file" id="filePhoto" className="sr-only" onChange={handleImageChange} />
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
                          placeholder="First Name"
                          value={profileData.name}
                          name="name"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          value={profileData.lastName}
                          name="lastName"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="fancy-radio">
                          <input
                            name="gender"
                            value="male"
                            type="radio"
                            checked={profileData.gender === 'male'}
                            onChange={handleChange}
                          />
                          <span>
                            <i /> Male
                          </span>
                        </label>
                        <label className="fancy-radio">
                          <input
                            name="gender"
                            value="female"
                            type="radio"
                            checked={profileData.gender === 'female'}
                            onChange={handleChange}
                          />
                          <span>
                            <i /> Female
                          </span>
                        </label>
                      </div>
                      <div className="form-group">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-calendar"></i></span>
                          </div>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Birthdate"
                            name="birthdate"
                            value={profileData.birthdate || ''} 
                            onChange={handleChange}
                          />

                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Website"
                          value={profileData.website}
                          name="website"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 1"
                          value={profileData.address.line1}
                          name="address.line1"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 2"
                          value={profileData.address.line2}
                          name="address.line2"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                          value={profileData.address.city}
                          name="address.city"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State/Province"
                          value={profileData.address.state}
                          name="address.state"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Country"
                          value={profileData.address.country}
                          name="address.country"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Pincode"
                          value={profileData.address.pincode}
                          name="address.pincode"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary mx-2" onClick={handleSubmit}>Update</button>
                  <button type="button" className="btn btn-default">Cancel</button>
                </div>
                <Password userId={userId} 
                email={profileData.email} 
                username={profileData.username}
                phoneNumber={profileData.phone}
                />
              </div>
              <Billings />
              <Preferences />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
