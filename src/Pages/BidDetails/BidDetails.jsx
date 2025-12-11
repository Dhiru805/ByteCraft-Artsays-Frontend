// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import getAPI from "../../api/getAPI";

// import { MdVerified } from "react-icons/md";
// import { BsTelegram } from "react-icons/bs";
// import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
// import { ImHammer2 } from "react-icons/im";
// import { motion } from "framer-motion";

// const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

// const BidDetails = () => {
//   const { bidId } = useParams();

//   const [bidData, setBidData] = useState(null);
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [reviews, setReviews] = useState([]);
//   const [productReviews, setProductReviews] = useState([]);

//   const [categoryData, setCategoryData] = useState({
//     mainCategories: [],
//     categories: [],
//     subCategories: [],
//   });

//   const [mainCategoryName, setMainCategoryName] = useState("");
//   const [categoryName, setCategoryName] = useState("");
//   const [subCategoryName, setSubCategoryName] = useState("");

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [activeTab, setActiveTab] = useState("description");

//   const [showPopup, setShowPopup] = useState(false);
//   const roomBackgrounds = [
//     "/artimages/viewintheroom.jpg",
//     "/artimages/wall3.jpg",
//     "/artimages/wall4.webp",
//   ];
//   const [selectedRoom, setSelectedRoom] = useState(roomBackgrounds[0]);
//   const artworkSize = { width: 100, height: 70 };

//   const minIncrement = 500;

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAPI("/api/all-complete", {}, true, false);
//         const data = res?.data?.data || {};

//         setCategoryData({
//           mainCategories: data.mainCategories || [],
//           categories: data.categories || [],
//           subCategories: data.subCategories || [],
//         });
//       } catch (err) {
//         console.error("Failed to load categories", err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const getMainCategoryById = (id) =>
//     categoryData.mainCategories.find((c) => String(c._id) === String(id));
//   const getCategoryById = (id) =>
//     categoryData.categories.find((c) => String(c._id) === String(id));
//   const getSubCategoryById = (id) =>
//     categoryData.subCategories.find((c) => String(c._id) === String(id));

//   const fetchBidProduct = async () => {
//     try {
//       const res = await getAPI(
//         `/api/bidding/products/${bidId}`,
//         {},
//         true,
//         false
//       );

//       const bid = res?.data;
//       if (!bid) {
//         setLoading(false);
//         return;
//       }

//       setBidData(bid);

//       const productId =
//         bid.product &&
//         (bid.product._id || bid.product.productId || bid.product);

//       if (!productId) {
//         setProductData(null);
//         setLoading(false);
//         return;
//       }

//       fetchApprovedProducts(productId);
//     } catch (err) {
//       console.error("Bid fetch error:", err);
//       setLoading(false);
//     }
//   };


//   const fetchApprovedProducts = async (productId) => {
//     try {
//       const [allRes, sellerRes, badgeRes, reviewsRes] = await Promise.all([
//         getAPI("/api/getstatusapprovedproduct", {}, true, false),
//         getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
//         getAPI("/api/products/approved-with-badges", {}, true, false),
//         getAPI("/api/reviews/all-reviews", {}, true, false),
//       ]);

//       const list1 = allRes?.data?.data || [];
//       const list2 = sellerRes?.data?.data || [];
//       const combined = [...list1, ...list2];

//       const matched = combined.find(
//         (p) => String(p._id) === String(productId)
//       );

//       const badgeList = badgeRes?.data?.data || [];
//       const reviewList = reviewsRes?.data?.data || [];

//       setReviews(reviewList);

//       let mergedProduct = matched || null;
//       if (mergedProduct) {
//         const badgeMatch = badgeList.find(
//           (b) => String(b._id) === String(mergedProduct._id)
//         );

//         mergedProduct = {
//           ...mergedProduct,
//           badges: badgeMatch?.badges || [],
//         };
//       }

//       setProductData(mergedProduct);
//       setLoading(false);
//     } catch (err) {
//       console.error("Approved products fetch error:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBidProduct();
//   }, [bidId]);

//   const finalData = useMemo(() => {
//     if (!bidData || !productData) return null;
//     return {
//       ...productData,
//       badges: productData.badges || [],
//       bid: {
//         artworkName: bidData.artworkName,
//         biddingId: bidData._id,
//         basePrice: bidData.basePrice,
//         reservePrice: bidData.reservePrice,
//         bidStart: bidData.bidStart,
//         bidEnd: bidData.bidEnd,
//         highestBid: bidData.highestBid ?? null,
//       },
//     };
//   }, [bidData, productData]);

//   useEffect(() => {
//     if (!finalData || categoryData.mainCategories.length === 0) return;

//     const mainCat = getMainCategoryById(finalData.mainCategory);
//     const cat = getCategoryById(finalData.category);
//     const subCat = getSubCategoryById(finalData.subCategory);

//     setMainCategoryName(mainCat?.mainCategoryName || "N/A");
//     setCategoryName(cat?.categoryName || "N/A");
//     setSubCategoryName(subCat?.subCategoryName || "N/A");
//   }, [finalData, categoryData]);

//   const images = useMemo(() => {
//     if (!finalData) return [];
//     const base = imageBaseURL;

//     const mainImg = finalData.mainImage ? `${base}${finalData.mainImage}` : null;
//     const others = (finalData.otherImages || []).map((i) => `${base}${i}`);

//     return [...(mainImg ? [mainImg] : []), ...others];
//   }, [finalData]);

//   useEffect(() => {
//     if (images.length > 0) setSelectedImage(images[0]);
//   }, [images]);

//   useEffect(() => {
//     if (!finalData || !reviews.length) return;

//     const filtered = reviews.filter((review) => {
//       const req = review.productId;
//       if (!req) return false;

//       const reviewName = req.ProductName?.trim()?.toLowerCase();
//       const productName = finalData.productName?.trim()?.toLowerCase();

//       return reviewName === productName;
//     });

//     setProductReviews(filtered);
//   }, [finalData, reviews]);

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: finalData?.bid?.artworkName || "Artwork",
//           text: "Check out this artwork!",
//           url: window.location.href,
//         })
//         .catch(() => { });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied!");
//     }
//   };

//   const changeImage = (dir) => {
//     if (!images.length) return;
//     const idx = images.indexOf(selectedImage);
//     if (dir === "next")
//       setSelectedImage(images[(idx + 1) % images.length]);
//     else
//       setSelectedImage(images[(idx - 1 + images.length) % images.length]);
//   };

//   if (loading)
//     return (
//       <div className="text-center py-10 text-xl font-semibold">
//         Loading…
//       </div>
//     );

//   if (!finalData)
//     return (
//       <div className="text-center py-10 text-xl text-red-500">
//         Product not found.
//       </div>
//     );

//   const categories = finalData.tags || [];
//   const artist = finalData.userId || finalData.seller || {};

//   const artistName =
//     artist?.username ||
//     `${artist?.name || ""} ${artist?.lastName || ""}`.trim();

//   const currentHighest =
//     bidData?.highestBid ?? bidData?.basePrice ?? finalData.bid.basePrice;

//   return (
//     <div className="max-w-[1440px] mx-auto font-[Poppins] bg-white text-[#111] p-6">
//       {/* BREADCRUMB */}
//       <p className="text-sm text-gray-500">
//         {[
//           mainCategoryName,
//           categoryName,
//           subCategoryName,
//           finalData.productName,
//         ]
//           .filter((v) => v && v !== "N/A")
//           .join(" / ")}
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
//         {/* LEFT (IMAGES + INFO) */}
//         <div className="col-span-8">
//           <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
//             {/* MAIN IMAGE + THUMBNAILS */}
//             <div className="flex flex-col lg:flex-row-reverse col-span-5 gap-3 relative">
//               <div className="relative w-full product-card">
//                 <img
//                   src={selectedImage}
//                   alt="Main"
//                   className="w-full h-[550px] object-contain product-img"
//                 />

//                 <button
//                   onClick={() => setShowPopup(true)}
//                   className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-dark text-white text-sm px-3 py-1 rounded-2xl shadow"
//                 >
//                   👁️ View in Room
//                 </button>

//                 <button
//                   onClick={handleShare}
//                   className="absolute top-3 right-3 text-[#48372D] text-4xl"
//                 >
//                   <BsTelegram />
//                 </button>

