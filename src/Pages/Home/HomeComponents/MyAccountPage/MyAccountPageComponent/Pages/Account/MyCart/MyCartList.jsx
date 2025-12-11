// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import getAPI from "../../../../../../../../api/getAPI";
// import deleteAPI from "../../../../../../../../api/deleteAPI";

// const MyCartList = () => {
//   const { userId } = useParams();

//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [notLogged, setNotLogged] = useState(false);

//   const fetchCart = async () => {
//     try {
//      const res = await getAPI(`/api/cart/${userId}`);



//       console.log("CART RESPONSE FROM SERVER >>>", res.data);

//       setCart(res.data.items || []);
//     } catch (err) {
//       console.log("Cart load error:", err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.warn("⚠ No token found, please log in");
//       setNotLogged(true);
//       setLoading(false);
//       return;
//     }

//     fetchCart();
//   }, [userId]);

//   const removeItem = async (productId) => {
//     try {
//       await deleteAPI(`/api/cart/remove/${productId}`);
//       setCart((prev) => prev.filter((i) => i.product._id !== productId));
//     } catch (err) {
//       console.log("Remove error:", err);
//     }
//   };

//   const updateQuantity = async (productId, qty) => {
//     try {
//       if (qty < 1) return;

//       await getAPI(
//         "/api/cart/update",
//         { productId, quantity: qty },
//         true,
//         false,
//         "PUT"
//       );

//       setCart((prev) =>
//         prev.map((item) =>
//           item.product._id === productId
//             ? { ...item, quantity: qty }
//             : item
//         )
//       );
//     } catch (err) {
//       console.log("Qty update error:", err);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       for (const item of cart) {
//         await deleteAPI(`/api/cart/remove/${item.product._id}`);
//       }
//       setCart([]);
//     } catch (err) {
//       console.log("Clear cart error:", err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-6 text-center text-lg">Loading cart...</div>
//     );

//   if (notLogged)
//     return (
//       <div className="p-6 text-center text-lg text-red-500">Please log in to view your cart.</div>
//     );

//   if (error)
//     return (
//       <div className="p-6 text-center text-lg text-red-500">Error loading cart. Please try again.</div>
//     );

//   if (cart.length === 0)
//     return (
//       <div className="p-6 text-center text-lg">Your Cart is Empty.</div>
//     );

//   return (
//     <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 text-lg">
//       <div className="flex flex-col lg:flex-row gap-8">

