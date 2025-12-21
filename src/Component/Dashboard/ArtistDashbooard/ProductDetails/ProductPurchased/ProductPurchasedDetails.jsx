import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import { useParams } from "react-router-dom";
import useUserType from "../../../urlconfig";
import { Link, useNavigate } from "react-router-dom";

function AllProduct() {
    const { productId } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedImages, setSelectedImages] = useState({});
    const [expanded, setExpanded] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const [loading,setLoading]=useState(true);
    const userType = useUserType();
  const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getAPI(
                    `/api/getbuyerproductpurchaseddetailsbyid/${productId}`,
                    {},
                    true,
                    false
                );

                if (result.data && result.data.data) {
                    const productData = Array.isArray(result.data.data) ? result.data.data : [result.data.data];
                    setProducts(productData);

                    const initialSelectedImages = {};
                    productData.forEach((product) => {
                        const productInfo = product?.product || product?.resellProduct; 
                        if (productInfo?.mainImage) {
                            initialSelectedImages[productInfo._id] = productInfo.mainImage;
                        }
                    });
                    setSelectedImages(initialSelectedImages);
                } else {
                    console.error("Unexpected API response:", result);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setProducts([]);
            }finally{
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleImageClick = (productId, image) => {
        setSelectedImages((prevState) => ({
            ...prevState,
            [productId]: image,
        }));
    };

    const toggleDescription = (productId) => {
        setExpanded((prevState) => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
if(loading)return <ProductPurchasedSkeleton/>
    return (
        <>
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Purchased Details</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to={`/${userType}/Dashboard/productpurchased`}>
                                 Product Purchased
                                </Link>
                            </li>
                            <li className="breadcrumb-item ">Product Purchased Details</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="block-header">
                {products.length === 0 ? (
                    <p className="text-center text-muted">No products found.</p>
                ) : (
                    products.map((product) => {
                        const productData = product?.product || product?.resellProduct; // Use resellProduct if product is null
                        const buyerData = product?.buyer;

                        return (
                            <div className="card" key={product?._id || Math.random()}>
                                <div className="body">
                                    <div className="row">
                                        <div className="preview col-lg-4 col-md-12">
                                            <div className="preview-pic tab-content">
                                                <div className="tab-pane active">
                                                    <img
                                                        src={selectedImages[productData?._id] || productData?.mainImage || "/default-image.jpg"}
                                                        className="img-fluid"
                                                        style={{
                                                            width: "350px",
                                                            height: "350px",
                                                            objectFit: "cover",
                                                        }}
                                                        alt="Product Preview"
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-wrap justify-content-start">
                                                {[productData.mainImage, ...productData.otherImages.slice(0, 4)].map((image, imgIndex) => (
                                                    <div key={imgIndex} style={{ margin: "5px" }}>
                                                        <img
                                                            src={image}
                                                            className="img-thumbnail"
                                                            alt={`Thumbnail ${imgIndex + 1}`}
                                                            style={{
                                                                width: "55px",
                                                                height: "55px",
                                                                cursor: "pointer",
                                                                objectFit: "cover",
                                                                transition: "transform 0.3s ease",
                                                                border: "none",
                                                                outline: "none",
                                                            }}
                                                            onClick={() => handleImageClick(productData._id, image)}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.transform = "scale(1.1)";
                                                                e.target.style.border = "none";
                                                                e.target.style.outline = "none";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.transform = "scale(1)";
                                                                e.target.style.border = "none";
                                                                e.target.style.outline = "none";
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="details col-lg-8 col-md-12">
                                            <h3 className="product-title mb-0">
                                                {productData?.productName || "Unknown Product"}
                                            </h3>
                                            <hr />
                                            <h5 className="price m-t-0">
                                                Price:{" "}
                                                <span className="text-warning">
                                                    {productData?.price
                                                        ? new Intl.NumberFormat("en-IN", {
                                                            style: "currency",
                                                            currency: "INR",
                                                        }).format(productData.price)
                                                        : "N/A"}
                                                </span>
                                            </h5>
                                            <h5 className="category m-t-0">
                                                Category:{" "}
                                                <span className="text-info">{productData?.category || "N/A"}</span>
                                            </h5>
                                            <hr />
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                                                        onClick={() => handleTabChange("description")}
                                                    >
                                                        Product Description
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === "artist" ? "active" : ""}`}
                                                        onClick={() => handleTabChange("artist")}
                                                    >
                                                        Buyer Details
                                                    </button>
                                                </li>
                                            </ul>

                                            <div className="tab-content mt-3">
                                                <div className={`tab-pane ${activeTab === "description" ? "active" : ""}`}>
                                                    {activeTab === "description" && (
                                                        <>
                                                            <p
                                                                className="product-description"
                                                                style={{
                                                                    maxHeight: expanded[productData._id] ? "none" : "60px",
                                                                    overflow: "hidden",
                                                                    transition: "max-height 0.3s ease",
                                                                }}
                                                            >
                                                                {productData.description}
                                                            </p>
                                                            <button
                                                                className="btn btn-link"
                                                                style={{
                                                                    padding: "0",
                                                                    textDecoration: "none",
                                                                    cursor: "pointer"
                                                                }}
                                                                onClick={() => toggleDescription(productData._id)}
                                                            >
                                                                {expanded[productData._id] ? "Show Less" : "Read More"}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                <div className={`tab-pane ${activeTab === "artist" ? "active" : ""}`}>
                                                    {activeTab === "artist" && (
                                                        <div className="tab-pane active">
                                                            <p><strong>Name:</strong> <span style={{ marginLeft: "10px" }}>{buyerData?.name} {buyerData?.lastName}</span></p>
                                                            <p><strong>Email:</strong> <span style={{ marginLeft: "10px" }}>{buyerData?.email}</span></p>
                                                            <p><strong>Website:</strong>
                                                                <a
                                                                    href={buyerData?.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ marginLeft: "10px", textDecoration: "none", color: "blue" }}
                                                                >
                                                                    {buyerData?.website || "N/A"}
                                                                </a>
                                                            </p>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default AllProduct;

function ProductPurchasedSkeleton() {
    return (
        <div className="animate-pulse">

            {/* Header Skeleton */}
            <div className="block-header mb-6">
                <div className="row">

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="h-7 w-48 bg-gray-300 rounded mb-4"></div>

                        {/* Breadcrumb */}
                        <ul className="flex items-center gap-3">
                            <li className="h-4 w-6 bg-gray-200 rounded"></li>
                            <li className="h-4 w-24 bg-gray-200 rounded"></li>
                            <li className="h-4 w-32 bg-gray-200 rounded"></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Product Card Skeleton */}
            <div className="card mb-6">
                <div className="body p-4">

                    <div className="row">

                        {/* LEFT: Image Preview */}
                        <div className="preview col-lg-4 col-md-12 mb-4">

                            {/* Main Image */}
                            <div className="w-[350px] h-[350px] bg-gray-300 rounded-lg mb-4"></div>

                            {/* Thumbnails */}
                            <div className="flex flex-wrap gap-3">
                                {Array(5).fill().map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-[55px] h-[55px] bg-gray-300 rounded"
                                    ></div>
                                ))}
                            </div>

                        </div>

                        {/* RIGHT: Product Details */}
                        <div className="details col-lg-8 col-md-12">

                            {/* Product Title */}
                            <div className="h-6 w-64 bg-gray-300 rounded"></div>
                            <hr className="my-4" />

                            {/* Price */}
                            <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>

                            {/* Category */}
                            <div className="h-5 w-48 bg-gray-200 rounded"></div>
                            <hr className="my-4" />

                        </div>

                    </div>

                    {/* Tabs */}
                    <div className="row mt-6">
                        <div className="col-12">

                            {/* Tab Buttons */}
                            <div className="flex gap-4 border-b pb-2">

                                <div className="h-8 w-40 bg-gray-200 rounded"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded"></div>

                            </div>

                            {/* Tab Content */}
                            <div className="mt-4">

                                {/* Description Content */}
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                                </div>

                                {/* Read More */}
                                <div className="h-4 w-24 bg-gray-200 rounded mt-3"></div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
