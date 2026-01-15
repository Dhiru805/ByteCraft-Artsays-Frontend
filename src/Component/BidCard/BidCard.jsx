import React, { useState, useEffect } from "react";
import { MdVerified } from "react-icons/md";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { Bell } from "lucide-react";
import getAPI from "../../api/getAPI";
import { useNavigate } from "react-router-dom";

const BidGrid = ({ overrideProducts = null }) => {
  const [products, setProducts] = useState([]);
  const [highestLiveBid, setHighestLiveBid] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  const sortedList = [...(overrideProducts || products)].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = sortedList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedList.length / itemsPerPage);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(p => p - 1);
  const goToPage = (page) => setCurrentPage(page);

  const fetchProducts = async () => {
    try {
      const [bidRes, badgeRes] = await Promise.all([
        getAPI("/api/bidding/products/all", {}, true, false),
        getAPI("/api/products/approved-with-badges", {}, true, false),
      ]);

      const list = Array.isArray(bidRes?.data) ? bidRes.data : [];
      const badgeData = badgeRes?.data?.data || [];

      const withBadges = list.map((item) => {
        const p = item.product;
        const realId = p._id || p.productId || p.product;

        const match = badgeData.find((b) => b._id === realId);

        return {
          ...item,
          product: {
            ...p,
            seller: match?.seller || null,
            badges: match?.badges || [],
          },
        };
      });

      const sorted = withBadges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setProducts(sorted);
      await fetchLiveHighestBids(sorted);
    } catch (err) {
      console.error("Error fetching bid products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchLiveHighestBids = async (list) => {
    try {
      const highestMap = {};

      await Promise.all(
        list.map(async (item) => {
          const bidId = item._id;

          const res = await getAPI(`/api/bidding/all/${bidId}`, {}, true, false)
            .catch(() => null);

          const allBids = res?.data?.bids || [];

          const highestAmount =
            allBids.length > 0
              ? Math.max(...allBids.map((b) => b.amount))
              : item.basePrice;

          highestMap[bidId] = highestAmount;
        })
      );

      setHighestLiveBid(highestMap);
    } catch (err) {
      console.log("Live bids error:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveHighestBids(products);
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

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
    const now = Date.now();
    const endTime = new Date(end).getTime();
    const diff = endTime - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    if (days > 0) return `${days} Days Left`;
    return `${hours} Hrs ${mins} Mins`;
  };

  return (
    <main className="md:col-span-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {currentProducts.map((item) => {
          const status = getFinalStatus(item);
          const timeRemaining = getTimeRemaining(item.bidEnd);
          const isEnded = status === "Ended";

          let buttonText = "Place Your Bid";
          if (status === "Upcoming") buttonText = "Remind Me";
          if (isEnded) buttonText = "Closed";

          return (
            <div
              key={item._id}
              onClick={() => navigate(`/bid-details/${item._id}`)}
              className="rounded-2xl shadow-md overflow-hidden cursor-pointer bg-white"
            >
              {/* STATUS BADGE */}
              <div className="relative p-img">
                <span
                  className={`absolute top-3 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow
                  ${status === "Upcoming" ? "bg-red-500" : ""}
                  ${status === "Hot Deal" ? "bg-dark" : ""}
                  ${status === "Ending Soon" ? "bg-dark" : ""}
                  ${status === "Ended" ? "bg-gray-500" : ""}`}
                >
                  {status}
                </span>

                {/* IMAGE */}
                <div className="w-full h-40 sm:h-64 bg-gray-100 flex items-center justify-center rounded-t-2xl overflow-hidden">
                  <img
                    src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.product?.mainImage}`}
                    alt={item.artworkName}
                    className="h-full object-contain"
                  />
                </div>

                {/* BELL ICON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute bottom-3 right-3 bg-dark p-2 rounded-full shadow"
                >
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* CARD INFO */}
              <div className="p-3">
                {status === "Upcoming" && (
                  <p className="text-gray-500 text-xs">• Upcoming Auction</p>
                )}

                <h2 className="text-base font-semibold text-dark mt-1">
                  {item.artworkName}
                </h2>

                {/* SELLER */}
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-gray-700 text-xs font-medium">
                    {item.product?.seller?.name || "Unknown"}{" "}
                    {item.product?.seller?.lastName || ""}
                  </p>

                  {item.product?.badges?.map((img, i) => (
                    <img
                      key={i}
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${img}`}
                      className="w-5 h-5 rounded-full"
                      alt=""
                    />
                  ))}
                </div>

                {/* PRICES */}
                <div className="grid mt-1">
                  <span className="text-red-500 font-semibold">
                    Starting Price: ₹{item.basePrice}
                  </span>

                  {status !== "Upcoming" && (
                    <span className="text-green-600 font-semibold">
                      Highest Bid: ₹{highestLiveBid[item._id] || item.basePrice}
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="p-3">
                <div className="flex gap-2">
                  <button className="flex-1 border border-dark rounded-full py-2 text-xs font-semibold">
                    {timeRemaining}
                  </button>

                  <button
                    disabled={isEnded}
                    className={`flex-1 py-2 rounded-full font-semibold text-white
                      ${isEnded ? "bg-gray-500 cursor-not-allowed" : "bg-red-500"}`}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-2 border border-dark px-3 py-2 rounded">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 flex items-center ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"
            }`}
          >
            <FiChevronLeft />
            <span className="ml-1">Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 rounded ${
                currentPage === p
                  ? "border border-dark text-dark"
                  : "hover:text-red-500"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 flex items-center ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-red-500"
            }`}
          >
            <span className="mr-1">Next</span>
            <FiChevronRight />
          </button>
        </nav>
      </div>
    </main>
  );
};

export default BidGrid;
