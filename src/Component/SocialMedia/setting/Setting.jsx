import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import getAPI from "../../../../src/api/getAPI";
import putAPI from "../../../../src/api/putAPI";
import AdPayments from "./Creator-Control/AdPayments";
import BrandedContent from "./Creator-Control/BrandedContent";
import PartnershipAds from "./Creator-Control/PartnershipAds";
import Faq from "./Creator-Control/Faq";
import WelcomeMessage from "./Creator-Control/WelcomeMessage";
import MinimumAge from "./Creator-Control/MinimumAge";
import MonetizationStatus from "./Creator-Control/MonetizationStatus";
import ViewCounts from "./Creator-Control/ViewCounts";
import AddProfessional from "./Creator-Control/AddProfessional";
import AppointmentRequests from "./Creator-Control/AppointmentRequests";

import { FaRegCircleUser } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";
import { LuArchive } from "react-icons/lu";
import { FaUserGroup } from "react-icons/fa6";
import { GoMention } from "react-icons/go";
import { FaRegComment } from "react-icons/fa";
import {
  RiBarChartBoxLine,
  RiProhibitedLine,
  RiVerifiedBadgeLine,
  RiQuestionLine,
  RiShieldUserLine,
} from "react-icons/ri";
import { FiEdit, FiChevronDown } from "react-icons/fi";

import { MdVerified } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { RiShieldStarFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import { IoPaperPlaneOutline } from "react-icons/io5";
import deleteAPI from "../../../api/deleteAPI";
import { Navigate } from "react-router-dom";
import postAPI from "../../../api/postAPI";

const userType  = localStorage.getItem("userType");


const items = [
  { key: "edit-profile", label: "Edit Profile", icon: <FaRegCircleUser /> },
  { key: "notifications", label: "Notifications", icon: <FiBell /> },

  ...(userType === "Artist"
      ? [{ key: "membership", label: "Membership", icon: <FaUserGroup /> }]
      : []),
  { key: "collaboration-mentions", label: "Collaboration and Mentions", icon: <GoMention /> },
  { key: "comments", label: "Comments", icon: <FaRegComment /> },
  { key: "blocked", label: "Blocked", icon: <RiProhibitedLine /> },
  { key: "verified", label: "Verified", icon: <RiVerifiedBadgeLine /> },
  { key: "help", label: "Help", icon: <RiQuestionLine /> },
  {
    key: "privacy-center",
    label: "Privacy Center",
    icon: <RiShieldUserLine />,
  },
];








const Setting = () => {
  const userType=localStorage.getItem("userType");
  // main
  const [active, setActive] = useState("");
  // for make setting bar and 0page responsive
  const [lgActive, setLgActive] = useState(false);

const userId = localStorage.getItem("userId");
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);


  // profile panel

  const [name, setName] = useState(profile?.firstName || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(profile?.profilePhoto || "");
  const [showSuggestion, setShowSuggestion] = useState();
  const [toggleEnable, setToggleEnable] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);

  useEffect(() => {
  if (profile) {
    setName(profile.firstName || "");
    setUsername(profile.username || "");
    setWebsite(profile.website || "");
    setBio(profile.bio || "");
    setProfilePhoto(profile.profilePhoto || "");
  }
}, [profile]);
  const bioMax = 150;
  const remaining = bioMax - bio.length;

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfilePhotoFile(file); // save actual file
    setProfilePhoto(URL.createObjectURL(file)); // preview
  }
};


const Delete=()=>{
  const userId = localStorage.getItem("userId");
  const del = deleteAPI(`/api/social-media/delete-account/${userId}`, true, true);
  if(del && !del.hasError){
    toast.success("Account deleted successfully");
    localStorage.clear();
    Navigate("/");
  }
  else{
    toast.error("Failed to delete account");
  }
}
const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");

  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("name", name);
  formData.append("username", username);
  formData.append("website", website);
  formData.append("bio", bio);

  if (profilePhotoFile) {
    formData.append("profilePhoto", profilePhotoFile); // actual file
  }
  console.log("Submitting profile update:", formData);
  try {
    const res = await putAPI(
      `/api/social-media/profile/update`,
      formData,
      true,  // auth
      true,  // multipart
      { "Content-Type": "multipart/form-data" } // header
    );

    if (res && !res.hasError) {
      toast.success("Profile updated successfully!");
      console.log(res.data.user);
    } else {
      toast.error(res?.message || "Failed to update profile");
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    toast.error(errorMessage);
  }
};
// privacy center panel
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

    // Fetch published policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await getAPI("/api/social-policies/published", {}, true);
        const fetchedPolicies = res.data.data || [];
        setPolicies(fetchedPolicies);

        // Auto select first policy if available
        if (fetchedPolicies.length > 0) {
          setSelectedPolicy(fetchedPolicies[0]);
        }
      } catch (err) {
        console.error("Error fetching published policies:", err);
      }
    };

    fetchPolicies();
  }, []);


  // notification panel
  const [phonePaused, setPhonePaused] = useState(false);
  const [likes, setLikes] = useState("off");
  const [likesCommentsPhotos, setLikesCommentsPhotos] = useState("following");
  const [comments, setComments] = useState("following");
  const [commentsLike, setCommentsLike] = useState("following");
  const [postsOfYou, setPostsOfYou] = useState("following");



  // collaboration and mention panel
  const [collaborationSetting, setCollaborationSetting] = useState("everyone"); // or 'following' / 'none'
  const [manualApprove, setManualApprove] = useState(false);
  const [mentionSetting, setMentionSetting] = useState("everyone");
  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const userId = localStorage.getItem("userId"); 
      const res = await getAPI(
        `/api/social-media/settings/collab-mention/${userId}`,
        {},
        true,
        true
      );

      if (res?.data?.success) {
        setCollaborationSetting(res.data.collaborationSettings?.allowFrom || "everyone");
        setManualApprove(res.data.collaborationSettings?.manualApprove || false);
        setMentionSetting(res.data.mentionSettings?.allowFrom || "everyone");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  fetchSettings();
}, []);

