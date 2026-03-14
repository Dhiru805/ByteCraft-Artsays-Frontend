// import React, { useState, useEffect } from 'react';
// import getAPI from '../../../../../api/getAPI';
// import { useNavigate } from 'react-router-dom';
// import useUserType from '../../../urlconfig';

// const ProductRequest = () => {
//     const [products, setProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage, setProductsPerPage] = useState(10);
//     const [showPopup, setShowPopup] = useState(false);
//     const [currentImages, setCurrentImages] = useState([]);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
//     const [searchTerm, setSearchTerm] = useState('');

//     const navigate = useNavigate();
//     const userType = useUserType();

//     // useEffect(() => {
//     //     const fetchProducts = async () => {
//     //         try {
//     //             const result = await getAPI("/api/sellersoldproduct", {}, true, false);
//     //             console.log("Full API Response:", result);

//     //             if (result && result.data && Array.isArray(result.data)) {
//     //                 setProducts(result.data);
//     //             } else {
//     //                 console.error("API response does not contain an array:", result.data);
//     //                 setProducts([]);
//     //             }
//     //         } catch (error) {
//     //             console.error("Error fetching products:", error);
//     //             setProducts([]);
//     //         }
//     //     };

//     //     fetchProducts();
//     // }, []);
// useEffect(() => {
//     const fetchProducts = async () => {
//         try {
//             const result = await getAPI("/api/orders/seller", {}, true, false);
//             console.log("Seller Orders Response:", result);

//             // if (result?.data?.data && Array.isArray(result.data.data)) {

//             //     const formatted = result.data.data.flatMap(order => {
//             //         return order.items
//             //             .filter(item => item.productId)
//             //             .map(item => ({
//             //                 orderId: order.orderId,
//             //                 productId: item.productId._id,
//             //                 productName: item.productId.productName,
//             //                 mainImage: item.productId.mainImage,
//             //                 productPrice: item.productId.sellingPrice,
//             //                 //sellerName: order.Artist.id?.name || "Unknown Seller",
//             //                 sellerName: `${order.Artist?.id?.name || ""} ${order.Artist?.id?.lastName || ""}`.trim(),

//             //                 totalQuantity: item.quantity
//             //             }));
//             //     });

//             //     setProducts(formatted);
// if (result?.data?.data && Array.isArray(result.data.data)) {

//     const formatted = result.data.data.flatMap(order => {
        
//         const sellerFullName =
//             `${order.Artist?.id?.name || ""} ${order.Artist?.id?.lastName || ""}`.trim();

//         return order.items
//             .filter(item => item.productId)
//             .map(item => {
//                 const product = item.productId;

//                 return {
//                     orderId: order.orderId,

//                     sellerName: sellerFullName,   // ⭐ finally correct

//                     productId: product._id,
//                     productName: product.productName,
//                     mainImage: product.mainImage,

//                     productPrice: product.sellingPrice ?? product.finalPrice ?? 0,
//                     totalQuantity: item.quantity
//                 };
//             });
//     });

//     setProducts(formatted);


//             } else {
//                 console.error("Invalid Seller Orders Format:", result.data);
//                 setProducts([]);
//             }

//         } catch (error) {
//             console.error("Error fetching seller sold products:", error);
//             setProducts([]);
//         }
//     };

//     fetchProducts();
// }, []);

//     const filteredProducts = products.filter(product => {
//         //const fullName = product.artistName ? product.artistName.toLowerCase() : '';
//         const fullName = product.sellerName?.toLowerCase() || "";

//         const term = searchTerm.toLowerCase().trim();
//         return fullName.includes(term);
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
//         const handleImageClick = (product) => {
//         const images = [product.mainImage, ...(product.otherImages || [])];
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
//                         <h2>Seller Sold Product</h2>
//                         <ul className="breadcrumb">
//                             <li className="breadcrumb-item">
//                                 <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
//                                     <i className="fa fa-dashboard"></i>
//                                 </span>
//                             </li>
//                             <li className="breadcrumb-item">Seller Sold Product</li>
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
//                                             <th>Seller Name</th>
//                                             <th>Product Name</th>
//                                             <th>Product Price</th>
//                                             <th>Sold Product Quantity</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {displayedProducts.map((product, index) => (
//                                             <tr key={product.productId}>
//                                                 <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
//                                                 {/* <td>{product.artistName}</td> */}
//                                                 <td>{product.sellerName}</td>

