import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import getAPI from '../../../api/getAPI';
import { Scroll } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // ✅ All hooks should be here — before defining any object or logic
  const [isActive, setIsActive] = useState({});
  const [expandedTab, setExpandedTab] = useState(null);
  const [email, setEmail] = useState("");
  const [roleData, setRoleData] = useState({});
  const [fetchedTabs, setFetchedTabs] = useState([]);
  const [userType, setUserType] = useState(null);
  const userId = localStorage.getItem("userId");
  const userrole = localStorage.getItem('userrole');

  const roleAliases = {
    "Super-Admin": userrole ? userrole.toLowerCase() : "super-admin",
  };

  const getDisplayPath = (path) => {
    const alias = roleAliases[userrole] || userrole?.toLowerCase();
    if (!alias) return path;
    return path.replace("/super-admin", `/${alias}`);
  };

  // const menuConfig = {

  //   "Super-Admin": [
  //     {
  //       label: "Dashboard",
  //       tabId: "dbd1",
  // const [userType, setUserType] = useState(null);
  // const [email, setEmail] = useState("");

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("email");
  //   if (storedEmail) {
  //     setEmail(storedEmail);
  //   }
  // }, []);

  const menuConfig = {
    "Super-Admin": [
      {
        label: "Dashboard",
        icon: "fa-dashboard",
        path: "/super-admin/dashboard",
        subTabs: []
      },
      // ...(email === "shantu131201@gmail.com"
      //   ? [
      ...(userType?.toLowerCase() === "super-admin"
        ? [{
          label: "Wallet Management",
          icon: "bi-wallet-fill",
          path: `/${userType.toLowerCase()}/wallet-management`,
          state: { _id: userId },
          subTabs: []
        }]
        : []),
    
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
              // icon: "fa fa-paint-brush",
              // path: `#artist-management`,
              // subTabs: [
              //   { label: "Management", path: `/super-admin/artist/management` },
              //   { label: "Blog Request", path: `/super-admin/artist/blogrequest` },
              //   { label: "Blogs", path: `/super-admin/artist/blogs` },
              //   { label: "Product Request", path: `/super-admin/artist/artistproductrequest` },
              //   { label: "Products", path: `/super-admin/artist/allartistproduct` },
              //   { label: "Sold Product ", path: `/super-admin/artist/sold-product` },
              // { label: "Transaction", path: `/super-admin/artisttransaction`},
              // { label: "Packaging Material", path: `/super-admin/artistpackagingmaterial` },
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
              // icon: "fa-handshake",
              // path: `#Buyer-management`,
              // subTabs: [
              //   { label: "Management", path: `/super-admin/buyer/management` },
              //   { label: "Product Purchased", path: `/super-admin/buyer/productpurchased` },
              //   { label: "Resell Product Request", path: `/super-admin/buyer/resellproduct` },
              //   { label: "Sold Product", path: `/super-admin/buyer/soldproduct` },
              // { label: "Transaction", path: `/super-admin/buyertransaction` },
              // { label: "Packaging Material", path: `/super-admin/buyerpackagingmaterial` },
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
    label: "Celebrities",
      tabId: "cls1",
        icon: "fas fa-user",
          path: "/super-admin/celebrities",
            subTabs: []
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
              { label: "Bidding Pass", subtabId: "bdg13", path: `/super-admin/bidding/pass-table` },
              { label: "Bidding Pass Order", subtabId: "bdg14", path: `/super-admin/bidding/pass-order-table` }
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
    label: "Challenges",
      tabId: "clg1",
        icon: "fa-solid fa-trophy",
          path: `#Challenges`,
            subTabs: [
              {
                label: "Challenges",
                subtabId: "clg11",
                path: `/super-admin/challenges`,
              },
              { label: "Challenges Entries", subtabId: "clg12", path: `/super-admin/challenges-entries` },
            ],
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
        path: '#Career',
          subTabs: [
            { label: "Openings", path: '/super-admin/career' },
            { label: "Applications", path: '/super-admin/career/applications' }
          ]
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
  {
    label: "Enquiry",
      icon: "fa fa-mail-forward",
        path: `/super-admin/enquiry`,
          subTabs: []
  },
  {
    label: "Art Gallery",
      icon: "fa fa-image",
        path: `/super-admin/art-gallery`,
          subTabs: []
  },
  {
    label: "Website CMS",
      tabId: "wcms1",
        icon: "fa fa-cog",
          path: `#website-cms`,
            subTabs: [
              { label: "Homepage", subtabId: "wcms11", path: `/super-admin/homepage` },
              { label: "About Us", subtabId: "wcms12", path: `/super-admin/about-us` },
              { label: "Affiliate", subtabId: "wcms19", path: `/super-admin/affiliate` },
              { label: "Affiliate-Brand Partner", subtabId: "wcms19", path: `/super-admin/affiliate-bp` },
              { label: "Store", subtabId: "wcms13", path: `` },
              { label: "Bid", subtabId: "wcms14", path: `` },
              { label: "How to Bid", subtabId: "wcms15", path: `/super-admin/how-to-bid` },
              { label: "How to Buy", subtabId: "wcms15", path: `/super-admin/how-to-buy` },
              { label: "How to Sell", subtabId: "wcms16", path: `/super-admin/how-to-sell` },
              { label: "How to Re-Sell", subtabId: "wcms16", path: `/super-admin/how-to-resell` },
              { label: "Why-ArtSays", subtabId: "wcms16", path: `/super-admin/why-artsays` },
              { label: "Discover Artists", subtabId: "wcms17", path: `` },
              { label: "Celebrity Collections", subtabId: "wcms18", path: `` },
              { label: "Challenges", subtabId: "wcms19", path: `` },
              { label: "Blogs", subtabId: "wcms19", path: `` },
              //{ label: "Policys", subtabId: "wcms19", path: `/super-admin/policy` },
              { label: "Policies", subtabId: "wcms21", path: `/super-admin/policy` },
              { label: "Commissions", subtabId: "wcms19", path: `/super-admin/commission` },
              { label: "Certificate", subtabId: "wcms19", path: `/super-admin/certificate` },
              { label: "Partner", subtabId: "wcms19", path: `/super-admin/partner` },
              { label: "Insurance", subtabId: "wcms19", path: `/super-admin/insurance` },
              { label: "Licensing", subtabId: "wcms19", path: `/super-admin/licensing` },
              { label: "Social Media", subtabId: "wcms19", path: `` },
              { label: "Art Gallery", subtabId: "wcms19", path: `/super-admin/CMS-art-gallery` },
              { label: "Contact Us", subtabId: "wcms19", path: `/super-admin/contactus` },
              { label: "Career", subtabId: "wcms19", path: `` },
            ],
      },
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
              ],
      },
  // ----------------------------------------------Community CMS-----------------------------------------------------//
  {
    label: "Community CMS",
      icon: "fa fa-tag",
        path: `#Community-CMS`,
          subTabs: [
            { label: " Policies", path: `/super-admin/community-cms/policies` },
            { label: "Verification badge", path: `/super-admin/community-cms/verification-badge` },
            { label: "Reports", path: `/super-admin/community-cms/reports` },
            { label: "Sponsors", path: `/super-admin/community-cms/sponsors` },
            { label: "Purchase Badge", path: `/super-admin/community-cms/purchase-badge` },

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

  {
    label: "Packaging Material",
      icon: "fa fa-archive",
        path: `#Packaging Material`,
          subTabs: [
            { label: "Material", path: `/super-admin/packaging-material/material` },
            { label: "Order", path: `/super-admin/packaging-material/order` },
            // { label: "Transaction", path: `/super-admin/packagingproducttransaction` },
          ]
  },
  {
    label: "Packaging Material Setting",
      icon: "fa fa-cog",
        path: `#Packaging Material Setting`,
          subTabs: [
            { label: "Material Name", path: `/super-admin/packaging-material-setting/material-name` },
            { label: "Material Size", path: `/super-admin/packaging-material-setting/material-size` },
            { label: "Capacity", path: `/super-admin/packaging-material-setting/capacity` },
            { label: "Stamp", path: `/super-admin/packaging-material-setting/stamp` },
            { label: "Stickers", path: `/super-admin/packaging-material-setting/stickers` },
            { label: "Vouchers", path: `/super-admin/packaging-material-setting/vouchers` },
            { label: "Card", path: `/super-admin/packaging-material-setting/card` }
          ]
  },
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
  {
    label: "Packaging Material",
    icon: "fa fa-archive",
    path: "/artist/packaging-material",
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
      {
        label: "Packaging Material",
        icon: "fa fa-archive",
        path: "/seller/packaging-material",
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
  const storedUserType = localStorage.getItem("userType");
  if (storedUserType) {
    setUserType(storedUserType);
  }
}, []);


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

//       // path: `/super-admin/sponsor`,
//       subTabs: []
//     },
//     {
//       label: "Packaging Material",
//       icon: "fa fa-archive",
//       path: "/seller/packaging-material",
//       subTabs: []
//     },
//   ],

// };

// useEffect(() => {
//   const storedUserType = localStorage.getItem("userType");
//   if (storedUserType) {
//     setUserType(storedUserType);
//   }
// }, []);

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [location.pathname]);

// return (
//   <nav id="left-sidebar-nav" className="sidebar-nav">
//     <ul id="main-menu" className="metismenu">
//       {fetchedTabs.map((tab, index) => (
//         <li key={index} className={`menu-item ${isActive[tab.label] ? 'active' : ''}`}>
//           <Link
//             to={tab.path}
//             onClick={() => handleTabToggle(tab.label)}
//             className={tab.subTabs.length > 0 ? 'has-arrow' : ''}
//           >
//             <i className={`fa ${tab.icon}`}></i>
//             <span>{tab.label}</span>
//           </Link>

//           {tab.subTabs.length > 0 && (
//             <ul className={`collapse ${expandedTab === tab.label ? 'in' : ''}`}>
//               {tab.subTabs.map((subTab, subIndex) => (
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


// const handleTabToggle = (label) => {
//   setExpandedTab(prevTab => (prevTab === label ? null : label));
// };

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


// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import getAPI from "../../../api/getAPI";

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [email, setEmail] = useState("");
//   const [roleData, setRoleData] = useState({});
//   const [fetchedTabs, setFetchedTabs] = useState([]);
//   const [userType, setUserType] = useState(null);

//   const userrole = localStorage.getItem("userrole");
//   const storedEmail = localStorage.getItem("email");

//   // -------------------------------- MENU CONFIG --------------------------------
//   const menuConfig = {
//     "Super-Admin": [
//       {
//         label: "Dashboard",
//         tabId: "dbd1",
//         icon: "fa-dashboard",
//         path: "/super-admin/dashboard",
//         subTabs: [],
//       },
//       {
//         label: "Admin",
//         tabId: "adn1",
//         icon: "fas fa-user",
//         path: "/super-admin/admin",
//         subTabs: [],
//       },
//       {
//         label: "Blogs",
//         tabId: "bgs1",
//         icon: "fa fa-newspaper",
//         path: "/super-admin/blog",
//         subTabs: [],
//       },
//       {
//         label: "Artist",
//         tabId: "att1",
//         icon: "fa fa-paint-brush",
//         path: "#artist-management",
//         subTabs: [
//           { label: "Management", subtabId: "att11", path: `/super-admin/artist/management` },
//           { label: "Blog Request", subtabId: "att12", path: `/super-admin/artist/blogrequest` },
//           { label: "Blogs", subtabId: "att13", path: `/super-admin/artist/blogs` },
//           { label: "Product Request", subtabId: "att14", path: `/super-admin/artist/artistproductrequest` },
//           { label: "Products", subtabId: "att15", path: `/super-admin/artist/allartistproduct` },
//           { label: "Sold Product", subtabId: "att16", path: `/super-admin/artist/sold-product` },
//         ],
//       },
//       {
//         label: "Buyer",
//         tabId: "byr1",
//         icon: "fa-handshake",
//         path: "#Buyer-management",
//         subTabs: [
//           { label: "Management", subtabId: "byr11", path: `/super-admin/buyer/management` },
//           { label: "Product Purchased", subtabId: "byr12", path: `/super-admin/buyer/productpurchased` },
//           { label: "Resell Product Request", subtabId: "byr13", path: `/super-admin/buyer/resellproduct` },
//           { label: "Sold Product", subtabId: "byr14", path: `/super-admin/buyer/soldproduct` },
//         ],
//       },
//       {
//         label: "Settings",
//         tabId: "stg1",
//         icon: "fa fa-cog",
//         path: "#Settings",
//         subTabs: [
//           { label: "Product Category", subtabId: "stg11", path: `/super-admin/settings/product-category` },
//           { label: "User Role", subtabId: "stg15", path: `/super-admin/settings/user-role` },
//         ],
//       },
//     ],

//     Artist: [
//       { label: "Dashboard", icon: "fa-dashboard", path: "/artist/dashboard", subTabs: [] },
//       { label: "Blogs", icon: "fa fa-newspaper", path: "/artist/bloglist", subTabs: [] },
//       { label: "Product", icon: "fa fa-cart-plus", path: "/artist/product", subTabs: [] },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: "#Bidding",
//         subTabs: [
//           { label: "All Products", path: `/artist/bidding-products-table` },
//           { label: "Bidded Product", path: `/artist/bidded-products-table` },
//           { label: "Bidding Pass", path: `/artist/bidding-pass-table` },
//         ],
//       },
//     ],

//     Buyer: [{ label: "Dashboard", icon: "fa-dashboard", path: "/buyer/dashboard", subTabs: [] }],

//     Seller: [
//       { label: "Dashboard", icon: "fa-dashboard", path: "/seller/dashboard", subTabs: [] },
//       { label: "Product", icon: "fa fa-cart-plus", path: "/seller/product-details", subTabs: [] },
//     ],
//   };

//   // -------------------------------- FETCH ROLE PERMISSIONS --------------------------------
//   useEffect(() => {
//     if (!userrole) return;

//     const fetchTabsForRole = async () => {
//       try {
//         const response = await getAPI(`/api/get-role-by-role/${userrole}`);
//         setRoleData(response.data);
//       } catch (err) {
//         console.error("Failed to fetch sidebar tabs", err);
//       }
//     };

//     fetchTabsForRole();
//   }, [userrole]);

//   // -------------------------------- SET EMAIL + USER TYPE --------------------------------
//   useEffect(() => {
//     if (storedEmail) setEmail(storedEmail);
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) setUserType(storedUserType);
//   }, [storedEmail]);

