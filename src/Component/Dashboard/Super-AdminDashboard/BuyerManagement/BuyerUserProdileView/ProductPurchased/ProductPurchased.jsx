

import React, { useState, useEffect } from "react";
import getAPI from "../../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from '../../../../../../utils/getImageUrl';

const BuyerSoldProduct = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`/api/orders/buyer/${userId}`, {}, true, false);
                console.log("Buyer Orders:", result);

                if (!result?.data?.data || !Array.isArray(result.data.data)) {
                    setProducts([]);
                    return;
                }

                const formatted = result.data.data.flatMap(order => {
                    const buyerName =
                        (order.Buyer?.id?.name || "") +
                        " " +
                        (order.Buyer?.id?.lastName || "");

                    return order.items.map(item => {
                        const product =
                            item.productId ||
                            item.resellProduct ||
                            item.customProduct ||
                            {};

                        return {
                            productId: product._id || "",
                            productName:
                                product.productName ||
                                product.requestTitle ||
                                "Unknown Product",

                            mainImage:
                                product.mainImage ||
                                product.referenceImage ||
                                "",

                            productPrice: product.finalPrice || 0,
                            totalQuantity: item.quantity,
                            buyerName: buyerName.trim()
                        };
                    });
                });

                setProducts(formatted);
            } catch (err) {
                console.error("Error fetching buyer sold products:", err);
                setProducts([]);
            }
        };

        fetchProducts();
    }, [userId]);

    const filteredProducts = products.filter(p =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    return (
        <div className="container-fluid">
            <div className="block-header">
                <h2>Buyer Ordered Products </h2>
            </div>

            <div className="card">

                {/* HEADER */}
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
                            {[10, 25, 50, 100].map(n => (
                                <option value={n} key={n}>{n}</option>
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

                {/* TABLE BODY */}
                <div className="body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Buyer Name</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayedProducts.map((p, index) => (
                                    <tr key={p.productId}>
                                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                                        <td>{p.buyerName}</td>

                                        <td>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={getImageUrl(p.mainImage)}
                                                    alt={p.productName}
                                                    style={{
                                                        width: "30px",
                                                        height: "30px",
                                                        objectFit: "cover",
                                                        marginRight: "10px"
                                                    }}
                                                    className="rounded-circle avatar"
                                                />
                                                {p.productName}
                                            </div>
                                        </td>

                                        <td>
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR"
                                            })
                                                .format(p.productPrice)
                                                .replace(/\.00$/, "")}
                                        </td>

                                        <td>{p.totalQuantity}</td>

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
                            Showing{" "}
                            {filteredProducts.length === 0
                                ? 0
                                : (currentPage - 1) * productsPerPage + 1}{" "}
                            to{" "}
                            {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
                            of {filteredProducts.length} entries
                        </span>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                    Previous
                                </button>
                            </li>

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BuyerSoldProduct;
