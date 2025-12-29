import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import useUserType from "../../../urlconfig";
import { jwtDecode } from "jwt-decode";

const ProductRequest = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const navigate = useNavigate();
  const userType = useUserType();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
        } else {
          console.error("User ID not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  // useEffect(() => {
  //     if (!userId) return;
  //     const fetchProducts = async () => {
  //         try {
  //             const result = await getAPI(`/api/getartistsoldproductbyid/${encodeURIComponent(userId)}`, {}, true, false);
  //             console.log("Full API Response:", result);
  //             console.log("Data Type:", typeof result.data);

  //             if (result && result.data && Array.isArray(result.data)) {
  //                 setProducts(result.data); // MODIFIED
  //             } else {
  //                 console.error("API response does not contain a valid array:", result.data);
  //                 setProducts([]); // MODIFIED
  //             }
  //         } catch (error) {
  //             console.error("Error fetching products:", error);
  //             setProducts([]);
  //         }
  //     };

  //     fetchProducts();
  // }, [userId]);
  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         try {
  //             const result = await getAPI(`/api/artist-purchases/${userId}`);


  // console.log("API DATA RECEIVED:", result.data.data);

  //             if (result?.data?.success) {
  //                 setProducts(result.data.data);
  //             } else {
  //                 setProducts([]);
  //             }
  //         } catch (error) {
  //             console.error("Error fetching artist purchased products:", error);
  //             setProducts([]);
  //         }
  //     };

  //     fetchProducts();
  // }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProducts = async () => {
      try {
        const result = await getAPI(
          `/api/artist-purchases/${userId}`,
          {},
          true,
          false
        );

        console.log("🔥 Purchased Artist Products Response:", result);

        if (result?.data?.data && Array.isArray(result.data.data)) {
          setProducts(result.data.data);
        } else {
          setProducts([]);
        }

      } catch (error) {
        console.error("❌ Error fetching purchased products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [userId]);

  const filteredProducts = products.filter(
    (product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const goToNextImage = () => {
    if (currentImageIndex < currentImages.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex justify-content-between align-items-center">
            <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
              <label className="mb-0 mr-2">Show</label>
              <select
                name="DataTables_Table_0_length"
                aria-controls="DataTables_Table_0"
                className="form-control form-control-sm"
                value={productsPerPage}
                onChange={handleProductsPerPageChange}
                style={{ minWidth: "70px" }}
              >
                {/* <option value="5">5</option> */}
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <label className="mb-0 ml-2">entries</label>
            </div>
            <div className="w-100 w-md-auto d-flex justify-content-end">
              <div className="input-group" style={{ maxWidth: "150px" }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i
                  className="fa fa-search"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                ></i>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Product Quantity</th>
                    <th>Payment Type</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                      <td>{product.artistName || "N/A"}</td>
                      <td>
                        <img
                          src={`${BASE_URL}${product.productImage}`}
                          alt=""
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: "10px"
                          }}
                        />
                        {product.productName}
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
                          .format(product.subtotal)
                          .replace(/\.00$/, "")}
                      </td>
                      <td>{product.quantityPurchased}</td>
                      <td>{product.paymentMethod}</td>
                      <td>{new Date(product.purchaseDate).toLocaleDateString("en-IN")}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigate(`/artist/product-fetch-view-artist/${product.productId}`)}
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination d-flex justify-content-between mt-4">
              <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
              </span>
              <ul className="pagination d-flex justify-content-end w-100">
                <li className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`} onClick={handlePrevious}>
                  <button className="page-link">Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <li key={pageNumber} className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""}`} onClick={() => setCurrentPage(pageNumber)}>
                    <button className="page-link">{pageNumber}</button>
                  </li>
                ))}
                <li className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`} onClick={handleNext}>
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRequest;

const ProductPurchasedSkeleton = () => {
  return (
    <div className="animate-pulse p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="flex gap-2">
          <div className="h-4 w-6 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="hidden md:flex items-center gap-3">
          <div className="h-6 w-10 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
          <div className="h-6 w-14 bg-gray-300 rounded"></div>
        </div>

        <div className="h-8 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {[
                "#",
                "Name",
                "Product Name",
                "Product Price",
                "Quantity",
                "Payment",
                "Date",
                "Action",
              ].map((head) => (
                <th key={head} className="p-3 text-left text-gray-700 text-sm">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* Skeleton Rows */}
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">
                  <div className="h-4 w-6 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3 flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </td>

                <td className="p-3">
                  <div className="h-8 w-8 bg-gray-300 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 w-52 bg-gray-300 rounded"></div>

        <div className="flex gap-2">
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};
