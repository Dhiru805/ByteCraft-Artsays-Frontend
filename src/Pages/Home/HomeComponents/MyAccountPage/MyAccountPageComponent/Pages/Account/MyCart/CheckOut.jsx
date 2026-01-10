// import React, { useState, useEffect } from "react";
// import getAPI from "../../../../../../../../api/getAPI";
// import { useSearchParams } from "react-router-dom";

// const CheckOut = () => {
//   const userId = localStorage.getItem("userId");
//   const [searchParams] = useSearchParams();
//   const productId = searchParams.get("productId");
//   const [deliveryAddress, setDeliveryAddress] = useState("same");

//   const [userData, setUserData] = useState(null);
//   const [selectedAddr, setSelectedAddr] = useState(null);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     company: "",
//     email: "",
//     phone: "",
//     country: "",
//     street: "",
//     city: "",
//     state: "",
//     zip: "",
//   });
//   const [cartItems, setCartItems] = useState([]);

//   const loadOrderItems = async () => {
//     if (productId) {
//       const res = await getAPI(`/api/products/${productId}`);
//       const p = res.data?.product;

//       if (p) {
//         setCartItems([
//           {
//             name: p.productName,
//             qty: 1,
//             price: p.sellingPrice,
//             subtotal: p.sellingPrice * 1,
//           },
//         ]);
//       }
//     } else {
//       const res = await getAPI(`/api/cart/${userId}`);
//       const items = res.data?.items || [];

//       const grouped = items.map((item) => ({
//         name: item.product.productName,
//         qty: item.quantity,
//         price: item.product.sellingPrice,
//         subtotal: item.quantity * item.product.sellingPrice,
//       }));

//       setCartItems(grouped);
//     }
//   };
//   useEffect(() => {
//     loadOrderItems();
//   }, [userId, productId]);

//   const loadUser = async () => {
//     try {
//       const res = await getAPI(`/auth/userid/${userId}`);
//       const user = res.data?.user;

//       if (!user) return;

//       setUserData(user);

//       const addr =
//         user.address?.find((a) => a._id === user.selectedAddress) ||
//         user.address?.[0] ||
//         null;

//       setSelectedAddr(addr);

//       setFormData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         company: "",
//         email: user.email || "",
//         phone: user.phone || "",
//         country: addr?.country || "",
//         street: `${addr?.line1 || ""} ${addr?.line2 || ""}`,
//         city: addr?.city || "",
//         state: addr?.state || "",
//         zip: addr?.pincode || "",
//       });
//     } catch (err) {
//       console.log("Checkout fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, [userId]);

//   const changeField = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   return (
//     <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 py-10">
//       <div className="lg:flex lg:gap-8 gap-8">
//         {/* Billing Form */}
//         <div className="lg:col-span-2 w-full">
//           <h2 className="text-3xl font-semibold mb-6">Billing Details</h2>

//           <form className="space-y-4">
//             {/* Name fields */}
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-lg font-medium mb-1">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={changeField}
//                   placeholder="Enter First Name"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-lg font-medium mb-1">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={changeField}
//                   placeholder="Enter Last Name"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-2"
//                 />
//               </div>
//             </div>

//             {/* Company name */}
//             <div>
//               <label className="block text-lg font-medium mb-1">
//                 Company Name (Optional)
//               </label>
//               <input
//                 type="text"
//                 name="company"
//                 value={formData.company}
//                 onChange={changeField}
//                 placeholder="Enter Company Name"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               />
//             </div>

//             {/* Country */}
//             <div>
//               <label className="block text-lg font-medium mb-1">
//                 Country *
//               </label>
//               <select
//                 name="country"
//                 value={formData.country}
//                 onChange={changeField}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//                 <option value="USA">USA</option>
//                 <option value="UK">UK</option>
//               </select>
//             </div>

//             {/* Street Address */}
//             <div>
//               <label className="block text-lg font-medium mb-1">
//                 Street Address *
//               </label>
//               <input
//                 type="text"
//                 name="street"
//                 value={formData.street}
//                 onChange={changeField}
//                 placeholder="Enter Street Address"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               />
//             </div>

