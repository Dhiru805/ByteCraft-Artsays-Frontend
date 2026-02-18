// import React, { useState, useEffect } from 'react';
// import getAPI from '../../../../../api/getAPI';
// import { useNavigate } from 'react-router-dom';
// import useUserType from '../../../urlconfig';

// const ProductRequest = () => {
//     const [products, setProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage, setProductsPerPage] = useState(10);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showPopup, setShowPopup] = useState(false);
//     const [currentImages, setCurrentImages] = useState([]);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;



//     const navigate = useNavigate();
//     const userType = useUserType();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const result = await getAPI("/api/getbuyerpurchaseproduct", {}, true, false);
//                 console.log("Full API Response:", result);
//                 console.log("Data Type:", typeof result.data);

//                 if (result && result.data && Array.isArray(result.data.purchases)) {
//                     setProducts(result.data.purchases);
//                 } else {
//                     console.error("API response does not contain an array:", result.data);
//                     setProducts([]);
//                 }

//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 setProducts([]);
//             }
//         };

//         fetchProducts();
//     }, []);


//     const filteredProducts = products.filter(product => {
//         const fullName = `${product.buyer.name} ${product.buyer.lastName}`.toLowerCase();
//         return fullName.includes(searchTerm.toLowerCase());
//     });

//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//     const displayedProducts = filteredProducts.slice(
//         (currentPage - 1) * productsPerPage,
//         currentPage * productsPerPage
//     );
//     const handlePrevious = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNext = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handleProductsPerPageChange = (event) => {
//         setProductsPerPage(Number(event.target.value));
//         setCurrentPage(1);
//     };

// const handleImageClick = (product) => {
//         const productData = product.product || product.resellProduct;
//         const images = [productData?.mainImage, ...(productData?.otherImages || [])].filter(Boolean);
//         setCurrentImages(images);
//         setCurrentImageIndex(0);
//         setShowPopup(true);
//     };

//     const goToPreviousImage = () => {
//         setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//     };

//     const goToNextImage = () => {
//         setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1));
//     };

