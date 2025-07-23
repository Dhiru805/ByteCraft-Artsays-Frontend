// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Scroll } from "lucide-react";


// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [email, setEmail] = useState("");
//     const [hiddenLabels, setHiddenLabels] = useState([]);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//  if (storedEmail) {
//       setEmail(storedEmail);
//       const hidden = JSON.parse(localStorage.getItem(`admin_hiddenLabels_${storedEmail}`) || "[]");
//       setHiddenLabels(hidden);
//     }
//   }, []);

//    const menuConfig = {
//     "Super-Admin": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/super-admin/dashboard",
//         subTabs: []
//       },
//       ...(email === "shantu131201@gmail.com"
//         ? [
//           {
//             label: "Admin",
//             icon: "fas fa-user",
//             path: "/super-admin/admin",
//             subTabs: []
//           }
//         ]
//         : []),
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/super-admin/blog",
//         subTabs: []
//       },

//       {
//         label: "Artist",
//         icon: "fa fa-paint-brush",
//         path: `#artist-management`,
//         subTabs: [
//           { label: "Management", path: `/super-admin/artist/management` },
//           { label: "Blog Request", path: `/super-admin/artist/blogrequest` },
//           { label: "Blogs", path: `/super-admin/artist/blogs` },
//           { label: "Product Request", path: `/super-admin/artist/artistproductrequest` },
//           { label: "Products", path: `/super-admin/artist/allartistproduct` },
//           { label: "Sold Product ", path: `/super-admin/artist/sold-product` },
//           // { label: "Transaction", path: `/super-admin/artisttransaction`},
//           // { label: "Packaging Material", path: `/super-admin/artistpackagingmaterial` },
//         ]
//       },
//       {
//         label: "Buyer",
//         icon: "fa-handshake",
//         path: `#Buyer-management`,
//         subTabs: [
//           { label: "Management", path: `/super-admin/buyer/management` },
//           { label: "Product Purchased", path: `/super-admin/buyer/productpurchased` },
//           { label: "Resell Product Request", path: `/super-admin/buyer/resellproduct` },
//           { label: "Sold Product", path: `/super-admin/buyer/soldproduct` },
//           // { label: "Transaction", path: `/super-admin/buyertransaction` },
//           // { label: "Packaging Material", path: `/super-admin/buyerpackagingmaterial` },
//         ]
//       },
//       {
//         label: "Seller",
//         icon: "fa fa-tag",
//         path: `#Seller-management`,
//         subTabs: [
//           { label: " Management", path: `/super-admin/seller/management` },
//           { label: "Products", path: `/super-admin/seller/product` },
//           { label: "Product Request", path: `/super-admin/seller/productrequest` },
//           { label: "Sold  Product ", path: `/super-admin/seller/soldproduct` },
//           // { label: "Transaction", path: `/super-admin/seller/transaction` },
//           // { label: "Packaging Material", path: `/super-admin/seller/packagingmaterial` }
//         ]
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/product-table`,
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/customordertable`,
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/purchasetable`,
//         subTabs: []
//       },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/super-admin/bidding/allproduct` },
//           { label: "Bidded Product", path: `/super-admin/bidding/bidded-product` },
//           { label: "Bidding Pass", path: `/super-admin/bidding/pass-table` }
//         ]
//       },
//       {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `#`,
//         path: `/super-admin/certification`,
//         subTabs: []
//       },

//       {
//         label: "Sponsor",
//         icon: "fa fa-bullhorn",
//         path: `/super-admin/advertise`,
//         subTabs: []
//       },


//       // {
//       //   label: "Transaction",
//       //   icon: "fa fa-credit-card",
//       //   path: `/super-admin/alltransaction`,
//       //   subTabs: [
//       //     // { label: "All Transaction", path: `/${userType}/Dashboard/alltransaction` },
//       //     // { label: "Product Transaction", path: `#` },
//       //     // { label: "Resell Product Transacticon", path: `#` },
//       //     // { label: "Bidding Transaction", path: `#` }
//       //   ]
//       // },
//       // {
//       //   label: "Packaging Material",
//       //   icon: "fa fa-archive",
//       //   path: `#Packaging Material`,
//       //   subTabs: [
//       //     { label: "Product", path: `/super-admin/packagingmaterialproduct`},
//       //     { label: "Product Purchased", path: `/super-admin/packagingproductpurchased` },
//       //     { label: "Transaction", path: `/super-admin/packagingproducttransaction` },
//       //   ]
//       // },
//       {
//         label: "Settings",
//         icon: "fa fa-cog",
//         path: `#Settings`,
//         subTabs: [
//           { label: "Product Category", path: `/super-admin/settings/product-category` },
//           { label: "Blog Category", path: `/super-admin/settings/blog-category` },
//           { label: "Email Setting", path: `/super-admin/settings/email-setting` },
//           { label: "Marketing", path: `/super-admin/settings/marketing` },
//         ]
//       }
//     ],
//     // ----------------------------------------------Artist-----------------------------------------------------//
//     "Artist": [
      // {
      //   label: "Dashboard",
      //   icon: "fa-dashboard",
      //   path: "/artist/dashboard",
      //   subTabs: []
      // },
      // {
      //   label: "Blogs",
      //   icon: "fa fa-newspaper",
      //   path: "/artist/bloglist",
      //   subTabs: []
      // },
      // {
      //   label: "Product",
      //   icon: "fa fa-cart-plus",
      //   path: "/artist/product",
      //   subTabs: []
      // },
      // {
      //   label: "Custom Order",
      //   icon: "fa fa-cart-plus",
      //   path: "/artist/custom-order",
      //   subTabs: []
      // },
      // {
      //   label: "Product Purchased",
      //   icon: "fa fa-cart-plus",
      //   path: "/artist/product-purchase",
      //   subTabs: []

      // },
      // {
      //   label: "Advertise",
      //   icon: "fa fa-bullhorn",
      //   path: `/artist/advertise`,
      //   subTabs: []
      // },
      // {  
      // label: "Bidding",
      //   icon: "fa fa-gavel",
      //   path: `#Bidding`,
      //   subTabs: [
      //     { label: "All Products", path: `/artist/bidding-products-table`},
      //     { label: "Bidded Product", path: `/artist/bidded-products-table` },
      //     { label: "Bidding Pass", path: `/artist/bidding-pass-table` }
      //   ]
      // },
      //       {
      //   label: "Certification Services",
      //    icon: "fa fa-certificate",
      //   path: `/artist/certification`,
      //   subTabs: []
      // },

//     ],
//     // ----------------------------------------------Buyer-----------------------------------------------------//
//     "Buyer": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/buyer/dashboard",
//         subTabs: []
//       },
//     ],
//     // ----------------------------------------------Seller-----------------------------------------------------//
//     "Seller": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/seller/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/seller/product-details",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/seller/purchased-product",
//         subTabs: []
//       },    
//       {  
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/seller/bidding-products-table`},
//           { label: "Bidded Product", path: `/seller/bidded-products-table` },
//           { label: "Bidding Pass", path: `/seller/bidding-pass-table` }
//         ]
//       },
//           {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `#`,
//         path: `/seller/advertise`,
//         subTabs: []
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: `#`,
//         path: `/seller/certification`,
//         subTabs: []
//       },


