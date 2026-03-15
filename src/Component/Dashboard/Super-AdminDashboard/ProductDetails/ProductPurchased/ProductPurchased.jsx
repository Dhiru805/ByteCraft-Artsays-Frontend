import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import postAPI from '../../../../../api/postAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';
import { jwtDecode } from 'jwt-decode';
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";
import { toast } from 'react-toastify';
import { getImageUrl } from '../../../../../utils/getImageUrl';

const ADMIN_STATUS_LABELS = {
    "Ordered": "New Order Received",
    "Payment Pending": "Payment Pending",
    "Payment Received": "Payment Received",
    "Handling Time": "Seller Handling Time",
    "Order Confirmed": "Order Confirmed",
    "Ready for Dispatch": "Ready for Dispatch",
    "Shipped": "Shipped",
    "Out for Delivery": "Out for Delivery",
    "Delivered": "Delivered",
    "Completed": "Completed",
    "Cancelled": "Cancel Order",
    "Return Requested": "Initiate Refund",
    "Refund Initiated": "Refund Initiated",
    "Refund Successful": "Refund Successful",
    "Resale": "Listed for Resale",
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
    "Refund Initiated": "#fd7e14",
    "Refund Successful": "#28a745",
    "Resale": "#ff6600",
};

const ADMIN_ALLOWED_STATUSES = [
    "Ordered",
    "Handling Time",
    "Order Confirmed",
    "Ready for Dispatch",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Completed",
    "Cancelled",
];

const SHIPPED_OR_LATER = ["Shipped", "Out for Delivery", "Delivered"];

