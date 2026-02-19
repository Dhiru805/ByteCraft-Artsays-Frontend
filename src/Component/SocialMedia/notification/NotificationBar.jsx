import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Notification.css";
import getAPI from "../../../api/getAPI";
import putAPI from "../../../api/putAPI";
import deleteAPI from "../../../api/deleteAPI";

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDelete = async (notifId) => {
    try {
      await deleteAPI(`/api/notifications/${notifId}`, {}, true);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      setOpenDropdownId(null);
    } catch (err) {
      console.error("delete error:", err);
    }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNotifications(activeFilter, next, true);
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
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${actor.profilePhoto}`
                : null;

            return (
              <div
                key={notif._id}
                className={`${isRead ? "bg-white border-[1px] border-[#48372D]" : "bg-[#48372D]"} ${isRead ? "text-[#000000] font-medium" : "text-white"} p-2 rounded-xl flex justify-between gap-2 shadow-sm relative`}
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
                      <span className="break-words text-sm">{notif.message}</span>
                    </span>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-end justify-between min-w-fit h-full gap-1 relative" ref={dropdownRef}>
                  <i
                    className={`ri-more-fill ${isRead ? "text-[#000000]" : "text-white"} text-sm cursor-pointer hover:text-gray-300`}
                    onClick={() =>
                      setOpenDropdownId((prev) => (prev === notif._id ? null : notif._id))
                    }
                  ></i>
                  <span className={`text-xs ${isRead ? "text-[#000000]" : "text-white"} whitespace-nowrap`}>
                    {timeAgo(notif.createdAt)}
                  </span>

                  {/* Dropdown Menu */}
                  {openDropdownId === notif._id && (
                    <div className="absolute right-0 top-5 text-black shadow-md rounded-xl z-[999] whitespace-nowrap bg-white justify-items-center">
                      <button
                        className="w-full px-3 py-2 text-[#000000] hover:bg-gray-200 rounded-t-xl font-semibold"
                        onClick={() => handleDelete(notif._id)}
                      >
                        Delete Notification
                      </button>
                      {!isRead && (
                        <>
                          <hr className="w-[80%] border-t border-gray-400 mx-auto" />
                          <button
                            className="w-full px-3 py-2 text-[#000000] hover:bg-gray-200 rounded-b-xl font-semibold"
                            onClick={() => { handleMarkRead(notif._id); setOpenDropdownId(null); }}
                          >
                            Mark as Read
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
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
