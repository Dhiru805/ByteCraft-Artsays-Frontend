import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useAuth } from "../../AuthContext";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import deleteAPI from "../../api/deleteAPI";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/getImageUrl";

const resolveMediaUrl = (path) => getImageUrl(path) || "/images/placeholder.jpg";

const timeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const slugify = (text) =>
  text?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "";

const renderStars = (averageRating) => {
  const filled = averageRating ? Math.round(averageRating) : 0;
  return [1, 2, 3, 4, 5].map((s) => (
    <Star
      key={s}
      size={14}
      className={s <= filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
    />
  ));
};

const RecentlyViewedProducts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const hiddenPages = ["/", "/home", "/artsays-community", "/my-account"];
  const isHiddenPage = hiddenPages.some(
    (p) => location.pathname === p || location.pathname.startsWith("/my-account/") || location.pathname.startsWith("/artsays-community/")
  );

  useEffect(() => {
    if (!isAuthenticated || !userId || isHiddenPage) return;

      const fetchRecentlyViewed = async () => {
        try {
          console.log("Fetching recently viewed for userId:", userId);
          const res = await getAPI(`/api/recently-viewed/${userId}`, {}, true, false);
          console.log("Recently viewed API response:", res);
          const data = res?.data?.data || [];
          console.log("Recently viewed products:", data);
          // Exclude current product page from list
          const currentProductId = location.pathname.match(/\/product-details\/[^/]+\/([^/]+)/)?.[1];
          const filtered = currentProductId ? data.filter((p) => p._id !== currentProductId) : data;
          setProducts(filtered);
        } catch (err) {
          console.error("Recently viewed fetch error:", err);
          setProducts([]);
        }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated, userId, location.pathname, isHiddenPage]);

  // Fetch wishlist
  useEffect(() => {
    if (!userId) return;
    const fetchWishlist = async () => {
      try {
        const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
        const wishlistArray = res?.data?.wishlist || [];
        const obj = {};
        wishlistArray.forEach((item) => { obj[item._id] = true; });
        setLikedProducts(obj);
      } catch {}
    };
    fetchWishlist();
  }, [userId]);

  // Fetch cart
  useEffect(() => {
    if (!userId || userType !== "Buyer") return;
    const fetchCart = async () => {
      try {
        const res = await getAPI(`/api/cart/${userId}`);
        setCartItems(res?.data?.items || []);
      } catch {}
    };
    fetchCart();
  }, [userId, userType]);

  useEffect(() => {
    checkScroll();
  }, [products]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature, Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();
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
      setLikedProducts((prev) => ({ ...prev, [productId]: !isLiked }));
    } catch {}
  };

  const addToCart = async (e, productId) => {
    e.stopPropagation();
    if (!userId) {
      toast.warn("You must be logged in to add items to cart");
      return;
    }
    if (!ensureBuyer()) return;
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
      const res = await getAPI(`/api/cart/${userId}`);
      setCartItems(res?.data?.items || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

  // Don't render on homepage, when not authenticated, or when no products
  if (isHiddenPage || !isAuthenticated || products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-10 border-t border-gray-100 font-[poppins]">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6F4D34] flex items-center justify-center shadow-md">
              <Clock size={18} color="#fff" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Recently Viewed
              </h2>
              <p className="text-xs text-gray-500">Pick up where you left off</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center transition-all ${
                canScrollLeft ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-50 opacity-40 cursor-default"
              }`}
            >
              <ChevronLeft size={16} className="text-gray-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center transition-all ${
                canScrollRight ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-50 opacity-40 cursor-default"
              }`}
            >
              <ChevronRight size={16} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Products scroll */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.rv-scroll::-webkit-scrollbar { display: none; }`}</style>

          {products.map((product, index) => {
            const displayPrice = product.finalPrice;
            const hasDiscount = displayPrice < product.marketPrice;
            const discountPercent = hasDiscount
              ? Math.round(((product.marketPrice - displayPrice) / product.marketPrice) * 100)
              : 0;
            const isOutOfStock = !product.quantity || product.quantity === 0;

            return (
              <div
                key={product._id}
                className="group flex-shrink-0 flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 relative cursor-pointer"
                style={{ width: 280, scrollSnapAlign: "start", animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  const slug = slugify(product.productName);
                  navigate(`/product-details/${slug}/${product._id}`);
                }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
                  <img
                    src={resolveMediaUrl(product.mainImage)}
                    alt={product.productName}
                    className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? "blur-[2px]" : ""}`}
                    onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
                  />

                  {/* Sold Out Overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <div className="bg-white px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
                        <span className="text-red-600 font-black text-xl uppercase tracking-wider">Sold Out</span>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.editionType && (
                      <div className="bg-white backdrop-blur-md text-[#6F4D34] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">
                        {product.editionType}
                      </div>
                    )}
                  </div>

                  {/* Time ago badge */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 z-10">
                    <Clock size={10} />
                    {timeAgo(product.viewedAt)}
                  </div>

                  {/* Heart */}
                  <button
                    onClick={(e) => handleWishlist(e, product._id)}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-all transform hover:scale-110 group/heart z-10"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${
                        likedProducts[product._id]
                          ? "text-red-500 fill-red-500"
                          : "text-gray-900 group-hover/heart:text-red-500"
                      }`}
                    />
                  </button>

                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-3 gap-3">
                  {/* Artist */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
                      <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
                        {product.userId?.name || "Independent Artist"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">
                    {product.productName}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                      <div className="flex items-center mr-1.5">
                        {renderStars(product.averageRating)}
                      </div>
                      <span className="text-[11px] font-black text-gray-900">
                        {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
                      </span>
                    </div>
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
                        ₹{(product.finalPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={(e) => addToCart(e, product._id)}
                      disabled={isOutOfStock}
                      className="col-span-1 h-[48px] bg-gray-50 text-gray-900 hover:text-[#ffffff] rounded-2xl hover:bg-[#6F4D34] hover:text-white transition-all duration-300 disabled:opacity-50 border border-gray-100 flex items-center justify-center group/cart shadow-sm"
                      title="Add to Cart"
                    >
                      <div className="relative">
                        <ShoppingCart size={20} className="transition-transform group-hover/cart:scale-110" />
                        {(() => {
                          const cartItem = cartItems.find((item) => item.product?._id === product._id);
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
                        if (isOutOfStock) return;
                        await postAPI(`/api/cart/addcart/${product._id}`, {}, true).catch(() => {});
                        navigate(`/my-account/check-out/${userId}?productId=${product._id}`);
                      }}
                      disabled={isOutOfStock}
                      className="col-span-4 h-[48px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm hover:!bg-[#ffffff] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-100 transform active:scale-95 flex items-center justify-center overflow-hidden relative"
                    >
                      <span className="relative z-10">
                        {isOutOfStock ? "Sold Out" : "Shop Now"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;
