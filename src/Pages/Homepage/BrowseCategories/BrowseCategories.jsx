// import { FaStar } from "react-icons/fa";
// import { MdVerified } from "react-icons/md";
// import { FiChevronRight } from "react-icons/fi";
// import { FiChevronLeft } from "react-icons/fi";
// import { Heart } from "lucide-react";
// import { useRef } from "react";

// const categories = ["Sculpture", "Digital Art", "Handmade Crafts", "Painting", "Sculpture", "Digital Art", "Handmade Crafts", "Painting", "Sculpture", "Digital Art", "Handmade Crafts", "Painting"];

// const CommissionContent = () => {

//     const scrollRef = useRef(null);

//   let isDown = false;
//   let startX;
//   let scrollLeft;

//   // Mouse Events
//   const mouseDown = (e) => {
//     isDown = true;
//     scrollRef.current.classList.add("cursor-grabbing");
//     startX = e.pageX - scrollRef.current.offsetLeft;
//     scrollLeft = scrollRef.current.scrollLeft;
//   };
//   const mouseLeave = () => {
//     isDown = false;
//     scrollRef.current.classList.remove("cursor-grabbing");
//   };
//   const mouseUp = () => {
//     isDown = false;
//     scrollRef.current.classList.remove("cursor-grabbing");
//   };
//   const mouseMove = (e) => {
//     if (!isDown) return;
//     e.preventDefault();
//     const x = e.pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2; // scroll-fast multiplier
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   // Touch Events
//   const touchStart = (e) => {
//     isDown = true;
//     startX = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     scrollLeft = scrollRef.current.scrollLeft;
//   };
//   const touchEnd = () => {
//     isDown = false;
//   };
//   const touchMove = (e) => {
//     if (!isDown) return;
//     const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4 bg-[#ffffff]">
//       <div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//           {/* title */}
//           <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//             Browse by Categories
//           </h1>
//           <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//             Explore More
//           </button>
//         </div>

//         <hr className="my-3 border-dark" />

//         {/* Subtitle */}
//         <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//           At ArtSays, we make it simple for you to collaborate directly with
//           talented artists and bring your creative vision to life.
//         </p>
//       </div>
//       <div>
//         <div
//         ref={scrollRef}
//         className="flex gap-2 overflow-x-auto !scrollbar-hide p-6 cursor-grab"
//          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         onMouseDown={mouseDown}
//         onMouseLeave={mouseLeave}
//         onMouseUp={mouseUp}
//         onMouseMove={mouseMove}
//         onTouchStart={touchStart}
//         onTouchEnd={touchEnd}
//         onTouchMove={touchMove}
//       >
//           {categories.map((cat, index) => (
//             <button
//               key={index}
//               className="group relative flex items-center border-2 border-[#3b2b23] rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold transition-all duration-500 ease-in-out whitespace-nowrap hover:pr-16"
//             >
//               {/* Category Text */} <span className="relative z-10">{cat}</span>
//               {/* Expanding Circle */}
//               <div className="absolute right-0 top-0 bottom-0 w-0 group-hover:w-14 bg-[#3b2b23] text-3xl text-white font-[Windhavi] flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 ease-in-out">
//                 A
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="px-3">
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//           {/* <!-- Product Card --> */}
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/1.jpg"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 right-3 p-2 rounded-full shadow bg-dark">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/1.jpg"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/2.png"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/1.jpg"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/1.jpg"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/1.jpg"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto product-card">
//             {/* Premium Label */}
//             <div className="relative p-img">
//               <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                 Premium
//               </span>

//               {/* Product Image */}
//               <img
//                 src="/herosectionimg/1.jpg"
//                 alt="Beauty of Joseon Mandala Art"
//                 className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//               />

//               {/* Heart Icon */}
//               <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                 <Heart className="w-5 h-5 text-white" />
//               </button>
//             </div>
//             {/* Product Info */}
//             <div className="p-3 product-info">
//               <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                 Beauty of Joseon Mandala Art By SL
//               </h2>
//               <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                 Pebble Palace Designs
//                 <span className="ml-1 text-blue-600">
//                   <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                 </span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
//                 <span className="text-sm font-bold text-orange-700">4.8</span>
//                 <FaStar className="text-yellow-400" />
//                 <span className="text-gray-500 text-sm">(254 Reviews)</span>
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Only 2 left!
//                 </span>
//               </div>

//               {/* Price Section */}
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
//                   25% OFF
//                   <span class="timer"> | 2h:59m</span>
//                 </span>
//                 <span className="text-gray-400 line-through">₹12,999</span>
//                 <span className="text-lg font-bold text-gray-900">₹9,749</span>
//               </div>
//             </div>

//             <div className="p-3 product-button d-none d-md-block">
//               {/* Buttons */}
//               <div className="flex justify-between gap-3">
//                 <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default CommissionContent;




















import { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";

const BrowseCategories = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const mouseDown = (e) => {
    isDown = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };
  const mouseLeave = () => {
    isDown = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };
  const mouseUp = () => {
    isDown = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };
  const mouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const touchStart = (e) => {
    isDown = true;
    startX = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };
  const touchEnd = () => (isDown = false);
  const touchMove = (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        if (!homepage?._id) throw new Error("No published homepage found");

        const sectionRes = await getAPI(`/api/homepage-sections/browse-categories/${homepage._id}`);
        setData(sectionRes.data.data || {});

        const catRes = await getAPI("/api/all");
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No Browse Categories section available</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-4 px-3">
     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {data.heading}
        </h1>
        {data.buttonName && (
          <a
            href={data.buttonLink || "#"}
            className="hidden md:inline-flex items-center justify-center bg-red-500 text-white font-semibold rounded-full shadow px-6 py-2 text-center"
          >
            {data.buttonName}
          </a>
        )}
      </div>

      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
        {data.description}
      </p>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto p-6 cursor-grab !scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={mouseDown}
        onMouseLeave={mouseLeave}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onTouchMove={touchMove}
      >
        {categories.map((cat, index) => (
          <button
            key={index}
            className="group relative flex items-center border-2 border-[#3b2b23] rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold transition-all duration-500 ease-in-out whitespace-nowrap hover:pr-16"
          >
            <span className="relative z-10">{cat.categoryName}</span>
            <div className="absolute right-0 top-0 bottom-0 w-0 group-hover:w-14 bg-[#3b2b23] text-white text-3xl flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 ease-in-out">
              A
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrowseCategories;
