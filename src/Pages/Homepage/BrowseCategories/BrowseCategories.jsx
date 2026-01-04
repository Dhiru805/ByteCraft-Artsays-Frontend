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
//       {/* catergory scroll */}
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

// OLD WORKING CODE

// import { useState, useEffect, useRef } from "react";
// import getAPI from "../../../api/getAPI";

// const BrowseCategories = () => {
//   const [data, setData] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const scrollRef = useRef(null);
//   let isDown = false;
//   let startX;
//   let scrollLeft;

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
//     const walk = (x - startX) * 2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };
//   const touchStart = (e) => {
//     isDown = true;
//     startX = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     scrollLeft = scrollRef.current.scrollLeft;
//   };
//   const touchEnd = () => (isDown = false);
//   const touchMove = (e) => {
//     if (!isDown) return;
//     const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const pageRes = await getAPI("/api/homepage/published");
//         const homepage = pageRes.data.data;
//         if (!homepage?._id) throw new Error("No published homepage found");

//         const sectionRes = await getAPI(`/api/homepage-sections/browse-categories/${homepage._id}`);
//         setData(sectionRes.data.data || {});

//         const catRes = await getAPI("/api/all");
//         const approvedCategoryNames = new Set(merged.map(p => p.category));

// const filteredCategories = catRes.data.data.filter(cat =>
//   approvedCategoryNames.has(cat.categoryName)
// );

// setCategories(filteredCategories);

//         //setCategories(catRes.data.data || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const [allProducts, setAllProducts] = useState([]);
// const [filteredProducts, setFilteredProducts] = useState([]);
// const [selectedCategory, setSelectedCategory] = useState(null);

// const [res1, res2] = await Promise.all([
//   getAPI("/api/getstatusapprovedproduct", {}, true, false),
//   getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
// ]);

// const products1 = res1?.data?.data || [];
// const products2 = res2?.data?.data || [];
// const merged = [...products1, ...products2].filter(p => p.status === "Approved");

// setAllProducts(merged);

//     fetchData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (!data) return <div>No Browse Categories section available</div>;

//   return (
//     <div className="max-w-[1440px] mx-auto py-4 px-3">

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//           {data.heading}
//         </h1>
//         {data.buttonName && (
//           <a
//             href={data.buttonLink || "#"}
//             className="hidden md:inline-flex items-center justify-center bg-red-500 text-white font-semibold rounded-full shadow px-6 py-2 text-center"
//           >
//             {data.buttonName}
//           </a>
//         )}
//       </div>

//       <hr className="my-3 border-dark" />

//       <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//         {data.description}
//       </p>

//       <div
//         ref={scrollRef}
//         className="flex gap-3 overflow-x-auto p-6 cursor-grab !scrollbar-hide"
//         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         onMouseDown={mouseDown}
//         onMouseLeave={mouseLeave}
//         onMouseUp={mouseUp}
//         onMouseMove={mouseMove}
//         onTouchStart={touchStart}
//         onTouchEnd={touchEnd}
//         onTouchMove={touchMove}
//       >
//         {categories.map((cat, index) => (
//           // <button
//           //   key={index}
//           //   className="group relative flex items-center border-2 border-[#3b2b23] rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold transition-all duration-500 ease-in-out whitespace-nowrap hover:pr-16"
//           // >
//           <button
//   key={index}
//   onClick={() => {
//     setSelectedCategory(cat.categoryName);
//     const filtered = allProducts.filter(
//       p => p.category === cat.categoryName
//     );
//     setFilteredProducts(filtered);
//   }}
//   className="group relative flex items-center border-2 border-[#3b2b23] rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold transition-all duration-500 ease-in-out whitespace-nowrap hover:pr-16"
// >

//             <span className="relative z-10">{cat.categoryName}</span>
//             <div className="absolute right-0 top-0 bottom-0 w-0 group-hover:w-14 bg-[#3b2b23] text-white text-3xl flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 ease-in-out">
//               A
//             </div>
//           </button>

