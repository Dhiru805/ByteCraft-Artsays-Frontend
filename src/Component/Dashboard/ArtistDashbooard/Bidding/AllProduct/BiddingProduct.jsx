


import React, { useState, useEffect } from "react";
import { getImageUrl } from '../../../../../utils/getImageUrl';
import getAPI from "../../../../../api/getAPI";
import axiosInstance from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../../ConfirmationDialog"; 

const ArtistBiddingProducts = () => {
  const userId = localStorage.getItem("userId");

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
  try {
    const result = await getAPI(`/api/bidding/products/user/${userId}`, {}, true, false);

    let list = [];   // ✅ declare FIRST

    if (Array.isArray(result)) {
      list = result;
    } else if (Array.isArray(result?.data)) {
      list = result.data;
    } else if (Array.isArray(result?.data?.bids)) {
      list = result.data.bids;
    } else if (Array.isArray(result?.data?.products)) {
      list = result.data.products;
    }

     setProducts([...list].reverse());   // latest first
  } catch (err) {
    console.error("Error fetching products:", err);
    setProducts([]);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteDialog = (product) => {
    setSelectedProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/bidding/products/delete/${id}`);
      toast.success("Bidding product deleted!");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete bidding product.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProductToDelete(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.artworkName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6">
            <h2>Your Bidding Products</h2>
          </div>

          <div className="col-lg-6 text-right">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/artist/bidding-products-table/create")}
            >
              <i className="fa fa-plus mr-2"></i>Add to Bid
            </button>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center">
                <label className="mr-2 mb-0">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={productsPerPage}
                  onChange={(e) => {
                    setProductsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <label className="ml-2 mb-0">entries</label>
              </div>

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
                  }}
                ></i>
              </div>
            </div>

            <div className="body table-responsive">
              <table className="table table-hover text-nowrap">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Artwork</th>
                    <th>Base Price</th>
                    <th>Reserve Price</th>
                    <th>Start</th>
                    <th>End</th>
                    {/* <th>Status</th> */}
                    <th>Edit / Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((item, index) => (
                      <tr key={item._id}>
                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>

                        <td>
                          <img
                            src={getImageUrl(item.product?.mainImage)}
                            className="rounded-circle avatar"
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                              marginRight: "10px",
                            }}
                            alt=""
                          />
                          {item.artworkName}
                        </td>

                        <td>₹{item.basePrice}</td>
                        <td>₹{item.reservePrice}</td>

                        <td>{new Date(item.bidStart).toLocaleString()}</td>
                        <td>{new Date(item.bidEnd).toLocaleString()}</td>

                        {/* <td>
                          <button
                            className={`btn btn-sm ${
                              item.bidProdStatus === "Hot Deal"
                                ? "btn-outline-danger"
                                : item.bidProdStatus === "Upcoming"
                                ? "btn-outline-info"
                                : "btn-outline-warning"
                            }`}
                          >
                            {item.bidProdStatus}
                          </button>
                        </td> */}

                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary mr-1"
                            onClick={() =>
                              navigate(`/artist/bidding-products-table/edit/${item._id}`)
                            }
                          >
                            <i className="fa fa-pencil"></i>
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openDeleteDialog(item)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination d-flex justify-content-between mt-3">
              <span>
                Showing {(currentPage - 1) * productsPerPage + 1}–
                {Math.min(currentPage * productsPerPage, filteredProducts.length)} of{" "}
                {filteredProducts.length} entries
              </span>

              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                  <button className="page-link">Previous</button>
                </li>

                <li className="page-item active">
                  <button className="page-link">{currentPage}</button>
                </li>

                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                >
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

     {isDeleteDialogOpen && (
  <ConfirmationDialog
    onClose={handleDeleteCancel}
    deleteType="addtobid"  
    id={selectedProductToDelete?._id}
    onDeleted={handleDeleteConfirmed}
  />
)}

    </div>
  );
};

export default ArtistBiddingProducts;
