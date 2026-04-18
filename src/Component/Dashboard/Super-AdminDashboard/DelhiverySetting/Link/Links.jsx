import React, { useState, useEffect, useCallback } from "react";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

export default function DelhiveryLoginLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAPI(`${API_BASE}/api/get-delhivery-links`);

      if (res.data && !res.data.hasError) {
        const normalizedLinks = (res.data.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setLinks(normalizedLinks);
      } else {
        setLinks([]);
      }
    } catch (err) {
      console.error("Failed to load Delhivery links:", err);
      toast.error("Failed to load Delhivery links");
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addNewLink = () => {
    setLinks((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: "",
        testLink: "",
        productionLink: "",
      },
    ]);
  };

  const removeLink = (idToRemove) => {
    setLinks((prev) => prev.filter((link) => link.id !== idToRemove));
  };

  const handleChange = (id, field, value) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    );
  };

  const handleSave = async () => {
    const payload = links.map(({ id, _id, createdAt, updatedAt, ...rest }) => ({
      ...rest,
    }));

    if (
      payload.some(
        (item) =>
          !item.name?.trim() ||
          !item.testLink?.trim() ||
          !item.productionLink?.trim(),
      )
    ) {
      toast.error("All fields are required for each link");
      return;
    }

    setSaving(true);
    try {
      await postAPI(`${API_BASE}/api/save-delhivery-links`, payload);
      toast.success("Delhivery links saved successfully!");
      await fetchLinks();
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to save Delhivery links";
      toast.error(msg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="block-header">
          <h2>Delhivery Login Links</h2>
        </div>
        <div className="card">
          <div className="body text-center p-5">Loading links...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Delhivery  Links</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">Delhivery Links</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <div className="mb-4">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={addNewLink}
                >
                  + Add New Link
                </button>
              </div>

              {links.length === 0 ? (
                <div className="alert alert-info text-center py-4">
                  No links configured yet.
                  <br />
                  Click "Add New Link" to create entries (Shipping Address,
                  Pickup Location, etc.)
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ minWidth: "180px" }}>Link Name</th>
                        <th style={{ minWidth: "280px" }}>
                          Test / Sandbox URL
                        </th>
                        <th style={{ minWidth: "280px" }}>
                          Production / Live URL
                        </th>
                        <th style={{ width: "90px" }} className="text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => (
                        <tr key={link.id}>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={link.name || ""}
                              onChange={(e) =>
                                handleChange(link.id, "name", e.target.value)
                              }
                              placeholder="e.g. Shipping Address API"
                            />
                          </td>
                          <td>
                            <input
                              type="url"
                              className="form-control"
                              value={link.testLink || ""}
                              onChange={(e) =>
                                handleChange(
                                  link.id,
                                  "testLink",
                                  e.target.value,
                                )
                              }
                              placeholder="https://staging.delhivery.com/..."
                            />
                          </td>
                          <td>
                            <input
                              type="url"
                              className="form-control"
                              value={link.productionLink || ""}
                              onChange={(e) =>
                                handleChange(
                                  link.id,
                                  "productionLink",
                                  e.target.value,
                                )
                              }
                              placeholder="https://api.delhivery.com/..."
                            />
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeLink(link.id)}
                              title="Remove this link"
                            >
                              × Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {links.length > 0 && (
                <div className="text-end mt-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg px-5"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save All Links"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
