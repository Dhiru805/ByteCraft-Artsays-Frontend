// import React, { useState } from "react";
// import { MdVerified } from "react-icons/md";
// import { FaStar, FaShoppingCart } from "react-icons/fa";
// import { Heart } from "lucide-react";

// const CollectionsContent = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* Top Section: Breadcrumb + Search */}
//       <div className="w-full py-3 px-3">
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
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//         {/* title */}
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//           Collections
//         </h1>
//         <button className="hidden md:block w-[200px] flex-1 bg-red-500 text-white py-2 px-6 justify-self-end rounded-full font-semibold shadow buy-now">
//           Explore More
//         </button>
//       </div>

//       <hr className="my-3 border-dark" />

//       {/* Subtitle */}
//       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//         At ArtSays, we make it simple for you to collaborate directly with
//         talented artists and bring your creative vision to life. Commissioning
//         custom artwork is a personalized process designed to give you a unique
//         piece that reflects your ideas, style, and story.
//       </p>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 sm:px-6 my-5">
//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
//         <aside className="rounded-xl filter-sidebar content-center border justify-items-center bg-[#EEEEEE]">
//           <img
//             src="/herosectionimg/1.jpg"
//             className="w-full h-60 sm:h-[600px] object-contain"
//           />
//         </aside>

//         {/* <!-- Product Grid --> */}
//         <main className="content-center">
//           <div>
//             <div className="flex text-xs md:text-base font-medium text-black leading-relaxed items-center mb-2 md:!mb-4 gap-2">
//               <p className="text-xs md:text-base px-3 rounded-full bg-dark text-white leading-relaxed items-center">
//                 Limited
//               </p>
//             </div>
//             <div className="my-2">
//               {/* title */}
//               <h1 className="text-sm md:text-4xl font-bold text-dark">
//                 Beauty of Joseon Mandala Art By SL
//               </h1>
//               <hr className="my-2 border-dark" />
//               {/* Subtitle */}
//               <p className="flex text-xs md:text-base font-medium text-black leading-relaxed items-center">
//                 Pebble Palace Designs{" "}
//                 <MdVerified className="ml-2 text-blue-600 w-4 h-4" />
//               </p>
//             </div>
//             <div className="flex text-xs md:text-base font-medium text-black leading-relaxed items-center md:my-2 gap-2">
//               <p className="text-xs md:text-base px-3 rounded-full bg-[#EEEEEE] text-black leading-relaxed items-center">
//                 Handmade
//               </p>
//               <p className="text-xs md:text-base px-3 rounded-full bg-[#EEEEEE] text-black leading-relaxed items-center">
//                 Photography
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 sm:px-6">
//               <div className="hidden md:block content-center justify-items-center">
//                 <img src="/herosectionimg/limited.svg" alt="" />
//                 <p>Limited Edition</p>
//               </div>
//               <div className="md:col-span-2">
//                 <div className="py-3 md:p-3">
//                   {/* Rating */}
//                   <div className="flex items-center gap-2 mb-2 md:mb-3">
//                     <span className="text-sm font-bold text-orange-700">
//                       4.8
//                     </span>
//                     <FaStar className="text-yellow-400" />
//                     <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                     <span className="text-orange-500 font-semibold text-sm">
//                       Only 2 left!
//                     </span>
//                   </div>
//                   {/* Price Section */}
//                   <div className="flex items-center gap-2">
//                     <span className="hidden md:block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge">
//                       25% OFF
//                     </span>
//                     <span className="text-gray-400 line-through">₹12,999</span>
//                     <span className="text-lg font-bold text-gray-900">
//                       ₹9,749
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-between gap-3 md:m-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-3 my-5">
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="/herosectionimg/2.png"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="/herosectionimg/2.png"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto product-card">
//           {/* Premium Label */}
//           <div className="relative p-img">
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               Premium
//             </span>

//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//             />

//             {/* Heart Icon */}
//             <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//               <Heart className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           {/* Product Info */}
//           <div className="p-3 product-info">
//             <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//             <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//               Beauty of Joseon Mandala Art By SL
//             </h2>
//             <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//               Pebble Palace Designs
//               <span className="ml-1 text-blue-600">
//                 <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//               </span>
//             </p>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//               <span className="text-sm font-bold text-orange-700">4.8</span>
//               <FaStar className="text-yellow-400" />
//               <span className="text-gray-500 text-sm">(254 Reviews)</span>
//               <span className="text-orange-500 font-semibold text-sm">
//                 Only 2 left!
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mt-2">
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                 25% OFF
//                 <span class="timer"> | 2h:59m</span>
//               </span>
//               <span className="text-gray-400 line-through">₹12,999</span>
//               <span className="text-lg font-bold text-gray-900">₹9,749</span>
//             </div>
//           </div>