const ProductRequest = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [resellModal, setResellModal] = useState({ show: false, productId: null, orderId: null, productName: '' });

    const BASE_URL = getImageUrl(null);


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

    //     useEffect(() => {
    //         if (!userId) return;
    //         const fetchProducts = async () => {
    //             try {
    //                 const result = await getAPI(`/api/getallpurchasedproduct/${encodeURIComponent(userId)}`, {}, true, false);
    //                 console.log("Full API Response:", result);
    //                 console.log("Data Type:", typeof result.data);

    //                 // if (result && result.data && Array.isArray(result.data.purchases)) {
    //                 //     setProducts(result.data.purchases);
    //                 // } else {
    //                 //     console.error("API response does not contain an array:", result.data);
    //                 //     setProducts([]);
    //                 // }
    // const purchasedArray = result?.data?.data;

    // if (Array.isArray(purchasedArray)) {
    //     setProducts(purchasedArray);
    // } else {
    //     console.error("API response does not contain a valid array:", result.data);
    //     setProducts([]);
    // }

    //             } catch (error) {
    //                 console.error("Error fetching products:", error);
    //                 setProducts([]);
    //             }
    //         };

    //         fetchProducts();
    //     }, [userId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`/api/purchased-products`, {}, true, false);

                console.log("Purchased Products Response:", result);

                const purchasedArray = result?.data?.data; // <-- your controller returns data: purchasedProducts

                if (Array.isArray(purchasedArray)) {
                    setProducts(purchasedArray);
                } else {
                    console.error("Invalid purchased product response:", result.data);
                    setProducts([]);
                }

            } catch (error) {
                console.error("Error fetching purchased products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);



    const filteredProducts = products.filter(product => {
        const buyerName = product.buyer?.name?.toLowerCase() || product.buyerName?.toLowerCase() || '';
        const buyerLastName = product.buyer?.lastName?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return (
            buyerName.includes(search) ||
            buyerLastName.includes(search)
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aCancelled = a.orderStatus === "Cancelled" ? 1 : 0;
        const bCancelled = b.orderStatus === "Cancelled" ? 1 : 0;
        if (aCancelled !== bCancelled) return aCancelled - bCancelled;
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    });

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const displayedProducts = sortedProducts.slice(
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

    const handleStatusChange = async (orderId, newStatus, index) => {
        try {
            // If "Initiate Refund" selected, call the refund API
            if (newStatus === "Return Requested") {
                const res = await postAPI(`/api/initiate-refund/${orderId}`, {});
                if (res?.data?.success) {
                    toast.success(res.data.message || "Refund initiated successfully");
                    setProducts(prev =>
                        prev.map(p =>
                            p.orderId === orderId ? { ...p, orderStatus: "Refund Initiated" } : p
                        )
                    );
                }
                return;
            }

            const res = await putAPI(`/api/update-order-status/${orderId}`, { status: newStatus });
            if (res?.data?.success) {
                // Update ALL rows with the same orderId (an order can have multiple items)
                setProducts(prev =>
                    prev.map(p =>
                        p.orderId === orderId ? { ...p, orderStatus: newStatus } : p
                    )
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(error?.response?.data?.message || "Failed to update order status");
            // Refresh products to get latest data from server
            const result = await getAPI(`/api/purchased-products`, {}, true, false);
            const purchasedArray = result?.data?.data;
            if (Array.isArray(purchasedArray)) {
                setProducts(purchasedArray);
            }
        }
    };

    const openResellModal = (productId, orderId, productName) => {
        setResellModal({ show: true, productId, orderId, productName });
    };

    const closeResellModal = () => {
        setResellModal({ show: false, productId: null, orderId: null, productName: '' });
    };

    const confirmResell = async () => {
        const { productId, orderId } = resellModal;
        closeResellModal();
        try {
            const res = await putAPI(`/api/resell-product`, { productId, orderId });
            if (res?.data?.success) {
                toast.success("Product listed for resale successfully");
                const result = await getAPI(`/api/purchased-products`, {}, true, false);
                const purchasedArray = result?.data?.data;
                if (Array.isArray(purchasedArray)) {
                    setProducts(purchasedArray);
                }
            }
        } catch (error) {
            console.error("Error reselling product:", error);
            toast.error(error?.response?.data?.message || "Failed to resell product");
        }
    };


    if (loading) return <ProductRequestSkeleton />
    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Purchased</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>                            </li>
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
                                    {/* <option value="5">5</option> */}
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
                                            <th>Order ID</th>
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
                                    <tbody>
                                        {displayedProducts.map((product, index) => (
                                                <tr key={index}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                                                    <td>
                                                        {product.orderId}
                                                        {product.isResale && (
                                                            <span className="badge ml-1" style={{ backgroundColor: "#ff6600", color: "#fff", fontSize: "10px" }}>Resale</span>
                                                        )}
                                                        {product.isCustomOrder && (
                                                            <span className="badge ml-1" style={{ backgroundColor: "#ff8c00", color: "#fff", fontSize: "10px" }}>Custom Order</span>
                                                        )}
                                                    </td>

                                                    <td>{product.buyerName}</td>

                                                    <td>
                                                        <img
                                                            src={product.isCustomOrder ? getImageUrl(product.productImage?.replace(/\\/g, "/")) : getImageUrl(product.productImage)}
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            style={{ width: "30px", height: "30px", marginRight: "10px", objectFit: "cover" }}
                                                        />
                                                        {product.productName}
                                                    </td>

                                                    <td>
                                                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
                                                            .format(product.finalPrice)
                                                            .replace(/\.00$/, "")}
                                                    </td>

                                                    <td>{product.quantityPurchased}</td>

                                                    <td>{product.paymentMethod || "N/A"}</td>

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
                                                            {ADMIN_STATUS_LABELS[product.orderStatus] || product.orderStatus || "New Order Received"}
                                                        </span>
                                                    </td>

                                                    <td>{new Date(product.purchaseDate).toLocaleDateString("en-IN")}</td>

                                                    <td className="d-flex align-items-center" style={{ gap: "6px" }}>
                                                        <button
                                                            className="btn btn-sm btn-outline-info"
                                                            onClick={() => navigate(`/super-admin/order-view/${product.orderId}`)}
                                                            title="View Order"
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        {product.orderStatus === "Completed" && !product.isCustomOrder && (
                                                              <button
                                                                  className="btn btn-sm btn-outline-success"
                                                                  onClick={() => openResellModal(product.productId, product.orderId, product.productName)}
                                                                  title="Resell this product"
                                                              >
                                                                  <i className="fa fa-refresh"></i> Resell
                                                              </button>
                                                          )}
                                                          {product.orderStatus === "Cancelled" && product.hasOnlinePayment && (
                                                              <button
                                                                  className="btn btn-sm btn-outline-warning"
                                                                  onClick={() => handleStatusChange(product.orderId, "Return Requested", products.indexOf(product))}
                                                                  title="Initiate Refund"
                                                              >
                                                                  <i className="fa fa-money"></i> Refund
                                                              </button>
                                                          )}
{product.orderStatus !== "Cancelled" && product.orderStatus !== "Completed" && product.orderStatus !== "Resale" && product.orderStatus !== "Refund Initiated" && product.orderStatus !== "Refund Successful" && (
                                                              <select
                                                                  className="form-control form-control-sm"
                                                                  value=""
                                                                  onChange={(e) => {
                                                                      if (e.target.value) {
                                                                          handleStatusChange(
                                                                              product.orderId,
                                                                              e.target.value,
                                                                              products.indexOf(product)
                                                                          );
                                                                      }
                                                                  }}
                                                                  style={{
                                                                      minWidth: "160px",
                                                                      borderColor: "#6c757d",
                                                                      color: "#6c757d",
                                                                      fontWeight: "600",
                                                                      fontSize: "12px",
                                                                  }}
                                                              >
                                                                  <option value="" disabled>Update Status</option>
                                                                  {ADMIN_ALLOWED_STATUSES
                                                                      .filter(s => s !== product.orderStatus)
                                                                      .filter(s => !(SHIPPED_OR_LATER.includes(product.orderStatus) && s === "Cancelled"))
                                                                      .map((status) => (
                                                                      <option key={status} value={status}>
                                                                          {ADMIN_STATUS_LABELS[status]}
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
            {/* Resell Confirmation Modal */}
            {resellModal.show && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closeResellModal}
                >
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Resell</h5>
                                <button type="button" className="close" onClick={closeResellModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to list <strong>{resellModal.productName}</strong> for resale?</p>
                                <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                                    This will make the product live again with condition set to "Resale".
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={closeResellModal}>Cancel</button>
                                <button className="btn btn-success btn-sm" onClick={confirmResell}>
                                    <i className="fa fa-refresh"></i> Yes, Resell
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductRequest;