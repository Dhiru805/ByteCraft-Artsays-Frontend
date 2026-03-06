import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import deleteAPI from "../../../../../api/deleteAPI";

const FeedbackResponses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filterFormId = params.get("formId") || "";
  const filterFormTitle = params.get("formTitle") || "";

  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(filterFormId);
  const [loading, setLoading] = useState(false);
  const [viewResponse, setViewResponse] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await getAPI("/api/feedback-forms");
        setForms(res?.data?.data || []);
      } catch {
        setForms([]);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    fetchResponses();
  }, [selectedFormId]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const url = selectedFormId
        ? `/api/feedback-responses?formId=${selectedFormId}`
        : "/api/feedback-responses";
      const res = await getAPI(url);
      setResponses(res?.data?.data || []);
      setCurrentPage(1);
    } catch {
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this response?")) return;
    try {
      await deleteAPI(`/api/feedback-responses/${id}`);
      toast.success("Response deleted.");
      fetchResponses();
    } catch {
      toast.error("Failed to delete response.");
    }
  };

  const exportCSV = () => {
    if (!responses.length) return toast.info("No responses to export.");
    const headers = ["#", "User", "Email", "User Type", "Form", "Submitted At"];

    // Collect all unique field labels from the responses
    const allLabels = [];
    responses.forEach((r) => {
      (r.answers || []).forEach((a) => {
        if (a.label && !allLabels.includes(a.label)) allLabels.push(a.label);
      });
    });

    const rows = responses.map((r, idx) => {
      const base = [
        idx + 1,
        r.userName || "",
        r.userEmail || "",
        r.userType || "",
        r.formId?.title || "",
        new Date(r.submittedAt).toLocaleString("en-IN"),
      ];
      const answerMap = {};
      (r.answers || []).forEach((a) => {
        answerMap[a.label] = Array.isArray(a.value) ? a.value.join(", ") : a.value || "";
      });
      return [...base, ...allLabels.map((l) => `"${(answerMap[l] || "").toString().replace(/"/g, '""')}"`)]
        .join(",");
    });

    const allHeaders = [...headers, ...allLabels].join(",");
    const csv = [allHeaders, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-responses-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(responses.length / perPage);
  const paginated = responses.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getAnswerPreview = (answers) => {
    if (!answers?.length) return "—";
    return answers
      .slice(0, 2)
      .map((a) => `${a.label}: ${Array.isArray(a.value) ? a.value.join(", ") : a.value || "—"}`)
      .join(" | ");
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Feedback Responses</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard" />
                </span>
              </li>
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/settings/feedback-form")}
                  style={{ cursor: "pointer", color: "#7b5ea7" }}
                >
                  Feedback Form
                </span>
              </li>
              <li className="breadcrumb-item">Responses</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12" style={{ textAlign: "right", paddingTop: 20 }}>
            <button
              className="btn btn-default mr-2"
              onClick={() => navigate("/super-admin/settings/feedback-form")}
            >
              <i className="fa fa-arrow-left mr-1" /> Back to Forms
            </button>
            <button className="btn btn-success" onClick={exportCSV}>
              <i className="fa fa-download mr-1" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="body">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "0 0 auto", minWidth: 240 }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 4 }}>
                Filter by Form
              </label>
              <select
                className="form-control"
                value={selectedFormId}
                onChange={(e) => setSelectedFormId(e.target.value)}
              >
                <option value="">All Forms</option>
                {forms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button className="btn btn-default" onClick={fetchResponses}>
                <i className="fa fa-refresh mr-1" /> Refresh
              </button>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ fontSize: 13, color: "#888" }}>
                Total: <strong>{responses.length}</strong> response{responses.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="body">
          {loading ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: 28, color: "#7b5ea7" }} />
            </div>
          ) : responses.length === 0 ? (
            <div style={{ textAlign: "center", padding: 50, color: "#aaa" }}>
              <i className="fa fa-inbox" style={{ fontSize: 40, marginBottom: 10 }} />
              <p>No responses found.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead style={{ background: "#f9f7ff" }}>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Form</th>
                      <th>Answers Preview</th>
                      <th>Submitted At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r, idx) => (
                      <tr key={r._id}>
                        <td>{(currentPage - 1) * perPage + idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>{r.userName || "Guest"}</td>
                        <td style={{ fontSize: 12, color: "#777" }}>{r.userEmail || "—"}</td>
                        <td>
                          {r.userType ? (
                            <span className="badge badge-default" style={{ background: "#f3f0ff", color: "#7b5ea7" }}>
                              {r.userType}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td style={{ fontSize: 12 }}>{r.formId?.title || "—"}</td>
                        <td
                          style={{
                            fontSize: 11,
                            color: "#555",
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={getAnswerPreview(r.answers)}
                        >
                          {getAnswerPreview(r.answers)}
                        </td>
                        <td style={{ fontSize: 12, color: "#777" }}>
                          {new Date(r.submittedAt).toLocaleString("en-IN")}
                        </td>
                        <td>
                          <button
                            className="btn btn-xs btn-info mr-1"
                            onClick={() => setViewResponse(r)}
                            title="View full response"
                          >
                            <i className="fa fa-eye" />
                          </button>
                          <button
                            className="btn btn-xs btn-danger"
                            onClick={() => handleDelete(r._id)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 16, flexWrap: "wrap" }}>
                  <button
                    className="btn btn-sm btn-default"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <i className="fa fa-chevron-left" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-default"}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-default"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <i className="fa fa-chevron-right" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── View Response Modal ── */}
      {viewResponse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setViewResponse(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              maxWidth: 600,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: 28,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, alignItems: "flex-start" }}>
              <div>
                <h4 style={{ margin: 0, color: "#2d2d2d" }}>
                  <i className="fa fa-clipboard mr-2" style={{ color: "#7b5ea7" }} />
                  Response Detail
                </h4>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
                  Form: <strong>{viewResponse.formId?.title || "—"}</strong>
                </p>
              </div>
              <button
                className="btn btn-xs btn-default"
                onClick={() => setViewResponse(null)}
              >
                <i className="fa fa-times" />
              </button>
            </div>

            {/* User info */}
            <div
              style={{
                background: "#f9f7ff",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 18,
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                fontSize: 13,
              }}
            >
              <div>
                <span style={{ color: "#888" }}>Name: </span>
                <strong>{viewResponse.userName || "Guest"}</strong>
              </div>
              <div>
                <span style={{ color: "#888" }}>Email: </span>
                <strong>{viewResponse.userEmail || "—"}</strong>
              </div>
              <div>
                <span style={{ color: "#888" }}>Type: </span>
                <strong>{viewResponse.userType || "—"}</strong>
              </div>
              <div>
                <span style={{ color: "#888" }}>Submitted: </span>
                <strong>{new Date(viewResponse.submittedAt).toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {/* Answers */}
            <h5 style={{ marginBottom: 12, color: "#555", fontSize: 14, borderBottom: "1px solid #eee", paddingBottom: 6 }}>
              Answers ({viewResponse.answers?.length || 0})
            </h5>
            {(viewResponse.answers || []).length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center" }}>No answers recorded.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(viewResponse.answers || []).map((a, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fafafa",
                      border: "1px solid #eee",
                      borderRadius: 6,
                      padding: "10px 14px",
                    }}
                  >
                    <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 13, color: "#444" }}>
                      {i + 1}. {a.label}
                    </p>
                    <p style={{ margin: 0, color: "#222", fontSize: 14 }}>
                      {Array.isArray(a.value) ? (
                        a.value.length > 0 ? (
                          <span>
                            {a.value.map((v, vi) => (
                              <span
                                key={vi}
                                style={{
                                  background: "#f3f0ff",
                                  borderRadius: 4,
                                  padding: "1px 8px",
                                  marginRight: 4,
                                  fontSize: 12,
                                  display: "inline-block",
                                }}
                              >
                                {v}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span style={{ color: "#aaa" }}>No selection</span>
                        )
                      ) : a.value !== undefined && a.value !== "" ? (
                        a.value
                      ) : (
                        <span style={{ color: "#aaa" }}>—</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: "right", marginTop: 20 }}>
              <button className="btn btn-default" onClick={() => setViewResponse(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackResponses;