//     ],

//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);
  
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [location.pathname]);

//   const menuItems = userType ? menuConfig[userType] || [] : [];

//   useEffect(() => {
//     if (userType) {
//       const items = menuConfig[userType] || [];
//       const activeTabs = items.reduce((acc, item) => {
//         const isParentMatch = location.pathname.startsWith(item.path);
//         const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
//         const isActive = isParentMatch || isSubTabMatch;
//         acc[item.label] = isActive;

//         if (isActive) {
//           setExpandedTab(item.label);
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
//         {menuItems.map((item, index) => (
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
//                     className={location.pathname === subTab.path ? 'active' : ''}
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


// export const allSidebarLabels = Array.from(
//   new Set(
//     Object.values({
//       "Super-Admin": [
//         {
//           label: "Dashboard"
//         },
//         ...(typeof window !== "undefined" &&
//         localStorage.getItem("email") === "shantu131201@gmail.com"
//           ? [{ label: "Admin" }]
//           : []),
//         { label: "Blogs" },
//         { label: "Artist" },
//         { label: "Buyer" },
//         { label: "Seller" },
//         { label: "Product" },
//         { label: "Custom Order" },
//         { label: "Product Purchased" },
//         { label: "Bidding" },
//         { label: "Certification Services" },
//         { label: "Sponsor" },
//         { label: "Settings" }
//       ]
//     })
//       .flat()
//       .map(item => item.label)
//   )
// );




// export const allSidebarLabels = [
//   {
//     label: "Dashboard",
//     subLabels: []
//   },
//   ...(typeof window !== "undefined" &&
//   localStorage.getItem("email") === "shantu131201@gmail.com"
//     ? [{
//         label: "Admin",
//         subLabels: []
//       }]
//     : []),
//   {
//     label: "Blogs",
//     subLabels: []
//   },
//   {
//     label: "Artist",
//     subLabels: [
//       "Management",
//       "Blog Request",
//       "Blogs",
//       "Product Request",
//       "Products",
//       "Sold Product"
//     ]
//   },
//   {
//     label: "Buyer",
//     subLabels: [
//       "Management",
//       "Product Purchased",
//       "Resell Product Request",
//       "Sold Product"
//     ]
//   },
//   {
//     label: "Seller",
//     subLabels: [
//       "Management",
//       "Products",
//       "Product Request",
//       "Sold  Product"
//     ]
//   },
//   {
//     label: "Product",
//     subLabels: []
//   },
//   {
//     label: "Custom Order",
//     subLabels: []
//   },
//   {
//     label: "Product Purchased",
//     subLabels: []
//   },
//   {
//     label: "Bidding",
//     subLabels: [
//       "All Products",
//       "Bidded Product",
//       "Bidding Pass"
//     ]
//   },
//   {
//     label: "Certification Services",
//     subLabels: []
//   },
//   {
//     label: "Sponsor",
//     subLabels: []
//   },
//   {
//     label: "Settings",
//     subLabels: [
//       "Product Category",
//       "Blog Category",
//       "Email Setting",
//       "Marketing"
//     ]
//   }
// ];









// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [email, setEmail] = useState("");
//   const [hiddenLabels, setHiddenLabels] = useState([]); // ✅ Holds labels to hide

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//       const hidden = JSON.parse(localStorage.getItem(`admin_hiddenLabels_${storedEmail}`) || "[]");
//       setHiddenLabels(hidden); // ✅ Load hidden labels for logged-in admin
//     }
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === `admin_hiddenLabels_${email}`) {
//         const updatedLabels = JSON.parse(event.newValue || '[]');
//         setHiddenLabels(updatedLabels); // ✅ Update hidden labels live
//         // ✅ Prevent hiding "Admin" at runtime too
//           hiddenLabels = hiddenLabels.filter(label => label !== "Admin");

//           const visibleSidebarLabels = allSidebarLabels.filter(label => !hiddenLabels.includes(label));
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [email]);

//   const menuConfig = {
//     // ⏩ Your entire menuConfig remains unchanged
//     "Super-Admin": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/super-admin/dashboard",
//         subTabs: []
//       },
//       ...(email === "shantu131201@gmail.com"
//         ? [
//           {
//             label: "Admin",
//             icon: "fas fa-user",
//             path: "/super-admin/admin",
//             subTabs: []
//           }
//         ]
//         : []),
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/super-admin/blog",
//         subTabs: []
//       },

//       {
//         label: "Artist",
//         icon: "fa fa-paint-brush",
//         path: `#artist-management`,
//         subTabs: [
//           { label: "Management", path: `/super-admin/artist/management` },
//           { label: "Blog Request", path: `/super-admin/artist/blogrequest` },
//           { label: "Blogs", path: `/super-admin/artist/blogs` },
//           { label: "Product Request", path: `/super-admin/artist/artistproductrequest` },
//           { label: "Products", path: `/super-admin/artist/allartistproduct` },
//           { label: "Sold Product ", path: `/super-admin/artist/sold-product` },
//           // { label: "Transaction", path: `/super-admin/artisttransaction`},
//           // { label: "Packaging Material", path: `/super-admin/artistpackagingmaterial` },
//         ]
//       },
//       {
//         label: "Buyer",
//         icon: "fa-handshake",
//         path: `#Buyer-management`,
//         subTabs: [
//           { label: "Management", path: `/super-admin/buyer/management` },
//           { label: "Product Purchased", path: `/super-admin/buyer/productpurchased` },
//           { label: "Resell Product Request", path: `/super-admin/buyer/resellproduct` },
//           { label: "Sold Product", path: `/super-admin/buyer/soldproduct` },
//           // { label: "Transaction", path: `/super-admin/buyertransaction` },
//           // { label: "Packaging Material", path: `/super-admin/buyerpackagingmaterial` },
//         ]
//       },
//       {
//         label: "Seller",
//         icon: "fa fa-tag",
//         path: `#Seller-management`,
//         subTabs: [
//           { label: " Management", path: `/super-admin/seller/management` },
//           { label: "Products", path: `/super-admin/seller/product` },
//           { label: "Product Request", path: `/super-admin/seller/productrequest` },
//           { label: "Sold  Product ", path: `/super-admin/seller/soldproduct` },
//           // { label: "Transaction", path: `/super-admin/seller/transaction` },
//           // { label: "Packaging Material", path: `/super-admin/seller/packagingmaterial` }
//         ]
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/product-table`,
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/customordertable`,
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/purchasetable`,
//         subTabs: []
//       },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/super-admin/bidding/allproduct` },
//           { label: "Bidded Product", path: `/super-admin/bidding/bidded-product` },
//           { label: "Bidding Pass", path: `/super-admin/bidding/pass-table` }
//         ]
//       },
//       {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `#`,
//         path: `/super-admin/certification`,
//         subTabs: []
//       },

