import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

import { LuArchive, LuSquareUserRound } from "react-icons/lu";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegHeart,
  FaRegComment,
  FaHeart,
} from "react-icons/fa6";
import { BsGrid3X3 } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiUserPlus } from "react-icons/bi";
import getAPI from "../../../../src/api/getAPI";
import postAPI from "../../../../src/api/postAPI";
import putAPI from "../../../../src/api/putAPI";
import { toast } from "react-toastify";

const myUser = {
  userId: 21345,
};

const user = {
  live: false,
  role: "Artist",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, est laborm.",
  website: "artsays.com",
  profilePicture:
    "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
  posts: 200,
  followers: "12M",
  following: 500,
  postData: [
    {
      id: 1,
      img: "https://cdn.pixabay.com/photo/2016/12/15/20/21/texture-1909992_1280.jpg",
      bio: `Home Bombay , mending chairs and frames....
Next up we fund some costume to create illusion
.
.
.
photographed by #siddharth
#art #artist`,
      comments: [
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "nice one❤️❤️",
        },
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "great💕💕💕",
        },
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "nice 😍😍",
        },
        {
          pimg: "https://static.vecteezy.com/system/resources/previews/055/281/758/non_2x/male-avatar-illustration-for-profile-or-projects-vector.jpg",
          username: "makeupbyraza",
          verified: true,
          comment: "🤞🤞🤞",
        },
      ],
      likes: 125432,
      date: "12 july",
    },
    {
      id: 2,
      img: "https://media.istockphoto.com/id/465579815/photo/romantic-venice.jpg?s=612x612&w=0&k=20&c=-PXOyIin6LQbO6t1LfmkUAtiCSlfqz2SmvusjnGcRNI=",
      bio: `Home Bombay , mending chairs and frames....
Next up we fund some costume to create illusion
.
.
.
photographed by #siddharth
#art #artist`,
      comments: [],
      likes: 125432,
      date: "12 july",
    },
    {
      id: 3,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMUR12eDixQtBdJRoadxu2Xm3yJ5PVPfE0A&s",
      bio: `Home Bombay , mending chairs and frames....
Next up we fund some costume to create illusion
.
.
.
photographed by #siddharth
#art #artist`,
      comments: [],
      likes: 125432,
      date: "12 july",
    },
  ],
  saveData: [
    "https://img.freepik.com/free-photo/artist-painting-studio_1303-11413.jpg?semt=ais_hybrid&w=740",
    "https://plus.unsplash.com/premium_photo-1682125164600-e7493508e496?fm=jpg&q=60&w=3000",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMUR12eDixQtBdJRoadxu2Xm3yJ5PVPfE0A&s",
    "https://thumbs.dreamstime.com/b/paintography-relaxed-african-man-combined-double-exposure-art-techniques-hand-drawn-paintings-profile-portrait-young-111428954.jpg",
  ],
  sellingItem: [
    {
      owner: "Medival Sculptures",
      img: "https://m.media-amazon.com/images/I/61BbMLF9HuL._UF894,1000_QL80_.jpg",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
    {
      owner: "Medival Sculptures",
      img: "https://doxzoo.com/blog/wp-content/uploads/2022/12/Untitled-design-2022-12-13T103112.260-1024x576.jpg",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
    {
      owner: "Medival Sculptures",
      img: "https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/105654/247110/1682023647171_women_selling_fruits__92049.1686996769.jpg?c=2",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
  ],
};

const Profile = () => {
  const location = useLocation();
  const Navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId"); // 👈 logged-in user
  const userType= localStorage.getItem("userType");
  const [users, setUsers] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentSettings, setCommentSettings] = useState(null);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [products, setProducts]=useState([]);

 // helper: normalize array -> [ids]
const toIdArray = (arr) =>
  Array.isArray(arr)
    ? arr.map(x => (typeof x === "string" ? x : x?._id)).filter(Boolean)
    : [];

// helper: avoid needless setState loops
const sameIds = (a, b) => {
  if (a.length !== b.length) return false;
  const sa = [...a].sort().join(",");
  const sb = [...b].sort().join(",");
  return sa === sb;
};
  // 👇 Take userId from state if available, otherwise fallback to localStorage
  const viewedUserId = location.state?.userId || loggedInUserId;
  useEffect(() => {
    if (!viewedUserId || !userType) return;
  
    let cancelled = false;
    (async () => {
      try {
        if (userType === "Seller") {
          const res = await getAPI(`/auth/getsellartwork/${viewedUserId}`);
          const ids = toIdArray(res?.data?.artwork?.categoryOfArt);
          if (!cancelled) {
            setMainCategories(prev => (sameIds(prev, ids) ? prev : ids));
          }
        } else if (userType === "Artist") {
          const res = await getAPI(`/auth/getartistdetails/${viewedUserId}`);
          const ids = toIdArray(res?.data?.artCategories);
          if (!cancelled) {
            setMainCategories(prev => (sameIds(prev, ids) ? prev : ids));
          }
        } else if (userType === "Buyer") {
          const res = await getAPI(`/auth/getpreferences/${viewedUserId}`);
          const first = res?.data?.data?.preferredArtCategories?.[0]; 
    const ids = first ? toIdArray([first]) : [];
    if (!cancelled) {
      setMainCategories(prev => (sameIds(prev, ids) ? prev : ids));
    }
        }
      } catch (err) {
        console.error("Error loading categories:", err);
       
      }
    })();
  
    return () => { cancelled = true; };
  }, [viewedUserId, userType,mainCategories]);

    useEffect(() => {
      const fetchSuggestedUsers = async () => {
        try {

          if (!viewedUserId) return;

          const res = await getAPI(
            `/api/social-media/suggested-user-profile?userId=${viewedUserId}`,
            {
              userId: viewedUserId,
              userType,
              mainCategories, // can be array, backend should handle it
            }
          );
          // console.log("Suggested users fetched:", res?.data?.suggestedUsers);
          setUsers(res?.data?.suggestedUsers || []);
        } catch (error) {
          console.error("Error fetching suggested users:", error);
        }
      };
  
      fetchSuggestedUsers();
    }, []);

    const canUserComment = (profile, loggedInUserId) => {
  if (!profile || !loggedInUserId) return false;

  const allowFrom = profile.commentSettings?.allowCommentsFrom || "everyone";

  // Self: always allowed
  if (String(profile._id) === String(loggedInUserId)) return true;

  if (allowFrom === "everyone") return true;
  if (allowFrom === "followers") {
    return profile.followers.some((id) => String(id) === String(loggedInUserId));
  }
  if (allowFrom === "following") {
    return profile.following.some((id) => String(id) === String(loggedInUserId));
  }
  if (allowFrom === "mutual") {
    const isFollower = profile.followers.some((id) => String(id) === String(loggedInUserId));
    const isFollowing = profile.following.some((id) => String(id) === String(loggedInUserId));
    return isFollower && isFollowing;
  }
  return false;
};
const postProduct=()=>{

};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for userId:", viewedUserId);
        const res = await getAPI(
          `/api/social-media/profile/${viewedUserId}`,
          {},
          false,
          true
        );
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          setCommentSettings(res.data.profile.commentSettings || { allowCommentsFrom: "everyone", allowGifComments: true });

      // Check if logged in user can comment (frontend logic)
      const allowed = canUserComment(res.data.profile, loggedInUserId);
      setCanComment(allowed);
          setFollow(
  res.data.profile.followers
    .map((id) => id.toString()) // ensure all are strings
    .includes(String(loggedInUserId)) // ensure comparison is correct
);


         const apiUserId = res.data.profile.user?._id || res.data.profile.user || res.data.profile._id;

setIsMyProfile(String(loggedInUserId) === String(apiUserId));

console.log(isMyProfile);

          console.log(res.data.profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (viewedUserId) fetchProfile();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewedUserId, loggedInUserId]);
  
 useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ correct query param: ?userId=value
        const res = await getAPI(`/api/get-profileproduct?userId=${viewedUserId}`);

        // ✅ handle different response formats safely
        const data = res?.data?.data || res?.data || [];
        setProducts(data);
      } catch (error) {
        console.error("Error fetching profile products:", error);
      }
    };

    if (profile?.postProductsEnabled) {
      fetchProduct();
    }
  }, [viewedUserId, profile]);
  const [openComment, setOpenComment] = useState(false);
  const [onPosts, setOnPosts] = useState(true);
  const [onSave, setOnSave] = useState(false);
  const [onItem, setOnItem] = useState(false);
  const [onTag, setOnTag] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [follow, setFollow] = useState(false);
  const [suggestionOn, setSuggestionOn] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
    useEffect(() => {
    if (location.state?.onItem === true) {
      setOnItem(true);
      setOnPosts(false);
    }
  }, [location.state]);
  const handleFollowToggle = async (targetUserId, isFollowing) => {
    const userId = localStorage.getItem("userId");
  try {
    if (isFollowing) {
      
      await postAPI(`/api/social-media/unfollow/${targetUserId}`, { userId }, true, true);
    } else {
      
      await postAPI(`/api/social-media/follow/${targetUserId}`, { userId }, true, true);
    }

    setFollow(!follow);
    
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
  }
};
const [activeSection, setActiveSection] = useState(null); 

  const [activeIndex, setActiveIndex] = useState(null); // Replace activePost
  const reversedPosts = profile?.posts?.slice().reverse() || [];
  const reversedSaved = profile?.saved?.slice().reverse() || [];
  let activePost = null;

