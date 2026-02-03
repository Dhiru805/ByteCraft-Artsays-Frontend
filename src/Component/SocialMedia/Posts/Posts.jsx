import React, { useEffect, useState, useRef, useCallback } from "react";
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
    <div className="w-full relative">
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 w-full bg-white border rounded-md shadow-md z-50 max-h-40 overflow-y-auto mb-1">
          {suggestions.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectMention(user.username)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={
                  user.profilePhoto
                    ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}`
                    : DEFAULT_PROFILE_IMAGE
                }
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 flex items-center">
                  {user.username}
                  {user.verified?.length > 0 && (
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.verified[user.verified.length - 1]?.badgeImage}`}
                      className="inline-block ml-1 w-4 h-4 object-contain"
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
      <div className="flex gap-2 items-center">
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
          className="text-blue-500 text-sm font-semibold hover:text-blue-700"
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
        false,
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
        false,
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
    <div className="col-span-12 lg:col-span-6 w-full my-4 flex flex-col mx-auto">
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
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.images[activeImageIndex]}`}
                      alt="post"
                      className="h-full w-full "
                    />

                    {/* Image Nav Arrows (show only if multiple images) */}
                    {activePost.images.length > 1 && (
                      <>
                        {activeImageIndex > 0 && (
                          <button
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100/70 p-2 rounded-full"
                            onClick={() =>
                              setActiveImageIndex((prev) => prev - 1)
                            }
                          >
                            <i className="ri-arrow-left-s-line text-xl"></i>
                          </button>
                        )}
                        {activeImageIndex < activePost.images.length - 1 && (
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100/70 p-2 rounded-full"
                            onClick={() =>
                              setActiveImageIndex((prev) => prev + 1)
                            }
                          >
                            <i className="ri-arrow-right-s-line text-xl"></i>
                          </button>
                        )}

                        {/* Image Dots */}
                        <div className="absolute bottom-3 flex gap-2 justify-center w-full">
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
                            ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user?.profilePhoto}`
                            : `${DEFAULT_PROFILE_IMAGE}`
                        }
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {activePost.user?.username}
                          {activePost.user.verified?.length > 0 && (
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user.verified[
                                activePost.user.verified.length - 1
                              ]?.badgeImage
                                }`}
                              className="inline-block ml-1 w-5 h-5 object-contain"
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
                      className="text-gray-600 hover:text-red-500 text-2xl font-bold"
                    >
                      X
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex flex-col gap-3 overflow-y-auto h-auto">
                  {activePost.comments?.length > 0 ? (
                    activePost.comments.map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <img
                          src={
                            activePost.user?.profilePhoto
                              ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost?.user?.profilePhoto}`
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
                    <p className="text-gray-500 text-sm">No comments yet</p>
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
                        className="ri-chat-3-line text-xl"
                      ></i>

                      <button onClick={() => setSharePost(activePost)}>
                        <i className="ri-send-plane-fill text-xl"></i>
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

                  <p className="text-sm font-medium ml-1">
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
                      <p className="text-gray-500 text-sm italic">
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
            <div className="w-full flex items-center justify-between p-3 border-b">
              <i
                className="ri-arrow-left-s-line text-2xl"
                onClick={() => setActiveIndex(null)}
              ></i>
              <span className="font-semibold text-xl text-center">
                Comments
              </span>
            </div>

            {/* caption with comments */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex gap-2 border-b p-3">
                <img
                  src={
                    activePost.user?.profilePhoto
                      ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user?.profilePhoto}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="profile"
                  className="w-11 h-11 rounded-full"
                />
                <div className="">
                  <span className="font-semibold text-[16px] block">
                    {activePost.user?.username}
                    {activePost.user.verified?.length > 0 && (
                      <img
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user.verified[
                          activePost.user.verified.length - 1
                        ]?.badgeImage
                          }`}
                        className="inline-block ml-1 w-6 h-6 object-contain"
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
                  <p className="whitespace-pre-wrap break-words break-all text-sm">
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
                              ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${comment?.user?.profilePhoto}`
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
                  <p className="text-gray-500 text-sm">No comments yet</p>
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
              <p className="text-gray-500 text-sm italic">
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pay a Tip</h2>
              <button
                onClick={() => setTipPopupOpen(false)}
                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="font-medium text-sm text-gray-700">
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
              <p className="text-xs text-gray-500 mt-1">Min ₹40 • Max ₹1,440</p>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            {/* Slider */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">
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
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
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
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">
              Tip Sent Successfully!
            </h3>
            <p className="text-gray-600 mt-1">
              You Tipped <span className="font-bold">₹{tipAmount}</span>
            </p>
            <button
              onClick={() => setTipSuccess(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportPopupOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center overflow-auto">
          <div className="bg-white rounded-xl shadow-lg p-3">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Report @{reportedUser?.username}
              </h2>
              <button
                onClick={() => setReportPopupOpen(false)}
                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <hr className="my-2 border-dark" />
            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setReportPopupOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
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
                className="h-12 w-12 text-green-500"
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
            <p className="text-gray-600 text-sm mt-1">
              We’ve received your report about @{reportedUser.username}.
            </p>
            <hr className="my-2 border-dark" />
            {/* Block Option */}
            <div className="">
              <p className="text-sm text-gray-700 mb-2">
                Do you also want to block{" "}
                <span className="font-semibold">@{reportedUser.username}</span>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setReportSuccess(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={handleBlockUser} // ✅ hook your block API
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
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
          <div className="bg-white w-80 rounded-xl p-4 shadow-lg relative">
            {/* Close */}
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSharePost(null)}
            >
              <i className="ri-close-line"></i>
            </button>

            <h3 className="text-lg font-semibold mb-3">Share Post</h3>

            {/* Copy Link */}
            <button
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg mb-2"
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
              <p className="text-green-600 text-sm mt-1 text-center">
                {copyMsg}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="w-full space-y-2">
        {finalPost?.map((post) => (
          <div key={post._id} className="w-full flex flex-col p-2 relative rounded-xl shadow-sm border">
            {/* Post Header */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img
                  src={
                    post.user?.profilePhoto
                      ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.user?.profilePhoto}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="profile"
                  className="h-11 w-11 rounded-full cursor-pointer"
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
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.user.verified[post.user.verified.length - 1]
                          ?.badgeImage
                          }`}
                        className="inline-block ml-1 w-5 h-5 object-contain"
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
                                className="text-blue-600 font-medium hover:underline outline-none focus:outline-none active:outline-none"
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
                                className="text-blue-600 font-medium hover:underline outline-none focus:outline-none active:outline-none"
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
                  <i className="ri-more-fill text-lg"></i>
                </button>
              </div>
            </div>

            {/* More Menu */}
            {menuOpenId === post._id && (
              <ul
                ref={popupRef}
                className="absolute bg-white flex flex-col text-xs rounded-xl items-center justify-between right-1 top-12 w-40 border shadow-md z-10 "
              >
                {/* Pay Tip */}
                {post.user._id !== userId && (
                  <div className="w-full flex flex-col items-center justify-center">
                    <li
                      className="w-full px-3 py-2 flex items-center font-semibold justify-center cursor-pointer hover:bg-gray-200 rounded-t-xl"
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
                  <div className="w-full flex flex-col items-center justify-center">
                    <li
                      className="w-full px-3 py-2 flex font-semibold items-center justify-center cursor-pointer hover:bg-gray-200"
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
                  <div className="w-full flex flex-col items-center justify-center">
                    <li
                      className="w-full px-3 py-2 flex font-semibold items-center justify-center cursor-pointer hover:bg-gray-200"
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
                  className="w-full px-3 py-2 flex font-semibold items-center justify-center cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSave(post?._id)}
                >
                  {post.isSaved ? "Unsave" : "Save"}
                </li>

                <hr className="w-[80%] border-t border-gray-400" />

                {/* About This Account */}
                <li
                  className="w-full px-3 py-2 flex font-semibold items-center justify-center cursor-pointer hover:bg-gray-200"
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
                  <div className="w-full flex flex-col items-center justify-center">
                    <li
                      className="w-full px-3 py-2 flex font-semibold items-center justify-center cursor-pointer hover:bg-red-200 text-red-600"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </li>
                    <hr className="w-[80%] border-t border-gray-400" />
                  </div>
                )}

                {/* Cancel */}
                <li
                  className="w-full px-3 py-2 flex font-semibold items-center justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-b-xl"
                  onClick={() => setMenuOpenId(null)}
                >
                  Cancel
                </li>
              </ul>
            )}

            {/* Post Image Carousel */}
            <div className="py-2 relative">
              {post.images && post.images.length > 0 && (
                <>
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.images[post.activeImageIndex || 0]
                      }`}
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
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 focus:outline-none"
                      >
                        <i className="ri-arrow-left-s-line text-xl bg-gray-600 rounded-full"></i>
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 focus:outline-none"
                      >
                        <i className="ri-arrow-right-s-line text-xl bg-gray-600 rounded-full"></i>
                      </button>
                    )}

                  {/* Dots */}
                  {post.images.length > 1 && (
                    <div className="absolute bottom-6 w-full flex justify-center gap-1 z-10">
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

                      <span className="break-all leading-tight">
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
                    <i className="ri-chat-3-line text-xl font-medium"></i>
                  </button>

                  <button onClick={() => setSharePost(post)} className="focus:outline-none text-[#000000]">
                    <i className="ri-send-plane-fill text-xl font-medium"></i>
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
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.user.verified[post.user.verified.length - 1]
                        ?.badgeImage
                        }`}
                      className="inline-block ml-1 w-5 h-5 object-contain"
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
                    <p className="text-gray-500 text-sm italic p-3">
                      Comments are restricted
                    </p>
                  )}
              </div>
            </div>
          ))}

          {/* Infinite Scroll Loading Indicator */}
          <div ref={loadMoreRef} className="w-full py-4 flex justify-center">
            {loadingMore && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-[#AD6449] rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Loading more posts...</p>
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <p className="text-sm text-gray-400 py-4">You've reached the end</p>
            )}
          </div>
        </div>
        
        {showCollaborators && allCollaboraters && (
        <div className="fixed inset-0 flex items-center justify-center  bg-[#000000]/40 backdrop-blur-sm z-50">
          <div
            ref={collabRef}
            className="relative bg-white rounded-xl shadow-xl p-3 w-80 animate-fadeIn"
          >
            {/* ❌ Close (cross) button */}
            <button
              onClick={() => setShowCollaborators(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-[#000000] text-xl"
            >
              <i className="ri-close-line text-[#000000]"></i>{" "}
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              Collaborators
            </h3>

            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {allCollaboraters?.length > 0 ? (
                allCollaboraters.map((c) => {
                  return (
                    <li
                      key={c._id}
                      className="p-2 border rounded-md flex items-center space-x-6"
                    >
                      <img
                        src={
                          c?.profilePhoto
                            ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${c.profilePhoto}`
                            : DEFAULT_PROFILE_IMAGE
                        }
                        alt={c.username || "user"}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <span className=" text-lg font-bold ">{c.username}</span>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500 text-center py-3">
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Delete Post?</h2>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
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
    <div className="animate-pulse rounded-xl shadow-sm border my-4 col-span-12 lg:col-span-6 p-2">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex-1">
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
          <div className="h-2 w-20 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>

      {/* Image / Content */}
      <div className="w-full h-80 bg-gray-300 rounded-xl mb-4"></div>

      {/* Footer */}
      <div className="flex items-center space-x-4">
        <div className="h-3 w-16 bg-gray-300 rounded"></div>
        <div className="h-3 w-12 bg-gray-300 rounded"></div>
        <div className="h-3 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};
