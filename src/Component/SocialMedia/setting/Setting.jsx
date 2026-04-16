import React, { useCallback, useEffect, useRef, useState } from "react";
import { getImageUrl } from '../../../utils/getImageUrl';
import { toast } from "react-toastify";
import getAPI from "../../../../src/api/getAPI";
import putAPI from "../../../../src/api/putAPI";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";
import { FaUserGroup } from "react-icons/fa6";
import { GoMention } from "react-icons/go";
import { FaRegComment } from "react-icons/fa";
import {
  RiProhibitedLine,
  RiVerifiedBadgeLine,
  RiShieldUserLine,
  RiShoppingBag3Line,
} from "react-icons/ri";
import { FiEdit, FiChevronDown } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { IoPaperPlaneOutline } from "react-icons/io5";
import deleteAPI from "../../../api/deleteAPI";
import postAPI from "../../../api/postAPI";
import { useNavigate, useLocation } from "react-router-dom";


const userType = localStorage.getItem("userType");

const items = [
  { key: "edit-profile", label: "Edit Profile", icon: <FaRegCircleUser /> },
  { key: "notifications", label: "Notifications", icon: <FiBell /> },

  ...(userType === "Artist"
    ? [{ key: "membership", label: "Membership", icon: <FaUserGroup /> }]
    : []),
  { key: "membership-orders", label: "Membership Orders", icon: <RiShoppingBag3Line /> },
  {
    key: "collaboration-mentions",
    label: "Collaboration and Mentions",
    icon: <GoMention />,
  },
  { key: "comments", label: "Comments", icon: <FaRegComment /> },
  { key: "blocked", label: "Blocked", icon: <RiProhibitedLine /> },
  { key: "verified", label: "Verified", icon: <RiVerifiedBadgeLine /> },
  {
    key: "privacy-center",
    label: "Privacy Center",
    icon: <RiShieldUserLine />,
  },
];

// ─── Notification Settings Panel ────────────────────────────────────────────

const BUYER_TOGGLES = [
  { key: "likes", label: "Likes", desc: "When someone likes your comment" },
  { key: "comments", label: "Comments", desc: "When someone replies to your comment" },
  { key: "followers", label: "Followers", desc: "When someone follows you" },
  { key: "mentions", label: "Mentions", desc: "When someone mentions you" },
  { key: "following_posts", label: "Posts from people you follow", desc: "When an artist you follow posts" },
  { key: "live", label: "Live Sessions", desc: "When a followed artist goes live" },
  { key: "memberships", label: "Memberships", desc: "Purchase confirmations and renewals" },
  { key: "badges", label: "Badges", desc: "Badge purchase confirmations" },
  { key: "support_tickets", label: "Support Tickets", desc: "Updates on your support requests" },
];

const ARTIST_EXTRA_TOGGLES = [
  { key: "saves", label: "Post Saves", desc: "When someone saves your post" },
  { key: "tips", label: "Tips Received", desc: "When a viewer sends you a tip" },
  { key: "promotions", label: "Promotions", desc: "Approval, rejection and campaign updates" },
  { key: "sales", label: "Sales & Revenue", desc: "Product purchases and milestones" },
  { key: "milestones", label: "Engagement Milestones", desc: "When your post crosses like / save thresholds" },
  { key: "collaborations", label: "Collaborations", desc: "Collaboration requests and updates" },
];

