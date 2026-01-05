// import { MdVerified } from "react-icons/md";
// import { Bell } from "lucide-react";
// const BiddingArena = () => {
//   return (
//       <div className="max-w-[1440px] mx-auto py-4 px-3">
//         <div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//             {/* title */}
//             <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//               Bidding Arena
//             </h1>
//             <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//               Explore More Products
//             </button>
//           </div>

//           <hr className="my-3 border-dark" />

//           {/* Subtitle */}
//           <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//             At ArtSays, we make it simple for you to collaborate directly with
//             talented artists and bring your creative vision to life.
//           </p>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-4">
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 bg-red-500 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Upcoming
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1 mt-2">
//                   <br />
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Starting Price: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-xs text-dark py-2 font-semibold add-cart">
//                     2 Day Left
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Remind Me
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Hot Deal
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Ending Soon!
//                 </span>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1">
//                   <span className="text-black-500 font-semibold text-md sm:text-md">
//                     Starting Price: ₹5,000
//                   </span>
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Highest Bid: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
//                     2 Hrs 46 Mins
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Place Your Bid
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Ending Soon
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Ending Soon!
//                 </span>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1">
//                   <span className="text-black-500 font-semibold text-md sm:text-md">
//                     Starting Price: ₹5,000
//                   </span>
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Highest Bid: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
//                     2 Hrs 46 Mins
//                   </button>
//                   {/* Disable button bcoz bid ended */}
//                   <button className="flex-1 bg-gray-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Place Your Bid
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 bg-red-500 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Upcoming
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1 mt-2">
//                   <br />
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Starting Price: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-xs text-dark py-2 font-semibold add-cart">
//                     2 Day Left
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Remind Me
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Hot Deal
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Ending Soon!
//                 </span>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1">
//                   <span className="text-black-500 font-semibold text-md sm:text-md">
//                     Starting Price: ₹5,000
//                   </span>
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Highest Bid: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
//                     2 Hrs 46 Mins
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Place Your Bid
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Ending Soon
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Ending Soon!
//                 </span>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1">
//                   <span className="text-black-500 font-semibold text-md sm:text-md">
//                     Starting Price: ₹5,000
//                   </span>
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Highest Bid: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
//                     2 Hrs 46 Mins
//                   </button>
//                   {/* Disable button bcoz bid ended */}
//                   <button className="flex-1 bg-gray-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Place Your Bid
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 bg-red-500 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Upcoming
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1 mt-2">
//                   <br />
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Starting Price: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-xs text-dark py-2 font-semibold add-cart">
//                     2 Day Left
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Remind Me
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="mx-auto product-card">
//               {/* Premium Label */}
//               <div className="relative p-img">
//                 <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
//                   Hot Deal
//                 </span>

//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
//                 />

//                 {/* Bell Icon */}
//                 <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
//                   <Bell className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//               {/* Product Info */}
//               <div className="p-3 product-info">
//                 <span className="text-orange-500 font-semibold text-sm">
//                   Ending Soon!
//                 </span>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
//                   Beauty of Joseon Mandala Art By SL
//                 </h2>
//                 <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
//                   Dhiraj Designs
//                   <span className="ml-1 text-blue-600">
//                     <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
//                   </span>
//                 </p>

//                 {/* Rating */}
//                 <div className="grid items-center gap-1">
//                   <span className="text-black-500 font-semibold text-md sm:text-md">
//                     Starting Price: ₹5,000
//                   </span>
//                   <span className="text-red-500 font-semibold text-md sm:text-lg">
//                     Highest Bid: ₹5,000
//                   </span>
//                 </div>
//               </div>

//               <div className="p-3 product-button d-none d-md-block">
//                 {/* Buttons */}
//                 <div className="flex justify-between gap-3">
//                   <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
//                     2 Hrs 46 Mins
//                   </button>
//                   <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
//                     Place Your Bid
//                   </button>
//                 </div>
//               </div>
//             </div>
//         </div>
//       </div>
//   );
// };
// export default BiddingArena;





import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import BiddingArenaSkeleton from "../../../Component/Skeleton/BiddingArenaSkeleton";

