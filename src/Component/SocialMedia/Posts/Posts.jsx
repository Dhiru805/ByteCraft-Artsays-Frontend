import React, { useEffect, useState, useRef, useCallback } from "react";
import { getImageUrl } from '../../../utils/getImageUrl';
import "../Sidebar/Side-post-sugg.css";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import putAPI from "../../../api/putAPI";
import { timeAgo } from "./../../../utils/TimeAgo.js";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../../../AuthContext.jsx";

const SponsoredFeedSlider = ({ ads }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const userType = localStorage.getItem("userType");

  const handleAdClick = async (ad) => {
    try {
      await postAPI("/api/campaigns/ads/click", {
        campaignId: ad.campaignId,
        productId: ad._id,
        placement: ad.placement || "communityFeed",
      }, {}, false);
    } catch (err) {
      console.error("Ad click tracking error:", err);
    }
    navigate(`/product/${ad.slug || ad._id}`);
  };

  useEffect(() => {
    if (ads.length <= 1 || isHovered) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [ads.length, isHovered]);

  if (!ads || ads.length === 0) return null;
  const ad = ads[currentIndex];
  const image = ad.mainImage;
  const hasDiscount = ad.marketPrice && ad.finalPrice && ad.marketPrice > ad.finalPrice;
  const discountPercent = hasDiscount ? Math.round(((ad.marketPrice - ad.finalPrice) / ad.marketPrice) * 100) : 0;

  return (
    <div
      className="w-full overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img
            src={ad.userId?.profilePhoto ? getImageUrl(ad.userId.profilePhoto) : DEFAULT_PROFILE_IMAGE}
            alt={ad.userId?.name || "Seller"}
            className="object-cover w-8 h-8 border border-gray-200 rounded-full"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {ad.userId?.name || ""}{ad.userId?.lastName ? ` ${ad.userId.lastName}` : ""}
            </span>
            <span className="text-[9px] font-bold tracking-wide uppercase text-white bg-[#6F4D34] px-1.5 py-0.5 rounded">Ad</span>
          </div>
        </div>
        {ads.length > 1 && (
          <span className="text-[10px] text-gray-400">{currentIndex + 1}/{ads.length}</span>
        )}
      </div>

      {/* Image */}
      <div className="relative w-full cursor-pointer aspect-square bg-gray-50 group" onClick={() => handleAdClick(ad)}>
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={ad.productName}
            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-300">
            <i className="text-4xl ri-image-line"></i>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        )}

        {/* Navigation arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length); }}
              className="absolute flex items-center justify-center transition-opacity -translate-y-1/2 rounded-full shadow opacity-0 left-2 top-1/2 w-7 h-7 bg-white/80 group-hover:opacity-100"
            >
              <i className="text-sm ri-arrow-left-s-line"></i>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % ads.length); }}
              className="absolute flex items-center justify-center transition-opacity -translate-y-1/2 rounded-full shadow opacity-0 right-2 top-1/2 w-7 h-7 bg-white/80 group-hover:opacity-100"
            >
              <i className="text-sm ri-arrow-right-s-line"></i>
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="px-3 py-2.5">
        <h4
          className="font-semibold text-sm text-gray-900 line-clamp-1 cursor-pointer hover:text-[#6F4D34] transition-colors"
          onClick={() => handleAdClick(ad)}
        >
          {ad.productName || "Untitled Product"}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">&#8377;{ad.marketPrice}</span>
          )}
          {ad.finalPrice && (
            <span className="text-sm font-bold text-[#6F4D34]">&#8377;{ad.finalPrice}</span>
          )}
        </div>

        {/* Buy Now Button */}
        {userType !== "Artist" && userType !== "Seller" && (
          <button
            onClick={() => handleAdClick(ad)}
            className="w-full mt-2.5 py-2 bg-[#6F4D34] text-white text-sm font-semibold rounded-lg hover:bg-[#5a3d28] transition-colors flex items-center justify-center gap-1.5"
          >
            <i className="text-sm ri-shopping-bag-line"></i>
            Buy Now
          </button>
        )}
      </div>

      {/* Dots */}
      {ads.length > 1 && (
        <div className="flex justify-center gap-1 pb-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-300 ${i === currentIndex ? "w-4 h-1.5 bg-[#6F4D34]" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
const CommentInput = ({ post, userId, setPosts, inputRef }) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleComment = async () => {
    if (!text.trim()) return;
    try {
      const res = await postAPI(
        `/api/social-media/posts/${post._id}/comments`,
        { userId, text: text },
        false,
        true
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        )
      );
      setText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setText(value);

    const match = value.match(/@(\w*)$/);
    if (match) {
      const query = match[1];
      if (query.length > 0) {
        try {
          const res = await getAPI(
            `/api/social-media/mention?q=@${query}&userId=${userId}`,
            {},
            true,
            true
          );
          setSuggestions(res.data.users || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Error fetching mentions:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectMention = (username) => {
    const newText = text.replace(/@\w*$/, `@${username} `);
    setText(newText);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 z-50 w-full mb-1 overflow-y-auto bg-white border rounded-md shadow-md bottom-full max-h-40">
          {suggestions.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectMention(user.username)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={
                  user.profilePhoto
                    ? getImageUrl(user.profilePhoto)
                    : DEFAULT_PROFILE_IMAGE
                }
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="flex items-center text-sm font-medium text-gray-800">
                  {user.username}
                  {user.verified?.length > 0 && (
                    <img
                      src={getImageUrl(user.verified[user.verified.length - 1]?.badgeImage)}
                      className="inline-block object-contain w-4 h-4 ml-1"
                      alt="verified"
                    />
                  )}
                </span>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          ref={inputRef}
          placeholder="Add a comment..."
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleComment();
          }}
          className="flex-grow outline-none text-sm focus:outline-none text-[#000000] py-1 bg-transparent"
        />
        <button
          onClick={handleComment}
          className="text-sm font-semibold text-blue-500 hover:text-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
};

const Post = () => {
  const userId = localStorage.getItem("userId");
  const Navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(false);
  const [tipPopupOpen, setTipPopupOpen] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tipAmount, setTipAmount] = useState(40);
  const [tipUser, setTipUser] = useState(null);
  const [error, setError] = useState("");
  const [reportPopupOpen, setReportPopupOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [reportedUser, setReportedUser] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [allCollaboraters, setAllCollaboraters] = useState([]);
  const isMobile = window.innerWidth < 1024; // Tailwind lg breakpoint
  const [sponsoredAds, setSponsoredAds] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const POSTS_PER_PAGE = 10;
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const userName = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const navigate = useNavigate();
  const popupRef = useRef();
  const postRef = useRef();
  const collabRef = useRef();
  const commentRef = useRef();
  const commentRefs = useRef({});

  const auth = useAuth();
  const userType = auth?.userType;
  const productsPost = posts.filter((pro) => pro.forProduct);
  const normalPost = posts.filter((pro) => !pro.forProduct);
  const finalPost = [...productsPost, ...normalPost];
  const activePost = activeIndex !== null ? finalPost[activeIndex] : null;

  useEffect(() => {
    const fetchSponsoredAds = async () => {
      try {
        const res = await getAPI("/api/campaigns/ads/placement?placement=communityFeed", {}, true, false);
        if (res?.data?.data) setSponsoredAds(res.data.data);
      } catch (err) {
        console.error("Error fetching sponsored ads:", err);
      }
    };
    fetchSponsoredAds();
  }, []);

  useEffect(() => {
    const shouldLockScroll = activePost || reportPopupOpen || tipPopupOpen || deleteConfirmId;

    document.body.style.overflow = shouldLockScroll ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activePost, reportPopupOpen, tipPopupOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      // --- CLOSE MENU POPUP ---
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setMenuOpenId(null); // CLOSE POPUP
      }

      // --- DESKTOP POST POPUP ---
      if (!isMobile) {
        if (postRef.current && !postRef.current.contains(event.target)) {
          setActiveIndex(null);
        }
      }

      if (collabRef.current && !collabRef.current.contains(event.current)) {
        setShowCollaborators(false);
        setAllCollaboraters([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId, activeIndex, showCollaborators]);

  const goToProfile = (post) => {
    navigate(
      `/artsays-community/profile/${post?.user?.username
        ? `${post?.user?.username}`
        : `${post?.user?.name}_${post?.user?.lastName}_${post?.user?._id}`
      }`, { state: { userId: post?.user?._id } }
    );
  };

  // Fetch profile
  useEffect(() => {
    try {
      const fetchProfile = async () => {
        const res = await getAPI(
          `/api/social-media/profile/${userId}`,
          {},
          false,
          true
        );
        setProfile(res?.data?.profile);
      };
      if (userId) fetchProfile();
    } catch (error) {
      console.error("profile fetching error", error);
    }
  }, [userId]);

  // find post's collaboration with userId
  const isPostCollaborateWithUserId = (post) => {
    return post?.collaborators?.some(
      (user) => user._id === userId && post.user._id !== userId
    );
  };
  const fetchAllCollaborators = (post) => {
    const collaboraters = post.collaborators || [];
    setAllCollaboraters(collaboraters);
  };

  // 🔹 Fetch homepage posts with pagination
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await getAPI(
        `/api/social-media/homepage?userId=${userId}&page=${pageNum}&limit=${POSTS_PER_PAGE}`,
        true
      );

      const newPosts = res?.data?.posts || [];
      const pagination = res?.data?.pagination;

      if (append) {
        // Filter out duplicates when appending
        setPosts((prev) => {
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p._id));
          return [...prev, ...uniqueNewPosts];
        });
      } else {
        setPosts(newPosts);
      }

      // Update hasMore based on pagination response
      if (pagination) {
        setHasMore(pagination.hasMore);
      } else {
        setHasMore(newPosts.length >= POSTS_PER_PAGE);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      setPage(1);
      setHasMore(true);
      fetchPosts(1, false);
    }
  }, [userId, fetchPosts]);

  // Load more posts function
  const loadMorePosts = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  }, [page, loadingMore, hasMore, fetchPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, loadMorePosts]);
  const handleLike = async (postId) => {
    try {
      await postAPI(
        `/api/social-media/posts/${postId}/likeUnlike`,
        { userId },
        {},
        true
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              likes: p.likes.includes(userId)
                ? p.likes.filter((id) => id !== userId)
                : [...p.likes, userId],
            }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking/unliking:", err);
    }
  };

  const handleSave = async (postId) => {
    try {
      await postAPI(
        `/api/social-media/posts/${postId}/saveUnsave`,
        { userId },
        {},
        true
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, isSaved: !p.isSaved } : p))
      );
    } catch (err) {
      console.error("Error saving/unsaving:", err);
    }
  };

  const handleDeletePost = (postId) => {
    setDeleteConfirmId(postId);
    setMenuOpenId(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await deleteAPI(`/api/social-media/posts/${deleteConfirmId}`, {}, true);
      if (res && !res.hasError) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((p) => p._id !== deleteConfirmId));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error(err.response?.data?.message || "Error deleting post");
    }
  };

  useEffect(() => {
    if (activePost) {
      setActiveImageIndex(0);
    }
  }, [activePost]);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    const userId = localStorage.getItem("userId");

    try {
      //  Optimistic UI update first
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.user._id === targetUserId
            ? { ...post, showFollowButton: isFollowing }
            : post
        )
      );

      if (isFollowing) {
        await postAPI(
          `/api/social-media/unfollow/${targetUserId}`,
          { userId },
          true,
          true
        );
      } else {
        await postAPI(
          `/api/social-media/follow/${targetUserId}`,
          { userId },
          true,
          true
        );
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);

      // 🔄 Revert UI on error
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.user._id === targetUserId
            ? { ...post, showFollowButton: !isFollowing }
            : post
        )
      );
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTipAmount(value);
    setError("");
  };

  const handleInputBlur = () => {
    let value = Number(tipAmount);

    if (isNaN(value)) {
      setTipAmount(40);
      setError("Please enter a valid number");
      return;
    }

    if (value < 40) {
      setTipAmount(40);
      setError("Minimum tip is ₹40");
    } else if (value > 1440) {
      setTipAmount(1440);
      setError("Maximum tip is ₹1440");
    }
  };

  const handleSliderChange = (e) => {
    setTipAmount(Number(e.target.value));
    setError("");
  };
  const handleConfirm = async () => {
    const value = Number(tipAmount);
    if (value < 40 || value > 1440) {
      setError("Tip must be between ₹40 and ₹1440");
      return;
    }

    try {
      const senderId = localStorage.getItem("userId");

      const res = await postAPI("/api/tips/create", {
        sender: senderId,
        receiver: tipUser.receiverId,
        post: tipUser.id,
        amount: value,
      });

      if (res?.data?.data?.paymentUrl) {
        window.location.href = res?.data?.data?.paymentUrl;
      } else {
        console.error(`Failed to create certifications: ${res.message}`);
      }

      // if (res.data.success) {
      //   setTipSuccess(true);
      //   setTipPopupOpen(false);

      //   setTipAmount(40);

      //   setTimeout(() => setTipSuccess(false), 2500);
      // } else {
      //   setError(res.data.message || "Failed to send tip");
      // }
    } catch (err) {
      console.error("Error sending tip:", err);
      setError("Something went wrong. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedReason === "Other" && description.trim() === "") {
      setError("Please describe the issue for 'Other'");
      return;
    }

    try {
      const reporterId = localStorage.getItem("userId");

      const payload = {
        reporterId,
        reportedUserId: reportedUser.id,
        postId: reportedUser.postId,
        reason: selectedReason,
        description,
        reportType: "post",
      };

      const res = await postAPI("/api/reports/create", payload, true, true);

      if (res.data.success) {
        setReportPopupOpen(false);
        setReportSuccess(true);
        setSelectedReason("");
        setDescription("");
        setError("");
      } else {
        setError(res.data.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Server error while submitting report");
    }
  };

  const handleBlockUser = async () => {
    const loggedInUserId = localStorage.getItem("userId");

    try {
      const res = await putAPI(
        `/api/social-media/block-unblock`,
        { userId: loggedInUserId, targetUserId: reportedUser.id },
        true,
        true
      );

      if (res?.data?.success) {
        console.log(res.data.message);

        setReportSuccess(false);

        if (res.data.isBlocked) {
          Navigate("/artsays-community/");
        }
      }
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

  // const [reportPopupOpen, setReportPopupOpen] = useState(false);
  // const [reportSuccess, setReportSuccess] = useState(false);

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

  const getExternalUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };


  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn(
        "Only buyers can use this feature, Register as a Buyer to continue."
      );
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <>
        <LoadingSkeleton />
      </>
    );
  }
  return (
    <div className="col-span-12 lg:col-span-6 w-full my-1 md:!my-4 flex flex-col mx-auto max-w-[470px]">
      {/* Active Post Popup */}
      {activePost && (
        <div>
          {/* for big screen */}
          <div className="hidden lg:flex fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
            {/* Popup Layout */}
            <div
              ref={postRef}
              className="lg:bg-white w-[73%] lg:h-[72vh] h-[56vh] rounded-lg overflow-hidden flex relative lg:flex-row flex-col"
            >
              {/* Left Side (Image Viewer) */}
              <div className="w-[60%] h-full  bg-black flex items-center justify-center relative">
                {activePost.images?.length > 0 ? (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <img
                      src={getImageUrl(activePost.images[activeImageIndex])}
                      alt="post"
                      className="w-full h-full "
                    />

                    {/* Image Nav Arrows (show only if multiple images) */}
                    {activePost.images.length > 1 && (
                      <>
                        {activeImageIndex > 0 && (
                          <button
                            className="absolute p-2 -translate-y-1/2 rounded-full left-3 top-1/2 bg-gray-100/70"
                            onClick={() =>
                              setActiveImageIndex((prev) => prev - 1)
                            }
                          >
                            <i className="text-xl ri-arrow-left-s-line"></i>
                          </button>
                        )}
                        {activeImageIndex < activePost.images.length - 1 && (
                          <button
                            className="absolute p-2 -translate-y-1/2 rounded-full right-3 top-1/2 bg-gray-100/70"
                            onClick={() =>
                              setActiveImageIndex((prev) => prev + 1)
                            }
                          >
                            <i className="text-xl ri-arrow-right-s-line"></i>
                          </button>
                        )}

                        {/* Image Dots */}
                        <div className="absolute flex justify-center w-full gap-2 bottom-3">
                          {activePost.images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full ${idx === activeImageIndex
                                ? "bg-gray-100"
                                : "bg-gray-500"
                                }`}
                            ></div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">No image</div>
                )}
              </div>

              {/* Right Side (Post Content) */}
              <div className="lg:w-[40%] w-full flex flex-col justify-between gap-6 p-4 bg-[#ffffff] overflow-y-auto">
                {/* User Info */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          activePost.user?.profilePhoto
                            ? getImageUrl(activePost.user?.profilePhoto)
                            : `${DEFAULT_PROFILE_IMAGE}`
                        }
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {activePost.user?.username}
                          {activePost.user.verified?.length > 0 && (
                            <img
                              src={getImageUrl(activePost.user.verified[
                                activePost.user.verified.length - 1
                              ]?.badgeImage
                              )}
                              className="inline-block object-contain w-5 h-5 ml-1"
                              alt={
                                activePost.user.verified[
                                  activePost.user.verified.length - 1
                                ]?.badgeName || "badge"
                              }
                              title={
                                activePost.user.verified[
                                  activePost.user.verified.length - 1
                                ]?.badgeName
                              }
                            />
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {activePost.location || ""}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveIndex(null)}
                      className="text-2xl font-bold text-gray-600 hover:text-red-500"
                    >
                      X
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex flex-col h-auto gap-3 overflow-y-auto">
                  {activePost.comments?.length > 0 ? (
                    activePost.comments.map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <img
                          src={
                            activePost.user?.profilePhoto
                              ? getImageUrl(activePost?.user?.profilePhoto)
                              : `${DEFAULT_PROFILE_IMAGE}`
                          }
                          alt="profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <span className="text-sm font-semibold">
                            {comment?.user?.username}
                          </span>
                          <p className="text-xs">{comment?.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  {/* Actions */}
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleLike(activePost._id)}>
                        <i
                          className={`${activePost.likes.includes(userId)
                            ? "ri-heart-fill text-red-500"
                            : "ri-heart-line"
                            } text-xl`}
                        ></i>
                      </button>
                      <i
                        onClick={() => {
                          commentRef.current.focus();
                        }}
                        className="text-xl ri-chat-3-line"
                      ></i>

                      <button onClick={() => setSharePost(activePost)}>
                        <i className="text-xl ri-send-plane-fill"></i>
                      </button>
                    </div>
                    <div>
                      <button onClick={() => handleSave(activePost._id)}>
                        <i
                          className={`${activePost.isSaved
                            ? "ri-bookmark-fill"
                            : "ri-bookmark-line"
                            } text-xl`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <p className="ml-1 text-sm font-medium">
                    {activePost.likes.length} likes
                  </p>

                  {/* Add Comment */}
                  {activePost.canComment ? (
                    <CommentInput
                      post={activePost}
                      userId={userId}
                      setPosts={setPosts}
                      inputRef={commentRef}
                    />
                  ) : (
                    <p className="text-sm italic text-gray-500">
                      Comments are restricted
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* for small screen */}
          <div className="fixed inset-0 z-[9999] w-full h-full flex flex-col bg-[#ffffff] lg:hidden">
            {/* back button with title */}
            <div className="flex items-center justify-between w-full p-3 border-b">
              <i
                className="text-2xl ri-arrow-left-s-line"
                onClick={() => setActiveIndex(null)}
              ></i>
              <span className="text-xl font-semibold text-center">
                Comments
              </span>
            </div>

            {/* caption with comments */}
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex gap-2 p-3 border-b">
                <img
                  src={
                    activePost.user?.profilePhoto
                      ? getImageUrl(activePost.user?.profilePhoto)
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="profile"
                  className="rounded-full w-11 h-11"
                />
                <div className="">
                  <span className="font-semibold text-[16px] block">
                    {activePost.user?.username}
                    {activePost.user.verified?.length > 0 && (
                      <img
                        src={getImageUrl(activePost.user.verified[
                          activePost.user.verified.length - 1
                        ]?.badgeImage
                        )}
                        className="inline-block object-contain w-6 h-6 ml-1"
                        alt={
                          activePost.user.verified[
                            activePost.user.verified.length - 1
                          ]?.badgeName || "badge"
                        }
                        title={
                          activePost.user.verified[
                            activePost.user.verified.length - 1
                          ]?.badgeName
                        }
                      />
                    )}
                  </span>
                  <p className="text-sm break-words break-all whitespace-pre-wrap">
                    {activePost.caption}
                  </p>
                </div>
              </div>

              {/* Comments */}
              <div className="flex flex-col gap-3 p-3">
                {activePost.comments?.length > 0 ? (
                  activePost.comments
                    .slice()
                    .reverse()
                    .map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <img
                          src={
                            comment?.user?.profilePhoto
                              ? getImageUrl(comment?.user?.profilePhoto)
                              : `${DEFAULT_PROFILE_IMAGE}`
                          }
                          alt="profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <span className="text-[15px] font-semibold block">
                            {comment?.user?.username}
                          </span>
                          <p className="text-xs break-words">{comment?.text}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet</p>
                )}
              </div>
            </div>

            {/* Add Comment */}
            {activePost.canComment ? (
              <div className="p-2 border-t">
                <CommentInput
                  post={activePost}
                  userId={userId}
                  setPosts={setPosts}
                />
              </div>
            ) : (
              <p className="text-sm italic text-gray-500">
                Comments are restricted
              </p>
            )}
          </div>
        </div>
      )}

      {tipPopupOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pay a Tip</h2>
              <button
                onClick={() => setTipPopupOpen(false)}
                className="text-2xl font-bold text-gray-600 hover:text-red-500"
              >
                ×
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Enter Amount
              </label>
              <input
                type="number"
                min="40"
                max="1440"
                value={tipAmount}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${error ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <p className="mt-1 text-xs text-gray-500">Min ₹40 • Max ₹1,440</p>
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            {/* Slider */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">
                Tip amount: <span className="font-semibold">₹{tipAmount}</span>
              </p>
              <input
                type="range"
                min="40"
                max="1440"
                step="10"
                value={tipAmount}
                onChange={handleSliderChange}
                className="w-full accent-red-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTipPopupOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Pay ₹{tipAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {tipSuccess && (
        <div className="fixed inset-0 z-[10000] bg-[#000000]/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[300px] animate-bounceIn">
            <FaCheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Tip Sent Successfully!
            </h3>
            <p className="mt-1 text-gray-600">
              You Tipped <span className="font-bold">₹{tipAmount}</span>
            </p>
            <button
              onClick={() => setTipSuccess(false)}
              className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportPopupOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center overflow-auto">
          <div className="p-3 bg-white shadow-lg rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Report @{reportedUser?.username}
              </h2>
              <button
                onClick={() => setReportPopupOpen(false)}
                className="text-2xl font-bold text-gray-600 hover:text-red-500"
              >
                ×
              </button>
            </div>
            <hr className="my-2 border-dark" />
            {/* Subtitle */}
            <p className="mb-4 text-sm text-gray-600">
              Why are you reporting this post?
            </p>

            {/* Report Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-2">
                {[
                  "I just don't like it",
                  "Bullying or unwanted contact",
                  "Suicide, self-injury or eating disorders",
                  "Violence, hate or exploitation",
                  "Selling or promoting restricted items",
                  "Nudity or sexual activity",
                  "Scam, fraud or spam",
                  "False information",
                  "Other",
                ].map((reason, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => {
                        setSelectedReason(e.target.value);
                        setError("");
                      }}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-800">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Description */}
              {selectedReason && (
                <div className="mt-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {selectedReason === "Other"
                      ? "Describe the issue (required)"
                      : "Describe the issue (optional)"}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none text-sm ${error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-red-500"
                      }`}
                  />
                  {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setReportPopupOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${selectedReason
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {reportSuccess && reportedUser && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg w-[380px] p-6 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800">
              Thanks for letting us know
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              We’ve received your report about @{reportedUser.username}.
            </p>
            <hr className="my-2 border-dark" />
            {/* Block Option */}
            <div className="">
              <p className="mb-2 text-sm text-gray-700">
                Do you also want to block{" "}
                <span className="font-semibold">@{reportedUser.username}</span>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setReportSuccess(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={handleBlockUser} // ✅ hook your block API
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sharePost && (
        <div className="fixed inset-0 bg-[#000000]/40 flex justify-center items-center z-[9999]">
          <div className="relative p-4 bg-white shadow-lg w-80 rounded-xl">
            {/* Close */}
            <button
              className="absolute text-xl top-2 right-2"
              onClick={() => setSharePost(null)}
            >
              <i className="ri-close-line"></i>
            </button>

            <h3 className="mb-3 text-lg font-semibold">Share Post</h3>

            {/* Copy Link */}
            <button
              className="w-full py-2 mb-2 text-gray-800 bg-gray-200 rounded-lg"
              onClick={() => {
                const link = `${window.location.origin}/artsays-community/sharepost/${sharePost._id}`;
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
            >
              Copy Link
            </button>

            {/* Success Message */}
            {copyMsg && (
              <p className="mt-1 text-sm text-center text-green-600">
                {copyMsg}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="w-full space-y-2">
        {finalPost?.map((post, idx) => (
          <React.Fragment key={post._id}>
            {/* Insert sponsored ad after every 5th post */}
            {idx > 0 && idx % 5 === 0 && sponsoredAds.length > 0 && (
              <SponsoredFeedSlider ads={sponsoredAds} />
            )}
            <div className="relative flex flex-col w-full p-2 border shadow-sm rounded-xl">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      post.user?.profilePhoto
                        ? getImageUrl(post.user?.profilePhoto)
                        : `${DEFAULT_PROFILE_IMAGE}`
                    }
                    alt="profile"
                    className="rounded-full cursor-pointer h-11 w-11"
                    onClick={() => goToProfile(post)}
                  />

                  <div>
                    <div className="flex items-center">
                      <h3
                        className="font-extrabold text-[#000000] cursor-pointer"
                        onClick={() => goToProfile(post)}
                      >
                        {post.user.username}
                      </h3>

                      {post.user.verified?.length > 0 && (
                        <img
                          src={getImageUrl(post.user.verified[post.user.verified.length - 1]
                            ?.badgeImage
                          )}
                          className="inline-block object-contain w-5 h-5 ml-1"
                          alt={
                            post.user.verified[post.user.verified.length - 1]
                              ?.badgeName || "badge"
                          }
                        />
                      )}
                      <div className="flex items-center text-[#000000]">
                        {isPostCollaborateWithUserId(post) ? (
                          <p className="font-extrabold cursor-pointer">
                            , {profile?.username}
                            {post.collaboraters?.length > 1 && (
                              <>
                                and &nbsp;
                                <button
                                  onClick={() => {
                                    setShowCollaborators(true);
                                    fetchAllCollaborators(post);
                                  }}
                                  className="font-medium text-blue-600 outline-none hover:underline focus:outline-none active:outline-none"
                                >
                                  ...others
                                </button>
                              </>
                            )}
                          </p>
                        ) : (
                          <>
                            {post.collaborators?.length > 0 && (
                              <p className="font-extrabold cursor-pointer">
                                &nbsp; and &nbsp;
                                <button
                                  onClick={() => {
                                    setShowCollaborators(true);
                                    fetchAllCollaborators(post);
                                  }}
                                  className="font-medium text-blue-600 outline-none hover:underline focus:outline-none active:outline-none"
                                >
                                  ...others
                                </button>
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Time + Sponsored */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      {post.isPromoted && (
                        <span className="font-semibold text-black">
                          Sponsored
                        </span>
                      )}

                      {post.location && !post.isPromoted && (
                        <>
                          {post.isPromoted && <span>·</span>}
                          <span>{post.location}</span>
                        </>
                      )}

                      {(post.isPromoted || post.location) && <span>·</span>}

                      <span>{timeAgo(post.createdAt)}</span>
                    </div>

                  </div>
                </div>

                {/* CTA + Buttons */}
                <div className="flex items-center gap-2">
                  {post.showFollowButton ? (
                    <button
                      onClick={() => handleFollowToggle(post.user._id, false)}
                      className="buy-button"
                    >
                      Follow
                    </button>
                  ) : (
                    ""
                  )}
                  {post.forProduct && (
                    <button
                      className="buy-button"
                      onClick={() => {
                        if (!ensureBuyer()) return;
                        navigate(
                          `/my-account/check-out/${userId}?productId=${post?.forProduct
                          }&quantity=${1}`
                        );
                      }}
                    >
                      Buy Now
                    </button>
                  )}
                  <button onClick={() => setMenuOpenId(post._id)} className="focus:outline-none">
                    <i className="text-lg ri-more-fill"></i>
                  </button>
                </div>
              </div>

              {/* More Menu */}
              {menuOpenId === post._id && (
                <ul
                  ref={popupRef}
                  className="absolute z-10 flex flex-col items-center justify-between w-40 text-xs bg-white border shadow-md rounded-xl right-1 top-12 "
                >
                  {/* Pay Tip */}
                  {post.user._id !== userId && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <li
                        className="flex items-center justify-center w-full px-3 py-2 font-semibold cursor-pointer hover:bg-gray-200 rounded-t-xl"
                        onClick={() => {
                          setTipUser({
                            id: post._id,
                            receiverId: post.user._id,
                          });
                          setTipPopupOpen(true);
                          setMenuOpenId(null);
                        }}
                      >
                        Pay Tip
                      </li>
                    </div>
                  )}

                  <hr className="w-[80%] border-t border-gray-400" />

                  {/* Report */}
                  {post.user._id !== userId && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <li
                        className="flex items-center justify-center w-full px-3 py-2 font-semibold cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setReportedUser({
                            id: post.user._id,
                            postId: post._id,
                            username: post.user.username,
                          });
                          setReportPopupOpen(true);
                          setMenuOpenId(null);
                        }}
                      >
                        Report
                      </li>
                    </div>
                  )}

                  <hr className="w-[80%] border-t border-gray-400" />

                  {/* Follow / Unfollow */}
                  {post.user._id !== userId && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <li
                        className="flex items-center justify-center w-full px-3 py-2 font-semibold cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          handleFollowToggle(
                            post.user._id,
                            !post.showFollowButton
                          )
                        }
                      >
                        {post.showFollowButton ? "Follow" : "Unfollow"}
                      </li>
                    </div>
                  )}

                  <hr className="w-[80%] border-t border-gray-400" />

                  {/* Save / Unsave */}
                  <li
                    className="flex items-center justify-center w-full px-3 py-2 font-semibold cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSave(post?._id)}
                  >
                    {post.isSaved ? "Unsave" : "Save"}
                  </li>

                  <hr className="w-[80%] border-t border-gray-400" />

                  {/* About This Account */}
                  <li
                    className="flex items-center justify-center w-full px-3 py-2 font-semibold cursor-pointer hover:bg-gray-200"
                    onClick={() =>
                      navigate(
                        `/artsays-community/profile/${post?.user?.username
                          ? `${post?.user?.username}`
                          : `${post?.user?.name}_${post?.user?.lastName}_${post?.user?._id}`
                        }`, { state: { userId: post?.user?._id } }
                      )
                    }
                  >
                    About This Account
                  </li>

                  <hr className="w-[80%] border-t border-gray-400" />

                  {/* Delete Post (Owner only) */}
                  {post.user._id === userId && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <li
                        className="flex items-center justify-center w-full px-3 py-2 font-semibold text-red-600 cursor-pointer hover:bg-red-200"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </li>
                      <hr className="w-[80%] border-t border-gray-400" />
                    </div>
                  )}

                  {/* Cancel */}
                  <li
                    className="flex items-center justify-center w-full px-3 py-2 font-semibold text-red-500 cursor-pointer hover:bg-red-200 rounded-b-xl"
                    onClick={() => setMenuOpenId(null)}
                  >
                    Cancel
                  </li>
                </ul>
              )}

              {/* Post Image Carousel */}
              <div className="relative py-2">
                {post.images && post.images.length > 0 && (
                  <>
                    <img
                      src={getImageUrl(post.images[post.activeImageIndex || 0]
                      )}
                      alt="Post content"
                      className="w-full h-full rounded-lg "
                    />

                    {/* Left Arrow (only if not on first image) */}
                    {post.images.length > 1 &&
                      (post.activeImageIndex || 0) > 0 && (
                        <button
                          onClick={() =>
                            setPosts((prev) =>
                              prev.map((p) =>
                                p._id === post._id
                                  ? {
                                    ...p,
                                    activeImageIndex:
                                      (p.activeImageIndex || 0) - 1,
                                  }
                                  : p
                              )
                            )
                          }
                          className="absolute p-2 text-white transform -translate-y-1/2 bg-black rounded-full left-2 top-1/2 bg-opacity-40 focus:outline-none"
                        >
                          <i className="text-xl bg-gray-600 rounded-full ri-arrow-left-s-line"></i>
                        </button>
                      )}

                    {/* Right Arrow (only if not on last image) */}
                    {post.images.length > 1 &&
                      (post.activeImageIndex || 0) < post.images.length - 1 && (
                        <button
                          onClick={() =>
                            setPosts((prev) =>
                              prev.map((p) =>
                                p._id === post._id
                                  ? {
                                    ...p,
                                    activeImageIndex:
                                      (p.activeImageIndex || 0) + 1,
                                  }
                                  : p
                              )
                            )
                          }
                          className="absolute p-2 text-white transform -translate-y-1/2 bg-black rounded-full right-2 top-1/2 bg-opacity-40 focus:outline-none"
                        >
                          <i className="text-xl bg-gray-600 rounded-full ri-arrow-right-s-line"></i>
                        </button>
                      )}

                    {/* Dots */}
                    {post.images.length > 1 && (
                      <div className="absolute z-10 flex justify-center w-full gap-1 bottom-6">
                        {post.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`h-2 w-2 rounded-full ${(post.activeImageIndex || 0) === idx
                              ? "bg-white"
                              : "bg-[#000000]"
                              }`}
                          ></span>
                        ))}
                      </div>
                    )}
                    {/* Website Link Box */}
                    {post.isPromoted && post.promotionDetails?.website && (
                      <a
                        href={getExternalUrl(post.promotionDetails.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 w-[80%] text-white text-md px-3 py-2 justify-self-center mt-2 rounded-md flex flex-col shadow-lg bg-[#48372D]/70 hover:bg-[#48372D]"
                      >
                        <span className="font-semibold leading-tight">
                          Explore Our Website
                        </span>

                        <span className="leading-tight break-all">
                          {post.promotionDetails.website}
                        </span>
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex flex-col gap-1 mx-1">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-4">
                    <button onClick={() => handleLike(post._id)} className="focus:outline-none text-[#000000]">
                      <i
                        className={`${post.likes.includes(userId)
                          ? "ri-heart-fill text-red-500"
                          : "ri-heart-line"
                          } text-xl font-medium`}
                      ></i>
                    </button>
                    <button
                      onClick={() => commentRefs.current[post._id]?.focus()} className="focus:outline-none text-[#000000]"
                    >
                      <i className="text-xl font-medium ri-chat-3-line"></i>
                    </button>

                    <button onClick={() => setSharePost(post)} className="focus:outline-none text-[#000000]">
                      <i className="text-xl font-medium ri-send-plane-fill"></i>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleSave(post?._id)} className="focus:outline-none text-[#000000]">
                      <i
                        className={`${post?.isSaved ? "ri-bookmark-fill" : "ri-bookmark-line"
                          } text-xl font-medium`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Likes */}
                <div className="text-sm text-[#000000] font-bold">
                  {post.likes.length} likes
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm mt-1 text-[#000000] font-semibold break-all whitespace-normal w-full">
                    {post.user.username}{" "}
                    {post.user.verified?.length > 0 && (
                      <img
                        src={getImageUrl(post.user.verified[post.user.verified.length - 1]
                          ?.badgeImage
                        )}
                        className="inline-block object-contain w-5 h-5 ml-1"
                        alt={
                          post.user.verified[post.user.verified.length - 1]
                            ?.badgeName || "badge"
                        }
                        title={
                          post.user.verified[post.user.verified.length - 1]
                            ?.badgeName
                        }
                      />
                    )}{" "}
                    {post.caption}
                  </p>
                </div>

                {/* Comments */}
                <div
                  className="text-xs text-[#000000] font-light cursor-pointer"
                  onClick={() => setActiveIndex(finalPost.indexOf(post))}
                >
                  View all {post.comments.length} comments
                </div>

                {/* Add Comment */}
                {post.canComment ? (
                  <CommentInput
                    post={post}
                    userId={userId}
                    setPosts={setPosts}
                    inputRef={(el) => (commentRefs.current[post._id] = el)}
                  />
                ) : (
                  <p className="p-3 text-sm italic text-gray-500">
                    Comments are restricted
                  </p>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Infinite Scroll Loading Indicator */}
        <div ref={loadMoreRef} className="flex justify-center w-full py-4">
          {loadingMore && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-[#AD6449] rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading more posts...</p>
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <p className="py-4 text-sm text-gray-400">You've reached the end</p>
          )}
        </div>
      </div>

      {showCollaborators && allCollaboraters && (
        <div className="fixed inset-0 flex items-center justify-center  bg-[#000000]/40 backdrop-blur-sm z-50">
          <div
            ref={collabRef}
            className="relative p-3 bg-white shadow-xl rounded-xl w-80 animate-fadeIn"
          >
            {/* ❌ Close (cross) button */}
            <button
              onClick={() => setShowCollaborators(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-[#000000] text-xl"
            >
              <i className="ri-close-line text-[#000000]"></i>{" "}
            </button>

            <h3 className="mb-4 text-lg font-semibold text-center">
              Collaborators
            </h3>

            <ul className="space-y-2 overflow-y-auto max-h-48">
              {allCollaboraters?.length > 0 ? (
                allCollaboraters.map((c) => {
                  return (
                    <li
                      key={c._id}
                      className="flex items-center p-2 space-x-6 border rounded-md"
                    >
                      <img
                        src={
                          c?.profilePhoto
                            ? getImageUrl(c.profilePhoto)
                            : DEFAULT_PROFILE_IMAGE
                        }
                        alt={c.username || "user"}
                        className="object-cover w-10 h-10 rounded-full"
                      />

                      <span className="text-lg font-bold ">{c.username}</span>
                    </li>
                  );
                })
              ) : (
                <li className="py-3 text-center text-gray-500">
                  No collaborators found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">
            <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">Delete Post?</h2>
            <p className="mb-6 text-center text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-2 font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

// loading skeleton
const LoadingSkeleton = () => {
  return (
    <div className="col-span-12 p-2 my-4 border shadow-sm animate-pulse rounded-xl lg:col-span-6">
      {/* Header */}
      <div className="flex items-center mb-4 space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="w-32 h-3 bg-gray-300 rounded"></div>
          <div className="w-20 h-2 mt-1 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Image / Content */}
      <div className="w-full mb-4 bg-gray-300 h-80 rounded-xl"></div>

      {/* Footer */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-3 bg-gray-300 rounded"></div>
        <div className="w-12 h-3 bg-gray-300 rounded"></div>
        <div className="w-20 h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};
