import React, { useEffect, useState } from "react";
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
import { FaUser } from "react-icons/fa6";
import { FiEdit, FiChevronDown } from "react-icons/fi";

import { MdVerified } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { RiShieldStarFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import { IoPaperPlaneOutline } from "react-icons/io5";

const items = [
  { key: "edit-profile", label: "Edit Profile", icon: <FaRegCircleUser /> },
  { key: "notifications", label: "Notifications", icon: <FiBell /> },
  { key: "products", label: "Products", icon: <LuArchive /> },
  { key: "membership", label: "Membership", icon: <FaUserGroup /> },
  { key: "tags-mentions", label: "Tags and Mentions", icon: <GoMention /> },
  { key: "comments", label: "Comments", icon: <FaRegComment /> },
  {
    key: "creator-controls",
    label: "Creator Controls",
    icon: <RiBarChartBoxLine />,
  },
  { key: "blocked", label: "Blocked", icon: <RiProhibitedLine /> },
  { key: "verified", label: "Verified", icon: <RiVerifiedBadgeLine /> },
  { key: "help", label: "Help", icon: <RiQuestionLine /> },
  {
    key: "privacy-center",
    label: "Privacy Center",
    icon: <RiShieldUserLine />,
  },
  { key: "account-status", label: "Account Status", icon: <FaUser /> },
];


const initialMemberships = [
  {
    id: 1,
    title: "Silver",
    price: 50,
    unit: "month",
    expanded: false,
    membership_include: "",
  },
  {
    id: 2,
    title: "Gold Insider",
    price: 60,
    unit: "month",
    expanded: false,
    membership_include: "",
  },
  {
    id: 3,
    title: "Platinum Insider",
    price: 200,
    unit: "month",
    expanded: false,
    membership_include: `All Platinum Insider:
🎥 Free promo video for your best product
🧠 1:1 Creative consultation with curators/month
🖼️ Premium homepage banner placement
🎁 Monthly surprise gift box (art supplies / merch)
💼 Early access to collab campaigns & art events
🍀 Beta access to new features`,
  },
  {
    id: 4,
    title: "Platinum+ Insider",
    price: 1000,
    unit: "month",
    expanded: false,
    membership_include: `All Platinum perks, PLUS:
🎥 Free promo video for your best product
🧠 1:1 Creative consultation with curators/month
🖼️ Premium homepage banner placement
🎁 Monthly surprise gift box (art supplies / merch)
💼 Early access to collab campaigns & art events
🍀 Beta access to new features`,
  },
];

const blockedUser = [
  {
    id: 1,
    username: "abcde.academy",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    occupation: "ABCDE  ",
    location: "Aristia Bachelor Collective Digital Education",
  },
  {
    id: 2,
    username: "abcde.academy",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    occupation: "ABCDE  ",
    location: "Aristia Bachelor Collective Digital Education",
  },
  {
    id: 3,
    username: "abcde.academy",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    occupation: "ABCDE  ",
    location: "Aristia Bachelor Collective Digital Education",
  },
  {
    id: 4,
    username: "abcde.academy",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    occupation: "ABCDE  ",
    location: "Aristia Bachelor Collective Digital Education",
  },
  {
    id: 5,
    username: "abcde.academy",
    profilePic:
      "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    occupation: "ABCDE  ",
    location: "Aristia Bachelor Collective Digital Education",
  },
];

const creatorItems = [
  { label: "Ad payments", key: "ad-payments" },
  { label: "Branded content", key: "branded-content" },
  { label: "Partnership ads", key: "partnership-ads" },
  { label: "Frequently asked questions", key: "faq" },
  { label: "Welcome message", key: "welcome-message" },
  { label: "Minimum age", key: "minimum-age" },
  { label: "Monetization status", key: "monetization-status" },
  { label: "View counts on profile", key: "view-counts" },
  { label: "Add new professional account", key: "add-professional" },
  { label: "Appointment requests", key: "appointments" },
];

const Setting = () => {
  // main
  const [active, setActive] = useState("");
  // for make setting bar and 0page responsive
  const [lgActive, setLgActive] = useState(false);

const userId = localStorage.getItem("userId");
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {

      const fetchProfile = async () => {
    try {
      console.log("Fetching profile for userId:", userId);
      const res = await getAPI(`/api/social-media/profile/${userId}`, {}, false, true);
      if (res?.data?.profile) {
        setProfile(res.data.profile);
         console.log(res.data.profile); 
      }
    } catch (error) {
      console.error(" Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
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
  }, [userId]);
  // profile panel

  const [name, setName] = useState(profile?.firstName || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(profile?.profilePhoto || "");
  const [showSuggestion, setShowSuggestion] = useState();
  const [toggleEnable, setToggleEnable] = useState(false);

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

 const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId"); 

  const payload = {
    userId,        
    name,
    username,
    website,
    bio,
    profilePhoto,
  };

  try {
    const res = await putAPI(
      `/api/social-media/profile/update`, 
      payload,
      true,  
      true  
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

const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // preview
      // Later send file to backend with FormData in handleSubmit
    }
  };

  // notification panel
  const [phonePaused, setPhonePaused] = useState(false);
  const [likes, setLikes] = useState("off");
  const [likesCommentsPhotos, setLikesCommentsPhotos] = useState("following");
  const [comments, setComments] = useState("following");
  const [commentsLike, setCommentsLike] = useState("following");
  const [postsOfYou, setPostsOfYou] = useState("following");

  // membership panel
  const [activeMemberships, setActiveMemberships] = useState(true);
  const [memberships, setMemberships] = useState(initialMemberships);
  const [newTitle, setNewTitle] = useState("");
  const [newPerks, setNewPerks] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedPerks, setEditedPerks] = useState("");

  const handleAddMembership = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;
    setMemberships((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle.trim(),
        price: parseFloat(newPrice),
        unit: "month",
        expanded: false,
      },
    ]);
    setNewTitle("");
    setNewPerks("");
    setNewPrice("");
  };

  const toggleMembershipExpanded = (id) => {
    setMemberships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, expanded: !m.expanded } : m))
    );
  };

  const deleteMembership = (id) => {
    setMemberships((prev) => prev.filter((m) => m.id !== id));
  };

  // taga and mention panel
  const [tagsSetting, setTagsSetting] = useState("everyone"); // or 'following' / 'none'
  const [manualApprove, setManualApprove] = useState(false);
  const [mentionSetting, setMentionSetting] = useState("everyone");

  // comment panel
  const [commentToggle, setCommentToggle] = useState(false);

  // help panel

  // account status panel
  const [accountToggleEnable, setAccountToggleEnable] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  // verified panel
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // creator control panel
  const [activeCreatorPanel, setActiveCreatorPanel] = useState(null);

  return (
    <div className="lg:w-[78%] w-full lg:mx-auto mx-0 flex flex-row lg:px-1">
      <div
        className={`  ${
          lgActive ? "flex" : "hidden"
        } lg:flex w-full h-full  lg:w-[57%] mx-auto px-1`}
      >
        {/* Edit Profile panel */}
        {active === "edit-profile" && (
          <div className="w-full lg:mt-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-sm lg:p-6 lg:space-y-6 space-y-3"
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
              src={profilePhoto}
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
        {active === "membership" && (
          <div className="w-full h-full lg:mt-8 bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-sm overflow-y-scroll">
            <div className="flex items-center gap-1 sm:p-3 py-3">
              {lgActive && (
                <button
                  className="text-[24px] font-bold text-[#000000]"
                  onClick={() => setLgActive(false)}
                >
                  <i class="ri-arrow-left-s-line"></i>
                </button>
              )}
              <h1 className="text-[24px] font-bold text-[#000000]">
                Manage membership
              </h1>
            </div>
            <div className=" sm:px-10  space-y-6">
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
                      onChange={() => setActiveMemberships((v) => !v)}
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
                <div className="flex justify-between items-center">
                  <div className="text-[20px] text-[#000000] font-semibold">
                    Monthly Membership Price
                  </div>
                  <i class="ri-arrow-down-s-line text-[30px] text-[#000000] font-semibold"></i>
                </div>
                <div className="text-[17px] text-[#000000] font-semibold mb-2">
                  Create your Membership
                </div>
                <form
                  onSubmit={handleAddMembership}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      placeholder="Add title of your Membership"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="col-span-1 md:col-span-3 bg-[#F4F6F8] rounded-md px-4 py-3 text-sm outline-none placeholder:text-[17px] placeholder:text-[#737373]"
                    />
                    <input
                      placeholder="Add perks of your Membership"
                      value={newPerks}
                      onChange={(e) => setNewPerks(e.target.value)}
                      className="col-span-1 md:col-span-3 bg-[#F4F6F8] rounded-md px-4 py-3 text-sm outline-none placeholder:text-[17px] placeholder:text-[#737373]"
                    />
                    <div className="flex items-center  bg-[#F4F6F8]">
                      <span className="text-[19px] font-medium text-[#000000] pl-3">
                        ₹ |{" "}
                      </span>
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
                <div className="text-[17px] text-[#000000] font-semibold">
                  Current Memberships
                </div>
                <div className="flex flex-col gap-3">
                  {memberships.map((m) => (
                    <div className="flex flex-col gap-2" key={m.id}>
                      <div
                        className={`${
                          m.expanded
                            ? "border-[1px] border-[#000000] rounded-xl bg-white"
                            : ""
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
                              ₹ {m.price}/{m.unit}
                            </div>
                            <span className="text-[#000000] text-[17px] font-semibold">
                              |
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(m.id);
                                setEditedTitle(m.title);
                                setEditedPrice(m.price);
                                setEditedPerks(m.membership_include || "");
                              }}
                              className="p-1 text-[#48372D] rounded sm:text-[22px] text-[18px] font-bold hover:bg-gray-200"
                            >
                              <FiEdit />
                            </button>

                            <span className="text-[#000000] text-[17px] font-semibold">
                              |
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteMembership(m.id)}
                              className="p-1 text-[#48372D] sm:text-[22px] text-[18px] fonnt-bold rounded hover:bg-gray-200"
                            >
                              <i class="ri-delete-bin-6-fill "></i>
                            </button>
                            <span className="text-[#000000] text-[17px] font-semibold">
                              |
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleMembershipExpanded(m.id)}
                          className="p-1 rounded hover:bg-gray-200 ml-1"
                        >
                          <FiChevronDown
                            className={`rounded sm:text-[22px] text-[18px] font-bold ${
                              m.expanded ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        </button>
                      </div>
                      {(m.expanded || editingId === m.id) && (
                        <div className="w-full bg-white border-[1px] rounded-xl border-[#000000] bg-[#F9F9F9] p-4">
                          {editingId === m.id ? (
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
                              <textarea
                                value={editedPerks}
                                onChange={(e) => setEditedPerks(e.target.value)}
                                rows={4}
                                className="bg-[#F4F6F8] rounded-md px-4 py-2 text-sm outline-none text-[#000000]"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const updated = memberships.map((mem) =>
                                      mem.id === m.id
                                        ? {
                                            ...mem,
                                            title: editedTitle,
                                            price: editedPrice,
                                            membership_include: editedPerks,
                                          }
                                        : mem
                                    );
                                    setMemberships(updated);
                                    setEditingId(null);
                                  }}
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
                            <pre className="whitespace-pre-wrap text-[16px] text-[#000000]">
                              {m.membership_include}
                            </pre>
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

        {/* Products panel */}
        {active === "products" && (
          <div className="w-full h-[90vh] lg:p-4 lg:mt-8 bg-white lg:border-[0.5px] lg:border-[#48372D] flex flex-col gap-6 rounded-lg">
            <div className="flex items-center gap-1">
              {lgActive && (
                <button
                  className="text-[24px] font-bold text-[#000000]"
                  onClick={() => setLgActive(false)}
                >
                  <i class="ri-arrow-left-s-line"></i>
                </button>
              )}
              <div className="text-[26px] text-[#000000] font-bold w-[97%] mx-auto">
                Products
              </div>
            </div>
            <div className="text-[#000000] w-[94%] mx-auto flex flex-col gap-8">
              <div className="font-bold text-lg">Professional account</div>
              <div className="flex items-center gap-10">
                <span className="text-lg font-semibold">Category</span>
                <div className="flex flex-col">
                  <div className="font-medium text-[16px] text-[#000000]">
                    Art blog
                  </div>
                  <label className="flex gap-2 text-[#000000] text-[14px] font-medium">
                    <input type="checkbox" /> Display category label on profile
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-[94%] mx-auto">
              <div className="text-[16px] font-semibold">
                Post your products on your profile
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={toggleEnable}
                    onChange={() => setToggleEnable((s) => !s)}
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
          </div>
        )}

        {/* Tags and mention panel */}
        {active === "tags-mentions" && (
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
                Tags and Mentions
              </h1>
            </div>
            <div className=" p-6 space-y-6">
              {/* Who can tag you */}
              <div className="space-y-2">
                <div className="text-[16px] font-semibold">Who can tag you</div>
                <div className="text-sm text-gray-600">
                  Choose who can tag you in their photos and videos. When people
                  try to tag you, they'll see if you don't allow tags from
                  everyone.
                </div>

                {/* Tags radio */}
                <div className="mt-2">
                  <div className="font-medium mb-1">Tags</div>
                  <div className="flex flex-col gap-1 pl-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="tags"
                        value="everyone"
                        checked={tagsSetting === "everyone"}
                        onChange={() => setTagsSetting("everyone")}
                      />
                      <span>Allow tags from everyone</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="tags"
                        value="following"
                        checked={tagsSetting === "following"}
                        onChange={() => setTagsSetting("following")}
                      />
                      <span>Allow tags from people you follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="tags"
                        value="none"
                        checked={tagsSetting === "none"}
                        onChange={() => setTagsSetting("none")}
                      />
                      <span>Don't allow tags</span>
                    </label>
                  </div>
                </div>

                {/* Manually approve tags */}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <div className="font-medium">Manually approve tags</div>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={manualApprove}
                        onChange={() => setManualApprove((m) => !m)}
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
                        onChange={() => setMentionSetting("everyone")}
                      />
                      <span>Allow tags from everyone</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="mention"
                        value="following"
                        checked={mentionSetting === "following"}
                        onChange={() => setMentionSetting("following")}
                      />
                      <span>Allow tags from people you follow</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="mention"
                        value="none"
                        checked={mentionSetting === "none"}
                        onChange={() => setMentionSetting("none")}
                      />
                      <span>Don't allow tags</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* comments  panel */}
        {active === "comments" && (
          <div className="w-full lg:mt-4 ">
            <div className="w-full flex flex-col gap-5 rounded-xl lg:border-[1px] lg:border-[#48372D] h-[90vh] shadow-sm lg:py-4 px-1">
              <div className="flex items-center gap-1 lg:px-5 px-2">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-[24px] font-bold text-[#000000]">
                  Comments
                </h1>
              </div>
              <div className="flex flex-col gap-5 px-9 ">
                <div>
                  <div className="text-[16px] font-semibold mb-2 text-[#000000]">
                    Allow comments from
                  </div>
                  <div className="flex flex-col gap-1 pl-2 text-[14px] font-medium text-[#000000]">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="Comment-allow" />
                      <span>Everyone</span>
                    </label>
                    <label className="flex items-center gap-2  cursor-pointer">
                      <input type="radio" name="Comment-allow" />
                      <span>People you follow</span>
                    </label>
                    <label className="flex items-center gap-2  cursor-pointer">
                      <input type="radio" name="Comment-allow" />
                      <span>Your follower</span>
                    </label>
                    <label className="flex items-center gap-2  cursor-pointer">
                      <input type="radio" name="Comment-allow" />
                      <span>People you follow and your followers</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div className="text-[16px] font-semibold text-[#000000]">
                    Allow GIF comments
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={commentToggle}
                        onChange={() => setCommentToggle((s) => !s)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-5 rounded-full transition ${
                          commentToggle ? "bg-[#4f3823]" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                          commentToggle ? "translate-x-5" : "translate-x-0"
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
                  {blockedUser.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex gap-2">
                        <img
                          src={item.profilePic}
                          alt="profile pic"
                          className="w-11 h-11 rounded-full"
                        />
                        <div className="flex flex-col justify-between">
                          <h1 className="text-[15px] text-[#000000] font-semibold">
                            {item.username}
                          </h1>
                          <div className="text-sm text-[#000000] font-medium">
                            {item.occupation} • {item.location}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-[#F4F6F8] text-[14px] font-bold text-[#48372D]">
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
              <div className="flex items-center gap-1">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-[25px] text-[#000000] font-bold ">
                  Account Verification
                </h1>
              </div>
              {/* Email & Phone Verification */}
              <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                              <h1 className="text-[20px] text-[#000000] font-semibold ">
                  Request Verification
                </h1>
                <span className="text-[15px] text-[#000000] font-medium">status</span>

              </div>
                <div className="flex justify-between items-center bg-[#f6f7f9] px-4 py-2 rounded-md text-sm font-medium">
                  Email Verification
                  <FaCircleCheck  className=" text-lg " />
                </div>
                <div className="flex justify-between items-center bg-[#f6f7f9] px-4 py-2 rounded-md text-sm font-medium">
                  Phone Verification
                  <FaRegClock className=" text-lg" />
                </div>
              </div>

              {/* Verification Batch Section */}
              <div>
                <h2 className="text-[24px] text-[#000000]  font-bold mb-2">Verification Batch</h2>

                {/* Trusted Badge */}
                <div className="mb-6 px-2">
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center lg:gap-2 gap-1 font-semibold text-[#000000] text-[18px] lg:text-[20px]">
                      Trusted Badge{" "}
                      <MdVerified className="text-blue-600 text-xl" />
                    </div>
                    <button 
                     onClick={() => setShowMasterPopup(true)}
                    className="border-[1px] border-[#777574] lg:px-4 lg:py-2 px-2 py-1 rounded-xl font-bold text-[15px] lg:text-[18px]">
                      Get your Badge
                    </button>
                  </div>
                  <p className="text-sm text-[#000000] mb-3">
                    For emerging or independent artists who meet basic
                    authenticity checks.
                  </p>
                  <div className="text-[16px] text-[#000000]  font-semibold mb-2">criteria</div>

                  {/* Criteria List */}
                  <div className="text-sm space-y-2 pl-1">
                    <div className="flex items-center justify-between">
                      <span>At least 5 original artworks uploaded</span>
                      <FaCircleCheck className=" text-lg " />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active profile with bio and profile picture</span>
                      <FaCircleCheck className=" text-lg " />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>1 month+ on the platform</span>
                      <FaRegClock className="text-lg" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Social link/portfolio linked & verified</span>
                      <FaCircleCheck className=" text-lg " />
                    </div>
                  </div>

                  <div className="mt-3 text-sm font-medium">
                    <p className="text-[20px] font-semibold text-[#000000] ">
                      <span className="">Charges</span> ₹499
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      *not eligible, meet all the criteria's to purchase the
                      badge
                    </p>
                  </div>
                </div>

                {/* Master Badge */}
                <div>
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center text-[#000000] lg:gap-2 gap-1 font-semibold text-[18px] lg:text-[20px]">
                      Master Badge{" "}
                      <RiShieldStarFill className="text-orange-500 text-xl" />
                    </div>
                    <button
                      onClick={() => setShowMasterPopup(true)}
                      className="bg-[#4B2B1C] text-white lg:px-4 lg:py-2 px-2 py-1 rounded-xl font-bold text-[15px] lg:text-[18px]"
                    >
                      Get your Badge
                    </button>
                  </div>
                  <p className="text-sm text-[#000000]  mb-3">
                    For top-tier artists, art educators, and professionals with
                    a proven portfolio.
                  </p>
                  <div className="text-[16px] text-[#000000]  font-semibold mb-2">criteria</div>
                  {/* Criteria List */}
                  <div className="text-sm space-y-2 pl-1">
                    <div className="flex items-center justify-between">
                      <span>At least 20 original artworks uploaded</span>
                      <FaCircleCheck className="text-lg" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Minimum ₹25,000 in sales on platform</span>
                      <FaRegClock className="text-lg" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verified portfolio and social media presence</span>
                      <FaCircleCheck className="text-lg" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manual portfolio review by the Artsays team</span>
                      <FaCircleCheck className="text-lg" />
                    </div>
                  </div>

                  <div className="mt-3 text-sm font-medium">
                    <p className="text-[20px] font-semibold text-[#000000]">
                      <span className="">Charges</span> ₹1499
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Master Badge Popup */}
            {showMasterPopup && (
              <div className="mt-14 absolute inset-0 z-50 bg-[#000000] bg-opacity-50 flex justify-center items-center lg:p-0 p-4 py-6">
                <div className="bg-white rounded-none lg:rounded-lg w-full h-[80vh] lg:max-w-md lg:max-h-[80vh] overflow-y-auto relative lg:p-6 p-4">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowMasterPopup(false)}
                    className="absolute top-3 right-4 text-2xl text-gray-600"
                  >
                    ×
                  </button>

                  {/* Content */}
                  <h2 className="text-xl font-bold text-center mb-2">
                    Account Verification
                  </h2>
                  <p className="text-center text-[14px] font-medium mb-4">
                    Get your Master Badge at just ₹1499
                  </p>

                  <div className="flex justify-center mb-2">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>

                  <p className="text-center font-semibold mb-5">coolcanvas</p>

                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold">Verified badge</h3>
                      <p>
                        Get a verified badge that shows up everywhere you do and
                        help your audience feel more confident engaging with
                        you.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Increased account protection
                      </h3>
                      <p>
                        Worry less about impersonation with proactive identity
                        monitoring.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Enhanced support</h3>
                      <p>Contact a help agent via email or chat.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Add images to your links
                      </h3>
                      <p>
                        Showcase what your brand offers with custom link
                        previews.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Unique stickers</h3>
                      <p>
                        Express yourself with stickers only available to Meta
                        Verified subscribers.
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-gray-500 mt-4">
                    By tapping Pay Now, you agree to our Terms and Privacy
                    Policy.
                  </p>

                  <button
                    onClick={() => {
                      setShowMasterPopup(false);
                      setShowSuccessPopup(true);
                    }}
                    className="mt-4 bg-[#4B2B1C] w-full py-2 text-white font-semibold rounded"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}
            {/* successful pay popup */}
            {showSuccessPopup && (
              <div className="mt-14 absolute inset-0 z-50 bg-[#000000] bg-opacity-50 flex justify-center items-center lg:p-0 p-4 py-6">
                <div className="bg-white rounded-none lg:rounded-lg w-full  lg:max-w-md  overflow-y-auto relative lg:p-6 p-4">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="absolute top-3 right-4 text-2xl text-gray-600"
                  >
                    ×
                  </button>

                  {/* Success Content */}
                  <h2 className="text-xl font-bold text-center mb-4">
                    Welcome to the Verified Club!
                  </h2>

                  <div className="flex justify-center mb-4">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>

                  <p className="text-center font-semibold mb-1">
                    coolcanvas{" "}
                    <RiShieldStarFill className="inline text-orange-500 text-lg" />
                  </p>
                  <p className="text-center text-sm text-gray-700 mb-6">
                    Your Master Badge is now active and proudly visible on your
                    profile and artworks.
                  </p>

                  <button className="mt-4 bg-[#4B2B1C] w-full flex text-lg justify-center p-3 items-center gap-2 text-white font-semibold rounded-xl">
                    Share your moment on socials <IoPaperPlaneOutline />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account status panel */}
        {active === "account-status" && (
          <div className="w-full flex flex-col gap-1 lg:border-[1px] lg:border-[#48372D] rounded-xl h-[90vh]">
            <div className="lg:w-[97%] w-full mx-auto p-4">
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
                  Account Status
                </h1>
              </div>
            </div>
            <div className="flex  w-[95%] mx-auto p-4 justify-between">
              <div className="text-[20px] text-[#000000] font-semibold">
                active
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={accountToggleEnable}
                    onChange={() => setAccountToggleEnable((s) => !s)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-5 rounded-full transition ${
                      accountToggleEnable ? "bg-[#4f3823]" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                      accountToggleEnable ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="w-[95%] mx-auto p-4">
              <button
                className={`${
                  deleteButtonClicked ? "hidden" : "flex"
                } text-[20px] font-semibold text-[#000000] outline-none cursor-pointer`}
                onClick={() => setDeleteButtonClicked(!deleteButtonClicked)}
              >
                Delete Account
              </button>
              {deleteButtonClicked && (
                <div className="flex justify-center rounded-lg h-46">
                  {accountDeleted && (
                    <div className=" h-46 w-50 flex items-center justify-center bg-gray-100">
                      <h1 className="h-full text-[24px] text-[#000000] font-bold">
                        Account Deleted
                      </h1>
                    </div>
                  )}
                  <div
                    className={`${
                      accountDeleted
                        ? "hidden transition duration-500"
                        : "flex flex-col "
                    } gap-7 items-center bg-gray-100 p-4 w-100  rounded-lg`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <h1 className="text-[21px] font-semibold text-[#000000]">
                        Delete Account
                      </h1>
                      <p className="text-[16px] font-medium text-[#000000]">
                        Are you sure
                      </p>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full ">
                      <button
                        className="text-[16px] text-[#000000] font-medium bg-gray-100 px-4 py-1.5 border-[1px] border-[#000000] outline-none cursor-pointer"
                        onClick={() =>
                          setDeleteButtonClicked(!deleteButtonClicked)
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="text-[16px] text-white font-medium bg-red-500 px-4 py-1.5 outline-none cursor-pointer"
                        onClick={() => setAccountDeleted(!accountDeleted)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Privacy center panel */}
        {active === "privacy-center" && (
          <div className="w-full lg:mt-8 flex flex-col lg:border-[1px]  lg:border-[#48372D] lg:px-1 lg:rounded-xl lg:py-3 lg:px-3">
            <div className="flex flex-col gap-4 ">
              <div className="flex items-center gap-1">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <div className="text-[24px] font-bold ">Privacy Center</div>
              </div>
              <div className="text-[20px] font-semibold mb-2">
                Privacy Policy
              </div>
            </div>
            <div className="flex w-full lg:flex-row flex-col gap-2">
              {" "}
              {/* Left TOC */}
              <div className="lg:w-[25%] w-full">
                <div className="w-full bg-white   space-y-4">
                  <nav className="flex flex-col justify-end gap-2 text-sm">
                    {[
                      "What is the Privacy Policy and what does it cover?",
                      "What information do we collect?",
                      "How do we use your information?",
                      "How is your information shared on Meta Products or with integrated partners?",
                      "How do we share information with third parties?",
                      "How do the Meta Companies work together?",
                      "How can you manage or delete your information and exercise your rights?",
                      "How long do we keep your information?",
                      "How do we transfer information?",
                      "How do we respond to legal requests, comply with applicable law and prevent harm?",
                    ].map((title, i) => (
                      <div
                        key={i}
                        className="cursor-pointer text-[#444] hover:underline pl-1"
                        // you can wire up onClick to scroll to section if expanded
                      >
                        {title}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="w-[1px] bg-[#000000] mx-3"></div>
              {/* Main content */}
              <div className="flex-1">
                <div className="bg-white     space-y-6">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-[22px] font-semibold">
                      What is the Privacy Policy and what does it cover?
                    </h1>
                    <div className="text-xs text-gray-500">
                      Effective June 16, 2025 | View printable version | See
                      previous versions
                    </div>
                    <div className="space-y-4 text-sm text-[#1f1f1f] bg-[#F4F6F8]">
                      <p>
                        We want you to understand what information we collect,
                        and how we use and share it. That’s why we encourage you
                        to read our Privacy Policy. This helps you use our
                        products in the way that’s right for you.
                      </p>
                      <p>
                        In the Privacy Policy, we explain how we collect, use,
                        share, retain and transfer information. We also let you
                        know your rights. Each section of this Policy includes
                        helpful examples and simpler language to make our
                        practices easier to understand. We’ve also added links
                        to resources where you can learn more about the privacy
                        topics that interest you.
                      </p>
                      <p>
                        It’s important to us that you know how to control your
                        privacy, so we also show you where you can manage your
                        information in the settings of the products you use. You
                        can update these settings to shape your experience.
                      </p>
                    </div>
                  </div>

                  {/* Accordion / secondary items */}
                  <div className="flex flex-col w-full">
                    <div className=" rounded-t-xl p-3 border-[1px] border-[#000000]">
                      <div className="text-[16px] text-[#000000] font-medium">
                        What Products does this Policy cover?
                      </div>
                    </div>
                    <div className="p-3 rounded-b-xl border-[1px] border-[#000000]">
                      <div className="text-[16px] text-[#000000] font-medium">
                        Learn more in Privacy Center about managing your privacy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* creator control panel */}
        {active === "creator-controls" && (
          <>
            {/* Panel list (hidden if a sub-panel is active) */}
            {!activeCreatorPanel && (
              <div className="w-full lg:mt-8 lg:border-[1px] lg:border-[#48372D] h-[90vh] rounded-xl lg:shadow-sm lg:px-7 lg:py-4">
                <div className="flex items-center gap-1 mb-4">
                  {lgActive && (
                    <button
                      className="text-[24px] font-bold text-[#000000]"
                      onClick={() => setLgActive(false)}
                    >
                      <i class="ri-arrow-left-s-line"></i>
                    </button>
                  )}
                  <h1 className="sm:text-[24px] text-[21px] font-bold text-[#000000] ">
                    Creator Tools and Console
                  </h1>
                </div>

                <ul className="space-y-2 px-3">
                  {creatorItems.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => setActiveCreatorPanel(item.key)}
                      className="cursor-pointer text-[16px] text-[#000000] font-medium py-1 hover:underline hover:font-bold hover:text-[17px]"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sub panel (shown if a creator item is selected) */}
            {activeCreatorPanel && (
              <div className="w-full h-[90vh] lg:border-[1px] lg:border-[#48372D] rounded-xl lg:shadow-sm ">
                <button
                  onClick={() => setActiveCreatorPanel(null)}
                  className="text-xl  font-bold"
                >
                  <i class="ri-close-line"></i>
                </button>

                {activeCreatorPanel === "ad-payments" && <AdPayments />}
                {activeCreatorPanel === "branded-content" && <BrandedContent />}
                {activeCreatorPanel === "partnership-ads" && <PartnershipAds />}
                {activeCreatorPanel === "faq" && <Faq />}
                {activeCreatorPanel === "welcome-message" && <WelcomeMessage />}
                {activeCreatorPanel === "minimum-age" && <MinimumAge />}
                {activeCreatorPanel === "monetization-status" && (
                  <MonetizationStatus />
                )}
                {activeCreatorPanel === "view-counts" && <ViewCounts />}
                {activeCreatorPanel === "add-professional" && (
                  <AddProfessional />
                )}
                {activeCreatorPanel === "appointments" && (
                  <AppointmentRequests />
                )}
              </div>
            )}
          </>
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