const updateSettings = async (updates) => {
  try {
    const userId = localStorage.getItem("userId");

    const res = await putAPI(
      "/api/social-media/settings/collab-mention",
      { userId, ...updates },
      true,
      true
    );

    if (!res.success) {
      console.error("Failed to update settings:", res.message);
    }
  } catch (error) {
    console.error("Error updating settings:", error);
  }
};


  // comment panel
  const [commentSettings, setCommentSettings] = useState({
  allowCommentsFrom: "everyone",
  allowGifComments: true,
});
  const handleSettingsChange = async (field, value) => {
    const userId = localStorage.getItem("userId");
  try {
    const body = { 
      userId, 
      allowCommentsFrom: field === "allowCommentsFrom" ? value : commentSettings.allowCommentsFrom,
      allowGifComments: field === "allowGifComments" ? value : commentSettings.allowGifComments,
    };

    const res = await putAPI("/api/social-media/comment-settings", body, true, true); // if using axios.put wrap with postAPI
    setCommentSettings(res.data.commentSettings);
  } catch (err) {
    console.error("Error updating comment settings:", err);
  }
};


  // help panel





     const fetchProfile = useCallback(async () => {
  try {
    console.log("Fetching profile for userId:", userId);
    const res = await getAPI(`/api/social-media/profile/${userId}`, {}, false, true);
    if (res?.data?.profile) {
      setProfile(res.data.profile);

      if (res.data.profile.commentSettings) {
        setCommentSettings(res.data.profile.commentSettings);
      }
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  } finally {
    setLoading(false);
  }
}, [userId]); 
    useEffect(() => {
    const handleResize = () => {

 
  
  if (userId) fetchProfile();

      if (window.innerWidth >= 1024) {
        setActive("edit-profile");
      } else {
        setActive(""); // or some mobile default
      }
    };

    // Run once on mount
    handleResize();

    // Optional: Update on resize too
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [userId, fetchProfile]);

  // ✅ Unblock user function
const handleUnblock = async (targetUserId) => {
  const userId = localStorage.getItem("userId"); // logged-in user id
  try {
    const res = await putAPI(
      "/api/social-media/block-unblock", 
      { userId, targetUserId }, // 👈 send both IDs
      true, // private API
      true
    );

    if (res?.data?.success) {
      // ✅ Update state after unblock
      setProfile((prev) => ({
        ...prev,
        blocked: prev.blocked.filter((u) => u._id !== targetUserId),
      }));

      console.log("User unblocked:", targetUserId);
    }
  } catch (err) {
    console.error("Error unblocking user:", err);
  }
};



  // verified panel
  const [badges, setBadges] = useState([]);
  const [activeBadge, setActiveBadge] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [eligibilityErrors, setEligibilityErrors] = useState({});

  // 🔹 Fetch all badges
  const fetchBadges = async () => {
    try {
      const response = await getAPI("/api/badges", {}, true);
      setBadges(response.data.data || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast.error("Failed to load badges");
    }
  };

  // 🔹 Check eligibility for each badge
  const checkEligibility = async (badgeId) => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await postAPI("/api/badges/check-eligibility", {
        userId,
        badgeId,
      });

      if (!res.data.success) {
        setEligibilityErrors((prev) => ({
          ...prev,
          [badgeId]: res.data.message || "You are not eligible for this badge",
        }));
      } else {
        setEligibilityErrors((prev) => {
          const copy = { ...prev };
          delete copy[badgeId];
          return copy;
        });
      }
    } catch (err) {
      console.error("Eligibility check failed:", err);
    }
  };

  // 🔹 Apply for badge
  const handleApplyForBadge = async (badgeId) => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await postAPI("/api/badges/purchase", {
        userId,
        badgeId,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowPopup(false);
        setShowSuccessPopup(true);
        fetchBadges();
        fetchProfile();
      } else {
        toast.error(res.data.message || "Failed to apply badge");
      }
    } catch (err) {
      console.error("Apply Badge Error:", err);
      toast.error("Error applying badge");
    }
  };

  // 🔹 Fetch badges on load
  useEffect(() => {
    fetchBadges();
  }, []);

  // 🔹 After badges load → check eligibility
  useEffect(() => {
    if (badges.length > 0) {
      badges.forEach((badge) => checkEligibility(badge._id));
    }
  }, [badges]);

  // 🔹 Open popup
  const handleOpenPopup = (badge) => {
    setActiveBadge(badge);
    setShowPopup(true);
  };

  // 🔹 Close popup
  const handleClosePopup = () => {
    setActiveBadge(null);
    setShowPopup(false);
  };


  // membership panel
   const [activeMemberships, setActiveMemberships] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [perks, setPerks] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newSelectedPerks, setNewSelectedPerks] = useState([]);
  const [newPrice, setNewPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedPerks, setEditedPerks] = useState([]);

  const [showPerksDropdown, setShowPerksDropdown] = useState(false);
  const [showEditPerksDropdown, setShowEditPerksDropdown] = useState(false);

  const perksDropdownRef = useRef(null);
  const editPerksDropdownRef = useRef(null);

  // ✅ Fetch perks
// ✅ Fetch perks
const fetchPerks = async () => {
  try {
    const res = await getAPI("/api/perks");
    setPerks(res.data.data || []); // 👈 use .data not .perks
  } catch (err) {
    console.error("Error fetching perks:", err);
  }
};


  // ✅ Fetch memberships
  const fetchMemberships = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await getAPI(`/api/membership?userId=${userId}`);
      setMemberships(res.data.memberships || []);
    } catch (err) {
      console.error("Error fetching memberships:", err);
    }
  };
