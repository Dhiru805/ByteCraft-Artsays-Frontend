// import React from "react";

// const products = [
//   {
//     id: 1,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     qualityDate: "15 June 2023",
//     status: "In stock",
//     image: "https://i.imgur.com/A1eDB3M.png",
//   },
//   {
//     id: 2,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     qualityDate: "15 June 2023",
//     status: "In stock",
//     image: "https://i.imgur.com/EX3Z8Zz.png",
//   },
//   {
//     id: 3,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     qualityDate: "15 June 2023",
//     status: "In stock",
//     image: "https://i.imgur.com/Ci1YZ4X.png",
//   },
//   {
//     id: 4,
//     title: "Golden Era Paintings",
//     owner: "Celebrated Classics",
//     price: 44.0,
//     qualityDate: "15 June 2023",
//     status: "In stock",
//     image: "https://i.imgur.com/Ci1YZ4X.png",
//   },
// ];

// const WishlistTable = () => {
//   return (
//     <div className="max-w-[1464px] w-full px-4 sm:px-6 lg:px-12 pt-10 text-lg overflow-hidden">
//       {/* Responsive Scrollable Table */}
//       <div className="w-full overflow-x-auto">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-yellow-200 text-left">
//               <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">Product</th>
//               <th className="py-4 px-4 font-medium">Prices</th>
//               <th className="py-4 px-4 font-medium">Quality</th>
//               <th className="py-4 px-4 font-medium">Subtotal</th>
//               <th className="py-4 px-4 rounded-tr-xl rounded-br-xl text-right"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((item) => (
//               <tr key={item.id} className="border-b">
//                 <td className="py-4 px-4 flex items-center gap-4 min-w-[200px]">
//                   <button className="text-xl text-gray-600 hover:text-black">×</button>
//                   <img
//                     src={item.image}
//                     alt="product"
//                     className="w-12 h-12 object-cover rounded border border-gray-300 p-2"
//                   />
//                   <div className="font-semibold">
//                     <p className="text-gray-800">{item.title}</p>
//                     <p className="text-xs text-gray-500">Owned by {item.owner}</p>
//                   </div>
//                 </td>
//                 <td className="py-4 px-4">${item.price.toFixed(2)}</td>
//                 <td className="py-4 px-4">{item.qualityDate}</td>
//                 <td className="py-4 px-4">{item.status}</td>
//                 <td className="py-4 px-4 text-right">
//                   <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
//                     Add to Cart
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer Actions */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4 w-full overflow-hidden">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
//           <label className="text-sm text-gray-600 whitespace-nowrap underline">
//             Wishlist link:
//           </label>
//           <input
//             type="text"
//             className="border border-gray-300 text-gray-400 rounded-full px-4 py-3 text-sm w-full sm:w-80"
//             value="https://www.example.com"
//             readOnly
//           />
//           <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2">
//             Copy Link
//           </button>
//         </div>
//         <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full md:w-auto">
//           <button className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]">
//             Clear Wishlist
//           </button>
//           <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2">
//             Add All to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WishlistTable;
















// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import getAPI from "../../../../../../../../api/getAPI";
// import deleteAPI from "../../../../../../../../api/deleteAPI";
// const WishlistTable = () => {
//   const { userId } = useParams();
//   const [wishlist, setWishlist] = useState([]);

//   const fetchWishlist = async () => {
//     try {
//       const res = await getAPI(`/api/wishlist/${userId}`);

//       setWishlist(res?.data?.wishlist || []);
//     } catch (err) {
//       console.log("Error loading wishlist:", err);
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   // REMOVE SINGLE ITEM
//   const removeItem = async (productId) => {
//     try {
//     await deleteAPI("/api/wishlist/remove", {
//     params: { userId, productId }
// });


//       setWishlist((prev) =>
//         prev.filter((item) => item._id !== productId)
//       );
//     } catch (err) {
//       console.log("Error removing item:", err);
//     }
//   };

//   // CLEAR ENTIRE WISHLIST
//   const clearWishlist = async (productId) => {
//     try {
//       for (const item of wishlist) {
//         await deleteAPI("/api/wishlist/remove", {
//     params: { userId, productId: item._id }
// });
//       }

//       setWishlist([]);
//     } catch (err) {
//       console.log("Error clearing wishlist:", err);
//     }
//   };

//   return (
//     <div className="max-w-[1464px] w-full px-4 sm:px-6 lg:px-12 pt-10 text-lg overflow-hidden">
//       <div className="w-full overflow-x-auto">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-yellow-200 text-left">
//               <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">
//                 Product
//               </th>
//               <th className="py-4 px-4 font-medium">Price</th>
//               <th className="py-4 px-4 font-medium">Category</th>
//               <th className="py-4 px-4 font-medium">Status</th>
//               <th className="py-4 px-4 rounded-tr-xl rounded-br-xl text-right" />
//             </tr>
//           </thead>

//           <tbody>
//             {wishlist.length === 0 ? (
//               <tr>
//                 <td className="py-5 px-4 text-center text-gray-600" colSpan="5">
//                   Wishlist is empty
//                 </td>
//               </tr>
//             ) : (
//               wishlist.map((item) => (
//                 <tr key={item._id} className="border-b">
//                   <td className="py-4 px-4 flex items-center gap-4 min-w-[200px]">
//                     <button
//                       className="text-xl text-gray-600 hover:text-black"
//                       onClick={() => removeItem(item._id)}
//                     >
//                       ×
//                     </button>

//                     <img
//                       src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.mainImage}`}

//                       alt="product"
//                       className="w-12 h-12 object-cover rounded border border-gray-300 p-2"
//                     />

