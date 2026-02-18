import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
// import postAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";



const CreateArtistModal = ({ onClose, fetchArtists }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailOrPhone: "",
    artistName: "", 
    password: "",
    confirmPassword: "",
    userType: "Artist",
    role: "artist", 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    
 
    const requiredFields = ["firstName", "lastName", "artistName", "password", "confirmPassword", "emailOrPhone"];
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
      fetchArtists();
      onClose();
    } catch (error) {
      console.error("Error response:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Artist</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", overflowX: "hidden", padding: "10px" }}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
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
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label>Artist Name</label>
                      <input type="text" className="form-control" name="artistName" value={formData.artistName} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label>Password</label>
                      <div className="position-relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="form-control" 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          style={{ paddingRight: "40px" }}
                          required 
                        />
                        <span 
                          className="position-absolute" 
                          style={{ 
                            right: "15px", 
                            top: "50%", 
                            transform: "translateY(-50%)", 
                            cursor: "pointer",
                            zIndex: 10,
                            color: "#666"
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <div className="position-relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          className="form-control" 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          style={{ paddingRight: "40px" }}
                          required 
                        />
                        <span 
                          className="position-absolute" 
                          style={{ 
                            right: "15px", 
                            top: "50%", 
                            transform: "translateY(-50%)", 
                            cursor: "pointer",
                            zIndex: 10,
                            color: "#666"
                          }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer px-0 pb-0 pt-3">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArtistModal;
