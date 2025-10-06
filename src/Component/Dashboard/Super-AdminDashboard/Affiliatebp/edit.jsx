import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import putAPI from "../../../../api/putAPI";

const UpdateAffiliateBP = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    status: "draft",
    cardsHeading: "",
    cardsDescription: "",
    articles: [],
    cards: [],
  });

  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [cardPreviews, setCardPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!page) {
      toast.error("No Affiliate Brand Partner page data provided.");
      navigate("/super-admin/affiliate-bp");
      return;
    }

    setFormData({
      webpageHeading: page.webpageHeading || "",
      webpageDescription: page.webpageDescription || "",
      status: page.status || "draft",
      cardsHeading: page.cardsHeading || "",
      cardsDescription: page.cardsDescription || "",
      articles: page.articles?.map((a) => ({
        articleHeading: a.articleHeading || "",
        articleContent: a.articleContent || "",
        bannerImage: null,
        existingBanner: a.bannerImage || null,
        buttonName: a.buttonName || "",
        buttonPath: a.buttonPath || "",
      })) || [],
      cards: page.cards?.map((c) => ({
        cardTitle: c.cardTitle || "",
        cardImage: null,
        existingCardImage: c.cardImage || null,
      })) || [],
    });

    setBannerPreviews(page.articles?.map((a) =>
      a.bannerImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${a.bannerImage}` : null
    ) || []);

    setCardPreviews(page.cards?.map((c) =>
      c.cardImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${c.cardImage}` : null
    ) || []);
  }, [page, navigate]);

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error(`${type} must be JPEG or PNG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be < 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null, type = "article") => {
    const { value, files, name } = e.target;

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
      articles: [
        ...formData.articles,
        { articleHeading: "", articleContent: "", bannerImage: null, existingBanner: null, buttonName: "", buttonPath: "" },
      ],
    });
    setBannerPreviews([...bannerPreviews, null]);
  };

  const removeArticle = (index) => {
    setFormData({ ...formData, articles: formData.articles.filter((_, i) => i !== index) });
    setBannerPreviews(bannerPreviews.filter((_, i) => i !== index));
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardTitle: "", cardImage: null, existingCardImage: null }],
    });
    setCardPreviews([...cardPreviews, null]);
  };

  const removeCard = (index) => {
    setFormData({ ...formData, cards: formData.cards.filter((_, i) => i !== index) });
    setCardPreviews(cardPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.webpageHeading.trim() || !formData.webpageDescription.trim()) {
        toast.error("Heading & Description required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.articles.length; i++) {
        const a = formData.articles[i];
        if (!a.articleHeading.trim() || !a.articleContent.trim()) {
          toast.error(`Article ${i + 1} must have heading & content`);
          setLoading(false);
          return;
        }
        if (!(a.bannerImage instanceof File) && !a.existingBanner) {
          toast.error(`Article ${i + 1} must have a banner image`);
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
          if (!c.cardTitle.trim()) {
            toast.error(`Card ${i + 1} must have a title`);
            setLoading(false);
            return;
          }
          if (!(c.cardImage instanceof File) && !c.existingCardImage) {
            toast.error(`Card ${i + 1} must have an image`);
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

      formData.articles.forEach((a, i) => {
        submissionData.append(`articles[${i}][articleHeading]`, a.articleHeading);
        submissionData.append(`articles[${i}][articleContent]`, a.articleContent);
        submissionData.append(`articles[${i}][buttonName]`, a.buttonName);
        submissionData.append(`articles[${i}][buttonPath]`, a.buttonPath);
        if (a.bannerImage instanceof File) submissionData.append(`articles[${i}][bannerImage]`, a.bannerImage);
        else if (a.existingBanner) submissionData.append(`articles[${i}][existingBanner]`, a.existingBanner);
      });

      formData.cards.forEach((c, i) => {
        submissionData.append(`cards[${i}][cardTitle]`, c.cardTitle);
        if (c.cardImage instanceof File) submissionData.append(`cards[${i}][cardImage]`, c.cardImage);
        else if (c.existingCardImage) submissionData.append(`cards[${i}][existingCardImage]`, c.existingCardImage);
      });

      const response = await putAPI(`/api/affiliate-bp/update/${page._id}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.data) {
        toast.success("Affiliate Brand Partner page updated successfully!");
        navigate("/super-admin/affiliate-bp", { state: { reload: true } });
      } else {
        toast.error(response.data.message || "Failed to update AffiliateBP page");
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
        <h2>Update Affiliate Brand Partner Page</h2>
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
                  <select name="status" value={formData.status} onChange={handleChange} className="form-control">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <h4>Articles</h4>
                {formData.articles.map((a, i) => (
                  <div key={i} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Article Heading *</label>
                      <input type="text" value={a.articleHeading} onChange={(e) => handleChange(e, i, "articleHeading", "article")} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Article Content *</label>
                      <textarea value={a.articleContent} onChange={(e) => handleChange(e, i, "articleContent", "article")} className="form-control" rows={3} />
                    </div>
                    <div className="form-group">
                      <label>Banner Image *</label>
                      <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleChange(e, i, "bannerImage", "article")} className="form-control" />
                      {bannerPreviews[i] && <img src={bannerPreviews[i]} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }} />}
                    </div>
                    <div className="form-group">
                      <label>Button Name (optional)</label>
                      <input type="text" value={a.buttonName} onChange={(e) => handleChange(e, i, "buttonName", "article")} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Button Path (optional)</label>
                      <input type="text" value={a.buttonPath} onChange={(e) => handleChange(e, i, "buttonPath", "article")} className="form-control" />
                    </div>
                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeArticle(i)}>Remove Article</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addArticle}>Add Article</button>

                <div className="form-group">
                  <label>Cards Section Heading (Visible only when at least a single card exists)</label>
                  <input type="text" name="cardsHeading" value={formData.cardsHeading} onChange={handleChange} className="form-control" placeholder="Enter heading for cards section" />
                </div>
                <div className="form-group">
                  <label>Cards Section Description (Optional)</label>
                  <textarea
                    name="cardsDescription"
                    value={formData.cardsDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    placeholder="Enter description for cards section"
                  />
                </div>

                {formData.cards.length > 0 && <h4>Cards (Optional)</h4>}
                {formData.cards.map((c, i) => (
                  <div key={i} className="border mb-3 p-2">
                    <div className="form-group">
                      <label>Card Title *</label>
                      <input type="text" value={c.cardTitle} onChange={(e) => handleChange(e, i, "cardTitle", "card")} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Card Image *</label>
                      <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleChange(e, i, "cardImage", "card")} className="form-control" />
                      {cardPreviews[i] && <img src={cardPreviews[i]} alt="Card Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }} />}
                    </div>
                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(i)}>Remove Card</button>
                  </div>
                ))}

                <div className="d-flex align-items-center mb-3" style={{ gap: "20px" }}>
                  <button type="button" className="btn btn-secondary" onClick={addCard}>Add Card</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Affiliate BP Page"}
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

export default UpdateAffiliateBP;
