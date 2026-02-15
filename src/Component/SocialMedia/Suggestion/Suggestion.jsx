import React, { useState, useEffect } from "react";
import getAPI from "../../../../src/api/getAPI";
import { toast } from "react-toastify";
import postAPI from "../../../../src/api/postAPI";
import "../Sidebar/Side-post-sugg.css";
import "../Create-post/Post.css";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import MediaSideSuggestionSkele from "../../Skeleton/Home/MedisSideSuggestionSkele";

const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
const Suggestion = () => {
  const [users, setUsers] = useState([]);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [sidebarAds, setSidebarAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 1024 : false
  );
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3oql1QTjEkuSfZYyT2Rxsxb_CNSSjwUeyXg&s",
    "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?cs=srgb&dl=pexels-steve-1585325.jpg&fm=jpg",
    "https://i0.wp.com/montessorifromtheheart.com/wp-content/uploads/2023/03/Straw-Print-Flower-Painting-Craft.jpg?resize=1080%2C1350&ssl=1",
  ];

  // Fetch sidebar ads from campaigns
  useEffect(() => {
    const fetchSidebarAds = async () => {
      try {
        const res = await getAPI(`/api/campaigns/ads?placement=communitySidebar&limit=3`);
        if (res?.data?.data?.length > 0) {
          setSidebarAds(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching sidebar ads:", err);
      }
    };
    fetchSidebarAds();
  }, []);

  // Use campaign images if available, otherwise fallback
  const displayAdImages = sidebarAds.length > 0
    ? sidebarAds.map(ad => `${imageBaseURL}${ad.mainImage}`)
    : adImages;

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        if (!userId) return;

        const res = await getAPI(
          `/api/social-media/suggested-users?userId=${userId}`,
          {
            userId,
            userType,
          }
        );
        const suggestedUsers = (res?.data?.suggestedUsers || []).map(user => {
          const isFollowing = Array.isArray(user?.profile?.followers)
            ? user.profile.followers.some(f => {
                const fId = typeof f === "object" && f !== null ? f._id : f;
                return String(fId) === String(userId);
              })
            : false;
          return { ...user, followStatus: isFollowing ? "Unfollow" : "Follow" };
        });
        setUsers(suggestedUsers);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchSuggestedUsers();
  }, []);
  const handleFollowToggle = async (targetUserId, currentStatus) => {
  // Immediately set intermediate state to "Following"
  setUsers(prev =>
    prev.map(user =>
      user._id === targetUserId ? { ...user, followStatus: "Following" } : user
    )
  );

  try {
    let response;
    if (currentStatus === "Follow") {
      response = await postAPI(
        `/api/social-media/follow/${targetUserId}`,
        { userId },
        true,
        true
      );
    } else {
      response = await postAPI(
        `/api/social-media/unfollow/${targetUserId}`,
        { userId },
        true,
        true
      );
    }

    if (response?.data?.status === 200) {
      // Success → final state
      setUsers(prev =>
        prev.map(user =>
          user._id === targetUserId
            ? { ...user, followStatus: currentStatus === "Follow" ? "Unfollow" : "Follow" }
            : user
        )
      );
    } else {
      // Failure → revert to original
      setUsers(prev =>
        prev.map(user =>
          user._id === targetUserId ? { ...user, followStatus: currentStatus } : user
        )
      );
      toast.error("Action failed. Try again.");
    }
  } catch (error) {
    // Error → revert
    setUsers(prev =>
      prev.map(user =>
        user._id === targetUserId ? { ...user, followStatus: currentStatus } : user
      )
    );
    console.error("Error following/unfollowing user:", error);
  }
};



  const navigateToProfile = (user) => {
    navigate(
      `/artsays-community/profile/${user?.username
        ? `${user?.username}`
        : `${user?.name}_${user?.lastName}_${user?._id}`
      }`, { state: { userId: user?._id } }
    );
  }
  if (loading) return <MediaSideSuggestionSkele />
  return (
    <div className="suggestion sticky top-0 h-screen hidden lg:block col-span-3 px-2 py-2">
      <h3 className="text-lg font-bold my-2 ml-1">Discover Creators</h3>

      {users.map((user, index) => {
          const followStatus = user.followStatus || "Follow";
          const isFollowing = followStatus === "Unfollow" || followStatus === "Following";

          const fullName = `${user?.name || ''} ${user?.lastName || ''}`.trim();
          const displayName = user?.username || fullName || 'User';
          const displayUsername = isNarrow
            ? displayName.slice(0, 5)
            : displayName;

        return (
          <div
            key={index} onClick={() => navigateToProfile(user)}
            className="suggested grid grid-cols-7 flex flex-col sm:flex-row p-1 items-start sm:items-center justify-between mb-2 gap-1 border-[#6E4E37]"
          >
            {/* Avatar + Name */}
            <div className="col-span-5 flex items-center gap-2">
              <img
                src={user?.profilePhoto ?
                  `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}` : `${DEFAULT_PROFILE_IMAGE}`
                }
                alt="avatar"
                className="rounded-full w-9 h-9 object-cover"
              />
              <div className="flex flex-col max-w-[80px] lg:max-w-fit">
                <p className="text-xs font-semibold text-gray-800 truncate lg:truncate-none">
                  {displayUsername}
                </p>
                <p className="text-[8px] text-gray-600">
                  Suggested for you
                </p>
              </div>

            </div>

            {/* Buttons */}
              <div className="col-span-2 flex flex-row gap-1 items-center sm:ml-auto">
                <button
                  className={`${isFollowing
                      ? "bg-gray-200 text-black"
                      : "bg-[#6F4D34] text-white"
                    } text-xs px-2 py-1 rounded-lg border border-gray-300 font-semibold transition-colors duration-300 whitespace-nowrap`}
                  onClick={(e) => { e.stopPropagation(); handleFollowToggle(user._id, followStatus); }}
                >
                  {followStatus === "Following" ? "Following" : isFollowing ? "Unfollow" : "Follow"}
                </button>
              {/* <button
                className="text-[#6E4E37] text-sm font-bold leading-none"
                onClick={() =>
                  setUsers((prev) => prev.filter((u) => u._id !== user._id))
                }
              >
                <i className="ri-close-line"></i>
              </button> */}
            </div>
          </div>
        );
      })}

      <hr className="h-0.5 bg-gray-700 text-gray-400 border-none mt-2" />

      {/* Ad Section */}
      <div className="mt-3 w-full flex flex-col">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1 ml-1">Sponsored</p>
        <div className="flex border-4 border-[#4C3427] bg-[#4C3427] mb-3 rounded-xl overflow-hidden h-40 w-full">
          {displayAdImages.map((src, idx) => {
            const isActive = idx === activeAdIndex;
            const adProduct = sidebarAds[idx];
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveAdIndex(idx);
                  if (adProduct) navigate(`/product-details/${adProduct.productName?.toLowerCase().replace(/\s+/g, '-')}/${adProduct._id}`);
                }}
                className={`cursor-pointer transition-all duration-300 ease-in overflow-hidden ${idx === 0 ? "border-l-0" : "border-l-4 border-l-[#2C211B]"
                  }`}
                style={{
                  flexGrow: isActive ? 5 : 1,
                  flexBasis: isActive ? "65%" : "15%",
                  transitionProperty: "flex-grow, flex-basis",
                }}
              >
                <img
                  src={src}
                  alt={adProduct?.productName || `ad-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <p className="w-full text-sm text-[#564138] p-1.5 rounded-xl border-2 border-[#4C3427] font-bold text-[#333]">
          {sidebarAds.length > 0 && sidebarAds[activeAdIndex]
            ? sidebarAds[activeAdIndex].productName
            : "The art drop you didn't know you needed!!"}
        </p>
      </div>
    </div>
  );
};

export default Suggestion;