//     return (
//         <div className="container-fluid">
//             <div className="block-header">
//                 <div className="row">
//                     <div className="col-lg-6 col-md-6 col-sm-12">
//                         <h2>Buyer Product Purchased</h2>
//                         <ul className="breadcrumb">
//                             <li className="breadcrumb-item">
//                                 <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
//                                     <i className="fa fa-dashboard"></i>
//                                 </span>
//                             </li>
//                             <li className="breadcrumb-item">Buyer Product Purchased</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             <div className="row clearfix">
//                 <div className="col-lg-12">
//                     <div className="card">
//                         <div className="header d-flex justify-content-between align-items-center">
//                             <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//                                 <label className="mb-0 mr-2">Show</label>
//                                 <select
//                                     name="DataTables_Table_0_length"
//                                     aria-controls="DataTables_Table_0"
//                                     className="form-control form-control-sm"
//                                     value={productsPerPage}
//                                     onChange={handleProductsPerPageChange}
//                                     style={{ minWidth: '70px' }}
//                                 >
//                                     {/* <option value="5">5</option> */}
//                                     <option value="10">10</option>
//                                     <option value="25">25</option>
//                                     <option value="50">50</option>
//                                     <option value="100">100</option>
//                                 </select>
//                                 <label className="mb-0 ml-2">entries</label>
//                             </div>
//                             <div className="w-100 w-md-auto d-flex justify-content-end">
//                                 <div className="input-group" style={{ maxWidth: '150px' }}>
//                                     <input
//                                         type="text"
//                                         className="form-control form-control-sm"
//                                         placeholder="Search"
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                     <i
//                                         className="fa fa-search"
//                                         style={{
//                                             position: 'absolute',
//                                             right: '10px',
//                                             top: '50%',
//                                             transform: 'translateY(-50%)',
//                                             pointerEvents: 'none',
//                                         }}
//                                     ></i>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="body">
//                             <div className="table-responsive">
//                                 <table className="table table-hover">
//                                     <thead className="thead-dark">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Name</th>
//                                             <th>Product Name</th>
//                                             <th>Product Price</th>
//                                             <th>Product Quantity</th>
//                                             <th>Payment Type</th>
//                                             <th>Date</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {displayedProducts.map((product, index) => {
//                                             const productData = product.product || product.resellProduct;
//                                             return (
//                                                 <tr key={product._id}>
//                                                     <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
//                                                     <td>{product.buyer.name} {product.buyer.lastName}</td>
//                                                     <td>
//                                                         {productData ? (
//                                                             <>
//                                                                 <img
//                                                                     src={`${BASE_URL}${productData.mainImage}`}
//                                                                     className="rounded-circle avatar"
//                                                                     alt=""
//                                                                     onClick={() => handleImageClick(product)}
//                                                                     style={{
//                                                                         width: '30px',
//                                                                         height: '30px',
//                                                                         objectFit: 'cover',
//                                                                         marginRight: '10px',
//                                                                         cursor: 'pointer'
//                                                                     }}
//                                                                 />{product.productName}
//                                                             </>
//                                                         ) : (
//                                                             "No Product Data"
//                                                         )}
//                                                     </td>
//                                                     <td>
//                                                         {productData
//                                                             ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
//                                                                 .format(productData.price)
//                                                                 .replace(/\.00$/, '')
//                                                             : 'N/A'}
//                                                     </td>
//                                                     <td>{product.quantity}</td>
//                                                     <td>{product.paymentMethod}</td>
//                                                     <td>
//                                                         {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
//                                                     </td>
//                                                     <td>
//                                                         {productData && (
//                                                             <button className="btn btn-sm btn-outline-info mr-2"
//                                                                 onClick={() => navigate(`/${userType}/Dashboard/buyerproductpurchased/productpurchaseddetails/${product._id}`)}>
//                                                                 <i className="fa fa-eye"></i>
//                                                             </button>
//                                                         )}
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="pagination d-flex justify-content-between mt-4">
//                                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                                     Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
//                                 </span>

//                                 <ul className="pagination d-flex justify-content-end w-100">
//                                     <li
//                                         className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
//                                         onClick={handlePrevious}
//                                     >
//                                         <button className="page-link">Previous</button>
//                                     </li>

//                                     {Array.from({ length: totalPages }, (_, index) => index + 1)
//                                         .filter((pageNumber) => pageNumber === currentPage)
//                                         .map((pageNumber, index, array) => {
//                                             const prevPage = array[index - 1];
//                                             if (prevPage && pageNumber - prevPage > 1) {
//                                                 return (
//                                                     <React.Fragment key={`ellipsis-${pageNumber}`}>
//                                                         <li className="page-item disabled"><span className="page-link">...</span></li>
//                                                         <li
//                                                             key={pageNumber}
//                                                             className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                                                             onClick={() => setCurrentPage(pageNumber)}
//                                                         >
//                                                             <button className="page-link">{pageNumber}</button>
//                                                         </li>
//                                                     </React.Fragment>
//                                                 );
//                                             }

//                                             return (
//                                                 <li
//                                                     key={pageNumber}
//                                                     className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
//                                                     onClick={() => setCurrentPage(pageNumber)}
//                                                 >
//                                                     <button className="page-link">{pageNumber}</button>
//                                                 </li>
//                                             );
//                                         })}

