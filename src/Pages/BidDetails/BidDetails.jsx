import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { Star, Heart, ChevronLeft, ChevronRight, Share2, Eye, Box, Ruler, Award, ShieldCheck, Truck, MessageCircle, FileText, Download, ExternalLink } from "lucide-react";
import { HiMiniPercentBadge } from "react-icons/hi2";
import { ImHammer2 } from "react-icons/im";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import deleteAPI from "../../api/deleteAPI";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";
import { getImageUrl } from '../../utils/getImageUrl';


const resolveMediaUrl = (path) => {
  if (!path || typeof path !== "string") return "/images/placeholder.jpg";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalized = path.replace(/\\/g, "/");
  const leadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  const base = getImageUrl.endsWith("/") ? getImageUrl.slice(0, -1) : getImageUrl;
  return `${base}${leadingSlash}`;
};

const offersData = [
  { title: "Bidding Rule", description: "All bids are final and cannot be cancelled once placed.", offers: "Policy" },
  { title: "Payment", description: "Winning bidders must complete payment within 48 hours.", offers: "Timeline" },
  { title: "Shipping", description: "Insured express shipping worldwide for all auction wins.", offers: "Logistics" },
  { title: "Authenticity", description: "Every artwork comes with a verified Certificate of Authenticity.", offers: "Trust" },
];

