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
        <div className="w-[1208px] space-y-6 ">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>

                <div className="text-sm flex items-center gap-2">
                    <label htmlFor="sort" className="font-medium text-gray-700">
                        Sort by:
                    </label>
                    <div className="relative">
                        <select
                            id="sort"
                            className="appearance-none border-[0.6px] border-gray-300 rounded-full pl-6 pr-10 py-2 text-sm text-center text-gray-700 transition"
                        >
                            <option value="">All</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-xs pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Order Cards */}
            {orders.map((order, index) => (
                <div key={index} className="bg-white rounded-2xl  border mb-6 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-[#6F4D34] text-white grid grid-cols-4 md:grid-cols-4 gap-4 p-4 text-sm font-semibold">
                        <div className='border-r mr-4  '>Order ID<br /><span className="font-normal">#{order.id}</span></div>
                        <div className='border-r pl-8  ' >Payment Method<br /><span className="font-normal">{order.paymentMethod}</span></div>
                        <div className='border-r pl-8  ' >Transaction ID<br /><span className="font-normal">{order.transactionId}</span></div>

                        <div className='pl-8  '>
                            {order.status === 'Delivered' ? 'Delivery Date' : 'Estimated Delivery Date'}<br />
                            <span className="font-normal ">{order.deliveryDate}</span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b pb-4">
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
                    <div className=" flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center px-4 gap-3">
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${order.status === 'Accepted' ? 'px-3 bg-orange-100 text-orange-500 border-[0.6px] border-orange-500' :
                                    order.status === 'Delivered' ? 'px-3 bg-red-100 text-[#6F4D34] border-[0.6px] border-[#6F4D34] ' :
                                        'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {order.status}
                            </span>
                            <p className="text-sm">
                                Your Order has been {order.status}
                            </p>
                        </div>
                    </div>

                    <div className="px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left Side Buttons */}
                        <div className="flex gap-3 flex-wrap">
                            {order.status === 'Accepted' && (
                                <Link to="/my-account/track-your-order">
                                    <button className="bg-[#6F4D34] text-white px-4 py-2 rounded-full text-sm">
                                        Track Order
                                    </button>
                                </Link>)}
                            {order.status === 'Delivered' && (
                                <button className="bg-[#6F4D34] text-white px-4 py-2 rounded-full text-sm">Add Review</button>
                            )}
                            <button className="border border-[#6F4D34] text-[#6F4D34] px-4 py-2 rounded-full text-sm">Invoice</button>
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
