import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";
import { getImageUrl } from '../../../../../utils/getImageUrl';

const BuyerSoldProduct = () => {
    const { buyerId } = useParams();
    const location = useLocation();
    const userId = buyerId || location.state?.buyer?._id || location.state?.userId;

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const BASE_URL = getImageUrl(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = userId ? `/api/orders/buyer/${userId}` : `/api/orders/buyer`;
                const result = await getAPI(url, {}, true, false);

                if (result?.data?.data && Array.isArray(result.data.data)) {
                    const formatted = result.data.data.flatMap(order => {
                        const buyerName =
                            `${order.Buyer?.id?.name || ""} ${order.Buyer?.id?.lastName || ""}`.trim();

                        return order.items
                            .filter(item => item.productId || item.resellProduct || item.customProduct)
                            .map(item => {
                                const product = item.productId || item.resellProduct || item.customProduct || {};
                                return {
                                    orderId: order.orderId,
                                    buyerName: buyerName || "N/A",
                                    productId: product._id || "",
                                    productName: product.productName || product.requestTitle || "Unknown Product",
                                    mainImage: product.mainImage || product.referenceImage || "",
                                    productPrice: product.finalPrice || item.price || 0,
                                    totalQuantity: item.quantity,
                                    createdAt: order.createdAt,
                                    orderStatus: order.orderStatus || "Ordered"
                                };
                            });
                    });
                    setProducts(formatted);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching buyer sold products:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userId]);

    const filteredProducts = products.filter(p =>
        p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    if (loading) return <ProductRequestSkeleton />;

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Buyer Sold Products</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Buyer Sold Products</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="header d-flex justify-content-between align-items-center">
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

                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <i className="fa fa-search" style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none"
                        }}></i>
                    </div>
                </div>

                <div className="body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Buyer Name</th>
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

                                        <td>{p.buyerName}</td>

                                        <td>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={getImageUrl(p.mainImage)}
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

                    <div className="pagination d-flex justify-content-between mt-4">
                        <span>
                            Showing{" "}
                            {filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1}{" "}
                            to {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
                            of {filteredProducts.length} entries
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

export default BuyerSoldProduct;
