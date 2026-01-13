import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  ArrowLeft,
  Heart
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import postAPI from "../../../../../../../../api/postAPI";
import MyCartListSkeleton from "../../../../../../../../Component/Skeleton/Home/Account/MyCartListSkeleton.jsx";

const MyCartList = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await getAPI(`/api/cart/${userId}`);
      const safeItems = (res.data.items || []).filter(
        (i) => i && i.product !== null
      );
      setCart(safeItems);
    } catch (err) {
      console.log("Cart load error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const removeItem = async (productId) => {
    const cartItem = cart.find((item) => item.product._id === productId);
    const isBidWinnerItem = cartItem?.isBidWinnerItem === true;

    if (isBidWinnerItem) {
      const result = await Swal.fire({
        title: "Remove Bid Winner Product?",
        html: `
          <div style="text-align: left; padding: 10px 0;">
            <p style="margin-bottom: 15px; font-size: 16px; color: #333;">
              <strong>⚠️ Important Notice:</strong>
            </p>
            <ul style="margin-left: 20px; margin-bottom: 15px; color: #555;">
              <li style="margin-bottom: 10px;">This product cannot be recovered once removed</li>
              <li style="margin-bottom: 10px;">It will be automatically awarded to the next highest bidder</li>
              <li style="margin-bottom: 10px;">You will lose your winning bid status</li>
            </ul>
            <p style="color: #d32f2f; font-weight: bold;">
              Are you sure you want to proceed?
            </p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d32f2f",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Remove It",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        width: "500px",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await deleteAPI("/api/cart/remove", {
        params: { userId, productId }
      });

      setCart((prev) => prev.filter((i) => i.product._id !== productId));

      if (isBidWinnerItem) {
        Swal.fire({
          title: "Removed",
          text: "The product has been removed and will be awarded to the next highest bidder.",
          icon: "info",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.log("Remove error:", err);
      toast.error("Failed to remove item");
    }
  };

  const saveForLater = async (productId) => {
    try {
      // 1. Add to wishlist
      await postAPI("/api/wishlist/add", { userId, productId });
      
      // 2. Remove from cart
      await deleteAPI("/api/cart/remove", {
        params: { userId, productId }
      });

      // 3. Update local state
      setCart((prev) => prev.filter((i) => i.product._id !== productId));
      
      toast.success("Item moved to wishlist");
    } catch (err) {
      console.log("Save for later error:", err);
      toast.error("Failed to move item to wishlist");
    }
  };

  const updateQuantity = async (productId, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
      toast.warning(`Only ${stock} units available in stock`);
      return;
    }

    try {
      await postAPI("/api/cart/update", { userId, productId, quantity: qty }, false);
      setCart((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity: qty } : item
        )
      );
    } catch (err) {
      console.log("Qty update error:", err);
      const errorMessage = err.response?.data?.message || "Failed to update quantity";
      toast.error(errorMessage);
    }
  };

  const clearCart = async () => {
    const hasBidWinnerItems = cart.some((item) => item.isBidWinnerItem === true);

    if (hasBidWinnerItems) {
      const bidWinnerCount = cart.filter((item) => item.isBidWinnerItem === true).length;
      const result = await Swal.fire({
        title: "Clear Cart?",
        html: `
          <div style="text-align: left; padding: 10px 0;">
            <p style="margin-bottom: 15px; font-size: 16px; color: #333;">
              <strong>⚠️ Important Notice:</strong>
            </p>
            <p style="margin-bottom: 15px; color: #555;">
              Your cart contains <strong>${bidWinnerCount} bid winner product${bidWinnerCount > 1 ? 's' : ''}</strong>.
            </p>
            <ul style="margin-left: 20px; margin-bottom: 15px; color: #555;">
              <li style="margin-bottom: 10px;">Bid winner products cannot be recovered once removed</li>
              <li style="margin-bottom: 10px;">They will be automatically awarded to the next highest bidder</li>
              <li style="margin-bottom: 10px;">You will lose your winning bid status for these products</li>
            </ul>
            <p style="color: #d32f2f; font-weight: bold;">
              Are you sure you want to clear your entire cart?
            </p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d32f2f",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Clear Cart",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        width: "500px",
      });

      if (!result.isConfirmed) return;
    }

    try {
      for (const item of cart) {
        await deleteAPI("/api/cart/remove", {
          params: { userId, productId: item.product._id }
        });
      }
      setCart([]);
      if (hasBidWinnerItems) {
        Swal.fire({
          title: "Cart Cleared",
          text: "All items have been removed. Bid winner products will be awarded to the next highest bidders.",
          icon: "info",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        toast.success("Cart cleared successfully");
      }
    } catch (err) {
      console.log("Clear cart error:", err);
      toast.error("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
  };

  const calculateTotalMRP = () => {
    return cart.reduce((acc, item) => {
      const mrp = item.product.marketPrice || item.product.sellingPrice;
      return acc + (mrp * item.quantity);
    }, 0);
  };

  const calculateTotalItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const totalMRP = calculateTotalMRP();
  const totalSellingPrice = calculateTotal();
  const totalDiscount = totalMRP - totalSellingPrice;

  if (loading) return <MyCartListSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">We couldn't load your cart items. Please refresh the page or try again later.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#5C4033] text-white rounded-full hover:bg-[#4b3327] transition-colors">
          Retry Again
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-300">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Looks like you haven't added anything to your cart yet. Explore our collection and find something you love!</p>
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 px-8 py-3 bg-[#5C4033] text-white rounded-full hover:bg-[#4b3327] transition-all transform hover:scale-105">
          Continue Shopping
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          My Cart
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {calculateTotalItems()} {calculateTotalItems() === 1 ? 'item' : 'items'}
          </span>
        </h1>
        <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Shopping Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CART ITEMS SECTION */}
        <div className="lg:col-span-8 space-y-4">


            <div className="space-y-6">
              {cart.map((item) => (
                <div 
                  key={item.product._id} 
                  className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500"
                >
                  {item.isBidWinnerItem && (
                    <div className="absolute -top-3 left-6 z-10 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-lg shadow-orange-200 ring-4 ring-white">
                      Bid Won
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    {/* Image Container */}
                    <div className="relative group/img flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 p-3 transition-transform duration-500 group-hover:scale-105">
                        <img
                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.product.mainImage}`}
                          alt={item.product.productName}
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
                            {item.product.productName}
                          </h3>
                          <p className="text-sm font-medium text-gray-400 mt-1">
                            by <span className="text-gray-900 hover:text-blue-500 cursor-pointer transition-colors">{`${item.product.userId?.name || ""} ${item.product.userId?.lastName || ""}`.trim() || item.product.userId?.username || "Artist"}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-100">
                            {item.product.category}
                          </span>
                          {item.product.quantity > 0 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                              In Stock ({item.product.quantity})
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
                            ₹{item.product.sellingPrice.toLocaleString()}
                          </p>
                          {item.product.marketPrice && item.product.marketPrice > item.product.sellingPrice && (
                            <p className="text-xs text-gray-400 line-through font-medium">
                              ₹{item.product.marketPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                          <button
                            disabled={item.quantity <= 1 || item.isBidWinnerItem}
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.product.quantity)}
                            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${
                              item.quantity <= 1 || item.isBidWinnerItem
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'bg-white text-gray-600 shadow-sm hover:text-rose-500 active:scale-90'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                          <button
                            disabled={item.quantity >= item.product.quantity || item.isBidWinnerItem}
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.product.quantity)}
                            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${
                              item.quantity >= item.product.quantity || item.isBidWinnerItem
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'bg-white text-gray-600 shadow-sm hover:text-blue-500 active:scale-90'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => saveForLater(item.product._id)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group/btn shadow-sm hover:shadow-md active:scale-90"
                            title="Save for later"
                          >
                            <Heart className="w-5 h-5 group-hover/btn:fill-blue-600 transition-all" />
                          </button>
                          
                          <button 
                            onClick={() => removeItem(item.product._id)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 group/btn shadow-sm hover:shadow-md active:scale-90"
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

          <button 
            onClick={() => navigate('/store')} 
            className="group flex items-center gap-2 text-gray-600 hover:text-[#5C4033] font-semibold transition-colors pt-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </button>
        </div>

        {/* ORDER SUMMARY SECTION */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600">
                      <span>Total MRP</span>
                      <span className="font-semibold text-gray-900">₹{totalMRP.toLocaleString()}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount on MRP</span>
                        <span className="font-semibold">- ₹{totalDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Platform Handling</span>
                      <span className="text-green-600 font-bold text-xs uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Fee</span>
                      <span className="text-green-600 font-bold text-xs uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Free</span>
                    </div>
                    
                    <div className="h-px border-t border-dashed border-gray-200 my-4"></div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-black text-gray-900">
                        ₹{totalSellingPrice.toLocaleString()}
                      </span>
                    </div>

                    {totalDiscount > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100/50 shadow-sm">
                        <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5" />
                          <span>You will save ₹{totalDiscount.toLocaleString()} on this order</span>
                        </p>
                      </div>
                    )}
                  </div>


              <button 
                onClick={() => navigate(`/my-account/check-out/${userId}`)}
                className="w-full group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                Proceed to Checkout
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p>Secure payment processing with high-level encryption</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p>Reliable logistics partners for safe and timely delivery</p>
                </div>
              </div>
            </div>

            {/* Buyer Protection Badge */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-yellow-900 mb-1">Buyer Protection Guarantee</h4>
                <p className="text-xs text-yellow-800/80 leading-relaxed">
                  Your purchase is fully protected. Get the item you ordered or your money back.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCartList;