//             {/* City */}
//             <div>
//               <label className="block text-lg font-medium mb-1">City *</label>
//               <select
//                 name="city"
//                 value={formData.city}
//                 onChange={changeField}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               >
//                 <option>Select City</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="New York">New York</option>
//               </select>
//             </div>

//             {/* State */}
//             <div>
//               <label className="block text-lg font-medium mb-1">State *</label>
//               <select
//                 name="state"
//                 value={formData.state}
//                 onChange={changeField}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               >
//                 <option>Select State</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="California">California</option>
//                 <option value="Texas">Texas</option>
//               </select>
//             </div>

//             {/* Zip */}
//             <div>
//               <label className="block text-lg font-medium mb-1">
//                 Zip Code *
//               </label>
//               <input
//                 type="text"
//                 name="zip"
//                 value={formData.zip}
//                 onChange={changeField}
//                 placeholder="Enter Zip Code"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-lg font-medium mb-1">
//                 Phone Number *
//               </label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={changeField}
//                 placeholder="Enter Phone Number"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-lg font-medium mb-1">Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={changeField}
//                 placeholder="Enter Email Address"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-2"
//               />
//             </div>

//             {/* Delivery Address */}
//             <div>
//               <label className="block text-lg font-medium mb-2">
//                 Delivery Address *
//               </label>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl cursor-pointer">
//                   <input
//                     type="radio"
//                     checked={deliveryAddress === "same"}
//                     onChange={() => setDeliveryAddress("same")}
//                   />
//                   Same as shipping address
//                 </label>

//                 <label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl cursor-pointer">
//                   <input
//                     type="radio"
//                     checked={deliveryAddress === "different"}
//                     onChange={() => setDeliveryAddress("different")}
//                   />
//                   Use a different billing address
//                 </label>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Order Summary */}
//         <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
//           <h2 className="text-gray-800 text-xl font-semibold">Order Summary</h2>
//           <hr className="my-2" />

//           <div className="space-y-2 mb-4">
//             {cartItems.map((g, index) => (
//               <div key={index} className="flex justify-between text-sm">
//                 <span>
//                   {g.name} × {g.qty}
//                 </span>
//                 <span>₹{g.subtotal}</span>
//               </div>
//             ))}
//           </div>

//           <hr className="my-2" />

//           <div className="flex justify-between text-base text-gray-900">
//             <span>Total Items</span>
//             <span>{cartItems.reduce((acc, g) => acc + g.qty, 0)}</span>
//           </div>

//           <div className="flex justify-between font-medium text-base mt-2 text-gray-900">
//             <span>Total Price</span>
//             <span>₹{cartItems.reduce((acc, g) => acc + g.subtotal, 0)}</span>
//           </div>

//           <button className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm">
//             Proceed to Payment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckOut;

import React, { useState, useEffect } from "react";
import postAPI from "../../../../../../../../api/postAPI";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShieldCheck, ChevronRight, Truck } from "lucide-react";

