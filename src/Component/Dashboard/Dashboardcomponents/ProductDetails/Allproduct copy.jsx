import React, { useEffect, useState } from "react";
import getAPI from "../../../../api/getAPI";

function AllProduct() {
    const [products, setProducts] = useState([]);
    const [selectedImages, setSelectedImages] = useState({});
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getAPI("http://localhost:3001/api/get-allapprovedproduct", {}, true, false);
                if (result.data && result.data.data) {
                    setProducts(result.data.data);
                    const initialSelectedImages = {};
                    result.data.data.forEach((product) => {
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
    }, []);

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

    return (
        <>
            <div className="block-header">
                {products.map((product) => {
                    return (
                        <div className="card" key={product._id}>
                            <div className="body">
                                <div className="row">
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


                                        <div className="d-flex flex-wrap justify-content-start">
                                            {[product.mainImage, ...product.otherImages.slice(0, 4)].map((image, imgIndex) => (
                                                <div key={imgIndex} style={{ margin: "5px" }}>
                                                    <img
                                                        src={image}
                                                        className="img-thumbnail"
                                                        alt={`Thumbnail ${imgIndex + 1}`}
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
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

                                    <div className="details col-lg-8 col-md-12">
                                        <h3 className="product-title mb-0">{product.productName}</h3>
                                        <hr />
                                        <h5 className="price m-t-0">
                                            Price: <span className="text-warning">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price).replace(/\.00$/, '')}
                                            </span>
                                        </h5>


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
                                        <hr />
                                        <div className="action">
                                            <button className="btn btn-primary mx-2" type="button">
                                            <i className="fa fa-shopping-cart"></i> 
                                            </button>
                                            <button className="btn btn-danger" type="button">
                                                <i class="fa fa-heart"></i>
                                            </button>
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