//       {
//         label: "Sponsor",
//         icon: "fa fa-bullhorn",
//         path: `/super-admin/advertise`,
//         subTabs: []
//       },


//       // {
//       //   label: "Transaction",
//       //   icon: "fa fa-credit-card",
//       //   path: `/super-admin/alltransaction`,
//       //   subTabs: [
//       //     // { label: "All Transaction", path: `/${userType}/Dashboard/alltransaction` },
//       //     // { label: "Product Transaction", path: `#` },
//       //     // { label: "Resell Product Transacticon", path: `#` },
//       //     // { label: "Bidding Transaction", path: `#` }
//       //   ]
//       // },
//       // {
//       //   label: "Packaging Material",
//       //   icon: "fa fa-archive",
//       //   path: `#Packaging Material`,
//       //   subTabs: [
//       //     { label: "Product", path: `/super-admin/packagingmaterialproduct`},
//       //     { label: "Product Purchased", path: `/super-admin/packagingproductpurchased` },
//       //     { label: "Transaction", path: `/super-admin/packagingproducttransaction` },
//       //   ]
//       // },
//       {
//         label: "Settings",
//         icon: "fa fa-cog",
//         path: `#Settings`,
//         subTabs: [
//           { label: "Product Category", path: `/super-admin/settings/product-category` },
//           { label: "Blog Category", path: `/super-admin/settings/blog-category` },
//           { label: "Email Setting", path: `/super-admin/settings/email-setting` },
//           { label: "Marketing", path: `/super-admin/settings/marketing` },
//         ]
//       }
//     ],
//     // ----------------------------------------------Artist-----------------------------------------------------//
//     "Artist": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/artist/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/artist/bloglist",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product",
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: "/artist/custom-order",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product-purchase",
//         subTabs: []

//       },
//       {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `/artist/advertise`,
//         subTabs: []
//       },
//       {  
//       label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/artist/bidding-products-table`},
//           { label: "Bidded Product", path: `/artist/bidded-products-table` },
//           { label: "Bidding Pass", path: `/artist/bidding-pass-table` }
//         ]
//       },
//             {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `/artist/certification`,
//         subTabs: []
//       },

//     ],
//     // ----------------------------------------------Buyer-----------------------------------------------------//
//     "Buyer": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/buyer/dashboard",
//         subTabs: []
//       },
//     ],
//     // ----------------------------------------------Seller-----------------------------------------------------//
//     "Seller": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/seller/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/seller/product-details",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/seller/purchased-product",
//         subTabs: []
//       },    
//       {  
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/seller/bidding-products-table`},
//           { label: "Bidded Product", path: `/seller/bidded-products-table` },
//           { label: "Bidding Pass", path: `/seller/bidding-pass-table` }
//         ]
//       },
//           {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `#`,
//         path: `/seller/advertise`,
//         subTabs: []
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: `#`,
//         path: `/seller/certification`,
//         subTabs: []
//       },


//     ],
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [location.pathname]);

//   const menuItems = userType ? menuConfig[userType] || [] : [];

//   useEffect(() => {
//     if (userType) {
//       const items = menuConfig[userType] || [];
//       const activeTabs = items.reduce((acc, item) => {
//         const isParentMatch = location.pathname.startsWith(item.path);
//         const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
//         const isActive = isParentMatch || isSubTabMatch;
//         acc[item.label] = isActive;

//         if (isActive) {
//           setExpandedTab(item.label);
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
//         {menuItems.map((item, index) => {
//           // ✅ Hide items if label is in hiddenLabels array
//           if (hiddenLabels.includes(item.label)) return null;

//           return (
//             <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
//               <Link
//                 to={item.path}
//                 onClick={() => handleTabToggle(item.label)}
//                 className={item.subTabs.length ? 'has-arrow' : ''}
//               >
//                 <i className={`fa ${item.icon}`}></i>
//                 <span>{item.label}</span>
//               </Link>

//               {item.subTabs.length > 0 && (
//                 <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
//                   {item.subTabs.map((subTab, subIndex) => (
//                     <li
//                       key={subIndex}
//                       className={location.pathname === subTab.path ? 'active' : ''}
//                     >
//                       <Link to={subTab.path}>{subTab.label}</Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;




// export const allSidebarLabels = Array.from(
//   new Set(
//     Object.values({
//       "Super-Admin": [
//         {
//           label: "Dashboard"
//         },
//         ...(typeof window !== "undefined" &&
//         localStorage.getItem("email") === "shantu131201@gmail.com"
//           ? [{ label: "Admin" }]
//           : []),
//         { label: "Blogs" },
//         { label: "Artist" },
//         { label: "Buyer" },
//         { label: "Seller" },
//         { label: "Product" },
//         { label: "Custom Order" },
//         { label: "Product Purchased" },
//         { label: "Bidding" },
//         { label: "Certification Services" },
//         { label: "Sponsor" },
//         { label: "Settings" }
//       ]
//     })
//       .flat()
//       .map(item => item.label)
//   )
// );



//                import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [email, setEmail] = useState("");
//   const [hiddenLabels, setHiddenLabels] = useState([]); // ✅ Holds labels to hide

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//       const hidden = JSON.parse(localStorage.getItem(`admin_hiddenLabels_${storedEmail}`) || "[]");
//       setHiddenLabels(hidden); // ✅ Load hidden labels for logged-in admin
//     }
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === `admin_hiddenLabels_${email}`) {
//         const updatedLabels = JSON.parse(event.newValue || '[]');
//         setHiddenLabels(updatedLabels); // ✅ Update hidden labels live
//         // ✅ Prevent hiding "Admin" at runtime too
//           hiddenLabels = hiddenLabels.filter(label => label !== "Admin");

//           const visibleSidebarLabels = allSidebarLabels.filter(label => !hiddenLabels.includes(label));
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [email]);

//   const menuConfig = {
//     // ⏩ Your entire menuConfig remains unchanged
//     "Super-Admin": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/super-admin/dashboard",
//         subTabs: []
//       },
//       ...(email === "shantu131201@gmail.com"
//         ? [
//           {
//             label: "Admin",
//             icon: "fas fa-user",
//             path: "/super-admin/admin",
//             subTabs: []
//           }
//         ]
//         : []),
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/super-admin/blog",
//         subTabs: []
//       },

