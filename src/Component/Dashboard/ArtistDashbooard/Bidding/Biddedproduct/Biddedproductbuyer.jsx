import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../urlconfig';
import { jwtDecode } from 'jwt-decode';

const BiddedProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);

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

    useEffect(() => {
        if (!userId) return;  
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`${process.env.REACT_APP_API_URL}/api/getbiddedproductbybuyerid/${encodeURIComponent(userId)}`, {}, true, false);
                console.log("Full API Response:", result);
                console.log("Data Type:", typeof result.data);

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
    }, [userId]);

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
                                    <tbody>
                                        {displayedProducts.map((product, index) => {
                                           const productData = product.product?.product;
                                           const buyer = product.buyer;
                                            return (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                    <td>{buyer.name} {buyer.lastName}</td>
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
                                                                .format(productData.price)
                                                                .replace(/\.00$/, '')
                                                            : 'N/A'}
                                                    </td>
                                                    <td>
                                                        {new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </td>
                                                    <td>
                                                        {productData && (
                                                            <button className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() => navigate(`/${userType}/Dashboard/biddedproduct/productdetails/${productData._id}`)}>
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

export default BiddedProduct ;
