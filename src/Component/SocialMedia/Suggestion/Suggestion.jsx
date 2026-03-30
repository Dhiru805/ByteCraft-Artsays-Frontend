import React, { useState, useEffect, useRef, useCallback } from "react";
import getAPI from "../../../../src/api/getAPI";
import postAPI from "../../../../src/api/postAPI";
import { toast } from "react-toastify";
import "../Sidebar/Side-post-sugg.css";
import "../Create-post/Post.css";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import MediaSideSuggestionSkele from "../../Skeleton/Home/MedisSideSuggestionSkele";
import { getImageUrl } from '../../../utils/getImageUrl';

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
        const res = await getAPI(`/api/campaigns/ads/placement?placement=communitySidebar`, {}, true, false);
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
    ? sidebarAds.map(ad => getImageUrl(ad.mainImage))
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
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleFollowToggle = async (targetUserId, currentStatus) => {
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
        setUsers(prev =>
          prev.map(user =>
            user._id === targetUserId
              ? { ...user, followStatus: currentStatus === "Follow" ? "Unfollow" : "Follow" }
              : user
          )
        );
      } else {
        setUsers(prev =>
          prev.map(user =>
            user._id === targetUserId ? { ...user, followStatus: currentStatus } : user
          )
        );
        toast.error("Action failed. Try again.");
      }
    } catch (error) {
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
  };

  if (loading) return <MediaSideSuggestionSkele />;

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
                src={user?.profilePhoto
                  ? getImageUrl(user?.profilePhoto)
                  : DEFAULT_PROFILE_IMAGE
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
            </div>
          </div>
        );
      })}

        <hr className="h-0.5 bg-gray-700 text-gray-400 border-none mt-2" />

          {/* Sponsored Ad Card - Store Style */}
          <SidebarAdCard
            sidebarAds={sidebarAds}
            displayAdImages={displayAdImages}
            activeAdIndex={activeAdIndex}
            setActiveAdIndex={setActiveAdIndex}
            navigate={navigate}
          />
      </div>
  );
};

/* ─── Sidebar Ad Card (Store-style product card with auto-slide) ─── */
const SidebarAdCard = ({ sidebarAds, displayAdImages, activeAdIndex, setActiveAdIndex, navigate }) => {
  const timerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [slideDir, setSlideDir] = useState("right");
  const totalAds = displayAdImages.length;

  useEffect(() => {
    if (totalAds <= 1 || isHovered) return;
    timerRef.current = setInterval(() => {
      setSlideDir("right");
      setActiveAdIndex(prev => (prev + 1) % totalAds);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [totalAds, isHovered, setActiveAdIndex]);

  const goTo = useCallback((idx) => {
    setSlideDir(idx > activeAdIndex ? "right" : "left");
    setActiveAdIndex(idx);
  }, [activeAdIndex, setActiveAdIndex]);

  const goPrev = useCallback((e) => {
    e.stopPropagation();
    setSlideDir("left");
    setActiveAdIndex(prev => (prev - 1 + totalAds) % totalAds);
  }, [totalAds, setActiveAdIndex]);

  const goNext = useCallback((e) => {
    e.stopPropagation();
    setSlideDir("right");
    setActiveAdIndex(prev => (prev + 1) % totalAds);
  }, [totalAds, setActiveAdIndex]);

  const ad = sidebarAds[activeAdIndex];
  const hasRealAd = sidebarAds.length > 0 && ad;
  const displayPrice = hasRealAd ? (ad.finalPrice || ad.price) : null;
  const marketPrice = hasRealAd ? ad.marketPrice : null;
  const hasDiscount = displayPrice && marketPrice && displayPrice < marketPrice;
  const discountPercent = hasDiscount ? Math.round(((marketPrice - displayPrice) / marketPrice) * 100) : 0;

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!hasRealAd) return;
    handleAdClick(ad);
  };

  const handleCardClick = () => {
    if (!hasRealAd) return;
    handleAdClick(ad);
  };

  const handleAdClick = async (adItem) => {
    const slug = adItem.productName?.toLowerCase().replace(/\s+/g, "-") || "product";
    try {
      await postAPI("/api/campaigns/ads/click", {
        campaignId: adItem.campaignId,
        productId: adItem._id,
        placement: adItem.placement || "communitySidebar",
      }, {}, false);
    } catch (err) {
      console.error("Ad click tracking error:", err);
    }
    navigate(`/product-details/${slug}/${adItem._id}`);
  };

  return (
    <div className="mt-4 w-full">
      <div
        className="group flex flex-col bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-gray-100/50 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
          {/* Sliding images */}
          <div className="relative w-full h-full">
            <img
              key={activeAdIndex}
              src={displayAdImages[activeAdIndex]}
              alt={ad?.productName || "Sponsored"}
              className="absolute inset-0 w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
              style={{
                animation: totalAds > 1 ? `slideIn${slideDir === "right" ? "Right" : "Left"} 0.4s ease-out` : "none",
              }}
              draggable={false}
            />
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-red-50 text-[#E74C3C] px-2 py-1 rounded-full border border-red-100/50 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-tight">{discountPercent}% OFF</span>
              </div>
            </div>
          )}

          {/* Prev / Next Arrows */}
          {totalAds > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
              >
                <i className="ri-arrow-left-s-line text-sm text-gray-700"></i>
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
              >
                <i className="ri-arrow-right-s-line text-sm text-gray-700"></i>
              </button>
            </>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

          {/* Content */}
          <div className="flex flex-col p-3 gap-2">
            {/* Artist / Seller */}
            <div className="flex items-center gap-2">
              <img
                src={ad?.userId?.profilePhoto ? getImageUrl(ad.userId.profilePhoto) : DEFAULT_PROFILE_IMAGE}
                alt={ad?.userId?.name || "Seller"}
                className="w-6 h-6 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
              <span className="text-sm font-semibold text-gray-900 truncate">
                {hasRealAd ? `${ad.userId?.name || ""}${ad.userId?.lastName ? ` ${ad.userId.lastName}` : ""}` : "Sponsored"}
              </span>
              <span className="text-[8px] font-bold tracking-wide uppercase text-white bg-[#6F4D34] px-1.5 py-0.5 rounded flex-shrink-0">Ad</span>
            </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight leading-tight">
            {hasRealAd ? ad.productName : "Discover amazing art"}
          </h3>

          {/* Price Row */}
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through font-bold">
                ₹{(marketPrice || 0).toLocaleString()}
              </span>
            )}
            {displayPrice && (
              <span className="text-xl font-black text-gray-900 tracking-tighter">
                ₹{(displayPrice || 0).toLocaleString()}
              </span>
            )}
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="w-full h-[40px] bg-[#6F4D34] text-white rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm hover:bg-[#5a3e2a] active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-bag-3-line text-sm"></i>
            Buy Now
          </button>

          {/* Dot indicators */}
          {totalAds > 1 && (
            <div className="flex justify-center gap-1.5 pt-1">
              {displayAdImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeAdIndex
                      ? "w-5 h-1.5 bg-[#6F4D34]"
                      : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide animation keyframes */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0.3; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0.3; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Suggestion;