//         ))}
//         {selectedCategory && (
//   <h2 className="text-2xl font-bold text-[#3b2b23] px-3 mt-6">
//     Showing results for: {selectedCategory}
//   </h2>
// )}

// <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-3 mt-6">
//   {filteredProducts.map((product) => (
//     <div
//       key={product._id}
//       className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1"
//     >
//       {/* Image */}
//       <div className="relative p-img">
//         {product.editionType && (
//           <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//             {product.editionType}
//           </span>
//         )}

//         <img
//           src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${product.mainImage}`}
//           className="w-full h-40 sm:h-64 object-contain rounded-t-2xl"
//         />
//       </div>

//       {/* Info */}
//       <div className="p-3">
//         <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//           {product.productName}
//         </h2>

//         {/* Price */}
//         <div className="flex items-center gap-2 mt-2">
//           <span className="text-lg font-bold text-gray-900">
//             ₹{product.sellingPrice}
//           </span>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>

//       </div>
//     </div>
//   );
// };

// export default BrowseCategories;

// ======================================================================================================================

// import { useState, useEffect, useRef } from "react";
// import getAPI from "../../../api/getAPI";
// import { Heart } from "lucide-react";
// import { FaStar } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import postAPI from "../../../api/postAPI";
// import deleteAPI from "../../../api/deleteAPI";
// import { toast } from "react-toastify";

// const BrowseCategories = () => {
//   const [data, setData] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [loading, setLoading] = useState(true);

// const navigate = useNavigate();
// const [likedProducts, setLikedProducts] = useState({});
// const [currentPage, setCurrentPage] = useState(1);
// const itemsPerPage = 8;
// const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
// const userId = localStorage.getItem("userId");

// const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

// const indexOfLast = currentPage * itemsPerPage;
// const indexOfFirst = indexOfLast - itemsPerPage;
// const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

// const goNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
// const goPrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
// const goTo = (p) => setCurrentPage(p);

//   const scrollRef = useRef(null);
//   let isDown = false;
//   let startX;
//   let scrollLeft;

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
//     const walk = (x - startX) * 2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };
// const toggleLike = (productId) => {
//   setLikedProducts((prev) => ({
//     ...prev,
//     [productId]: !prev[productId],
//   }));
// };
// const renderStars = (averageRating) => {
//   if (!averageRating) {
//     return [1,2,3,4,5].map(i => <FaStar key={i} className="text-gray-300" />);
//   }

//   const filled = Math.round(averageRating);
//   return [1,2,3,4,5].map(i => (
//     <FaStar
//       key={i}
//       className={i <= filled ? "text-yellow-400" : "text-gray-300"}
//     />
//   ));
// };

//   const touchStart = (e) => {
//     isDown = true;
//     startX = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     scrollLeft = scrollRef.current.scrollLeft;
//   };
//   const touchEnd = () => (isDown = false);
//   const touchMove = (e) => {
//     if (!isDown) return;
//     const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const pageRes = await getAPI("/api/homepage/published");
//       const homepage = pageRes.data.data;

//       const sectionRes = await getAPI(
//         `/api/homepage-sections/browse-categories/${homepage._id}`
//       );
//       setData(sectionRes.data.data || {});

//       const [res1, res2] = await Promise.all([
//         getAPI("/api/getstatusapprovedproduct", {}, true, false),
//         getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
//       ]);

//       const products1 = res1?.data?.data || [];
//       const products2 = res2?.data?.data || [];

//       const merged = [...products1, ...products2].filter(
//         (p) => p.status === "Approved"
//       );

//       setAllProducts(merged);

//       const catRes = await getAPI("/api/all");
//       const allCats = catRes.data.data || [];

//       const usedCategoryIds = new Set(
//         merged.map((p) => p.category?.toString())
//       );