//           <div className="p-3 product-button d-none d-md-block">
//             {/* Buttons */}
//             <div className="flex justify-between gap-3">
//               <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };
// export default CollectionsContent;

// import React, { useEffect, useState } from "react";

// const ArtGalleryContent = () => {
//   const [page, setPage] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGalleryData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const base = process.env.REACT_APP_API_URL || "${process.env.REACT_APP_API_URL}";

//         const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
//         const cmsData = await cmsRes.json();

//         if (!cmsData?.success || !cmsData?.data) {
//           setPage(null);
//           setError(cmsData?.message || "No published gallery found.");
//           setLoading(false);
//           return;
//         }

//         setPage(cmsData.data);

//         const allGalleryRes = await fetch(`${base}/api/artsays-gallery`);
//         const allGalleryData = await allGalleryRes.json();

//         if (!allGalleryData?.success || !allGalleryData?.data || allGalleryData.data.length === 0) {
//           setProducts([]);
//           return;
//         }

//         const latestEntry = allGalleryData.data.reduce((latest, current) => {
//           const latestTime = new Date(latest.updatedAt || latest.createdAt).getTime();
//           const currentTime = new Date(current.updatedAt || current.createdAt).getTime();
//           return currentTime > latestTime ? current : latest;
//         });

//         const { userType, userId } = latestEntry;

//         const userRes = await fetch(`${base}/api/artsays-gallery/${userId}`);
//         const userData = await userRes.json();
//         if (!userData?.success || !userData?.data || !userData.data.userName) {
//           setProducts([]);
//           return;
//         }

//         const userName = userData.data.userName;

//         let productsRes;
//         if (userType === "Artist") {
//           productsRes = await fetch(`${base}/api/getartistproductbyid/${userName}`);
//         } else if (userType === "Seller") {
//           productsRes = await fetch(`${base}/api/getsellerproductbyid/${userName}`);
//         }

//         if (productsRes) {
//           const productsData = await productsRes.json();
//           setProducts(productsData?.success && productsData?.data ? productsData.data : []);
//         }

//       } catch (err) {
//         console.error("Error fetching gallery or products:", err);
//         setError("Failed to load gallery or products.");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGalleryData();
//   }, []);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       <div className="w-full py-3 px-3">
//         <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//           <a href="#" className="hover:text-red-500">Home</a>
//           <span>/</span>
//           <a href="#" className="hover:text-red-500">Store</a>
//           <span>/</span>
//           <a href="#" className="hover:text-red-500">Paintings</a>
//           <span>/</span>
//           <span className="font-medium text-gray-900">Abstract</span>
//         </nav>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
//           {loading ? "Loading..." : page ? page.title : "Art Gallery"}
//         </h1>
//       </div>

//       <hr className="my-3 border-dark" />

//       <div className="px-3">
//         {loading ? (
//           <p className="mt-3 text-xs md:text-base text-gray-600">Loading description...</p>
//         ) : error ? (
//           <p className="mt-3 text-xs md:text-base text-red-600">{error}</p>
//         ) : page ? (
//           <>
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               {page.description}
//             </p>

//             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//               {products.length > 0 ? (
//                 products.map((product) => (
//                   <div key={product._id} className="border p-3 rounded shadow">
//                     <h2 className="font-semibold">{product.name}</h2>
//                     <p className="text-sm text-gray-600">{product.description}</p>
//                     <p className="font-medium">${product.price}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No products available.</p>
//               )}
//             </div>
//           </>
//         ) : (
//           <p className="mt-3 text-xs md:text-base text-gray-600">
//             No published Art Gallery available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ArtGalleryContent;

// import React, { useEffect, useState } from "react";

// const ArtGalleryContent = () => {
//   const [page, setPage] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGalleryData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const base = process.env.REACT_APP_API_URL || "${process.env.REACT_APP_API_URL}";

//         const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
//         const cmsData = await cmsRes.json();

//         if (!cmsData?.success || !cmsData?.data) {
//           setPage(null);
//           setError(cmsData?.message || "No published gallery found.");
//           setLoading(false);
//           return;
//         }

//         setPage(cmsData.data);

//         const allGalleryRes = await fetch(`${base}/api/artsays-gallery`);
//         const allGalleryData = await allGalleryRes.json();

