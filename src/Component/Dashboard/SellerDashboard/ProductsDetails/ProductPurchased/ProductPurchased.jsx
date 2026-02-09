import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';
import { jwtDecode } from 'jwt-decode';

const SELLER_STATUS_LABELS = {
  "Ordered": "New Order Received",
  "Payment Pending": "Payment Pending",
  "Payment Received": "Payment Received",
  "Handling Time": "Handling Time (Processing)",
  "Order Confirmed": "Order Confirmed",
  "Ready for Dispatch": "Ready for Dispatch",
  "Shipped": "Shipped",
  "Out for Delivery": "Out for Delivery",
  "Delivered": "Delivered",
  "Completed": "Completed",
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

const SELLER_ALLOWED_STATUSES = [
  "Handling Time",
  "Ready for Dispatch",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
];

// Dropdown labels (different from status display labels)
const SELLER_DROPDOWN_LABELS = {
  ...SELLER_STATUS_LABELS,
  "Cancelled": "Cancel Order",
};

const ProductRequest = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');


    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE


    const navigate = useNavigate();
    const userType = useUserType();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.userId) {
                    setUserId(decodedToken.userId);
                    console.log("Seller ID:", decodedToken.userId); // <-- Add this line

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
    //             const result = await getAPI(`/api/getsoldproductbyid/${encodeURIComponent(userId)}`, {}, true, false);
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

useEffect(() => {
    if (!userId) return;

    const fetchPurchasedProducts = async () => {
        try {
            console.log("Fetching seller purchased products for:", userId);

            const res = await getAPI(
                `/api/seller-purchased-products/${encodeURIComponent(userId)}`,
                {},
                true,
                false
            );

            console.log("Seller Purchased Products Response:", res);

            if (res?.data?.data && Array.isArray(res.data.data)) {
                setProducts(res.data.data);
            } else {
                console.error(" Invalid API response format:", res);
                setProducts([]);
            }
        } catch (error) {
            console.error(" Error fetching seller purchased products:", error);
            setProducts([]);
        }
    };

    fetchPurchasedProducts();
}, [userId]);

    const sortedProducts = [...products].sort((a, b) => {
        const aCancelled = a.orderStatus === "Cancelled" ? 1 : 0;
        const bCancelled = b.orderStatus === "Cancelled" ? 1 : 0;
        if (aCancelled !== bCancelled) return aCancelled - bCancelled;
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    });

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const displayedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleStatusChange = async (orderId, newStatus, index) => {
        try {
            const res = await putAPI(`/api/update-order-status/${orderId}`, { status: newStatus });
            if (res?.data?.success) {
                setProducts(prev => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], orderStatus: newStatus };
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status");
        }
    };



    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Purchased</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/seller/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Product Purchased</li>
                        </ul>
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
                                    name="DataTables_Table_0_length"
                                    aria-controls="DataTables_Table_0"
                                    className="form-control form-control-sm"
                                    value={productsPerPage}
                                    onChange={handleProductsPerPageChange}
                                    style={{ minWidth: '70px' }}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
                            </div>
                            <div className="w-100 w-md-auto d-flex justify-content-end">
                                <div className="input-group" style={{ maxWidth: '150px' }}>
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
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
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
                                            <th>Order Status</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {displayedProducts.map((product, index) => {
                                            const productData = product.product || product.resellProduct;
                                            return (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                    
                                                    <td>{product.artistName || 'N/A'}</td>

                                                    <td>
                                                        {productData ? (
                                                            <>
                                                                <img
                                                                    src={product.product ? `${BASE_URL}${product.product}` : 'default-image-url.jpg'}
                                                                    className="rounded-circle avatar"
                                                                    alt=""
                                                                    style={{
                                                                        width: '30px',
                                                                        height: '30px',
                                                                        objectFit: 'cover',
                                                                        marginRight: '10px'
                                                                    }}
                                                                />
                                                                {product.productName || 'N/A'}
                                                            </>
                                                        ) : (
                                                            "No Product Data"
                                                        )}
                                                    </td>
                                                    <td>
                                                        {productData
                                                            ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
                                                                .format(product.productPrice).replace(/\.00$/, '')
                                                            : 'N/A'}
                                                    </td>
                                                    <td>{product.totalQuantity ?? 'N/A'}</td>
                                                    <td>{product.paymentMethod || 'N/A'}</td>
                                                    <td>
                                                        <td>{product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                                                    </td>
                                                    <td>
                                                        {productData && (
                                                            <button className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() => navigate(`/${userType}/Dashboard/productpurchased/productview/${product._id}`)}>
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody> */}
                                    <tbody>
    {displayedProducts.map((item, index) => (
        <tr key={index}>
            <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

            {/* Buyer Name */}
            <td>{item.buyerName || "Unknown"}</td>

            {/* Product Name & Image */}
            <td>
                <img
                    src={item.productImage ? `${BASE_URL}${item.productImage}` : "/default.png"}
                    className="rounded-circle avatar"
                    alt=""
                    style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        marginRight: "10px"
                    }}
                />
                {item.productName}
            </td>

            {/* Product Price */}
            <td>
                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR"
                }).format(item.subtotal).replace(/\.00$/, "")}
            </td>

            {/* Quantity */}
            <td>{item.quantityPurchased}</td>

            {/* Payment Method */}
            <td>{item.paymentMethod}</td>

            {/* Order Status (read-only badge) */}
            <td>
                <span
                    className="badge"
                    style={{
                        backgroundColor: STATUS_COLORS[item.orderStatus] || "#6c757d",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                    }}
                >
                    {SELLER_STATUS_LABELS[item.orderStatus] || item.orderStatus || "New Order Received"}
                </span>
            </td>

            {/* Purchase Date */}
            <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>

            {/* Action: View + Update Status dropdown */}
            <td className="d-flex align-items-center" style={{ gap: "6px" }}>
                <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => navigate(`/seller/product-fetch-view-seller/${item.productId}`)}
                >
                    <i className="fa fa-eye"></i>
                </button>
                {item.orderStatus !== "Cancelled" && item.orderStatus !== "Completed" && (
                    <select
                        className="form-control form-control-sm"
                        value=""
                        onChange={(e) => {
                            if (e.target.value) {
                                handleStatusChange(
                                    item.orderId,
                                    e.target.value,
                                    products.indexOf(item)
                                );
                            }
                        }}
                        style={{
                            minWidth: "150px",
                            borderColor: "#6c757d",
                            color: "#6c757d",
                            fontWeight: "600",
                            fontSize: "12px",
                        }}
                    >
                        <option value="" disabled>Update Status</option>
                        {SELLER_ALLOWED_STATUSES.filter(s => s !== item.orderStatus).map((status) => (
                            <option key={status} value={status}>
                                {SELLER_DROPDOWN_LABELS[status]}
                            </option>
                        ))}
                    </select>
                )}
            </td>
        </tr>
    ))}
</tbody>

                                </table>
                            </div>
                            <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                    Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, sortedProducts.length)} of {sortedProducts.length} entries
                                </span>

                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li
                                        className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
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
                                                        <li className="page-item disabled"><span className="page-link">...</span></li>
                                                        <li
                                                            key={pageNumber}
                                                            className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                            onClick={() => setCurrentPage(pageNumber)}
                                                        >
                                                            <button className="page-link">{pageNumber}</button>
                                                        </li>
                                                    </React.Fragment>
                                                );
                                            }

                                            return (
                                                <li
                                                    key={pageNumber}
                                                    className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                >
                                                    <button className="page-link">{pageNumber}</button>
                                                </li>
                                            );
                                        })}

                                    <li
                                        className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
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
        </div>
    );
};

export default ProductRequest;