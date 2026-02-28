// import React from "react";
// import { GoCheck } from "react-icons/go";

// const products = [
//   {
//     id: 1,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     image: "https://i.imgur.com/A1eDB3M.png",
//   },
//   {
//     id: 2,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     image: "https://i.imgur.com/Ci1YZ4X.png",
//   },
//   {
//     id: 3,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     image: "https://i.imgur.com/EX3Z8Zz.png",
//   },
// ];

// const OrderCompleted = () => {
//   return (
//     <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 space-y-8 text-[15px] text-lg">
//       {/* Order Complete Header */}
//       <div className="text-center space-y-4">
//         <div className="w-12 h-12 mx-auto rounded-full bg-[#5C4033] flex items-center justify-center">
//           <GoCheck className="text-white text-3xl font-bold" />
//         </div>
//         <h2 className="text-[20px] font-semibold text-xl">Your order is completed</h2>
//         <p className="text-gray-500 text-sm">Thank you. Your Order has been received</p>
//       </div>

//       {/* Order Info Box */}
//       <div className="bg-yellow-200 p-12 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 ">
//         {/* Grid Info */}
//         <div className="grid grid-cols-2 md:grid-cols-4 w-full font-medium text-center divide-x divide-gray-300 pr-2">
//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Order ID</p>
//             <p className="text-black font-semibold">#SDGTI254FD</p>
//           </div>
//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Payment Method</p>
//             <p className="text-black font-semibold">Paypal</p>
//           </div>
//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Transaction ID</p>
//             <p className="text-black font-semibold">TR542SSFE</p>
//           </div>
//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Estimated Delivery Date</p>
//             <p className="text-black font-semibold">29 June 2023</p>
//           </div>
//         </div>

//         {/* Button */}
//         <div className="lg:pr-[55px]">
//           <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm px-6 py-2 rounded-full self-center md:self-auto whitespace-nowrap">
//             Download Invoice
//           </button>
//         </div>
//       </div>



//       {/* Order Details */}
//       <div className="border border-gray-200 rounded-2xl p-6 text-sm bg-white">
//         <h3 className="text-[17px] font-semibold mb-4 text-xl">Order Details</h3>
//         <hr className="py-3" />

//         {/* Products */}
//         <div className="border-b border-gray-200 pb-4 mb-4">
//           <div className="flex justify-between font-medium mb-2">
//             <p>Products</p>
//             <p>Sub Total</p>
//           </div>
//           <div className="space-y-2">
//             {products.map((item) => (
//               <div key={item.id} className="flex items-center justify-between">
//                 <div className="flex gap-3 items-center py-3">
//                   <img
//                     src={item.image}
//                     alt={item.title}
//                     className="w-16 h-16 rounded-xl object-cover border border-gray-300 p-2"
//                   />
//                   <div>
//                     <p className="font-medium text-gray-800">{item.title}</p>
//                     <p className="text-xs text-gray-500">Owned by {item.owner}</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-800 font-medium">${item.price.toFixed(2)}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Price Summary */}
//         <div className="space-y-4 text-lg font-semibold">
//           <div className="flex justify-between">
//             <p>Shipping</p>
//             <p>$00.00</p>
//           </div>
//           <div className="flex justify-between">
//             <p>Tax</p>
//             <p>$00.00</p>
//           </div>
//           <div className="flex justify-between ">
//             <p>Coupon Discount</p>
//             <p>- $10.00</p>
//           </div>
//           <hr className="my-3" />
//           <div className="flex justify-between ">
//             <p>Total</p>
//             <p>$44.00</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderCompleted;





// import React, { useEffect, useState } from "react";
// import { GoCheck } from "react-icons/go";
// import { useLocation } from "react-router-dom";
// import getAPI from "../../../../../../../../api/getAPI";

// const OrderCompleted = () => {
//   const { state } = useLocation();
//   const order = state?.order;
//   const purchasedItems = state?.items || [];

//   const [productDetails, setProductDetails] = useState([]);

//   const BASE_IMAGE = process.env.REACT_APP_API_URL_FOR_IMAGE;

//   const calculateDeliveryDate = (range) => {
//     if (!range) return "N/A";
//     const parts = range.split("-");
//     const maxDays = Number(parts[1] || parts[0]);
//     const d = new Date();
//     d.setDate(d.getDate() + maxDays);
//     return d.toLocaleDateString();
//   };