//       {
//         label: "Artist",
//         icon: "fa fa-paint-brush",
//         path: `#artist-management`,
//         subTabs: [
//           { label: "Management", path: `/super-admin/artist/management` },
//           { label: "Blog Request", path: `/super-admin/artist/blogrequest` },
//           { label: "Blogs", path: `/super-admin/artist/blogs` },
//           { label: "Product Request", path: `/super-admin/artist/artistproductrequest` },
//           { label: "Products", path: `/super-admin/artist/allartistproduct` },
//           { label: "Sold Product ", path: `/super-admin/artist/sold-product` },
//           // { label: "Transaction", path: `/super-admin/artisttransaction`},
//           // { label: "Packaging Material", path: `/super-admin/artistpackagingmaterial` },
//         ]
//       },
//       {
//         label: "Buyer",
//         icon: "fa-handshake",
//         path: `#Buyer-management`,
//         subTabs: [
//           { label: "Management", path: `/super-admin/buyer/management` },
//           { label: "Product Purchased", path: `/super-admin/buyer/productpurchased` },
//           { label: "Resell Product Request", path: `/super-admin/buyer/resellproduct` },
//           { label: "Sold Product", path: `/super-admin/buyer/soldproduct` },
//           // { label: "Transaction", path: `/super-admin/buyertransaction` },
//           // { label: "Packaging Material", path: `/super-admin/buyerpackagingmaterial` },
//         ]
//       },
//       {
//         label: "Seller",
//         icon: "fa fa-tag",
//         path: `#Seller-management`,
//         subTabs: [
//           { label: " Management", path: `/super-admin/seller/management` },
//           { label: "Products", path: `/super-admin/seller/product` },
//           { label: "Product Request", path: `/super-admin/seller/productrequest` },
//           { label: "Sold  Product ", path: `/super-admin/seller/soldproduct` },
//           // { label: "Transaction", path: `/super-admin/seller/transaction` },
//           // { label: "Packaging Material", path: `/super-admin/seller/packagingmaterial` }
//         ]
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/product-table`,
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/customordertable`,
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: `/super-admin/purchasetable`,
//         subTabs: []
//       },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/super-admin/bidding/allproduct` },
//           { label: "Bidded Product", path: `/super-admin/bidding/bidded-product` },
//           { label: "Bidding Pass", path: `/super-admin/bidding/pass-table` }
//         ]
//       },
//       {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `#`,
//         path: `/super-admin/certification`,
//         subTabs: []
//       },

//       {
//         label: "Sponsor",
//         icon: "fa fa-bullhorn",
//         path: `/super-admin/advertise`,
//         subTabs: []
//       },


//       // {
//       //   label: "Transaction",
//       //   icon: "fa fa-credit-card",
//       //   path: `/super-admin/alltransaction`,
//       //   subTabs: [
//       //     // { label: "All Transaction", path: `/${userType}/Dashboard/alltransaction` },
//       //     // { label: "Product Transaction", path: `#` },
//       //     // { label: "Resell Product Transacticon", path: `#` },
//       //     // { label: "Bidding Transaction", path: `#` }
//       //   ]
//       // },
//       // {
//       //   label: "Packaging Material",
//       //   icon: "fa fa-archive",
//       //   path: `#Packaging Material`,
//       //   subTabs: [
//       //     { label: "Product", path: `/super-admin/packagingmaterialproduct`},
//       //     { label: "Product Purchased", path: `/super-admin/packagingproductpurchased` },
//       //     { label: "Transaction", path: `/super-admin/packagingproducttransaction` },
//       //   ]
//       // },
//       {
//         label: "Settings",
//         icon: "fa fa-cog",
//         path: `#Settings`,
//         subTabs: [
//           { label: "Product Category", path: `/super-admin/settings/product-category` },
//           { label: "Blog Category", path: `/super-admin/settings/blog-category` },
//           { label: "Email Setting", path: `/super-admin/settings/email-setting` },
//           { label: "Marketing", path: `/super-admin/settings/marketing` },
//         ]
//       }
//     ],
//     // ----------------------------------------------Artist-----------------------------------------------------//
//     "Artist": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/artist/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/artist/bloglist",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product",
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: "/artist/custom-order",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product-purchase",
//         subTabs: []

//       },
//       {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `/artist/advertise`,
//         subTabs: []
//       },
//       {  
//       label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/artist/bidding-products-table`},
//           { label: "Bidded Product", path: `/artist/bidded-products-table` },
//           { label: "Bidding Pass", path: `/artist/bidding-pass-table` }
//         ]
//       },
//             {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `/artist/certification`,
//         subTabs: []
//       },

//     ],
//     // ----------------------------------------------Buyer-----------------------------------------------------//
//     "Buyer": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/buyer/dashboard",
//         subTabs: []
//       },
//     ],
//     // ----------------------------------------------Seller-----------------------------------------------------//
//     "Seller": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/seller/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/seller/product-details",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/seller/purchased-product",
//         subTabs: []
//       },    
//       {  
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/seller/bidding-products-table`},
//           { label: "Bidded Product", path: `/seller/bidded-products-table` },
//           { label: "Bidding Pass", path: `/seller/bidding-pass-table` }
//         ]
//       },
//           {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `#`,
//         path: `/seller/advertise`,
//         subTabs: []
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: `#`,
//         path: `/seller/certification`,
//         subTabs: []
//       },


//     ],
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [location.pathname]);

//   const menuItems = userType ? menuConfig[userType] || [] : [];

//   useEffect(() => {
//     if (userType) {
//       const items = menuConfig[userType] || [];
//       const activeTabs = items.reduce((acc, item) => {
//         const isParentMatch = location.pathname.startsWith(item.path);
//         const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
//         const isActive = isParentMatch || isSubTabMatch;
//         acc[item.label] = isActive;

//         if (isActive) {
//           setExpandedTab(item.label);
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
//         {menuItems.map((item, index) => {
//           // ✅ Hide items if label is in hiddenLabels array
//           if (hiddenLabels.includes(item.label)) return null;

//           return (
//             <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
//               <Link
//                 to={item.path}
//                 onClick={() => handleTabToggle(item.label)}
//                 className={item.subTabs.length ? 'has-arrow' : ''}
//               >
//                 <i className={`fa ${item.icon}`}></i>
//                 <span>{item.label}</span>
//               </Link>

//               {item.subTabs.length > 0 && (
//                 <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
//                   {item.subTabs.map((subTab, subIndex) => (
//                     <li
//                       key={subIndex}
//                       className={location.pathname === subTab.path ? 'active' : ''}
//                     >
//                       <Link to={subTab.path}>{subTab.label}</Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;




// export const allSidebarLabels = Array.from(
//   new Set(
//     Object.values({
//       "Super-Admin": [
//         {
//           label: "Dashboard"
//         },
//         ...(typeof window !== "undefined" &&
//         localStorage.getItem("email") === "shantu131201@gmail.com"
//           ? [{ label: "Admin" }]
//           : []),
//         { label: "Blogs" },
//         { label: "Artist" },
//         { label: "Buyer" },
//         { label: "Seller" },
//         { label: "Product" },
//         { label: "Custom Order" },
//         { label: "Product Purchased" },
//         { label: "Bidding" },
//         { label: "Certification Services" },
//         { label: "Sponsor" },
//         { label: "Settings" }
//       ]
//     })
//       .flat()
//       .map(item => item.label)
//   )
// );




      
//         import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [email, setEmail] = useState("");
//   const [hiddenItems, setHiddenItems] = useState({
//     labels: [],
//     subtabs: {}
//   });

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//       const hiddenData = JSON.parse(
//         localStorage.getItem(`admin_hiddenItems_${storedEmail}`) || 
//         '{"labels":[],"subtabs":{}}'
//       );
//       setHiddenItems(hiddenData);
//     }
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === `admin_hiddenItems_${email}`) {
//         const updatedData = JSON.parse(event.newValue || '{"labels":[],"subtabs":{}}');
//         setHiddenItems(updatedData);
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [email]);

