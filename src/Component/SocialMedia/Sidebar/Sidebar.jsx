import React, { useState, useEffect, useRef } from "react";
import "./Side-post-sugg.css";
import { Link, useLocation } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import MediaSideBarSkele from "../../Skeleton/Home/Account/MediaSideBarSkele";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (link) => location.pathname === link;
  const [isPinned, setIsPinned] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState({});
  const createRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const [loading, setLoading] = useState(true);

const hasValidUsername =
  typeof username === "string" &&
  username.trim() !== "" &&
  username !== "undefined" &&
  username !== "null";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        createRef.current &&
        !createRef.current.contains(e.target) &&
        !e.target.closest("#createTrigger")
      ) {
        setShowCreate(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const items = [
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
    {
      key: "live",
      icon: "broadcast-pin",
      label: "Live",
      link: "/artsays-community/create-live",
    },
    {
      key: "profile",
      icon: "person",
      label: "Profile",
      link: `/artsays-community/profile/${hasValidUsername? `${username}`:`${firstName}_${lastName}_${userId}`}`,
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
        setLoading(false);
      } catch (error) {
        console.error("Failed to load sidebar user", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if(loading)return <MediaSideBarSkele/>
  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar-container-s ${
          isPinned ? "pinned" : ""
        } w-[22%] mx-auto`}
      >
        <div className="sidebar-icons-s">
          {items.map((item, idx) => (
            <Link to={`${item.link}`} key={item.key}>
              <div
                key={item.key}
                className={`icon-wrapper-s ${
                  isActive(item.link) ? "active" : ""
                } ${idx === 7 ? "" : ""}`}
              >
                <i className={` bi-${item.icon}`}></i>
              </div>
            </Link>
          ))}
        </div>

        <div className="sidebar-expanded-s d-flex flex-column justify-content-between">
          <div className="toggle-btn-s" onClick={() => setIsPinned(!isPinned)}>
            <i className=" bi-square-half"></i>
          </div>
          {items.map((item, idx) => (
            <Link to={`${item.link}`} key={item.key}>
              <div
                key={item.key}
                className={`label-wrapper-s ${
                  isActive(item.link) ? "active" : ""
                } ${idx === 8 ? "" : ""}`}
              >
                <i className={` bi-${item.icon}`}></i>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-s">
        <ul className="nav-items-s">
          {items.slice(0, 2).map((item) => (
            <Link key={item.key} to={`${item.link}`}>
              <li
                className={`nav-item-s ${isActive(item.link) ? "active" : ""}`}
              >
                <i className={` bi-${item.icon}`}></i>
              </li>
            </Link>
          ))}

          {/* Create Button */}
          <li id="createTrigger">
            <div
              className="create-btn-s"
              onClick={(e) => {
                e.stopPropagation();
                setShowCreate((prev) => !prev);
              }}
            >
              <i className=" bi-plus-lg"></i>
            </div>
            {showCreate && (
              <div className="create-options-s flex" ref={createRef}>
                <Link to="/artsays-community/create-post">
                  <div
                    className="create-option-s"
                    onClick={() => console.log("Post")}
                  >
                    <i className=" bi-plus-square"></i>
                    <span>Post</span>
                  </div>
                </Link>
                <Link to="/artsays-community/create-live">
                  <div
                    className="create-option-s"
                    onClick={() => console.log("Live")}
                  >
                    <i className=" bi-broadcast-pin"></i>
                    <span>Live</span>
                  </div>
                </Link>
              </div>
            )}
          </li>

          {items.slice(2, 3).map((item) => (
            <Link to={`${item.link}`}>
              <li
                key={item.key}
                className={`nav-item-s  ${isActive(item.link) ? "active" : ""}`}
              >
                <i className={` bi-${item.icon}`}></i>
              </li>
            </Link>
          ))}

          <li
            className={`nav-item-s  ${showProfileMenu ? "active" : ""}`}
            onClick={() => {
              setShowProfileMenu(true);
            }}
          >
            <i className=" bi-person"></i>
          </li>
        </ul>
      </nav>

      {/* Profile Slide Menu */}
      {showProfileMenu && (
        <>
          <div className="profile-menu-s open">
            <div className="profile-header-s">
              <button
                className="close-btn"
                onClick={() => setShowProfileMenu(false)}
              >
                &times;
              </button>
              <img
                src={
                  user?.profilePhoto
                    ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto}`
                    : DEFAULT_PROFILE_IMAGE
                }
                alt="Profile"
                className="profile-pic"
              />
              <div className="profile-name-s">
                {user.name} {user.lastName}
              </div>
              <div className="profile-category-s">{user.role}</div>
            </div>
            <div className="profile-content-s">
              {items.map((item) => (
                <Link to={`${item.link}`}>
                  <div
                    key={item.key}
                    className={`profile-item-s  ${
                      isActive(item.link) ? "active" : ""
                    }`}
                  >
                    <i className={`bi-${item.icon}`}></i>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div
            className={`overlay-s ${showProfileMenu ? "active" : ""}`}
            onClick={() => setShowProfileMenu(false)}
          ></div>
        </>
      )}
    </>
  );
};

export default Sidebar;
