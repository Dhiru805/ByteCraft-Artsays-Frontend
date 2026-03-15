import React, { useState, useRef, useEffect } from "react";
import { getImageUrl } from '../../../utils/getImageUrl';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdHistory } from "react-icons/md";
import { LuArchive, LuSquareUserRound } from "react-icons/lu";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegHeart,
  FaRegComment,
  FaHeart,
} from "react-icons/fa6";
import { BsGrid3X3 } from "react-icons/bs";
import { IoPaperPlane } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiUserPlus } from "react-icons/bi";
import getAPI from "../../../../src/api/getAPI";
import postAPI from "../../../../src/api/postAPI";
import putAPI from "../../../../src/api/putAPI";
import deleteAPI from "../../../../src/api/deleteAPI";
import { toast } from "react-toastify";
import { FaCheckCircle, FaGlobe, FaLock, FaEye, FaThumbsUp, FaComment, FaCalendarAlt, FaPlay, FaEllipsisH, FaTrash } from "react-icons/fa";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import { Helmet } from "react-helmet-async";


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

const Profile = ({ shareprofileid }) => {
  const location = useLocation();
  const Navigate = useNavigate();
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const [users, setUsers] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentSettings, setCommentSettings] = useState(null);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [products, setProducts] = useState([]);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [reportPopupOpen, setReportPopupOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");
  const [sharePost, setSharePost] = useState(false);
  const [shareProfile, setShareProfile] = useState(false);
  const [collaboratedPosts, setCollaboratedPosts] = useState([]);
  const [tipUser, setTipUser] = useState(null);
  const [tipPopupOpen, setTipPopupOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(40);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const productPosts =
    profile?.posts?.filter(
      (pro) => pro.forProduct && pro.forProduct?.status === "Approved"
    ) || [];
  const normalPosts = profile?.posts?.filter((pro) => !pro.forProduct) || [];

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };


  const reversedPosts =
    [
      ...(profile?.postProductsEnabled && profile?.role !== "buyer" ? productPosts : []),
      ...normalPosts,
    ].reverse() || [];
  const reversedSaved = profile?.saved?.slice().reverse() || [];
  const reversedCollaborated = collaboratedPosts?.reverse() || [];
  let activePost = null;
  if (activeSection === "posts") {
    activePost = activeIndex !== null ? reversedPosts[activeIndex] : null;
  } else if (activeSection === "saved") {
    activePost = activeIndex !== null ? reversedSaved[activeIndex] : null;
  } else if (activeSection === "Tags") {
    activePost =
      activeIndex !== null ? reversedCollaborated[activeIndex] : null;
  }
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(activePost?.likes?.length || 0);
  const [commentPanel, setComentPanel] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [onPosts, setOnPosts] = useState(true);
  const [onSave, setOnSave] = useState(false);
  const [onItem, setOnItem] = useState(false);
  const [onTag, setOnTag] = useState(false);
  const [onLiveHistory, setOnLiveHistory] = useState(false);
  const [onCollections, setOnCollections] = useState(false);
  const [liveHistory, setLiveHistory] = useState([]);
  const [liveHistoryLoading, setLiveHistoryLoading] = useState(false);
  const [deletingLiveId, setDeletingLiveId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [follow, setFollow] = useState(false);
  const [suggestionOn, setSuggestionOn] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
    const [memberships, setMemberships] = useState([]);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [membershipsLoading, setMembershipsLoading] = useState(false);
    const [purchasingMembership, setPurchasingMembership] = useState(false);
    const [userMembershipStatus, setUserMembershipStatus] = useState(null); // { active: bool, expiresAt, membership }
  const isMobile = window.innerWidth < 1024; // Tailwind lg breakpoint
  useEffect(() => {
    if (location.state?.onItem === true) {
      setOnItem(true);
      setOnPosts(false);
    }
  }, [location.state]);

  const handleMoreClick = (id) => setMenuOpenId(id);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeIndex]);

  const popupref1 = useRef(null);
  const popupref2 = useRef(null);
  const menuRef = useRef(null);
  const profilepopupref1 = useRef(null);
  const profilepopupref2 = useRef(null);
  const commentRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!isMobile) {
        if (
          (popupref1.current && !popupref1.current.contains(e.target)) ||
          (popupref2.current && !popupref2.current.contains(e.target))
        ) {
          setMenuOpenId(null);
        }
        if (
          (profilepopupref1.current &&
            !profilepopupref1.current.contains(e.target)) ||
          (profilepopupref2.current &&
            !profilepopupref2.current.contains(e.target))
        ) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpenId, showMenu, activeIndex]);

  useEffect(() => {
    const shouldLockScroll = activePost || reportPopupOpen || tipPopupOpen || deleteConfirmId;

    document.body.style.overflow = shouldLockScroll ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activePost, reportPopupOpen, tipPopupOpen]);

  // helper: normalize array -> [ids]
  const toIdArray = (arr) =>
    Array.isArray(arr)
      ? arr.map((x) => (typeof x === "string" ? x : x?._id)).filter(Boolean)
      : [];

  // helper: avoid needless setState loops
  const sameIds = (a, b) => {
    if (a.length !== b.length) return false;
    const sa = [...a].sort().join(",");
    const sb = [...b].sort().join(",");
    return sa === sb;
  };

  const stateUserId = location?.state?.userId;

  //  Take userId from state if available,or shared url otherwise fallback to localStorage
  const viewedUserId = shareprofileid || stateUserId || loggedInUserId;

  useEffect(() => {
    if (!viewedUserId || !userType) return;

    let cancelled = false;

    (async () => {
      try {
        if (userType === "Seller") {
          const res = await getAPI(`/auth/getsellartwork/${viewedUserId}`);
          const ids = toIdArray(res?.data?.artwork?.categoryOfArt);
          if (!cancelled) {
            setMainCategories((prev) => (sameIds(prev, ids) ? prev : ids));
          }
        } else if (userType === "Artist") {
          const res = await getAPI(`/auth/getartistdetails/${viewedUserId}`);
          const ids = toIdArray(res?.data?.artCategories);
          if (!cancelled) {
            setMainCategories((prev) => (sameIds(prev, ids) ? prev : ids));
          }
        } else if (userType === "Buyer") {
          const res = await getAPI(`/auth/getpreferences/${viewedUserId}`);
          const first = res?.data?.data?.preferredArtCategories?.[0];
          const ids = first ? toIdArray([first]) : [];
          if (!cancelled) {
            setMainCategories((prev) => (sameIds(prev, ids) ? prev : ids));
          }
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [viewedUserId, userType, mainCategories]);

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
        setUsers(res?.data?.suggestedUsers || []);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    const fetchCollaboratedPost = async () => {
      try {
        const res = await getAPI(
          `/api/social-media/posts/collaboratedPost?userId=${viewedUserId}`
        );
        setCollaboratedPosts(res.data.data);

        console.log("response of fetch collaborated post", res);
      } catch (error) {
        console.error("collaboratedpost error", error.response.data.message);
      }
    };

    if (viewedUserId) fetchCollaboratedPost();
  }, [viewedUserId]);

  const canUserComment = (profile, loggedInUserId) => {
    if (!profile || !loggedInUserId) return false;

    const allowFrom = profile.commentSettings?.allowCommentsFrom || "everyone";

    if (String(profile._id) === String(loggedInUserId)) return true;
    if (allowFrom === "everyone") return true;
    if (allowFrom === "followers") {
      return profile.followers.some(
        (id) => String(id) === String(loggedInUserId)
      );
    }
    if (allowFrom === "following") {
      return profile.following.some(
        (id) => String(id) === String(loggedInUserId)
      );
    }
    if (allowFrom === "mutual") {
      const isFollower = profile.followers.some(
        (id) => String(id) === String(loggedInUserId)
      );
      const isFollowing = profile.following.some(
        (id) => String(id) === String(loggedInUserId)
      );
      return isFollower && isFollowing;
    }
    return false;
  };

  const postProduct = () => { };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getAPI(
          `/api/social-media/profile/${viewedUserId}`,
          {},
          false,
          true
        );
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          setCommentSettings(
            res.data.profile.commentSettings || {
              allowCommentsFrom: "everyone",
              allowGifComments: true,
            }
          );

          // Check if logged in user can comment (frontend logic)
          const allowed = canUserComment(res.data.profile, loggedInUserId);
          setCanComment(allowed);
            setFollow(
              res.data.profile.followers
                .map((f) => (typeof f === "string" ? f : f._id?.toString()))
                .includes(String(loggedInUserId))
            );

          const apiUserId =
            res.data.profile.user?._id ||
            res.data.profile.user ||
            res.data.profile._id;

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
        const res = await getAPI(
          `/api/get-profileproduct?userId=${viewedUserId}`
        );
        const data = res?.data?.data || res?.data || [];
        setProducts(data);
      } catch (error) {
        console.error("Error fetching profile products:", error);
        toast.error(error.response.data.message);
      }
    };

    if (profile?.postProductsEnabled) {
      fetchProduct();
    }
    }, [viewedUserId, profile]);

  useEffect(() => {
    const fetchBuyerOrders = async () => {
      try {
        const res = await getAPI(`/api/buyer-order-list/buyer/${viewedUserId}`);
        setBuyerOrders(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching buyer orders:", error);
      }
    };

      if (profile?.role === "buyer" && viewedUserId) {
        fetchBuyerOrders();
      }
    }, [viewedUserId, profile]);

    // Filter out cancelled orders for display
    const activeBuyerOrders = buyerOrders.filter(
      (order) => order.orderStatus !== "Cancelled"
    );

  // When profile loads and user is a buyer, default to Collections tab instead of Posts
  useEffect(() => {
    if (profile?.role === "buyer") {
      setOnPosts(false);
      setOnCollections(true);
    }
  }, [profile?.role]);

  useEffect(() => {
    const fetchLiveHistory = async () => {
      if (onLiveHistory && viewedUserId) {
        setLiveHistoryLoading(true);
        try {
          // Assuming the API endpoint supports getting history for a specific user ID
          // Reusing endpoint from LiveHistory.jsx but targeting viewedUserId
          console.log("Fetching live history for:", viewedUserId);
          const response = await getAPI(`/api/social-media/live-history/${viewedUserId}`);
          console.log("Live History Response:", response);
          if (!response.hasError && response.data.success) {
            setLiveHistory(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching live history:", error);
        } finally {
          setLiveHistoryLoading(false);
        }
      }
    };
    fetchLiveHistory();
  }, [onLiveHistory, viewedUserId]);

  const handleDeleteLive = async (streamId, streamKey) => {
    if (!streamKey) {
      toast.error("Cannot delete: missing stream key");
      return;
    }
    try {
      setDeletingLiveId(streamId);
      const res = await postAPI(
        `/api/social-media/delete-live`,
        { streamKey },
        true,
        true
      );
      if (res?.data?.success) {
        toast.success("Live stream deleted");
        setLiveHistory((prev) => prev.filter((s) => s._id !== streamId));
      } else {
        toast.error(res?.data?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting live stream:", err);
      toast.error("Error deleting live stream");
    } finally {
      setDeletingLiveId(null);
    }
  };

    // Fetch memberships for a creator
    const fetchMemberships = async (creatorUserId) => {
      setMembershipsLoading(true);
      try {
        const res = await getAPI(`/api/membership?userId=${creatorUserId}`);
        const list = res?.data?.memberships || [];
        setMemberships(list);
        if (list.length > 0) setSelectedMembership(list[0]);
        else setSelectedMembership(null);
      } catch (err) {
        console.error("Error fetching memberships:", err);
        setMemberships([]);
      } finally {
        setMembershipsLoading(false);
      }
    };

    // Check if logged-in user has active membership for this creator
    useEffect(() => {
      const checkMembershipStatus = async () => {
        if (!loggedInUserId || !viewedUserId || isMyProfile) return;
        try {
          const res = await getAPI(
            `/api/membership/orders?userId=${loggedInUserId}`,
            {},
            true,
            true
          );
          const orders = res?.data?.orders || [];
          // Find active membership for this creator
          const activeMembership = orders.find(
            (o) =>
              (o.creatorId?._id === viewedUserId || o.creatorId === viewedUserId) &&
              o.status === "Paid" &&
              o.expiresAt &&
              new Date(o.expiresAt) > new Date()
          );
          const expiredMembership = orders.find(
            (o) =>
              (o.creatorId?._id === viewedUserId || o.creatorId === viewedUserId) &&
              (o.status === "Expired" || (o.status === "Paid" && o.expiresAt && new Date(o.expiresAt) <= new Date()))
          );
          if (activeMembership) {
            setUserMembershipStatus({
              active: true,
              expiresAt: activeMembership.expiresAt,
              membership: activeMembership.membershipId,
            });
          } else if (expiredMembership) {
            setUserMembershipStatus({
              active: false,
              expiresAt: expiredMembership.expiresAt,
              membership: expiredMembership.membershipId,
            });
          } else {
            setUserMembershipStatus(null);
          }
        } catch (err) {
          console.error("Error checking membership status:", err);
        }
      };
      checkMembershipStatus();
    }, [loggedInUserId, viewedUserId, isMyProfile]);

  // Handle Join button click - open modal
  const handleJoinClick = () => {
    if (!loggedInUserId) {
      toast.error("Please login to join memberships");
      return;
    }
    setShowMembershipModal(true);
    fetchMemberships(viewedUserId);
  };

  // Handle membership purchase
  const handlePurchaseMembership = async (membership) => {
    if (!loggedInUserId) {
      toast.error("Please login to purchase membership");
      return;
    }
    setPurchasingMembership(true);
    try {
      const res = await postAPI("/api/membership/purchase", {
        userId: loggedInUserId,
        membershipId: membership._id,
      });
      if (res?.data?.success && res?.data?.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      } else {
        toast.error(res?.data?.message || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Membership purchase error:", err);
      toast.error("Failed to initiate membership payment");
    } finally {
      setPurchasingMembership(false);
    }
  };

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    const userId = localStorage.getItem("userId");
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

      setFollow(!follow);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };
  const handleFollowClick = () => {
  if (!follow) {
    
    handleFollowToggle(viewedUserId, false);
  } else {
   
    setShowUnfollowConfirm(true);
  }
};


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
    if (!comment.trim()) return;

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
        setComments((prev) => [...prev, res.data.comment]);
        setComment("");
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
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      //  swipe left → next image
      if (activeImageIndex < activePost.images.length - 1) {
        setActiveImageIndex((prev) => prev + 1);
      }
    } else if (touchEndX - touchStartX > swipeThreshold) {
      //  swipe right → prev image
      if (activeImageIndex > 0) {
        setActiveImageIndex((prev) => prev - 1);
      }
    }
  };

  // Sync like state whenever post changes
  useEffect(() => {
    if (activePost) {
      setLike(activePost.likes?.some((id) => id?.toString() === loggedInUserId));
      setLikesCount(activePost.likes?.length || 0);
      setComments(activePost.comments || []);
    }
  }, [activePost, viewedUserId]);

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
            saved: res.data.savedPosts,

            posts: prev.posts.map((post) =>
              post._id === postId ? { ...post, isSaved: !post.isSaved } : post
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
      setUsers(location.state.updatedUsers);
    }
  }, [location.state]);

  const handleLike = async (postId) => {
    try {
      const res = await postAPI(
        `/api/social-media/posts/${postId}/likeUnlike`,
        { userId: loggedInUserId },
        {},
        true
      );

      if (res && !res.hasError) {
        setLike(res.data.likes.includes(loggedInUserId));
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
          Navigate("/artsays-community/");
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

    const match = value.match(/@(\w*)$/);
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
      const res = await postAPI(
        "/api/social-media/posts/promote/cancel",
        { postId, userId },
        true,
        true
      );

      if (res?.data?.success) {
        toast.success("Promotion cancelled successfully!");

        //  Update promotion status in profile.posts
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedReason === "Other" && description.trim() === "") {
      setError("Please describe the issue for 'Other'");
      return;
    }
    try {
      const reporterId = localStorage.getItem("userId");

      const payload = {
        reporterId,
        reportedUserId: reportedUser.id, //  user who owns the post
        reason: selectedReason,
        description,
        reportType: "profile",
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

  const handleDeletePost = (postId) => {
    setDeleteConfirmId(postId);
    setMenuOpenId(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
    const res = await deleteAPI(`/api/social-media/posts/${deleteConfirmId}`, {}, true);
    if (res && !res.hasError) {
      toast.success("Post deleted successfully");
      setProfile((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p._id !== deleteConfirmId),
      }));
      setActiveIndex(null);
      setDeleteConfirmId(null);
    }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error(err.response?.data?.message || "Error deleting post");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("profilePhoto");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    window.dispatchEvent(new Event("profilePhotoUpdated"));
    window.location.href = "/";
  };

  // ***for post***
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTipAmount(value); // allow free typing
    setError(""); // reset error while typing
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
      const senderId = localStorage.getItem("userId");

      const res = await postAPI("/api/tips/create", {
        sender: senderId,
        receiver: tipUser.receiverId, // from state
        post: tipUser.id, // from state
        amount: value,
      });

             if (res?.data?.data?.paymentUrl) {
                    window.location.href = res?.data?.data?.paymentUrl;
                  } else {
                    console.error(`Failed to create certifications: ${res.message}`);
                  }

      // if (res.data.success) {
      //   setTipSuccess(true);
      //   setTipPopupOpen(false);

      //   // reset
      //   setTipAmount(40);

      //   //  Auto-hide after 2.5s if you want
      //   setTimeout(() => setTipSuccess(false), 2500);
      // } else {
      //   setError(res.data.message || "Failed to send tip");
      // }
    } catch (err) {
      console.error("Error sending tip:", err);
      setError("Something went wrong. Try again.");
    }
  };

  // copy the profile link
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

  const getExternalUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };


  const navigateToProfile = (profile) => {
    Navigate(
      `/artsays-community/profile/${profile?.username
        ? `${profile?.username}`
        : `${profile?.name}_${profile?.lastName}_${profile._id}`
      }`, { state: { userId: profile?._id } }
    );
  }

  if (loading) {
    return ProfileSkeleton();
  }

  return (
    <div
      className={`my-4 ${activePost ? "w-full" : ""
        } col-span-12 lg:col-span-6 w-full flex flex-col mx-auto`}
    >
      {profile && (
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
            <title>{profile.username || `${profile.firstName || ''} ${profile.lastName || ''}`.trim()}</title>
          <meta name="description" content={profile.bio} />
          {/* <meta name="keywords" content={}/> */}
          <meta
            name="author"
            content={`${profile.firstName} ${profile.lastName}`}
          />

          <meta property="og:type" content="profile" />
          <meta property="og:title" content={profile.username} />
          <meta property="og:description" content={profile.bio} />
          <meta property="og:url" content={window.location.href} />
          <meta
            property="og:image"
            content={
              profile.profilePhoto
                ? getImageUrl(profile?.profilePhoto)
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />

          <meta name="twitter:title" content={profile.username} />
          <meta name="twitter:description" content={profile.bio} />
          <meta
            name="twitter:image"
            content={
              profile.profilePhoto
                ? getImageUrl(profile?.profilePhoto)
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />
        </Helmet>
      )}

      {/* Active Post Popup for all screen size*/}
      {activePost && (
        <div
          className=" fixed inset-0 z-[9999] bg-[#000000] w-full bg-opacity-40 flex justify-center items-center w-full"
          onClick={() => {
            setActiveIndex(null);
            setMenuOpenId(null);
          }}
        >
          {/* Close Button */}
          <button
            className="absolute top-5 right-5 text-4xl font-bold z-50 focus:outline-none"
            onClick={() => {
              setActiveIndex(null);
              setMenuOpenId(null);
            }}
          >
            <i className="ri-close-line text-[#fcfcfc] bg-[#000000] p-1 rounded-full"></i>
          </button>

          {/* Left Arrow (previous post) */}
          {activeIndex > 0 && (
            <button
              className="absolute w-10 h-10 lg:left-10 left-6 -translate-x-1/3 top-1/2 transform -translate-y-1/2 text-gray-100 lg:text-4xl text-xl z-50 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => prev - 1);
              }}
            >
              <i className="ri-arrow-left-wide-fill  bg-[#000000] p-1 rounded-full"></i>
            </button>
          )}

          {/* Popup Layout */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="lg:bg-white w-[90%] lg:w-[75%] h-[90%] lg:h-[75%] rounded-lg lg:overflow-hidden overflow-visible flex relative flex lg:flex-row flex-col grid grid-cols-12"
          >
            {/* Left Side (Image Viewer) */}
            <div className="col-span-12 lg:col-span-8 lg:h-full w-full bg-[#EBEBEB] flex items-center justify-center relative ">
              <div className="w-full h-[300px] lg:h-[550px] bg-[#EBEBEB] relative flex col-span-12 md:col-span-8 items-center justify-center border-r-[1.5px] rounded-b-md border-gray-200">
                {activePost.images?.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(activePost.images[activeImageIndex])}
                      alt="post"
                      className="h-full w-full object-contain"
                    />

                    {/* Image Navigation Arrows */}
                    {activeImageIndex > 0 && (
                      <button
                        className="absolute sm:left-4 left-2 w-8 h-8 top-1/2 z-50 transform -translate-y-1/2 text-[#ffffff] opacity-80 p-1 rounded-full focus:outline-none"
                        onClick={() => setActiveImageIndex((prev) => prev - 1)}
                      >
                        <i className="ri-arrow-left-s-line lg:text-3xl sm:text-2xl text-lg bg-[#000000] rounded-full"></i>
                      </button>
                    )}
                    {activeImageIndex < activePost.images.length - 1 && (
                      <button
                        className="absolute sm:right-4 right-2 w-8 h-8 top-1/2 transform -translate-y-1/2 z-50 text-[#ffffff] opacity-80 p-1 rounded-full focus:outline-none"
                        onClick={() => setActiveImageIndex((prev) => prev + 1)}
                      >
                        <i className="ri-arrow-right-s-line lg:text-3xl sm:text-2xl text-lg bg-[#000000] rounded-full"></i>
                      </button>
                    )}

                    {/* Image Indicators (dots) */}
                    {activePost.images.length > 1 && (
                      <div className="absolute bottom-6 flex gap-2 justify-center w-full z-10">
                        {activePost.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === activeImageIndex
                              ? "bg-white"
                              : "bg-[#000000]"
                              }`}
                          ></div>
                        ))}
                      </div>
                    )}

                    {/* 🔥 WEBSITE LINK BOX (ADD HERE) */}
                    {activePost.isPromoted &&
                      activePost.promotionDetails?.website && (
                        <a
                          href={getExternalUrl(activePost.promotionDetails.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] text-white text-sm px-3 py-2 rounded-md flex flex-col shadow-lg bg-[#48372D]/70 hover:bg-[#48372D]"
                        >
                          <span className="font-semibold leading-tight">
                            Explore Our Website
                          </span>
                          <span className="break-all leading-tight">
                            {activePost.promotionDetails.website}
                          </span>
                        </a>
                      )}
                  </>
                ) : (
                  <div className="text-gray-500">No Image</div>
                )}
              </div>
            </div>

            {/* Right Side (Post Content) */}
            <div className="col-span-12 lg:col-span-4 w-full flex flex-col justify-between gap-2 p-2 bg-[#ffffff] overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
              {/* User Info */}
              <div className="flex flex-col gap-6 ">
                <div className="relative">
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          profile?.profilePhoto
                            ? getImageUrl(profile?.profilePhoto)
                            : `${DEFAULT_PROFILE_IMAGE}`
                        }
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-[#000000]">
                          {profile?.username}

                          {profile.verified?.length > 0 && (
                            <img
                              src={getImageUrl(profile.verified[profile.verified.length - 1]?.badgeImage
                                )}
                              className="inline-block ml-1 w-5 h-5 object-contain"
                              alt={
                                profile.verified[profile.verified.length - 1]?.badgeName || "badge"
                              }
                              title={profile.verified[profile.verified.length - 1]?.badgeName}
                            />
                          )}
                        </span>
                        {activePost.isPromoted && (
                          <span className="text-xs text-[#000000] font-semibold">
                            Sponsored
                          </span>
                        )}
                        {/* Show location ONLY if NOT sponsored */}
                        {!activePost.isPromoted && activePost.location && (
                          <span className="text-xs text-gray-500">
                            {activePost.location}
                          </span>
                        )}
                      </div>

                    </div>
                    <button onClick={() => handleMoreClick(activePost._id)} className="focus:outline-none">
                      <i className="ri-more-fill font-semibold text-2xl text-[#000000]"></i>
                    </button>
                    {menuOpenId &&
                      (activePost.user._id === loggedInUserId ? (
                        <>
                          <ul
                            ref={popupref1}
                            className="absolute flex flex-col rounded-xl items-center justify-between right-0 top-8 w-40 bg-white border shadow-lg z-10"
                          >
                              <li
                                className="w-full px-3 py-2 flex items-center text-[#000000] justify-center font-semibold cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSave(activePost?._id)}
                              >
                                {activePost.isSaved ? "Unsave" : "Save"}
                              </li>
                              <hr className="w-[80%] border-t border-gray-800" />

                              {/* Delete Post */}
                              <li
                                className="w-full px-3 py-2 flex items-center text-red-600 justify-center font-semibold cursor-pointer hover:bg-red-200"
                                onClick={() => handleDeletePost(activePost._id)}
                              >
                                Delete
                              </li>
                              <hr className="w-[80%] border-t border-gray-800" />

                              {/* Cancel */}
                            <li
                              className="w-full px-3 py-2 flex items-center justify-center font-semibold cursor-pointer hover:bg-red-200 text-red-500 rounded-b-xl"
                              onClick={() => setMenuOpenId(null)}
                            >
                              Cancel
                            </li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <ul
                            ref={popupref2}
                            className="absolute flex flex-col rounded-xl items-center justify-between right-0 top-8 w-40 bg-white border shadow-lg z-10"
                          >
                            {/* Pay Tip */}
                            <div className="w-full flex flex-col items-center justify-center">
                              <li
                                className="w-full px-3 py-2 flex items-center justify-center cursor-pointer font-semibold hover:bg-gray-200 rounded-t-xl"
                                onClick={() => {
                                  setTipUser({
                                    id: activePost._id,
                                    receiverId: activePost.user._id,
                                  });
                                  setTipPopupOpen(true);
                                  setMenuOpenId(null);
                                }}
                              >
                                Pay Tip
                              </li>
                              <hr className="w-[75%] border-t border-gray-800" />
                            </div>

                            {/* Report */}
                            <div className="w-full flex flex-col items-center justify-center">
                              <li
                                className="w-full px-3 py-2 flex items-center justify-center cursor-pointer font-semibold hover:bg-gray-200"
                                onClick={() => {
                                  setReportedUser({
                                    id: activePost.user._id,
                                    postId: activePost._id,
                                    username: activePost.user.username,
                                  });
                                  setReportPopupOpen(true);
                                  setMenuOpenId(null);
                                }}
                              >
                                Report
                              </li>

                              <hr className="w-[75%] border-t border-gray-800" />
                            </div>

                            <li
                              className="w-full px-3 py-2 flex items-center justify-center cursor-pointer font-semibold hover:bg-gray-200"
                              onClick={() => handleSave(activePost?._id)}
                            >
                              {activePost.isSaved ? "Unsave" : "Save"}
                            </li>
                            <hr className="w-[75%] border-t border-gray-800" />

                            {/* Cancel */}
                            <li
                              className="w-full px-3 py-2 flex items-center justify-center cursor-pointer font-semibold hover:bg-red-200 text-red-500 rounded-b-xl"
                              onClick={() => setMenuOpenId(null)}
                            >
                              Cancel
                            </li>
                          </ul>
                        </>
                      ))}
                  </div>
                  <hr className="my-2 border-gray-200" />
                  <div className="items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          profile?.profilePhoto
                            ? getImageUrl(profile?.profilePhoto)
                            : `${DEFAULT_PROFILE_IMAGE}`
                        }
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-[#000000]">
                          {profile?.username}

                          {profile.verified?.length > 0 && (
                            <img
                              src={getImageUrl(profile.verified[profile.verified.length - 1]?.badgeImage
                                )}
                              className="inline-block ml-1 w-5 h-5 object-contain"
                              alt={
                                profile.verified[profile.verified.length - 1]?.badgeName || "badge"
                              }
                              title={profile.verified[profile.verified.length - 1]?.badgeName}
                            />
                          )}
                        </span>
                        {activePost && (
                          <p className="text-sm font-semibold text-black break-words whitespace-normal">
                            {" "} {activePost.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Comments */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-auto" style={{ scrollbarWidth: "none" }}>
                {comments.length > 0 ? (
                  comments
                    .slice()
                    .reverse()
                    .map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <img
                          src={
                            profile?.profilePhoto
                              ? getImageUrl(profile?.profilePhoto)
                              : `${DEFAULT_PROFILE_IMAGE}`
                          }
                          alt="profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm text-[#000000]">
                              {comment?.user?.username}

                              {comment?.user?.verified?.length > 0 && (
                                <img
                                  src={getImageUrl(profile.verified[profile.verified.length - 1]?.badgeImage
                                    )}
                                  className="inline-block ml-1 w-5 h-5 object-contain"
                                  alt={
                                    comment.user.verified[comment.user.verified.length - 1]?.badgeName ||
                                    "badge"
                                  }
                                  title={
                                    comment.user.verified[comment.user.verified.length - 1]?.badgeName
                                  }
                                />
                              )}
                            </span>
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
              <div className="flex flex-col gap-1">
                {/* Actions + Likes */}
                <div className="flex flex-col gap-1">
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
                        onClick={() => {
                          if (commentRef.current) {
                            commentRef.current.focus();
                          }
                        }}
                      />
                      <IoPaperPlane
                        onClick={() => setSharePost(true)}
                        className="text-xl text-[#000000] font-medium cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      {isMyProfile && activePost.isPromoted === false && (
                        <Link
                          to={"/artsays-community/profile/promote-post"}
                          state={{
                            postId: activePost._id,
                            postImage: activePost.images[0],
                          }}
                        >
                          {activeSection === "posts" && (
                            <button className="px-2 py-0.5 bg-[#48372D] text-white text-sm rounded-lg">
                              Promote
                            </button>
                          )}
                        </Link>
                      )}
                      {activePost.isPromoted && (
                        <button
                          className="px-2 py-0.5 bg-[#48372D] text-white text-sm rounded-lg"
                          onClick={() => cancelPromotion(activePost._id)}
                          disabled={isCancelling}
                        >
                          {isCancelling ? "Cancelling..." : "Cancel Promotion"}
                        </button>
                      )}

                      {activePost?.isSaved ? (
                        <FaBookmark
                          className="text-xl text-[#000000] cursor-pointer"
                          onClick={() => handleSave(activePost._id)}
                        />
                      ) : (
                        <FaRegBookmark
                          className="text-xl text-[#000000] cursor-pointer"
                          onClick={() => handleSave(activePost._id)}
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-medium mt-1">{likesCount} likes</p>
                    {activePost?.comments?.length > 0 && (
                      <div
                        className="lg:hidden text-[13px] font-light cursor-pointer"
                        onClick={() => setComentPanel(true)} // ✅ open panel on click .It is only in mobile view
                      >
                        View all {activePost.comments.length} comments
                    </div>
                  )}
                </div>

                {canComment ? (
                  <div
                    className={` flex items-center justify-between gap-2 relative py-2`}
                  >
                    {/* Suggestions dropdown */}
                    {showMentions && mentionSuggestions.length > 0 && (
                      <div className="absolute bottom-10 left-0 w-full bg-white border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                        {mentionSuggestions.map((user) => (
                          <div
                            key={user._id}
                            onClick={() =>
                              handleSelectMentionProfile(user.username)
                            }
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            <img
                              src={
                                profile?.profilePhoto
                                  ? getImageUrl(profile?.profilePhoto)
                                  : `${DEFAULT_PROFILE_IMAGE}`
                              }
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

                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      ref={commentRef}
                      onChange={handleProfileCommentChange} // 👈 use new handler
                      className="flex-grow outline-none text-sm text-[#000000] placeholder:text-sm placeholder:text-[#696969]"
                    />
                    <button
                      className="text-[#6F4D34] font-semibold"
                      onClick={() => handleAddComment(activePost._id)}
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

          {/* Right Arrow (next post) */}
          {activeIndex < reversedPosts.length - 1 && (
            <button
              className="absolute w-10 h-10 lg:right-10 right-3 top-1/2 transform -translate-y-1/2 text-gray-100 lg:text-4xl text-xl z-50 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => prev + 1);
              }}
            >
              <i className="ri-arrow-right-wide-fill bg-[#000000] p-1 rounded-full"></i>
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
                src={
                  profile?.profilePhoto
                    ? getImageUrl(profile?.profilePhoto)
                    : `${DEFAULT_PROFILE_IMAGE}`
                }
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
            <div className="flex flex-col gap-3 p-3">
              {comments.length > 0 ? (
                comments
                  .slice()
                  .reverse()
                  .map((comment, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <img
                        src={
                          profile?.profilePhoto
                            ? getImageUrl(profile?.profilePhoto)
                            : `${DEFAULT_PROFILE_IMAGE}`
                        }
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
                        src={
                          profile?.profilePhoto
                            ? getImageUrl(profile?.profilePhoto)
                            : `${DEFAULT_PROFILE_IMAGE}`
                        }
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
                  onChange={handleProfileCommentChange} // 👈 same handler as large screen
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

      {/* Report Modal */}
      {reportPopupOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center overflow-auto">
          <div className="bg-white rounded-xl shadow-lg p-3">
            {/* Header */}
            <div className="flex justify-between items-center">
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
            <hr className="my-2 border-dark" />
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
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none text-sm ${error
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
                  className={`px-4 py-2 rounded-lg text-white font-medium ${selectedReason
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
                  onClick={handleBlockUser}
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

      {shareProfile && (
        <div className="fixed inset-0 bg-[#000000]/40 flex justify-center items-center z-[9999]">
          <div className="bg-white w-80 rounded-xl p-4 shadow-lg relative">
            {/* Close */}
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setShareProfile(false)}
            >
              <i className="ri-close-line"></i>
            </button>

            <h3 className="text-lg font-semibold mb-3">Share Profile</h3>

            {/* Copy Link */}
            <button
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg mb-2"
              onClick={() => {
                const link = `${window.location.origin
                  }/artsays-community/profile/${profile?.username
                    ? `${profile?.username}_${viewedUserId}`
                    : `${profile?.firstName}_${profile?.lastName}_${viewedUserId}`
                  }`;

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

      {sharePost && (
        <div className="fixed inset-0 bg-[#000000]/40 flex justify-center items-center z-[9999]">
          <div className="bg-white w-80 rounded-xl p-4 shadow-lg relative">
            {/* Close */}
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSharePost(false)}
            >
              <i className="ri-close-line"></i>
            </button>

            <h3 className="text-lg font-semibold mb-3">Share Post</h3>

            {/* Copy Link */}
            <button
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg mb-2"
              onClick={() => {
                const link = `${window.location.origin}/artsays-community/single-post/${activePost._id}`;
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

      {/* pay tip popup */}
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
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${error ? "border-red-500" : "border-gray-300"
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

      {/* tip success popup */}
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

      <div
        className={` w-full flex flex-col gap-3 ${activePost ? "bg-black bg-opacity-50" : ""
          }`}
      >
        {/* profile header for large screen*/}
        {profile ? (
          <div className="hidden sm:flex items-start gap-6 w-full">
            <div className="relative w-[150px] h-[150px] shrink-0 align-self-center">
                {profile?.isLive ? (
                    <div className="p-[3px] sm:p-[6px] rounded-full bg-gradient-to-r from-[#6E300C] via-[#F1620E] to-[#6E300C] w-full h-full cursor-pointer" onClick={() => profile?.liveStreamKey && navigate(`/artsays-community/live/${profile.liveStreamKey}`)}>
                      <div className="w-full h-full bg-white rounded-full overflow-hidden">
                        <img
                          src={
                            profile?.profilePhoto
                              ? getImageUrl(profile?.profilePhoto)
                              : `${DEFAULT_PROFILE_IMAGE}`
                          }
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
                    src={
                      profile?.profilePhoto
                        ? getImageUrl(profile?.profilePhoto)
                        : `${DEFAULT_PROFILE_IMAGE}`
                    }
                    alt={profile.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-[#000000]">
                    {profile.username || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User'}
                    {profile.verified?.length > 0 && (
                      <img
                        src={getImageUrl(profile.verified[profile.verified.length - 1]
                          ?.badgeImage
                          )}
                        className="inline-block ml-1 w-5 h-5 object-contain"
                        alt={
                          profile.verified[profile.verified.length - 1]
                            ?.badgeName || "badge"
                        }
                        title={
                          profile.verified[profile.verified.length - 1]?.badgeName
                        }
                      />
                    )}
                  </h1>

                  {/* button only enables when this profile is mine */}
                  {isMyProfile ? (
                  //  Owner sees Edit + Boost Profile
                  <div
                    className="flex gap-2 items-center relative"
                    ref={menuRef}
                  >
                    <Link to={"/artsays-community/setting/"}>
                      <button className="hidden sm:flex px-2 py-1 bg-[#6F4D34] text-white font-semibold rounded-md text-sm">
                        Edit Profile
                      </button>
                    </Link>
                    <button
                      className="text-xl focus:outline-none"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      <i className="ri-more-fill"></i>
                    </button>
                    {showMenu && (
                      <div
                        ref={profilepopupref1}
                        className="absolute right-0 top-full flex flex-col items-center w-48 bg-white border border-gray-200 rounded-md shadow-md z-50"
                      >
                        <Link to={"/artsays-community/setting"} className="w-full">
                          <button className="w-full font-medium px-3 py-1.5 rounded-t-md hover:bg-gray-200">
                            Setting and Privacy
                          </button>
                        </Link>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={handleSignOut}
                          className="w-full font-medium px-3 py-1.5 hover:bg-gray-200"
                        >
                          Log Out
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />

                        <button
                          onClick={() => setShowMenu(!showMenu)}
                          className="w-full font-medium px-3 py-1.5 rounded-b-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  //  Visitor sees Follow + User icon + Menu
                  <div className="flex gap-2 items-center relative">
                    <button
                      onClick={() => handleFollowToggle(viewedUserId, follow)}
                      className={`px-2 py-1 rounded-md text-sm font-semibold focus:outline-none ${follow
                        ? "bg-white text-[#6F4D34] border-[1px] border-[#6F4D34]"
                        : "bg-[#6F4D34] text-white"
                        }`}
                    >
                      {follow ? "Unfollow" : "Follow"}
                    </button>

                      {follow && profile?.role !== "buyer" && (
                        userMembershipStatus?.active ? (
                          <div className="flex flex-col items-center">
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-600 font-bold text-white rounded-md text-sm">
                              <i className="ri-vip-crown-fill text-yellow-300"></i> Member
                            </span>
                            <span className="text-[10px] text-gray-500 mt-0.5">
                              Expires {new Date(userMembershipStatus.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        ) : userMembershipStatus && !userMembershipStatus.active ? (
                          <button onClick={handleJoinClick} className="flex flex-col items-center gap-0 px-2 py-1 bg-orange-500 font-bold text-white rounded-md text-sm focus:outline-none">
                            <span>Renew</span>
                            <span className="text-[10px] font-normal">Expired</span>
                          </button>
                        ) : (
                          <button onClick={handleJoinClick} className="flex items-center gap-1 px-2 py-1 bg-[#6F4D34] font-bold text-white rounded-md text-sm focus:outline-none">
                            Join
                          </button>
                        )
                      )}
                    <button
                      className="flex items-center gap-1 px-2 py-1 bg-[#6F4D34] font-bold text-white rounded-md focus:outline-none"
                      onClick={() => setSuggestionOn((prev) => !prev)}
                    >
                      <BiUserPlus className="text-[20px] " />
                    </button>
                    <button
                      className="text-xl focus:outline-none"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      <i className="ri-more-fill"></i>
                    </button>
                    {showMenu && (
                      <div
                        ref={profilepopupref2}
                        className="absolute right-0 top-full flex flex-col items-center w-48 bg-white border border-gray-200 rounded-md shadow-md z-50"
                        onClick={(e) => e.stopPropagation()} //  prevent closing when clicking inside
                      >
                        <button
                          className="font-medium w-full px-3 py-1.5 hover:bg-gray-200 rounded-t-md"
                          onClick={() => {
                            console.log("clicked");
                            handleBlockUser();
                          }}
                        >
                          Block
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={() => {
                            setReportedUser({
                              id: viewedUserId,
                              username: profile.username,
                            });
                            setReportPopupOpen(true);
                            setShowMenu((prev) => !prev);
                          }}
                          className="w-full font-medium px-3 py-1.5 hover:bg-gray-200"
                        >
                          Report
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={() => setShareProfile(true)}
                          className="w-full font-medium px-3 py-1.5 hover:bg-gray-200"
                        >
                          Share to
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          className="w-full font-medium px-3 py-1.5 rounded-b-md hover:bg-gray-200"
                          onClick={() => setShowMenu(false)} //  close on cancel
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
                {profile.role === "buyer" ? (
                  <p className="text-gray-600 font-medium">
                    <span className="font-bold text-lg text-[#000000]">
                      {activeBuyerOrders.length}
                      </span>{" "}
                      Collections
                    </p>
                  ) : (
                    <p className="text-gray-600 font-medium">
                      <span className="font-bold text-lg text-[#000000]">
                        {profile.postCount}
                      </span>{" "}
                      Posts
                    </p>
                  )}
                  <p
                    className="text-gray-600 cursor-pointer font-medium"
                    onClick={() => setShowFollowers(true)}
                >
                  <span className="font-bold text-lg text-[#000000]">
                    {profile.followersCount}
                  </span>{" "}
                  Followers
                </p>
                <p
                  className="text-gray-600 cursor-pointer font-medium"
                  onClick={() => setShowFollowing(true)}
                >
                  <span className="font-bold text-lg text-[#000000]">
                    {profile.followingCount}
                  </span>{" "}
                  Following
                </p>
              </div>

              {/* Bio */}
              <div className="text-sm sm:mt-1.5 flex flex-col justify-between">
                <h2 className="font-semibold text-sm text-[#000000]">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-[#6E4E37] text-sm capitalize">{profile.role}</p>
                <p className="text-[#000000] text-sm">{profile.bio}</p>
                <div className="flex items-center gap-1 text-sm text-[#3d2b1f]">
                  {profile.website && (
                    <>
                      <i className="ri-link-m text-[#000000] font-medium"></i>

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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="flex items-center justify-center min-h-screen text-2xl md:text-3xl font-semibold text-gray-500 text-center">
            No Profile Available
          </p>
        )}

        {/* profile header for smaall screen */}
        {profile ? (
          <div className="sm:hidden flex flex-col  gap-3 lg:gap-8 w-full ">
            <div className="flex items-center justify-between">
              <div className="flex justify-between gap-2 items-center">
                {profile?.isLive ? (
                    <div className="relative w-[90px] h-[90px] p-[4px] bg-gradient-to-r from-[#6E300C] via-[#F1620E] to-[#6E300C] rounded-full overflow-visible cursor-pointer" onClick={() => profile?.liveStreamKey && navigate(`/artsays-community/live/${profile.liveStreamKey}`)}>
                    <img
                      src={
                        profile?.profilePhoto
                          ? getImageUrl(profile?.profilePhoto)
                          : `${DEFAULT_PROFILE_IMAGE}`
                      }
                      className="w-[75px] h-[75px] rounded-full object-cover"
                      alt={profile.username}
                    />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-white text-[10px] font-semibold bg-gradient-to-r from-[#F1620E] to-[#72320C] rounded-tl-[10px] rounded-tr-[10px]">
                      LIVE
                    </div>
                  </div>
                ) : (
                  <img
                    src={
                      profile?.profilePhoto
                        ? getImageUrl(profile?.profilePhoto)
                        : `${DEFAULT_PROFILE_IMAGE}`
                    }
                    className="w-[75px] h-[75px] rounded-full object-cover"
                    alt={profile.username}
                  />
                )}

                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-lg font-semibold text-[#000000]">
                      {profile.username || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User'}
                      {profile.verified?.length > 0 && (
                        <img
                          src={getImageUrl(profile.verified[profile.verified.length - 1]
                            ?.badgeImage
                            )}
                          className="inline-block ml-1 w-4 h-4 object-contain"
                        alt={
                          profile.verified[profile.verified.length - 1]
                            ?.badgeName || "badge"
                        }
                        title={
                          profile.verified[profile.verified.length - 1]?.badgeName
                        }
                      />
                    )}
                  </h1>

                  {/* Stats */}
                  <div className="flex justify-between sm:gap-8 gap-6 text-base">
                    {profile.role === "buyer" ? (
                        <p className="flex flex-col text-center text-[#6E4E37] text-lg font-medium">
                          <span className="font-bold text-[#48372D]">
                            {activeBuyerOrders.length}
                          </span>{" "}
                          Collections
                        </p>
                    ) : (
                      <p className="flex flex-col text-center text-[#6E4E37] text-lg font-medium">
                        <span className="font-bold text-[#48372D]">
                          {profile.postCount}
                        </span>{" "}
                        Posts
                      </p>
                    )}
                    <p className="flex flex-col text-center text-[#6E4E37] text-lg cursor-pointer font-medium" onClick={() => setShowFollowers(true)}>
                      <span className="font-bold text-[#48372D]">
                        {profile.followersCount}
                      </span>{" "}
                      Followers
                    </p>
                    <p className="flex flex-col text-center text-[#6E4E37] text-lg cursor-pointer font-medium" onClick={() => setShowFollowing(true)}>
                      <span className="font-bold text-[#48372D]">
                        {profile.followingCount}
                      </span>{" "}
                      Following
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 relative place-self-start" ref={menuRef}>
                <button
                  className="text-xl focus:outline-none"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <i className="ri-more-fill"></i>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full flex flex-col items-center w-40 bg-white border border-gray-200 rounded-md z-50">
                    {isMyProfile ? (
                      <>
                        <Link to={"/artsays-community/setting"} className="w-full">
                          <button className="font-medium w-full px-1 py-1 hover:bg-gray-200 rounded-t-md">
                            Setting and Privacy
                          </button>
                        </Link>

                        {/* <hr className="w-[80%] border-t border-gray-800" />
                        <button className="w-full font-medium px-1 py-1 hover:bg-gray-200">
                          Login activity
                        </button> */}
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={handleSignOut}
                          className="w-full font-medium px-1 py-1 hover:bg-gray-200"
                        >
                          Log Out
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={() => setShowMenu(!showMenu)}
                          className="w-full font-medium px-1 py-1 rounded-b-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full font-medium px-1 py-1 hover:bg-gray-200 rounded-t-md"
                          onClick={() => {
                            console.log("clicked");
                            handleBlockUser();
                          }}
                        >
                          Block
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={() => {
                            setReportedUser({
                              id: viewedUserId,
                              username: profile.username,
                            });
                            setReportPopupOpen(true);
                            setShowMenu((prev) => !prev);
                          }}
                          className="w-full font-medium px-1 py-1 hover:bg-gray-200"
                        >
                          Report
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={() => setShareProfile(true)}
                          className="w-full font-medium px-1 py-1 hover:bg-gray-200"
                        >
                          Share to
                        </button>
                        <hr className="w-[80%] border-t border-gray-800" />
                        <button
                          onClick={() => setShowMenu(false)}
                          className="w-full font-medium px-1 py-1 rounded-b-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              {/* Bio */}
              <div className="text-sm sm:mt-1.5 flex flex-col justify-between">
                <h2 className="font-semibold text-lg text-[#000000]">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-md text-[#6E4E37] capitalize">{profile.role}</p>
                <p className="text-md text-[#000000] font-medium">{profile.bio}</p>
                <div className="flex items-center gap-1 text-[#3d2b1f]">
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
          <p>Profile Loading</p>
        )}

        {isMyProfile ? (
          <div className="sm:hidden flex grid grid-cols-12 gap-3 justify-between items-center ">
            <button
              onClick={() => navigate("/artsays-community/setting/")}
              className="px-8 py-2 bg-[#6F4D34] text-white rounded-md text-md font-semibold col-span-5"
            >
              Edit Profile
            </button>
            <button className="px-8 py-2 bg-[#6F4D34] text-white rounded-md text-md font-semibold col-span-5" onClick={() => setShareProfile(true)}>
              Share Profile
            </button>
            <button
              className="flex items-center gap-2 px-2 py-2 bg-[#6F4D34] text-white justify-content-center rounded-md col-span-2"
              onClick={() => setSuggestionOn((prev) => !prev)}
            >
              <BiUserPlus className="text-[21px]" />
            </button>
          </div>
        ) : (
          <div className="sm:hidden flex grid grid-cols-12 gap-3 justify-between items-center ">
            <button
              onClick={() => handleFollowToggle(viewedUserId, follow)}
              className={`col-span-5 rounded-md text-md font-semibold transition ${follow
                ? "bg-white text-[#6F4D34] border-[1px] border-[#6F4D34]"
                : "bg-[#6F4D34] text-white"
                }`}
            >
              {follow ? "Unfollow" : "Follow"}
            </button>

            {follow && profile?.role !== "buyer" && (
              // <button className=" bg-[#6F4D34] text-white col-span-5 px-4 py-2 font-semibold rounded-md text-md">
              //   Join
              // </button>
              <button className="px-8 py-2 bg-[#6F4D34] col-span-5 text-white rounded-md text-md font-semibold" onClick={() => navigate("/my-account/custom-request")}>
                Request Art
              </button>
            )}
            <button
              className="flex items-center gap-2 px-2 py-2 bg-[#6F4D34] text-white justify-content-center rounded-md col-span-2"
              onClick={() => setSuggestionOn((prev) => !prev)}
            >
              <BiUserPlus className="text-[21px]" />
            </button>
          </div>
        )}

        {/* suggeted for you */}
        {suggestionOn && (
          <div className="flex flex-col px-2">
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
              <p className="text-md font-semibold text-[#000000]">Suggested For You</p>
              <button
                className="text-md font-semibold text-[#000000] cursor-pointer"
                onClick={() =>
                  Navigate("/artsays-community/profile/suggestion", {
                    state: { users, viewedUserId },
                  })
                }
              >
                See all
              </button>
            </div>

            {/* Scrollable Suggested Users */}
            <div className="relative w-full">

              {/* LEFT ARROW (Desktop only) */}
              <button
                onClick={scrollLeft}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
               text-white shadow-md rounded-full w-6 h-6 items-center justify-center
               bg-[#000000] focus:outline-none "
              >
                <i className="ri-arrow-left-s-line text-2xl"></i>
              </button>

              {/* SCROLLABLE LIST */}
              <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}
              >
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="sm:min-w-[170px]
                   min-w-[100px] max-w-[100px]
                   flex-shrink-0 flex flex-col justify-between
                   border rounded-md p-3 text-[#000000] relative break-words"
                  >
                    <button className="absolute top-0 right-2 text-xl text-[#000000]">
                      ×
                    </button>

                    <img
                      src={
                        user?.profilePhoto
                          ? getImageUrl(user.profilePhoto)
                          : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                      }
                      alt={user.username}
                      className="sm:w-20 sm:h-20 w-[55px] h-[55px]
                     rounded-full object-cover mx-auto mb-2 bg-gray-200"
                    />

                    <p className="text-center font-semibold text-sm">
                      {user.username}
                    </p>

                    <p className="text-center text-[#777777] text-xs">
                      {user.role}
                    </p>

                    <hr className="sm:mt-4 mt-2 mb-1" />

                    <button
                      className="block w-full sm:py-1 text-center text-md
                     font-semibold text-[#000000] hover:bg-gray-200 hover:rounded-md"
                      onClick={() =>
                        handleFollowToggle(user._id, user.isFollowing)
                      }
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>

              {/* RIGHT ARROW (Desktop only) */}
              <button
                onClick={scrollRight}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
               text-white shadow-md rounded-full w-6 h-6 items-center justify-center
               bg-[#000000] focus:outline-none "
              >
                <i className="ri-arrow-right-s-line text-2xl"></i>
              </button>
            </div>

          </div>
        )}

          {/* Divider Tabs */}
          <div className="flex justify-around items-center">
            {profile?.role === "buyer" ? (
              <button
                onClick={() => {
                  setOnCollections(true);
                  setOnPosts(false);
                  setOnSave(false);
                  setOnItem(false);
                  setOnTag(false);
                  setOnLiveHistory(false);
                }}
                className={`${onCollections ? "bg-[#48372D] text-white rounded-full py-1 px-5 " : ""
                  } p-3 focus:outline-none`}
              >
                <BsGrid3X3 className="text-2xl" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setOnPosts(true);
                  setOnCollections(false);
                  setOnSave(false);
                  setOnItem(false);
                  setOnTag(false);
                  setOnLiveHistory(false);
                }}
                className={`${onPosts ? "bg-[#48372D] text-white rounded-full py-1 px-5 " : ""
                  } p-3 focus:outline-none`}
              >
                <BsGrid3X3 className="text-2xl" />
              </button>
            )}
          {isMyProfile && (
            <button
              onClick={() => {
                setOnPosts(false);
                setOnCollections(false);
                setOnSave(true);
                setOnItem(false);
                setOnTag(false);
                setOnLiveHistory(false);
              }}
              className={`${onSave ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
                } p-3 focus:outline-none`}
            >
              <FaRegBookmark className="text-2xl" />
            </button>
          )}

          {/* Past Lives History Tab */}
            {profile?.role !== "buyer" && (
             <button
              onClick={() => {
                setOnPosts(false);
                setOnCollections(false);
                setOnSave(false);
                setOnItem(false);
                setOnTag(false);
                setOnLiveHistory(true);
              }}
              className={`${
                onLiveHistory ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
              } p-3`}
            >
              <MdHistory className="text-2xl" />
            </button>
            )}

              {profile?.postProductsEnabled && profile?.role !== "buyer" && (
              <button
                onClick={() => {
                  setOnPosts(false);
                  setOnCollections(false);
                  setOnSave(false);
                  setOnItem(true);
                  setOnTag(false);
                  setOnLiveHistory(false);
                }}
                className={`${onItem ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
                  } p-3 focus:outline-none`}
              >
                <LuArchive className="text-2xl" />
              </button>
            )}
          <button
            onClick={() => {
              setOnPosts(false);
              setOnCollections(false);
              setOnSave(false);
              setOnItem(false);
              setOnTag(true);
              setOnLiveHistory(false);
            }}
            className={`${onTag ? "bg-[#48372D] text-white rounded-full  py-1 px-5" : ""
              } p-3 focus:outline-none`}
          >
            <LuSquareUserRound className="text-2xl" />
          </button>
        </div>

          {/* Collections tab (for buyers) */}
            {onCollections && profile?.role === "buyer" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 w-full">
                {activeBuyerOrders.length > 0 ? (
                  activeBuyerOrders.map((order) =>
                  order.items?.map((item, idx) => {
                    const product = item.productId || item.resellProduct || item.customProduct;
                    const mainImage = product?.mainImage || product?.images?.[0];
                    return (
                      <div
                        key={`${order._id}-${idx}`}
                        className="bg-[#48372D] rounded-lg border-[#48372D] border-2 overflow-hidden text-white flex flex-col shadow-md cursor-pointer"
                          onClick={() => product?._id && navigate(`/product-details/${product.slug || product._id}/${product._id}`)}
                      >
                        <div className="h-[200px] bg-[#EBEBEB] rounded-b-2xl">
                          {mainImage ? (
                            <img
                              src={getImageUrl(mainImage)}
                              alt={item.name || "Product"}
                              className="h-full w-full object-contain rounded-b-2xl"
                            />
                          ) : (
                            <div className="flex items-center justify-center text-gray-500 w-full h-full">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col bg-[#48372D] p-2">
                          <h3 className="font-semibold text-lg truncate">
                            {item.name || "Product"}
                          </h3>
                          <hr className="w-full my-2 text-white" />
                          <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-white">
                              ₹ {item.price?.toLocaleString("en-IN") || 0}
                            </span>
                            <span className="text-xs text-gray-300">
                              Qty: {item.quantity || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  No collections yet
                </div>
              )}
            </div>
          )}

          {/* post tabs */}
        {onPosts && (
          <div className="grid grid-cols-3 gap-1 w-full">
            {reversedPosts.map((post, index) => (
              <div
                key={post._id}
                onClick={() => {
                  setActiveIndex(index);
                  setActiveSection("posts");
                }} // ✅ use index directly
                className="relative cursor-pointer bg-[#EBEBEB] rounded-md border border-gray-400"
              >
                {post.images?.length > 0 ? (
                  <img
                    src={getImageUrl(post.images[0])}
                    alt={`post-${post._id}`}
                    className="sm:h-[210px] w-full h-[120px] rounded-md"
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

                {post.isPromoted && (
                  <span className="absolute top-2 left-2 text-xs bg-[#000000] text-white px-2 py-0.5 rounded-md font-medium">
                    Sponsored
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Saved */}
        {onSave && (
          <div className="grid grid-cols-3 gap-1 w-full relative">
            {profile.saved
                ?.slice()
                .reverse()
                .filter((post) => post?.images?.length > 0)
                .map((post, index) => (
                  <div key={post._id} className="relative">
                    <img
                      onClick={() => {
                        setActiveIndex(index);
                        setActiveSection("saved");
                      }}
                      src={getImageUrl(post.images[0])}
                      alt={`post-${index}`}
                      className="h-[120px] sm:h-[210px] w-full object-cover rounded-md cursor-pointer"
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
            {onItem && profile?.role !== "Buyer" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 w-full">
            {products.length > 0 ? (
              products.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#48372D] rounded-lg border-[#48372D] border-2 overflow-hidden text-white flex flex-col shadow-md"
                >
                  {/* Image Section */}
                  <div className="h-[200px] bg-[#EBEBEB] rounded-b-2xl">
                    <img
                      src={getImageUrl(item.mainImage)}
                      alt={item.productName}
                      className="h-full w-full object-contain rounded-b-2xl"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col justify-between bg-[#48372D] p-2">
                    <div className="flex flex-col justify-between">
                      <h3 className="font-semibold text-lg truncate">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-white mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <hr className="w-full my-2 text-white" />

                    {/* ✅ Price Section with old crossed-out price */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-semibold text-white">
                            ₹ {item.finalPrice?.toLocaleString("en-IN") || 0}
                          </span>
                          {item.marketPrice && (
                            <span className="text-sm text-gray-300 line-through">
                              ₹ {item.marketPrice?.toLocaleString("en-IN")}
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
                        <Link to={`/product-details/${item._id}`}>
                          <button className="text-sm bg-white text-[#48372D] px-3 py-1 rounded-md font-semibold transition">
                            View
                          </button>
                        </Link>
                        {/* {isMyProfile && (
                          <button
                            className="text-sm bg-white text-[#6E4E37] px-3 py-[2px] rounded-md font-medium hover:bg-[#f8f8f8] transition"
                            onClick={() =>
                              postProduct({
                                productId: item._id,
                                image: item.mainImage,
                                name: item.productName,
                                bio: item.description,
                                price: item.finalPrice,
                              })
                            }
                          >
                            Post
                          </button>
                        )} */}
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
        {onTag &&
          (collaboratedPosts?.length !== 0 ? (
            <div className="grid grid-cols-3 gap-1 w-full">
              {collaboratedPosts.map((post, index) => (
                <div key={post._id} className="relative cursor-pointer">
                  {post.images?.length > 0 && (
                    <img
                      onClick={() => {
                        setActiveIndex(index);
                        setActiveSection("Tags");
                      }}
                      src={getImageUrl(post.images[0])}
                      alt={`post-${post._id}`}
                      className="sm:h-[210px] w-full h-[120px] rounded-md"
                    />
                  )}
                  {post.images?.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 p-1 rounded">
                      <i className="ri-checkbox-multiple-blank-line text-white text-lg"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No tagged posts</div>
          ))}

        {/* Live History */}
        {onLiveHistory && (
          <div className="w-full">
            {liveHistoryLoading ? (
            <div className="text-center py-10 text-gray-500">Loading history...</div>
            ) : liveHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                <p>No past live streams found.</p>
            </div>
            ) : (
             <div className="flex flex-col gap-4 w-full">
                {liveHistory.map((stream) => (
                    <div key={stream._id} className="relative flex flex-row bg-[#FFE5D9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[140px] pl-3 cursor-pointer" onClick={() => {
                        if (stream.live?.isLive && stream.live?.streamKey) {
                          navigate(`/artsays-community/live/${stream.live.streamKey}`);
                        } else {
                          const thumb = stream.thumbnail ? (stream.thumbnail.startsWith('http') ? stream.thumbnail : `${process.env.REACT_APP_API_URL}/${stream.thumbnail.replace(/\\/g, '/')}`) : '/assets/profile/user.png';
                          navigate('/artsays-community/post-live', {
                            state: {
                              totalViews: stream.live?.viewCount || 0,
                              comments: 0,
                              likes: stream.live?.likeCount || 0,
                              name: profile?.username || 'Creator',
                              thumbnail: thumb,
                              description: stream.title || 'Live Stream',
                              duration: stream.live?.streamDuration || '00:00',
                              streamKey: stream.live?.streamKey,
                              isPublished: stream.live?.isPublished || false,
                              isOwner: isMyProfile
                            }
                          });
                        }
                      }}>
                    {/* Left Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#FF6B6B] z-10"></div>
                    
                    {/* Layout Container with Padding */}
                    <div className="flex flex-row w-full p-2 py-3 gap-3 md:gap-4 items-start">
                        
                        {/* Thumbnail Section */}
                        <div className="relative w-[160px] sm:w-[240px] aspect-video flex-shrink-0">
                             <div className="w-full h-full rounded-xl overflow-hidden relative group cursor-pointer bg-black/10">
                                <img 
                                    src={stream.thumbnail ? (stream.thumbnail.startsWith('http') ? stream.thumbnail : `${process.env.REACT_APP_API_URL}/${stream.thumbnail.replace(/\\/g, '/')}`) : '/assets/profile/user.png'} 
                                    alt={stream.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay & Play Button */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                                        <FaPlay className="ml-1 text-xs sm:text-sm" />
                                    </div>
                                </div>
                                {/* Duration Badge */}
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    {stream.live?.streamDuration || "00:00"}
                                </div>
                             </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col justify-between h-full min-h-[90px] text-[#48372D]">
                           <div>
                                <div className="flex justify-between items-start mb-0.5">
                                    <h3 className="font-bold text-sm sm:text-lg text-[#48372D] leading-tight line-clamp-2" title={stream.title}>
                                        {stream.title}
                                    </h3>
                                      {isMyProfile && (
                                        <button
                                          className="text-[#48372D] hover:text-red-600 p-1 shrink-0"
                                          title="Delete live stream"
                            disabled={deletingLiveId === stream._id}
                                            onClick={(e) => { e.stopPropagation(); handleDeleteLive(stream._id, stream.live?.streamKey); }}
                                        >
                                          <FaTrash />
                                        </button>
                                      )}
                                </div>

                                <div className="text-[10px] sm:text-xs text-gray-600 mb-2 flex items-center gap-1 flex-wrap">
                                    <span>{stream.live?.viewCount || 0} views</span>
                                    <span>•</span>
                                    <span>Streamed {new Date(stream.createdAt).toLocaleDateString()}</span>
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        src={profile?.profilePhoto ? getImageUrl(profile.profilePhoto) : DEFAULT_PROFILE_IMAGE}
                                        alt={profile?.username}
                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                                    />
                                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{profile?.username || "User"}</span>
                                </div>

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
                ))}
            </div>
            )}
          </div>
        )}

        {/* all followers */}
        {showFollowers && profile?.followers.length > 0 && (
          <div
            className="fixed inset-0 flex items-center justify-center  bg-[#000000]/40 backdrop-blur-sm z-50"
            onClick={() => setShowFollowers(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl p-3 w-90 animate-fadeIn"
            >
              {/* ❌ Close (cross) button */}
              <button
                onClick={() => setShowFollowers(false)}
                className="absolute top-3 right-3 text-[#000000] text-xl"
              >
                <i className="ri-close-line text-black"></i>{" "}
              </button>

              <h3 className="text-lg font-semibold text-[#000000] mb-3 text-center" >
                All Followers
              </h3>
              <hr className="w-full justify-self-center mb-3 border-t border-gray-800" />
              <ul className="space-y-2 max-h-48 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {profile?.followers.map((c) => {
                  return (
                    <li
                      key={c._id}
                      className="p-2 border rounded-md flex items-center space-x-6"
                      onClick={() => { navigateToProfile(c); setShowFollowers(false); }}
                    >
                      <img
                        src={
                          c?.profilePhoto
                            ? getImageUrl(c.profilePhoto)
                            : DEFAULT_PROFILE_IMAGE
                        }
                        alt={c.username || "user"}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <span className=" text-lg font-bold ">
                        {c.username
                          ? `${c.username}`
                          : `${c.name}_${c.lastName}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* all following */}
        {showFollowing && profile?.following.length > 0 && (
          <div
            className="fixed inset-0 flex items-center justify-center  bg-[#000000]/40 backdrop-blur-sm z-50"
            onClick={() => setShowFollowing(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl p-3 w-90 animate-fadeIn"
            >
              {/* ❌ Close (cross) button */}
              <button
                onClick={() => setShowFollowing(false)}
                className="absolute top-3 right-3 text-[#000000] text-xl"
              >
                <i className="ri-close-line text-black"></i>{" "}
              </button>

              <h3 className="text-lg font-semibold mb-3 text-[#000000] text-center" >
                All Followings
              </h3>
              <hr className="w-full justify-self-center mb-3 border-t border-gray-800" />
              <ul className="space-y-2 max-h-48 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {profile?.following.map((c) => {
                  return (
                    <li
                      key={c._id}
                      className="p-2 border rounded-md flex items-center space-x-6"
                      onClick={() => { navigateToProfile(c); setShowFollowers(false); }}
                    >
                      <img
                        src={
                          c?.profilePhoto
                            ? getImageUrl(c.profilePhoto)
                            : DEFAULT_PROFILE_IMAGE
                        }
                        alt={c.username || "user"}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <span className=" text-lg font-bold ">
                        {c.username
                          ? `${c.username}`
                          : `${c.name}_${c.lastName}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Delete Post?</h2>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnfollowConfirm && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white p-5 rounded-lg w-[300px]">
      <p className="mb-4 text-sm">
        Do you want to unfollow?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowUnfollowConfirm(false)}
          className="border px-3 py-1 rounded"
        >
          Cancel
        </button>

        {/* <button
          onClick={() => {
            handleFollowToggle(viewedUserId, true);
            setShowUnfollowConfirm(false);
          }}
          className="px-2 py-1 rounded-md text-[16px] font-bold bg-[#6F4D34] text-white"
        >
          Unfollow
        </button> */}
        <button
  onClick={() => {
    handleFollowToggle(viewedUserId, true);
    setShowUnfollowConfirm(false);
  }}
  className="px-2 py-1 min-w-[90px] sm:min-w-[100px] text-center rounded-md text-[16px] font-bold bg-[#6F4D34] text-white"
>
  Unfollow
</button>

      </div>
    </div>
  </div>
)}

      {/* Membership Modal */}
      {showMembershipModal && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/40 flex items-center justify-center bg-black/50" onClick={() => setShowMembershipModal(false)}>
          <div className="bg-white rounded-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 bg-[#FCE7F3] relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] w-24 h-24 border-2 border-[#4A3728] rounded-full opacity-20 pointer-events-none"></div>
              <div className="absolute left-[30%] top-[-10px] w-12 h-12 border-2 border-[#4A3728] rounded-full opacity-20 pointer-events-none"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={profile?.profilePhoto || DEFAULT_PROFILE_IMAGE}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <h3 className="text-[#4A3728] text-sm font-medium">{profile?.fullName || profile?.username}</h3>
                    <h2 className="text-[#4A3728] text-lg font-bold">Be a member</h2>
                  </div>
                </div>
                <button onClick={() => setShowMembershipModal(false)} className="text-[#4A3728] text-xl font-bold">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {membershipsLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-8 h-8 border-4 border-[#4A3728]/20 border-t-[#4A3728] rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-gray-500">Loading memberships...</p>
                </div>
              ) : memberships.length > 0 ? (
                <div className="flex h-[350px]">
                  {/* Left - Tier List */}
                  <div className="w-1/3 border-r border-gray-100 overflow-y-auto">
                    {memberships.map((m) => (
                      <button
                        key={m._id}
                        onClick={() => setSelectedMembership(m)}
                        className={`w-full text-left p-3 transition-colors relative ${selectedMembership?._id === m._id ? "bg-[#FBCFE8]" : "hover:bg-gray-50"}`}
                      >
                        {selectedMembership?._id === m._id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4A3728]"></div>
                        )}
                        <div className="text-sm font-medium text-gray-800">{m.title}</div>
                        <div className="text-xs text-gray-500">₹{m.price}/month</div>
                      </button>
                    ))}
                  </div>

                    {/* Right - Tier Details */}
                    <div className="w-2/3 p-4 overflow-y-auto">
                      {selectedMembership ? (
                        <>
                          <h3 className="text-lg font-bold text-[#4A3728] mb-1">₹{selectedMembership.price}/month</h3>

                          {userMembershipStatus?.active && userMembershipStatus.membership?._id === selectedMembership._id ? (
                            <div className="mb-3">
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1.5 text-sm font-bold">
                                <i className="ri-vip-crown-fill text-yellow-500"></i> Active Member
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Expires on {new Date(userMembershipStatus.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                {" "}({Math.ceil((new Date(userMembershipStatus.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days left)
                              </p>
                            </div>
                          ) : userMembershipStatus && !userMembershipStatus.active && userMembershipStatus.membership?._id === selectedMembership._id ? (
                            <div className="mb-3">
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 rounded-full px-3 py-1.5 text-xs font-bold mb-1">
                                Membership Expired
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Expired on {new Date(userMembershipStatus.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                              <button
                                onClick={() => handlePurchaseMembership(selectedMembership)}
                                disabled={purchasingMembership}
                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-1.5 text-sm font-bold mt-2 transition-colors disabled:opacity-50"
                              >
                                {purchasingMembership ? "Processing..." : "Renew Membership"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePurchaseMembership(selectedMembership)}
                              disabled={purchasingMembership}
                              className="bg-[#5c4033] hover:bg-[#4A3728] text-white rounded-full px-6 py-1.5 text-sm font-bold mb-3 transition-colors disabled:opacity-50"
                            >
                              {purchasingMembership ? "Processing..." : "Join"}
                            </button>
                          )}
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                          {selectedMembership.perks?.length > 0
                            ? selectedMembership.perks.map((p) => p.perkName).join(", ")
                            : "No perks listed"}
                        </p>
                        {selectedMembership.perks?.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-[#4A3728] mb-2">Perks included:</h4>
                            <ul className="space-y-1">
                              {selectedMembership.perks.map((perk, i) => (
                                <li key={i} className="text-xs text-gray-700 flex items-center gap-1">
                                  <span className="text-green-500">&#10003;</span> {perk.perkName}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Select a tier to see details
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <i className="ri-group-line text-4xl text-gray-200 mb-3"></i>
                  <h3 className="text-lg font-bold text-gray-700 mb-1">No memberships available</h3>
                  <p className="text-sm text-gray-500">This creator hasn't set up any membership tiers yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </div>
    );
  };
const ProfileSkeleton = () => {
  return (
    <div className="w-full min-h-screen col-span-12 lg:col-span-6 bg-white my-4">
      {/* Top Section Skeleton */}
      <div className="flex flex-col items-center">
        {/* Profile Photo */}
        <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse mb-4"></div>

        {/* Username */}
        <div className="h-4 w-32 bg-gray-300 animate-pulse rounded mb-2"></div>

        {/* Name */}
        <div className="h-4 w-20 bg-gray-300 animate-pulse rounded mb-1"></div>

        {/* Bio */}
        <div className="h-3 w-40 bg-gray-300 animate-pulse rounded mb-1"></div>
        <div className="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center gap-8 my-3">
        <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
        <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
        <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
        <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
      </div>

      {/* Images Grid Skeleton */}
      <div
        className="
        grid grid-cols-3 
        gap-3"
      >
        {/* Create 8 placeholders for loading */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full aspect-square bg-gray-300 animate-pulse rounded-xl"
          ></div>
        ))}
      </div>
      
    </div>
  );
};

export default Profile;
