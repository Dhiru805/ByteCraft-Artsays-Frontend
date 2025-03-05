import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import useUserType from '../urlconfig';

function AllProduct() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const userType = useUserType(); 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getAPI("http://localhost:3001/api/get-allapprovedproduct", {}, true, false);
                if (result.data && result.data.data) {
                    setProducts(result.data.data);
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

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            padding: "10px",
        }}>
            <style>
                {`
                @media (max-width: 768px) {
                    .product-card {
                        flex: 1 1 calc(50% - 10px) !important;
                        max-width: calc(50% - 10px) !important;
                    }
                    
                    .product-image {
                        height: 180px !important;
                    }
                    
                    .product-title {
                        font-size: 1em !important;
                        min-height: 3em !important;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .product-card {
                        flex: 1 1 calc(50% - 20px) !important;
                        max-width: calc(50% - 20px) !important;
                    }
                }
            `}
            </style>

            {products.map((product) => (
                <div
                    key={product._id}
                    className="product-card"
                    style={{
                        flex: "1 1 calc(33.333% - 20px)",
                        maxWidth: "calc(33.333% - 20px)",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => navigate(`/${userType}/Dashboard/allproduct/productinfo/${product._id}`)}
                >
                    <div style={{ padding: "10px", textAlign: "center" }}>
                        <div
                            className="product-image"
                            style={{
                                height: "250px",
                                overflow: "hidden",
                                marginBottom: "10px",
                            }}
                            onClick={() => navigate(`/${userType}/Dashboard/allproduct/productinfo/${product._id}`)}
                        >
                            <img
                                src={product.mainImage}
                                alt="Product"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                        </div>
                        <h5 className="product-title" style={{
                            margin: "10px 0",
                            fontSize: "1.2em",
                            color: "#333",
                            minHeight: "1em",
                        }}>
                            {product.productName}
                        </h5>
                        <p className="product-price" style={{
                            fontSize: "1.1em",
                            fontWeight: "bold",
                            color: "#007bff",
                            marginBottom: "10px",
                        }}>
                            ₹{product.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AllProduct;
