import React, { useState, useEffect } from "react";
import "./Side-post-sugg.css";
import { Link, useLocation } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import MediaSideBarSkele from "../../Skeleton/Home/Account/MediaSideBarSkele";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (link) => location.pathname === link;
  const [isPinned, setIsPinned] = useState(false);
  const [setUser] = useState({});
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const userType = localStorage.getItem("userType");
  const [loading, setLoading] = useState(true);
  const isBuyer = userType === "Buyer";
  const [unreadCount, setUnreadCount] = useState(0);

  const hasValidUsername =
    typeof username === "string" &&
    username.trim() !== "" &&
    username !== "undefined" &&
    username !== "null";

  useEffect(() => {
    if (!userId) return;
    const fetchUnread = async () => {
      try {
        const res = await getAPI(`/api/notifications/${userId}?filter=all&page=1&limit=1`, {}, true, true);
        if (res?.data?.success) setUnreadCount(res.data.unreadCount || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (location.pathname === "/artsays-community/notification") {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  const allItems = [
    { key: "home", icon: "house-fill", label: "Home", link: "/artsays-community/" },
    {
      key: "search",
      icon: "search",
      label: "Search",
      link: "/artsays-community/search",
    },
    {
      key: "explore",
      icon: "compass",
      label: "Explore",
      link: "/artsays-community/explore",
    },
    {
      key: "notification",
      icon: "bell",
      label: "Notification",
      link: "/artsays-community/notification",
    },
    {
      key: "create",
      icon: "plus-square",
      label: "Create",
      link: "/artsays-community/create-post",
    },
    // {
    //   key: "live",
    //   icon: "broadcast-pin",
    //   label: "Live",
    //   link: "/artsays-community/create-live",
    // },
    {
      key: "profile",
      icon: "person",
      label: "Profile",
      link: `/artsays-community/profile/${hasValidUsername ? `${username}` : `${firstName}_${lastName}_${userId}`}`,
    },
    {
      key: "saved",
      icon: "bookmark",
      label: "Saved",
      link: "/artsays-community/saved",
    },
    {
      key: "settings",
      icon: "gear",
      label: "Settings",
      link: "/artsays-community/setting",
    },
    {
      key: "logout",
      icon: "box-arrow-left",
      label: "Logout",
      link: "/artsays-community/logout",
    },
  ];

  // Filter out "create" item for buyers
  const items = isBuyer 
    ? allItems.filter(item => item.key !== "create")
    : allItems;

  useEffect(() => {
    if (!userId) {
      setUser({});
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
        setUser(result.data.user);
      } catch (err) {
        console.log("fetch userid err", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading) return <MediaSideBarSkele />
  return (
    <>
      {/* Desktop Sidebar only */}
      <div
        className={`sidebar-container-s ${isPinned ? "pinned" : ""} w-full col-span-3 mx-auto px-2 py-4 justify-content-center`}
      >
        <div className="pb-4 sidebar-icons-s justify-content-between">
          {items.map((item, idx) => (
            <Link to={`${item.link}`} key={item.key}>
              <div className={`icon-wrapper-s ${isActive(item.link) ? "active" : ""}`}>
                <div className="relative">
                  <i className={`bi-${item.icon}`}></i>
                  {item.key === "notification" && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pb-4 sidebar-expanded-s justify-content-between">
          <div className="toggle-btn-s" onClick={() => setIsPinned(!isPinned)}>
            <i className="bi-square-half"></i>
          </div>
          {items.map((item) => (
            <Link to={`${item.link}`} key={item.key}>
              <div className={`label-wrapper-s ${isActive(item.link) ? "active" : ""}`}>
                <i className={`bi-${item.icon}`}></i>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
