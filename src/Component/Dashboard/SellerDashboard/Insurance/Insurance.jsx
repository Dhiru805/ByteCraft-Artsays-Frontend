import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";

const InsuranceList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showPopup, setShowPopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchInsurances = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      setLoading(true);
      try {
        const response = await getAPI(
          `/api/get-insurancebyId/${userId}`,
          {},
          true,
          false
        );

        if (!response.hasError) {
          setInsurances([...(response.data.data || [])].reverse());
        } else {
          console.error("Error in response:", response.message);
        }
      } catch (error) {
        console.error("Error fetching insurances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  const filteredInsurances = insurances.filter(
    (item) =>
      item.productId?.productName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.insuranceId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInsurances.length / itemsPerPage);
  const displayedInsurances = filteredInsurances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleImageClick = (product) => {
    if (!product) return;
    const images = [product.mainImage, ...(product.otherImages || [])].filter(
      Boolean
    );
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>My Insurances</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/seller/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Insurance</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/seller/insurance/create")}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex align-items-center mb-2 mb-md-0">
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
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>

              <div className="input-group" style={{ maxWidth: "220px" }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search product, user, insurance name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Product</th>
                          <th>Main Category</th>
                          <th>Insurance Plan</th>
                          <th>Duration</th>
                          <th>Price</th>
                          <th>Provider</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedInsurances.length > 0 ? (
                          displayedInsurances.map((item, index) => (
                            <tr key={item._id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>
                                {item.userId?.name}{" "}
                                {item.userId?.lastName || ""}
                              </td>
                              <td>
                                <img
                                  src={
                                    item.productId?.mainImage
                                      ? `${BASE_URL}${item.productId.mainImage}`
                                      : DEFAULT_PROFILE_IMAGE
                                  }
                                  className="rounded-circle"
                                  alt="Product"
                                  onClick={() =>
                                    handleImageClick(item.productId)
                                  }
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                  }}
                                />
                                {item.productId?.productName || "N/A"}
                              </td>
                              <td>
                                {item.mainCategoryId?.mainCategoryName || "N/A"}
                              </td>
                              <td>
                                {item.insuranceName
                                  ? item.insuranceName.split(/ - /)[0].trim()
                                  : "N/A"}
                              </td>
                              <td>{item.duration || "N/A"}</td>
                              <td>₹{item.insurancePrice || "N/A"}</td>
                              <td>
                                <span className="badge badge-pill badge-info">
                                  {item.insuranceProvider === "inhouse"
                                    ? "In-house"
                                    : "Third Party"}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() =>
                                    navigate("/seller/insurance/view", {
                                      state: { insurance: item },
                                    })
                                  }
                                >
                                  <i className="fa fa-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center py-4">
                              No insurance records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {}
                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                    <div>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredInsurances.length
                      )}{" "}
                      of {filteredInsurances.length} entries
                    </div>

                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={handlePrevious}
                      >
                        <button className="page-link">Previous</button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            <button className="page-link">{page}</button>
                          </li>
                        )
                      )}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                        onClick={handleNext}
                      >
                        <button className="page-link">Next</button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "90%",
              maxWidth: "900px",
              height: "80vh",
              background: "#111",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src={`${BASE_URL}${currentImages[currentImageIndex] || ""}`}
              alt="Product preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceList;
