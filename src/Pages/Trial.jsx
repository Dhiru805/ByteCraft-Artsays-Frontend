import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

function UpdateProfile() {
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
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);
          const userId = decodedToken.userId;
          setUserId(userId);

          const response = await fetch(`http://localhost:3001/auth/user/${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
          });

          if (response.ok) {
            const userData = await response.json();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const response = await fetch(`http://localhost:3001/auth/user/${encodeURIComponent(userId)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profileData),
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
    <div>
      {updateStatus && <p>{updateStatus}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={profileData.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name" required />
        <input type="email" name="email" value={profileData.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="phone" value={profileData.phone} onChange={handleChange} placeholder="Phone" />
        <input type="text" name="address.line1" value={profileData.address.line1} onChange={handleChange} placeholder="Address Line 1" />
        <input type="text" name="address.line2" value={profileData.address.line2} onChange={handleChange} placeholder="Address Line 2" />
        <input type="text" name="address.city" value={profileData.address.city} onChange={handleChange} placeholder="City" />
        <input type="text" name="address.state" value={profileData.address.state} onChange={handleChange} placeholder="State" />
        <input type="text" name="address.country" value={profileData.address.country} onChange={handleChange} placeholder="Country" />
        <input type="text" name="address.pincode" value={profileData.address.pincode} onChange={handleChange} placeholder="Pincode" />
        <select name="gender" value={profileData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="date" name="birthdate" value={profileData.birthdate} onChange={handleChange} />
        <input type="url" name="website" value={profileData.website} onChange={handleChange} placeholder="Website" />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
