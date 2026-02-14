import "./artist-card.css";
import React, { useEffect, useMemo, useState } from "react";
import { 
  Search, ListFilter, X, ChevronRight, ChevronLeft, 
  Tag, SortAsc, UserCheck, TrendingUp, Filter 
} from "lucide-react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import { DEFAULT_PROFILE_IMAGE } from "../ArtistGrid/constant";

const ArtistCard = ({ limit = 8, searchQuery = "", filters = {} }) => {
  const [artists, setArtists] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = limit;
  const navigate = useNavigate();
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
  const userId = localStorage.getItem("userId");

  const normalizeIds = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((f) => (typeof f === "object" ? f?._id || f?.id || f?.user || f : f))
          .filter(Boolean)
          .map(String)
      : [];

  useEffect(() => {
    let cancelled = false;

    const loadTopArtists = async () => {
      try {
        const topRes = await getAPI("/api/social-media/top-followed", {}, false, false);
        const topProfiles = topRes?.data?.data || [];

        let mainCategories = [];
        let badgeData = [];

        const [categoriesRes, badgeRes] = await Promise.all([
          getAPI("/api/main-category", true).catch(() => ({ data: { data: [] } })),
          getAPI("/api/products/approved-with-badges", {}, true, false).catch(() => ({ data: { data: [] } })),
        ]);

        mainCategories = categoriesRes?.data?.data || [];
        badgeData = badgeRes?.data?.data || [];

        const formatted = await Promise.all(
          topProfiles.map(async (entry) => {
            const uid = entry.user;

            const userRes = await getAPI(`/auth/userid/${uid}`, {}, false, false);
            const user = userRes?.data?.user;

            let categoryName = "Artist";
            let badges = [];
            let isFollowing = false;

            const detailsRes = await getAPI(`/auth/getartistdetails/${uid}`, {}, true, false).catch(() => null);
            const details = detailsRes?.data || {};

            const categoryId = Array.isArray(details?.artCategories)
              ? details.artCategories[0]
              : null;

            const category = mainCategories.find((c) => String(c._id) === String(categoryId));
            categoryName = category?.mainCategoryName || "Unknown";

            const profileRes = await getAPI(`/api/social-media/profile/${uid}`, {}, true, true).catch(() => null);
            const followersArr = normalizeIds(profileRes?.data?.profile?.followers || []);
            isFollowing = followersArr.includes(String(userId));

            const badgeEntry = badgeData.find(
              (b) => String(b?.userId?._id || b?.userId) === String(uid)
            );
            badges = badgeEntry?.badges || [];

            return {
              id: uid,
              profilePhoto: user?.profilePhoto,
              username: user?.username || "",
              name: user?.name || "",
              lastName: user?.lastName || "",
              badges,
              mainCategoryName: categoryName,
              followers: followersArr,
              isFollowing,
              createdAt: user?.createdAt || new Date(),
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

  const filteredArtists = useMemo(() => {
    let result = [...artists];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.username.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.lastName.toLowerCase().includes(query) ||
          a.mainCategoryName.toLowerCase().includes(query)
      );
    }

    if (filters.specialTags?.length > 0) {
      result = result.filter((a) => {
        return filters.specialTags.some((tag) => {
          if (tag === "Verified Artist") return a.badges.length > 0;
          if (tag === "Trending") return a.followers.length > 5;
          return false;
        });
      });
    }

    if (filters.expertise?.length > 0) {
      result = result.filter((a) => filters.expertise.includes(a.mainCategoryName));
    }

    if (filters.sortBy === "Newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "Trending") {
      result.sort((a, b) => b.followers.length - a.followers.length);
    } else if (filters.sortBy === "Name (A-Z)") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === "Name (Z-A)") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [artists, searchQuery, filters]);

  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArtists.slice(start, start + pageSize);
  }, [filteredArtists, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    if (!userId) {
      toast.error("Please login to follow artist");
      return;
    }
    try {
      if (isFollowing) {
        await postAPI(`/api/social-media/unfollow/${targetUserId}`, { userId }, true, true);
      } else {
        await postAPI(`/api/social-media/follow/${targetUserId}`, { userId }, true, true);
      }

      setArtists((prev) =>
        prev.map((a) => {
          if (String(a.id) !== String(targetUserId)) return a;
          const followers = normalizeIds(a.followers);
          const uid = String(userId);
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
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleStoreVisit = (artistId) => {
    navigate(`/artsays-community/profile/product-view?artistId=${artistId}`);
  };

  return (
    <div className="w-full">
      {paginatedArtists.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible">
            {paginatedArtists.map((artist, index) => {
              const isFollowing = userId && (artist.isFollowing || myFollowing.includes(String(artist.id)));
              return (
                <div
                  key={artist.id}
                  className="min-w-[77%] snap-start sm:min-w-0 group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
                  <img
                    src={artist.profilePhoto ? `${imageBaseURL}${artist.profilePhoto}` : DEFAULT_PROFILE_IMAGE}
                    onError={(e) => { e.target.src = DEFAULT_PROFILE_IMAGE; }}
                    alt={artist.username}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {artist.badges.length > 0 && (
                      <div className="bg-white backdrop-blur-md text-[#6F4D34] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">
                        Verified Artist
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-4 gap-3">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
                      <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
                        @{artist.username || "artist"}
                      </span>
                    </div>
                    <div className="flex -space-x-1.5">
                      {artist.badges?.map((img, idx) => (
                        <div key={idx}>
                          <img src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full border border-white" alt="Badge" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">
                    {`${artist.name} ${artist.lastName}`.trim() || "Artist Name"}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#6F4D34]/5 text-[#6F4D34] text-[11px] font-bold px-3 py-1 rounded-full border border-[#6F4D34]/10">
                      {artist.mainCategoryName}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      • {artist.followers.length} followers
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mt-auto">
                    <button
                      onClick={() => handleFollowToggle(artist.id, isFollowing)}
                      className={`col-span-2 h-[48px] rounded-2xl font-black text-[12px] hover:!bg-[#6F4D34] hover:text-[#ffffff] uppercase tracking-wider transition-all duration-300 border flex items-center justify-center ${
                        isFollowing 
                          ? "bg-white border-[#6F4D34] text-[#6F4D34]" 
                          : "bg-gray-50 border-gray-100 text-gray-900 hover:bg-[#6F4D34] hover:text-white"
                      }`}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>

                    <button
                      onClick={() => handleStoreVisit(artist.id)}
                      className="col-span-3 h-[48px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] hover:!bg-[#ffffff] rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all duration-300 shadow-sm hover:!bg-white border border-[#6F4D34] flex items-center justify-center"
                    >
                      Visit Store
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-3xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6 text-gray-300">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No artists found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Try adjusting your filters or search term to discover amazing creators.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center px-2 gap-1">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    page === currentPage ? "bg-[#6F4D34] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ArtistCard;

