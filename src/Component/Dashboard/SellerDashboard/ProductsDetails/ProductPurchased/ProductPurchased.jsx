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
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupContext, setPickupContext] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const navigate = useNavigate();
  const userType = useUserType();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
          console.log("Seller ID:", decodedToken.userId);
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
  //             const result = await getAPI(`/api/getsoldproductbyid/${encodeURIComponent(userId)}`, {}, true, false);
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

  useEffect(() => {
    if (!userId) return;

    const fetchPurchasedProducts = async () => {
      try {
        console.log("Fetching seller purchased products for:", userId);

        const res = await getAPI(
          `/api/seller-purchased-products/${encodeURIComponent(userId)}`,
          {},
          true,
          false
        );

        console.log("Seller Purchased Products Response:", res);

        if (res?.data?.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else {
          console.error(" Invalid API response format:", res);
          setProducts([]);
        }
      } catch (error) {
        console.error(" Error fetching seller purchased products:", error);
        setProducts([]);
      }
    };

    fetchPurchasedProducts();
  }, [userId]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePickupRequest = async (item) => {
    try {
      const res = await getAPI(
        `/api/delhivery/pickup/check?productId=${item.productId}&orderId=${item.orderId}&transactionId=${item.transactionId}`,
        {},
        true,
        false
      );

      if (res?.data?.exists) {
        toast.info("Pickup already scheduled for this warehouse");
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
          id: userId,
          name: item.artistName || "Seller",
        },

        deliveryAddress: item.deliveryAddress,
      });

      setShowPickupModal(true);
    } catch (err) {
      toast.error("Failed to check pickup status");
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
                  onClick={() => navigate("/seller/dashboard")}
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
                  <option value="5">5</option>
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
                      <th>Name</th>
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
                                                                    src={product.product ? `${BASE_URL}${product.product}` : 'default-image-url.jpg'}
                                                                    className="rounded-circle avatar"
                                                                    alt=""
                                                                    style={{
                                                                        width: '30px',
                                                                        height: '30px',
                                                                        objectFit: 'cover',
                                                                        marginRight: '10px'
                                                                    }}
                                                                />
                                                                {product.productName || 'N/A'}
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
                                                                onClick={() => navigate(`/${userType}/Dashboard/productpurchased/productview/${product._id}`)}>
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody> */}
                  <tbody>
                    {displayedProducts.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {(currentPage - 1) * productsPerPage + index + 1}
                        </td>

                        {/* Buyer Name */}
                        <td>{item.buyerName || "Unknown"}</td>

                        {/* Product Name & Image */}
                        <td>
                          <img
                            src={
                              item.productImage
                                ? `${BASE_URL}${item.productImage}`
                                : "/default.png"
                            }
                            className="rounded-circle avatar"
                            alt=""
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                              marginRight: "10px",
                            }}
                          />
                          {item.productName}
                        </td>

                        {/* Product Price */}
                        <td>
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })
                            .format(item.subtotal)
                            .replace(/\.00$/, "")}
                        </td>

                        {/* Quantity */}
                        <td>{item.quantityPurchased}</td>

                        {/* Payment Method */}
                        <td>{item.paymentMethod}</td>

                        {/* Purchase Date */}
                        <td>
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </td>

                        {/* View Button */}
                        {/* <td>
                <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => navigate(`/seller/product-fetch-view-seller/${item.productId}`)}
                >
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

                        <td>
                          <div className="d-flex align-items-center gap-3 mb-2">
                            <button
                              className="btn btn-sm btn-outline-info mr-2"
                              onClick={() =>
                                navigate(
                                  `/seller/product-fetch-view-seller/${item.productId}`
                                )
                              }
                            >
                              <i className="fa fa-eye"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-success"
                              // disabled={item.orderStatus === "Cancelled"}
                              disabled={["Cancelled", "Delivered"].includes(
                                item.orderStatus
                              )}
                              onClick={() => handlePickupRequest(item)}
                            >
                              <i className="fa fa-truck"></i>
                            </button>
                            {/* <select
                            className="form-control form-control-sm mb-1"
                            value={item.orderStatus}
                            disabled={item.orderStatus === "Cancelled"}
                            onChange={(e) =>
                              handleStatusChange(item, e.target.value)
                            }
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select> */}
                            <div className="dropdown ml-2">
                              <button
                                className={`btn btn-sm rounded-circle ${getStatusBtnClass(
                                  item.orderStatus
                                )}`}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  padding: 0,
                                }}
                                disabled={item.orderStatus === "Cancelled"}
                                title={item.orderStatus}
                                data-toggle="dropdown"
                              >
                                <i className="fa fa-chevron-down"></i>
                              </button>

                              <div className="dropdown-menu">
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                  {Math.min(currentPage * productsPerPage, products.length)} of{" "}
                  {products.length} entries
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
