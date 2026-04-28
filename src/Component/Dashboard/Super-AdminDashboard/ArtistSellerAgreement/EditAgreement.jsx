import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";
import getAPI from "../../../../api/getAPI";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import "react-toastify/dist/ReactToastify.css";

const EditAgreement = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const quillRef = useRef(null);

  const [agreement, setAgreement] = useState(state?.agreement || null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
  });

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const agreementId = state?.agreement?._id;
        if (!agreementId) {
          toast.error("No agreement provided.");
          navigate("/super-admin/artist-seller-agreement");
          return;
        }

        const res = await getAPI(`/api/getArtistSellerAgreement/${agreementId}`);
        if (!res.hasError) {
          const fetched = res.data.data;
          setAgreement(fetched);
          setFormData({
            title: fetched.title || "",
            description: fetched.description || "",
            status: fetched.status || "draft",
          });
        } else {
          toast.error(res.message || "Failed to fetch agreement.");
        }
      } catch (err) {
        console.error("Error fetching agreement:", err);
        toast.error("Failed to fetch agreement.");
      }
    };

    fetchAgreement();
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sanitizeHtml = (html) => {
    return typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: sanitizeHtml(formData.description),
      status: formData.status,
    };

    try {
      const response = await putAPI(
        `/api/updateArtistSellerAgreement/${agreement._id}`,
        payload
      );

      if (!response.hasError) {
        toast.success("Agreement updated successfully.");
        navigate("/super-admin/artist-seller-agreement", {
          state: { updatedAgreement: response.data.data },
        });
      } else {
        toast.error(response.message || "Failed to update agreement.");
      }
    } catch (err) {
      console.error("Error updating agreement:", err);
      toast.error("An error occurred while updating agreement.");
    }
  };

  return (
    <div className="block-header">
      <div className="row">
        <h2>Update Artist/Seller Agreement</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
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
                <div className="form-group">
                  <label>Description</label>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.description}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, description: content }))
                    }
                    className="mt-2"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Agreement
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAgreement;
