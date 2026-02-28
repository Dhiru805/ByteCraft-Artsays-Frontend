

import { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";

import { Heart, ShoppingCart, Star, Search } from "lucide-react";
// import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import BrowserCategorySkeleton from "../../../Component/Skeleton/BrowserCategorySkeleton";
import "../../store/products/product.css";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BrowseCategories = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400); // 400ms debounce delay

  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const fetchCart = async () => {
    if (!userId || userType !== "Buyer") return;
    try {
      const res = await getAPI(`/api/cart/${userId}`);
      setCartItems(res?.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId, userType]);

  const addToCart = async (productId) => {
    if (!userId) {
      toast.warn("You must be logged in to add items to cart");
      return;
    }
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    let result = allProducts;
    if (selectedCategory) {
      const cat = categories.find(c => c.categoryName === selectedCategory);
      if (cat) {
        result = allProducts.filter((p) => p.category === cat._id);
      }
    }
    if (debouncedSearchQuery) {
      result = result.filter(p => 
        p.productName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (p.userId?.name && p.userId.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchQuery, allProducts, categories]);

    const currentItems = filteredProducts.slice(0, 8);

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
    if (averageRating == null) return [1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="text-gray-200 fill-gray-200" />);
    const filled = Math.round(averageRating);
    return [1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} className={s <= filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
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

        const merged = [...products1, ...products2].sort((a, b) => {
            const aInStock = (a.quantity && a.quantity > 0) ? 1 : 0;
            const bInStock = (b.quantity && b.quantity > 0) ? 1 : 0;
            if (bInStock !== aInStock) return bInStock - aInStock;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

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
    <div className="w-full bg-gray-50/50 py-12 font-[poppins]">
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 align-items-center mb-3">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                {data.heading || "Browse Categories"}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
                {data.description || "Discover a curated selection of masterpieces across various artistic styles and mediums."}
              </p>
            </div>
          {data.buttonName && (
            <button
              onClick={() => navigate(data.buttonLink || "/store")}
              className="hidden lg:block bg-[#6F4D34] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-lg shadow-[#6F4D34]/20 transform active:scale-95"
            >
              {data.buttonName}
            </button>
          )}
        </div>

        {/* Category & Search Controls */}
        <div className="flex flex-col lg:flex-row gap-3 mb-12 items-center">
          {/* Search Bar - Matching Store Page */}
          <div className="relative flex-1 w-full group">
            <input
              type="text"
              placeholder="Search masterpieces or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
            />
          </div>

          {/* Horizontal Category Scroll */}
          <div className="w-full lg:w-auto overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto !scrollbar-hide cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseDown={mouseDown}
              onMouseLeave={mouseLeave}
              onMouseUp={mouseUp}
              onMouseMove={mouseMove}
              onTouchStart={touchStart}
              onTouchEnd={touchEnd}
              onTouchMove={touchMove}
            >
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat.categoryName === selectedCategory ? null : cat.categoryName);
                  }}
                  className={`
                    px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 border-2
                    ${selectedCategory === cat.categoryName
                      ? "bg-[#6F4D34] border-[#6F4D34] text-white shadow-md shadow-[#6F4D34]/20"
                      : "bg-white border-gray-100 text-gray-600 hover:border-[#6F4D34] hover:text-[#6F4D34]"
                    }
                  `}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>



          {/* Products Grid - Using Premium Card Design */}
        {currentItems.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
              {currentItems.map((product, index) => {
                  if (!product) return null;
                    const displayPrice = product.finalPrice;
                    const hasDiscount = displayPrice < product.marketPrice;
                  const discountPercent = hasDiscount ? Math.round(((product.marketPrice - displayPrice) / product.marketPrice) * 100) : 0;

                  return (
                    <div
                      key={product._id}
                      className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative min-w-[77%] snap-start sm:min-w-0"
                      style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => { const slug = slugify(product.productName); navigate(`/product-details/${slug}/${product._id}`); }}
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
                      {product.editionType && (
                        <div className="bg-white backdrop-blur-md text-[#6F4D34] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">
                          {product.editionType}
                        </div>
                      )}
                    </div>

                    {/* Heart Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleWishlist(product._id, e); }}
                      aria-label={likedProducts[product._id] ? "Remove from Wishlist" : "Add to Wishlist"}
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
                  <div className="flex flex-col flex-grow p-4 gap-3">
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
                            <img src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full" alt="Badge" width="16" height="16" />
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
                          {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                        • {product.reviewCount || 0} reviews
                      </span>
                      {hasDiscount && (
                        <div className="flex items-center justify-center bg-red-50 text-[#E74C3C] px-2 py-1 rounded-2xl border border-red-100/50 shadow-sm">
                          <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{discountPercent}% Save</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing & Discount */}
                    <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-2">
                          {hasDiscount && (
                            <span className="text-lg text-gray-500 line-through font-bold">
                              ₹{(product.marketPrice ?? 0).toLocaleString()}
                            </span>
                          )}
                              <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                ₹{(displayPrice ?? 0).toLocaleString()}
                              </span>
                      </div>
                    </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                          disabled={!product.quantity || product.quantity === 0}
                          aria-label="Add to Cart"
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
                            await addToCart(product._id);
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
        ) : (
          <div className="py-24 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6 text-gray-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No masterpieces found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Try adjusting your search or selected category to discover more incredible art.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
              className="text-[#6F4D34] font-bold hover:underline px-8 py-3 border-2 border-[#6F4D34] rounded-full transition-all hover:bg-[#6F4D34] hover:text-white"
            >
              Clear All Filters
            </button>
          </div>
          )}



        </div>
    </div>
  );
};

export default BrowseCategories;
