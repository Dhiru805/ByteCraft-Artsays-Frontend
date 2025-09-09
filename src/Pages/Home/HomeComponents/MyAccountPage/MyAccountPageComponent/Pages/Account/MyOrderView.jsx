import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import postAPI from "../../../../../../../api/postAPI"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import { motion, AnimatePresence } from "framer-motion";


const OrderView = () => {
  const currentStepIndex = 1;
  const [rating, setRating] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const order = location.state?.order;
  const isDelivered = order.OrderStatus === 'Delivered';
  const deliveryDate = order.DeliveredAt ? new Date(order.DeliveredAt) : null;
  const returnWindowDays = 7;
  const today = new Date();
  const isWithinReturnWindow = deliveryDate && (today - deliveryDate) / (1000 * 60 * 60 * 24) <= returnWindowDays;
  const canCancel = order.OrderStatus !== 'Delivered';
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  const orderId = order?.orderId;
  const [orderStatus, setOrderStatus] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');

  const handleSubmitReview = async () => {
    if (!reviewTitle || !reviewDescription || rating === 0) {
      toast.error('Please fill out all fields and select a rating.');
      return;
    }
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }
    if (uploadedFiles.length > 3) {
      toast.error('You can upload a maximum of 3 images.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.webp'];

    const invalidFiles = uploadedFiles.filter(file => {
      const typeIsValid = allowedTypes.includes(file.type);
      const extIsValid = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      return !(typeIsValid && extIsValid);
    });

    if (invalidFiles.length > 0) {
      if (invalidFiles.some(file => file.name.toLowerCase().endsWith('.jfif'))) {
        toast.error('Please upload JPG, JPEG, PNG, or WEBP files.');
      } else {
        toast.error('Invalid image format detected. Allowed formats: JPG, JPEG, PNG, WEBP.');
      }
      return;
    }

    const formData = new FormData();
    formData.append('userId', order?.Buyer?.id);
    formData.append('productId', order?._id);
    formData.append('rating', rating);
    formData.append('title', reviewTitle);
    formData.append('description', reviewDescription);

    uploadedFiles.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await postAPI('/api/reviews/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setHasSubmittedReview(true);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }

    try {
      setLoadingCancel(true);
      const response = await putAPI(`/api/updateorderstatus/${encodeURIComponent(orderId)}`, {
        status: "Cancelled",
        reason: cancelReason,
        comment: cancelComment,
        userId: order?.Buyer?.id,
      });

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        setShowCancelModal(false);
        navigate("/my-account/my-orders");
      } else {
        toast.error(response.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while cancelling.");
    } finally {
      setLoadingCancel(false);
    }
  };


  useEffect(() => {
    if (!order) {
      navigate("/my-account/my-orders");
      return;
    }

    window.scrollTo({ top: 400, behavior: "smooth" });
    if (location.state?.scrollToReview) {
      setTimeout(() => {
        const reviewSection = document.getElementById("review-section");
        if (reviewSection) {
          reviewSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }

    const fetchReview = async () => {
      try {
        const response = await getAPI(
          `/api/reviews/user-review`,
          {
            params: {
              userId: order?.Buyer?.id,
              productId: order?._id,
            },
          },
          true
        );

        if (response?.data?.success && response.data.review) {
          const { title, description, rating, photos } = response.data.review;

          setReviewTitle(title);
          setReviewDescription(description);
          setRating(rating);
          setHasSubmittedReview(true);

          const previewImages = photos.map((path) => ({
            previewUrl: `${BASE_URL}/${path}`,
            name: path.split("/").pop(),
            fromServer: true,
          }));

          setUploadedFiles(previewImages);
        }
      } catch (err) {
        console.log("No review found or error:", err.message);
      }
    };

    fetchReview();
  }, [order, navigate, location.state]);

  if (!order) return null;



  const imageUrl = order?.BuyerImage
    ? `${BASE_URL}/${order.BuyerImage.replace(/\\/g, '/')}`
    : '/images/placeholder.jpg';

  const statusUpdates = order.statusUpdates || [
    { label: 'Ordered', date: 'Jul 18' },
    { label: 'Packed', date: 'Jul 19' },
    { label: 'Shipped', date: 'Jul 20' },
    { label: 'Out for Delivery', date: 'Jul 21' },
    { label: 'Delivered', date: 'Jul 22' }
  ];

  const originalPrice = order.MaxBudget || 0;
  const finalPrice = order.ArtistNegotiatedBudgets?.[0] || originalPrice;
  const discount = originalPrice - finalPrice;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.filter(file => file.type.startsWith('image/'));

    if (newImages.length === 0) {
      alert("Please upload only image files.");
      return;
    }

    if (uploadedFiles.length + newImages.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    setUploadedFiles(prev => [...prev, ...newImages]);
  };

  const handleDeleteImage = (indexToDelete) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== indexToDelete));
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImages([imageUrl]); // just wrap the single image in an array
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1));
  };

  return (

    <div className="min-h-screen rounded-1xl font-sans overflow-hidden ml-3">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="group text-white border border-[#6F4D34] bg-[#6F4D34] 
             px-4 py-2 rounded-md shadow-sm text-sm font-medium transition 
             w-full sm:w-auto"
        >
          Back to Orders
        </button>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden border bg-gray-100 flex-shrink-0">
            <img
              onClick={() => handleImageClick(imageUrl)}
              src={imageUrl}
              alt={order.ProductName}
              className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">{order.ProductName}</h1>
            <p className="text-sm text-gray-600">Order ID : <span className="text-gray-800">{order.orderId}</span></p>
            <p className="text-sm text-gray-600">Order Date : <span className="text-gray-800">{order.createdAt}</span></p>
            <p className="text-sm text-gray-600">Seller : <span className="text-gray-800">{order.Artist?.name || "Seller Name"}</span></p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg sm:text-2xl font-semibold text-[#6F4D34]">₹{finalPrice}</p>
            <p className="text-sm text-gray-500 mt-1">Estimated Delivery</p>
            <p className="text-sm font-medium text-gray-800">Jul 20 - Jul 22</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 sm:p-6 relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Delivery Status</h3>

          {order.OrderStatus === "Cancelled" ? (
            <div className="flex flex-col items-center justify-center gap-6">

              <div className="w-full sm:w-2/3 text-center py-8 px-4">
                <p className="text-2xl font-bold text-red-600">Order Cancelled</p>
                <p className="text-sm text-gray-600 mt-2">
                  This order has been cancelled and is no longer in progress.
                </p>
              </div>

              <button className="bg-[#6F4D34] text-white px-5 py-2 rounded-lg hover:bg-[#5b3f2a] transition text-sm font-semibold">
                Chat with Us
              </button>
            </div>
          ) : (
            <>
              <div className="relative flex flex-col sm:flex-row items-center sm:px-2 gap-6 sm:gap-0">
                {/* Horizontal line for tablet/desktop */}
                <div className="absolute top-2 left-0 right-0 h-1 bg-gray-300 z-0 hidden sm:block" />
                {/* Vertical line for mobile */}
                <div className="absolute left-1 top-0 bottom-0 w-[2px] bg-gray-300 z-0 sm:hidden" />

                {statusUpdates.map((status, index) => {
                  const isCurrent = index < currentStepIndex;
                  const isActive = index === currentStepIndex;

                  return (
                    <div
                      key={index}
                      className="relative z-10 flex flex-col sm:flex-1 sm:items-center sm:text-center min-w-[80px] w-full sm:w-auto"
                    >
                      {/* Mobile layout */}
                      <div className="flex md:hidden items-start gap-3 relative w-full">

                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0
                    ${isCurrent ? 'bg-[#6F4D34] border-2 border-[#6F4D34]' : 'bg-gray-300'}`}>
                        </div>

                        <div className="flex flex-col text-left">
                          <p className={`text-[10px] leading-tight ${isCurrent ? 'text-[#6F4D34] font-medium' : 'text-gray-500'}`}>
                            {status.label}
                          </p>
                          <span className="text-[9px] text-gray-400">{status.date}</span>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden md:flex flex-col items-center text-center flex-1 min-w-[80px]">

                        <div className={`w-4 h-4 rounded-full border-2 mb-2 mt-0.5
                    ${isCurrent ? 'bg-[#6F4D34] border-[#6F4D34]' : 'bg-white border-gray-300'}`}>
                        </div>

                        <p className={`text-xs ${isCurrent ? 'text-[#6F4D34] font-medium' : 'text-gray-500'}`}>
                          {status.label}
                        </p>
                        <span className="text-[11px] text-gray-400">{status.date}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Horizontal progress (desktop only) */}
                <div
                  className="absolute top-2 left-0 h-1 bg-[#6F4D34] z-10 transition-all duration-500 hidden sm:block"
                  style={{
                    width: `${(currentStepIndex === statusUpdates.length
                      ? 100
                      : (currentStepIndex / (statusUpdates.length)) * 100)}%`,
                  }}
                />

                {/*  Vertical progress mobile only */}
                <div
                  className="absolute left-1 top-0 bg-[#6F4D34] z-10 transition-all duration-500 sm:hidden"
                  style={{
                    height: `${(currentStepIndex === statusUpdates.length
                      ? 100
                      : (currentStepIndex / (statusUpdates.length)) * 100)}%`,
                    width: "2px",
                  }}
                />
              </div>

              <div className="absolute top-4 right-4 hidden sm:block">
                <button className="text-xs sm:text-sm bg-[#6F4D34] text-white px-3 py-1.5 rounded-lg hover:bg-[#5b3f2a] transition whitespace-nowrap">
                  Download Invoice
                </button>
              </div>
              <div className="flex flex-wrap gap-5 mt-6">
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    Cancel Order
                  </button>
                )}
                {isDelivered && isWithinReturnWindow && (
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-semibold">
                    Return Order
                  </button>
                )}
                <button className="bg-[#6F4D34] text-white px-4 py-2 rounded-lg hover:bg-[#5b3f2a] transition text-sm font-semibold">
                  Chat with Us
                </button>

                <button className="sm:hidden bg-[#6F4D34] text-white px-4 py-2 rounded-lg hover:bg-[#5b3f2a] transition text-sm font-semibold">
                  Download Invoice
                </button>
              </div>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EBEBEB]">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Delivery Details</h4>
            <p className="font-semibold p-2">{order.Buyer?.name || 'N/A'} <br />
              <span className="text-gray-500 ">{order.Buyer?.email || 'N/A'}</span>
            </p>
            <div className="p-2 rounded-lg text-sm text-gray-700 space-y-1 leading-relaxed">
              <p>{order.BuyerSelectedAddress?.line1 || 'Address Line 1'}, {order.BuyerSelectedAddress?.line2 || ''}</p>
              <p>{order.BuyerSelectedAddress?.landmark || ''}</p>
              <p>{order.BuyerSelectedAddress?.city || 'City'}, {order.BuyerSelectedAddress?.state || 'State'} - {order.BuyerSelectedAddress?.pincode || ''}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EBEBEB]">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Price Details</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>List Price</span><span className="line-through text-gray-400">₹{originalPrice}</span></div>
              <div className="flex justify-between"><span>Selling Price</span><span>₹{finalPrice}</span></div>
              <div className="flex justify-between"><span>Special Discount</span><span className="text-green-600">-₹{discount}</span></div>
              <div className="flex justify-between"><span>Frame Included</span><span>{order.IsFramed ? 'Yes' : 'No'}</span></div>
              <div className="flex justify-between"><span>Payment Method</span><span>{order.PaymentTerm}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-[#6F4D34]"><span>Total Amount</span><span>₹{finalPrice}</span></div>
            </div>
          </div>
        </div>

        <div id="review-section" className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-[#EBEBEB]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-semibold text-gray-800">Rate Your Experience</h3>
            <div className="flex gap-1 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition-colors ${rating >= star ? 'text-[#6F4D34]' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 overflow-hidden transition-all duration-500 ease-in-out transform ${rating > 0 ? 'max-h-[1000px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="review-section grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Enter a title for your review"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {!hasSubmittedReview && (
                <div className="sm:mt-8">
                  <label htmlFor="photo-upload" className="inline-block cursor-pointer border border-[#6F4D34] text-white bg-[#6F4D34] hover:bg-[#5b3f2a] font-medium py-2 px-4 rounded-lg transition duration-200">
                    Upload Photo
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="sm:col-span-2 mt-3 text-sm text-gray-700">
                <div className="flex gap-4 flex-wrap">
                  {uploadedFiles.map((file, index) => {
                    const imageUrl = file.previewUrl || URL.createObjectURL(file);
                    const fileName = file.name || `Image ${index + 1}`;

                    return (
                      <div
                        key={index}
                        className="w-[200px] flex-shrink-0 relative bg-white rounded-xl pl-2 pr-2 pb-2 pt-4 border border-[#EBEBEB]"
                      >
                        <div className="absolute top-2 right-2">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm ml-2"
                            title="Delete"
                            onClick={() => handleDeleteImage(index)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>

                        </div>

                        <div className="mb-2 text-xs text-gray-700 space-y-0.5 truncate">
                          <p title={file.name}><strong>Name:</strong> {file.name?.slice(0, 10) + '...'}</p>
                          {file.type && <p><strong>Type:</strong> {file.type.split('/')[1]}</p>}
                          {file.size && <p><strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB</p>}
                        </div>

                        <img
                         onClick={() => handleImageClick(file.previewUrl || URL.createObjectURL(file))}
                          src={file.previewUrl || URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-[100px] object-cover rounded-md border"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1 ml-1">Description</label>
              <textarea
                rows="4"
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
                placeholder="Write your experience in detail..."
                className="w-[95%] ml-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]"
              ></textarea>
            </div>

            {!hasSubmittedReview && (
              <div className="sm:col-span-2 text-right">
                <button
                  onClick={handleSubmitReview}
                  className="bg-[#6F4D34] text-white px-5 py-2 rounded-lg hover:bg-[#5b3f2a] transition text-sm font-semibold"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCancelModal && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Cancel Order</h2>

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

              {/* Comment Box */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                rows="3"
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
                placeholder="Add any details (optional)"
                className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
              ></textarea>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm"
                >
                  Close
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={loadingCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold disabled:opacity-50"
                >
                  {loadingCancel ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              height: '70%',
              backgroundColor: '#111',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={currentImages[currentImageIndex]}
              alt="Popup"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderView;
