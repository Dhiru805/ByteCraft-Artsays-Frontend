import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [refreshData, setRefreshData] = useState(false);

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

 const fetchOrders = async () => {
  try {
    const [resUser, resSeller] = await Promise.all([
      getAPI(`/api/package-material/`),
      getAPI(`/api/package-material/seller/order/`)
    ]);

    if (resUser.hasError || resSeller.hasError) {
      console.error("Error fetching orders:", resUser.message || resSeller.message);
      setOrders([]);
      return;
    }

    const userData = (Array.isArray(resUser.data.data) ? resUser.data.data : [resUser.data.data])
      .map(order => ({ ...order, source: "Artist" }));

    const sellerData = (Array.isArray(resSeller.data.data) ? resSeller.data.data : [resSeller.data.data])
      .map(order => ({ ...order, source: "Seller" }));

    // Deduplicate by _id
    const allOrders = [...userData, ...sellerData];
    const uniqueOrders = [];
    const seen = new Set();

    for (const order of allOrders) {
      if (!seen.has(order._id)) {
        uniqueOrders.push(order);
        seen.add(order._id);
      }
    }
    setOrders(uniqueOrders);

  } catch (error) {
    console.error("Failed to fetch orders:", error);
    setOrders([]);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredItems = orders.filter((mat) =>
    mat.material?.materialName?.materialName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / productsPerPage);

  const handleStatusChange = async (e, id) => {
 const newStatus = e.target.value;
  const originalStatus = orders.find((order) => order._id === id)?.status;
  const selectElement = e.target; 

  try {
    const res = await putAPI(`/api/package-material/order/status/${id}`, { status: newStatus });
    console.log("Artist data", res); 

    if (res.data.success || res.data.data.success) { 
      toast.success("Status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } else {
      toast.error(`Failed to update: ${res.message || 'Unknown error'}`);
      selectElement.value = originalStatus; 
    }
  } catch (error) {
    console.error("Error updating status:", error);
    selectElement.value = originalStatus; 
  }
};

const handleChange = async (e, id) => {
  const newStatus = e.target.value;
  const originalStatus = orders.find((order) => order._id === id)?.status;
  const selectElement = e.target; 
  try {
    const res = await putAPI(`/api/package-material/seller/order/status/${id}`, { status: newStatus });
    console.log("Seller data", res); 

    if (res.data.success || res.data.data.success) { 
      toast.success("Status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } else {
      toast.error(`Failed to update: ${res.message || 'Unknown error'}`);
      selectElement.value = originalStatus; 
    }
  } catch (error) {
    console.error("Error updating status:", error);
    selectElement.value = originalStatus;
  }
}

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
                    onClick={() => navigate("/super-admin/dashboard")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-dashboard"></i>
                  </span>
                </li>
                <li className="breadcrumb-item" onClick={() => navigate("/super-admin/packaging-material/order")}>Packaging Material Order</li>
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
                    <thead className="thead-dark text-nowrap">
                      <tr>
                        <th>OrderId</th>
                        <th>username</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter((mat) =>
                        mat.material?.materialName?.materialName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No data available
                          </td>
                        </tr>
                      ) : (
                        orders
                          .filter((mat) =>
                            mat.material?.materialName?.materialName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((mat, index) => (
                            <tr key={mat._id}>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>
                                {mat.deliveryAddress.name +
                                  " " +
                                  mat.deliveryAddress.lastName}
                              </td>
                              <td>
                                <img
                                  src={
                                    mat.material?.materialName
                                      ?.materialNameImage
                                      ? `${
                                          process.env
                                            .REACT_APP_API_URL_FOR_IMAGE
                                        }/${mat.material?.materialName?.materialNameImage.replace(
                                          /\\/g,
                                          "/"
                                        )}`
                                      : "/placeholder.jpg"
                                  }
                                  className="rounded-circle"
                                  alt={mat.materialName}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                  }}
                                />
                                <span>
                                  {mat.material?.materialName?.materialName}
                                </span>
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
                                    navigate(
                                      `/super-admin/packaging-material/order/view/${mat._id}`
                                    )
                                  }
                                >
                                  <i className="fa fa-eye"></i>
                                </button>
                                <select
                                  className="form-control form-control-sm"
                                  style={{
                                    width: "160px",
                                    minWidth: "150px",
                                    display: "inline-block",
                                  }}
                                  value={mat.status}
                                  onChange={(e) => {
                                    handleStatusChange(e, mat._id)
                                    handleChange(e, mat._id)
                                  }}
                                >
                                  <option value="">Select Status</option>
                                  <option value="Work in Progress"> Work in Progress</option>
                                  <option value="Ready for Transit">Ready for Transit </option>
                                  <option value="In-Transit">In-Transit</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </td>
                            </tr>
                          ))
                      )} 
                    </tbody>
                  </table>
                </div>

                <div className="pagination d-flex justify-content-between mt-4">
                  <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                    Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * productsPerPage,
                      filteredItems.length
                    )}{" "}
                    of {filteredItems.length} entries
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
      </div>
    </>
  );
};

export default Order;
