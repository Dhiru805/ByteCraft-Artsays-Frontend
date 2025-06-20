import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';


const AllBiddingProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [productsPerPage, setProductsPerPage] = useState(10);
const navigate = useNavigate();

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
        const interval = setInterval(() => {
            fetchProducts();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const filteredProducts = products.filter(product =>
        product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );
    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>All Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
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
                            <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    name="DataTables_Table_0_length"
                                    aria-controls="DataTables_Table_0"
                                    className="form-control form-control-sm"
                                    value={productsPerPage}
                                    onChange={handleProductsPerPageChange}
                                    style={{ minWidth: '70px' }}
                                >
                                    {/* <option value="5">5</option> */}
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
                            </div>
                            <div className="w-100 w-md-auto d-flex justify-content-end">
                                <div className="input-group" style={{ maxWidth: '150px' }}>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <i
                                        className="fa fa-search"
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                        }}
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <div className="body">
                            <div className="table-responsive">
                                <table className="table table-hover text-nowrap">
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
                                        {paginatedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedProducts.map((product, index) => (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${product.product.mainImage}`}
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
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR'
                                                        }).format(product.startingBid).replace(/\.00$/, '')}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR'
                                                        }).format(product.currentBid).replace(/\.00$/, '')}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR'
                                                        }).format(product.endBid).replace(/\.00$/, '')}
                                                    </td>
                                                    <td>
                                                        {new Date(product.createdAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={`btn btn-sm ${product.status === 'Pending'
                                                                ? 'btn-outline-warning'
                                                                : product.status === 'Active'
                                                                    ? 'btn-outline-success'
                                                                    : 'btn-outline-danger'
                                                                }`}
                                                        >
                                                            {product.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-info mr-2">
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>


                            <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                    Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                                </span>

                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li
                                        className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={handlePrevious}
                                    >
                                        <button className="page-link">Previous</button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                                        .filter((pageNumber) => pageNumber === currentPage)
                                        .map((pageNumber, index, array) => {
                                            const prevPage = array[index - 1];
                                            if (prevPage && pageNumber - prevPage > 1) {
                                                return (
                                                    <React.Fragment key={`ellipsis-${pageNumber}`}>
                                                        <li className="page-item disabled"><span className="page-link">...</span></li>
                                                        <li
                                                            key={pageNumber}
                                                            className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                            onClick={() => setCurrentPage(pageNumber)}
                                                        >
                                                            <button className="page-link">{pageNumber}</button>
                                                        </li>
                                                    </React.Fragment>
                                                );
                                            }

                                            return (
                                                <li
                                                    key={pageNumber}
                                                    className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                >
                                                    <button className="page-link">{pageNumber}</button>
                                                </li>
                                            );
                                        })}

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
        </div>
    );
};

export default AllBiddingProduct;
