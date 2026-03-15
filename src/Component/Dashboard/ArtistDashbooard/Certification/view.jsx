import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";
import useUserType from "../../urlconfig";
import { getImageUrl } from '../../../../utils/getImageUrl';

function ViewCertification() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userType = useUserType();
  const BASE_URL = getImageUrl(null);
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await getAPI(`/api/get-certification/${id}`, {}, true);
        if (!response.hasError && response.data.data) {
          setCertification(response.data.data);
        } else {
          toast.error("Failed to fetch certification details.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching certification details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCertification();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: "badge badge-warning",
      Paid: "badge badge-success",
      Failed: "badge badge-danger",
      Completed: "badge badge-info",
    };
    return statusClasses[status] || "badge badge-secondary";
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!certification) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">Certification not found.</div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/${userType}/certification`)}
        >
          Back to Certifications
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Certification Details</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate(`/${userType}/dashboard`)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate(`/${userType}/certification`)}
                  style={{ cursor: "pointer" }}
                >
                  Certification
                </span>
              </li>
              <li className="breadcrumb-item active">View</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 text-right">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/${userType}/certification`)}
            >
              <i className="fa fa-arrow-left mr-2"></i>Back
            </button>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header">
              <h2>Certification Information</h2>
            </div>
            <div className="body">
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <img
                    src={
                      certification.productId?.mainImage
                        ? getImageUrl(certification.productId.mainImage)
                        : DEFAULT_PROFILE_IMAGE
                    }
                    alt={certification.productId?.productName || "Product"}
                    className="img-fluid rounded"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: "30%" }}>Status</th>
                        <td>
                          <span className={getStatusBadge(certification.status)}>
                            {certification.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Product Name</th>
                        <td>{certification.productId?.productName || "N/A"}</td>
                      </tr>
                      <tr>
                        <th>Main Category</th>
                        <td>
                          {certification.mainCategoryId?.mainCategoryName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <th>Certification Name</th>
                        <td>
                          {certification.certificationId?.certificationName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <th>Certification Provider</th>
                        <td>
                          {certification.certificationProvider === "inhouse"
                            ? "In-house Certification"
                            : "Third Party Certification"}
                        </td>
                      </tr>
                      <tr>
                        <th>Estimated Days</th>
                        <td>
                          {certification.certificationId?.estimatedDays ||
                            certification.estimatedDays ||
                            "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <th>Certification Price</th>
                        <td>₹{certification.certificationPrice || "N/A"}</td>
                      </tr>
                        <tr>
                          <th>Order ID</th>
                          <td>{certification.cfOrderId || "N/A"}</td>
                        </tr>
                      <tr>
                        <th>Created At</th>
                        <td>
                          {certification.createdAt
                            ? new Date(certification.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <th>Updated At</th>
                        <td>
                          {certification.updatedAt
                            ? new Date(certification.updatedAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {certification.userId && (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header">
                <h2>User Information</h2>
              </div>
              <div className="body">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th style={{ width: "30%" }}>Name</th>
                      <td>
                        {certification.userId.name} {certification.userId.lastName}
                      </td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{certification.userId.email || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>User Type</th>
                      <td>{certification.userType || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCertification;
