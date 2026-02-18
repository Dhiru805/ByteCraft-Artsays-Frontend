import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";

const AdminModal = ({ onClose, fetchAdmins, mode = "create", adminData = null }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Super-Admin",
    role: "super-admin",
    userrole: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAPI("/api/get-all-role");
        setRoleOptions(response.data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && adminData) {
      setFormData({
        firstName: adminData.name || "",
        lastName: adminData.lastName || "",
        email: adminData.email || "",
        password: "", // Password not usually pre-filled for edit
        confirmPassword: "",
        userType: adminData.userType || "Super-Admin",
        role: adminData.role || "super-admin",
        userrole: adminData.userrole || "",
      });
    }
  }, [mode, adminData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;

    setLoading(true);
    
    // Check required fields for create mode
    if (mode === "create") {
      for (const key in formData) {
        if (!formData[key]) {
          toast.error("Please fill in all fields");
          setLoading(false);
          return;
        }
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }
    } else if (mode === "edit") {
        // For edit, maybe password is optional
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.userrole) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
        }
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (mode === "create") {
        response = await postAPI("/auth/createuser", formData);
      } else {
        // Handle edit mode
        const updateData = { ...formData };
        if (!updateData.password) {
            delete updateData.password;
            delete updateData.confirmPassword;
        }
        response = await putAPI(`/api/users/${adminData._id}`, updateData);
      }
      toast.success(response.data.message || (mode === "create" ? "Admin created successfully" : "Admin updated successfully"));
      fetchAdmins();
      onClose();
    } catch (error) {
      console.error("Error response:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === "create") return "Create Admin";
    if (mode === "edit") return "Edit Admin";
    return "View Admin Details";
  };

  const getSubmitButtonText = () => {
    if (mode === "create") return loading ? "Creating..." : "Create Admin";
    if (mode === "edit") return loading ? "Updating..." : "Update Admin";
    return "";
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light">
            <h5 className="modal-title font-weight-bold">{getTitle()}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="font-weight-600">First Name</label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={mode === "view"}
                      placeholder="Enter first name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="font-weight-600">Last Name</label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={mode === "view"}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="font-weight-600">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={mode === "view"}
                  placeholder="name@example.com"
                />
              </div>
              {mode !== "view" && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="font-weight-600">Password {mode === "edit" && "(optional)"}</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control rounded-left-pill"
                          style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required={mode === "create"}
                          placeholder="Password"
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text bg-white"
                            style={{ borderTopRightRadius: '50px', borderBottomRightRadius: '50px', cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="font-weight-600">Confirm Password</label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control rounded-left-pill"
                          style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required={mode === "create" || formData.password !== ""}
                          placeholder="Confirm"
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text bg-white"
                            style={{ borderTopRightRadius: '50px', borderBottomRightRadius: '50px', cursor: 'pointer' }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="font-weight-600">User Role</label>
                <select
                  className="form-control rounded-pill custom-select"
                  name="userrole"
                  value={formData.userrole}
                  onChange={handleChange}
                  required
                  disabled={mode === "view"}
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option key={role._id} value={role.role}>
                      {role.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer border-0 px-0 pb-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={onClose}
                >
                  {mode === "view" ? "Close" : "Cancel"}
                </button>
                {mode !== "view" && (
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 font-weight-bold"
                    disabled={loading}
                  >
                    {getSubmitButtonText()}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
