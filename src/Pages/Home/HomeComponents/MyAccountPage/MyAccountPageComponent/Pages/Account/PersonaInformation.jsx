import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import putAPI from "../../../../../../../api/putAPI";
import getAPI from "../../../../../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "./constant";
import { FaCheck } from "react-icons/fa";
import postAPI from "../../../../../../../api/postAPI";
import PersonalInformationSkeleton from "../../../../../../../Component/Skeleton/Home/Account/PersonalInformationSkeleton";
export const AccountForm = () => {
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingPhoneOTP, setLoadingPhoneOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [showPhoneOTPField, setShowPhoneOTPField] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User ID not found. Please log in again.");
          return;
        }
        const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
        if (result.data.user) {
          const userData = result.data.user;
          const formattedBirthdate = userData.birthdate
            ? new Date(userData.birthdate).toISOString().split("T")[0]
            : "";

          setProfileData(userData);
          setName(userData.name || "");
          setLastName(userData.lastName || "");
          setUsername(userData.username || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || "");
          setBio(userData.bio || "");
          setGender(userData.gender || "Male");
          setBirthdate(formattedBirthdate);
          setIsEmailVerified(userData.emailVerified);
          setIsPhoneVerified(userData.numberVerified);
          // Set preview image
          const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
          const profilePhotoUrl = userData.profilePhoto
            ? `${BASE_URL}${userData.profilePhoto}`
            : DEFAULT_PROFILE_IMAGE;
          setProfileImage(profilePhotoUrl);
          localStorage.setItem("profilePhoto", profilePhotoUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(
          error?.response?.data?.message || "Error fetching profile data"
        );
      }
    };

    fetchProfile();
  }, []);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const normalizePhone = (phone) => {
    if (!phone) return null;

    // Convert to string and remove all non-digits
    let digits = phone.toString().replace(/\D/g, "");

    // Remove leading country code if present
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }

    // Validate Indian mobile number length
    if (digits.length !== 10) return null;

    return `+91${digits}`;
  };

  const handleSendOTP = async () => {
    const input = email.trim();
    const isEmail = isValidEmail(input);

    if (!isEmail) {
      toast.error("Please enter a valid email ");
      return;
    }

    try {
      setLoadingOTP(true);

      const payload = { email: input };

      await postAPI("/auth/send-otp", payload);
      setShowOTPField(true);
      toast.success(`OTP sent to your email !`);

      setIsEmailVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingOTP(false);
    }
  };
  const handleSendOTPtoPhone = async () => {
    const input = phone.trim();
    const isPhone = isValidPhone(input);

    if (!isPhone) {
      toast.error("Please enter a valid  phone number", isPhone);
      return;
    }

    try {
      setLoadingPhoneOTP(true);

      const payload = { phone: normalizePhone(input) };

      await postAPI("/auth/send-otp", payload);
      setShowPhoneOTPField(true);
      toast.success(`OTP sent to your number !`);

      setIsPhoneVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingPhoneOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    const input = email?.trim();
    const isEmail = isValidEmail(input);

    try {
      setLoadingOTP(true);

      if (isEmail) {
        const payload = { email: input, otp };

        const response = await postAPI("/auth/verify-otp", payload);

        if (response.data.success) {
          setIsEmailVerified(true);
          toast.success("Email verified successfully!");

          setShowOTPField(false);
          setOtp("");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoadingOTP(false);
    }
  };
  const handleVerifyPhoneOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    const input = phone.trim();
    const isPhone = isValidPhone(input);
    try {
      setLoadingPhoneOTP(true);

      if (isPhone) {
        const payload = { phone: normalizePhone(input), otp };

        const response = await postAPI("/auth/verify-otp", payload);

        if (response.data.success) {
          setIsPhoneVerified(true);
          setProfileData((pre) => ({ ...pre, numberVerified: true }));
          toast.success("Phone verified successfully!");
        }
        setShowPhoneOTPField(false);
        setOtp("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoadingPhoneOTP(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // for preview
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleDeleteImage = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const userId = localStorage.getItem('userId');

  //     if (!token || !userId) {
  //       toast.error('Please log in again.');
  //       return;
  //     }

  //     setLoading(true);
  //     await putAPI(
  //       `/auth/users/${userId}`,
  //       { profilePhoto: null },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setProfileImage(DEFAULT_PROFILE_IMAGE);
  //     setImageFile(null);

  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = '';
  //     }

  //     toast.success('Profile image deleted successfully!');
  //   } catch (error) {
  //     console.error('Error deleting profile image:', error.response?.data || error.message);
  //     toast.error(error?.response?.data?.message || 'Failed to delete profile image');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Please log in again.");
        return;
      }

      setLoading(true);
      await putAPI(
        `/auth/users/${userId}`,
        { profilePhoto: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileImage(DEFAULT_PROFILE_IMAGE);
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Update localStorage and dispatch custom event
      localStorage.setItem("profilePhoto", DEFAULT_PROFILE_IMAGE);
      window.dispatchEvent(new Event("profilePhotoUpdated")); // Dispatch event

      toast.success("Profile image deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting profile image:",
        error.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message || "Failed to delete profile image"
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('Form submitted');

  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('lastName', lastName);
  //   formData.append('username', username);
  //   formData.append('email', email);
  //   formData.append('phone', phone);
  //   formData.append('gender', gender);
  //   formData.append('birthdate', birthdate);
  //   formData.append('bio', bio);

  //   if (imageFile) {
  //     formData.append('profilePhoto', imageFile);
  //   }
  //   try {
  //     const token = localStorage.getItem('token');
  //     const userId = localStorage.getItem('userId');
  //     if (!token) {
  //       toast.error('No token found. Please log in again.');
  //       return;
  //     }
  //     if (!userId) {
  //       toast.error('User ID not found. Please log in again.');
  //       return;
  //     }
  //     setLoading(true);
  //     const res = await putAPI(
  //       `/auth/users/${userId}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     toast.success(res.message || 'Profile updated successfully!');

  //     console.log('Updated user:', res.data.user);

  //     if (res.hasError) {
  //       toast.error(res.message);
  //     } else {
  //       const fetchUpdatedProfile = async () => {
  //         try {
  //           const updated = await getAPI(`/auth/userid/${userId}`, {}, true, false);
  //           const user = updated.data.user;
  //           setName(user.name || '');
  //           setLastName(user.lastName || '');
  //           setUsername(user.username || '');
  //           setEmail(user.email || '');
  //           setPhone(user.phone || '');
  //           setGender(user.gender || 'Male');
  //           setBio(user.bio || '');
  //           const formattedBirthdate = user.birthdate
  //             ? new Date(user.birthdate).toISOString().split('T')[0]
  //             : '';
  //           setBirthdate(formattedBirthdate);

  //           const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  //           const profilePhotoUrl = user.profilePhoto
  //             ? `${BASE_URL}${user.profilePhoto}`
  //             : DEFAULT_PROFILE_IMAGE;
  //           setProfileImage(profilePhotoUrl);
  //         } catch (e) {
  //           console.error('Error refreshing profile after update:', e);
  //           toast.error(e?.response?.data?.message || 'Error refreshing profile');
  //         }
  //       };
  //       fetchUpdatedProfile();
  //     }
  //   } catch (error) {
  //     console.error('Update failed:', error.response?.data || error.message);
  //     toast.error(error?.response?.data?.message || 'Failed to update profile');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("birthdate", birthdate);
    formData.append("bio", bio);
    formData.append("emailVerified", isEmailVerified);
    formData.append("numberVerified", isPhoneVerified);
    if (imageFile) {
      formData.append("profilePhoto", imageFile);
    }
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }
      setLoading(true);
      const res = await putAPI(`/auth/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.message || "Profile updated successfully!");

      console.log("Updated user:", res.data.user);

      if (res.hasError) {
        toast.error(res.message);
      } else {
        const fetchUpdatedProfile = async () => {
          try {
            const updated = await getAPI(
              `/auth/userid/${userId}`,
              {},
              true,
              false
            );
            const user = updated.data.user;
            setName(user.name || "");
            setLastName(user.lastName || "");
            setUsername(user.username || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setGender(user.gender || "Male");
            setBio(user.bio || "");
            const formattedBirthdate = user.birthdate
              ? new Date(user.birthdate).toISOString().split("T")[0]
              : "";
            setBirthdate(formattedBirthdate);

            const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
            const profilePhotoUrl = user.profilePhoto
              ? `${BASE_URL}${user.profilePhoto}`
              : DEFAULT_PROFILE_IMAGE;
            setProfileImage(profilePhotoUrl);

            // Update localStorage and dispatch custom event
            localStorage.setItem("profilePhoto", profilePhotoUrl);
            window.dispatchEvent(new Event("profilePhotoUpdated")); // Dispatch event
          } catch (e) {
            console.error("Error refreshing profile after update:", e);
            toast.error(
              e?.response?.data?.message || "Error refreshing profile"
            );
          }
        };
        fetchUpdatedProfile();
      }
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  if (loading && !profileData) {
    return <PersonalInformationSkeleton />;
  }
  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold">Personal Information</h3>

      <div className="grid md:grid-cols-3">
        <div className="flex flex-col md:col-span-1 items-center gap-4">
          <div className="relative">
            <div className="w-[10rem] h-[10rem] bg-gray-300 rounded-full overflow-hidden">
              <img
                src={profileImage || DEFAULT_PROFILE_IMAGE}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {profileImage && profileImage !== DEFAULT_PROFILE_IMAGE && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#6F3E2D] rounded-full flex items-center justify-center border border-white cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white hover:text-red-500 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m4 0H5m1 0v12a2 2 0 002 2h8a2 2 0 002-2V6"
                  />
                </svg>
              </button>
            )}
          </div>
          <div>
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="profileUpload"
              className="bg-[#6F4D34] text-white text-sm font-semibold py-2 px-4 rounded-3xl cursor-pointer"
            >
              Upload Profile Image
            </label>
          </div>
        </div>
        <div className="md:col-span-2 space-y-6 content-center">
          <div>
            <label className="block text-sm">First Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nelson"
              className="w-full border-2 px-3 py-2 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="D."
              className="w-full border-2 px-3 py-2 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm">Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="mrstark"
            className="w-full border-2 px-3 py-2 rounded-xl"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full border-2 px-3 py-2 rounded-xl"
            style={{
              paddingRight: isValidEmail(email) ? "50px" : "10px",
            }}
            data-temp-mail-org={0}
            fdprocessedid="yelneg"
            disabled={isEmailVerified}
          />
          {!isEmailVerified && isValidEmail(email) && !showOTPField && (
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loadingOTP}
              style={{
                position: "absolute",
                right: "25px",
                top: !showPhoneOTPField ? "72.5%" : "43%",
                transform: "translateY(-44%)",
                background: "#6b4f36",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "26px",
                fontSize: "12px",
              }}
            >
              {loadingOTP ? "Sending..." : "Send OTP"}
            </button>
          )}

          {}
          {isEmailVerified && (
            <div
              style={{
                position: "absolute",
                right: "26px",
                top: "73%",
                transform: "translateY(-48%)",
                color: "#28a745",
                fontSize: "22px",
              }}
            >
              <FaCheck />
            </div>
          )}
        </div>
        {showOTPField && (
          <div className="mb-3 position-relative">
            <label
              className="form-label position-absolute text-dark px-2"
              style={{
                top: "-12px",
                left: "15px",
                fontStyle: "italic",
                fontSize: "0.8rem",
                zIndex: "1",
                background: "white",
              }}
            >
              Enter OTP
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-control text-center"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                // style={{
                //   height: '48px',
                //   border: "1px solid #6b4f36",
                //   fontSize: "20px",
                //   letterSpacing: '10px'
                // }}
              />
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loadingOTP || otp.length !== 6}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "52%",
                  transform: "translateY(-44%)",
                  background: "#6b4f36",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "26px",
                  fontSize: "12px",
                }}
              >
                Enter OTP
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm">Phone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 93656 00000"
            className="w-full border-2 px-3 py-2 rounded-xl"
            style={{
              paddingRight: isValidPhone(phone) ? "50px" : "10px",
            }}
          />
          {!isPhoneVerified && isValidPhone(phone) && !showPhoneOTPField && (
            <button
              type="button"
              onClick={handleSendOTPtoPhone}
              disabled={loadingPhoneOTP}
              style={{
                position: "absolute",
                left: "706px",
                top: "84.5%",
                transform: "translateY(-44%)",
                background: "#6b4f36",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "26px",
                fontSize: "12px",
              }}
            >
              {loadingPhoneOTP ? "Sending..." : "Send OTP"}
            </button>
          )}
          {isPhoneVerified && (
            <div
              style={{
                position: "absolute",
                right: "26px",
                top: !showPhoneOTPField ? "52%" : "43%",
                transform: "translateY(-48%)",
                color: "#28a745",
                fontSize: "22px",
              }}
            >
              <FaCheck />
            </div>
          )}
        </div>
        {showPhoneOTPField && (
          <div className="mb-3 position-relative">
            <label
              className="block text-sm"
              // className="form-label position-absolute text-dark px-2"
              // style={{
              //   top: "-12px",
              //   left: "15px",
              //   fontStyle: "italic",
              //   fontSize: "0.8rem",
              //   zIndex: "1",
              //   background: "white",
              // }}
            >
              Enter OTP
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="w-full border-2 px-3 py-2 rounded-xl"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleVerifyPhoneOTP}
                disabled={loadingPhoneOTP || otp.length !== 6}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "47%",
                  transform: "translateY(-44%)",
                  background: "#6b4f36",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "26px",
                  fontSize: "12px",
                }}
              >
                Enter OTP
              </button>
            </div>
          </div>
        )}
        <div className="md:col-span-1">
          <label className="block text-sm mb-2">Date of Birth</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border-2 px-3 py-2 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Gender</label>
          <div className="flex gap-4 text-lg text-gray-500 font-normal">
            <button
              type="button"
              onClick={() => handleGenderSelect("Male")}
              className={`flex-1 min-w-[120px] py-2 rounded-xl text-center ${
                gender === "Male"
                  ? "bg-[#6F3E2D] text-white"
                  : "border-2 border-gray-300"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect("Female")}
              className={`flex-1 min-w-[120px] py-2 rounded-xl text-center ${
                gender === "Female"
                  ? "bg-[#6F3E2D] text-white"
                  : "border-2 border-gray-400 text-black"
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
          placeholder="Write something about yourself..."
          className="w-full border-2 px-3 py-2 rounded-xl resize-none"
        />
      </div>

      <button
        type="submit"
        className="bg-[#6F4D34] text-white text-[17px] font-semibold w-full sm:w-[200px] py-2 px-4 rounded-3xl"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Changes"}
      </button>
    </form>
  );
};
