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












import React, { useEffect, useState } from "react";

const ArtGalleryContent = () => {
  const [page, setPage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError("");

      try {
        const base = process.env.REACT_APP_API_URL;

        const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
        const cmsData = await cmsRes.json();

        console.log("CMS Response:", cmsData);

        if (!cmsData?.success || !cmsData?.data) {
          setPage(null);
          setError(cmsData?.message || "No published gallery found.");
          setLoading(false);
          return;
        }

        setPage({
          title: cmsData.data.title || "",
          description: cmsData.data.description || "",
          sectionTitle: cmsData.data.sectionTitle || "",
          sectionDescription: cmsData.data.sectionDescription || "",
        });

        const allGalleryRes = await fetch(`${base}/api/artsays-gallery`);
        const allGalleryData = await allGalleryRes.json();

        if (
          !allGalleryData?.success ||
          !allGalleryData?.data ||
          allGalleryData.data.length === 0
        ) {
          setProducts([]);
          return;
        }

        const latestEntry = allGalleryData.data.reduce((latest, current) => {
          const latestTime = new Date(
            latest.updatedAt || latest.createdAt
          ).getTime();
          const currentTime = new Date(
            current.updatedAt || current.createdAt
          ).getTime();
          return currentTime > latestTime ? current : latest;
        });

        const { userType, userId } = latestEntry;

        const userRes = await fetch(`${base}/api/artsays-gallery/${userId}`);
        const userData = await userRes.json();

        if (!userData?.success || !userData?.data) {
          setProducts([]);
          return;
        }

        let productsRes;
        if (userType === "Artist") {
          productsRes = await fetch(
            `${base}/api/getartistproductbyid/${userId}`
          );
        } else if (userType === "Seller") {
          productsRes = await fetch(
            `${base}/api/getsellerproductbyid/${userId}`
          );
        }

        if (productsRes) {
          const productsData = await productsRes.json();
          setProducts(
            productsData?.success && productsData?.data ? productsData.data : []
          );
        }
      } catch (err) {
        console.error("Error fetching gallery or products:", err);
        setError("Failed to load gallery or products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
    
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
          <a href="#" className="hover:text-red-500">
            Paintings
          </a>
          <span>/</span>
          <span className="font-medium text-gray-900">Abstract</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
          {loading ? "Loading..." : page ? page.title : "Art Gallery"}
        </h1>
      </div>

      <hr className="my-3 border-dark" />

      <div className="px-3">
        {loading ? (
          <p className="mt-3 text-xs md:text-base text-gray-600">
            Loading description...
          </p>
        ) : error ? (
          <p className="mt-3 text-xs md:text-base text-red-600">{error}</p>
        ) : page ? (
          <>
            <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
              {page.description}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="border p-3 rounded shadow">
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                    <p className="font-medium">${product.price}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No products available.</p>
              )}
            </div>
            <br/>
            <br/>
            <br/>
           
            {page.sectionTitle && (
              <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
                {page.sectionTitle}
              </h1>
            )}
            <hr className="my-3 border-dark" />
           
            {page.sectionDescription && (
              <p className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed">
                {page.sectionDescription}
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 text-xs md:text-base text-gray-600">
            No published Art Gallery available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ArtGalleryContent;
