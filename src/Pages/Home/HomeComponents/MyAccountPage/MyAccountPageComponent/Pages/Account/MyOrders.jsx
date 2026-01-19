import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaEye, FaCalendarAlt, FaCreditCard, FaBox, FaExclamationCircle, FaCheckCircle, FaTruck, FaTimesCircle, FaShoppingBag } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';
import putAPI from '../../../../../../../api/putAPI';
import { DEFAULT_PROFILE_IMAGE } from './constant';
import MyOrderView from './MyOrderView';
import { useNavigate } from 'react-router-dom';
import { MyOrderSkeleton } from '../../../../../../../Component/Skeleton/Home/Account/MyOrderSkeleton';
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const res = await getAPI(`/api/buyer-order-list/buyer/${userId}`);
        const data = res?.data?.data;
        if (Array.isArray(data)) {
          const sortedOrders = [...data].sort((a, b) => 
            new Date(b.createdAt || b.purchaseDate || 0) - new Date(a.createdAt || a.purchaseDate || 0)
          );
          setOrders(sortedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const mergeOrderProducts = async () => {
      if (orders.length === 0) return;

      try {
        const [artistRes, sellerRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
        ]);

        const allProducts = [
          ...(artistRes.data?.data || []),
          ...(sellerRes.data?.data || []),
        ];

        const mergedOrders = orders.map((order) => {
          const mergedItems = order.items?.map((item) => {
            const productId = item.productId?._id || item.productId;
            const full = allProducts.find((p) => String(p._id) === String(productId));
            return { ...item, fullProduct: full || null };
          });
          return { ...order, items: mergedItems };
        });

        setOrders(mergedOrders);
      } catch (error) {
        console.error("Error merging products:", error);
      }
    };

    mergeOrderProducts();
  }, [orders.length]);

  // const openImagePopup = (images = [], startIndex = 0) => {
  //   setCurrentImages(images);
  //   setCurrentImageIndex(startIndex);
  //   setShowPopup(true);
  // };

  const closeImagePopup = () => {
    setShowPopup(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const cancelOrderInstant = async (orderIdParam) => {
    const id = orderIdParam || cancelOrderId;
    if (!id) return;
    if (!cancelReason) {
      alert("Please select a cancellation reason.");
      return;
    }
    if (!cancelComment.trim()) {
      alert("Please enter cancellation remarks.");
      return;
    }

    try {
      await putAPI(`/api/buyer-order-list/cancel/${id}`, {
        cancelReason,
        cancelComment,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === id ? { ...o, orderStatus: "Cancelled" } : o
        )
      );

      setShowCancelModal(false);
      setCancelReason("");
      setCancelComment("");
    } catch (err) {
      console.error("Cancel Error:", err);
    }
  };

  const handleViewOrder = (order) => {
    navigate("/my-account/my-orders/view", { state: { order } });
  };

  const handleRateReview = (e, order) => {
    e.stopPropagation();
    navigate("/my-account/my-orders/view", {
      state: { order, scrollToReview: true },
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: <FaTimesCircle className="text-red-500" />, label: 'Cancelled' };
      case 'Delivered':
        return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <FaCheckCircle className="text-emerald-500" />, label: 'Delivered' };
      case 'Processing':
        return { color: 'text-amber-600', bg: 'bg-amber-50', icon: <FaBox className="text-amber-500" />, label: 'Processing' };
      case 'In Transit':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <FaTruck className="text-blue-500" />, label: 'In Transit' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: <FaExclamationCircle className="text-gray-500" />, label: status || 'Pending' };
    }
  };

  if (loading) return <div><MyOrderSkeleton /></div>;

  return (
    <>
      <div className="w-full space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track your recent orders</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {orders.length} Orders
            </span>
            <div className="relative">
              <select
                id="sort"
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/20 transition shadow-sm"
              >
                <option value="">Sort: All Time</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <FaShoppingBag className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">No orders yet</h3>
            <p className="text-gray-500 mt-2 max-w-xs text-center">
              Looks like you haven't placed any orders. Start exploring our collection!
            </p>
            <button 
              onClick={() => navigate('/store')}
              className="mt-8 px-8 py-3 bg-[#6F4D34] text-white rounded-full font-semibold hover:bg-[#5a3e2a] transition shadow-lg shadow-[#6F4D34]/20"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {!selectedOrder && orders.map((order, index) => {
              const createdDate = new Date(order.createdAt || order.purchaseDate || Date.now());
              const createdStr = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
              
              let firstImage = null;
              if (firstItem?.fullProduct?.mainImage) {
                firstImage = `${BASE_URL}${firstItem.fullProduct.mainImage}`;
              }

              const isCancelled = order.orderStatus === "Cancelled";
              const isDelivered = order.orderStatus === "Delivered";
              const statusInfo = getStatusInfo(order.orderStatus);

              const deliveryDate = createdDate;
              const currentDate = new Date();
              const diffInDays = Math.floor((currentDate - deliveryDate) / (1000 * 60 * 60 * 24));
              const returnPolicyDays = 10;
              
              let actionType = "";
              if (!isDelivered && !isCancelled) actionType = "cancel";
              else if (isDelivered && diffInDays <= returnPolicyDays) actionType = "return";
              else actionType = "chat";

              return (
                <div
                  key={order._id || index}
                  onClick={() => handleViewOrder(order)}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#6F4D34]/20 cursor-pointer"
                >
                  {/* Card Header - Glassy look */}
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <FaCalendarAlt className="text-[#6F4D34]/60" /> Order Date
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{createdStr}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <FaCreditCard className="text-[#6F4D34]/60" /> Payment
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{order.paymentMethod || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <FaBox className="text-[#6F4D34]/60" /> Total Items
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{(order.items && order.items.length) || 0} Products</p>
                    </div>

                    <div className="space-y-1 md:text-right">
                      <div className="flex items-center md:justify-end gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Order ID
                      </div>
                      <p className="text-sm font-bold text-[#6F4D34]">#{order.orderId || order.transactionId || "N/A"}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="relative">
                          <img
                            src={firstImage || DEFAULT_PROFILE_IMAGE}
                            alt={firstItem?.productId?.productName || "Product"}
                            className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-300"
                          />
                          {order.items?.length > 1 && (
                            <div className="absolute -bottom-2 -right-2 bg-[#6F4D34] text-white text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white">
                              +{order.items.length - 1} More
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 truncate">
                            {firstItem?.name || firstItem?.productId?.productName || "Untitled Product"}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <p className="text-sm font-medium text-gray-500">
                              By <span className="text-gray-700">{order.Artist?.name ? `${order.Artist.name} ${order.Artist?.lastName || ""}` : "Unknown Artist"}</span>
                            </p>
                            {firstItem?.quantity && (
                              <p className="text-sm text-gray-400 font-medium">Qty: {firstItem.quantity}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:items-center gap-6 lg:gap-12">
                        <div className="lg:text-center">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price Paid</p>
                          <p className="text-xl font-extrabold text-gray-900">₹{order.totalAmount || order.finalPrice || 0}</p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full align-self-start ${statusInfo.bg} ${statusInfo.color} font-bold text-xs`}>
                            {statusInfo.icon}
                            <span>{statusInfo.label}</span>
                          </div>
                          <p className="text-[11px] font-medium text-gray-400">
                            {isCancelled ? "Return not available" : isDelivered ? "Successfully delivered" : "Arriving soon"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex gap-3">
                        {!isCancelled && (
                          <button
                            className="flex items-center text-nowrap gap-2 text-gray-700 text-sm font-bold bg-gray-50 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                            onClick={(e) => handleRateReview(e, order)}
                          >
                            Rate & Review
                          </button>
                        )}
                        <button
                          className="flex items-center gap-2 text-nowrap text-[#6F4D34] text-sm font-bold bg-[#6F4D34]/5 px-4 py-2.5 rounded-xl hover:bg-[#6F4D34]/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                          }}
                        >
                          <FaEye className="text-xs" /> View Details
                        </button>
                      </div>

                      <div>
                        {isCancelled ? (
                          <button
                            className="flex items-center gap-2 text-gray-400 text-sm font-bold bg-gray-50 px-4 py-2.5 rounded-xl cursor-not-allowed border border-gray-100"
                            disabled
                          >
                            <FaTimesCircle className="text-xs" /> Order Cancelled
                          </button>
                        ) : actionType === "cancel" ? (
                          <button
                            className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancelOrderId(order.orderId);
                              setShowCancelModal(true);
                            }}
                          >
                            Cancel Order
                          </button>
                        ) : actionType === "return" ? (
                          <button className="flex items-center gap-2 text-blue-600 text-sm font-bold bg-blue-50 px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
                            Return Product
                          </button>
                        ) : (
                          <button className="flex items-center gap-2 text-[#6F4D34] text-sm font-bold bg-[#6F4D34]/5 px-6 py-2.5 rounded-xl hover:bg-[#6F4D34]/10 transition-colors border border-[#6F4D34]/20">
                            Chat with Us
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedOrder && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setSelectedOrder(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold text-[#6F4D34] hover:underline"
            >
              ← Back to My Orders
            </button>
            <MyOrderView orderData={selectedOrder} />
          </div>
        )}
      </div>

      {showPopup && (
        <div
          onClick={closeImagePopup}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full h-[70vh] bg-black rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={currentImages[currentImageIndex]}
              alt="Popup"
              className="w-full h-full object-contain"
            />
            <button 
              onClick={closeImagePopup}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 flex justify-center items-center z-[999] p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 pt-8 pb-6">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <FaExclamationCircle className="text-red-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cancel Order</h2>
              <p className="text-gray-500 mt-2">
                We're sorry to see you go. Please let us know why you're cancelling this order.
              </p>
              
              <div className="mt-8 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reason for cancellation</label>
                  <div className="relative">
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/10 transition"
                    >
                      <option value="">Select a reason</option>
                      <option value="Ordered by mistake">Ordered by mistake</option>
                      <option value="Found a better price">Found a better price</option>
                      <option value="Shipping time too long">Shipping time too long</option>
                      <option value="Other">Other</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Remarks</label>
                  <textarea
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/10 transition resize-none"
                    rows={4}
                    placeholder="Tell us more (required)..."
                    value={cancelComment}
                    onChange={(e) => setCancelComment(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 flex gap-4">
              <button
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-white transition-colors"
                onClick={() => setShowCancelModal(false)}
              >
                Go Back
              </button>

              <button
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                onClick={() => cancelOrderInstant()}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
