import React, { useState, useEffect } from 'react';
import { useConfirm } from '../../../StatusConfirm';
import { toast } from 'react-toastify';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';



const AllBiddingProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);


    const confirm = useConfirm();


    const fetchProducts = async () => {
        try {
            const result = await getAPI("/api/getallbid", {}, true, false);
            if (result && result.data && Array.isArray(result.data.bids)) {
                setProducts(result.data.bids);
            } else {
                console.error("Invalid API response", result.data);
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        // const interval = setInterval(() => {
        //     fetchProducts(); 
        //   }, 1000);

        //   return () => clearInterval(interval);
    }, []);





    const updateProductStatus = async (productId, status) => {
        try {
            await putAPI(
                `/api/updateproductstatus/${productId}`,
                { status: status },
                {},
                true
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === productId ? { ...product, status: status } : product
                )
            );

            if (status === 'Approved') {
                toast.success('Product Request is Approved');
            } else if (status === 'Rejected') {
                toast.error('Product Request is Rejected');
            }
        } catch (error) {
            toast.error("Error updating product status:", error);
        }
    };

    const handleReject = (productId) => {
        confirm(() => updateProductStatus(productId, 'Rejected'), "Are you sure you want to reject this product?");
    };

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
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>All Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">All product</li>
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
                                            <th>Product Name</th>
                                            <th>Starting Bid</th>
                                            <th>Current Bid</th>
                                            <th>Bidded</th>
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
                                                        src={product.product.mainImage}
                                                        className="rounded-circle avatar"
                                                        alt=""
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    {product.product.productName}
                                                </td>
                                                <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.startingBid).replace(/\.00$/, '')}</td>
                                                <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.currentBid).replace(/\.00$/, '')}</td>
                                                <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.endBid).replace(/\.00$/, '')}</td>
                                                <td>{new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td>
                                                    <button className={`btn btn-sm ${product.status === 'Pending' ? 'btn-outline-warning' : product.status === 'Active' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                        {product.status}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-info mr-2"
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-success mr-2"
                                                        title="Approved"
                                                        onClick={() => updateProductStatus(product._id, 'Approved')}
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger mr-2"
                                                        title="Declined"
                                                        onClick={() => handleReject(product._id)}
                                                    >
                                                        <i className="fa fa-ban"></i>
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

export default AllBiddingProduct;