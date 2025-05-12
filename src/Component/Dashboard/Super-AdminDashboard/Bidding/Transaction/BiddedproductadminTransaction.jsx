import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';


const BiddedProductTransactionAdmin = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI("/api/getbiddedproduct", {}, true, false);
                if (result && result.data && Array.isArray(result.data.biddedProducts)) {
                    setProducts(result.data.biddedProducts);
                } else {
                    console.error("API response does not contain an array:", result.data);
                    setProducts([]);
                }

            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    const handlePrevious = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const totalPages = Math.ceil(products.length / itemsPerPage);


    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    return (
        <>
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    name="DataTables_Table_0_length"
                                    aria-controls="DataTables_Table_0"
                                    className="form-control"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(parseInt(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
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
                                            <th>Payment Mode</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedProducts.map((product, index) => {
                                                const productData = product.product?.product;
                                                const buyer = product.buyer;
                                                return (
                                                    <tr key={product._id}>
                                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>{buyer.name} {buyer.lastName}</td>
                                                        <td>
                                                            {productData ? (
                                                                <>
                                                                    <img
                                                                          src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${productData.mainImage}`}
                                                                        className="rounded-circle avatar"
                                                                        alt=""
                                                                        style={{
                                                                            width: '30px',
                                                                            height: '30px',
                                                                            objectFit: 'cover',
                                                                            marginRight: '10px'
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
                                                                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
                                                                    .format(product.totalPrice)
                                                                    .replace(/\.00$/, '')
                                                                : 'N/A'}
                                                        </td>
                                                        <td>
                                                          {product.paymentMethod}
                                                        </td>
                                                        <td>
                                                            {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </td>
                                                        
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() => navigate(`/Dashboard/biddedproduct/productdetails/${productData._id}`)}
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
                            <div className="pagination d-flex justify-content-end mt-4">
                                <ul className="pagination">
                                    <li
                                        className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={handlePrevious}
                                    >
                                        <button className="page-link">Previous</button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                                        .filter((pageNumber) =>
                                            // pageNumber >= currentPage &&
                                            // pageNumber < currentPage + 3
                                            pageNumber === currentPage
                                        )
                                        .map((pageNumber) => (
                                            <li
                                                key={pageNumber}
                                                className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(pageNumber)}
                                            >
                                                <button className="page-link">{pageNumber}</button>
                                            </li>
                                        ))}

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
        </>
    );
};

export default BiddedProductTransactionAdmin;