const Toggle = ({ value, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only" checked={value} onChange={onChange} />
    <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-[#4f3823]" : "bg-gray-300"}`} />
    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
  </label>
);

const NotificationSettingsPanel = ({ userType, lgActive, setLgActive }) => {
  const userId = localStorage.getItem("userId");
  const isCreator = userType === "Artist" || userType === "Seller";

  const defaultSettings = () => {
    const s = {};
    BUYER_TOGGLES.forEach(t => { s[t.key] = true; });
    if (isCreator) ARTIST_EXTRA_TOGGLES.forEach(t => { s[t.key] = true; });
    return s;
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAPI(`/api/social-media/notification-settings/${userId}`);
        if (res?.data?.settings) setSettings(prev => ({ ...prev, ...res.data.settings }));
      } catch (_) { }
      setLoaded(true);
    };
    load();
  }, [userId]);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const save = async () => {
    setSaving(true);
    try {
      await putAPI(`/api/social-media/notification-settings`, { userId, settings });
      toast.success("Notification preferences saved");
    } catch (_) {
      toast.error("Failed to save preferences");
    }
    setSaving(false);
  };

  const allToggles = isCreator
    ? [...BUYER_TOGGLES, ...ARTIST_EXTRA_TOGGLES]
    : BUYER_TOGGLES;

  return (
    <div className="w-full lg:p-[1rem] bg-white lg:rounded-xl space-y-4 lg:border lg:border-gray-200 lg:shadow-sm h-fit">
      {/* Header */}
      <div className="flex items-center gap-2">
        {lgActive && (
          <button
            className="text-[24px] font-bold text-[#000000]"
            onClick={() => setLgActive(false)}
          >
            <i className="ri-arrow-left-s-line" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-[#000000]">Notifications</h1>
          <p className="text-sm text-gray-500">Choose what you want to be notified about</p>
        </div>
      </div>

      {!loaded ? (
        <div className="text-center text-gray-400 py-8">Loading preferences…</div>
      ) : (
        <>
          {/* Buyer / base toggles */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pb-1">Social & Discovery</p>
            {BUYER_TOGGLES.map(t => (
              <div key={t.key} className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-[#000000]">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
                <Toggle value={!!settings[t.key]} onChange={() => toggle(t.key)} />
              </div>
            ))}
          </div>

          {/* Creator-only section */}
          {isCreator && (
            <div className="space-y-1 pt-2">
              <div className="flex items-center gap-2 pb-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Creator Controls</p>
                <span className="text-[10px] bg-[#4f3823] text-white px-2 py-0.5 rounded-full font-semibold">Artist / Seller</span>
              </div>
              {ARTIST_EXTRA_TOGGLES.map(t => (
                <div key={t.key} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-[#000000]">{t.label}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                  <Toggle value={!!settings[t.key]} onChange={() => toggle(t.key)} />
                </div>
              ))}
            </div>
          )}

          {/* Save */}
          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-[#4f3823] text-white py-2 rounded-md font-semibold text-sm disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save preferences"}
          </button>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const Setting = () => {
  const userType = localStorage.getItem("userType");
  const location = useLocation();
  const [active, setActive] = useState(location.state?.tab || "");
  const [lgActive, setLgActive] = useState(!!location.state?.tab);

  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("username");
  const firstNameLS = localStorage.getItem("firstName");
  const lastNameLS = localStorage.getItem("lastName");
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(profile?.profilePhoto || "");
  const [showSuggestion, setShowSuggestion] = useState();
  const [toggleEnable, setToggleEnable] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");

    const [originalUsername, setOriginalUsername] = useState('');
    const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [usernameError, setUsernameError] = useState('');
    const usernameCheckTimeout = useRef(null);
    const usernameRegex = /^[a-z0-9._]*$/;

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setUsername(profile.username || "");
      setWebsite(profile.website || "");
      setBio(profile.bio || "");
      setProfilePhoto(profile.profilePhoto || "");
      setOriginalUsername(profile.username?.trim().toLowerCase() || '');
    }
  }, [profile]);

  const handleLiveUsernameCheck = (val) => {
    const typed = val.trim().toLowerCase();
    if (!typed) {
      setUsernameAvailable(null);
      setUsernameError('');
      return;
    }
    if (!usernameRegex.test(typed)) {
      setUsernameError('Only letters (a-z), numbers (0-9), periods (.) and underscores (_) allowed');
      setUsernameAvailable(null);
      setUsernameCheckLoading(false);
      return;
    }
    if (typed.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      setUsernameAvailable(null);
      setUsernameCheckLoading(false);
      return;
    }
    if (typed.length > 30) {
      setUsernameError('Username cannot exceed 30 characters');
      setUsernameAvailable(null);
      setUsernameCheckLoading(false);
      return;
    }
    if (typed === originalUsername) {
      setUsernameAvailable(null);
      setUsernameError('');
      setUsernameCheckLoading(false);
      return;
    }
    setUsernameError('');
    setUsernameCheckLoading(true);
    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await getAPI(`/auth/check-username?username=${encodeURIComponent(typed)}&currentUserId=${userId}`);
        setUsernameAvailable(res.data?.available === true);
        if (res.data?.message && res.data?.available === false) {
          setUsernameError(res.data.message);
        }
      } catch (err) {
        setUsernameError('Could not check username availability');
        setUsernameAvailable(null);
      } finally {
        setUsernameCheckLoading(false);
      }
    }, 500);
  };

  const hasValidUsername =
    typeof userName === "string" &&
    userName.trim() !== "" &&
    userName !== "undefined" &&
    userName !== "null";


  const bioMax = 150;
  const remaining = bioMax - bio.length;

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem("userId");
    const del = await deleteAPI(
      `/api/social-media/delete-account/${userId}`,
      true,
      true
    );
    if (del && !del.hasError) {
      toast.success("Account deleted successfully");
      localStorage.clear();
      navigate("/");
    } else {
      toast.error("Failed to delete account");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("website", website);
    formData.append("bio", bio);

    if (profilePhotoFile) {
      formData.append("profilePhoto", profilePhotoFile);
    }


    console.log(
      "Submitting profile update:",
      [...formData.entries()]
    );

    try {
      const res = await putAPI(
        "/api/social-media/profile/update",
        formData,
        {},
        true
      );

      if (res && !res.hasError) {
        toast.success("Profile updated successfully!");
        fetchProfile();
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
          setCollaborationSetting(
            res.data.collaborationSettings?.allowFrom || "everyone"
          );
          setManualApprove(
            res.data.collaborationSettings?.manualApprove || false
          );
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
        {},
        true
      );
      if (!res.data.success) {
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
        allowCommentsFrom:
          field === "allowCommentsFrom"
            ? value
            : commentSettings.allowCommentsFrom,
        allowGifComments:
          field === "allowGifComments"
            ? value
            : commentSettings.allowGifComments,
      };

      const res = await putAPI(
        "/api/social-media/comment-settings",
        body,
        {},
        true
      );
      // if using axios.put wrap with postAPI
      setCommentSettings(res.data.commentSettings);
    } catch (err) {
      console.error("Error updating comment settings:", err);
    }
  };

  // help panel

  const fetchProfile = useCallback(async () => {
    try {
      console.log("Fetching profile for userId:", userId);
      const res = await getAPI(
        `/api/social-media/profile/${userId}`,
        {},
        false,
        true
      );
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
    if (userId) fetchProfile();

    const handleResize = () => {
      if (!location.state?.tab) {
        if (window.innerWidth >= 1024) {
          setActive("edit-profile");
        } else {
          setActive("");
        }
      }
    };

    if (!location.state?.tab) {
      handleResize();
    }

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
        {}, // config object
        true // private API
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
      // if (res.data.success) {
      //   toast.success(res.data.message);
      //   setShowPopup(false);
      //   setShowSuccessPopup(true);
      //   fetchBadges();
      //   fetchProfile();
      // } else {
      //   toast.error(res.data.message || "Failed to apply badge");
      // }
      if (res.data?.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      } else {
        toast.error(`Failed to create certifications: ${res.message}`);
      }
    } catch (err) {
      console.error("Apply Badge Error:", err);
      toast.error("Error applying badge 123");
    }
  };

  //  Fetch badges on load
  useEffect(() => {
    fetchBadges();
  }, []);

  // here check user email is verified or not
  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      setIsEmailVerified(result.data.user.emailVerified);
    };
    fetchUserData();
  }, [userId]);

  //  After badges load → check eligibility
  useEffect(() => {
    if (badges.length > 0) {
      badges.forEach((badge) => checkEligibility(badge._id));
    }
  }, [badges]);

  //  Open popup
  const handleOpenPopup = (badge) => {
    setActiveBadge(badge);
    setShowPopup(true);
  };

  //  Close popup
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
  const fetchPerks = async () => {
    try {
      const res = await getAPI("/api/perks");
      setPerks(res.data.data || []);
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


  useEffect(() => {
    if (active === "membership-orders") {
      fetchMembershipOrders();
    }
  }, [active]);

  //  Handle outside click for dropdowns
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
        params: { userId },
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

  const toggleMembershipExpanded = (id) => {
    setMemberships((prev) =>
      prev.map((m) => (m._id === id ? { ...m, expanded: !m.expanded } : m))
    );
  };

  // membership orders
  const [membershipOrders, setMembershipOrders] = useState([]);
  const [membershipOrdersLoading, setMembershipOrdersLoading] = useState(false);

  const fetchMembershipOrders = async () => {
    setMembershipOrdersLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const param = userType === "Artist" ? `creatorId=${userId}` : `userId=${userId}`;
      const res = await getAPI(`/api/membership/orders?${param}`, {}, true, true);
      setMembershipOrders(res?.data?.orders || []);
    } catch (err) {
      console.error("Error fetching membership orders:", err);
    } finally {
      setMembershipOrdersLoading(false);
    }
  };


  useEffect(() => {
    const fetchToggleState = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await getAPI(`/api/memberships/active?userId=${userId}`);
        if (res?.data?.success) {
          setActiveMemberships(res.data.membershipsActive);
        }
      } catch (err) {
        console.error("Error fetching membership state:", err);
      }
    };
    if (userType === "Artist") {
      fetchToggleState();
    }
  }, [userType]);

  useEffect(() => {
    const fetchToggle = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await getAPI(`/api/profile/post-products?userId=${userId}`);
        if (res?.data?.success) {
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
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const newValue = !toggleEnable;

      await postAPI("/api/profile/post-products/toggle", {
        userId,
        enabled: newValue,
      });
      setToggleEnable(newValue);
    } catch (err) {
      console.error("Error updating toggle:", err);
    }
  };

  // copy the profile link
  function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  return (
    <div className="col-span-12 lg:col-span-9 grid grid-cols-9 gap-2">
      <div className="col-span-12 lg:col-span-6 w-full">
        <div
          className={`  ${lgActive ? "flex" : "hidden"
            } lg:flex w-full h-full mx-auto px-1`}
        >
          {/* Edit Profile panel */}
          {active === "edit-profile" && (
            <div className="w-full my-4 bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-sm lg:p-[1rem] space-y-3">

              {deleteAccount && (
                <div
                  className="fixed inset-0 bg-[#000000]/40 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[9999]"
                  onClick={() => setDeleteAccount(false)}
                >
                  <div
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between items-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <h1 className="text-[22px] font-bold text-[#000000]">
                        Delete Account
                      </h1>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        Are you sure you want to permanently delete your account?
                        <br />
                        This action cannot be undone.
                      </p>
                    </div>


                    <div className="flex items-center justify-content-center w-full px-6 py-3 gap-6">
                      <button
                        className="bg-gray-100 text-[#000000] text-lg px-4 py-2 rounded-lg focus:outline-none"
                        onClick={() => setDeleteAccount(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-red-600 text-white text-lg px-4 py-2 rounded-lg"
                        onClick={() => handleDelete()}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2 outline-none">
                  {lgActive && (
                    <button
                      className="text-2xl font-bold text-[#000000]"
                      onClick={() => setLgActive(false)}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                  )}
                  <h1 className="text-2xl font-bold text-[#000000]">
                    Edit Profile
                  </h1>
                </div>

                {/* Avatar + change photo */}
                <div className="flex items-center justify-between bg-[#EBEBEB] p-2 rounded-lg overflow-hidden">
                  <div className="flex items-center">
                    <img
                      src={
                        profilePhoto?.startsWith("blob:")
                          ? profilePhoto // show preview
                          : getImageUrl(profilePhoto) // show from backend
                      }
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                  <div className="h-full flex items-center">
                    <label className="cursor-pointer bg-[#48372D] text-md text-white px-3 py-2 rounded-lg h-full flex items-center mb-0">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* First Name */}
                  <div className="col-span-1">
                    <label className="block text-md font-semibold text-[#000000] mb-1">
                      First Name
                    </label>
                    <input
                      value={firstName}
                      placeholder={firstNameLS}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#EBEBEB] rounded-md px-3 py-2 font-semibold text-[#000000] text-sm placeholder-[#000000] placeholder:font-semibold outline-none"
                    />
                  </div>
                  {/* Last Name */}
                  <div className="col-span-1">
                    <label className="block text-md font-semibold text-[#000000] mb-1">
                      Last Name
                    </label>
                    <input
                      value={lastName}
                      placeholder={lastNameLS}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#EBEBEB] rounded-md px-3 py-2 font-semibold text-[#000000] text-sm placeholder-[#000000] placeholder:font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-md font-semibold text-[#000000] mb-1">
                    User Name
                  </label>
                  <input
                    value={username}
                    maxLength={30}
                    onChange={(e) => {
                      const lowercaseValue = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
                      setUsername(lowercaseValue);
                      handleLiveUsernameCheck(lowercaseValue);
                    }}
                    className="w-full bg-[#EBEBEB] rounded-md px-3 py-2 font-semibold text-[#000000] text-sm placeholder-[#000000] placeholder:font-semibold outline-none"
                  />
                  <span className="text-gray-400 text-xs mt-1 block">
                    {username.length}/30 — Only letters (a-z), numbers, periods (.) and underscores (_)
                  </span>
                  {usernameError && (
                    <small className="text-red-600 text-xs mt-1 block">{usernameError}</small>
                  )}
                  {usernameCheckLoading && (
                    <small className="text-gray-500 text-xs mt-1 block">Checking availability...</small>
                  )}
                  {!usernameError && !usernameCheckLoading && usernameAvailable === true && (
                    <small className="text-green-600 text-xs mt-1 block">Username is available</small>
                  )}
                  {!usernameError && !usernameCheckLoading && usernameAvailable === false && (
                    <small className="text-red-600 text-xs mt-1 block">Username is already taken</small>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-md font-semibold text-[#000000] mb-1">
                    Website
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-[#EBEBEB] rounded-md px-3 py-2 font-semibold text-[#000000] text-sm placeholder-[#000000] placeholder:font-semibold outline-none"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-md font-semibold text-[#000000] mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <textarea
                      value={bio}
                      onChange={(e) => {
                        if (e.target.value.length <= bioMax)
                          setBio(e.target.value);
                      }}
                      placeholder="Write your bio"
                      className="w-full bg-[#EBEBEB] rounded-md px-3 py-2 font-semibold text-[#000000] text-sm resize-none outline-none placeholder:font-semibold placeholder-[#000000]"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 font-medium">
                      {remaining}/{bioMax}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-4">
                  <label className="block text-md font-semibold text-[#000000] mb-1">
                    Contact
                  </label>
                  <div className="w-full bg-[#EBEBEB] rounded-md px-3 py-2 font-semibold text-[#000000] text-sm placeholder-[#000000] placeholder:font-semibold outline-none">
                    {profile?.email}
                  </div>
                </div>

                {/* Account suggestion toggle */}
                <div className="flex items-center justify-between gap-4">
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
                        className={`w-10 h-5 rounded-full transition ${showSuggestion ? "bg-[#4f3823]" : "bg-gray-300"
                          }`}
                      ></div>
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${showSuggestion ? "translate-x-5" : "translate-x-0"
                          }`}
                      ></div>
                    </div>
                  </label>
                </div>

                {(userType === "Artist" || userType === "Seller") && (
                  <div className="flex justify-between">
                    <div className="text-md text-[#000000] font-semibold">
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
                          className={`w-10 h-5 rounded-full transition ${toggleEnable ? "bg-[#4f3823]" : "bg-gray-300"
                            }`}
                        ></div>
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${toggleEnable ? "translate-x-5" : "translate-x-0"
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Save button */}
                <button
                  type="submit"
                  className="bg-[#4f3823] text-white w-full py-2 rounded-md font-medium"
                >
                  Save changes
                </button>
              </form>

              <button
                className="w-full bg-[#4f3823] text-white font-semibold rounded-md py-2"
                onClick={() => setDeleteAccount(true)}
              >
                Delete Account
              </button>
            </div>
          )}

          {/* Notifications panel */}
          {active === "notifications" && (
            <div className="w-full my-4">
              <NotificationSettingsPanel
                userType={userType}
                lgActive={lgActive}
                setLgActive={setLgActive}
              />
            </div>
          )}

          {/* Membership panel */}
          {userType === "Artist" && active === "membership" && (
            <div className="w-full my-4 lg:p-[1rem] bg-white lg:rounded-xl space-y-3 lg:border lg:border-gray-200 lg:shadow-sm h-fit">
              <div className="flex items-center gap-2 rounded-md">
                {lgActive && (
                  <button
                    className="text-[24px] font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-2xl font-bold text-[#000000]">
                  Manage Membership
                </h1>
              </div>

              <div className="space-y-3">
                {/* Active Memberships toggle */}
                <div className="flex justify-between items-center">
                  <div className="text-md text-[#000000] font-semibold">
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
                        className={`w-12 h-5 rounded-full transition ${activeMemberships ? "bg-[#4f3823]" : "bg-gray-300"
                          }`}
                      ></div>
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${activeMemberships ? "translate-x-7" : "translate-x-0"
                          }`}
                      ></div>
                    </div>
                  </label>
                </div>

                {/* Create membership */}
                <div className="space-y-3">
                  <div className="text-lg text-[#000000] font-semibold">
                    Create Your Membership
                  </div>
                  <form
                    onSubmit={handleAddMembership}
                    className="flex flex-col gap-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        placeholder="Add title of your Membership"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="col-span-1 md:col-span-3 bg-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#000000] font-semibold outline-none placeholder:text-sm placeholder:font-semibold placeholder:text-[#737373] curdor-pointer"
                      />

                      {/* ✅ Dropdown Perks with checkboxes */}
                      <div
                        className="col-span-1 md:col-span-3 relative"
                        ref={perksDropdownRef}
                      >
                        <div
                          onClick={() => setShowPerksDropdown((prev) => !prev)}
                          className="bg-[#EBEBEB] rounded-md px-3 py-2 text-sm text-[#000000] font-semibold outline-none placeholder:text-sm placeholder:font-semibold placeholder:!text-[#737373] cursor-pointer"
                        >
                          {newSelectedPerks.length > 0
                            ? perks
                              .filter((p) => newSelectedPerks.includes(p._id))
                              .map((p) => p.perkName)
                              .join(", ")
                            : "Choose perks"}
                        </div>

                        {showPerksDropdown && (
                          <div className="absolute mt-1 w-full bg-[#EBEBEB] border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                            {perks.map((perk) => (
                              <label
                                key={perk._id}
                                className="flex items-center gap-1 text-sm px-3 py-2 hover:bg-gray-100 mb-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={newSelectedPerks.includes(perk._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewSelectedPerks((prev) => [
                                        ...prev,
                                        perk._id,
                                      ]);
                                    } else {
                                      setNewSelectedPerks((prev) =>
                                        prev.filter((id) => id !== perk._id)
                                      );
                                    }
                                  }}
                                />
                                {perk.perkName}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex w-full items-center bg-[#EBEBEB] px-3 py-2 rounded-md">
                        <span className="text-lg font-medium text-[#000000]">
                          ₹ {" "}
                        </span>
                        <input
                          placeholder="Add Charges"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          type="number"
                          className="bg-[#EBEBEB] pl-2 font-semibold rounded-md w-full text-lg outline-none placeholder:text-sm placeholder:text-[#737373]"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-[#48372D] text-white w-full py-2 rounded-md font-semibold"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>

                {/* Current Memberships */}
                <div className="space-y-3">
                  <div className="text-md text-[#000000] font-semibold">
                    Current Memberships
                  </div>
                  <div className="flex flex-col gap-3">
                    {memberships.map((m) => (
                      <div className="flex flex-col gap-3" key={m._id}>
                        <div className="px-3 py-2 flex items-center justify-between bg-[#EBEBEB] rounded-md">
                          <div className="flex-1 flex flex-col">
                            <div className="font-medium text-md text-[#000000]">
                              {m.title}
                            </div>
                          </div>
                          {!m.expanded && (
                            <div className="flex items-center gap-3">
                              <div className="font-medium text-md text-[#000000]">
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
                                className="text-[#48372D] rounded text-md font-bold hover:bg-gray-200 focus:outline-none "
                              >
                                <FiEdit />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMembership(m._id)}
                                className="text-[#48372D] text-md font-bold rounded hover:bg-gray-200"
                              >
                                <i className="ri-delete-bin-6-fill "></i>
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleMembershipExpanded(m._id)}
                            className="ml-2 focus:outline-none"
                          >
                            <FiChevronDown
                              className={`rounded text-md font-bold ${m.expanded ? "rotate-180" : ""
                                } transition-transform`}
                            />
                          </button>
                        </div>

                        {(m.expanded || editingId === m._id) && (
                          <div className="w-full rounded-md bg-[#EBEBEB] px-2 py-2">
                            {editingId === m._id ? (
                              <div className="flex flex-col gap-3">
                                <input
                                  value={editedTitle}
                                  onChange={(e) => setEditedTitle(e.target.value)}
                                  className="bg-white rounded-md px-3 py-2 text-sm outline-none text-[#000000]"
                                />
                                <input
                                  value={editedPrice}
                                  onChange={(e) => setEditedPrice(e.target.value)}
                                  type="number"
                                  className="bg-white rounded-md px-3 py-2 text-sm outline-none text-[#000000]"
                                />

                                {/* ✅ Edit perks dropdown */}
                                <div
                                  className="relative"
                                  ref={editPerksDropdownRef}
                                >
                                  <div
                                    onClick={() =>
                                      setShowEditPerksDropdown((prev) => !prev)
                                    }
                                    className="bg-white rounded-md px-3 py-2 text-sm cursor-pointer"
                                  >
                                    {editedPerks.length > 0
                                      ? perks
                                        .filter((p) =>
                                          editedPerks.includes(p._id)
                                        )
                                        .map((p) => p.perkName)
                                        .join(", ")
                                      : "Choose perks"}
                                  </div>
                                  {showEditPerksDropdown && (
                                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-50">
                                      {perks.map((perk) => (
                                        <label
                                          key={perk._id}
                                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={editedPerks.includes(
                                              perk._id
                                            )}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setEditedPerks((prev) => [
                                                  ...prev,
                                                  perk._id,
                                                ]);
                                              } else {
                                                setEditedPerks((prev) =>
                                                  prev.filter(
                                                    (id) => id !== perk._id
                                                  )
                                                );
                                              }
                                            }}
                                          />
                                          {perk.perkName}
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => handleSaveEdit(m._id)}
                                    className="bg-[#48372D] border-2 col-span-1 text-white py-2 rounded-md font-semibold"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="bg-white border-2 hover:border-2 hover:border-[#ffffff] hover:!bg-[#EBEBEB] col-span-1 text-black py-2 rounded-md font-semibold"
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
                                <ul className="list-disc pl-3 text-sm text-[#000000]">
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


          {/* Membership Orders panel */}
          {active === "membership-orders" && (
            <div className="w-full my-4 bg-white rounded-xl lg:border lg:border-gray-200 lg:shadow-sm lg:p-[1rem] space-y-3 h-fit">
              <div className="flex items-center gap-2">
                {lgActive && (
                  <button
                    className="text-2xl font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h2 className="text-2xl font-bold text-[#48372D]">Membership Orders</h2>
              </div>

              {membershipOrdersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-[#4A3728]/20 border-t-[#4A3728] rounded-full animate-spin"></div>
                </div>
              ) : membershipOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <RiShoppingBag3Line className="text-5xl text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-600">No membership orders yet</h3>
                  <p className="text-sm text-gray-400 mt-1">Your purchased memberships will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-[#48372D] text-white">
                        <th className="px-3 py-2 font-semibold rounded-tl-lg">Membership</th>
                        <th className="px-3 py-2 font-semibold">{userType === "Artist" ? "Buyer" : "Creator"}</th>
                        <th className="px-3 py-2 font-semibold">Amount</th>
                        <th className="px-3 py-2 font-semibold">Date</th>
                        <th className="px-3 py-2 font-semibold">Expires</th>
                        <th className="px-3 py-2 font-semibold">Status</th>
                        <th className="px-3 py-2 font-semibold rounded-tr-lg">Txn ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membershipOrders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-3 py-2 font-semibold text-[#48372D]">
                            {order.membershipId?.title || "Membership"}
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {userType === "Artist"
                              ? (order.userId?.firstName || order.userId?.name || "Unknown")
                              : (order.creatorId?.firstName || order.creatorId?.name || "Unknown")}
                          </td>
                          <td className="px-3 py-2 font-semibold text-[#48372D]">
                            {"₹"}{order.amount}
                          </td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                            {order.expiresAt
                              ? (() => {
                                const isExpired = new Date(order.expiresAt) < new Date();
                                return (
                                  <span className={isExpired ? "text-red-500 font-semibold" : ""}>
                                    {new Date(order.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    {!isExpired && order.status === "Paid" && (
                                      <span className="block text-xs text-gray-400">
                                        {Math.ceil((new Date(order.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days left
                                      </span>
                                    )}
                                  </span>
                                );
                              })()
                              : "-"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Expired"
                                    ? "bg-orange-100 text-orange-700"
                                    : order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                            >
                              {order.status === "Paid" && order.expiresAt && new Date(order.expiresAt) < new Date()
                                ? "Expired"
                                : order.status}
                            </span>
                          </td>
                            <td className="px-3 py-2 text-xs text-gray-400 break-all">
                              {order.cfOrderId || "-"}
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* collaboration and mention panel */}
          {active === "collaboration-mentions" && (
            <div className="w-full my-4 bg-white rounded-xl lg:border lg:border-gray-200 lg:shadow-sm lg:p-[1rem] space-y-3 h-fit">
              <div className="flex items-center gap-2">
                {lgActive && (
                  <button
                    className="text-2xl font-bold text-[#000000]"
                    onClick={() => setLgActive(false)}
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                )}
                <h1 className="text-2xl font-bold text-[#000000]">
                  Collaboration and Mentions
                </h1>
              </div>
              <div className="space-y-3">
                {/* Who can Collaborate with you */}
                <div className="space-y-3">
                  <div className="text-md font-semibold">
                    Who can Collaborate with you
                  </div>
                  <div className="text-sm text-gray-600">
                    Choose who can Collaborate with you in their photos and
                    videos. When people try to collaborate with you, they'll see
                    if you don't allow collaboration from everyone.
                  </div>

                  {/* Collaboration radio */}
                  <div className="space-y-2">
                    <div className="font-semibold text-[#000000]">Collaboration</div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="collaboration"
                          value="everyone"
                          checked={collaborationSetting === "everyone"}
                          onChange={() => {
                            setCollaborationSetting("everyone");
                            updateSettings({
                              collaborationSettings: {
                                allowFrom: "everyone",
                                manualApprove,
                              },
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
                              collaborationSettings: {
                                allowFrom: "following",
                                manualApprove,
                              },
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
                              collaborationSettings: {
                                allowFrom: "none",
                                manualApprove,
                              },
                            });
                          }}
                        />
                        <span>Don't allow collaboration</span>
                      </label>
                    </div>
                  </div>

                  {/* Manually approve collaboration */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold font-[#000000]">
                        Manually Approve Collaboration
                      </div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={manualApprove}
                          onChange={() => {
                            setManualApprove(!manualApprove);
                            updateSettings({
                              collaborationSettings: {
                                allowFrom: collaborationSetting,
                                manualApprove: !manualApprove,
                              },
                            });
                          }}
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 rounded-full transition ${manualApprove ? "bg-[#4f3823]" : "bg-gray-300"
                            }`}
                        ></div>
                        <div
                          className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gray-100 shadow transform transition ${manualApprove ? "translate-x-7" : "translate-x-0"
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Who can @mention you */}
                <div className="space-y-2">
                  <div className="text-md font-semibold font-[#000000]">
                    Who Can @ Mention You
                  </div>
                  <div className="text-sm text-gray-600">
                    Choose who can @mention you to link your account in their
                    stories, notes, comments, live videos, and captions. When
                    people try to @mention you, they'll see if you don't allow
                    @mentions.
                  </div>

                  {/* Mention radio */}
                  <div className="space-y-2">
                    <div className="font-semibold text-[#000000]">Mention</div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="mention"
                          value="everyone"
                          checked={mentionSetting === "everyone"}
                          onChange={() => {
                            setMentionSetting("everyone");
                            updateSettings({
                              mentionSettings: { allowFrom: "everyone" },
                            });
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
                            updateSettings({
                              mentionSettings: { allowFrom: "following" },
                            });
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
                            updateSettings({
                              mentionSettings: { allowFrom: "none" },
                            });
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
            <div className="w-full my-4 ">
              <div className="w-full flex flex-col gap-5 rounded-xl lg:border-[1px] lg:border-gray-200 h-[90vh] shadow-sm lg:p-[1rem] h-fit">
                {/* Header */}
                <div className="flex items-center gap-2">
                  {lgActive && (
                    <button
                      className="text-2xl font-bold text-[#000000]"
                      onClick={() => setLgActive(false)}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                  )}
                  <h1 className="text-2xl font-semibold text-[#000000]">
                    Comments
                  </h1>
                </div>

                {/* Settings */}
                <div className="flex flex-col space-y-3">
                  {/* Allow comments from */}
                  <div className="space-y-2">
                    <div className="text-md font-semibold text-[#000000]">
                      Allow comments from
                    </div>
                    <div className="flex flex-col text-md space-y-2 font-medium text-[#000000]">
                      <label className="flex items-center gap-2 cursor-pointer mb-0">
                        <input
                          type="radio"
                          name="Comment-allow"
                          checked={
                            commentSettings.allowCommentsFrom === "everyone"
                          }
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
                          checked={
                            commentSettings.allowCommentsFrom === "following"
                          }
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
                          checked={
                            commentSettings.allowCommentsFrom === "followers"
                          }
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
                  <div className="flex w-full justify-between">
                    <div className="text-md font-semibold text-[#000000]">
                      Allow GIF Comments
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
                          className={`w-10 h-5 rounded-full transition ${commentSettings.allowGifComments
                            ? "bg-[#4f3823]"
                            : "bg-gray-300"
                            }`}
                        ></div>
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${commentSettings.allowGifComments
                            ? "translate-x-5"
                            : "translate-x-0"
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* blocked panel */}
          {active === "blocked" && (
            <div className="w-full lg:border-[1px] lg:border-gray-200 rounded-xl lg:shadow-sm my-4 lg:p-[1rem]">
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {lgActive && (
                    <button
                      className="text-2xl font-bold text-[#000000]"
                      onClick={() => setLgActive(false)}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                  )}
                  <h1 className="text-2xl text-[#000000] font-esmibold">
                    Blocked accounts
                  </h1>
                </div>
                <div className="w-full mx-auto flex flex-col gap-6">
                  <h2 className="text-[16px] text-[#000000] font-medium">
                    You can block people anytime from their profiles.
                  </h2>
                  <div className="w-full flex flex-col gap-3">
                    {profile?.blocked?.map((item) => (
                      <div
                        key={item._id}
                        className="w-full flex justify-between items-center bg-[#EBEBEB] px-3 py-2 rounded-md"
                      >
                        <div className="flex gap-2">
                          <img
                            src={getImageUrl(item.profilePhoto)}
                            alt="profile pic"
                            className="w-11 h-11 rounded-full border border-white"
                          />
                          <div className="flex flex-col justify-content-center">
                            <h1 className="text-md text-[#000000] font-semibold">
                              {item.username}
                            </h1>
                            <div className="text-sm text-[#000000]">
                              {item.role}
                            </div>
                          </div>
                        </div>
                        <button
                          className="px-2 py-1 bg-white text-sm rounded-md font-semibold text-[#48372D]"
                          onClick={() => handleUnblock(item._id)}
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* verification panel */}
          {active === "verified" && (
            <div className="w-full my-4">
              <div className="lg:border lg:border-gray-200 rounded-md lg:p-[1rem] bg-white space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                  {lgActive && (
                    <button
                      className="text-2xl font-bold text-[#000000]"
                      onClick={() => setLgActive(false)}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                  )}
                  <h1 className="text-2xl text-[#000000] font-semibold ">
                    Account Verification
                  </h1>
                </div>

                {/* Email Verification */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-md text-[#000000] font-semibold ">
                      Request Verification
                    </h1>
                    <span className="text-md text-[#000000] font-semibold">
                      {isEmailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#EBEBEB] px-3 py-2 rounded-md text-sm font-semibold">
                    Email Verification
                    {/* <FaCircleCheck className=" text-lg " /> */}
                    {isEmailVerified ? (
                      <span
                        className=" text-lg "
                        style={{
                          color: "#28a745",
                          fontSize: "18px",
                        }}
                      >
                        <FaCheck />
                      </span>
                    ) : (
                      <span
                        className=" text-lg "
                        style={{
                          color: "rgb(253, 29, 5)",
                          fontSize: "18px",
                        }}
                      >
                        <FaTimes />
                      </span>
                    )}
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="space-y-3">
                  <h2 className="text-lg text-[#000000] font-bold">
                    Verification Badge
                  </h2>

                  {badges
                    .filter((badge) => {
                      if (userType === "Buyer") {
                        return badge.badgeName.toLowerCase().includes("artsays");
                      }
                      return true;
                    })
                    .map((badge) => {
                      const alreadyHasBadge = profile?.verified?.some(
                        (b) => b._id.toString() === badge._id.toString()
                      );

                      const errorMessage = eligibilityErrors[badge._id];
                      return (
                        <div key={badge._id} className="space-y-2">
                          <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-2 font-semibold text-[#000000] text-md">
                              {badge.badgeName}
                              <img
                                src={getImageUrl(badge.badgeImage)}
                                className="w-6 h-6 object-cover rounded-full"
                                alt="badge"
                              />
                            </div>

                            {/* ✅ Hide button completely if higher-level badge owned */}
                            {!errorMessage
                              ?.toLowerCase()
                              .includes("higher-level") && (
                                <button
                                  disabled={alreadyHasBadge || !!errorMessage}
                                  onClick={() => handleOpenPopup(badge)}
                                  className={`px-2 py-1 rounded-md font-semibold text-md text-[#000000] ${alreadyHasBadge
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : errorMessage
                                      ? "bg-red-200 text-red-600 cursor-not-allowed"
                                      : badge.badgeName
                                        .toLowerCase()
                                        .includes("master")
                                        ? "bg-[#4B2B1C] text-white"
                                        : "border-[1px] border-[#777574]"
                                    } `}
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
                          <p className="text-sm text-[#000000]">
                            {badge.badgeDescription}
                          </p>

                          {/* Criteria Section */}
                          <div className="text-md text-[#000000] font-semibold">
                            Criteria
                          </div>
                          <div className="text-sm space-y-2">
                            {badge.badgeName.toLowerCase().includes("trusted") && (
                              <>
                                <div>At least 5 original artworks uploaded</div>
                                <div>
                                  Active profile with bio and profile picture
                                </div>
                                <div>1 month+ on the platform</div>
                                <div>Social link/portfolio linked & verified</div>
                              </>
                            )}
                            {badge.badgeName.toLowerCase().includes("master") && (
                              <>
                                <div>Have a Trusted Badge</div>
                                <div>At least 20 original artworks uploaded</div>
                                <div>Minimum ₹10,000 in sales on platform</div>
                                <div>
                                  Verified portfolio and social media presence
                                </div>
                              </>
                            )}
                            {badge.badgeName.toLowerCase().includes("artsays") && (
                              <div>No criteria – available for everyone</div>
                            )}
                          </div>

                          {/* Eligibility error */}
                          {errorMessage &&
                            !errorMessage
                              .toLowerCase()
                              .includes("higher-level") && (
                              <p className="text-xs text-red-500">
                                {errorMessage}
                              </p>
                            )}

                          {/* Price Section */}
                          <div className="text-md font-semibold">
                            <p className="font-semibold text-[#000000]">
                              <span>Charges:</span> ₹{badge.badgePrice}
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
                <div className="fixed inset-0 z-[9999] bg-[#000000] bg-opacity-50 overflow-hidden flex items-center justify-center p-2">
                  <div className="bg-white rounded-xl p-[1rem] shadow-xl w-full max-w-md overflow-hidden relative animate-fadeIn space-y-3">
                    {/* Close Button */}
                    <button
                      onClick={handleClosePopup}
                      className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black transition"
                    >
                      ×
                    </button>

                    {/* Header */}
                    <div className="text-center space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Account Verification
                      </h2>
                      <p className="text-sm text-gray-600">
                        Get your{" "}
                        <span className="font-semibold">
                          {activeBadge.badgeName}
                        </span>{" "}
                        for just{" "}
                        <span className="text-[#4B2B1C] font-bold">
                          ₹{activeBadge.badgePrice}
                        </span>
                      </p>
                    </div>

                    {/* Profile Preview */}
                    <div className="flex flex-col items-center space-y-1">
                      <img
                        src={getImageUrl(profile?.profilePhoto)}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-[#f3f3f3] shadow-sm"
                      />
                      <p className="text-lg font-semibold text-[#000000]">
                        {profile?.username}
                      </p>
                    </div>

                    {/* Badge Info */}
                    <div className="space-y-3">
                      <div className="bg-gray-50 px-3 py-2 rounded-md border">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <img
                            src={getImageUrl(activeBadge.badgeImage)}
                            alt="badge"
                            className="w-6 h-6 object-cover rounded-full"
                          />
                          {activeBadge.badgeName}
                        </h3>
                        <p className="text-sm text-[#000000]">
                          {activeBadge.badgeDescription}
                        </p>
                      </div>

                      {/* Criteria */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-[#000000]">
                          Criteria
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-2 pl-3 capitalize list-disc">
                          {activeBadge.badgeName
                            .toLowerCase()
                            .includes("trusted") && (
                              <>
                                <li>At least 5 original artworks uploaded</li>
                                <li>Active profile with bio and profile picture</li>
                                <li>1 month+ on the platform</li>
                                <li>Social link/portfolio linked & verified</li>
                              </>
                            )}
                          {activeBadge.badgeName
                            .toLowerCase()
                            .includes("master") && (
                              <>
                                <li>Have a Trusted Badge</li>
                                <li>At least 20 original artworks uploaded</li>
                                <li>Minimum ₹10,000 in sales on platform</li>
                                <li>
                                  Verified portfolio and social media presence
                                </li>
                              </>
                            )}
                          {activeBadge.badgeName
                            .toLowerCase()
                            .includes("artsays") && (
                              <li>No criteria – available for everyone</li>
                            )}
                        </ul>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-sm text-gray-500 text-center">
                      By tapping <strong>Confirm & Apply</strong>, you agree to our{" "}
                      <a
                        href="/policy"
                        className="underline hover:text-gray-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/policy"
                        className="underline hover:text-gray-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>.
                    </p>

                    {/* Action Button */}
                    <div className="w-full">
                      <button
                        onClick={() => handleApplyForBadge(activeBadge._id)}
                        className="w-full bg-[#4B2B1C] py-2 rounded-md text-white font-semibold shadow-md"
                      >
                        Confirm & Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Popup */}
              {showSuccessPopup && activeBadge && (
                <div className="fixed inset-0 z-[9999] bg-[#000000] bg-opacity-50 flex justify-center items-center p-2">
                  <div className="bg-white rounded-lg w-full lg:max-w-md overflow-y-auto relative p-3 space-y-3">
                    <button
                      onClick={() => setShowSuccessPopup(false)}
                      className="absolute top-3 right-3 text-2xl text-gray-600"
                    >
                      ×
                    </button>

                    <h2 className="text-2xl font-bold text-center capitalize">
                      Welcome to the Verified Club!
                    </h2>

                    <div className="flex justify-center">
                      <img
                        src={getImageUrl(profile?.profilePhoto)}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>

                    <p className="text-center font-semibold flex items-center justify-center gap-2">
                      {profile?.username}{" "}
                      <img
                        src={getImageUrl(activeBadge.badgeImage)}
                        alt="badge"
                        className="w-6 h-6 object-cover rounded-full"
                      />
                    </p>
                    <p className="text-center text-sm text-[#000000] capitalize">
                      Your {activeBadge.badgeName} is now active and proudly
                      visible on your profile and artworks.
                    </p>

                    <button
                      onClick={() => {
                        const link = `${window.location.origin
                          }/artsays-community/profile/${hasValidUsername
                            ? `${userName}_${userId}`
                            : `${firstNameLS}_${lastNameLS}_${userId}`
                          }`;
                        if (navigator.clipboard && window.isSecureContext) {
                          navigator.clipboard
                            .writeText(link)
                            .then(() => setCopyMsg("Link copied!"))
                            .catch(() => fallbackCopyText(link));
                        } else {
                          fallbackCopyText(link);
                        }

                        setTimeout(() => setCopyMsg(""), 2000);
                      }}
                      className="bg-[#4B2B1C] w-full flex justify-center py-2 items-center gap-2 text-white font-semibold rounded-lg capitalize"
                    >
                      Share your moment on socials <IoPaperPlaneOutline />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Privacy center panel */}
          {active === "privacy-center" && (
            <div className="w-full my-4 flex flex-col lg:border-[1px] lg:border-[#48372D] rounded-md lg:p-[1rem] space-y-3">
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-1">
                  {lgActive && (
                    <button
                      className="text-2xl font-bold text-[#000000]"
                      onClick={() => setLgActive(false)}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                  )}
                  <div className="text-2xl font-bold ">Privacy Center</div>
                </div>
              </div>

              <div className="flex w-full lg:flex-row flex-col grid grid-cols-12 gap-2">
                {/* Left TOC */}
                <div className="col-span-12 lg:col-span-3 lg:border-r-2 lg:border-black lg:pr-2">
                  <div className="text-md font-semibold">
                    Privacy Policy
                  </div>
                  <div className="w-full bg-white space-y-4">
                    <nav className="flex flex-col justify-end gap-2 text-sm">
                      {policies.map((policy) => (
                        <div
                          key={policy._id}
                          className={`cursor-pointer ${selectedPolicy?._id === policy._id
                            ? "text-[#000000] font-semibold underline"
                            : "text-[#444444] hover:underline"
                            }`}
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          {policy.question}
                        </div>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Main content */}
                <div className="col-span-12 lg:col-span-9">
                  <div className="bg-white space-y-3">
                    {selectedPolicy ? (
                      <div className="flex flex-col gap-2">
                        <h1 className="text-lg font-semibold capitalize">
                          {selectedPolicy.question}
                        </h1>
                        <div className="text-xs text-gray-500">
                          Effective{" "}
                          {new Date(selectedPolicy.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="space-y-3 text-sm text-[#000000] bg-[#EBEBEB] p-2 rounded-md">
                          <p className="whitespace-pre-line">{selectedPolicy.description}</p>
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
      </div>

      <div
        className={`${lgActive ? "hidden lg:flex" : "flex "
          } col-span-12 lg:col-span-3 w-full mx-auto bg-white lg:border-[1px] lg:border-[#48372D] rounded-lg lg:mt-[1.5rem] h-fit`}
      >
        <div className="p-3 w-full space-y-3">
          <h1 className="text-[26px] font-bold text-[#48372D] w-full">
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
                className={`flex items-center gap-3 cursor-pointer lg:px-3.5 py-2 rounded-xl transition ${active === item.key
                  ? "bg-[#48372D] text-white !px-2 border-l-[12px] border-[#FB5934]"
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