//         if (!allGalleryData?.success || !allGalleryData?.data || allGalleryData.data.length === 0) {
//           setProducts([]);
//           return;
//         }

//         const latestEntry = allGalleryData.data.reduce((latest, current) => {
//           const latestTime = new Date(latest.updatedAt || latest.createdAt).getTime();
//           const currentTime = new Date(current.updatedAt || current.createdAt).getTime();
//           return currentTime > latestTime ? current : latest;
//         });

//         const { userType, userId } = latestEntry;

//         const userRes = await fetch(`${base}/api/artsays-gallery/${userId}`);
//         const userData = await userRes.json();

//         if (!userData?.success || !userData?.data) {
//           setProducts([]);
//           return;
//         }

//         let productsRes;
//         if (userType === "Artist") {
//           productsRes = await fetch(`${base}/api/getartistproductbyid/${userId}`);
//         } else if (userType === "Seller") {
//           productsRes = await fetch(`${base}/api/getsellerproductbyid/${userId}`);
//         }

//         if (productsRes) {
//           const productsData = await productsRes.json();
//           setProducts(productsData?.success && productsData?.data ? productsData.data : []);
//         }
//       } catch (err) {
//         console.error("Error fetching gallery or products:", err);
//         setError("Failed to load gallery or products.");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGalleryData();
//   }, []);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       <div className="w-full py-3 px-3">
//         <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//           <a href="#" className="hover:text-red-500">Home</a>
//           <span>/</span>
//           <a href="#" className="hover:text-red-500">Store</a>
//           <span>/</span>
//           <a href="#" className="hover:text-red-500">Paintings</a>
//           <span>/</span>
//           <span className="font-medium text-gray-900">Abstract</span>
//         </nav>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
//           {loading ? "Loading..." : page ? page.title : "Art Gallery"}
//         </h1>
//       </div>

//       <hr className="my-3 border-dark" />

//       <div className="px-3">
//         {loading ? (
//           <p className="mt-3 text-xs md:text-base text-gray-600">Loading description...</p>
//         ) : error ? (
//           <p className="mt-3 text-xs md:text-base text-red-600">{error}</p>
//         ) : page ? (
//           <>
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               {page.description}
//             </p>

//             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//               {products.length > 0 ? (
//                 products.map((product) => (
//                   <div key={product._id} className="border p-3 rounded shadow">
//                     <h2 className="font-semibold">{product.name}</h2>
//                     <p className="text-sm text-gray-600">{product.description}</p>
//                     <p className="font-medium">${product.price}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No products available.</p>
//               )}
//             </div>
//           </>
//         ) : (
//           <p className="mt-3 text-xs md:text-base text-gray-600">
//             No published Art Gallery available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ArtGalleryContent;

// import React, { useEffect, useState } from "react";

// const ArtGalleryContent = () => {
//   const [page, setPage] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGalleryData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const base = process.env.REACT_APP_API_URL;

//         const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
//         const cmsData = await cmsRes.json();

//         console.log("CMS Response:", cmsData);

//         if (!cmsData?.success || !cmsData?.data) {
//           setPage(null);
//           setError(cmsData?.message || "No published gallery found.");
//           setLoading(false);
//           return;
//         }

//         setPage({
//           title: cmsData.data.title || "",
//           description: cmsData.data.description || "",
//           sectionTitle: cmsData.data.sectionTitle || "",
//           sectionDescription: cmsData.data.sectionDescription || "",
//         });

//         const allGalleryRes = await fetch(`${base}/api/artsays-gallery`);
//         const allGalleryData = await allGalleryRes.json();

//         if (
//           !allGalleryData?.success ||
//           !allGalleryData?.data ||
//           allGalleryData.data.length === 0
//         ) {
//           setProducts([]);
//           return;
//         }

//         const latestEntry = allGalleryData.data.reduce((latest, current) => {
//           const latestTime = new Date(
//             latest.updatedAt || latest.createdAt
//           ).getTime();
//           const currentTime = new Date(
//             current.updatedAt || current.createdAt
//           ).getTime();
//           return currentTime > latestTime ? current : latest;
//         });

//         const { userType, userId } = latestEntry;

//         const userRes = await fetch(`${base}/api/artsays-gallery/${userId}`);
//         const userData = await userRes.json();

//         if (!userData?.success || !userData?.data) {
//           setProducts([]);
//           return;
//         }

