import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";
import postAPI from "../../../../../api/postAPI";

const CATEGORY_LABELS = {
  auth: "Authentication",
  orders: "Orders",
  bidding: "Bidding",
  wallet: "Wallet",
  career: "Career",
  challenge: "Challenge",
  custom_art: "Custom Art",
  social: "Social",
  admin: "Admin",
  other: "Other",
};

const SAMPLE_VALUES = {
  name: "John Doe",
  artist_name: "Priya Sharma",
  reviewer_name: "John Doe",
  buyer_name: "John Doe",
  email: "john@example.com",
  order_id: "ORD-12345",
  bid_id: "BID-67890",
  txnid: "TXN-99001",
  reference_id: "REF-55432",
  amount: "2,500",
  winning_amount: "5,000",
  product_name: "Sunset Artwork",
  rating: "5",
  dashboard_url: "https://artsays.in/dashboard",
  cancel_reason: "Item out of stock",
  refund_note: "Refund will be processed within 5-7 days",
  admin_note: "Does not meet quality standards",
  rejection_reason: "Documents not clear",
  method: "Bank Transfer",
  id_type: "Aadhaar Card",
  membership_name: "Gold Membership",
  badge_name: "Verified Artist",
  badge_description: "A verified badge for trusted artists",
  tip_amount: "500",
  applicant_name: "Rahul Verma",
  position: "UI Designer",
  challenge_name: "Abstract Art Challenge",
  exhibition_name: "Spring Exhibition 2026",
  live_title: "Live Painting Session",
  package_name: "Standard Package",
  coin_amount: "100",
  pass_name: "Monthly Bidding Pass",
};

function getSampleValue(varName) {
  if (SAMPLE_VALUES[varName]) return SAMPLE_VALUES[varName];
  if (varName.endsWith("_url") || varName.endsWith("_link")) return "https://artsays.in";
  if (varName.endsWith("_id")) return "SAMPLE-001";
  if (varName.endsWith("_name")) return "Sample Name";
  if (varName.endsWith("_amount") || varName === "amount") return "1,000";
  if (varName.endsWith("_date")) return "20 Apr 2026";
  if (varName.endsWith("_reason") || varName.endsWith("_note")) return "Sample reason";
  return `[${varName}]`;
}

