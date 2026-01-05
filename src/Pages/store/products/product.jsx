// import "./product.css";
// import React, { useState } from "react";
// import { FaStar, FaShoppingCart } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";
// import { FiChevronRight } from "react-icons/fi";
// import { FiChevronLeft } from "react-icons/fi";
// import { Heart } from "lucide-react";

// const Product = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* Top Section: Breadcrumb + Search */}
//       <div className="w-full bg-white py-3 px-3 sm:px-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           {/* Breadcrumb */}
//           <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//             <a href="#" className="hover:text-red-500">
//               Home
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Store
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Paintings
//             </a>
//             <span>/</span>
//             <span className="font-medium text-gray-900">Abstract</span>
//           </nav>

//           {/* Search Bar */}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6">
//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
// <aside className="hidden md:block rounded-xl filter-sidebar">
//   {/* All your filter sections here (unchanged) */}
//   <h2 className="font-bold text-lg mb-3">Filter by</h2>

//   <hr className="mb-3 border-dark" />

//   {/* Sort By */}
//   <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//     Sort By
//   </p>
//   <div className="space-y-2 mb-4">
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> New Arrivals
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Trending
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Price Low to High
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Price High to Low
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Relevance
//     </label>
//   </div>

//   <hr className="mb-3 border-dark" />

//   {/* Special Tags */}
//   <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//     Special Tags
//   </p>
//   <div className="space-y-2 mb-4">
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Limited Edition
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Bestseller
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Verified Seller
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Exclusive
//     </label>
//   </div>

//   <hr className="mb-3 border-dark" />

//   {/* Price */}
//   <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//     Price
//   </p>
//   <input type="range" min="295" max="89700" className="w-full" />
//   <div className="flex justify-between text-xs text-gray-600 mb-2">
//     <span>₹295</span>
//     <span>₹89,700+</span>
//   </div>
//   <div className="space-y-2 mb-4 text-sm">
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Under ₹5,000
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Above ₹25,000
//     </label>
//   </div>

//   <hr className="mb-3 border-dark" />

//   {/* Size */}
//   <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//     Size
//   </p>
//   <div className="space-y-2 mb-4">
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Small (&lt;12in)
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Medium (12–24in)
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Large (24–48in)
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Oversized (48in+)
//     </label>
//   </div>

//   <hr className="mb-3 border-dark" />

//   {/* Style */}
//   <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//     Style
//   </p>
//   <div className="space-y-2 mb-4">
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Abstract
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Modern
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Traditional
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Minimalist
//     </label>
//   </div>

//   <hr className="mb-3 border-dark" />

//   {/* Medium */}
//   <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//     Medium
//   </p>
//   <div className="space-y-2">
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Oil
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Acrylic
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Watercolor
//     </label>
//     <label className="flex items-center">
//       <input type="checkbox" className="mr-2" /> Mixed Media
//     </label>
//   </div>
// </aside>

//         {/* Mobile Sidebar Toggle */}
//         <div className="md:hidden mb-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M3 4h18M3 12h18M3 20h18"
//               />
//             </svg>
//             Filters
//           </button>

//           {/* Slide-over sidebar for mobile */}
//           {showFilters && (
//             <div className="fixed inset-0 z-50 flex">
//               {/* Background Overlay */}
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50"
//                 onClick={() => setShowFilters(false)}
//               ></div>

//               {/* Sidebar */}
//               <div className="relative bg-white w-72 max-w-full h-full shadow-xl p-5 overflow-y-auto">
//                 <button
//                   onClick={() => setShowFilters(false)}
//                   className="absolute top-3 right-3 text-gray-600"
//                 >
//                   ✕
//                 </button>

//                 <h2 className="font-bold text-lg mb-3">Filter by</h2>
//                 <hr className="mb-3 border-dark" />