const handleToggleMemberships = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const res = await putAPI("/api/membership/toggle-active", {
      userId,
      active: !activeMemberships,
    });
    if (res.data.success) {
      setActiveMemberships(res.data.membershipsActive);
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message || "Failed to toggle memberships");
    }
  } catch (err) {
    console.error("Toggle error:", err);
    toast.error("Error toggling memberships");
  }
};

  useEffect(() => {
    fetchPerks();
    fetchMemberships();
  }, []);

  // ✅ Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        perksDropdownRef.current &&
        !perksDropdownRef.current.contains(event.target)
      ) {
        setShowPerksDropdown(false);
      }
      if (
        editPerksDropdownRef.current &&
        !editPerksDropdownRef.current.contains(event.target)
      ) {
        setShowEditPerksDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle create membership
  const handleAddMembership = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const res = await postAPI("/api/membership/create", {
        userId,
        title: newTitle,
        perks: newSelectedPerks,
        price: newPrice,
      });
      if (res.data.success) {
        toast.success("Membership created");
        setNewTitle("");
        setNewSelectedPerks([]);
        setNewPrice("");
        fetchMemberships();
      } else {
        toast.error(res.data.message || "Failed to create membership");
      }
    } catch (err) {
      console.error("Create membership error:", err);
      toast.error("Error creating membership");
    }
  };

  // ✅ Handle update membership
  const handleSaveEdit = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await putAPI(`/api/membership/${id}`, {
        userId,
        title: editedTitle,
        perks: editedPerks,
        price: editedPrice,
      });
      if (res.data.success) {
        toast.success("Membership updated");
        setEditingId(null);
        fetchMemberships();
      } else {
        toast.error(res.data.message || "Failed to update membership");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating membership");
    }
  };

 const deleteMembership = async (id) => {
  try {
    const userId = localStorage.getItem("userId");

    const res = await deleteAPI(`/api/membership/${id}`, {
      params: { userId }, // ✅ goes into req.query
    });

    if (res.data.success) {
      toast.success("Membership deleted");
      fetchMemberships();
    } else {
      toast.error(res.data.message || "Failed to delete membership");
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Error deleting membership");
  }
};



  // ✅ Toggle expand
  const toggleMembershipExpanded = (id) => {
    setMemberships((prev) =>
      prev.map((m) => (m._id === id ? { ...m, expanded: !m.expanded } : m))
    );
  };
  useEffect(() => {
  const fetchToggleState = async () => {
    const userId = localStorage.getItem("userId");
    const res = await getAPI(`/api/memberships/active?userId=${userId}`);

    if (res.data.success) {
      setActiveMemberships(res.data.membershipsActive);
    }
  };
  if(userType==='Artist'){
    fetchToggleState();
  }
}, []);
useEffect(() => {
  const fetchToggle = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await getAPI(`/api/profile/post-products?userId=${userId}`);

      if (res.data.success) {
        setToggleEnable(res.data.postProductsEnabled);
      }
    } catch (err) {
      console.error("Error fetching toggle state:", err);
    }
  };

  if (userType === "Artist") {
    fetchToggle();
  }
}, [userType]);

