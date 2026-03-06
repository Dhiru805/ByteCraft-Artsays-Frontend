import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

export default function PaymentGatewaySettings() {
  const [settings, setSettings] = useState({
    key: "",
    salt: "",
    env: "test",
    checkoutEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSalt, setShowSalt] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAPI(`${API_BASE}/api/get-payment-settings`);

      if (res.data && !res.data.hasError && res.data.data) {
        const data = res.data.data;
          setSettings({
             key: data.key || "",
             salt: data.salt || "",
             env: data.env || "test",
             checkoutEnabled: data.checkoutEnabled !== false,
           });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment gateway settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleCheckout = () => {
    setSettings((prev) => ({ ...prev, checkoutEnabled: !prev.checkoutEnabled }));
  };

  const handleSave = async () => {
    if (!settings.key.trim() || !settings.salt.trim()) {
        toast.error("Both Key and Salt are required");
        return;
      }

    setSaving(true);
    try {
      await postAPI(`${API_BASE}/api/save-payment-settings`, settings);

      toast.success("Payment gateway settings saved successfully!");
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
              <h2>Payment Gateway Settings</h2>
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
            <h2>Payment Gateway Settings</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                Payment Gateway Settings
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <div className="row">
                {}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Key <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="key"
                      value={settings.key}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter payment gateway key"
                      required
                    />
                  </div>
                </div>

                {}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Salt <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showSalt ? "text" : "password"}
                        name="salt"
                        value={settings.salt}
                        onChange={handleChange}
                        className="form-control"
                        style={{ paddingRight: "44px" }}
                        placeholder="Enter salt"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSalt(!showSalt)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "7px",
                          background: "none",
                          border: "none",
                        }}
                      >
                        {showSalt ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                  {/* Environment */}
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Environment <span className="text-danger">*</span>
                      </label>
                      <select
                        name="env"
                        value={settings.env}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="test">Test</option>
                        <option value="prod">Production</option>
                        </select>
                        </div>
                      </div>

                {/* Checkout Page Toggle */}
                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      background: settings.checkoutEnabled ? "#e8f5e9" : "#fce4ec",
                      borderRadius: 8,
                      border: `1px solid ${settings.checkoutEnabled ? "#a5d6a7" : "#f48fb1"}`,
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1.35rem" }}>
                        Checkout Page
                      </div>
                      <div style={{ fontSize: "1.2rem", color: "#666", marginTop: 2 }}>
                        {settings.checkoutEnabled
                          ? "Checkout is currently enabled. Users can place orders."
                          : "Checkout is currently disabled. Users cannot place orders."}
                      </div>
                    </div>
                    {/* Toggle switch */}
                    <div
                      onClick={handleToggleCheckout}
                      style={{
                        width: 52,
                        height: 28,
                        borderRadius: 14,
                        background: settings.checkoutEnabled ? "#4caf50" : "#e53935",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.25s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 4,
                          left: settings.checkoutEnabled ? 28 : 4,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.25s",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>{/* end row */}

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