//                 {/* ✅ Place the same filters here */}
//                 {/* Sort By, Special Tags, Price, Size, Style, Medium */}
//                 {/* Sort By */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Sort By
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> New Arrivals
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Trending
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Price Low to High
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Price High to Low
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Relevance
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Special Tags */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Special Tags
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Limited Edition
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Bestseller
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Verified Seller
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Exclusive
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Price */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Price
//                 </p>
//                 <div className="flex justify-between text-xs text-gray-600 mb-1">
//                   <span>₹295</span>
//                   <span>₹89,700+</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="295"
//                   max="89700"
//                   className="w-full mb-3"
//                 />
//                 <div className="space-y-2 mb-4 text-sm">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Under ₹5,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Above ₹25,000
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Size */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Size
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Small (&lt;12in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Medium (12–24in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Large (24–48in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Oversized (48in+)
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Style */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Style
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Abstract
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Modern
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Traditional
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Minimalist
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Medium */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Medium
//                 </p>
//                 <div className="space-y-2">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Oil
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Acrylic
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Watercolor
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Mixed Media
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//          {/* <!-- Product Grid --> */}
//         <main className="md:col-span-3">
//            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//            {/* <!-- Product Card --> */}

//              <div className="mx-auto product-card">
//                {/* Premium Label */}
//                <div className="relative p-img">
//                  <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                    Premium
//                 </span>

//                  {/* Product Image */}
//                  <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 right-3 p-2 rounded-full shadow bg-dark">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/2.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Premium
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Heart Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Heart className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Pebble Palace Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                   <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                   <span className="text-orange-500 font-semibold text-sm">
//                     Only 2 left!
//                   </span>
//                 </div>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                     25% OFF
//                     <span class="timer"> | 2h:59m</span>
//                   </span>
//                   <span className="text-gray-400 line-through">₹12,999</span>
//                   <span className="text-lg font-bold text-gray-900">
//                     ₹9,749
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <!-- Pagination --> */}
//           <div className="flex justify-center mt-6">
//             <nav className="flex flex-wrap sm:flex-nowrap items-center space-x-2 rounded border border-dark px-2 sm:px-3 py-2 text-sm sm:text-lg font-semibold overflow-x-auto no-scrollbar">
//               <FiChevronLeft className="self-center flex-shrink-0" />
//               <button className="px-1 sm:px-3 py-1">Previous</button>
//               <button className="px-3 sm:px-3 py-1 rounded border border-dark text-dark">
//                 1
//               </button>
//               <button className="px-1 sm:px-3 py-1">2</button>
//               <button className="px-1 sm:px-3 py-1">3</button>
//               <button className="px-1 sm:px-3 py-1">. . .</button>
//               <button className="px-1 sm:px-3 py-1">10</button>
//               <button className="px-1 sm:px-3 py-1">Next</button>
//               <FiChevronRight className="self-center flex-shrink-0" />
//             </nav>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default Product;

//--------------------------WORKING CODE BEFORE RATING FETCH API INTEGRATION--------------------------

// import React, { useState, useEffect } from "react";
// import { Heart } from "lucide-react";
// import { FaStar, FaShoppingCart } from "react-icons/fa";
// import getAPI from "../../../api/getAPI";

// const Product = () => {
//   const [products, setProducts] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
// const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const [res1, res2] = await Promise.all([
//           getAPI("/api/getstatusapprovedproduct", {}, true, false),
//           getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
//         ]);

//         const products1 =
//           res1?.data?.data?.filter((p) => p.status === "Approved") || [];
//         const products2 =
//           res2?.data?.data?.filter((p) => p.status === "Approved") || [];

//         setProducts([...products1, ...products2]);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* --- Search and Breadcrumb --- */}
//       <div className="w-full bg-white py-3 px-3 sm:px-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//             <a href="#" className="hover:text-red-500">
//               Home
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Store
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Paintings
//             </a>
//             <span>/</span>
//             <span className="font-medium text-gray-900">Abstract</span>
//           </nav>

//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* --- Main Layout --- */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6">
//         {/* --- Sidebar Filters --- */}
//         <aside className="hidden md:block rounded-xl filter-sidebar">
//           <h2 className="font-bold text-lg mb-3">Filter by</h2>
//           <hr className="mb-3 border-dark" />

//           {/* Sort By */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Sort By
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> New Arrivals
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Trending
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Price Low to High
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Price High to Low
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Relevance
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Special Tags */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Special Tags
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Limited Edition
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Bestseller
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Verified Seller
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Exclusive
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Price */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Price
//           </p>
//           <input type="range" min="295" max="89700" className="w-full" />
//           <div className="flex justify-between text-xs text-gray-600 mb-2">
//             <span>₹295</span>
//             <span>₹89,700+</span>
//           </div>
//           <div className="space-y-2 mb-4 text-sm">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Under ₹5,000
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Above ₹25,000
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Size */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Size
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Small (&lt;12in)
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Medium (12–24in)
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Large (24–48in)
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Oversized (48in+)
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Style */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Style
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Abstract
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Modern
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Traditional
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Minimalist
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Medium */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Medium
//           </p>
//           <div className="space-y-2">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Oil
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Acrylic
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Watercolor
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Mixed Media
//             </label>
//           </div>
//         </aside>

//  {/* Mobile Sidebar Toggle */}
//         <div className="md:hidden mb-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M3 4h18M3 12h18M3 20h18"
//               />
//             </svg>
//             Filters
//           </button>

//           {/* Slide-over sidebar for mobile */}
//           {showFilters && (
//             <div className="fixed inset-0 z-50 flex">
//               {/* Background Overlay */}
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50"
//                 onClick={() => setShowFilters(false)}
//               ></div>

//               {/* Sidebar */}
//               <div className="relative bg-white w-72 max-w-full h-full shadow-xl p-5 overflow-y-auto">
//                 <button
//                   onClick={() => setShowFilters(false)}
//                   className="absolute top-3 right-3 text-gray-600"
//                 >
//                   ✕
//                 </button>

//                 <h2 className="font-bold text-lg mb-3">Filter by</h2>
//                 <hr className="mb-3 border-dark" />

//                 {/* ✅ Place the same filters here */}
//                 {/* Sort By, Special Tags, Price, Size, Style, Medium */}
//                 {/* Sort By */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Sort By
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> New Arrivals
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Trending
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Price Low to High
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Price High to Low
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Relevance
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Special Tags */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Special Tags
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Limited Edition
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Bestseller
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Verified Seller
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Exclusive
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Price */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Price
//                 </p>
//                 <div className="flex justify-between text-xs text-gray-600 mb-1">
//                   <span>₹295</span>
//                   <span>₹89,700+</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="295"
//                   max="89700"
//                   className="w-full mb-3"
//                 />
//                 <div className="space-y-2 mb-4 text-sm">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Under ₹5,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Above ₹25,000
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Size */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Size
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Small (&lt;12in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Medium (12–24in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Large (24–48in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Oversized (48in+)
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Style */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Style
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Abstract
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Modern
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Traditional
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Minimalist
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Medium */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Medium
//                 </p>
//                 <div className="space-y-2">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Oil
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Acrylic
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Watercolor
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Mixed Media
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* --- Products Grid --- */}
//         {/* <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 place-items-stretch md:col-span-3"> */}
//           <main className="md:col-span-3">
//            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {/* <!-- Product Card --> */}
//           {products.map((product) => {
//             const hasDiscount = product.sellingPrice < product.marketPrice;
//             const discountPercent = hasDiscount
//               ? Math.round(
//                   ((product.marketPrice - product.sellingPrice) /
//                     product.marketPrice) *
//                     100
//                 )
//               : 0;

//             return (
//               <div
//                 key={product._id}
//                 className=" rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1 m-3"
//               //className="mx-auto product-card"
//               >
//                 {/* Image Section */}
//                 {/* <div className="relative h-64 flex items-center justify-center p-3 bg-gray-50"> */}
//                   <div className="relative p-img">
//                   {product.editionType && (
//                     <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                       {product.editionType}
//                     </span>
//                   )}
//                   <img
//                     src={`${imageBaseURL}${product.mainImage}`}
//                     alt={product.productName}
//                     //className="h-full w-full object-contain rounded-t-2xl product-img"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                   />
//                   <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                     <Heart className="w-5 h-5 text-white" />
//                   </button>
//                 </div>

//                 {/* Product Info */}
//                 <div
//                  //className="p-3 flex flex-col justify-between flex-grow"
//                  className="p-3 product-info"
//                  >
//                   <h2
//                     //className="text-base sm:text-lg text-dark font-semibold mt-1 line-clamp-2"
//                     className="text-base sm:text-lg text-dark font-semibold mt-1"
//                     title={product.productName}
//                   >
//                     {product.productName}
//                   </h2>

//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center"title={product.productName}
//                   >
//                     {product.productName}
//                 </p>

//                 {/* Rating */}
//                  <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                    <span className="text-sm font-bold text-orange-700">4.8</span>
//                   <FaStar className="text-yellow-400" />
//                    <span className="text-gray-500 text-sm">(254 Reviews)</span>

//                  </div>

//                   <div className="flex items-center gap-2 mt-2">
//                     {hasDiscount && (
//                       <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                         {discountPercent}% OFF
//                       </span>
//                     )}
//                     {hasDiscount ? (
//                       <>
//                         <span className="text-gray-400 line-through">
//                           ₹{product.marketPrice}
//                         </span>
//                         <span className="text-lg font-bold text-gray-900">
//                           ₹{product.sellingPrice}
//                         </span>
//                       </>
//                     ) : (
//                       <span className="text-lg font-bold text-gray-900">
//                         ₹{product.sellingPrice}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                  <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                     Add to Cart
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//               </div>
//             );
//           })}
//         </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Product;

//-----------------------------ORDER REVERSED VERSION WITH RATINGS ADDED-----------------------------
// import React, { useState, useEffect } from "react";
// import { Heart } from "lucide-react";
// import { FaStar, FaShoppingCart } from "react-icons/fa";
// import getAPI from "../../../api/getAPI";

// const Product = () => {
//   const [products, setProducts] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const [res1, res2, ratingRes] = await Promise.all([
//           getAPI("/api/getstatusapprovedproduct", {}, true, false),
//           getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
//           getAPI("/api/reviews/aggregated", {}, true, false),
//         ]);

//         const products1 =
//           res1?.data?.data?.filter((p) => p.status === "Approved") || [];
//         const products2 =
//           res2?.data?.data?.filter((p) => p.status === "Approved") || [];
//         const allProducts = [...products1, ...products2].reverse();

//         const ratings = ratingRes?.data?.data || [];
//         const productsWithRatings = allProducts.map((product) => {
//           const matchedRating = ratings.find(
//             (r) => r.productId === product._id
//           );
//           return {
//             ...product,
//             averageRating: matchedRating?.averageRating || 0,
//             totalReviews: matchedRating?.totalReviews || 0,
//           };
//         });

//         setProducts(productsWithRatings);
//       } catch (error) {
//         console.error("Error fetching products or ratings:", error);
//         setProducts([]);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* --- Search and Breadcrumb --- */}
//       <div className="w-full bg-white py-3 px-3 sm:px-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//             <a href="#" className="hover:text-red-500">
//               Home
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Store
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Paintings
//             </a>
//             <span>/</span>
//             <span className="font-medium text-gray-900">Abstract</span>
//           </nav>

//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6">
//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
//         <aside className="hidden md:block rounded-xl filter-sidebar">
//           {/* All your filter sections here (unchanged) */}
//           <h2 className="font-bold text-lg mb-3">Filter by</h2>

//           <hr className="mb-3 border-dark" />

//           {/* Sort By */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Sort By
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> New Arrivals
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Trending
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Price Low to High
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Price High to Low
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Relevance
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Special Tags */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Special Tags
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Limited Edition
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Bestseller
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Verified Seller
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Exclusive
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Price */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Price
//           </p>
//           <input type="range" min="295" max="89700" className="w-full" />
//           <div className="flex justify-between text-xs text-gray-600 mb-2">
//             <span>₹295</span>
//             <span>₹89,700+</span>
//           </div>
//           <div className="space-y-2 mb-4 text-sm">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Under ₹5,000
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Above ₹25,000
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Size */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Size
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Small (&lt;12in)
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Medium (12–24in)
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Large (24–48in)
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Oversized (48in+)
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Style */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Style
//           </p>
//           <div className="space-y-2 mb-4">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Abstract
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Modern
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Traditional
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Minimalist
//             </label>
//           </div>

//           <hr className="mb-3 border-dark" />

//           {/* Medium */}
//           <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//             Medium
//           </p>
//           <div className="space-y-2">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Oil
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Acrylic
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Watercolor
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-2" /> Mixed Media
//             </label>
//           </div>
//         </aside>

//         {/* Mobile Sidebar Toggle */}
//         <div className="md:hidden mb-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M3 4h18M3 12h18M3 20h18"
//               />
//             </svg>
//             Filters
//           </button>

//           {/* Slide-over sidebar for mobile */}
//           {showFilters && (
//             <div className="fixed inset-0 z-50 flex">
//               {/* Background Overlay */}
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50"
//                 onClick={() => setShowFilters(false)}
//               ></div>

//               {/* Sidebar */}
//               <div className="relative bg-white w-72 max-w-full h-full shadow-xl p-5 overflow-y-auto">
//                 <button
//                   onClick={() => setShowFilters(false)}
//                   className="absolute top-3 right-3 text-gray-600"
//                 >
//                   ✕
//                 </button>

//                 <h2 className="font-bold text-lg mb-3">Filter by</h2>
//                 <hr className="mb-3 border-dark" />

//                 {/* ✅ Place the same filters here */}
//                 {/* Sort By, Special Tags, Price, Size, Style, Medium */}
//                 {/* Sort By */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Sort By
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> New Arrivals
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Trending
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Price Low to High
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Price High to Low
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Relevance
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Special Tags */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Special Tags
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Limited Edition
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Bestseller
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Verified Seller
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Exclusive
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Price */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Price
//                 </p>
//                 <div className="flex justify-between text-xs text-gray-600 mb-1">
//                   <span>₹295</span>
//                   <span>₹89,700+</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="295"
//                   max="89700"
//                   className="w-full mb-3"
//                 />
//                 <div className="space-y-2 mb-4 text-sm">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Under ₹5,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Above ₹25,000
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Size */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Size
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Small (&lt;12in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Medium (12–24in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Large (24–48in)
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Oversized (48in+)
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Style */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Style
//                 </p>
//                 <div className="space-y-2 mb-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Abstract
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Modern
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Traditional
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Minimalist
//                   </label>
//                 </div>

//                 <hr className="mb-3 border-dark" />

//                 {/* Medium */}
//                 <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
//                   Medium
//                 </p>
//                 <div className="space-y-2">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Oil
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Acrylic
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Watercolor
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" /> Mixed Media
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* --- Products Grid --- */}
//         <main className="md:col-span-3">
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {products.map((product) => {
//               const hasDiscount = product.sellingPrice < product.marketPrice;
//               const discountPercent = hasDiscount
//                 ? Math.round(
//                     ((product.marketPrice - product.sellingPrice) /
//                       product.marketPrice) *
//                       100
//                   )
//                 : 0;

//               return (
//                 <div
//                   key={product._id}
//                   className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1 m-3"
//                 >
//                   {/* Image */}
//                   <div className="relative p-img">
//                     {product.editionType && (
//                       <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                         {product.editionType}
//                       </span>
//                     )}
//                     <img
//                       src={`${imageBaseURL}${product.mainImage}`}
//                       alt={product.productName}
//                       className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                     />
//                     <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                       <Heart className="w-5 h-5 text-white" />
//                     </button>
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-3 product-info">
//                     <h2
//                       className="text-base sm:text-lg text-dark font-semibold mt-1"
//                       title={product.productName}
//                     >
//                       {product.productName}
//                     </h2>

//                     <p
//                       className="text-gray-700 text-xs sm:text-sm font-medium flex items-center"
//                       title={product.productName}
//                     >
//                       {product.productName}
//                     </p>

//                     {/* ✅ Dynamic Rating */}
//                     <div className="flex items-center gap-2 mt-2">
//                       <span className="text-sm font-bold text-orange-700">
//                         {product.averageRating
//                           ? product.averageRating.toFixed(1)
//                           : "N/A"}
//                       </span>
//                       <FaStar className="text-yellow-400" />
//                       <span className="text-gray-500 text-sm">
//                         ({product.totalReviews || 0} Reviews)
//                       </span>
//                     </div>

//                     {/* Price */}
//                     <div className="flex items-center gap-2 mt-2">
//                       {hasDiscount && (
//                         <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                           {discountPercent}% OFF
//                         </span>
//                       )}
//                       {hasDiscount ? (
//                         <>
//                           <span className="text-gray-400 line-through">
//                             ₹{product.marketPrice}
//                           </span>
//                           <span className="text-lg font-bold text-gray-900">
//                             ₹{product.sellingPrice}
//                           </span>
//                         </>
//                       ) : (
//                         <span className="text-lg font-bold text-gray-900">
//                           ₹{product.sellingPrice}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Buttons */}
//                   <div className="p-3 product-button d-none d-md-block">
//                     <div className="flex justify-between gap-3">
//                       <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                         Add to Cart
//                       </button>
//                       <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                         Buy Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Product;

//------IMPROVED RATING UI AND ADDED ARTIST/SELLER NAME FETCHING ALONG WITH PAGINATION , also added badge fetch api(uncommented one)----------------------------//
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import ProductsSkeliton from "../../../Component/Skeleton/products/ProductsSkeliton";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

    const [filters, setFilters] = useState({
      sortBy: "Relevance",
      specialTags: [],
      priceRange: 89700,
      priceBuckets: [],
      size: [],
      mainCategory: [],
      category: [],
      subCategory: [],
      productType: [],
      productMedium: [],
      productMaterial: [],
      productEditionType: [],
      productSurfaceType: [],
      search: "",
    });

  const [options, setOptions] = useState({
    categories: [],
    productTypes: [],
    productMediums: [],
    productMaterials: [],
    productEditionTypes: [],
    productSurfaceTypes: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [likedProducts, setLikedProducts] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const navigate = useNavigate();

  const toggleExpand = (category) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
          const [
            catRes,
            typeRes,
            mediumRes,
            materialRes,
            editionRes,
            surfaceRes
          ] = await Promise.all([
            getAPI("/api/all-complete", {}, true, false),
            getAPI("/api/getproducttype", {}, true, false),
            getAPI("/api/getproductmedium", {}, true, false),
            getAPI("/api/getproductmaterials", {}, true, false),
            getAPI("/api/getproducteditiontypes", {}, true, false),
            getAPI("/api/getproductsurfacetypes", {}, true, false),
          ]);

          setOptions({
            categories: catRes?.data?.data?.flattened || [],
            productTypes: typeRes?.data || [],
            productMediums: mediumRes?.data || [],
            productMaterials: materialRes?.data || [],
            productEditionTypes: editionRes?.data || [],
            productSurfaceTypes: surfaceRes?.data || [],
          });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search
    if (filters.search) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.userId?.name && p.userId.name.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.userId?.lastName && p.userId.lastName.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Special Tags
    if (filters.specialTags.length > 0) {
      result = result.filter((p) => {
        return filters.specialTags.some((tag) => {
          if (tag === "Limited Edition") return p.editionType === "Limited Edition";
          if (tag === "Exclusive") return p.editionType === "Exclusive";
          if (tag === "Verified Seller") return p.userId?.status === "Verified";
          if (tag === "Bestseller") return p.reviewCount > 10; // Simple logic for bestseller
          return false;
        });
      });
    }

    // Price Range (Slider)
    result = result.filter((p) => p.sellingPrice <= filters.priceRange);

    // Price Buckets
    if (filters.priceBuckets.length > 0) {
      result = result.filter((p) => {
        return filters.priceBuckets.some((bucket) => {
          if (bucket === "Under ₹5,000") return p.sellingPrice < 5000;
          if (bucket === "₹5,000 – ₹10,000") return p.sellingPrice >= 5000 && p.sellingPrice <= 10000;
          if (bucket === "₹10,000 – ₹25,000") return p.sellingPrice > 10000 && p.sellingPrice <= 25000;
          if (bucket === "Above ₹25,000") return p.sellingPrice > 25000;
          return false;
        });
      });
    }

    // Size
    if (filters.size.length > 0) {
      result = result.filter((p) => {
        const width = p.dimensions?.width || 0;
        const height = p.dimensions?.height || 0;
        const maxDim = Math.max(width, height);
        return filters.size.some((s) => {
          if (s === "Small (<12in)") return maxDim < 12;
          if (s === "Medium (12–24in)") return maxDim >= 12 && maxDim <= 24;
          if (s === "Large (24–48in)") return maxDim > 24 && maxDim <= 48;
          if (s === "Oversized (48in+)") return maxDim > 48;
          return false;
        });
      });
    }

    // Category
    const mainCategoryMap = Object.fromEntries(options.categories.filter(c => c.mainCategoryId).map(c => [c.mainCategoryId, c.mainCategoryName]));
    const categoryMap = Object.fromEntries(options.categories.filter(c => c.categoryId).map(c => [c.categoryId, c.categoryName]));
    const subCategoryMap = Object.fromEntries(options.categories.filter(c => c.subCategoryId).map(c => [c.subCategoryId, c.subCategoryName]));

    if (filters.mainCategory.length > 0) {
      result = result.filter((p) => {
        const name = mainCategoryMap[p.mainCategory] || p.mainCategory;
        return filters.mainCategory.includes(name);
      });
    }
    if (filters.category.length > 0) {
      result = result.filter((p) => {
        const name = categoryMap[p.category] || p.category;
        return filters.category.includes(name);
      });
    }
    if (filters.subCategory.length > 0) {
      result = result.filter((p) => {
        const name = subCategoryMap[p.subCategory] || p.subCategory;
        return filters.subCategory.includes(name);
      });
    }

    // Product Type
    if (filters.productType.length > 0) {
      result = result.filter((p) => {
        if (Array.isArray(p.productType)) {
          return p.productType.some(type => filters.productType.includes(type));
        }
        return filters.productType.includes(p.productType);
      });
    }

    // Product Medium
    if (filters.productMedium.length > 0) {
      result = result.filter((p) => filters.productMedium.includes(p.medium));
    }

    // Product Material
    if (filters.productMaterial.length > 0) {
      result = result.filter((p) => {
        if (Array.isArray(p.materials)) {
          return p.materials.some(mat => filters.productMaterial.includes(mat));
        }
        return filters.productMaterial.includes(p.materials);
      });
    }

    // Product Edition Type
    if (filters.productEditionType.length > 0) {
      result = result.filter((p) => filters.productEditionType.includes(p.editionType));
    }

    // Product Surface Type
    if (filters.productSurfaceType.length > 0) {
      result = result.filter((p) => filters.productSurfaceType.includes(p.surfaceType));
    }

    // Sort By
    if (filters.sortBy === "Price Low to High") {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (filters.sortBy === "Price High to Low") {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (filters.sortBy === "New Arrivals") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "Trending") {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, filters, options.categories]);

  const handleFilterChange = (category, value, isChecked) => {
    setFilters((prev) => {
      if (category === "sortBy" || category === "priceRange" || category === "search") {
        return { ...prev, [category]: value };
      }

      let updatedFilters = { ...prev };
      const currentList = prev[category] || [];

      if (isChecked) {
        updatedFilters[category] = [...currentList, value];
      } else {
        updatedFilters[category] = currentList.filter((item) => item !== value);

        // Dependency Logic: Clear child filters if parent is unselected
        if (category === "mainCategory") {
          // Find all categories belonging to the unselected mainCategory
          const categoriesToKeep = options.categories
            .filter(c => updatedFilters.mainCategory.includes(c.mainCategoryName))
            .map(c => c.categoryName);
          updatedFilters.category = updatedFilters.category.filter(c => categoriesToKeep.includes(c));

          // Also update subcategories based on remaining categories
          const subCategoriesToKeep = options.categories
            .filter(c => updatedFilters.category.includes(c.categoryName))
            .map(c => c.subCategoryName);
          updatedFilters.subCategory = updatedFilters.subCategory.filter(sc => subCategoriesToKeep.includes(sc));
        }

        if (category === "category") {
          const subCategoriesToKeep = options.categories
            .filter(c => updatedFilters.category.includes(c.categoryName))
            .map(c => c.subCategoryName);
          updatedFilters.subCategory = updatedFilters.subCategory.filter(sc => subCategoriesToKeep.includes(sc));
        }
      }

      return updatedFilters;
    });
  };

  const mainCategories = [...new Set(options.categories.map(c => c.mainCategoryName))];

  const availableCategories = filters.mainCategory.length > 0
    ? [...new Set(options.categories.filter(c => filters.mainCategory.includes(c.mainCategoryName)).map(c => c.categoryName))]
    : [...new Set(options.categories.map(c => c.categoryName))];

  const availableSubCategories = filters.category.length > 0
    ? [...new Set(options.categories.filter(c => filters.category.includes(c.categoryName)).map(c => c.subCategoryName))]
    : (filters.mainCategory.length > 0
      ? [...new Set(options.categories.filter(c => filters.mainCategory.includes(c.mainCategoryName)).map(c => c.subCategoryName))]
      : [...new Set(options.categories.map(c => c.subCategoryName))]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

    const goToPage = (page) => {
      setCurrentPage(page);
    };

    const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature, Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleWishlist = async (productId) => {
    // if (!userId) {
    //   toast.warn("You must be logged in as a buyer to use wishlist");
    //   return;
    // }
    if (!ensureBuyer()) return;

    const isLiked = likedProducts[productId];

    try {
      if (isLiked) {
        await deleteAPI("/api/wishlist/remove", {
          params: { userId, productId },
        });
        toast.warn("Removed from Wishlist");
      } else {
        await postAPI("/api/wishlist/add", { userId, productId });
        toast.success("Added to Wishlist");
      }

      setLikedProducts((prev) => ({
        ...prev,
        [productId]: !isLiked,
      }));
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.warn("You must be logged in to add items to cart");
      return;
    }

    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);

      toast.success("Added to Cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     try {
  //       const [res1, res2, ratingRes] = await Promise.all([
  //         getAPI("/api/getstatusapprovedproduct", {}, true, false),
  //         getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
  //         getAPI("/api/reviews/aggregated", {}, true, false),
  //       ]);

  //       const products1 =
  //         res1?.data?.data?.filter((p) => p.status === "Approved") || [];
  //       const products2 =
  //         res2?.data?.data?.filter((p) => p.status === "Approved") || [];

  //       const allProducts = [
  //         ...(products1 || []),
  //         ...(products2 || []),
  //       ].reverse();

  //       const ratings = ratingRes?.data?.data || [];

  //       const productsWithRatings = allProducts.map((product) => {
  //         const matchedRating = ratings.find(
  //           (r) => r.productId === product._id
  //         );
  //         const avg =
  //           matchedRating && matchedRating.averageRating != null
  //             ? Number(matchedRating.averageRating)
  //             : null;
  //         const reviewCount =
  //           matchedRating?.reviewCount ?? matchedRating?.totalReviews ?? 0;

  //         return {
  //           ...product,
  //           averageRating: avg,
  //           reviewCount,
  //         };
  //       });

  //       setProducts(productsWithRatings);
  //     } catch (error) {
  //       console.error("Error fetching products or ratings:", error);
  //       setProducts([]);
  //     }
  //   };

  //   fetchAllProducts();
  // }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const [res1, res2, ratingRes, badgeRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
        ]);

        const products1 =
          res1?.data?.data?.filter((p) => p.status === "Approved") || [];
        const products2 =
          res2?.data?.data?.filter((p) => p.status === "Approved") || [];

        const allProducts = [...(products1 || []), ...(products2 || [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const ratings = ratingRes?.data?.data || [];
        const productsWithRatings = allProducts.map((product) => {
          const matchedRating = ratings.find(
            (r) => r.productId === product._id
          );

          const avg = matchedRating?.averageRating
            ? Number(matchedRating.averageRating)
            : null;

          const reviewCount = matchedRating?.reviewCount ?? 0;

          return {
            ...product,
            averageRating: avg,
            reviewCount,
          };
        });

        const badgeData = badgeRes?.data?.data || [];

        const finalProducts = productsWithRatings.map((p) => {
          const match = badgeData.find((b) => b._id === p._id);

          return {
            ...p,
            seller: match?.seller || p.seller,
            badges: match?.badges || [],
          };
        });

        setProducts(finalProducts);
      } catch (error) {
        console.error("Error fetching products or badges:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;

      try {
        const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);

        const wishlistArray = res?.data?.wishlist || [];

        const obj = {};
        wishlistArray.forEach((item) => {
          obj[item._id] = true;
        });

        setLikedProducts(obj);
      } catch (error) {
        console.log("Error loading wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  const renderStars = (averageRating) => {
    if (averageRating == null) {
      return [1, 2, 3, 4, 5].map((s) => (
        <FaStar key={s} className="text-gray-300" />
      ));
    }

    const filled = Math.round(averageRating);
    return [1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={s <= filled ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };
  if (loading) return <div><ProductsSkeliton /></div>;
  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      {/* --- Search and Breadcrumb --- */}
      <div className="w-full bg-white py-3 px-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="#" className="hover:text-red-500">
              Home
            </a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">
              Store
            </a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">
              Paintings
            </a>
            <span>/</span>
            <span className="font-medium text-gray-900">Abstract</span>
          </nav>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6">
        {/* Sidebar Filters (hidden on mobile, toggleable) */}
        <aside className="hidden md:block rounded-xl filter-sidebar">

          <h2 className="font-bold text-lg mb-3">Filter by</h2>

          <hr className="mb-3 border-dark" />

          {/* Sort By */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Sort By
          </p>
          <div className="space-y-2 mb-4">
            {["New Arrivals", "Trending", "Price Low to High", "Price High to Low", "Relevance"].map((option) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  checked={filters.sortBy === option}
                  onChange={() => handleFilterChange("sortBy", option)}
                  className="mr-2"
                /> {option}
              </label>
            ))}
          </div>

          <hr className="mb-3 border-dark" />

          {/* Special Tags */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Special Tags
          </p>
          <div className="space-y-2 mb-4">
            {["Limited Edition", "Bestseller", "Verified Seller", "Exclusive"].map((tag) => (
              <label key={tag} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.specialTags.includes(tag)}
                  onChange={(e) => handleFilterChange("specialTags", tag, e.target.checked)}
                  className="mr-2"
                /> {tag}
              </label>
            ))}
          </div>

          <hr className="mb-3 border-dark" />

          {/* Price */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Price
          </p>
          <input
            type="range"
            min="295"
            max="89700"
            value={filters.priceRange}
            onChange={(e) => handleFilterChange("priceRange", Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>₹295</span>
            <span>₹{filters.priceRange.toLocaleString()}</span>
          </div>
          <div className="space-y-2 mb-4 text-sm">
            {["Under ₹5,000", "₹5,000 – ₹10,000", "₹10,000 – ₹25,000", "Above ₹25,000"].map((bucket) => (
              <label key={bucket} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.priceBuckets.includes(bucket)}
                  onChange={(e) => handleFilterChange("priceBuckets", bucket, e.target.checked)}
                  className="mr-2"
                /> {bucket}
              </label>
            ))}
          </div>

          <hr className="mb-3 border-dark" />

          {/* Size */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Size
          </p>
          <div className="space-y-2 mb-4">
            {["Small (<12in)", "Medium (12–24in)", "Large (24–48in)", "Oversized (48in+)"].map((s) => (
              <label key={s} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.size.includes(s)}
                  onChange={(e) => handleFilterChange("size", s, e.target.checked)}
                  className="mr-2"
                /> {s}
              </label>
            ))}
          </div>

            <hr className="mb-3 border-dark" />

              {/* Main Category */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Main Category
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['mainCategory'] ? mainCategories : mainCategories.slice(0, 5)).map((name) => (
                  <label key={name} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.mainCategory.includes(name)}
                      onChange={(e) => handleFilterChange("mainCategory", name, e.target.checked)}
                      className="mr-2"
                    /> {name}
                  </label>
                ))}
                {mainCategories.length > 5 && (
                  <button
                    onClick={() => toggleExpand('mainCategory')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['mainCategory'] ? "Show Less" : `+ ${mainCategories.length - 5} Main Category`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Category */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Category
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['category'] ? availableCategories : availableCategories.slice(0, 5)).map((name) => (
                  <label key={name} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(name)}
                      onChange={(e) => handleFilterChange("category", name, e.target.checked)}
                      className="mr-2"
                    /> {name}
                  </label>
                ))}
                {availableCategories.length > 5 && (
                  <button
                    onClick={() => toggleExpand('category')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['category'] ? "Show Less" : `+ ${availableCategories.length - 5} Category`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Sub Category */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Sub Category
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['subCategory'] ? availableSubCategories : availableSubCategories.slice(0, 5)).map((name) => (
                  <label key={name} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.subCategory.includes(name)}
                      onChange={(e) => handleFilterChange("subCategory", name, e.target.checked)}
                      className="mr-2"
                    /> {name}
                  </label>
                ))}
                {availableSubCategories.length > 5 && (
                  <button
                    onClick={() => toggleExpand('subCategory')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['subCategory'] ? "Show Less" : `+ ${availableSubCategories.length - 5} Sub Category`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Product Type */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Product Type
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['productType'] ? options.productTypes : options.productTypes.slice(0, 5)).map((type) => (
                  <label key={type._id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.productType.includes(type.name)}
                      onChange={(e) => handleFilterChange("productType", type.name, e.target.checked)}
                      className="mr-2"
                    /> {type.name}
                  </label>
                ))}
                {options.productTypes.length > 5 && (
                  <button
                    onClick={() => toggleExpand('productType')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['productType'] ? "Show Less" : `+ ${options.productTypes.length - 5} Product Type`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Product Medium */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Product Medium
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['productMedium'] ? options.productMediums : options.productMediums.slice(0, 5)).map((m) => (
                  <label key={m._id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.productMedium.includes(m.name)}
                      onChange={(e) => handleFilterChange("productMedium", m.name, e.target.checked)}
                      className="mr-2"
                    /> {m.name}
                  </label>
                ))}
                {options.productMediums.length > 5 && (
                  <button
                    onClick={() => toggleExpand('productMedium')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['productMedium'] ? "Show Less" : `+ ${options.productMediums.length - 5} Product Medium`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Product Material */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Product Material
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['productMaterial'] ? options.productMaterials : options.productMaterials.slice(0, 5)).map((mat) => (
                  <label key={mat._id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.productMaterial.includes(mat.name)}
                      onChange={(e) => handleFilterChange("productMaterial", mat.name, e.target.checked)}
                      className="mr-2"
                    /> {mat.name}
                  </label>
                ))}
                {options.productMaterials.length > 5 && (
                  <button
                    onClick={() => toggleExpand('productMaterial')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['productMaterial'] ? "Show Less" : `+ ${options.productMaterials.length - 5} Product Material`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Product Edition Type */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Product Edition Type
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['productEditionType'] ? options.productEditionTypes : options.productEditionTypes.slice(0, 5)).map((ed) => (
                  <label key={ed._id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.productEditionType.includes(ed.name)}
                      onChange={(e) => handleFilterChange("productEditionType", ed.name, e.target.checked)}
                      className="mr-2"
                    /> {ed.name}
                  </label>
                ))}
                {options.productEditionTypes.length > 5 && (
                  <button
                    onClick={() => toggleExpand('productEditionType')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['productEditionType'] ? "Show Less" : `+ ${options.productEditionTypes.length - 5} Product Edition Type`}
                  </button>
                )}
              </div>

              <hr className="mb-3 border-dark" />

              {/* Product Surface Type */}
              <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                Product Surface Type
              </p>
              <div className="space-y-2 mb-4">
                {(expandedFilters['productSurfaceType'] ? options.productSurfaceTypes : options.productSurfaceTypes.slice(0, 5)).map((s) => (
                  <label key={s._id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.productSurfaceType.includes(s.name)}
                      onChange={(e) => handleFilterChange("productSurfaceType", s.name, e.target.checked)}
                      className="mr-2"
                    /> {s.name}
                  </label>
                ))}
                {options.productSurfaceTypes.length > 5 && (
                  <button
                    onClick={() => toggleExpand('productSurfaceType')}
                    className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                  >
                    {expandedFilters['productSurfaceType'] ? "Show Less" : `+ ${options.productSurfaceTypes.length - 5} Product Surface Type`}
                  </button>
                )}
              </div>

          </aside>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4h18M3 12h18M3 20h18"
              />
            </svg>
            Filters
          </button>

          {showFilters && (
            <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              />
                <div className="relative bg-white w-72 max-w-full h-full shadow-xl p-5 overflow-y-auto">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="absolute top-3 right-3 text-gray-600"
                  >
                    ✕
                  </button>
                  <h2 className="font-bold text-lg mb-3">Filter by</h2>
                  <hr className="mb-3 border-dark" />
                  {/* Sort By */}
                  <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                    Sort By
                  </p>
                  <div className="space-y-2 mb-4">
                    {["New Arrivals", "Trending", "Price Low to High", "Price High to Low", "Relevance"].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="sortByMobile"
                          checked={filters.sortBy === option}
                          onChange={() => handleFilterChange("sortBy", option)}
                          className="mr-2"
                        /> {option}
                      </label>
                    ))}
                  </div>

                  <hr className="mb-3 border-dark" />

                  {/* Special Tags */}
                  <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                    Special Tags
                  </p>
                  <div className="space-y-2 mb-4">
                    {["Limited Edition", "Bestseller", "Verified Seller", "Exclusive"].map((tag) => (
                      <label key={tag} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.specialTags.includes(tag)}
                          onChange={(e) => handleFilterChange("specialTags", tag, e.target.checked)}
                          className="mr-2"
                        /> {tag}
                      </label>
                    ))}
                  </div>

                  <hr className="mb-3 border-dark" />

                  {/* Price */}
                  <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                    Price
                  </p>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>₹295</span>
                    <span>₹{filters.priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="295"
                    max="89700"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange("priceRange", Number(e.target.value))}
                    className="w-full mb-3 accent-red-500"
                  />
                  <div className="space-y-2 mb-4 text-sm">
                    {["Under ₹5,000", "₹5,000 – ₹10,000", "₹10,000 – ₹25,000", "Above ₹25,000"].map((bucket) => (
                      <label key={bucket} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.priceBuckets.includes(bucket)}
                          onChange={(e) => handleFilterChange("priceBuckets", bucket, e.target.checked)}
                          className="mr-2"
                        /> {bucket}
                      </label>
                    ))}
                  </div>

                  <hr className="mb-3 border-dark" />

                  {/* Size */}
                  <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                    Size
                  </p>
                  <div className="space-y-2 mb-4">
                    {["Small (<12in)", "Medium (12–24in)", "Large (24–48in)", "Oversized (48in+)"].map((s) => (
                      <label key={s} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.size.includes(s)}
                          onChange={(e) => handleFilterChange("size", s, e.target.checked)}
                          className="mr-2"
                        /> {s}
                      </label>
                    ))}
                  </div>

                      <hr className="mb-3 border-dark" />

                        {/* Main Category */}
                        <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                          Main Category
                        </p>
                        <div className="space-y-2 mb-4">
                          {(expandedFilters['mainCategoryMobile'] ? mainCategories : mainCategories.slice(0, 5)).map((name) => (
                            <label key={name} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.mainCategory.includes(name)}
                                onChange={(e) => handleFilterChange("mainCategory", name, e.target.checked)}
                                className="mr-2"
                              /> {name}
                            </label>
                          ))}
                          {mainCategories.length > 5 && (
                            <button
                              onClick={() => toggleExpand('mainCategoryMobile')}
                              className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                            >
                              {expandedFilters['mainCategoryMobile'] ? "Show Less" : `+ ${mainCategories.length - 5} Main Category`}
                            </button>
                          )}
                        </div>

                        <hr className="mb-3 border-dark" />

                        {/* Category */}
                        <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                          Category
                        </p>
                        <div className="space-y-2 mb-4">
                          {(expandedFilters['categoryMobile'] ? availableCategories : availableCategories.slice(0, 5)).map((name) => (
                            <label key={name} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.category.includes(name)}
                                onChange={(e) => handleFilterChange("category", name, e.target.checked)}
                                className="mr-2"
                              /> {name}
                            </label>
                          ))}
                          {availableCategories.length > 5 && (
                            <button
                              onClick={() => toggleExpand('categoryMobile')}
                              className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                            >
                              {expandedFilters['categoryMobile'] ? "Show Less" : `+ ${availableCategories.length - 5} Category`}
                            </button>
                          )}
                        </div>

                        <hr className="mb-3 border-dark" />

                        {/* Sub Category */}
                        <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                          Sub Category
                        </p>
                        <div className="space-y-2 mb-4">
                          {(expandedFilters['subCategoryMobile'] ? availableSubCategories : availableSubCategories.slice(0, 5)).map((name) => (
                            <label key={name} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.subCategory.includes(name)}
                                onChange={(e) => handleFilterChange("subCategory", name, e.target.checked)}
                                className="mr-2"
                              /> {name}
                            </label>
                          ))}
                          {availableSubCategories.length > 5 && (
                            <button
                              onClick={() => toggleExpand('subCategoryMobile')}
                              className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                            >
                              {expandedFilters['subCategoryMobile'] ? "Show Less" : `+ ${availableSubCategories.length - 5} Sub Category`}
                            </button>
                          )}
                        </div>

                      <hr className="mb-3 border-dark" />

                      {/* Product Type */}
                      <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                        Product Type
                      </p>
                      <div className="space-y-2 mb-4">
                        {(expandedFilters['productTypeMobile'] ? options.productTypes : options.productTypes.slice(0, 5)).map((type) => (
                          <label key={type._id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.productType.includes(type.name)}
                              onChange={(e) => handleFilterChange("productType", type.name, e.target.checked)}
                              className="mr-2"
                            /> {type.name}
                          </label>
                        ))}
                        {options.productTypes.length > 5 && (
                          <button
                            onClick={() => toggleExpand('productTypeMobile')}
                            className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                          >
                            {expandedFilters['productTypeMobile'] ? "Show Less" : `+ ${options.productTypes.length - 5} Product Type`}
                          </button>
                        )}
                      </div>

                      <hr className="mb-3 border-dark" />

                      {/* Product Medium */}
                      <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                        Product Medium
                      </p>
                      <div className="space-y-2 mb-4">
                        {(expandedFilters['productMediumMobile'] ? options.productMediums : options.productMediums.slice(0, 5)).map((m) => (
                          <label key={m._id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.productMedium.includes(m.name)}
                              onChange={(e) => handleFilterChange("productMedium", m.name, e.target.checked)}
                              className="mr-2"
                            /> {m.name}
                          </label>
                        ))}
                        {options.productMediums.length > 5 && (
                          <button
                            onClick={() => toggleExpand('productMediumMobile')}
                            className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                          >
                            {expandedFilters['productMediumMobile'] ? "Show Less" : `+ ${options.productMediums.length - 5} Product Medium`}
                          </button>
                        )}
                      </div>

                      <hr className="mb-3 border-dark" />

                      {/* Product Material */}
                      <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                        Product Material
                      </p>
                      <div className="space-y-2 mb-4">
                        {(expandedFilters['productMaterialMobile'] ? options.productMaterials : options.productMaterials.slice(0, 5)).map((mat) => (
                          <label key={mat._id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.productMaterial.includes(mat.name)}
                              onChange={(e) => handleFilterChange("productMaterial", mat.name, e.target.checked)}
                              className="mr-2"
                            /> {mat.name}
                          </label>
                        ))}
                        {options.productMaterials.length > 5 && (
                          <button
                            onClick={() => toggleExpand('productMaterialMobile')}
                            className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                          >
                            {expandedFilters['productMaterialMobile'] ? "Show Less" : `+ ${options.productMaterials.length - 5} Product Material`}
                          </button>
                        )}
                      </div>

                      <hr className="mb-3 border-dark" />

                      {/* Product Edition Type */}
                      <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                        Product Edition Type
                      </p>
                      <div className="space-y-2 mb-4">
                        {(expandedFilters['productEditionTypeMobile'] ? options.productEditionTypes : options.productEditionTypes.slice(0, 5)).map((ed) => (
                          <label key={ed._id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.productEditionType.includes(ed.name)}
                              onChange={(e) => handleFilterChange("productEditionType", ed.name, e.target.checked)}
                              className="mr-2"
                            /> {ed.name}
                          </label>
                        ))}
                        {options.productEditionTypes.length > 5 && (
                          <button
                            onClick={() => toggleExpand('productEditionTypeMobile')}
                            className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                          >
                            {expandedFilters['productEditionTypeMobile'] ? "Show Less" : `+ ${options.productEditionTypes.length - 5} Product Edition Type`}
                          </button>
                        )}
                      </div>

                      <hr className="mb-3 border-dark" />

                      {/* Product Surface Type */}
                      <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                        Product Surface Type
                      </p>
                      <div className="space-y-2 mb-4">
                        {(expandedFilters['productSurfaceTypeMobile'] ? options.productSurfaceTypes : options.productSurfaceTypes.slice(0, 5)).map((s) => (
                          <label key={s._id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.productSurfaceType.includes(s.name)}
                              onChange={(e) => handleFilterChange("productSurfaceType", s.name, e.target.checked)}
                              className="mr-2"
                            /> {s.name}
                          </label>
                        ))}
                        {options.productSurfaceTypes.length > 5 && (
                          <button
                            onClick={() => toggleExpand('productSurfaceTypeMobile')}
                            className="text-red-500 text-sm font-semibold mt-2 hover:underline block"
                          >
                            {expandedFilters['productSurfaceTypeMobile'] ? "Show Less" : `+ ${options.productSurfaceTypes.length - 5} Product Surface Type`}
                          </button>
                        )}
                      </div>

                  </div>
              </div>
            )}
          </div>

        {/* Products Grid */}
        <main className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentProducts.map((product) => {
              const hasDiscount = product.sellingPrice < product.marketPrice;
              const discountPercent = hasDiscount
                ? Math.round(
                  ((product.marketPrice - product.sellingPrice) /
                    product.marketPrice) *
                  100
                )
                : 0;

              const average = product.averageRating;
              const reviewCount = product.reviewCount ?? 0;

              return (
                <div
                  key={product._id}
                  //onClick={() => navigate(`/product-details/${product._id}`)}
                  onClick={() => { const slug = slugify(product.productName); navigate(`/product-details/${slug}/${product._id}`); }}

                  className="w-full mx-auto product-card"
                >
                  {/* Image */}
                  <div className="bg-[#ffffff]">
                    <div className="relative p-img">
                      {product.editionType && (
                        <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                          {product.editionType}
                        </span>
                      )}
                      <img
                        src={`${imageBaseURL}${product.mainImage}`}
                        alt={product.productName}
                        className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                      />
                      <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                        {/* <Heart className="w-5 h-5 text-white" /> */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWishlist(product._id);
                          }}
                          className="cursor-pointer"
                        >
                          {likedProducts[product._id] ? (
                            <Heart
                              size={20}
                              className="stroke-white"
                              style={{ fill: "white" }}
                            />
                          ) : (
                            <Heart
                              size={20}
                              className="stroke-white"
                              style={{ fill: "transparent", color: "white" }}
                            />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 product-info">
                    <h2
                      className="text-base sm:text-lg text-dark font-semibold mt-1"
                      title={product.productName}
                    >
                      {product.productName}
                    </h2>
                    <div className="flex items-center gap-1 mt-1">
                      {/* Artist name from populated userId */}
                      <p
                        className="text-gray-700 text-xs sm:text-sm font-medium flex items-center"
                        title={`${product.userId?.name ?? ""} ${product.userId?.lastName ?? ""
                          }`}
                      >
                        {product.userId?.name ||
                          product.userId?.firstName ||
                          "Unknown"}{" "}
                        {product.userId?.lastName
                          ? product.userId.lastName
                          : ""}
                      </p>

                      {/*badges*/}
                      {product.badges?.map((img, index) => (
                        <img
                          key={index}
                          src={`${imageBaseURL}${img}`}
                          className="w-5 h-5 rounded-full"
                        />
                      ))}
                    </div>
                    {/* Rating */}
                    {average == null || reviewCount === 0 ? (
                      <div className="flex items-center gap-2 mt-2 text-gray-500 italic">
                        No rating available, be the first to review!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-orange-700">
                          {Number(average).toFixed(1)}
                        </span>
                        <div className="flex items-center">
                          {renderStars(average)}
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({reviewCount}{" "}
                          {reviewCount === 1 ? "Review" : "Reviews"})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2">
                      {hasDiscount && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {discountPercent}% OFF
                        </span>
                      )}
                      {hasDiscount ? (
                        <>
                          <span className="text-gray-400 line-through">
                            ₹{product.marketPrice}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.sellingPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.sellingPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="p-3 product-button d-none d-md-block">
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!ensureBuyer()) return;

                          addToCart(product._id);
                        }}
                        disabled={!product.quantity || product.quantity === 0}
                        className={`flex items-center justify-center gap-2 flex-1 bg-[#ffffff] border border-dark rounded-full text-dark py-2 font-semibold add-cart transition ${(!product.quantity || product.quantity === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>

                      {(!product.quantity || product.quantity === 0) ? (
                        <button
                          disabled
                          className="flex-1 bg-gray-500 text-white py-2 rounded-full font-semibold shadow buy-now cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!ensureBuyer()) return;
                            navigate(
                              `/my-account/check-out/${userId}?productId=${product._id}`
                            );
                          }}
                          className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <nav className="flex flex-wrap sm:flex-nowrap items-center space-x-2 rounded border border-dark px-2 sm:px-3 py-2 text-sm sm:text-lg font-semibold overflow-x-auto no-scrollbar">
              {/* Previous */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 py-1 flex items-center ${currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-red-500"
                  }`}
              >
                <FiChevronLeft className="self-center flex-shrink-0" />
                <span className="ml-1">Previous</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-2 sm:px-3 py-1 rounded ${currentPage === page
                      ? "border border-dark text-dark"
                      : "hover:text-red-500"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 py-1 flex items-center ${currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-red-500"
                  }`}
              >
                <span className="mr-1">Next</span>
                <FiChevronRight className="self-center flex-shrink-0" />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Product;