function buildPreviewHtml(subject, body) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 16px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px; line-height: 1.6; color: #333;
    background: #f0f0f0;
  }
  .email-wrap {
    max-width: 600px; margin: 0 auto;
    background: #fff; border-radius: 8px;
    overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .email-subject {
    background: #AD6449; color: #fff;
    padding: 14px 24px; font-size: 15px; font-weight: 600;
    word-break: break-word;
  }
  .email-body { padding: 24px; }
  .email-body img { max-width: 100%; }
  .email-body a { color: #AD6449; }
</style>
</head>
<body>
  <div class="email-wrap">
    <div class="email-subject">${subject || "<em style='opacity:.6'>No subject</em>"}</div>
    <div class="email-body">${body || "<p style='color:#999;font-style:italic'>No body content yet</p>"}</div>
  </div>
</body>
</html>`;
}

const NotificationTemplateEditor = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Test email state
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testVars, setTestVars] = useState({});
  const [sending, setSending] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const res = await getAPI(`/api/notification-templates/${key}`);
        if (res.data?.success) {
          const tpl = res.data.data;
          setTemplate(tpl);
          setSubject(tpl.subject || "");
          setBody(tpl.body || "");
          // Pre-fill test vars with sample values
          const defaults = {};
          (tpl.variables || []).forEach((v) => {
            defaults[v.name] = getSampleValue(v.name);
          });
          setTestVars(defaults);
        } else {
          toast.error("Template not found.");
          navigate("/super-admin/settings/notification-templates");
        }
      } catch {
        toast.error("Failed to load template.");
        navigate("/super-admin/settings/notification-templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [key, navigate]);

  // Update iframe preview whenever subject or body changes
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(buildPreviewHtml(subject, body));
      doc.close();
    }
  }, [subject, body]);

  const handleSubjectChange = (e) => { setSubject(e.target.value); setDirty(true); };
  const handleBodyChange = (e) => { setBody(e.target.value); setDirty(true); };

  const insertVariable = (varName) => {
    const placeholder = `{{${varName}}}`;
    navigator.clipboard?.writeText(placeholder).then(() =>
      toast.info(`Copied ${placeholder}`)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await putAPI(`/api/notification-templates/${key}`, { subject, body });
      if (res.data?.success) {
        toast.success("Template saved.");
        setTemplate(res.data.data);
        setDirty(false);
      } else {
        toast.error(res.data?.message || "Failed to save.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset this template to its default content? Your customizations will be lost.")) return;
    setResetting(true);
    try {
      const res = await postAPI(`/api/notification-templates/reset/${key}`, {});
      if (res.data?.success) {
        toast.success("Reset to default.");
        const updated = res.data.data;
        setTemplate(updated);
        setSubject(updated.subject || "");
        setBody(updated.body || "");
        setDirty(false);
      } else {
        toast.error(res.data?.message || "Failed to reset.");
      }
    } catch {
      toast.error("Failed to reset template.");
    } finally {
      setResetting(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      toast.warn("Please enter a recipient email address.");
      return;
    }
    setSending(true);
    try {
      const res = await postAPI(`/api/notification-templates/${key}/test`, {
        email: testEmail.trim(),
        variables: testVars,
        subject, // send current (possibly unsaved) subject
        body,    // send current (possibly unsaved) body
      });
      if (res.data?.success) {
        toast.success(res.data.message || `Test email sent to ${testEmail}`);
      } else {
        toast.error(res.data?.message || "Failed to send test email.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send test email.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="p-5 text-center text-muted">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Breadcrumb */}
      <div className="block-header mb-0">
        <div className="row">
          <div className="col-12">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard" />
                </span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/settings/notification-templates")}
                  style={{ cursor: "pointer", color: "#AD6449" }}
                >
                  Notification Templates
                </span>
              </li>
              <li className="breadcrumb-item">{template?.name}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Header bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap" style={{ gap: 8 }}>
        <div className="d-flex align-items-center" style={{ gap: 10 }}>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/super-admin/settings/notification-templates")}
          >
            <i className="fa fa-arrow-left mr-1" /> Back
          </button>
          <div>
            <h5 className="mb-0 d-inline">{template?.name}</h5>
            {template?.category && (
              <span
                className="badge badge-light ml-2"
                style={{ fontSize: "0.75em", verticalAlign: "middle", background: "#f0ece9", color: "#AD6449" }}
              >
                {CATEGORY_LABELS[template.category] || template.category}
              </span>
            )}
            {dirty && (
              <span className="badge badge-warning ml-2" style={{ fontSize: "0.72em", verticalAlign: "middle" }}>
                Unsaved
              </span>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ gap: 8 }}>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowTestPanel((p) => !p)}
            title="Send a test email to verify how this template looks"
          >
            <i className={`fa fa-${showTestPanel ? "times" : "paper-plane"} mr-1`} />
            {showTestPanel ? "Close Test" : "Send Test"}
          </button>
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={handleReset}
            disabled={resetting}
          >
            {resetting ? "Resetting..." : "Reset to Default"}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {template?.description && (
        <p className="text-muted small mb-3">{template.description}</p>
      )}

      {/* Test Email Panel */}
      {showTestPanel && (
        <div
          className="card mb-3"
          style={{ border: "1px solid #AD6449", borderRadius: 6, background: "#fffaf8" }}
        >
          <div
            className="card-header py-2 d-flex align-items-center justify-content-between"
            style={{ background: "#f9ede8", borderBottom: "1px solid #e8cfc5" }}
          >
            <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#AD6449" }}>
              <i className="fa fa-paper-plane mr-2" />
              Send Test Email
            </span>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              Uses the current (unsaved) content — no need to save first
            </span>
          </div>
          <div className="card-body p-3">
            {/* Recipient email */}
            <div className="row align-items-end mb-3">
              <div className="col-md-5">
                <label className="col-form-label py-0 font-weight-bold" style={{ fontSize: "0.8rem" }}>
                  Send to
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="recipient@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendTest()}
                />
              </div>
              <div className="col-md-3 mt-2 mt-md-0">
                <button
                  className="btn btn-sm btn-success w-100"
                  onClick={handleSendTest}
                  disabled={sending}
                >
                  {sending ? (
                    <><i className="fa fa-spinner fa-spin mr-1" /> Sending...</>
                  ) : (
                    <><i className="fa fa-send mr-1" /> Send Test Email</>
                  )}
                </button>
              </div>
            </div>

            {/* Variable fill-in */}
            {template?.variables?.length > 0 && (
              <>
                <div className="mb-2">
                  <label className="col-form-label py-0 font-weight-bold" style={{ fontSize: "0.8rem" }}>
                    Sample Variable Values{" "}
                    <span className="text-muted font-weight-normal">
                      — edit these to customise the test email content
                    </span>
                  </label>
                </div>
                <div className="row">
                  {template.variables.map((v) => (
                    <div key={v.name} className="col-md-4 col-sm-6 mb-2">
                      <label
                        className="mb-1 d-block"
                        style={{ fontSize: "0.75rem", color: "#555", fontWeight: 600 }}
                        title={v.description}
                      >
                        <code style={{ background: "#f0ece9", color: "#AD6449", padding: "1px 4px", borderRadius: 3 }}>
                          {`{{${v.name}}}`}
                        </code>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={testVars[v.name] ?? ""}
                        onChange={(e) =>
                          setTestVars((prev) => ({ ...prev, [v.name]: e.target.value }))
                        }
                        placeholder={getSampleValue(v.name)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Split pane: editor left, preview right */}
      <div className="row" style={{ height: "calc(100vh - 220px)", minHeight: 500 }}>
        {/* LEFT — Editor */}
        <div className="col-md-5 d-flex flex-column" style={{ height: "100%" }}>
          <div className="card flex-fill mb-0" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div
              className="card-header py-2"
              style={{ background: "#f8f9fa", borderBottom: "1px solid #dee2e6", flexShrink: 0 }}
            >
              <strong style={{ fontSize: "0.85rem" }}>Editor</strong>
            </div>
            <div className="card-body p-3 d-flex flex-column" style={{ overflow: "auto", flex: 1 }}>

              {/* Variables */}
              {template?.variables?.length > 0 && (
                <div className="mb-3">
                  <label className="col-form-label py-1 font-weight-bold" style={{ fontSize: "0.8rem" }}>
                    Available Variables <span className="text-muted font-weight-normal">(click to copy)</span>
                  </label>
                  <div className="d-flex flex-wrap" style={{ gap: 4 }}>
                    {template.variables.map((v) => (
                      <code
                        key={v.name}
                        className="badge badge-secondary"
                        style={{ fontSize: "0.8em", cursor: "pointer", padding: "4px 7px" }}
                        title={v.description || v.name}
                        onClick={() => insertVariable(v.name)}
                      >
                        {`{{${v.name}}}`}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="form-group mb-3">
                <label className="col-form-label py-1 font-weight-bold" style={{ fontSize: "0.8rem" }}>
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={subject}
                  onChange={handleSubjectChange}
                  placeholder="Email subject..."
                />
                {template?.defaultSubject && template.defaultSubject !== subject && (
                  <small className="text-muted">Default: {template.defaultSubject}</small>
                )}
              </div>

              {/* Body */}
              <div className="form-group d-flex flex-column" style={{ flex: 1, minHeight: 0 }}>
                <label className="col-form-label py-1 font-weight-bold" style={{ fontSize: "0.8rem" }}>
                  Body <span className="text-muted font-weight-normal">(HTML supported)</span>
                </label>
                <textarea
                  className="form-control flex-fill"
                  value={body}
                  onChange={handleBodyChange}
                  style={{ fontFamily: "monospace", fontSize: "12px", resize: "none", flex: 1, minHeight: 200 }}
                  placeholder="Email body HTML... Use {{variable}} placeholders."
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Preview */}
        <div className="col-md-7 d-flex flex-column" style={{ height: "100%" }}>
          <div className="card flex-fill mb-0" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div
              className="card-header py-2 d-flex align-items-center justify-content-between"
              style={{ background: "#f8f9fa", borderBottom: "1px solid #dee2e6", flexShrink: 0 }}
            >
              <strong style={{ fontSize: "0.85rem" }}>Preview</strong>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                Updates live as you type
              </span>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <iframe
                ref={iframeRef}
                title="Email Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplateEditor;
