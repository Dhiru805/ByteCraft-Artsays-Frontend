import React, { useEffect, useState } from "react";
import getAPI from "../../../../../../api/getAPI";
import { useParams } from 'react-router-dom';
import useUserType from '../../../urlconfig';
import { Link } from "react-router-dom";


function AllProduct() {
    const { productId } = useParams();
    const {userId} = useParams();
    const [products, setProducts] = useState([]);
    const [selectedImages, setSelectedImages] = useState({});
    const [expanded, setExpanded] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const userType = useUserType();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getAPI(`/api/getproductbyid/${productId}`, {}, true, false);
                if (result.data && result.data.data) {
                    const productData = Array.isArray(result.data.data) ? result.data.data : [result.data.data];
                    setProducts(productData);

                    const initialSelectedImages = {};
                    productData.forEach((product) => {
                        initialSelectedImages[product._id] = product.mainImage;
                    });
                    setSelectedImages(initialSelectedImages);
                } else {
                    console.error("Unexpected API response:", result);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setProducts([]);
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


    

    return (
        <>
           <div className="block-header">
                          <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                  <h2>Product Details</h2>
                                  <ul className="breadcrumb">
                                      <li className="breadcrumb-item">
                                          <a href="index.html">
                                              <i className="fa fa-dashboard"></i>
                                          </a>
                                      </li>
                                      <li className="breadcrumb-item active">
                                          <Link to={`/${userType}/Dashboard/sellermanagetable`} >Seller Management</Link></li>
                                      <li className="breadcrumb-item active">
                                          <Link to={`/${userType}/Dashboard/sellermanagetable/sellerprofileview/${userId}`} >Seller Profile View</Link></li>
                                      <li className="breadcrumb-item ">Product Details</li>
                                  </ul>
                              </div>
                          </div>
                      </div>
            <div className="block-header">
                {products.map((product) => {
                    return (
                        <div className="card" key={product._id}>
                            <div className="body">
                                <div className="row">
                                    {/* Image Preview Column */}
                                    <div className="preview col-lg-4 col-md-12">
                                        <div className="preview-pic tab-content">
                                            <div className="tab-pane active">
                                                <img
                                                    src={selectedImages[product._id] || product.mainImage}
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

                                        {/* Small Images */}
                                        <div className="d-flex flex-wrap justify-content-start">
                                            {[product.mainImage, ...product.otherImages.slice(0, 4)].map((image, imgIndex) => (
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
                                                        onClick={() => handleImageClick(product._id, image)}
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

                                    {/* Product Details Column */}
                                    <div className="details col-lg-8 col-md-12">
                                        <h3 className="product-title mb-0">{product.productName}</h3>
                                        <hr />
                                        <h5 className="price m-t-0">
                                            Price: <span className="text-warning">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price).replace(/\.00$/, '')}
                                            </span>
                                        </h5>
                                        <h5 className="category m-t-0">
                                            Category: <span className="text-info">{product.category}</span>
                                        </h5>
                                        <hr />
                                    </div>
                                </div>

                                {/* Full-Width Tab Content Below */}
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
                                                {/* <button
                                                        className={`nav-link ${activeTab === "artist" ? "active" : ""}`}
                                                        onClick={() => handleTabChange("artist")}
                                                    >
                                                        Artist Details
                                                    </button> */}
                                            </li>
                                        </ul>

                                        <div className="tab-content mt-3">
                                            {activeTab === "description" && (
                                                <div className="tab-pane active">
                                                    <p
                                                        className="product-description"
                                                        style={{
                                                            maxHeight: expanded[product._id] ? "none" : "60px",
                                                            overflow: "hidden",
                                                            transition: "max-height 0.3s ease",
                                                        }}
                                                    >
                                                        {product.description}
                                                    </p>
                                                    <button
                                                        className="btn btn-link"
                                                        style={{
                                                            padding: "0",
                                                            textDecoration: "none",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => toggleDescription(product._id)}
                                                    >
                                                        {expanded[product._id] ? "Show Less" : "Read More"}
                                                    </button>
                                                </div>
                                            )}

                                            {activeTab === "artist" && (
                                                <div className="tab-pane active">
                                                    <p><strong>Name:</strong> <span style={{ marginLeft: "10px" }}>{product.userId.name} {product.userId.lastName}</span></p>
                                                    <p><strong>Email:</strong> <span style={{ marginLeft: "10px" }}>{product.userId.email}</span></p>
                                                    <p><strong>Website:</strong>
                                                        <a
                                                            href={product.userId.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ marginLeft: "10px", textDecoration: "none", color: "blue" }}
                                                        >
                                                            {product.userId.website}
                                                        </a>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
         
        </>
    );
}

export default AllProduct;