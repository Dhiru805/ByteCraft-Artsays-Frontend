
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewEnquiry = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const enquiry = state?.enquiry;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    category: "",
    message: "",
    createdAt: "",
  });

  useEffect(() => {
    if (!enquiry) {
      toast.error("No enquiry data provided.");
      navigate("/super-admin/enquiry");
    } else {
      setFormData({
        name: enquiry.name || "",
        email: enquiry.email || "",
        contactNumber: enquiry.contactNumber || "",
        category: enquiry.categoryName || "",
        message: enquiry.message || "",
        createdAt: enquiry.createdAt
          ? new Date(enquiry.createdAt).toLocaleString()
          : "",
      });
    }
  }, [enquiry, navigate]);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Enquiry</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/enquiry")}
                  style={{ cursor: "pointer" }}
                >
                  Enquiries
                </span>
              </li>
              <li className="breadcrumb-item active">View Enquiry</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card" >
            <div className="body">
              <form>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input
                      type="text"
                      id="contactNumber"
                      value={formData.contactNumber}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      value={formData.category}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    className="form-control"
                    rows="4"
                    disabled
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Date & Time of Submission</label>
                  <input
                    type="text"
                    value={formData.createdAt}
                    className="form-control"
                    disabled
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnquiry;
