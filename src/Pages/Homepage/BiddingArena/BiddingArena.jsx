import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import BiddingArenaSkeleton from "../../../Component/Skeleton/BiddingArenaSkeleton";
import "../../store/products/product.css";

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
    const now = new Date().getTime();
    const endTime = new Date(end).getTime();
    const diff = endTime - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days} Days`;
    return `${hours} Hrs ${mins} Mins`;
  };

  /* ---------------- FETCH HOME + BIDS ---------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;

        const [arenaRes, bidRes, badgeRes] = await Promise.all([
          getAPI(`/api/homepage-sections/bidding-arena/${homepage._id}`),
          getAPI("/api/bidding/products/all", {}, true, false),
          getAPI(`/api/products/approved-with-badges`, {}, true, false),
        ]);

        setData(arenaRes.data.data);

        const list = Array.isArray(bidRes?.data) ? bidRes.data : [];
        const badgeData = badgeRes?.data?.data || [];

        const finalList = list
          .filter((item) => item?.product)
          .map((item) => {
            const p = item.product;
            const realProductId = p?._id || p?.productId || p?.product || null;
            const match = realProductId ? badgeData.find((b) => b && b._id === realProductId) : null;

            return {
              ...item,
              product: {
                ...p,
                seller: match?.seller || p?.seller || null,
                badges: match?.badges || p?.badges || [],
              },
            };
          });

        const latest8 = finalList
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
    }, 10000);

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

      <p className="text-xs md:text-lg font-medium mb-6">{data.description}</p>

      {/* BID GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {products.map((item, index) => {
          const status = getFinalStatus(item);
          const timeRemaining = getTimeRemaining(item.bidEnd);
          const isEnded = timeRemaining === "Ended";
          const currentHighestBid = highestLiveBid[item._id] || item.basePrice;

          return (
            <div
              key={item._id}
              className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => {
                const name =
                  item?.artworkName ||
                  item?.product?.productName ||
                  item?.product?.title ||
                  "artwork";
                const slug = slugify(name);
                navigate(`/bid-details/${slug}/${item._id}`);
              }}
            >
              {/* Image Container */}
              <div className="relative aspect-[5/5] overflow-hidden bg-[#F8F9FA]">
                <img
                  src={`${imageBaseURL}${item.product?.mainImage}`}
                  alt={item.artworkName}
                  className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${isEnded ? 'grayscale-[0.5] blur-[2px]' : ''}`}
                />

                {/* Bid Ended Overlay */}
                {isEnded && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                    <div className="bg-white px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
                      <span className="text-red-600 font-black text-xl uppercase tracking-wider">Bid Ended</span>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <div className={`backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20 
                    ${status === 'Upcoming' ? 'bg-blue-500' : status === 'Ending Soon' ? 'bg-orange-500' : status === 'Ended' ? 'bg-gray-500' : 'bg-green-500'}`}>
                    {status}
                  </div>
                </div>

                {/* Bell Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-[#6F4D34] transition-all transform hover:scale-110 z-10"
                >
                  <Bell size={18} className="text-gray-900" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-3 gap-3">
                {/* Artist Info */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
                    <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
                      {item.product?.userId?.name || "Independent Artist"}
                    </span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {item.product?.badges?.map((img, idx) => (
                      <div key={idx}>
                        <img src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full border border-white" alt="Badge" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">
                  {item.artworkName}
                </h3>

                {/* Bidding Info */}
                <div className="flex flex-col gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Starting Price</span>
                    <span className="text-sm font-bold text-gray-900">₹{item.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#6F4D34] uppercase tracking-tighter">Highest Bid</span>
                    <span className="text-lg font-black text-[#6F4D34]">₹{currentHighestBid.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Time Left</span>
                    <span className={`text-lg font-black tracking-tight ${status === 'Ending Soon' ? 'text-orange-500' : 'text-gray-900'}`}>
                      {timeRemaining}
                    </span>
                  </div>

                  <button
                    disabled={isEnded}
                    className={`col-span-3 h-[48px] rounded-2xl font-black text-[11px] hover:!text-[#6F4D34] hover:!bg-[#ffffff] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm border border-gray-100 transform active:scale-95 flex items-center justify-center
                      ${isEnded 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#6F4D34] text-white hover:bg-white hover:text-[#6F4D34]"}`}
                  >
                    {status === 'Upcoming' ? 'Remind Me' : isEnded ? 'Ended' : 'Place Bid'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BiddingArena;
