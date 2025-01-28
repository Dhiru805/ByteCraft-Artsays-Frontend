import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preferences from './Pereferences';
import Billings from './Billings';
import Password from './Password';
import getAPI from '../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import useUserType from '../../urlconfig'

const UserProfileForm = () => {
  const { userId } = useParams();
  const userType = useUserType();
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

  const fetchProfile = async () => {
    try {
      const result = await getAPI(`http://localhost:3001/auth/userid/${userId}`, {}, true, false);
      console.log(result);
      if (result.data.user) {
        const userData = result.data.user;
        const formattedBirthdate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';
        const parsedAddress = userData.address ? (typeof userData.address === 'string' ? JSON.parse(userData.address) : userData.address) : {};

        setProfileData({
          ...userData,
          birthdate: formattedBirthdate,
          address: parsedAddress,
        });

        const BASE_URL = 'http://localhost:3001';
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

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Artist Profile</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <i className="fa fa-dashboard" />
                </a>
              </li>
              <li className="breadcrumb-item"><Link to={`/${userType}/Dashboard/ArtistManageTable`}>ArtistManageTable</Link></li>
              <li className="breadcrumb-item">Artist Profile</li>
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
                    <div className="media-left m-r-15" style={{ width: '140px', height: '140px', overflow: 'hidden' }}>
                      <img
                        src={previewImage}
                        className="user-photo media-object"
                        alt="User"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="media-body">
                      <p>Your photo is displayed above.</p>
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
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label className="fancy-radio">
                          <input
                            name="gender"
                            value="male"
                            type="radio"
                            checked={profileData.gender === 'male'}
                            disabled
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
                            disabled
                          />
                          <span>
                            <i /> Female
                          </span>
                        </label>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 1"
                          value={profileData.address?.line1}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                          value={profileData.address?.city}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Country"
                          value={profileData.address?.country}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Website"
                          value={profileData.website}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          value={profileData.lastName}
                          disabled
                        />
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
                            value={profileData.birthdate}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 2"
                          value={profileData.address?.line2}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State/Province"
                          value={profileData.address?.state}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Pincode"
                          value={profileData.address?.pincode}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Password
                  userId={userId}
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
