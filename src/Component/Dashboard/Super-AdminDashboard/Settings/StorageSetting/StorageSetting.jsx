import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const StorageSetting = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storageType: "local",
    s3AccessKeyId: "",
    s3SecretAccessKey: "",
    s3Region: "",
    s3BucketName: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getAPI("/api/get-storage-settings");
        if (response?.data?.data) {
          const d = response.data.data;
          setFormData({
            storageType: d.storageType || "local",
            s3AccessKeyId: d.s3AccessKeyId || "",
            s3SecretAccessKey: d.s3SecretAccessKey || "",
            s3Region: d.s3Region || "",
            s3BucketName: d.s3BucketName || "",
          });
        }
      } catch (err) {
        toast.error("Error fetching storage settings: " + err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await postAPI("/api/save-storage-settings", formData);
      if (response?.data?.success) {
        toast.success(response.data.message || "Storage settings saved successfully!");
      } else {
        toast.error(response?.data?.message || "Failed to save storage settings.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save storage settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Storage Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Storage Setting</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12 col-sm-12 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5>Storage Setting</h5>
              </div>
              <div className="card-body">
                {/* Storage Type Toggle */}
                <div className="row mb-4">
                  <div className="col-lg-4 col-md-6 col-sm-12 form-group">
                    <label className="col-form-label">Storage Type</label>
                    <div className="d-flex gap-3 mt-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="storageType"
                          id="storageLocal"
                          value="local"
                          checked={formData.storageType === "local"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="storageLocal">
                          Local Storage
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="storageType"
                          id="storageS3"
                          value="s3"
                          checked={formData.storageType === "s3"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="storageS3">
                          Amazon S3
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* S3 Fields — only shown when s3 is selected */}
                {formData.storageType === "s3" && (
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 form-group">
                      <label htmlFor="s3BucketName" className="col-form-label">
                        S3 Bucket Name
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter S3 Bucket Name"
                        name="s3BucketName"
                        id="s3BucketName"
                        type="text"
                        value={formData.s3BucketName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12 form-group">
                      <label htmlFor="s3Region" className="col-form-label">
                        S3 Region
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g. us-east-1"
                        name="s3Region"
                        id="s3Region"
                        type="text"
                        value={formData.s3Region}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12 form-group">
                      <label htmlFor="s3AccessKeyId" className="col-form-label">
                        Access Key ID
                      </label>
                      <input
                        className="form-control"
                        placeholder="Enter AWS Access Key ID"
                        name="s3AccessKeyId"
                        id="s3AccessKeyId"
                        type="text"
                        value={formData.s3AccessKeyId}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12 form-group">
                      <label htmlFor="s3SecretAccessKey" className="col-form-label">
                        Secret Access Key
                      </label>
                      <div className="position-relative">
                        <input
                          className="form-control pr-4"
                          placeholder="Enter AWS Secret Access Key"
                          name="s3SecretAccessKey"
                          id="s3SecretAccessKey"
                          type={showSecret ? "text" : "password"}
                          value={formData.s3SecretAccessKey}
                          onChange={handleChange}
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
                          onClick={() => setShowSecret((v) => !v)}
                        >
                          {showSecret ? <FiEyeOff /> : <FiEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.storageType === "local" && (
                  <div className="alert alert-info">
                    Files will be stored on the local server filesystem under the{" "}
                    <code>uploads/</code> directory.
                  </div>
                )}
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StorageSetting;
