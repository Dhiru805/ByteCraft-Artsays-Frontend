import "./artist-card.css";
import React, { useEffect, useMemo, useState } from "react";
  import { 
    Search, ListFilter, X, ChevronRight, ChevronLeft, 
    Tag, SortAsc, UserCheck, TrendingUp, Filter 
  } from "lucide-react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import { DEFAULT_PROFILE_IMAGE } from "./constant";
import ProductsSkeliton from "../../../Component/Skeleton/products/ProductsSkeliton";
import HeroImgArtist from "../hero-img/hero-img";

const ArtistCard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [artists, setArtists] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const navigate = useNavigate();
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
  const userId = localStorage.getItem("userId");

  const [filters, setFilters] = useState({
    sortBy: "Newest",
    specialTags: [],
    expertise: [],
    search: "",
  });

  const [options, setOptions] = useState({
    expertise: [],
  });

  const normalizeIds = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((f) => (typeof f === "object" ? f?._id || f?.id || f?.user || f : f))
          .filter(Boolean)
          .map(String)
      : [];

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const [artistsRes, categoriesRes, badgeRes, myProfileRes] = await Promise.all([
          getAPI("/artist/artists", {}, true, false),
          getAPI("/api/main-category", true),
          getAPI("/api/products/approved-with-badges", {}, true, false),
          userId
            ? getAPI(`/api/social-media/profile/${userId}`, {}, true, true).catch(() => null)
            : Promise.resolve(null),
        ]);

        const artistList =
          artistsRes?.data?.artists ||
          artistsRes?.data?.data ||
          artistsRes?.data ||
          [];

        const mainCategories = categoriesRes?.data?.data || [];
        const badgeData = badgeRes?.data?.data || [];
        
        setOptions({
          expertise: mainCategories.map(c => c.mainCategoryName),
        });

        const detailed = await Promise.all(
          artistList.map(async (artist) => {
            const aid = artist?._id || artist?.id || artist?.userId;

            const [detailsRes, userRes, profileRes] = await Promise.all([
              getAPI(`/auth/getartistdetails/${aid}`, {}, true, false).catch(() => null),
              getAPI(`/auth/userid/${aid}`, {}, true, false).catch(() => null),
              getAPI(`/api/social-media/profile/${aid}`, {}, true, true).catch(() => null),
            ]);

            const details = detailsRes?.data || {};
            const user = userRes?.data?.user || artist || {};

            const categoryId = Array.isArray(details?.artCategories)
              ? details.artCategories[0]
              : null;

            const mainCategory = mainCategories.find(
              (c) => String(c._id) === String(categoryId)
            );

            const badgeEntry = badgeData.find(
              (b) => String(b?.userId?._id || b?.userId) === String(aid)
            );

            const followersArr = normalizeIds(
              profileRes?.data?.profile?.followers || []
            );

            const isFollowingArtist = followersArr.includes(String(userId));

            return {
              id: aid,
              profilePhoto: user?.profilePhoto,
              username: user?.username || "",
              name: user?.name || user?.firstName || "",
              lastName: user?.lastName || "",
              badges: badgeEntry?.badges || [],
              mainCategoryName: mainCategory?.mainCategoryName || "Unknown",
              followers: followersArr,
              isFollowing: isFollowingArtist,
              createdAt: user.createdAt || new Date(),
            };
          })
        );

        if (!cancelled) {
          setArtists(detailed.filter((a) => a.id));

          if (myProfileRes) {
            const myFollowingIds = normalizeIds(
              myProfileRes?.data?.profile?.following || []
            );
            setMyFollowing(myFollowingIds);
          }
        }
      } catch (err) {
        console.error("Error loading artists", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleFilterChange = (category, value, isChecked) => {
    setFilters((prev) => {
      if (category === "sortBy" || category === "search") {
        return { ...prev, [category]: value };
      }

      const currentList = prev[category] || [];
      if (isChecked) {
        return { ...prev, [category]: [...currentList, value] };
      } else {
        return { ...prev, [category]: currentList.filter((item) => item !== value) };
      }
    });
    setCurrentPage(1);
  };

  const filteredArtists = useMemo(() => {
    let result = [...artists];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.username.toLowerCase().includes(search) ||
          a.name.toLowerCase().includes(search) ||
          a.lastName.toLowerCase().includes(search) ||
          a.mainCategoryName.toLowerCase().includes(search)
      );
    }

    if (filters.specialTags.length > 0) {
      result = result.filter((a) => {
        return filters.specialTags.some((tag) => {
          if (tag === "Verified Artist") return a.badges.length > 0;
          if (tag === "Trending") return a.followers.length > 5;
          return false;
        });
      });
    }

    if (filters.expertise.length > 0) {
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
  }, [artists, filters]);

  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArtists.slice(start, start + pageSize);
  }, [filteredArtists, currentPage]);

  const totalPages = Math.ceil(filteredArtists.length / pageSize);
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
    navigate(`/api/social-media/profile/product-view?artistId=${artistId}`);
  };

  const FilterSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 animate-slide-up">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[#6F4D34]" />
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${checked ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"}`}>
          {checked && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className={`ml-3 text-sm font-medium transition-colors ${checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"}`}>
        {label}
      </span>
    </label>
  );

  const RadioItem = ({ label, checked, onChange, name }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-full transition-all ${checked ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"}`}>
          <div className={`w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${checked ? "scale-100" : "scale-0"}`} />
        </div>
      </div>
      <span className={`ml-3 text-sm font-medium transition-colors ${checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"}`}>
        {label}
      </span>
    </label>
  );

  if (loading) return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      <div className="max-w-[1440px] mx-auto p-4">
        <ProductsSkeliton />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen font-[poppins]">
      <div className="w-full max-w-[1440px] mx-auto p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm font-bold text-[#6F4D34]"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={20} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </span>
                {showFilters ? <X size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>

            <div className={`${showFilters ? "block" : "hidden"} lg:block sticky top-6 space-y-4`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Discover Artists</h2>
                <p className="text-sm text-gray-500">Find your favorite creators</p>
              </div>

              <FilterSection title="Sort By" icon={SortAsc}>
                {["Newest", "Trending", "Name (A-Z)", "Name (Z-A)"].map((option) => (
                  <RadioItem
                    key={option}
                    label={option}
                    name="sortBy"
                    checked={filters.sortBy === option}
                    onChange={() => handleFilterChange("sortBy", option)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Special Tags" icon={Tag}>
                {["Verified Artist", "Trending"].map((tag) => (
                  <CheckboxItem
                    key={tag}
                    label={tag}
                    checked={filters.specialTags.includes(tag)}
                    onChange={(e) => handleFilterChange("specialTags", tag, e.target.checked)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Expertise" icon={Filter}>
                {options.expertise.map((exp) => (
                  <CheckboxItem
                    key={exp}
                    label={exp}
                    checked={filters.expertise.includes(exp)}
                    onChange={(e) => handleFilterChange("expertise", exp, e.target.checked)}
                  />
                ))}
              </FilterSection>
            </div>
          </aside>

          <main className="flex-grow">
            <div className="relative mb-3 group">
              <input
                type="text"
                placeholder="Search artists by name or category..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
              />
            </div>

            {paginatedArtists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {paginatedArtists.map((artist, index) => {
                  const isFollowing = userId && (artist.isFollowing || myFollowing.includes(String(artist.id)));
                  return (
                    <div
                      key={artist.id}
                      className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative aspect-[5/5] overflow-hidden bg-[#F8F9FA]">
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

                      <div className="flex flex-col flex-grow p-3 gap-3">
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

                        <div className="grid grid-cols-5 gap-2">
                          <button
                            onClick={() => handleFollowToggle(artist.id, isFollowing)}
                            className={`col-span-2 h-[48px] rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all duration-300 border flex items-center justify-center ${
                              isFollowing 
                                ? "bg-white border-[#6F4D34] text-[#6F4D34]" 
                                : "bg-gray-50 border-gray-100 text-gray-900 hover:bg-[#6F4D34] hover:text-white"
                            }`}
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </button>

                          <button
                            onClick={() => handleStoreVisit(artist.id)}
                            className="col-span-3 h-[48px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all duration-300 shadow-sm hover:!bg-white border border-[#6F4D34] flex items-center justify-center"
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
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                  Try adjusting your filters or search term to discover amazing creators.
                </p>
                <button
                  onClick={() => setFilters({ sortBy: "Newest", specialTags: [], expertise: [], search: "" })}
                  className="text-[#6F4D34] font-bold hover:underline px-8 py-3 border-2 border-[#6F4D34] rounded-full transition-all hover:bg-[#6F4D34] hover:text-white"
                >
                  Clear All Filters
                </button>
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