const BidDetails = () => {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const { userId: authUserId, userType } = useAuth();
  const userId = authUserId || localStorage.getItem("userId");

  const [bidData, setBidData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categoryData, setCategoryData] = useState({ mainCategories: [], categories: [], subCategories: [] });
  const [activeTab, setActiveTab] = useState("description");
  const [offerIndex, setOfferIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});
  const [badgesData, setBadgesData] = useState([]);
  const [liveBids, setLiveBids] = useState([]);
  const [userBid, setUserBid] = useState(null);
  const [isBidEnded, setIsBidEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isLastDay, setIsLastDay] = useState(false);
  const [showBidSidebar, setShowBidSidebar] = useState(false);
  const [manualBid, setManualBid] = useState("");
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState(null);

  const minIncrement = 300;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleWishlist = async (productId, e) => {
    if (e) e.stopPropagation();
    if (!ensureBuyer()) return;

    const isLiked = likedProducts[productId];

    try {
      if (isLiked) {
        await deleteAPI("/api/wishlist/remove", { params: { userId, productId } });
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

  const navigateToArtistProfile = (artist) => {
    if (!artist) return;
    const profileSlug = artist.username || `${artist.name}_${artist.lastName}_${artist._id}`;
    navigate(`/artsays-community/profile/${profileSlug}`, { state: { userId: artist._id } });
  };

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature. Register as a Buyer to continue.");
      return false;
    }
    return true;
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

        const productId = bid.product && (bid.product._id || bid.product.productId || bid.product);

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

        if (matched) {
          const gallery = [
            matched.mainImage ? resolveMediaUrl(matched.mainImage) : "/herosectionimg/placeholder.png",
            ...(matched.otherImages || []).map((img) => resolveMediaUrl(img)),
          ];
          setImages(gallery);
        }

        setBadgesData(badgeRes?.data?.data || []);
        const reviewPayload = reviewsRes?.data?.reviews || reviewsRes?.data?.data || [];
        setReviews(Array.isArray(reviewPayload) ? reviewPayload : []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching bid/product data:", err);
        setLoading(false);
      }
    };

    if (bidId) fetchBidProduct();
  }, [bidId]);

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

  const mainCategoryName = useMemo(() =>
    categoryData.mainCategories.find((c) => c && String(c._id) === String(finalData?.mainCategory))?.mainCategoryName || "N/A"
    , [finalData, categoryData]);

  const categoryName = useMemo(() =>
    categoryData.categories.find((c) => c && String(c._id) === String(finalData?.category))?.categoryName || "N/A"
    , [finalData, categoryData]);

  const subCategoryName = useMemo(() =>
    categoryData.subCategories.find((c) => c && String(c._id) === String(finalData?.subCategory))?.subCategoryName || "N/A"
    , [finalData, categoryData]);

  const productReviews = useMemo(() => {
    if (!finalData || !reviews || reviews.length === 0) return [];
    const currentProductId = finalData._id?.toString() || finalData._id;
    const currentProductName = (finalData.productName || finalData.bid?.artworkName || "").trim().toLowerCase();

    return reviews.filter((review) => {
      const reviewProductId = review.productId;
      if (!reviewProductId) return false;

      const reviewProductIdStr = typeof reviewProductId === "object"
        ? reviewProductId._id?.toString() || reviewProductId.toString()
        : reviewProductId.toString();

      if (reviewProductIdStr === currentProductId) return true;

      const buyerRequest = typeof reviewProductId === "object" ? reviewProductId : null;
      if (buyerRequest && buyerRequest.ProductName) {
        if (buyerRequest.ProductName.trim().toLowerCase() === currentProductName) return true;
      }
      if (review.productNameSnapshot && review.productNameSnapshot.trim().toLowerCase() === currentProductName) return true;
      return false;
    }).sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }, [finalData, reviews]);

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
    if (!finalData?.bid?.biddingId) return;
    const bId = finalData.bid.biddingId;
    const fetchBids = async () => {
      try {
        const [allBidsRes, userBidRes] = await Promise.all([
          getAPI(`/api/bidding/all/${bId}`, {}, true, false),
          getAPI(`/api/bidding/user/${bId}/${userId}`, {}, true, false),
        ]);
        setLiveBids(allBidsRes?.data?.bids || []);
        setUserBid(userBidRes?.data?.bid || null);
      } catch (err) {
        console.log("Bid stream error:", err);
      }
    };
    fetchBids();
    const interval = setInterval(fetchBids, 3000);
    return () => clearInterval(interval);
  }, [finalData, userId]);

  const currentHighest = useMemo(() => {
    return liveBids.length > 0 ? liveBids[0].amount : (finalData?.bid?.basePrice || 0);
  }, [liveBids, finalData]);

  const winner = useMemo(() => {
    if (!isBidEnded || liveBids.length === 0) return null;
    const top = liveBids[0];
    return {
      amount: top.amount,
      userId: top.userId?._id,
      name: top.userId?.username || `${top.userId?.name || ""} ${top.userId?.lastName || ""}`.trim() || "User",
    };
  }, [isBidEnded, liveBids]);

  useEffect(() => {
    if (!isBidEnded || !winner || !finalData) return;
    const loggedInUser = localStorage.getItem("userId");
    if (!loggedInUser || localStorage.getItem(`won_${finalData._id}`)) return;
    if (String(winner.userId) !== String(loggedInUser)) return;

    localStorage.setItem(`won_${finalData._id}`, "true");
    toast.success(`Congratulations! You won ${finalData.bid.artworkName} at ₹${winner.amount}. Added to cart.`, { autoClose: 4000 });
    postAPI(`/api/cart/${loggedInUser}/add-won-bid`, {
      userId: loggedInUser,
      productId: finalData._id,
      bidId: finalData.bid.biddingId,
      amount: winner.amount,
    }).catch((err) => console.error("Add-to-cart error:", err));
  }, [isBidEnded, winner, finalData]);

  const handleBidSubmit = async (amount) => {
    try {
      setConfirmPopup(false);
      const res = await postAPI(`/api/bidding/place-bid`, { bidId: finalData.bid.biddingId, userId, amount });
      if (res?.data?.success) {
        toast.success("Bid submitted successfully!");
        setManualBid("");
        setShowBidSidebar(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place bid!");
    }
  };

  const formatBidTime = (bid) => {
    const ts = bid.updatedAt || bid.createdAt;
    if (!ts) return "";
    const date = new Date(ts);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const productBadgeEntry = useMemo(() => {
    if (!finalData || !badgesData) return null;
    return badgesData.find((b) => String(b._id) === String(finalData._id)) || null;
  }, [finalData, badgesData]);

  if (loading) return <ProductDetailsSkeleton />;
  if (!finalData) return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Product not found.</div>;

  const seoTitle = `${finalData?.bid?.artworkName} | Live Art Auction`;
  const seoDesc = finalData?.description?.substring(0, 150) || `Bid on ${finalData?.bid?.artworkName}.`;
  const seoImg = images[0] || "/default-auction.jpg";
  const seoUrl = window.location.href;

  return (
    <div className="bg-[#F9F7F5] min-h-screen font-[poppins] text-[#1A1A1A]">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={seoImg} />
        <meta property="og:url" content={seoUrl} />
        <meta name="twitter:card" content="summary_large_image" />
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
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => navigate("/")} className="hover:text-[#6F4D34] transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="hover:text-[#6F4D34] cursor-pointer">{mainCategoryName}</span>
          <ChevronRight size={14} />
          <span className="text-[#6F4D34] font-semibold">{finalData.bid.artworkName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery
              images={images}
              product={finalData}
              username={finalData.userId?.username || "Artist"}
              getImageUrl={getImageUrl}
              navigate={navigate}
              navigateToArtistProfile={navigateToArtistProfile}
              resolveMediaUrl={resolveMediaUrl}
              handleShare={handleShare}
              handleWishlist={handleWishlist}
              likedProducts={likedProducts}
              isBidEnded={isBidEnded}
              productBadgeEntry={productBadgeEntry}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              <ProductInfo
                product={finalData}
                currentHighest={currentHighest}
                isBidEnded={isBidEnded}
                winner={winner}
                artistName={`${finalData.userId?.name || ""} ${finalData.userId?.lastName || ""}`.trim()}
                username={finalData.userId?.username || "Artist"}
                getImageUrl={getImageUrl}
              />

              <BiddingCard
                product={finalData}
                currentHighest={currentHighest}
                timeLeft={timeLeft}
                isLastDay={isLastDay}
                isBidEnded={isBidEnded}
                minIncrement={minIncrement}
                showBidSidebar={showBidSidebar}
                setShowBidSidebar={setShowBidSidebar}
                manualBid={manualBid}
                setManualBid={setManualBid}
                handleBidSubmit={handleBidSubmit}
                confirmPopup={confirmPopup}
                setConfirmPopup={setConfirmPopup}
                bidToConfirm={bidToConfirm}
                setBidToConfirm={setBidToConfirm}
                winner={winner}
                userType={userType}
              />

              <OffersBlock
                offersData={offersData}
                index={offerIndex}
                setIndex={setOfferIndex}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
            {["description", "details", "artist", "bid stream", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold transition-all focus:outline-none relative whitespace-nowrap ${activeTab === tab ? "text-[#6F4D34]" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#6F4D34] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "description" && (
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {finalData.description || "No description available."}
                </div>
              </div>
            )}

            {activeTab === "details" && <DetailsGrid product={finalData} categoryInfo={{ mainCategoryName, categoryName, subCategoryName }} getImageUrl={getImageUrl} resolveMediaUrl={resolveMediaUrl} />}

            {activeTab === "artist" && (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 shrink-0 border-4 border-white shadow-lg">
                  <img
                    src={finalData.userId?.profilePhoto ? resolveMediaUrl(finalData.userId.profilePhoto) : "/assets/profile/default.png"}
                    alt="Artist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {finalData.userId?.name} {finalData.userId?.lastName}
                    </h2>
                    {finalData.userId?.verified && <MdVerified size={20} className="text-blue-600" />}
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed italic">
                    {finalData.artistBio || "A passionate artist sharing unique visions through Artsays."}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => navigateToArtistProfile(finalData.userId)}
                      className="px-6 py-3 bg-[#6F4D34] text-white rounded-xl font-bold hover:bg-[#5a3e2a] transition-all flex items-center gap-2"
                    >
                      View Full Portfolio
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bid stream" && (
              <div className="space-y-6">
                {liveBids.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                    <ImHammer2 size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-bold text-gray-400">No bids placed yet. Be the first to bid!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveBids.map((bid, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-[32px] border transition-all flex items-center justify-between ${index === 0 && !isBidEnded ? "bg-[#6F4D34]/5 border-[#6F4D34]/20 shadow-md" : "bg-white border-gray-100"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 && !isBidEnded ? "bg-[#6F4D34] text-white" : "bg-gray-100 text-gray-400"
                            }`}>
                            {bid.userId?.name?.[0] || bid.userId?.username?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {bid.userId?.username || `${bid.userId?.name || ""} ${bid.userId?.lastName || ""}`.trim() || "Anonymous"}
                              {index === 0 && !isBidEnded && <span className="ml-2 text-[10px] bg-[#6F4D34] text-white px-2 py-0.5 rounded-full uppercase">Highest</span>}
                            </p>
                            <p className="text-xs text-gray-400">{formatBidTime(bid)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-black ${index === 0 && !isBidEnded ? "text-[#6F4D34]" : "text-gray-900"}`}>₹{bid.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && <ReviewsList reviews={productReviews} resolveMediaUrl={resolveMediaUrl} onImageClick={setPreviewImage} />}
          </div>
        </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
            <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
        </div>

        {previewImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl max-h-full flex items-center justify-center">
            <button onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }} className="absolute -top-12 right-0 md:-right-12 w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all flex items-center justify-center z-50">✕</button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in duration-300" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductGallery = ({ images, product, username, getImageUrl, navigate, navigateToArtistProfile, resolveMediaUrl, handleShare, handleWishlist, likedProducts, isBidEnded, productBadgeEntry }) => {
  const [selected, setSelected] = useState(images[0]);
  const [showRoom, setShowRoom] = useState(false);
  const [roomBg, setRoomBg] = useState("/artimages/viewintheroom.jpg");
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' });
  const [isZoomed, setIsZoomed] = useState(false);
  const roomBgs = ["/artimages/viewintheroom.jpg", "/artimages/wall3.jpg", "/artimages/wall4.webp"];

  useEffect(() => {
    if (images && images.length > 0) setSelected(images[0]);
  }, [images]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2.5)' });
    setIsZoomed(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group">
        <img
          src={selected}
          alt="Product"
          className={`w-full h-full object-contain bg-[#F8F9FA] transition-all duration-300 cursor-zoom-in ${isBidEnded ? "grayscale blur-[2px]" : ""} ${!isZoomed ? 'group-hover:scale-105' : ''}`}
          style={isZoomed ? zoomStyle : {}}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        />

        {isBidEnded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px] pointer-events-none">
            <div className="bg-white px-8 py-3 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
              <span className="text-red-600 font-black text-3xl uppercase tracking-widest">Bid Ended</span>
            </div>
          </div>
        )}

        <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-600 hover:text-[#6F4D34] transition-all"><Share2 size={20} /></button>
          <button onClick={(e) => { e.stopPropagation(); handleWishlist(product._id, e); }} className={`w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center transition-all ${likedProducts[product._id] ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}><Heart size={20} fill={likedProducts[product._id] ? "currentColor" : "none"} /></button>
        </div>

        {/* <button onClick={() => setShowRoom(true)} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white backdrop-blur-md text-[#6F4D34] px-3 py-2 rounded-2xl font-bold text-sm shadow-xl hidden lg:flex items-center gap-2 hover:!bg-[#6F4D34] hover:text-[#ffffff] transition-all border border-[#6F4D34]/10"><Eye size={18} /> View in Room</button> */}
      </div>

      <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
        {images.map((img, i) => (
          <button key={i} onClick={() => setSelected(img)} className={`w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-white ${selected === img ? "border-[#6F4D34] scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}><img src={img} alt="Thumbnail" className="w-full h-full object-cover" /></button>
        ))}
      </div>

      <div onClick={() => navigateToArtistProfile(product.userId)} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group cursor-pointer hover:border-[#6F4D34]/30 transition-all shadow-sm hover:shadow-md">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
          <img src={product.userId?.profilePhoto ? resolveMediaUrl(product.userId.profilePhoto) : "/assets/profile/default.png"} alt="Artist" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Auctioned By</p>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">{username}</span>
            {product.userId?.verified && <MdVerified className="text-blue-600" size={14} />}
            <div className="flex gap-1 ml-1">
              {productBadgeEntry?.badges?.map((img, i) => (<img key={i} src={getImageUrl(img)} className="w-4 h-4 rounded-full" alt="Badge" />))}
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="ml-auto text-gray-300 group-hover:text-[#6F4D34] transition-all" />
      </div>

      {showRoom && (
        <div className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video bg-[#1a1a1a] rounded-[40px] overflow-hidden shadow-2xl">
            <button onClick={() => setShowRoom(false)} className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all flex items-center justify-center">✕</button>
            <img src={roomBg} alt="Room" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative group">
                <img src={selected} alt="Art" className="max-h-[50vh] object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-[12px] border-white/5" style={{ width: 'auto' }} />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-medium">
                  {product.dimensions?.width || 100} x {product.dimensions?.height || 70} cm
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 backdrop-blur-md p-3 rounded-[28px] border border-white/10">
              {roomBgs.map((bg, i) => (<button key={i} onClick={() => setRoomBg(bg)} className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${roomBg === bg ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}><img src={bg} alt="Room Option" className="w-full h-full object-cover" /></button>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product, currentHighest, isBidEnded, winner, artistName, username, getImageUrl }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {product.bid.artworkName}
        </h1>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isBidEnded ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {isBidEnded ? "Auction Ended" : "Live Auction"}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="text-gray-400 text-sm font-bold">1/1 Masterpiece</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.tags?.map((t, i) => (<span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500">#{t}</span>))}
      </div>

      <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6F4D34]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#6F4D34]/10 transition-colors" />
        <div className="relative space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#6F4D34] uppercase tracking-[0.2em]">{isBidEnded ? "Final Winning Bid" : "Current Highest Bid"}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">₹ {currentHighest.toLocaleString()}</span>
              <span className="text-sm font-bold text-gray-400">INR</span>
            </div>
          </div>

          {isBidEnded && winner && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
              <Award size={24} className="text-green-600" />
              <div>
                <p className="text-xs font-bold text-green-800">Winner</p>
                <p className="text-sm font-black text-green-900">{winner.name}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <p className="text-gray-400 font-medium uppercase text-[10px] tracking-widest">Starting Price</p>
              <p className="text-gray-700 font-bold">₹ {product.bid.basePrice?.toLocaleString()}</p>
            </div>
            {product.bid.reservePrice && (
              <div className="text-right space-y-1">
                <p className="text-gray-400 font-medium uppercase text-[10px] tracking-widest">Reserve Price</p>
                <p className="text-gray-700 font-bold">₹ {product.bid.reservePrice?.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BiddingCard = ({ product, currentHighest, timeLeft, isLastDay, isBidEnded, minIncrement, showBidSidebar, setShowBidSidebar, manualBid, setManualBid, handleBidSubmit, confirmPopup, setConfirmPopup, bidToConfirm, setBidToConfirm, winner, userType }) => {
  return (
    <div className="bg-white rounded-[32px] border border-gray-200 shadow-xl overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ends In</p>
            <p className={`text-lg font-black ${isLastDay && !isBidEnded ? "text-red-500 animate-pulse" : "text-gray-900"}`}>{timeLeft}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Increment</p>
            <p className="text-lg font-black text-gray-900">₹{minIncrement}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2">
            <div className="flex items-center gap-1"><ShieldCheck size={12} /> Secure Bidding</div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1"><Truck size={12} /> Global Shipping</div>
          </div>

          {!isBidEnded && userType !== "Artist" && userType !== "Seller" ? (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {!showBidSidebar ? (
                  <motion.button
                    key="bid-btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => setShowBidSidebar(true)}
                    className="w-full h-16 rounded-2xl bg-[#6F4D34] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-[#6F4D34]/20 hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    <ImHammer2 size={20} /> Place Your Bid
                  </motion.button>
                ) : (
                  <motion.div
                    key="bid-input"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border-2 border-[#6F4D34]">
                      <div className="flex items-center flex-grow min-w-0">
                        <span className="pl-3 sm:pl-4 text-lg sm:text-xl font-black text-[#6F4D34]">₹</span>
                        <input
                          type="number"
                          placeholder={`${currentHighest + minIncrement}`}
                          value={manualBid}
                          onChange={(e) => setManualBid(e.target.value)}
                          className="w-full h-12 sm:h-14 bg-transparent outline-none text-lg sm:text-xl font-black text-gray-900 px-2"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const amt = Number(manualBid);
                          if (!amt) return toast.error("Enter a valid amount");
                          if (amt < currentHighest + minIncrement) return toast.error(`Minimum bid ₹${currentHighest + minIncrement}`);
                          setBidToConfirm(amt);
                          setConfirmPopup(true);
                        }}
                        className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl bg-[#6F4D34] text-white font-bold whitespace-nowrap text-sm sm:text-base flex-shrink-0"
                      >
                        Confirm
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">

                      {[300, 500, 1000, 3000].map((inc) => (
                        <button
                          key={inc}
                          onClick={() => setManualBid(currentHighest + inc)}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-[#6F4D34] hover:text-[#6F4D34] transition-all whitespace-nowrap"
                        >
                          +₹{inc}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowBidSidebar(false)} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Cancel</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl p-6 text-center space-y-2">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Auction Ended</p>
              {winner ? (
                <p className="text-xs text-gray-500">Winner: <span className="font-bold text-[#6F4D34]">{winner.name}</span></p>
              ) : (
                <p className="text-xs text-gray-500">No successful bids placed</p>
              )}
            </div>
          )}
        </div>
      </div>
      {confirmPopup && (
        <div className="fixed inset-0 z-[10000] backdrop-blur-sm flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#6F4D34]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#6F4D34]">
              <ImHammer2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Confirm Your Bid</h2>
            <p className="text-gray-500 mb-8">You are about to place a bid for</p>
            <div className="text-4xl font-black text-[#6F4D34] mb-10 tracking-tighter">₹{bidToConfirm?.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setConfirmPopup(false)} className="h-14 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => handleBidSubmit(bidToConfirm)} className="h-14 rounded-2xl bg-[#6F4D34] text-white font-bold shadow-lg shadow-[#6F4D34]/20 hover:bg-[#5a3e2a] transition-all">Bid Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OffersBlock = ({ offersData, index, setIndex }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <HiMiniPercentBadge className="text-red-500" size={20} />
          <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">Auction Intel</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIndex(Math.max(0, index - 1))} className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#6F4D34] transition-all disabled:opacity-30" disabled={index === 0}><ChevronLeft size={16} /></button>
          <button onClick={() => setIndex(Math.min(offersData.length - 1, index + 1))} className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#6F4D34] transition-all disabled:opacity-30" disabled={index >= offersData.length - 1}><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="overflow-hidden p-1">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {offersData.map((offer, i) => (
            <div key={i} className="min-w-full px-1">
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-100 hover:border-[#6F4D34]/20 transition-all">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#6F4D34]" />{offer.title}</h4>
                <p className="text-xs text-gray-500 leading-tight mb-2">{offer.description}</p>
                <span className="text-[10px] font-black text-[#6F4D34] uppercase px-2 py-0.5 bg-[#6F4D34]/5 rounded-md">{offer.offers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailsGrid = ({ product, categoryInfo, getImageUrl, resolveMediaUrl }) => {
  const Section = ({ title, icon: Icon, children }) => {
    const hasVisibleChildren = React.Children.toArray(children).some(child => child !== null);
    if (!hasVisibleChildren) return null;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6F4D34]/5 flex items-center justify-center text-[#6F4D34]"><Icon size={20} /></div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      </div>
    );
  };

  const Item = ({ label, value, isLink, isFile }) => {
    if (value === undefined || value === null || value === "" || value === "N/A" || (Array.isArray(value) && value.length === 0)) return null;
    let displayValue = typeof value === 'boolean' ? (value ? "Yes" : "No") : (Array.isArray(value) ? value.join(", ") : value);
    if (isLink) return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#6F4D34] hover:underline flex items-center gap-1">View Link <ExternalLink size={14} /></a>
      </div>
    );
    if (isFile) return (
      <div className="flex items-center justify-between p-4 bg-[#6F4D34]/5 rounded-2xl border border-[#6F4D34]/10">
        <div className="flex items-center gap-3"><FileText size={18} className="text-[#6F4D34]" /><span className="text-sm font-bold text-gray-700">{label}</span></div>
        <a href={resolveMediaUrl(value)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#6F4D34]/20 rounded-xl text-[#6F4D34] text-xs font-bold hover:bg-[#6F4D34] hover:text-white transition-all shadow-sm"><Download size={14} /> Download</a>
      </div>
    );
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
        <span className="text-sm font-bold text-gray-800 text-right">{String(displayValue)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <Section title="Artwork Identity" icon={Box}>
        <Item label="Main Category" value={categoryInfo.mainCategoryName} />
        <Item label="Category" value={categoryInfo.categoryName} />
        <Item label="Sub Category" value={categoryInfo.subCategoryName} />
        <Item label="Product Type" value={product.productType} />
        <Item label="Edition Type" value={product.editionType} />
        <Item label="Year of Creation" value={product.year} />
        <Item label="Condition" value={product.condition} />
      </Section>
      <Section title="Technical Details" icon={Award}>
        <Item label="Medium" value={product.medium} />
        <Item label="Surface Type" value={product.surfaceType} />
        <Item label="Materials" value={product.materials} />
        <Item label="Handmade" value={product.handmade} />
        <Item label="Is Signed" value={product.isSigned} />
      </Section>
      <Section title="Physical Attributes" icon={Ruler}>
        <Item label="Width" value={product.width ? `${product.width} cm` : product.dimensions?.width ? `${product.dimensions.width} cm` : null} />
        <Item label="Height" value={product.height ? `${product.height} cm` : product.dimensions?.height ? `${product.dimensions.height} cm` : null} />
        <Item label="Depth" value={product.depth ? `${product.depth} cm` : product.dimensions?.depth ? `${product.dimensions.depth} cm` : null} />
        <Item label="Weight" value={product.weight ? `${product.weight} g` : null} />
        <Item label="Framing" value={product.framing} />
      </Section>
      <Section title="Trust & Compliance" icon={ShieldCheck}>
        <Item label="Provenance" value={product.provenance} />
        <Item label="COA Available" value={product.coaAvailable} />
        <Item label="Copyright Rights" value={product.copyrightRights} />
        <Item label="GST Included" value={product.includeGst} />
      </Section>
    </div>
  );
};

const ReviewsList = ({ reviews, resolveMediaUrl, onImageClick }) => {
  if (reviews.length === 0) return (
    <div className="text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
      <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-lg font-bold text-gray-400">No reviews yet for this auction item.</p>
    </div>
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review, i) => (
        <div key={i} className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6F4D34]/10 flex items-center justify-center text-[#6F4D34] font-bold">{review.userId?.name?.[0]}</div>
              <div>
                <p className="font-bold text-gray-900">{review.userId?.name} {review.userId?.lastName}</p>
                <div className="flex items-center gap-1">{[...Array(5)].map((_, j) => (<Star key={j} size={12} fill={j < review.rating ? "#facc15" : "none"} className={j < review.rating ? "text-yellow-400" : "text-gray-200"} />))}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.description}</p>
          {review.photos?.length > 0 && (
            <div className="flex gap-2">
              {review.photos.map((photo, k) => (
                <img
                  key={k}
                  src={resolveMediaUrl(photo)}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 cursor-pointer hover:border-[#6F4D34]/50 hover:scale-105 transition-all"
                  alt="Review"
                  onClick={() => onImageClick?.(resolveMediaUrl(photo))}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ProductDetailsSkeleton = () => (
  <div className="max-w-[1440px] mx-auto p-8 animate-pulse space-y-10">
    <div className="h-4 w-64 bg-gray-200 rounded-full" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 aspect-[4/3] bg-gray-200 rounded-[40px]" />
      <div className="lg:col-span-5 space-y-6">
        <div className="h-10 w-3/4 bg-gray-200 rounded-2xl" />
        <div className="h-6 w-1/2 bg-gray-200 rounded-xl" />
        <div className="h-32 w-full bg-gray-200 rounded-[32px]" />
        <div className="h-48 w-full bg-gray-200 rounded-[32px]" />
      </div>
    </div>
  </div>
);

export default BidDetails;
