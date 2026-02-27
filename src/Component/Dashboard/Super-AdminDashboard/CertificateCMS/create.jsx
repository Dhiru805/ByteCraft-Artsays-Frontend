import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";

const CertificationCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    buttonName: "",
    buttonLink: "",
    section1Heading: "",
    section1Description: "",
    section1: { cards: [] },
    section2Heading: "",
    section2Description: "",
    section2: { cards: [] },
    certificateSection: { heading: "", description: "", image: null },
    status: "draft",
  });

  const [section1Previews, setSection1Previews] = useState([]);
  const [section2Previews, setSection2Previews] = useState([]);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingPublishedCount, setExistingPublishedCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAPI("/api/certificate");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setExistingPublishedCount(
          data.filter((d) => d.status === "published").length
        );
      } catch (err) {
        console.error("Failed to fetch certification list:", err);
      }
    })();
  }, []);

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

  const handleChange = (
    e,
    index = null,
    field = null,
    section = null,
    type = null
  ) => {
    const { name, value, files } = e.target;

    if (section === "section1" && index !== null) {
      const cards = [...formData.section1.cards];
      if (field === "image" && files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Section1 Card image")) return;
        cards[index][field] = file;
        const newPreviews = [...section1Previews];
        newPreviews[index] = URL.createObjectURL(file);
        setSection1Previews(newPreviews);
      } else {
        cards[index][field] = value;
      }
      setFormData((prev) => ({
        ...prev,
        section1: { ...prev.section1, cards },
      }));
      return;
    }

    if (section === "section2" && index !== null) {
      const cards = [...formData.section2.cards];
      if (field === "image" && files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Section2 Card image")) return;
        cards[index][field] = file;
        const newPreviews = [...section2Previews];
        newPreviews[index] = URL.createObjectURL(file);
        setSection2Previews(newPreviews);
      } else {
        cards[index][field] = value;
      }
      setFormData((prev) => ({
        ...prev,
        section2: { ...prev.section2, cards },
      }));
      return;
    }

    if (name === "certificateImage") {
      if (files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Certificate image")) return;
        setFormData((prev) => ({
          ...prev,
          certificateSection: { ...prev.certificateSection, image: file },
        }));
        setCertificatePreview(URL.createObjectURL(file));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSection1Card = () => {
    setFormData((prev) => ({
      ...prev,
      section1: {
        cards: [...prev.section1.cards, { title: "", text: "", image: null }],
      },
    }));
    setSection1Previews((p) => [...p, null]);
  };
  const removeSection1Card = (i) => {
    setFormData((prev) => ({
      ...prev,
      section1: { cards: prev.section1.cards.filter((_, idx) => idx !== i) },
    }));
    setSection1Previews((p) => p.filter((_, idx) => idx !== i));
  };

  const addSection2Card = () => {
    setFormData((prev) => ({
      ...prev,
      section2: {
        cards: [
          ...prev.section2.cards,
          { title: "", description: "", image: null },
        ],
      },
    }));
    setSection2Previews((p) => [...p, null]);
  };
  const removeSection2Card = (i) => {
    setFormData((prev) => ({
      ...prev,
      section2: { cards: prev.section2.cards.filter((_, idx) => idx !== i) },
    }));
    setSection2Previews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.webpageHeading.trim() ||
        !formData.webpageDescription.trim()
      ) {
        toast.error("Main heading and description are required");
        setLoading(false);
        return;
      }

      if (formData.section1.cards.length > 0) {
        if (!formData.section1Heading.trim()) {
          toast.error("Section 1 heading required if cards are present");
          setLoading(false);
          return;
        }
        for (let i = 0; i < formData.section1.cards.length; i++) {
          const c = formData.section1.cards[i];
          if (!c.title.trim() || !c.text.trim() || !c.image) {
            toast.error(
              `Section1 Card ${i + 1} requires title, text and image`
            );
            setLoading(false);
            return;
          }
        }
      }

      if (formData.section2.cards.length > 0) {
        if (!formData.section2Heading.trim()) {
          toast.error("Section 2 heading required if cards are present");
          setLoading(false);
          return;
        }
        for (let i = 0; i < formData.section2.cards.length; i++) {
          const c = formData.section2.cards[i];
          if (!c.title.trim() || !c.description.trim() || !c.image) {
            toast.error(
              `Section2 Card ${i + 1} requires title, description and image`
            );
            setLoading(false);
            return;
          }
        }
      }

      if (
        !formData.certificateSection.heading.trim() ||
        !formData.certificateSection.description.trim() ||
        !formData.certificateSection.image
      ) {
        toast.error(
          "Certificate section heading, description and image are required"
        );
        setLoading(false);
        return;
      }

      if (formData.status === "published" && existingPublishedCount > 0) {
        const confirm = window.confirm(
          `There is already ${existingPublishedCount} published certification page(s). ` +
            `Do you want to publish this page and unpublish the others?`
        );
        if (!confirm) {
          setLoading(false);
          return;
        }
        try {
          await axiosInstance.put("/api/certificate/published");
        } catch (err) {
          console.warn("unpublishAll failed or not available", err);
        }
      }

      const submission = new FormData();
      submission.append("webpageHeading", formData.webpageHeading.trim());
      submission.append(
        "webpageDescription",
        formData.webpageDescription.trim()
      );
      submission.append("buttonName", formData.buttonName.trim());
      submission.append("buttonLink", formData.buttonLink.trim());
      submission.append("section1Heading", formData.section1Heading.trim());
      submission.append(
        "section1Description",
        formData.section1Description.trim()
      );
      submission.append("section2Heading", formData.section2Heading.trim());
      submission.append(
        "section2Description",
        formData.section2Description.trim()
      );
      submission.append(
        "certificateHeading",
        formData.certificateSection.heading.trim()
      );
      submission.append(
        "certificateDescription",
        formData.certificateSection.description.trim()
      );
      submission.append("status", formData.status);

      formData.section1.cards.forEach((c, i) => {
        submission.append(`section1[cards][${i}][title]`, c.title.trim());
        submission.append(`section1[cards][${i}][text]`, c.text.trim());
        if (c.image) submission.append(`section1[cards][${i}][image]`, c.image);
      });

      formData.section2.cards.forEach((c, i) => {
        submission.append(`section2[cards][${i}][title]`, c.title.trim());
        submission.append(
          `section2[cards][${i}][description]`,
          c.description.trim()
        );
        if (c.image) submission.append(`section2[cards][${i}][image]`, c.image);
      });

      if (formData.certificateSection.image) {
        submission.append(
          "certificateSection[image]",
          formData.certificateSection.image
        );
      }

      const res = await postAPI("/api/certificate/create", submission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data) {
        toast.success(
          res.data.message || "Certification page created successfully."
        );
        navigate("/super-admin/certificate", { state: { reload: true } });
      } else {
        toast.error(
          res.data?.message || "Failed to create certification page."
        );
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
        <h2>Create Certification Page</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Main Heading *</label>
                  <input
                    type="text"
                    name="webpageHeading"
                    value={formData.webpageHeading}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Main Description *</label>
                  <textarea
                    name="webpageDescription"
                    value={formData.webpageDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Button Name</label>
                    <input
                      type="text"
                      name="buttonName"
                      value={formData.buttonName}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Button Link</label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <hr />
                <h4>Section 1</h4>
                <div className="form-group">
                  <label>Section 1 Heading</label>
                  <input
                    type="text"
                    name="section1Heading"
                    value={formData.section1Heading}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Section 1 Description</label>
                  <textarea
                    name="section1Description"
                    value={formData.section1Description}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>

                {formData.section1.cards.length > 0 && <h5>Section1 Cards</h5>}
                {formData.section1.cards.map((c, i) => (
                  <div key={i} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Card Title (will show bold)</label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) =>
                          handleChange(
                            { target: { value: e.target.value } },
                            i,
                            "title",
                            "section1"
                          )
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Text / Description</label>
                      <textarea
                        value={c.text}
                        onChange={(e) =>
                          handleChange(
                            { target: { value: e.target.value } },
                            i,
                            "text",
                            "section1"
                          )
                        }
                        className="form-control"
                        rows={2}
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Image</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) =>
                          handleChange(e, i, "image", "section1")
                        }
                        className="form-control"
                      />
                      {section1Previews[i] && (
                        <img
                          src={section1Previews[i]}
                          alt="preview"
                          style={{
                            maxWidth: 200,
                            maxHeight: 150,
                            objectFit: "contain",
                            marginTop: 6,
                          }}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeSection1Card(i)}
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
                  Add Section1 Card
                </button>

                <hr />
                <h4>Section 2</h4>
                <div className="form-group">
                  <label>Section 2 Heading</label>
                  <input
                    type="text"
                    name="section2Heading"
                    value={formData.section2Heading}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Section 2 Description</label>
                  <textarea
                    name="section2Description"
                    value={formData.section2Description}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>

                {formData.section2.cards.length > 0 && <h5>Section2 Cards</h5>}
                {formData.section2.cards.map((c, i) => (
                  <div key={i} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) =>
                          handleChange(
                            { target: { value: e.target.value } },
                            i,
                            "title",
                            "section2"
                          )
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={c.description}
                        onChange={(e) =>
                          handleChange(
                            { target: { value: e.target.value } },
                            i,
                            "description",
                            "section2"
                          )
                        }
                        className="form-control"
                        rows={2}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) =>
                          handleChange(e, i, "image", "section2")
                        }
                        className="form-control"
                      />
                      {section2Previews[i] && (
                        <img
                          src={section2Previews[i]}
                          alt="preview"
                          style={{
                            maxWidth: 200,
                            maxHeight: 150,
                            objectFit: "contain",
                            marginTop: 6,
                          }}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeSection2Card(i)}
                    >
                      Remove Card
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addSection2Card}
                >
                  Add Section2 Card
                </button>

                <hr />
                <h4>Certificate Section</h4>
                <div className="form-group">
                  <label>Certificate Heading *</label>
                  <input
                    type="text"
                    name="certificateHeading"
                    value={formData.certificateSection.heading}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        certificateSection: {
                          ...p.certificateSection,
                          heading: e.target.value,
                        },
                      }))
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Certificate Description *</label>
                  <textarea
                    name="certificateDescription"
                    value={formData.certificateSection.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        certificateSection: {
                          ...p.certificateSection,
                          description: e.target.value,
                        },
                      }))
                    }
                    className="form-control"
                    rows={3}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Certificate Image *</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    name="certificateImage"
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  {certificatePreview && (
                    <img
                      src={certificatePreview}
                      alt="certificate preview"
                      style={{
                        maxWidth: 240,
                        maxHeight: 180,
                        objectFit: "contain",
                        marginTop: 6,
                      }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="d-flex align-items-center" style={{ gap: 12 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Certification Page"}
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

export default CertificationCreate;