//         let productsRes;
//         if (userType === "Artist") {
//           productsRes = await fetch(
//             `${base}/api/getartistproductbyid/${userId}`
//           );
//         } else if (userType === "Seller") {
//           productsRes = await fetch(
//             `${base}/api/getsellerproductbyid/${userId}`
//           );
//         }

//         if (productsRes) {
//           const productsData = await productsRes.json();
//           setProducts(
//             productsData?.success && productsData?.data ? productsData.data : []
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching gallery or products:", err);
//         setError("Failed to load gallery or products.");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGalleryData();
//   }, []);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">

//       <div className="w-full py-3 px-3">
//         <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//           <a href="#" className="hover:text-red-500">
//             Home
//           </a>
//           <span>/</span>
//           <a href="#" className="hover:text-red-500">
//             Store
//           </a>
//           <span>/</span>
//           <a href="#" className="hover:text-red-500">
//             Paintings
//           </a>
//           <span>/</span>
//           <span className="font-medium text-gray-900">Abstract</span>
//         </nav>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
//           {loading ? "Loading..." : page ? page.title : "Art Gallery"}
//         </h1>
//       </div>

//       <hr className="my-3 border-dark" />

//       <div className="px-3">
//         {loading ? (
//           <p className="mt-3 text-xs md:text-base text-gray-600">
//             Loading description...
//           </p>
//         ) : error ? (
//           <p className="mt-3 text-xs md:text-base text-red-600">{error}</p>
//         ) : page ? (
//           <>
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               {page.description}
//             </p>

//             <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//               {products.length > 0 ? (
//                 products.map((product) => (
//                   <div key={product._id} className="border p-3 rounded shadow">
//                     <h2 className="font-semibold">{product.name}</h2>
//                     <p className="text-sm text-gray-600">
//                       {product.description}
//                     </p>
//                     <p className="font-medium">${product.price}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No products available.</p>
//               )}
//             </div>
//             <br/>
//             <br/>
//             <br/>

//             {page.sectionTitle && (
//               <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
//                 {page.sectionTitle}
//               </h1>
//             )}
//             <hr className="my-3 border-dark" />