//       const validCategories = allCats.filter(cat =>
//         usedCategoryIds.has(cat._id?.toString())
//       );

//       setCategories(validCategories);
//       if (validCategories.length > 0) {
//   const first = validCategories[0];
//   setSelectedCategory(first.categoryName);

//   const firstProducts = merged.filter(
//     (p) => p.category === first._id
//   );

//   setFilteredProducts(firstProducts);
// }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);

// const handleWishlist = async (productId, e) => {
//   e.stopPropagation();

//   if (!userId) {
//     toast.warn("You must be logged in as a buyer to use wishlist");
//     return;
//   }

//   const isLiked = likedProducts[productId];

//   try {
//     if (isLiked) {
//       await deleteAPI("/api/wishlist/remove", {
//         params: { userId, productId },
//       });
//       toast.warn("Removed from Wishlist");
//     } else {
//       await postAPI("/api/wishlist/add", { userId, productId });
//       toast.success("Added to Wishlist");
//     }

//     setLikedProducts((prev) => ({
//       ...prev,
//       [productId]: !isLiked,
//     }));
//   } catch (err) {
//     console.error("Wishlist error:", err);
//   }
// };

// useEffect(() => {
//   const fetchWishlist = async () => {
//     if (!userId) return;

//     try {
//       const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
//       const wishlistArray = res?.data?.wishlist || [];

//       const obj = {};
//       wishlistArray.forEach((item) => {
//         obj[item._id] = true;
//       });

//       setLikedProducts(obj);
//     } catch (error) {
//       console.log("Error loading wishlist:", error);
//     }
//   };

//   fetchWishlist();
// }, []);

//   if (loading) return <div>Loading...</div>;
//   if (!data) return <div>No Browse Categories section available</div>;

//   return (
//     <div className="max-w-[1440px] mx-auto py-4 px-3">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//           {data.heading}
//         </h1>

//         {data.buttonName && (
//           <a
//             href={data.buttonLink || "#"}
//             className="hidden md:inline-flex items-center justify-center bg-red-500 text-white font-semibold rounded-full shadow px-6 py-2 text-center"
//           >
//             {data.buttonName}
//           </a>
//         )}
//       </div>

//       <hr className="my-3 border-dark" />

//       <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//         {data.description}
//       </p>

//       {/* Categories */}
//       <div
//         ref={scrollRef}
//         className="flex gap-3 overflow-x-auto p-6 cursor-grab !scrollbar-hide"
//         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         onMouseDown={mouseDown}
//         onMouseLeave={mouseLeave}
//         onMouseUp={mouseUp}
//         onMouseMove={mouseMove}
//         onTouchStart={touchStart}
//         onTouchEnd={touchEnd}
//         onTouchMove={touchMove}
//       >
//         {categories.map((cat, index) => (
//           <button
//             key={index}
//             onClick={() => {
//               setSelectedCategory(cat.categoryName);

//               const result = allProducts.filter(
//                 (p) => p.category === cat._id
//               );

//               setFilteredProducts(result);
//             }}
//             className="group relative flex items-center border-2 border-[#3b2b23] rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold transition-all duration-500 ease-in-out whitespace-nowrap hover:pr-16"
//           >
//             <span className="relative z-10">{cat.categoryName}</span>
//             <div className="absolute right-0 top-0 bottom-0 w-0 group-hover:w-14 bg-[#3b2b23] text-white text-3xl flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 ease-in-out">
//               A
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* Selected Category Title */}
//       {selectedCategory && (
//         <h2 className="text-2xl font-bold text-[#3b2b23] px-3 mt-6">
//           Showing results for: {selectedCategory}
//         </h2>
//       )}

//       {/* Products Grid */}
// <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-3 mt-6">
//   {currentItems.map((product) => {
//     const hasDiscount =
//       product.marketPrice && product.sellingPrice < product.marketPrice;

//     const discountPercent = hasDiscount
//       ? Math.round(
//           ((product.marketPrice - product.sellingPrice) /
//             product.marketPrice) *
//             100
//         )
//       : 0;

