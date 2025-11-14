import React, { useEffect, useState } from "react";
import "../Sidebar/Side-post-sugg.css";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import putAPI from "../../../api/putAPI";
import {timeAgo} from "./../../../utils/TimeAgo.js";

const Post = () => {
  const userId = localStorage.getItem("userId");
  const Navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(false);
  const [tipPopupOpen, setTipPopupOpen] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
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
  const activePost = activeIndex !== null ? posts[activeIndex] : null;
  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = "hidden"; // stop scrolling
    } else {
      document.body.style.overflow = "auto"; // re-enable scrolling
    }
    if (reportPopupOpen || tipPopupOpen) {
      document.body.style.overflow = "hidden"; // stop scrolling
    } else {
      document.body.style.overflow = "auto"; // re-enable scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [activePost, reportPopupOpen, tipPopupOpen]);

  const navigate = useNavigate(); // 👈 initialize navigate

  // 🔹 Navigate to profile
  const goToProfile = (profileUserId) => {
    navigate("/social-media/profile", {
      state: { userId: profileUserId }, // 👈 pass post.user._id
    });
  };
  // 🔹 Fetch homepage posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAPI(
          `/api/social-media/homepage?userId=${userId}`,
          true
        );
        setPosts(res.data.posts || []);
        console.log(res.data.posts);
        // console.log("Fetched posts:", res.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [userId]);

  // 🔹 Like / Unlike
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

  // 🔹 Save / Unsave
  const handleSave = async (postId) => {
    try {
      await postAPI(
        `/api/social-media/posts/${postId}/saveUnsave`,
        { userId },
        false,
        true
      );

      // update `isSaved` flag directly
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, isSaved: !p.isSaved } // 👈 toggle boolean
            : p
        )
      );
    } catch (err) {
      console.error("Error saving/unsaving:", err);
    }
  };

  // 🔹 Add Comment
  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await postAPI(
        `/api/social-media/posts/${postId}/comments`,
        { userId, text: commentText },
        false,
        true
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        )
      );
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  useEffect(() => {
    if (activePost) {
      setActiveImageIndex(0); // always start at first image
    }
  }, [activePost]);

  // ✅ Detect @ and fetch suggestions
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

  // ✅ Insert selected mention
  const handleSelectMention = (username) => {
    // Replace last @word with @username
    const newText = commentText.replace(/@\w*$/, `@${username} `);
    setCommentText(newText);
    setMentionSuggestions([]);
    setShowMentions(false);
  };
