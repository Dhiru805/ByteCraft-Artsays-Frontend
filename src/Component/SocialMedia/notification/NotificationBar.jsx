import React, { useState, useCallback, useEffect } from "react";
import { getImageUrl } from '../../../utils/getImageUrl';
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import putAPI from "../../../api/putAPI";
import postAPI from "../../../api/postAPI";

// ─── Redirect resolver ────────────────────────────────────────────────────────
const getRedirectPath = (notif) => {
  const postId = notif.post?._id || notif.post;
  const fromId = notif.from?._id || notif.from;
  const streamKey = notif.live?.live?.streamKey;
  const fromUsername = notif.from?.username;
  const membershipId = notif.membership?._id || notif.membership;

  switch (notif.type) {
    // ── Post-related → open the post
    case "like":
    case "comment":
    case "comment_like":
    case "comment_reply":
    case "mention":
    case "post_save":
    case "new_post":
    case "trending_post":
    case "post_milestone":
    case "promotion_approved":
    case "promotion_rejected":
    case "promotion_ended":
    case "product_linked":
    case "product_purchased":
    case "product_out_of_stock":
    case "sales_milestone":
    case "low_stock":
      return postId ? `/artsays-community/single-post/${postId}` : null;

    // ── Follow / profile-related → open sender's profile
    case "follow":
    case "collab":
      return fromId ? `/artsays-community/profile/${fromId}` : null;

    // ── Live-related → /artsays-community/live/:streamKey
    case "live_started":
    case "live_reminder":
    case "live_viewer_joined":
    case "live_tip":
    case "live_ended":
      return streamKey
        ? `/artsays-community/live/${streamKey}`
        : fromId
        ? `/artsays-community/profile/${fromId}`
        : null;

    // ── Membership → sender's profile (no dedicated membership page)
    case "membership_purchase_success":
    case "membership_renewal_reminder":
    case "membership_expired":
    case "membership_renewal":
    case "membership_cancelled":
    case "membership_tier_updated":
    case "new_membership_subscriber":
      return fromId ? `/artsays-community/profile/${fromId}` : null;

    // ── Tips → sender's profile
    case "tip_received":
      return fromId ? `/artsays-community/profile/${fromId}` : null;

    // ── Badges → own profile
    case "badge_purchased":
    case "badge_unlocked":
    case "badge_revoked":
      return `/artsays-community/profile/${localStorage.getItem("userId")}`;

    // ── Account / system → settings
    case "profile_updated":
    case "settings_changed":
    case "security_alert":
      return `/artsays-community/setting`;

    default:
      return null;
  }
};

// ─── Post-related notification types ─────────────────────────────────────────
const POST_TYPES = new Set([
  "like", "comment", "comment_like", "comment_reply", "mention",
  "post_save", "new_post", "trending_post", "post_milestone",
  "promotion_approved", "promotion_rejected", "promotion_ended",
  "product_linked", "product_purchased", "product_out_of_stock",
  "sales_milestone", "low_stock",
]);

// ─── Filters ─────────────────────────────────────────────────────────────────
const FILTERS = [
  { key: "all", label: "All" },
  { key: "mentions", label: "Mentions" },
  { key: "my_post", label: "My Post" },
];

// ─── Time formatter ───────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

