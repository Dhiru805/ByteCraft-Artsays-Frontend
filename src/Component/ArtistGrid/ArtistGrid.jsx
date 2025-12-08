import "./artist-card.css";
import React, { useEffect, useMemo, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../ArtistGrid/constant";
import { toast } from "react-toastify";

const ArtistCard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [artists, setArtists] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
  const userId = localStorage.getItem("userId");



  const normalizeIds = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((f) =>
            typeof f === "object" ? f?._id || f?.id || f?.user || f : f
          )
          .filter(Boolean)
          .map(String)
      : [];

// useEffect(() => {
//   let cancelled = false;

//   const loadData = async () => {
//     if (!userId) {
//       await loadPublicArtists();
//       return;
//     }

//     try {
//       const [
//         artistsRes, categoriesRes, badgeRes, suggestedRes, myProfileRes
//       ] = await Promise.all([
//         getAPI("/artist/artists", {}, true, false),
//         getAPI("/api/main-category", true),
//         getAPI("/api/products/approved-with-badges", {}, true, false),

//         getAPI(`/api/social-media/suggested-users?userId=${userId}`,
//           { userId }, true, true
//         ).catch(() => null),

//         getAPI(`/api/social-media/profile/${userId}`, {}, true, true)
//           .catch(() => null),
//       ]);

//       const artistList =
//         artistsRes?.data?.artists ||
//         artistsRes?.data?.data ||
//         artistsRes?.data ||
//         [];

//       const mainCategories = categoriesRes?.data?.data || [];
//       const badgeData = badgeRes?.data?.data || [];

//       const detailed = await Promise.all(
//         artistList.map(async (artist) => {
//           const aid = artist?._id || artist?.id || artist?.userId;

//           const [detailsRes, userRes, profileRes] = await Promise.all([
//             getAPI(`/auth/getartistdetails/${aid}`, {}, true, false).catch(() => null),
//             getAPI(`/auth/userid/${aid}`, {}, true, false).catch(() => null),
//             getAPI(`/social-media/profile/${aid}`, {}, true, true).catch(() => null),
//           ]);

//           const details = detailsRes?.data || {};
//           const user = userRes?.data?.user || artist || {};

//           const categoryId = Array.isArray(details?.artCategories)
//             ? details.artCategories[0]
//             : null;

//           const mainCategory = mainCategories.find(
//             (c) => String(c._id) === String(categoryId)
//           );

//           const badgeEntry = badgeData.find(
//             (b) =>
//               String(b?.userId?._id || b?.userId) === String(aid)
//           );

//           const followersArr = normalizeIds(
//             profileRes?.data?.profile?.followers || []
//           );

//           const isFollowingArtist = followersArr.includes(String(userId));

//           return {
//             id: aid,
//             profilePhoto: user?.profilePhoto,
//             username: user?.username || "",
//             name: user?.name || user?.firstName || "",
//             lastName: user?.lastName || "",
//             badges: badgeEntry?.badges || [],
//             mainCategoryName: mainCategory?.mainCategoryName || "Unknown",
//             followers: followersArr,
//             isFollowing: isFollowingArtist,
//           };
//         })
//       );

//       if (!cancelled) {
//         setArtists(detailed.filter((a) => a.id));

//         const myFollowingIds = normalizeIds(
//           myProfileRes?.data?.profile?.following || []
//         );

//         setMyFollowing(myFollowingIds);
//       }
//     } catch (err) {
//       console.error("Error loading artists", err);
//     }
//   };

//   loadData();

//   return () => {
//     cancelled = true;
//   };
// }, [userId]);
useEffect(() => {
  let cancelled = false;

  const loadTopArtists = async () => {
    try {
      const topRes = await getAPI("/api/social-media/top-followed", {}, false, false);
      const topProfiles = topRes?.data?.data || [];

      let mainCategories = [];
      let badgeData = [];

      if (userId) {
        const [categoriesRes, badgeRes] = await Promise.all([
          getAPI("/api/main-category", true).catch(() => ({ data: { data: [] }})),
          getAPI("/api/products/approved-with-badges", {}, true, false).catch(() => ({ data: { data: [] }})),
        ]);

        mainCategories = categoriesRes?.data?.data || [];
        badgeData = badgeRes?.data?.data || [];
      }

      const formatted = await Promise.all(
        topProfiles.map(async (entry) => {
          const uid = entry.user;

          const userRes = await getAPI(`/auth/userid/${uid}`, {}, false, false);
          const user = userRes?.data?.user;

          let categoryName = "Artist";
          let badges = [];
          let isFollowing = false;

          if (userId) {
            const detailsRes = await getAPI(`/auth/getartistdetails/${uid}`, {}, true, false).catch(() => null);
            const details = detailsRes?.data || {};

            const categoryId = Array.isArray(details?.artCategories)
              ? details.artCategories[0]
              : null;

            const category = mainCategories.find((c) => String(c._id) === String(categoryId));
            categoryName = category?.mainCategoryName || "Unknown";

            const profileRes = await getAPI(`/social-media/profile/${uid}`, {}, true, true).catch(() => null);
            const followersArr = normalizeIds(profileRes?.data?.profile?.followers || []);
            isFollowing = followersArr.includes(String(userId));

            const badgeEntry = badgeData.find(
              (b) => String(b?.userId?._id || b?.userId) === String(uid)
            );
            badges = badgeEntry?.badges || [];
          }

          return {
            id: uid,
            profilePhoto: user?.profilePhoto,
            username: user?.username || "",
            name: user?.name || "",
            lastName: user?.lastName || "",
            badges,
            mainCategoryName: categoryName,
            followers: entry.followers || [],
            isFollowing,
          };
        })
      );

      if (!cancelled) {
        setArtists(formatted); 
      }
    } catch (err) {
      console.error("Error loading top artists:", err);
    }
  };

  loadTopArtists();

  return () => (cancelled = true);
}, [userId]);

const loadPublicArtists = async () => {
  try {
    const artistsRes = await getAPI("/artist/artists", {}, false, false);

    const artistList =
      artistsRes?.data?.artists ||
      artistsRes?.data?.data ||
      artistsRes?.data ||
      [];

    setArtists(
      artistList.map(a => ({
        id: a._id,
        profilePhoto: a.profilePhoto,
        username: a.username,
        name: a.name,
        lastName: a.lastName,
        badges: a.badges || [],
        mainCategoryName: "Artist",
        followers: [],
        isFollowing: false,
      }))
    );

  } catch (err) {
    console.error("Public artist load failed:", err);
  }
};

  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return artists.slice(start, start + pageSize);
  }, [artists, currentPage]);

  const totalPages = Math.max(1, Math.ceil(artists.length / pageSize));