//             {page.sectionDescription && (
//               <p className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed">
//                 {page.sectionDescription}
//               </p>
//             )}
//           </>
//         ) : (
//           <p className="mt-3 text-xs md:text-base text-gray-600">
//             No published Art Gallery available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ArtGalleryContent;

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
const ArtGalleryContent = () => {
  const [page, setPage] = useState(null);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const base = process.env.REACT_APP_API_URL;

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (page) => setCurrentPage(page);

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn(
        "Only buyers can use this feature, Register as a Buyer to continue."
      );
      return false;
    }
    return true;
  };

  const handleWishlist = async (productId) => {
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
    if (!ensureBuyer()) return;

    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (avg) => {
    if (!avg)
      return [...Array(5)].map((_, i) => (
        <FaStar key={i} className="text-gray-300" />
      ));

    const filled = Math.round(avg);
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < filled ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  //   useEffect(() => {
  //   const fetchGalleryData = async () => {
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
  //       const cmsData = await cmsRes.json();

  //       if (!cmsData?.success || !cmsData?.data) {
  //         setError("No published gallery found.");
  //         setLoading(false);
  //         return;
  //       }

  //       setPage({
  //         title: cmsData.data.title,
  //         description: cmsData.data.description,
  //         sectionTitle: cmsData.data.sectionTitle,
  //         sectionDescription: cmsData.data.sectionDescription
  //       });

  //       const [res1, res2, ratingRes, badgeRes] = await Promise.all([
  //         getAPI("/api/getstatusapprovedproduct", {}, true, false),
  //         getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
  //         getAPI("/api/reviews/aggregated", {}, true, false),
  //         getAPI("/api/products/approved-with-badges", {}, true, false),
  //       ]);

  //       const products1 = res1?.data?.data?.filter(p => p.status === "Approved") || [];
  //       const products2 = res2?.data?.data?.filter(p => p.status === "Approved") || [];

  //       const allProducts = [...products1, ...products2].sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );

  //       const ratings = ratingRes?.data?.data || [];

  //       const productsWithRatings = allProducts.map(product => {
  //         const r = ratings.find(x => x.productId === product._id);

  //         return {
  //           ...product,
  //           averageRating: r?.averageRating ? Number(r.averageRating) : null,
  //           reviewCount: r?.reviewCount ?? 0,
  //         };
  //       });

  //       const badgeData = badgeRes?.data?.data || [];

  //       const finalProducts = productsWithRatings.map(p => {
  //         const match = badgeData.find(b => b._id === p._id);

  //         return {
  //           ...p,
  //           seller: match?.seller || p.seller,
  //           badges: match?.badges || [],
  //         };
  //       });

  //       setProducts(finalProducts);

  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load products.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchGalleryData();
  // }, []);
  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError("");

      try {
        const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
        const cmsData = await cmsRes.json();

        if (!cmsData?.success || !cmsData?.data) {
          setError("No published gallery found.");
          setLoading(false);
          return;
        }

        setPage({
          title: cmsData.data.title,
          description: cmsData.data.description,
          sectionTitle: cmsData.data.sectionTitle,
          sectionDescription: cmsData.data.sectionDescription,
        });

        const galleryRes = await getAPI(
          "/api/artsays-gallery/",
          {},
          true,
          false
        );
        const galleryEntries = galleryRes?.data?.data || [];

        //  const allowedUserIds = new Set(galleryEntries.map(g => g.userId));
        const allowedUserIds = new Set(
          galleryEntries.map((g) => String(g.userId))
        );
        const [artistRes, sellerRes, ratingRes, badgeRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
        ]);

        const artistProducts =
          artistRes?.data?.data?.filter((p) => p.status === "Approved") || [];

        const sellerProducts =
          sellerRes?.data?.data?.filter((p) => p.status === "Approved") || [];

        //  let collectedProducts = [...artistProducts, ...sellerProducts];

        // collectedProducts = collectedProducts.filter(p =>
        //   allowedUserIds.has(p.userId)
        // );
        let collectedProducts = [...artistProducts, ...sellerProducts];

        collectedProducts = collectedProducts.filter((p) => {
          const productUserId =
            typeof p.userId === "object" ? p.userId._id : p.userId;

          return allowedUserIds.has(String(productUserId));
        });
        collectedProducts = collectedProducts.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

        const ratings = ratingRes?.data?.data || [];

        const productsWithRatings = collectedProducts.map((product) => {
          const r = ratings.find((x) => x.productId === product._id);
          return {
            ...product,
            averageRating: r?.averageRating ? Number(r.averageRating) : null,
            reviewCount: r?.reviewCount ?? 0,
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
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      {/* Breadcrumb */}
      <div className="w-full py-3 px-3">
        <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
          <a href="#" className="hover:text-red-500">
            Home
          </a>
          <span>/</span>
          <a href="#" className="hover:text-red-500">
            Store
          </a>
          <span>/</span>
          <span className="font-medium text-gray-900">Art Gallery</span>
        </nav>
      </div>

      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
          {loading ? "Loading..." : page?.title || "Art Gallery"}
        </h1>
      </div>

      <hr className="my-3 border-dark" />

      {/* Description */}
      <div className="px-3">
        {loading ? (
          <p className="mt-3 text-xs md:text-base text-gray-600">
            Loading description...
          </p>
        ) : error ? (
          <p className="mt-3 text-xs md:text-base text-red-600">{error}</p>
        ) : (
          <>
            <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
              {page?.description}
            </p>
            <br />
            <br />
            {/* Products Grid */}
            <main className="md:col-span-3">
              {/* <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3"> */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {currentProducts.map((product) => {
                  const hasDiscount =
                    product.sellingPrice < product.marketPrice;
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
                      onClick={() =>
                        navigate(`/product-details/${product._id}`)
                      }
                      //className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1 m-3"
                      className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1 mx-auto w-full max-w-[330px] my-2"
                    >
                      {/* Image */}
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
                                style={{ fill: "transparent" }}
                              />
                            )}
                          </div>
                        </button>
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
                            title={`${product.userId?.name ?? ""} ${
                              product.userId?.lastName ?? ""
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
                            className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart hover:bg-dark hover:text-white transition"
                          >
                            <FaShoppingCart /> Add to Cart
                          </button>

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
                    className={`px-2 sm:px-3 py-1 flex items-center ${
                      currentPage === 1
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
                        className={`px-2 sm:px-3 py-1 rounded ${
                          currentPage === page
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
                    className={`px-2 sm:px-3 py-1 flex items-center ${
                      currentPage === totalPages
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

            {/* ---------------- PRODUCT CARDS END ---------------- */}

            {/* SECTION 2 */}
            <br />
            <br />
            {page.sectionTitle && (
              <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34]">
                {page.sectionTitle}
              </h1>
            )}
            <hr className="my-3 border-dark" />
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {page.sectionDescription}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtGalleryContent;