//     return (
//       <div
//         key={product._id}
//         onClick={() => navigate(`/product-details/${product._id}`)}
//         className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between cursor-pointer bg-white hover:-translate-y-1 transition-transform duration-300"
//       >
//         {/* Image */}
//         <div className="relative p-img">
//           {product.editionType && (
//             <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//               {product.editionType}
//             </span>
//           )}

//           <img
//             src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${product.mainImage}`}
//             alt={product.productName}
//             className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//           />

//            {/* Wishlist */}
//     <button
//       onClick={(e) => handleWishlist(product._id, e)}
//       className="absolute bottom-3 right-3 p-2 rounded-full shadow bg-dark"
//     >
//       {likedProducts[product._id] ? (
//         <Heart size={20} className="stroke-white" style={{ fill: "white" }} />
//       ) : (
//         <Heart size={20} className="stroke-white" style={{ fill: "transparent" }} />
//       )}
//     </button>
//         </div>

//         {/* Info */}
//         <div className="p-3">
//           <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//             {product.productName}
//           </h2>

//           {/* Artist + badges */}
//           <div className="flex items-center gap-2 mt-1">
//             <p className="text-gray-700 text-xs sm:text-sm font-medium">
//               {product.userId?.username || `${product.userId?.name} ${product.userId.lastName}` || "Unknown"}
//               {/* {product.userId?.lastName ? ` ${product.userId.lastName}` : ""} */}
//             </p>

//             {product.badges?.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${img}`}
//                 className="w-5 h-5 rounded-full"
//               />
//             ))}
//           </div>

//           {/* Ratings */}
//           {product.averageRating ? (
//             <div className="flex items-center gap-2 mt-2">
//               <span className="text-sm font-bold text-orange-700">
//                 {product.averageRating.toFixed(1)}
//               </span>
//               <div className="flex">{renderStars(product.averageRating)}</div>
//               <span className="text-gray-500 text-sm">
//                 ({product.reviewCount} Reviews)
//               </span>
//             </div>
//           ) : (
//             <div className="text-gray-500 italic text-xs mt-2">
//               No rating available
//             </div>
//           )}

//           {/* Price */}
//           <div className="flex items-center gap-2 mt-2">
//             {hasDiscount && (
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                 {discountPercent}% OFF
//               </span>
//             )}

//             {hasDiscount ? (
//               <>
//                 <span className="text-gray-400 line-through">
//                   ₹{product.marketPrice}
//                 </span>
//                 <span className="text-lg font-bold text-gray-900">
//                   ₹{product.sellingPrice}
//                 </span>
//               </>
//             ) : (
//               <span className="text-lg font-bold text-gray-900">
//                 ₹{product.sellingPrice}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>
// {/* Pagination */}
// {totalPages > 1 && (
//   <div className="flex justify-center mt-6">
//     <nav className="flex items-center space-x-2 rounded border border-dark px-3 py-2 text-sm font-semibold">
//       <button
//         onClick={goPrev}
//         disabled={currentPage === 1}
//         className={`px-3 py-1 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"}`}
//       >
//         Prev
//       </button>

//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//         <button
//           key={p}
//           onClick={() => goTo(p)}
//           className={`px-3 py-1 rounded ${
//             currentPage === p ? "border border-dark" : "hover:text-red-500"
//           }`}
//         >
//           {p}
//         </button>
//       ))}

//       <button
//         onClick={goNext}
//         disabled={currentPage === totalPages}
//         className={`px-3 py-1 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"}`}
//       >
//         Next
//       </button>
//     </nav>
//   </div>
// )}

//     </div>
//   );
// };

// export default BrowseCategories;

import { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";
import { Heart } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import BrowserCategorySkeleton from "../../../Component/Skeleton/BrowserCategorySkeleton";

const BrowseCategories = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  // eslint-disable-next-line no-unused-vars
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

    // const goNext = () =>
    //   currentPage < totalPages && setCurrentPage(currentPage + 1);
    // const goPrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    // const goTo = (p) => setCurrentPage(p);

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

  const renderStars = (averageRating) => {
    if (!averageRating) {
      return [1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} className="text-gray-300" />
      ));
    }

    const filled = Math.round(averageRating);
    return [1, 2, 3, 4, 5].map((i) => (
      <FaStar
        key={i}
        className={i <= filled ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;

        const sectionRes = await getAPI(
          `/api/homepage-sections/browse-categories/${homepage._id}`
        );
        setData(sectionRes.data.data || {});

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

        const merged = [...products1, ...products2].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const ratings = ratingRes?.data?.data || [];
        const withRatings = merged.map((p) => {
          const match = ratings.find((r) => r.productId === p._id);
          return {
            ...p,
            averageRating: match?.averageRating
              ? Number(match.averageRating)
              : null,
            reviewCount: match?.reviewCount ?? 0,
          };
        });

        const badgeData = badgeRes?.data?.data || [];
        const finalProducts = withRatings.map((p) => {
          const matched = badgeData.find((b) => b._id === p._id);
          return {
            ...p,
            seller: matched?.seller || p.seller,
            badges: matched?.badges || [],
          };
        });

        setAllProducts(finalProducts);

        const catRes = await getAPI("/api/all");
        const allCats = catRes.data.data || [];

        const usedIds = new Set(
          finalProducts.map((p) => p.category?.toString())
        );

        const validCategories = allCats.filter((cat) =>
          usedIds.has(cat._id?.toString())
        );

        setCategories(validCategories);

        if (validCategories.length > 0) {
          const first = validCategories[0];
          setSelectedCategory(first.categoryName);

          const firstProducts = finalProducts.filter(
            (p) => p.category === first._id
          );

          setFilteredProducts(firstProducts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn(
        "Only buyers can use this feature, Register as a Buyer to continue."
      );
      return false;
    }
    return true;
  };

  const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const handleWishlist = async (productId, e) => {
    e.stopPropagation();

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

  if (loading) return <div><BrowserCategorySkeleton /></div>;
  if (!data) return <div>No Browse Categories section available</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-4 px-3">
      {/* HEADER */}
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

      {/* CATEGORY BUTTONS */}
      {/* <div
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
          // <button
          //   key={index}
          //   onClick={() => {
          //     setSelectedCategory(cat.categoryName);

          //     const result = allProducts.filter(
          //       (p) => p.category === cat._id
          //     );

          //     setFilteredProducts(result);
          //     setCurrentPage(1);
          //   }}
          //   className="group relative flex items-center border-2 border-[#3b2b23] rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold transition-all duration-500 ease-in-out whitespace-nowrap hover:pr-16"
          // >
          //   <span className="relative z-10">{cat.categoryName}</span>
          //   <div className="absolute right-0 top-0 bottom-0 w-0 group-hover:w-14 bg-[#3b2b23] text-white text-3xl flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 ease-in-out">
          //     A
          //   </div>
          // </button>
          <button
            key={index}
            onClick={() => {
              setSelectedCategory(cat.categoryName);
              const result = allProducts.filter((p) => p.category === cat._id);
              setFilteredProducts(result);
              setCurrentPage(1);
            }}
            className={`
    group relative flex items-center border-2 border-[#3b2b23]
    rounded-full h-14 px-6 text-[#3b2b23] text-lg font-semibold
    whitespace-nowrap transition-all duration-500 ease-in-out

    ${
      selectedCategory === cat.categoryName ? "pr-16" : "pr-6 group-hover:pr-16"
    }
  `}
          >
            <span className="relative z-10">{cat.categoryName}</span>

            <div
              className={`
      absolute top-0 bottom-0 right-0
      bg-[#3b2b23] text-white text-3xl
      rounded-full flex items-center justify-center overflow-hidden
      transition-all duration-500 ease-in-out

      ${selectedCategory === cat.categoryName ? "w-14" : "w-0 group-hover:w-14"}
    `}
            >
              A
            </div>
          </button>
        ))}
      </div> */}

      {/* CATEGORY BUTTONS */}
      <div>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto !scrollbar-hide p-6 cursor-grab"
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
              onClick={() => {
                setSelectedCategory(cat.categoryName);
                const result = allProducts.filter(
                  (p) => p.category === cat._id
                );
                setFilteredProducts(result);
                setCurrentPage(1);
              }}
              className={`
          group relative flex items-center
          border-2 border-[#3b2b23]
          rounded-full h-14 px-6
          text-[#3b2b23] text-lg font-semibold
          transition-all duration-500 ease-in-out
          whitespace-nowrap
          ${selectedCategory === cat.categoryName
                  ? "pr-16"
                  : "hover:pr-16"
                }
        `}
            >
              {/* TEXT */}
              <span className="relative z-10">
                {cat.categoryName}
              </span>

              {/* EXPANDING CIRCLE */}
              <div
                className={`
            absolute right-0 top-0 bottom-0
            bg-[#3b2b23] text-white text-3xl
            flex items-center justify-center
            rounded-full overflow-hidden
            transition-all duration-500 ease-in-out
            ${selectedCategory === cat.categoryName
                    ? "w-14"
                    : "w-0 group-hover:w-14"
                  }
          `}
              >
                A
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SELECTED CATEGORY */}
      {/* {selectedCategory && (
        <h2 className="text-2xl font-bold text-[#3b2b23] px-3 mt-6">
          Showing results for: {selectedCategory}
        </h2>
      )} */}

      {/* PRODUCT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-3 mt-6">
        {currentItems.map((product) => {
          const hasDiscount =
            product.marketPrice && product.sellingPrice < product.marketPrice;

          const discountPercent = hasDiscount
            ? Math.round(
              ((product.marketPrice - product.sellingPrice) /
                product.marketPrice) *
              100
            )
            : 0;

          return (
            <div
              key={product._id}
              onClick={() => { const slug = slugify(product.productName); navigate(`/product-details/${slug}/${product._id}`);}}
              className="rounded-3xl shadow-md overflow-hidden flex flex-col justify-between cursor-pointer bg-[#ffffff] hover:-translate-y-1 transition-transform duration-300"
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
                  className="w-full h-40 sm:h-64 object-contain rounded-t-3xl"
                />

                {/* Wishlist */}
                <button
                  onClick={(e) => handleWishlist(product._id, e)}
                  className="absolute bottom-3 right-3 p-2 rounded-full shadow bg-dark"
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
                </button>
              </div>

              {/* Info */}
              <div className="p-3 bg-white">
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  {product.productName}
                </h2>

                {/* Artist + badges */}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-700 text-xs sm:text-sm font-medium">
                    {product.userId?.username ||
                      `${product.userId?.name || ""} ${product.userId?.lastName || ""
                      }` ||
                      "Unknown"}
                  </p>

                  {product.badges?.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${imageBaseURL}${img}`}
                      alt="badge"
                      className="w-5 h-5 rounded-full"
                    />
                  ))}
                </div>

                {/* Ratings */}
                {product.averageRating ? (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-orange-700">
                      {product.averageRating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {renderStars(product.averageRating)}
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({product.reviewCount} Reviews)
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-xs mt-2">
                    No rating available
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
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2 rounded border border-dark px-3 py-2 text-sm font-semibold">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className={`px-3 py-1 ${currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-red-500"
                }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`px-3 py-1 rounded ${currentPage === p
                    ? "border border-dark"
                    : "hover:text-red-500"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 ${currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-red-500"
                }`}
            >
              Next
            </button>
          </nav>
        </div>
      )} */}
    </div>
  );
};

export default BrowseCategories;