//   const fetchProducts = async () => {
//     try {
//       const [artistRes, sellerRes] = await Promise.all([
//         getAPI("/api/getstatusapprovedproduct"),
//         getAPI("/api/getstatusapprovedproductforSELLER"),
//       ]);

//       const approved = [
//         ...(artistRes?.data?.data || []),
//         ...(sellerRes?.data?.data || []),
//       ];

//       const merged = purchasedItems.map((item) => {
//         const found = approved.find((p) => p._id === item.productId);
//         return {
//           ...item,
//           full: found || null,
//         };
//       });

//       setProductDetails(merged);
//     } catch (e) {
//       console.log("Error fetching product details:", e);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (!order) return <p>Invalid Order</p>;

//   const estimatedDelivery = calculateDeliveryDate(
//     productDetails[0]?.full?.estimatedDelivery
//   );

//   return (
//     <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 space-y-8 text-[15px] text-lg">
//       {/* Order Complete Header */}
//       <div className="text-center space-y-4">
//         <div className="w-12 h-12 mx-auto rounded-full bg-[#5C4033] flex items-center justify-center">
//           <GoCheck className="text-white text-3xl font-bold" />
//         </div>
//         <h2 className="text-[20px] font-semibold text-xl">Your order is completed</h2>
//         <p className="text-gray-500 text-sm">Thank you. Your Order has been received</p>
//       </div>

//       {/* Order Info Box */}
//       <div className="bg-yellow-200 p-12 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 ">
//         {/* Grid Info */}
//         <div className="grid grid-cols-2 md:grid-cols-4 w-full font-medium text-center divide-x divide-gray-300 pr-2">
//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Order ID</p>
//             <p className="text-black font-semibold">#{order.orderId}</p>
//           </div>

//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Payment Method</p>
//             <p className="text-black font-semibold">{order.paymentMethod}</p>
//           </div>

//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Transaction ID</p>
//             <p className="text-black font-semibold">{order.transactionId}</p>
//           </div>

//           <div className="px-4 space-y-5">
//             <p className="text-gray-500">Estimated Delivery Date</p>
//             <p className="text-black font-semibold">{estimatedDelivery}</p>
//           </div>
//         </div>

//         <div className="lg:pr-[55px]">
//           <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm px-6 py-2 rounded-full self-center md:self-auto whitespace-nowrap">
//             Download Invoice
//           </button>
//         </div>
//       </div>

//       {/* Order Details */}
//       <div className="border border-gray-200 rounded-2xl p-6 text-sm bg-white">
//         <h3 className="text-[17px] font-semibold mb-4 text-xl">Order Details</h3>
//         <hr className="py-3" />

//         {/* Products */}
//         <div className="border-b border-gray-200 pb-4 mb-4">
//           <div className="flex justify-between font-medium mb-2">
//             <p>Products</p>
//             <p>Sub Total</p>
//           </div>

//           <div className="space-y-2">
//             {productDetails.map((item, i) => (
//               <div key={i} className="flex items-center justify-between">
//                 <div className="flex gap-3 items-center py-3">
//                   <img
//                     src={`${BASE_IMAGE}${item.full?.mainImage}`}
//                     className="w-16 h-16 rounded-xl object-cover border"
//                   />
//                   <div>
//                     <p className="font-medium text-gray-800">
//                       {item.full?.productName}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Owned by {item.full?.userId?.name || "Seller"}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-gray-800 font-medium">₹{item.price}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Price Summary */}
//         <div className="space-y-4 text-lg font-semibold">
//           <div className="flex justify-between">
//             <p>Shipping</p>
//             <p>₹0.00</p>
//           </div>

//           <div className="flex justify-between ">
//             <p>Total</p>
//             <p>₹{order.totalAmount}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderCompleted;


import React, { useEffect, useState } from "react";
import { GoCheck } from "react-icons/go";
<<<<<<< HEAD
import { useLocation } from "react-router-dom";
import getAPI from "../../../../../../../../api/getAPI";

