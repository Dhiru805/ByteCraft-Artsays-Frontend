import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";

const PartnerEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    buttonName: "",
    buttonLink: "",
    cards: [],
    section1Heading: "",
    section1Description: "",
    section1Images: [], 
    section2Heading: "",
    section2Description: "",
    section2Cards: [], 
    status: "draft",
  });

  const [section1Previews, setSection1Previews] = useState([]); 
  const [cardsPreviews, setCardsPreviews] = useState([]);
  const [cardsSectionPreviews, setCardsSectionPreviews] = useState([]);
  const [section2Previews, setSection2Previews] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [existingPublishedCount, setExistingPublishedCount] = useState(0);

  useEffect(() => {
    if (!page) {
      toast.error("No partner page provided.");
      navigate("/super-admin/partner");
      return;
    }

    setFormData({
      mainHeading: page.mainHeading || "",
      mainDescription: page.mainDescription || "",
      buttonName: page.buttonName || "",
      buttonLink: page.buttonLink || "",
      cards: (page.cards || []).map((c) => ({
        title: c.title || "",
        image: null,
        existingImage: c.image || null,
        sectionHeading: c.sectionHeading || c.cardSectionHeading || "",
        sectionDescription: c.sectionDescription || c.cardSectionDescription || c.description || "",
        sectionImage: null,
        sectionExistingImage: c.sectionImage || c.cardSectionImage || null,
      })),
      section1Heading: page.section1Heading || page.section1?.heading || "",
      section1Description: page.section1Description || page.section1?.description || "",
      section1Images: Array.isArray(page.section1Images) ? page.section1Images.slice() : [],
      section2Heading: page.section2Heading || page.section2?.heading || "",
      section2Description: page.section2Description || page.section2?.description || "",
      section2Cards: (page.section2Cards || page.section2?.cards || []).map((c) => ({
        title: c.title || "",
        description: c.description || c.text || "",
        image: null,
        existingImage: c.image || null,
      })),
      status: page.status || "draft",
    });

    const base = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

    setSection1Previews(
      (page.section1Images || []).map((img) => (img ? `${base}/${img}` : null))
    );

    setCardsPreviews(
      (page.cards || []).map((c) => (c.image ? `${base}/${c.image}` : null))
    );

    setCardsSectionPreviews(
      (page.cards || []).map((c) =>
        c.sectionImage ? `${base}/${c.sectionImage}` : null
      )
    );

    setSection2Previews(
      (page.section2Cards || page.section2?.cards || []).map((c) =>
        c.image ? `${base}/${c.image}` : null
      )
    );

    (async () => {
      try {
        const res = await getAPI("/api/partner");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setExistingPublishedCount(
          data.filter((d) => d.status === "published" && d._id !== page._id)
            .length
        );
      } catch (err) {
        console.warn("Could not fetch partner pages list", err);
      }
    })();
  }, [page, navigate]);

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

  const handleTopChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const addSection1Image = () => {
    setFormData((p) => ({ ...p, section1Images: [...p.section1Images, null] }));
    setSection1Previews((p) => [...p, null]);
  };

  const updateSection1Image = (index, file) => {
    if (!file) return;
    if (!validateImageFile(file, "Section1 image")) return;
    setFormData((p) => {
      const copy = [...p.section1Images];
      copy[index] = file;
      return { ...p, section1Images: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy[index] = URL.createObjectURL(file);
      return copy;
    });
  };

  const removeSection1Image = (index) => {
    setFormData((p) => {
      const copy = [...p.section1Images];
      copy.splice(index, 1);
      return { ...p, section1Images: copy };
    });
    setSection1Previews((p) => {
      const copy = [...p];
      copy.splice(index, 1);
      return copy;
    });
  };

  const addCard = () => {
    setFormData((p) => ({
      ...p,
      cards: [
        ...p.cards,
        {
          title: "",
          image: null,
          existingImage: null,
          sectionHeading: "",
          sectionDescription: "",
          sectionImage: null,
          sectionExistingImage: null,
        },
      ],
    }));
    setCardsPreviews((p) => [...p, null]);
    setCardsSectionPreviews((p) => [...p, null]);
  };

  const updateCardField = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.cards];
      copy[index] = { ...copy[index], [field]: value };
      return { ...p, cards: copy };
    });
  };

  const updateCardImage = (index, file) => {
    if (!file) return;
    if (!validateImageFile(file, "Card image")) return;
    setFormData((p) => {
      const copy = [...p.cards];
      copy[index].image = file;
      return { ...p, cards: copy };
    });
    setCardsPreviews((p) => {
      const copy = [...p];
      copy[index] = URL.createObjectURL(file);
      return copy;
    });
  };

  const updateCardSectionImage = (index, file) => {
    if (!file) return;
    if (!validateImageFile(file, "Card section image")) return;
    setFormData((p) => {
      const copy = [...p.cards];
      copy[index].sectionImage = file;
      return { ...p, cards: copy };
    });
    setCardsSectionPreviews((p) => {
      const copy = [...p];
      copy[index] = URL.createObjectURL(file);
      return copy;
    });
  };

  const removeCard = (index) => {
    setFormData((p) => {
      const copy = [...p.cards];
      copy.splice(index, 1);
      return { ...p, cards: copy };
    });
    setCardsPreviews((p) => {
      const copy = [...p];
      copy.splice(index, 1);
      return copy;
    });
    setCardsSectionPreviews((p) => {
      const copy = [...p];
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeCardImage = (index) => {
    setFormData((p) => {
      const copy = [...p.cards];
      copy[index].image = null;
      copy[index].existingImage = null;
      return { ...p, cards: copy };
    });
    setCardsPreviews((p) => {
      const copy = [...p];
      copy[index] = null;
      return copy;
    });
  };

  const removeCardSectionImage = (index) => {
    setFormData((p) => {
      const copy = [...p.cards];
      copy[index].sectionImage = null;
      copy[index].sectionExistingImage = null;
      return { ...p, cards: copy };
    });
    setCardsSectionPreviews((p) => {
      const copy = [...p];
      copy[index] = null;
      return copy;
    });
  };

  const addSection2Card = () => {
    setFormData((p) => ({
      ...p,
      section2Cards: [...p.section2Cards, { title: "", description: "", image: null, existingImage: null }],
    }));
    setSection2Previews((p) => [...p, null]);
  };

  const updateSection2Card = (index, field, value) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy[index][field] = value;
      return { ...p, section2Cards: copy };
    });
  };

  const updateSection2CardImage = (index, file) => {
    if (!file) return;
    if (!validateImageFile(file, "Section2 card image")) return;
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy[index].image = file;
      return { ...p, section2Cards: copy };
    });
    setSection2Previews((p) => {
      const copy = [...p];
      copy[index] = URL.createObjectURL(file);
      return copy;
    });
  };

  const removeSection2Card = (index) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy.splice(index, 1);
      return { ...p, section2Cards: copy };
    });
    setSection2Previews((p) => {
      const copy = [...p];
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeSection2CardImage = (index) => {
    setFormData((p) => {
      const copy = [...p.section2Cards];
      copy[index].image = null;
      copy[index].existingImage = null;
      return { ...p, section2Cards: copy };
    });
    setSection2Previews((p) => {
      const copy = [...p];
      copy[index] = null;
      return copy;
    });
  };

  const renderPreviewSrc = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      const base = process.env.REACT_APP_API_URL_FOR_IMAGE || "";
      return `${base}/${val}`;
    }
    
    try {
      return URL.createObjectURL(val);
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
        toast.error("Main heading and description are required");
        setLoading(false);
        return;
      }

      if (formData.status === "published" && existingPublishedCount > 0) {
        const confirm = window.confirm(
          `There are ${existingPublishedCount} other published partner page(s). Publish this and unpublish others?`
        );
        if (!confirm) {
          setLoading(false);
          return;
        }
        try {
          await axiosInstance.put("/api/partner/published");
        } catch (err) {
          console.warn("unpublishAll failed (maybe not available)", err);
        }
      }

      const submission = new FormData();

      submission.append("mainHeading", formData.mainHeading.trim());
      submission.append("mainDescription", formData.mainDescription.trim());
      submission.append("buttonName", (formData.buttonName || "").trim());
      submission.append("buttonLink", (formData.buttonLink || "").trim());
      submission.append("section1Heading", (formData.section1Heading || "").trim());
      submission.append("section1Description", (formData.section1Description || "").trim());
      submission.append("section2Heading", (formData.section2Heading || "").trim());
      submission.append("section2Description", (formData.section2Description || "").trim());
      submission.append("status", formData.status);

      formData.section1Images.forEach((img, i) => {
        if (img instanceof File) {
          submission.append(`section1Images[${i}]`, img);
        } else if (typeof img === "string") {
          submission.append(`section1ImagesExisting[${i}]`, img);
        }
      });

      formData.cards.forEach((c, i) => {
        submission.append(`cards[${i}][title]`, (c.title || "").trim());
        submission.append(`cards[${i}][sectionHeading]`, (c.sectionHeading || "").trim());
        submission.append(`cards[${i}][sectionDescription]`, (c.sectionDescription || "").trim());

        if (c.image instanceof File) {
          submission.append(`cards[${i}][image]`, c.image);
        } else if (c.existingImage) {
          submission.append(`cards[${i}][existingImage]`, c.existingImage);
        }

        if (c.sectionImage instanceof File) {
          submission.append(`cards[${i}][sectionImage]`, c.sectionImage);
        } else if (c.sectionExistingImage) {
          submission.append(`cards[${i}][sectionExistingImage]`, c.sectionExistingImage);
        }
      });

      formData.section2Cards.forEach((c, i) => {
        submission.append(`section2Cards[${i}][title]`, (c.title || "").trim());
        submission.append(`section2Cards[${i}][description]`, (c.description || "").trim());
        if (c.image instanceof File) {
          submission.append(`section2Cards[${i}][image]`, c.image);
        } else if (c.existingImage) {
          submission.append(`section2Cards[${i}][existingImage]`, c.existingImage);
        }
      });

      const res = await putAPI(`/api/partner/update/${page._id}`, submission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data) {
        toast.success(res.data.message || "Partner page updated successfully.");
        navigate("/super-admin/partner", { state: { reload: true } });
      } else {
        toast.error(res.data?.message || "Failed to update partner page");
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
        <h2>Edit Partner Page</h2>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
      
        <div className="card p-3 mb-4">
          <h5>Main Section</h5>
          <div className="form-group">
            <label>Main Heading</label>
            <input
              name="mainHeading"
              className="form-control"
              value={formData.mainHeading}
              onChange={handleTopChange}
            />
          </div>
          <div className="form-group">
            <label>Main Description</label>
            <textarea
              name="mainDescription"
              rows={4}
              className="form-control"
              value={formData.mainDescription}
              onChange={handleTopChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Button Name</label>
              <input
                name="buttonName"
                className="form-control"
                value={formData.buttonName}
                onChange={handleTopChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Button Link</label>
              <input
                name="buttonLink"
                className="form-control"
                value={formData.buttonLink}
                onChange={handleTopChange}
              />
            </div>
          </div>
        </div>

        <div className="card p-3 mb-4">
          <h5>Cards Section</h5>
          {formData.cards.length > 0 &&
            formData.cards.map((card, idx) => (
              <div key={idx} className="border mb-3 p-2">
                <div className="form-group">
                  <label>Card Title</label>
                  <input
                    className="form-control"
                    value={card.title}
                    onChange={(e) => updateCardField(idx, "title", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Card Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="form-control"
                    onChange={(e) => updateCardImage(idx, e.target.files[0])}
                  />
                  {cardsPreviews[idx] && (
                    <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
                      <img
                        src={cardsPreviews[idx]}
                        alt="card-preview"
                        style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 6 }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        style={{ position: "absolute", top: -6, right: -6 }}
                        onClick={() => removeCardImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <h6>Corresponding Section</h6>
                <div className="form-group">
                  <label>Section Heading</label>
                  <input
                    className="form-control"
                    value={card.sectionHeading}
                    onChange={(e) => updateCardField(idx, "sectionHeading", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Section Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={card.sectionDescription}
                    onChange={(e) => updateCardField(idx, "sectionDescription", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Section Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="form-control"
                    onChange={(e) => updateCardSectionImage(idx, e.target.files[0])}
                  />
                  {cardsSectionPreviews[idx] && (
                    <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
                      <img
                        src={cardsSectionPreviews[idx]}
                        alt="section-preview"
                        style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 6 }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        style={{ position: "absolute", top: -6, right: -6 }}
                        onClick={() => removeCardSectionImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCard(idx)}>
                  Remove Card
                </button>
              </div>
            ))}

          <button type="button" className="btn btn-primary" onClick={addCard}>
            + Add Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Section 1 (Carousel)</h5>

          <div className="form-group">
            <label>Section 1 Heading</label>
            <input
              name="section1Heading"
              className="form-control"
              value={formData.section1Heading}
              onChange={handleTopChange}
            />
          </div>

          <div className="form-group">
            <label>Section 1 Description</label>
            <textarea
              name="section1Description"
              rows={3}
              className="form-control"
              value={formData.section1Description}
              onChange={handleTopChange}
            />
          </div>

          <h6>Carousel Images</h6>
          {formData.section1Images.map((img, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="form-control me-2"
                onChange={(e) => updateSection1Image(i, e.target.files[0])}
              />
              <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => removeSection1Image(i)}>
                Remove
              </button>
              {section1Previews[i] && (
                <img
                  src={section1Previews[i]}
                  alt={`s1-${i}`}
                  style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 6 }}
                />
              )}
            </div>
          ))}

          <button type="button" className="btn btn-primary" onClick={addSection1Image}>
            + Add Image
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Section 2</h5>

          <div className="form-group">
            <label>Section 2 Heading</label>
            <input
              name="section2Heading"
              className="form-control"
              value={formData.section2Heading}
              onChange={handleTopChange}
            />
          </div>

          <div className="form-group">
            <label>Section 2 Description</label>
            <textarea
              name="section2Description"
              rows={3}
              className="form-control"
              value={formData.section2Description}
              onChange={handleTopChange}
            />
          </div>

          <h6>Section 2 Cards</h6>
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
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="form-control"
                  onChange={(e) => updateSection2CardImage(idx, e.target.files[0])}
                />
                {section2Previews[idx] && (
                  <div style={{ marginTop: 8, position: "relative", display: "inline-block" }}>
                    <img
                      src={section2Previews[idx]}
                      alt="s2-preview"
                      style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 6 }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{ position: "absolute", top: -6, right: -6 }}
                      onClick={() => removeSection2CardImage(idx)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection2Card(idx)}>
                Remove Card
              </button>
            </div>
          ))}

          <button type="button" className="btn btn-primary" onClick={addSection2Card}>
            + Add Section 2 Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Status</h5>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleTopChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="d-flex" style={{ gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Partner Page"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerEdit;
