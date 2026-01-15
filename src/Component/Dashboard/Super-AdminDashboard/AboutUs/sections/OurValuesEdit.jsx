
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../../api/axiosConfig";
import getAPI from "../../../../../api/getAPI";

const OurValuesEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: initialData, section: passedSection, aboutUsId: passedAboutUsId } = location.state || {};

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    status: "draft",
    cards: [{ cardTitle: "", cardImage: null }],
  });

  const [cardPreviews, setCardPreviews] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(passedAboutUsId || null);
  const [sectionId, setSectionId] = useState((passedSection && passedSection._id) || (initialData && initialData._id) || null);

  useEffect(() => {
    const ensureAboutUsPage = async () => {
      try {
        if (!aboutUsId) {
          const res = await getAPI("/api/about-us");
          let page = res.data.data?.[0];

          if (!page) {
            const createRes = await axiosInstance.post("/api/about-us/create", { title: "About Us" });
            page = createRes.data.data;
          }

          setAboutUsId(page._id);
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
    if (initialData) {
      setFormData({
        heading: initialData.heading || "",
        description: initialData.description || "",
        status: initialData.status || "draft",
        cards: initialData.cards?.map((c) => ({
          cardTitle: c.cardTitle || "",
          cardImage: null,
          existingImage: c.cardImage || "",
        })) || [{ cardTitle: "", cardImage: null }],
      });

      setCardPreviews(initialData.cards?.map((c) => c.cardImage) || [null]);
    }
  }, [initialData]);

  useEffect(() => {
    const loadIfMissing = async () => {
      if (initialData) return;
      try {
        const res = await getAPI("/api/about-us");
        const pages = Array.isArray(res.data.data) ? res.data.data : [];
        const page = pages[0] || null;
        const s = page?.ourValues || null;
        if (s) {
          setFormData({
            heading: s.heading || "",
            description: s.description || "",
            status: s.status || "draft",
            cards: s.cards?.map((c) => ({
              cardTitle: c.cardTitle || "",
              cardImage: null,
              existingImage: c.cardImage || "",
            })) || [{ cardTitle: "", cardImage: null }],
          });
          setCardPreviews(s.cards?.map((c) => c.cardImage) || [null]);
          if (!sectionId && s._id) setSectionId(s._id);
        }
      } catch (err) {
      }
    };
    loadIfMissing();
   
  }, []);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
      toast.error(`${type} must be JPEG, PNG or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (field !== null && index !== null) {
      const updatedCards = [...formData.cards];
      const updatedPreviews = [...cardPreviews];

      if (files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Card Image")) return;

        updatedCards[index][field] = file;
        updatedCards[index].existingImage = null;
        updatedPreviews[index] = URL.createObjectURL(file);
      } else {
        updatedCards[index][field] = value;
      }

      setFormData({ ...formData, cards: updatedCards });
      setCardPreviews(updatedPreviews);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardTitle: "", cardImage: null }],
    });
    setCardPreviews([...cardPreviews, null]);
  };

  const removeCard = (idx) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== idx),
    });
    setCardPreviews(cardPreviews.filter((_, i) => i !== idx));
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

      for (let i = 0; i < formData.cards.length; i++) {
        const c = formData.cards[i];
        if (!c.cardTitle.trim() || (!c.cardImage && !c.existingImage)) {
          toast.error(`Card ${i + 1} requires title and image`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("heading", formData.heading.trim());
      submissionData.append("description", formData.description.trim());
      submissionData.append("status", formData.status);

      formData.cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][cardTitle]`, c.cardTitle.trim());
        if (c.cardImage) submissionData.append(`cards[${idx}][cardImage]`, c.cardImage);
        if (c.existingImage) submissionData.append(`cards[${idx}][existingImage]`, c.existingImage);
      });

      const effectiveSectionId = sectionId || 'current';

      let res;
      try {
        res = await axiosInstance.put(
          `/api/about-us-sections/our-values/update/${effectiveSectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } catch (putErr) {
        res = await axiosInstance.post(
          `/api/about-us-sections/our-values/update/${effectiveSectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (res.data.success) {
        toast.success(res.data.message || "Our Values section updated successfully!");
        navigate("/super-admin/about-us/edit", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to update section");
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
        <h2>Edit Our Values Section</h2>
        {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

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
                  <label>Status</label>
                  <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-2 rounded shadow">
                    <div className="form-group">
                      <label>Card Title *</label>
                      <input type="text" value={c.cardTitle} onChange={(e) => handleChange(e, idx, "cardTitle")} className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>Card Image *</label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "cardImage")} className="form-control" />
                      {(cardPreviews[idx] || c.existingImage) && (
                        <img src={cardPreviews[idx] || c.existingImage} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />
                      )}
                    </div>

                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
                  </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
                    {loading ? "Updating..." : "Update Our Values Section"}
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

export default OurValuesEdit;
