import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaEye } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';
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
          setOrders(data);
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

        console.log("ALL PRODUCTS LOADED FOR MERGE:", allProducts);

        const mergedOrders = orders.map((order) => {
          const mergedItems = order.items?.map((item) => {
            const productId = item.productId?._id || item.productId;

            const full = allProducts.find(
              (p) => String(p._id) === String(productId)
            );

            return {
              ...item,
              fullProduct: full || null,
            };
          });

          return {
            ...order,
            items: mergedItems,
          };
        });

        setOrders(mergedOrders);
      } catch (error) {
        console.error("Error merging products:", error);
      }
    };

    mergeOrderProducts();
  }, [orders.length]);

  const openImagePopup = (images = [], startIndex = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(startIndex);
    setShowPopup(true);
  };

  const closeImagePopup = () => {
    setShowPopup(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const cancelOrderInstant = async (orderIdParam) => {
    const id = orderIdParam || cancelOrderId;
    if (!id) return;

    try {
      const res = await putAPI(`/api/buyer-order-list/cancel/${id}`, {
        cancelReason: cancelReason || "Cancelled by user",
        cancelComment: cancelComment || "Cancelled by user",
      });

      console.log("ORDER CANCELLED:", res.data);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === id ? { ...o, orderStatus: "Cancelled" } : o
        )
      );

      setShowCancelModal(false);
      setCancelReason("");
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

  const handleDownloadInvoice = (e, order) => {
    e.stopPropagation();
    console.log("Download invoice for", order.orderId);
  };

if(loading)return <div><MyOrderSkeleton/></div>
  return (
    <>
      <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>

          <div className="text-sm flex items-center gap-2">
            <label htmlFor="sort" className="font-medium text-gray-700">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort"
                className="appearance-none border border-gray-300 rounded-full pl-6 pr-10 py-2 text-sm text-gray-700 transition"
              >
                <option value="">All</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-500">
            You don’t have any orders yet.
          </p>
        )}

        {/* show list of orders */}
        {!selectedOrder &&
          orders.map((order, index) => {
            const createdDate = new Date(
              order.createdAt || order.purchaseDate || Date.now()
            );
            const createdStr = createdDate.toLocaleDateString();

            const firstItem =
              order.items && order.items.length > 0 ? order.items[0] : null;

            // let firstImage = null;
            // if (firstItem) {
            //   if (
            //     firstItem.productId &&
            //     typeof firstItem.productId === "object"
            //   ) {
            //     firstImage =
            //       firstItem.productId.mainImage ||
            //       firstItem.productId.image ||
            //       null;
            //   } else {
            //     firstImage = firstItem.image || firstItem.mainImage || null;
            //   }
            // }
            //let firstImage = firstItem?.fullProduct?.mainImage || null;
            let firstImage = null;

            if (firstItem?.fullProduct?.mainImage) {
              firstImage = `${BASE_URL}${firstItem.fullProduct.mainImage}`;
            }

            const isCancelled = order.orderStatus === "Cancelled";
            const isDelivered = order.orderStatus === "Delivered";

            const deliveryDate = createdDate;
            const currentDate = new Date();
            const diffInDays = Math.floor(
              (currentDate - deliveryDate) / (1000 * 60 * 60 * 24)
            );
            const returnPolicyDays = 10;
            let actionType = "";
            if (!isDelivered) actionType = "cancel";
            else if (diffInDays <= returnPolicyDays) actionType = "return";
            else actionType = "chat";

            const imagesForPopup = (order.items || [])
              .map((it) => {
                if (it.productId && typeof it.productId === "object") {
                  return it.productId.mainImage
                    ? `${BASE_URL}/${it.productId.mainImage}`
                    : null;
                }
                return it.image ? `${BASE_URL}/${it.image}` : null;
              })
              .filter(Boolean);

            return (
              <div
                key={order._id || index}
                onClick={() => handleViewOrder(order)}
                className="block hover:no-underline cursor-pointer"
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition hover:shadow-md">
                  {/* Header */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#6F4D34] text-white text-sm font-medium p-3">
                    <div className="sm:border-r border-white/40">
                      Order ID
                      <br />
                      <span className="font-normal text-sm">
                        #{order.orderId || order.transactionId || "N/A"}
                      </span>
                    </div>

                    <div className="sm:border-r border-white/40">
                      Payment Method
                      <br />
                      <span className="font-normal text-sm">
                        {order.paymentMethod || "N/A"}
                      </span>
                    </div>

                    <div className="sm:border-r border-white/40">
                      Items
                      <br />
                      <span className="font-normal text-sm">
                        {(order.items && order.items.length) || 0}
                      </span>
                    </div>

                    <div>
                      Ordered On
                      <br />
                      <span className="font-normal text-sm">{createdStr}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={firstImage || DEFAULT_PROFILE_IMAGE}
                        alt={firstItem?.productId?.productName || "Product"}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />

                      <div>
                        <p className="text-sm font-semibold truncate max-w-[200px]">
                          {firstItem?.name ||
                            firstItem?.productId?.productName ||
                            "Untitled Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.Artist?.name
                            ? `Artist: ${order.Artist.name} ${
                                order.Artist?.lastName || ""
                              }`
                            : "Artist: Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {firstItem?.quantity
                            ? `Qty: ${firstItem.quantity}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-base font-semibold text-gray-800">
                        ₹{order.totalAmount || order.finalPrice || 0}
                      </p>
                    </div>

                    <div className="flex-1 text-right">
                      <p
                        className={`text-xs font-medium ${
                          isCancelled ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isCancelled
                          ? "Order Cancelled"
                          : isDelivered
                          ? `Delivered on ${createdStr}`
                          : "Not yet delivered"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isCancelled
                          ? "This order has been cancelled."
                          : isDelivered
                          ? "Your item has been delivered"
                          : "Awaiting delivery"}
                      </p>
                    </div>
                  </div>

                  {/* Footer - actions */}
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 px-3 py-3">
                    <div className="flex gap-2">
                      {!isCancelled && (
                        <>
                          <button
                            className="text-blue-600 text-sm font-medium border border-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
                            onClick={(e) => handleRateReview(e, order)}
                          >
                            Rate & Review Product
                          </button>

                          {/* <button
                            className="text-[#6F4D34] text-sm border border-[#6F4D34] px-4 py-1.5 rounded-full hover:bg-[#6F4D34]/10 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadInvoice(e, order);
                            }}
                          >
                            Download Invoice
                          </button> */}
                        </>
                      )}
                    </div>

                    {/* {isCancelled ? (
                      <button
                        className="text-red-600 text-sm font-medium border border-red-500 px-4 py-1.5 rounded-full bg-red-50 cursor-not-allowed"
                        disabled
                      >
                        Order Cancelled
                      </button>
                    ) : actionType === "cancel" ? (
                      <button
                        className="text-red-600 text-sm font-medium border border-red-500 px-4 py-1.5 rounded-full hover:bg-red-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelOrderId(order.orderId);
                          setShowCancelModal(true);
                        }}
                      >
                        Cancel Order
                      </button>
                    ) : actionType === "return" ? (
                      <button
                        className="text-blue-600 text-sm font-medium border border-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          console.log("Return order", order.orderId);
                        }}
                      >
                        Return Product
                      </button>
                    ) : (
                      <button
                        className="text-[#6F4D34] text-sm font-medium border border-[#6F4D34] px-4 py-1.5 rounded-full bg-[#6F4D34]/5 hover:bg-[#6F4D34]/10 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/contact-support");
                        }}
                      >
                        Chat with Us
                      </button>
                    )} */}
                    {isCancelled ? (
                      <button
                        className="text-red-600 text-sm font-medium border border-red-500 px-4 py-1.5 rounded-full bg-red-50 cursor-not-allowed"
                        disabled
                      >
                        Order Cancelled
                      </button>
                    ) : actionType === "cancel" ? (
                      <button
                        className="text-red-600 text-sm font-medium border border-red-500 px-4 py-1.5 rounded-full hover:bg-red-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelOrderId(order.orderId);
                          setShowCancelModal(true);
                        }}
                      >
                        Cancel Order
                      </button>
                    ) : actionType === "return" ? (
                      <button className="text-blue-600 text-sm font-medium border border-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-50 transition">
                        Return Product
                      </button>
                    ) : (
                      <button className="text-[#6F4D34] text-sm font-medium border border-[#6F4D34] px-4 py-1.5 rounded-full bg-[#6F4D34]/5 hover:bg-[#6F4D34]/10 transition">
                        Chat with Us
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Selected order detail view */}
        {selectedOrder && (
          <div className="mt-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              ← Back to Orders
            </button>
            <MyOrderView orderData={selectedOrder} />
          </div>
        )}
      </div>

      {/* Image popup modal */}
      {showPopup && (
        <div
          onClick={closeImagePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              height: "50%",
              backgroundColor: "#111",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              width: "80%",
            }}
          >
            <img
              src={currentImages[currentImageIndex]}
              alt="Popup"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>
      )}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px]">
            <h2 className="text-lg font-semibold mb-2">Cancel Order</h2>
            <p className="text-sm text-gray-600 mb-3">
              Why are you cancelling?
            </p>
 {/* Reason Dropdown */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
              >
                <option value="">-- Select a reason --</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found a better price">Found a better price</option>
                <option value="Shipping time too long">Shipping time too long</option>
                <option value="Other">Other</option>
              </select>

            <textarea
              className="w-full border rounded-lg p-2 text-sm"
              rows={3}
              placeholder="Enter cancellation reason..."
              value={cancelComment}
              onChange={(e) => setCancelComment(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={() => setShowCancelModal(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
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
