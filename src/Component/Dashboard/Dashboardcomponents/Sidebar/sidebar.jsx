import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({});

  const menuItems = [
    {
      label: "Dashboard",
      icon: "fa-dashboard",
      path: "/Dashboard",
      subTabs: []
    },
    {
      label: "Blog",
      icon: "fa-th-large",
      path: "#Blog",
      subTabs: [
        { label: "Blog List", path: "/Dashboard/Bloglist" },
        // { label: "Create Blog", path: "/Dashboard/create-blog" },
        { label: "Blogs ", path: "/Dashboard/Blogdetails" },
        { label: "Blog Requests", path: "/Dashboard/BlogRequest" },
        // { label: "Blog Dashboard", path: "/Dashboard/Blogdashboard" }
      ]
    },
    {
      label: "Chat",
      icon: "fa-comments",
      path: "#Widget",
      subTabs: [
        { label: "Inbox", path: "/Dashboard/Appinbox" },
        { label: "Contact", path: "/Dashboard/Appcontact" },
        { label: "Chat", path: "/Dashboard/Appchat" }
      ]
    },
    {
      label: "Artist Details",
      icon: "fas fa-user",
      path: "#artist-management",
      subTabs: [
        { label: "Artist Products", path: "/Dashboard/artists/:id" },
        { label: "Artist Management", path: "/Dashboard/ArtistManageTable" }
      ]
    },
    {
      label: "Product Details",
      icon: "fa-tags",
      path: "#Product-management",
      subTabs: [
        { label: "Products Upload", path: "/Dashboard/Product-uploade" },
        { label: "Products", path: "/Dashboard/artists/:id" },
        { label: "Product Management Table", path: "/Dashboard/ArtistManageTable" }
      ]
    },
    {
      label: "Buyer Management",
      icon: "fa-handshake",
      path: "#Buyer-management",
      subTabs: [
        { label: "All Buyers", path: "/Dashboard/BuyerManageTable" },
        { label: "Buyer Orders", path: "/Dashboard/Appcontact" },
        { label: "Buyer Transactions", path: "/Dashboard/Appchat" }
      ]
    }
    
  ];
  useEffect(() => {
    const activeTabs = menuItems.reduce((acc, item) => {
      acc[item.label] = location.pathname === item.path || 
                        item.subTabs.some(subTab => location.pathname === subTab.path);
      return acc;
    }, {});

    setIsActive(activeTabs);
  }, [location.pathname]);

  const handleTabToggle = (label) => {
    setIsActive((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <nav id="left-sidebar-nav" className="sidebar-nav">
      <ul id="main-menu" className="metismenu">
        {menuItems.map((item, index) => (
          <li key={index} className={isActive[item.label] ? 'active' : ''}>
            <Link
              to={item.path}
              onClick={() => handleTabToggle(item.label)}
              className={item.subTabs.length ? 'has-arrow' : ''}
            >
              <i className={`fa ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
            {item.subTabs.length > 0 && (
              <ul className={`collapse ${isActive[item.label] ? 'in' : ''}`}>
                {item.subTabs.map((subTab, subIndex) => (
                  <li key={subIndex} className={location.pathname === subTab.path ? 'active' : ''}>
                    <Link to={subTab.path}>{subTab.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
