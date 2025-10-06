import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const WhoWeAreUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [aboutUsId, setAboutUsId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    image1: null,
    stats: [{ number: "", label: "" }],
    status: "draft",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPage = await getAPI("/api/about-us");
        let page = resPage.data.data?.[0];

        // if (!page) {
        //   const createRes = await postAPI("/api/about-us/create", { title: "About Us" });
        //   page = createRes.data.data;
        // }
        setAboutUsId(page._id);

        if (id) {
          const resSection = await getAPI(`/api/about-us-sections/who-we-are/${aboutUsId}}`);
          if (resSection.data.success && resSection.data.data) {
            const section = resSection.data.data;
            setFormData({
              heading: section.heading || "",
              description: section.description || "",
              image1: null, 
              stats: section.stats.length ? section.stats : [{ number: "", label: "" }],
              status: section.status || "draft",
            });
            if (section.image1) setImagePreview(section.image1); 
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load data");
      }
    };

    fetchData();
  }, [id]);

  const validateImageFile = (file) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`Image must be JPEG or PNG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Image must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (field && index !== null) {
      const list = [...formData.stats];
      list[index][field] = value;
      setFormData({ ...formData, stats: list });
    } else if (files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file)) return;

      setFormData({ ...formData, [name]: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addStat = () => {
    setFormData({ ...formData, stats: [...formData.stats, { number: "", label: "" }] });
  };

  const removeStat = (idx) => {
    setFormData({ ...formData, stats: formData.stats.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aboutUsId) {
      toast.error("About Us page not ready yet. Please wait.");
      return;
    }

    setLoading(true);

    try {
      if (!formData.heading.trim() || !formData.description.trim()) {
        toast.error("Heading & Description are required");
        setLoading(false);
        return;
      }

      formData.stats.forEach((s, idx) => {
        if (!s.number.trim() || !s.label.trim()) {
          throw new Error(`Stat ${idx + 1} requires number and label`);
        }
      });

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      submissionData.append("status", formData.status);
      if (formData.image1) submissionData.append("image1", formData.image1);

      formData.stats.forEach((s, idx) => {
        submissionData.append(`stats[${idx}][number]`, s.number.trim());
        submissionData.append(`stats[${idx}][label]`, s.label.trim());
      });

      const res = await postAPI(`/api/about-us-sections/who-we-are/update/${id}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Who We Are section updated successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to update section");
      }
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Update Who We Are Section</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
           
                <div className="form-group">
                  <label>Heading *</label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    name="image1"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }}
                    />
                  )}
                </div>

                <h4>Stats Section (Dynamic)</h4>
                {formData.stats.map((s, idx) => (
                  <div key={idx} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Number *</label>
                      <input
                        type="text"
                        value={s.number}
                        onChange={(e) => handleChange(e, idx, "number")}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Label *</label>
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => handleChange(e, idx, "label")}
                        className="form-control"
                        required
                      />
                    </div>
                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeStat(idx)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addStat}>
                  Add Stat
                </button>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

              
                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update WhoWeAre Section"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAreUpdate;
