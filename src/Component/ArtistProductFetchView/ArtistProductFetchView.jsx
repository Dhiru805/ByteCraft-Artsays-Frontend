
import React, { useEffect, useState } from "react";
import getAPI from "../../api/getAPI";
import { useParams, Link } from "react-router-dom";
import useUserType from "../Dashboard/urlconfig";

function ArtistProductFetchView() {
    const { productId } = useParams();
    const [data, setData] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const userType = useUserType();
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const result = await getAPI(`/api/product/details/${productId}`, {}, true, false);
                
                if (!result?.data?.success) {
                    console.error("API Error:", result);
                    return;
                }

                const info = result.data;

                setData(info);

                const mainImg = info.product?.mainImage || "";
                setSelectedImage(mainImg ? `${BASE_URL}${mainImg}` : "");
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };

        fetchDetails();
    }, [productId]);

    if (!data) return <p className="text-center mt-4">Loading details...</p>;

    //const { product, seller, buyers, mainCategoryDetails } = data;
const { product, seller, buyers } = data;
    //const mainCategoryName = mainCategoryDetails?.mainCategoryName || product?.mainCategory || "N/A";
const mainCategoryName = product?.mainCategory || "N/A";

    // const sellerLabel =
    //     seller?.role === "artist"
    //         ? "Artist Details"
    //         : seller?.role === "seller"
    //         ? "Seller Details"
    //         : "User Details";
   const sellerLabel =
    seller?.userType === "Artist"
        ? "Artist Details"
        : seller?.userType === "Seller"
        ? "Seller Details"
        : "User Details";



    return (
        <>
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Full Details</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to={`/${userType}/dashboard`}>
                                    <i className="fa fa-dashboard"></i>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active">
                                <span>Product Details</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="body">

                    {/* ---- ROW 1: IMAGES + PRODUCT INFO ---- */}
                    <div className="row">
                        {/* IMAGE PREVIEW */}
                        <div className="col-lg-4 col-md-12">
                            <img
                                src={selectedImage || `${BASE_URL}${product?.mainImage || ""}`}
                                alt="Main"
                                className="img-fluid"
                                style={{
                                    width: "350px",
                                    height: "350px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />

                            {/* Thumbnails */}
                            <div className="d-flex flex-wrap mt-2">
                                {[
                                    product?.mainImage,
                                    ...(product?.otherImages || [])
                                ].filter(Boolean).map(
                                    (img, idx) => {
                                        const imgUrl = img ? `${BASE_URL}${img}` : "";
                                        return (
                                            <img
                                                key={idx}
                                                src={imgUrl}
                                                onClick={() => setSelectedImage(imgUrl)}
                                                className="img-thumbnail"
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    margin: "5px",
                                                    cursor: "pointer",
                                                }}
                                                alt={`Thumbnail ${idx + 1}`}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="col-lg-8 col-md-12">
                            <h3>{product?.name || product?.productName || "N/A"}</h3>
                            <h5 className="text-info">
                                Main Category: {mainCategoryName}
                            </h5>
                            {product?.category && (
                                <h5 className="text-secondary">
                                    Category: {product.category}
                                </h5>
                            )}
                            {product?.subCategory && (
                                <h5 className="text-secondary">
                                    Sub Category: {product.subCategory}
                                </h5>
                            )}

                            <h4 className="text-warning mt-3">
                                Price:{" "}
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                })
                                    .format(product?.price || product?.sellingPrice || 0)
                                    .replace(/\.00$/, "")}
                            </h4>
                            {/* {product?.quantity !== undefined && (
                                <h5 className="mt-2">
                                    <strong>Quantity:</strong> {product.quantity}
                                </h5>
                            )} */}
                            {product?.dimensions && (
                                <h5 className="mt-2">
                                    <strong>Dimensions:</strong> {`${product.dimensions.width}W × ${product.dimensions.height}H × ${product.dimensions.depth}D`}

                                </h5>
                            )}
                        </div>
                    </div>

                    {/* ---- ROW 2: TABS ---- */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "description" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("description")}
                                    >
                                        Product Description
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "seller" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("seller")}
                                    >
                                        {sellerLabel}
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "buyer" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("buyer")}
                                    >
                                        Buyer Details
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "pricing" ? "active" : ""
                                        }`}
                                        onClick={() => setActiveTab("pricing")}
                                    >
                                        Pricing Details
                                    </button>
                                </li>
                            </ul>

                            {/* ---- TAB CONTENT ---- */}
                            <div className="tab-content mt-3">

                                {/* DESCRIPTION TAB */}
                                {activeTab === "description" && (
                                    <div>
                                        <p
                                            style={{
                                                maxHeight: expanded ? "none" : "70px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {product?.description || "No description available"}
                                        </p>
                                        {product?.description && product.description.length > 100 && (
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => setExpanded(!expanded)}
                                            >
                                                {expanded ? "Show Less" : "Read More"}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* SELLER TAB */}
                                {activeTab === "seller" && seller && (
                                    <div>
                                        {seller.profilePhoto && (
                                            <div className="mb-3">
                                                <img
                                                    src={`${BASE_URL}${seller.profilePhoto}`}
                                                    alt="Profile"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <p><strong>Name:</strong> {seller.name || "N/A"}</p>
                                        <p><strong>Email:</strong> {seller.email || "N/A"}</p>
                                        {/* <p><strong>Phone:</strong> {seller.phone || "N/A"}</p> */}
                                        {seller.website && (
                                            <p>
                                                <strong>Website:</strong>{" "}
                                                <a href={seller.website} target="_blank" rel="noreferrer">
                                                    {seller.website}
                                                </a>
                                            </p>
                                        )}
                                        {/* {seller.artistDetails && (
                                            <div className="mt-3">
                                                <h6><strong>Artist Details:</strong></h6>
                                                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                                                    {JSON.stringify(seller.artistDetails, null, 2)}
                                                </pre>
                                            </div>
                                        )} */}
                                    </div>
                                )}

                                {/* BUYER DETAILS TAB */}
                                {activeTab === "buyer" && (
                                    <div>
                                        {buyers.length === 0 ? (
                                            <p className="text-muted">No buyers yet.</p>
                                        ) : (
                                            buyers.map((b, idx) => (
                                                <div key={idx} className="border rounded p-2 mb-2">
                                                    <p><strong>Name:</strong> {b.buyerName}</p>
                                                    <p><strong>Email:</strong> {b.buyerEmail}</p>
                                                    <p><strong>Quantity Purchased:</strong> {b.quantityPurchased}</p>
                                                    <p><strong>Purchase Date:</strong> {new Date(b.purchaseDate).toLocaleDateString()}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* PRICING TAB */}
                                {/* {activeTab === "pricing" && (
                                    <div>
                                        <p><strong>Market Price:</strong> {product.marketPrice}</p>
                                        <p><strong>Discount:</strong> {product.discount}%</p>
                                        <p><strong>GST:</strong> {product.gstPercentage}%</p>
                                        <p><strong>Shipping Charges:</strong> {product.shippingCharges}</p>
                                    </div>
                                )} */}
{/* PRICING DETAILS TAB */}
{activeTab === "pricing" && (
    <div>
        <p>
            <strong>Price:</strong>{" "}
            {product?.price || product?.sellingPrice
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(product.price || product.sellingPrice).replace(/\.00$/, "")
                : "N/A"}
        </p>

        {product?.marketPrice && (
            <p>
                <strong>Market Price:</strong>{" "}
                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(product.marketPrice).replace(/\.00$/, "")}
            </p>
        )}

        {product?.finalPrice && (
            <p>
                <strong>Final Price:</strong>{" "}
                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                }).format(product.finalPrice).replace(/\.00$/, "")}
            </p>
        )}

        {product?.discount !== undefined && (
            <p>
                <strong>Discount:</strong>{" "}
                {product.discount
                    ? `${product.discount}%`
                    : "No discount"}
            </p>
        )}

        {product?.includeGst !== undefined && (
            <p>
                <strong>GST Included:</strong>{" "}
                {product.includeGst ? "Yes" : "No"}
            </p>
        )}

        {product?.includeGst && product?.gstPercentage !== undefined && (
            <p>
                <strong>GST Percentage:</strong>{" "}
                {product.gstPercentage || 0}%
            </p>
        )}

        {product?.shippingCharges !== undefined && (
            <p>
                <strong>Shipping Charges:</strong>{" "}
                {product.shippingCharges
                    ? new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                    }).format(product.shippingCharges).replace(/\.00$/, "")
                    : "Free Shipping"}
            </p>
        )}

        {product?.handlingTime && (
            <p>
                <strong>Handling Time:</strong>{" "}
                {product.handlingTime}
            </p>
        )}

        {product?.estimatedDelivery && (
            <p>
                <strong>Estimated Delivery:</strong>{" "}
                {product.estimatedDelivery}
            </p>
        )}

        {product?.giftWrapping !== undefined && (
            <>
                <hr />
                <h6><strong>Gift Wrapping</strong></h6>
                <p>
                    <strong>Available:</strong>{" "}
                    {product.giftWrapping ? "Yes" : "No"}
                </p>

                {product.giftWrapping && product?.giftWrappingCostAmount !== undefined && (
                    <p>
                        <strong>Gift Wrap Cost:</strong>{" "}
                        {product.giftWrappingCostAmount
                            ? new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                            }).format(product.giftWrappingCostAmount).replace(/\.00$/, "")
                            : "Free"}
                    </p>
                )}
            </>
        )}

        {product?.insuranceCoverage !== undefined && (
            <>
                <hr />
                <p>
                    <strong>Insurance Coverage:</strong>{" "}
                    {product.insuranceCoverage ? "Included" : "Not Included"}
                </p>
            </>
        )}

    </div>
)}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ArtistProductFetchView;
