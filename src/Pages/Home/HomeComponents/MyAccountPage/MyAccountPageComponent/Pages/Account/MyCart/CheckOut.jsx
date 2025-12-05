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
            qty: buyNowQty,
            price: p.sellingPrice,
            subtotal: buyNowQty * p.sellingPrice,
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
    qty: item.quantity,
    price: item.product.sellingPrice,
    subtotal: item.quantity * item.product.sellingPrice,
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
          if (artistRes?.data?.data?.creator) {
            const art = artistRes.data.data.creator;
            return {
              ...item,
              artistId: art._id,
              artistName: art.name,
              artistLastName: art.lastName || "",
            };
          }
        } catch (e) {}

        try {
          const sellerRes = await getAPI(`/api/getproduct/${item.productId}`);
          if (sellerRes?.data?.data?.userId) {
            const art = sellerRes.data.data.userId;
            return {
              ...item,
              artistId: art._id,
              artistName: art.name,
              artistLastName: art.lastName || "",
            };
          }
        } catch (e) {}

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

    // let artistBlock = {};
    // if (itemsWithArtist.length === 1) {
    //   artistBlock = {
    //     id: itemsWithArtist[0].artistId,
    //     name: itemsWithArtist[0].artistName,
    //     lastName: itemsWithArtist[0].artistLastName,
    //   };
    // }
