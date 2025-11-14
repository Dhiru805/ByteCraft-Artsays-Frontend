import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import putAPI from "../../../../../api/putAPI";
import deleteAPI from "../../../../../api/deleteAPI";
import { toast } from "react-toastify";

const BiddingTable = () => {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    validityPeriod: "",
    productUploadLimit: "",
    basePriceRange: "",
    bidVisibility: "Public",
    biddingAnalytics: "None",
    addonAccess: [],
    supportPriority: "Standard",
    refundPolicy: "No refunds",
    earlyRenewalBonus: "",
    customBidTimeControl: "",
    exclusiveAuctionsAccess: false,
    dashboardFeatures: "",
    pricing: "",
  });

  const fetchPassTypes = async () => {
    try {
      const res = await getAPI("/api/bidding/passes", {}, true);
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setPasses(list);
    } catch (e) {
      setPasses([]);
    }
  };

  useEffect(() => {
    fetchPassTypes();
  }, []);

  const filteredPasses = passes.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPasses.length / itemsPerPage) || 1;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const paginatedPasses = filteredPasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "exclusiveAuctionsAccess") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "checkbox") {
      const addon = value;
      setFormData((prev) => {
        const exists = prev.addonAccess.includes(addon);
        return {
          ...prev,
          addonAccess: exists
            ? prev.addonAccess.filter((a) => a !== addon)
            : [...prev.addonAccess, addon],
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      validityPeriod: "",
      productUploadLimit: "",
      basePriceRange: "",
      bidVisibility: "Public",
      biddingAnalytics: "None",
      addonAccess: [],
      supportPriority: "Standard",
      refundPolicy: "No refunds",
      earlyRenewalBonus: "",
      customBidTimeControl: "",
      exclusiveAuctionsAccess: false,
      dashboardFeatures: "",
      pricing: "",
    });
  };

  const createPassType = async (e) => {
    e.preventDefault();
    try {
      const res = await postAPI("/api/bidding/passes", formData, {}, true);
      if (!res?.hasError) {
        toast.success("Pass created");
        resetForm();
        fetchPassTypes();
      } else {
        toast.error(res?.message || "Failed to create pass");
      }
    } catch (e) {
      toast.error("Failed to create pass");
    }
  };

  const togglePassActive = async (passId, active) => {
    try {
      const res = await putAPI(
        `/api/bidding/passes/${passId}/status`,
        { active: !active },
        {},
        true
      );
      if (!res?.hasError) {
        toast.success("Status updated");
        fetchPassTypes();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const deletePass = async (passId) => {
    try {
      const res = await deleteAPI(`/api/bidding/passes/${passId}`, {}, true);
      if (!res?.hasError) {
        toast.success("Pass deleted");
        fetchPassTypes();
      } else {
        toast.error(res?.message || "Failed to delete");
      }
    } catch (e) {
      toast.error("Failed to delete");
    }
  };
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Bidding Pass Types</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding Pass</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-secondary ml-3"
              onClick={() => navigate("/super-admin/bidding/pass-table/create")}
            >
              {" "}
              Create Pass
              <i className="fa fa-plus"></i>
            </button>
          </div>

          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="w-100 w-md-auto d-flex align-items-center">
                <div className="input-group" style={{ maxWidth: "260px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search Pass Name"
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
                <table className="table table-hover text-nowrap">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Pass Name</th>
                      <th>Validity</th>
                      <th>Upload Limit</th>
                      <th>Base Price Range</th>
                      <th>Visibility</th>
                      <th>Support</th>
                      <th>Pricing</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPasses.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No passes
                        </td>
                      </tr>
                    ) : (
                      paginatedPasses.map((pass, idx) => (
                        <tr key={pass._id || idx}>
                          <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                          <td>{pass.name}</td>
                          <td>{pass.validityPeriod} days</td>
                          <td>{pass.productUploadLimit}</td>
                          <td>{pass.basePriceRange}</td>
                          <td>{pass.bidVisibility}</td>
                          <td>{pass.supportPriority}</td>
                          <td>₹{pass.pricing}</td>
                          <td>
                            <span
                              className={`badge ${
                                pass.active
                                  ? "badge-success"
                                  : "badge-secondary"
                              }`}
                            >
                              {pass.active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              className={`btn btn-sm ${
                                pass.active ? "btn-warning" : "btn-success"
                              } mr-2`}
                              onClick={() =>
                                togglePassActive(pass._id, pass.active)
                              }
                            >
                              {pass.active ? "Deactivate" : "Activate"}
                            </button>
                            {/* <button
                              className={`btn btn-sm ${
                                pass.active ? "btn-warning" : "btn-success"
                              } mr-2`}
                              onClick={() =>
                                togglePassActive(pass._id, pass.active)
                              }
                            >
                              {pass.active ? (
                                <i className="bi bi-slash-circle-fill text-danger"></i> 
                              ) : (
                                <i className="bi bi-check-circle-fill"></i> 
                              )}
                            </button> */}

                            <button
                              className="btn btn-sm btn-primary mr-2"
                              onClick={() =>
                                navigate(
                                  `/super-admin/bidding/pass-table/edit/${pass._id}`
                                )
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-danger mr-2"
                              onClick={() => deletePass(pass._id)}
                            >
                              <i className="bi bi-trash"></i>
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredPasses.length)}{" "}
                  of {filteredPasses.length} entries
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
  );
};

export default BiddingTable;
