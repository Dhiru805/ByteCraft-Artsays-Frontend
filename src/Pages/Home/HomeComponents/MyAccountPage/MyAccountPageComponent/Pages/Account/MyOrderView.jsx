import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import postAPI from "../../../../../../../api/postAPI"
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getAPI from "../../../../../../../api/getAPI";

const OrderView = () => {
  const currentStepIndex = 0.6;
  const [rating, setRating] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const order = location.state?.order;
  const isDelivered = order.OrderStatus === 'Delivered';
  const deliveryDate = order.DeliveredAt ? new Date(order.DeliveredAt) : null;
  const returnWindowDays = 7;
  const today = new Date();
  const isWithinReturnWindow = deliveryDate && (today - deliveryDate) / (1000 * 60 * 60 * 24) <= returnWindowDays;
  const canCancel = order.OrderStatus !== 'Delivered';
const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

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

  useEffect(() => {
    if (!order) {
      navigate("/my-account/my-orders");
      return;
    }

    window.scrollTo({ top: 400, behavior: "smooth" });

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
  }, [order, navigate]);

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

  return (

    <div className="min-h-screen px-4 py-8 rounded-3xl md:py-12 font-sans overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="group text-white border border-[#6F4D34] bg-[#6F4D34] px-3 py-1.5 rounded-md shadow-sm text-sm font-medium transition duration-200"
        >
          Back to Orders
        </button>
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-28 h-28 rounded-xl overflow-hidden border bg-gray-100 flex-shrink-0">
            <img src={imageUrl} alt={order.ProductName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{order.ProductName}</h1>
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

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Delivery Status</h3>
          <div className="relative flex flex-col sm:flex-row items-center sm:px-2 gap-4 sm:gap-0">
            <div className="absolute top-2 left-0 right-0 h-1 bg-gray-300 z-0 hidden sm:block" />
            {statusUpdates.map((status, index) => {
              const isCurrent = index <= currentStepIndex;
              return (
                <div key={index} className="relative z-10 flex flex-col items-center text-center flex-1 min-w-[80px]">
                  <div className={`w-5 h-5 rounded-full mb-2 border-2 ${isCurrent ? 'bg-[#6F4D34] border-[#6F4D34]' : 'bg-white border-gray-300'}`} />
                  <p className={`text-xs sm:text-sm ${isCurrent ? 'text-[#6F4D34] font-medium' : 'text-gray-500'}`}>{status.label}</p>
                  <span className="text-xs text-gray-400">{status.date}</span>
                </div>
              );
            })}
            <div
              className="absolute top-2 left-0 h-1 bg-[#6F4D34] z-10 transition-all duration-500 hidden sm:block"
              style={{
                width: `${(currentStepIndex / (statusUpdates.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="absolute top-4 right-4">
            <button className="text-xs sm:text-sm bg-[#6F4D34] text-white px-3 py-1.5 rounded-lg hover:bg-[#5b3f2a] transition whitespace-nowrap">
              Download Invoice
            </button>
          </div>

          <div className="flex flex-wrap gap-5 mt-6">
            {canCancel && (
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold">
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Delivery Address</h4>
            <div className="p-4 rounded-lg text-sm text-gray-700 space-y-1 leading-relaxed">
              <p>{order.BuyerSelectedAddress?.line1 || 'Address Line 1'}, {order.BuyerSelectedAddress?.line2 || ''}</p>
              <p>{order.BuyerSelectedAddress?.landmark || ''}</p>
              <p>{order.BuyerSelectedAddress?.city || 'City'}, {order.BuyerSelectedAddress?.state || 'State'} - {order.BuyerSelectedAddress?.pincode || ''}</p>
              <p className="font-semibold mt-2">{order.Buyer?.name || 'N/A'} <br />
                <span className="text-gray-500">{order.Buyer?.email || 'N/A'}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
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

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
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
                <label className="text-sm font-medium text-gray-700 block mb-1 ml-1">Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Enter a title for your review"
                  className="w-full border rounded-lg px-3 py-2 ml-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]"
                />
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
                        className="w-[200px] flex-shrink-0 relative bg-white rounded-xl shadow pl-2 pr-2 pb-2 pt-4 border border-gray-200"
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
                className="w-[99%] ml-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]"
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
    </div>
  );
};

export default OrderView;
