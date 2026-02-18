import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HowToSellView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [formData, setFormData] = useState({
    webpageHeading: "",
    webpageDescription: "",
    articles: [
      { articleHeading: "", articleContent: "", bannerImage: null },
    ],
  });

  const [bannerPreviews, setBannerPreviews] = useState([null]);

  useEffect(() => {
    if (!page) {
      toast.error("No page data provided.");
      navigate("/super-admin/how-to-sell");
    } else {
      setFormData({
        webpageHeading: page.webpageHeading || "",
        webpageDescription: page.webpageDescription || "",
        articles: page.articles?.length
          ? page.articles
          : [{ articleHeading: "", articleContent: "", bannerImage: null }],
      });

      setBannerPreviews(
        page.articles?.map((a) =>
          a.bannerImage
            ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${a.bannerImage}`
            : null
        ) || [null]
      );
    }
  }, [page, navigate]);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>View Page</h2>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <div className="form-group">
                <label>Webpage Heading</label>
                <input
                  type="text"
                  value={formData.webpageHeading}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Webpage Description</label>
                <textarea
                  value={formData.webpageDescription}
                  className="form-control"
                  disabled
                />
              </div>

              {formData.articles.map((article, idx) => (
                <div key={idx} className="border p-3 mb-3">
                  <div className="form-group">
                    <label>Article Heading</label>
                    <input
                      type="text"
                      value={article.articleHeading}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Article Content</label>
                    <textarea
                      value={article.articleContent}
                      className="form-control"
                      disabled
                    />
                  </div>
                  {bannerPreviews[idx] && (
                    <div className="mt-2">
                      <img
                        src={bannerPreviews[idx]}
                        alt="Banner Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToSellView;