//   // -------------------------------- HANDLE TABS BASED ON ROLE --------------------------------
//   useEffect(() => {
//     if (!userType) return;
//     const roleMenu = menuConfig[userType] || [];

//     // Super Admin with backend role permissions
//     if (userType === "Super-Admin") {
//       if (email === "shantu131201@gmail.com") {
//         setFetchedTabs(menuConfig["Super-Admin"]);
//         return;
//       }

//       if (roleData?.tabs?.length > 0) {
//         const filteredTabs = roleData.tabs
//           .map((apiTab) => {
//             const match = roleMenu.find((tab) => tab.tabId === apiTab.tabId);
//             if (!match) return null;

//             const visibleSubTabs = (apiTab.subTabs || [])
//               .filter((sub) => sub.permissions?.view)
//               .map((sub) =>
//                 match.subTabs.find((s) => s.subtabId === sub.subtabId)
//               )
//               .filter(Boolean);

//             if (apiTab.permissions?.view || visibleSubTabs.length > 0) {
//               return { ...match, subTabs: visibleSubTabs };
//             }
//             return null;
//           })
//           .filter(Boolean);

//         setFetchedTabs(filteredTabs);
//       } else {
//         setFetchedTabs(roleMenu);
//       }
//     } else {
//       setFetchedTabs(roleMenu);
//     }
//   }, [userType, roleData, email]);