//                 <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-2">
//                   <FaChevronCircleLeft
//                     className="text-[#48372D] text-4xl cursor-pointer"
//                     onClick={() => changeImage("prev")}
//                   />
//                   <FaChevronCircleRight
//                     className="text-[#48372D] text-4xl cursor-pointer"
//                     onClick={() => changeImage("next")}
//                   />
//                 </div>
//               </div>

//               <div className="flex lg:flex-col gap-3 overflow-auto lg:max-h-[550px] scrollbar-hide">
//                 {images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img}
//                     onClick={() => setSelectedImage(img)}
//                     className={`w-24 h-24 object-contain rounded-lg border-2 cursor-pointer ${selectedImage === img
//                         ? "border-dark"
//                         : "border-transparent"
//                       }`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* POPUP */}
//             {showPopup && (
//               <div
//                 className="fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[999]"
//                 style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
//               >
//                 <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full p-4">
//                   <button
//                     onClick={() => setShowPopup(false)}
//                     className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
//                   >
//                     ✕
//                   </button>

//                   <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
//                     <img
//                       src={selectedRoom}
//                       className="w-full h-full object-contain"
//                     />

//                     <div className="absolute bottom-[140px] inset-0 flex justify-center items-center z-50">
//                       <div className="relative">
//                         <img
//                           src={selectedImage}
//                           className="object-contain rounded-lg shadow-lg"
//                           style={{
//                             width: `${Math.min(
//                               artworkSize.width * 3,
//                               450
//                             )}px`,
//                             height: `${Math.min(
//                               artworkSize.height * 3,
//                               350
//                             )}px`,
//                           }}
//                         />

//                         <div className="absolute -bottom-8 w-full text-center text-sm font-medium bg-white py-1 px-3 rounded-md shadow">
//                           {artworkSize.width} × {artworkSize.height} cm
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* room selector */}
//                   <div className="flex justify-center gap-3 mt-4">
//                     {roomBackgrounds.map((room, i) => (
//                       <img
//                         key={i}
//                         src={room}
//                         onClick={() => setSelectedRoom(room)}
//                         className={`w-24 h-20 rounded-lg cursor-pointer border-2 ${selectedRoom === room
//                             ? "border-dark"
//                             : "border-transparent"
//                           }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* PRODUCT INFO */}
//             <div className="col-span-5">
//               <h1 className="text-3xl font-semibold leading-snug">
//                 {finalData.bid.artworkName}
//               </h1>

//               {/* TAGS */}
//               <div className="flex flex-wrap gap-2 text-xs mt-2">
//                 {categories.map((t) => (
//                   <span key={t} className="bg-gray-200 px-2 py-1 rounded-md">
//                     #{t}
//                   </span>
//                 ))}
//               </div>

//               {/* ARTIST + BADGES */}
//               <div className="flex items-center mt-3">
//                 <p className="font-bold text-lg flex items-center gap-1">
//                   {artistName}

//                   {artist?.verified && (
//                     <MdVerified className="text-blue-600 w-4 h-4" />
//                   )}

//                   {finalData.badges?.map((img, index) => (
//                     <img
//                       key={index}
//                       src={`${imageBaseURL}${img}`}
//                       className="w-5 h-5 rounded-full object-contain"
//                     />
//                   ))}
//                 </p>
//               </div>

//               <hr className="my-2" />

//               <p className="text-md">
//                 Starting Price:{" "}
//                 <strong>₹{finalData.bid.basePrice}</strong>
//               </p>
//               <p className="text-md mt-2">Minimum Increment: ₹{minIncrement}</p>

//               <p className="text-2xl font-bold text-[#48372D] mt-3">
//                 Current Highest Bid: ₹{currentHighest}
//               </p>

//               <div className="items-center mt-4">
//                 <p className="text-lg font-semibold">Place Bid</p>

//                 <div className="flex mt-1 gap-2 overflow-auto scrollbar-hide">
//                   {[300, 500, 1000, 3000, 5000].map((x) => (
//                     <p
//                       key={x}
//                       className="bg-[#48372D] text-white text-sm px-3 py-1 rounded-full flex items-center"
//                     >
//                       <ImHammer2 className="mr-1" /> ₹{x}
//                     </p>
//                   ))}
//                 </div>
//               </div>

//               <p className="text-orange-700 mt-4">Ending Soon!</p>
//               {/* Delivery estimate */}
//               {finalData.estimatedDelivery && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   Delivery in <strong>{finalData.estimatedDelivery} days</strong> after payment
//                 </p>
//               )}

//               {/* FEATURE ICONS (same as ProductDetails) */}
//               <div className="flex flex-wrap gap-4 pt-4 justify-between">
//                 {finalData.framing?.toLowerCase() === "framed" && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/framed.png"
//                       alt="framed"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Framed</p>
//                   </div>
//                 )}

//                 {finalData.framing?.toLowerCase() === "unframed" && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/framed.png"
//                       alt="unframed"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Unframed</p>
//                   </div>
//                 )}

//                 {finalData.editionType?.toLowerCase().includes("limited") && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/limited edition.png"
//                       alt="limited"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Limited Edition</p>
//                   </div>
//                 )}

//                 {finalData.editionType?.toLowerCase().includes("original") && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/original.png"
//                       alt="original"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Original</p>
//                   </div>
//                 )}

//                 {finalData.editionType?.toLowerCase().includes("premium") && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/premium.png"
//                       alt="premium"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Premium</p>
//                   </div>
//                 )}

//                 {finalData.editionType?.toLowerCase().includes("open") && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/open edition.png"
//                       alt="open edition"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Open Edition</p>
//                   </div>
//                 )}

//                 {finalData.materials?.some(
//                   (mat) => mat.toLowerCase() === "glass"
//                 ) && (
//                     <div className="p-2">
//                       <img
//                         src="/herosectionimg/glass material.png"
//                         alt="glass material"
//                         className="w-full h-10 object-contain"
//                       />
//                       <p className="text-dark text-center text-xs mt-2">Glass Material</p>
//                     </div>
//                   )}

//                 {finalData.handmade === "Yes" && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/handmade.png"
//                       alt="handmade"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Handmade</p>
//                   </div>
//                 )}

//                 {finalData.giftWrapping && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/gifting.png"
//                       alt="gifting options"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">
//                       Gifting Options
//                     </p>
//                   </div>
//                 )}

//                 {finalData.artistSignature && (
//                   <div className="p-2">
//                     <img
//                       src="/herosectionimg/certified.png"
//                       alt="certified"
//                       className="w-full h-10 object-contain"
//                     />
//                     <p className="text-dark text-center text-xs mt-2">Certified</p>
//                   </div>
//                 )}
//               </div>

//             </div>

//           </div>

//           {/* TABS */}
//           <div className="mt-10">
//             <div className="flex gap-8 text-[#48372D] font-medium text-lg border-b overflow-auto no-scrollbar">
//               {[
//                 "description",
//                 "details",
//                 "artist",
//                 "bid stream",
//                 "reviews",
//               ].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setActiveTab(t)}
//                   className={`pb-2 ${activeTab === t
//                       ? "border-b-4 border-[#48372D] font-bold"
//                       : ""
//                     }`}
//                 >
//                   {t
//                     .split(" ")
//                     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                     .join(" ")}
//                 </button>
//               ))}
//             </div>

//             <div className="py-6 text-gray-700">
//               {activeTab === "description" && (
//                 <p>{finalData.description}</p>
//               )}

//               {activeTab === "details" && (
//                 <div className="space-y-2">
//                   <p>
//                     <strong>Material:</strong>{" "}
//                     {finalData.materials?.join(", ") || "—"}
//                   </p>
//                   <p>
//                     <strong>Dimensions:</strong>{" "}
//                     {finalData.dimensions?.width} ×{" "}
//                     {finalData.dimensions?.height} cm
//                   </p>
//                   <p>
//                     <strong>Weight:</strong> {finalData.weight} g
//                   </p>
//                 </div>
//               )}

//               {activeTab === "artist" && (
//                 <div>
//                   <p className="font-semibold text-lg">
//                     Artist: {artistName}
//                   </p>
//                   <p className="mt-2">
//                     {artist?.bio || "Artist details not available."}
//                   </p>
//                 </div>
//               )}

