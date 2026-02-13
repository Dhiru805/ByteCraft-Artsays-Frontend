import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import { useParams } from "react-router-dom";
import useUserType from "../../../urlconfig";
import { Link } from "react-router-dom";
import ProductRequestSkeleton from "../../../../../Component/Skeleton/artist/ProductRequestSkeleton"
function AllProduct() {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const userType = useUserType();

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const result = await getAPI(
          `/api/getproduct/${productId}`,
          {},
          true,
          false
        );
        if (result.data && result.data.data) {
          const productData = Array.isArray(result.data.data)
            ? result.data.data
            : [result.data.data];
          setProducts(productData);

          const initialSelectedImages = {};
          productData.forEach((product) => {
            initialSelectedImages[product._id] = `${BASE_URL}${product.mainImage}`;
          });
          setSelectedImages(initialSelectedImages);
        } else {
          console.error("Unexpected API response:", result);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, BASE_URL]);

  const handleImageClick = (productId, image) => {
    setSelectedImages((prevState) => ({
      ...prevState,
      [productId]: `${BASE_URL}${image}`,
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

  if(loading) return  <ProductRequestSkeleton/>
  return (
    <>
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Sold Product Details</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/super-admin/dashboard">
                  <i className="fa fa-dashboard"></i>
                </Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/super-admin/artist/sold-product">
                  Artist Sold Product
                </Link>
              </li>
              <li className="breadcrumb-item ">Sold Product Details</li>
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
                          src={selectedImages[product._id] || `${BASE_URL}${product.mainImage}`}
                          className="img-fluid"
                          style={{
                            width: "350px",
                            height: "350px",
                            objectFit: "cover",
                          }}
                          alt="Product Preview"
                            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='350'%3E%3Crect width='350' height='350' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16'%3EImage Not Found%3C/text%3E%3C/svg%3E"; }}
                        />
                      </div>
                    </div>

                    {/* Small Images */}
                    <div className="d-flex flex-wrap justify-content-start">
                      {[
                        product.mainImage,
                        ...product.otherImages.slice(0, 4),
                      ].map((image, imgIndex) => (
                        <div key={imgIndex} style={{ margin: "5px" }}>
                          <img
                            src={`${BASE_URL}${image}`}
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
                              onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55'%3E%3Crect width='55' height='55' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='10'%3ENA%3C/text%3E%3C/svg%3E"; }}
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
                    <h3 className="product-title mb-0">
                      {product.productName}
                    </h3>
                    <hr />
                    <h5 className="price m-t-0">
                      Price:{" "}
                      <span className="text-warning">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })
                          .format(product.price)
                          .replace(/\.00$/, "")}
                      </span>
                    </h5>
                    <h5 className="category m-t-0">
                      Category:{" "}
                      <span className="text-info">{product.category}</span>
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
                          className={`nav-link ${
                            activeTab === "description" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("description")}
                        >
                          Product Description
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "artist" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("artist")}
                        >
                          Artist Details
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content mt-3">
                      {activeTab === "description" && (
                        <div className="tab-pane active">
                          <p
                            className="product-description"
                            style={{
                              maxHeight: expanded[product._id]
                                ? "none"
                                : "60px",
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
                              cursor: "pointer",
                            }}
                            onClick={() => toggleDescription(product._id)}
                          >
                            {expanded[product._id] ? "Show Less" : "Read More"}
                          </button>
                        </div>
                      )}

                      {activeTab === "artist" && (
                        <div className="tab-pane active">
                          <p>
                            <strong>Name:</strong>{" "}
                            <span style={{ marginLeft: "10px" }}>
                              {product.userId.name} {product.userId.lastName}
                            </span>
                          </p>
                          <p>
                            <strong>Email:</strong>{" "}
                            <span style={{ marginLeft: "10px" }}>
                              {product.userId.email}
                            </span>
                          </p>
                          <p>
                            <strong>Website:</strong>
                            <a
                              href={product.userId.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                marginLeft: "10px",
                                textDecoration: "none",
                                color: "blue",
                              }}
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