const handleFollowToggle = async (targetUserId, isFollowing) => {
  const userId = localStorage.getItem("userId");

  try {
    // 💥 Optimistic UI update first
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.user._id === targetUserId
          ? { ...post, showFollowButton: isFollowing } // hide follow if just followed
          : post
      )
    );

    // 🔹 Call API
    if (isFollowing) {
      await postAPI(`/api/social-media/unfollow/${targetUserId}`, { userId }, true, true);
    } else {
      await postAPI(`/api/social-media/follow/${targetUserId}`, { userId }, true, true);
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
    setTipAmount(value); // allow free typing
    setError(""); // reset error while typing
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
const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedReason === "Other" && description.trim() === "") {
    setError("Please describe the issue for 'Other'");
    return;
  }

  try {
    const reporterId = localStorage.getItem("userId");

    // 🧩 Construct payload for post report
    const payload = {
      reporterId,
      reportedUserId: reportedUser.id,  // 👈 user who owns the post
      postId: reportedUser.postId,      // 👈 post being reported
      reason: selectedReason,
      description,
      reportType: "post",               // 👈 explicitly set type
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

      // ✅ Close success modal
      setReportSuccess(false);

      // ✅ Redirect user if blocked
      if (res.data.isBlocked) {
        Navigate("/social-media/");
      }
    }
  } catch (err) {
    console.error("Error blocking/unblocking user:", err);
  }
};

  // const [reportPopupOpen, setReportPopupOpen] = useState(false);
  // const [reportSuccess, setReportSuccess] = useState(false);

  return (
    <div className=" lg:w-[56%] w-full flex flex-col mx-auto">
      {/* Active Post Popup */}
      {activePost && (
        <div>
          {/* for big screen */}
          <div className="hidden lg:flex fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
            {/* Close Button */}
            <button
              className="absolute lg:top-20 top-10 lg:right-40 right-10 text-4xl font-bold z-50"
              onClick={() => setActiveIndex(null)}
            >
              <i className="ri-close-line text-black"></i>
            </button>

            {/* Popup Layout */}
            <div className="lg:bg-white w-[73%] lg:h-[72vh] h-[56vh] rounded-lg overflow-hidden flex relative lg:flex-row flex-col">
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
                              className={`w-2 h-2 rounded-full ${
                                idx === activeImageIndex
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
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user?.profilePhoto}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {activePost.user?.username}
                          {activePost.user.verified?.length > 0 && (
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                                activePost.user.verified[
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
                    <button>
                      <i className="ri-more-fill text-2xl text-black"></i>
                    </button>
                  </div>
                  {/* profile with caption */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-1">
                      <img
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user?.profilePhoto}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-semibold text-sm">
                        {activePost.user?.username}
                        {activePost.user.verified?.length > 0 && (
                          <img
                            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                              activePost.user.verified[
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
                    </div>
                    {/* Caption */}
                    <p className="text-sm">
                      {activePost.caption || "No caption"}
                    </p>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex flex-col gap-3 overflow-y-auto h-auto">
                  {activePost.comments?.length > 0 ? (
                    activePost.comments.map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <img
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${comment?.user?.profilePhoto}`}
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
                          className={`${
                            activePost.likes.includes(userId)
                              ? "ri-heart-fill text-red-500"
                              : "ri-heart-line"
                          } text-xl`}
                        ></i>
                      </button>
                      <i className="ri-chat-3-line text-xl"></i>
                      <i className="ri-send-plane-fill text-xl"></i>
                    </div>
                    <div>
                      <button onClick={() => handleSave(activePost._id)}>
                        <i
                          className={`${
                            activePost.isSaved
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
                  {/* Suggestions dropdown */}
                  {activePost &&
                    showMentions &&
                    mentionSuggestions.length > 0 && (
                      <div className="relative bottom-10 left-0 hidden lg:flex flex-col w-full bg-white border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                        {mentionSuggestions.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => handleSelectMention(user.username)}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}`}
                              alt={user.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {user.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  {/* Add Comment */}
                  {/* Add Comment */}
                  {activePost.canComment ? (
                    <div className="flex gap-2 relative">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={handleChange} // 👈 replace with custom handler
                        className="flex-grow outline-none text-sm"
                      />
                      <button
                        className="text-blue-500 text-sm"
                        onClick={() => handleComment(activePost._id)}
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
                onClick={() => setActiveIndex(null)}
              ></i>
              <span className="font-semibold text-xl text-center">
                Comments
              </span>
              <div></div>
            </div>

            {/* caption with comments */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex gap-2 border-b p-3">
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.user?.profilePhoto}`}
                  alt="profile"
                  className="w-11 h-11 rounded-full"
                />
                <div className="">
                  <span className="font-semibold text-[16px] block">
                    {activePost.user?.username}
                    {activePost.user.verified?.length > 0 && (
                      <img
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                          activePost.user.verified[
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
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${comment?.user?.profilePhoto}`}
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
            {/* Suggestions dropdown */}
            {activePost && showMentions && mentionSuggestions.length > 0 && (
              <div className="absolute bottom-10 left-0 w-full bg-white border rounded-md shadow-md z-50 max-h-[80] overflow-y-auto">
                {mentionSuggestions.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectMention(user.username)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {user.username}
                    </span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            {activePost.canComment ? (
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
                  onClick={() => handleComment(activePost._id)}
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
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
                  error ? "border-red-500" : "border-gray-300"
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
              You tipped <span className="font-bold">₹{tipAmount}</span>
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
            <form onSubmit={handleSubmit} className="space-y-3">
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
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none text-sm ${
                      error
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
              <div className="flex justify-end gap-3 mt-4">
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
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    selectedReason
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

      {/* Block Option */}
      <div className="mt-4 border-t pt-4">
        <p className="text-sm text-gray-700 mb-2">
          Do you also want to block{" "}
          <span className="font-semibold">@{reportedUser.username}</span>?
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


      <div className="w-full ">
        {posts.map((post) => (
          <div key={post._id} className="w-full flex flex-col mb-4 relative">
            {/* Post Header */}
            <div className="flex justify-between items-center">
  <div className="flex gap-2 p-2 items-center">
    <img
      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.user.profilePhoto}`}
      alt="profile"
      className="h-11 w-11 rounded-full cursor-pointer"
      onClick={() => goToProfile(post.user._id)}
    />

    <div>
      <div className="flex items-center">
        <h3
          className="font-extrabold cursor-pointer"
          onClick={() => goToProfile(post.user._id)}
        >
          {post.user.username}
        </h3>

        {post.user.verified?.length > 0 && (
          <img
            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
              post.user.verified[post.user.verified.length - 1]?.badgeImage
            }`}
            className="inline-block ml-1 w-5 h-5 object-contain"
            alt={
              post.user.verified[post.user.verified.length - 1]?.badgeName ||
              "badge"
            }
          />
        )}
      </div>

      {/* Time + Sponsored */}
      <div className="flex items-center gap-1 text-xs font-light text-gray-500">
        <p>• {timeAgo(post.createdAt)}</p>
        {post.isPromoted && (
          <span className="text-[11px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            Sponsored
          </span>
        )}
      </div>
    </div>


  </div>
   

  {/* CTA + Buttons */}
  <div className="flex items-center gap-3 mr-1">
    {post.isPromoted && (
      <>
        {post.promotionDetails?.goal === "Visit your website" &&
        post.user.website ? (
          <button
            onClick={() => window.open(post.user.website, "_blank")}
            className="buy-button"
          >
            Visit Website
          </button>
        ) : post.promotionDetails?.goal === "Visit your profile" ? (
          <button
            onClick={() => goToProfile(post.user._id)}
            className="buy-button"
          >
            Visit Profile
          </button>
        ) : null}
      </>
    )}
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

    <button className="buy-button">
      Buy <i className="cart-icon ri-shopping-cart-fill"></i>
    </button>
    <button onClick={() => setMenuOpenId(post._id)}>
      <i className="ri-more-fill text-lg"></i>
    </button>
  </div>
</div>


            {/* More Menu */}
            {menuOpenId === post._id && (
              <ul className="absolute flex flex-col rounded-xl items-center justify-between right-1 top-12 mt-2 w-40 bg-gray-200 border shadow-lg z-10 ">
                {/* Pay Tip */}
             { post.user._id !== userId && (
             <div className="w-full flex flex-col items-center justify-center">
                 <li
                  className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400 rounded-t-xl"
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
                <hr className="w-[75%] border-t border-gray-800" />
             </div>
             )}

                {/* Report */}
                {post.user._id !== userId && (
                  <div className="w-full flex flex-col items-center justify-center">
                    <li
                      className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400"
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

                    <hr className="w-[75%] border-t border-gray-800" />
                  </div>
                )}
{/* Follow / Unfollow */}
{post.user._id !== userId && (
  <div className="w-full flex flex-col items-center justify-center">
    <li
      className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400"
      // pass !post.showFollowButton so the function will set showFollowButton to the new value
      onClick={() => handleFollowToggle(post.user._id, !post.showFollowButton)}
    >
      {post.showFollowButton ? "follow" : "unfollow"}
    </li>
    <hr className="w-[75%] border-t border-gray-800" />
  </div>
)}



                {/* Save / Unsave */}
                <li
                  className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400"
                  onClick={() => handleSave(post?._id)}
                >
                  {post.isSaved ? "Unsave" : "Save"}
                </li>
                <hr className="w-[75%] border-t border-gray-800" />

                {/* Copy Link */}
                <li className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400">
                  Copy Link
                </li>
                <hr className="w-[75%] border-t border-gray-800" />

                {/* About This Account */}
                <li
                  className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400"
                  onClick={() =>
                    navigate("/social-media/profile", {
                      state: { userId: post.user._id },
                    })
                  }
                >
                  About This Account
                </li>
                <hr className="w-[75%] border-t border-gray-800" />

                {/* Cancel */}
                <li
                  className="w-full px-3 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-400 text-red-500 rounded-b-xl"
                  onClick={() => setMenuOpenId(null)}
                >
                  Cancel
                </li>
              </ul>
            )}

            {/* Post Image Carousel */}
            <div className="mx-1 relative">
              {post.images && post.images.length > 0 && (
                <>
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                      post.images[post.activeImageIndex || 0]
                    }`}
                    alt="Post content"
                    className="w-full lg:h-[600px] sm:h-[480px] h-[300px] rounded-lg "
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
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2"
                      >
                        <i className="ri-arrow-left-s-line text-xl"></i>
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2"
                      >
                        <i className="ri-arrow-right-s-line text-xl"></i>
                      </button>
                    )}

                  {/* Dots */}
                  {post.images.length > 1 && (
                    <div className="absolute bottom-2 w-full flex justify-center gap-1">
                      {post.images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 w-2 rounded-full ${
                            (post.activeImageIndex || 0) === idx
                              ? "bg-gray-100"
                              : "bg-gray-400"
                          }`}
                        ></span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex flex-col gap-1.5 mx-1">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-4">
                  <button onClick={() => handleLike(post._id)}>
                    <i
                      className={`${
                        post.likes.includes(userId)
                          ? "ri-heart-fill text-red-500"
                          : "ri-heart-line"
                      } text-xl font-medium`}
                    ></i>
                  </button>
                  <button>
                    <i className="ri-chat-3-line text-xl font-medium"></i>
                  </button>
                  <button>
                    <i className="ri-send-plane-fill text-xl font-medium"></i>
                  </button>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleSave(post?._id)}>
                    <i
                      className={`${
                        post?.isSaved ? "ri-bookmark-fill" : "ri-bookmark-line"
                      } text-xl font-medium`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Likes */}
              <div className="text-[13px] font-bold">
                {post.likes.length} likes
              </div>

              {/* Description */}
              <div>
                <p className="text-[12px] mt-0.5 font-semibold break-all whitespace-normal w-full">
                  {post.user.username}{" "}
                  {post.user.verified?.length > 0 && (
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                        post.user.verified[post.user.verified.length - 1]
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
                  . {post.caption}
                </p>
              </div>

              {/* Comments */}
              <div
                className="text-[13px] font-light cursor-pointer"
                onClick={() => setActiveIndex(posts.indexOf(post))}
              >
                View all {post.comments.length} comments
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
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}`}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {user.username}
                        {user.verified?.length > 0 && (
                          <img
                            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                              user.verified[user.verified.length - 1]
                                ?.badgeImage
                            }`}
                            className="inline-block ml-1 w-6 h-6 object-contain"
                            alt={
                              user.verified[user.verified.length - 1]
                                ?.badgeName || "badge"
                            }
                            title={
                              user.verified[user.verified.length - 1]?.badgeName
                            }
                          />
                        )}
                      </span>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                  ))}
                </div>
              )}
              {post.canComment ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={handleChange}
                    className="w-full rounded text-[13px] focus:outline-none focus:ring focus:border-blue-300"
                  />
                  <button
                    onClick={() => handleComment(post._id, commentText)}
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

            <hr className="h-0.5 bg-gray-300 border-none mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
