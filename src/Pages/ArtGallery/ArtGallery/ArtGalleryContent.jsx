import React, { useEffect, useState } from "react";
import { Heart, Search, ChevronRight, ChevronLeft, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import ArtGalleryContentSkeleton from "../../../Component/Skeleton/Home/Account/ArtGalleryContentSkeleton";
import "../../store/products/product.css";
import { getImageUrl } from '../../../utils/getImageUrl';

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

const ArtGalleryContent = () => {
  const [page, setPage] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const base = process.env.REACT_APP_API_URL;

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    sortBy: "New Arrivals",
    specialTags: [],
    priceRange: 89700,
    priceBuckets: [],
    size: [],
    mainCategory: [],
    category: [],
    subCategory: [],
    productType: [],
    productMedium: [],
    productMaterial: [],
    productEditionType: [],
    productSurfaceType: [],
    search: "",
  });
  const debouncedSearch = useDebounce(filters.search, 400); // 400ms debounce delay

  const [options, setOptions] = useState({
    categories: [],
    productTypes: [],
    productMediums: [],
    productMaterials: [],
    productEditionTypes: [],
    productSurfaceTypes: [],
    periodEras: [],
  });

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature, Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  const handleWishlist = async (productId) => {
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

  const addToCart = async (productId) => {
    if (!ensureBuyer()) return;
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
      fetchCart();
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const renderStars = (averageRating) => {
    if (averageRating == null) return [1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="text-gray-200 fill-gray-200" />);
    const filled = Math.round(averageRating);
    return [1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} className={s <= filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
    ));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, typeRes, mediumRes, materialRes, editionRes, surfaceRes, eraRes] = await Promise.all([
          getAPI("/api/all-complete", {}, true, false),
          getAPI("/api/getproducttype", {}, true, false),
          getAPI("/api/getproductmedium", {}, true, false),
          getAPI("/api/getproductmaterials", {}, true, false),
          getAPI("/api/getproducteditiontypes", {}, true, false),
          getAPI("/api/getproductsurfacetypes", {}, true, false),
          getAPI("/api/getperioderas", {}, true, false),
        ]);

        setOptions({
          categories: catRes?.data?.data?.flattened || [],
          productTypes: typeRes?.data || [],
          productMediums: mediumRes?.data || [],
          productMaterials: materialRes?.data || [],
          productEditionTypes: editionRes?.data || [],
          productSurfaceTypes: surfaceRes?.data || [],
          periodEras: eraRes?.data || [],
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError("");

      try {
        const cmsRes = await fetch(`${base}/api/CMS-artsays-gallery/published`);
        const cmsData = await cmsRes.json();

        if (!cmsData?.success || !cmsData?.data) {
          setError("No published gallery found.");
          setLoading(false);
          return;
        }

        setPage({
          title: cmsData.data.title,
          description: cmsData.data.description,
          sectionTitle: cmsData.data.sectionTitle,
          sectionDescription: cmsData.data.sectionDescription,
        });

        const galleryRes = await getAPI("/api/artsays-gallery/", {}, true, false);
        const galleryEntries = galleryRes?.data?.data || [];
        const allowedUserIds = new Set(galleryEntries.map((g) => String(g.userId)));

        const [artistRes, sellerRes, ratingRes, badgeRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
        ]);

        const artistProducts = artistRes?.data?.data?.filter((p) => p.status === "Approved") || [];
        const sellerProducts = sellerRes?.data?.data?.filter((p) => p.status === "Approved") || [];

        let collectedProducts = [...artistProducts, ...sellerProducts];
        collectedProducts = collectedProducts.filter((p) => {
          const productUserId = typeof p.userId === "object" ? p.userId._id : p.userId;
          return allowedUserIds.has(String(productUserId));
        });

        const ratings = ratingRes?.data?.data || [];
        const productsWithRatings = collectedProducts.map((product) => {
          const r = ratings.find((x) => x.productId === product._id);
          return {
            ...product,
            averageRating: r?.averageRating ? Number(r.averageRating) : null,
            reviewCount: r?.reviewCount ?? 0,
          };
        });

        const badgeData = badgeRes?.data?.data || [];
        const finalProducts = productsWithRatings.map((p) => {
          const match = badgeData.find((b) => b._id === p._id);
          return {
            ...p,
            seller: match?.seller || p.seller,
            badges: match?.badges || [],
          };
        });

        setAllProducts(finalProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [base]);

  useEffect(() => {
    let result = [...allProducts];

    if (debouncedSearch) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (p.userId?.name && p.userId.name.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (p.userId?.lastName && p.userId.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    if (filters.sortBy === "Price Low to High") result.sort((a, b) => (a.finalPrice) - (b.finalPrice));
    else if (filters.sortBy === "Price High to Low") result.sort((a, b) => (b.finalPrice) - (a.finalPrice));
    else if (filters.sortBy === "New Arrivals") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (filters.sortBy === "Trending") result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [allProducts, filters, debouncedSearch]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({ ...prev, [category]: value }));
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (page) => setCurrentPage(page);

  if (loading) return <ArtGalleryContentSkeleton />;

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      <div className="w-full max-w-[1440px] mx-auto p-3">
        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="w-full">
          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 font-bold text-center text-red-600 border border-red-200 bg-red-50 rounded-2xl">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mx-auto mb-8 group">
            <input
              type="text"
              placeholder="Search masterpieces, artists, or styles in our gallery..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full p-6 pl-4 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-[#6F4D34]/5 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
            />
          </div>

          {/* Products Grid */}
          <div className="mb-12">
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {currentProducts.map((product, index) => {
                  const displayPrice = product.finalPrice;
                  const hasDiscount = displayPrice < product.marketPrice;
                  const discountPercent = hasDiscount ? Math.round(((product.marketPrice - displayPrice) / product.marketPrice) * 100) : 0;
                  return (
                    <div
                      key={product._id}
                      className="group flex flex-col h-full bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => navigate(`/product-details/${slugify(product.productName)}/${product._id}`)}
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
                        <img
                          src={getImageUrl(product.mainImage)}
                          alt={product.productName}
                          className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${(!product.quantity || product.quantity === 0) ? 'blur-[2px]' : ''}`}
                        />
                        {(!product.quantity || product.quantity === 0) && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                            <div className="px-6 py-2 transform bg-white border rounded-lg shadow-2xl border-white/50 -rotate-12"><span className="text-xl font-black tracking-wider text-red-600 uppercase">Sold Out</span></div>
                          </div>
                        )}
                        <div className="absolute z-10 flex flex-col gap-2 top-5 left-5">
                          {product.editionType && (
                            <div className="bg-white backdrop-blur-md text-[#6F4D34] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">{product.editionType}</div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleWishlist(product._id); }}
                          className="absolute z-10 p-3 transition-all transform rounded-full shadow-sm top-5 right-5 bg-white/80 backdrop-blur-md hover:bg-white hover:text-red-500 hover:scale-110 group/heart"
                        >
                          <Heart size={20} className={`transition-colors ${likedProducts[product._id] ? "text-red-500 fill-red-500" : "text-gray-900 group-hover/heart:text-red-500"}`} />
                        </button>
                      </div>

                      <div className="flex flex-col flex-grow gap-4 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
                            <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">{product.userId?.name || "Independent Artist"}</span>
                          </div>
                          <div className="flex -space-x-2">
                            {product.badges?.map((img, idx) => (
                              <img key={idx} src={getImageUrl(img)} className="w-5 h-5 border-2 border-white rounded-full shadow-sm" alt="Badge" />
                            ))}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">{product.productName}</h3>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center px-2 py-1 border border-gray-100 bg-gray-50 rounded-xl">
                            <div className="flex items-center mr-2">{renderStars(product.averageRating)}</div>
                            <span className="text-xs font-black text-gray-900">{product.averageRating ? product.averageRating.toFixed(1) : "0.0"}</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">• {product.reviewCount || 0} reviews</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-50">
                          <div className="flex flex-col">
                            {hasDiscount && product.marketPrice != null && <span className="text-sm font-bold text-gray-400 line-through">₹{product.marketPrice.toLocaleString()}</span>}
                            <span className="text-2xl font-black tracking-tighter text-gray-900">₹{(displayPrice ?? 0).toLocaleString()}</span>
                          </div>
                          {hasDiscount && (
                            <div className="bg-red-50 text-[#E74C3C] px-3 py-1.5 rounded-2xl border border-red-100/50 shadow-sm"><span className="text-[10px] font-black uppercase tracking-tighter leading-none">{discountPercent}% OFF</span></div>
                          )}
                        </div>

                        {userType !== "Artist" && userType !== "Seller" && (
                          <div className="grid grid-cols-5 gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                              disabled={!product.quantity || product.quantity === 0}
                              className="col-span-1 h-[56px] bg-gray-50 text-gray-900 rounded-2xl hover:bg-[#6F4D34] hover:text-white transition-all duration-300 disabled:opacity-50 border border-gray-100 flex items-center justify-center group/cart shadow-sm"
                            >
                              <div className="relative">
                                <ShoppingCart size={22} className="transition-transform group-hover/cart:scale-110" />
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
                              className="col-span-4 h-[56px] bg-[#6F4D34] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-xl hover:bg-[#5a3e2a] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border border-[#6F4D34] transform active:scale-95"
                            >{(!product.quantity || product.quantity === 0) ? "Sold Out" : "Shop Now"}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
                <div className="inline-flex items-center justify-center w-24 h-24 mb-6 text-gray-300 rounded-full bg-gray-50"><Search size={48} /></div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">No masterpieces found</h3>
                <p className="max-w-sm mx-auto mb-8 text-gray-500">Try adjusting your search term to discover more incredible art from our gallery.</p>
                <button onClick={() => setFilters({ sortBy: "New Arrivals", specialTags: [], priceRange: 89700, priceBuckets: [], size: [], mainCategory: [], category: [], subCategory: [], productType: [], productMedium: [], productMaterial: [], productEditionType: [], productSurfaceType: [], search: "" })} className="text-[#6F4D34] font-bold hover:underline px-8 py-3 border-2 border-[#6F4D34] rounded-full transition-all">Clear Search</button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pb-12 mt-12">
              <nav className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-[32px] shadow-sm">
                <button disabled={currentPage === 1} onClick={goToPrevPage} className="p-4 text-gray-500 transition-colors rounded-2xl hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={28} /></button>
                <div className="flex items-center gap-1 px-4">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    if (totalPages > 7) {
                      if (pageNum !== 1 && pageNum !== totalPages && (pageNum < currentPage - 1 || pageNum > currentPage + 1)) {
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                        return null;
                      }
                    }
                    return (
                      <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-12 h-12 flex items-center justify-center rounded-2xl text-base font-bold transition-all ${pageNum === currentPage ? "bg-[#6F4D34] text-white shadow-lg shadow-[#6F4D34]/20 scale-110" : "text-gray-600 hover:bg-gray-50"}`}>{pageNum}</button>
                    );
                  })}
                </div>
                <button disabled={currentPage === totalPages} onClick={goToNextPage} className="p-4 text-gray-500 transition-colors rounded-2xl hover:bg-gray-50 disabled:opacity-30"><ChevronRight size={28} /></button>
              </nav>
            </div>
          )}

          {/* Bottom CMS Content */}
          {(page?.sectionTitle || page?.sectionDescription) && (
            <div className="mt-12 p-8 md:p-12 bg-[#6F4D34]/5 rounded-[48px] border border-[#6F4D34]/10 mb-12">
              {page.sectionTitle && <h2 className="text-2xl md:text-4xl font-black text-[#6F4D34] mb-6 tracking-tight">{page.sectionTitle}</h2>}
              {page.sectionDescription && <p className="text-lg font-medium leading-relaxed text-gray-700">{page.sectionDescription}</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArtGalleryContent;
