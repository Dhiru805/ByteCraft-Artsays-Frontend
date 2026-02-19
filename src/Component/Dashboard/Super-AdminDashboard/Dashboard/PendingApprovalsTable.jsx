import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_LABELS = { Product: "Product", Blog: "Blog", Exhibition: "Exhibition", Certification: "Certification" };
const TYPE_BADGE  = { Product: "badge-warning", Blog: "badge-info", Exhibition: "badge-primary", Certification: "badge-success" };

function slaInfo(createdAt) {
  if (!createdAt) return { label: "—", cls: "" };
  const days = (Date.now() - new Date(createdAt)) / 86400000;
  const label = days < 1 ? "Today" : `${Math.floor(days)}d ago`;
  const cls   = days > 3 ? "text-danger" : days > 1 ? "text-warning" : "text-success";
  return { label, cls };
}

export default function PendingApprovalsTable({ data = [], loading }) {
  const navigate = useNavigate();
  const [filter, setFilter]       = useState("all");
  const [searchTerm, setSearch]   = useState("");
  const [currentPage, setPage]    = useState(1);
  const perPage = 5;

    const filtered = data.filter(item => {
      const matchType   = filter === "all" || item.type === filter;
      const matchSearch = (item.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const displayed  = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const routeFor = (type) => ({
    Product:       "/super-admin/artist-management/product-request",
    Blog:          "/super-admin/blogs",
    Exhibition:    "/super-admin/exhibition-management",
    Certification: "/super-admin/certification",
  }[type] || "/super-admin/dashboard");

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex justify-content-between">
            <h2>
              Pending Approvals
            </h2>
            <div className="d-none d-md-flex align-items-center" style={{ gap: 8 }}>
              <select
                className="form-control form-control-sm"
                value={filter}
                onChange={e => { setFilter(e.target.value); setPage(1); }}
                style={{ minWidth: 120 }}
              >
              <option value="all">All Types</option>
                  <option value="Product">Products</option>
                  <option value="Blog">Blogs</option>
                  <option value="Exhibition">Exhibitions</option>
                  <option value="Certification">Certifications</option>
              </select>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ maxWidth: 160 }}
              />
            </div>
          </div>
          <div className="body" style={{ paddingTop: 0 }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name / Title</th>
                    <th>Type</th>
                    <th>Submitted By</th>
                    <th>Date</th>
                    <th>SLA</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-3 text-muted">Loading...</td></tr>
                  ) : displayed.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        <i className="fa fa-check-circle text-success mr-2"></i>No pending approvals
                      </td>
                    </tr>
                  ) : (
                    displayed.map((item, i) => {
                      const sla = slaInfo(item.createdAt);
                      return (
                        <tr key={item._id || i}>
                          <td>{(currentPage - 1) * perPage + i + 1}</td>
                            <td className="font-weight-bold">{item.title || "—"}</td>
                          <td>
                            <span className={`badge ${TYPE_BADGE[item.type] || "badge-secondary"}`}>
                              {TYPE_LABELS[item.type] || item.type}
                            </span>
                          </td>
                            <td>{item.requestedBy || "—"}</td>
                          <td><small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "—"}</small></td>
                          <td><small className={`font-weight-bold ${sla.cls}`}>{sla.label}</small></td>
                          <td>
                            <button className="btn btn-default btn-sm" onClick={() => navigate(routeFor(item.type))}>
                              <i className="fa fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
                  Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
                </small>
                <ul className="pagination mb-0">
                  <li className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p => p - 1)}>Previous</button>
                  </li>
                  <li className="paginate_button page-item active">
                    <button className="page-link">{currentPage}</button>
                  </li>
                  <li className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
