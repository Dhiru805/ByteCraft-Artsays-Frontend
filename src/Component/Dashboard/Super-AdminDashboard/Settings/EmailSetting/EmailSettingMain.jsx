import React from "react";
import { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SendTestMail from "./SendTestMail";

const EmailSettingMain = () => {
  const [formData, setFormData] = useState({
    mail_driver: "",
    mail_host: "",
    mail_port: "",
    mail_username: "",
    mail_password: "",
    mail_encryption: "",
    mail_from_address: "",
    mail_from_name: "",
    is_active: true, 
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState({
    mail_driver: false,
    mail_host: false,
    mail_port: false,
    mail_username: false,
    mail_password: false,
    mail_encryption: false,
    mail_from_address: false,
    mail_from_name: false,
  });

  const toggleVisibility = (field) => {
    setShowData((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      is_active: !prevData.is_active,
    }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getAPI("/api/get-email-settings");
        const mappedData = {
          mail_driver: response.data.mailDriver || "",
          mail_host: response.data.mailHost || "",
          mail_port: response.data.mailPort || "",
          mail_username: response.data.mailUsername || "",
          mail_password: response.data.mailPassword || "",
          mail_encryption: response.data.mailEncryption || "",
          mail_from_address: response.data.mailFromAddress || "",
          mail_from_name: response.data.mailFromName || "",
          is_active: response.data.isActive ?? true, // Map isActive
        };
        setFormData(mappedData);
      } catch (err) {
        toast.error("Error fetching email settings: " + err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await postAPI("/api/save-email-settings", formData);
      if (response.success) {
        toast.success(response.message || "Email settings saved successfully!");
      } else {
        toast.success(response.message || "Email settings updated successfully.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.response?.data?.message || "Failed to update email settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="email-settings">
      <form method="POST" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12 col-sm-12 col-md-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Email Setting</h5>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailToggle"
                    checked={formData.is_active}
                    onChange={handleToggle}
                  />
                  <label className="form-check-label" htmlFor="emailToggle">
                    {formData.is_active ? "Enabled" : "Disabled"}
                  </label>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_driver" className="col-form-label">
                      Mail Driver
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail Driver"
                        name="mail_driver"
                        type={showData.mail_driver ? "text" : "password"}
                        value={formData.mail_driver}
                        onChange={handleChange}
                        id="mail_driver"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_driver")}
                      >
                        {showData.mail_driver ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_host" className="col-form-label">
                      Mail Host
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail Host"
                        name="mail_host"
                        type={showData.mail_host ? "text" : "password"}
                        value={formData.mail_host}
                        onChange={handleChange}
                        id="mail_host"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_host")}
                      >
                        {showData.mail_host ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_port" className="col-form-label">
                      Mail Port
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail Port"
                        name="mail_port"
                        type={showData.mail_port ? "text" : "password"}
                        value={formData.mail_port}
                        onChange={handleChange}
                        id="mail_port"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_port")}
                      >
                        {showData.mail_port ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_username" className="col-form-label">
                      Mail Username
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail Username"
                        name="mail_username"
                        type={showData.mail_username ? "text" : "password"}
                        value={formData.mail_username}
                        onChange={handleChange}
                        id="mail_username"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_username")}
                      >
                        {showData.mail_username ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_password" className="col-form-label">
                      Mail Password
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail Password"
                        name="mail_password"
                        type={showData.mail_password ? "text" : "password"}
                        value={formData.mail_password}
                        onChange={handleChange}
                        id="mail_password"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_password")}
                      >
                        {showData.mail_password ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_encryption" className="col-form-label">
                      Mail Encryption
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail Encryption"
                        name="mail_encryption"
                        type={showData.mail_encryption ? "text" : "password"}
                        value={formData.mail_encryption}
                        onChange={handleChange}
                        id="mail_encryption"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_encryption")}
                      >
                        {showData.mail_encryption ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_from_address" className="col-form-label">
                      Mail From Address
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail From Address"
                        name="mail_from_address"
                        type={showData.mail_from_address ? "text" : "password"}
                        value={formData.mail_from_address}
                        onChange={handleChange}
                        id="mail_from_address"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_from_address")}
                      >
                        {showData.mail_from_address ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 col-sm-6 form-group">
                    <label htmlFor="mail_from_name" className="col-form-label">
                      Mail From Name
                    </label>
                    <div className="position-relative">
                      <input
                        className="form-control pr-4"
                        placeholder="Enter Mail From Name"
                        name="mail_from_name"
                        type={showData.mail_from_name ? "text" : "password"}
                        value={formData.mail_from_name}
                        onChange={handleChange}
                        id="mail_from_name"
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={() => toggleVisibility("mail_from_name")}
                      >
                        {showData.mail_from_name ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    className="btn btn-primary mx-3"
                    onClick={() => setModalOpen(true)}
                  >
                    Send Test Mail
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading} >
                    {loading ? "Save Changes..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <SendTestMail
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        formData={formData}
      />
    </div>
  );
};

export default EmailSettingMain;