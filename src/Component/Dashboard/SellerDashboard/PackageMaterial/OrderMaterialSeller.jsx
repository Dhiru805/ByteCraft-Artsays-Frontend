import React, { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../ConfirmationDialog";

const OrderMaterial = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrderToDelete, setSelectedOrderToDelete] = useState(null);

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedOrderToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setOrders((prevMat) => prevMat.filter((mat) => mat._id !== id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (mat) => {
    setSelectedOrderToDelete(mat);
    setIsDeleteDialogOpen(true);
  };

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await getAPI(`/api/package-material/${userId}`);

      if (res.hasError) {
        console.error("Error fetching orders:", res.message);
        setOrders([]);
        return;
      }

      const ordersArray = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];

      setOrders(ordersArray);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

    useEffect(() => {
      fetchOrders();
    }, []);

    // Filter based on search term
    const filteredItems = orders.filter((mat) => {
    const names = [
      mat.material?.materialName?.materialName,
      mat.stamp?.materialStamp,
      mat.stickers?.materialStickers,
      mat.vouchers?.materialVouchers,
      mat.card?.materialCard,
    ];
    return names.some(
      (name) =>
        name && name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredItems.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedOrders = filteredItems.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const getOrderName = (order) => {
    if (order.material?.materialName?.materialName)
      return order.material.materialName.materialName;
    if (order.stamp?.materialStamp) return order.stamp.materialStamp;
    if (order.stickers?.materialStickers) return order.stickers.materialStickers;
    if (order.vouchers?.materialVouchers) return order.vouchers.materialVouchers;
    if (order.card?.materialCard) return order.card.materialCard;
    return "-";
  };

  const getOrderImage = (order) => {
    if (order.material?.materialName?.materialNameImage)
      return `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${order.material.materialName.materialNameImage.replace(
        /\\/g,
        "/"
      )}`;
    if (order.stamp?.materialStampImage)
      return `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${order.stamp.materialStampImage.replace(
        /\\/g,
        "/"
      )}`;
    if (order.stickers?.materialStickersImage)
      return `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${order.stickers.materialStickersImage.replace(
        /\\/g,
        "/"
      )}`;
    if (order.vouchers?.materialVouchersImage)
      return `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${order.vouchers.materialVouchersImage.replace(
        /\\/g,
        "/"
      )}`;
    if (order.card?.materialCardImage)
      return `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${order.card.materialCardImage.replace(
        /\\/g,
        "/"
      )}`;
    return "/placeholder.jpg";
  };

  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Order</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <span
                    onClick={() => navigate("/seller/dashboard")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-dashboard"></i>
                  </span>
                </li>
                <li className="breadcrumb-item">Packaging Material Order</li>
              </ul>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/artist/packaging-material/create`)}
                >
                  <i className="fa fa-plus"></i> Create Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <label className="mr-2">Show</label>
                  <select
                    className="form-control form-control-sm"
                    value={productsPerPage}
                    onChange={handleProductsPerPageChange}
                    style={{ width: "70px" }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label className="ml-2">entries</label>
                </div>

                <div>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th>OrderId</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((mat, index) => (
                          <tr key={mat._id}>
                            <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                            <td>
                              <img
                                src={getOrderImage(mat)}
                                className="rounded-circle"
                                alt={getOrderName(mat)}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                              <span>{getOrderName(mat)}</span>
                            </td>
                            <td>{mat.quantity}</td>
                            <td>{mat.totalPrice}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${
                                  mat.status === "Pending"
                                    ? "btn-outline-warning"
                                    : mat.status === "Approved"
                                    ? "btn-outline-success"
                                    : mat.status === "Work in Progress"
                                    ? "btn-outline-info"
                                    : mat.status === "Ready for Transit"
                                    ? "btn-outline-primary"
                                    : mat.status === "In-Transit"
                                    ? "btn-outline-secondary"
                                    : mat.status === "Delivered"
                                    ? "btn-outline-success"
                                    : "btn-outline-danger"
                                }`}
                              >
                                {mat.status}
                              </button>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm mr-2"
                                title="View"
                                onClick={() =>
                                  navigate(`/seller/packaging-material/view/${mat._id}`)
                                }
                              >
                                <i className="fa fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="d-flex justify-content-between mt-4">
                  <span>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredItems.length)} of{" "}
                    {filteredItems.length} entries
                  </span>

                  <ul className="pagination">
                    <li
                      className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                      onClick={handlePrevious}
                    >
                      <button className="page-link" onClick={handlePrevious}>
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""}`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <button className="page-link">{pageNumber}</button>
                        </li>
                      )
                    )}

                    <li
                      className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      onClick={handleNext}
                    >
                      <button className="page-link" onClick={handleNext}>
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="sellerOrder"
          id={selectedOrderToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </>
  );
};

export default OrderMaterial;