//   const menuConfig = {
//     "Super-Admin": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/super-admin/dashboard",
//         subTabs: []
//       },
//       ...(email === "shantu131201@gmail.com"
//         ? [
//           {
//             label: "Admin",
//             icon: "fas fa-user",
//             path: "/super-admin/admin",
//             subTabs: []
//           }
//         ]
//         : []),
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/super-admin/blog",
//         subTabs: []
//       },
//       {
//         label: "Artist",
//         icon: "fa fa-paint-brush",
//         path: "#artist-management",
//         subTabs: [
//           { label: "Management", path: "/super-admin/artist/management" },
//           { label: "Blog Request", path: "/super-admin/artist/blogrequest" },
//           { label: "Blogs", path: "/super-admin/artist/blogs" },
//           { label: "Product Request", path: "/super-admin/artist/artistproductrequest" },
//           { label: "Products", path: "/super-admin/artist/allartistproduct" },
//           { label: "Sold Product", path: "/super-admin/artist/sold-product" },
//         ]
//       },
//       {
//         label: "Buyer",
//         icon: "fa-handshake",
//         path: "#Buyer-management",
//         subTabs: [
//           { label: "Management", path: "/super-admin/buyer/management" },
//           { label: "Product Purchased", path: "/super-admin/buyer/productpurchased" },
//           { label: "Resell Product Request", path: "/super-admin/buyer/resellproduct" },
//           { label: "Sold Product", path: "/super-admin/buyer/soldproduct" },
//         ]
//       },
//       {
//         label: "Seller",
//         icon: "fa fa-tag",
//         path: "#Seller-management",
//         subTabs: [
//           { label: "Management", path: "/super-admin/seller/management" },
//           { label: "Products", path: "/super-admin/seller/product" },
//           { label: "Product Request", path: "/super-admin/seller/productrequest" },
//           { label: "Sold Product", path: "/super-admin/seller/soldproduct" },
//         ]
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/super-admin/product-table",
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: "/super-admin/customordertable",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/super-admin/purchasetable",
//         subTabs: []
//       },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: "#Bidding",
//         subTabs: [
//           { label: "All Products", path: "/super-admin/bidding/allproduct" },
//           { label: "Bidded Product", path: "/super-admin/bidding/bidded-product" },
//           { label: "Bidding Pass", path: "/super-admin/bidding/pass-table" }
//         ]
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: "/super-admin/certification",
//         subTabs: []
//       },
//       {
//         label: "Sponsor",
//         icon: "fa fa-bullhorn",
//         path: "/super-admin/advertise",
//         subTabs: []
//       },
//       {
//         label: "Settings",
//         icon: "fa fa-cog",
//         path: "#Settings",
//         subTabs: [
//           { label: "Product Category", path: "/super-admin/settings/product-category" },
//           { label: "Blog Category", path: "/super-admin/settings/blog-category" },
//           { label: "Email Setting", path: "/super-admin/settings/email-setting" },
//           { label: "Marketing", path: "/super-admin/settings/marketing" },
//         ]
//       }
//     ],
//     "Artist": [
//        {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/artist/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/artist/bloglist",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product",
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: "/artist/custom-order",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product-purchase",
//         subTabs: []

//       },
//       {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `/artist/advertise`,
//         subTabs: []
//       },
//       {  
//       label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/artist/bidding-products-table`},
//           { label: "Bidded Product", path: `/artist/bidded-products-table` },
//           { label: "Bidding Pass", path: `/artist/bidding-pass-table` }
//         ]
//       },
//             {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `/artist/certification`,
//         subTabs: []
//       },
//     ],
//     "Buyer": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/buyer/dashboard",
//         subTabs: []
//       },
//     ],
//     "Seller": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/seller/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/seller/product-details",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/seller/purchased-product",
//         subTabs: []
//       },    
//       {  
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/seller/bidding-products-table`},
//           { label: "Bidded Product", path: `/seller/bidded-products-table` },
//           { label: "Bidding Pass", path: `/seller/bidding-pass-table` }
//         ]
//       },
//           {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `#`,
//         path: `/seller/advertise`,
//         subTabs: []
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: `#`,
//         path: `/seller/certification`,
//         subTabs: []
//       },
//     ],
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [location.pathname]);

//   const menuItems = userType ? menuConfig[userType] || [] : [];

//   useEffect(() => {
//     if (userType) {
//       const items = menuConfig[userType] || [];
//       const activeTabs = items.reduce((acc, item) => {
//         const isParentMatch = location.pathname.startsWith(item.path);
//         const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
//         const isActive = isParentMatch || isSubTabMatch;
//         acc[item.label] = isActive;

//         if (isActive) {
//           setExpandedTab(item.label);
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
//         {menuItems.map((item, index) => {
//           if (hiddenItems.labels.includes(item.label)) return null;

//           return (
//             <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
//               <Link
//                 to={item.path}
//                 onClick={() => handleTabToggle(item.label)}
//                 className={item.subTabs.length ? 'has-arrow' : ''}
//               >
//                 <i className={`fa ${item.icon}`}></i>
//                 <span>{item.label}</span>
//               </Link>

//               {item.subTabs.length > 0 && (
//                 <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
//                   {item.subTabs.map((subTab, subIndex) => (
//                     !(hiddenItems.subtabs[item.label] || []).includes(subTab.label) && (
//                       <li
//                         key={subIndex}
//                         className={location.pathname === subTab.path ? 'active' : ''}
//                       >
//                         <Link to={subTab.path}>{subTab.label}</Link>
//                       </li>
//                     )
//                   ))}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export const allSidebarLabels = {
//   mainLabels: [
//     "Dashboard",
//     "Admin",
//     "Blogs",
//     "Artist",
//     "Buyer",
//     "Seller",
//     "Product",
//     "Custom Order",
//     "Product Purchased",
//     "Bidding",
//     "Certification Services",
//     "Sponsor",
//     "Settings"
//   ],
//   subtabs: {
//     "Artist": [
//       "Management",
//       "Blog Request",
//       "Blogs",
//       "Product Request",
//       "Products",
//       "Sold Product"
//     ],
//     "Buyer": [
//       "Management",
//       "Product Purchased",
//       "Resell Product Request",
//       "Sold Product"
//     ],
//     "Seller": [
//       "Management",
//       "Products",
//       "Product Request",
//       "Sold Product"
//     ],
//     "Bidding": [
//       "All Products",
//       "Bidded Product",
//       "Bidding Pass"
//     ],
//     "Settings": [
//       "Product Category",
//       "Blog Category",
//       "Email Setting",
//       "Marketing"
//     ]
//   }
// };

