import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";

const InsuranceEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    section1Heading: "",
    section1Description: "",
    section1Cards: [],
    section2Heading: "",
    section2Description: "",
    section2Cards: [],
    section3Heading: "",
    section3Description: "",
    status: "draft",
  });

  const [section1Previews, setSection1Previews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingPublishedCount, setExistingPublishedCount] = useState(0);

  useEffect(() => {
    if (!page) {
      toast.error("No insurance page provided.");
      navigate("/super-admin/insurance");
      return;
    }

    setFormData({
      section1Heading: page.section1Heading || page.section1?.heading || "",
      section1Description: page.section1Description || page.section1?.description || "",
      section1Cards: (page.section1Cards || page.section1?.cards || []).map((c) => ({
        title: c.title || "",
        description: c.description || "",
        image: null,
        existingImage: c.image || null,
      })),
      section2Heading: page.section2Heading || page.section2?.heading || "",
      section2Description: page.section2Description || page.section2?.description || "",
      section2Cards: (page.section2Cards || page.section2?.cards || []).map((c) => ({
        title: c.title || "",
        description: c.description || "",
      })),
      section3Heading: page.section3Heading || "",
      section3Description: page.section3Description || "",
      status: page.status || "draft",
    });

    const base = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
    setSection1Previews(
      (page.section1Cards || page.section1?.cards || []).map((c) =>
        c.image ? `${base}/${c.image}` : null
      )
    );

    (async () => {
      try {
        const res = await getAPI("/api/insurance");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setExistingPublishedCount(
          data.filter((d) => d.status === "published" && d._id !== page._id).length
        );
      } catch (err) {
        console.warn("Could not fetch insurance pages list", err);
      }
    })();
  }, [page, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateImageFile = (file, friendlyName) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`${friendlyName} must be JPEG or PNG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${friendlyName} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const addSection1Card = () => {
    setFormData((p) => ({
      ...p,
      section1Cards: [...p.section1Cards, { title: "", description: "", image: null, existingImage: null }],
    }));
    setSection1Previews((p) => [...p, null]);
  };

  const updateSection1Card = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy[index][field] = value;
      return { ...p, section1Cards: copy };
    });
  };

  const updateSection1CardImage = (index, file) => {
    if (!file) return;
    if (!validateImageFile(file, "Section 1 Card Image")) return;
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy[index].image = file;
      return { ...p, section1Cards: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy[index] = URL.createObjectURL(file);
      return copy;
    });
  };

  const removeSection1Card = (index) => {
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy.splice(index, 1);
      return { ...p, section1Cards: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeSection1CardImage = (index) => {
    setFormData((p) => {
      const copy = [...p.section1Cards];
      copy[index].image = null;
      copy[index].existingImage = null;
      return { ...p, section1Cards: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy[index] = null;
      return copy;
    });
  };

  const addSection2Card = () => {
    setFormData((p) => ({
      ...p,
      section2Cards: [...p.section2Cards, { title: "", description: "" }],
    }));
  };

  const updateSection2Card = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy[index][field] = value;
      return { ...p, section2Cards: copy };
    });
  };

  const removeSection2Card = (index) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy.splice(index, 1);
      return { ...p, section2Cards: copy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.section1Heading.trim() || !formData.section1Description.trim()) {
        toast.error("Section 1 heading and description are required");
        setLoading(false);
        return;
      }

      if (formData.status === "published" && existingPublishedCount > 0) {
        const confirm = window.confirm(
          `There are ${existingPublishedCount} other published insurance page(s). Publish this and unpublish others?`
        );
        if (!confirm) {
          setLoading(false);
          return;
        }
        try {
          await axiosInstance.put("/api/insurance/published");
        } catch (err) {
          console.warn("unpublishAll failed (maybe not available)", err);
        }
      }

      const submission = new FormData();
      submission.append("section1Heading", formData.section1Heading.trim());
      submission.append("section1Description", formData.section1Description.trim());
      submission.append("section2Heading", formData.section2Heading.trim());
      submission.append("section2Description", formData.section2Description.trim());
      submission.append("section3Heading", formData.section3Heading.trim());
      submission.append("section3Description", formData.section3Description.trim());
      submission.append("status", formData.status);

      formData.section1Cards.forEach((c, i) => {
        submission.append(`section1Cards[${i}][title]`, (c.title || "").trim());
        submission.append(`section1Cards[${i}][description]`, (c.description || "").trim());
        if (c.image instanceof File) {
          submission.append(`section1Cards[${i}][image]`, c.image);
        } else if (c.existingImage) {
          submission.append(`section1Cards[${i}][existingImage]`, c.existingImage);
        }
      });

      formData.section2Cards.forEach((c, i) => {
        submission.append(`section2Cards[${i}][title]`, (c.title || "").trim());
        submission.append(`section2Cards[${i}][description]`, (c.description || "").trim());
      });

      const res = await putAPI(`/api/insurance/update/${page._id}`, submission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data) {
        toast.success(res.data.message || "Insurance page updated successfully.");
        navigate("/super-admin/insurance", { state: { reload: true } });
      } else {
        toast.error(res.data?.message || "Failed to update insurance page");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Insurance Page</h2>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Section 1 */}
        <div className="card p-3 mb-4">
          <h5>Section 1</h5>
          <div className="form-group">
            <label>Section 1 Heading</label>
            <input
              name="section1Heading"
              className="form-control"
              value={formData.section1Heading}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Section 1 Description</label>
            <textarea
              name="section1Description"
              rows={3}
              className="form-control"
              value={formData.section1Description}
              onChange={handleChange}
            />
          </div>

          <h6>Cards</h6>
          {formData.section1Cards.map((card, idx) => (
            <div key={idx} className="border p-2 mb-3">
              <div className="form-group">
                <label>Card Title</label>
                <input
                  className="form-control"
                  value={card.title}
                  onChange={(e) => updateSection1Card(idx, "title", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Card Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={card.description}
                  onChange={(e) => updateSection1Card(idx, "description", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Card Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="form-control"
                  onChange={(e) => updateSection1CardImage(idx, e.target.files[0])}
                />
                {section1Previews[idx] && (
                  <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
                    <img
                      src={section1Previews[idx]}
                      alt="s1-preview"
                      style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 6 }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{ position: "absolute", top: -6, right: -6 }}
                      onClick={() => removeSection1CardImage(idx)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection1Card(idx)}>
                Remove Card
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addSection1Card}>
            + Add Card
          </button>
        </div>

        {/* Section 2 */}
        <div className="card p-3 mb-4">
          <h5>Section 2</h5>
          <div className="form-group">
            <label>Section 2 Heading</label>
            <input
              name="section2Heading"
              className="form-control"
              value={formData.section2Heading}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Section 2 Description</label>
            <textarea
              name="section2Description"
              rows={3}
              className="form-control"
              value={formData.section2Description}
              onChange={handleChange}
            />
          </div>

          <h6>Cards</h6>
          {formData.section2Cards.map((card, idx) => (
            <div key={idx} className="border p-2 mb-3">
              <div className="form-group">
                <label>Title</label>
                <input
                  className="form-control"
                  value={card.title}
                  onChange={(e) => updateSection2Card(idx, "title", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={card.description}
                  onChange={(e) => updateSection2Card(idx, "description", e.target.value)}
                />
              </div>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection2Card(idx)}>
                Remove Card
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addSection2Card}>
            + Add Card
          </button>
        </div>

        {/* Section 3 */}
        <div className="card p-3 mb-4">
          <h5>Section 3</h5>
          <div className="form-group">
            <label>Section 3 Heading</label>
            <input
              name="section3Heading"
              className="form-control"
              value={formData.section3Heading}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Section 3 Description</label>
            <textarea
              name="section3Description"
              rows={3}
              className="form-control"
              value={formData.section3Description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="card p-3 mb-4">
          <h5>Status</h5>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="d-flex" style={{ gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Insurance Page"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceEdit;
