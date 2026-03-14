import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Heart,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import postAPI from "../../../../../../../../api/postAPI";
import MyCartListSkeleton from "../../../../../../../../Component/Skeleton/Home/Account/MyCartListSkeleton.jsx";

const WishlistTable = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [categoryData, setCategoryData] = useState({
    categories: [],
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToPage = (page) => { setCurrentPage(page); };

  const getCategoryById = useCallback((id) =>
    categoryData.categories.find((c) => String(c._id) === String(id)), [categoryData.categories]);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAPI(`/api/wishlist/${userId}`);
      const list = res?.data?.wishlist || [];

      const enriched = list.map((item) => {
        const catObj = getCategoryById(item.category);
        return {
          ...item,
          categoryName: catObj?.categoryName || "N/A",
        };
      });

      setWishlist(enriched);
    } catch (err) {
      console.log("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, getCategoryById]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAPI("/api/all-complete");
        const data = res?.data?.data || {};
        setCategoryData({
          categories: data.categories || [],
        });
      } catch (err) {
        console.log("Category load error:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryData.categories.length > 0) {
      fetchWishlist();
    }
  }, [categoryData.categories, fetchWishlist]);

  const removeItem = async (productId) => {
    try {
      await deleteAPI("/api/wishlist/remove", {
        params: { userId, productId },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.log("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const clearWishlist = async () => {
    const result = await Swal.fire({
      title: "Clear Wishlist?",
      text: "Are you sure you want to remove all items from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Clear It",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(true);
      for (const item of wishlist) {
        await deleteAPI("/api/wishlist/remove", {
          params: { userId, productId: item._id },
        });
      }
      setWishlist([]);
      toast.success("Wishlist cleared successfully");
    } catch (err) {
      console.log("Error clearing wishlist:", err);
      toast.error("Failed to clear wishlist");
    } finally {
      setActionLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      setActionLoading(true);
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      await deleteAPI("/api/wishlist/remove", { params: { userId, productId } });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Successfully added to cart");
    } catch (err) {
      console.log("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setActionLoading(false);
    }
  };

  const addAllToCart = async () => {
    if (wishlist.length === 0) return;
    
    try {
      setActionLoading(true);
      for (const item of wishlist) {
        await postAPI(`/api/cart/addcart/${item._id}`, {}, true);
        await deleteAPI("/api/wishlist/remove", {
          params: { userId, productId: item._id },
        });
      }
      setWishlist([]);
      toast.success("All items successfully added to cart");
    } catch (err) {
      console.log("Error adding all items:", err);
      toast.error("Failed to add all items to cart");
    } finally {
      setActionLoading(false);
    }
  };

  const calculateTotalValue = () => {
    return wishlist.reduce((acc, item) => acc + (item.finalPrice || item.sellingPrice || 0), 0);
  };

  if (loading) return <MyCartListSkeleton />;

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-300">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Save your favorite items to your wishlist and they will appear here.</p>
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 px-8 py-3 bg-[#5C4033] text-white rounded-full hover:bg-[#4b3327] transition-all transform hover:scale-105">
          Explore Products
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          My Wishlist
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
        </h1>
        <button 
          onClick={clearWishlist} 
          disabled={actionLoading}
          className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Wishlist</span>
        </button>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* WISHLIST ITEMS SECTION */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-6">
              {currentItems.map((item) => (
                <div 
                  key={item._id} 
                  className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    {/* Image Container */}
                    <div className="relative group/img flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 p-3 transition-transform duration-500 group-hover:scale-105">
                        <img
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.mainImage}`}
                          alt={item.productName}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                    </div>
                    
                    {/* Content Container */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {item.productName}
                          </h3>
                          <p className="text-sm font-medium text-gray-400 mt-1">
                            by <span className="text-gray-900 hover:text-blue-500 cursor-pointer transition-colors">
                              {item.userId ? `${item.userId.name || ""} ${item.userId.lastName || ""}`.trim() || item.userId.username || "Artist" : "Artist"}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-100">
                            {item.categoryName}
                          </span>
                          {item.quantity > 0 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></span>
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Controls */}
                      <div className="flex flex-wrap items-center justify-between md:justify-end gap-8 md:gap-12">
                        {/* Price */}
                          <div className="space-y-1 text-left md:text-right">
                            <p className="text-2xl font-black text-gray-900 tracking-tight">
                              ₹{(item.finalPrice || item.sellingPrice)?.toLocaleString()}
                            </p>
                          {item.marketPrice && item.marketPrice > item.sellingPrice && (
                            <p className="text-xs text-gray-400 line-through font-medium">
                              ₹{item.marketPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => addToCart(item._id)}
                            disabled={actionLoading || item.quantity === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-[#5C4033] text-white rounded-2xl font-bold hover:bg-[#4b3327] transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                          
                          <button 
                            onClick={() => removeItem(item._id)}
                            disabled={actionLoading}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 group/btn shadow-sm hover:shadow-md active:scale-90"
                            title="Remove"
                          >
                            <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* STYLISH PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <button
                    disabled={currentPage === 1}
                    onClick={goToPrevPage}
                    className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex items-center px-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      if (totalPages > 7) {
                        if (page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                          if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="px-1 text-gray-400">...</span>;
                          return null;
                        }
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === currentPage
                              ? "bg-[#5C4033] text-white shadow-md shadow-[#5C4033]/20"
                              : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={goToNextPage}
                    className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </nav>
              </div>
            )}

          <button 
            onClick={() => navigate('/store')} 
            className="group flex items-center gap-2 text-gray-600 hover:text-[#5C4033] font-semibold transition-colors pt-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </button>
        </div>

        {/* WISHLIST SUMMARY SECTION */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-semibold text-gray-900">{wishlist.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Total</span>
                  <span className="font-semibold text-gray-900">₹{calculateTotalValue().toLocaleString()}</span>
                </div>
                
                <div className="h-px border-t border-dashed border-gray-200 my-4"></div>
                
                <p className="text-sm text-gray-500 italic">
                  * Prices and availability are subject to change. Add items to your cart to secure them.
                </p>
              </div>

              <button 
                onClick={addAllToCart}
                disabled={actionLoading || wishlist.length === 0}
                className="w-full group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                Add All to Cart
                <ShoppingCart className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p>100% Authentic Art & Collectibles</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p>Global Shipping Available</p>
                </div>
              </div>
            </div>

            {/* Newsletter or Promo */}
            <div className="bg-gradient-to-br from-[#5C4033]/5 to-[#5C4033]/10 rounded-2xl p-6 border border-[#5C4033]/10">
              <h4 className="text-sm font-bold text-[#5C4033] mb-2">Special Offer!</h4>
              <p className="text-xs text-[#5C4033]/70 leading-relaxed mb-4">
                Don't wait! Some items in your wishlist are in high demand.
              </p>
              <button 
                onClick={() => navigate('/store')}
                className="text-xs font-bold text-[#5C4033] hover:underline flex items-center gap-1"
              >
                View more products <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistTable;
