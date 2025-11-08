import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../../urlconfig';

const ProductRequest = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);

    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI(`${process.env.REACT_APP_API_URL}/api/getartistproductbyid/${userId}`, {}, true, false);
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
    }, []);


    const displayedProducts = products
        .filter(product => product.status === 'Approved')
        .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

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
                                            <th>Name</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Date</th>
                                            {/* <th>Status</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProducts.map((product, index) => (
                                            <tr key={product._id}>
                                                <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                <td>
                                                    {product.userId.name} {product.userId.lastName}</td>
                                                <td>
                                                    <img
                                                        src={product.mainImage}
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px'
                                                        }}
                                                    />{product.productName}</td>
                                                <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price).replace(/\.00$/, '')}</td>
                                                <td>{new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                {/* <td>
                                                    <button className={`btn btn-sm ${product.status === 'Pending' ? 'btn-outline-warning' : product.status === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                        {product.status}
                                                    </button>
                                                </td> */}
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-info mr-2"
                                                        onClick={() => navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/artistproductdetails/${product._id}`, { state: { userId } })}
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductRequest;
