import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../ConfirmationDialog';
import useUserType from '../../urlconfig';

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProductRequestToDelete, setSelectedProductRequestToDelete] = useState(null);
    const [isAutoSliding, setIsAutoSliding] = useState(true);
    const navigate = useNavigate();
    const userType = useUserType();

    const fetchProduct = async () => {
        try {
            const result = await getAPI(`http://localhost:3001/api/getproduct/${productId}`, {}, true, false);
            if (result.data && result.data.data) {
                setProduct(result.data.data);
            } else {
                console.error("Unexpected API response:", result);
                setProduct(null);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setProduct(null);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        let interval;
        if (isAutoSliding && product) {
            interval = setInterval(() => {
                handleNextImage();
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutoSliding, product, selectedImageIndex]);

    const handleNextImage = () => {
        if (product) {
            const totalImages = [product.mainImage, ...(product.otherImages || [])].length;
            setSelectedImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
        }
    };

    const handlePrevImage = () => {
        if (product) {
            const totalImages = [product.mainImage, ...(product.otherImages || [])].length;
            setSelectedImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
        }
    };

    const handleImageClick = () => {
        setIsAutoSliding(false);
        setTimeout(() => {
            setIsAutoSliding(true);
        }, 5000);
    };

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setSelectedProductRequestToDelete(null);
    };

    const handleDeleteConfirmed = () => {
        setProduct(null); 
        setIsDeleteDialogOpen(false);
        navigate(`/${userType}/Dashboard/artistproductrequest`);
    };

    const openDeleteDialog = (productRequest) => {
        setSelectedProductRequestToDelete(productRequest);
        setIsDeleteDialogOpen(true);
    };


    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Artist Product View</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                         <Link to={`/${userType}/Dashboard/artistproductrequest`}>Artist Product Request</Link></li>
                            <li className="breadcrumb-item">Artist Product View</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row clearfix">
                {/* Left Side - Image Carousel */}
                <div className="col-lg-5 col-md-12 text-center">
                     {product && (
                        <div className="card p-4 shadow-sm">
                            {product.userId && (
                                <div className="text-center">
                                    <img
                                        src={`http://localhost:3001${product.userId.profilePhoto}`}
                                        alt="User Profile"
                                        width="140"
                                        height="140"
                                        className="rounded-circle border border-3 mb-2"
                                    />
                                    <h5 className="mt-2 mb-3 fw-bold">{product.userId.name} {product.userId.lastName}</h5>
                                </div>
                            )}

                            <h3 className="fw-semibold text-primary text-center">{product.productName}</h3>

                            <p
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: product.description.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (_, src) => {
                                        return `<img src="${src}" style="max-width: 70%; height: auto; object-fit: contain;" />`;
                                    })
                                }}
                            ></p>

                            {/* 
                            <div className="mt-4">
                                <p className="mb-3"><strong>Category:</strong> {product.category}</p>
                                <p className="mb-3"><strong>Price:</strong> <span className="text-success fw-bold">₹{product.price}</span></p>
                                <p className="mb-3"><strong>Status:</strong>
                                    <button
                                        className={`btn btn-sm ms-3 py-1 px-3 ${product.status === 'Pending' ? 'btn-warning' : product.status === 'Approved' ? 'btn-success' : 'btn-danger'}`}
                                    >
                                        {product.status}
                                    </button>
                                </p>
                            </div> */}

                        </div>
                    )}
                </div>

                {/* Right Side - Product Details */}
                <div className="col-lg-7 col-md-12">
                {product && (
                        <div className="card p-3">
                            <div className="image-carousel d-flex align-items-center justify-content-center">
                                <button className="btn btn-light mx-2" onClick={handlePrevImage}>&lt;</button>
                                <img
                                    src={[product.mainImage, ...(product.otherImages || [])][selectedImageIndex]}
                                    alt="Product"
                                    width="300"
                                    height="300"
                                    className="rounded shadow"
                                    onClick={handleImageClick}
                                />
                                <button className="btn btn-light mx-2" onClick={handleNextImage}>&gt;</button>
                            </div>
                            <div className="mt-3">
                            <button className="btn btn-outline-dark ms-2" data-id="123">Edit</button>

                                <button className="btn btn-outline-danger mx-2"    onClick={() => openDeleteDialog(product)}>Delete</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {isDeleteDialogOpen && (
    <ConfirmationDialog
        onClose={handleDeleteCancel}
        deleteType="productRequest"
        id={selectedProductRequestToDelete._id}
        onDeleted={handleDeleteConfirmed}
    />
)}
      
        </div>
    );
}

export default ProductDetails;
