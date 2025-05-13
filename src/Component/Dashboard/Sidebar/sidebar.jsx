  import React, { useEffect, useState } from 'react';
  import { Link, useLocation } from 'react-router-dom';

  const Sidebar = () => {
    const location = useLocation();
    const [isActive, setIsActive] = useState({});
    const [expandedTab, setExpandedTab] = useState(null); 
    const [userType, setUserType] = useState(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }, []);

    const menuConfig = {
      "Super-Admin": [
        {
          label: "Dashboard",
          icon: "fa-dashboard",
          path: "/super-admin/dashboard",
          subTabs: []
        },
        ...(email === "shantu131201@gmail.com"
          ? [
              {
                label: "Admin",
                icon: "fas fa-user",
                path: "/super-admin/admin",
                subTabs: []
              }
            ]
          : []),
          {
            label: "Artist",
            icon: "fa fa-paint-brush",
            path: `#artist-management`,
            subTabs: [
              { label: "Management", path: `/super-admin/artist/management` },
              { label: "Blog Request", path: `/super-admin/artist/blogrequest` },
              { label: "Blogs", path: `/super-admin/artistblogs` },
              { label: "Product Request", path: `/super-admin/artistproductrequest` },
              { label: "Products", path: `/super-admin/allartistproduct` },
              { label: "Sold Product ", path: `/super-admin/artistsoldproduct` },
              { label: "Transaction", path: `/super-admin/artisttransaction`},
              { label: "Packaging Material", path: `/super-admin/artistpackagingmaterial` },
            ]
          },
          {
            label: "Buyer",
            icon: "fa-handshake",
            path: `#Buyer-management`,
            subTabs: [
              { label: "Management", path: `/super-admin/buyermanagetable` },
              { label: "Product Purchased", path: `/super-admin/buyerproductpurchased` },
              { label: "Resell Product Request", path: `/super-admin/buyerproductrequest` },
              { label: "Sold Product", path: `/super-admin/buyersoldproduct` },
              { label: "Transaction", path: `/super-admin/buyertransaction` },
              { label: "Packaging Material", path: `/super-admin/buyerpackagingmaterial` },
            ]
          },
          {
            label: "Seller",
            icon: "fa fa-tag",
            path: `#Seller-management`,
            subTabs: [
              { label: " Management", path: `/super-admin/sellermanagetable` },
              { label: "Products", path: `/super-admin/sellerproduct` },
              { label: "Product Request", path: `/super-admin/sellerrequest` },
              { label: "Sold  Product ", path: `/super-admin/sellersoldproduct` },
              { label: "Transaction", path: `//super-admin/sellertransaction` },
              { label: "Packaging Material", path: `/super-admin/sellerpackagingmaterial` }
            ]
          },
          {
            label: "Bidding",
            icon: "fa fa-gavel",
            path: `#Bidding`,
            subTabs: [
              { label: "All Products", path: `/super-admin/bidding/allproduct` },
              { label: "Bidded Product", path: `/super-admin/bidding/bidded-product` },
              { label: "Transaction", path: `/super-admin/bidding/transaction` }
            ]
          },
    
          {
            label: "Transaction",
            icon: "fa fa-credit-card",
            path: `/super-admin/alltransaction`,
            subTabs: [
              // { label: "All Transaction", path: `/${userType}/Dashboard/alltransaction` },
              // { label: "Product Transaction", path: `#` },
              // { label: "Resell Product Transacticon", path: `#` },
              // { label: "Bidding Transaction", path: `#` }
            ]
          },
          {
            label: "Packaging Material",
            icon: "fa fa-archive",
            path: `#Packaging Material`,
            subTabs: [
              { label: "Product", path: `/super-admin/packagingmaterialproduct`},
              { label: "Product Purchased", path: `/super-admin/packagingproductpurchased` },
              { label: "Transaction", path: `/super-admin/packagingproducttransaction` },
            ]
          },
          {
            label: "Settings",
            icon: "fa fa-cog", 
            path: `#Settings`,
            subTabs: [
              { label: "Product Category", path: `/super-admin/settings/product-category`},
              { label: "Blog Category", path: `/super-admin/settings/blog-category` },
              { label: "Email Setting", path: `/super-admin/settings/email-setting` },
            ]
          } 
      ],
      // ----------------------------------------------Artist-----------------------------------------------------//
      "Artist": [
        {
          label: "Dashboard",
          icon: "fa-dashboard",
          path: "/artist/dashboard",
          subTabs: []
        },
        {
          label: "Blogs",
          icon: "fa fa-newspaper",
          path: "/artist/bloglist",
          subTabs: []
        },
      ],
      // ----------------------------------------------Buyer-----------------------------------------------------//
      "Buyer": [
        {
          label: "Dashboard",
          icon: "fa-dashboard",
          path: "/buyer/dashboard",
          subTabs: []
        },
      ],
      // ----------------------------------------------Seller-----------------------------------------------------//
      "Seller": [
        {
          label: "Dashboard",
          icon: "fa-dashboard",
          path: "/seller/dashboard",
          subTabs: []
        },
      ],
    };

    useEffect(() => {
      const storedUserType = localStorage.getItem("userType");
      if (storedUserType) {
        setUserType(storedUserType);
      }
    }, []);

    const menuItems = userType ? menuConfig[userType] || [] : [];

    useEffect(() => {
      if (userType) {
        const items = menuConfig[userType] || [];
        const activeTabs = items.reduce((acc, item) => {
          const isParentMatch = location.pathname.startsWith(item.path);
          const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
          const isActive = isParentMatch || isSubTabMatch;
          acc[item.label] = isActive;
  
          if (isActive) {
            setExpandedTab(item.label);
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
                      className={location.pathname === subTab.path ? 'active' : ''}
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
