import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({});
  const [expandedTab, setExpandedTab] = useState(null); 
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "fa-dashboard",
      path: `/${userType}/Dashboard`,
      subTabs: []
    },
    {
      label: "Blog",
      icon: "fa-th-large",
      path: `#Blog`,
      subTabs: [
        { label: "Blogs", path: `/${userType}/Dashboard/Bloglist` },
        { label: "Blog Requests", path: `/${userType}/Dashboard/BlogRequest` }
      ]
    },
      {
        label: "Chat",
        icon: "fa-comments",
        path: `#Widget`,
        subTabs: [
          { label: "Inbox", path: `/${userType}/Dashboard/Appinbox` },
          { label: "Contact", path: `/${userType}/Dashboard/Appcontact` },
          { label: "Chat", path: `/${userType}/Dashboard/Appchat` }
        ]
      },
      {
        label: "Artist Details",
        icon: "fas fa-user",
        path: `#artist-management`,
        subTabs: [
          { label: "Artist Products", path: `/${userType}/Dashboard/artists/:id` },
          { label: "Artist Management", path: `/${userType}/Dashboard/ArtistManageTable` }
        ]
      },
      {
        label: "Product Details",
        icon: "fa-tags",
        path: `#Product-management`,
        subTabs: [
          { label: "Products Upload", path: `/${userType}/Dashboard/Product-uploade` },
          { label: "Products", path: `/${userType}/Dashboard/artists/:id` },
          { label: "Product Management Table", path: `/${userType}/Dashboard/ArtistManageTable` }
        ]
      },
      {
        label: "Buyer Management",
        icon: "fa-handshake",
        path: `#Buyer-management`,
        subTabs: [
          { label: "Buyer Management", path: `/${userType}/Dashboard/BuyerManageTable` },
          { label: "Buyer Request", path: `/${userType}/Dashboard/BuyerRequest` },
          { label: "Buyer Custom Request", path: `/${userType}/Dashboard/BuyerCustomrequest` },
          { label: "Buyer Transactions", path: `/${userType}/Dashboard/Appchat` }
        ]
      }
    ];
    

  useEffect(() => {
    if (userType) {
      const activeTabs = menuItems.reduce((acc, item) => {
        if (item.label === "Dashboard") {
          acc[item.label] = location.pathname === `/${userType}/Dashboard`;
        } else {
          acc[item.label] = location.pathname.startsWith(item.path) ||
            item.subTabs.some(subTab => location.pathname.startsWith(subTab.path));
        }
        return acc;
      }, {});
      setIsActive(activeTabs);
    }
  }, [location.pathname, userType]);

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