// ─── Main Component ───────────────────────────────────────────────────────────
const NotificationBar = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  // followStates: { [fromUserId]: "Follow" | "Following" | "Unfollow" }
  const [followStates, setFollowStates] = useState({});

  const fetchNotifications = useCallback(
    async (filter = activeFilter, pageNum = 1, append = false) => {
      if (!userId) return;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await getAPI(
          `/api/notifications/${userId}?filter=${filter}&page=${pageNum}&limit=20`,
          {},
          true,
          true
        );
        if (res?.data?.success) {
          const incoming = res.data.notifications || [];
          setNotifications((prev) => (append ? [...prev, ...incoming] : incoming));
          setUnreadCount(res.data.unreadCount || 0);
          setHasMore(pageNum < res.data.pages);
        }
      } catch (err) {
        console.error("fetchNotifications error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId, activeFilter]
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNotifications(activeFilter, 1, false);
  }, [activeFilter]);

  const handleMarkRead = async (notifId) => {
    try {
      await putAPI(`/api/notifications/${notifId}/read`, {}, {}, true);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("markRead error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await putAPI(`/api/notifications/mark-all-read/${userId}`, {}, {}, true);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("markAllRead error:", err);
    }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNotifications(activeFilter, next, true);
  };

  const handleFollowToggle = async (targetUserId, e) => {
    e.stopPropagation();
    const current = followStates[targetUserId] || "Follow";
    if (current === "Following") return;
    setFollowStates((prev) => ({ ...prev, [targetUserId]: "Following" }));
    try {
      const endpoint = current === "Follow"
        ? `/api/social-media/follow/${targetUserId}`
        : `/api/social-media/unfollow/${targetUserId}`;
      const res = await postAPI(endpoint, { userId }, true, true);
      if (res?.data?.status === 200 || res?.status === 200) {
        setFollowStates((prev) => ({
          ...prev,
          [targetUserId]: current === "Follow" ? "Unfollow" : "Follow",
        }));
      } else {
        setFollowStates((prev) => ({ ...prev, [targetUserId]: current }));
      }
    } catch {
      setFollowStates((prev) => ({ ...prev, [targetUserId]: current }));
    }
  };

  return (
    <div className="col-span-12 lg:col-span-6 w-full my-4">
      {/* Notification Tab Bar */}
      <div className="flex flex-row items-center justify-between sm:gap-4 gap-1 bg-[#E8DAB2] p-2.5 rounded-xl shadow-sm">
        <div className="flex flex-wrap sm:gap-2 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`hover:!text-[#ffffff] hover:bg-[#48372D] nt-btn text-sm px-2 py-1 font-semibold rounded-md
                ${activeFilter === f.key ? "!text-[#ffffff] bg-[#48372D]" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={handleMarkAllRead}
            className="hover:!text-[#ffffff] hover:bg-[#48372D] nt-btn text-sm px-2 py-1 font-semibold rounded-full"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="mt-3 flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#E8DAB2] flex items-center justify-center">
            <i className="ri-notification-off-line text-2xl text-[#48372D]"></i>
          </div>
          <p className="text-gray-500 font-medium text-sm">No notifications yet</p>
          <p className="text-gray-400 text-xs">
            {activeFilter !== "all" ? "Try switching to All" : "Activity will appear here"}
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {notifications.map((notif) => {
            const isRead = notif.read;
            const actor = notif.from;
            const actorName = actor
              ? actor.username ||
              `${actor.name || ""} ${actor.lastName || ""}`.trim() ||
              "Someone"
              : "Artsays";
            const profilePic = actor?.profilePhoto
              ? getImageUrl(actor.profilePhoto)
              : null;

            const redirectPath = getRedirectPath(notif);

            return (
                <div
                  key={notif._id}
                  onClick={() => {
                    if (redirectPath) {
                      if (!notif.read) handleMarkRead(notif._id);
                      navigate(redirectPath);
                    }
                  }}
                  className={`${redirectPath ? "cursor-pointer" : ""} ${isRead ? "bg-white border-[1px] border-[#48372D]" : "bg-[#48372D]"} ${isRead ? "text-[#000000] font-medium" : "text-white"} p-2 rounded-xl flex justify-between gap-2 shadow-sm relative`}
                >
                  {/* Left Section */}
                  <div className="flex gap-2 w-full">
                    <div className="flex gap-2 align-items-center">
                      <div className="h-full flex items-center justify-between">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          src={profilePic || "https://www.w3schools.com/howto/img_avatar.png"}
                          alt={actorName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center text-sm">
                      <span>
                        <span className="font-bold text-md">{actorName} :</span>{" "}
                        <span className="break-words text-sm">{notif.message}.</span>
                        <span className={`text-xs pl-1 ${isRead ? "text-[#000000]" : "text-white"} whitespace-nowrap`}>
                          {timeAgo(notif.createdAt)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right Section: post thumbnail or follow button */}
                  {POST_TYPES.has(notif.type) && notif.post?.images?.[0] ? (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-200" onClick={(e) => e.stopPropagation()}>
                      <img
                        src={getImageUrl(notif.post.images[0])}
                        alt="post"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48"; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : notif.type === "follow" && notif.from?._id ? (
                    <div className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        const fromId = notif.from._id;
                        const status = followStates[fromId] || "Follow";
                        return (
                          <button
                            onClick={(e) => handleFollowToggle(fromId, e)}
                            disabled={status === "Following"}
                            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors whitespace-nowrap
                              ${status === "Unfollow"
                                ? isRead ? "bg-gray-200 text-[#48372D] hover:bg-gray-300" : "bg-white/20 text-white hover:bg-white/30"
                                : status === "Following"
                                ? isRead ? "bg-gray-100 text-gray-400" : "bg-white/10 text-white/60"
                                : isRead ? "bg-[#48372D] text-white hover:bg-[#3a2d25]" : "bg-white text-[#48372D] hover:bg-gray-100"
                              }`}
                          >
                            {status}
                          </button>
                        );
                      })()}
                    </div>
                  ) : null}
                </div>
              );
          })}

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-2.5 text-sm font-semibold text-[#48372D] border border-[#48372D] rounded-xl hover:bg-[#48372D] hover:text-white transition-colors mt-1"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
