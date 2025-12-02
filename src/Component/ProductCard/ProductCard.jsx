import React, { useEffect, useState } from "react";
import getAPI from "../api/getAPI";
import postAPI from "../api/postAPI";
import deleteAPI from "../api/deleteAPI";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature, Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [res1, res2, ratingRes, badgeRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
        ]);

        const products1 =
          res1?.data?.data?.filter((p) => p.status === "Approved") || [];

        const products2 =
          res2?.data?.data?.filter((p) => p.status === "Approved") || [];

        const allProducts = [...products1, ...products2].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const ratings = ratingRes?.data?.data || [];
        const productsWithRatings = allProducts.map((p) => {
          const matched = ratings.find((r) => r.productId === p._id);
          return {
            ...p,
            averageRating: matched?.averageRating
              ? Number(matched.averageRating)
              : null,
            reviewCount: matched?.reviewCount ?? 0,
          };
        });

        const badgeData = badgeRes?.data?.data || [];
        const finalProducts = productsWithRatings.map((p) => {
          const match = badgeData.find((b) => b._id === p._id);
          return {
            ...p,
            seller: match?.seller || p.seller,
            badges: match?.badges || [],
          };
        });

        setProducts(finalProducts);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
      }
    };

    fetchAllProducts();
  }, []);

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
      } catch (err) {
        console.error("Wishlist load error:", err);
      }
    };

    fetchWishlist();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPage = (p) => setCurrentPage(p);

  return (
    <div className="w-full">

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            likedProducts={likedProducts}
            setLikedProducts={setLikedProducts}
            ensureBuyer={ensureBuyer}
            userId={userId}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-2 rounded border border-dark px-3 py-2">
          
          {/* Prev */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 flex items-center ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-red-500"
            }`}
          >
            <FiChevronLeft />
            <span className="ml-1">Previous</span>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 rounded ${
                currentPage === p
                  ? "border border-dark text-dark"
                  : "hover:text-red-500"
              }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 flex items-center ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-red-500"
            }`}
          >
            <span className="mr-1">Next</span>
            <FiChevronRight />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ProductGrid;
