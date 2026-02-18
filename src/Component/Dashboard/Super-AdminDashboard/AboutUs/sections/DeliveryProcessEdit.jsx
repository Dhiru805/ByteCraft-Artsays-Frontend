import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import axiosInstance from "../../../../../api/axiosConfig";

const DeliveryProcessEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, aboutUsId: passedAboutUsId, section: passedSection } = location.state || {}; 

  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    status: "draft",
    cards: [],
  });

  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(passedAboutUsId || null);
  const [sectionId, setSectionId] = useState((passedSection && passedSection._id) || id || null);

  useEffect(() => {
    const ensureAboutUsPage = async () => {
      try {
        if (!aboutUsId) {
          const res = await getAPI("/api/about-us");
          const pages = Array.isArray(res.data.data) ? res.data.data : [];
          const latest = pages[0] || null;
          if (latest?._id) setAboutUsId(latest._id);
        }
        if (!sectionId && passedSection && passedSection._id) {
          setSectionId(passedSection._id);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };
    ensureAboutUsPage();
    
  }, []);

  useEffect(() => {
    if (!sectionId && !passedSection) return;
    const fetchData = async () => {
      try {
        if (passedSection && (!sectionId || passedSection._id === sectionId)) {
          const s = passedSection;
          setFormData({
            mainHeading: s.heading || "",
            mainDescription: s.description || "",
            status: s.status || "draft",
            cards: Array.isArray(s.steps) && s.steps.length
              ? s.steps.map((step, idx) => ({
                  step: idx + 1,
                  heading: step.stepTitle || "",
                  description: step.stepDescription || "",
                }))
              : [{ step: 1, heading: "", description: "" }],
          });
          return;
        }

        
        const res = await getAPI(`/api/about-us`);
        const pages = Array.isArray(res.data.data) ? res.data.data : [];
        const page = pages[0] || null;
        const s = page?.deliveryProcess || null;
        if (s) {
          setFormData({
            mainHeading: s.heading || "",
            mainDescription: s.description || "",
            status: s.status || "draft",
            cards: Array.isArray(s.steps) && s.steps.length
              ? s.steps.map((step, idx) => ({
                  step: idx + 1,
                  heading: step.stepTitle || "",
                  description: step.stepDescription || "",
                }))
              : [{ step: 1, heading: "", description: "" }],
          });
        } else {
          setFormData((prev) => ({ ...prev, cards: [{ step: 1, heading: "", description: "" }] }));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch delivery process data");
      }
    };

    fetchData();
    
  }, [sectionId, passedSection]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null && field !== null) {
      const updatedCards = [...formData.cards];
      updatedCards[index][field] = value;
      setFormData({ ...formData, cards: updatedCards });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { step: formData.cards.length + 1, heading: "", description: "" }],
    });
  };

  const removeCard = (idx) => {
    const updatedCards = formData.cards.filter((_, i) => i !== idx).map((c, index) => ({ ...c, step: index + 1 }));
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!aboutUsId) {
        toast.error("About Us page not ready yet. Please wait.");
        setLoading(false);
        return;
      }
      if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
        toast.error("Main Heading & Description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.cards.length; i++) {
        const c = formData.cards[i];
        if (!c.heading.trim() || !c.description.trim()) {
          toast.error(`Card ${i + 1} requires heading and description`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("mainHeading", formData.mainHeading.trim());
      submissionData.append("mainDescription", formData.mainDescription.trim());
      submissionData.append("status", formData.status);

      formData.cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][step]`, c.step);
        submissionData.append(`cards[${idx}][heading]`, c.heading.trim());
        submissionData.append(`cards[${idx}][description]`, c.description.trim());
      });

      const effectiveSectionId = sectionId || 'current';

      let res;
      try {
        res = await axiosInstance.put(
          `/api/about-us-sections/delivery-process/update/${effectiveSectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } catch (putErr) {
        res = await axiosInstance.post(
          `/api/about-us-sections/delivery-process/update/${effectiveSectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (res.data.success) {
        toast.success(res.data.message || "Delivery Process updated successfully!");
        navigate("/super-admin/about-us/edit", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to update delivery process");
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
        <h2>Edit Delivery Process</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Main Heading *</label>
                  <input
                    type="text"
                    name="mainHeading"
                    value={formData.mainHeading}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Main Description *</label>
                  <textarea
                    name="mainDescription"
                    value={formData.mainDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                  <small className="text-muted">
                    Supports multiple lines. Markdown tags like **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt; will be rendered.
                  </small>
                </div>

                <div className="form-group">
                  <label>Status</label>
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

                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Step Number</label>
                      <input
                        type="number"
                        value={c.step}
                        onChange={(e) => handleChange(e, idx, "step")}
                        className="form-control"
                        min={1}
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Heading *</label>
                      <input
                        type="text"
                        value={c.heading}
                        onChange={(e) => handleChange(e, idx, "heading")}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Description *</label>
                      <textarea
                        value={c.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={4}
                        required
                      />
                      <small className="text-muted">
                        Supports multiple lines and basic formatting: **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt;
                      </small>
                    </div>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => removeCard(idx)}
                    >
                      Remove Card
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addCard}
                >
                  Add Card
                </button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Delivery Process"}
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

export default DeliveryProcessEdit;