//               {activeTab === "bid stream" && (
//                 <div className="space-y-4">
//                   <div className="w-full rounded-lg">
//                     <div className="overflow-y-auto scrollbar-hide max-h-64">
//                       {[
//                         {
//                           name: "Aarav",
//                           location: "Mumbai",
//                           action: "placed",
//                           amount: "₹8,200",
//                           time: "1m ago",
//                         },
//                       ].map((activity, index) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center border-b border-gray-100 py-2"
//                         >
//                           <p className="text-sm text-gray-900">
//                             <span className="font-semibold">
//                               {activity.name}
//                             </span>{" "}
//                             from {activity.location} {activity.action}
//                           </p>
//                           <p className="text-sm font-semibold">
//                             {activity.amount}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "reviews" && (
//                 <div className="space-y-4">
//                   {productReviews.length === 0 && (
//                     <p className="text-gray-500 text-sm">
//                       No reviews for this product.
//                     </p>
//                   )}

//                   {productReviews.map((review, idx) => (
//                     <div
//                       key={idx}
//                       className="border p-4 rounded-lg shadow-sm bg-white"
//                     >
//                       <p className="font-semibold text-md">
//                         {review?.userId?.name} {review?.userId?.lastName}
//                       </p>

//                       <p className="font-medium mt-1">{review.title}</p>
//                       <p className="text-sm text-gray-700 mt-1">
//                         {review.description}
//                       </p>

//                       {review.photos?.length > 0 && (
//                         <div className="flex gap-3 mt-3">
//                           {review.photos.map((img, i) => (
//                             <img
//                               key={i}
//                               src={`${imageBaseURL}${img}`}
//                               className="w-20 h-20 rounded-lg object-cover border"
//                             />
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDEBAR */}
//         <div className="col-span-2 hidden md:block">
//           <div className="sticky top-10 bg-white border shadow p-4 rounded-xl">
//             <p className="text-3xl font-bold">Bidding Rules</p>

//             <div className="mt-4 space-y-3 text-sm">
//               <p>• Starting Price: ₹{finalData.bid.basePrice}</p>
//               <p>• Minimum Increment: ₹{minIncrement}</p>
//               <p>
//                 • Ends at:{" "}
//                 {new Date(finalData.bid.bidEnd).toLocaleString()}
//               </p>
//               <p>• No Cancellations</p>
//               <p>• Payment in 48 hours after winning</p>
//             </div>

//             <motion.button className="w-full mt-4 bg-red-500 text-white py-2 rounded-full font-semibold">
//               Place Your Bid <ImHammer2 className="inline ml-1" />
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BidDetails;


import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI"; 
import deleteAPI from "../../api/deleteAPI"; 
import { MdVerified } from "react-icons/md";
import { BsTelegram } from "react-icons/bs";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ArrowRight, Heart, Zap, ShoppingCart } from "lucide-react";
import { HiMiniPercentBadge } from "react-icons/hi2";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

const resolveMediaUrl = (path) => {
  if (!path || typeof path !== "string") return "/images/placeholder.jpg";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalized = path.replace(/\\/g, "/");
  const leadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  if (imageBaseURL) {
    const base = imageBaseURL.endsWith("/") ? imageBaseURL.slice(0, -1) : imageBaseURL;
    return `${base}${leadingSlash}`;
  }
  return leadingSlash;
};

