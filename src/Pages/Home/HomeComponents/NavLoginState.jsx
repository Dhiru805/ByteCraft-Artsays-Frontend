// import { Link } from 'react-router-dom';
// import { useState, useRef, useEffect } from 'react';
// import { DEFAULT_PROFILE_IMAGE } from './MyAccountPage/MyAccountPageComponent/Pages/Account/constant';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import getAPI from '../../../api/getAPI';

// export const NavUserState = () => {
//   return (
//     <div className="bg-white rounded-[10px] gap-[10px] font-semibold p-[20px]">
//       <Link to="/login">
//         <button
//           className="w-[160px] h-[50px] p-[10px] gap-[10px] bg-[#6F4D34] text-white rounded-[10px] text-lg"
//         >
//           Login
//         </button>
//       </Link>
//     </div>
//   );
// };

// export const NavGuestState = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
//   const dropdownRef = useRef(null);

//   const updateProfileImage = () => {
//     const storedImage = localStorage.getItem('profilePhoto');
//     if (storedImage) {
//       setProfileImage(storedImage);
//     } else {
//       setProfileImage(DEFAULT_PROFILE_IMAGE);
//     }
//   };

//   // Fetch user profile and userType
//   useEffect(() => {
//     const storedType = localStorage.getItem('userType');
//     const storedUserId = localStorage.getItem('userId');
//     if (storedType) {
//       console.log('Detected userType:', storedType);
//       setUserType(storedType);
//     }

//     // Fetch user profile
//     const fetchUserProfile = async () => {
//       if (!storedUserId) {
//         console.log('No userId found in localStorage, using default image');
//         setProfileImage(DEFAULT_PROFILE_IMAGE);
//         return;
//       }

//       try {
//         const response = await getAPI(`/auth/userid/${storedUserId}`, {}, true, false);
//         console.log('Profile API response:', response.data);
//         const profileData = response.data.user;
//         const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || 'http://localhost:3001';
//         const profilePhotoUrl = profileData?.profilePhoto
//           ? `${BASE_URL}${profileData.profilePhoto}`
//           : DEFAULT_PROFILE_IMAGE;
//         setProfileImage(profilePhotoUrl);
//         localStorage.setItem('profilePhoto', profilePhotoUrl); 
//       } catch (error) {
//         console.error('Error fetching user profile:', error.response || error);
//         toast.error('Failed to load profile image');
//         setProfileImage(DEFAULT_PROFILE_IMAGE);
//       }
//     };

//     if (localStorage.getItem('token') && storedUserId) {
//       fetchUserProfile();
//     } else {
//       console.log('No token or userId found, skipping profile fetch');
//       setProfileImage(DEFAULT_PROFILE_IMAGE);
//     }

//     // Listen for profile photo updates
//     window.addEventListener('profilePhotoUpdated', updateProfileImage);

//     // Initialize profile image
//     updateProfileImage();

//     return () => {
//       window.removeEventListener('profilePhotoUpdated', updateProfileImage);
//     };
//   }, []);

//   // Handle outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen]);

//   const handleSignOut = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('email');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('profilePhoto'); // Clear profile photo
//     setProfileImage(DEFAULT_PROFILE_IMAGE);
//     window.dispatchEvent(new Event('profilePhotoUpdated')); // Notify other components
//     window.location.href = '/';
//   };

//   return (
//     <div className="relative flex flex-row gap-1 items-center" ref={dropdownRef}>
//       <Link to="/profile">
//         <img
//           src={profileImage}
//           alt="Profile"
//           className="w-8 h-8 rounded-full object-cover"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = DEFAULT_PROFILE_IMAGE;
//           }}
//         />
//       </Link>

//       <div className="relative">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="focus:outline-none"
//         >
//           <img src="/assets/home/toggle.svg" alt="Toggle Dropdown" />
//         </button>

//         {isOpen && userType && (
//           <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-md w-44 z-10">
//             <div className="flex flex-col gap-6 py-4 font-semibold">
//               <nav className="flex flex-col gap-3 text-zinc-700 text-base">
//                 <Link
//                   to={userType === 'Buyer' ? '/my-account' : `/${userType}/dashboard`}
//                   className="px-3 pb-2"
//                 >
//                   {userType === 'Buyer' ? 'My Account' : 'My Dashboard'}
//                 </Link>

//                 {userType === 'Buyer' && (
//                   <>
//                     <hr className="text-[#6B4A2F]" />
//                     <Link to="/my-account/wishlist" className="px-3 pb-2">
//                       Wishlist
//                     </Link>
//                     <hr className="text-[#6B4A2F]" />
//                     <Link to="/my-account/my-cart" className="px-3">
//                       Cart
//                     </Link>
//                   </>
//                 )}
//               </nav>