//         {/* CART TABLE */}
//         <div className="flex-1 overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-yellow-200 text-left">
//                 <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">
//                   Product
//                 </th>
//                 <th className="py-4 px-4 font-medium">Price</th>
//                 <th className="py-4 px-4 font-medium">Quantity</th>
//                 <th className="py-4 px-4 font-medium rounded-tr-xl rounded-br-xl">
//                   Subtotal
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {cart.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="text-center py-6 text-gray-500">
//                     Your cart is empty
//                   </td>
//                 </tr>
//               ) : (
//                 cart.map((item) => (
//                   <tr key={item.product._id} className="border-b">
//                     <td className="py-4 px-4 flex items-center gap-4">
//                       <button
//                         onClick={() => removeItem(item.product._id)}
//                         className="text-xl text-gray-600 hover:text-black"
//                       >
//                         ×
//                       </button>

//                       <img
//                         src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.product.mainImage}`}
//                         className="w-12 h-12 object-cover rounded border"
//                       />

//                       <div className="font-semibold">
//                         <p>{item.product.productName}</p>
//                         <p className="text-xs text-gray-500">
//                           {item.product.userId?.username ||
//                             `${item.product.userId?.name || ""} ${
//                               item.product.userId?.lastName || ""
//                             }`.trim()}
//                         </p>
//                       </div>
//                     </td>

//                     <td className="py-4 px-4">₹{item.product.sellingPrice}</td>

//                     <td className="py-4 px-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() =>
//                             updateQuantity(item.product._id, item.quantity - 1)
//                           }
//                           className="w-6 h-6 bg-gray-200 rounded"
//                         >
//                           −
//                         </button>
//                         <span>{item.quantity}</span>
//                         <button
//                           onClick={() =>
//                             updateQuantity(item.product._id, item.quantity + 1)
//                           }
//                           className="w-6 h-6 bg-gray-200 rounded"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </td>

//                     <td className="py-4 px-4">
//                       ₹{item.product.sellingPrice * item.quantity}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* SIDEBAR SUMMARY */}
//         <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
//           <h2 className="text-xl font-semibold">Order Summary</h2>
//           <hr className="my-2" />

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Items</span>
//               <span>{cart.length}</span>
//             </div>

//             <div className="flex justify-between font-medium">
//               <span>Total</span>
//               <span>
//                 ₹
//                 {cart.reduce(
//                   (acc, item) =>
//                     acc + item.product.sellingPrice * item.quantity,
//                   0
//                 )}
//               </span>
//             </div>

//             <button className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm">
//               Proceed to Payment
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={clearCart}
//           className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]"
//         >
//           Clear Shopping Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyCartList;

















// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import getAPI from "../../../../../../../../api/getAPI";
// import deleteAPI from "../../../../../../../../api/deleteAPI";
// import postAPI from "../../../../../../../../api/postAPI";

// const MyCartList = () => {
//   const { userId } = useParams();

//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const fetchCart = async () => {
//     try {
//       const res = await getAPI(`/api/cart/${userId}`);

//       console.log("CART RESPONSE >>> ", res.data);

//       setCart(res.data.items || []);
//     } catch (err) {
//       console.log("Cart load error:", err);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [userId]);

//   const removeItem = async (productId) => {
//     try {
//       await deleteAPI(`/api/cart/remove`, {
//         params: { userId, productId },
//       });

//       setCart((prev) => prev.filter((i) => i.product._id !== productId));
//     } catch (err) {
//       console.log("Remove error:", err);
//     }
//   };

//   const updateQuantity = async (productId, qty) => {
//     try {
//       if (qty < 1) return;

//       await postAPI("/api/cart/update", {
//         userId,
//         productId,
//         quantity: qty,
//       });

//       setCart((prev) =>
//         prev.map((item) =>
//           item.product._id === productId
//             ? { ...item, quantity: qty }
//             : item
//         )
//       );
//     } catch (err) {
//       console.log("Qty update error:", err);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       for (const item of cart) {
//         await deleteAPI(`/api/cart/remove`, {
//           params: { userId, productId: item.product._id },
//         });
//       }

//       setCart([]);
//     } catch (err) {
//       console.log("Clear cart error:", err);
//     }
//   };

  
//   if (loading)
//     return <div className="p-6 text-center text-lg">Loading cart...</div>;

//   if (error)
//     return (
//       <div className="p-6 text-center text-lg text-red-500">
//         Error loading cart.
//       </div>
//     );

//   if (cart.length === 0)
//     return (
//       <div className="p-6 text-center text-lg">Your Cart is Empty.</div>
//     );

//   return (
//     <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 text-lg">
//       <div className="flex flex-col lg:flex-row gap-8">

//         {/* CART TABLE */}
//         <div className="flex-1 overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-yellow-200 text-left">
//                 <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">Product</th>
//                 <th className="py-4 px-4 font-medium">Price</th>
//                 <th className="py-4 px-4 font-medium">Quantity</th>
//                 <th className="py-4 px-4 font-medium rounded-tr-xl rounded-br-xl">Subtotal</th>
//               </tr>
//             </thead>

//             <tbody>
//               {cart.map((item) => (
//                 <tr key={item.product._id} className="border-b">
//                   <td className="py-4 px-4 flex items-center gap-4">
//                     <button
//                       onClick={() => removeItem(item.product._id)}
//                       className="text-xl text-gray-600 hover:text-black"
//                     >
//                       ×
//                     </button>

//                     <img
//                       src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.product.mainImage}`}
//                       className="w-12 h-12 object-cover rounded border"
//                       alt=""
//                     />

//                     <div className="font-semibold">
//                       <p>{item.product.productName}</p>
//                       <p className="text-xs text-gray-500">
//                         {item.product.userId?.username ||
//                           `${item.product.userId?.name || ""} ${item.product.userId?.lastName || ""}`.trim()}
//                       </p>
//                     </div>
//                   </td>

//                   <td className="py-4 px-4">₹{item.product.sellingPrice}</td>

//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
//                         className="w-6 h-6 bg-gray-200 rounded"
//                       >
//                         −
//                       </button>

//                       <span>{item.quantity}</span>

//                       <button
//                         onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
//                         className="w-6 h-6 bg-gray-200 rounded"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </td>

//                   <td className="py-4 px-4">
//                     ₹{item.product.sellingPrice * item.quantity}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* SUMMARY SIDE */}
//         <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
//           <h2 className="text-xl font-semibold">Order Summary</h2>
//           <hr className="my-2" />

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Items</span>
//               <span>{cart.length}</span>
//             </div>

//             <div className="flex justify-between font-medium">
//               <span>Total</span>
//               <span>
//                 ₹{cart.reduce(
//                   (acc, item) =>
//                     acc + item.product.sellingPrice * item.quantity,
//                   0
//                 )}
//               </span>
//             </div>

//             <button className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm">
//               Proceed to Payment
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={clearCart}
//           className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]"
//         >
//           Clear Shopping Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyCartList;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import postAPI from "../../../../../../../../api/postAPI";
import MyCartListSkeleton from "../../../../../../../../Component/Skeleton/Home/Account/MyCartListSkeleton.jsx";
const MyCartList = () => {
  const { userId } = useParams();
const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await getAPI(`/api/cart/${userId}`);
      console.log("CART RESPONSE >>>", res.data);
      setCart(res.data.items || []);
    } catch (err) {
      console.log("Cart load error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const removeItem = async (productId) => {
    try {
      await deleteAPI("/api/cart/remove", {
        params: { userId, productId }
      });

      setCart((prev) => prev.filter((i) => i.product._id !== productId));
    } catch (err) {
      console.log("Remove error:", err);
    }
  };

  const updateQuantity = async (productId, qty) => {
    try {
      if (qty < 1) return;

      await postAPI(
  "/api/cart/update",
  { userId, productId, quantity: qty },
  false 
);


      setCart((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: qty }
            : item
        )
      );
    } catch (err) {
      console.log("Qty update error:", err);
    }
  };

  const clearCart = async () => {
    try {
      for (const item of cart) {
        await deleteAPI("/api/cart/remove", {
          params: { userId, productId: item.product._id }
        });
      }

      setCart([]);
    } catch (err) {
      console.log("Clear cart error:", err);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-lg"><MyCartListSkeleton /></div>;

  if (error)
    return (
      <div className="p-6 text-center text-lg text-red-500">
        Error loading cart. Please try again.
      </div>
    );

  if (cart.length === 0)
    return <div className="p-6 text-center text-lg">Your Cart is Empty.</div>;
const grouped = cart.map(item => ({
  name: item.product.productName,
  qty: item.quantity,
  price: item.product.sellingPrice,
  subtotal: item.quantity * item.product.sellingPrice
}));

  return (
    <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 text-lg">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* CART TABLE */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-200 text-left">
                <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">
                  Product
                </th>
                <th className="py-4 px-4 font-medium">Price</th>
                <th className="py-4 px-4 font-medium">Quantity</th>
                <th className="py-4 px-4 font-medium rounded-tr-xl rounded-br-xl">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id} className="border-b">
                  <td className="py-4 px-4 flex items-center gap-4">

                    {/* REMOVE ONE ITEM */}
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-xl text-gray-600 hover:text-black"
                    >
                      ×
                    </button>

                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.product.mainImage}`}
                      className="w-12 h-12 object-cover rounded border"
                      alt=""
                    />

                    <div className="font-semibold">
                      <p>{item.product.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.product.userId?.username ||
                          `${item.product.userId?.name || ""} ${
                            item.product.userId?.lastName || ""
                          }`}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 px-4">₹{item.product.sellingPrice}</td>

                  {/* QUANTITY BUTTONS */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded"
                      >
                        +
                      </button>

                    </div>
                  </td>

                  <td className="py-4 px-4">
                    ₹{item.product.sellingPrice * item.quantity}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        {/* <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <hr className="my-2" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>
                ₹
                {cart.reduce(
                  (acc, item) =>
                    acc + item.product.sellingPrice * item.quantity,
                  0
                )}
              </span>
            </div>

            <button className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm">
              Proceed to Payment
            </button>
          </div>
        </div> */}
<div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
  <h2 className="text-xl font-semibold">Order Summary</h2>
  <hr className="my-2" />

  {/* ITEM LIST WITH DUPLICATE COUNTS */}
  <div className="space-y-2 mb-4">
    {grouped.map((g, index) => (
      <div key={index} className="flex justify-between text-sm">
        <span>{g.name} × {g.qty}</span>
        <span>₹{g.subtotal}</span>
      </div>
    ))}
  </div>

  <hr className="my-2" />

  {/* TOTAL ITEMS */}
  <div className="flex justify-between text-base text-gray-900">
    <span>Total Items</span>
    <span>{grouped.reduce((acc, g) => acc + g.qty, 0)}</span>
  </div>

  {/* TOTAL PRICE */}
  <div className="flex justify-between font-medium text-base mt-2 text-gray-900">
    <span>Total Price</span>
    <span>
      ₹{grouped.reduce((acc, g) => acc + g.subtotal, 0)}
    </span>
  </div>

  <button 
  onClick={() => navigate(`/my-account/check-out/${userId}`)}
  className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm">
    Proceed to Checkout
  </button>
</div>

      </div>

      {/* CLEAR ALL */}
      <div className="mt-6 flex justify-start">
        <button
          onClick={clearCart}
          className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]"
        >
          Clear Shopping Cart
        </button>
      </div>
    </div>
  );
};

export default MyCartList;
