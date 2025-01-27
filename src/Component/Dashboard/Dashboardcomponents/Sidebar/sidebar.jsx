import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({});
  const [expandedTab, setExpandedTab] = useState(null); 

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
        { label: "Blogs", path: "/Dashboard/Bloglist" },
        { label: "Blog Requests", path: "/Dashboard/BlogRequest" }
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
        { label: "Buyer Management", path: "/Dashboard/BuyerManageTable" },
        { label: "Buyer Custom Request", path: "/Dashboard/BuyerCustomrequest" },
        // { label: "Buyer Orders", path: "/Dashboard/Appcontact" },
        { label: "Buyer Transactions", path: "/Dashboard/Appchat" }
      ]
    }
  ];

  useEffect(() => {
    const activeTabs = menuItems.reduce((acc, item) => {
      if (item.label === "Dashboard") {
        acc[item.label] = location.pathname === "/Dashboard";
      } else {
        acc[item.label] = location.pathname.startsWith(item.path) ||
          item.subTabs.some(subTab => location.pathname.startsWith(subTab.path));
      }
      return acc;
    }, {});

    setIsActive(activeTabs);
  }, [location.pathname]);

  const handleTabToggle = (label) => {
    setExpandedTab(prevTab => (prevTab === label ? null : label));
  };

  return (
    <nav id="left-sidebar-nav" className="sidebar-nav">
      <ul id="main-menu" className="metismenu">
        {menuItems.map((item, index) => (
          <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
            <Link
              to={item.path}
              onClick={() => handleTabToggle(item.label)}
              className={item.subTabs.length ? 'has-arrow' : ''}
            >
              <i className={`fa ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
            {item.subTabs.length > 0 && (
              <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
                {item.subTabs.map((subTab, subIndex) => (
                  <li
                    key={subIndex}
                    className={location.pathname.startsWith(subTab.path) ? 'active' : ''}
                  >
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
