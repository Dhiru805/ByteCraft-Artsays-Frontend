import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import postAPI from "../../../../../../../api/postAPI";
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  CreditCard, 
  Star, 
  Trash2, 
  Upload, 
  MessageSquare, 
  XCircle, 
  Download,
  Clock,
  Store,
  Tag,
  ReceiptIndianRupee
} from "lucide-react";

const OrderView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("—");
  const [isReturnable, setIsReturnable] = useState(false);

  const buildImageUrl = (path) => {
    if (!path) return "/images/placeholder.jpg";
    if (/^https?:\/\//i.test(path)) return path;
    if (/^\/\//.test(path)) return `${window.location.protocol}${path}`;
    const normalized = path.replace(/\\/g, "/");
    const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
    if (BASE_URL) {
      const prefix = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
      return `${prefix}${withSlash}`;
    }
    return withSlash;
  };

  useEffect(() => {
    const fetchOrderIfNeeded = async () => {
      const buyerId = localStorage.getItem("userId");
      const stateOrder = location.state?.order;
      const orderIdFromUrl =
        params.orderId ||
        params.id ||
        new URLSearchParams(window.location.search).get("orderId") ||
        stateOrder?.orderId ||
        stateOrder?._id;

      if (!buyerId || !orderIdFromUrl) {
        // No API params available – fall back to location.state if present
        if (stateOrder) setOrder(stateOrder);
        setLoadingOrder(false);
        return;
      }
      setLoadingOrder(true);
      try {
        const res = await getAPI(`/api/buyer-order-list/${buyerId}/${orderIdFromUrl}`);
        if (res?.data?.data) {
          setOrder(res.data.data);
        } else if (stateOrder) {
          // API failed but we still have the state order
          setOrder(stateOrder);
        } else {
          toast.error("Unable to load order.");
        }
      } catch (err) {
        console.error("fetch error:", err);
        if (stateOrder) {
          setOrder(stateOrder);
        } else {
          toast.error("Failed to fetch order. Try again.");
        }
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchOrderIfNeeded();
  }, []);

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!order || !order.items) return;
      
      const firstItem = order.items[0];
      let actualProductId = null;
      
      if (firstItem) {
        if (firstItem.customProduct) {
          actualProductId = firstItem.customProduct._id || firstItem.customProduct;
        } else if (firstItem.productId) {
          actualProductId = firstItem.productId._id || firstItem.productId;
        } else if (firstItem.resellProduct) {
          actualProductId = firstItem.resellProduct._id || firstItem.resellProduct;
        }
      }
      
      if (!actualProductId) return;
      
      const userId = order?.Buyer?.id || localStorage.getItem("userId");
      if (!userId) return;
      
      try {
        const res = await getAPI(`/api/reviews/user-review?userId=${userId}&productId=${actualProductId}`);
        if (res?.data?.success && res.data.review) {
          const review = res.data.review;
          setExistingReview(review);
          setHasSubmittedReview(true);
          setRating(review.rating);
          setReviewTitle(review.title);
          setReviewDescription(review.description);
          if (review.photos && review.photos.length > 0) {
            setUploadedFiles(review.photos.map(p => ({ previewUrl: buildImageUrl(p), isExisting: true })));
          }
        }
      } catch (err) {
        // No existing review, that's fine
      }
    };
    
    fetchExistingReview();
  }, [order]);

  useEffect(() => {
    if (!order || !order.items) return;
    const fetchDeliveryEstimate = async () => {
      try {
        const productIds = order.items.map((it) => (it.productId?._id || it.productId || it._id)?.toString());
        const [buyerRes, sellerRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
        ]);
        const allProducts = [...(buyerRes?.data?.data || []), ...(sellerRes?.data?.data || [])];
      const matched = allProducts.find((p) => productIds.includes(p._id.toString()));

      // Check if any matched product is returnable
      const matchedProducts = allProducts.filter((p) => productIds.includes(p._id.toString()));
      const hasReturnable = matchedProducts.some((p) => p.returnPolicy === "Returnable");
      setIsReturnable(hasReturnable);

      if (!matched || !matched.estimatedDelivery) {
        setEstimatedDeliveryDate("—");
        return;
      }
        const range = matched.estimatedDelivery;
        const split = range.split("-");
        const days = parseInt(split[1]);
        const orderDate = new Date(order.purchaseDate || order.createdAt);
        const estimated = new Date(orderDate);
        estimated.setDate(orderDate.getDate() + days);
        const formatted = estimated.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        setEstimatedDeliveryDate(formatted);
      } catch (err) {
        console.error("Error in delivery estimate", err);
        setEstimatedDeliveryDate("—");
      }
    };
    fetchDeliveryEstimate();
  }, [order]);

  const unifiedItems = (order?.items || []).map((it) => {
    const fullProduct = it.fullProduct || it.productDetails || (it.productId && typeof it.productId === "object" ? it.productId : null);
    const isCustom = it.customProduct != null;
    const customProd = typeof it.customProduct === "object" ? it.customProduct : null;
    return {
      ...it,
      fullProduct,
      isCustomOrder: isCustom,
      mainImage: isCustom && customProd?.BuyerImage
        ? customProd.BuyerImage
        : (fullProduct && (fullProduct.mainImage || fullProduct.image)) || it.image || it.mainImage || null,
      name: it.name || (isCustom && customProd?.ProductName) || (fullProduct && (fullProduct.productName || fullProduct.name)) || "",
      qty: it.quantity || it.qty || it.count || 1,
      price: it.price || it.finalPrice || (fullProduct && fullProduct.finalPrice) || it.totalPrice || 0,
    };
  });

  const orderId = order?.orderId || order?._id || order?.transactionId;
  const rawOrderStatus = order?.orderStatus || order?.OrderStatus || order?.status;
  // Buyer-friendly label: show "Processing" instead of "Handling Time"
  const BUYER_STATUS_LABELS = {
    "Handling Time": "Processing",
  };
  const orderStatus = BUYER_STATUS_LABELS[rawOrderStatus] || rawOrderStatus;
  const createdAt = order?.createdAt || order?.purchaseDate || order?.created;
  const sellerName = order?.Artist?.name || order?.Artist?.id || order?.sellerName || order?.seller?.name;
  const deliveryAddress = order?.deliveryAddress || order?.BuyerSelectedAddress || order?.shippingAddress || {};

  const handleImageClick = (path) => {
    if (!path) return;
    setCurrentImages([buildImageUrl(path)]);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const handleCancelOrder = async () => {
    if (!orderId) {
      toast.error("Order ID not available");
      return;
    }
    if (!cancelReason) {
      toast.error("Please select a reason");
      return;
    }
    if (cancelReason === "Other" && !cancelComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      setLoadingCancel(true);
      const payload = { cancelReason, cancelComment };
      const res = await putAPI(`/api/buyer-order-list/cancel/${orderId}`, payload);
      if (res?.message) {
        toast.success(res.message);
        setOrder(prev => prev ? { ...prev, orderStatus: "Cancelled" } : prev);
        setShowCancelModal(false);
        navigate("/my-account/my-orders");
      } else {
        throw new Error("Cancellation failed");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error(err?.message || "Failed to cancel order. Try again.");
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTitle || !reviewDescription || rating === 0) {
      toast.error("Please fill out all fields and select a rating.");
      return;
    }
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (uploadedFiles.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    const firstItem = order?.items?.[0];
    let actualProductId = null;
    let productModelForReview = "Product";
    let productNameSnapshot = firstItem?.name || firstItem?.fullProduct?.productName || order?.ProductName || "";

    if (firstItem) {
      if (firstItem.customProduct) {
        actualProductId = firstItem.customProduct._id || firstItem.customProduct;
        productModelForReview = "BuyerRequest";
      } else if (firstItem.productId) {
        actualProductId = firstItem.productId._id || firstItem.productId;
        productModelForReview = "Product";
      } else if (firstItem.resellProduct) {
        actualProductId = firstItem.resellProduct._id || firstItem.resellProduct;
        productModelForReview = "BuyerResellProduct";
      }
    }

    if (!actualProductId) actualProductId = order?._id || "";

    const formData = new FormData();
    formData.append("userId", order?.Buyer?.id || "");
    formData.append("productId", actualProductId);
    formData.append("productModel", productModelForReview);
    if (productNameSnapshot) formData.append("productNameSnapshot", productNameSnapshot);
    formData.append("rating", rating);
    formData.append("title", reviewTitle);
    formData.append("description", reviewDescription);
    uploadedFiles.forEach((f) => formData.append("file", f));

    try {
      const res = await postAPI("/api/reviews/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.success) {
        toast.success("Review submitted successfully!");
        setHasSubmittedReview(true);
      } else {
        toast.error(res?.data?.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Review error:", err);
      toast.error("You have already submitted a review for this product.");
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.filter((file) => file.type && file.type.startsWith("image/"));
    if (newImages.length === 0) {
      toast.error("Please upload valid image files.");
      return;
    }
    if (uploadedFiles.length + newImages.length > 3) {
      toast.error("You can upload up to 3 images.");
      return;
    }
    setUploadedFiles((prev) => [...prev, ...newImages]);
  };

  const handleDeleteImage = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Number to words helper ──
  const numberToWords = (num) => {
    if (num === 0) return "Zero";
    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    const scales = ["","Thousand","Lakh","Crore"];
    const convert = (n) => {
      if (n === 0) return "";
      if (n < 20) return ones[n] + " ";
      if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
      return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    };
    // Indian numbering: last 3 digits, then groups of 2
    let result = "";
    const parts = [];
    let rem = Math.floor(num);
    parts.push(rem % 1000); rem = Math.floor(rem / 1000);
    while (rem > 0) { parts.push(rem % 100); rem = Math.floor(rem / 100); }
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] !== 0) result += convert(parts[i]) + scales[i] + " ";
    }
    return "INR " + result.trim() + " Only";
  };

  if (!order && loadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F4D34]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Order not found</h2>
        <p className="text-gray-500 mt-2">We couldn't find the details for this order.</p>
        <button onClick={() => navigate("/my-account/my-orders")} className="mt-6 px-6 py-2 bg-[#6F4D34] text-white rounded-xl hover:bg-[#5b3f2a] transition shadow-md">
          Back to My Orders
        </button>
      </div>
    );
  }

  // Map order statuses to timeline steps in order
  const TIMELINE_STEPS = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const STATUS_TO_STEP = {
    "Ordered": 0,
    "Payment Pending": 0,
    "Payment Received": 0,
    "Handling Time": 1,
    "Order Confirmed": 1,
    "Ready for Dispatch": 1,
    "Shipped": 2,
    "Out for Delivery": 3,
    "Delivered": 4,
    "Completed": 4,
    "Return Requested": 4,
    "Refund Approved": 4,
  };
  const activeStepIndex = STATUS_TO_STEP[rawOrderStatus] ?? 0;

  const statusUpdates = [
    { label: "Ordered", date: createdAt ? new Date(createdAt).toLocaleDateString() : "—", icon: Package },
    { label: "Packed", date: activeStepIndex >= 1 ? (order.PackedAt ? new Date(order.PackedAt).toLocaleDateString() : "—") : "—", icon: Clock },
    { label: "Shipped", date: activeStepIndex >= 2 ? (order.ShippedAt ? new Date(order.ShippedAt).toLocaleDateString() : "—") : "—", icon: Truck },
    { label: "Out for Delivery", date: activeStepIndex >= 3 ? (order.OutForDeliveryAt ? new Date(order.OutForDeliveryAt).toLocaleDateString() : "—") : "—", icon: Truck },
    { label: "Delivered", date: activeStepIndex >= 4 ? (order.DeliveredAt ? new Date(order.DeliveredAt).toLocaleDateString() : "—") : "—", icon: CheckCircle2 },
  ];

  const originalPrice = order.MaxBudget || 0;
    const negotiated = order.ArtistNegotiatedBudgets?.[0] || order.finalPrice || order.totalAmount || originalPrice;
    const discount = originalPrice - negotiated;

    // ── Invoice PDF generator ──
    const handleDownloadInvoice = () => {
      if (!order) return;
      const doc = new jsPDF("p", "mm", "a4");
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentW = pageW - margin * 2;
      let y = 12;

      const brown = [95, 64, 52];
      const darkGray = [51, 51, 51];
      const medGray = [100, 100, 100];
      const lightBg = [249, 246, 243];
      const white = [255, 255, 255];
      const lineColor = [220, 210, 200];

      // ── Header ──
      doc.setFillColor(...brown);
      doc.rect(0, 0, pageW, 32, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...white);
      doc.text("TAX INVOICE", margin, 16);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Original for Recipient", margin, 23);

      const invoiceNo = `INV/${orderId || "N/A"}`;
      const invoiceDate = createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`Invoice No: ${invoiceNo}`, pageW - margin, 14, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${invoiceDate}`, pageW - margin, 21, { align: "right" });

      y = 38;

      // ── Helper: draw a labeled section box ──
      const drawSectionBox = (startY, title, lines, x, w) => {
        const boxH = 6 + lines.length * 5.5;
        doc.setFillColor(...lightBg);
        doc.roundedRect(x, startY, w, boxH, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...brown);
        doc.text(title, x + 4, startY + 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...darkGray);
        lines.forEach((line, i) => {
          doc.text(line, x + 4, startY + 11 + i * 5.5);
        });
        return startY + 8 + lines.length * 5.5;
      };

    // ── Seller / Buyer Info (side by side) ──
    const halfW = (contentW - 4) / 2;
    const sellerAddr = order.Artist?.address || {};
    const sellerAddrLine = [sellerAddr.line1, sellerAddr.line2].filter(Boolean).join(", ") || "Artsays Platform";
    const sellerCityLine = [sellerAddr.city, sellerAddr.state].filter(Boolean).join(", ");
    const sellerPincode = sellerAddr.pincode || "";
    const sellerLabel = (order.Artist?.userType || "Artist").toUpperCase();
    const sellerLines = [
      `Name: ${order.Artist?.fullName || sellerName || "Artsays"}`,
      `Address: ${sellerAddrLine}`,
      sellerCityLine ? `City: ${sellerCityLine}${sellerPincode ? " - " + sellerPincode : ""}` : "",
      `Contact: ${order.Artist?.phone || "N/A"}`,
      `Email: ${order.Artist?.email || "N/A"}`,
      order.Artist?.gstin ? `GSTIN: ${order.Artist.gstin}` : "",
      order.Artist?.pan ? `PAN: ${order.Artist.pan}` : "",
    ].filter(Boolean);
      const buyerAddr = deliveryAddress;
      const buyerLines = [
        `Name: ${order.Buyer?.fullName || order.Buyer?.name || "N/A"}`,
        `Email: ${order.Buyer?.email || "N/A"}`,
        `Contact: ${order.Buyer?.phone || "N/A"}`,
        `Address: ${[buyerAddr.line1, buyerAddr.line2, buyerAddr.landmark].filter(Boolean).join(", ") || "N/A"}`,
        `City: ${buyerAddr.city || "N/A"}, State: ${buyerAddr.state || "N/A"} - ${buyerAddr.pincode || ""}`,
        `Country: ${buyerAddr.country || "India"}`,
        order.Buyer?.gstin ? `GSTIN: ${order.Buyer.gstin}` : "",
        order.Buyer?.pan ? `PAN: ${order.Buyer.pan}` : "",
      ].filter(Boolean);

      const sellerEndY = drawSectionBox(y, sellerLabel, sellerLines, margin, halfW);
      const buyerEndY = drawSectionBox(y, "BUYER / SHIP TO", buyerLines, margin + halfW + 4, halfW);
      y = Math.max(sellerEndY, buyerEndY) + 4;

      // ── Order Details row ──
      doc.setFillColor(...lightBg);
      doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...brown);
      const detailItems = [
        `Order No: ${orderId || "N/A"}`,
        `Payment: ${order.paymentMethod || order.PaymentTerm || "Prepaid"}`,
        `Transaction ID: ${order.transactionId || "N/A"}`,
        `Status: ${orderStatus}`,
      ];
      const detailSpacing = contentW / detailItems.length;
      detailItems.forEach((item, i) => {
        doc.text(item, margin + 4 + i * detailSpacing, y + 7.5);
      });
      y += 18;

      // ── Items Table ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...brown);
      doc.text("Order Items", margin, y);
      y += 3;

      const tableData = unifiedItems.map((item, idx) => [
        (idx + 1).toString(),
        item.name || "Product",
        (item.qty || 1).toString(),
        `Rs.${Number(item.price || 0).toLocaleString("en-IN")}`,
        `Rs.${Number((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}`,
      ]);

    autoTable(doc, {
      startY: y,
      head: [["#", "Item Description", "Qty", "Unit Price", "Amount"]],
      body: tableData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 4, textColor: darkGray, lineColor: lineColor, lineWidth: 0.2 },
      headStyles: { fillColor: brown, textColor: white, fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: [252, 250, 248] },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        1: { cellWidth: "auto" },
        2: { halign: "center", cellWidth: 18 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 32 },
      },
    });

    y = doc.lastAutoTable.finalY + 6;

      // ── Price Summary ──
      const summaryX = pageW - margin - 75;
      const summaryW = 75;
      doc.setFillColor(...lightBg);
      doc.roundedRect(summaryX, y, summaryW, 38, 2, 2, "F");

      const drawSummaryRow = (label, value, yPos, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(8);
        doc.setTextColor(...(bold ? brown : medGray));
        doc.text(label, summaryX + 4, yPos);
        doc.setTextColor(...(bold ? brown : darkGray));
        doc.text(value, summaryX + summaryW - 4, yPos, { align: "right" });
      };

      drawSummaryRow("Original Price", `Rs.${Number(originalPrice).toLocaleString("en-IN")}`, y + 7);
      drawSummaryRow("Discount", `- Rs.${Number(discount).toLocaleString("en-IN")}`, y + 14);
      drawSummaryRow("Framing", order.IsFramed ? "Included" : "N/A", y + 21);

      doc.setDrawColor(...lineColor);
      doc.setLineWidth(0.3);
      doc.line(summaryX + 4, y + 26, summaryX + summaryW - 4, y + 26);

      drawSummaryRow("TOTAL PAID", `Rs.${Number(negotiated).toLocaleString("en-IN")}`, y + 33, true);
      y += 46;

      // ── Amount in Words ──
      doc.setFillColor(...brown);
      doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...white);
      doc.text(`Amount in Words: ${numberToWords(negotiated)}`, margin + 4, y + 7.5);
      y += 20;

      // ── Authorized Signatory ──
      doc.setDrawColor(...lineColor);
      doc.setLineWidth(0.3);
      doc.line(pageW - margin - 55, y + 12, pageW - margin, y + 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...brown);
      doc.text("For Artsays", pageW - margin - 55, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...medGray);
      doc.text("Authorised Signatory", pageW - margin - 55, y + 18);

      // ── Footer ──
      const footerY = doc.internal.pageSize.getHeight() - 12;
      doc.setDrawColor(...lineColor);
      doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...medGray);
      doc.text("This is a computer-generated invoice and does not require a physical signature.", margin, footerY);
      doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, pageW - margin, footerY, { align: "right" });

      doc.save(`Artsays-Invoice-${orderId || "order"}.pdf`);
      toast.success("Invoice downloaded successfully!");
    };

    return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[#6F4D34] font-semibold hover:translate-x-[-4px] transition-transform duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Orders</span>
        </button>
        {orderStatus === "Delivered" && (
           <button 
             onClick={handleDownloadInvoice}
             className="flex items-center gap-2 text-sm bg-white border border-[#6F4D34] text-[#6F4D34] px-4 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm"
           >
           <Download className="w-4 h-4" />
           <span className="hidden sm:inline">Download Invoice</span>
         </button>
        )}
      </div>

      {/* HEADER SECTION */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative group cursor-pointer w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              onClick={() => handleImageClick(unifiedItems[0]?.mainImage)}
              src={buildImageUrl(unifiedItems[0]?.mainImage) || "/images/placeholder.jpg"}
              alt={unifiedItems[0]?.name || "Product"}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600' : 
                orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-[#FDF8F3] text-[#6F4D34]'
              }`}>
                {orderStatus}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {order.ProductName || unifiedItems[0]?.name || "Premium Artwork"}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Tag className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">Order ID: <span className="text-gray-900 font-bold">{orderId}</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">Date: <span className="text-gray-900">{createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Store className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">{order.Artist?.userType === "Seller" ? "Seller" : "Artist"}: <span className="text-gray-900">{order.Artist?.fullName || sellerName || "Artsays Official"}</span></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="w-4 h-4 text-[#6F4D34]" />
                <span className="text-sm font-medium">Delivery: <span className="text-[#6F4D34] font-bold">{estimatedDeliveryDate}</span></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center min-w-[150px]">
            <p className="text-3xl sm:text-4xl font-black text-[#6F4D34] tracking-tight">₹{negotiated}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Amount</p>
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
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">Track Your Delivery</h3>
        </div>

        {orderStatus === "Cancelled" ? (
          <div className="bg-red-50 rounded-2xl p-8 flex flex-col items-center text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
            <h4 className="text-2xl font-bold text-red-700">Order Cancelled</h4>
            <p className="text-red-600/80 mt-2 max-w-md font-medium">
              We're sorry! This order has been cancelled and is no longer being processed.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="flex items-center gap-2 bg-[#6F4D34] text-white px-8 py-3 rounded-2xl hover:bg-[#5b3f2a] transition font-bold shadow-lg shadow-[#6F4D34]/20">
                <MessageSquare className="w-5 h-5" />
                <span>Chat for Help</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative py-4 px-2">
            {/* PROGRESS LINE */}
            <div className="absolute top-[22px] left-8 right-8 h-1 bg-gray-100 rounded-full hidden sm:block" />
              <div 
                className="absolute top-[22px] left-8 h-1 bg-[#6F4D34] rounded-full transition-all duration-1000 hidden sm:block" 
                style={{ width: `${Math.max(0, activeStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
              />

            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 relative">
              {statusUpdates.map((status, index) => {
                const isActive = index <= activeStepIndex;
                const StatusIcon = status.icon;
                return (
                  <div key={index} className="flex sm:flex-col items-center gap-4 sm:gap-3 sm:flex-1 group">
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'bg-[#6F4D34] text-white shadow-xl shadow-[#6F4D34]/30' : 'bg-gray-50 text-gray-300'
                    }`}>
                      <StatusIcon className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'}`} />
                      {isActive && (
                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                           <CheckCircle2 className="w-2 h-2 text-white" />
                         </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:items-center text-left sm:text-center">
                      <p className={`text-sm font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {status.label}
                      </p>
                      <span className={`text-[11px] font-medium mt-0.5 ${isActive ? 'text-[#6F4D34]' : 'text-gray-400'}`}>
                        {status.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                {!["Delivered", "Cancelled", "Refund Approved", "Refund Initiated", "Refund Successful", "Completed"].includes(rawOrderStatus) && (
                    <button 
                      onClick={() => setShowCancelModal(true)} 
                      className="flex items-center gap-2 border-2 border-red-100 text-red-600 px-8 py-3 rounded-2xl hover:bg-red-50 transition-all font-bold group"
                    >
                      <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                {orderStatus === "Delivered" && isReturnable && (
                  <button className="flex items-center gap-2 border-2 border-blue-100 text-blue-600 px-8 py-3 rounded-2xl hover:bg-blue-50 transition-all font-bold">
                    <Package className="w-5 h-5" />
                    <span>Return Product</span>
                  </button>
                )}
                <button className="flex items-center gap-2 bg-[#6F4D34] text-white px-8 py-3 rounded-2xl hover:bg-[#5b3f2a] transition-all font-bold shadow-xl shadow-[#6F4D34]/30 group">
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Chat with Specialist</span>
                </button>
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
            <h4 className="text-xl font-bold text-gray-800 tracking-tight">Shipping Address</h4>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                <User className="w-6 h-6 text-[#6F4D34]" />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-lg">{order?.Buyer?.name || "Premium Customer"}</p>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{order?.Buyer?.email || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="pl-4 border-l-2 border-[#6F4D34]/20 py-2 space-y-2">
              {deliveryAddress && Object.keys(deliveryAddress).length > 0 ? (
                <>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {deliveryAddress.line1}
                    {deliveryAddress.line2 ? `, ${deliveryAddress.line2}` : ""}
                  </p>
                  {deliveryAddress.landmark && (
                    <p className="text-sm text-gray-500 italic flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Near {deliveryAddress.landmark}</span>
                    </p>
                  )}
                  <p className="text-gray-900 font-bold">
                    {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                  </p>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{deliveryAddress.country || 'India'}</p>
                </>
              ) : (
                <p className="text-gray-400 italic">No delivery address provided.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* PAYMENT & PRICE SUMMARY */}
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
            <h4 className="text-xl font-bold text-gray-800 tracking-tight">Price Summary</h4>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <CreditCard className="w-4 h-4 text-gray-400" />
                 <span className="text-sm font-bold text-gray-600">Payment Mode</span>
               </div>
               <span className="text-sm font-black text-gray-900 uppercase">{order.PaymentTerm || 'Prepaid'}</span>
            </div>

            <div className="space-y-4 px-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Original Value</span>
                <span className="text-gray-400 line-through font-bold">₹{originalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Selling Price</span>
                <span className="text-gray-900 font-bold">₹{negotiated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-extrabold">Member Discount</span>
                <span className="text-green-600 font-black">- ₹{discount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Premium Framing</span>
                <span className="text-gray-900 font-bold">{order.IsFramed ? "Included" : "Excluded"}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-black text-gray-900">Total Paid</span>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">All Taxes Included</p>
                  </div>
                  <span className="text-3xl font-black text-[#6F4D34]">₹{negotiated}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>

        {/* REVIEW SECTION - Only show when order is Delivered */}
          {orderStatus === "Delivered" && (
          <motion.div 
            id="review-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FDF8F3] rounded-[2.5rem] p-8 sm:p-12 border border-[#6F4D34]/10 shadow-inner"
          >
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-2">
                <Star className="w-8 h-8 text-[#6F4D34] fill-[#6F4D34]" />
              </div>
              <h3 className="text-3xl font-black text-gray-900">
                {hasSubmittedReview ? "Your Review" : "How was your experience?"}
              </h3>
              <p className="text-gray-600 font-medium">
                {hasSubmittedReview ? "Thank you for sharing your feedback!" : "Your feedback helps our community and artists grow."}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => !hasSubmittedReview && setRating(star)} 
                  disabled={hasSubmittedReview}
                  className={`transform transition-all duration-300 ${!hasSubmittedReview ? 'hover:scale-125' : ''} ${
                    rating >= star ? "text-[#6F4D34] drop-shadow-lg" : "text-gray-300"
                  }`}
                >
                  <Star className={`w-12 h-12 ${rating >= star ? "fill-[#6F4D34]" : "fill-transparent"}`} />
                </button>
              ))}
            </div>

          <AnimatePresence>
            {(rating > 0 || hasSubmittedReview) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-8 bg-white p-4 md:!p-8 rounded-[2rem] shadow-xl border border-gray-50"
              >
                {hasSubmittedReview && existingReview && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Review submitted on {new Date(existingReview.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-800 uppercase tracking-wider ml-1">Review Title</label>
                    <input 
                      type="text" 
                      value={reviewTitle} 
                      onChange={(e) => setReviewTitle(e.target.value)} 
                      disabled={hasSubmittedReview}
                      placeholder="e.g. Stunning Artwork!" 
                      className={`w-full p-3 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-[#6F4D34] transition-all placeholder:text-gray-300 ${hasSubmittedReview ? 'cursor-not-allowed opacity-80' : ''}`}
                    />
                  </div>

                  {!hasSubmittedReview && (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="photo-upload" className="flex items-center justify-center gap-3 w-full bg-[#6F4D34] text-white font-bold py-4 rounded-2xl hover:bg-[#5b3f2a] transition-all cursor-pointer shadow-lg shadow-[#6F4D34]/20 group">
                        <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        <span>Share Photos</span>
                      </label>
                      <input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                      <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">Up to 3 high-res images</p>
                    </div>
                  )}
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="flex gap-4 flex-wrap pb-4">
                    {uploadedFiles.map((file, index) => {
                      const imageUrl = file.previewUrl || (file instanceof File ? URL.createObjectURL(file) : buildImageUrl(file));
                      return (
                        <div key={index} className="relative group w-32 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                          <img src={imageUrl} alt="Review" className="w-full h-full object-cover" />
                          {!hasSubmittedReview && (
                            <button 
                              onClick={() => handleDeleteImage(index)} 
                              className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-800 uppercase tracking-wider ml-1">Your Experience</label>
                  <textarea 
                    rows="4" 
                    value={reviewDescription} 
                    onChange={(e) => setReviewDescription(e.target.value)} 
                    disabled={hasSubmittedReview}
                    placeholder="Tell us what you loved about this piece..." 
                    className={`w-full p-3 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-[#6F4D34] transition-all resize-none placeholder:text-gray-300 ${hasSubmittedReview ? 'cursor-not-allowed opacity-80' : ''}`}
                  ></textarea>
                </div>

                {!hasSubmittedReview && (
                  <div className="text-center pt-4">
                    <button 
                      onClick={handleSubmitReview} 
                      className="inline-flex items-center gap-3 bg-[#6F4D34] text-white px-12 py-4 rounded-[2rem] hover:bg-[#5b3f2a] transition-all font-black text-lg shadow-2xl shadow-[#6F4D34]/30 active:scale-95"
                    >
                      <span>Post Review</span>
                      <Star className="w-5 h-5 fill-white" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </motion.div>
        )}

        {/* MODALS & POPUPS */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[100] px-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-red-500" />
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Cancel Request</h2>
                <p className="text-gray-500 mt-2">Please tell us why you'd like to cancel this order.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-widest ml-1">Cancellation Reason</label>
                  <select 
                    value={cancelReason} 
                    onChange={(e) => setCancelReason(e.target.value)} 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-red-500 transition-all appearance-none"
                  >
                    <option value="">Choose a reason...</option>
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Found a better price">Found a better price</option>
                    <option value="Shipping time too long">Shipping time too long</option>
                    <option value="Other">Other Reasons</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-widest ml-1">Additional Comments</label>
                  <textarea 
                    rows="3" 
                    value={cancelComment} 
                    onChange={(e) => setCancelComment(e.target.value)} 
                    placeholder="Provide more context (optional)" 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-red-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowCancelModal(false)} className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition">
                    Nevermind
                  </button>
                  <button 
                    onClick={handleCancelOrder} 
                    disabled={loadingCancel} 
                    className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl hover:bg-red-700 transition font-black shadow-xl shadow-red-600/20 disabled:opacity-50"
                  >
                    {loadingCancel ? "Processing..." : "Confirm Cancel"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                src={currentImages[currentImageIndex]} 
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

export default OrderView;