//                                     <li
//                                         className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
//                                         onClick={handleNext}
//                                     >
//                                         <button className="page-link">Next</button>
//                                     </li>
//                                 </ul>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//          {showPopup && (
//                 <div onClick={() => setShowPopup(false)} style={{
//                     position: 'fixed',
//                     top: 0, left: 0, right: 0, bottom: 0,
//                         backgroundColor: 'rgba(0, 0, 0, 0.65)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     zIndex: 1000,
//                 }}>
//                     <div onClick={(e) => e.stopPropagation()} style={{
//                         position: 'relative',
//                         width: '500px',
//                         height: '600px',
//                         backgroundColor: '#111',
//                         borderRadius: '12px',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         overflow: 'hidden',
//                     }}>
//                         <button onClick={goToPreviousImage} style={{
//                             position: 'absolute',
//                             left: '10px', top: '50%',
//                             transform: 'translateY(-50%)',
//                             fontSize: '2rem',
//                             color: currentImageIndex === 0 ? '#666' : '#fff',
//                             background: 'black',
//                             border: 'none',
//                             cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
//                             zIndex: 2,
//                         }} disabled={currentImageIndex === 0}>&#10094;</button>

//                         <img src={`${BASE_URL}${currentImages[currentImageIndex]}`} alt="Popup" style={{
//                             width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px',
//                         }} />

//                         <button onClick={goToNextImage} style={{
//                             position: 'absolute',
//                             right: '10px', top: '50%',
//                             transform: 'translateY(-50%)',
//                             fontSize: '2rem',
//                             color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff',
//                             background: 'black',
//                             border: 'none',
//                             cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer',
//                             zIndex: 2,
//                         }} disabled={currentImageIndex === currentImages.length - 1}>&#10095;</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProductRequest;
import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { useNavigate } from 'react-router-dom';
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

// Buyer view labels for order status
const BUYER_STATUS_LABELS = {
  "Ordered": "Order Placed",
  "Payment Pending": "Payment Pending",
  "Payment Received": "Payment Confirmed",
  "Handling Time": "Processing",
  "Order Confirmed": "Order Confirmed",
  "Ready for Dispatch": "Ready for Dispatch",
  "Shipped": "Shipped",
  "Out for Delivery": "Out for Delivery",
  "Delivered": "Delivered",
  "Completed": "Order Completed",
  "Cancelled": "Order Cancelled",
  "Return Requested": "Return Requested",
  "Refund Approved": "Refund Approved",
};

const STATUS_COLORS = {
  "Ordered": "#17a2b8",
  "Payment Pending": "#ffc107",
  "Payment Received": "#28a745",
  "Handling Time": "#fd7e14",
  "Order Confirmed": "#007bff",
  "Ready for Dispatch": "#6f42c1",
  "Shipped": "#20c997",
  "Out for Delivery": "#17a2b8",
  "Delivered": "#28a745",
  "Completed": "#28a745",
  "Cancelled": "#dc3545",
  "Return Requested": "#dc3545",
  "Refund Approved": "#ffc107",
};

const SoldProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const navigate = useNavigate();

  // Fetch buyer sold products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAPI("/api/orders/buyer", {}, true, false);
        
        const data = result?.data?.data || [];

          const formatted = data.flatMap(order => {
            return order.items
              .filter(item => item.productId)
              .map(item => ({
                orderId: order.orderId,
                productId: item.productId._id,
                productName: item.productId.productName || '',
                mainImage: item.productId.mainImage || '',
                productPrice: item.productId.finalPrice || 0,
                buyerName: `${order?.Buyer?.id?.name || ''} ${order?.Buyer?.id?.lastName || ''}`.trim(),
                artistName: `${order?.Artist?.id?.name || ''} ${order?.Artist?.id?.lastName || ''}`.trim(),
                totalQuantity: item.quantity || 0,
                orderStatus: order.orderStatus || 'Ordered',
                paymentMethod: order.paymentMethod || 'N/A',
                purchaseDate: order.purchaseDate || order.createdAt,
              }));
          });

        setProducts(formatted);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter products by buyer name only
