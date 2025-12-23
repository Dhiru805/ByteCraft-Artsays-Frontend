import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import patchAPI from "../../../../../api/patchAPI";
import { useNavigate } from "react-router-dom";
import useUserType from "../../../urlconfig";
import { jwtDecode } from "jwt-decode";
import PickupRequestModal from "../../../DelhiveryPickupRequestModal/PickupRequestModal";
import { toast } from "react-toastify";

const ProductRequest = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupContext, setPickupContext] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const navigate = useNavigate();
  const userType = useUserType();
  const [userId, setUserId] = useState("");

  //     const handlePickupRequest = (item) => {
  //     setPickupContext({
  //         productId: item.productId,
  //         orderId: item.orderId,
  //         transactionId: item.transactionId,

  //         productName: item.productName,

  //         buyer: {
  //             id: item.buyerId,
  //             name: item.buyerName,
  //         },

  //         artist: {
  //             id: item.artistId,
  //             name: item.artistName,
  //         },

  //         deliveryAddress: item.deliveryAddress,
  //     });

  //     setShowPickupModal(true);
  // };
  const handlePickupRequest = async (item) => {
    const res = await getAPI(
      `/api/delhivery/pickup/check?productId=${item.productId}&orderId=${item.orderId}&transactionId=${item.transactionId}`,
      {},
      true,
      false
    );

    if (res.data.exists) {
      toast.info("Pickup request already created");
      return;
    }

    setPickupContext({
      productId: item.productId,
      orderId: item.orderId,
      transactionId: item.transactionId,
      productName: item.productName,
      buyer: {
        id: item.buyerId,
        name: item.buyerName,
      },
      artist: {
        id: item.artistId,
        name: item.artistName,
      },
      deliveryAddress: item.deliveryAddress,
    });

    setShowPickupModal(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
        } else {
          console.error("User ID not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  // useEffect(() => {
  //     if (!userId) return;
  //     const fetchProducts = async () => {
  //         try {
  //             const result = await getAPI(`/api/getartistsoldproductbyid/${encodeURIComponent(userId)}`, {}, true, false);
  //             console.log("Full API Response:", result);
  //             console.log("Data Type:", typeof result.data);

  //             if (result && result.data && Array.isArray(result.data)) {
  //                 setProducts(result.data);
  //             } else {
  //                 console.error("API response does not contain a valid array:", result.data);
  //                 setProducts([]); 
  //             }
  //         } catch (error) {
  //             console.error("Error fetching products:", error);
  //             setProducts([]);
  //         }
  //     };

  //     fetchProducts();
  // }, [userId]);
  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         try {
  //             const result = await getAPI(`/api/artist-purchases/${userId}`);

  // console.log("API DATA RECEIVED:", result.data.data);

  //             if (result?.data?.success) {
  //                 setProducts(result.data.data);
  //             } else {
  //                 setProducts([]);
  //             }
  //         } catch (error) {
  //             console.error("Error fetching artist purchased products:", error);
  //             setProducts([]);
  //         }
  //     };

  //     fetchProducts();
  // }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProducts = async () => {
      try {
        const result = await getAPI(
          `/api/artist-purchases/${userId}`,
          {},
          true,
          false
        );

        console.log("Purchased Artist Products Response:", result);

        if (result?.data?.data && Array.isArray(result.data.data)) {
          setProducts(result.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching purchased products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [userId]);

  // const filteredProducts = products.filter(product =>
  //     product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredProducts = products.filter(
    (item) =>
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleImageClick = (product) => {
    const images = [];

    if (product.product) images.push(product.product);

    if (product.otherImages && Array.isArray(product.otherImages)) {
      images.push(...product.otherImages);
    }

    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, currentImages.length - 1)
    );
  };

  const getStatusBtnClass = (status) => {
    switch (status) {
      case "Cancelled":
        return "btn-outline-danger";
      case "Delivered":
        return "btn-outline-success";
      case "Shipped":
        return "btn-outline-warning";
      case "Packed":
        return "btn-outline-primary";
      case "Out for Delivery":
        return "btn-outline-info";
      default:
        return "btn-outline-secondary";
    }
  };

  const handleStatusChange = async (item, newStatus) => {
    try {
      await patchAPI(
        "/api/delhivery/order/item/status",
        {
          orderId: item.orderId,
          productId: item.productId,
          orderStatus: newStatus,
        },
        true,
        true
      );

      toast.success("Order status updated");

      setProducts((prev) =>
        prev.map((p) =>
          p.productId === item.productId && p.orderId === item.orderId
            ? { ...p, orderStatus: newStatus }
            : p
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Product Purchased</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/artist/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Product Purchased</li>
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
                  style={{ minWidth: "70px" }}
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
                <div className="input-group" style={{ maxWidth: "150px" }}>
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
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
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
                      {/* <th>Name</th> */}
                      <th>Product Name</th>
                      <th>Product Price</th>
                      <th>Product Quantity</th>
                      <th>Payment Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                                        {displayedProducts.map((product, index) => {
                                            const productData = product.product || product.resellProduct;
                                            return (
                                                <tr key={product._id}>
                                                    <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                                                 
                                                    <td>{product.artistName || 'N/A'}</td>

                                                    <td>
                                                        {productData ? (
                                                            <>
                                                                <img
                                                                    src={`${BASE_URL}${currentImages[currentImageIndex]}`}
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

                                                               
                                                            </>
                                                        ) : (
                                                            "No Product Data"
                                                        )}
                                                    </td>
                                                    <td>
                                                        {productData
                                                            ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
                                                                .format(product.productPrice).replace(/\.00$/, '')
                                                            : 'N/A'}
                                                    </td>
                                                    <td>{product.totalQuantity ?? 'N/A'}</td>
                                                    <td>{product.paymentMethod || 'N/A'}</td>
                                                    <td>
                                                        <td>{product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                                                    </td>
                                                    <td>
                                                        {productData && (
                                                            <button className="btn btn-sm btn-outline-info mr-2"
                                                                onClick={() => navigate(`/artist/purchase/view`)}>
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody> */}
                  <tbody>
                    {displayedProducts.map(
                      (item, index) => (
                        console.log("PURCHASE ITEM SHAPE:", item),
                        (
                          <tr key={index}>
                            <td>
                              {(currentPage - 1) * productsPerPage + index + 1}
                            </td>

                            {/* <td>{item.artistName || "N/A"}</td> */}

                            <td>
                              <img
                                src={`${BASE_URL}${item.productImage}`}
                                alt=""
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  marginRight: "10px",
                                }}
                              />
                              {item.productName}
                            </td>

                            <td>
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })
                                .format(item.subtotal)
                                .replace(/\.00$/, "")}
                            </td>

                            <td>{item.quantityPurchased}</td>
                            <td>{item.paymentMethod}</td>
                            <td>
                              {new Date(item.purchaseDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </td>
                            {/* <td>
                <button className="btn btn-sm btn-outline-info"
                    onClick={() => navigate(`/artist/product-fetch-view-artist/${item.productId}`)}>
                    <i className="fa fa-eye"></i>
                </button>
            </td> */}
                            <td>
                              <span
                                className={`badge badge-btn ${
                                  item.orderStatus === "Cancelled"
                                    ? "badge-danger"
                                    : item.orderStatus === "Delivered"
                                    ? "badge-success"
                                    : item.orderStatus === "Shipped"
                                    ? "badge-warning"
                                    : item.orderStatus === "Packed"
                                    ? "badge-primary"
                                    : item.orderStatus === "Out for Delivery"
                                    ? "badge-info"
                                    : "badge-secondary"
                                }`}
                                style={{
                                  padding: "3px 6px",
                                  fontSize: "10px",
                                }}
                              >
                                {item.orderStatus}
                              </span>
                            </td>

                            {/* <td>
                              <button
                                className="btn btn-sm btn-outline-info mr-2"
                                onClick={() =>
                                  navigate(
                                    `/artist/product-fetch-view-artist/${item.productId}`
                                  )
                                }
                              >
                                <i className="fa fa-eye"></i>
                              </button>

                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handlePickupRequest(item)}
                              >
                                <i className="fa fa-truck"></i>
                              </button>
                            </td> */}
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <button
                                  className="btn btn-sm btn-outline-info mr-2"
                                  onClick={() =>
                                    navigate(
                                      `/artist/product-fetch-view-artist/${item.productId}`
                                    )
                                  }
                                >
                                  <i className="fa fa-eye"></i>
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-success"
                                  disabled={["Cancelled", "Delivered"].includes(
                                    item.orderStatus
                                  )}
                                  onClick={() => handlePickupRequest(item)}
                                >
                                  <i className="fa fa-truck"></i>
                                </button>

                                <div className="dropdown ml-2">
                                  <button
                                    className={`btn btn-sm rounded-circle ${getStatusBtnClass(
                                      item.orderStatus
                                    )}`}
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      padding: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    disabled={item.orderStatus === "Cancelled"}
                                    data-toggle="dropdown"
                                    title={item.orderStatus}
                                  >
                                    <i className="fa fa-chevron-down"></i>
                                  </button>

                                  <div className="dropdown-menu ">
                                    {[
                                      "Ordered",
                                      "Packed",
                                      "Shipped",
                                      "Out for Delivery",
                                      "Delivered",
                                      "Cancelled",
                                    ].map((status) => (
                                      <button
                                        key={status}
                                        className="dropdown-item"
                                        disabled={item.orderStatus === status}
                                        onClick={() =>
                                          handleStatusChange(item, status)
                                        }
                                      >
                                        {status}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * productsPerPage,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
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
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                            <li
                              key={pageNumber}
                              className={`paginate_button page-item ${
                                currentPage === pageNumber ? "active" : ""
                              }`}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              <button className="page-link">
                                {pageNumber}
                              </button>
                            </li>
                          </React.Fragment>
                        );
                      }

                      return (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <button className="page-link">{pageNumber}</button>
                        </li>
                      );
                    })}

                  <li
                    className={`paginate_button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
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
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              height: "50%",
              backgroundColor: "#111",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Left Arrow */}
            <button
              onClick={goToPreviousImage}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "2rem",
                color: currentImageIndex === 0 ? "#666" : "#fff",
                background: "Black",
                border: "none",
                cursor: currentImageIndex === 0 ? "not-allowed" : "pointer",
                zIndex: 2,
              }}
              disabled={currentImageIndex === 0}
            >
              &#10094;
            </button>

            {/* Image */}
            <img
              src={`${BASE_URL}${currentImages[currentImageIndex]}`}
              alt="Popup"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            {/* Right Arrow */}
            <button
              onClick={goToNextImage}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "2rem",
                color:
                  currentImageIndex === currentImages.length - 1
                    ? "#666"
                    : "#fff",
                background: "Black",
                border: "none",
                cursor:
                  currentImageIndex === currentImages.length - 1
                    ? "not-allowed"
                    : "pointer",
                zIndex: 2,
              }}
              disabled={currentImageIndex === currentImages.length - 1}
            >
              &#10095;
            </button>
          </div>
        </div>
      )}
      {showPickupModal && pickupContext && (
        <PickupRequestModal
          isOpen={showPickupModal}
          onClose={() => {
            setShowPickupModal(false);
            setPickupContext(null);
          }}
          productId={pickupContext.productId}
          orderId={pickupContext.orderId}
          transactionId={pickupContext.transactionId}
          productName={pickupContext.productName}
          buyer={pickupContext.buyer}
          artist={pickupContext.artist}
          deliveryAddress={pickupContext.deliveryAddress}
        />
      )}
    </div>
  );
};

export default ProductRequest;
