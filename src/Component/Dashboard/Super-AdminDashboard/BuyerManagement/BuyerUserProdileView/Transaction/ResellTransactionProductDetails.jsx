import React, { useEffect, useState } from "react";
import getAPI from "../../../../../../api/getAPI";
import { useParams } from "react-router-dom";
import useUserType from "../../../urlconfig";
import { Link } from "react-router-dom";

function AllProduct() {
    const { productId } = useParams();
    const { userId } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedImages, setSelectedImages] = useState({});
    const [expanded, setExpanded] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const userType = useUserType();

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
                                          <Link to={`/${userType}/Dashboard/buyermanagetable`} >Buyer Management</Link></li>
                                      <li className="breadcrumb-item active">
                                          <Link to={`/${userType}/Dashboard/buyermanagetable/buyerprofileview/${userId}`} >Buyer Profile View</Link></li>
                                      <li className="breadcrumb-item ">Product Details</li>
                                  </ul>
                              </div>
                          </div>
                      </div>

            <div className="block-header">
                {products.length === 0 ? (
                    <p className="text-center text-muted">No products found.</p>
                ) : (
                    products.map((product) => {
                        const productData = product?.product || product?.resellProduct; 
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
