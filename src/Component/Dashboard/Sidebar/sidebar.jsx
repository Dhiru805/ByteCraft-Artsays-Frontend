import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import getAPI from '../../../api/getAPI';

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({});
  const [expandedTab, setExpandedTab] = useState(null);
  const [email, setEmail] = useState("");
  const [roleData, setRoleData] = useState({});
  const [fetchedTabs, setFetchedTabs] = useState([]);

  const userrole = localStorage.getItem('userrole');

  const roleAliases = {
    "Super-Admin": userrole ? userrole.toLowerCase() : "super-admin",
  };

  const getDisplayPath = (path) => {
    const alias = roleAliases[userrole] || userrole?.toLowerCase();
    if (!alias) return path;
    return path.replace("/super-admin", `/${alias}`);
  };


  const menuConfig = {

    "Super-Admin": [
      {
        label: "Dashboard",
        tabId: "dbd1",
        icon: "fa-dashboard",
        path: "/super-admin/dashboard",
        subTabs: []
      },
      // ...(email === "shantu131201@gmail.com"
      //   ? [
      {
        label: "Admin",
        tabId: "adn1",
        icon: "fas fa-user",
        path: "/super-admin/admin",
        subTabs: []
      },
      //   ]
      // : []),
      {
        label: "Blogs",
        tabId: "bgs1",
        icon: "fa fa-newspaper",
        path: "/super-admin/blog",
        subTabs: []
      },

      {
        label: "Artist",
        tabId: "att1",
        icon: "fa fa-paint-brush",
        path: `#artist-management`,
        subTabs: [
          { label: "Management", subtabId: "att11", path: `/super-admin/artist/management` },
          { label: "Blog Request", subtabId: "att12", path: `/super-admin/artist/blogrequest` },
          { label: "Blogs", subtabId: "att13", path: `/super-admin/artist/blogs` },
          { label: "Product Request", subtabId: "att14", path: `/super-admin/artist/artistproductrequest` },
          { label: "Products", subtabId: "att15", path: `/super-admin/artist/allartistproduct` },
          { label: "Sold Product", subtabId: "att16", path: `/super-admin/artist/sold-product` }
        ]
      },
      {
        label: "Buyer",
        tabId: "byr1",
        icon: "fa-handshake",
        path: `#Buyer-management`,
        subTabs: [
          { label: "Management", subtabId: "byr11", path: `/super-admin/buyer/management` },
          { label: "Product Purchased", subtabId: "byr12", path: `/super-admin/buyer/productpurchased` },
          { label: "Resell Product Request", subtabId: "byr13", path: `/super-admin/buyer/resellproduct` },
          { label: "Sold Product", subtabId: "byr14", path: `/super-admin/buyer/soldproduct` }
        ]
      },
      {
        label: "Seller",
        tabId: "slr1",
        icon: "fa fa-tag",
        path: `#Seller-management`,
        subTabs: [
          { label: "Management", subtabId: "slr11", path: `/super-admin/seller/management` },
          { label: "Products", subtabId: "slr12", path: `/super-admin/seller/product` },
          { label: "Product Request", subtabId: "slr13", path: `/super-admin/seller/productrequest` },
          { label: "Sold Product", subtabId: "slr14", path: `/super-admin/seller/soldproduct` }
        ]
      },
      {
        label: "Product",
        tabId: "pdt1",
        icon: "fa fa-cart-plus",
        path: `/super-admin/product-table`,
        subTabs: []
      },
      {
        label: "Custom Order",
        tabId: "cor1",
        icon: "fa fa-cart-plus",
        path: `/super-admin/customordertable`,
        subTabs: []
      },
      {
        label: "Product Purchased",
        tabId: "ptp1",
        icon: "fa fa-cart-plus",
        path: `/super-admin/purchasetable`,
        subTabs: []
      },
      {
        label: "Bidding",
        tabId: "bdg1",
        icon: "fa fa-gavel",
        path: `#Bidding`,
        subTabs: [
          { label: "All Products", subtabId: "bdg11", path: `/super-admin/bidding/allproduct` },
          { label: "Bidded Product", subtabId: "bdg12", path: `/super-admin/bidding/bidded-product` },
          { label: "Bidding Pass", subtabId: "bdg13", path: `/super-admin/bidding/pass-table` }
        ]
      },
      {
        label: "Certification Services",
        tabId: "csv1",
        icon: "fa fa-certificate",
        path: `/super-admin/certification`,
        subTabs: []
      },
      {
        label: "Sponsor",
        tabId: "spr1",
        icon: "fa fa-bullhorn",
        path: `/super-admin/advertise`,
        subTabs: []
      },
      {
        label: "FAQ",
        icon: "fa fa-question-circle",
        path: `/super-admin/faq`,
        subTabs: []
      },
      {
        label: "Career",
        icon: "fa fa-briefcase",
        path: `/super-admin/career`,
        subTabs: []
      },
      {
        label: "Exhibition",
        icon: "fa fa-picture-o",
        path: `#Exhibition`,
        subTabs: [
          { label: "Exhibition", path: `/super-admin/exhibition` },
          { label: "Exhibition Request", path: `/super-admin/exhibition-request` },

        ]
      },


      // {
      //   label: "Transaction",
      //   icon: "fa fa-credit-card",
      //   path: `/super-admin/alltransaction`,
      //   subTabs: [
      //     // { label: "All Transaction", path: `/${userType}/Dashboard/alltransaction` },
      //     // { label: "Product Transaction", path: `#` },
      //     // { label: "Resell Product Transacticon", path: `#` },
      //     // { label: "Bidding Transaction", path: `#` }
      //   ]
      // },
      // {
      //   label: "Packaging Material",
      //   icon: "fa fa-archive",
      //   path: `#Packaging Material`,
      //   subTabs: [
      //     { label: "Product", path: `/super-admin/packagingmaterialproduct`},
      //     { label: "Product Purchased", path: `/super-admin/packagingproductpurchased` },
      //     { label: "Transaction", path: `/super-admin/packagingproducttransaction` },
      //   ]
      // },

      {
        label: "Settings",
        tabId: "stg1",
        label: "Settings",
        icon: "fa fa-cog",
        path: `#Settings`,
        subTabs: [
          { label: "Product Category", subtabId: "stg11", path: `/super-admin/settings/product-category` },
          { label: "Blog Category", subtabId: "stg12", path: `/super-admin/settings/blog-category` },
          { label: "Email Setting", subtabId: "stg13", path: `/super-admin/settings/email-setting` },
          { label: "Marketing", subtabId: "stg14", path: `/super-admin/settings/marketing` },
          { label: "User Role", subtabId: "stg15", path: `/super-admin/settings/user-role` },
          { label: "Certification", path: `/super-admin/settings/certification` },
          { label: "Default Auto Targeting", path: `/super-admin/settings/auto-targeting` },
          { label: "Auto Targeting Group", path: `/super-admin/settings/group-targeting` },
          { label: "Keyword Targeting", path: `/super-admin/settings/keyword-targeting` },
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
      {
        label: "Product",
        icon: "fa fa-cart-plus",
        path: "/artist/product",
        subTabs: []
      },
      {
        label: "Custom Order",
        icon: "fa fa-cart-plus",
        path: "/artist/custom-order",
        subTabs: []
      },
      {
        label: "Product Purchased",
        icon: "fa fa-cart-plus",
        path: "/artist/product-purchase",
        subTabs: []

      },
      {
        label: "Advertise",
        icon: "fa fa-bullhorn",
        path: `/artist/advertise`,
        subTabs: []
      },
      {
        label: "Bidding",
        icon: "fa fa-gavel",
        path: `#Bidding`,
        subTabs: [
          { label: "All Products", path: `/artist/bidding-products-table` },
          { label: "Bidded Product", path: `/artist/bidded-products-table` },
          { label: "Bidding Pass", path: `/artist/bidding-pass-table` }
        ]
      },
      {
        label: "Certification Services",
        icon: "fa fa-certificate",
        path: `/artist/certification`,
        subTabs: []
      },
      {
        label: "Exhibition",
        icon: "fa fa-picture-o",
        path: `/artist/exhibition`,
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
      {
        label: "Product",
        icon: "fa fa-cart-plus",
        path: "/seller/product-details",
        subTabs: []
      },
      {
        label: "Product Purchased",
        icon: "fa fa-cart-plus",
        path: "/seller/purchased-product",
        subTabs: []
      },
      {
        label: "Bidding",
        icon: "fa fa-gavel",
        path: `#Bidding`,
        subTabs: [
          { label: "All Products", path: `/seller/bidding-products-table` },
          { label: "Bidded Product", path: `/seller/bidded-products-table` },
          { label: "Bidding Pass", path: `/seller/bidding-pass-table` }
        ]
      },
      {
        label: "Advertise",
        icon: "fa fa-bullhorn",
        path: `#`,
        path: `/seller/advertise`,
        subTabs: []
      },
      {
        label: "Certification Services",
        icon: "fa fa-certificate",
        path: `#`,
        path: `/seller/certification`,
        subTabs: []
      },
      {
        label: "Exhibition",
        icon: "fa fa-picture-o",
        path: `/seller/exhibition`,
        subTabs: []
      },




    ],
  };

  useEffect(() => {
    const fetchTabsForRole = async () => {
      if (!userrole) return;
      try {
        const response = await getAPI(`/api/get-role-by-role/${userrole}`);
        setRoleData(response.data);
      } catch (err) {
        console.error("Failed to fetch sidebar tabs", err);
      }
    };

    fetchTabsForRole();
  }, [userrole]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const roleKey = localStorage.getItem('userType');

    if (!roleKey) return;

    const roleMenu = menuConfig[roleKey] || [];

    if (email === "shantu131201@gmail.com") {
      setFetchedTabs(menuConfig["Super-Admin"]);
      console.log("superadmin", fetchedTabs);

      return;
    }

    // Super-Admin with backend permissions
    if (roleKey === "Super-Admin") {
      if (roleData?.tabs && roleData.tabs.length > 0) {
        const filteredTabs = roleData.tabs
          .map(apiTab => {
            const matchingConfigTab = roleMenu.find(cfgTab => cfgTab.tabId === apiTab.tabId);
            if (!matchingConfigTab) return null;

            const visibleSubTabs = (apiTab.subTabs || [])
              .filter(sub => sub.permissions?.view)
              .map(apiSub => {
                const matchConfigSub = matchingConfigTab.subTabs?.find(
                  s => s.subtabId === apiSub.subtabId
                );
                return matchConfigSub || null;
              })
              .filter(Boolean);

            const shouldShowTab = apiTab.permissions?.view || visibleSubTabs.length > 0;
            if (!shouldShowTab) return null;

            return { ...matchingConfigTab, subTabs: visibleSubTabs };
          })
          .filter(Boolean);

        setFetchedTabs(filteredTabs);
      } else {
        setFetchedTabs(roleMenu);
      }
    } else {
      setFetchedTabs(roleMenu);
    }
  }, [roleData, email, userrole]);



  useEffect(() => {
    const activeTabs = fetchedTabs.reduce((acc, item) => {
      const isParentMatch = location.pathname.startsWith(item.path);
      const isSubTabMatch = item.subTabs?.some(subTab => location.pathname === subTab.path);
      const isActive = isParentMatch || isSubTabMatch;
      acc[item.label] = isActive;
      if (isActive) setExpandedTab(item.label);
      return acc;
    }, {});
    setIsActive(activeTabs);
  }, [location.pathname, fetchedTabs]);

  const handleTabToggle = (label) => {
    setExpandedTab(prev => (prev === label ? null : label));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <nav id="left-sidebar-nav" className="sidebar-nav">
      <ul id="main-menu" className="metismenu">
        {fetchedTabs.map((tab, index) => (
          <li key={index} className={`menu-item ${isActive[tab.label] ? 'active' : ''}`}>
            <Link
              to={tab.path}
              onClick={() => handleTabToggle(tab.label)}
              className={tab.subTabs.length > 0 ? 'has-arrow' : ''}
            >
              <i className={`fa ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </Link>

            {tab.subTabs.length > 0 && (
              <ul className={`collapse ${expandedTab === tab.label ? 'in' : ''}`}>
                {tab.subTabs.map((subTab, subIndex) => (
                  <li
                    key={subIndex}
                    className={location.pathname === subTab.path ? 'active' : ''}
                  >
                    <Link to={subTab.path}
                    >
                      {subTab.label}</Link>
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