//               <div className="flex flex-col gap-2">
//                 <button
//                   className="border-2 border-[#6F4D34] rounded text-[#6F4D34] py-2 mx-3 hover:bg-[#6F4D34] hover:text-[#ffffff] transition ease-300"
//                   onClick={handleSignOut}
//                 >
//                   Sign Out
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PROFILE_IMAGE } from './MyAccountPage/MyAccountPageComponent/Pages/Account/constant';
import getAPI from '../../../api/getAPI';
import { User, ChevronDown, ChevronUp, Gauge, Bell, LogOut, ShoppingCart } from 'lucide-react'; 


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
        // Mock REACT_APP_API_URL_FOR_IMAGE for v0 environment
        const BASE_URL = 'http://localhost:3001'; // Mock base URL
        const profilePhotoUrl = profileData?.profilePhoto
          ? `${BASE_URL}${profileData.profilePhoto}`
          : DEFAULT_PROFILE_IMAGE;
        setProfileImage(profilePhotoUrl);
        localStorage.setItem('profilePhoto', profilePhotoUrl);
      } catch (error) { // Removed type annotation
        console.error('Error fetching user profile:', error.response || error);
        console.error('Failed to load profile image');
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
    const handleClickOutside = (event) => { // Removed type annotation
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { // Removed type assertion
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
          src={profileImage || "/placeholder.svg"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Changed from e.currentTarget.onerror
            e.target.src = DEFAULT_PROFILE_IMAGE; // Changed from e.currentTarget.src
          }}
        />
      </Link>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {/* Replaced toggle.svg with Lucide icons for consistency */}
          {isOpen ? <ChevronUp className="h-5 w-5 text-[#48372d]" /> : <ChevronDown className="h-5 w-5 text-[#48372d]" />}
        </button>
        {isOpen && userType && (
          <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-md w-44 z-10 user-dropdown">
            <div className="dropdown-arrow"></div> {/* Added for styling */}
            <div className="flex flex-col gap-6 py-4 font-semibold">
              <nav className="flex flex-col gap-3 text-zinc-700 text-base">
                <Link
                  to={userType === 'Buyer' ? '/my-account' : `/${userType.toLowerCase()}/dashboard`}
                  className="px-3 pb-2 dropdown-item"
                  onClick={() => setIsOpen(false)}
                >
                  <Gauge className="inline-block mr-2 h-4 w-4" />
                  {userType === 'Buyer' ? 'My Account' : 'My Dashboard'}
                </Link>
                {userType === 'Buyer' && (
                  <>
                    <hr className="text-[#6B4A2F]" />
                    <Link to="/my-account/wishlist" className="px-3 pb-2 dropdown-item" onClick={() => setIsOpen(false)}>
                      <Bell className="inline-block mr-2 h-4 w-4" /> {/* Using Bell for notifications */}
                      Wishlist
                    </Link>
                    <hr className="text-[#6B4A2F]" />
                    <Link to="/my-account/my-cart" className="px-3 dropdown-item" onClick={() => setIsOpen(false)}>
                      <ShoppingCart className="inline-block mr-2 h-4 w-4" />
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
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .relative { position: relative; }
        .flex { display: flex; }
        .flex-row { flex-direction: row; }
        .gap-1 { gap: 0.25rem; }
        .items-center { align-items: center; }
        .w-8 { width: 2rem; } /* 32px */
        .h-8 { height: 2rem; } /* 32px */
        .rounded-full { border-radius: 9999px; }
        .object-cover { object-fit: cover; }
        .focus\\:outline-none:focus { outline: none; }
        .absolute { position: absolute; }
        .right-0 { right: 0; }
        .top-full { top: 100%; }
        .mt-2 { margin-top: 0.5rem; }
        .bg-white { background-color: white; }
        .border { border-width: 1px; }
        .rounded-md { border-radius: 0.375rem; } /* 6px */
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .w-44 { width: 11rem; } /* 176px */
        .z-10 { z-index: 10; }
        .flex-col { flex-direction: column; }
        .gap-6 { gap: 1.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .font-semibold { font-weight: 600; }
        .gap-3 { gap: 0.75rem; }
        .text-zinc-700 { color: #475569; }
        .text-base { font-size: 1rem; } /* 16px */
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .pb-2 { padding-bottom: 0.5rem; }
        .text-\\[\\#6B4A2F\\] { color: #6B4A2F; }
        .border-2 { border-width: 2px; }
        .border-\\[\\#6F4D34\\] { border-color: #6F4D34; }
        .rounded { border-radius: 0.25rem; } /* 4px */
        .text-\\[\\#6F4D34\\] { color: #6F4D34; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .mx-3 { margin-left: 0.75rem; margin-right: 0.75rem; }
        .hover\\:bg-\\[\\#6F4D34\\]:hover { background-color: #6F4D34; }
        .hover\\:text-\\[\\#ffffff\\]:hover { color: #ffffff; }
        .transition { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .ease-300 { transition-duration: 300ms; }
        .inline-block { display: inline-block; }
        .mr-2 { margin-right: 0.5rem; }
        .h-4 { height: 1rem; }
        .w-4 { width: 1rem; }

        /* Custom dropdown arrow and item styles from original CSS */
        .user-dropdown {
          border-radius: 15px; /* From original CSS */
          padding: 10px 0; /* From original CSS */
          min-width: 200px; /* From original CSS */
        }
        .dropdown-arrow {
          content: "";
          position: absolute;
          top: -10px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 10px solid #ffffff;
        }
        .dropdown-item {
          padding: 12px 20px; /* From original CSS */
          font-size: 16px; /* From original CSS */
          color: #000; /* From original CSS */
          display: flex;
          align-items: center;
          gap: 10px; /* From original CSS */
          transition: background 0.2s ease; /* From original CSS */
          text-decoration: none; /* Ensure no underline */
        }
        .dropdown-item:hover {
          background-color: #d5d5d5; /* From original CSS */
          border-radius: 0; /* From original CSS */
        }
      `}</style>
    </div>
  );
};
