import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const BrowseCategoriesCreate = () => {
  const navigate = useNavigate();

  const [homepageId, setHomepageId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    buttonName: "",
    buttonLink: "",
    tags: [{ title: "", icon: null }]
  });

  const [iconPreviews, setIconPreviews] = useState([null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ensureHomepage = async () => {
      try {
        const res = await getAPI("/api/homepage");
        let page = res.data.data?.[0];
        if (!page) {
          toast.error("No Homepage draft found. Create the page first.");
          navigate("/super-admin/homepage/create");
          return;
        }
        setHomepageId(page._id);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Homepage");
      }
    };
    ensureHomepage();
  }, []);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
      toast.error(`${type} must be JPEG, PNG, or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, tagIdx = null, field = null) => {
    const { name, value, files } = e.target;

    if (tagIdx !== null && field !== null) {
      const updatedTags = [...formData.tags];
      if (field === "icon" && files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Tag Icon")) return;
        updatedTags[tagIdx][field] = file;
        const updatedPreviews = [...iconPreviews];
        updatedPreviews[tagIdx] = URL.createObjectURL(file);
        setIconPreviews(updatedPreviews);
      } else {
        updatedTags[tagIdx][field] = value;
      }
      setFormData({ ...formData, tags: updatedTags });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, { title: "", icon: null }] });
    setIconPreviews([...iconPreviews, null]);
  };

  const removeTag = (idx) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) });
    setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homepageId) {
      toast.error("Homepage not ready yet. Please wait.");
      return;
    }

    setLoading(true);
    try {
      if (!formData.heading.trim() || !formData.description.trim() || !formData.buttonName.trim() || !formData.buttonLink.trim()) {
        toast.error("All main fields are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.tags.length; i++) {
        const tag = formData.tags[i];
        if (!tag.title.trim() || !tag.icon) {
          toast.error(`Tag ${i + 1} requires a title and icon`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("homepageId", homepageId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      submissionData.append("buttonName", formData.buttonName.trim());
      submissionData.append("buttonLink", formData.buttonLink.trim());

      formData.tags.forEach((tag, idx) => {
        submissionData.append(`tags[${idx}][title]`, tag.title.trim());
        if (tag.icon) submissionData.append(`tags[${idx}][icon]`, tag.icon);
      });

      const res = await postAPI("/api/homepage-sections/browse-categories/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Browse Categories section created successfully!");
        navigate("/super-admin/homepage/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to create section");
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
        <h2>Create Browse Categories Section</h2>

        {!homepageId && <p className="text-warning">Loading Homepage, please wait...</p>}

        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                
                <div className="form-group">
                  <label>Heading *</label>
                  <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows={4} required />
                </div>

                <div className="form-group">
                  <label>Button Name *</label>
                  <input type="text" name="buttonName" value={formData.buttonName} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group">
                  <label>Button Link *</label>
                  <input type="text" name="buttonLink" value={formData.buttonLink} onChange={handleChange} className="form-control" required />
                </div>

                
                <h4>Tags</h4>
                {formData.tags.map((tag, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Tag Title *</label>
                      <input type="text" value={tag.title} onChange={(e) => handleChange(e, idx, "title")} className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>Tag Icon *</label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "icon")} className="form-control" required />
                      {iconPreviews[idx] && <img src={iconPreviews[idx]} alt="Icon Preview" style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }} />}
                    </div>

                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeTag(idx)}>Remove Tag</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addTag}>Add Tag</button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !homepageId}>
                    {loading ? "Creating..." : "Create Browse Categories Section"}
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

export default BrowseCategoriesCreate;
