import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../urlconfig';

const SoldProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);



    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI("http://localhost:3001/api/totalpurchaseproduct", {}, true, false);
                console.log("Full API Response:", result);

                if (result && result.data && Array.isArray(result.data)) {
                    setProducts(result.data); // Set only the array
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



    const displayedProducts = products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );


    const handleProductsPerPageChange = (event) => {
        setProductsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Artist Sold Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">Artist Sold Product</li>
                        </ul>
                    </div>
                </div>
            </div>

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
                                            <th>Artist Name</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Sold Product Quantity</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProducts.map((product, index) => (
                                            <tr key={product.productId}>
                                                <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                <td>{product.artistName}</td> 
                                                <td>
                                                    <img
                                                        src={product.product}  
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px'
                                                        }}
                                                    /> {product.productName}
                                                </td>
                                                <td>{product.productPrice}</td> 
                                                <td>{product.totalQuantity}</td> 
                                                <td>
                                                    <button className="btn btn-sm btn-outline-info mr-2" onClick={() => navigate(`/${userType}/Dashboard/artistsoldproduct/soldproductdetails/${product.productId}`)}>
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

export default SoldProduct;