const filteredProducts = products.filter(product => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return true;

  const buyerName = product.buyerName?.toLowerCase() || "";
  const productName = product.productName?.toLowerCase() || "";

  const price = product.productPrice;
  const quantity = product.totalQuantity;

  
  const isNumberSearch = !isNaN(term);

  if (!isNumberSearch && term.includes(" ")) {
    const words = term.split(" ").filter(Boolean);
    return words.every(word => buyerName.includes(word));
  }

  if (isNumberSearch) {
    return price === Number(term) || quantity === Number(term);
  }
 
  return (
    buyerName.includes(term) ||
    productName.includes(term)
  );
});




  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Image popup
  const handleImageClick = (product) => {
    const src = product.mainImage?.startsWith('http') ? product.mainImage : `${BASE_URL}${product.mainImage}`;
    setCurrentImages([src]);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };
  const goToPreviousImage = () => setCurrentImageIndex(prev => Math.max(prev - 1, 0));
  const goToNextImage = () => setCurrentImageIndex(prev => Math.min(prev + 1, currentImages.length - 1));

  if (loading) return <ProductRequestSkeleton />;

 return (
  <div className="container-fluid">
    <div className="block-header">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h2>Buyer Ordered Product</h2>
        </div>
      </div>
    </div>

    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex justify-content-between align-items-center">
            <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
              <label className="mb-0 mr-2">Show</label>
              <select
                className="form-control form-control-sm"
                value={productsPerPage}
                onChange={handleProductsPerPageChange}
                style={{ minWidth: "70px" }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <label className="mb-0 ml-2">entries</label>
            </div>

            {/* 🔍 Global Search */}
            <div className="w-100 w-md-auto d-flex justify-content-end">
              <div className="input-group" style={{ maxWidth: "220px" }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search buyer, product, price, quantity"
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
                />
              </div>
            </div>
          </div>

          <div className="body">
            <div className="table-responsive">
              <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Buyer Name</th>
                      <th>Product Name</th>
                      <th>Product Price</th>
                      <th>Ordered Quantity</th>
                      <th>Payment Type</th>
                      <th>Order Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                <tbody>
                  {displayedProducts.map((product, index) => (
                    <tr key={`${product.orderId}-${product.productId}-${index}`}>
                     <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                      <td>{product.buyerName}</td>
                      <td>
                        <img
                          src={`${BASE_URL}${product.mainImage}`}
                          className="rounded-circle avatar"
                          alt=""
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(product)}
                        />
                        {product.productName}
                      </td>
                      <td>{product.productPrice}</td>
                      <td>{product.totalQuantity}</td>
                      <td>{product.paymentMethod}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: STATUS_COLORS[product.orderStatus] || "#6c757d",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {BUYER_STATUS_LABELS[product.orderStatus] || product.orderStatus}
                        </span>
                      </td>
                      <td>{product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString("en-IN") : "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() =>
                            navigate(
                              `/super-admin/product-fetch-view/${product.productId}`
                            )
                          }
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination d-flex justify-content-between mt-4">
              <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                Showing{" "}
                {filteredProducts.length === 0
                  ? 0
                  : (currentPage - 1) * productsPerPage + 1}{" "}
                to{" "}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (pageNumber) =>
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                  )
                  .map((pageNumber, index, array) => {
                    const prevPage = array[index - 1];
                    if (prevPage && pageNumber - prevPage > 1) {
                      return (
                        <React.Fragment key={`ellipsis-${pageNumber}`}>
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                          <li
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

    {/* Image Popup stays unchanged */}
    {showPopup && (
      <div
        onClick={() => setShowPopup(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "500px",
            height: "600px",
            backgroundColor: "#111",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <button
            onClick={goToPreviousImage}
            disabled={currentImageIndex === 0}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "2rem",
              background: "black",
              color: currentImageIndex === 0 ? "#666" : "#fff",
              border: "none",
            }}
          >
            &#10094;
          </button>

          <img
            src={currentImages[currentImageIndex]}
            alt="Popup"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />

          <button
            onClick={goToNextImage}
            disabled={currentImageIndex === currentImages.length - 1}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "2rem",
              background: "black",
              color:
                currentImageIndex === currentImages.length - 1
                  ? "#666"
                  : "#fff",
              border: "none",
            }}
          >
            &#10095;
          </button>
        </div>
      </div>
    )}
  </div>
);

};

export default SoldProduct;
