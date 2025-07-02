import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';

const SoldProduct = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI("/api/buyersoldproduct", {}, true, false);
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

    const filteredProducts = products.filter((product) => {
        return product.buyerName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(
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

    const handleImageClick = (product) => {
    const images = [product.product];        
    setCurrentImages(images);
        setCurrentImageIndex(0);
        setShowPopup(true);
    };


    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1));
    };


    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Buyer Sold Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Buyer Sold Product</li>
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
                                <table className="table table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Buyer Name</th>
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
                                                <td>{product.buyerName}</td>
                                                <td>
                                                        <img
                                                            src={product.product}
                                                            className="rounded-circle avatar"
                                                            alt=""
                                                            onClick={() => handleImageClick(product)}
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                objectFit: 'cover',
                                                                marginRight: '10px',
                                                                cursor: 'pointer'
                                                            }}
                                                        /> {product.productName}
                                                </td>
                                                <td>{product.productPrice}</td>
                                                <td>{product.totalQuantity}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-info mr-2" onClick={() => navigate(`/${userType}/Dashboard/buyersoldproduct/soldproductdetails/${product.productId}`)}>
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                    Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
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
            {showPopup && (
                <div
                    onClick={() => setShowPopup(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ position: 'relative', width: '500px', height: '600px', backgroundColor: '#111', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                    >
                        <button onClick={goToPreviousImage} disabled={currentImageIndex === 0} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '2rem', background: 'black', color: currentImageIndex === 0 ? '#666' : '#fff', border: 'none', cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer' }}>
                            &#10094;
                        </button>
                        <img
                            src={currentImages[currentImageIndex]}
                            alt="Popup"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
                        />
                        <button onClick={goToNextImage} disabled={currentImageIndex === currentImages.length - 1} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '2rem', background: 'black', color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff', border: 'none', cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer' }}>
                            &#10095;
                        </button>
                    </div>
                </div>
            )}
        
        </div>
    );
};

export default SoldProduct;