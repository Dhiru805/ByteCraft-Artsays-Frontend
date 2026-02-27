import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";

const CareersUpdate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    status: "draft",
    section1: {
      heading: "",
      description: "",
      buttonName: "",
      buttonLink: "",
      cards: [],
    },
    section2: {
      heading: "",
      description: "",
    },
    section3: {
      heading: "",
      description: "",
      sectionImage: null,
      existingSectionImage: null,
      cards: [],
    },
  });

  const [section1CardPreviews, setSection1CardPreviews] = useState([]);
  const [section3CardPreviews, setSection3CardPreviews] = useState([]);
  const [section3ImagePreview, setSection3ImagePreview] = useState(null);

  useEffect(() => {
    if (!page) {
      toast.error("No Careers page data provided.");
      navigate("/super-admin/career-CMS");
      return;
    }

    setFormData({
      status: page.status || "draft",

      section1: {
        heading: page.section1?.heading || "",
        description: page.section1?.description || "",
        buttonName: page.section1?.buttonName || "",
        buttonLink: page.section1?.buttonLink || "",
        cards:
          page.section1?.cards?.map((c) => ({
            text: c.text || "",
            image: null,
            existingImage: c.image || null,
          })) || [],
      },

      section2: {
        heading: page.section2?.heading || "",
        description: page.section2?.description || "",
      },

      section3: {
        heading: page.section3?.heading || "",
        description: page.section3?.description || "",
        sectionImage: null,
        existingSectionImage: page.section3?.sectionImage || null,
        cards:
          page.section3?.cards?.map((c) => ({
            text: c.text || "",
            image: null,
            existingImage: c.image || null,
          })) || [],
      },
    });

     const base = process.env.REACT_APP_API_URL_FOR_IMAGE;
    setSection1CardPreviews(
      (page.section1?.cards || []).map((c) =>
        c.image ? `${base}/${c.image}` : null
      )
    );

    setSection3CardPreviews(
      (page.section3?.cards || []).map((c) =>
        c.image ? `${base}/${c.image}` : null
      )
    );

    setSection3ImagePreview(
      page.section3?.sectionImage
        ? `${base}/${page.section3.sectionImage}`
        : null
    );
  }, [page, navigate]);

  const validateImage = (file, label) => {
    if (!file.type.match(/image/)) {
      toast.error(`${label} must be an image`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${label} must be < 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleSection1CardChange = (e, idx, field) => {
    const { value, files } = e.target;

    const cards = [...formData.section1.cards];
    const previews = [...section1CardPreviews];

    if (field === "image" && files?.[0]) {
      const file = files[0];
      if (!validateImage(file, "Section 1 Card Image")) return;

      cards[idx].image = file;
      cards[idx].existingImage = null;
      previews[idx] = URL.createObjectURL(file);
    } else {
      cards[idx][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      section1: { ...prev.section1, cards },
    }));

    setSection1CardPreviews(previews);
  };

  const addSection1Card = () => {
    setFormData((prev) => ({
      ...prev,
      section1: {
        ...prev.section1,
        cards: [...prev.section1.cards, { text: "", image: null, existingImage: null }],
      },
    }));
    setSection1CardPreviews([...section1CardPreviews, null]);
  };

  const removeSection1Card = (idx) => {
    setFormData((prev) => ({
      ...prev,
      section1: {
        ...prev.section1,
        cards: prev.section1.cards.filter((_, i) => i !== idx),
      },
    }));

    setSection1CardPreviews(section1CardPreviews.filter((_, i) => i !== idx));
  };

  const handleSection3MainImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file, "Section 3 Main Image")) return;

    setFormData((prev) => ({
      ...prev,
      section3: { ...prev.section3, sectionImage: file, existingSectionImage: null },
    }));

    setSection3ImagePreview(URL.createObjectURL(file));
  };

  const handleSection3CardChange = (e, idx, field) => {
    const { value, files } = e.target;

    const cards = [...formData.section3.cards];
    const previews = [...section3CardPreviews];

    if (field === "image" && files?.[0]) {
      const file = files[0];
      if (!validateImage(file, "Section 3 Card Image")) return;

      cards[idx].image = file;
      cards[idx].existingImage = null;
      previews[idx] = URL.createObjectURL(file);
    } else {
      cards[idx][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      section3: { ...prev.section3, cards },
    }));

    setSection3CardPreviews(previews);
  };

  const addSection3Card = () => {
    setFormData((prev) => ({
      ...prev,
      section3: {
        ...prev.section3,
        cards: [...prev.section3.cards, { text: "", image: null, existingImage: null }],
      },
    }));

    setSection3CardPreviews([...section3CardPreviews, null]);
  };

  const removeSection3Card = (idx) => {
    setFormData((prev) => ({
      ...prev,
      section3: {
        ...prev.section3,
        cards: prev.section3.cards.filter((_, i) => i !== idx),
      },
    }));

    setSection3CardPreviews(section3CardPreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.section1.heading.trim() || !formData.section1.description.trim()) {
        toast.error("Section 1 heading & description required");
        return setLoading(false);
      }

      if (!formData.section2.heading.trim() || !formData.section2.description.trim()) {
        toast.error("Section 2 heading & description required");
        return setLoading(false);
      }

      if (!formData.section3.heading.trim() || !formData.section3.description.trim()) {
        toast.error("Section 3 heading & description required");
        return setLoading(false);
      }

      const submission = new FormData();

      submission.append("status", formData.status);

      // ----------------- SECTION 1 -----------------
      submission.append("section1[heading]", formData.section1.heading);
      submission.append("section1[description]", formData.section1.description);
      submission.append("section1[buttonName]", formData.section1.buttonName);
      submission.append("section1[buttonLink]", formData.section1.buttonLink);

      formData.section1.cards.forEach((c, idx) => {
        submission.append(`section1[cards][${idx}][text]`, c.text);
        if (c.image instanceof File) {
          submission.append(`section1[cards][${idx}][image]`, c.image);
        } else if (c.existingImage) {
          submission.append(`section1[cards][${idx}][existingImage]`, c.existingImage);
        }
      });

      // ----------------- SECTION 2 -----------------
      submission.append("section2[heading]", formData.section2.heading);
      submission.append("section2[description]", formData.section2.description);

      // ----------------- SECTION 3 -----------------
      submission.append("section3[heading]", formData.section3.heading);
      submission.append("section3[description]", formData.section3.description);

      if (formData.section3.sectionImage instanceof File) {
        submission.append("section3[sectionImage]", formData.section3.sectionImage);
      } else if (formData.section3.existingSectionImage) {
        submission.append(
          "section3[existingSectionImage]",
          formData.section3.existingSectionImage
        );
      }

      formData.section3.cards.forEach((c, idx) => {
        submission.append(`section3[cards][${idx}][text]`, c.text);
        if (c.image instanceof File) {
          submission.append(`section3[cards][${idx}][image]`, c.image);
        } else if (c.existingImage) {
          submission.append(`section3[cards][${idx}][existingImage]`, c.existingImage);
        }
      });

      const res = await putAPI(
        `/api/career-CMS/update/${page._id}`,
        submission,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Careers page updated successfully!");
      navigate("/super-admin/career-CMS", { state: { reload: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Update Careers Page</h2>
      </div>

      <div className="card">
        <div className="body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">

            {/* -------------------------------- SECTION 1 -------------------------------- */}
            <h4>Section 1</h4>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.section1.heading}
                onChange={(e) => handleChange(e, "section1")}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.section1.description}
                onChange={(e) => handleChange(e, "section1")}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Button Name</label>
              <input
                type="text"
                name="buttonName"
                value={formData.section1.buttonName}
                onChange={(e) => handleChange(e, "section1")}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                name="buttonLink"
                value={formData.section1.buttonLink}
                onChange={(e) => handleChange(e, "section1")}
                className="form-control"
              />
            </div>

            <h5>Section 1 Cards</h5>

            {formData.section1.cards.map((c, idx) => (
              <div key={idx} className="border p-2 mb-3">

                <div className="form-group">
                  <label>Text</label>
                  <input
                    type="text"
                    value={c.text}
                    onChange={(e) =>
                      handleSection1CardChange(e, idx, "text")
                    }
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSection1CardChange(e, idx, "image")
                    }
                    className="form-control"
                  />
                  {section1CardPreviews[idx] && (
                    <img
                      src={section1CardPreviews[idx]}
                      alt="preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "6px",
                      }}
                    />
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSection1Card(idx)}
                >
                  Remove Card
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={addSection1Card}
            >
              Add Section 1 Card
            </button>

            {/* -------------------------------- SECTION 2 -------------------------------- */}
            <h4>Section 2</h4>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.section2.heading}
                onChange={(e) => handleChange(e, "section2")}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows={4}
                name="description"
                value={formData.section2.description}
                onChange={(e) => handleChange(e, "section2")}
                className="form-control"
              />
            </div>

            {/* -------------------------------- SECTION 3 -------------------------------- */}
            <h4>Section 3</h4>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.section3.heading}
                onChange={(e) => handleChange(e, "section3")}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows={4}
                name="description"
                value={formData.section3.description}
                onChange={(e) => handleChange(e, "section3")}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Main Section Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSection3MainImage}
                className="form-control"
              />

              {section3ImagePreview && (
                <img
                  src={section3ImagePreview}
                  alt="preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    marginTop: "6px",
                  }}
                />
              )}
            </div>

            <h5>Section 3 Cards</h5>

            {formData.section3.cards.map((c, idx) => (
              <div key={idx} className="border p-2 mb-3">

                <div className="form-group">
                  <label>Text</label>
                  <input
                    type="text"
                    value={c.text}
                    onChange={(e) =>
                      handleSection3CardChange(e, idx, "text")
                    }
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSection3CardChange(e, idx, "image")
                    }
                    className="form-control"
                  />
                  {section3CardPreviews[idx] && (
                    <img
                      src={section3CardPreviews[idx]}
                      alt="preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "6px",
                      }}
                    />
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSection3Card(idx)}
                >
                  Remove Card
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={addSection3Card}
            >
              Add Section 3 Card
            </button>

            {/* -------------------------------- STATUS -------------------------------- */}
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="form-control"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            {/* -------------------------------- SUBMIT -------------------------------- */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Careers Page"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CareersUpdate;
