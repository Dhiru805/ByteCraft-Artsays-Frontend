import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const WebsiteModeSetting = () => {
  const navigate = useNavigate();
  const [comingSoon, setComingSoon] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAPI("/api/website-mode");
        if (res?.data?.data) {
          setComingSoon(!!res.data.data.comingSoon);
          setMaintenance(!!res.data.data.maintenance);
        }
      } catch {
        toast.error("Failed to load website mode settings.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await postAPI("/api/website-mode", { comingSoon, maintenance });
      if (res?.data?.success) {
        toast.success("Website mode updated successfully!");
      } else {
        toast.error(res?.data?.message || "Failed to update.");
      }
    } catch {
      toast.error("Failed to update website mode.");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ enabled, onChange, disabled }) => (
    <div
      onClick={() => !disabled && onChange(!enabled)}
      style={{
        width: 52,
        height: 28,
        borderRadius: 14,
        background: enabled ? "#4a90d9" : "#ccc",
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: enabled ? 28 : 4,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Website Mode</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Settings</li>
              <li className="breadcrumb-item">Website Mode</li>
            </ul>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <i className="fa fa-spinner fa-spin fa-2x"></i>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5>Website Mode Settings</h5>
          </div>
          <div className="card-body">
            <p style={{ fontSize: "1.3rem", color: "#666", marginBottom: 24 }}>
              When a mode is <strong>ON</strong>, all visitors (except the logged-in Super Admin) will see the respective page instead of the website.
            </p>

            {/* Coming Soon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "18px 20px",
                borderRadius: 8,
                border: "1px solid #e9ecef",
                background: comingSoon ? "#e8f4ff" : "#f8f9fa",
                marginBottom: 16,
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: comingSoon ? "#4a90d9" : "#dee2e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <i className="fa fa-clock-o" style={{ color: "#fff", fontSize: 20 }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1.5rem" }}>Coming Soon Mode</div>
                <div style={{ fontSize: "1.2rem", color: "#666", marginTop: 2 }}>
                  Shows a "Coming Soon" page to all visitors. Only Super Admin can browse the full site.
                </div>
                {comingSoon && (
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      background: "#4a90d9",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "2px 10px",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>
              <Toggle
                enabled={comingSoon}
                onChange={(val) => {
                  setComingSoon(val);
                  if (val) setMaintenance(false);
                }}
              />
            </div>

            {/* Maintenance */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "18px 20px",
                borderRadius: 8,
                border: "1px solid #e9ecef",
                background: maintenance ? "#fff3e0" : "#f8f9fa",
                marginBottom: 24,
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: maintenance ? "#ff9800" : "#dee2e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <i className="fa fa-wrench" style={{ color: "#fff", fontSize: 20 }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1.5rem" }}>Maintenance Mode</div>
                <div style={{ fontSize: "1.2rem", color: "#666", marginTop: 2 }}>
                  Shows a "Under Maintenance" page to all visitors. Only Super Admin can browse the full site.
                </div>
                {maintenance && (
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      background: "#ff9800",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "2px 10px",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>
              <Toggle
                enabled={maintenance}
                onChange={(val) => {
                  setMaintenance(val);
                  if (val) setComingSoon(false);
                }}
              />
            </div>

            <div
              style={{
                background: "#fff8e1",
                border: "1px solid #ffe082",
                borderRadius: 6,
                padding: "10px 16px",
                fontSize: "1.2rem",
                color: "#795548",
                marginBottom: 24,
              }}
            >
              <i className="fa fa-info-circle mr-2"></i>
              Only one mode can be active at a time. Enabling one will automatically disable the other.
            </div>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ fontSize: "1.3rem", minWidth: 140 }}
              >
                {saving ? (
                  <><i className="fa fa-spinner fa-spin mr-2"></i>Saving...</>
                ) : (
                  <><i className="fa fa-save mr-2"></i>Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteModeSetting;
