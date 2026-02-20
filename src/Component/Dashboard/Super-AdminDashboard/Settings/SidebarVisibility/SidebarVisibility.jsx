import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";

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
  // Respect saved order and labels (includes renames & reorders)
  const merged = saved.map((s) => ({
    label: s.label,
    visible: s.visible !== undefined ? s.visible : true,
    subTabs: (s.subTabs || []).map((sub) => ({
      label: sub.label,
      visible: sub.visible !== undefined ? sub.visible : true,
    })),
  }));
  // Add any new tabs from defaults that aren't in saved yet
  defaults.forEach((def) => {
    const exists = merged.find((m) => m.label === def.label);
    if (!exists) merged.push({ ...def });
  });
  return merged;
};

const SidebarVisibility = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [artistTabs, setArtistTabs] = useState(buildDefaultVisibility(ARTIST_TABS));
  const [sellerTabs, setSellerTabs] = useState(buildDefaultVisibility(SELLER_TABS));

  // editing state: { type, index, subIndex (null = parent), value }
  const [editing, setEditing] = useState(null);
  const inputRef = useRef(null);

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

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  // ─── Toggle ──────────────────────────────────────────────────────────────────
  const toggleParent = (type, index) => {
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) =>
      prev.map((tab, i) => {
        if (i !== index) return tab;
        const newVisible = !tab.visible;
        return {
          ...tab,
          visible: newVisible,
          subTabs: tab.subTabs.map((s) => ({ ...s, visible: newVisible })),
        };
      })
    );
  };

  const toggleSubTab = (type, parentIndex, subIndex) => {
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) =>
      prev.map((tab, i) => {
        if (i !== parentIndex) return tab;
        const newSubTabs = tab.subTabs.map((s, si) =>
          si === subIndex ? { ...s, visible: !s.visible } : s
        );
        return { ...tab, subTabs: newSubTabs };
      })
    );
  };

  // ─── Rename ───────────────────────────────────────────────────────────────────
  const startEdit = (type, index, subIndex = null) => {
    const tabs = type === "artist" ? artistTabs : sellerTabs;
    const value =
      subIndex === null
        ? tabs[index].label
        : tabs[index].subTabs[subIndex].label;
    setEditing({ type, index, subIndex, value });
  };

  const commitEdit = () => {
    if (!editing) return;
    const { type, index, subIndex, value } = editing;
    const trimmed = value.trim();
    if (!trimmed) { setEditing(null); return; }
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) =>
      prev.map((tab, i) => {
        if (i !== index) return tab;
        if (subIndex === null) return { ...tab, label: trimmed };
        return {
          ...tab,
          subTabs: tab.subTabs.map((s, si) =>
            si === subIndex ? { ...s, label: trimmed } : s
          ),
        };
      })
    );
    setEditing(null);
  };

  // ─── Drag & Drop (parent tabs) ────────────────────────────────────────────────
  const dragParent = useRef(null);

  const onDragStartParent = (type, index) => {
    dragParent.current = { type, index };
  };

  const onDropParent = (type, dropIndex) => {
    if (!dragParent.current) return;
    if (dragParent.current.type !== type) return;
    const from = dragParent.current.index;
    if (from === dropIndex) return;
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(dropIndex, 0, moved);
      return arr;
    });
    dragParent.current = null;
  };

  // ─── Drag & Drop (subtabs) ────────────────────────────────────────────────────
  const dragSub = useRef(null);

  const onDragStartSub = (type, parentIndex, subIndex) => {
    dragSub.current = { type, parentIndex, subIndex };
  };

  const onDropSub = (type, parentIndex, dropSubIndex) => {
    if (!dragSub.current) return;
    if (dragSub.current.type !== type || dragSub.current.parentIndex !== parentIndex) return;
    const from = dragSub.current.subIndex;
    if (from === dropSubIndex) return;
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) =>
      prev.map((tab, i) => {
        if (i !== parentIndex) return tab;
        const arr = [...tab.subTabs];
        const [moved] = arr.splice(from, 1);
        arr.splice(dropSubIndex, 0, moved);
        return { ...tab, subTabs: arr };
      })
    );
    dragSub.current = null;
  };

  // ─── Promote subtab to main tab ──────────────────────────────────────────────
  const promoteSubTab = (type, parentIndex, subIndex) => {
    const setter = type === "artist" ? setArtistTabs : setSellerTabs;
    setter((prev) => {
      const arr = [...prev];
      const parent = { ...arr[parentIndex] };
      const subs = [...parent.subTabs];
      const [promoted] = subs.splice(subIndex, 1);
      parent.subTabs = subs;
      arr[parentIndex] = parent;
      // Insert promoted tab right after the parent
      arr.splice(parentIndex + 1, 0, {
        label: promoted.label,
        visible: promoted.visible !== false,
        subTabs: [],
        _promoted: true,
      });
      return arr;
    });
  };

  // ─── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await postAPI("/api/sidebar-visibility", { artistTabs, sellerTabs }, true);
      toast.success("Sidebar visibility saved successfully!");
    } catch (err) {
      toast.error("Failed to save sidebar visibility.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render helpers ───────────────────────────────────────────────────────────
  const renderToggle = (visible, onChange) => (
    <div
      onClick={(e) => { e.stopPropagation(); onChange(); }}
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

  const isEditingThis = (type, index, subIndex = null) =>
    editing &&
    editing.type === type &&
    editing.index === index &&
    editing.subIndex === subIndex;

  const renderTabList = (tabs, type) => (
    <div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStartParent(type, i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDropParent(type, i)}
          style={{ marginBottom: 6, cursor: "grab" }}
        >
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
              gap: 8,
            }}
          >
            {/* Drag handle */}
            <i
              className="fa fa-bars"
              style={{ color: "#aaa", cursor: "grab", marginRight: 8, flexShrink: 0 }}
            />

            {/* Label / edit input */}
            {isEditingThis(type, i) ? (
              <input
                ref={inputRef}
                value={editing.value}
                onChange={(e) => setEditing((prev) => ({ ...prev, value: e.target.value }))}
                onBlur={commitEdit}
                onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  border: "1px solid #4a90d9",
                  borderRadius: 4,
                  padding: "2px 6px",
                  outline: "none",
                }}
              />
            ) : (
              <span
                style={{ flex: 1, fontSize: "1.3rem", fontWeight: 600, cursor: "text" }}
                onDoubleClick={(e) => { e.stopPropagation(); startEdit(type, i); }}
                title="Double-click to rename"
              >
                {tab.label}
              </span>
            )}

            {/* Edit icon */}
            <i
              className="fa fa-pencil"
              onClick={(e) => { e.stopPropagation(); startEdit(type, i); }}
              style={{ color: "#888", cursor: "pointer", fontSize: "1.1rem", flexShrink: 0 }}
              title="Rename"
            />

            {renderToggle(tab.visible, () => toggleParent(type, i))}
          </div>

          {/* Subtabs */}
          {tab.subTabs.length > 0 && (
            <div style={{ paddingLeft: 28, marginTop: 3 }}>
              {tab.subTabs.map((sub, si) => (
                <div
                  key={si}
                  draggable
                  onDragStart={(e) => { e.stopPropagation(); onDragStartSub(type, i, si); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.stopPropagation(); onDropSub(type, i, si); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 12px",
                    background: "#fff",
                    borderRadius: 6,
                    border: "1px solid #eee",
                    marginBottom: 3,
                    gap: 8,
                    cursor: "grab",
                  }}
                >
                  <i className="fa fa-bars" style={{ color: "#ccc", cursor: "grab", marginRight: 6, flexShrink: 0, fontSize: "1rem" }} />

                  {isEditingThis(type, i, si) ? (
                    <input
                      ref={inputRef}
                      value={editing.value}
                      onChange={(e) => setEditing((prev) => ({ ...prev, value: e.target.value }))}
                      onBlur={commitEdit}
                      onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flex: 1,
                        fontSize: "1.2rem",
                        border: "1px solid #4a90d9",
                        borderRadius: 4,
                        padding: "2px 6px",
                        outline: "none",
                      }}
                    />
                  ) : (
                    <span
                      style={{ flex: 1, fontSize: "1.2rem", color: "#555", cursor: "text" }}
                      onDoubleClick={(e) => { e.stopPropagation(); startEdit(type, i, si); }}
                      title="Double-click to rename"
                    >
                      — {sub.label}
                    </span>
                  )}

                    <i
                      className="fa fa-pencil"
                      onClick={(e) => { e.stopPropagation(); startEdit(type, i, si); }}
                      style={{ color: "#bbb", cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}
                      title="Rename"
                    />

                    <button
                      onClick={(e) => { e.stopPropagation(); promoteSubTab(type, i, si); }}
                      title="Promote to main tab"
                      style={{
                        background: "#e3f2fd",
                        border: "1px solid #90caf9",
                        borderRadius: 4,
                        padding: "2px 7px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        color: "#1565c0",
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      ↑
                    </button>

                    {renderToggle(sub.visible, () => toggleSubTab(type, i, si))}
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
                Toggle tabs ON/OFF, <strong>drag</strong> to reorder, <strong>double-click / click <i className="fa fa-pencil" /></strong> to rename, or click <strong>↑</strong> on a subtab to promote it to a main tab. Changes apply to{" "}
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
