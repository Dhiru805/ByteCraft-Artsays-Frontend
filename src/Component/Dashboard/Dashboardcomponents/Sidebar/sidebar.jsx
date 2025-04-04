import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({});
  const [expandedTab, setExpandedTab] = useState(null); 
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedEmail = localStorage.getItem("email");

    if (storedUserType) {
      setUserType(storedUserType);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "fa-dashboard",
      path: `/${userType}/Dashboard`,
      subTabs: []
    },
    ...(email === "superadmin@admin.com"
      ? [
          {
            label: "Admin",
            icon: "fas fa-user",
            path: `/${userType}/Dashboard/admin`,
            subTabs: []
          }
        ]
      : []),
    {
      label: "Artist",
      icon: "fa fa-paint-brush",
      path: `#artist-management`,
      subTabs: [
        { label: "Management", path: `/${userType}/Dashboard/artistmanagetable` },
        { label: "Products", path: `/${userType}/Dashboard/allartistproduct` },
        { label: "Sold Product ", path: `/${userType}/Dashboard/artistsoldproduct` },
        { label: "Blogs", path: `/${userType}/Dashboard/artistblogs` },
        { label: "Blog Request", path: `/${userType}/Dashboard/artistblogrequest` },
        { label: "Product Request", path: `/${userType}/Dashboard/artistproductrequest` },
        { label: "Transaction", path: `/${userType}/Dashboard/artisttransaction`},
        { label: "Packaging Material", path: `/${userType}/Dashboard/artistpackagingmaterial` },
      ]
    },
    {
      label: "Buyer",
      icon: "fa-handshake",
      path: `#Buyer-management`,
      subTabs: [
        { label: "Management", path: `/${userType}/Dashboard/buyermanagetable` },
        { label: "Product Purchased", path: `/${userType}/Dashboard/buyerproductpurchased` },
        { label: "Resell Product Request", path: `/${userType}/Dashboard/buyerproductrequest` },
        { label: "Sold Product", path: `/${userType}/Dashboard/buyersoldproduct` },
        { label: "Transaction", path: `/${userType}/Dashboard/buyertransaction` },
        { label: "Packaging Material", path: `/${userType}/Dashboard/buyerpackagingmaterial` },
      ]
    },
    {
      label: "Seller",
      icon: "fa fa-tag",
      path: `#Seller-management`,
      subTabs: [
        { label: " Management", path: `/${userType}/Dashboard/sellermanagetable` },
        { label: "Products", path: `/${userType}/Dashboard/sellerproduct` },
        { label: "Product Request", path: `/${userType}/Dashboard/sellerrequest` },
        { label: "Sold  Product ", path: `/${userType}/Dashboard/sellersoldproduct` },
        { label: "Transaction", path: `/${userType}/Dashboard/sellertransaction` },
        { label: "Packaging Material", path: `/${userType}/Dashboard/sellerpackagingmaterial` }
      ]
    },
    {
      label: "Blog",
      icon: "fa fa-newspaper",
      path: `#Blog`,
      subTabs: [
        { label: "All Blogs", path: `/${userType}/Dashboard/bloglist` },
        { label: "Blog Requests", path: `/${userType}/Dashboard/BlogRequest` }
      ]
    },
      // {
      //   label: "Chat",
      //   icon: "fa-comments",
      //   path: `#Widget`,
      //   subTabs: [
      //     { label: "Inbox", path: `/${userType}/Dashboard/Appinbox` },
      //     { label: "Contact", path: `/${userType}/Dashboard/Appcontact` },
      //     { label: "Chat", path: `/${userType}/Dashboard/Appchat` }
      //   ]
      // },
      {
        label: "Product",
        icon: "fa fa-cart-plus",
        path: `#Product`,
        subTabs: [
          { label: "All Products", path: `/${userType}/Dashboard/allproduct`},
          { label: "Products Request", path: `/${userType}/Dashboard/productrequest` },
          { label: "Product Purchased", path: `/${userType}/Dashboard/productpurchased` },
          { label: "Custom Request", path: `/${userType}/Dashboard/customrequest` },
        ]
      },

      {
        label: "Resell",
        icon: "fa fa-exchange",
        path: `#Resell`,
        subTabs: [
          { label: "All Products", path: `/${userType}/Dashboard/allresellproduct` },
          { label: "Product Purchased", path: `/${userType}/Dashboard/resellproductpurchased` },
          { label: "Transaction", path: `/${userType}/Dashboard/reselltransaction` }
        ]
      },

      {
        label: "Bidding",
        icon: "fa fa-gavel",
        path: `#Bidding`,
        subTabs: [
          { label: "All Products", path: `/${userType}/Dashboard/allbiddingproduct` },
          // { label: "Product Status", path: `/${userType}/Dashboard/biddingproductststus` },
          { label: "Bidded Product", path: `/${userType}/Dashboard/biddedproduct` },
          { label: "Transaction", path: `/${userType}/Dashboard/transactionbiddedprdouct` }
        ]
      },

      {
        label: "Transaction",
        icon: "fa fa-credit-card",
        path: `/${userType}/Dashboard/alltransaction`,
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
          { label: "Product", path: `/${userType}/Dashboard/packagingmaterialproduct`},
          { label: "Product Purchased", path: `/${userType}/Dashboard/packagingproductpurchased` },
          { label: "Transaction", path: `/${userType}/Dashboard/packagingproducttransaction` },
        ]
      },
      {
        label: "Settings",
        icon: "fa fa-cog", 
        path: `#Settings`,
        subTabs: [
          { label: "Product Category", path: `/${userType}/Dashboard/productcategory`},
          { label: "Blog Category", path: `/${userType}/Dashboard/blogcategory` },
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

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null); 
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   const menuItems = [
//     {
//       label: "Dashboard",
//       icon: "fa-dashboard",
//       path: `/${userType}/Dashboard`,
//       subTabs: [],
//       allowedFor: ["SuperAdmin", "Artist"]
//     },
//     {
//       label: "Blog",
//       icon: "fa-th-large",
//       path: `#Blog`,
//       subTabs: userType === "SuperAdmin" ? [
//         { label: "Blogs", path: `/${userType}/Dashboard/Bloglist` },
//         { label: "Blog Requests", path: `/${userType}/Dashboard/BlogRequest` }
//       ] : userType === "Artist" ? [
//         { label: "Blogs", path: `/${userType}/Dashboard/Bloglist` }
//       ] : [],
//       allowedFor: ["SuperAdmin", "Artist"]
//     },
//     {
//       label: "Chat",
//       icon: "fa-comments",
//       path: `#Widget`,
//       subTabs: [
//         { label: "Inbox", path: `/${userType}/Dashboard/Appinbox` },
//         { label: "Contact", path: `/${userType}/Dashboard/Appcontact` },
//         { label: "Chat", path: `/${userType}/Dashboard/Appchat` }
//       ],
//       allowedFor: ["SuperAdmin", "Artist"]
//     },
//     {
//       label: "Artist Details",
//       icon: "fas fa-user",
//       path: `#artist-management`,
//       subTabs: userType === "SuperAdmin" ? [
//         { label: "Artist Products", path: `/${userType}/Dashboard/artists/:id` },
//         { label: "Artist Management", path: `/${userType}/Dashboard/ArtistManageTable` }
//       ] : userType === "Artist" ? [
//         { label: "Artist Products", path: `/${userType}/Dashboard/artists/:id` }
//       ] : [],
//       allowedFor: ["SuperAdmin", "Artist"]
//     },
//     {
//       label: "Product Details",
//       icon: "fa-tags",
//       path: `#Product-management`,
//       subTabs: [
//         { label: "Products Upload", path: `/${userType}/Dashboard/Product-uploade` },
//         { label: "Products", path: `/${userType}/Dashboard/artists/:id` },
//         { label: "Product Management Table", path: `/${userType}/Dashboard/ArtistManageTable` }
//       ],
//       allowedFor: ["SuperAdmin", "Artist"]
//     },
//     {
//       label: "Buyer Management",
//       icon: "fa-handshake",
//       path: `#Buyer-management`,
//       subTabs: userType === "SuperAdmin" ? [
//         { label: "Buyer Management", path: `/${userType}/Dashboard/BuyerManageTable` },
//         { label: "Buyer Request", path: `/${userType}/Dashboard/BuyerRequest` },
//         { label: "Buyer Custom Request", path: `/${userType}/Dashboard/BuyerCustomrequest` },
//         { label: "Buyer Transactions", path: `/${userType}/Dashboard/Appchat` }
//       ] : userType === "Artist" ? [
//         { label: "Buyer Request", path: `/${userType}/Dashboard/BuyerRequest` }
//       ] : [],
//       allowedFor: ["SuperAdmin", "Artist"]
//     }
//   ];
  
//   useEffect(() => {
//     if (userType) {
//       const activeTabs = menuItems.reduce((acc, item) => {
//         if (item.label === "Dashboard") {
//           acc[item.label] = location.pathname === `/${userType}/Dashboard`;
//         } else {
//           acc[item.label] = location.pathname.startsWith(item.path) ||
//             item.subTabs.some(subTab => location.pathname.startsWith(subTab.path));
//         }
//         return acc;
//       }, {});
//       setIsActive(activeTabs);
//     }
//   }, [location.pathname, userType]);

//   const handleTabToggle = (label) => {
//     setExpandedTab(prevTab => (prevTab === label ? null : label));
//   };

//   return (
//     <nav id="left-sidebar-nav" className="sidebar-nav">
//       <ul id="main-menu" className="metismenu">
//         {menuItems.filter(item => item.allowedFor.includes(userType)).map((item, index) => (
//           <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
//             <Link
//               to={item.path}
//               onClick={() => handleTabToggle(item.label)}
//               className={item.subTabs.length ? 'has-arrow' : ''}
//             >
//               <i className={`fa ${item.icon}`}></i>
//               <span>{item.label}</span>
//             </Link>
//             {item.subTabs.length > 0 && (
//               <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
//                 {item.subTabs.map((subTab, subIndex) => (
//                   <li
//                     key={subIndex}
//                     className={location.pathname.startsWith(subTab.path) ? 'active' : ''}
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

