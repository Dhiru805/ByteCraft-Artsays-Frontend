import React, { useState, useEffect } from 'react';
import { useConfirm } from '../../../StatusConfirm';
import { toast } from 'react-toastify';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { useNavigate } from 'react-router-dom';
import useUserType from '../../../urlconfig';

const ProductRequest = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const confirm = useConfirm();
    const navigate = useNavigate();
    const userType = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getAPI("/api/getproductrequest", {}, true, false);
                console.log("Full API Response:", result);

                if (result && result.data && result.data.data) {
                    const { products = [], crops = [] } = result.data.data;
                    console.log("Fetched Products and Crops:", [...products, ...crops]);
                    setProducts([...products, ...crops]);
                } else {
                    console.error("Unexpected API response structure:", result.data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products and crops:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);





    const updateProductStatus = async (productId, status) => {
        console.log("Updating Product ID:", productId);
        const product = products.find(p => p._id === productId);
        if (!product) {
            console.error("Product not found in frontend state.");
            return;
        }
        const type = product?.buyerId ? "buyerResell" : "cropImage";
        try {
            await putAPI(
                `/api/updateproductrequeststatus/${productId}/${type}`,
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
            console.error("Error updating product status:", error);
        }
    };


    const handleReject = (productId) => {
        confirm(() => updateProductStatus(productId, 'Rejected'), "Are you sure you want to reject this product?");
    };

    const filteredProducts = products.filter((product) => {
        const buyer = product?.buyerId || product?.userId || {};
        const fullName = `${buyer?.name || ''} ${buyer?.lastName || ''}`.trim().toLowerCase();
        const term = searchTerm.toLowerCase().trim();

        return fullName.includes(term);
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
        const images = [product.mainImage, ...(product.otherImages || [])];
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
                        <h2>Resell Product Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Resell Product Request</li>
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
                                            <th>Name</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProducts.map((product, index) => {
                                            const buyer = product?.buyerId || product?.userId || {};
                                            const buyerId = product?.userId?._id || product?._id || "";
                                            const name = buyer?.name || "Unknown";
                                            const lastName = buyer?.lastName || "";
                                            const productName = product?.productName || "Unnamed Product";
                                            const mainImage = product?.mainImage || "default-image.jpg";
                                            const price = product?.price !== undefined ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price).replace(/\.00$/, '') : "N/A";
                                            const createdAt = product?.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown Date";
                                            const status = product?.status || "Pending";

                                            return (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                    <td>{name} {lastName}</td>
                                                    <td>
                                                        <img
                                                            src={mainImage}
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
                                                        />{product.productName}

                                                    </td>
                                                    <td>{price}</td>
                                                    <td>{createdAt}</td>
                                                    <td>
                                                        <button className={`btn btn-sm ${status === 'Pending' ? 'btn-outline-warning' : status === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                            {status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-info mr-2"
                                                            onClick={() => {
                                                                console.log("Navigating with ID:", buyerId);
                                                                if (!buyerId) {
                                                                    console.error("Invalid ID:", product);
                                                                    toast.error("Cannot navigate: ID is missing.");
                                                                    return;
                                                                }
                                                                navigate(`/super-admin/buyer/resellproduct/productview/${buyerId}`);
                                                            }}
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>



                                                        {status !== 'Approved' && (
                                                            <button className="btn btn-sm btn-outline-success mr-2" title="Approve" onClick={() => updateProductStatus(product._id, 'Approved')}>
                                                                <i className="fa fa-check"></i>
                                                            </button>
                                                        )}
                                                        {status !== 'Rejected' && (
                                                            <button className="btn btn-sm btn-outline-danger" title="Reject" onClick={() => handleReject(product._id)}>
                                                                <i className="fa fa-ban"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            height: '50%',
                            backgroundColor: '#111',
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Left Arrow */}
                        <button
                            onClick={goToPreviousImage}
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '2rem',
                                color: currentImageIndex === 0 ? '#666' : '#fff',
                                background: 'Black',
                                border: 'none',
                                cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                                zIndex: 2,
                            }}
                            disabled={currentImageIndex === 0}
                        >
                            &#10094;
                        </button>

                        {/* Image */}
                        <img
                            src={currentImages[currentImageIndex]}
                            alt="Popup"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                            }}
                        />

                        {/* Right Arrow */}
                        <button
                            onClick={goToNextImage}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '2rem',
                                color: currentImageIndex === currentImages.length - 1 ? '#666' : '#fff',
                                background: 'Black',
                                border: 'none',
                                cursor: currentImageIndex === currentImages.length - 1 ? 'not-allowed' : 'pointer',
                                zIndex: 2,
                            }}
                            disabled={currentImageIndex === currentImages.length - 1}
                        >
                            &#10095;
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductRequest;