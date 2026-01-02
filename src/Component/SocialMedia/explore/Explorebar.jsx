import React, { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import putAPI from "../../../api/putAPI";
import { Link } from "react-router-dom";

const Explorebar = () => {
  const userId = localStorage.getItem("userId");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sharePost, setSharePost] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [reportedUser, setReportedUser] = useState(null);
  const [reportPopupOpen, setReportPopupOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const Navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const res = await getAPI(
          `/api/social-media/explore?userId=${userId}`,
          true
        );
        setPosts(res.data.posts || []);
        console.log("Fetched posts:", res.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        prev.map((p) => (p._id === postId ? { ...p, isSaved: !p.isSaved } : p))
      );
    } catch (err) {
      console.error("Error saving/unsaving:", err);
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
        // ✅ Close success modal
        setReportSuccess(false);

        // ✅ Redirect user if blocked
        if (res.data.isBlocked) {
          Navigate("/artsays-community/");
        }
      }
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

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

  console.log("postssssssssssssssssssss", posts);
  if (loading) {
    return ExploreSkeleton();
  }
  return (
    <div className="lg:w-[56%] w-full max-w-6xl mx-auto flex flex-col lg:mt-6 lg:px-4 pt-2">
      {/* Masonry Grid */}
      <div className="columns-2 sm:columns-3 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
        {posts.map((art) => (
          <div
            key={art._id}
            className="relative break-inside-avoid rounded-xl overflow-hidden shadow"
          >
            <Link to={`/artsays-community/single-post/${art._id}`}>
              {/* Post Image */}
              <img
                src={
                  art.images && art.images.length > 0
                    ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${art.images[0]}`
                    : "https://via.placeholder.com/300"
                }
                alt="Art"
                className="w-full object-cover rounded-t-xl"
              />
            </Link>
            {/* Overlay Header */}
            <div className="absolute top-0 left-0 w-full bg-[#000000BF] bg-opacity-50 text-white flex justify-between items-center px-2 py-2.5 text-xs">
              <span className="font-medium sm:text-lg text-[15px]">
                {art.user.username}
                {art.user.verified?.length > 0 && (
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                      art.user.verified[art.user.verified.length - 1]
                        ?.badgeImage
                    }`}
                    className="inline-block ml-1 w-5 h-5 object-contain"
                    alt={
                      art.user.verified[art.user.verified.length - 1]
                        ?.badgeName || "badge"
                    }
                    title={
                      art.user.verified[art.user.verified.length - 1]?.badgeName
                    }
                  />
                )}
              </span>
              <div className="flex gap-2 items-center text-lg">
                {/* <i className="ri-shopping-cart-2-fill text-[#FB5934]"></i> */}
                <i
                  className="ri-more-fill cursor-pointer"
                  onClick={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setMenuPos({ x: rect.left, y: rect.bottom });
                    setActiveMenuId((prev) =>
                      prev === art._id ? null : art._id
                    );
                  }}
                ></i>
              </div>
            </div>

            {/* Dropdown Menu */}
            {activeMenuId === art._id && (
              <Portal>
                <div
                  ref={menuRef}
                  style={{
                    transform: `translate(${menuPos.x}px, ${menuPos.y}px)`,
                  }}
                  // className="absolute top-2 right-1 flex flex-col items-center z-10 lg:bg-white bg-gray-100 text-black text-sm rounded-xl shadow-lg w-32"
                  className="fixed top-0 left-0 flex flex-col items-center 
      bg-white text-black text-sm rounded-xl shadow-lg w-32 z-[99999]"
                >
                  <button
                    disabled={userId === art.user?._id}
                    onClick={() => {
                      setReportedUser({
                        id: art.user._id,
                        postId: art._id,
                        username: art.user.username,
                      });
                      setReportPopupOpen(true);
                      setActiveMenuId(null);
                    }}
                    className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400 rounded-t-lg"
                  >
                    Report
                  </button>
                  <hr className="w-full border-t border-gray-800" />
                  <button
                    className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400"
                    onClick={() => handleSave(art._id)}
                  >
                    <span>{art.isSaved ? "Unsave" : "Save"}</span>
                  </button>
                  <hr className="w-full border-t border-gray-800" />
                  {/* <button className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400">
                    Go to post
                  </button>
                  <hr className="w-full border-t border-gray-800" /> */}
                  <button
                    className="bg-gray-100 w-full px-4 py-2 hover:bg-gray-400 rounded-b-lg"
                    onClick={() => setSharePost(art._id)}
                  >
                    Share
                  </button>
                </div>
              </Portal>
            )}
          </div>
        ))}
      </div>
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
                const link = `${window.location.origin}/artsays-community/sharepost/${sharePost}`;
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
      {reportPopupOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Report @{reportedUser?.username}{" "}
                {reportedUser.verified?.length > 0 && (
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                      reportedUser.verified[
                        reportedUser.verified.length - 1
                      ]?.badgeImage
                    }`}
                    className="inline-block ml-1 w-5 h-5 object-contain"
                    alt={
                      reportedUser.verified[
                        reportedUser.verified.length - 1
                      ]?.badgeName || "badge"
                    }
                    title={
                       reportedUser.verified[
                        reportedUser.verified.length - 1
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
            <p className="text-sm text-gray-600 mb-2">
              Why are you reporting this post?
            </p>

            {/* Report Form */}
            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="space-y-1">
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
                <div
                  className="mt-1"
                  style={{ maxHeight: "10vh", overflowY: "auto" }}
                >
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
                    className={`w-full  border h-7 rounded-lg focus:ring-2 focus:outline-none text-sm ${
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
              <div className="flex justify-end gap-3 ">
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
    </div>
  );
};

export default Explorebar;
const Portal = ({ children }) => {
  return createPortal(children, document.body);
};
const ExploreSkeleton = () => {
  return (
    <div className="w-full min-h-screen p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-full h-44 bg-gray-300 rounded-xl relative overflow-hidden"
        >
          {/* Top left username bar */}
          <div className="absolute top-2 left-2 h-4 w-24 bg-gray-400 rounded"></div>

          {/* Three dots right side */}
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