const OrderCompleted = () => {
=======
import { useLocation, useParams } from "react-router-dom";
import getAPI from "../../../../../../../../api/getAPI";

const OrderCompleted = () => {
  const { userId } = useParams();
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
  const { state } = useLocation();

  const order = state?.order;
  const purchasedItems = state?.items || [];
  const productIds = state?.productIds || [];

  const [fullProducts, setFullProducts] = useState([]);

  const BASE = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

  const calculateDeliveryDate = (range) => {
    if (!range) return "N/A";
    const parts = range.split("-");
    const maxDays = Number(parts[1] || parts[0]);
    const date = new Date();
    date.setDate(date.getDate() + maxDays);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fetchProducts = async () => {
    try {
      const [artistRes, sellerRes] = await Promise.all([
        getAPI("/api/getstatusapprovedproduct"),
        getAPI("/api/getstatusapprovedproductforSELLER"),
      ]);

      const approved = [
        ...(artistRes?.data?.data || []),
        ...(sellerRes?.data?.data || []),
      ];

      const merged = purchasedItems.map((cartItem, i) => {
        const pid = productIds[i];
        const real =
          approved.find((p) => String(p._id) === String(pid)) || null;
        return {
          ...cartItem,
          full: real,
        };
      });

      setFullProducts(merged);
    } catch (err) {
      console.log("Error loading product details:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!order) return <p>Invalid Order</p>;

  const estimatedDelivery = calculateDeliveryDate(
    fullProducts[0]?.full?.estimatedDelivery
  );
  const totalShipping = fullProducts.reduce(
    (acc, item) => acc + Number(item.full?.shippingCharges || 0),
    0
  );

  return (
    <div className="w-full space-y-6 pt-10">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#5C4033] flex items-center justify-center">
          <GoCheck className="text-white text-3xl" />
        </div>
        <h2 className="text-[20px] font-semibold">Your order is completed</h2>
        <p className="text-gray-500 text-sm">Thank you. Your Order has been received</p>
      </div>

      {/* Order Info */}
      <div className="bg-yellow-200 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full text-center divide-x divide-gray-300">

          <div className="px-4 space-y-5">
            <p className="text-gray-500">Order ID</p>
            <p className="text-black font-semibold">#{order.orderId}</p>
          </div>

          <div className="px-4 space-y-5">
            <p className="text-gray-500">Payment Method</p>
            <p className="text-black font-semibold">{order.paymentMethod}</p>
          </div>

          <div className="px-4 space-y-5">
            <p className="text-gray-500">Transaction ID</p>
            <p className="text-black font-semibold">{order.transactionId}</p>
          </div>

          <div className="px-4 space-y-5">
            <p className="text-gray-500">Estimated Delivery Date</p>
            <p className="text-black font-semibold">{estimatedDelivery}</p>
          </div>

        </div>
        {/* 
        <div className="lg:pr-[55px]">
          <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm px-6 py-2 rounded-full">
            Download Invoice
          </button>
        </div> */}
      </div>

      {/* Order Details */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-white">
        <h3 className="text-xl font-semibold">Order Details</h3>
        <hr className="my-3" />

        {/* Products */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between font-medium mb-2">
            <p>Products</p>
            <p>Sub Total</p>
          </div>

          {/* <div className="space-y-2">
            {fullProducts.map((item, i) => (
              <div key={i} className="flex justify-between items-center">

                <div className="flex gap-3 py-3 items-center">
                  <img
                    src={`${BASE}${item.full?.mainImage}`}
                    className="w-16 h-16 rounded-xl object-cover border"
                    alt=""
                  />

                  <div>
                    <p className="font-medium text-gray-800">{item.full?.productName}</p>
                    <p className="text-xs text-gray-500">
                      Owned by {item.full?.userId?.name || "Seller"}
                    </p>
                  </div>
                </div>

                <p className="font-medium text-gray-800">₹{item.subtotal}</p>
              </div>
            ))}
          </div> */}
          <div className="space-y-4">
            {fullProducts.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-3">

                <div className="flex gap-3 py-3 items-center">
                  <img
                    src={`${BASE}${item.full?.mainImage}`}
                    className="w-16 h-16 rounded-xl object-cover border"
                    alt=""
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.full?.productName} × {item.qty}
                    </p>

                    <p className="text-xs text-gray-500">
                      MRP: ₹{item.price} per unit
                    </p>

                    <p className="text-xs text-gray-500">
                      Owned by {item.full?.userId?.name || "Seller"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{item.subtotal}</p>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Summary */}
        <div className="space-y-4 font-semibold text-lg">
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>₹{totalShipping}</p>
          </div>

          <div className="flex justify-between">
            <p>Total</p>
            <p>₹{order.totalAmount + totalShipping}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderCompleted;