//                                                 <td>
//                                                     <img
//                                                         src={`${BASE_URL}${product.mainImage}`}
//                                                         className="rounded-circle avatar"
//                                                         alt=""
//                                                         onClick={() => handleImageClick(product)}
//                                                         style={{
//                                                             width: '30px',
//                                                             height: '30px',
//                                                             objectFit: 'cover',
//                                                             marginRight: '10px',
//                                                             cursor: 'pointer'
//                                                         }}
//                                                     />{product.productName}</td>
//                                                 <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.productPrice).replace(/\.00$/, '')}</td>
//                                                 <td>{product.totalQuantity}</td>
//                                                 <td>
//                                                     <button className="btn btn-sm btn-outline-info mr-2" onClick={() => navigate(`/${userType}/Dashboard/sellersoldproduct/sellersoldproductdetails/${product.productId}`)}>
//                                                         <i className="fa fa-eye"></i>
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="pagination d-flex justify-content-between mt-4">
//                                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                                     Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
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
//                     {showPopup && (
//                 <div
//                     onClick={() => setShowPopup(false)}
//                     style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                             backgroundColor: 'rgba(0, 0, 0, 0.65)',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         zIndex: 1000,
//                     }}
//                 >
//                     <div
//                         onClick={(e) => e.stopPropagation()}
//                         style={{
//                             position: 'relative',
//                             height: '50%',
//                             backgroundColor: '#111',
//                             borderRadius: '12px',
//                             boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             overflow: 'hidden',
//                         }}
//                     >
//                         {/* Left Arrow */}
//                         <button
//                             onClick={goToPreviousImage}
//                             style={{
//                                 position: 'absolute',
//                                 left: '10px',
//                                 top: '50%',
//                                 transform: 'translateY(-50%)',
//                                 fontSize: '2rem',
//                                 color: currentImageIndex === 0 ? '#666' : '#fff',
//                                 background: 'Black',
//                                 border: 'none',
//                                 cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
//                                 zIndex: 2,
//                             }}
//                             disabled={currentImageIndex === 0}
//                         >
//                             &#10094;
//                         </button>

//                         {/* Image */}
//                         <img
//                             src={`${BASE_URL}${currentImages[currentImageIndex]}`}
//                             alt="Popup"
//                             style={{
//                                 width: '100%',
//                                 height: '100%',
//                                 objectFit: 'cover',
//                                 borderRadius: '12px',
//                             }}
//                         />

//                         {/* Right Arrow */}
//                         <button
//                             onClick={goToNextImage}
//                             style={{
//                                 position: 'absolute',
//                                 right: '10px',
//                                 top: '50%',
//                                 transform: 'translateY(-50%)',
//                                 fontSize: '2rem',
//                                 color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff',
//                                 background: 'Black',
//                                 border: 'none',
//                                 cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer',
//                                 zIndex: 2,
//                             }}
//                             disabled={currentImageIndex === currentImages.length - 1}
//                         >
//                             &#10095;
//                         </button>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default ProductRequest;


import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useUserType from "../../../urlconfig";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

