import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";
import { timeAgo } from "../../../utils/TimeAgo";
import postAPI from "../../../api/postAPI";
import putAPI from "../../../api/putAPI";
import Sidebar from "../Sidebar/Sidebar";
import Suggestion from "../Suggestion/Suggestion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Zap } from "lucide-react";

import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
const SharePost = () => {
  const [sharePostData, setSharePostData] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [tipUser, setTipUser] = useState(null);
  const [tipPopupOpen, setTipPopupOpen] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);
  const [reportPopupOpen, setReportPopupOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tipAmount, setTipAmount] = useState(40);
  const [error, setError] = useState("");
  const [tipSuccess, setTipSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [allCollaboraters, setAllCollaboraters] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  //
  const { postId } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 1024; // Tailwind lg breakpoint

  const postRef = useRef();
  const commentRef = useRef();
  const activePostRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (!isMobile) {
        if (postRef.current && !postRef.current.contains(event.target)) {
          setActiveIndex(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeIndex, showCollaborators]);

  useEffect(() => {
    const fetchSinglePostData = async () => {
      try {
        const response = await getAPI(
          `/api/social-media/singlePost?postId=${postId}`,
          {},
          true,
          true
        );
        setSharePostData(response.data.post);
      } catch (error) {
        console.error("Error fetching share post data:", error);
        toast.error(error.response.data.message || "Error fetching post data");
      } finally {
        setLoading(false)
      }
    };
    fetchSinglePostData();
  }, [postId]);
  const handleLike = async (postId) => {
    try {
      await postAPI(
        `/api/social-media/posts/${postId}/likeUnlike`,
        { userId },
        false,
        true
      );
      setSharePostData((prev) => ({
        ...prev,
        likes: prev.likes.includes(userId)
          ? prev.likes.filter((id) => id !== userId)
          : [...prev.likes, userId],
      }));
    } catch (err) {
      console.error("Error liking/unliking:", err);
    }
  };
  const handleFollowToggle = async (targetUserId, isFollowing) => {
    const userId = localStorage.getItem("userId");

    try {
      if (isFollowing) {
        const res = await postAPI(
          `/api/social-media/unfollow/${targetUserId}`,
          { userId },
          true,
          true
        );
        setSharePostData((prev) => ({
          ...prev,
          showFollowButton: !prev.showFollowButton,
        }));
      } else {
        const res = await postAPI(
          `/api/social-media/follow/${targetUserId}`,
          { userId },
          true,
          true
        );
        setSharePostData((prev) => ({
          ...prev,
          showFollowButton: !prev.showFollowButton,
        }));
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);

      setSharePostData((prev) => ({
        ...prev,
        showFollowButton: isFollowing,
      }));
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

      // update `isSaved` flag directly
      setSharePostData((prev) => ({ ...prev, isSaved: !prev.isSaved })); // 👈 toggle boolean
    } catch (err) {
      console.error("Error saving/unsaving:", err);
    }
  };

  //  Detect @ and fetch suggestions
  const handleChange = async (e) => {
    const value = e.target.value;
    setCommentText(value);

    // Check if text contains '@' + word
    const match = value.match(/@(\w*)$/); // last word starting with @
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
          setMentionSuggestions(res.data.users || []);
          setShowMentions(true);
        } catch (err) {
          console.error("Error fetching mentions:", err);
        }
      } else {
        setMentionSuggestions([]);
        setShowMentions(false);
      }
    } else {
      setMentionSuggestions([]);
      setShowMentions(false);
    }
  };

  //  Add Comment
  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await postAPI(
        `/api/social-media/posts/${postId}/comments`,
        { userId, text: commentText },
        false,
        true
      );
      setSharePostData((prev) => ({
        ...prev,
        comments: [...prev.comments, res.data.comment],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
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
  //  Navigate to profile
  const goToProfile = (profileUserId) => {
    navigate(
      `/artsays-community/profile/${
        sharePostData?.user?.username
          ? `${sharePostData?.user?.username}`
          : `${sharePostData?.user?.name}_${sharePostData?.user?.lastName}_${profileUserId}`
      }`,
      { state: { userId: profileUserId } }
    );
  };
  const goProfile = (user) => {
    navigate(
      `/artsays-community/profile/${
        user?.username
          ? `${user?.username}`
          : `${user?.name}_${user?.lastName}_${user?._id}`
      }`,
      { state: { userId: user?._id } }
    );
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
        reportedUserId: reportedUser.id, // 👈 user who owns the post
        postId: reportedUser.postId, // 👈 post being reported
        reason: selectedReason,
        description,
        reportType: "post", // 👈 explicitly set type
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

  const handleSliderChange = (e) => {
    setTipAmount(Number(e.target.value));
    setError("");
  };

  // ✅ Insert selected mention
  const handleSelectMention = (username) => {
    // Replace last @word with @username
    const newText = commentText.replace(/@\w*$/, `@${username} `);
    setCommentText(newText);
    setMentionSuggestions([]);
    setShowMentions(false);
  };
  const handleConfirm = async () => {
    const value = Number(tipAmount);
    if (value < 40 || value > 1440) {
      setError("Tip must be between ₹40 and ₹1440");
      return;
    }

    try {
      const senderId = localStorage.getItem("userId"); // 👈 from localStorage

      const res = await postAPI("/api/tips/create", {
        sender: senderId,
        receiver: tipUser.receiverId, // from state
        post: tipUser.id, // from state
        amount: value,
      });

      if (res.data.success) {
        setTipSuccess(true);
        setTipPopupOpen(false);

        // reset
        setTipAmount(40);

        // ✅ Auto-hide after 2.5s if you want
        setTimeout(() => setTipSuccess(false), 2500);
      } else {
        setError(res.data.message || "Failed to send tip");
      }
    } catch (err) {
      console.error("Error sending tip:", err);
      setError("Something went wrong. Try again.");
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

        // ✅ Close success modal
        setReportSuccess(false);

        // ✅ Redirect user if blocked
        if (res.data.isBlocked) {
          navigate("/artsays-community/");
        }
      }
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

  //  find post's collaboration with userId
  const isPostCollaborateWithUserId = (post) => {
    return post?.collaborators?.some(
      (user) => user._id === userId && post.user._id !== userId
    );
  };
  const fetchAllCollaborators = (post) => {
    const collaboraters = post.collaborators || [];
    setAllCollaboraters(collaboraters);
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

 const ensureBuyer = () => {
    if (sharePostData?.user?.userType !== "Buyer") {
      toast.warn(
        "Only buyers can use this feature, Register as a Buyer to continue."
      );
      return false;
    }
    return true;
  };

  if (loading) return <LoadingSkeleton />;
  return (
    <>
      {sharePostData && (
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
          {/* <meta name="title" content={blogDetails.blogTitle} /> */}
          <title>{sharePostData.user?.username}</title>
          <meta name="description" content={sharePostData.caption} />
          <meta name="keywords" content={sharePostData.hashtags.join(", ")} />
          <meta
            name="author"
            content={`${sharePostData.user?.name} ${sharePostData.user?.lastName}`}
          />

          <meta property="og:type" content="post" />
          <meta property="og:title" content={sharePostData.user?.username} />
          <meta property="og:description" content={sharePostData.caption} />
          <meta property="og:url" content={window.location.href} />
          <meta
            property="og:image"
            content={
              sharePostData.images.length > 0
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.images[0]}`
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />

          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content={sharePostData.user?.username} />
          <meta name="twitter:description" content={sharePostData.caption} />
          <meta
            name="twitter:image"
            content={
              sharePostData.images.length > 0
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.images[0]}`
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />
        </Helmet>
      )}

      {sharePostData && (
        <>
          <div className="flex flex-col">
            <main className="gap-2 grid grid-cols-12 mx-auto">
              <Sidebar className="col-span-3" />
              <div className="col-span-12 lg:col-span-6 w-full flex flex-col mx-auto">
                {/* Active Post Popup */}
                {activeIndex && (
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
                          {sharePostData.images?.length > 0 ? (
                            <div className="w-full h-full relative flex items-center justify-center">
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.images[activeImageIndex]}`}
                                alt="post"
                                className="h-full w-full "
                              />

                              {/* Image Nav Arrows (show only if multiple images) */}
                              {sharePostData.images.length > 1 && (
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
                                  {activeImageIndex <
                                    sharePostData.images.length - 1 && (
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
                                    {sharePostData.images.map((_, idx) => (
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
                              <div
                                className="flex items-center gap-2"
                                onClick={() =>
                                  goToProfile(sharePostData.user._id)
                                }
                              >
                                <img
                                  src={
                                    sharePostData.user?.profilePhoto
                                      ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.user?.profilePhoto}`
                                      : `${DEFAULT_PROFILE_IMAGE}`
                                  }
                                  alt="profile"
                                  className="w-10 h-10 rounded-full"
                                />
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">
                                    {sharePostData.user?.username}
                                    {sharePostData.user.verified?.length >
                                      0 && (
                                        <img
                                          src={`${process.env
                                              .REACT_APP_API_URL_FOR_IMAGE
                                            }${sharePostData.user.verified[
                                              sharePostData.user.verified.length -
                                              1
                                            ]?.badgeImage
                                            }`}
                                          className="inline-block ml-1 w-5 h-5 object-contain"
                                          alt={
                                            sharePostData.user.verified[
                                              sharePostData.user.verified.length -
                                              1
                                            ]?.badgeName || "badge"
                                          }
                                          title={
                                            sharePostData.user.verified[
                                              sharePostData.user.verified.length -
                                              1
                                            ]?.badgeName
                                          }
                                        />
                                      )}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {sharePostData.location || ""}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => setActiveIndex(false)}
                                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
                              >
                                X
                              </button>
                            </div>
                          </div>

                          {/* Comments */}
                          <div className="flex flex-col gap-3 overflow-y-auto h-auto">
                            {sharePostData.comments?.length > 0 ? (
                              sharePostData.comments.map((comment, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
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
                                    <span
                                      className="text-sm font-semibold"
                                      onClick={() => goProfile(comment?.user)}
                                    >
                                      {comment?.user?.username}
                                      {comment?.user.verified?.length > 0 && (
                                        <img
                                          src={`${
                                            process.env
                                              .REACT_APP_API_URL_FOR_IMAGE
                                          }${
                                            comment?.user.verified[
                                              comment?.user.verified.length - 1
                                            ]?.badgeImage
                                          }`}
                                          className="inline-block ml-1 w-6 h-6 object-contain"
                                          alt={
                                            comment?.user.verified[
                                              comment?.user.verified.length - 1
                                            ]?.badgeName || "badge"
                                          }
                                          title={
                                            comment?.user.verified[
                                              comment?.user.verified.length - 1
                                            ]?.badgeName
                                          }
                                        />
                                      )}
                                    </span>
                                    <p className="text-xs">{comment?.text}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No comments yet
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {/* Actions */}
                            <div className="flex items-center justify-between ">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleLike(sharePostData._id)}
                                >
                                  <i
                                    className={`${sharePostData.likes.includes(userId)
                                        ? "ri-heart-fill text-red-500"
                                        : "ri-heart-line"
                                      } text-xl`}
                                  ></i>
                                </button>
                                <i
                                  onClick={() => {
                                    activePostRef.current &&
                                      activePostRef.current.focus();
                                  }}
                                  className="ri-chat-3-line text-xl"
                                ></i>
                                {/* <i className="ri-send-plane-fill text-xl"></i> */}
                              </div>
                              <div>
                                <button
                                  onClick={() => handleSave(sharePostData._id)}
                                >
                                  <i
                                    className={`${sharePostData.isSaved
                                        ? "ri-bookmark-fill"
                                        : "ri-bookmark-line"
                                      } text-xl`}
                                  ></i>
                                </button>
                              </div>
                            </div>

                            <p className="text-sm font-medium ml-1">
                              {sharePostData.likes.length} likes
                            </p>
                            {/* Suggestions dropdown */}
                            {sharePostData &&
                              showMentions &&
                              mentionSuggestions.length > 0 && (
                                <div className="relative bottom-10 left-0 hidden lg:flex flex-col w-full bg-white border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                                  {mentionSuggestions.map((user) => (
                                    <div
                                      key={user._id}
                                      onClick={() =>
                                        handleSelectMention(user.username)
                                      }
                                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                      <img
                                        src={
                                          user?.profilePhoto
                                            ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}`
                                            : `${DEFAULT_PROFILE_IMAGE}`
                                        }
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full"
                                      />
                                      <span className="text-sm font-medium text-gray-800">
                                        {user?.username}
                                        {user?.verified?.length > 0 && (
                                          <img
                                            src={`${
                                              process.env
                                                .REACT_APP_API_URL_FOR_IMAGE
                                            }${
                                              user.verified[
                                                user.verified.length - 1
                                              ]?.badgeImage
                                            }`}
                                            className="inline-block ml-1 w-6 h-6 object-contain"
                                            alt={
                                              user.verified[
                                                user.verified.length - 1
                                              ]?.badgeName || "badge"
                                            }
                                            title={
                                              user.verified[
                                                user.verified.length - 1
                                              ]?.badgeName
                                            }
                                          />
                                        )}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {user.role}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            {/* Add Comment */}
                            {sharePostData.canComment ? (
                              <div className="flex gap-2 relative">
                                <input
                                  type="text"
                                  ref={activePostRef}
                                  placeholder="Add a comment..."
                                  value={commentText}
                                  onChange={handleChange} // 👈 replace with custom handler
                                  className="flex-grow outline-none text-sm"
                                />
                                <button
                                  className="text-blue-500 text-sm"
                                  onClick={() =>
                                    handleComment(sharePostData._id)
                                  }
                                >
                                  Post
                                </button>
                              </div>
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
                          onClick={() => setActiveIndex(false)}
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
                              sharePostData.user?.profilePhoto
                                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.user?.profilePhoto}`
                                : `${DEFAULT_PROFILE_IMAGE}`
                            }
                            alt="profile"
                            className="w-11 h-11 rounded-full"
                          />
                          <div className="">
                            <span
                              className="font-semibold text-[16px] block"
                              onClick={() =>
                                goToProfile(sharePostData.user._id)
                              }
                            >
                              {sharePostData.user?.username}
                              {sharePostData.user.verified?.length > 0 && (
                                <img
                                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                    }${sharePostData.user.verified[
                                      sharePostData.user.verified.length - 1
                                    ]?.badgeImage
                                    }`}
                                  className="inline-block ml-1 w-6 h-6 object-contain"
                                  alt={
                                    sharePostData.user.verified[
                                      sharePostData.user.verified.length - 1
                                    ]?.badgeName || "badge"
                                  }
                                  title={
                                    sharePostData.user.verified[
                                      sharePostData.user.verified.length - 1
                                    ]?.badgeName
                                  }
                                />
                              )}
                            </span>
                            <p className="whitespace-pre-wrap break-words break-all text-sm">
                              {sharePostData.caption}
                            </p>
                          </div>
                        </div>

                        {/* Comments */}
                        <div className="flex flex-col gap-3 p-3">
                          {sharePostData.comments?.length > 0 ? (
                            sharePostData.comments
                              .slice()
                              .reverse()
                              .map((comment, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
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
                                    <span
                                      className="text-[15px] font-semibold block"
                                      onClick={() => goProfile(comment.user)}
                                    >
                                      {comment?.user?.username}
                                      {comment?.user?.verified?.length > 0 && (
                                        <img
                                          src={`${
                                            process.env
                                              .REACT_APP_API_URL_FOR_IMAGE
                                          }${
                                            comment?.user?.verified[
                                              comment?.user?.verified.length - 1
                                            ]?.badgeImage
                                          }`}
                                          className="inline-block ml-1 w-5 h-5 object-contain"
                                          alt={
                                            comment?.user?.verified[
                                              comment?.user?.verified.length - 1
                                            ]?.badgeName || "badge"
                                          }
                                          title={
                                            comment?.user?.verified[
                                              comment?.user?.verified.length - 1
                                            ]?.badgeName
                                          }
                                        />
                                      )}
                                    </span>
                                    <p className="text-xs break-words">
                                      {comment?.text}
                                    </p>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No comments yet
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Suggestions dropdown */}
                      {sharePostData &&
                        showMentions &&
                        mentionSuggestions.length > 0 && (
                          <div className="absolute bottom-10 left-0 w-full bg-white border rounded-md shadow-md z-50 max-h-[80] overflow-y-auto">
                            {mentionSuggestions.map((user) => (
                              <div
                                key={user._id}
                                onClick={() =>
                                  handleSelectMention(user.username)
                                }
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                              >
                                <img
                                  src={
                                    user?.profilePhoto
                                      ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}`
                                      : `${DEFAULT_PROFILE_IMAGE}`
                                  }
                                  alt={user.username}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm font-medium text-gray-800">
                                  {user.username}
                                  {user.verified?.length > 0 && (
                                    <img
                                      src={`${
                                        process.env.REACT_APP_API_URL_FOR_IMAGE
                                      }${
                                        user.verified[user.verified.length - 1]
                                          ?.badgeImage
                                      }`}
                                      className="inline-block ml-1 w-5 h-5 object-contain"
                                      alt={
                                        user.verified[user.verified.length - 1]
                                          ?.badgeName || "badge"
                                      }
                                      title={
                                        user.verified[user.verified.length - 1]
                                          ?.badgeName
                                      }
                                    />
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {user.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Add Comment */}
                      {sharePostData.canComment ? (
                        <div className="flex gap-2 p-2 border-t">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={handleChange}
                            className="flex-grow outline-none text-sm"
                          />
                          <button
                            className="text-blue-500 text-[15px]"
                            onClick={() => handleComment(sharePostData._id)}
                          >
                            Post
                          </button>
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
                        <h2 className="text-xl font-semibold text-gray-800">
                          Pay a Tip
                        </h2>
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
                        <p className="text-xs text-gray-500 mt-1">
                          Min ₹40 • Max ₹1,440
                        </p>
                        {error && (
                          <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                      </div>

                      {/* Slider */}
                      <div className="mb-6">
                        <p className="text-sm font-medium mb-2">
                          Tip amount:{" "}
                          <span className="font-semibold">₹{tipAmount}</span>
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
                        You tipped{" "}
                        <span className="font-bold">₹{tipAmount}</span>
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
                  <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
                    <div className="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-5">
                      {/* Header */}
                      <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Report @{reportedUser?.username}
                          {reportedUser?.verified?.length > 0 && (
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                                reportedUser?.verified[
                                  reportedUser?.verified.length - 1
                                ]?.badgeImage
                              }`}
                              className="inline-block ml-1 w-5 h-5 object-contain"
                              alt={
                                reportedUser?.verified[
                                  reportedUser?.verified.length - 1
                                ]?.badgeName || "badge"
                              }
                              title={
                                reportedUser?.verified[
                                  reportedUser?.verified.length - 1
                                ]?.badgeName
                              }
                            />
                          )}
                        </h2>
                        <button
                          onClick={() => setReportPopupOpen(false)}
                          className="text-gray-600 hover:text-red-500 text-2xl font-bold"
                        >
                          ×
                        </button>
                      </div>

                      {/* Subtitle */}
                      <p className="text-sm text-gray-600 mb-4">
                        Why are you reporting this post?
                      </p>

                      {/* Report Form */}
                      <form onSubmit={handleSubmit} className="space-y-3  ">
                        <div className="space-y-2 max-h-[20vh] overflow-y-auto ">
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
                              <span className="text-sm text-gray-800">
                                {reason}
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Description */}
                        {selectedReason && (
                          <div className="mt-1">
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
                              <p className="text-xs text-red-500 mt-1">
                                {error}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-1">
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
                        We’ve received your report about @
                        {reportedUser.username}.
                      </p>

                      {/* Block Option */}
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm text-gray-700 mb-2">
                          Do you also want to block{" "}
                          <span className="font-semibold">
                            @{reportedUser?.username}
                            {reportedUser?.verified?.length > 0 && (
                              <img
                                src={`${
                                  process.env.REACT_APP_API_URL_FOR_IMAGE
                                }${
                                  reportedUser?.verified[
                                    reportedUser?.verified.length - 1
                                  ]?.badgeImage
                                }`}
                                className="inline-block ml-1 w-5 h-5 object-contain"
                                alt={
                                  reportedUser?.verified[
                                    reportedUser?.verified.length - 1
                                  ]?.badgeName || "badge"
                                }
                                title={
                                  reportedUser?.verified[
                                    reportedUser?.verified.length - 1
                                  ]?.badgeName
                                }
                              />
                            )}
                          </span>
                          ?
                        </p>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={handleBlockUser} // ✅ hook your block API
                            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            Block
                          </button>
                          <button
                            onClick={() => setReportSuccess(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            Close
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
                          // navigator.clipboard.writeText(link);
                          // setCopyMsg("Link copied!");
                          // setTimeout(() => setCopyMsg(""), 2000);

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
                <div className="w-full my-4">
                  <div className="w-full flex flex-col p-2 rounded-xl shadow-sm border relative">
                    {/* Post Header */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <img
                          src={
                            sharePostData?.user?.profilePhoto
                              ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData?.user?.profilePhoto}`
                              : `${DEFAULT_PROFILE_IMAGE}`
                          }
                          alt="profile"
                          className="h-11 w-11 rounded-full cursor-pointer"
                          onClick={() => goToProfile(sharePostData.user._id)}
                        />

                        <div>
                          <div className="flex items-center">
                            <h3
                              className="font-extrabold text-[#000000] cursor-pointer"
                              onClick={() =>
                                goToProfile(sharePostData.user._id)
                              }
                            >
                              {sharePostData.user.username}
                            </h3>

                            {sharePostData.user.verified?.length > 0 && (
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                  }${sharePostData.user.verified[
                                    sharePostData.user.verified.length - 1
                                  ]?.badgeImage
                                  }`}
                                className="inline-block ml-1 w-5 h-5 object-contain"
                                alt={
                                  sharePostData.user.verified[
                                    sharePostData.user.verified.length - 1
                                  ]?.badgeName || "badge"
                                }
                              />
                            )}
                            <div className="flex items-center">
                              {isPostCollaborateWithUserId(sharePostData) ? (
                                <p className="font-extrabold cursor-pointer">
                                  , {profile?.username}
                                  {sharePostData.collaboraters?.length > 1 && (
                                    <>
                                      and &nbsp;
                                      <button
                                        onClick={() => {
                                          setShowCollaborators(true);
                                          fetchAllCollaborators(sharePostData);
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
                                  {sharePostData.collaborators?.length > 0 && (
                                    <p className="font-extrabold cursor-pointer">
                                      &nbsp; and &nbsp;
                                      <button
                                        onClick={() => {
                                          setShowCollaborators(true);
                                          fetchAllCollaborators(sharePostData);
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
                            <p> {timeAgo(sharePostData.createdAt)}</p>
                            {sharePostData.isPromoted && (
                              <span className="font-semibold text-black">
                                Sponsored
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CTA + Buttons */}
                      <div className="flex items-center gap-2">
                        {sharePostData.isPromoted && (
                          <>
                            {sharePostData.promotionDetails?.goal ===
                              "Visit your website" &&
                              sharePostData.user.website ? (
                              <button
                                onClick={() =>
                                  window.open(
                                    sharePostData.user.website,
                                    "_blank"
                                  )
                                }
                                className="buy-button"
                              >
                                Visit Website
                              </button>
                            ) : sharePostData.promotionDetails?.goal ===
                              "Visit your profile" ? (
                              <button
                                onClick={() =>
                                  goToProfile(sharePostData.user._id)
                                }
                                className="buy-button"
                              >
                                Visit Profile
                              </button>
                            ) : null}
                          </>
                        )}
                        {sharePostData.showFollowButton ? (
                          <button
                            onClick={() =>
                              handleFollowToggle(sharePostData.user._id, false)
                            }
                            className="buy-button"
                          >
                            Follow
                          </button>
                        ) : (
                          ""
                        )}

                        {sharePostData.forProduct && (
                          <button
                            className="flex px-2 items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now"
                            onClick={() => {
                              if (!ensureBuyer()) return;
                              navigate(
                                `/my-account/check-out/${userId}?productId=${
                                  sharePostData?.forProduct
                                }&quantity=${1}`
                              );
                            }}
                          >
                            <Zap size={18} /> Buy Now
                          </button>
                        )}
                        <button
                          onClick={() => setMenuOpenId(sharePostData._id)}
                        >
                          <i className="ri-more-fill text-lg"></i>
                        </button>
                      </div>
                    </div>

                    {/* More Menu */}
                    {menuOpenId && (
                      <ul className="absolute bg-white flex flex-col text-xs rounded-xl items-center justify-between right-1 top-12 w-40 border shadow-md z-10">
                        {/* Pay Tip */}
                        {sharePostData.user._id !== userId && (
                          <div className="w-full flex flex-col items-center justify-center rounded-t-xl">
                            <li
                              className="w-full px-3 py-2 font-semibold text-[#000000] flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-t-xl"
                              onClick={() => {
                                setTipUser({
                                  id: sharePostData._id,
                                  receiverId: sharePostData.user._id,
                                });
                                setTipPopupOpen(true);
                                setMenuOpenId(null);
                              }}
                            >
                              Pay Tip
                            </li>
                            <hr className="w-[75%] border-t border-gray-800" />
                          </div>
                        )}

                        {/* Report */}
                        {sharePostData.user._id !== userId && (
                          <div className="w-full flex flex-col items-center justify-center">
                            <li
                              className="w-full px-3 py-2 font-semibold text-[#000000] flex items-center justify-center cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                setReportedUser({
                                  id: sharePostData.user._id,
                                  postId: sharePostData._id,
                                  username: sharePostData.user.username,
                                });
                                setReportPopupOpen(true);
                                setMenuOpenId(null);
                              }}
                            >
                              Report
                            </li>

                            <hr className="w-[75%] border-t border-gray-800" />
                          </div>
                        )}
                        {/* Follow / Unfollow */}
                        {sharePostData.user._id !== userId && (
                          <div className="w-full flex flex-col items-center justify-center">
                            <li
                              className="w-full px-3 py-2 font-semibold text-[#000000] flex items-center justify-center cursor-pointer hover:bg-gray-200"
                              // pass !post.showFollowButton so the function will set showFollowButton to the new value
                              onClick={() =>
                                handleFollowToggle(
                                  sharePostData.user._id,
                                  sharePostData.showFollowButton
                                )
                              }
                            >
                              {sharePostData.showFollowButton
                                ? "follow"
                                : "unfollow"}
                            </li>
                            <hr className="w-[75%] border-t border-gray-800" />
                          </div>
                        )}

                        {/* Save / Unsave */}
                        <li
                          className="w-full px-3 py-2 font-semibold text-[#000000] flex items-center justify-center cursor-pointer rounded-t-xl hover:bg-gray-200"
                          onClick={() => handleSave(sharePostData?._id)}
                        >
                          {sharePostData.isSaved ? "Unsave" : "Save"}
                        </li>
                        <hr className="w-[75%] border-t border-gray-800" />

                        <li
                          className="w-full px-3 py-2 font-semibold text-[#000000] flex items-center justify-center cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            navigate(
                              `/artsays-community/profile/${sharePostData?.user?.username
                                ? `${sharePostData?.user?.username}`
                                : `${sharePostData?.user?.name}_${sharePostData?.user?.lastName}_${sharePostData?.user?._id}`
                              }`, { state: { userId: sharePostData?.user?._id } }
                            )
                          }
                        >
                          About This Account
                        </li>
                        <hr className="w-[75%] border-t border-gray-800" />

                        {/* Cancel */}
                        <li
                          className="w-full px-3 py-2 font-semibold text-[#000000] flex items-center justify-center cursor-pointer hover:bg-red-200 text-red-600 rounded-b-xl"
                          onClick={() => setMenuOpenId(null)}
                        >
                          Cancel
                        </li>
                      </ul>
                    )}

                    {/* Post Image Carousel */}
                    <div className="py-2 relative">
                      {sharePostData.images &&
                        sharePostData.images.length > 0 && (
                          <>
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.images[
                                sharePostData.activeImageIndex || 0
                                ]
                                }`}
                              alt="Post content"
                              className="w-full h-full rounded-lg"
                            />

                            {/* Left Arrow (only if not on first image) */}
                            {sharePostData.images.length > 1 &&
                              (sharePostData.activeImageIndex || 0) > 0 && (
                                <button
                                  onClick={() =>
                                    setSharePostData((prev) => ({
                                      ...prev,
                                      activeImageIndex:
                                        (prev.activeImageIndex || 0) - 1,
                                    }))
                                  }
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2"
                                >
                                  <i className="ri-arrow-left-s-line text-xl"></i>
                                </button>
                              )}

                            {/* Right Arrow (only if not on last image) */}
                            {sharePostData.images.length > 1 &&
                              (sharePostData.activeImageIndex || 0) <
                              sharePostData.images.length - 1 && (
                                <button
                                  onClick={() =>
                                    setSharePostData((prev) => ({
                                      ...prev,
                                      activeImageIndex:
                                        (prev.activeImageIndex || 0) + 1,
                                    }))
                                  }
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2"
                                >
                                  <i className="ri-arrow-right-s-line text-xl"></i>
                                </button>
                              )}

                            {/* Dots */}
                            {sharePostData.images.length > 1 && (
                              <div className="absolute bottom-6 w-full flex justify-center gap-1 z-10">
                                {sharePostData.images.map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={`h-2 w-2 rounded-full ${(sharePostData.activeImageIndex || 0) ===
                                        idx
                                        ? "bg-gray-100"
                                        : "bg-gray-400"
                                      }`}
                                  ></span>
                                ))}
                              </div>
                            )}
                            {/* Website Link Box */}
                            {sharePostData.isPromoted &&
                              sharePostData.promotionDetails?.website && (
                                <a
                                  href={sharePostData.promotionDetails.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute bottom-4 w-[80%] text-white text-md px-3 py-2 justify-self-center rounded-md flex flex-col shadow-lg bg-[#48372D]/70 hover:bg-[#48372D]"
                                >
                                  <span className="font-semibold leading-tight">
                                    Explore Our Website
                                  </span>

                                  <span className="text-[13px] break-all leading-tight">
                                    {sharePostData.promotionDetails.website}
                                  </span>
                                </a>
                              )}
                          </>
                        )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex flex-col gap-1.5 mx-1">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-4">
                          <button onClick={() => handleLike(sharePostData._id)} className="focus:outline-none">
                            <i
                              className={`${sharePostData.likes.includes(userId)
                                  ? "ri-heart-fill text-red-500"
                                  : "ri-heart-line"
                                } text-xl font-medium`}
                            ></i>
                          </button>
                          <button className="focus:outline-none">
                            <i
                              onClick={() => {
                                if (commentRef.current) {
                                  commentRef.current.focus();
                                }
                              }}
                              className="ri-chat-3-line text-xl font-medium"
                            ></i>
                          </button>

                          <button onClick={() => setSharePost(sharePostData)} className="focus:outline-none">
                            <i className="ri-send-plane-fill text-xl font-medium"></i>
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleSave(sharePostData?._id)} className="focus:outline-none"
                          >
                            <i
                              className={`${sharePostData?.isSaved
                                  ? "ri-bookmark-fill"
                                  : "ri-bookmark-line"
                                } text-xl font-medium`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Likes */}
                      <div className="text-[13px] font-bold">
                        {sharePostData.likes.length} likes
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-sm mt-1 text-[#000000] font-semibold break-all whitespace-normal w-full">
                          {sharePostData.user.username}{" "}
                          {sharePostData.user.verified?.length > 0 && (
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.user.verified[
                                  sharePostData.user.verified.length - 1
                                ]?.badgeImage
                                }`}
                              className="inline-block ml-1 w-5 h-5 object-contain"
                              alt={
                                sharePostData.user.verified[
                                  sharePostData.user.verified.length - 1
                                ]?.badgeName || "badge"
                              }
                              title={
                                sharePostData.user.verified[
                                  sharePostData.user.verified.length - 1
                                ]?.badgeName
                              }
                            />
                          )}{" "}
                          . {sharePostData.caption}
                        </p>
                      </div>

                      {/* Comments */}
                      <div
                        className="text-xs text-[#000000] font-light cursor-pointer"
                        onClick={() => setActiveIndex(true)}
                      >
                        View all {sharePostData.comments.length} Comments
                      </div>

                      {/* Add Comment */}
                      {/* Comment Input */}
                      {/* Suggestions dropdown */}
                      {showMentions && mentionSuggestions.length > 0 && (
                        <div className=" absolute bottom-10 left-0 w-full lg:bg-white bg-[#FAF9F6] border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                          {mentionSuggestions.map((user) => (
                            <div
                              key={user._id}
                              onClick={() => handleSelectMention(user.username)}
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <img
                                src={
                                  user?.profilePhoto
                                    ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}`
                                    : `${DEFAULT_PROFILE_IMAGE}`
                                }
                                alt={user.username}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-sm font-medium text-gray-800">
                                {user.username}
                                {user.verified?.length > 0 && (
                                  <img
                                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                      }${user.verified[user.verified.length - 1]
                                        ?.badgeImage
                                      }`}
                                    className="inline-block ml-1 w-6 h-6 object-contain"
                                    alt={
                                      user.verified[user.verified.length - 1]
                                        ?.badgeName || "badge"
                                    }
                                    title={
                                      user.verified[user.verified.length - 1]
                                        ?.badgeName
                                    }
                                  />
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {sharePostData.canComment ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            ref={commentRef}
                            onChange={handleChange}
                            className="w-full rounded text-sm focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              handleComment(sharePostData._id, commentText)
                            }
                            className="text-blue-500 text-sm"
                          >
                            Post
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic p-3">
                          Comments are restricted
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {showCollaborators && allCollaboraters && (
                <div
                  onClick={() => setShowCollaborators(false)}
                  className="fixed inset-0 flex items-center justify-center  bg-[#000000]/40 backdrop-blur-sm z-[10000]"
                >
                  <div
                    className="relative bg-white rounded-xl shadow-xl p-5 w-80 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* ❌ Close (cross) button */}
                    <button
                      onClick={() => setShowCollaborators(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                    >
                      <i className="ri-close-line text-black"></i>{" "}
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
                              onClick={() => goProfile(c)}
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

                              <span className=" text-lg font-bold ">
                                {c.username}
                                {c.verified?.length > 0 && (
                                  <img
                                    src={`${
                                      process.env.REACT_APP_API_URL_FOR_IMAGE
                                    }${
                                      c.verified[c.verified.length - 1]
                                        ?.badgeImage
                                    }`}
                                    className="inline-block ml-1 w-5 h-5 object-contain"
                                    alt={
                                      c.verified[c.verified.length - 1]
                                        ?.badgeName || "badge"
                                    }
                                    title={
                                      c.verified[c.verified.length - 1]
                                        ?.badgeName
                                    }
                                  />
                                )}
                              </span>
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
              <Suggestion />
            </main>
          </div>
        </>
      )}
    </>
  );
};
export default SharePost;

// loading skeleton
const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-12 gap-2 px-2">
      <div className="col-span-3 w-full hidden lg:flex mx-auto animate-pulse rounded-xl my-4 shadow-sm border">
        {/* Icon column */}
        <div className="flex flex-col items-center gap-4 p-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-lg bg-gray-300"
            />
          ))}
        </div>

        {/* Expanded labels */}
        <div className="flex flex-col items-center gap-4 py-3 pr-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-36 h-10 rounded-lg bg-gray-300"
            />
          ))}
        </div>
      </div>
      <div className="animate-pulse w-full p-4 rounded-xl shadow-sm border justify-self-center my-4 col-span-12 lg:col-span-6">
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
      <div className="sticky top-0 overflow-y-auto lg:h-full hidden lg:block col-span-3 my-4 animate-pulse">
        {/* Title */}
        <div className="h-5 w-40 bg-gray-300 rounded mb-4 ml-1" />

        {/* Suggested Users */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between items-center mb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-300 rounded-full" />
              <div className="space-y-1">
                <div className="h-3 w-24 bg-gray-300 rounded" />
                <div className="h-2 w-16 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="h-7 w-16 bg-gray-300 rounded-lg" />
          </div>
        ))}

        <div className="h-px bg-gray-300 my-3" />

        {/* Ad Section */}
        <div className="space-y-3">
          <div className="h-40 w-full bg-gray-300 rounded-xl" />
          <div className="h-10 w-full bg-gray-300 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
