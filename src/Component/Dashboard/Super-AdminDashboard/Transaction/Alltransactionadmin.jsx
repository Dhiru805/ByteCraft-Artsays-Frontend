import React, { useState, useEffect } from 'react';
import getAPI from '../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../urlconfig';

const Transaction = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);



    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`${process.env.REACT_APP_API_URL}/api/get-alltransaction`, {}, true, false);
                console.log("Full API Response:", result);

                let combinedProducts = [];

                if (result?.data) {
                    if (Array.isArray(result.data.productPurchases)) {
                        combinedProducts = [...result.data.productPurchases];
                    }
                    if (Array.isArray(result.data.packagingPurchases)) {
                        combinedProducts = [...combinedProducts, ...result.data.packagingPurchases];
                    }
                    if (Array.isArray(result.data.biddedProducts)) {
                      
                        const formattedBiddedProducts = result.data.biddedProducts.map(bid => ({
                            ...bid,
                            product: bid.product?.product || null 
                        }));
                        combinedProducts = [...combinedProducts, ...formattedBiddedProducts];
                    }
                } else {
                    console.error("API response does not contain valid data:", result.data);
                }

                setProducts(combinedProducts);

            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);




    const displayedProducts = products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );


    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <>
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    className="form-control form-control-sm"
                                    value={productsPerPage}
                                    onChange={handleProductsPerPageChange}
                                >
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
                                <table className="table table-hover">
                                    <thead className="thead-dark text-nowrap">
                                        <tr>
                                            <th>#</th>
                                            <th>Transaction Id</th>
                                            {/* <th>Artist Name</th> */}
                                            <th>Buyer Name</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Product Quantity</th>
                                            <th>Payment Type</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProducts.map((product, index) => {
                                            const productData =
                                                product.product ||
                                                product.resellProduct ||
                                                product.packagingProduct ||
                                                (product.biddedProduct ? product.biddedProduct.product : null);


                                            return (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                    <td>{product.transactionId}</td>
                                                    <td>
                                                        {product.buyer
                                                            ? `${product.buyer.name} ${product.buyer.lastName}`
                                                            : product.user
                                                                ? `${product.user.name} ${product.user.lastName}`
                                                                : "N/A"}
                                                    </td>

                                                    <td>
                                                        {productData ? (
                                                            <>
                                                                <img
                                                                    src={productData.mainImage || 'default-image-url.jpg'}
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
                                                                .format((productData.price) || (product.totalPrice))
                                                                .replace(/\.00$/, '')
                                                            : 'N/A'}
                                                    </td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.paymentMethod}</td>
                                                    <td>
                                                        {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </td>
                                                    <td>
                                                        {productData && (
                                                            <button className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() => navigate(`/${userType}/Dashboard/alltransaction/transcationproductdetails/${product._id || productData._id}`)}>
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Transaction;