import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  ClipboardCheck,
  Box,
  BadgeCheck,
  ArrowLeft,
  Truck,
  MapPin,
  User,
  Mail,
  CreditCard,
  Calendar,
  Tag,
  Store,
  Package,
  XCircle,
  CheckCircle2,
  ReceiptIndianRupee,
} from "lucide-react";
import { FaTruckFast } from "react-icons/fa6";
import { BsCheckLg } from "react-icons/bs";
import { getImageUrl } from "../../../../../../../utils/getImageUrl";

const BASE_URL = getImageUrl(null) || "";

const buildImageUrl = (path) => {
  if (!path) return "/images/placeholder.jpg";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.replace(/\\/g, "/");
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  if (BASE_URL) {
    const prefix = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${prefix}${withSlash}`;
  }
  return withSlash;
};

const TIMELINE_STEPS = [
  { label: "Order Placed", icon: ClipboardList },
  { label: "Accepted", icon: ClipboardCheck },
  { label: "In Progress", icon: Box },
  { label: "On the Way", icon: Truck },
  { label: "Delivered", icon: BadgeCheck },
];

const STATUS_TO_STEP = {
  Ordered: 0,
  "Payment Pending": 0,
  "Payment Received": 0,
  "Handling Time": 1,
  "Order Confirmed": 1,
  "Ready for Dispatch": 2,
  Shipped: 3,
  "Out for Delivery": 3,
  Delivered: 4,
  Completed: 4,
  "Return Requested": 4,
  "Refund Approved": 4,
};

const OrderStatus = ({ order, onBack }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState("");

  if (!order) return null;

  const orderStatus =
    order.orderStatus || order.OrderStatus || order.status || "Ordered";
  const isCancelled = orderStatus === "Cancelled";
  const activeStepIndex = isCancelled ? -1 : (STATUS_TO_STEP[orderStatus] ?? 0);

  const orderId = order.orderId || order._id || "—";
  const createdAt = order.createdAt || order.purchaseDate;
  const buyerName = order.Buyer?.name || "—";
  const buyerEmail = order.Buyer?.email || "—";
  const totalAmount = order.finalPrice || order.totalAmount || 0;
  const deliveryAddress =
    order.deliveryAddress || order.BuyerSelectedAddress || {};
  const sellerName = order.Artist?.name || "—";

  const items = (order.items || []).map((it) => {
    const fullProduct =
      it.fullProduct ||
      (it.productId && typeof it.productId === "object" ? it.productId : null) ||
      (it.resellProduct && typeof it.resellProduct === "object" ? it.resellProduct : null) ||
      (it.customProduct && typeof it.customProduct === "object" ? it.customProduct : null);
    return {
      title:
        it.name ||
        fullProduct?.productName ||
        fullProduct?.name ||
        fullProduct?.title ||
        "Product",
      owner: sellerName,
      image: buildImageUrl(
        fullProduct?.mainImage ||
          fullProduct?.image ||
          fullProduct?.images?.[0] ||
          it.image ||
          it.mainImage
      ),
      price: it.price || it.subtotal || 0,
      qty: it.quantity || it.qty || 1,
    };
  });

  if (items.length === 0) {
    items.push({
      title: order.ProductName || "Product",
      owner: sellerName,
      image: "/images/placeholder.jpg",
      price: totalAmount,
      qty: 1,
    });
  }

  const addressStr =
    deliveryAddress.line1
      ? `${deliveryAddress.line1}${deliveryAddress.line2 ? `, ${deliveryAddress.line2}` : ""}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`
      : "—";

  const handleImageClick = (src) => {
    setPopupImage(src);
    setShowPopup(true);
  };

  return (
    <div className="space-y-8 max-w-[1464px] px-0 sm:px-6 lg:px-12 pt-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-[#6F4D34] font-semibold hover:translate-x-[-4px] transition-transform duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Track Order</span>
      </button>

      {/* HEADER SECTION */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Product Image */}
          <div
            className="relative group cursor-pointer w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex-shrink-0"
            onClick={() => handleImageClick(items[0]?.image)}
          >
            <img
              src={items[0]?.image || "/images/placeholder.jpg"}
              alt={items[0]?.title || "Product"}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Order Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                  isCancelled
                    ? "bg-red-50 text-red-600"
                    : orderStatus === "Delivered"
                    ? "bg-green-50 text-green-600"
                    : "bg-[#FDF8F3] text-[#6F4D34]"
                }`}
              >
                {orderStatus}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {order.ProductName || items[0]?.title || "Order Details"}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Tag className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">
                  Order ID:{" "}
                  <span className="text-gray-900 font-bold">{orderId}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">
                  Date:{" "}
                  <span className="text-gray-900">
                    {createdAt
                      ? new Date(createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Store className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">
                  Seller:{" "}
                  <span className="text-gray-900">{sellerName}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">
                  Payment:{" "}
                  <span className="text-gray-900">
                    {order.paymentMethod || order.PaymentTerm || "—"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex flex-col items-center md:items-end justify-center min-w-[150px]">
            <p className="text-3xl sm:text-4xl font-black text-[#6F4D34] tracking-tight">
              ₹{totalAmount}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Total Amount
            </p>
          </div>
        </div>
      </motion.div>

      {/* DELIVERY STATUS TIMELINE */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <Truck className="w-6 h-6 text-[#6F4D34]" />
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Track Your Delivery
          </h3>
        </div>

        {isCancelled ? (
          <div className="bg-red-50 rounded-2xl p-8 flex flex-col items-center text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
            <h4 className="text-2xl font-bold text-red-700">Order Cancelled</h4>
            <p className="text-red-600/80 mt-2 max-w-md font-medium">
              This order has been cancelled and is no longer being processed.
            </p>
            {order.cancelReason && (
              <p className="text-red-600 text-sm mt-3 font-medium">
                Reason: {order.cancelReason}
              </p>
            )}
          </div>
        ) : (
          <div className="relative py-4 px-2">
            {/* Desktop horizontal progress line */}
            <div className="absolute top-[22px] left-8 right-8 h-1 bg-gray-100 rounded-full hidden sm:block" />
            <div
              className="absolute top-[22px] left-8 h-1 bg-[#6F4D34] rounded-full transition-all duration-1000 hidden sm:block"
              style={{
                width: `${
                  activeStepIndex >= 0
                    ? (activeStepIndex / (TIMELINE_STEPS.length - 1)) * 100
                    : 0
                }%`,
              }}
            />

            {/* Desktop horizontal + Mobile vertical layout */}
            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 relative">
              {TIMELINE_STEPS.map((step, index) => {
                const isActive = index <= activeStepIndex;
                const StepIcon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex sm:flex-col items-center gap-4 sm:gap-3 sm:flex-1 group"
                  >
                    <div
                      className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? "bg-[#6F4D34] text-white shadow-xl shadow-[#6F4D34]/30"
                          : "bg-gray-50 text-gray-300"
                      }`}
                    >
                      <StepIcon
                        className={`w-6 h-6 ${
                          isActive ? "scale-110" : "scale-100"
                        }`}
                      />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle2 className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:items-center text-left sm:text-center">
                      <p
                        className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* INFORMATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SHIPPING ADDRESS */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 tracking-tight">
              Shipping Address
            </h4>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                <User className="w-6 h-6 text-[#6F4D34]" />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-lg">
                  {buyerName}
                </p>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{buyerEmail}</span>
                </div>
              </div>
            </div>

            <div className="pl-4 border-l-2 border-[#6F4D34]/20 py-2 space-y-2">
              {deliveryAddress && deliveryAddress.line1 ? (
                <>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {deliveryAddress.line1}
                    {deliveryAddress.line2
                      ? `, ${deliveryAddress.line2}`
                      : ""}
                  </p>
                  {deliveryAddress.landmark && (
                    <p className="text-sm text-gray-500 italic">
                      Near {deliveryAddress.landmark}
                    </p>
                  )}
                  <p className="text-gray-900 font-bold">
                    {deliveryAddress.city}, {deliveryAddress.state} -{" "}
                    {deliveryAddress.pincode}
                  </p>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                    {deliveryAddress.country || "India"}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 italic">
                  No delivery address provided.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* CUSTOMER & PAYMENT DETAILS */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <ReceiptIndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 tracking-tight">
              Order Summary
            </h4>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-600">
                  Payment Mode
                </span>
              </div>
              <span className="text-sm font-black text-gray-900 uppercase">
                {order.paymentMethod || order.PaymentTerm || "Prepaid"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-600">Seller</span>
              </div>
              <span className="text-sm font-black text-gray-900">
                {sellerName}
              </span>
            </div>

            <div className="space-y-4 px-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-500 font-medium truncate mr-4">
                    {item.title}
                    {item.qty > 1 ? ` × ${item.qty}` : ""}
                  </span>
                  <span className="text-gray-900 font-bold flex-shrink-0">
                    ₹{item.price}
                  </span>
                </div>
              ))}

              <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-black text-gray-900">
                      Total Paid
                    </span>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                      All Taxes Included
                    </p>
                  </div>
                  <span className="text-3xl font-black text-[#6F4D34]">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PRODUCTS LIST */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 tracking-tight">
            Products
          </h4>
        </div>

        <div className="space-y-4">
          {items.map((product, idx) => (
            <div key={idx}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors gap-4">
                <div className="flex items-center space-x-4">
                  <div
                    className="relative group cursor-pointer w-20 h-20 rounded-xl overflow-hidden shadow-md border-2 border-white flex-shrink-0"
                    onClick={() => handleImageClick(product.image)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">
                      Owned by {product.owner}
                    </p>
                    {product.qty > 1 && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {product.qty}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-lg font-black text-[#6F4D34] sm:text-right">
                  ₹{product.price}
                </p>
              </div>
              {idx !== items.length - 1 && (
                <hr className="border-t border-gray-100 my-1" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* FULLSCREEN IMAGE VIEWER */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-12"
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <XCircle className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img
                src={popupImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderStatus;
