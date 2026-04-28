import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/axiosConfig";
import ConfirmationDialog from "../../ConfirmationDialog";
import ProductRequestSkeleton from "../../../Skeleton/artist/ProductRequestSkeleton";

const AgreementTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agreements, setAgreements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgreements = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return toast.error("User ID missing");

      const response = await axiosInstance.get("/api/getArtistSellerAgreements");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setAgreements(data);
    } catch (error) {
      console.error("Error fetching agreements:", error);
      toast.error(error.response?.data?.message || "Failed to fetch agreements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  useEffect(() => {
    if (location.state?.updatedAgreement) {
      const updated = location.state.updatedAgreement;
      setAgreements((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/deleteArtistSellerAgreement/${id}`);
      setAgreements((prev) => prev.filter((a) => a._id !== id));
      toast.success("Agreement deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete agreement.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedToDelete(null);
    }
  };

  const openDeleteDialog = (agreement) => {
    setSelectedToDelete(agreement);
    setIsDeleteDialogOpen(true);
  };

  const filteredAgreements = agreements.filter(
    (a) =>
      (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.status && a.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAgreements.length / itemsPerPage);
  const displayedAgreements = filteredAgreements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Artist/Seller Agreement</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Artist/Seller Agreement</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={() =>
                  navigate("/super-admin/artist-seller-agreement/create")
                }
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
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
                  className="form-control form-control-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ minWidth: "70px" }}
                >
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
              <div className="table-responsive d-flex justify-content-center">
                <table
                  className="table table-hover text-center mx-auto"
                  style={{ width: "80%" }}
                >
                  <thead className="thead-dark">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "30%" }}>Title</th>
                      <th style={{ width: "20%" }}>Status</th>
                      <th style={{ width: "25%", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedAgreements.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      displayedAgreements.map((agreement, index) => (
                        <tr key={agreement._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{agreement.title || "-"}</td>
                          <td>{agreement.status || "-"}</td>
                          <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  "/super-admin/artist-seller-agreement/update",
                                  { state: { agreement } }
                                )
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(agreement)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredAgreements.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredAgreements.length)}{" "}
                  of {filteredAgreements.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
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
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="agreement"
          id={selectedToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default AgreementTable;
