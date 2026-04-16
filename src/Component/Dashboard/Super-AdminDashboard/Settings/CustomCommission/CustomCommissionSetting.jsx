import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";
import { getImageUrl } from "../../../../../utils/getImageUrl";
import { toast } from "react-toastify";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

const DEFAULT_PROFILE_IMAGE = "/assets/profile/user.png";
const emptyRow = () => ({ subCategoryId: "", subCategoryName: "", oldRate: "", newRate: "" });

const CustomCommissionSetting = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [rows, setRows] = useState([emptyRow()]);
  const [saving, setSaving] = useState(false);

  // Table controls
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchArtists = async () => {
    try {
      const response = await getAPI("/api/custom-commission/artists", {}, true);
      if (!response.hasError && response.data && Array.isArray(response.data.data)) {
        setArtists(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await getAPI("/api/sub-category", {}, true);
      if (!response.hasError && response.data) {
        const list = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        setSubcategories(list);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchSubcategories();
  }, []);

  // Table filtering & pagination
  const filtered = artists.filter(
    (a) =>
      `${a.name} ${a.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Modal handlers
  const openModal = (artist) => {
    setSelectedArtist(artist);
    const existing = artist.customCommissionRates || [];
    if (existing.length > 0) {
      setRows(
        existing.map((r) => {
          const sub = subcategories.find((s) => s._id === String(r.subCategoryId));
          return {
            subCategoryId: r.subCategoryId || "",
            subCategoryName: r.subCategoryName || "",
            oldRate: sub ? String(sub.commissionTerm) : "",
            newRate: String(r.commissionRate),
          };
        })
      );
    } else {
      setRows([emptyRow()]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedArtist(null);
    setRows([emptyRow()]);
  };

  const handleSubcatChange = (index, subcatId) => {
    const sub = subcategories.find((s) => s._id === subcatId);
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              subCategoryId: subcatId,
              subCategoryName: sub ? sub.subCategoryName : "",
              oldRate: sub ? String(sub.commissionTerm) : "",
              newRate: row.newRate,
            }
          : row
      )
    );
  };

  const handleNewRateChange = (index, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, newRate: value } : row))
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index) => {
    if (rows.length > 1) setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    for (const row of rows) {
      if (!row.subCategoryName) {
        toast.error("Please select a subcategory for each row.");
        return;
      }
      const rate = parseFloat(row.newRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error(`Enter a valid commission rate (0–100) for ${row.subCategoryName}.`);
        return;
      }
    }
    const names = rows.map((r) => r.subCategoryName);
    const dup = names.find((n, i) => names.indexOf(n) !== i);
    if (dup) { toast.error(`Duplicate subcategory: ${dup}`); return; }

    setSaving(true);
    try {
      const commissionRates = rows.map((r) => ({
        subCategoryId: r.subCategoryId,
        subCategoryName: r.subCategoryName,
        commissionRate: parseFloat(r.newRate),
      }));
      const response = await putAPI(
        `/api/custom-commission/set/${selectedArtist._id}`,
        { commissionRates }
      );
      if (!response.hasError) {
        toast.success(`Commission rates saved for ${selectedArtist.name}`);
        fetchArtists();
        closeModal();
      } else {
        toast.error(response.message || "Failed to save.");
      }
    } catch (err) {
      toast.error("Error saving commission rates.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = async () => {
    setSaving(true);
    try {
      const response = await putAPI(
        `/api/custom-commission/set/${selectedArtist._id}`,
        { commissionRates: [] }
      );
      if (!response.hasError) {
        toast.success(`All custom rates cleared for ${selectedArtist.name}.`);
        fetchArtists();
        closeModal();
      } else {
        toast.error(response.message || "Failed to clear.");
      }
    } catch (err) {
      toast.error("Error clearing rates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Custom Commission</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Settings</li>
              <li className="breadcrumb-item">Custom Commission</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="clearfix row">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
              <div className="mb-2 d-none d-md-flex align-items-center mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ minWidth: "70px" }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "180px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                  <i
                    className="fa fa-search"
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  ></i>
                </div>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap js-basic-example dataTable table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>AAID/ASID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Custom Commission Rates</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No artists or sellers found.
                        </td>
                      </tr>
                    ) : (
                      displayed.map((artist, index) => (
                        <tr key={artist._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td><span className="phone">{artist.artsaysId || '-'}</span></td>
                          <td>
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                              <img
                                src={
                                  artist.profilePhoto && artist.profilePhoto !== "null"
                                    ? getImageUrl(artist.profilePhoto)
                                    : DEFAULT_PROFILE_IMAGE
                                }
                                alt={artist.name}
                                style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                              />
                              <span>{artist.name} {artist.lastName || ""}</span>
                            </div>
                          </td>
                          <td>{artist.email || "—"}</td>
                          <td>{artist.userType}</td>
                          <td>
                            {artist.customCommissionRates?.length > 0 ? (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {artist.customCommissionRates.map((r) => (
                                  <span key={r.subCategoryName} className="badge badge-success" style={{ fontSize: 11 }}>
                                    {r.subCategoryName}: {r.commissionRate}%
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="badge badge-secondary">Subcategory Default</span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="mr-1 btn btn-outline-info btn-sm"
                              title="Set Commission"
                              onClick={() => openModal(artist)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            {artist.customCommissionRates?.length > 0 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                title="Clear All Custom Rates"
                                onClick={async () => {
                                  try {
                                    const res = await putAPI(`/api/custom-commission/set/${artist._id}`, { commissionRates: [] });
                                    if (!res.hasError) { toast.success("Custom rates cleared."); fetchArtists(); }
                                    else toast.error(res.message || "Failed.");
                                  } catch { toast.error("Error clearing rates."); }
                                }}
                              >
                                <i className="fa fa-trash-o"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 pagination d-flex justify-content-between">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`paginate_button page-item ${currentPage === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`paginate_button page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Commission Modal */}
      {modalOpen && selectedArtist && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Set Commission — {selectedArtist.name} {selectedArtist.lastName || ""}
                </h5>
                <button type="button" className="close" onClick={closeModal} disabled={saving}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <p className="mb-3 text-muted" style={{ fontSize: 13 }}>
                  Select subcategories and enter a custom commission rate. The <strong>Old %</strong> shows
                  the subcategory's default rate. The <strong>New %</strong> is your custom override.
                </p>

                {rows.map((row, index) => (
                  <div className="mb-2" key={index}>
                    <div className="mb-2 row">
                      <div className="col-md-5">
                        <div className="">
                          <label className="form-label">Subcategory</label>
                          <Select
                            options={subcategories.map((s) => ({
                              value: s._id,
                              label: s.subCategoryName,
                            }))}
                            value={
                              row.subCategoryId
                                ? { value: row.subCategoryId, label: row.subCategoryName }
                                : null
                            }
                            onChange={(opt) => handleSubcatChange(index, opt ? opt.value : "")}
                            isDisabled={saving}
                            isClearable
                            isSearchable
                            placeholder="— Select Subcategory —"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="">
                          <label className="form-label">Old Commission %</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={row.oldRate !== "" ? row.oldRate : "—"}
                              readOnly
                              style={{ background: "#f5f5f5", color: "#888" }}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="">
                          <label className="form-label">New Commission %</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="e.g. 12"
                              min={0}
                              max={100}
                              step={0.01}
                              value={row.newRate}
                              onChange={(e) => handleNewRateChange(index, e.target.value)}
                              disabled={saving || !row.subCategoryId}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 col-md-1 d-flex align-items-end">
                        {rows.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeRow(index)}
                            disabled={saving}
                            title="Remove row"
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Add row button after last row */}
                    {index === rows.length - 1 && (
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={addRow}
                            disabled={saving}
                          >
                            <i className="mr-1 fa fa-plus"></i> Add Subcategory
                          </button>
                        </div>
                      </div>
                    )}

                    {index < rows.length - 1 && <hr />}
                  </div>
                ))}
              </div>

              <div className="modal-footer d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleClearAll}
                  disabled={saving || !selectedArtist.customCommissionRates?.length}
                >
                  <i className="mr-1 fa fa-trash-o"></i> Clear All Rates
                </button>
                <div>
                  <button
                    type="button"
                    className="mr-2 btn btn-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Commission Rates"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCommissionSetting;
