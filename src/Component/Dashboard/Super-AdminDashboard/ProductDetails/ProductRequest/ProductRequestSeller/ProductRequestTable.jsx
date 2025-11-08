import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';

const ProductRequest = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const BASE_URL = '${process.env.REACT_APP_API_URL}';
  
    const navigate = useNavigate();
    const userType = useUserType(); 

    // Fetching userId from token in localStorage
    const token = localStorage.getItem('token');
    let userId = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); 
            userId = payload.userId; 
        } catch (error) {
            console.error("Invalid token format", error);
        }
    }

    useEffect(() => {
        if (!userId) {
            console.error('User ID not found in token');
            return;
        }

        const fetchProducts = async () => {
            try {
                const result = await getAPI(`${process.env.REACT_APP_API_URL}/api/getsellerproductbyid/${userId}`, {}, true, false);
                console.log("Full API Response:", result);
                console.log("Data Type:", typeof result.data);

                if (result && result.data && Array.isArray(result.data.data)) {
                    setProducts(result.data.data);
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

    // Pagination logic
    const totalPages = Math.ceil(products.length / productsPerPage);
    const displayedProducts = products.slice(
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

    return (
        <div className="container-fluid">
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
                                            <th>Seller Name</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProducts.map((product, index) => (
                                            <tr key={product._id}>
                                                <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                <td>
                                                    <img
                                                        src={product.userId.profilePhoto ? `${BASE_URL}${product.userId.profilePhoto}` : 'DashboardAssets/assets/images/user.png'}
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{ width: '30px', height: '30px', objectFit: 'cover', marginRight: '10px' }}
                                                    />
                                                    {product.userId.name} {product.userId.lastName}
                                                </td>
                                                <td>
                                                    <img
                                                        src={product.mainImage}
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{ width: '30px', height: '30px', objectFit: 'cover', marginRight: '10px' }}
                                                    />
                                                    {product.productName}
                                                </td>
                                                <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price).replace(/\.00$/, '')}</td>
                                                <td>{new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td>
                                                    <button className={`btn btn-sm ${product.status === 'Pending' ? 'btn-outline-warning' : product.status === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                        {product.status}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-info mr-2"
                                                        onClick={() => navigate(`/${userType}/Dashboard/productrequest/productdetails/${product.userId._id}`)}
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
                                    Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, products.length)} of {products.length} entries
                                </span>
                                <ul className="pagination">
                                    <li className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePrevious}>
                                        <button className="page-link">Previous</button>
                                    </li>
                                    <li className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={handleNext}>
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
