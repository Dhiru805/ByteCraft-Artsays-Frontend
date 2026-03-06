import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import putAPI from "../../../../../api/putAPI";
import deleteAPI from "../../../../../api/deleteAPI";

// ── Field type definitions shown as reference in the builder ────────────────
const FIELD_TYPES = [
  { value: "text", label: "Short Text", icon: "fa-font", hint: "Single-line text answer" },
  { value: "textarea", label: "Long Text", icon: "fa-align-left", hint: "Multi-line text answer" },
  { value: "email", label: "Email", icon: "fa-envelope", hint: "Valid email address" },
  { value: "number", label: "Number", icon: "fa-hashtag", hint: "Numeric answer" },
  { value: "radio", label: "Single Choice", icon: "fa-dot-circle-o", hint: "Pick one option (radio buttons)" },
  { value: "checkbox", label: "Multiple Choice", icon: "fa-check-square-o", hint: "Pick multiple options" },
  { value: "select", label: "Dropdown", icon: "fa-caret-square-o-down", hint: "Select from a dropdown" },
  { value: "rating", label: "Star Rating", icon: "fa-star", hint: "1–5 star rating" },
];

const defaultField = () => ({
  fieldId: `f${Date.now()}`,
  type: "text",
  label: "",
  placeholder: "",
  required: false,
  options: [],
  order: 0,
  _optionInput: "",
});

const NEEDS_OPTIONS = ["radio", "checkbox", "select"];

