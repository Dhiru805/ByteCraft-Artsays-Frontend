import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";

const ViewInsurance = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const insurance = state?.insurance;

  if (!insurance) {
    return (
      <div className="container-fluid text-center py-5">
        <h3>No insurance data found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-8 col-md-7 col-sm-12">
            <h2>Insurance Details</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/artist/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
                <li className="breadcrumb-item">
                <a href="/artist/insurance">Insurance</a>
              </li>
              <li className="breadcrumb-item">View Insurance</li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-5 col-sm-12 text-right">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              ← Back to List
            </button>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header">
              <h2>Insurance Information</h2>
            </div>

            <div className="body">
              <div className="row">
                {}
                <div className="col-md-6">
                  <h5 className="mt-0">Product & User Details</h5>
                  <hr />

                  <div className="d-flex align-items-center mb-4">
                    <img
                      src={
                        insurance.productId?.mainImage
                          ? `${BASE_URL}${insurance.productId.mainImage}`
                          : DEFAULT_PROFILE_IMAGE
                      }
                      alt="Product"
                      className="rounded mr-3"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />

                    <div>
                      <h5 className="mb-1">
                        {insurance.productId?.productName || "—"}
                      </h5>
                      <p className="mb-1">
                        <strong>Price:</strong> ₹
                        {insurance.productId?.sellingPrice?.toLocaleString(
                          "en-IN"
                        ) || "—"}
                      </p>
                      <small className="text-muted">
                        Category:{" "}
                        {insurance.mainCategoryId?.mainCategoryName || "—"}
                      </small>
                    </div>
                  </div>

                  <p>
                    <strong>User:</strong> {insurance.userId?.name}{" "}
                    {insurance.userId?.lastName || ""}
                  </p>
                </div>

                {}
                <div className="col-md-6">
                  <h5 className="mt-0">Insurance Details</h5>
                  <hr />

                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <th width="160">Plan Name:</th>
                        <td>{insurance.insuranceName || "—"}</td>
                      </tr>
                      <tr>
                        <th>Duration:</th>
                        <td>
                          <span className="badge badge-pill badge-primary">
                            {insurance.duration || "—"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Insurance Price:</th>
                        <td>
                          <strong className="text-success">
                            ₹
                            {insurance.insurancePrice?.toLocaleString(
                              "en-IN"
                            ) || "—"}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <th>Rate:</th>
                        <td>
                          {insurance.percentage}% + {insurance.gst}% GST
                        </td>
                      </tr>
                      <tr>
                        <th>Provider:</th>
                        <td>
                          <span
                            className={`badge badge-pill ${
                              insurance.insuranceProvider === "inhouse"
                                ? "badge-info"
                                : "badge-warning"
                            }`}
                          >
                            {insurance.insuranceProvider === "inhouse"
                              ? "In-house"
                              : "Third Party"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Status:</th>
                        <td>
                          <span
                            className={`badge badge-pill ${
                              insurance.status === "Paid"
                                ? "badge-success"
                                : "badge-danger"
                            }`}
                          >
                            {insurance.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                        <tr>
                          <th>Transaction ID:</th>
                          <td>{insurance.cfOrderId || "—"}</td>
                        </tr>
                      <tr>
                        <th>Date:</th>
                        <td>{formatDate(insurance.createdAt)}</td>
                      </tr>
                     
                    </tbody>
                  </table>
                </div>
              </div>

              {}
              {insurance.cfPaymentData && (
                <>
                  <hr className="my-4" />
                  <h5>Payment Information</h5>

                  <div className="row">
                    <div className="col-md-6">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <th width="160">Transaction ID:</th>
                            <td>
                              {insurance.cfPaymentData.cf_payment_id || insurance.cfPaymentData.easepayid || "—"}
                            </td>
                          </tr>
                          <tr>
                            <th>Transaction Date:</th>
                            <td>{insurance.cfPaymentData.payment_time || insurance.cfPaymentData.addedon || "—"}</td>
                          </tr>
                          <tr>
                            <th>Payment Mode:</th>
                            <td>{ "Online"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="col-md-6">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <th width="160">Amount Paid:</th>
                            <td>
                              <strong>
                                ₹{insurance.cfPaymentData.payment_amount || insurance.cfPaymentData.net_amount_debit}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <th>Status Message:</th>
                            <td className="text-success">
                              {insurance.cfPaymentData.payment_message || insurance.cfPaymentData.error_Message || "—"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInsurance;
