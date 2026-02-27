
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../api/postAPI";

function ContactUsCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    status: "draft",
    cards: [], 
    bannerImage: null,
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  
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

  const removeCard = (idx) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.webpageHeading.trim() || !formData.webpageDescription.trim()) {
        toast.error("Heading & Description are required");
        setLoading(false);
        return;
      }
      if (!formData.bannerImage) {
        toast.error("Banner image is required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.cards.length; i++) {
        const c = formData.cards[i];
        if (!c.cardHeading.trim() || !c.cardDescription.trim()) {
          toast.error(`Card ${i + 1} requires heading & description`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("webpageHeading", formData.webpageHeading.trim());
      submissionData.append("webpageDescription", formData.webpageDescription.trim());
      submissionData.append("status", formData.status);
      if (formData.bannerImage) {
        submissionData.append("bannerImage", formData.bannerImage);
      }

      formData.cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][cardHeading]`, c.cardHeading.trim());
        submissionData.append(`cards[${idx}][cardDescription]`, c.cardDescription.trim());
      });

      const res = await postAPI("/api/contactus/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.data) {
        toast.success(res.data.message || "Contact Us page created successfully!");
        navigate("/super-admin/contactus", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to create page");
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
        <h2>Create Contact Us Page</h2>
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
                    required
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
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

       
                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Card Heading *</label>
                      <input
                        type="text"
                        value={c.cardHeading}
                        onChange={(e) => handleChange(e, idx, "cardHeading")}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Card Description *</label>
                      <textarea
                        value={c.cardDescription}
                        onChange={(e) => handleChange(e, idx, "cardDescription")}
                        className="form-control"
                        rows={3}
                        required
                      />
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
                    {loading ? "Creating..." : "Create Contact Us Page"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsCreate;