// ── Single field editor row ──────────────────────────────────────────────────
const FieldEditor = ({ field, index, total, onChange, onRemove, onMove }) => {
  const needsOptions = NEEDS_OPTIONS.includes(field.type);

  const handleOptionAdd = () => {
    const val = (field._optionInput || "").trim();
    if (!val) return;
    onChange(index, { ...field, options: [...field.options, val], _optionInput: "" });
  };

  const handleOptionRemove = (oi) => {
    onChange(index, { ...field, options: field.options.filter((_, i) => i !== oi) });
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: "16px 18px",
        marginBottom: 14,
        position: "relative",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span
          style={{
            background: "#7b5ea7",
            color: "#fff",
            borderRadius: "50%",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>

        {/* Type selector */}
        <select
          className="form-control"
          style={{ maxWidth: 180, flex: "0 0 auto" }}
          value={field.type}
          onChange={(e) => onChange(index, { ...field, type: e.target.value, options: [] })}
        >
          {FIELD_TYPES.map((ft) => (
            <option key={ft.value} value={ft.value}>
              {ft.label}
            </option>
          ))}
        </select>

        {/* Required toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange(index, { ...field, required: e.target.checked })}
          />
          Required
        </label>

        {/* Move up / down / delete */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button
            type="button"
            className="btn btn-xs btn-default"
            disabled={index === 0}
            onClick={() => onMove(index, "up")}
            title="Move up"
          >
            <i className="fa fa-arrow-up" />
          </button>
          <button
            type="button"
            className="btn btn-xs btn-default"
            disabled={index === total - 1}
            onClick={() => onMove(index, "down")}
            title="Move down"
          >
            <i className="fa fa-arrow-down" />
          </button>
          <button
            type="button"
            className="btn btn-xs btn-danger"
            onClick={() => onRemove(index)}
            title="Remove field"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      </div>

      {/* Type hint */}
      <p style={{ fontSize: 11, color: "#888", margin: "0 0 10px 0" }}>
        <i className={`fa ${FIELD_TYPES.find((f) => f.value === field.type)?.icon} mr-1`} />
        {FIELD_TYPES.find((f) => f.value === field.type)?.hint}
      </p>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Question / Label <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="form-control"
              placeholder="e.g. How satisfied are you?"
              value={field.label}
              onChange={(e) => onChange(index, { ...field, label: e.target.value })}
            />
          </div>
        </div>

        {field.type !== "rating" && field.type !== "radio" && field.type !== "checkbox" && field.type !== "select" && (
          <div className="col-md-6">
            <div className="form-group" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Placeholder (optional)</label>
              <input
                className="form-control"
                placeholder="e.g. Type your answer here…"
                value={field.placeholder}
                onChange={(e) => onChange(index, { ...field, placeholder: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Options for radio / checkbox / select */}
      {needsOptions && (
        <div style={{ marginTop: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>
            Options <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            {field.options.map((opt, oi) => (
              <span
                key={oi}
                style={{
                  background: "#f3f0ff",
                  border: "1px solid #c9bef0",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {opt}
                <button
                  type="button"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#7b5ea7", padding: 0, lineHeight: 1 }}
                  onClick={() => handleOptionRemove(oi)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              className="form-control"
              style={{ maxWidth: 240 }}
              placeholder="Add an option and press Enter"
              value={field._optionInput || ""}
              onChange={(e) => onChange(index, { ...field, _optionInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleOptionAdd();
                }
              }}
            />
            <button type="button" className="btn btn-sm btn-default" onClick={handleOptionAdd}>
              Add
            </button>
          </div>
        </div>
      )}

      {/* Rating preview */}
      {field.type === "rating" && (
        <div style={{ marginTop: 6 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Preview: </span>
          {[1, 2, 3, 4, 5].map((s) => (
            <i key={s} className="fa fa-star" style={{ color: "#f4b400", marginRight: 2, fontSize: 16 }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main FeedbackFormBuilder ─────────────────────────────────────────────────
const FeedbackFormBuilder = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);

  // Builder state
  const [editingId, setEditingId] = useState(null); // null = create new
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [fields, setFields] = useState([defaultField()]);
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  const fetchForms = async () => {
    setLoadingForms(true);
    try {
      const res = await getAPI("/api/feedback-forms");
      setForms(res?.data?.data || []);
    } catch {
      setForms([]);
    } finally {
      setLoadingForms(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const resetBuilder = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setIsActive(true);
    setSuccessMessage("");
    setFields([defaultField()]);
    setShowBuilder(false);
  };

  const openCreate = () => {
    resetBuilder();
    setShowBuilder(true);
  };

  const openEdit = (form) => {
    setEditingId(form._id);
    setTitle(form.title);
    setDescription(form.description || "");
    setIsActive(form.isActive);
    setSuccessMessage(form.successMessage || "");
    setFields(
      (form.fields || []).map((f) => ({ ...f, _optionInput: "", options: f.options || [] }))
    );
    setShowBuilder(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFieldChange = (index, updated) => {
    setFields((prev) => prev.map((f, i) => (i === index ? updated : f)));
  };

  const handleFieldRemove = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldMove = (index, direction) => {
    setFields((prev) => {
      const arr = [...prev];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      [arr[index], arr[swapWith]] = [arr[swapWith], arr[index]];
      return arr.map((f, i) => ({ ...f, order: i }));
    });
  };

  const handleAddField = () => {
    setFields((prev) => [...prev, { ...defaultField(), fieldId: `f${Date.now()}`, order: prev.length }]);
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Form title is required.");
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].label.trim()) return toast.error(`Field ${i + 1}: label is required.`);
      if (NEEDS_OPTIONS.includes(fields[i].type) && fields[i].options.length < 2)
        return toast.error(`Field ${i + 1} (${fields[i].type}): at least 2 options required.`);
    }

      const cleanFields = fields.map(({ _optionInput, ...rest }, i) => ({ ...rest, order: i }));
      const payload = { title, description, fields: cleanFields, isActive, successMessage };

    setSaving(true);
    try {
      if (editingId) {
        await putAPI(`/api/feedback-forms/${editingId}`, payload);
        toast.success("Feedback form updated!");
      } else {
        await postAPI("/api/feedback-forms", payload);
        toast.success("Feedback form created!");
      }
      resetBuilder();
      fetchForms();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save form.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (form) => {
    try {
      await putAPI(`/api/feedback-forms/${form._id}/toggle-active`, {});
      toast.success(`Form ${form.isActive ? "deactivated" : "activated"}.`);
      fetchForms();
    } catch {
      toast.error("Failed to toggle status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback form and all its responses?")) return;
    try {
      await deleteAPI(`/api/feedback-forms/${id}`);
      toast.success("Form deleted.");
      fetchForms();
    } catch {
      toast.error("Failed to delete form.");
    }
  };

  return (
    <div className="container-fluid">
      {/* ── Page header ── */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Feedback Form Builder</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard" />
                </span>
              </li>
              <li className="breadcrumb-item">Settings</li>
              <li className="breadcrumb-item">Feedback Form</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12" style={{ textAlign: "right", paddingTop: 20 }}>
            <button className="btn btn-success mr-2" onClick={() => navigate("/super-admin/settings/feedback-responses")}>
              <i className="fa fa-list mr-1" /> View Responses
            </button>
            {!showBuilder && (
              <button className="btn btn-primary" onClick={openCreate}>
                <i className="fa fa-plus mr-1" /> Create New Form
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Form Builder Panel ── */}
      {showBuilder && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>{editingId ? "Edit Feedback Form" : "Create Feedback Form"}</h2>
            <button className="btn btn-sm btn-default" onClick={resetBuilder}>
              <i className="fa fa-times mr-1" /> Cancel
            </button>
          </div>
          <div className="body">
            {/* ── Meta fields ── */}
            <div className="row" style={{ marginBottom: 20 }}>
              <div className="col-md-6">
                <div className="form-group">
                  <label style={{ fontWeight: 600 }}>
                    Form Title <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="e.g. Customer Satisfaction Survey"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label style={{ fontWeight: 600 }}>Description (optional)</label>
                  <input
                    className="form-control"
                    placeholder="Brief description shown to users"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label style={{ fontWeight: 600 }}>Status</label>
                  <div>
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <span style={{ fontSize: 13 }}>
                        {isActive ? (
                          <span style={{ color: "#28a745", fontWeight: 600 }}>Active (shown to users)</span>
                        ) : (
                          <span style={{ color: "#999" }}>Inactive</span>
                        )}
                      </span>
                    </label>
                    {isActive && (
                      <p style={{ fontSize: 11, color: "#e67e22", margin: "4px 0 0 0" }}>
                        <i className="fa fa-info-circle mr-1" />
                        Activating this form will deactivate all others.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Success message ── */}
            <div className="row" style={{ marginBottom: 20 }}>
              <div className="col-md-12">
                <div className="form-group">
                  <label style={{ fontWeight: 600 }}>
                    Submission Success Message{" "}
                    <span style={{ fontSize: 12, color: "#888", fontWeight: 400 }}>
                      (shown to user after they submit — leave blank for default)
                    </span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder='e.g. "Thank you for your valuable feedback! We truly appreciate your time and will use your insights to make Artsays even better."'
                    value={successMessage}
                    onChange={(e) => setSuccessMessage(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
            </div>

            {/* ── Field type reference ── */}
            <div
              style={{
                background: "#f9f7ff",
                border: "1px dashed #c9bef0",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 20,
              }}
            >
              <p style={{ fontWeight: 600, margin: "0 0 8px 0", fontSize: 13 }}>
                <i className="fa fa-info-circle mr-1" style={{ color: "#7b5ea7" }} />
                Available Input Types (reference)
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {FIELD_TYPES.map((ft) => (
                  <span
                    key={ft.value}
                    style={{
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      padding: "4px 10px",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <i className={`fa ${ft.icon}`} style={{ color: "#7b5ea7" }} />
                    <strong>{ft.label}</strong>
                    <span style={{ color: "#888" }}>— {ft.hint}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* ── Fields ── */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0 }}>
                  Form Fields{" "}
                  <span style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>
                    ({fields.length} field{fields.length !== 1 ? "s" : ""})
                  </span>
                </h4>
                <button className="btn btn-sm btn-primary" onClick={handleAddField}>
                  <i className="fa fa-plus mr-1" /> Add Field
                </button>
              </div>

              {fields.map((field, index) => (
                <FieldEditor
                  key={field.fieldId}
                  field={field}
                  index={index}
                  total={fields.length}
                  onChange={handleFieldChange}
                  onRemove={handleFieldRemove}
                  onMove={handleFieldMove}
                />
              ))}

              {fields.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 30,
                    color: "#aaa",
                    border: "2px dashed #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  <i className="fa fa-plus-circle" style={{ fontSize: 28, marginBottom: 8 }} />
                  <p>No fields yet. Click "Add Field" to get started.</p>
                </div>
              )}
            </div>

            {/* ── Save actions ── */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-default" onClick={resetBuilder}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><i className="fa fa-spinner fa-spin mr-1" /> Saving…</>
                ) : (
                  <><i className="fa fa-save mr-1" /> {editingId ? "Update Form" : "Create Form"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Existing forms list ── */}
      <div className="card">
        <div className="header">
          <h2>All Feedback Forms</h2>
        </div>
        <div className="body">
          {loadingForms ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: 28, color: "#7b5ea7" }} />
            </div>
          ) : forms.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
              <i className="fa fa-clipboard" style={{ fontSize: 40, marginBottom: 10 }} />
              <p>No feedback forms created yet.</p>
              <button className="btn btn-primary" onClick={openCreate}>
                <i className="fa fa-plus mr-1" /> Create Your First Form
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead style={{ background: "#f9f7ff" }}>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Fields</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form, idx) => (
                    <tr key={form._id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{form.title}</td>
                      <td style={{ color: "#777", maxWidth: 200 }}>{form.description || "—"}</td>
                      <td>
                        <span className="badge badge-default">{form.fields?.length || 0} fields</span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-xs ${form.isActive ? "btn-success" : "btn-default"}`}
                          onClick={() => handleToggleActive(form)}
                          title={form.isActive ? "Click to deactivate" : "Click to activate"}
                        >
                          <i className={`fa ${form.isActive ? "fa-check-circle" : "fa-circle-o"} mr-1`} />
                          {form.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td style={{ fontSize: 12, color: "#777" }}>
                        {new Date(form.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <button
                          className="btn btn-xs btn-info mr-1"
                          onClick={() => openEdit(form)}
                          title="Edit"
                        >
                          <i className="fa fa-edit" />
                        </button>
                        <button
                          className="btn btn-xs btn-primary mr-1"
                          onClick={() => navigate(`/super-admin/settings/feedback-responses?formId=${form._id}&formTitle=${encodeURIComponent(form.title)}`)}
                          title="View Responses"
                        >
                          <i className="fa fa-list" />
                        </button>
                        <button
                          className="btn btn-xs btn-danger"
                          onClick={() => handleDelete(form._id)}
                          title="Delete"
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormBuilder;
