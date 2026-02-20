import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import deleteAPI from "../../api/deleteAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../Constants/ConstantsVariables";
import "../store/products/product.css";

// ─── helpers ────────────────────────────────────────────────
const slugify = (t = "") => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const useDebounce = (val, delay) => {
  const [dv, setDv] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDv(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return dv;
};

const renderStars = (r) => {
  const filled = Math.round(r || 0);
  return [1, 2, 3, 4, 5].map((s) => (
    <Star key={s} size={13} className={s <= filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
  ));
};

const TABS = ["All", "Store", "Bid", "Artists"];
const PER_PAGE = 12;

const matches = (q, ...fields) => {
  const lq = q.toLowerCase();
  return fields.some((f) => f && String(f).toLowerCase().includes(lq));
};

// ─── PRODUCT CARD (exact store page card) ────────────────────
const ProductCard = ({ product, imageBaseURL, likedProducts, onWishlist, onCart, cartItems, navigate, index = 0 }) => {
  const displayPrice = product.finalPrice ?? 0;
  const hasDiscount = displayPrice < product.marketPrice;
  const discountPercent = hasDiscount ? Math.round(((product.marketPrice - displayPrice) / product.marketPrice) * 100) : 0;
  const soldOut = !product.quantity || product.quantity === 0;
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const ensureBuyer = () => {
    if (userType !== "Buyer") { toast.warn("Only buyers can use this feature, Register as a Buyer to continue."); return false; }
    return true;
  };

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => navigate(`/product-details/${slugify(product.productName)}/${product._id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[5/5] overflow-hidden bg-[#F8F9FA]">
        <img
          src={`${imageBaseURL}${product.mainImage}`}
          alt={product.productName}
          className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${soldOut ? "blur-[2px]" : ""}`}
          onError={(e) => { e.target.src = "/assets/home/biditemurl.jpg"; }}
        />
        {/* Sold Out */}
        {soldOut && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <div className="bg-white px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
              <span className="text-red-600 font-black text-xl uppercase tracking-wider">Sold Out</span>
            </div>
          </div>
        )}
        {/* Edition badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.editionType && (
            <div className="bg-white backdrop-blur-md text-[#6F4D34] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">
              {product.editionType}
            </div>
          )}
        </div>
        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product._id); }}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-all transform hover:scale-110 group/heart z-10"
        >
          <Heart size={18} className={`transition-colors ${likedProducts[product._id] ? "text-red-500 fill-red-500" : "text-gray-900 group-hover/heart:text-red-500"}`} />
        </button>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3 gap-3">
        {/* Artist + badges */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
            <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
              {product.userId?.name || "Independent Artist"}
            </span>
          </div>
          <div className="flex -space-x-1.5">
            {product.badges?.map((img, idx) => (
              <div key={idx}>
                <img src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full" alt="Badge" />
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">
          {product.productName}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
            <div className="flex items-center mr-1.5">{renderStars(product.averageRating)}</div>
            <span className="text-[11px] font-black text-gray-900">
              {product.averageRating ? Number(product.averageRating).toFixed(1) : "0.0"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            • {product.reviewCount || 0} reviews
          </span>
          {hasDiscount && (
            <div className="flex items-center justify-center bg-red-50 text-[#E74C3C] px-2 py-1 rounded-2xl border border-red-100/50 shadow-sm">
              <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{discountPercent}% Save</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto border-t border-gray-50">
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through font-bold">
                ₹{(product.marketPrice || 0).toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              ₹{displayPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); if (!ensureBuyer()) return; onCart(product._id); }}
            disabled={soldOut}
            className="col-span-1 h-[48px] bg-gray-50 text-gray-900 hover:text-[#ffffff] rounded-2xl hover:bg-[#6F4D34] hover:text-white transition-all duration-300 disabled:opacity-50 border border-gray-100 flex items-center justify-center group/cart shadow-sm"
            title="Add to Cart"
          >
            <div className="relative">
              <ShoppingCart size={20} className="transition-transform group-hover/cart:scale-110" />
              {(() => {
                const cartItem = cartItems.find((i) => i.product?._id === product._id);
                return cartItem && cartItem.quantity > 0 ? (
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg border-2 border-white flex items-center justify-center">
                    {cartItem.quantity}
                  </span>
                ) : null;
              })()}
            </div>
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (!ensureBuyer()) return;
              if (soldOut) return;
              await onCart(product._id);
              navigate(`/my-account/check-out/${userId}?productId=${product._id}`);
            }}
            disabled={soldOut}
            className="col-span-4 h-[48px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm hover:!bg-[#ffffff] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-100 transform active:scale-95 flex items-center justify-center overflow-hidden relative"
          >
            <span className="relative z-10">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── BID CARD ────────────────────────────────────────────────
const BidCard = ({ item, imageBaseURL, navigate }) => {
  const p = item.product || {};
  const name = item.artworkName || p.productName || "Untitled";
  const startingPrice = item.startingBidPrice ?? p.finalPrice ?? 0;
  const artist = p.userId?.name ? `${p.userId.name}${p.userId.lastName ? " " + p.userId.lastName : ""}` : "Artist";

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 relative cursor-pointer"
      onClick={() => navigate(`/bid-details/${slugify(name)}/${item._id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
        <img
          src={`${imageBaseURL}${p.mainImage}`}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "/assets/home/biditemurl.jpg"; }}
        />
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-[#6F4D34] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Bid</span>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
          <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">{artist}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors">{name}</h3>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starting Bid</span>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{startingPrice.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/bid-details/${slugify(name)}/${item._id}`); }}
          className="w-full h-[56px] bg-[#6F4D34] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-xl hover:bg-[#5a3e2a]"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
};

// ─── ARTIST CARD ─────────────────────────────────────────────
const ArtistCard = ({ artist, imageBaseURL, navigate }) => {
  const avatar = artist.profilePhoto ? `${imageBaseURL}${artist.profilePhoto}` : DEFAULT_PROFILE_IMAGE;
  const name = `${artist.name || ""}${artist.lastName ? " " + artist.lastName : ""}`.trim() || "Artist";
  const username = artist.username || artist._id;

  return (
    <div
      className="group flex flex-col items-center bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 p-8 cursor-pointer text-center"
      onClick={() => navigate(`/artsays-community/profile/${username}`)}
    >
      <div className="relative mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-4 border-[#6F4D34]/20 group-hover:border-[#6F4D34] transition-all duration-300"
          onError={(e) => { e.target.src = DEFAULT_PROFILE_IMAGE; }}
        />
        {artist.status === "Verified" && (
          <div className="absolute -bottom-1 -right-1 bg-[#6F4D34] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Verified</div>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">{name}</h3>
      {artist.userType && (
        <span className="mt-1 text-[10px] font-black text-[#6F4D34] uppercase tracking-widest bg-[#6F4D34]/10 px-3 py-1 rounded-full">{artist.userType}</span>
      )}
      {artist.expertise?.length > 0 && (
        <p className="mt-3 text-xs text-gray-500 line-clamp-2">{artist.expertise.slice(0, 3).join(", ")}</p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/artsays-community/profile/${username}`); }}
        className="mt-5 w-full h-[48px] border-2 border-[#6F4D34] text-[#6F4D34] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#6F4D34] hover:text-white transition-all duration-300"
      >
        View Profile
      </button>
    </div>
  );
};

// ─── SKELETON ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-[5/5] bg-gray-100" />
    <div className="p-3 space-y-3">
      <div className="h-2 bg-gray-100 rounded-full w-1/2" />
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-2 bg-gray-100 rounded-full w-1/3" />
      <div className="h-12 bg-gray-100 rounded-2xl mt-2" />
    </div>
  </div>
);

// ─── MAIN PAGE ───────────────────────────────────────────────
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

  const [inputVal, setInputVal] = useState(searchParams.get("q") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [storeProducts, setStoreProducts] = useState([]);
  const [bidProducts, setBidProducts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const debouncedInput = useDebounce(inputVal, 350);

  // sync query + URL
  useEffect(() => {
    setQuery(debouncedInput);
    setCurrentPage(1);
    if (debouncedInput) {
      setSearchParams({ q: debouncedInput }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedInput]);

  // fetch everything once
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sp1Res, sp2Res, ratingRes, bidRes, artistRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/bidding/products/all", {}, true, false),
          getAPI("/artist/artists", {}, true, false),
        ]);

        const sp1 = sp1Res?.data?.data?.filter((p) => p.status === "Approved") || [];
        const sp2 = sp2Res?.data?.data?.filter((p) => p.status === "Approved") || [];
        const ratings = ratingRes?.data?.data || [];
        const rMap = Object.fromEntries(ratings.map((r) => [r._id, r]));
        setStoreProducts(
          [...sp1, ...sp2].map((p) => ({
            ...p,
            averageRating: rMap[p._id]?.averageRating ?? p.averageRating ?? 0,
            reviewCount: rMap[p._id]?.reviewCount ?? p.reviewCount ?? 0,
          }))
        );

        const bids = Array.isArray(bidRes?.data) ? bidRes.data.filter((i) => i?.product) : [];
        setBidProducts(bids);

        const al = artistRes?.data?.artists || artistRes?.data?.data || artistRes?.data || [];
        setArtists(Array.isArray(al) ? al : []);

        if (userId && userType === "Buyer") {
          try { setCartItems((await getAPI(`/api/cart/${userId}`))?.data?.items || []); } catch {}
          try {
            const wRes = await getAPI(`/api/wishlist/${userId}`);
            const wMap = {};
            (wRes?.data?.items || []).forEach((i) => { const id = i.product?._id || i.product; if (id) wMap[id] = true; });
            setLikedProducts(wMap);
          } catch {}
        }
      } catch (e) {
        console.error("Search load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const refreshCart = async () => {
    if (!userId || userType !== "Buyer") return;
    try { setCartItems((await getAPI(`/api/cart/${userId}`))?.data?.items || []); } catch {}
  };

  const handleWishlist = async (productId) => {
    if (userType !== "Buyer") { toast.warn("Only buyers can use this feature."); return; }
    const isLiked = likedProducts[productId];
    try {
      if (isLiked) {
        await deleteAPI("/api/wishlist/remove", { params: { userId, productId } });
        toast.warn("Removed from Wishlist");
      } else {
        await postAPI("/api/wishlist/add", { userId, productId });
        toast.success("Added to Wishlist");
      }
      setLikedProducts((prev) => ({ ...prev, [productId]: !isLiked }));
    } catch {}
  };

  const handleCart = async (productId) => {
    if (userType !== "Buyer") { toast.warn("Only buyers can use this feature."); return; }
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
      refreshCart();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add to cart");
    }
  };

  // ── filter ──
  const filteredStore = storeProducts.filter((p) =>
    !query || matches(query, p.productName, p.description, p.userId?.name, p.userId?.lastName, p.category, p.subCategory, p.mainCategory, p.productType, p.productMedium, p.productMaterial, p.editionType)
  );
  const filteredBid = bidProducts.filter((item) =>
    !query || matches(query, item.artworkName, item.product?.productName, item.product?.description, item.product?.userId?.name, item.product?.userId?.lastName, item.product?.category, item.product?.subCategory)
  );
  const filteredArtists = artists.filter((a) =>
    !query || matches(query, a.name, a.lastName, a.username, a.email, a.userType, ...(a.expertise || []))
  );

  const counts = { All: filteredStore.length + filteredBid.length + filteredArtists.length, Store: filteredStore.length, Bid: filteredBid.length, Artists: filteredArtists.length };

  const getPagedItems = () => {
    let items = [];
    if (activeTab === "All") items = [...filteredStore.map((d) => ({ type: "store", data: d })), ...filteredBid.map((d) => ({ type: "bid", data: d })), ...filteredArtists.map((d) => ({ type: "artist", data: d }))];
    else if (activeTab === "Store") items = filteredStore.map((d) => ({ type: "store", data: d }));
    else if (activeTab === "Bid") items = filteredBid.map((d) => ({ type: "bid", data: d }));
    else items = filteredArtists.map((d) => ({ type: "artist", data: d }));
    return { paged: items.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE), totalPages: Math.ceil(items.length / PER_PAGE), total: items.length };
  };

  const { paged, totalPages, total } = getPagedItems();

  const handleTabChange = (tab) => { setActiveTab(tab); setCurrentPage(1); };

  const clearSearch = () => { setInputVal(""); setQuery(""); setSearchParams({}, { replace: true }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(inputVal);
    setCurrentPage(1);
    if (inputVal) setSearchParams({ q: inputVal }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-[poppins]">

      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 260 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C4033] via-[#4A3328] to-[#3D2920]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B6914]/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#D4A574]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-[1440px] py-14 md:py-20">
          <span className="inline-block px-3 py-1 bg-white text-[#6F4D34] rounded-full text-[10px] font-black tracking-widest uppercase mb-4">Search</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-white leading-tight drop-shadow-lg">
            Discover Art, Bids &amp; Artists
          </h1>
          <p className="text-sm sm:text-base text-white/80 mb-8">Search across all products, auctions, categories and artists</p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-2xl overflow-hidden shadow-xl max-w-2xl">
            <div className="flex items-center flex-1 px-5 gap-3">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search your next Masterpiece NOW!"
                className="flex-1 px-4 py-3 text-md md:text-lg text-gray-600 focus:outline-none bg-transparent"
                autoFocus
              />
              {inputVal && (
                <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-gray-600 shrink-0">
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="px-6 py-3 bg-[#6F4D34] text-white font-semibold text-md md:text-lg hover:bg-[#5a3e2a] transition shrink-0">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 md:px-12 max-w-[1440px] py-10">

        {/* Tabs */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${activeTab === tab ? "bg-[#6F4D34] text-white border-[#6F4D34] shadow-lg" : "bg-white text-gray-600 border-gray-200 hover:border-[#6F4D34] hover:text-[#6F4D34]"}`}
            >
              {tab}
              {!loading && (
                <span className={`ml-2 text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
          {query && (
            <span className="ml-auto text-sm text-gray-500">
              Results for <strong className="text-[#6F4D34]">"{query}"</strong>
            </span>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paged.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6 text-gray-300"><Search size={48} /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              {query ? `We couldn't find anything matching "${query}". Try different keywords.` : "Start typing to search products, bids, artists and more."}
            </p>
            {query && (
              <button onClick={clearSearch} className="text-[#6F4D34] font-bold hover:underline px-8 py-3 border-2 border-[#6F4D34] rounded-full transition-all">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {paged.map(({ type, data }, index) => {
                  if (type === "store") return <ProductCard key={`store-${data._id}`} product={data} imageBaseURL={imageBaseURL} likedProducts={likedProducts} onWishlist={handleWishlist} onCart={handleCart} cartItems={cartItems} navigate={navigate} index={index} />;
                if (type === "bid") return <BidCard key={`bid-${data._id}`} item={data} imageBaseURL={imageBaseURL} navigate={navigate} />;
                return <ArtistCard key={`artist-${data._id}`} artist={data} imageBaseURL={imageBaseURL} navigate={navigate} />;
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 pb-12">
                <nav className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-[32px] shadow-sm">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-4 rounded-2xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"><ChevronLeft size={28} /></button>
                  <div className="flex items-center px-4 gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pg = i + 1;
                      if (totalPages > 7 && pg !== 1 && pg !== totalPages && (pg < currentPage - 1 || pg > currentPage + 1)) {
                        if (pg === currentPage - 2 || pg === currentPage + 2) return <span key={pg} className="px-2 text-gray-400">...</span>;
                        return null;
                      }
                      return (
                        <button key={pg} onClick={() => setCurrentPage(pg)} className={`w-12 h-12 flex items-center justify-center rounded-2xl text-base font-bold transition-all ${pg === currentPage ? "bg-[#6F4D34] text-white shadow-lg scale-110" : "text-gray-600 hover:bg-gray-50"}`}>{pg}</button>
                      );
                    })}
                  </div>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="p-4 rounded-2xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"><ChevronRight size={28} /></button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