//                     <div className="font-semibold">
//                       <p className="text-gray-800">{item.productName}</p>
//                       <p className="text-xs text-gray-500">
//                         {item.userId?.name || "Unknown Seller"}
//                       </p>
//                     </div>
//                   </td>

//                   <td className="py-4 px-4">₹{item.sellingPrice}</td>
//                   <td className="py-4 px-4">{item.category || "N/A"}</td>
//                   <td className="py-4 px-4">{item.status || "Available"}</td>

//                   <td className="py-4 px-4 text-right">
//                     <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
//                       Add to Cart
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* FOOTER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4 w-full overflow-hidden">
//         {/* <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
//           <label className="text-sm text-gray-600 whitespace-nowrap underline">
//             Wishlist link:
//           </label>
//           <input
//             type="text"
//             className="border border-gray-300 text-gray-400 rounded-full px-4 py-3 text-sm w-full sm:w-80"
//             value={`${window.location.origin}/my-account/wishlist/${userId}`}
//             readOnly
//           />
//           <button
//             className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2"
//             onClick={() =>
//               navigator.clipboard.writeText(
//                 `${window.location.origin}/my-account/wishlist/${userId}`
//               )
//             }
//           >
//             Copy Link
//           </button>
//         </div> */}

//         <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full md:w-auto">
//           <button
//             className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]"
//             onClick={clearWishlist}
//           >
//             Clear Wishlist
//           </button>
//           <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2">
//             Add All to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WishlistTable;











import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import postAPI from "../../../../../../../../api/postAPI";
import { toast } from "react-toastify";
const WishlistTable = () => {
  const { userId } = useParams();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAPI("/api/all-complete");
        const data = res?.data?.data || {};

        setCategoryData({
          mainCategories: data.mainCategories || [],
          categories: data.categories || [],
          subCategories: data.subCategories || [],
        });
      } catch (err) {
        console.log("Category load error:", err);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryById = (id) =>
    categoryData.categories.find((c) => String(c._id) === String(id));

  useEffect(() => {
    if (categoryData.categories.length === 0) return;

    const fetchWishlist = async () => {
      try {
        const res = await getAPI(`/api/wishlist/${userId}`);
        const list = res?.data?.wishlist || [];

        const enriched = list.map((item) => {
          const catObj = getCategoryById(item.category);
          return {
            ...item,
            categoryName: catObj?.categoryName || "N/A",
          };
        });

        setWishlist(enriched);
      } catch (err) {
        console.log("Error loading wishlist:", err);
      }
    };

    fetchWishlist();
  }, [categoryData]);

  const removeItem = async (productId) => {
    try {
      await deleteAPI("/api/wishlist/remove", {
        params: { userId, productId },
      });

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.log("Error removing item:", err);
    }
  };

  const clearWishlist = async () => {
    try {
      const items = [...wishlist];

      for (const item of items) {
        await deleteAPI("/api/wishlist/remove", {
          params: { userId, productId: item._id },
        });
      }

      setWishlist([]);
    } catch (err) {
      console.log("Error clearing wishlist:", err);
    }
  };
  const addToCart = async (productId) => {
    if (loading) return;
    setLoading(true);
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      await deleteAPI("/api/wishlist/remove", { params: { userId, productId } });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Successfully added to cart");
    } catch (err) {
      console.log("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const addAllToCart = async () => {
    if (loading || wishlist.length === 0) return;
    setLoading(true);
    try {
      for (const item of wishlist) {
        await postAPI(`/api/cart/addcart/${item._id}`, {}, true);
        await deleteAPI("/api/wishlist/remove", {
          params: { userId, productId: item._id },
        });
      }
      setWishlist([]);
      toast.success("All items successfully added to cart");
    } catch (err) {
      console.log("Error adding all items:", err);
      toast.error("Failed to add all items to cart");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-yellow-200 text-left">
              <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">
                Product
              </th>
              <th className="py-4 px-4 font-medium">Price</th>
              <th className="py-4 px-4 font-medium">Category</th>
              <th className="py-4 px-4 font-medium">Status</th>
              <th className="py-4 px-4 rounded-tr-xl rounded-br-xl text-right" />
            </tr>
          </thead>

          <tbody>
            {wishlist.length === 0 ? (
              <tr>
                <td className="py-5 px-4 text-center text-gray-600" colSpan="5">
                  Wishlist is empty
                </td>
              </tr>
            ) : (
              wishlist.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="py-4 px-4 flex items-center gap-4 min-w-[200px]">
                    <button
                      className="text-xl text-gray-600 hover:text-black"
                      onClick={() => removeItem(item._id)}
                    >
                      ×
                    </button>

                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${item.mainImage}`}
                      alt="product"
                      className="w-12 h-12 object-cover rounded border border-gray-300 p-2"
                    />

                    <div className="font-semibold">
                      <p className="text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.userId
                          ? `${item.userId.name || ""} ${item.userId.lastName || ""}`.trim() || item.userId.username || "Unknown Seller"
                          : "Unknown Seller"}
                      </p>

                    </div>
                  </td>

                  <td className="py-4 px-4">₹{item.sellingPrice}</td>

                  {/* CATEGORY FIX */}
                  <td className="py-4 px-4">{item.categoryName}</td>

                  <td className="py-4 px-4">{item.status || "Available"}</td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => addToCart(item._id)}
                        disabled={loading}
                        className={`bg-[#5C4033] hover:bg-[#4b3327] text-white px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Adding...
                          </>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full md:w-auto">
          <button
            className={`text-sm text-[#5C4033] underline hover:text-[#3e2c1e] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={clearWishlist}
            disabled={loading}
          >
            Clear Wishlist
          </button>
          <button
            onClick={addAllToCart}
            disabled={loading || wishlist.length === 0}
            className={`bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2 flex items-center gap-2 transition-all ${
              loading || wishlist.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              "Add All to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistTable;
