
import React, { useState, useEffect } from "react";
import getAPI from "../../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import useUserType from "../../../../urlconfig";

const SoldProduct = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const navigate = useNavigate();
    // const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`/api/orders/artist/${userId}`, {}, true, false);
                console.log("Artist Sold Orders:", result);

                if (result?.data?.data && Array.isArray(result.data.data)) {

    const formatted = result.data.data.flatMap(order => {

        const artistFullName =
            (order.Artist?.id?.name || "") +
            " " +
            (order.Artist?.id?.lastName || "");

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
                artistName: artistFullName.trim()
            };
        });
    });

    setProducts(formatted);


                } else {
                    console.error("Invalid format from artist order API.");
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching artist sold products:", err);
                setProducts([]);
            }
        };

        fetchProducts();
    }, [userId]);

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="container-fluid">
            {/* Title Section */}
            <div className="block-header">
                <h2>Artist Sold Product</h2>
            </div>

            <div className="card">
                {/* Header */}
                <div className="header d-flex justify-content-between align-items-center">

                    {/* Items per page */}
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

                    {/* Search */}
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
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

                {/* Table */}
                <div className="body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Artist Name</th>
                                    <th>Product Name</th>
                                    <th>Product Price</th>
                                    <th>Sold Quantity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                              <tbody>
                                {displayedProducts.map((p, index) => (
                                    <tr key={`${p.productId}-${index}`}>
                                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                                        <td>{p.artistName}</td>

                                        {/* <td>
                                            <img
                                                src={`${BASE_URL}${p.mainImage}`}
                                                alt={p.productName}
                                                className="rounded-circle avatar"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    objectFit: "cover",
                                                    marginRight: "10px",
                                                }}
                                            />
                                            {p.productName}
                                        </td> */}
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
        <span>{p.productName}</span>
    </div>
</td>

                                        <td>
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR",
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

                    {/* Pagination */}
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
                                <button className="page-link" onClick={handlePrevious}>
                                    Previous
                                </button>
                            </li>

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={handleNext}>
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

export default SoldProduct;
