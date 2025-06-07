import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import postAPI from "../../../../api/postAPI";

const CreateBuyerModal = ({ onClose, fetchBuyers }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    userType: "Buyer",
    role: "buyer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const normalizePhone = (phone) => {
    return `+91${phone.replace(/^\+91/, '')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["firstName", "lastName", "password", "confirmPassword", "emailOrPhone"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field}`);
        return;
      }
    }

    const isEmail = isValidEmail(formData.emailOrPhone);
    const isPhone = isValidPhone(formData.emailOrPhone);

    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email or phone number (10 digits with optional +91)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        ...formData,
        email: isEmail ? formData.emailOrPhone : undefined,
        phone: isPhone ? normalizePhone(formData.emailOrPhone) : undefined
      };
      delete payload.emailOrPhone;

      const response = await postAPI("/auth/createuser", payload);
      toast.success(response.data.message);
      fetchBuyers();
      onClose();
    } catch (error) {
      console.error("Error response:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Buyer</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email or Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Email or phone "
                  required
                />
              </div>
              <div className="form-group position-relative">
                <label>Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-group position-relative">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBuyerModal;
