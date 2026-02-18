import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import deleteAPI from "../../api/deleteAPI";
import { toast } from "react-toastify";

const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

const SponsoredProducts = ({ placement, title = "Sponsored", layout = "row", maxItems }) => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature. Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  const slugify = (text) =>
    text?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "";

  const handleAdClick = async (product) => {
    const slug = slugify(product.productName);
    try {
      await postAPI("/api/campaigns/ads/click", {
        campaignId: product.campaignId,
        productId: product._id,
        placement: product.placement || placement,
      }, {}, false);
    } catch (err) {
      console.error("Ad click tracking error:", err);
    }
    navigate(`/product-details/${slug}/${product._id}`);
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAPI(`/api/campaigns/ads/placement?placement=${placement}`, {}, true, false);
        const data = res?.data?.data || [];
        setProducts(maxItems ? data.slice(0, maxItems) : data);
      } catch (err) {
        console.error(`Error fetching sponsored products for ${placement}:`, err);
      }
    };
    fetchAds();
  }, [placement, maxItems]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
        const wishlistArray = res?.data?.wishlist || [];
        const obj = {};
        wishlistArray.forEach((item) => { obj[item._id] = true; });
        setLikedProducts(obj);
      } catch (err) {
        console.error("Wishlist load error:", err);
      }
    };
    fetchWishlist();
  }, [userId]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || userType !== "Buyer") return;
      try {
        const res = await getAPI(`/api/cart/${userId}`);
        setCartItems(res?.data?.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [userId, userType]);

  const handleWishlist = async (productId, e) => {
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
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const addToCart = async (productId, e) => {
    e.stopPropagation();
    if (!ensureBuyer()) return;
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
      if (userId && userType === "Buyer") {
        const res = await getAPI(`/api/cart/${userId}`);
        setCartItems(res?.data?.items || []);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (averageRating) => {
    if (averageRating == null)
      return [1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="text-gray-200 fill-gray-200" />);
    const filled = Math.round(averageRating);
    return [1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} className={s <= filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
    ));
  };

  if (products.length === 0) return null;

  const gridClass = layout === "row"
    ? "flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible"
    : layout === "inline"
    ? "flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible"
    : "grid grid-cols-1 gap-3";

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
            Sponsored
          </span>
        </div>
      )}
      <div className={gridClass}>
        {products.map((product, index) => {
          const displayPrice = product.finalPrice;
          const hasDiscount = displayPrice < product.marketPrice;
          const discountPercent = hasDiscount
            ? Math.round(((product.marketPrice - displayPrice) / product.marketPrice) * 100)
            : 0;

          return (
            <div
                key={`${product.campaignId}-${product._id}`}
                className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative min-w-[72%] snap-start sm:min-w-0"
                style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleAdClick(product)}
              >
                {/* Image Container */}
                <div className="relative aspect-[5/5] overflow-hidden bg-[#F8F9FA]">
                  <img
                    src={`${imageBaseURL}${product.mainImage}`}
                    alt={product.productName}
                    className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${(!product.quantity || product.quantity === 0) ? 'blur-[2px]' : ''}`}
                  />

                  {/* Sold Out Overlay */}
                  {(!product.quantity || product.quantity === 0) && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <div className="bg-white px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
                        <span className="text-red-600 font-black text-xl uppercase tracking-wider">Sold Out</span>
                      </div>
                    </div>
                  )}

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      <div className="bg-[#6F4D34] backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                        Ad
                      </div>
                    </div>

                  {/* Heart Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleWishlist(product._id, e); }}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-all transform hover:scale-110 group/heart z-10"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${likedProducts[product._id] ? "text-red-500 fill-red-500" : "text-gray-900 group-hover/heart:text-red-500"}`}
                    />
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-3 gap-3">
                  {/* Artist Info & Badges */}
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

                  {/* Rating & Review Count */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                      <div className="flex items-center mr-1.5">
                        {renderStars(product.averageRating)}
                      </div>
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

                  {/* Pricing & Discount */}
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
                        onClick={(e) => { e.stopPropagation(); if (!ensureBuyer()) return; addToCart(product._id, e); }}
                        disabled={!product.quantity || product.quantity === 0}
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
                        if (!product.quantity || product.quantity === 0) return;
                        await addToCart(product._id, e);
                        navigate(`/my-account/check-out/${userId}?productId=${product._id}`);
                      }}
                      disabled={!product.quantity || product.quantity === 0}
                      className="col-span-4 h-[48px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm hover:!bg-[#ffffff] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-100 transform active:scale-95 flex items-center justify-center overflow-hidden relative"
                    >
                      <span className="relative z-10">
                        {(!product.quantity || product.quantity === 0) ? "Sold Out" : "Shop Now"}
                      </span>
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

export default SponsoredProducts;
