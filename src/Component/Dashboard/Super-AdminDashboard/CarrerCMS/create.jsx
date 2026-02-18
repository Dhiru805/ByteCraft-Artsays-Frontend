
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";

function CareersCreate() {
  const navigate = useNavigate();

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
      cards: [],
    },
  });

  const [section1CardPreviews, setSection1CardPreviews] = useState([]);
  const [section3CardPreviews, setSection3CardPreviews] = useState([]);
  const [section3ImagePreview, setSection3ImagePreview] = useState(null);

  const validateImageFile = (file, type) => {
    if (!file?.type?.match(/image\//)) {
      toast.error(`${type} must be an image file`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, section, field) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name || field]: value,
      },
    }));
  };

  const handleSection1CardChange = (e, idx, field) => {
    const { value, files } = e.target;
    const cards = [...formData.section1.cards];
    const previews = [...section1CardPreviews];

    if (field === "image" && files?.[0]) {
      const file = files[0];
      if (!validateImageFile(file, "Section 1 Card Image")) return;

      cards[idx].image = file;
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
        cards: [...prev.section1.cards, { image: null, text: "" }],
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

  const handleSection3Image = (e) => {
    const file = e.target.files?.[0];
    if (!file || !validateImageFile(file, "Section 3 Main Image")) return;

    setFormData((prev) => ({
      ...prev,
      section3: { ...prev.section3, sectionImage: file },
    }));

    setSection3ImagePreview(URL.createObjectURL(file));
  };

  const handleSection3CardChange = (e, idx, field) => {
    const { value, files } = e.target;
    const cards = [...formData.section3.cards];
    const previews = [...section3CardPreviews];

    if (field === "image" && files?.[0]) {
      const file = files[0];
      if (!validateImageFile(file, "Section 3 Card Image")) return;

      cards[idx].image = file;
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
        cards: [...prev.section3.cards, { image: null, text: "" }],
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
        toast.error("Section 1 heading & description are required");
        return setLoading(false);
      }

      if (!formData.section2.heading.trim() || !formData.section2.description.trim()) {
        toast.error("Section 2 heading & description are required");
        return setLoading(false);
      }

      if (!formData.section3.heading.trim() || !formData.section3.description.trim()) {
        toast.error("Section 3 heading & description are required");
        return setLoading(false);
      }

      const submission = new FormData();

      
      submission.append("section1[heading]", formData.section1.heading);
      submission.append("section1[description]", formData.section1.description);
      submission.append("section1[buttonName]", formData.section1.buttonName);
      submission.append("section1[buttonLink]", formData.section1.buttonLink);

      formData.section1.cards.forEach((card, idx) => {
        submission.append(`section1[cards][${idx}][text]`, card.text);
        if (card.image)
          submission.append(`section1[cards][${idx}][image]`, card.image);
      });

      submission.append("section2[heading]", formData.section2.heading);
      submission.append("section2[description]", formData.section2.description);

      submission.append("section3[heading]", formData.section3.heading);
      submission.append("section3[description]", formData.section3.description);

      if (formData.section3.sectionImage)
        submission.append("section3[sectionImage]", formData.section3.sectionImage);

      formData.section3.cards.forEach((card, idx) => {
        submission.append(`section3[cards][${idx}][text]`, card.text);
        if (card.image)
          submission.append(`section3[cards][${idx}][image]`, card.image);
      });

      submission.append("status", formData.status);

      const res = await postAPI("/api/career-CMS/create", submission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Careers page created successfully!");
      navigate("/super-admin/career-CMS", { state: { reload: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Careers Page</h2>
      </div>

      <div className="card">
        <div className="body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">

            {/* ------------------ SECTION 1 ------------------ */}
            <h4>Section 1</h4>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.section1.heading}
                className="form-control"
                onChange={(e) => handleChange(e, "section1")}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={formData.section1.description}
                onChange={(e) => handleChange(e, "section1")}
                required
              />
            </div>

            <div className="form-group">
              <label>Button Name</label>
              <input
                type="text"
                name="buttonName"
                className="form-control"
                value={formData.section1.buttonName}
                onChange={(e) => handleChange(e, "section1")}
              />
            </div>

            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                name="buttonLink"
                className="form-control"
                value={formData.section1.buttonLink}
                onChange={(e) => handleChange(e, "section1")}
              />
            </div>

            <h5>Section 1 Cards</h5>

            {formData.section1.cards.map((card, idx) => (
              <div key={idx} className="border p-2 mb-2">

                <div className="form-group">
                  <label>Text</label>
                  <input
                    type="text"
                    value={card.text}
                    className="form-control"
                    onChange={(e) =>
                      handleSection1CardChange(e, idx, "text")
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) =>
                      handleSection1CardChange(e, idx, "image")
                    }
                  />

                  {section1CardPreviews[idx] && (
                    <img
                      src={section1CardPreviews[idx]}
                      alt="preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "5px",
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

            {/* ------------------ SECTION 2 ------------------ */}
            <h4>Section 2</h4>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                className="form-control"
                value={formData.section2.heading}
                onChange={(e) => handleChange(e, "section2")}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={formData.section2.description}
                onChange={(e) => handleChange(e, "section2")}
                required
              />
            </div>

            {/* ------------------ SECTION 3 ------------------ */}
            <h4>Section 3</h4>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                className="form-control"
                value={formData.section3.heading}
                onChange={(e) => handleChange(e, "section3")}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                value={formData.section3.description}
                onChange={(e) => handleChange(e, "section3")}
                required
              />
            </div>

            <div className="form-group">
              <label>Main Section Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleSection3Image}
              />

              {section3ImagePreview && (
                <img
                  src={section3ImagePreview}
                  alt="section preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    marginTop: "5px",
                  }}
                />
              )}
            </div>

            <h5>Section 3 Cards</h5>

            {formData.section3.cards.map((card, idx) => (
              <div key={idx} className="border p-2 mb-2">

                <div className="form-group">
                  <label>Text</label>
                  <input
                    type="text"
                    value={card.text}
                    className="form-control"
                    onChange={(e) =>
                      handleSection3CardChange(e, idx, "text")
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) =>
                      handleSection3CardChange(e, idx, "image")
                    }
                  />

                  {section3CardPreviews[idx] && (
                    <img
                      src={section3CardPreviews[idx]}
                      alt="preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "5px",
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

            {/* ------------------ STATUS ------------------ */}
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            {/* ---------------- SUBMIT ---------------- */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Careers Page"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CareersCreate;