const SoldProduct = () => {

    const { sellerId } = useParams();
    const location = useLocation();
    const userId = sellerId || location.state?.seller?._id || location.state?.userId;

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
const[loading,setLoading]=useState(false);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const url = userId ? `/api/orders/seller/${userId}` : `/api/orders/seller`;
                const result = await getAPI(url, {}, true, false);
                console.log("SELLER ORDERS RAW:", result?.data);

                // if (!result?.data?.data || !Array.isArray(result.data.data)) {
                //     setProducts([]);
                //     return;
                // }

                // const formatted = result.data.data.flatMap(order =>
                //     order.items
                //         .filter(item => item.productId) 
                //         .map(item => {
                //             const product = item.productId;

                //             return {
                //                 orderId: order.orderId,
                //                 sellerName:
                //                     `${order.Seller?.id?.name || ""} ${order.Seller?.id?.lastName || ""}`.trim(),

                //                 productId: product._id,
                //                 productName: product.productName,
                //                 mainImage: product.mainImage,

                //                 productPrice: product.sellingPrice ?? product.finalPrice ?? 0,
                //                 totalQuantity: item.quantity,

                //                 createdAt: order.createdAt
                //             };
                //         })
                // );

                // setProducts(formatted);
if (result?.data?.data && Array.isArray(result.data.data)) {

  const formatted = result.data.data.flatMap(order => {

    // const sellerName =
    //   order.Seller?.name ||
    //   `${order.Seller?.id?.name || ""} ${order.Seller?.id?.lastName || ""}`.trim();


    return order.items
      .filter(item => item.productId)
      .map(item => {
        const product = item.productId;
        
const sellerName =
    `${product.userId?.name || ""} ${product.userId?.lastName || ""}`.trim();

          return {
            orderId: order.orderId,

            sellerName: sellerName,

            productId: product._id,
            productName: product.productName,
            mainImage: product.mainImage,

            productPrice: product.finalPrice ?? product.finalPrice ?? 0,
            totalQuantity: item.quantity,
            createdAt: order.createdAt,
            orderStatus: order.orderStatus || "Ordered"
          };
      });
  });

  setProducts(formatted);
}

            } catch (err) {
                console.error("Error fetching Seller sold products:", err);
                setProducts([]);
            }finally{
                setLoading(false)
            }
        };

        fetchProducts();
    }, [userId]); // eslint-disable-line

    const filteredProducts = products.filter(p =>
        p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

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
        const handleImageClick = (product) => {
        const images = [product.mainImage, ...(product.otherImages || [])];
        setCurrentImages(images);
        setCurrentImageIndex(0);
        setShowPopup(true);
    };


    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1));
    };

    if(loading)return <ProductRequestSkeleton/>
    return (
        <div className="container-fluid">
            <div className="block-header">
                <h2>Seller Sold Products</h2>
            </div>

            <div className="card">
                <div className="header d-flex justify-content-between align-items-center">

                    {/* ITEMS PER PAGE */}
                    <div className="d-flex align-items-center">
                        <label className="mr-2">Show</label>
                        <select
                            className="form-control form-control-sm"
                            value={productsPerPage}
                            onChange={e => {
                                setProductsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[10, 25, 50, 100].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <label className="ml-2">entries</label>
                    </div>

                    {/* SEARCH */}
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <i className="fa fa-search"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none"
                            }}
                        ></i>
                    </div>
                </div>

                {/* TABLE */}
                <div className="body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Seller Name</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayedProducts.map((p, index) => (
                                    <tr key={`${p.orderId}-${p.productId}-${index}`}>
                                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                                        <td>{p.sellerName}</td>

                                        <td>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={`${BASE_URL}${p.mainImage}`}
                                                    className="rounded-circle avatar"
                                                    alt={p.productName}
                                                    style={{
                                                        width: "30px",
                                                        height: "30px",
                                                        objectFit: "cover",
                                                        marginRight: "10px"
                                                    }}
                                                />
                                                {p.productName}
                                            </div>
                                        </td>

                                        <td>
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR"
                                            }).format(p.productPrice)}
                                        </td>

                                        <td>{p.totalQuantity}</td>

                                        <td>
                                            {new Date(p.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </td>

                                        <td>
                                            <span className={`badge ${
                                                p.orderStatus === "Delivered" || p.orderStatus === "Completed" ? "badge-success" :
                                                p.orderStatus === "Cancelled" ? "badge-danger" :
                                                p.orderStatus === "Shipped" || p.orderStatus === "Out for Delivery" ? "badge-info" :
                                                p.orderStatus === "Return Requested" || p.orderStatus === "Refund Approved" || p.orderStatus === "Refund Initiated" || p.orderStatus === "Refund Successful" ? "badge-warning" :
                                                "badge-secondary"
                                            }`}>
                                                {p.orderStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() =>
                                                    navigate(
                                                        `/super-admin/product-fetch-view/${p.productId}`,
                                                        { state: { userId } }
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

                    {/* PAGINATION */}
                    <div className="pagination d-flex justify-content-between mt-4">
                        <span>
                            Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                            {Math.min(currentPage * productsPerPage, filteredProducts.length)} of{" "}
                            {filteredProducts.length} entries
                        </span>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SoldProduct;
