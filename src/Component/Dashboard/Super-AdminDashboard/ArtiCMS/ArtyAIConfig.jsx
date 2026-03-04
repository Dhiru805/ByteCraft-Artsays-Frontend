import React, { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";

const ArtyAIConfig = () => {
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [availableTables, setAvailableTables] = useState([]); // [{ key, label }]
  const [search, setSearch] = useState("");
  const [config, setConfig] = useState({
    moreInfo: "",
    accessibleTables: [],
  });

  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);
      const response = await getAPI("/api/arty-config/collections");
      if (!response.hasError && response.data?.data) {
        setAvailableTables(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Could not load database collections");
    } finally {
      setCollectionsLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await getAPI("/api/arty-config/get");
      if (!response.hasError && response.data?.data) {
        setConfig(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Arty config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchConfig();
  }, []);

  const handleTableToggle = (key) => {
    setConfig((prev) => {
      const isEnabled = prev.accessibleTables.includes(key);
      return {
        ...prev,
        accessibleTables: isEnabled
          ? prev.accessibleTables.filter((t) => t !== key)
          : [...prev.accessibleTables, key],
      };
    });
  };

  const handleSelectAll = () => {
    setConfig((prev) => ({
      ...prev,
      accessibleTables: availableTables.map((t) => t.key),
    }));
  };

  const handleDeselectAll = () => {
    setConfig((prev) => ({ ...prev, accessibleTables: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await postAPI("/api/arty-config/update", config);
      if (!response.hasError) {
        toast.success("Arty configuration updated successfully");
      } else {
        toast.error(response.message || "Failed to update configuration");
      }
    } catch (error) {
      toast.error("An error occurred while updating configuration");
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filteredTables = availableTables.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.key.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCount = config.accessibleTables.length;
  const totalCount = availableTables.length;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Arty AI Configuration</h5>
        <p className="text-muted small mb-0">
          Configure which database collections Arty learns from and uses to answer user questions.
        </p>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>

          {/* ── System Knowledge ──────────────────────────────────── */}
          <div className="form-group mb-4">
            <label className="font-weight-bold">
              System Knowledge / Additional Instructions
            </label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Provide additional context or instructions for Arty (e.g. platform rules, tone, special info)..."
              value={config.moreInfo}
              onChange={(e) => setConfig({ ...config, moreInfo: e.target.value })}
            />
            <small className="text-muted">
              This text is injected into Arty's system prompt for every conversation.
            </small>
          </div>

          {/* ── Accessible Data Sources ───────────────────────────── */}
          <div className="form-group mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="font-weight-bold mb-0">
                Accessible Database Collections
              </label>
              {!collectionsLoading && totalCount > 0 && (
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleSelectAll}
                  >
                    Select All ({totalCount})
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </button>
                </div>
              )}
            </div>
            <small className="text-muted d-block mb-3">
              All MongoDB collections are listed below. Select which ones Arty can read when answering user questions.
            </small>

            {/* Search */}
            {!collectionsLoading && totalCount > 0 && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search collections..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: 320 }}
                />
              </div>
            )}

            {/* Loading state */}
            {collectionsLoading && (
              <div className="text-muted small py-3">
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                />
                Loading database collections...
              </div>
            )}

            {/* Empty state */}
            {!collectionsLoading && totalCount === 0 && (
              <div
                className="p-3 rounded"
                style={{ backgroundColor: "#fff3e0", fontSize: "0.85rem" }}
              >
                <span style={{ color: "#e65100" }}>
                  No collections found. Make sure the database is connected.
                </span>
              </div>
            )}

            {/* Collection grid */}
            {!collectionsLoading && filteredTables.length > 0 && (
              <div className="row">
                {filteredTables.map((table) => {
                  const isChecked = config.accessibleTables.includes(table.key);
                  return (
                    <div key={table.key} className="col-md-6 col-lg-4 mb-2">
                      <div
                        className={`p-3 border rounded h-100 ${
                          isChecked ? "border-primary" : "border-light"
                        }`}
                        style={{
                          cursor: "pointer",
                          backgroundColor: isChecked ? "#f0f4ff" : "#fafafa",
                          transition: "all 0.15s ease",
                        }}
                        onClick={() => handleTableToggle(table.key)}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            style={{ cursor: "pointer", width: 16, height: 16 }}
                            checked={isChecked}
                            onChange={() => handleTableToggle(table.key)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <div
                              className="font-weight-bold"
                              style={{ fontSize: "0.88rem" }}
                            >
                              {table.label}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem", fontFamily: "monospace" }}
                            >
                              {table.key}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No search results */}
            {!collectionsLoading && totalCount > 0 && filteredTables.length === 0 && (
              <p className="text-muted small">
                No collections match "{search}".
              </p>
            )}

            {/* Status bar */}
            {!collectionsLoading && totalCount > 0 && (
              <div
                className="mt-3 p-2 rounded d-flex align-items-center"
                style={{
                  backgroundColor: selectedCount > 0 ? "#e8f5e9" : "#fff3e0",
                  fontSize: "0.82rem",
                }}
              >
                {selectedCount > 0 ? (
                  <>
                    <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                      {selectedCount} of {totalCount} collection{selectedCount !== 1 ? "s" : ""} enabled.
                    </span>
                    <span className="text-muted ml-2">
                      Arty will query:{" "}
                      {config.accessibleTables
                        .map(
                          (key) =>
                            availableTables.find((t) => t.key === key)?.label || key
                        )
                        .join(", ")}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#e65100" }}>
                    No collections selected — Arty will only use the system knowledge above.
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtyAIConfig;
