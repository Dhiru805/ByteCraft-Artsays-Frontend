import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";

// The exact tabs visible in Artist and Seller sidebars
const ARTIST_TABS = [
  { label: "Dashboard", subTabs: [] },
  { label: "Blogs", subTabs: [] },
  { label: "Product", subTabs: [] },
  { label: "Custom Order", subTabs: [] },
  { label: "Product Purchased", subTabs: [] },
  { label: "Advertise", subTabs: [] },
  {
    label: "Bidding",
    subTabs: [
      { label: "All Products" },
      { label: "Bidded Product" },
      { label: "Bidding Pass" },
    ],
  },
  { label: "Certification Services", subTabs: [] },
  { label: "Product Insurance", subTabs: [] },
  { label: "Exhibition", subTabs: [] },
  { label: "Packaging Material", subTabs: [] },
  { label: "Wallet", subTabs: [] },
];

const SELLER_TABS = [
  { label: "Dashboard", subTabs: [] },
  { label: "Product", subTabs: [] },
  { label: "Product Purchased", subTabs: [] },
  {
    label: "Bidding",
    subTabs: [
      { label: "All Products" },
      { label: "Bidded Product" },
      { label: "Bidding Pass" },
    ],
  },
  { label: "Advertise", subTabs: [] },
  { label: "Certification Services", subTabs: [] },
  { label: "Product Insurance", subTabs: [] },
  { label: "Exhibition", subTabs: [] },
  { label: "Packaging Material", subTabs: [] },
  { label: "Wallet", subTabs: [] },
  {
    label: "Product Settings",
    subTabs: [{ label: "Product Coupon Code" }],
  },
];

const buildDefaultVisibility = (tabs) =>
  tabs.map((t) => ({
    label: t.label,
    visible: true,
    subTabs: t.subTabs.map((s) => ({ label: s.label, visible: true })),
  }));

const mergeVisibility = (defaults, saved) => {
  if (!saved || saved.length === 0) return defaults;
  return defaults.map((def) => {
    const found = saved.find((s) => s.label === def.label);
    return {
      ...def,
      visible: found ? found.visible : true,
      subTabs: def.subTabs.map((sub) => {
        const foundSub = found?.subTabs?.find((s) => s.label === sub.label);
        return { ...sub, visible: foundSub ? foundSub.visible : true };
      }),
    };
  });
};

const SidebarVisibility = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [artistTabs, setArtistTabs] = useState(buildDefaultVisibility(ARTIST_TABS));
  const [sellerTabs, setSellerTabs] = useState(buildDefaultVisibility(SELLER_TABS));

  useEffect(() => {
    const fetchVisibility = async () => {
      setLoading(true);
      try {
        const res = await getAPI("/api/sidebar-visibility");
        if (res?.data) {
          setArtistTabs(mergeVisibility(buildDefaultVisibility(ARTIST_TABS), res.data.artistTabs));
          setSellerTabs(mergeVisibility(buildDefaultVisibility(SELLER_TABS), res.data.sellerTabs));
        }
      } catch (err) {
        // No saved config yet — defaults remain
      } finally {
        setLoading(false);
      }
    };
    fetchVisibility();
  }, []);

  const toggleParent = (type, label) => {
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) =>
      prev.map((tab) => {
        if (tab.label !== label) return tab;
        const newVisible = !tab.visible;
        return {
          ...tab,
          visible: newVisible,
          subTabs: tab.subTabs.map((s) => ({ ...s, visible: newVisible })),
        };
      })
    );
  };

  const toggleSubTab = (type, parentLabel, subLabel) => {
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) =>
      prev.map((tab) => {
        if (tab.label !== parentLabel) return tab;
        const newSubTabs = tab.subTabs.map((s) =>
          s.label === subLabel ? { ...s, visible: !s.visible } : s
        );
        const anyVisible = newSubTabs.some((s) => s.visible);
        return { ...tab, visible: anyVisible || tab.visible, subTabs: newSubTabs };
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await postAPI(
        "/api/sidebar-visibility",
        { artistTabs, sellerTabs },
        true
      );
      toast.success("Sidebar visibility saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save sidebar visibility.");
    } finally {
      setSaving(false);
    }
  };

  const renderToggle = (visible, onChange) => (
    <div
      onClick={onChange}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: visible ? "#4a90d9" : "#ccc",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: visible ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );

  const renderTabList = (tabs, type) => (
    <div>
      {tabs.map((tab) => (
        <div key={tab.label} style={{ marginBottom: 6 }}>
          {/* Parent row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "#f8f9fa",
              borderRadius: 6,
              border: "1px solid #e9ecef",
            }}
          >
            <span style={{ fontSize: "1.3rem", fontWeight: 600 }}>
              {tab.label}
            </span>
            {renderToggle(tab.visible, () => toggleParent(type, tab.label))}
          </div>

          {/* Subtabs */}
          {tab.subTabs.length > 0 && (
            <div style={{ paddingLeft: 20, marginTop: 3 }}>
              {tab.subTabs.map((sub) => (
                <div
                  key={sub.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 12px",
                    background: "#fff",
                    borderRadius: 6,
                    border: "1px solid #eee",
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: "1.2rem", color: "#555" }}>
                    — {sub.label}
                  </span>
                  {renderToggle(sub.visible, () =>
                    toggleSubTab(type, tab.label, sub.label)
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-fluid">
      <ToastContainer />
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Sidebar Visibility</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Settings</li>
              <li className="breadcrumb-item">Sidebar Visibility</li>
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
          <div className="card-body">
            <p style={{ fontSize: "1.3rem", color: "#666", marginBottom: 20 }}>
              Toggle tabs ON/OFF to control which sidebar items are visible for{" "}
              <strong>all Artist</strong> and <strong>all Seller</strong> users.
            </p>

            <div className="row">
              {/* Artist Column */}
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div
                  style={{
                    background: "#fff3e0",
                    borderRadius: 8,
                    padding: "14px 16px",
                    marginBottom: 12,
                    borderLeft: "4px solid #ff9800",
                  }}
                >
                  <h5 style={{ margin: 0, fontSize: "1.5rem", color: "#e65100" }}>
                    <i className="fa fa-paint-brush mr-2"></i> Artist Sidebar
                  </h5>
                </div>
                {renderTabList(artistTabs, "artist")}
              </div>

              {/* Seller Column */}
              <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div
                  style={{
                    background: "#e8f5e9",
                    borderRadius: 8,
                    padding: "14px 16px",
                    marginBottom: 12,
                    borderLeft: "4px solid #4caf50",
                  }}
                >
                  <h5 style={{ margin: 0, fontSize: "1.5rem", color: "#1b5e20" }}>
                    <i className="fa fa-tag mr-2"></i> Seller Sidebar
                  </h5>
                </div>
                {renderTabList(sellerTabs, "seller")}
              </div>
            </div>

            <div className="mt-3">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ fontSize: "1.3rem", minWidth: 140 }}
              >
                {saving ? (
                  <>
                    <i className="fa fa-spinner fa-spin mr-2"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save mr-2"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarVisibility;