const handleToggleChange = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const newValue = !toggleEnable;

    setToggleEnable(newValue); // ✅ update UI instantly (optimistic)

    await postAPI("/api/profile/post-products/toggle", {
      userId,
      enabled: newValue,
    });
  } catch (err) {
    console.error("Error updating toggle:", err);
  }
};

  return (
    <div className="lg:w-[78%] w-full lg:mx-auto mx-0 flex flex-row lg:px-1">
      <div
        className={`  ${
          lgActive ? "flex" : "hidden"
        } lg:flex w-full h-full  lg:w-[57%] mx-auto px-1`}
      >
        {/* Edit Profile panel */}
        {active === "edit-profile" && (
          <div className="w-full lg:mt-4 bg-white  lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-sm lg:p-6  space-y-6">
            {deleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md
        h-[30vh] flex flex-col justify-between items-center gap-4">
          <div className="flex flex-col items-center justify-between gap-4 ">
          <h1 className="text-[24px] font-bold text-[#000000]">Delete Account</h1>
        <p>Are you sure </p>
        </div>
        <div className="flex items-center justify-between w-full px-6">
          <button className="bg-gray-100 text-[#000000] text-lg px-4 py-2 rounded-lg"
          onClick={() => setDeleteAccount(false)}>Cancel</button>
          <button className="bg-red-500 text-gray-100 text-lg px-4 py-2 rounded-lg"
          onClick={Delete()}>Delete</button>
        </div>
        
        </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="  lg:space-y-6 space-y-3"
      >
        {/* Header */}
        <div className="flex items-center gap-1 outline-none">
          <h1 className="text-[24px] font-bold text-[#000000]">
            Edit Profile
          </h1>
        </div>

        {/* Avatar + change photo */}
        <div className="flex items-center justify-between bg-[#f1f4f8] rounded-lg overflow-hidden h-16">
          <div className="flex items-center ml-2">
            <img
             src={
    profilePhoto?.startsWith("blob:")
      ? profilePhoto // show preview
      : `${process.env.REACT_APP_API_URL_FOR_IMAGE}${profilePhoto}` // show from backend
  }
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div className="h-full flex items-center">
            <label className="cursor-pointer bg-[#48372D] text-[16px] text-white px-6 py-3 h-full flex items-center">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-[18px] font-semibold text-[#000000] mb-1">
            Name
          </label>
          <input
            placeholder={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#f1f4f8] rounded-md px-4 py-3 text-sm placeholder-[#000000] outline-none"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-[18px] font-semibold text-[#000000] mb-1">
            User Name
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#f1f4f8] rounded-md px-4 py-3 text-sm placeholder-[#000000] outline-none"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-[18px] font-semibold text-[#000000] mb-1">
            Website
          </label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-[#f1f4f8] rounded-md px-4 py-3 text-sm placeholder-[#000000] outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-[18px] font-semibold text-[#000000] mb-1">
            Bio
          </label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= bioMax) setBio(e.target.value);
              }}
              placeholder="Write your bio"
              className="w-full bg-[#f1f4f8] rounded-md px-4 py-2 text-sm resize-none min-h-[65px] outline-none placeholder-[#000000]"
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {remaining}/{bioMax}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label className="block text-[18px] font-semibold text-[#000000] mb-1">
            Contact
          </label>
          <div className="w-full bg-[#f1f4f8] rounded-md px-4 py-3 text-sm outline-none">
            {profile?.email}
          </div>
        </div>

        {/* Account suggestion toggle */}
        <div className="flex items-center gap-20">
          <div>
            <div className="text-[16px] font-semibold text-[#000000]">
              Account suggestion
            </div>
            <div className="text-[14px] text-medium text-[#000000]">
              Show account suggestion on profile
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={showSuggestion}
                onChange={() => setShowSuggestion((s) => !s)}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition ${
                  showSuggestion ? "bg-[#4f3823]" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                  showSuggestion ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-[#4f3823] text-white px-6 py-3 rounded-md font-medium"
          >
            Save changes
          </button>
        </div>
      </form>

    {userType === "Artist" && (
  <div className="flex justify-between w-[94%] mx-auto">
    <div className="text-[18px] text-[#000000] font-semibold">
      Post your products on your profile
    </div>
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={toggleEnable}
          onChange={handleToggleChange}
          className="sr-only"
        />
        <div
          className={`w-10 h-5 rounded-full transition ${
            toggleEnable ? "bg-[#4f3823]" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
            toggleEnable ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  </div>
)}

       <button className="w-full bg-[#4f3823] text-white text-2xl font-semibold rounded-xl py-3 mx-8 mx-auto"
              onClick={() => setDeleteAccount(true)}>Delete Account</button>
    </div>
        )}

        {/* Notifications panel */}
        {active === "notifications" && (
          <div className="w-full lg:mt-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="bg-white lg:rounded-xl lg:border lg:border-[#48372D] shadow-sm lg:p-6 space-y-8"
            >
              <div className="flex items-center gap-1">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-[24px] font-bold text-[#000000]">
                  Notifications
                </h1>
              </div>

              {/* Phone Notifications */}
              <div className="flex justify-between items-center px-3">
                <div>
                  <div className="text-[16px] text-[#000000] font-bold">
                    Phone Notifications
                  </div>
                  <div className="text-[14px] text-gray-600">Pause all</div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhonePaused((p) => !p)}
                  className={`relative inline-flex h-5 w-11 items-center rounded-xl transition-colors focus:outline-none ${
                    phonePaused ? "bg-[#4f3823]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-gray-100 shadow transition-transform ${
                      phonePaused ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Sections */}
              <div className="space-y-6 px-3">
                {/* Likes */}
                <div>
                  <div className="text-[16px] font-semibold mb-1 text-[#000000]">
                    Likes
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="likes"
                        value="off"
                        checked={likes === "off"}
                        onChange={() => setLikes("off")}
                      />
                      <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="likes"
                        value="following"
                        checked={likes === "following"}
                        onChange={() => setLikes("following")}
                      />
                      <span>From profiles I follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="likes"
                        value="everyone"
                        checked={likes === "everyone"}
                        onChange={() => setLikes("everyone")}
                      />
                      <span>From everyone</span>
                    </label>
                  </div>
                </div>

                {/* Like and comments on photos of you */}
                <div>
                  <div className="text-[16px] font-semibold mb-1 text-[#000000]">
                    Like and comments on photos of you
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="likesCommentsPhotos"
                        value="off"
                        checked={likesCommentsPhotos === "off"}
                        onChange={() => setLikesCommentsPhotos("off")}
                      />
                      <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="likesCommentsPhotos"
                        value="following"
                        checked={likesCommentsPhotos === "following"}
                        onChange={() => setLikesCommentsPhotos("following")}
                      />
                      <span>From profiles I follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="likesCommentsPhotos"
                        value="everyone"
                        checked={likesCommentsPhotos === "everyone"}
                        onChange={() => setLikesCommentsPhotos("everyone")}
                      />
                      <span>From everyone</span>
                    </label>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <div className="text-[16px] font-semibold mb-1 text-[#000000]">
                    Comments
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="comments"
                        value="off"
                        checked={comments === "off"}
                        onChange={() => setComments("off")}
                      />
                      <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="comments"
                        value="following"
                        checked={comments === "following"}
                        onChange={() => setComments("following")}
                      />
                      <span>From profiles I follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="comments"
                        value="everyone"
                        checked={comments === "everyone"}
                        onChange={() => setComments("everyone")}
                      />
                      <span>From everyone</span>
                    </label>
                  </div>
                </div>

                {/* Comments like */}
                <div>
                  <div className="text-[16px] font-semibold mb-1 text-[#000000]">
                    Comments like
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="commentsLike"
                        value="off"
                        checked={commentsLike === "off"}
                        onChange={() => setCommentsLike("off")}
                      />
                      <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="commentsLike"
                        value="following"
                        checked={commentsLike === "following"}
                        onChange={() => setCommentsLike("following")}
                      />
                      <span>From profiles I follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="commentsLike"
                        value="everyone"
                        checked={commentsLike === "everyone"}
                        onChange={() => setCommentsLike("everyone")}
                      />
                      <span>From everyone</span>
                    </label>
                  </div>
                </div>

                {/* Posts of you */}
                <div>
                  <div className="text-[16px] font-semibold mb-1 text-[#000000]">
                    Posts of you
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="postsOfYou"
                        value="off"
                        checked={postsOfYou === "off"}
                        onChange={() => setPostsOfYou("off")}
                      />
                      <span>Off</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="postsOfYou"
                        value="following"
                        checked={postsOfYou === "following"}
                        onChange={() => setPostsOfYou("following")}
                      />
                      <span>From profiles I follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="postsOfYou"
                        value="everyone"
                        checked={postsOfYou === "everyone"}
                        onChange={() => setPostsOfYou("everyone")}
                      />
                      <span>From everyone</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save / apply */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-[#4f3823] text-white px-6 py-3 rounded-md font-medium"
                >
                  Save changes
                </button>
              </div>
            </form>
            
          </div>
        )}

        {/* Membership panel */}
{userType === "Artist" && active === "membership" && (
  <div className="w-full h-full lg:mt-8 bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-sm overflow-y-scroll">
    <div className="flex items-center gap-1 sm:p-3 py-3">
      {lgActive && (
        <button
          className="text-[24px] font-bold text-[#000000]"
          onClick={() => setLgActive(false)}
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
      )}
      <h1 className="text-[24px] font-bold text-[#000000]">
        Manage membership
      </h1>
    </div>

    <div className="sm:px-10 space-y-6">
      {/* Active Memberships toggle */}
      <div className="flex justify-between items-center">
        <div className="text-[20px] text-[#000000] font-semibold">
          Active Memberships
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
  type="checkbox"
  checked={activeMemberships}
  onChange={handleToggleMemberships}
  className="sr-only"
/>

            <div
              className={`w-12 h-5 rounded-full transition ${
                activeMemberships ? "bg-[#4f3823]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                activeMemberships ? "translate-x-7" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>
      </div>

      {/* Create membership */}
      <div className="space-y-5">
        <div className="text-[21px] text-[#000000] font-semibold mb-2">
          Create your Membership
        </div>
        <form onSubmit={handleAddMembership} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Add title of your Membership"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-1 md:col-span-3 bg-[#F4F6F8] rounded-md px-4 py-3 text-sm outline-none placeholder:text-[17px] placeholder:text-[#737373]"
            />

            {/* ✅ Dropdown Perks with checkboxes */}
            <div className="col-span-1 md:col-span-3 relative" ref={perksDropdownRef}>
              <div
                onClick={() => setShowPerksDropdown((prev) => !prev)}
                className="bg-[#F4F6F8] rounded-md px-4 py-3 text-sm text-[#737373] cursor-pointer"
              >
                {newSelectedPerks.length > 0
                  ? perks
                      .filter((p) => newSelectedPerks.includes(p._id))
                      .map((p) => p.perkName)
                      .join(", ")
                  : "Choose perks"}
              </div>

              {showPerksDropdown && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                  {perks.map((perk) => (
                    <label key={perk._id} className="flex items-center gap-2 text-sm px-3 py-2 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={newSelectedPerks.includes(perk._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSelectedPerks((prev) => [...prev, perk._id]); // ✅ store id
                          } else {
                            setNewSelectedPerks((prev) => prev.filter((id) => id !== perk._id));
                          }
                        }}
                      />
                      {perk.perkName}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center bg-[#F4F6F8]">
              <span className="text-[19px] font-medium text-[#000000] pl-3">₹ | </span>
              <input
                placeholder="Add your charges"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                type="number"
                className="flex-1 bg-[#F4F6F8] rounded-md px-4 py-3 w-full h-full text-sm outline-none placeholder:text-[17px] placeholder:text-[#737373]"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-[#48372D] text-white px-7 py-2 text-[18px] rounded-md font-medium"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Current Memberships */}
      <div className="space-y-4">
        <div className="text-[17px] text-[#000000] font-semibold">Current Memberships</div>
        <div className="flex flex-col gap-3">
          {memberships.map((m) => (
            <div className="flex flex-col gap-2" key={m._id}>
              <div
                className={`${
                  m.expanded ? "border-[1px] border-[#000000] rounded-xl bg-white" : ""
                } flex items-center justify-between bg-[#F4F6F8] rounded-md sm:px-4 px-2 py-2`}
              >
                <div className="flex-1 flex flex-col">
                  <div className="font-medium sm:text-[16px] text-[15px] text-[#000000]">
                    {m.title}
                  </div>
                </div>
                {!m.expanded && (
                  <div className="flex items-center gap-2">
                    <div className="font-medium sm:text-[16px] text-[14px] text-[#000000]">
                      ₹ {m.price}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(m._id);
                        setEditedTitle(m.title);
                        setEditedPrice(m.price);
                        setEditedPerks(m.perks.map((p) => p._id)); // ✅ store ids
                      }}
                      className="p-1 text-[#48372D] rounded sm:text-[22px] text-[18px] font-bold hover:bg-gray-200"
                    >
                      <FiEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMembership(m._id)}
                      className="p-1 text-[#48372D] sm:text-[22px] text-[18px] font-bold rounded hover:bg-gray-200"
                    >
                      <i className="ri-delete-bin-6-fill "></i>
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleMembershipExpanded(m._id)}
                  className="p-1 rounded hover:bg-gray-200 ml-1"
                >
                  <FiChevronDown
                    className={`rounded sm:text-[22px] text-[18px] font-bold ${
                      m.expanded ? "rotate-180" : ""
                    } transition-transform`}
                  />
                </button>
              </div>

              {(m.expanded || editingId === m._id) && (
                <div className="w-full bg-white border-[1px] rounded-xl border-[#000000] bg-[#F9F9F9] p-4">
                  {editingId === m._id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="bg-[#F4F6F8] rounded-md px-4 py-2 text-sm outline-none text-[#000000]"
                      />
                      <input
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        type="number"
                        className="bg-[#F4F6F8] rounded-md px-4 py-2 text-sm outline-none text-[#000000]"
                      />

                      {/* ✅ Edit perks dropdown */}
                      <div className="relative" ref={editPerksDropdownRef}>
                        <div
                          onClick={() => setShowEditPerksDropdown((prev) => !prev)}
                          className="bg-[#F4F6F8] rounded-md px-4 py-2 text-sm cursor-pointer"
                        >
                          {editedPerks.length > 0
                            ? perks
                                .filter((p) => editedPerks.includes(p._id))
                                .map((p) => p.perkName)
                                .join(", ")
                            : "Choose perks"}
                        </div>
                        {showEditPerksDropdown && (
                          <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                            {perks.map((perk) => (
                              <label key={perk._id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editedPerks.includes(perk._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditedPerks((prev) => [...prev, perk._id]);
                                    } else {
                                      setEditedPerks((prev) => prev.filter((id) => id !== perk._id));
                                    }
                                  }}
                                />
                                {perk.perkName}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(m._id)}
                          className="bg-[#48372D] text-white px-5 py-2 text-sm rounded-md font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 text-black px-5 py-2 text-sm rounded-md font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[16px] font-semibold mb-2 text-[#000000]">
                        Included Perks:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-[#000000]">
                        {m.perks.map((perk) => (
                          <li key={perk._id}>{perk.perkName}</li> // ✅ show names
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}




       {/* collaboration and mention panel */}
{active === "collaboration-mentions" && (
  <div className="w-full lg:mt-8 bg-white rounded-xl lg:border lg:border-gray-200 lg:shadow-sm py-3">
    <div className="flex items-center gap-1 lg:px-4">
      {lgActive && (
        <button
          className="text-[24px] font-bold text-[#000000]"
          onClick={() => setLgActive(false)}
        >
          <i class="ri-arrow-left-s-line"></i>
        </button>
      )}
      <h1 className="text-[24px] font-bold text-[#000000]">
        Collaboration and Mentions
      </h1>
    </div>
    <div className=" p-6 space-y-6">
      {/* Who can Collaborate with you */}
      <div className="space-y-2">
        <div className="text-[16px] font-semibold">Who can Collaborate with you</div>
        <div className="text-sm text-gray-600">
          Choose who can Collaborate with you in their photos and videos. When people
          try to collaborate with you, they'll see if you don't allow collaboration from
          everyone.
        </div>

        {/* Collaboration radio */}
        <div className="mt-2">
          <div className="font-medium mb-1">Collaboration</div>
          <div className="flex flex-col gap-1 pl-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="collaboration"
                value="everyone"
                checked={collaborationSetting === "everyone"}
                onChange={() => {
                  setCollaborationSetting("everyone");
                  updateSettings({
                    collaborationSettings: { allowFrom: "everyone", manualApprove },
                  });
                }}
              />
              <span>Allow collaboration from everyone</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="collaboration"
                value="following"
                checked={collaborationSetting === "following"}
                onChange={() => {
                  setCollaborationSetting("following");
                  updateSettings({
                    collaborationSettings: { allowFrom: "following", manualApprove },
                  });
                }}
              />
              <span>Allow collaboration from people you follow</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="collaboration"
                value="none"
                checked={collaborationSetting === "none"}
                onChange={() => {
                  setCollaborationSetting("none");
                  updateSettings({
                    collaborationSettings: { allowFrom: "none", manualApprove },
                  });
                }}
              />
              <span>Don't allow collaboration</span>
            </label>
          </div>
        </div>

        {/* Manually approve collaboration */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="font-medium">Manually approve collaboration</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={manualApprove}
                onChange={() => {
                  const newVal = !manualApprove;
                  setManualApprove(newVal);
                  updateSettings({
                    collaborationSettings: { allowFrom: collaborationSetting, manualApprove: newVal },
                  });
                }}
                className="sr-only"
              />
              <div
                className={`w-14 h-7 rounded-full transition ${
                  manualApprove ? "bg-[#4f3823]" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gray-100 shadow transform transition ${
                  manualApprove ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>
      </div>

      {/* Who can @mention you */}
      <div className="space-y-2 mt-6">
        <div className="text-[16px] font-semibold">
          Who can @mention you
        </div>
        <div className="text-sm text-gray-600">
          Choose who can @mention you to link your account in their
          stories, notes, comments, live videos, and captions. When
          people try to @mention you, they'll see if you don't allow
          @mentions.
        </div>

        {/* Mention radio */}
        <div className="mt-2">
          <div className="font-medium mb-1">Mention</div>
          <div className="flex flex-col gap-1 pl-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="mention"
                value="everyone"
                checked={mentionSetting === "everyone"}
                onChange={() => {
                  setMentionSetting("everyone");
                  updateSettings({ mentionSettings: { allowFrom: "everyone" } });
                }}
              />
              <span>Allow mention from everyone</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="mention"
                value="following"
                checked={mentionSetting === "following"}
                onChange={() => {
                  setMentionSetting("following");
                  updateSettings({ mentionSettings: { allowFrom: "following" } });
                }}
              />
              <span>Allow mention from people you follow</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="mention"
                value="none"
                checked={mentionSetting === "none"}
                onChange={() => {
                  setMentionSetting("none");
                  updateSettings({ mentionSettings: { allowFrom: "none" } });
                }}
              />
              <span>Don't allow mention</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* comments panel */}
{active === "comments" && (
  <div className="w-full lg:mt-4 ">
    <div className="w-full flex flex-col gap-5 rounded-xl lg:border-[1px] lg:border-[#48372D] h-[90vh] shadow-sm lg:py-4 px-1">
      
      {/* Header */}
      <div className="flex items-center gap-1 lg:px-5 px-2">
        {lgActive && (
          <button
            className="text-[24px] font-bold text-[#000000]"
            onClick={() => setLgActive(false)}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
        )}
        <h1 className="text-[24px] font-bold text-[#000000]">Comments</h1>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-5 px-9">
        {/* Allow comments from */}
        <div>
          <div className="text-[16px] font-semibold mb-2 text-[#000000]">
            Allow comments from
          </div>
          <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="Comment-allow"
                checked={commentSettings.allowCommentsFrom === "everyone"}
                onChange={() =>
                  handleSettingsChange("allowCommentsFrom", "everyone")
                }
              />
              <span>Everyone</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Comment-allow"
                checked={commentSettings.allowCommentsFrom === "following"}
                onChange={() =>
                  handleSettingsChange("allowCommentsFrom", "following")
                }
              />
              <span>People you follow</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Comment-allow"
                checked={commentSettings.allowCommentsFrom === "followers"}
                onChange={() =>
                  handleSettingsChange("allowCommentsFrom", "followers")
                }
              />
              <span>Your followers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Comment-allow"
                checked={commentSettings.allowCommentsFrom === "mutual"}
                onChange={() =>
                  handleSettingsChange("allowCommentsFrom", "mutual")
                }
              />
              <span>People you follow and your followers</span>
            </label>
          </div>
        </div>

        {/* Allow GIF comments */}
        <div className="flex justify-between">
          <div className="text-[16px] font-semibold text-[#000000]">
            Allow GIF comments
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={commentSettings.allowGifComments}
                onChange={() =>
                  handleSettingsChange(
                    "allowGifComments",
                    !commentSettings.allowGifComments
                  )
                }
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition ${
                  commentSettings.allowGifComments
                    ? "bg-[#4f3823]"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                  commentSettings.allowGifComments
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
          <div className="lg:flex hidden"></div>
        </div>
      </div>
    </div>
  </div>
)}


        {/* blocked panel */}
        {active === "blocked" && (
          <div className="w-full lg:border-[1px] lg:border-[#48372D] rounded-xl lg:shadow-sm lg:mt-4">
            <div className="w-full flex flex-col lg:p-6 p-3 gap-2">
              <div className="flex items-center gap-1">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-[25px] text-[#000000] font-bold px-2">
                  Blocked accounts
                </h1>
              </div>
              <div className="lg:w-[96%] w-full mx-auto p-3 flex flex-col gap-6">
                <h2 className="text-[16px] text-[#000000] font-medium">
                  You can block people anytime from their profiles.
                </h2>
                <div className="w-full flex flex-col gap-3">
                  {profile?.blocked?.map((item) => (
                    <div
                      key={item._id}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex gap-2">
                        <img
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.profilePhoto}`}
                          alt="profile pic"
                          className="w-11 h-11 rounded-full"
                        />
                        <div className="flex flex-col justify-between">
                          <h1 className="text-[15px] text-[#000000] font-semibold">
                            {item.username}
                          </h1>
                          <div className="text-sm text-[#000000] font-medium">
                            {item.role} 
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-[#F4F6F8] text-[14px] font-bold text-[#48372D]"
                      onClick={() => handleUnblock(item._id)}>
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* help panel */}
        {active === "help" && (
          <div className="w-full lg:p-6 lg:mt-6 h-full">
            <div className="lg:border lg:border-gray-300 rounded-xl bg-white p-6">
              {/* Heading */}
              <div className="flex items-center gap-1 mb-4">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-[24px] text-[#000000] font-bold ">
                  Help
                </h1>
              </div>

              {/* Search Box */}
              <div className="relative mb-6 ">
                <i className="ri-search-line absolute top-1/2 left-3 transform -translate-y-1/2 text-[#000000] text-[18px]"></i>
                <input
                  type="text"
                  placeholder="Type your question...."
                  className="w-full bg-[#f6f7f9] text-[14px] text-[#000000] pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none placeholder:text-[16px] placeholder:text-[#48372D]"
                />
              </div>

              {/* Support Requests */}
              <div className="mb-6">
                <h2 className="text-[20px] font-semibold mb-3">
                  Support requests
                </h2>
                <ul className="space-y-1">
                  {["Reports", "Safety Notices", "Violations"].map(
                    (item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between cursor-pointer hover:underline  text-[#000000] text-[14px]"
                      >
                        <span>{item}</span>
                        <span className="">
                          <i className="ri-arrow-right-s-line text-xl font-bold"></i>
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* FAQs */}
              <div className="mb-6">
                <h2 className="text-[20px] font-semibold mb-3">FAQs</h2>
                <ul className="space-y-2 text-[16px] text-[#000000]">
                  <li className="cursor-pointer hover:underline">
                    How do I turn on memberships?
                  </li>
                  <li className="cursor-pointer hover:underline">
                    How do I set my artwork price?
                  </li>
                  <li className="cursor-pointer hover:underline">
                    How do I set my artwork price?
                  </li>
                  <li className="cursor-pointer hover:underline">
                    How can I message buyers?
                  </li>
                </ul>
              </div>

              {/* Contact Us Box */}
              <div className="flex rounded-l-xl items-center border border-gray-300 rounded-md overflow-hidden mt-4">
                <div className="flex-1 px-4 py-2 font-semibold text-[20px] text-[#000000]">
                  Still need help?
                </div>
                <button className="bg-[#4B2B1C] text-white px-5 py-2 text-[20px] rounded-r-xl font-semibold">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}

{/* verification panel */}
{active === "verified" && (
  <div className="w-full lg:p-6 lg:mt-6">
    <div className="lg:border lg:border-gray-300 rounded-xl bg-white lg:p-6 p-3 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-1">
        {lgActive && (
          <button
            className="text-[24px] font-bold text-[#000000]"
            onClick={() => setLgActive(false)}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
        )}
        <h1 className="text-[25px] text-[#000000] font-bold ">
          Account Verification
        </h1>
      </div>

      {/* Email Verification */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] text-[#000000] font-semibold ">
            Request Verification
          </h1>
          <span className="text-[15px] text-[#000000] font-medium">
            {profile?.status || "Unverified"}
          </span>
        </div>
        <div className="flex justify-between items-center bg-[#f6f7f9] px-4 py-2 rounded-md text-sm font-medium">
          Email Verification
          <FaCircleCheck className=" text-lg " />
        </div>
      </div>

      {/* Verification Badges */}
      <div>
        <h2 className="text-[24px] text-[#000000] font-bold mb-2">
          Verification Badge
        </h2>

        {badges.map((badge) => {
          const alreadyHasBadge = profile?.verified?.some(
            (b) => b._id.toString() === badge._id.toString()
          );

          const errorMessage = eligibilityErrors[badge._id];

          return (
            <div key={badge._id} className="mb-6 px-2">
              <div className="flex justify-between items-center ">
                <div className="flex items-center lg:gap-2 gap-1 font-semibold text-[#000000] text-[18px] lg:text-[20px]">
                  {badge.badgeName}
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${badge.badgeImage}`}
                    className="w-6 h-6 object-cover rounded-full"
                    alt="badge"
                  />
                </div>

                {/* ✅ Hide button completely if higher-level badge owned */}
                {!(
                  errorMessage?.toLowerCase().includes("higher-level")
                ) && (
                  <button
                    disabled={alreadyHasBadge || !!errorMessage}
                    onClick={() => handleOpenPopup(badge)}
                    className={`lg:px-4 lg:py-2 px-2 py-1 rounded-xl font-bold text-[15px] lg:text-[18px] ${
                      alreadyHasBadge
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : errorMessage
                        ? "bg-red-200 text-red-600 cursor-not-allowed"
                        : badge.badgeName.toLowerCase().includes("master")
                        ? "bg-[#4B2B1C] text-white"
                        : "border-[1px] border-[#777574]"} `}
                  >
                    {alreadyHasBadge
                      ? "Already Owned"
                      : errorMessage
                      ? "Not Eligible"
                      : "Get your Badge"}
                  </button>
                )}
              </div>

              {/* Badge Description */}
              <p className="text-sm text-[#000000] mb-3">
                {badge.badgeDescription}
              </p>

              {/* Criteria Section */}
              <div className="text-[16px] text-[#000000] font-semibold mb-2">
                Criteria
              </div>
              <div className="text-sm space-y-2 pl-1">
                {badge.badgeName.toLowerCase().includes("trusted") && (
                  <>
                    <div>At least 5 original artworks uploaded</div>
                    <div>Active profile with bio and profile picture</div>
                    <div>1 month+ on the platform</div>
                    <div>Social link/portfolio linked & verified</div>
                  </>
                )}
                {badge.badgeName.toLowerCase().includes("master") && (
                  <>
                    <div>Have a Trusted Badge</div>
                    <div>At least 20 original artworks uploaded</div>
                    <div>Minimum ₹10,000 in sales on platform</div>
                    <div>Verified portfolio and social media presence</div>
                  </>
                )}
                {badge.badgeName.toLowerCase().includes("artsays") && (
                  <div>No criteria – available for everyone</div>
                )}
              </div>

              {/* Eligibility error */}
              {errorMessage &&
                !errorMessage.toLowerCase().includes("higher-level") && (
                  <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                )}

              {/* Price Section */}
              <div className="mt-3 text-sm font-medium">
                <p className="text-[20px] font-semibold text-[#000000] ">
                  <span className="">Charges</span> ₹{badge.badgePrice}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Purchase Popup + Success Popup remain same */}
{/* Purchase Popup */}
{showPopup && activeBadge && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={handleClosePopup}
        className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black transition"
      >
        ×
      </button>

      {/* Header */}
      <div className="text-center px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900">Account Verification</h2>
        <p className="text-sm text-gray-600 mt-1">
          Get your <span className="font-semibold">{activeBadge.badgeName}</span> for just{" "}
          <span className="text-[#4B2B1C] font-bold">₹{activeBadge.badgePrice}</span>
        </p>
      </div>

      {/* Profile Preview */}
      <div className="flex flex-col items-center mt-6">
        <img
          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile?.profilePhoto}`}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-[#f3f3f3] shadow-sm"
        />
        <p className="mt-3 text-lg font-semibold text-gray-900">{profile?.username}</p>
      </div>

      {/* Badge Info */}
      <div className="px-6 mt-6 space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <img
              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activeBadge.badgeImage}`}
              alt="badge"
              className="w-6 h-6 object-cover rounded-full"
            />
            {activeBadge.badgeName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{activeBadge.badgeDescription}</p>
        </div>

        {/* Criteria */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Criteria</h3>
          <ul className="text-sm text-gray-700 space-y-2 pl-4 list-disc">
            {activeBadge.badgeName.toLowerCase().includes("trusted") && (
              <>
                <li>At least 5 original artworks uploaded</li>
                <li>Active profile with bio and profile picture</li>
                <li>1 month+ on the platform</li>
                <li>Social link/portfolio linked & verified</li>
              </>
            )}
            {activeBadge.badgeName.toLowerCase().includes("master") && (
              <>
                <li>Have a Trusted Badge</li>
                <li>At least 20 original artworks uploaded</li>
                <li>Minimum ₹10,000 in sales on platform</li>
                <li>Verified portfolio and social media presence</li>
              </>
            )}
            {activeBadge.badgeName.toLowerCase().includes("artsays") && (
              <li>No criteria – available for everyone</li>
            )}
          </ul>
        </div>
      </div>

      {/* Terms */}
      <p className="text-[11px] text-gray-500 text-center mt-6 px-6">
        By tapping Confirm & Apply, you agree to our{" "}
        <span className="underline">Terms</span> and{" "}
        <span className="underline">Privacy Policy</span>.
      </p>

      {/* Action Button */}
      <div className="px-6 py-6">
        <button
          onClick={() => handleApplyForBadge(activeBadge._id)}
          className="w-full bg-[#4B2B1C] hover:bg-[#3a2015] transition py-3 rounded-xl text-white font-bold text-lg shadow-md"
        >
          Confirm & Apply
        </button>
      </div>
    </div>
  </div>
)}


    {/* Success Popup */}
    {showSuccessPopup && activeBadge && (
      <div className="mt-14 absolute inset-0 z-50 bg-[#000000] bg-opacity-50 flex justify-center items-center lg:p-0 p-4 py-6">
        <div className="bg-white rounded-none lg:rounded-lg w-full lg:max-w-md overflow-y-auto relative lg:p-6 p-4">
          <button
            onClick={() => setShowSuccessPopup(false)}
            className="absolute top-3 right-4 text-2xl text-gray-600"
          >
            ×
          </button>

          <h2 className="text-xl font-bold text-center mb-4">
            Welcome to the Verified Club!
          </h2>

          <div className="flex justify-center mb-4">
            <img
              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile?.profilePhoto}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          <p className="text-center font-semibold mb-1 flex items-center justify-center gap-2">
            {profile?.username}{" "}
            <img
              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activeBadge.badgeImage}`}
              alt="badge"
              className="w-6 h-6 object-cover rounded-full"
            />
          </p>
          <p className="text-center text-sm text-gray-700 mb-6">
            Your {activeBadge.badgeName} is now active and proudly visible on
            your profile and artworks.
          </p>

          <button className="mt-4 bg-[#4B2B1C] w-full flex text-lg justify-center p-3 items-center gap-2 text-white font-semibold rounded-xl">
            Share your moment on socials <IoPaperPlaneOutline />
          </button>
        </div>
      </div>
    )}
  </div>
)}


            {/* Privacy center panel */}
      {active === "privacy-center" && (
        <div className="w-full lg:mt-8 flex flex-col lg:border-[1px] lg:border-[#48372D] lg:px-1 lg:rounded-xl lg:py-3 lg:px-3">
          <div className="flex flex-col gap-4 ">
            <div className="flex items-center gap-1">
              {lgActive && (
                <button
                  className="text-[24px] font-bold text-[#000000]"
                  onClick={() => setLgActive(false)}
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
              )}
              <div className="text-[24px] font-bold ">Privacy Center</div>
            </div>
            <div className="text-[20px] font-semibold mb-2">
              Privacy Policy
            </div>
          </div>

          <div className="flex w-full lg:flex-row flex-col gap-2">
            {/* Left TOC */}
            <div className="lg:w-[25%] w-full">
              <div className="w-full bg-white space-y-4">
                <nav className="flex flex-col justify-end gap-2 text-sm">
                  {policies.map((policy) => (
                    <div
                      key={policy._id}
                      className={`cursor-pointer pl-1 ${
                        selectedPolicy?._id === policy._id
                          ? "text-black font-semibold"
                          : "text-[#444] hover:underline"
                      }`}
                      onClick={() => setSelectedPolicy(policy)}
                    >
                      {policy.question}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            <div className="w-[1px] bg-[#000000] mx-3"></div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white space-y-6">
                {selectedPolicy ? (
                  <div className="flex flex-col gap-4">
                    <h1 className="text-[22px] font-semibold">
                      {selectedPolicy.question}
                    </h1>
                    <div className="text-xs text-gray-500">
                      Effective{" "}
                      {new Date(selectedPolicy.createdAt).toLocaleDateString()}
                    </div>
                    <div className="space-y-4 text-sm text-[#1f1f1f] bg-[#F4F6F8] p-3 rounded">
                      <p>{selectedPolicy.description}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No published policies available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Sidebar */}
      <div
        className={`${
          lgActive ? "hidden lg:flex" : "flex "
        } lg:w-[22%] w-full  mx-auto bg-white lg:border-[1px] lg:border-[#48372D] rounded-lg lg:h-[90vh] lg:mt-4`}
      >
        <div className="sm:p-8 w-full">
          <h1 className="text-[26px] font-bold text-[#48372D] mb-4 w-full">
            Settings
          </h1>
          <ul className="flex flex-col gap-2 w-full">
            {items.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  if (window.innerWidth <= 1024) {
                    setLgActive(true);
                  }
                }}
                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-2xl transition ${
                  active === item.key
                    ? "bg-[#48372D] text-white border-l-[5px] border-[#FB5934]"
                    : "text-[#48372D] hover:bg-gray-100"
                }`}
              >
                <span className="text-[19px]">{item.icon}</span>
                <span className="text-[19px]">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Setting;