const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
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

      setArtists((prev) =>
        prev.map((a) => {
          if (String(a.id) !== String(targetUserId)) return a;
          const followers = normalizeIds(a.followers);
          const uid = String(userId || "");
          const idx = followers.indexOf(uid);
          if (idx !== -1) followers.splice(idx, 1);
          else followers.push(uid);
          return {
            ...a,
            followers,
            isFollowing: followers.includes(uid),
          };
        })
      );

      setMyFollowing((prev) => {
        const tid = String(targetUserId);
        const exists = prev.includes(tid);
        if (isFollowing && exists) {
          return prev.filter((id) => id !== tid);
        }
        if (!isFollowing && !exists) {
          return [...prev, tid];
        }
        return prev;
      });
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleStoreVisit = (artistId) => {
    navigate(`/social-media/profile/product-view?artistId=${artistId}`);
  };

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6">
     <main className="md:col-span-4 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 ">
            {paginatedArtists.map((artist) => {
              const normalizedFollowers = normalizeIds(artist.followers);
              const isFollowing =
  userId &&
  (
    artist.isFollowing ||
    normalizedFollowers.includes(String(userId)) ||
    myFollowing.includes(String(artist.id))
  );

              return (
                <div
                  key={artist.id}
                  className="w-full mx-auto product-card artist-card border-5"
                >
                  <div className="relative p-img artist-img">
                    <img
                      src={
                        artist.profilePhoto
                          ? `${imageBaseURL}${artist.profilePhoto}`
                          : DEFAULT_PROFILE_IMAGE
                      }
                      onError={(e) => {
                        if (e?.target) e.target.src = DEFAULT_PROFILE_IMAGE;
                      }}
                      alt={artist.username || "Artist"}
                      className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
                    />
                  </div>

                  <div className="p-1 text-center product-info product-cat">
                    <p className="text-brown-500 text-[10px] md:text-xs font-bold">
                      {artist.username || "Artist"}
                    </p>
                  </div>

                  <div className="py-4 px-2">
                    <div className="flex items-stretch justify-between">
                      <div className="w-full md:w-4/5 flex flex-col justify-between">
                        <div>
                          <h2 className="text-white text-sm md:text-lg font-bold flex items-center">
                            {`${artist.name} ${artist.lastName}`.trim() || "Unknown"}
                            {artist.badges?.map((img, idx) => (
                              <span key={idx} className="ml-2 text-orange-500 text-md">
                                <img
                                  src={`${imageBaseURL}${img}`}
                                  className="w-5 h-5 rounded-full object-contain"
                                />
                              </span>
                            ))}
                          </h2>
                        </div>
                        <div className="mt-2">
                          <span className="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
                            {artist.mainCategoryName}
                          </span>
                        </div>
                      </div>

                      <div className="w-px bg-gray-600 mx-3 hidden md:block"></div>

                      <div className="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
                        <div>
                        {/*  <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs"
                            onClick={() =>
                              handleFollowToggle(artist.id, isFollowing)
                            }
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </button>*/}
                          <button
  //disabled={!userId}
  // className={`bg-orange-500 ${
  //   !userId ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
  // } text-white px-3 py-1 rounded-full font-medium text-xs`}
  className={`bg-orange-500 text-white px-3 py-1 rounded-full font-medium text-xs
    ${!userId ? "opacity-60" : "hover:bg-orange-600"}
  `}
  // onClick={() => userId && handleFollowToggle(artist.id, isFollowing)}
  onClick={() => {
  if (!userId) {
    toast.error("Please login to follow artist");   
    return;
  }
  handleFollowToggle(artist.id, isFollowing);
}}

>
  {isFollowing ? "Unfollow" : "Follow"}
</button>

                        </div>
                        <div className="mt-2">
                          <button
                            onClick={() => handleStoreVisit(artist.id)}
                            className="text-white underline text-xs hover:text-gray-300"
                          >
                            Visit Store
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
{/* <div className="flex justify-center mt-6">
  <nav className="flex flex-wrap sm:flex-nowrap items-center space-x-2 rounded border border-dark px-2 sm:px-3 py-2 text-sm sm:text-lg font-semibold overflow-x-auto no-scrollbar"> */}

    {/* Previous */}
    {/* <button
      className={`px-2 sm:px-3 py-1 flex items-center ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-red-500"
                }`}
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    >
       <FiChevronLeft className="self-center flex-shrink-0" />
                      <span className="ml-1">Previous</span>
    </button> */}

    {/* Page Numbers */}
    {/* {pages.map((page) => (
      <button
        key={page}
        className={`px-3 py-1  ${
          page === currentPage
            ? "border border-dark text-dark"
            : "hover:text-red-500"
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))} */}

    {/* Next */}
    {/* <button
      className={`px-2 sm:px-3 py-1 flex items-center ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-red-500"
                }`}
      disabled={currentPage >= totalPages}
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    >
       <span className="mr-1">Next</span>
                      <FiChevronRight className="self-center flex-shrink-0" />
    </button>
  </nav>
</div> */}

          {/* <div className="flex justify-center mt-6">
            <nav className="flex flex-wrap sm:flex-nowrap items-center space-x-2 rounded border border-dark px-2 sm:px-3 py-2 text-sm sm:text-lg font-semibold overflow-x-auto no-scrollbar">
              <FiChevronLeft className="self-center flex-shrink-0" />
              <button
                className="px-1 sm:px-3 py-1"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
              >
                Previous
              </button>
              <button className="px-3 sm:px-3 py-1 rounded border border-dark text-dark">
                {currentPage}
              </button>
              <button
                className="px-1 sm:px-3 py-1"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </button>
              <FiChevronRight className="self-center flex-shrink-0" />
            </nav>
          </div> */}
        </main>
      </div>
    </div>
  );
};
export default ArtistCard;