//   // -------------------------------- ACTIVE TAB HANDLING --------------------------------
//   useEffect(() => {
//     const activeTabs = fetchedTabs.reduce((acc, tab) => {
//       const parentMatch = location.pathname === tab.path;
//       const subTabMatch = tab.subTabs?.some((sub) => location.pathname === sub.path);
//       const active = parentMatch || subTabMatch;
//       acc[tab.label] = active;
//       if (active) setExpandedTab(tab.label);
//       return acc;
//     }, {});
//     setIsActive(activeTabs);
//   }, [location.pathname, fetchedTabs]);

//   const handleTabToggle = (label) => {
//     setExpandedTab((prev) => (prev === label ? null : label));
//   };

//   // -------------------------------- RENDER SIDEBAR --------------------------------
//   return (
//     <nav id="left-sidebar-nav" className="sidebar-nav">
//       <ul id="main-menu" className="metismenu">
//         {fetchedTabs.map((item, index) => (
//           <li key={index} className={`menu-item ${isActive[item.label] ? "active" : ""}`}>
//             <Link
//               to={item.path.startsWith("#") ? "#" : item.path}
//               onClick={() => handleTabToggle(item.label)}
//               className={item.subTabs.length > 0 ? "has-arrow" : ""}
//             >
//               <i className={`fa ${item.icon}`}></i>
//               <span>{item.label}</span>
//             </Link>

//             {item.subTabs.length > 0 && (
//               <ul className={`collapse ${expandedTab === item.label ? "in" : ""}`}>
//                 {item.subTabs.map((subTab, subIndex) => (
//                   <li
//                     key={subIndex}
//                     className={location.pathname === subTab.path ? "active" : ""}
//                   >
//                     <Link to={subTab.path}>{subTab.label}</Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;
