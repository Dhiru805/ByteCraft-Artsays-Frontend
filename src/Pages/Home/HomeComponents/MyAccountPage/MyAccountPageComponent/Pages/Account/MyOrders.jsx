import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaEye } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';
import { DEFAULT_PROFILE_IMAGE } from './constant';
import MyOrderView from './MyOrderView';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const orders = [
    {
      id: 'SDGT1254FD',
      paymentMethod: 'Paypal',
      transactionId: 'TR5425SFE',
      deliveryDate: '29 June 2023',
      status: 'Accepted',
      items: [
        { name: 'img', price: 44.0, image: '/img1.jpg' },
        { name: 'img', price: 44.0, image: '/img2.jpg' },
        { name: 'img', price: 44.0, image: '/img3.jpg' },
      ],
    },
    {
      id: 'SDGT1254FD',
      paymentMethod: 'Paypal',
      transactionId: 'TR5425SFE',
      deliveryDate: '29 June 2023',
      status: 'Delivered',
      total: 44.0,
      items: [{ name: 'img', price: 44.0, image: '/img3.jpg' }],
    },
  ];

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const response = await getAPI('/api/getapprovedbuyerrequests');
        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          console.log(response.data.data);
        } else {
          setProducts([]);
        }
        console.log('Approved products:', response.data.data);
      } catch (error) {
        console.error('Failed to fetch approved products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedProducts();
  }, []);

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

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">You don’t have any orders yet.</p>
        )}

        {!selectedOrder &&
          products.map((item, index) => {
            const deliveryDate = new Date(item.createdAt);
            const deliveryDateStr = deliveryDate.toLocaleDateString();
            const imageUrl = item.BuyerImage
              ? `${BASE_URL}/${item.BuyerImage.replace(/\\/g, '/')}`
              : DEFAULT_PROFILE_IMAGE;
            const price = item.ArtistNegotiatedBudgets?.[0] || '0';
            const isDelivered = item.Status?.toLowerCase() === 'Delivered';
            const isCancelled = item.OrderStatus === 'Cancelled';
            const returnPolicyDays = 10;

            const currentDate = new Date();
            const diffInDays = Math.floor(
              (currentDate - deliveryDate) / (1000 * 60 * 60 * 24)
            );
            let actionType = '';
            if (!isDelivered) {
              actionType = 'cancel';
            } else if (diffInDays <= returnPolicyDays) {
              actionType = 'return';
            } else {
              actionType = 'chat';
            }

            return (
              <div
                key={item._id || index}
                onClick={() => navigate('/my-account/my-orders/view', { state: { order: item } })}
                className="block hover:no-underline cursor-pointer"
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition hover:shadow-md">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#6F4D34] text-white text-sm font-medium p-3">
                    <div className="sm:border-r border-white/40">
                      Order ID<br />
                      <span className="font-normal text-sm">#{item.orderId || 'N/A'}</span>
                    </div>
                    <div className="sm:border-r border-white/40">
                      Payment Method<br />
                      <span className="font-normal text-sm">{item.PaymentTerm || 'N/A'}</span>
                    </div>
                    <div className="sm:border-r border-white/40">
                      Artist<br />
                      <span className="font-normal text-sm">
                        {item.Artist?.name || item.Artist?.id || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      Delivered on<br />
                      <span className="font-normal text-sm">{deliveryDateStr}</span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={imageUrl}
                        alt={item.ProductName}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="text-sm font-semibold truncate max-w-[200px]">
                          {item.ProductName || 'Untitled Product'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {item.Size || 'Free'} | Frame: {item.IsFramed ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

 <div className="flex-1 text-center">
                      {!isCancelled && (
                        <p className="text-base font-semibold text-gray-800">₹{price}</p>
                      )}
                    </div>

                    <div className="flex-1 text-right">
                      <p className={`text-xs font-medium ${isCancelled ? 'text-red-600' : 'text-green-600'}`}>
                        {isCancelled
                          ? 'Order Cancelled'
                          : isDelivered
                          ? `Delivered on ${deliveryDateStr}`
                          : 'Not yet delivered'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isCancelled
                          ? 'This order has been cancelled.'
                          : isDelivered
                          ? 'Your item has been delivered'
                          : 'Awaiting delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 px-3 py-3">
                    <div className="flex gap-2">
                      {/* ✅ Hide Rate & Review and Download Invoice if cancelled */}
                      {!isCancelled && (
                        <>
                          <button
                            className="text-blue-600 text-sm font-medium border border-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/my-account/my-orders/view', {
                                state: { order: item, scrollToReview: true }
                              });
                            }}
                          >
                            Rate & Review Product
                          </button>
                          <button className="text-[#6F4D34] text-sm border border-[#6F4D34] px-4 py-1.5 rounded-full hover:bg-[#6F4D34]/10 transition">
                            Download Invoice
                          </button>
                        </>
                      )}
                    </div>

                    {isCancelled ? (
                      <button className="text-red-600 text-sm font-medium border border-red-500 px-4 py-1.5 rounded-full bg-red-50 cursor-not-allowed" disabled>
                        Order Cancelled
                      </button>
                    ) : actionType === 'cancel' ? (
                      <button 
                      className="text-red-600 text-sm font-medium border border-red-500 px-4 py-1.5 rounded-full hover:bg-red-100 transition">
                        Cancel Order
                      </button>
                    ) : actionType === 'return' ? (
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

      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
              height: '50%',
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
    </>
  );
};

export default MyOrders;
