import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { DEFAULT_PROFILE_IMAGE } from './MyAccountPage/MyAccountPageComponent/Pages/Account/constant';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getAPI from '../../../api/getAPI';

export const NavUserState = () => {
  return (
    <div className="bg-white rounded-[10px] gap-[10px] font-semibold p-[20px]">
      <Link to="/login">
        <button
          className="w-[160px] h-[50px] p-[10px] gap-[10px] bg-[#6F4D34] text-white rounded-[10px] text-lg"
        >
          Login
        </button>
      </Link>
    </div>
  );
};

export const NavGuestState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const dropdownRef = useRef(null);

  const updateProfileImage = () => {
    const storedImage = localStorage.getItem('profilePhoto');
    if (storedImage) {
      setProfileImage(storedImage);
    } else {
      setProfileImage(DEFAULT_PROFILE_IMAGE);
    }
  };

  // Fetch user profile and userType
  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    if (storedType) {
      console.log('Detected userType:', storedType);
      setUserType(storedType);
    }

    // Fetch user profile
    const fetchUserProfile = async () => {
      if (!storedUserId) {
        console.log('No userId found in localStorage, using default image');
        setProfileImage(DEFAULT_PROFILE_IMAGE);
        return;
      }

      try {
        const response = await getAPI(`/auth/userid/${storedUserId}`, {}, true, false);
        console.log('Profile API response:', response.data);
        const profileData = response.data.user;
        const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || '${process.env.REACT_APP_API_URL}';
        const profilePhotoUrl = profileData?.profilePhoto
          ? `${BASE_URL}${profileData.profilePhoto}`
          : DEFAULT_PROFILE_IMAGE;
        setProfileImage(profilePhotoUrl);
        localStorage.setItem('profilePhoto', profilePhotoUrl); // Ensure localStorage is updated
      } catch (error) {
        console.error('Error fetching user profile:', error.response || error);
        toast.error('Failed to load profile image');
        setProfileImage(DEFAULT_PROFILE_IMAGE);
      }
    };

    if (localStorage.getItem('token') && storedUserId) {
      fetchUserProfile();
    } else {
      console.log('No token or userId found, skipping profile fetch');
      setProfileImage(DEFAULT_PROFILE_IMAGE);
    }

    // Listen for profile photo updates
    window.addEventListener('profilePhotoUpdated', updateProfileImage);

    // Initialize profile image
    updateProfileImage();

    return () => {
      window.removeEventListener('profilePhotoUpdated', updateProfileImage);
    };
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePhoto'); // Clear profile photo
    setProfileImage(DEFAULT_PROFILE_IMAGE);
    window.dispatchEvent(new Event('profilePhotoUpdated')); // Notify other components
    window.location.href = '/';
  };

  return (
    <div className="relative flex flex-row gap-1 items-center" ref={dropdownRef}>
      <Link to="/profile">
        <img
          src={profileImage}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PROFILE_IMAGE;
          }}
        />
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <img src="/assets/home/toggle.svg" alt="Toggle Dropdown" />
        </button>

        {isOpen && userType && (
          <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-md w-44 z-10">
            <div className="flex flex-col gap-6 py-4 font-semibold">
              <nav className="flex flex-col gap-3 text-zinc-700 text-base">
                <Link
                  to={userType === 'Buyer' ? '/my-account' : `${userType}/dashboard`}
                  className="px-3 pb-2"
                >
                  {userType === 'Buyer' ? 'My Account' : 'My Dashboard'}
                </Link>

                {userType === 'Buyer' && (
                  <>
                    <hr className="text-[#6B4A2F]" />
                    <Link to="/my-account/wishlist" className="px-3 pb-2">
                      Wishlist
                    </Link>
                    <hr className="text-[#6B4A2F]" />
                    <Link to="/my-account/my-cart" className="px-3">
                      Cart
                    </Link>
                  </>
                )}
              </nav>

              <div className="flex flex-col gap-2">
                <button
                  className="border-2 border-[#6F4D34] rounded text-[#6F4D34] py-2 mx-3 hover:bg-[#6F4D34] hover:text-[#ffffff] transition ease-300"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};