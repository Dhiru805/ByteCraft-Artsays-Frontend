import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const MyOrders = () => {
    const orders = [
        {
            id: 'SDGT1254FD',
            paymentMethod: 'Paypal',
            transactionId: 'TR5425SFE',
            deliveryDate: '29 June 2023',
            status: 'Accepted',
            items: [
                { name: 'img', price: 44.00, image: '/img1.jpg' },
                { name: 'img', price: 44.00, image: '/img2.jpg' },
                { name: 'img', price: 44.00, image: '/img3.jpg' }
            ]
        },
        {
            id: 'SDGT1254FD',
            paymentMethod: 'Paypal',
            transactionId: 'TR5425SFE',
            deliveryDate: '29 June 2023',
            status: 'Delivered',
            total: 44.00,
            items: [
                { name: 'img', price: 44.00, image: '/img3.jpg' }
            ]
        }
    ];

    return (
        <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
            {/* Header */}
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

            {/* Order Cards */}
            {orders.map((order, index) => (
                <div key={index} className="bg-white rounded-2xl border mb-6 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-[#6F4D34] text-white grid grid-cols-1 md:grid-cols-4 gap-4 p-4 text-sm font-semibold">
                        <div className="border-b md:border-b-0 md:border-r md:pr-4">
                            Order ID<br />
                            <span className="font-normal">#{order.id}</span>
                        </div>
                        <div className="border-b md:border-b-0 md:border-r md:pl-4 md:pr-4">
                            Payment Method<br />
                            <span className="font-normal">{order.paymentMethod}</span>
                        </div>
                        <div className="border-b md:border-b-0 md:border-r md:pl-4 md:pr-4">
                            Transaction ID<br />
                            <span className="font-normal">{order.transactionId}</span>
                        </div>
                        <div className="md:pl-4">
                            {order.status === 'Delivered' ? 'Delivery Date' : 'Estimated Delivery Date'}<br />
                            <span className="font-normal">{order.deliveryDate}</span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                                <div className="flex gap-3 items-center">
                                    <img
                                        src={item.image || '/placeholder.jpg'}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 p-[2px] shrink-0"
                                    />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">1 Qty.</p>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Status and Action Buttons */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 pb-4">
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-xs px-3 py-1 rounded-full ${
                                    order.status === 'Accepted'
                                        ? 'bg-orange-100 text-orange-500 border border-orange-500'
                                        : order.status === 'Delivered'
                                        ? 'bg-red-100 text-[#6F4D34] border border-[#6F4D34]'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {order.status}
                            </span>
                            <p className="text-sm">Your Order has been {order.status}</p>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="px-4 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left Side Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {order.status === 'Accepted' && (
                                <Link to="/my-account/track-your-order">
                                    <button className="bg-[#6F4D34] text-white px-4 py-2 rounded-full text-sm">
                                        Track Order
                                    </button>
                                </Link>
                            )}
                            {order.status === 'Delivered' && (
                                <button className="bg-[#6F4D34] text-white px-4 py-2 rounded-full text-sm">
                                    Add Review
                                </button>
                            )}
                            <button className="border border-[#6F4D34] text-[#6F4D34] px-4 py-2 rounded-full text-sm">
                                Invoice
                            </button>
                        </div>

                        {/* Right Side Cancel Button */}
                        {order.status === 'Accepted' && (
                            <div className="flex justify-end">
                                <button className="text-red-500 text-sm font-semibold">Cancel Order</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;
