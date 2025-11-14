import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";

const CertificationEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

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
    certificateSection: {
      heading: "",
      description: "",
      image: null,
      existingImage: null,
    },
    status: "draft",
  });

  const [section1Previews, setSection1Previews] = useState([]);
  const [section2Previews, setSection2Previews] = useState([]);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingPublishedCount, setExistingPublishedCount] = useState(0);

  useEffect(() => {
    if (!page) {
      toast.error("No Certification page provided");
      navigate("/super-admin/certificate");
      return;
    }

    // setFormData({
    //   webpageHeading: page.webpageHeading || "",
    //   webpageDescription: page.webpageDescription || "",
    //   buttonName: page.buttonName || "",
    //   buttonLink: page.buttonLink || "",
    //   section1Heading: page.section1?.heading || "",
    //   section1Description: page.section1?.description || "",
    //   section1: {
    //     cards: (page.section1?.cards || []).map((c) => ({
    //       title: c.title || "",
    //       text: c.text || "",
    //       image: null,
    //       existingImage: c.image || null,
    //     })),
    //   },
    //   section2Heading: page.section2?.heading || "",
    //   section2Description: page.section2?.description || "",
    //   section2: {
    //     cards: (page.section2?.cards || []).map((c) => ({
    //       title: c.title || "",
    //       description: c.description || "",
    //       image: null,
    //       existingImage: c.image || null,
    //     })),
    //   },
    //   certificateSection: {
    //     heading: page.certificateSection?.heading || "",
    //     description: page.certificateSection?.description || "",
    //     image: null,
    //     existingImage: page.certificateSection?.image || null,
    //   },
    //   status: page.status || "draft",
    // });
    setFormData({
      webpageHeading: page.webpageHeading || "",
      webpageDescription: page.webpageDescription || "",
      buttonName: page.buttonName || "",
      buttonLink: page.buttonLink || "",
      section1Heading: page.section1Heading || "",
      section1Description: page.section1Description || "",
      section1: {
        cards: (page.section1?.cards || []).map((c) => ({
          title: c.title || "",
          text: c.description || "",
          image: null,
          existingImage: c.image || null,
        })),
      },
      section2Heading: page.section2Heading || "",
      section2Description: page.section2Description || "",
      section2: {
        cards: (page.section2?.cards || []).map((c) => ({
          title: c.title || "",
          description: c.description || "",
          image: null,
          existingImage: c.image || null,
        })),
      },
      certificateSection: {
        heading: page.certificateSection?.heading || "",
        description: page.certificateSection?.description || "",
        image: null,
        existingImage: page.certificateSection?.image || null,
      },
      status: page.status || "draft",
    });

    setSection1Previews(
      (page.section1?.cards || []).map((c) =>
        c.image ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.image}` : null
      )
    );
    setSection2Previews(
      (page.section2?.cards || []).map((c) =>
        c.image ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.image}` : null
      )
    );
    setCertificatePreview(
      page.certificateSection?.image
        ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${page.certificateSection.image}`
        : null
    );

    (async () => {
      try {
        const res = await getAPI("/api/certificate");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setExistingPublishedCount(
          data.filter((d) => d.status === "published" && d._id !== page._id)
            .length
        );
      } catch (err) {
        console.warn("Failed to fetch list", err);
      }
    })();
  }, [page, navigate]);

  const validateImageFile = (file, friendly) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`${friendly} must be JPEG or PNG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${friendly} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null, section = null) => {
    const { name, value, files } = e.target;

    if (section === "section1" && index !== null) {
      const cards = [...formData.section1.cards];
      const previews = [...section1Previews];
      if (field === "image" && files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Section1 Card image")) return;
        cards[index][field] = file;
        previews[index] = URL.createObjectURL(file);
        setSection1Previews(previews);
      } else {
        cards[index][field] = value;
      }
      setFormData((p) => ({ ...p, section1: { cards } }));
      return;
    }

    if (section === "section2" && index !== null) {
      const cards = [...formData.section2.cards];
      const previews = [...section2Previews];
      if (field === "image" && files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Section2 Card image")) return;
        cards[index][field] = file;
        previews[index] = URL.createObjectURL(file);
        setSection2Previews(previews);
      } else {
        cards[index][field] = value;
      }
      setFormData((p) => ({ ...p, section2: { cards } }));
      return;
    }

    if (name === "certificateImage") {
      if (files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, "Certificate image")) return;
        setFormData((p) => ({
          ...p,
          certificateSection: {
            ...p.certificateSection,
            image: file,
            existingImage: p.certificateSection.existingImage,
          },
        }));
        setCertificatePreview(URL.createObjectURL(file));
      }
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const addSection1Card = () => {
    setFormData((p) => ({
      ...p,
      section1: {
        cards: [...p.section1.cards, { title: "", text: "", image: null }],
      },
    }));
    setSection1Previews((s) => [...s, null]);
  };
  const removeSection1Card = (i) => {
    setFormData((p) => ({
      ...p,
      section1: { cards: p.section1.cards.filter((_, idx) => idx !== i) },
    }));
    setSection1Previews((s) => s.filter((_, idx) => idx !== i));
  };

  const addSection2Card = () => {
    setFormData((p) => ({
      ...p,
      section2: {
        cards: [
          ...p.section2.cards,
          { title: "", description: "", image: null },
        ],
      },
    }));
    setSection2Previews((s) => [...s, null]);
  };
  const removeSection2Card = (i) => {
    setFormData((p) => ({
      ...p,
      section2: { cards: p.section2.cards.filter((_, idx) => idx !== i) },
    }));
    setSection2Previews((s) => s.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.webpageHeading.trim() ||
        !formData.webpageDescription.trim()
      ) {
        toast.error("Main heading & description required");
        setLoading(false);
        return;
      }

      if (
        formData.section1.cards.length > 0 &&
        !formData.section1Heading.trim()
      ) {
        toast.error("Section1 heading required when cards exist");
        setLoading(false);
        return;
      }
      if (
        formData.section2.cards.length > 0 &&
        !formData.section2Heading.trim()
      ) {
        toast.error("Section2 heading required when cards exist");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.section1.cards.length; i++) {
        const c = formData.section1.cards[i];
        if (!c.title.trim() || !c.text.trim()) {
          toast.error(`Section1 Card ${i + 1} requires title & text`);
          setLoading(false);
          return;
        }
        if (!(c.image instanceof File) && !c.existingImage) {
          toast.error(`Section1 Card ${i + 1} requires an image`);
          setLoading(false);
          return;
        }
      }

      for (let i = 0; i < formData.section2.cards.length; i++) {
        const c = formData.section2.cards[i];
        if (!c.title.trim() || !c.description.trim()) {
          toast.error(`Section2 Card ${i + 1} requires title & description`);
          setLoading(false);
          return;
        }
        if (!(c.image instanceof File) && !c.existingImage) {
          toast.error(`Section2 Card ${i + 1} requires an image`);
          setLoading(false);
          return;
        }
      }

      const cert = formData.certificateSection;
      if (
        !cert.heading.trim() ||
        (!cert.description.trim() && !(cert.existingImage || cert.image))
      ) {
      }
      if (!cert.heading.trim() || !cert.description.trim()) {
        toast.error("Certificate heading & description required");
        setLoading(false);
        return;
      }
      if (!(cert.image instanceof File) && !cert.existingImage) {
        toast.error("Certificate image required");
        setLoading(false);
        return;
      }

      if (formData.status === "published" && existingPublishedCount > 0) {
        const confirm = window.confirm(
          `There are ${existingPublishedCount} other published certification page(s). Publish this and unpublish others?`
        );
        if (!confirm) {
          setLoading(false);
          return;
        }
        try {
          await axiosInstance.put("/api/certificate/published");
        } catch (err) {
          console.warn("unpublishAll failed", err);
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
        if (c.image instanceof File)
          submission.append(`section1[cards][${i}][image]`, c.image);
        else if (c.existingImage)
          submission.append(
            `section1[cards][${i}][existingImage]`,
            c.existingImage
          );
      });

      formData.section2.cards.forEach((c, i) => {
        submission.append(`section2[cards][${i}][title]`, c.title.trim());
        submission.append(
          `section2[cards][${i}][description]`,
          c.description.trim()
        );
        if (c.image instanceof File)
          submission.append(`section2[cards][${i}][image]`, c.image);
        else if (c.existingImage)
          submission.append(
            `section2[cards][${i}][existingImage]`,
            c.existingImage
          );
      });

      if (formData.certificateSection.image instanceof File) {
        submission.append(
          "certificateSection[image]",
          formData.certificateSection.image
        );
      } else if (formData.certificateSection.existingImage) {
        submission.append(
          "certificateSection[existingImage]",
          formData.certificateSection.existingImage
        );
      }

      const res = await putAPI(
        `/api/certificate/update/${page._id}`,
        submission,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.data) {
        toast.success(
          res.data.message || "Certification page updated successfully"
        );
        navigate("/super-admin/certificate", { state: { reload: true } });
      } else {
        toast.error(res.data?.message || "Failed to update page");
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
        <h2>Update Certification Page</h2>
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
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        webpageHeading: e.target.value,
                      }))
                    }
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Main Description *</label>
                  <textarea
                    name="webpageDescription"
                    value={formData.webpageDescription}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        webpageDescription: e.target.value,
                      }))
                    }
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
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          buttonName: e.target.value,
                        }))
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Button Link</label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          buttonLink: e.target.value,
                        }))
                      }
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
                    value={formData.section1Heading}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        section1Heading: e.target.value,
                      }))
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Section 1 Description</label>
                  <textarea
                    value={formData.section1Description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        section1Description: e.target.value,
                      }))
                    }
                    className="form-control"
                    rows={3}
                  />
                </div>

                {formData.section1.cards.length > 0 && <h5>Section1 Cards</h5>}
                {formData.section1.cards.map((c, i) => (
                  <div key={i} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Card Title (bold)</label>
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
                      <label>Text</label>
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
                      <label>Image</label>
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
                    value={formData.section2Heading}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        section2Heading: e.target.value,
                      }))
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Section 2 Description</label>
                  <textarea
                    value={formData.section2Description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        section2Description: e.target.value,
                      }))
                    }
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
                  <label>Certificate Heading</label>
                  <input
                    type="text"
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
                  />
                </div>
                <div className="form-group">
                  <label>Certificate Description</label>
                  <textarea
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
                  />
                </div>
                <div className="form-group">
                  <label>Certificate Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    name="certificateImage"
                    onChange={handleChange}
                    className="form-control"
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
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, status: e.target.value }))
                    }
                    className="form-control"
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
                    {loading ? "Updating..." : "Update Certification Page"}
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

export default CertificationEdit;