const BidDetails = () => {
  //const { bidId } = useParams();
const { bidSlug, bidId } = useParams();

  const [bidData, setBidData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

const [showBidSidebar, setShowBidSidebar] = useState(false);
const [isBidEnded, setIsBidEnded] = useState(false);

const [manualBid, setManualBid] = useState("");
const [confirmPopup, setConfirmPopup] = useState(false);
const [bidToConfirm, setBidToConfirm] = useState(null);

  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

const [winnerAlertShown, setWinnerAlertShown] = useState(false);

  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const roomBackgrounds = [
    "/artimages/viewintheroom.jpg",
    "/artimages/wall3.jpg",
    "/artimages/wall4.webp",
  ];
  const [selectedRoom, setSelectedRoom] = useState(roomBackgrounds[0]);

  const artworkSize = { width: 100, height: 70 };

  const [badgesData, setBadgesData] = useState([]); 
  const [reviews, setReviews] = useState([]); 

  const [showBid, setShowBid] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  
const [liveBids, setLiveBids] = useState([]);
const [userBid, setUserBid] = useState(null);

// const winner = useMemo(() => {
//   if (!isBidEnded || liveBids.length === 0) return null;
  
//   const top = liveBids[0];
//   return {
//     amount: top.amount,
//     name: top.userId?.username 
//    || `${top.userId?.name || ""} ${top.userId?.lastName || ""}`.trim()
//    || "User",

//   };
// }, [isBidEnded, liveBids]);
const winner = useMemo(() => {
  if (!isBidEnded || liveBids.length === 0) return null;

  const top = liveBids[0];

  return {
    amount: top.amount,
    userId: top.userId?._id,  
    name:
      top.userId?.username ||
      `${top.userId?.name || ""} ${top.userId?.lastName || ""}`.trim() ||
      "User",
  };
}, [isBidEnded, liveBids]);


  const getMainCategoryById = (id) =>
    categoryData.mainCategories.find((c) => String(c._id) === String(id));
  const getCategoryById = (id) =>
    categoryData.categories.find((c) => String(c._id) === String(id));
  const getSubCategoryById = (id) =>
    categoryData.subCategories.find((c) => String(c._id) === String(id));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAPI("/api/all-complete", {}, true, false);
        const data = res?.data?.data || {};
        setCategoryData({
          mainCategories: data.mainCategories || [],
          categories: data.categories || [],
          subCategories: data.subCategories || [],
        });
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

// useEffect(() => {
//   if (!isBidEnded || !winner || winnerAlertShown) return;

//   const userId = localStorage.getItem("userId");
//   if (!userId) return;

//   if (winner.userId === userId) {
//     setWinnerAlertShown(true);

//     toast.success(
//       `Congratulations! You won ${finalData.bid.artworkName} at ₹${winner.amount}. It has been added to your cart.`,
//       { autoClose: 4000 }
//     );

//     postAPI("/api/cart/add-won-bid", {
//       userId,
//       productId: finalData._id,
//       bidId: finalData.bid.biddingId,
//       amount: winner.amount
//     });
//   }
// }, [isBidEnded, winner]);


// const handleRemoveFromCart = async (productId) => {
//   const userId = localStorage.getItem("userId");

//   const res = await deleteAPI(`/api/cart/remove?userId=${userId}&productId=${productId}`, {
//     userId,
//     productId
//   });

//   if (res.data.success) {
//     toast.warn(
//       "You removed your winning bid item. It will be awarded to the next highest bidder.",
//       { autoClose: 5000 }
//     );

//     await postAPI("/api/bidding/carry-forward", {
//       bidId: finalData.bid.biddingId
//     });
//   }
// };

const handleRemoveFromCart = async (productId) => {
  const userId = localStorage.getItem("userId");

  let isBidWinnerItem = false;
  try {
    const cartRes = await getAPI(`/api/cart/${userId}`, {}, true, false);
    const cartItem = cartRes?.data?.items?.find(
      (item) => item.product && String(item.product._id) === String(productId)
    );
    isBidWinnerItem = cartItem?.isBidWinnerItem === true;
  } catch (err) {
    console.error("Error checking cart:", err);
  }

  if (isBidWinnerItem) {
    const result = await Swal.fire({
      title: "Remove Bid Winner Product?",
      html: `
        <div style="text-align: left; padding: 10px 0;">
          <p style="margin-bottom: 15px; font-size: 16px; color: #333;">
            <strong>⚠️ Important Notice:</strong>
          </p>
          <ul style="margin-left: 20px; margin-bottom: 15px; color: #555;">
            <li style="margin-bottom: 10px;">This product cannot be recovered once removed</li>
            <li style="margin-bottom: 10px;">It will be automatically awarded to the next highest bidder</li>
            <li style="margin-bottom: 10px;">You will lose your winning bid status</li>
          </ul>
          <p style="color: #d32f2f; font-weight: bold;">
            Are you sure you want to proceed?
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Remove It",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      width: "500px",
    });

    if (!result.isConfirmed) {
      return;
    }
  }

  try {
  const res = await deleteAPI(`/api/cart/remove?userId=${userId}&productId=${productId}`, {
    userId,
    productId
  });

  if (res.data.success) {
      if (isBidWinnerItem) {
        Swal.fire({
          title: "Removed",
          text: "The product has been removed and will be awarded to the next highest bidder.",
          icon: "info",
          timer: 3000,
          showConfirmButton: false,
        });

    await postAPI("/api/bidding/carry-forward", {
      bidId: finalData.bid.biddingId
    });
      } else {
        toast.success("Item removed from cart");
      }
    }
  } catch (err) {
    console.error("Remove error:", err);
    if (isBidWinnerItem) {
      Swal.fire({
        title: "Error",
        text: "Failed to remove item from cart. Please try again.",
        icon: "error",
      });
    } else {
      toast.error("Failed to remove item from cart");
    }
  }
};

  useEffect(() => {
    const fetchBidProduct = async () => {
      setLoading(true);
      try {
        const res = await getAPI(`/api/bidding/products/${bidId}`, {}, true, false);
        const bid = res?.data;
        if (!bid) {
          setBidData(null);
          setProductData(null);
          setLoading(false);
          return;
        }
        setBidData(bid);

        const productId =
          bid.product && (bid.product._id || bid.product.productId || bid.product);

        if (!productId) {
          setProductData(null);
          setLoading(false);
          return;
        }

        const [allRes, sellerRes, badgeRes, reviewsRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
          getAPI("/api/reviews/all-reviews", {}, true, false),
        ]);

        const list1 = allRes?.data?.data || allRes?.data || [];
        const list2 = sellerRes?.data?.data || sellerRes?.data || [];

        const combined = [...list1, ...list2];

        const matched = combined.find((p) => p && p._id && String(p._id) === String(productId));
        setProductData(matched || null);

        setBadgesData(badgeRes?.data?.data || []);
        const reviewPayload =
          reviewsRes?.data?.reviews || reviewsRes?.data?.data || [];
        const sortedReviews = Array.isArray(reviewPayload)
          ? [...reviewPayload].sort(
              (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
            )
          : [];
        setReviews(sortedReviews);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching bid/product data:", err);
        setLoading(false);
      }
    };

    if (bidId) fetchBidProduct();
  }, [bidId]);

  const finalData = useMemo(() => {
    if (!bidData || !productData) return null;
    return {
      ...productData,
      bid: {
        artworkName: bidData.artworkName,
        biddingId: bidData._id,
        basePrice: bidData.basePrice,
        reservePrice: bidData.reservePrice,
        bidStart: bidData.bidStart,
        bidEnd: bidData.bidEnd,
        highestBid: bidData.highestBid ?? null,
      },
    };
  }, [bidData, productData]);

useEffect(() => {
  if (!isBidEnded || !winner || !finalData) return;

  const loggedInUser = localStorage.getItem("userId");
  if (!loggedInUser) return;

  if (localStorage.getItem(`won_${finalData._id}`)) return;

  if (String(winner.userId) !== String(loggedInUser)) return;

  localStorage.setItem(`won_${finalData._id}`, "true");

  toast.success(
    `Congratulations! You won ${finalData.bid.artworkName} at ₹${winner.amount}. The product is now added to your cart.`,
    { autoClose: 4000 }
  );

  postAPI(`/api/cart/${loggedInUser}/add-won-bid`, {
    userId: loggedInUser,
    //productId: finalData._id,
    productId: bidData.product?._id,
    bidId: finalData.bid.biddingId,
    amount: winner.amount,
  }).catch((err) => console.error("Add-to-cart error:", err));

}, [isBidEnded, winner, finalData]);

useEffect(() => {
  if (!finalData?.bid?.biddingId) return;

  const bidId = finalData.bid.biddingId;
  const userId = localStorage.getItem("userId");

  const fetchBidData = async () => {
    try {
      const [allBidsRes, userBidRes] = await Promise.all([
        getAPI(`/api/bidding/all/${bidId}`, {}, true, false),
        getAPI(`/api/bidding/user/${bidId}/${userId}`, {}, true, false),
      ]);

      setLiveBids(allBidsRes?.data?.bids || []);
      setUserBid(userBidRes?.data?.bid || null);

    } catch (err) {
      console.log("Bid stream error:", err);
    }
  };

  fetchBidData();

  const interval = setInterval(fetchBidData, 3000);

  return () => clearInterval(interval);
}, [finalData]);

  useEffect(() => {
    if (!finalData || categoryData.mainCategories.length === 0) return;
    const mainCat = getMainCategoryById(finalData.mainCategory);
    const cat = getCategoryById(finalData.category);
    const subCat = getSubCategoryById(finalData.subCategory);
    setMainCategoryName(mainCat?.mainCategoryName || "N/A");
    setCategoryName(cat?.categoryName || "N/A");
    setSubCategoryName(subCat?.subCategoryName || "N/A");
  }, [finalData, categoryData]);

  const images = useMemo(() => {
    if (!finalData) return [];
    const base = imageBaseURL;
    const mainImg = finalData.mainImage ? `${base}${finalData.mainImage}` : null;
    const others = (finalData.otherImages || []).map((i) => `${base}${i}`);
    return [...(mainImg ? [mainImg] : []), ...others];
  }, [finalData]);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (!showBidSidebar) return;
    if (!document.getElementById("bid-input-box")?.contains(e.target)) {
      setShowBidSidebar(false);
      setManualBid("");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showBidSidebar]);


  useEffect(() => {
    if (images.length > 0) setSelectedImage(images[0]);
  }, [images]);

const [timeLeft, setTimeLeft] = React.useState("");
const [isLastDay, setIsLastDay] = React.useState(false);

const calculateTimeLeft = () => {
  if (!finalData?.bid?.bidEnd) return "";

  const now = new Date().getTime();
  const end = new Date(finalData.bid.bidEnd).getTime();
  const diff = end - now;

  if (diff <= 0) {
  setIsBidEnded(true);
  setIsLastDay(true);
  return "00:00:00";
}


  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 1) {
    setIsLastDay(false);
    return `${days} day${days > 1 ? "s" : ""} left`;
  }

  setIsLastDay(true);

  const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

useEffect(() => {
  if (!finalData?.bid?.bidEnd) return;

  setTimeLeft(calculateTimeLeft());

  const timer = setInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, 1000);

  return () => clearInterval(timer);
}, [finalData?.bid?.bidEnd]);

useEffect(() => {
  if (!finalData?.bid?.bidEnd) return;

  const update = () => {
    const t = calculateTimeLeft();
    setTimeLeft(t);

    if (t === "00:00:00") {
      setIsBidEnded(true);
    }
  };

  update();
  const timer = setInterval(update, 1000);

  return () => clearInterval(timer);
}, [finalData?.bid?.bidEnd]);


const formatBidTime = (bid) => {
  const ts = bid.updatedAt || bid.createdAt; 
  if (!ts) return "";

  const date = new Date(ts);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const fetchBidData = async () => {
  try {
    const bidId = finalData.bid.biddingId;
    const userId = localStorage.getItem("userId");

    const [allBidsRes, userBidRes] = await Promise.all([
      getAPI(`/api/bidding/all/${bidId}`, {}, true, false),
      getAPI(`/api/bidding/user/${bidId}/${userId}`, {}, true, false),
    ]);

    setLiveBids(allBidsRes?.data?.bids || []);
    setUserBid(userBidRes?.data?.bid || null);

  } catch (err) {
    console.log("Bid stream error:", err);
  }
};


const handleBidSubmit = async (amount) => {
  try {
    setConfirmPopup(false);

    const userId = localStorage.getItem("userId");

    const res = await postAPI(
      `/api/bidding/place-bid`,
      {
        bidId: finalData.bid.biddingId,
        userId,
        amount,
      },
      true,
      false
    );

    if (res?.data?.success) {
      toast.success("Bid submitted successfully!");

      setManualBid("");
      setShowBidSidebar(false);

      fetchBidData();
    }

  } catch (err) {
    console.error(err);
    toast.error("Failed to place bid!");
  }
};


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: finalData?.bid?.artworkName || "Artwork",
        text: "Check out this artwork!",
        url: window.location.href,
      }).catch((err) => console.log("Share error", err));
    } else {
      navigator.clipboard?.writeText(window.location.href).then(
        () => toast.warn("Link copied to clipboard"),
        () => toast.warn("Share not supported")
      );
    }
  };

  const changeImage = (direction) => {
    if (!images || images.length === 0 || !selectedImage) return;
    const currentIndex = images.indexOf(selectedImage);
    if (direction === "next") {
      setSelectedImage(images[(currentIndex + 1) % images.length]);
    } else {
      setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
    }
  };

  const productBadgeEntry = useMemo(() => {
    if (!finalData || !badgesData) return null;
    return badgesData.find((b) => String(b._id) === String(finalData._id)) || null;
  }, [finalData, badgesData]);

  // const productReviews = useMemo(() => {
  //   if (!finalData || !reviews) return [];
  //   const nameA = (finalData.productName || finalData.productName?.toString() || finalData.productName || finalData.bid?.artworkName || "")
  //     .trim()
  //     .toLowerCase();

  //   return reviews.filter((r) => {
  //     const pid = r.productId;
  //     if (!pid) return false;

  //     const candidates = [
  //       pid.ProductName,
  //       pid.productName,
  //       pid.Productname,
  //       pid.ProductName?.toString?.(),
  //       pid?.ProductName,
  //     ];
  //     const reviewName =
  //       (pid.ProductName || pid.productName || pid.ProductName || "").toString().trim().toLowerCase();

  //     return reviewName === nameA;
  //   });
  // }, [finalData, reviews]);

  const productReviews = useMemo(() => {
    if (!finalData || !reviews || reviews.length === 0) return [];

    const currentProductId = finalData._id?.toString() || finalData._id;
    const currentProductName = (finalData.productName || finalData.bid?.artworkName || "").trim().toLowerCase();

    const filtered = reviews.filter((review) => {
      const reviewProductId = review.productId;
      if (!reviewProductId) return false;

      const reviewProductIdStr =
        typeof reviewProductId === "object"
          ? reviewProductId._id?.toString() || reviewProductId.toString()
          : reviewProductId.toString();

      if (reviewProductIdStr === currentProductId) {
        return true;
      }

      const buyerRequest = typeof reviewProductId === "object" ? reviewProductId : null;
      if (buyerRequest && buyerRequest.ProductName) {
        const reviewProductName = buyerRequest.ProductName?.trim()?.toLowerCase();
        if (reviewProductName && reviewProductName === currentProductName) {
          return true;
        }
      }

      if (review.productNameSnapshot) {
        const snapshotName = review.productNameSnapshot.trim().toLowerCase();
        if (snapshotName && snapshotName === currentProductName) {
          return true;
        }
      }

      return false;
    });
    return filtered.sort(
      (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    );
  }, [finalData, reviews]);

  if (loading) return <p className="text-center py-10 text-xl font-semibold">Loading...</p>;
  if (!finalData) return <p className="text-center py-10 text-xl text-red-500">Product not found.</p>;

  const seoTitle = `${finalData?.bid?.artworkName} | Live Art Auction`;
const seoDesc = finalData?.description
  ? finalData.description.substring(0, 150)
  : `Bid on ${finalData?.bid?.artworkName}. Starting at ₹${finalData?.bid?.basePrice}.`;

const seoImg = selectedImage || images[0] || "/default-auction.jpg";
const seoUrl = window.location.href;

  const Section = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );


  const Grid = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-10">{children}</div>
  );

  const Field = ({ label, value }) => {
    if (value === undefined || value === null || value === "" || value === "N/A") return null;
    const values = Array.isArray(value) ? value : [value];
    const isImage = values.some((val) => /\.(jpg|jpeg|png|webp|gif)$/i.test(val));
    return (
      <div className="text-sm mb-2">
        <strong>{label}:</strong>
        {isImage ? (
          <div className="mt-2 flex gap-2 flex-wrap">
            {values.map((img, idx) => {
              const fullURL = img.startsWith("http") ? img : `${imageBaseURL}${img}`;
              const dialogId = `dialog-${label.replace(/\s/g, "_")}-${idx}`;
              return (
                <div key={idx}>
                  <img
                    src={fullURL}
                    alt={label}
                    className="w-40 h-40 object-cover rounded border cursor-pointer hover:scale-105 transition"
                    onClick={() => document.getElementById(dialogId)?.showModal?.()}
                  />
                  <dialog id={dialogId} className="rounded-lg p-0 bg-transparent">
                    <div className="fixed inset-0 flex justify-center items-center" onClick={() => document.getElementById(dialogId)?.close?.()}>
                      <img src={fullURL} className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()} />
                    </div>
                  </dialog>
                </div>
              );
            })}
          </div>
        ) : (
          <> {value}</>
        )}
      </div>
    );
  };

  const categories = finalData.tags || [];
  const artist = finalData.userId || finalData.seller || null;
  const minIncrement = 300;
  const currentHighest = liveBids.length > 0
  ? liveBids[0].amount
  : finalData.bid.basePrice;

  const deliveryText = finalData.estimatedDelivery ? `${finalData.estimatedDelivery} days` : "5-7 days";

  const renderBadgeIcons = () => {
    const blocks = [];
    if (finalData.editionType?.toLowerCase().includes("limited")) {
      blocks.push(
        <div className="p-2" key="limited">
          <img src="/herosectionimg/limited edition.png" alt="limited edition" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2">Limited Edition</p>
        </div>
      );
    }
    if (finalData.editionType?.toLowerCase().includes("original")) {
      blocks.push(
        <div className="p-2" key="original">
          <img src="/herosectionimg/original.png" alt="original" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2 rounded">Original</p>
        </div>
      );
    }
    if (finalData.editionType?.toLowerCase().includes("premium")) {
      blocks.push(
        <div className="p-2" key="premium">
          <img src="/herosectionimg/premium.png" alt="premium" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2 rounded">Premium</p>
        </div>
      );
    }
    if (finalData.editionType?.toLowerCase().includes("open")) {
      blocks.push(
        <div className="p-2" key="open">
          <img src="/herosectionimg/open edition.png" alt="open edition" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2 rounded">Open Edition</p>
        </div>
      );
    }

    if (finalData.materials?.some((m) => m.toLowerCase() === "glass")) {
      blocks.push(
        <div className="p-2" key="glass">
          <img src="/herosectionimg/glass material.png" alt="glass material" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2 rounded">Glass Material</p>
        </div>
      );
    }

    if ((finalData.framing || "").toLowerCase() === "framed") {
      blocks.push(
        <div className="p-2" key="framed">
          <img src="/herosectionimg/framed.png" alt="framed" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2">Framed</p>
        </div>
      );
    } else if ((finalData.framing || "").toLowerCase() === "unframed") {
      blocks.push(
        <div className="p-2" key="unframed">
          <img src="/herosectionimg/framed.png" alt="unframed" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2">Unframed</p>
        </div>
      );
    }

    if (finalData.handmade === "Yes" || finalData.isHandmade === true) {
      blocks.push(
        <div className="p-2" key="handmade">
          <img src="/herosectionimg/handmade.png" alt="handmade" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2">Handmade</p>
        </div>
      );
    }

    if (finalData.giftWrapping) {
      blocks.push(
        <div className="p-2" key="gifting">
          <img src="/herosectionimg/gifting.png" alt="gifting options" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2 rounded">Gifting Options</p>
        </div>
      );
    }

    if (finalData.artistSignature || finalData.isSigned) {
      blocks.push(
        <div className="p-2" key="certified">
          <img src="/herosectionimg/certified.png" alt="certified" className="w-full h-10 object-contain" />
          <p className="text-dark text-center text-xs mt-2 rounded">Certified</p>
        </div>
      );
    }

    return blocks.length ? <div className="flex gap-2 mt-3 justify-between flex-wrap">{blocks}</div> : null;
  };
  

const hasAnyValue = (obj) => {
  return Object.values(obj).some(
    (v) => v !== undefined && v !== null && v !== "" && v !== false
  );
};

  return (
    <div className="max-w-[1440px] mx-auto font-[Poppins] bg-white text-[#111] p-6">
     <Helmet>
  <title>{seoTitle}</title>

  <meta name="description" content={seoDesc} />
  <meta name="keywords" content={`${finalData?.bid?.artworkName}, art auction, bidding, ${artist?.name}`} />

  {/* Canonical */}
  <link rel="canonical" href={seoUrl} />

  {/* Open Graph */}
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDesc} />
  <meta property="og:image" content={seoImg} />
  <meta property="og:url" content={seoUrl} />
  <meta property="og:type" content="product" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDesc} />
  <meta name="twitter:image" content={seoImg} />

  {/* JSON-LD Auction Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Auction",
      "name": finalData?.bid?.artworkName,
      "image": seoImg,
      "description": seoDesc,
      "url": seoUrl,
      "startDate": finalData?.bid?.bidStart,
      "endDate": finalData?.bid?.bidEnd,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": currentHighest,
        "availability": isBidEnded ? "https://schema.org/Discontinued" : "https://schema.org/InStock"
      },
      "seller": {
        "@type": "Person",
        "name": artist?.name || artist?.username
      }
    })}
  </script>
</Helmet>


      {/* BREADCRUMB */}
      <p className="text-sm text-gray-500">
        {finalData ? `${mainCategoryName !== "N/A" ? mainCategoryName : finalData.mainCategory} / ${categoryName !== "N/A" ? categoryName : finalData.category} / ${subCategoryName !== "N/A" ? subCategoryName : finalData.subCategory}` : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
        <div className="col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
            {/* IMAGE SECTION */}
            <div className="flex flex-col lg:flex-row-reverse col-span-5 gap-3 relative">
              <div className="relative w-full product-card">
                <img src={selectedImage} alt="Main" className="w-full h-[550px] object-contain product-img" />

                <button onClick={() => setShowPopup(true)} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#48372D] text-white text-sm px-3 py-1 rounded-2xl shadow">
                  👁️ View in Room
                </button>

                <button onClick={handleShare} className="absolute top-3 right-3 text-[#48372D] text-4xl">
                  <BsTelegram />
                </button>

                <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-2">
                  <button onClick={() => changeImage("prev")} className="text-[#48372D] text-4xl"><FaChevronCircleLeft /></button>
                  <button onClick={() => changeImage("next")} className="text-[#48372D] text-4xl"><FaChevronCircleRight /></button>
                </div>
              </div>

              {/* thumbnails */}
              <div className="flex lg:flex-col gap-3 overflow-auto lg:max-h-[550px] scrollbar-hide">
                {images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setSelectedImage(img)} className={`w-24 h-24 object-contain rounded-lg border-2 cursor-pointer ${selectedImage === img ? "border-[#48372D]" : "border-transparent"}`} />
                ))}
              </div>
            </div>

            {/* POPUP ROOM PREVIEW */}
            {showPopup && (
              <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[999]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full p-4">
                  <button onClick={() => setShowPopup(false)} className="absolute top-3 right-3 text-gray-700 text-xl font-bold">✕</button>

                  <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
                    <img src={selectedRoom} alt="room" className="w-full h-full object-contain" />

                    <div className="absolute bottom-[200px] inset-0 flex justify-center items-center">
                      <div className="relative">
                        <img src={selectedImage} alt="art" className="object-contain rounded-lg mb-3" style={{ width: `${artworkSize.width * 3}px`, height: `${artworkSize.height * 3}px` }} />
                        <div className="absolute -bottom-6 w-full text-center text-sm font-medium bg-[#ffffff] py-1 rounded-md">
                          {artworkSize.width} × {artworkSize.height} cm
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room selector */}
                  <div className="flex justify-center gap-3 mt-4">
                    {roomBackgrounds.map((room, i) => (
                      <img key={i} src={room} alt={`room-${i}`} onClick={() => setSelectedRoom(room)} className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedRoom === room ? "border-[#48372D]" : "border-transparent"}`} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT INFO */}
            <div className="col-span-5">
              <h1 className="text-3xl font-semibold leading-snug">{finalData.bid.artworkName}</h1>

              <div className="flex flex-wrap gap-2 text-xs mt-2">
                {categories.map((t, i) => <span key={i} className="bg-gray-200 px-2 py-1 rounded-md">#{t}</span>)}
              </div>

              <div className="flex items-center mt-3">
                <p className="font-bold text-lg flex items-center">
                  {artist?.username || `${artist?.name || ""} ${artist?.lastName || ""}`.trim() || "Unknown"}
                  {artist?.verified && <MdVerified className="ml-1 text-blue-600 w-4 h-4" />}
                  {/* badges from approved-with-badges endpoint */}
                  {productBadgeEntry?.badges?.map((img, idx) => (
                    <img key={idx} src={`${imageBaseURL}${img}`} className="w-5 h-5 rounded-full object-contain ml-1" />
                  ))}
                </p>
              </div>

              <hr className="my-2" />

              <p className="text-md">Starting Price: <strong>₹{finalData.bid.basePrice}</strong></p>
              <p className="text-md mt-2">Minimum Increment: ₹{minIncrement}</p>

              <p className="text-2xl font-bold text-[#48372D] mt-3">{isBidEnded ? "Final Bid" : "Current Highest Bid"}: ₹{currentHighest}</p>

              {/* <div className="items-center mt-4">
                <p className="text-lg font-semibold">Place Bid</p>
                <div className="flex mt-1 gap-2 overflow-auto scrollbar-hide sm:flex-wrap">
                  {[300, 500, 1000, 3000, 5000].map((x) => (
                    <p key={x} className="bg-[#48372D] text-white text-sm px-3 py-1 rounded-full flex items-center"><ImHammer2 className="mr-1" /> ₹{x}</p>
                  ))}
                </div>
              </div> */}
<div className="items-center mt-4">
  <p className="text-lg font-semibold">Place Bid</p>

  <div className="flex mt-1 gap-2 overflow-auto scrollbar-hide sm:flex-wrap">
    {[300, 500, 1000, 3000, 5000].map((increment) => {
      const dynamicValue = currentHighest + increment;

      return (
        <button
          key={increment}
          onClick={() => {
            if (isBidEnded) return toast.warn("This bid has ended.");
            setShowBidSidebar(true);      
            setManualBid(dynamicValue); 
          }}
           disabled={isBidEnded}
  className={`bg-[#48372D] text-white text-sm px-3 py-1 rounded-full flex
    items-center transition 
    ${isBidEnded ? "opacity-40 cursor-not-allowed" : "hover:bg-[#3a2d24]"}`}
        >
          <ImHammer2 className="mr-1" /> 
          ₹{dynamicValue}
        </button>
      );
    })}
  </div>
</div>

              <p className="text-orange-700 mt-4">Ending Soon!</p>
              <p className="mt-2 text-sm text-gray-600">Delivery in {deliveryText} after payment.</p>

              {/* icon blocks like product details */}
              {renderBadgeIcons()}
            </div>
          </div>

          {/* TABS */}
          <div className="mt-10">
            <div className="flex gap-8 text-[#48372D] font-medium text-lg border-b overflow-auto no-scrollbar">
              {["description", "details", "artist", "bid stream", "reviews"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-2 ${activeTab === t ? "border-b-4 border-[#48372D] font-semibold" : ""}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="py-6 text-gray-700">
              {activeTab === "description" && <p>{finalData.description || "No description available."}</p>}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <Section title="Artwork Specifications">
                    <Grid>
                      <Field label="Material" value={finalData.materials?.join(", ")} />
                      <Field label="Dimensions" value={finalData.dimensions?.width ? `${finalData.dimensions.width} × ${finalData.dimensions.height} × ${finalData.dimensions.depth} cm` : ""} />
                      <Field label="Weight" value={finalData.weight ? `${finalData.weight} g` : ""} />
                      <Field label="Medium" value={finalData.medium} />
                      <Field label="Framing" value={finalData.framing} />
                      <Field label="Edition" value={finalData.editionType} />
                    </Grid>
                  </Section>

                  <Section title="Pricing & Sales">
                    <Grid>
                      <Field label="Starting Price" value={`₹${finalData.bid.basePrice}`} />
                      <Field label="Reserve Price" value={finalData.bid.reservePrice ? `₹${finalData.bid.reservePrice}` : ""} />
                      <Field label="Final Price" value={finalData.finalPrice ? `₹${finalData.finalPrice}` : ""} />
                      <Field label="Selling Price" value={finalData.sellingPrice ? `₹${finalData.sellingPrice}` : ""} />
                      <Field label="Market Price" value={finalData.marketPrice ? `₹${finalData.marketPrice}` : ""} />
                    </Grid>
                  </Section>

                  <Section title="Shipping & Packaging">
                    <Grid>
                      <Field label="Estimated Delivery" value={finalData.estimatedDelivery ? `${finalData.estimatedDelivery} days` : ""} />
                      <Field label="Shipping Charges" value={finalData.shippingCharges ? `₹${finalData.shippingCharges}` : ""} />
                      <Field label="Handling Time" value={finalData.handlingTime} />
                      <Field label="Packaging Type" value={finalData.packagingType} />
                      <Field label="Insurance Coverage" value={finalData.insuranceCoverage ? "Yes" : "No"} />
                    </Grid>
                  </Section>

                  <Section title="Legal & Compliance">
                    <Grid>
                      <Field label="Ownership Confirmation" value={finalData.ownershipConfirmation ? "Yes" : "No"} />
                      <Field label="Copyright" value={finalData.copyrightRights} />
                      <Field label="COA Available" value={finalData.coaAvailable ? "Yes" : "No"} />
                      <Field label="Certificate File" value={finalData.certificateFile} />
                    </Grid>
                  </Section>

                  <Section title="Seller Address">
                    <Grid>
                      <Field label="Seller" value={artist?.username || `${artist?.name || ""} ${artist?.lastName || ""}`.trim()} />
                      <Field label="Seller Verified" value={artist?.verified ? "Yes" : "No"} />
                      <Field label="Seller Badges" value={productBadgeEntry?.badges || []} />
                    </Grid>
                  </Section>

                  {hasAnyValue({
                    originRegion: finalData.originRegion,
                    periodEra: finalData.periodEra,
                    antiqueCondition: finalData.antiqueCondition,
                    conservationStatus: finalData.conservationStatus,
                    restorationHistory: finalData.restorationHistory,
                    restorationDocumentation: finalData.restorationDocumentation,
                    provenanceHistory: finalData.provenanceHistory,
                    culturalSignificance: finalData.culturalSignificance,
                    appraisalDetails: finalData.appraisalDetails,
                    engravingMarkings: finalData.engravingMarkings,
                    patinaWear: finalData.patinaWear,
                    isHandmade: finalData.isHandmade,
                    originalReproduction: finalData.originalReproduction,
                    museumExhibitionHistory: finalData.museumExhibitionHistory,
                    maintenanceRequired: finalData.maintenanceRequired,
                    customEngravingAvailable: finalData.customEngravingAvailable,
                    certification: finalData.certification,
                  }) && (
                      <Section title="Antique & Vintage Details">
                        <Grid>
                          <Field label="Origin Region" value={finalData.originRegion} />
                          <Field label="Period / Era" value={finalData.periodEra} />
                          <Field label="Antique Condition" value={finalData.antiqueCondition} />
                          <Field label="Conservation Status" value={finalData.conservationStatus} />

                          <Field label="Provenance History" value={finalData.provenanceHistory} />
                          <Field label="Cultural Significance" value={finalData.culturalSignificance} />

                          <Field label="Appraisal Details" value={finalData.appraisalDetails} />
                          <Field label="Engravings / Markings" value={finalData.engravingMarkings} />

                          <Field label="Patina / Wear" value={finalData.patinaWear} />
                          <Field
                            label="Handmade (Antique Context)"
                            value={finalData.isHandmade ? "Yes" : "No"}
                          />

                          <Field
                            label="Original / Reproduction"
                            value={finalData.originalReproduction}
                          />

                          <Field
                            label="Museum Exhibition History"
                            value={finalData.museumExhibitionHistory}
                          />

                          <Field
                            label="Maintenance Required"
                            value={finalData.maintenanceRequired}
                          />
                          <Field
                            label="Custom Engraving Available"
                            value={finalData.customEngravingAvailable ? "Yes" : "No"}
                          />

                          <Field
                            label="Restoration Documentation"
                            value={finalData.restorationDocumentation}
                          />
                          <Field label="Certification" value={finalData.certification} />
                          <Field label="Restoration History" value={finalData.restorationHistory} />
                        </Grid>
                      </Section>
                    )}

                </div>
              )}

              {activeTab === "artist" && (
                <div>
                  <p className="font-semibold text-lg">Artist: {artist?.name || artist?.username || "Unknown"}</p>
                  <p className="mt-2">{artist?.bio || "Artist details not available."}</p>
                </div>
              )}

              {activeTab === "bid stream" && (
                <div className="space-y-4">
                  <div className="w-full rounded-lg">
                    <div className="overflow-y-auto scrollbar-hide max-h-64">
                      {/* {activities.map((activity, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-100 py-2 transition-all duration-200 cursor-pointer hover:bg-gray-50" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-gray-900">
                              <span className="font-semibold">{activity.name}</span> from <span>{activity.location}</span> <span className="text-gray-700">{activity.action}</span>
                            </p>
                          </div>
                          {activity.amount ? (hoveredIndex === index ? <p className="text-xs text-gray-500">{activity.time}</p> : <p className="text-sm font-semibold text-gray-900">{activity.amount}</p>) : <p className="text-xs text-gray-500">{activity.time}</p>}
                        </div>
                      ))} */}
                      {/* {liveBids.length === 0 ? (
  <p className="text-gray-500 text-sm">No bids yet.</p>
) : (
  liveBids.slice(0, 10).map((bid, index) => {
    const isUserHighest = index === 0 && bid.userId?._id === localStorage.getItem("userId");

    return (
      <div
        key={index}
        className={`flex justify-between items-center border-b py-2 
        ${isUserHighest ? "bg-yellow-100 font-semibold" : "hover:bg-gray-50"}`}
      >
        <p className="text-sm text-gray-900">
          <span className="font-semibold">
            {bid.userId?.username || bid.userId?.name || "User"}
          </span>{" "}
          placed
        </p>

        <p className="text-sm font-semibold text-gray-900">
          ₹{bid.amount}
        </p>
      </div>
    );
  })
)} */}
{liveBids.length === 0 ? (
  <p className="text-gray-500 text-sm">No bids yet.</p>
) : (
  liveBids.slice(0, 10).map((bid, index) => {
    const isUserHighest =
      index === 0 &&
      bid.userId?._id === localStorage.getItem("userId");

    return (
      <div
        key={index}
        className={`flex justify-between items-center border-b py-3 px-3
        ${isUserHighest ? "bg-yellow-100 font-semibold" : "hover:bg-gray-50"}`}
      >
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 font-semibold">
            {bid.userId?.username || `${bid.userId?.name || ""} ${bid.userId?.lastName || ""}`.trim() || "User"}
          </span>
          <span className="text-xs text-gray-500">
           {formatBidTime(bid)}
          </span>
        </div>

        <p className="text-sm font-bold text-gray-900">
          ₹{bid.amount}
        </p>
      </div>
    );
  })
)}


                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <p className="text-gray-500 text-sm">No reviews available for this artwork.</p>
                  ) : (
                    productReviews.map((review, idx) => (
                      <div key={idx} className="border p-4 rounded-lg shadow-sm bg-white">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-md">{review?.userId?.name || "Anonymous"}</p>
                          <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>

                        <p className="font-medium mt-1">{review.title}</p>
                        <p className="text-sm text-gray-700 mt-1">{review.description}</p>

                        {review.photos?.length > 0 && (
                          <div className="flex gap-3 mt-3">
                            {review.photos.map((img, i) => {
                              const full = resolveMediaUrl(img);
                              const dialogId = `review-${review._id}-img-${i}`;
                              return (
                                <div key={i}>
                                  <img
                                    src={full}
                                    className="w-20 h-20 rounded-lg object-cover border cursor-pointer"
                                    alt="review"
                                    onClick={() =>
                                      document.getElementById(dialogId)?.showModal?.()
                                    }
                                  />
                                  <dialog
                                    id={dialogId}
                                    className="rounded-lg p-0 bg-transparent"
                                  >
                                    <div
                                      className="fixed inset-0 flex justify-center items-center"
                                      onClick={() =>
                                        document.getElementById(dialogId)?.close?.()
                                      }
                                    >
                                      <img
                                        src={full}
                                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
                                        alt="review enlarged"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </dialog>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
<div className="col-span-2 hidden md:block">
  <div className="sticky top-10 w-full max-w-sm bg-white rounded-2xl shadow-lg border border-dark px-3 py-3">

    <p className="text-3xl font-bold">Bidding Rules</p>

    {/* ICON CARDS */}
    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-2">
      <div className="absolute left-4 w-12 h-12 flex items-center justify-center">
        <img src='/herosectionimg/price.png' alt="price" className="w-full h-9 object-contain" />
      </div>
      <div className="ml-10">
        <p className="font-semibold text-md">Starting Price:</p>
        <p className="text-xs text-gray-800">₹{finalData.bid.basePrice}</p>
      </div>
    </div>

    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
      <div className="absolute left-4 w-12 h-12 flex items-center justify-center">
        <img src='/herosectionimg/increment.png' alt="increment" className="w-full h-9 object-contain" />
      </div>
      <div className="ml-10">
        <p className="font-semibold text-md">Bid Increment:</p>
        <p className="text-xs text-gray-800">₹{minIncrement}</p>
      </div>
    </div>

    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
      <div className="absolute left-4 w-12 h-12 flex items-center justify-center">
        <img src='/herosectionimg/duration.png' alt="duration" className="w-full h-9 object-contain" />
      </div>
      <div className="ml-10">
        <p className="font-semibold text-md">Auction Ends In:</p>
        <p className="text-xs text-gray-800">{timeLeft}</p>
      </div>
    </div>

    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
      <div className="absolute left-4 w-12 h-12 flex items-center justify-center">
        <img src='/herosectionimg/winner.png' alt="winner" className="w-full h-9 object-contain" />
      </div>
      <div className="ml-10">
        {/* <p className="font-semibold text-md">Winner:</p>
        <p className="text-xs text-gray-800">Highest bid at closing wins.</p> */}
        <p className="font-semibold text-md">Winner:</p>

{!isBidEnded ? (
  <p className="text-xs text-gray-800">Highest bid at closing wins.</p>
) : winner ? (
  <p className="text-xs text-green-700 font-semibold">
    {winner.name} — ₹{winner.amount}
  </p>
) : (
  <p className="text-xs text-gray-600">No bids placed.</p>
)}

      </div>
    </div>

    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
      <div className="absolute left-4 w-12 h-12 flex items-center justify-center">
        <img src='/herosectionimg/cancellations.png' alt="cancellations" className="w-full h-9 object-contain" />
      </div>
      <div className="ml-10">
        <p className="font-semibold text-md">No Cancellations:</p>
        <p className="text-xs text-gray-800">All bids are final.</p>
      </div>
    </div>

    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
      <div className="absolute left-4 w-12 h-12 flex items-center justify-center">
        <img src='/herosectionimg/deadline.png' alt="deadline" className="w-full h-9 object-contain" />
      </div>
      <div className="ml-10">
        <p className="font-semibold text-md">Payment Deadline:</p>
        <p className="text-xs text-gray-800">Pay within 48 hours.</p>
      </div>
    </div>

<div className="mt-2 flex flex-col gap-2">
    {/* Countdown pill */}
    <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-lg rounded-full text-dark py-2 font-semibold add-cart">
      {isLastDay ? `Ends in ${timeLeft}` : `${timeLeft}`}
    </button>

    {/* PLACE BID */}
     {/* <div className="flex justify-center items-center mt-2">
      <AnimatePresence mode="wait">
        {!showBidSidebar ? (
          <motion.button
            key="place-bid"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowBidSidebar(true)}
            className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 rounded-full font-semibold"
          >
            Place Your Bid <ImHammer2 />
          </motion.button>
        ) : (
          <motion.div
            key="bid-input"
            initial={{ width: "150px", opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center justify-between border border-dark rounded-full pl-4 py-2 w-full"
          >
            <span className="text-lg font-semibold text-black">₹ {currentHighest}</span>
            <div className="flex items-center justify-center w-16 h-10 rounded-full border border-dark">
              <ImHammer2 className="text-black text-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
   */}
 
<div className="flex justify-center items-center mt-2 w-full">
  <AnimatePresence mode="wait">
    {!showBidSidebar ? (
//       <motion.button
//         key="place-bid"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.8, opacity: 0 }}
//         transition={{ duration: 0.3 }}
//         onClick={() => setShowBidSidebar(true)}
//         className={`flex items-center justify-center gap-2 w-full py-2 rounded-full font-semibold
//   ${isBidEnded ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-red-500 text-white"}`}
// disabled={isBidEnded}

//       >
//         Place Your Bid <ImHammer2 />
//       </motion.button>
<motion.button
  key="place-bid"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.8, opacity: 0 }}
  transition={{ duration: 0.3 }}
  onClick={() => {
    if (isBidEnded) {
      toast.warn("This bid has ended.");
      return;
    }
    setShowBidSidebar(true);
  }}
  className={`flex items-center justify-center gap-2 w-full py-2 rounded-full font-semibold
    ${isBidEnded 
      ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-60" 
      : "bg-red-500 text-white"
    }
  `}
>
  Place Your Bid <ImHammer2 />
</motion.button>

    ) : (
//       <motion.div
//         key="bid-input"
//         initial={{ width: "150px", opacity: 0 }}
//         animate={{ width: "100%", opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//         className="flex items-center border border-dark rounded-full px-4 py-2 w-full bg-white"
//       >
//  <span className="text-lg font-semibold text-black mr-1">₹</span>
        
        // <input
        //   type="number"
        //   value={manualBid}
        //   onChange={(e) => setManualBid(e.target.value)}
        //   placeholder={`${currentHighest + minIncrement}`}
        //   className="
        //     w-[100%]        
        //     text-lg
        //     font-semibold
        //     text-black
        //     bg-transparent
        //     outline-none
        //     appearance-none
        //   "
        // />
   
      //   <button
      //     onClick={() => {
      //       const amt = Number(manualBid);
      //       if (!amt) return alert('Enter a valid amount');
      //       if (amt < currentHighest + minIncrement)
      //         return alert(`Bid must be at least ₹${currentHighest + minIncrement}`);

      //       setBidToConfirm(amt);
      //       setConfirmPopup(true);
      //     }}
      //     className="
      //       flex 
      //       items-center 
      //       justify-center
      //       w-12              
      //       h-10 
      //       ml-auto            
      //       rounded-full 
      //       border 
      //       border-dark 
      //       bg-[#F5F5F5]
      //     "
      //   >
      //     <ImHammer2 className="text-black text-lg" />
      //   </button>

      // </motion.div>
      <motion.div
  key="bid-input"
  initial={{ width: "150px", opacity: 0 }}
  animate={{ width: "100%", opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
  className="flex items-center border border-dark rounded-full px-4 py-2 w-full bg-white"
  id="bid-input-box"          
>
  <span className="text-lg font-semibold text-black mr-1">₹</span>

  <input
    type="number"
    value={manualBid}
    onChange={(e) => setManualBid(e.target.value)}
    placeholder={`${currentHighest + minIncrement}`}
    className="w-[100%] text-lg font-semibold text-black bg-transparent outline-none"
  />

  <button
    onClick={() => {
  if (isBidEnded) return toast.warn("This bid has ended.");

  const amt = Number(manualBid);
  if (!amt) return toast.error("Enter a valid amount");
  if (amt < currentHighest + minIncrement)
    return toast.error(`Bid must be at least ₹${currentHighest + minIncrement}`);

  setBidToConfirm(amt);
  setConfirmPopup(true);
}}

    className="flex items-center justify-center w-12 h-10 ml-auto rounded-full border border-dark bg-[#F5F5F5]"
  >
    <ImHammer2 className="text-black text-lg" />
  </button>
</motion.div>

    )}
  </AnimatePresence>


  {/* Confirmation popup */}
  {confirmPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl text-center">
        <h2 className="text-lg font-semibold mb-2">Confirm Your Bid</h2>
        <p className="text-sm text-gray-700">You're placing a bid of:</p>
        <p className="text-2xl font-bold mt-3 text-[#48372D]">₹{bidToConfirm}</p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setConfirmPopup(false)}
            className="flex-1 py-2 rounded-full border border-gray-400 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={() => handleBidSubmit(bidToConfirm)}
            className="flex-1 py-2 rounded-full bg-[#48372D] text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}


</div>

    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default BidDetails;