if (activeSection === "posts") {
  activePost = activeIndex !== null ? reversedPosts[activeIndex] : null;
} else if (activeSection === "saved") {
  activePost = activeIndex !== null ? reversedSaved[activeIndex] : null;
}

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleMoreClick = (id) => setMenuOpenId(id);
  const handleCancel = () => setMenuOpenId(null);
  
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeIndex]);
  // For swipe detection (mobile only)
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  // Handle swipe start
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  // Handle swipe end
  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(activePost?.comments || []);
  const handleAddComment = async (postId) => {
    if (!comment.trim()) return; // prevent empty comments

    try {
      const res = await postAPI(
        `/api/social-media/posts/${postId}/comments`,
        {
          userId: localStorage.getItem("userId"),
          text: comment,
        },
        false,
        true
      );

      if (res && !res.hasError) {
        setComments((prev) => [...prev, res.data.comment]); // add new comment
        setComment(""); // clear input
        toast.success("Comment added");
      } else {
        toast.error(res?.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Something went wrong");
    }
  };

  // Decide swipe direction
  const handleSwipe = () => {
    const swipeThreshold = 50; // minimum px to count as swipe
    if (touchStartX - touchEndX > swipeThreshold) {
      // 👉 swipe left → next image
      if (activeImageIndex < activePost.images.length - 1) {
        setActiveImageIndex((prev) => prev + 1);
      }
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // 👈 swipe right → prev image
      if (activeImageIndex > 0) {
        setActiveImageIndex((prev) => prev - 1);
      }
    }
  };

  const menuRef = useRef(null);

  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(activePost?.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [commentPanel, setComentPanel] = useState(false);

  // 🔹 Sync like state whenever post changes
  useEffect(() => {
    if (activePost) {
      setLike(activePost.likes?.includes(viewedUserId));
      setLikesCount(activePost.likes?.length || 0);
      setComments(activePost.comments || []);
      
     
    }
  }, [activePost, viewedUserId]);
const [isSaved, setIsSaved] = useState(
  activePost?.saved?.includes(viewedUserId) || false
);
const handleSave = async (postId) => {
  try {
    const res = await postAPI(
      `/api/social-media/posts/${postId}/saveUnsave`,
      { userId: viewedUserId },
      false,
      true
    );

    if (res && !res.hasError) {
      setProfile((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          // ✅ Update saved list from backend
          saved: res.data.savedPosts,

          // ✅ Also update posts array so activePost reflects change
          posts: prev.posts.map((post) =>
            post._id === postId
              ? { ...post, isSaved: !post.isSaved }
              : post
          ),
        };
      });

      toast.success(res.data.message);
    } else {
      toast.error(res?.message || "Failed to save/unsave");
    }
  } catch (error) {
    console.error("Error saving/unsaving post:", error);
    toast.error("Something went wrong");
  }
};
useEffect(() => {
    if (location.state?.updatedUsers) {
      setUsers(location.state.updatedUsers); // ✅ sync updated list
    }
  }, [location.state]);



  const handleLike = async (postId) => {
    try {
      const res = await postAPI(
        `/api/social-media/posts/${postId}/likeUnlike`,
        { userId: viewedUserId },
        false,
        true
      );

      if (res && !res.hasError) {
        // ✅ Always use backend response
        setLike(res.data.likes.includes(viewedUserId));
        setLikesCount(res.data.likes.length);
      } else {
        toast.error(res?.message || "Failed to like/unlike");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Something went wrong");
    }
  };
  
const handleBlockUser = async () => {
  const loggedInUserId = localStorage.getItem("userId");
  if (!loggedInUserId || !viewedUserId) return;

  try {
    const res = await putAPI(
      `/api/social-media/block-unblock`,
      { userId: loggedInUserId, targetUserId: viewedUserId },
      true,
      true
    );

    if (res?.data?.success) {
      console.log(res.data.message); 
      

      
      if (res.data.isBlocked) {
        
        Navigate("/social-media/"); 
      }
    }
  } catch (err) {
    console.error("Error blocking/unblocking user:", err);
  }
};
// Detect "@" and fetch mention suggestions
const handleProfileCommentChange = async (e) => {
  e.preventDefault();
  
  const value = e.target.value;
  setComment(value);

  const match = value.match(/@(\w*)$/); // last word after @
  if (match) {
    const query = match[1];
    if (query.length > 0) {
      try {
        const res = await getAPI(
          `/api/social-media/mention?q=@${query}&userId=${loggedInUserId}`,
          {},
          true,
          true
        );
        setMentionSuggestions(res.data.users || []);
        setShowMentions(true);
      } catch (err) {
        console.error("Mention fetch error:", err);
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

// Insert mention into input
const handleSelectMentionProfile = (username) => {
  const newText = comment.replace(/@\w*$/, `@${username} `);
  setComment(newText);
  setMentionSuggestions([]);
  setShowMentions(false);
};


  const cancelPromotion = async (postId) => {
  const userId = localStorage.getItem("userId");
  if (!postId || !userId) return toast.error("Missing post ID or user ID");

  try {
    setIsCancelling(true);
    const res = await postAPI("/api/social-media/posts/promote/cancel", { postId, userId }, true, true);

    if (res?.data?.success) {
      toast.success("Promotion cancelled successfully!");

      // 🧠 Update promotion status in profile.posts
      setProfile((prev) => {
        if (!prev) return prev;
        const updatedPosts = prev.posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                isPromoted: false,
                promotionDetails: {
                  ...p.promotionDetails,
                  status: "completed",
                },
              }
            : p
        );
        return { ...prev, posts: updatedPosts };
      });
    } else {
      toast.error(res?.data?.message || "Failed to cancel promotion");
    }
  } catch (error) {
    toast.error("Server error while cancelling promotion");
    console.error(error);
  } finally {
    setIsCancelling(false);
  }
  };


  return (
    <div
      className={`${
        activePost ? "w-[80%]" : ""
      } lg:w-[56%] w-full lg:mt-8 mt-4`}
    >
      {/* Active Post Popup for all screen size*/}
      {activePost && (
        <div className=" absolute inset-0 z-[9999] bg-[#000000] w-full bg-opacity-40 flex  justify-center items-center w-full">
          {/* Close Button */}
          <button
            className="absolute lg:top-20 top-10 lg:right-40 right-10 text-4xl font-bold z-50 mt-3 lg:mr-12"
            onClick={() => setActiveIndex(null)}
          >
            <i className="ri-close-line text-[#000000]"></i>
          </button>

          {/* Left Arrow (previous post) */}
          {activeIndex > 0 && (
            <button
              className="absolute bg-gray-600 lg:p-2 p-1 w-10 h-10 lg:w-12 lg:h-12  rounded-full lg:left-10 left-6 -translate-x-1/3 top-1/2 transform -translate-y-1/2 text-gray-100 lg:text-4xl text-xl z-50"
              onClick={() => setActiveIndex((prev) => prev - 1)}
            >
              <i className="ri-arrow-left-wide-fill "></i>
            </button>
          )}

          {/* Popup Layout */}
          <div className="lg:bg-white w-[73%] lg:h-[72vh] h-[56vh] rounded-lg overflow-hidden flex relative flex lg:flex-row flex-col">
            {/* Left Side (Image Viewer) */}
            <div className="lg:w-[60%] lg:h-full h-[80%] w-full bg-black flex items-center justify-center relative ">
              {activePost.images?.length > 0 ? (
                <>
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${activePost.images[activeImageIndex]}`}
                    alt="post"
                    className="h-full w-full "
                  />

                  {/* Image Navigation Arrows */}
                  {activeImageIndex > 0 && (
                    <button
                      className="absolute sm:left-4 left-2 w-8 h-8 sm:h-11 sm:w-11 top-1/2 z-50 transform -translate-y-1/2 bg-gray-100 text-[#000000] opacity-80 p-1 rounded-full"
                      onClick={() => setActiveImageIndex((prev) => prev - 1)}
                    >
                      <i className="ri-arrow-left-s-line lg:text-3xl sm:text-2xl  text-lg"></i>
                    </button>
                  )}
                  {activeImageIndex < activePost.images.length - 1 && (
                    <button
                      className="absolute sm:right-4 right-2 w-8 h-8 sm:h-11 sm:w-11 top-1/2 transform -translate-y-1/2 z-50 bg-gray-100 text-[#000000] opacity-80 p-1 rounded-full"
                      onClick={() => setActiveImageIndex((prev) => prev + 1)}
                    >
                      <i className="ri-arrow-right-s-line lg:text-3xl sm:text-2xl text-lg"></i>
                    </button>
                  )}

                  {/* Image Indicators (dots) */}
                  {activePost.images.length > 1 && (
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
                  )}
                </>
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>

            {/* Right Side (Post Content) */}
<div className="lg:w-[40%] w-full flex flex-col justify-between gap-6 py-2 px-3 bg-[#ffffff] overflow-y-scroll ">
  
  {/* User Info */}
  <div className="flex flex-col gap-6 ">
    <div className="flex items-center justify-between relative">
      <div className="flex items-center gap-2">
        <img
          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile?.profilePhoto}`}
          alt="profile"
          className="w-11 h-11 rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-[16px] text-[#000000]">
            {profile?.username}
                  {profile.verified?.length > 0 && (
    <img
      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.verified[profile.verified.length - 1]?.badgeImage}`}
      className="inline-block ml-1 w-6 h-6 object-contain"
      alt={profile.verified[profile.verified.length - 1]?.badgeName || "badge"}
      title={profile.verified[profile.verified.length - 1]?.badgeName}
    />
  )}
          </span>
          <span className="text-xs text-gray-500">
            {activePost.location}
          </span>
        </div>
      </div>
      <button onClick={() => handleMoreClick(activePost._id)}>
        <i className="ri-more-fill font-semibold text-2xl text-[#000000]"></i>
      </button>
    </div>

    {/* Profile with Caption */}
    <div className="flex flex-col hidden lg:flex">
      <div className="flex items-center gap-2">
        <img
          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile?.profilePhoto}`}
          alt="profile"
          className="w-11 h-11 rounded-full"
        />
        <span className="font-semibold text-[16px] text-[#000000]">
          {profile?.username}
                     {profile.verified?.length > 0 && (
    <img
      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.verified[profile.verified.length - 1]?.badgeImage}`}
      className="inline-block ml-1 w-6 h-6 object-contain"
      alt={profile.verified[profile.verified.length - 1]?.badgeName || "badge"}
      title={profile.verified[profile.verified.length - 1]?.badgeName}
    />
  )}
        </span>
      </div>

      {/* Caption */}
      <p className="my-4 text-[14px] whitespace-pre-line break-all">
        {activePost.caption || "No caption"}
      </p>

      
    </div>
  </div>
  {/* Comments */}
      <div className="lg:flex hidden flex flex-col gap-3 overflow-y-auto max-h-auto">
        {comments.length > 0 ? (
          comments
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
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold">
                      {comment?.user?.username}
                    </span>
                    {comment?.user?.verified && (
                      <i className="ri-verified-badge-fill text-blue-500 text-xs"></i>
                    )}
                  </div>
                  <p className="text-sm">{comment?.text}</p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}
      </div>
      {/* action and comment */}
 <div className="flex flex-col gap-4"> 
 {/* Actions + Likes */}
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {like ? (
          <FaHeart
            className="text-xl text-red-500 cursor-pointer"
            onClick={() => handleLike(activePost._id)}
          />
        ) : (
          <FaRegHeart
            className="text-xl text-[#000000] cursor-pointer"
            onClick={() => handleLike(activePost._id)}
          />
        )}

        <FaRegComment
          className="text-xl text-[#000000] font-medium cursor-pointer"
          onClick={() => setOpenComment(true)}
        />
        <IoPaperPlaneOutline className="text-xl text-[#000000] font-medium cursor-pointer" />
      </div>

      <div className="flex items-center gap-3">
        {isMyProfile && activePost.isPromoted===false  && (
          <Link to={"/social-media/profile/promote-post"} state={{ postId: activePost._id , postImage: activePost.images[0]}}>
            <button className="px-2 py-0.5 bg-[#48372D] text-white text-base rounded-lg">
              Promote post
            </button>
          </Link>
        )}
       {activePost.isPromoted && (
  <button
    className="px-2 py-0.5 bg-[#48372D] text-white text-base rounded-lg"
    onClick={() => cancelPromotion(activePost._id)}
    disabled={isCancelling}
  >
    {isCancelling ? "Cancelling..." : "Cancel Promotion"}
  </button>
)}


          
       
        {activePost?.isSaved ? (
          <FaBookmark
            className="text-[23px] text-[#000000] cursor-pointer"
            onClick={() => handleSave(activePost._id)}
          />
        ) : (
          <FaRegBookmark
            className="text-[23px] text-[#000000] cursor-pointer"
            onClick={() => handleSave(activePost._id)}
          />
        )}
      </div>
    </div>

    <p className="text-sm font-medium mt-1">{likesCount} likes</p>
    {activePost.comments.length > 0 && (
  <div
    className="lg:hidden text-[13px] font-light cursor-pointer"
    onClick={() => setComentPanel(true)}   // ✅ open panel on click
  >
    View all {activePost.comments.length} comments
  </div>
)}

  </div>
  

{canComment ? (
  <div
    className={`${
      openComment ? "flex" : "hidden lg:flex"
    } items-center gap-2 pt-2 relative`}
  >
    {/* Suggestions dropdown */}
    {showMentions && mentionSuggestions.length > 0 && (
      <div className="absolute bottom-10 left-0 w-full bg-white border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
        {mentionSuggestions.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectMentionProfile(user.username)}
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

    <input
      type="text"
      placeholder="Add a comment..."
      value={comment}
      onChange={handleProfileCommentChange}  // 👈 use new handler
      className="flex-grow outline-none text-sm placeholder:text-[14px] placeholder:text-[#696969]"
    />
    <button
      className="text-[#6F4D34] font-semibold"
      onClick={() => handleAddComment(activePost._id)}
    >
      Post
    </button>
  </div>
) : (
  <p className="text-gray-500 text-sm italic">Comments are restricted</p>
)}
  </div>
</div>

          </div>

          {/* Right Arrow (next post) */}
          {activeIndex < reversedPosts.length - 1 && (
            <button
              className="absolute bg-gray-600 lg:p-2 p-1 w-10 h-10 lg:w-12 lg:h-12  rounded-full lg:right-10 right-3   top-1/2 transform -translate-y-1/2 text-gray-100 lg:text-4xl  text-xl z-50"
              onClick={() => setActiveIndex((prev) => prev + 1)}
            >
              <i className="ri-arrow-right-wide-fill "></i>
            </button>
          )}
        </div>
      )}
      {/* commentpanel that only appear on small screen */}
      {activePost && commentPanel && (
        
          <div className="fixed inset-0 z-[9999] w-full h-full flex flex-col bg-[#ffffff] lg:hidden">
            {/* back button with title */}
            <div className="w-full flex items-center justify-between p-3 border-b">
              <i
                className="ri-arrow-left-s-line text-2xl"
               onClick={() => setComentPanel(false)}
              ></i>
              <span className="font-semibold text-xl text-center">Comments</span>
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
                  </span>
                  <p className="whitespace-pre-wrap break-words break-all text-sm">
                    {activePost.caption}
                  </p>
                </div>
              </div>

              {/* Comments */}
              {/* Comments */}
<div className="flex flex-col gap-3 p-3">
  {comments.length > 0 ? (
    comments.slice().reverse().map((comment, idx) => (
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

              {/* Add Comment */}

{canComment ? (
  <div className="flex flex-col relative">
    {/* Suggestions dropdown */}
    {showMentions && mentionSuggestions.length > 0 && (
      <div className="absolute bottom-12 left-0 w-full bg-[#FAF9F6] border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
        {mentionSuggestions.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectMentionProfile(user.username)}
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

    {/* Input + Post button */}
    <div className="flex justify-between p-3 items-center gap-2 pt-2">
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={handleProfileCommentChange}  // 👈 same handler as large screen
        className="flex-grow outline-none text-sm placeholder:text-[14px] placeholder:text-[#696969]"
      />
      <button
        className="text-blue-500 text-[15px] font-semibold"
        onClick={() => handleAddComment(activePost._id)}
      >
        Post
      </button>
    </div>
  </div>
) : (
  <p className="text-gray-500 text-sm italic p-3">
    Comments are restricted
  </p>
)}

          </div>
      )}

      <div
        className={` w-full text-[#2d1b0f] flex flex-col gap-8 ${
          activePost ? "bg-black bg-opacity-50" : ""
        }`}
      >
        {/* profile header for large screen*/}
        {profile ? (
          <div className="hidden sm:flex items-start gap-6 lg:gap-6 w-full sm:mb-2">
            <div className="relative w-20 h-20 sm:w-[186px] sm:h-[186px] shrink-0">
              {user.live ? (
                <div className="p-[3px] sm:p-[6px] rounded-full bg-gradient-to-r from-[#6E300C] via-[#F1620E] to-[#6E300C] w-full h-full">
                  <div className="w-full h-full bg-white rounded-full overflow-hidden">
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.profilePhoto}`}
                      alt={profile.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 px-2 py-0.5 text-white text-xl sm:text-sm font-semibold bg-gradient-to-r from-[#F1620E] to-[#72320C] rounded-tl-[10px] rounded-tr-[10px]">
                    LIVE
                  </div>
                </div>
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.profilePhoto}`}
                  alt={profile.username}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-[#000000]">
                  {profile.username}
                   {profile.verified?.length > 0 && (
    <img
      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.verified[profile.verified.length - 1]?.badgeImage}`}
      className="inline-block ml-1 w-6 h-6 object-contain"
      alt={profile.verified[profile.verified.length - 1]?.badgeName || "badge"}
      title={profile.verified[profile.verified.length - 1]?.badgeName}
    />
  )}
                </h1>
                {/* button only enables when this profile is mine */}
                {isMyProfile ? (
                  // 👤 Owner sees Edit + Boost Profile
                  <div
                    className="flex gap-2 items-center relative"
                    ref={menuRef}
                  >
                    <Link to={"/social-media/setting/"}>
                      <button className="hidden sm:flex px-2.5 py-1 bg-[#6F4D34] text-white rounded-md text-base">
                        Edit Profile
                      </button>
                    </Link>
                 
                    <button
                      className="text-xl"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      <i className="ri-more-fill"></i>
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-full flex flex-col items-center mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                       <Link to={""}>
                         <button className="bg-gray-100 font-medium w-full px-3 py-1.5 hover:bg-gray-200 rounded-t-lg"
                        >
                          Setting and privacy
                        </button>
                       </Link>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button className="bg-gray-100 w-full font-medium px-3 py-1.5 rounded-b-lg hover:bg-gray-200">
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // 👥 Visitor sees Follow + User icon + Menu
                  <div
                    className="flex gap-2 items-center relative"
                   
                  >
                    <button
                      onClick={() => handleFollowToggle(viewedUserId, follow)}
                      className={`px-2 py-1 rounded-md text-[16px] font-bold ${
                        follow
                          ? "bg-white text-[#6F4D34] border-[1px] border-[#6F4D34]"
                          : "bg-[#6F4D34] text-white"
                      }`}
                    >
                      {follow ? "Unfollow" : "Follow"}
                    </button>

                    {follow && (
                      <button className="flex items-center gap-1 px-2 py-1 bg-[#6F4D34] font-bold text-white rounded-md text-base">
                        join
                      </button>
                    )}
                    <button
                      className="flex items-center gap-1 px-2 py-1 bg-[#6F4D34] font-bold text-white rounded-md text-base"
                      onClick={() => setSuggestionOn((prev) => !prev)}
                    >
                      <BiUserPlus className="text-xl" />
                    </button>
                    <button
                      className="text-xl"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      <i className="ri-more-fill"></i>
                    </button>
                    {showMenu && (
  <div
    className="absolute right-0 top-full flex flex-col items-center mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50"
    onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
  >
    <button
      className="bg-gray-100 font-medium w-full px-3 py-1.5 hover:bg-gray-200 rounded-t-lg"
      onClick={() => {
        console.log("clicked");
        handleBlockUser();
       // ✅ close menu manually
      }}
    >
      Block
    </button>
    <hr className="w-[80%] border-t border-gray-800" />
    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 hover:bg-gray-200">
      Report
    </button>
    <hr className="w-[80%] border-t border-gray-800" />
    <button className="bg-gray-100 w-full font-medium px-3 py-1.5 hover:bg-gray-200">
      Share to
    </button>
    <hr className="w-[80%] border-t border-gray-800" />
    <button
      className="bg-gray-100 w-full font-medium px-3 py-1.5 rounded-b-lg hover:bg-gray-200"
      onClick={() => setShowMenu(false)} // ✅ close on cancel
    >
      Cancel
    </button>
  </div>
)}

                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex sm:gap-8 gap-6 text-base">
                <p className="text-[#6E4E37] font-medium">
                  <span className="font-bold text-[#48372D]">
                    {profile.postCount}
                  </span>{" "}
                  Posts
                </p>
                <p className="text-[#6E4E37] font-medium">
                  <span className="font-bold text-[#48372D]">
                    {profile.followersCount}
                  </span>{" "}
                  Followers
                </p>
                <p className="text-[#6E4E37] font-medium">
                  <span className="font-bold text-[#48372D]">
                    {profile.followingCount}
                  </span>{" "}
                  Following
                </p>
              </div>

              {/* Bio */}
              <div className="text-sm sm:mt-1.5 flex flex-col justify-between">
                <h2 className="font-semibold text-lg text-[#000000]">
                  {profile.firstName}
                </h2>
                <p className="text-[#6E4E37] font-2xl">{profile.role}</p>
                <p className="text-[#000000] font-medium">{profile.bio}</p>
                <div className="flex items-center gap-2 text-[#3d2b1f]">
                  <i className="ri-link-m text-[#000000] font-medium"></i>
                  {profile.website && (
                    <a
                      href={
                        profile.website?.startsWith("http")
                          ? profile.website
                          : `https://${profile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-[#000000] font-medium"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>profile loading</p>
        )}

        {/* profile header for smaall screen */}
        {profile ? (
          <div className="sm:hidden flex flex-col  gap-3 lg:gap-8 w-full ">
            <div className="flex items-center justify-between">
              <div className="flex justify-between gap-2 items-center">
                {user.live ? (
                  <div className="relative w-[90px] h-[90px] p-[4px] bg-gradient-to-r from-[#6E300C] via-[#F1620E] to-[#6E300C] rounded-full overflow-visible">
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.profilePhoto}`}
                      className="w-full h-full rounded-full object-cover"
                      alt="profile-pic"
                    />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-white text-[10px] font-semibold bg-gradient-to-r from-[#F1620E] to-[#72320C] rounded-tl-[10px] rounded-tr-[10px]">
                      LIVE
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.profilePhoto}`}
                    className="w-[90px] h-[90px] rounded-full object-cover"
                    alt={profile.username}
                  />
                )}

                <h1 className="text-3xl font-semibold text-[#000000]">
                  {profile.username}
                        {profile.verified?.length > 0 && (
    <img
      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${profile.verified[profile.verified.length - 1]?.badgeImage}`}
      className="inline-block ml-1 w-6 h-6 object-contain"
      alt={profile.verified[profile.verified.length - 1]?.badgeName || "badge"}
      title={profile.verified[profile.verified.length - 1]?.badgeName}
    />
  )}
                </h1>
              </div>
              <div className="flex gap-2 items-center relative" ref={menuRef}>
                <button
                  className="text-xl"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <i className="ri-more-fill"></i>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full flex flex-col items-center mt-2 w-40 bg-gray-200 rounded-md z-50">
                    {isMyProfile ? (
                      <>
                        <button className="bg-gray-100 font-medium w-full px-1 py-1 hover:bg-gray-200 rounded-t-lg">
                          Setting and privacy
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200">
                          Login activity
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button className="bg-gray-100 w-full font-medium px-1 py-1 rounded-b-lg hover:bg-gray-200">
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200 rounded-t-lg"
                          onClick={() => {
        console.log("clicked");
        handleBlockUser();

       // ✅ close menu manually
      }}>
                          Block
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200">
                          Report
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button className="bg-gray-100 w-full font-medium px-1 py-1 hover:bg-gray-200">
                          Share to
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button className="bg-gray-100 w-full font-medium px-1 py-1 rounded-b-lg hover:bg-gray-200">
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              {/* Stats */}
              <div className="flex justify-between sm:gap-8 gap-6 text-base">
                <p className="text-[#6E4E37] text-lg font-medium">
                  <span className="font-bold text-[#48372D]">
                    {profile.postCount}
                  </span>{" "}
                  Posts
                </p>
                <p className="text-[#6E4E37] text-lg  font-medium">
                  <span className="font-bold text-[#48372D]">
                    {profile.followersCount}
                  </span>{" "}
                  Followers
                </p>
                <p className="text-[#6E4E37] text-lg font-medium">
                  <span className="font-bold text-[#48372D]">
                    {profile.followingCount}
                  </span>{" "}
                  Following
                </p>
              </div>

              {/* Bio */}
              <div className="text-sm sm:mt-1.5 flex flex-col justify-between">
                <h2 className="font-semibold text-lg text-[#000000]">
                  {profile.firstName}
                </h2>
                <p className="text-[#6E4E37]">{profile.role}</p>
                <p className="text-[#000000] font-medium">{profile.bio}</p>
                <div className="flex items-center gap-2 text-[#3d2b1f]">
                  <i className="ri-link-m text-[#000000] font-medium"></i>
                  {profile.website && (
                    <a
                      href={
                        profile.website?.startsWith("http")
                          ? profile.website
                          : `https://${profile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-[#000000] font-medium"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p></p>
        )}

        {isMyProfile ? (
          <div className="sm:hidden flex justify-between items-center ">
            <Link to={"/social-media/setting/"}>
              <button className="px-8 py-2 bg-[#6F4D34] text-white rounded-md text-lg">
                Edit Profile
              </button>
            </Link>
            <Link to={"/social-media/profile/promote-profile"}>
              <button className="px-8 py-2 bg-[#6F4D34] text-white rounded-md text-lg">
                Boost Profile
              </button>
            </Link>
          </div>
        ) : (
          <div className="sm:hidden flex gap-6 justify-between items-center ">
            <button
              onClick={() => handleFollowToggle(viewedUserId, follow)}
              className={`flw-btn rounded-md text-[16px] font-bold transition ${
                follow
                  ? "bg-white text-[#6F4D34] border-[1px] border-[#6F4D34]"
                  : "bg-[#6F4D34] text-white"
              }`}
            >
              {follow ? "Unfollow" : "Follow"}
            </button>

            {follow && (
              <button className=" bg-[#6F4D34] text-white px-4 py-2 font-bold rounded-md text-lg">
                Join
              </button>
            )}
            <button
              className="flex items-center gap-2 px-2 py-2 bg-[#6F4D34] text-white rounded-md text-lg"
              onClick={() => setSuggestionOn((prev) => !prev)}
            >
              <BiUserPlus className="text-2xl" />
            </button>
          </div>
        )}

        {/* suggeted for you */}
        {suggestionOn && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-2 mb-4">
              <p className="text-[18px] text-[#000000] ">Suggested for you</p>
              <button className="text-[18px] text-[#000000] cursor-pointer"
              onClick={()=>Navigate("/social-media/profile/suggestion", {
      state: { users, viewedUserId},
    })}>See all</button>
            </div>

            {/* Scrollable Suggested Users */}
            <div className="flex gap-4 overflow-x-auto px-2 sm:pb-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="sm:min-w-[200px] sm:max-w-[200px] max-w-[100px] min-w-[100px] flex-shrink-0 flex flex-col  justify-between border rounded-sm p-3  relative"
                >
                  <button className="absolute sm:top-2 top-0 right-2 text-xl text-gray-400 hover:text-black">
                    ×
                  </button>
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user?.profilePhoto}` || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
                    alt={user.username}
                    className="sm:w-20 sm:h-20 w-[55px] h-[55px] rounded-full object-cover mx-auto mb-2"
                  />
                  <p className="text-center font-semibold text-[12px] text-[#000000]">
                    {user.username}
                  </p>
                  <p className="text-center text-[#777777] text-[10px]">
                    {user.role}
                  </p>
                  <hr className="sm:mt-4 mt-2 mb-1" />
                  <button className="block w-full sm:py-1 text-center text-[16px] font-bold text-[#48372D] "
                  onClick={() => handleFollowToggle(user._id, user.isFollowing)}>
                  
                     {user.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider Tabs */}
        <div className="flex justify-around items-center sm:mb-1 mx-1">
          <button
            onClick={() => {
              setOnPosts(true);
              setOnSave(false);
              setOnItem(false);
              setOnTag(false);
            }}
            className={`${
              onPosts ? "bg-[#48372D] text-white rounded-full py-1 px-5 " : ""
            } p-3`}
          >
            <BsGrid3X3 className="text-2xl" />
          </button>
          {isMyProfile && (
            <button
            onClick={() => {
              setOnPosts(false);
              setOnSave(true);
              setOnItem(false);
              setOnTag(false);
            }}
            className={`${
              onSave ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
            } p-3`}
          >
            <FaRegBookmark className="text-2xl" />
          </button>
          )}
          {userType!=='Buyer'&&(
             <button
            onClick={() => {
              setOnPosts(false);
              setOnSave(false);
              setOnItem(true);
              setOnTag(false);
            }}
            className={`${
              onItem ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
            } p-3`}
          >
            <LuArchive className="text-2xl" />
          </button>
          )}
          <button
            onClick={() => {
              setOnPosts(false);
              setOnSave(false);
              setOnItem(false);
              setOnTag(true);
            }}
            className={`${
              onTag ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
            } p-3`}
          >
            <LuSquareUserRound className="text-2xl" />
          </button>
        </div>

        {/* post tabs */}
        {onPosts && (
          <div className="grid grid-cols-3 sm:gap-4 gap-1 w-full">
            {reversedPosts.map((post, index) => (
              <div
                key={post._id}
                 onClick={() => {
    setActiveIndex(index);
    setActiveSection("posts");
  }} // ✅ use index directly
                className="relative cursor-pointer"
              >
                {post.images?.length > 0 ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.images[0]}`}
                    alt={`post-${post._id}`}
                    className="sm:h-[240px] sm:w-full h-[120px]  rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center text-[#000000] w-full h-[120px] sm:h-[240px] rounded-md">
                    No image
                  </div>
                )}

                {post.images?.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 p-1 rounded">
                    <i className="ri-checkbox-multiple-blank-line text-white text-lg"></i>
                  </div>
                )}

                {post.isMultiple && (
                  <div className="absolute top-2 left-2 bg-black/60 p-1 rounded">
                    <i className="ri-checkbox-multiple-blank-line text-white text-lg"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Saved */}
  {onSave && (
  <div className="grid grid-cols-3 gap-1 sm:gap-4 w-full relative">
    {profile.saved?.slice().reverse().map((post, index) => (
      <div key={post._id} className="relative">
        <img
           onClick={() => {
    setActiveIndex(index);
    setActiveSection("saved");
  }}
          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${post.images[0]}`}
          alt={`post-${index}`}
          className="h-[120px] sm:h-[240px] sm:w-full object-cover rounded-md cursor-pointer"
        />

        {/* Multi-image icon */}
        {post.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 p-1 rounded">
            <i className="ri-checkbox-multiple-blank-line text-gray-100 text-lg"></i>
          </div>
        )}
      </div>
    ))}
  </div>
)}
        {/* Selling Items */}
      {/* Selling Items */}
{userType !== "Buyer" && onItem && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
    {products.length > 0 ? (
      products.map((item, index) => (
        <div
          key={index}
          className="bg-[#FEE2CC] rounded-lg overflow-hidden text-white flex flex-col shadow-lg"
        >
          {/* Image Section */}
          <div className="h-[200px] bg-[#FEE2CC]">
            <img
              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.mainImage}`}
              alt={item.productName}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Content Section */}
          <div className="selling-div flex flex-col justify-between min-h-[140px] bg-[#48372D] p-4">
            <div className="flex flex-col justify-between">
              <h3 className="font-semibold text-lg truncate">
                {item.productName}
              </h3>
              <p className="text-[10px] text-[#B7B7B7] mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            <hr className="mt-4 w-full text-[#A8A8A8]" />

            {/* ✅ Price Section with old crossed-out price */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold text-white">
                    ₹ {item.finalPrice?.toLocaleString("en-IN") || 0}
                  </span>
                  {item.marketPrice && (
                    <span className="text-sm text-gray-300 line-through">
                      ₹ {item.sellingPrice?.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {item.discount > 0 && (
                  <span className="text-xs text-green-400 font-medium mt-[2px]">
                    Save {item.discount}% off
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
               
                  <button className="text-sm bg-white text-[#6E4E37] px-3 py-[2px] rounded-md font-medium hover:bg-[#f8f8f8] transition">
                    View
                  </button>
                 {isMyProfile&& (
                  <button className="text-sm bg-white text-[#6E4E37] px-3 py-[2px] rounded-md font-medium hover:bg-[#f8f8f8] transition"
                  onClick={()=>(postProduct({productId:item._id,image:item.mainImage,name:item.productName,bio:item.description,price:item.finalPrice}))}>
                    Post
                  </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-600 col-span-full">
        No approved products found.
      </p>
    )}
  </div>
)}

        {/* Tagged */}
        {onTag && (
          <div className="text-center text-gray-500">No tagged posts</div>
        )}
      </div>
    </div>
  );
};

export default Profile;