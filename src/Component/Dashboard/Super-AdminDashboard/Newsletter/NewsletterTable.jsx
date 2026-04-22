import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";
import ConfirmationDialog from "../../ConfirmationDialog";
import ProductRequestSkeleton from "../../../Skeleton/artist/ProductRequestSkeleton";

const TEMPLATE_VARS = [
  { tag: "{{name}}", desc: "First name" },
  { tag: "{{lastName}}", desc: "Last name" },
  { tag: "{{fullName}}", desc: "Full name" },
  { tag: "{{email}}", desc: "Email address" },
  { tag: "{{phone}}", desc: "Phone number" },
  { tag: "{{username}}", desc: "Username" },
  { tag: "{{userType}}", desc: "User type (Artist / Seller / Buyer)" },
  { tag: "{{status}}", desc: "Account status (Verified / Unverified / Rejected)" },
  { tag: "{{artsaysId}}", desc: "Artsays ID (e.g. AAID123456)" },
  { tag: "{{city}}", desc: "City from address" },
  { tag: "{{state}}", desc: "State from address" },
  { tag: "{{country}}", desc: "Country from address" },
];

const VariableBadges = ({ onInsert }) => (
  <div className="alert alert-info py-2 mb-3" style={{ fontSize: "13px" }}>
    <div className="mb-1"><strong><i className="fa fa-code mr-1"></i>Available Variables</strong> <span className="text-muted">— click any tag to insert into body (blank if recipient has no value)</span></div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
      {TEMPLATE_VARS.map(({ tag, desc }) => (
        <span
          key={tag}
          className="badge badge-light border"
          style={{ fontFamily: "monospace", cursor: "pointer", padding: "4px 7px" }}
          title={desc}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const NewsletterTable = () => {
  const [activeTab, setActiveTab] = useState("subscribers");

  // Subscribers state
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSubscriber, setDeleteSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compose state
  const [composeSubject, setComposeSubject] = useState("");
  const [composeHtml, setComposeHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [recipientType, setRecipientType] = useState("newsletter");
  const [recipientCounts, setRecipientCounts] = useState({ newsletter: 0, all: 0, artist: 0, artist_approved: 0, artist_unapproved: 0, seller: 0, seller_approved: 0, seller_unapproved: 0, buyer: 0, buyer_approved: 0, buyer_unapproved: 0 });
  const [customEmails, setCustomEmails] = useState([]);
  const [customEmailInput, setCustomEmailInput] = useState("");
  const composeHtmlRef = useRef(null);
  const templateHtmlRef = useRef(null);

  const insertAtCursor = (ref, setter, tag) => {
    const el = ref.current;
    if (!el) { setter((prev) => prev + tag); return; }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    setter((prev) => prev.substring(0, start) + tag + prev.substring(end));
    requestAnimationFrame(() => {
      el.selectionStart = start + tag.length;
      el.selectionEnd = start + tag.length;
      el.focus();
    });
  };

  // Templates state
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateHtml, setTemplateHtml] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [isDeleteTemplateDialogOpen, setIsDeleteTemplateDialogOpen] = useState(false);
  const [deleteTemplateItem, setDeleteTemplateItem] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };

  // ─── Fetch subscribers ───
  const fetchSubscribers = async () => {
    try {
      const response = await getAPI("/api/newsletter");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setSubscribers(data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch subscribers");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch templates ───
  const fetchTemplates = async () => {
    try {
      const response = await getAPI("/api/newsletter/templates");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // ─── Fetch recipient counts ───
  const fetchRecipientCounts = async () => {
    try {
      const response = await getAPI("/api/newsletter/recipient-counts");
      if (response.data?.data) {
        const d = response.data.data;
        // "all" = newsletter subscribers + all users (deduplication handled on backend)
        setRecipientCounts({ ...d, all: d.newsletter + d.artist + d.seller + d.buyer });
      }
    } catch (error) {
      console.error("Error fetching recipient counts:", error);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchTemplates();
    fetchRecipientCounts();
  }, []);

  // ─── Subscriber delete ───
  const handleDeleteConfirmed = (id) => {
    setSubscribers((prev) => prev.filter((sub) => sub._id !== id));
    setIsDeleteDialogOpen(false);
    setDeleteSubscriber(null);
  };

  const openDeleteDialog = (subscriber) => {
    setDeleteSubscriber(subscriber);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteSubscriber(null);
  };

  // ─── Template delete ───
  const handleDeleteTemplateConfirmed = async () => {
    if (!deleteTemplateItem) return;
    try {
      await axiosInstance.delete(`/api/newsletter/templates/${deleteTemplateItem._id}`, authHeaders);
      setTemplates((prev) => prev.filter((t) => t._id !== deleteTemplateItem._id));
      toast.success("Template deleted");
    } catch (error) {
      toast.error("Failed to delete template");
    } finally {
      setIsDeleteTemplateDialogOpen(false);
      setDeleteTemplateItem(null);
    }
  };

  // ─── Custom email helpers ───
  const addCustomEmail = () => {
    const email = customEmailInput.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Invalid email address."); return; }
    if (customEmails.includes(email)) { toast.warning("Email already added."); return; }
    setCustomEmails((prev) => [...prev, email]);
    setCustomEmailInput("");
  };

  const removeCustomEmail = (email) => setCustomEmails((prev) => prev.filter((e) => e !== email));

  // ─── Send bulk email ───
  const handleSendBulk = async () => {
    if (!composeSubject.trim() || !composeHtml.trim()) {
      toast.error("Subject and HTML content are required.");
      return;
    }
    if (recipientType === "custom" && customEmails.length === 0) {
      toast.error("Add at least one custom email address.");
      return;
    }
    setSending(true);
    try {
      const payload = { subject: composeSubject, htmlContent: composeHtml, recipientType };
      if (recipientType === "custom") payload.customEmails = customEmails;
      const res = await axiosInstance.post("/api/newsletter/send-bulk", payload, authHeaders);
      toast.success(res.data.message || "Emails sent successfully!");
      setComposeSubject("");
      setComposeHtml("");
      setSelectedTemplateId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  // ─── Save template ───
  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !templateSubject.trim() || !templateHtml.trim()) {
      toast.error("All fields are required.");
      return;
    }
    setSavingTemplate(true);
    try {
      const res = await axiosInstance.post("/api/newsletter/templates", { name: templateName, subject: templateSubject, htmlContent: templateHtml }, authHeaders);
      toast.success("Template saved!");
      setTemplates((prev) => [res.data.data, ...prev]);
      setTemplateName("");
      setTemplateSubject("");
      setTemplateHtml("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save template.");
    } finally {
      setSavingTemplate(false);
    }
  };

  // ─── Load template into compose ───
  const handleUseTemplate = (template) => {
    setComposeSubject(template.subject);
    setComposeHtml(template.htmlContent);
    setSelectedTemplateId(template._id);
    setActiveTab("compose");
    toast.info(`Template "${template.name}" loaded into composer.`);
  };

  // ─── Pagination & filter ───
  const filtered = subscribers.filter((s) => s.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const displayed = filtered.slice(startIndex, startIndex + perPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // ─── Footer preview HTML ───
  const footerPreview = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px; border-top:1px solid #eeeeee;">
      <tr>
        <td style="padding:20px; text-align:center; font-size:12px; color:#888888;">
          <p style="margin:0;">&copy; 2026 Artsays. All rights reserved.</p>
          <p style="margin:8px 0 0;">You are receiving this email because you subscribed to Artsays.</p>
          <p style="margin:8px 0 0;">
            <a href="#" style="color:#888888; text-decoration:underline;">Unsubscribe</a> |
            <a href="#" style="color:#888888; text-decoration:underline;">Privacy Policy</a>
          </p>
        </td>
      </tr>
    </table>
  `;

  if (loading) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Newsletter Management</h2>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "subscribers" ? "active" : ""}`} onClick={() => setActiveTab("subscribers")}>
            <i className="fa fa-users mr-1"></i> Subscribers ({subscribers.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "compose" ? "active" : ""}`} onClick={() => setActiveTab("compose")}>
            <i className="fa fa-paper-plane mr-1"></i> Compose & Send
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "templates" ? "active" : ""}`} onClick={() => setActiveTab("templates")}>
            <i className="fa fa-file-code-o mr-1"></i> Templates ({templates.length})
          </button>
        </li>
      </ul>

      {/* ═══════════ SUBSCRIBERS TAB ═══════════ */}
      {activeTab === "subscribers" && (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <label className="mb-0 mr-2">Show</label>
                  <select className="form-control form-control-sm" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{ minWidth: "70px" }}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <label className="mb-0 ml-2">entries</label>
                </div>
                <div className="w-100 w-md-auto d-flex justify-content-end">
                  <input type="text" className="form-control form-control-sm" placeholder="Search by email" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ maxWidth: "200px" }} />
                </div>
              </div>
              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Subscribed At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.length === 0 ? (
                        <tr><td colSpan={4} className="text-center">No subscribers found.</td></tr>
                      ) : (
                        displayed.map((sub, index) => (
                          <tr key={sub._id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{sub.email || "-"}</td>
                            <td>{formatDate(sub.createdAt)}</td>
                            <td>
                              <button className="btn btn-outline-danger btn-sm" title="Delete" onClick={() => openDeleteDialog(sub)}>
                                <i className="fa fa-trash-o"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="pagination d-flex justify-content-between mt-4">
                  <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                    Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
                  </span>
                  <ul className="pagination d-flex justify-content-end w-100">
                    <li className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                      <button className="page-link">Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <li key={pageNumber} className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""}`} onClick={() => setCurrentPage(pageNumber)}>
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    ))}
                    <li className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                      <button className="page-link">Next</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ COMPOSE & SEND TAB ═══════════ */}
      {activeTab === "compose" && (
          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="header">
                  <h2><i className="fa fa-paper-plane mr-2"></i>Compose Newsletter Email</h2>
                  <small>Select recipient group and compose your email. The unsubscribe footer is auto-appended for newsletter subscribers.</small>
                </div>
                <div className="body">
                  {/* Recipient type dropdown */}
                  <div className="form-group">
                    <label><strong>Send To</strong></label>
                    <select
                      className="form-control"
                      value={recipientType}
                      onChange={(e) => setRecipientType(e.target.value)}
                    >
                      <option value="all">All ({recipientCounts.all})</option>
                      <option value="newsletter">Newsletter Subscribers ({recipientCounts.newsletter})</option>
                      <optgroup label="Artists">
                        <option value="artist">All Artists ({recipientCounts.artist})</option>
                        <option value="artist_approved">Approved Artists ({recipientCounts.artist_approved})</option>
                        <option value="artist_unapproved">Unapproved Artists ({recipientCounts.artist_unapproved})</option>
                      </optgroup>
                      <optgroup label="Sellers">
                        <option value="seller">All Sellers ({recipientCounts.seller})</option>
                        <option value="seller_approved">Approved Sellers ({recipientCounts.seller_approved})</option>
                        <option value="seller_unapproved">Unapproved Sellers ({recipientCounts.seller_unapproved})</option>
                      </optgroup>
                      <optgroup label="Buyers">
                        <option value="buyer">All Buyers ({recipientCounts.buyer})</option>
                        <option value="buyer_approved">Approved Buyers ({recipientCounts.buyer_approved})</option>
                        <option value="buyer_unapproved">Unapproved Buyers ({recipientCounts.buyer_unapproved})</option>
                      </optgroup>
                      <option value="custom">Custom Email Address(es)</option>
                    </select>
                  </div>

                  {/* Custom email input */}
                  {recipientType === "custom" && (
                    <div className="form-group">
                      <label><strong>Custom Email Addresses</strong></label>
                      <div className="input-group mb-2">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter email address and press Add"
                          value={customEmailInput}
                          onChange={(e) => setCustomEmailInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomEmail(); } }}
                        />
                        <div className="input-group-append">
                          <button className="btn btn-outline-primary" type="button" onClick={addCustomEmail}>
                            <i className="fa fa-plus mr-1"></i> Add
                          </button>
                        </div>
                      </div>
                      {customEmails.length === 0 ? (
                        <small className="text-muted">No email addresses added yet.</small>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {customEmails.map((email) => (
                            <span key={email} className="badge badge-primary" style={{ fontSize: "13px", padding: "6px 10px" }}>
                              {email}
                              <button
                                type="button"
                                className="close ml-2"
                                style={{ fontSize: "14px", color: "#fff", lineHeight: 1 }}
                                onClick={() => removeCustomEmail(email)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick template select */}
                  {templates.length > 0 && (
                    <div className="form-group">
                      <label><strong>Load from Template</strong></label>
                      <select
                        className="form-control"
                        value={selectedTemplateId}
                        onChange={(e) => {
                          const tmpl = templates.find((t) => t._id === e.target.value);
                          if (tmpl) {
                            setComposeSubject(tmpl.subject);
                            setComposeHtml(tmpl.htmlContent);
                            setSelectedTemplateId(tmpl._id);
                          }
                        }}
                      >
                        <option value="">-- Select a template --</option>
                        {templates.map((t) => (
                          <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Available variables */}
                  <VariableBadges onInsert={(tag) => insertAtCursor(composeHtmlRef, setComposeHtml, tag)} />

                  <div className="form-group">
                    <label><strong>Subject</strong></label>
                    <input type="text" className="form-control" placeholder="Enter email subject" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label><strong>Email Body (HTML)</strong></label>
                    <div className="row">
                      <div className="col-md-6">
                        <textarea
                          ref={composeHtmlRef}
                          className="form-control"
                          placeholder="Paste or write your HTML email content here..."
                          value={composeHtml}
                          onChange={(e) => setComposeHtml(e.target.value)}
                          style={{ fontFamily: "monospace", fontSize: "13px", height: "100%" }}
                        />
                      </div>
                      <div className="col-md-6">
                        <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "15px", minHeight: "370px", backgroundColor: "#fff", overflow: "auto" }}>
                          <p style={{ color: "#999", fontSize: "11px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Live Preview</p>
                          <div dangerouslySetInnerHTML={{ __html: composeHtml + footerPreview }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted">
                      <i className="fa fa-info-circle mr-1"></i>
                      Sending to <strong>{recipientType === "custom" ? customEmails.length : (recipientCounts[recipientType] || 0)}</strong> recipient(s)
                    </span>
                    <button className="btn btn-primary" onClick={handleSendBulk} disabled={sending || !composeSubject.trim() || !composeHtml.trim() || (recipientType === "custom" && customEmails.length === 0)}>
                      {sending ? (
                        <><i className="fa fa-spinner fa-spin mr-1"></i> Sending...</>
                      ) : (
                        <><i className="fa fa-paper-plane mr-1"></i> Send ({recipientType === "custom" ? customEmails.length : (recipientCounts[recipientType] || 0)} recipients)</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ═══════════ TEMPLATES TAB ═══════════ */}
      {activeTab === "templates" && (
        <div className="row clearfix">
          {/* Create template form */}
          <div className="col-lg-12">
            <div className="card">
              <div className="header">
                <h2><i className="fa fa-plus-circle mr-2"></i>Create New Template</h2>
              </div>
              <div className="body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label><strong>Template Name</strong></label>
                      <input type="text" className="form-control" placeholder="e.g. Monthly Newsletter" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label><strong>Email Subject</strong></label>
                      <input type="text" className="form-control" placeholder="e.g. Artsays Monthly Update" value={templateSubject} onChange={(e) => setTemplateSubject(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Available variables */}
                <VariableBadges onInsert={(tag) => insertAtCursor(templateHtmlRef, setTemplateHtml, tag)} />

                <div className="form-group">
                  <label><strong>HTML Content</strong></label>
                  <div className="row">
                    <div className="col-md-6">
                      <textarea
                        ref={templateHtmlRef}
                        className="form-control"
                        rows={14}
                        placeholder="Write your HTML template content here..."
                        value={templateHtml}
                        onChange={(e) => setTemplateHtml(e.target.value)}
                        style={{ fontFamily: "monospace", fontSize: "13px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "15px", minHeight: "322px", backgroundColor: "#fff", overflow: "auto" }}>
                        <p style={{ color: "#999", fontSize: "11px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Live Preview</p>
                        <div dangerouslySetInnerHTML={{ __html: templateHtml + footerPreview }} />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-success mt-2" onClick={handleSaveTemplate} disabled={savingTemplate || !templateName.trim() || !templateSubject.trim() || !templateHtml.trim()}>
                  {savingTemplate ? (
                    <><i className="fa fa-spinner fa-spin mr-1"></i> Saving...</>
                  ) : (
                    <><i className="fa fa-save mr-1"></i> Save Template</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Saved templates list */}
          <div className="col-lg-12">
            <div className="card">
              <div className="header">
                <h2><i className="fa fa-list mr-2"></i>Saved Templates</h2>
              </div>
              <div className="body">
                {templates.length === 0 ? (
                  <p className="text-muted text-center">No templates saved yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Subject</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((tmpl, index) => (
                          <tr key={tmpl._id}>
                            <td>{index + 1}</td>
                            <td>{tmpl.name}</td>
                            <td>{tmpl.subject}</td>
                            <td>{formatDate(tmpl.createdAt)}</td>
                            <td>
                              <button className="btn btn-outline-primary btn-sm mr-1" title="Preview" onClick={() => setPreviewTemplate(previewTemplate?._id === tmpl._id ? null : tmpl)}>
                                <i className="fa fa-eye"></i>
                              </button>
                              <button className="btn btn-outline-success btn-sm mr-1" title="Use in Compose" onClick={() => handleUseTemplate(tmpl)}>
                                <i className="fa fa-paper-plane"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" title="Delete" onClick={() => { setDeleteTemplateItem(tmpl); setIsDeleteTemplateDialogOpen(true); }}>
                                <i className="fa fa-trash-o"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Inline preview */}
                {previewTemplate && (
                  <div className="mt-3" style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "20px", backgroundColor: "#fafafa" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Preview: {previewTemplate.name}</h5>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setPreviewTemplate(null)}>
                        <i className="fa fa-times"></i> Close
                      </button>
                    </div>
                    <p><strong>Subject:</strong> {previewTemplate.subject}</p>
                    <div style={{ border: "1px solid #eee", borderRadius: "4px", padding: "15px", backgroundColor: "#fff" }}>
                      <div dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent + footerPreview }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete subscriber dialog */}
      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="newsletter subscriber"
          id={deleteSubscriber?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {/* Delete template dialog */}
      {isDeleteTemplateDialogOpen && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => { setIsDeleteTemplateDialogOpen(false); setDeleteTemplateItem(null); }}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Template</h5>
                <button type="button" className="close" onClick={() => { setIsDeleteTemplateDialogOpen(false); setDeleteTemplateItem(null); }}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the template <strong>"{deleteTemplateItem?.name}"</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setIsDeleteTemplateDialogOpen(false); setDeleteTemplateItem(null); }}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteTemplateConfirmed}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterTable;