// export default Sidebar;




       import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState({});
  const [expandedTab, setExpandedTab] = useState(null);
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState("");
  
  // Updated state structure with proper initialization
  const [hiddenItems, setHiddenItems] = useState({
    labels: [],
    subtabs: {}
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      // Parse with proper fallback structure
      const hiddenData = JSON.parse(
        localStorage.getItem(`admin_hiddenItems_${storedEmail}`) || 
        JSON.stringify({ labels: [], subtabs: {} })
      );
      setHiddenItems(hiddenData);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === `admin_hiddenItems_${email}`) {
        try {
          const updatedData = JSON.parse(event.newValue || '{"labels":[],"subtabs":{}}');
          setHiddenItems(updatedData);
        } catch (e) {
          console.error("Error parsing hidden items:", e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [email]);

  // ... (keep existing menuConfig and other useEffect hooks the same)

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
        label: "Blogs",
        icon: "fa fa-newspaper",
        path: "/super-admin/blog",
        subTabs: []
      },
      {
        label: "Artist",
        icon: "fa fa-paint-brush",
        path: "#artist-management",
        subTabs: [
          { label: "Management", path: "/super-admin/artist/management" },
          { label: "Blog Request", path: "/super-admin/artist/blogrequest" },
          { label: "Blogs", path: "/super-admin/artist/blogs" },
          { label: "Product Request", path: "/super-admin/artist/artistproductrequest" },
          { label: "Products", path: "/super-admin/artist/allartistproduct" },
          { label: "Sold Product", path: "/super-admin/artist/sold-product" },
        ]
      },
      {
        label: "Buyer",
        icon: "fa-handshake",
        path: "#Buyer-management",
        subTabs: [
          { label: "Management", path: "/super-admin/buyer/management" },
          { label: "Product Purchased", path: "/super-admin/buyer/productpurchased" },
          { label: "Resell Product Request", path: "/super-admin/buyer/resellproduct" },
          { label: "Sold Product", path: "/super-admin/buyer/soldproduct" },
        ]
      },
      {
        label: "Seller",
        icon: "fa fa-tag",
        path: "#Seller-management",
        subTabs: [
          { label: "Management", path: "/super-admin/seller/management" },
          { label: "Products", path: "/super-admin/seller/product" },
          { label: "Product Request", path: "/super-admin/seller/productrequest" },
          { label: "Sold Product", path: "/super-admin/seller/soldproduct" },
        ]
      },
      {
        label: "Product",
        icon: "fa fa-cart-plus",
        path: "/super-admin/product-table",
        subTabs: []
      },
      {
        label: "Custom Order",
        icon: "fa fa-cart-plus",
        path: "/super-admin/customordertable",
        subTabs: []
      },
      {
        label: "Product Purchased",
        icon: "fa fa-cart-plus",
        path: "/super-admin/purchasetable",
        subTabs: []
      },
      {
        label: "Bidding",
        icon: "fa fa-gavel",
        path: "#Bidding",
        subTabs: [
          { label: "All Products", path: "/super-admin/bidding/allproduct" },
          { label: "Bidded Product", path: "/super-admin/bidding/bidded-product" },
          { label: "Bidding Pass", path: "/super-admin/bidding/pass-table" }
        ]
      },
      {
        label: "Certification Services",
        icon: "fa fa-certificate",
        path: "/super-admin/certification",
        subTabs: []
      },
      {
        label: "Sponsor",
        icon: "fa fa-bullhorn",
        path: "/super-admin/advertise",
        subTabs: []
      },
      {
        label: "Settings",
        icon: "fa fa-cog",
        path: "#Settings",
        subTabs: [
          { label: "Product Category", path: "/super-admin/settings/product-category" },
          { label: "Blog Category", path: "/super-admin/settings/blog-category" },
          { label: "Email Setting", path: "/super-admin/settings/email-setting" },
          { label: "Marketing", path: "/super-admin/settings/marketing" },
        ]
      }
    ],
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
          { label: "All Products", path: `/artist/bidding-products-table`},
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
    ],
    "Buyer": [
      {
        label: "Dashboard",
        icon: "fa-dashboard",
        path: "/buyer/dashboard",
        subTabs: []
      },
    ],
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
          { label: "All Products", path: `/seller/bidding-products-table`},
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
    ],
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
        {menuItems.map((item, index) => {
          // Skip if main label is hidden
          if (hiddenItems.labels.includes(item.label)) return null;

          return (
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
                  {item.subTabs.map((subTab, subIndex) => {
                    // Only hide if explicitly in hidden subtabs array
                    const isHidden = hiddenItems.subtabs[item.label] 
                      ? hiddenItems.subtabs[item.label].includes(subTab.label)
                      : false;
                    
                    if (isHidden) return null;
                    
                    return (
                      <li
                        key={subIndex}
                        className={location.pathname === subTab.path ? 'active' : ''}
                      >
                        <Link to={subTab.path}>{subTab.label}</Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
export default Sidebar;

export const allSidebarLabels = {
  mainLabels: [
    "Dashboard",
    "Admin",
    "Blogs",
    "Artist", 
    "Buyer",
    "Seller",
    "Product",
    "Custom Order",
    "Product Purchased",
    "Bidding",
    "Certification Services",
    "Sponsor",
    "Settings"
  ],
  subtabs: {
    "Artist": [
      "Management",
      "Blog Request",
      "Blogs",
      "Product Request",
      "Products",
      "Sold Product"
    ],
    "Buyer": [
      "Management",
      "Product Purchased",
      "Resell Product Request", 
      "Sold Product"
    ],
    "Seller": [
      "Management",
      "Products",
      "Product Request",
      "Sold Product"
    ],
    "Bidding": [
      "All Products",
      "Bidded Product",
      "Bidding Pass"
    ],
    "Settings": [
      "Product Category",
      "Blog Category",
      "Email Setting",
      "Marketing"
    ]
  }
};






// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [email, setEmail] = useState("");
  
//   // Initialize with all subtabs visible by default
//   const [hiddenItems, setHiddenItems] = useState({
//     labels: [],
//     subtabs: {}
//   });

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//       try {
//         const savedData = localStorage.getItem(`admin_hiddenItems_${storedEmail}`);
//         if (savedData) {
//           const parsedData = JSON.parse(savedData);
//           // Ensure all parent labels exist in subtabs
//           const completeSubtabs = { ...parsedData.subtabs };
//           Object.keys(allSidebarLabels.subtabs).forEach(parentLabel => {
//             if (!completeSubtabs[parentLabel]) {
//               completeSubtabs[parentLabel] = [];
//             }
//           });
//           setHiddenItems({
//             labels: parsedData.labels || [],
//             subtabs: completeSubtabs
//           });
//         } else {
//           // Initialize with empty hidden items
//           setHiddenItems({
//             labels: [],
//             subtabs: Object.keys(allSidebarLabels.subtabs).reduce((acc, label) => {
//               acc[label] = [];
//               return acc;
//             }, {})
//           });
//         }
//       } catch (error) {
//         console.error("Error loading hidden items:", error);
//         setHiddenItems({
//           labels: [],
//           subtabs: Object.keys(allSidebarLabels.subtabs).reduce((acc, label) => {
//             acc[label] = [];
//             return acc;
//           }, {})
//         });
//       }
//     }
//   }, []);

//   // ... (keep existing menuConfig and other useEffect hooks)

//     const menuConfig = {
//     "Super-Admin": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/super-admin/dashboard",
//         subTabs: []
//       },
//       ...(email === "shantu131201@gmail.com"
//         ? [
//           {
//             label: "Admin",
//             icon: "fas fa-user",
//             path: "/super-admin/admin",
//             subTabs: []
//           }
//         ]
//         : []),
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/super-admin/blog",
//         subTabs: []
//       },
//       {
//         label: "Artist",
//         icon: "fa fa-paint-brush",
//         path: "#artist-management",
//         subTabs: [
//           { label: "Management", path: "/super-admin/artist/management" },
//           { label: "Blog Request", path: "/super-admin/artist/blogrequest" },
//           { label: "Blogs", path: "/super-admin/artist/blogs" },
//           { label: "Product Request", path: "/super-admin/artist/artistproductrequest" },
//           { label: "Products", path: "/super-admin/artist/allartistproduct" },
//           { label: "Sold Product", path: "/super-admin/artist/sold-product" },
//         ]
//       },
//       {
//         label: "Buyer",
//         icon: "fa-handshake",
//         path: "#Buyer-management",
//         subTabs: [
//           { label: "Management", path: "/super-admin/buyer/management" },
//           { label: "Product Purchased", path: "/super-admin/buyer/productpurchased" },
//           { label: "Resell Product Request", path: "/super-admin/buyer/resellproduct" },
//           { label: "Sold Product", path: "/super-admin/buyer/soldproduct" },
//         ]
//       },
//       {
//         label: "Seller",
//         icon: "fa fa-tag",
//         path: "#Seller-management",
//         subTabs: [
//           { label: "Management", path: "/super-admin/seller/management" },
//           { label: "Products", path: "/super-admin/seller/product" },
//           { label: "Product Request", path: "/super-admin/seller/productrequest" },
//           { label: "Sold Product", path: "/super-admin/seller/soldproduct" },
//         ]
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/super-admin/product-table",
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: "/super-admin/customordertable",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/super-admin/purchasetable",
//         subTabs: []
//       },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: "#Bidding",
//         subTabs: [
//           { label: "All Products", path: "/super-admin/bidding/allproduct" },
//           { label: "Bidded Product", path: "/super-admin/bidding/bidded-product" },
//           { label: "Bidding Pass", path: "/super-admin/bidding/pass-table" }
//         ]
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: "/super-admin/certification",
//         subTabs: []
//       },
//       {
//         label: "Sponsor",
//         icon: "fa fa-bullhorn",
//         path: "/super-admin/advertise",
//         subTabs: []
//       },
//       {
//         label: "Settings",
//         icon: "fa fa-cog",
//         path: "#Settings",
//         subTabs: [
//           { label: "Product Category", path: "/super-admin/settings/product-category" },
//           { label: "Blog Category", path: "/super-admin/settings/blog-category" },
//           { label: "Email Setting", path: "/super-admin/settings/email-setting" },
//           { label: "Marketing", path: "/super-admin/settings/marketing" },
//         ]
//       }
//     ],
//     "Artist": [
//        {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/artist/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Blogs",
//         icon: "fa fa-newspaper",
//         path: "/artist/bloglist",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product",
//         subTabs: []
//       },
//       {
//         label: "Custom Order",
//         icon: "fa fa-cart-plus",
//         path: "/artist/custom-order",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/artist/product-purchase",
//         subTabs: []

//       },
//       {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `/artist/advertise`,
//         subTabs: []
//       },
//       {  
//       label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/artist/bidding-products-table`},
//           { label: "Bidded Product", path: `/artist/bidded-products-table` },
//           { label: "Bidding Pass", path: `/artist/bidding-pass-table` }
//         ]
//       },
//             {
//         label: "Certification Services",
//          icon: "fa fa-certificate",
//         path: `/artist/certification`,
//         subTabs: []
//       },
//     ],
//     "Buyer": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/buyer/dashboard",
//         subTabs: []
//       },
//     ],
//     "Seller": [
//       {
//         label: "Dashboard",
//         icon: "fa-dashboard",
//         path: "/seller/dashboard",
//         subTabs: []
//       },
//       {
//         label: "Product",
//         icon: "fa fa-cart-plus",
//         path: "/seller/product-details",
//         subTabs: []
//       },
//       {
//         label: "Product Purchased",
//         icon: "fa fa-cart-plus",
//         path: "/seller/purchased-product",
//         subTabs: []
//       },    
//       {  
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: `#Bidding`,
//         subTabs: [
//           { label: "All Products", path: `/seller/bidding-products-table`},
//           { label: "Bidded Product", path: `/seller/bidded-products-table` },
//           { label: "Bidding Pass", path: `/seller/bidding-pass-table` }
//         ]
//       },
//           {
//         label: "Advertise",
//         icon: "fa fa-bullhorn",
//         path: `#`,
//         path: `/seller/advertise`,
//         subTabs: []
//       },
//       {
//         label: "Certification Services",
//         icon: "fa fa-certificate",
//         path: `#`,
//         path: `/seller/certification`,
//         subTabs: []
//       },
//     ],
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [location.pathname]);

//   const menuItems = userType ? menuConfig[userType] || [] : [];

//   useEffect(() => {
//     if (userType) {
//       const items = menuConfig[userType] || [];
//       const activeTabs = items.reduce((acc, item) => {
//         const isParentMatch = location.pathname.startsWith(item.path);
//         const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
//         const isActive = isParentMatch || isSubTabMatch;
//         acc[item.label] = isActive;

//         if (isActive) {
//           setExpandedTab(item.label);
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
//         {menuItems.map((item, index) => {
//           // Skip if main label is hidden
//           if (hiddenItems.labels.includes(item.label)) return null;

//           return (
//             <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
//               <Link
//                 to={item.path}
//                 onClick={() => handleTabToggle(item.label)}
//                 className={item.subTabs.length ? 'has-arrow' : ''}
//               >
//                 <i className={`fa ${item.icon}`}></i>
//                 <span>{item.label}</span>
//               </Link>

//               {item.subTabs.length > 0 && (
//                 <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
//                   {item.subTabs.map((subTab, subIndex) => {
//                     // Only hide if explicitly in hidden subtabs array
//                     const isHidden = hiddenItems.subtabs[item.label]?.includes(subTab.label) || false;
//                     if (isHidden) return null;
                    
//                     return (
//                       <li
//                         key={subIndex}
//                         className={location.pathname === subTab.path ? 'active' : ''}
//                       >
//                         <Link to={subTab.path}>{subTab.label}</Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export const allSidebarLabels = {
//   mainLabels: [
//     "Dashboard",
//     "Admin",
//     "Blogs",
//     "Artist",
//     "Buyer",
//     "Seller",
//     "Product",
//     "Custom Order",
//     "Product Purchased",
//     "Bidding",
//     "Certification Services",
//     "Sponsor",
//     "Settings"
//   ],
//   subtabs: {
//     "Artist": ["Management", "Blog Request", "Blogs", "Product Request", "Products", "Sold Product"],
//     "Buyer": ["Management", "Product Purchased", "Resell Product Request", "Sold Product"],
//     "Seller": ["Management", "Products", "Product Request", "Sold Product"],
//     "Bidding": ["All Products", "Bidded Product", "Bidding Pass"],
//     "Settings": ["Product Category", "Blog Category", "Email Setting", "Marketing"]
//   }
// };

// export default Sidebar;





// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState({});
//   const [expandedTab, setExpandedTab] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [email, setEmail] = useState("");
//   const [hiddenLabels, setHiddenLabels] = useState([]);

//   // ✅ Load email and hiddenLabels
//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//       const stored = JSON.parse(localStorage.getItem(`admin_hiddenLabels_${storedEmail}`) || "[]");
//       const cleaned = stored.filter(label => label !== "Admin"); // ✅ Ensure Admin not included
//       setHiddenLabels(cleaned);

//       // ✅ Clean Admin from localStorage permanently
//       if (stored.includes("Admin")) {
//         localStorage.setItem(`admin_hiddenLabels_${storedEmail}`, JSON.stringify(cleaned));
//       }
//     }
//   }, []);

//   // ✅ Listen for real-time label update
//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === `admin_hiddenLabels_${email}`) {
//         const updated = JSON.parse(event.newValue || '[]');
//         const filtered = updated.filter(label => label !== "Admin");
//         setHiddenLabels(filtered);
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [email]);

//   const menuConfig = {
//     "Super-Admin": [
//       { label: "Dashboard", icon: "fa-dashboard", path: "/super-admin/dashboard", subTabs: [] },
//       ...(email === "shantu131201@gmail.com" ? [{
//         label: "Admin",
//         icon: "fas fa-user",
//         path: "/super-admin/admin",
//         subTabs: []
//       }] : []),
//       { label: "Blogs", icon: "fa fa-newspaper", path: "/super-admin/blog", subTabs: [] },
//       {
//         label: "Artist",
//         icon: "fa fa-paint-brush",
//         path: "#artist-management",
//         subTabs: [
//           { label: "Management", path: `/super-admin/artist/management` },
//           { label: "Blog Request", path: `/super-admin/artist/blogrequest` },
//           { label: "Blogs", path: `/super-admin/artist/blogs` },
//           { label: "Product Request", path: `/super-admin/artist/artistproductrequest` },
//           { label: "Products", path: `/super-admin/artist/allartistproduct` },
//           { label: "Sold Product ", path: `/super-admin/artist/sold-product` },
//         ]
//       },
//       {
//         label: "Buyer",
//         icon: "fa-handshake",
//         path: "#Buyer-management",
//         subTabs: [
//           { label: "Management", path: `/super-admin/buyer/management` },
//           { label: "Product Purchased", path: `/super-admin/buyer/productpurchased` },
//           { label: "Resell Product Request", path: `/super-admin/buyer/resellproduct` },
//           { label: "Sold Product", path: `/super-admin/buyer/soldproduct` },
//         ]
//       },
//       {
//         label: "Seller",
//         icon: "fa fa-tag",
//         path: "#Seller-management",
//         subTabs: [
//           { label: " Management", path: `/super-admin/seller/management` },
//           { label: "Products", path: `/super-admin/seller/product` },
//           { label: "Product Request", path: `/super-admin/seller/productrequest` },
//           { label: "Sold  Product ", path: `/super-admin/seller/soldproduct` },
//         ]
//       },
//       { label: "Product", icon: "fa fa-cart-plus", path: `/super-admin/product-table`, subTabs: [] },
//       { label: "Custom Order", icon: "fa fa-cart-plus", path: `/super-admin/customordertable`, subTabs: [] },
//       { label: "Product Purchased", icon: "fa fa-cart-plus", path: `/super-admin/purchasetable`, subTabs: [] },
//       {
//         label: "Bidding",
//         icon: "fa fa-gavel",
//         path: "#Bidding",
//         subTabs: [
//           { label: "All Products", path: `/super-admin/bidding/allproduct` },
//           { label: "Bidded Product", path: `/super-admin/bidding/bidded-product` },
//           { label: "Bidding Pass", path: `/super-admin/bidding/pass-table` }
//         ]
//       },
//       { label: "Certification Services", icon: "fa fa-certificate", path: `/super-admin/certification`, subTabs: [] },
//       { label: "Sponsor", icon: "fa fa-bullhorn", path: `/super-admin/advertise`, subTabs: [] },
//       {
//         label: "Settings",
//         icon: "fa fa-cog",
//         path: "#Settings",
//         subTabs: [
//           { label: "Product Category", path: `/super-admin/settings/product-category` },
//           { label: "Blog Category", path: `/super-admin/settings/blog-category` },
//           { label: "Email Setting", path: `/super-admin/settings/email-setting` },
//           { label: "Marketing", path: `/super-admin/settings/marketing` },
//         ]
//       }
//     ],
//     // ... your Artist / Buyer / Seller configs unchanged
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [location.pathname]);

//   const menuItems = userType ? menuConfig[userType] || [] : [];

//   useEffect(() => {
//     if (userType) {
//       const items = menuConfig[userType] || [];
//       const activeTabs = items.reduce((acc, item) => {
//         const isParentMatch = location.pathname.startsWith(item.path);
//         const isSubTabMatch = item.subTabs.some(subTab => location.pathname === subTab.path);
//         const isActive = isParentMatch || isSubTabMatch;
//         acc[item.label] = isActive;
//         if (isActive) setExpandedTab(item.label);
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
//         {menuItems.map((item, index) => {
//           // ✅ Never hide "Admin"
//           if (item.label !== "Admin" && hiddenLabels.includes(item.label)) return null;

//           return (
//             <li key={index} className={`menu-item ${isActive[item.label] ? 'active' : ''}`}>
//               <Link
//                 to={item.path}
//                 onClick={() => handleTabToggle(item.label)}
//                 className={item.subTabs.length ? 'has-arrow' : ''}
//               >
//                 <i className={`fa ${item.icon}`}></i>
//                 <span>{item.label}</span>
//               </Link>

//               {item.subTabs.length > 0 && (
//                 <ul className={`collapse ${expandedTab === item.label ? 'in' : ''}`}>
//                   {item.subTabs.map((subTab, subIndex) => (
//                     <li key={subIndex} className={location.pathname === subTab.path ? 'active' : ''}>
//                       <Link to={subTab.path}>{subTab.label}</Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;




