// import React, { useEffect, useState } from "react";
// import getAPI from "../api/getAPI";
// import postAPI from "../api/postAPI";
// import deleteAPI from "../api/deleteAPI";
// import ProductCard from "./ProductCard";
// import { toast } from "react-toastify";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// const ProductGrid = () => {
//   const [products, setProducts] = useState([]);
//   const [likedProducts, setLikedProducts] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 12;
//   const userId = localStorage.getItem("userId");
//   const userType = localStorage.getItem("userType");

//   const ensureBuyer = () => {
//     if (userType !== "Buyer") {
//       toast.warn("Only buyers can use this feature, Register as a Buyer to continue.");
//       return false;
//     }
//     return true;
//   };

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const [res1, res2, ratingRes, badgeRes] = await Promise.all([
//           getAPI("/api/getstatusapprovedproduct", {}, true, false),
//           getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
//           getAPI("/api/reviews/aggregated", {}, true, false),
//           getAPI("/api/products/approved-with-badges", {}, true, false),
//         ]);

//         const products1 =
//           res1?.data?.data?.filter((p) => p.status === "Approved") || [];

//         const products2 =
//           res2?.data?.data?.filter((p) => p.status === "Approved") || [];

//         const allProducts = [...products1, ...products2].sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         const ratings = ratingRes?.data?.data || [];
//         const productsWithRatings = allProducts.map((p) => {
//           const matched = ratings.find((r) => r.productId === p._id);
//           return {
//             ...p,
//             averageRating: matched?.averageRating
//               ? Number(matched.averageRating)
//               : null,
//             reviewCount: matched?.reviewCount ?? 0,
//           };
//         });

//         const badgeData = badgeRes?.data?.data || [];
//         const finalProducts = productsWithRatings.map((p) => {
//           const match = badgeData.find((b) => b._id === p._id);
//           return {
//             ...p,
//             seller: match?.seller || p.seller,
//             badges: match?.badges || [],
//           };
//         });

//         setProducts(finalProducts);
//       } catch (err) {
//         console.error("Error loading products:", err);
//         setProducts([]);
//       }
//     };

//     fetchAllProducts();
//   }, []);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!userId) return;

//       try {
//         const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
//         const wishlistArray = res?.data?.wishlist || [];

//         const obj = {};
//         wishlistArray.forEach((item) => {
//           obj[item._id] = true;
//         });
//         setLikedProducts(obj);
//       } catch (err) {
//         console.error("Wishlist load error:", err);
//       }
//     };

//     fetchWishlist();
//   }, []);

//   const totalPages = Math.ceil(products.length / itemsPerPage);
//   const indexOfLastProduct = currentPage * itemsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

//   const currentProducts = products.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
//   const goToNextPage = () =>
//     currentPage < totalPages && setCurrentPage(currentPage + 1);
//   const goToPage = (p) => setCurrentPage(p);

//   return (
//     <div className="w-full">

//       {/* PRODUCT GRID */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {currentProducts.map((product) => (
//           <ProductCard
//             key={product._id}
//             product={product}
//             likedProducts={likedProducts}
//             setLikedProducts={setLikedProducts}
//             ensureBuyer={ensureBuyer}
//             userId={userId}
//           />
//         ))}
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-center mt-6">
//         <nav className="flex items-center space-x-2 rounded border border-dark px-3 py-2">
          
//           {/* Prev */}
//           <button
//             onClick={goToPrevPage}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 flex items-center ${
//               currentPage === 1
//                 ? "opacity-50 cursor-not-allowed"
//                 : "hover:text-red-500"
//             }`}
//           >
//             <FiChevronLeft />
//             <span className="ml-1">Previous</span>
//           </button>

//           {/* Page Numbers */}
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//             <button
//               key={p}
//               onClick={() => goToPage(p)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === p
//                   ? "border border-dark text-dark"
//                   : "hover:text-red-500"
//               }`}
//             >
//               {p}
//             </button>
//           ))}

//           {/* Next */}
//           <button
//             onClick={goToNextPage}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 flex items-center ${
//               currentPage === totalPages
//                 ? "opacity-50 cursor-not-allowed"
//                 : "hover:text-red-500"
//             }`}
//           >
//             <span className="mr-1">Next</span>
//             <FiChevronRight />
//           </button>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default ProductGrid;


import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import deleteAPI from "../../api/deleteAPI";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";

const ProductGrid = ({ overrideProducts = null }) => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();

const baseList = overrideProducts 
  ? overrideProducts.map(op => products.find(p => p._id === op._id) || op) 
  : products;


const sortedProducts = [...baseList].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

const indexOfLastProduct = currentPage * itemsPerPage;
const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);


  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (page) => setCurrentPage(page);

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature. Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;

      try {
        const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
        const wishlistArray = res?.data?.wishlist || [];

        const obj = {};
        wishlistArray.forEach((item) => {
          obj[item._id] = true;
        });
        setLikedProducts(obj);
      } catch (error) {
        console.log("Error loading wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);


useEffect(() => {
  const fetchAllProducts = async () => {
    try {
      const [res1, res2, ratingRes, badgeRes] = await Promise.all([
        getAPI("/api/getstatusapprovedproduct", {}, true, false),
        getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
        getAPI("/api/reviews/aggregated", {}, true, false),
        getAPI("/api/products/approved-with-badges", {}, true, false),
      ]);

      const products1 = res1?.data?.data?.filter(p => p.status === "Approved") || [];
      const products2 = res2?.data?.data?.filter(p => p.status === "Approved") || [];
      const allProducts = [...products1, ...products2];

      const ratingsMap = {};
      (ratingRes?.data?.data || []).forEach(r => {
        ratingsMap[String(r.productId)] = r;
      });

      const badgeMap = {};
      (badgeRes?.data?.data || []).forEach(b => {
        badgeMap[String(b._id)] = b;
      });

      const enriched = allProducts.map(prod => {
        const pid = String(prod._id);
        const r = ratingsMap[pid];
        const b = badgeMap[pid];

        return {
          ...prod,
          averageRating: r?.averageRating ? Number(r.averageRating) : null,
          reviewCount: r?.reviewCount ?? 0,
          badges: b?.badges ?? [],
          seller: b?.seller ?? prod.seller,
        };
      });

      setProducts(enriched);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  fetchAllProducts();
}, []);

  const handleWishlist = async (productId, e) => {
    e.stopPropagation();
    if (!ensureBuyer()) return;

    const isLiked = likedProducts[productId];

    try {
      if (isLiked) {
        await deleteAPI("/api/wishlist/remove", { params: { userId, productId } });
        toast.warn("Removed from Wishlist");
      } else {
        await postAPI("/api/wishlist/add", { userId, productId });
        toast.success("Added to Wishlist");
      }

      setLikedProducts((prev) => ({
        ...prev,
        [productId]: !isLiked,
      }));
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const addToCart = async (productId, e) => {
    e.stopPropagation();
    if (!ensureBuyer()) return;

    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (avg) => {
    if (avg == null)
      return [1, 2, 3, 4, 5].map((s) => <FaStar key={s} className="text-gray-300" />);

    const filled = Math.round(avg);
    return [1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={s <= filled ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    
     <main className="md:col-span-3">
                  {/* <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3"> */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                    {currentProducts.map((product) => {
                      const hasDiscount =
                        product.sellingPrice < product.marketPrice;
                      const discountPercent = hasDiscount
                        ? Math.round(
                            ((product.marketPrice - product.sellingPrice) /
                              product.marketPrice) *
                              100
                          )
                        : 0;
    
                      const average = product.averageRating;
                      const reviewCount = product.reviewCount ?? 0;
    
                      return (
                        <div
                          key={product._id}
                          onClick={() =>
                            navigate(`/product-details/${product._id}`)
                          }
                          //className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1 m-3"
                          className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between product-card transition-transform duration-300 hover:-translate-y-1 mx-auto w-full max-w-[330px] my-2"
                        >
                          {/* Image */}
                          <div className="relative p-img">
                            {product.editionType && (
                              <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                                {product.editionType}
                              </span>
                            )}
                            <img
                              src={`${imageBaseURL}${product.mainImage}`}
                              alt={product.productName}
                              className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                            />
                            <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                              {/* <Heart className="w-5 h-5 text-white" /> */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWishlist(product._id, e);
                                }}
                                className="cursor-pointer"
                              >
                                {likedProducts[product._id] ? (
                                  <Heart
                                    size={20}
                                    className="stroke-white"
                                    style={{ fill: "white" }}
                                  />
                                ) : (
                                  <Heart
                                    size={20}
                                    className="stroke-white"
                                    style={{ fill: "transparent" }}
                                  />
                                )}
                              </div>
                            </button>
                          </div>
    
                          {/* Product Info */}
                          <div className="p-3 product-info">
                            <h2
                              className="text-base sm:text-lg text-dark font-semibold mt-1"
                              title={product.productName}
                            >
                              {product.productName}
                            </h2>
                            <div className="flex items-center gap-1 mt-1">
                              {/* Artist name from populated userId */}
                              <p
                                className="text-gray-700 text-xs sm:text-sm font-medium flex items-center"
                                title={`${product.userId?.name ?? ""} ${
                                  product.userId?.lastName ?? ""
                                }`}
                              >
                                {product.userId?.name ||
                                  product.userId?.firstName ||
                                  "Unknown"}{" "}
                                {product.userId?.lastName
                                  ? product.userId.lastName
                                  : ""}
                              </p>
    
                              {/*badges*/}
                              {product.badges?.map((img, index) => (
                                <img
                                  key={index}
                                  src={`${imageBaseURL}${img}`}
                                  className="w-5 h-5 rounded-full"
                                />
                              ))}
                            </div>
                            {/* Rating */}
                            {average == null || reviewCount === 0 ? (
                              <div className="flex items-center gap-2 mt-2 text-gray-500 italic">
                                No rating available, be the first to review!
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm font-bold text-orange-700">
                                  {Number(average).toFixed(1)}
                                </span>
                                <div className="flex items-center">
                                  {renderStars(average)}
                                </div>
                                <span className="text-gray-500 text-sm">
                                  ({reviewCount}{" "}
                                  {reviewCount === 1 ? "Review" : "Reviews"})
                                </span>
                              </div>
                            )}
    
                            {/* Price */}
                            <div className="flex items-center gap-2 mt-2">
                              {hasDiscount && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {discountPercent}% OFF
                                </span>
                              )}
                              {hasDiscount ? (
                                <>
                                  <span className="text-gray-400 line-through">
                                    ₹{product.marketPrice}
                                  </span>
                                  <span className="text-lg font-bold text-gray-900">
                                    ₹{product.sellingPrice}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{product.sellingPrice}
                                </span>
                              )}
                            </div>
                          </div>
    
                          {/* Buttons */}
                          <div className="p-3 product-button d-none d-md-block">
                            <div className="flex justify-between gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!ensureBuyer()) return;
    
                                  addToCart(product._id);
                                }}
                                className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart hover:bg-dark hover:text-white transition"
                              >
                                <FaShoppingCart /> Add to Cart
                              </button>
    
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!ensureBuyer()) return;
                                  navigate(
                                    `/my-account/check-out/${userId}?productId=${product._id}`
                                  );
                                }}
                                className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now"
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-center mt-6">
                    <nav className="flex flex-wrap sm:flex-nowrap items-center space-x-2 rounded border border-dark px-2 sm:px-3 py-2 text-sm sm:text-lg font-semibold overflow-x-auto no-scrollbar">
                      {/* Previous */}
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`px-2 sm:px-3 py-1 flex items-center ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:text-red-500"
                        }`}
                      >
                        <FiChevronLeft className="self-center flex-shrink-0" />
                        <span className="ml-1">Previous</span>
                      </button>
    
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-2 sm:px-3 py-1 rounded ${
                              currentPage === page
                                ? "border border-dark text-dark"
                                : "hover:text-red-500"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
    
                      {/* Next */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-2 sm:px-3 py-1 flex items-center ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:text-red-500"
                        }`}
                      >
                        <span className="mr-1">Next</span>
                        <FiChevronRight className="self-center flex-shrink-0" />
                      </button>
                    </nav>
                  </div>
                </main>

  );
};

export default ProductGrid;
