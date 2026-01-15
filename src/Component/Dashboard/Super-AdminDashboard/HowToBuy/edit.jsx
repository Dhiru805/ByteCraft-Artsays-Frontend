
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import putAPI from "../../../../api/putAPI";

const UpdateHowToBuy = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    status: "draft", 
    articles: [{ articleHeading: "", articleContent: "", bannerImage: null, existingBanner: null }],
  });
  const [bannerPreviews, setBannerPreviews] = useState([null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!page) {
      toast.error("No How To Buy page data provided.");
      navigate("/super-admin/how-to-buy");
    } else {
      setFormData({
        webpageHeading: page.webpageHeading || "",
        webpageDescription: page.webpageDescription || "",
        status: page.status || "draft",
        articles:
          page.articles?.length > 0
            ? page.articles.map((a) => ({
                articleHeading: a.articleHeading || "",
                articleContent: a.articleContent || "",
                bannerImage: null,
                existingBanner: a.bannerImage || null,
              }))
            : [{ articleHeading: "", articleContent: "", bannerImage: null, existingBanner: null }],
      });

      setBannerPreviews(
        page.articles?.map((a) =>
          a.bannerImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${a.bannerImage}` : null
        ) || [null]
      );
    }
  }, [page, navigate]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (field !== null && index !== null) {
      const newArticles = [...formData.articles];

      if (field === "bannerImage" && files[0]) {
        const file = files[0];

        if (!file.type.match(/image\/(jpeg|png)/)) {
          toast.error("Banner image must be a JPEG or PNG file.");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error("Banner image size must be less than 5MB.");
          return;
        }

        newArticles[index][field] = file;

        const newPreviews = [...bannerPreviews];
        newPreviews[index] = URL.createObjectURL(file);
        setBannerPreviews(newPreviews);
      } else {
        newArticles[index][field] = value;
      }

      setFormData({ ...formData, articles: newArticles });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addArticle = () => {
    setFormData({
      ...formData,
      articles: [...formData.articles, { articleHeading: "", articleContent: "", bannerImage: null, existingBanner: null }],
    });
    setBannerPreviews([...bannerPreviews, null]);
  };

  const removeArticle = (index) => {
    const newArticles = formData.articles.filter((_, i) => i !== index);
    const newPreviews = bannerPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, articles: newArticles });
    setBannerPreviews(newPreviews);
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const submissionData = new FormData();
    submissionData.append("webpageHeading", formData.webpageHeading.trim());
    submissionData.append("webpageDescription", formData.webpageDescription.trim());
    submissionData.append("status", formData.status);
    
    formData.articles.forEach((article, i) => {
      submissionData.append(`articles[${i}][articleHeading]`, article.articleHeading);
      submissionData.append(`articles[${i}][articleContent]`, article.articleContent);

      if (article.bannerImage instanceof File) {
        submissionData.append(`articles[${i}][bannerImage]`, article.bannerImage);
      } else if (article.existingBanner) {
        submissionData.append(`articles[${i}][existingBanner]`, article.existingBanner);
      }
    });

    const response = await putAPI(`/api/howtobuy/update/${page._id}`, submissionData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.data) {
      toast.success("How To Buy page updated successfully!");
      navigate("/super-admin/how-to-buy", { state: { reload: true } });
    } else {
      toast.error(response.data.message || "Failed to update How To Buy page");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error updating page");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <h2>Update Page</h2>
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


                  <h4>Articles</h4>
                  {formData.articles.map((article, idx) => (
                    <div key={idx} className="border mb-3 p-2">
                      <div className="form-group">
                        <label>Article Heading *</label>
                        <input
                          type="text"
                          value={article.articleHeading}
                          onChange={(e) => handleChange(e, idx, "articleHeading")}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Article Content *</label>
                        <textarea
                          value={article.articleContent}
                          onChange={(e) => handleChange(e, idx, "articleContent")}
                          className="form-control"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Banner Image *</label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={(e) => handleChange(e, idx, "bannerImage")}
                          className="form-control"
                          required
                        />
                        {bannerPreviews[idx] && (
                          <div className="mt-2">
                            <img
                              src={bannerPreviews[idx]}
                              alt="Banner Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => removeArticle(idx)}
                      >
                        Remove Article
                      </button>
                    </div>
                  ))}

                  <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                    <button type="button" className="btn btn-secondary" onClick={addArticle}>
                      Add Article
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Page
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateHowToBuy;