const BiddingArena = () => {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [highestLiveBid, setHighestLiveBid] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  /* ---------------- STATUS HELPERS ---------------- */
  const getFinalStatus = (item) => {
    const now = Date.now();
    const start = new Date(item.bidStart).getTime();
    const end = new Date(item.bidEnd).getTime();

    if (now >= end) return "Ended";
    if (now < start) return "Upcoming";

    const minsLeft = (end - now) / 60000;
    if (minsLeft <= 1440) return "Ending Soon";

    return "Hot Deal";
  };

  const getTimeRemaining = (end) => {
    const diff = new Date(end).getTime() - Date.now();
    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    return days > 0 ? `${days} Days Left` : `${hours} Hrs ${mins} Mins`;
  };

  /* ---------------- FETCH HOME + BIDS ---------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;

        const arenaRes = await getAPI(
          `/api/homepage-sections/bidding-arena/${homepage._id}`
        );
        setData(arenaRes.data.data);

        const bidRes = await getAPI("/api/bidding/products/all", {}, true, false);
        const list = Array.isArray(bidRes?.data) ? bidRes.data : [];

        const latest8 = list
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);

        setProducts(latest8);
        fetchLiveHighestBids(latest8);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const slugify = (text = "") =>
    text
      ?.toString()
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/(^-|-$)+/g, "") || "artwork";

  /* ---------------- LIVE BID POLLING ---------------- */
  const fetchLiveHighestBids = async (list) => {
    const map = {};

    await Promise.all(
      list.map(async (item) => {
        const res = await getAPI(`/api/bidding/all/${item._id}`, {}, true, false)
          .catch(() => null);

        const bids = res?.data?.bids || [];
        map[item._id] =
          bids.length > 0
            ? Math.max(...bids.map((b) => b.amount))
            : item.basePrice;
      })
    );

    setHighestLiveBid(map);
  };

  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      fetchLiveHighestBids(products);
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

  /* ---------------- RENDER ---------------- */
  if (loading) return <BiddingArenaSkeleton />;
  if (!data) return null;

  return (
    <div className="max-w-[1440px] mx-auto py-4 px-3">
      {/* HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
          {data.heading}
        </h1>

        {data.buttonName && (
          <a
            href={data.buttonLink || "#"}
            className="hidden md:flex items-center justify-center bg-red-500 text-white font-semibold rounded-full px-6 py-2"
          >
            {data.buttonName}
          </a>
        )}
      </div>

      <hr className="my-3 border-dark" />

      <p className="text-xs md:text-lg font-medium">{data.description}</p>

      {/* BID GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {products.map((item) => {
          const status = getFinalStatus(item);
          const isEnded = status === "Ended";

          return (
            <div
              key={item._id}
              // onClick={() => navigate(`/bid-details/${item.product?._id || item.productId || item._id}`)}
              onClick={() => {
                const name =
                  item?.artworkName ||
                  item?.product?.productName ||
                  item?.product?.title ||
                  "artwork";

                const slug = slugify(name);

                navigate(`/bid-details/${slug}/${item._id}`);
              }}
              className="rounded-2xl shadow bg-white cursor-pointer overflow-hidden"
            >
                {/* IMAGE + STATUS */}
                <div className="relative">
                  <span
                    className={`absolute top-3 left-3 text-white text-xs px-2 py-0.5 rounded-full
                      ${status === "Upcoming"
                        ? "bg-red-500"
                        : status === "Ended"
                          ? "bg-gray-500"
                          : "bg-dark"
                      }`}
                  >
                    {status}
                  </span>

                  <div className="h-40 sm:h-64 bg-gray-100 flex justify-center items-center relative">
                    <img
                      src={`${imageBaseURL}${item.product?.mainImage}`}
                      alt={item.artworkName}
                      className={`h-full object-contain transition-all duration-300 ${isEnded ? "grayscale blur-[2px]" : ""}`}
                    />

                    {isEnded && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <div className="bg-white/90 px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
                          <span className="text-red-600 font-black text-xl uppercase tracking-wider">
                            Bid Ended
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 right-3 bg-dark p-2 rounded-full"
                  >
                    <Bell className="w-4 h-4 text-white" />
                  </button>
                </div>

              {/* INFO */}
              <div className="p-3">
                <h2 className="font-semibold text-dark text-sm">
                  {item.artworkName}
                </h2>

                <p className="text-xs text-gray-600">
                  {item.product?.seller?.name || "Unknown"}
                </p>

                <div className="mt-1">
                  <span className="text-red-500 font-semibold text-sm">
                    Starting: ₹{item.basePrice}
                  </span>

                  {status !== "Upcoming" && (
                    <span className="block text-green-600 font-semibold text-sm">
                      Highest: ₹{highestLiveBid[item._id] || item.basePrice}
                    </span>
                  )}
                </div>
              </div>

              {/* ACTION */}
              <div className="p-3 flex gap-2">
                <button className="flex-1 border border-dark rounded-full text-xs py-2">
                  {getTimeRemaining(item.bidEnd)}
                </button>

                <button
                  disabled={isEnded}
                  className={`flex-1 rounded-full text-xs py-2 text-white font-semibold
                    ${isEnded
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500"
                    }`}
                >
                  {isEnded ? "Closed" : status === "Upcoming" ? "Remind Me" : "Place Bid"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BiddingArena;
