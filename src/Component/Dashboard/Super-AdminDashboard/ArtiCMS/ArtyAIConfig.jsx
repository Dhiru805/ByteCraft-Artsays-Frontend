import React, { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";

const ArtyAIConfig = () => {
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [config, setConfig] = useState({
    moreInfo: "",
    accessibleTables: []
  });

  const fetchCollections = async () => {
    try {
      const response = await getAPI("/api/arty-config/collections");
      if (!response.hasError && response.data.data) {
        setAvailableTables(response.data.data.sort());
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await getAPI("/api/arty-config/get");
      if (!response.hasError && response.data.data) {
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

  const handleTableToggle = (table) => {
    setConfig(prev => {
      const isAccessible = prev.accessibleTables.includes(table);
      if (isAccessible) {
        return { ...prev, accessibleTables: prev.accessibleTables.filter(t => t !== table) };
      } else {
        return { ...prev, accessibleTables: [...prev.accessibleTables, table] };
      }
    });
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

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Arty AI Configuration</h5>
        <p className="text-muted small mb-0">Configure Arty's knowledge base and personality</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="font-weight-bold">Arty "More Info" / System Knowledge</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Provide additional details or instructions for Arty to use when answering questions..."
              value={config.moreInfo}
              onChange={(e) => setConfig({ ...config, moreInfo: e.target.value })}
            />
            <small className="text-muted">This info is used by Arty when a direct match is not found in FAQs or Blogs.</small>
          </div>

          <div className="form-group mb-4">
            <label className="font-weight-bold d-block mb-2">Accessible Database Tables</label>
            <div className="row">
              {availableTables.map((table) => (
                <div key={table} className="col-md-4 col-sm-6 mb-2">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`check-${table}`}
                      checked={config.accessibleTables.includes(table)}
                      onChange={() => handleTableToggle(table)}
                    />
                    <label className="custom-control-label" htmlFor={`check-${table}`}>
                      {table}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <small className="text-muted">Select the tables Arty is permitted to read data from for answering queries.</small>
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
