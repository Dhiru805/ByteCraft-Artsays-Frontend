import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { BsBroadcast } from "react-icons/bs";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
// import { BsBroadcast } from "react-icons/bs";

// const suggestedVideo = [
//   {
//     id: 1,
//     username: "theOneWierdo",
//     title: "Lorem ipsum dolor sit amet",
//     profilePic:
//       "https://images.stockcake.com/public/5/6/5/56590034-bda7-4c40-b92f-61149b436e66_large/peaceful-profile-portrait-stockcake.jpg",
//     about:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing......",
//     views: "2M",
//     duration: "30:15",
//     timing: "streamed 1w ago",
//     isLive: false,
//     state: "new",
//   },
//   {
//     id: 2,
//     username: "theOneWierdo",
//     title: "Lorem ipsum dolor sit amet",
//     profilePic:
//       "https://images.stockcake.com/public/5/6/5/56590034-bda7-4c40-b92f-61149b436e66_large/peaceful-profile-portrait-stockcake.jpg",
//     about:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing......",
//     views: "12M",
//     duration: "30:15",
//     timing: "streamed 1w ago",
//     isLive: false,
//     state: "new",
//   },
//   {
//     id: 3,
//     username: "theOneWierdo",
//     title: "Lorem ipsum dolor sit amet",
//     profilePic:
//       "https://images.stockcake.com/public/5/6/5/56590034-bda7-4c40-b92f-61149b436e66_large/peaceful-profile-portrait-stockcake.jpg",
//     about:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing......",
//     views: "11M",
//     duration: "",
//     timing: "streaming Now",
//     isLive: true,
//     state: "new",
//   },
// ];

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400); // 400ms debounce delay
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPostGrid, setShowPostGrid] = useState(false);

  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestionForUser, setSuggestionForUser] = useState([]);

  const userId = localStorage.getItem("userId");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [activeLives, setActiveLives] = useState([]);

  // Fetch active live streams
  useEffect(() => {
    const fetchActiveLives = async () => {
      try {
        const res = await getAPI("/api/social-media/active-lives", {}, true, true);
        if (res?.data?.success) {
          setActiveLives(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching active lives:", err);
      }
    };
    fetchActiveLives();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActiveLives, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutsideth = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideth);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideth);
  }, []);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        const response = await postAPI(
          `/api/social-media/unfollow/${targetUserId}`,
          { userId },
          true,
          true
        );
        console.log("unfollow success56325412", response);
      } else {
        const response = await postAPI(
          `/api/social-media/follow/${targetUserId}`,
          { userId },
          true,
          true
        );
        console.log("follow success56325412", response);
      }

      setSuggestionForUser((prevUsers) =>
        prevUsers.map((u) =>
          u._id === targetUserId ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  //  Fetch recent searches + suggested users on mount
  useEffect(() => {
    const fetchRecentAndSuggestions = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const recent = await getAPI(
          `/api/social-media/recent-searches/${userId}`,
          {},
          true,
          true
        );
        console.log("Fetched recent searches and suggestions", recent);
        setRecentSearches(recent.data.recentSearches || []);
        setSuggestionForUser(recent.data.searchBarSuggestedUsers || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
      if (userId) fetchRecentAndSuggestions();
  }, [userId]);
  console.log("kkkkkkkkkkkkkkkk", { recentSearches, suggestionForUser });

  // Debounced search effect - API call only fires after user stops typing
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestedUsers([]);
        setSuggestedPosts([]);
        setSuggestedTags([]);
        setShowDropdown(false);
        return;
      }

      try {
        const userId = localStorage.getItem("userId");
        const endpoint = `/api/social-media/search?q=${encodeURIComponent(
          debouncedQuery
        )}&userId=${encodeURIComponent(userId)}`;
        const res = await getAPI(endpoint, {}, true, true);
        const result = res.data || res;

        setSuggestedUsers([]);
        setSuggestedTags([]);
        setSuggestedPosts([]);

        if (result.type === "users" && result.users)
          setSuggestedUsers(result.users);
        if (result.type === "hashtags" && result.tags)
          setSuggestedTags(result.tags);
        if (result.type === "posts" && result.posts)
          setSuggestedPosts(result.posts);

        setShowDropdown(
          result.users?.length > 0 ||
          result.tags?.length > 0 ||
          result.posts?.length > 0
        );
      } catch (err) {
        console.error("Search error:", err);
        setShowDropdown(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  //  Handle search input - only updates query state (debounced search happens in useEffect)
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Immediately clear results if input is empty
    if (!value.trim()) {
      setSuggestedUsers([]);
      setSuggestedPosts([]);
      setSuggestedTags([]);
      setShowDropdown(false);
    }
  };

  //  Add to recent + suggested (server handles both now)
  const addRecentSearch = async (label, refId, type, tag = null) => {
    try {
      const body = { userId, type, refId, label, tag };
      const res = await postAPI(
        "/api/social-media/recent-searches/add",
        body,
        true,
        true
      );

      setRecentSearches(res.data.recentSearches || []);
      setSuggestionForUser(res.data.searchBarSuggestedUsers || []);
    } catch (err) {
      console.error("Error adding recent search:", err);
    }
  };

  //  Remove one recent (server cleans both lists)
  const removeRecentSearch = async (searchId) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await deleteAPI(
        `/api/social-media/recent-searches/${userId}/${searchId}`, // 👈 use params, not body
        {},
        true,
        true
      );

      setRecentSearches(res.data.recentSearches || []);
      setSuggestionForUser(res.data.searchBarSuggestedUsers || []);
    } catch (err) {
      console.error("Error removing recent search:", err);
    }
  };

  //  Clear all recents + suggestions
  const clearAllRecent = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await deleteAPI(
        `/api/social-media/recent-searches/${userId}/clear`,
        {},
        true,
        true
      );

      setRecentSearches(res.data.recentSearches || []);
      setSuggestionForUser(res.data.searchBarSuggestedUsers || []);
    } catch (err) {
      console.error("Error clearing recents:", err);
    }
  };

  //  handle user click
  const handleUserClick = (user) => {
    addRecentSearch(user.username, user._id, "user");
    setShowDropdown(false);
    navigate(
      `/artsays-community/profile/${user?.username
        ? `${user?.username}`
        : `${user?.name}_${user?.lastName}_${user?._id}`
      }`, { state: { userId: user?._id } }
    );
  };

  //  handle hashtag click
  const handleHashtagClick = async (tag) => {
    try {
      const hashtag = `#${tag}`;
      setQuery(hashtag);
      const endpoint = `/api/social-media/search?tag=${tag}`;
      const res = await getAPI(endpoint, {}, true, true);
      const result = res.data || res;
      console.log("Hashtag search result:", result);
      addRecentSearch(`#${tag}`, tag, "hashtag", tag);

      setSuggestedPosts(result.posts || []);
      setSuggestedUsers([]);
      setSuggestedTags([]);
      setShowDropdown(false);
      setShowPostGrid(true);
    } catch (err) {
      console.error("Hashtag posts fetch error:", err);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-6 w-full mx-auto flex flex-col gap-3 sm:mt-6 mt-3 sm:px-4 px-2">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="bg-[#FDE8D3] px-2.5 py-1 rounded-xl flex items-center justify-between">
          <div className="flex items-center w-full gap-2">
            <i className="ri-search-line text-xl font-bold text-[#000000]"></i>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search or type #tag"
              className="bg-transparent w-full text-gray-900 outline-none font-medium text-base"
            />
          </div>
          {/* <div className="flex items-center gap-3 text-xl text-[#6E4E37]">
            <IoMic className="text-3xl" />
          </div> */}
        </div>

        {/* Dropdown */}
        {showDropdown &&
          (suggestedUsers.length > 0 || suggestedTags.length > 0) && (
            <div className="absolute inset-0 top-full left-0 w-full h-[calc(100vh-70px)] bg-white z-[9999] overflow-y-auto py-2">
              {/* Tags */}
              {suggestedTags.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  <p className="text-gray-500 text-sm font-medium">Hashtags</p>
                  {suggestedTags.map((tag, index) => (
                    <div
                      key={index}
                      onClick={() => handleHashtagClick(tag)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-[#EBEBEB]"
                    >
                      <span className="text-blue-500 font-bold">#{tag}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Users */}
              {suggestedUsers.length > 0 && (
                <div className="flex flex-col gap-3">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 bg-[#FEE2CC] rounded-xl p-2 cursor-pointer border-l-[7px] border-l-red-500"
                      onClick={() => handleUserClick(user)}
                    >
                      <img
                        src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}`}
                        alt={user?.username}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-black flex items-center gap-1">
                          {user?.username}
                          {user.verified && (
                            <MdVerified className="text-blue-500 text-lg" />
                          )}
                        </p>
                        <p className="text-sm text-gray-700">
                          {user.city || user.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Recent Searches */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-[#000000]">
            Recent Searches
          </h3>
          <button
            className="text-xs font-medium text-[#6F4D34]"
            onClick={clearAllRecent}
          >
            Clear all
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: "none" }}>
          {recentSearches.map((item) => (
            <div
              key={item._id}
              className="bg-[#ECE6E6] px-2 py-1 rounded-md font-medium text-sm text-[#000000] flex items-center gap-2 min-w-max"
            >
              <span
                className="cursor-pointer whitespace-nowrap"
                onClick={() => {
                  if (item.type === "user") {
                    navigate(
                      `/artsays-community/profile/${item.username
                        ? item.username
                        : `${item.name}_${item.lastName}_${item._id}`
                      }`,
                      { state: { userId: item._id } }
                    );
                  } else if (item.type === "hashtag") {
                    handleHashtagClick(item.tag);
                  }
                }}
              >
                {item.label}
              </span>

              <button
                className="text-[#000000] text-xs hover:text-red-500"
                onClick={() => removeRecentSearch(item._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
      
      {/* Suggested Users */}
      <div className="flex flex-col gap-3">
        {suggestionForUser.map((user) => (
          <div
            key={user._id}
            className="border-l-[14px] border-[#E56500] flex justify-between items-center bg-[#FEE2CC] rounded-xl p-2"
          >
            <div className="flex items-center gap-3 w-full">
              <img
                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}`}
                alt={user?.username}
                onClick={() => handleUserClick(user)}
                className="w-14 h-14 rounded-full border object-cover cursor-pointer"
              />
              <div className="flex flex-col">
                <span
                  className="lg:text-[20px] text-lg font-medium text-[#000000] cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  {user.username}
                </span>
                <span className="text-sm text-gray-600">{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Follow/Unfollow Toggle */}
              <button
                onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                className={`${user.isFollowing
                  ? "bg-gray-300 text-[#48372D]"
                  : "bg-[#48372D] text-[#FEE2CC]"
                  } sm:text-md text-sm rounded-lg px-2 py-1 font-bold`}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>

              {/* Remove from Suggested */}
              <button
                onClick={() =>
                  deleteAPI(
                    `/api/social-media/searchbar-suggested/${userId}/${user._id}`, // 👈 param-based
                    {},
                    true,
                    true
                  ).then((res) => {
                    setSuggestionForUser(res.data.suggestedUsers || []);
                  })
                }
                className="text-[#000000] sm:px-3 sm:py-1 rounded-lg text-lg font-semibold"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Live Streams */}
      {activeLives.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-[#000000] mb-2 flex items-center gap-2">
            <BsBroadcast className="text-red-500" />
            Live Now
          </h3>
          <div className="flex flex-col gap-3">
            {activeLives.map((stream) => {
              const thumb = stream.thumbnail
                ? stream.thumbnail.startsWith("http")
                  ? stream.thumbnail
                  : `${process.env.REACT_APP_API_URL}/${stream.thumbnail.replace(/\\/g, "/")}`
                : "/assets/profile/user.png";

              const profileImg = stream.userId?.profilePhoto
                ? stream.userId.profilePhoto.startsWith("http")
                  ? stream.userId.profilePhoto
                  : `${process.env.REACT_APP_API_URL}/${stream.userId.profilePhoto}`
                : DEFAULT_PROFILE_IMAGE;

              return (
                <div
                  key={stream._id}
                  className="relative flex flex-row bg-[#FFE5D9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[140px] pl-3 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/artsays-community/live/${stream.live?.streamKey}`
                    )
                  }
                >
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#FF6B6B] z-10"></div>

                  {/* Layout Container */}
                  <div className="flex flex-row w-full p-2 py-3 gap-3 md:gap-4 items-start">
                    {/* Thumbnail Section */}
                    <div className="relative w-[160px] sm:w-[240px] aspect-video flex-shrink-0">
                      <div className="w-full h-full rounded-xl overflow-hidden relative group cursor-pointer bg-black/10">
                        <img
                          src={thumb}
                          alt={stream.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Overlay & Play Button */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                            <FaPlay className="ml-1 text-xs sm:text-sm" />
                          </div>
                        </div>
                        {/* LIVE Badge */}
                        <div className="absolute top-1 left-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <BsBroadcast className="text-xs" /> LIVE
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-between h-full min-h-[90px] text-[#48372D]">
                      <div>
                        <h3
                          className="font-bold text-sm sm:text-lg text-[#48372D] leading-tight line-clamp-2 mb-0.5"
                          title={stream.title}
                        >
                          {stream.title}
                        </h3>

                        <div className="text-[10px] sm:text-xs text-gray-600 mb-2 flex items-center gap-1 flex-wrap">
                          <span>{stream.live?.viewCount || 0} watching</span>
                          <span>•</span>
                          <span className="text-red-500 font-semibold">
                            Streaming Now
                          </span>
                        </div>

                        {/* User Info */}
                        {stream.userId && (
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={profileImg}
                              alt={stream.userId.username}
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                            />
                            <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                              {stream.userId.username || "User"}
                            </span>
                          </div>
                        )}

                        <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed hidden sm:block">
                          {stream.description}
                        </p>
                      </div>

                      {/* Tags/Category Button */}
                      <div className="mt-auto">
                        <span className="bg-[#5D4037] text-white text-[10px] px-2 py-0.5 sm:py-1 rounded inline-block">
                          {stream.category || "New"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full-page Post Grid */}
      {showPostGrid && suggestedPosts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {suggestedPosts.map((post) => (
            <Link to={`/artsays-community/single-post/${post._id}`}>
              <div key={post._id} className="relative">
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.images[0]}`}
                  alt="post"
                  className="w-full h-40 sm:h-52 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {post.caption}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      

      {/* Suggested Videos */}
      {/* <div>
        <div className="flex flex-col gap-3">
          {suggestedVideo.map((item) => (
            <div
              key={item.id}
              className="vid bg-[#FEE2CC] rounded-xl p-2 flex sm:flex-row flex-col w-full gap-3.5 relative"
            > */}
      {/* Thumbnail and Play Button Overlay */}
      {/* <div className="relative w-full sm:w-[350px] h-48 sm:h-56 rounded-lg overflow-hidden"> */}
      {/* <img
                  src={`https://img.youtube.com/vi/SsnKbRSMCNw/hqdefault.jpg`}
                  alt="video"
                  className="w-full h-full object-cover rounded-lg"
                /> */}

      {/* Play Button Centered */}
      {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <i className="ri-play-circle-fill text-white text-5xl sm:text-6xl opacity-90" />
                </div> */}

      {/* LIVE or NEW Label */}
      {/* {item.isLive ? (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <BsBroadcast className="text-lg" /> LIVE
                  </div>
                ) : null} */}

      {/* Duration Label */}
      {/* {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-[2px] rounded">
                    {item.duration}
                  </div>
                )}
              </div> */}

      {/* Video Details */}
      {/* <div className="flex flex-col items-start sm:gap-1">
                <div className="flex flex-row vdo-head justify-between gap-3">
                  <div className="text-xl font-bold vdo-title text-[#000000] w-full break-words  ">
                    {item.title}
                  </div>
                  <div className="relative vdo-dot ">
                    <i
                      className="ri-more-fill sm:text-3xl text-xl text-[#000000] font-bold cursor-pointer hover:text-gray-300"
                      onClick={() =>
                        setOpenDropdownId((prev) =>
                          prev === item.id ? null : item.id
                        )
                      }
                    ></i> */}

      {/* Dropdown Menu */}
      {/* {openDropdownId === item.id && (
                      <div
                        className="absolute right-0 sm:top-6 top-6 vid-drop z-[999] flex flex-col items-center   bg-white text-black text-sm rounded-xl  shadow-lg  w-40"
                        ref={dropdownRef}
                      >
                        <button
                          className=" w-full sm:px-4 sm:py-2 px-2 py-1 hover:bg-gray-100 rounded-t-lg "
                          onClick={() => setOpenDropdownId(null)}
                        >
                          Add to Queue
                        </button>
                        <hr className="w-[75%] mx-auto border-t  border-gray-800" />
                        <button
                          className=" w-full sm:px-4 sm:py-2 px-2 py-1  hover:bg-gray-300"
                          onClick={() => setOpenDropdownId(null)}
                        >
                          Save
                        </button>
                        <hr className="w-[75%] mx-auto border-t border-gray-800" />
                        <button
                          className="  w-full sm:px-4 sm:py-2 px-2 py-1  hover:bg-gray-300"
                          onClick={() => setOpenDropdownId(null)}
                        >
                          Share
                        </button>
                        <hr className="w-[75%] mx-auto border-t border-gray-800" />
                        <button
                          className="  w-full sm:px-4 sm:py-2 px-2 py-1  hover:bg-gray-300 rounded-b-lg"
                          onClick={() => setOpenDropdownId(null)}
                        >
                          report
                        </button>
                      </div>
                    )}
                  </div>
                </div> */}

      {/* <div className="flex items-center gap-2">
                  <span className="text-[#000000] text-sm">
                    {item.views} views
                  </span>
                  <span className="text-[#000000] text-lg">•</span>
                  <span className="text-[#000000] text-sm">{item.timing}</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={item.profilePic}
                    alt={item.username}
                    className="w-[34px] h-[34px]  rounded-full object-cover"
                  />
                  <span className="text-[#000000] text-[15px]">
                    {item.username}
                  </span>
                </div>
                <div className="text-sm text-[#0000000]">{item.about}</div> */}

      {/* {item.state === "new" ? (
                  <div className=" bg-[#6E4E37] text-white text-sm font-medium px-2 py-1 rounded-md">
                    NEW
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SearchBar;