const artistBlock = {
  id: itemsWithArtist[0].artistId,
  name: itemsWithArtist[0].artistName,
  lastName: itemsWithArtist[0].artistLastName,
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

    navigate(`/my-account/order-completed/${userId}`, {
      state: {
        order: savedOrder,
        items: cartItems,
        productIds: cartItems.map((i) => i.productId),
      },
    });
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
        <div className="lg:col-span-2 w-full">
          <h2 className="text-3xl font-semibold mb-6">Shipping Details</h2>

          <form className="space-y-4">
            {/* Name fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-medium mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={changeField}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                  placeholder="Enter First Name"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={changeField}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-lg font-medium mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Company Name"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-lg font-medium mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Country"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            {/* Street */}
            <div>
              <label className="block text-lg font-medium mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Street Address"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-lg font-medium mb-1">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="City"
              >
                <option>Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="New York">New York</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-lg font-medium mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="State"
              >
                <option>Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
              </select>
            </div>

            {/* Zip */}
            <div>
              <label className="block text-lg font-medium mb-1">
                Zip Code *
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Zip Code"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-lg font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Phone Number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Email Id"
              />
            </div>

            {/* Delivery Address */}
            {/* <div>
              <label className="block text-lg font-medium mb-2">
                Delivery Address *
              </label>

              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryAddress === "same"}
                    onChange={() => setDeliveryAddress("same")}
                  />
                  Same as shipping address
                </label>

                <label className="flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryAddress === "different"}
                    onChange={() => setDeliveryAddress("different")}
                  />
                  Use a different billing address
                </label>
              </div>
            </div> */}

            {/* Delivery Address */}
            <div>
              <label className="block text-lg font-medium mb-2">
                Delivery Address *
              </label>

              {/* OPTION SELECTOR */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <label className="flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
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
                  Same as shipping address
                </label>

                <label className="flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryAddress === "different"}
                    onChange={() => setDeliveryAddress("different")}
                  />
                  Use a different billing address
                </label>
              </div>

              {/* ALL ADDRESS OPTIONS — ONLY SHOW IF 'different' IS SELECTED */}
              {deliveryAddress === "different" && allAddresses.length > 0 && (
                <div className="border p-4 rounded-2xl space-y-4">
                  {allAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="flex items-start gap-3 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer"
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
                    >
                      <input
                        type="radio"
                        name="addressSelect"
                        className="mt-1"
                        onChange={() => {
                          setFormData((f) => ({
                            ...f,
                            country: addr.country,
                            street: `${addr.line1} ${addr.line2}`,
                            city: addr.city,
                            state: addr.state,
                            zip: addr.pincode,
                          }));
                        }}
                      />

                      <div>
                        <p className="font-semibold text-gray-900">
                          {addr.city}, {addr.state}, {addr.country}
                        </p>

                        <p className="text-sm text-gray-600">
                          {addr.line1}, {addr.line2}, {addr.landmark},{" "}
                          {addr.pincode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
          <h2 className="text-gray-800 text-xl font-semibold">Order Summary</h2>
          <hr className="my-2" />

          {/* <div className="space-y-2 mb-4">
            {cartItems.map((g, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {g.name} × {g.qty}
                </span>
                <span>₹{g.subtotal}</span>
              </div>
            ))}
          </div> */}

<div className="space-y-4 mb-4">
  {cartItems.map((g, i) => (
    <div 
      key={i} 
      className="flex justify-between items-start text-sm border-b pb-2"
    >
      <div>
        <p className="font-semibold">{g.name}</p>
        <p className="text-gray-600">MRP: ₹{g.price}</p>
        <p className="text-gray-600">Qty: {g.qty}</p>
      </div>

      <div className="font-medium text-gray-900">
        ₹{g.subtotal}
      </div>
    </div>
  ))}
</div>


          <hr className="my-2" />

          <div className="flex justify-between text-base text-gray-900">
            <span>Total Items</span>
            <span>{cartItems.reduce((a, b) => a + b.qty, 0)}</span>
          </div>

          <div className="flex justify-between font-medium text-base mt-2 text-gray-900">
            <span>Total Price</span>
            <span>₹{cartItems.reduce((a, b) => a + b.subtotal, 0)}</span>
          </div>

<div className="mt-6">
  <h2 className="text-xl font-semibold mb-3">Payment Method *</h2>

  <div className="flex flex-col gap-3">
    <PaymentButton value="Cash On Delivery" label="Cash On Delivery (COD)" />
    <PaymentButton value="UPI" label="UPI" />
    <PaymentButton value="Credit Card" label="Credit Card" />
    <PaymentButton value="Debit Card" label="Debit Card" />
  </div>

  {paymentMethod === null && (
    <p className="text-red-500 text-sm mt-2">Please select a payment method</p>
  )}
</div>



          <button
            // onClick={() =>
            //   navigate(`/my-account/order-completed/${userId}`, {
            //     state: {
            //       order: {
            //         orderId: "TEMP-" + Date.now(),
            //         paymentMethod: "Cash On Delivery",
            //         transactionId: "TXN" + Date.now(),
            //         totalAmount: cartItems.reduce((a, b) => a + b.subtotal, 0),
            //       },
            //       items: cartItems,
            //       productIds: cartItems.map(
            //         (item, i) => item.productId || null
            //       ),
            //     },
            //   })
            // }

 onClick={placeOrder}

//             onClick={async () => {
//   const totalAmount = cartItems.reduce((a, b) => a + b.subtotal + (b.shippingCharges || 0), 0);

//   await postAPI("/api/buyerpurchase", {
//     buyerId: userId,
//     products: cartItems.map(item => ({
//       productId: item.productId,
//       quantity: item.qty,
//       price: item.price,
//       subtotal: item.subtotal,
//       shippingCharges: item.shippingCharges || 0,
//     })),
//     totalAmount,
//     paymentMethod: "Cash On Delivery",
//     address: formData,
//   });

//   navigate(`/my-account/order-completed/${userId}`, {
//     state: {
//       order: {
//         orderId: "TEMP-" + Date.now(),
//         paymentMethod: "COD",
//         transactionId: "TXN-" + Date.now(),
//         totalAmount,
//       },
//       items: cartItems,
//       productIds: cartItems.map(i => i.productId),
//     },
//   });
// }}

            className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm"
          >
            Proceed to Payment
          </button> 
          

        </div>
      </div>
    </div>
  );
};

export default CheckOut;
