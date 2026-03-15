import React, { useState, useEffect } from "react";
import { getImageUrl } from '../../../../../utils/getImageUrl';
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BiddedProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setSellerId(decoded.userId);
      } catch (err) {
        console.log("Token decode failed:", err);
      }
    }
  }, []);

  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         try {
  //             const result = await getAPI("/api/getbiddedproduct", {}, true, false);
  //             if (result && result.data && Array.isArray(result.data.biddedProducts)) {
  //                 setProducts(result.data.biddedProducts);
  //             } else {
  //                 console.error("API response does not contain an array:", result.data);
  //                 setProducts([]);
  //             }

  //         } catch (error) {
  //             console.error("Error fetching products:", error);
  //             setProducts([]);
  //         }
  //     };

  //     fetchProducts();
  // }, []);
  useEffect(() => {
    if (!sellerId) return;

    const fetchData = async () => {
      try {
        const result = await getAPI(
          `/api/seller-bidded-products/${sellerId}`,
          {},
          true,
          false
        );

        console.log("Seller Bidded Products:", result);

        if (result?.data?.data && Array.isArray(result.data.data)) {
          setProducts(result.data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.log("Fetch error:", err);
        setProducts([]);
      }
    };

    fetchData();
  }, [sellerId]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

//   const filteredProducts = products.filter(
//     (product) =>
//       product?.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product?.buyer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );
const filteredProducts = products.filter((item) => {
  const winner = item.assignedWinners?.[0];
  return winner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
});

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // const displayedProducts = filteredProducts.slice(
  //     (currentPage - 1) * productsPerPage,
  //     currentPage * productsPerPage
  // );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
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
                <table className="table table-hover text-nowrap">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Buyer Name</th>
                      <th>Product Name</th>
                      <th>Bidded Price</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      // paginatedProducts.map((product, index) => {
                      //     const productData = product.product?.product;
                      //     const buyer = product.buyer;
                      paginatedProducts.map((product, index) => {
                        const productData = product.product;
                        const buyer = product.assignedWinners?.[0] || {
                          name: "No Buyer",
                          lastName: "",
                        };
                        product.totalPrice = buyer.amount || 0;

                        return (
                          <tr key={product._id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              {buyer.name} {buyer.lastName}
                            </td>
                            <td>
                              {productData ? (
                                <>
                                  <img
                                    src={getImageUrl(productData.mainImage)}
                                    className="rounded-circle avatar"
                                    alt=""
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      objectFit: "cover",
                                      marginRight: "10px",
                                    }}
                                  />
                                  {productData.productName}
                                </>
                              ) : (
                                "No Product Data"
                              )}
                            </td>
                            <td>
                              {productData
                                ? new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                  })
                                    .format(product.totalPrice)
                                    .replace(/\.00$/, "")
                                : "N/A"}
                            </td>
                            <td>
                              {new Date(product.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-info mr-2"
                                onClick={() =>
                                  navigate(
                                    `/Dashboard/biddedproduct/productdetails/${productData._id}`
                                  )
                                }
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody> */}
                    <tbody>
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((item, index) => {
                        const product = item.product;
                        const winner = item.assignedWinners?.[0];

                        return (
                          <tr key={item.bidId}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>

                            {/* Buyer Name */}
                            <td>{winner?.name || "No Buyer Yet"}</td>

                            {/* Product */}
                            <td>
                              <img
                                src={getImageUrl(product?.mainImage)}
                                className="rounded-circle avatar"
                                alt=""
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                              {product?.productName}
                            </td>

                            {/* Bidded Price */}
                            <td>{winner?.amount || "No Bids"}</td>

                            {/* Date */}
                            <td>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>

                            {/* View Button */}
                            <td>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() =>
                                  navigate(
                                    `/seller/product-fetch-view-seller/${product?.id}`
                                  )
                                }
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * productsPerPage,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter((pageNumber) => pageNumber === currentPage)
                    .map((pageNumber, index, array) => {
                      const prevPage = array[index - 1];
                      if (prevPage && pageNumber - prevPage > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${pageNumber}`}>
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                            <li
                              key={pageNumber}
                              className={`paginate_button page-item ${
                                currentPage === pageNumber ? "active" : ""
                              }`}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              <button className="page-link">
                                {pageNumber}
                              </button>
                            </li>
                          </React.Fragment>
                        );
                      }

                      return (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <button className="page-link">{pageNumber}</button>
                        </li>
                      );
                    })}

                  <li
                    className={`paginate_button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    onClick={handleNext}
                  >
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BiddedProduct;

// import React, { useState, useEffect } from "react";
// import getAPI from "../../../../../api/getAPI";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const BiddedProduct = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [productsPerPage, setProductsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [sellerId, setSellerId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) return;

//     try {
//       const decoded = jwtDecode(token);
//       setSellerId(decoded.userId);
//       console.log("Decoded Seller ID:", decoded.userId);
//     } catch (err) {
//       console.log("Token decode failed:", err);
//     }
//   }, []);

//   useEffect(() => {
//     if (!sellerId) return;

//     const fetchData = async () => {
//       try {
//         console.log("🔥 Fetching seller bidded products:", sellerId);

//         const response = await getAPI(
//           `/api/seller-bidded-products/${sellerId}`,
//           {},
//           true,
//           false
//         );

//         console.log("🔥 API Response:", response);

//         if (response?.data?.data && Array.isArray(response.data.data)) {
//           setProducts(response.data.data);
//         } else {
//           console.log("Unexpected API format", response);
//           setProducts([]);
//         }
//       } catch (err) {
//         console.log("Fetch Error:", err);
//         setProducts([]);
//       }
//     };

//     fetchData();
//   }, [sellerId]);

//   const filteredProducts = products.filter((item) =>
//     item?.assignedWinners?.[0]?.name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };
//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   return (
//     <>
//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <div className="d-none d-md-flex align-items-center">
//                 <label className="mb-0 mr-2">Show</label>
//                 <select
//                   className="form-control form-control-sm"
//                   value={productsPerPage}
//                   onChange={(e) => {
//                     setProductsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                 </select>
//               </div>

//               <div className="input-group" style={{ maxWidth: "150px" }}>
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   placeholder="Search buyer"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="body">
//               <div className="table-responsive">
//                 <table className="table table-hover text-nowrap">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th>#</th>
//                       <th>Buyer</th>
//                       <th>Product</th>
//                       <th>Bid Amount</th>
//                       <th>Date</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>

                //   <tbody>
                //     {paginatedProducts.length === 0 ? (
                //       <tr>
                //         <td colSpan="6" className="text-center">
                //           No data available
                //         </td>
                //       </tr>
                //     ) : (
                //       paginatedProducts.map((item, index) => {
                //         const product = item.product;
                //         const winner = item.assignedWinners?.[0];

                //         return (
                //           <tr key={item.bidId}>
                //             <td>
                //               {(currentPage - 1) * itemsPerPage + index + 1}
                //             </td>

                //             {/* Buyer Name */}
                //             <td>{winner?.name || "No Buyer Yet"}</td>

                //             {/* Product */}
                //             <td>
                //               <img
                //                 src={getImageUrl(product?.mainImage)}
                //                 className="rounded-circle avatar"
                //                 alt=""
                //                 style={{
                //                   width: "30px",
                //                   height: "30px",
                //                   objectFit: "cover",
                //                   marginRight: "10px",
                //                 }}
                //               />
                //               {product?.productName}
                //             </td>

                //             {/* Bidded Price */}
                //             <td>{winner?.amount || "No Bids"}</td>

                //             {/* Date */}
                //             <td>
                //               {new Date(item.createdAt).toLocaleDateString()}
                //             </td>

                //             {/* View Button */}
                //             <td>
                //               <button
                //                 className="btn btn-sm btn-outline-info"
                //                 onClick={() =>
                //                   navigate(
                //                     `/Dashboard/biddedproduct/productdetails/${product?.id}`
                //                   )
                //                 }
                //               >
                //                 <i className="fa fa-eye"></i>
                //               </button>
                //             </td>
                //           </tr>
                //         );
                //       })
                //     )}
                //   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="pagination d-flex justify-content-between mt-3">
//                 <button
//                   className="btn btn-secondary btn-sm"
//                   disabled={currentPage === 1}
//                   onClick={handlePrevious}
//                 >
//                   Previous
//                 </button>

//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>

//                 <button
//                   className="btn btn-secondary btn-sm"
//                   disabled={currentPage === totalPages}
//                   onClick={handleNext}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BiddedProduct;
