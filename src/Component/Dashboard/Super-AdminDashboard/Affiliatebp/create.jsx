import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../api/postAPI";

function AffiliateBPCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    status: "draft",
    cardsHeading: "",
    cardsDescription: "",
    articles: [{ articleHeading: "", articleContent: "", bannerImage: null, buttonName: "", buttonPath: "" }],
    cards: [],
  });

  const [bannerPreviews, setBannerPreviews] = useState([null]);
  const [cardPreviews, setCardPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`${type} must be JPEG or PNG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null, type = "article") => {
    const { name, value, files } = e.target;

    if (field !== null && index !== null) {
      const list = type === "article" ? [...formData.articles] : [...formData.cards];
      const previews = type === "article" ? [...bannerPreviews] : [...cardPreviews];

      if (files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file, type === "article" ? "Banner image" : "Card image")) return;

        list[index][field] = file;
        previews[index] = URL.createObjectURL(file);
        type === "article" ? setBannerPreviews(previews) : setCardPreviews(previews);
      } else {
        list[index][field] = value;
      }

      type === "article" ? setFormData({ ...formData, articles: list }) : setFormData({ ...formData, cards: list });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addArticle = () => {
    setFormData({
      ...formData,
      articles: [...formData.articles, { articleHeading: "", articleContent: "", bannerImage: null, buttonName: "", buttonPath: "" }],
    });
    setBannerPreviews([...bannerPreviews, null]);
  };

  const removeArticle = (idx) => {
    setFormData({ ...formData, articles: formData.articles.filter((_, i) => i !== idx) });
    setBannerPreviews(bannerPreviews.filter((_, i) => i !== idx));
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardTitle: "", cardImage: null }],
    });
    setCardPreviews([...cardPreviews, null]);
  };

  const removeCard = (idx) => {
    setFormData({ ...formData, cards: formData.cards.filter((_, i) => i !== idx) });
    setCardPreviews(cardPreviews.filter((_, i) => i !== idx));
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

      for (let i = 0; i < formData.articles.length; i++) {
        const a = formData.articles[i];
        if (!a.articleHeading.trim() || !a.articleContent.trim()) {
          toast.error(`Article ${i + 1} requires heading & content`);
          setLoading(false);
          return;
        }
        if (!a.bannerImage) {
          toast.error(`Banner image required for article ${i + 1}`);
          setLoading(false);
          return;
        }
      }

      const hasCardsSection = formData.cardsHeading.trim() || formData.cards.length > 0;
      if (hasCardsSection) {
        if (!formData.cardsHeading.trim()) {
          toast.error("Cards section heading is required if cards are added");
          setLoading(false);
          return;
        }
        for (let i = 0; i < formData.cards.length; i++) {
          const c = formData.cards[i];
          if (!c.cardTitle.trim() || !c.cardImage) {
            toast.error(`Card ${i + 1} requires title and image`);
            setLoading(false);
            return;
          }
        }
      }

      const submissionData = new FormData();
      submissionData.append("webpageHeading", formData.webpageHeading.trim());
      submissionData.append("webpageDescription", formData.webpageDescription.trim());
      submissionData.append("status", formData.status);
      submissionData.append("cardsHeading", formData.cardsHeading.trim());
      submissionData.append("cardsDescription", formData.cardsDescription.trim());

      formData.articles.forEach((a, idx) => {
        submissionData.append(`articles[${idx}][articleHeading]`, a.articleHeading.trim());
        submissionData.append(`articles[${idx}][articleContent]`, a.articleContent.trim());
        submissionData.append(`articles[${idx}][buttonName]`, a.buttonName || "");
        submissionData.append(`articles[${idx}][buttonPath]`, a.buttonPath || "");
        if (a.bannerImage) submissionData.append(`articles[${idx}][bannerImage]`, a.bannerImage);
      });

      formData.cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][cardTitle]`, c.cardTitle.trim());
        if (c.cardImage) submissionData.append(`cards[${idx}][cardImage]`, c.cardImage);
      });

      const res = await postAPI("/api/affiliate-bp/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.data) {
        toast.success(res.data.message || "Affiliate Brand Partner page created successfully!");
        navigate("/super-admin/affiliate-bp", { state: { reload: true } });
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
        <h2>Create Affiliate Brand Partner Page</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Webpage Heading *</label>
                  <input type="text" name="webpageHeading" value={formData.webpageHeading} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group">
                  <label>Webpage Description *</label>
                  <textarea name="webpageDescription" value={formData.webpageDescription} onChange={handleChange} className="form-control" rows={4} required />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <h4>Articles</h4>
                {formData.articles.map((a, idx) => (
                  <div key={idx} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Article Heading *</label>
                      <input type="text" value={a.articleHeading} onChange={(e) => handleChange(e, idx, "articleHeading")} className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>Article Content *</label>
                      <textarea value={a.articleContent} onChange={(e) => handleChange(e, idx, "articleContent")} className="form-control" rows={3} required />
                    </div>

                    <div className="form-group">
                      <label>Banner Image *</label>
                      <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleChange(e, idx, "bannerImage", "article")} className="form-control" required />
                      {bannerPreviews[idx] && <img src={bannerPreviews[idx]} alt="Banner Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
                    </div>

                    <div className="form-group">
                      <label>Button Name (optional)</label>
                      <input type="text" value={a.buttonName} onChange={(e) => handleChange(e, idx, "buttonName")} className="form-control" />
                    </div>

                    <div className="form-group">
                      <label>Button Path (optional)</label>
                      <input type="text" value={a.buttonPath} onChange={(e) => handleChange(e, idx, "buttonPath")} className="form-control" />
                    </div>

                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeArticle(idx)}>Remove Article</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addArticle}>Add Article</button>

                <div className="form-group">
                  <label>Cards Section Heading (Visible only when at least a single card exists)</label>
                  <input type="text" name="cardsHeading" value={formData.cardsHeading} onChange={handleChange} className="form-control" placeholder="Enter heading for the cards section" />
                </div>

                
                <div className="form-group">
                  <label>Cards Section Description</label>
                  <textarea
                    name="cardsDescription"
                    value={formData.cardsDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    placeholder="Enter description for the cards section"
                  />
                </div>

                {formData.cards.length > 0 && <h4>Cards (Optional)</h4>}
                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Card Title</label>
                      <input type="text" value={c.cardTitle} onChange={(e) => handleChange(e, idx, "cardTitle", "card")} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Card Image</label>
                      <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleChange(e, idx, "cardImage", "card")} className="form-control" />
                      {cardPreviews[idx] && <img src={cardPreviews[idx]} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
                    </div>
                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Create Affiliate Brand Partner Page"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AffiliateBPCreate;
