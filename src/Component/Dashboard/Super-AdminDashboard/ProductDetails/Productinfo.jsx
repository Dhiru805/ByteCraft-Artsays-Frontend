import React, { useEffect, useState } from "react";
import getAPI from "../../../../api/getAPI";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useUserType from "../../urlconfig";
import { Link } from "react-router-dom";

function AllProduct() {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = useUserType();

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
      } finally {
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

  if (loading) return <ProductInfoSkeleton />
  return (
    <>
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Product Info</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/allproduct`}>
                  All Product
                </Link>
              </li>
              <li className="breadcrumb-item ">Product Info</li>
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
                        <button
                          className={`nav-link ${activeTab === "artist" ? "active" : ""}`}
                          onClick={() => handleTabChange("artist")}
                        >
                          Owner Details
                        </button>
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
                          {/* <p><strong>Name:</strong> <span style={{ marginLeft: "10px" }}>{product.userId.name} {product.userId.lastName}</span></p>
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
                                                    </p> */}
                          <p>
                            <strong>Name:</strong>
                            <span style={{ marginLeft: "10px" }}>
                              {product.userId?.name || "Unknown"} {product.userId?.lastName || ""}
                            </span>
                          </p>

                          <p>
                            <strong>Email:</strong>
                            <span style={{ marginLeft: "10px" }}>
                              {product.userId?.email || "N/A"}
                            </span>
                          </p>

                          <p>
                            <strong>Website:</strong>
                            <a
                              href={product.userId?.website || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginLeft: "10px", textDecoration: "none", color: "blue" }}
                            >
                              {product.userId?.website || "N/A"}
                            </a>
                          </p>

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default AllProduct;
function ProductInfoSkeleton() {
  return (
    <div className="p-4 animate-pulse">

      {/* Header */}
      <div className="mb-6">
        <div className="h-6 w-40 bg-gray-300 rounded mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-28 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Product Cards List */}
      <div className="space-y-6">

        {[1, 2].map((id) => (
          <div key={id} className="bg-white rounded-xl shadow p-5">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left: Image Preview */}
              <div className="lg:col-span-4">
                <div className="w-[350px] h-[350px] bg-gray-300 rounded"></div>

                <div className="flex flex-wrap mt-4 gap-3">
                  {[1, 2, 3, 4, 5].map((t) => (
                    <div
                      key={t}
                      className="w-[55px] h-[55px] bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="lg:col-span-8">
                <div className="h-6 w-52 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>

                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-28 bg-gray-300 rounded mb-4"></div>

                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>

                <hr className="my-4" />
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6">

              <div className="flex gap-3 border-b">
                <div className="h-8 w-40 bg-gray-200 rounded-t"></div>
                <div className="h-8 w-40 bg-gray-200 rounded-t"></div>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                <div className="space-y-2 mb-3">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
                </div>

                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
