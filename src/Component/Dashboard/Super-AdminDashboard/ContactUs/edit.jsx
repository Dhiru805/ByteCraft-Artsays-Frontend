

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import putAPI from "../../../../api/putAPI";

const UpdateContactUs = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    status: "draft",
    cards: [],
    bannerImage: null,
    existingBanner: null,
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!page) {
      toast.error("No Contact Us page data provided.");
      navigate("/super-admin/contactus");
      return;
    }

    setFormData({
      webpageHeading: page.webpageHeading || "",
      webpageDescription: page.webpageDescription || "",
      status: page.status || "draft",
      cards: page.cards?.map((c) => ({
        cardHeading: c.cardHeading || "",
        cardDescription: c.cardDescription || "",
      })) || [],
      bannerImage: null,
      existingBanner: page.bannerImage || null,
    });

    if (page.bannerImage) {
      setBannerPreview(`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${page.bannerImage}`);
    }
  }, [page, navigate]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (field !== null && index !== null) {
      const list = [...formData.cards];
      list[index][field] = value;
      setFormData({ ...formData, cards: list });
    } else if (name === "bannerImage" && files && files[0]) {
      const file = files[0];
      if (!file.type.match(/image\/(jpeg|png)/)) {
        toast.error("Banner must be JPEG or PNG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Banner must be less than 5MB");
        return;
      }
      setFormData({ ...formData, bannerImage: file });
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardHeading: "", cardDescription: "" }],
    });
  };

  const removeCard = (index) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedData = {
        ...formData,
        webpageHeading: formData.webpageHeading.trim(),
        webpageDescription: formData.webpageDescription.trim(),
        cards: formData.cards.map((c) => ({
          cardHeading: c.cardHeading.trim(),
          cardDescription: c.cardDescription.trim(),
        })),
      };

      if (!trimmedData.webpageHeading || !trimmedData.webpageDescription) {
        toast.error("Heading & Description are required");
        setLoading(false);
        return;
      }

      if (!(trimmedData.bannerImage instanceof File) && !trimmedData.existingBanner) {
        toast.error("Banner image is required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < trimmedData.cards.length; i++) {
        const c = trimmedData.cards[i];
        if (!c.cardHeading || !c.cardDescription) {
          toast.error(`Card ${i + 1} requires heading & description`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("webpageHeading", trimmedData.webpageHeading);
      submissionData.append("webpageDescription", trimmedData.webpageDescription);
      submissionData.append("status", trimmedData.status);

      if (trimmedData.bannerImage instanceof File) {
        submissionData.append("bannerImage", trimmedData.bannerImage);
      } else if (trimmedData.existingBanner) {
        submissionData.append("existingBanner", trimmedData.existingBanner);
      }

      trimmedData.cards.forEach((c, i) => {
        submissionData.append(`cards[${i}][cardHeading]`, c.cardHeading);
        submissionData.append(`cards[${i}][cardDescription]`, c.cardDescription);
      });

      const response = await putAPI(`/api/contactus/update/${page._id}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.data) {
        toast.success("Contact Us page updated successfully!");
        navigate("/super-admin/contactus", { state: { reload: true } });
      } else {
        toast.error(response.data.message || "Failed to update Contact Us page");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Update Contact Us Page</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
     
                <div className="form-group">
                  <label>Webpage Heading *</label>
                  <input
                    type="text"
                    name="webpageHeading"
                    value={formData.webpageHeading}
                    onChange={handleChange}
                    className="form-control"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Webpage Description *</label>
                  <textarea
                    name="webpageDescription"
                    value={formData.webpageDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Banner Image *</label>
                  <input
                    type="file"
                    name="bannerImage"
                    accept="image/jpeg,image/png"
                    onChange={handleChange}
                    className="form-control"
                    disabled={loading}
                  />
                  {bannerPreview && (
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "200px",
                        objectFit: "contain",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-control"
                    disabled={loading}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                {formData.cards.map((c, i) => (
                  <div key={i} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Card Heading *</label>
                      <input
                        type="text"
                        value={c.cardHeading}
                        onChange={(e) => handleChange(e, i, "cardHeading")}
                        className="form-control"
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Description *</label>
                      <textarea
                        value={c.cardDescription}
                        onChange={(e) => handleChange(e, i, "cardDescription")}
                        className="form-control"
                        rows={3}
                        disabled={loading}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => removeCard(i)}
                      disabled={loading}
                    >
                      Remove Card
                    </button>
                  </div>
                ))}

                <div className="d-flex align-items-center mb-3" style={{ gap: "20px" }}>
                  <button type="button" className="btn btn-secondary" onClick={addCard} disabled={loading}>
                    Add Card
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Contact Us Page"}
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

export default UpdateContactUs;
