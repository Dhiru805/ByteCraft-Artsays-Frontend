import React, { useState, useEffect, useRef } from "react";
import "./Side-post-sugg.css"; 
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (link) => location.pathname === link;
  const [isPinned, setIsPinned] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const createRef = useRef(null);

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
    { key: "home", icon: "house-fill", label: "Home" , link:"/social-media/"},
    { key: "search", icon: "search", label: "Search", link:"/social-media/search" },
    { key: "explore", icon: "compass", label: "Explore" , link:"/social-media/explore"},
    { key: "notification", icon: "bell", label: "Notification" , link:"/social-media/notification"},
    { key: "create", icon: "plus-square", label: "Create" , link:"/social-media/create-post"},
    { key: "live", icon: "broadcast-pin", label: "Live" , link:"/social-media/create-live"},
    { key: "profile", icon: "person", label: "Profile" , link:"/social-media/profile"},
    { key: "saved", icon: "bookmark", label: "Saved" , link:"/social-media/saved"},
    { key: "settings", icon: "gear", label: "Settings" , link:"/social-media/setting"},
    { key: "logout", icon: "box-arrow-left", label: "Logout" , link:"/social-media/logout"},
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar-container-s ${isPinned ? "pinned" : ""} w-[22%] mx-auto`}>
        <div className="sidebar-icons-s">
          {items.map((item, idx) => (
           <Link to={`${item.link}` } key={item.key}><div
              key={item.key}
              className={`icon-wrapper-s ${isActive(item.link) ? "active" : ""} ${idx === 7 ? "" : ""}`}
            >
              <i className={` bi-${item.icon}`}></i>
            </div></Link> 
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
              className={`label-wrapper-s ${isActive(item.link) ? "active" : ""} ${idx === 8 ? "" : ""}`}
              
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
            <Link to={`${item.link}`}>
              <li
              key={item.key}
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
                <Link to="/social-media/create-post">
                  <div className="create-option-s" onClick={() => console.log("Post")}> 
                  <i className=" bi-plus-square"></i>
                  <span>Post</span>
                </div>
                </Link>
                <Link to="/social-media/create-live">
                  <div className="create-option-s" onClick={() => console.log("Live")}> 
                  <i className=" bi-broadcast-pin"></i>
                  <span>Live</span>
                </div>
                </Link>
              </div>
            )}
          </li>

          {items.slice(2, 3).map((item) => (
            <Link to={`${item.link}`} >
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
              <button className="close-btn" onClick={() => setShowProfileMenu(false)}>&times;</button>
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Profile"
                className="profile-pic"
              />
              <div className="profile-name-s">July Singh</div>
              <div className="profile-category-s">Artist</div>
            </div>
            <div className="profile-content-s">
              {items.map((item) => (
                <Link to={`${item.link}`}>
                  <div
                  key={item.key}
                  className={`profile-item-s  ${isActive(item.link) ? "active" : ""}`}
                  
                >
                  <i className={`bi-${item.icon}`}></i>
                  <span>{item.label}</span>
                </div>
                </Link>
              ))}
            </div>
          </div>
         <div className={`overlay-s ${showProfileMenu ? "active" : ""}`} onClick={() => setShowProfileMenu(false)}></div>

        </>
      )}
    </>
  );
};

export default Sidebar;