const CheckOut = () => {
  const userId = localStorage.getItem("userId");
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const quantityParam = Number(searchParams.get("quantity"));
  const directQuantity =
    Number.isFinite(quantityParam) && quantityParam > 0
      ? quantityParam
      : 1;
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("same");
  const [userData, setUserData] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [cartItems, setCartItems] = useState([]);

const [paymentMethod, setPaymentMethod] = useState(null);

  const [allAddresses, setAllAddresses] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

const PaymentButton = ({ value, label }) => {
  const isSelected = paymentMethod === value;

  const toggleSelect = () => {
    if (isSelected) {
      setPaymentMethod(null); 
    } else {
      setPaymentMethod(value);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSelect}
      className={`w-full py-3 rounded-xl border text-sm font-medium transition-all
        ${isSelected ? "bg-[#5C4033] text-white border-[#5C4033]" 
                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
      `}
    >
      {label}
    </button>
  );
};


  const fetchProductById = async (id) => {
    try {
      const artist = await getAPI(`/artist/getproduct/${id}`);
      if (artist?.data?.data) return artist.data.data;
    } catch (e) {}

    try {
      const seller = await getAPI(`/api/getproduct/${id}`);
      if (seller?.data?.data) return seller.data.data;
    } catch (e) {}

    throw new Error("Product not found in either Artist or Seller routes");
  };

  const loadOrderItems = async () => {
    try {
        if (productId) {
          const p = await fetchProductById(productId);
          const availableQty = Number(p?.quantity) || 1;
          const buyNowQty = Math.max(
            1,
            Math.min(directQuantity, availableQty)
          );

            setCartItems([
              {
                productId: p._id,
                name: p.productName,
                artistName: `${p.userId?.name || p.creator?.name || ""} ${p.userId?.lastName || p.creator?.lastName || ""}`.trim() || p.userId?.username || p.creator?.username || "Artist",
                qty: buyNowQty,
                price: p.sellingPrice,
                marketPrice: p.marketPrice || p.sellingPrice,
                subtotal: buyNowQty * p.sellingPrice,
                marketSubtotal: buyNowQty * (p.marketPrice || p.sellingPrice),
              },
            ]);

          return;
        }

        const res = await getAPI(`/api/cart/${userId}`);
        const items = res.data?.items || [];


        // const grouped = items
        //   .filter((item) => item && item.product)
        //   .map((item) => ({
        //     name: item.product.productName,
        //     qty: item.quantity,
        //     price: item.product.sellingPrice,
        //     subtotal: item.quantity * item.product.sellingPrice,
        //   }));

        const grouped = items
    .filter(item => item && item.product)
    .map((item) => ({
      productId: item.product._id,   
      name: item.product.productName,
      artistName: `${item.product.userId?.name || ""} ${item.product.userId?.lastName || ""}`.trim() || item.product.userId?.username || "Artist",
      qty: item.quantity,
      price: item.product.sellingPrice,
      marketPrice: item.product.marketPrice || item.product.sellingPrice,
      subtotal: item.quantity * item.product.sellingPrice,
      marketSubtotal: item.quantity * (item.product.marketPrice || item.product.sellingPrice),
    }));

      setCartItems(grouped);
    } catch (err) {
      console.log("Order items load error:", err);
    }
  };

  useEffect(() => {
    loadOrderItems();
  }, [userId, productId, directQuantity]);

  const loadAllAddresses = async () => {
    try {
      const res = await getAPI(`/auth/userid/${userId}`);
      const user = res.data?.user;

      if (user?.address && Array.isArray(user.address)) {
        setAllAddresses(user.address);
      }
    } catch (err) {
      console.log("Error loading address list:", err);
    }
  };

  useEffect(() => {
    loadAllAddresses();
  }, [userId]);

  const loadUser = async () => {
    try {
      const res = await getAPI(`/auth/userid/${userId}`);
      const user = res.data?.user;
      if (!user) return;

      setUserData(user);

      const addr =
        user.address?.find((a) => a._id === user.selectedAddress) ||
        user.address?.[0] ||
        null;

      setSelectedAddr(addr);

      setFormData({
        firstName: user.name || "",
        lastName: user.lastName || "",
        company: "",
        email: user.email || "",
        phone: user.phone || "",
        country: addr?.country || "",
        street: `${addr?.line1 || ""} ${addr?.line2 || ""}`,
        city: addr?.city || "",
        state: addr?.state || "",
        zip: addr?.pincode || "",
      });
    } catch (err) {
      console.log("Cannot Fetch Details, kindly fill manually", err);
    }
  };
  useEffect(() => {
    loadUser();
  }, [userId]);

  const totalMRP = cartItems.reduce((acc, item) => acc + (item.marketSubtotal || item.subtotal), 0);
  const totalSellingPrice = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const totalDiscount = totalMRP - totalSellingPrice;

  const changeField = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

// const placeOrder = async () => {
//   try {
//     for (const item of cartItems) {
//       await postAPI("/api/buyerpurchase", {
//         buyer: userId,
//         product: item.productId, 
//         quantity: item.qty,
//         paymentMethod: "Cash On Delivery"
//       });
//     }

    
//     navigate(`/my-account/order-completed/${userId}`, {
//       state: {
//         order: {
//           orderId: "TEMP-" + Date.now(),
//           paymentMethod: "Cash On Delivery",
//           transactionId: "TXN" + Date.now(),
//           totalAmount: cartItems.reduce((a, b) => a + b.subtotal, 0),
//         },
//         items: cartItems,
//         productIds: cartItems.map(i => i.productId)
//       }
//     });
//   } catch (err) {
//     console.log("ORDER ERROR:", err);
//   }
// };
  const placeOrder = async () => {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "country",
        "street",
        "city",
        "state",
        "zip",
      ];

      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === "") {
          toast.error(`Please fill the ${field} field`);
          return;
        }
      }

      if (!paymentMethod) {
        toast.error("Please select a payment method before proceeding.");
        return;
      }

      if (cartItems.length === 0) {
        console.log("No items in cart");
        return;
      }

      const itemsWithArtist = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const artistRes = await getAPI(`/artist/getproduct/${item.productId}`);
            if (artistRes?.data?.data?.userId) {
              const art = artistRes.data.data.userId;
              return {
                ...item,
                artistId: art._id,
                artistName: art.name || "",
                artistLastName: art.lastName || "",
              };
            }
          } catch (e) { }

          try {
            const sellerRes = await getAPI(`/api/getproduct/${item.productId}`);
            if (sellerRes?.data?.data?.userId) {
              const art = sellerRes.data.data.userId;
              return {
                ...item,
                artistId: art._id,
                artistName: art.name || "",
                artistLastName: art.lastName || "",
              };
            }
          } catch (e) { }

          return { ...item, artistId: null, artistName: "Unknown", artistLastName: "" };
        })
      );

      const deliveryAddressObj = {
        line1: formData.street || "",
        line2: "",
        landmark: "",
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        pincode: formData.zip || "",
      };

      const buyerBlock = {
        id: userId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      };

      const artistBlock = {
        id: itemsWithArtist[0]?.artistId || null,
        name: itemsWithArtist[0]?.artistName || "Unknown",
        lastName: itemsWithArtist[0]?.artistLastName || "",
      };

      const orderPayload = {
        buyer: buyerBlock,
        artist: artistBlock,
        items: itemsWithArtist.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.qty,
          price: i.price,
          subtotal: i.subtotal,
        })),
        deliveryAddress: deliveryAddressObj,
        totalAmount: cartItems.reduce((a, b) => a + b.subtotal, 0),
        paymentMethod: paymentMethod,
      };

      const response = await postAPI("/api/buyer-order-list/create", orderPayload);
      const savedOrder = response?.data?.data;

      console.log("ORDER SUCCESS ===> ", savedOrder);

      try {
        for (const item of cartItems) {
          if (!item.productId) continue;
          await deleteAPI("/api/cart/remove", {
            params: { userId, productId: item.productId },
          });
        }
      } catch (clearErr) {
        console.log("Failed to clear cart after order:", clearErr);
      }

      if (response?.data?.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        navigate(`/my-account/order-completed/${userId}`, {
          state: {
            order: savedOrder,
            items: cartItems,
            productIds: cartItems.map((i) => i.productId),
          },
        });
      }
    } catch (err) {
      console.log("ORDER ERROR:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to place order. Please try again.";
      toast.error(message);
    }
  };


  return (
    <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 py-10">
      <div className="lg:flex lg:gap-8 gap-8">
        {/* BILLING FORM */}
        <div className="lg:col-span-2 w-full space-y-8">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#5C4033]"></div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#5C4033]/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#5C4033]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shipping Details</h2>
                <p className="text-gray-500 text-sm mt-1">Please provide accurate delivery information</p>
              </div>
            </div>

            <form className="space-y-6">
              {/* Name fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g. John"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Company Name (Optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={changeField}
                  className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="Your Company"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={changeField}
                  className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="House No, Building, Street Name"
                />
              </div>

              {/* Country, State, City, Zip */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 appearance-none"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 appearance-none"
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 appearance-none"
                  >
                    <option value="">Select City</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="New York">New York</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Zip Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={changeField}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="000000"
                  />
                </div>
              </div>

              {/* Delivery Address Choice */}
              <div className="pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 mb-4 block">Billing Address *</label>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <label 
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      deliveryAddress === "same" 
                        ? "border-[#5C4033] bg-[#5C4033]/5 ring-1 ring-[#5C4033]" 
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="w-5 h-5 accent-[#5C4033]"
                      checked={deliveryAddress === "same"}
                      onChange={() => {
                        setDeliveryAddress("same");
                        if (selectedAddr) {
                          setFormData((f) => ({
                            ...f,
                            country: selectedAddr.country,
                            street: `${selectedAddr.line1} ${selectedAddr.line2}`,
                            city: selectedAddr.city,
                            state: selectedAddr.state,
                            zip: selectedAddr.pincode,
                          }));
                        }
                      }}
                    />
                    <span className="font-bold text-gray-900">Same as Delivery</span>
                  </label>

                  <label 
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      deliveryAddress === "different" 
                        ? "border-[#5C4033] bg-[#5C4033]/5 ring-1 ring-[#5C4033]" 
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="w-5 h-5 accent-[#5C4033]"
                      checked={deliveryAddress === "different"}
                      onChange={() => setDeliveryAddress("different")}
                    />
                    <span className="font-bold text-gray-900">Use Different Address</span>
                  </label>
                </div>

                {/* ADDRESS OPTIONS */}
                {deliveryAddress === "different" && allAddresses.length > 0 && (
                  <div className="bg-gray-50 rounded-[1.5rem] p-6 space-y-4 ring-1 ring-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Saved Addresses</p>
                    {allAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setFormData((f) => ({
                            ...f,
                            country: addr.country,
                            street: `${addr.line1} ${addr.line2}`,
                            city: addr.city,
                            state: addr.state,
                            zip: addr.pincode,
                          }));
                        }}
                        className="group flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#5C4033] hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer"
                      >
                        <div className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#5C4033] flex items-center justify-center transition-colors">
                          <div className={`w-2.5 h-2.5 rounded-full ${formData.zip === addr.pincode ? 'bg-[#5C4033]' : ''}`}></div>
                        </div>

                        <div>
                          <p className="font-bold text-gray-900">
                            {addr.city}, {addr.state}
                          </p>
                          <p className="text-sm text-gray-500 leading-relaxed mt-1">
                            {addr.line1}, {addr.line2}, {addr.pincode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {cartItems.map((g, i) => (
                    <div key={i} className="flex justify-between items-start text-sm border-b border-gray-50 pb-3">
                      <div className="flex-1 pr-4">
                        <p className="font-semibold text-gray-900 line-clamp-1">{g.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">by {g.artistName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {g.qty} × ₹{g.price.toLocaleString()}</p>
                      </div>
                      <div className="font-bold text-gray-900">
                        ₹{g.subtotal.toLocaleString()}
                      </div>
                    </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span className="font-semibold text-gray-900">₹{totalMRP.toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount on MRP</span>
                    <span className="font-semibold">- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Platform Handling</span>
                  <span className="text-green-600 font-bold text-xs uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-bold text-xs uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Free</span>
                </div>
                
                <div className="h-px border-t border-dashed border-gray-200 my-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">
                    ₹{totalSellingPrice.toLocaleString()}
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100/50 shadow-sm">
                    <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      <span>You will save ₹{totalDiscount.toLocaleString()} on this order</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method *</h3>
                <div className="grid grid-cols-1 gap-3">
                  <PaymentButton value="Cash On Delivery" label="Cash On Delivery (COD)" />
                  <PaymentButton value="Online" label="Online Payment" />
                </div>
                {paymentMethod === null && (
                  <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Please select a payment method
                  </p>
                )}
              </div>

              <button
                onClick={placeOrder}
                className="w-full group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!paymentMethod || cartItems.length === 0}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                Complete Purchase
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p>Secure payment processing</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p>Safe and timely delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
