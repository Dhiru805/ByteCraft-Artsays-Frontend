import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

export default function GoogleSetting() {
  const [settings, setSettings] = useState({
    googleClientId: "",
    googleClientSecret: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAPI(`${API_BASE}/api/get-google-settings`);
      if (res.data && !res.data.hasError && res.data.data) {
        setSettings({
          googleClientId: res.data.data.googleClientId || "",
          googleClientSecret: res.data.data.googleClientSecret || "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Google OAuth settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!settings.googleClientId.trim() || !settings.googleClientSecret.trim()) {
      toast.error("Both Client ID and Client Secret are required");
      return;
    }
    setSaving(true);
    try {
      await postAPI(`${API_BASE}/api/save-google-settings`, settings);
      toast.success("Google OAuth settings saved successfully!");
      fetchSettings();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Google OAuth Settings</h2>
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="body text-center p-5">Loading settings...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Google OAuth Settings</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">Google OAuth Settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <div className="row">
                {/* Google Client ID */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Google Client ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="googleClientId"
                      value={settings.googleClientId}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Google Client ID"
                    />
                  </div>
                </div>

                {/* Google Client Secret */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Google Client Secret <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showSecret ? "text" : "password"}
                        name="googleClientSecret"
                        value={settings.googleClientSecret}
                        onChange={handleChange}
                        className="form-control"
                        style={{ paddingRight: "44px" }}
                        placeholder="Enter Google Client Secret"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "7px",
                          background: "none",
                          border: "none",
                        }}
                      >
                        {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
