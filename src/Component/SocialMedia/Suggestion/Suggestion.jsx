import React, { useState, useEffect } from "react";
import getAPI from "../../../../src/api/getAPI";
import { toast } from "react-toastify";
import postAPI from "../../../../src/api/postAPI";
import "../Sidebar/Side-post-sugg.css";
import "../Create-post/Post.css";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import MediaSideSuggestionSkele from "../../Skeleton/Home/MedisSideSuggestionSkele";
const Suggestion = () => {
  const [users, setUsers] = useState([]);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  // const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 1024 : false
  );
  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize());
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3oql1QTjEkuSfZYyT2Rxsxb_CNSSjwUeyXg&s",
    "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?cs=srgb&dl=pexels-steve-1585325.jpg&fm=jpg",
    "https://i0.wp.com/montessorifromtheheart.com/wp-content/uploads/2023/03/Straw-Print-Flower-Painting-Craft.jpg?resize=1080%2C1350&ssl=1",
  ];
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();
  // helper: normalize array -> [ids]
  // const toIdArray = (arr) =>
  //   Array.isArray(arr)
  //     ? arr.map((x) => (typeof x === "string" ? x : x?._id)).filter(Boolean)
  //     : [];

  // helper: avoid needless setState loops
  // const sameIds = (a, b) => {
  //   if (a.length !== b.length) return false;
  //   const sa = [...a].sort().join(",");
  //   const sb = [...b].sort().join(",");
  //   return sa === sb;
  // };

  // useEffect(() => {
  //   if (!userId || !userType) return;

  //   let cancelled = false;
  //   (async () => {
  //     try {
  //       if (userType === "Seller") {
  //         const res = await getAPI(`/auth/getsellartwork/${userId}`);
  //         console.log("get seller artwork response:", res);
  //         const ids = toIdArray(res?.data?.artwork?.categoryOfArt);
  //         if (!cancelled) {
  //           setMainCategories((prev) => (sameIds(prev, ids) ? prev : ids));
  //         }
  //       } else if (userType === "Artist") {
  //         const res = await getAPI(`/auth/getartistdetails/${userId}`);
  //         console.log("get artist details response:", res);
  //         const ids = toIdArray(res?.data?.artCategories);
  //         if (!cancelled) {
  //           setMainCategories((prev) => (sameIds(prev, ids) ? prev : ids));
  //         }
  //       } else if (userType === "Buyer") {
  //         const res = await getAPI(`/auth/getpreferences/${userId}`);
  //         console.log("get buyer preferences response:", res);
  //         const first = res?.data?.data?.preferredArtCategories?.[0];

  //         const ids = first ? toIdArray([first]) : [];
  //         if (!cancelled) {
  //           setMainCategories((prev) => (sameIds(prev, ids) ? prev : ids));
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error loading categories:", err);
  //       toast.error("Failed to load categories");
  //     }
  //   })();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [userId, userType, mainCategories]);

  // optional: see the **updated** value
  // useEffect(() => {
  //   console.log("mainCategories (IDs):", mainCategories);
  // }, [mainCategories]);
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        if (!userId) return;

        const res = await getAPI(
          `/api/social-media/suggested-users?userId=${userId}`,
          {
            userId,
            userType,
            // mainCategories, // can be array, backend should handle it
          }
        );
        console.log("Fetch suggested users response:", res);
        // console.log("Suggested users fetched:", res?.data?.suggestedUsers);
        setUsers(res?.data?.suggestedUsers || []);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchSuggestedUsers();
  }, []);
  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
      let response;

      if (isFollowing) {
        response = await postAPI(
          `/api/social-media/unfollow/${targetUserId}`,
          { userId },
          true,
          true
        );
      } else {
        response = await postAPI(
          `/api/social-media/follow/${targetUserId}`,
          { userId },
          true,
          true
        );

      }
      // ❗ Only update UI if backend confirmed success
      if (response?.data?.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === targetUserId
              ? {
                ...user,
                profile: {
                  ...user.profile,
                  followers: isFollowing
                    ? user.profile.followers.filter((id) => id !== userId)
                    : [...user.profile.followers, userId],
                },
              }
              : user
          )
        );
      } else {
        console.warn("API did not respond with success, UI not updated.");
      }

    } catch (error) {
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
        let isFollowing = Array.isArray(user?.profile?.followers)
          ? user.profile.followers.map(String).includes(String(userId))
          : false;

        const displayUsername = isNarrow
          ? (user?.username ? user.username.slice(0, 5) : "")
          : user?.username;

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
                onClick={() => handleFollowToggle(user._id, isFollowing)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
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
        <div className="flex border-4 border-[#4C3427] bg-[#4C3427] mb-3 rounded-xl overflow-hidden h-40 w-full">
          {adImages.map((src, idx) => {
            const isActive = idx === activeAdIndex;
            return (
              <div
                key={idx}
                onClick={() => setActiveAdIndex(idx)}
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
                  alt={`ad-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <p className="w-full text-sm text-[#564138] p-1.5 rounded-xl border-2 border-[#4C3427] font-bold text-[#333]">
          The art drop you didn’t know you needed!!
        </p>
        {/* 
        <button className="text-xs mt-2 sm:text-sm w-full font-semibold text-white bg-[#6F4D34] px-3 sm:px-4 py-2 rounded hover:bg-[#cc3e0e] transition">
          Explore Now
        </button> */}
      </div>
    </div>
  );
};

export default Suggestion;
