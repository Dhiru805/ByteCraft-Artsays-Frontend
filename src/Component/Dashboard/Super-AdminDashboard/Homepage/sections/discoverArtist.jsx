import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const DiscoverArtistCreate = () => {
  const navigate = useNavigate();

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [homepageId, setHomepageId] = useState(null);

  useEffect(() => {
    const ensureHomePage = async () => {
      try {
        const res = await getAPI("/api/homepage");
        let page = res.data.data?.[0];
        if (!page) {
          const createRes = await postAPI("/api/homepage/create", { title: "Homepage" });
          page = createRes.data.data;
        }
        setHomepageId(page._id);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    ensureHomePage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading.trim() || !description.trim()) {
      toast.error("Heading and Description are required");
      return;
    }

    setLoading(true);
    try {
      if (!homepageId) {
        toast.error("Homepage not ready yet. Please wait.");
        setLoading(false);
        return;
      }

      const payload = { homepageId, heading: heading.trim(), description: description.trim() };

      const res = await postAPI("/api/homepage-sections/discover-artist/create", payload);

      if (res.data.data) {
        toast.success(res.data.message || "Discover Artist section saved successfully!");
        navigate("/super-admin/homepage/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save section");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Discover Artist Section</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Heading *</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Section"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverArtistCreate;
