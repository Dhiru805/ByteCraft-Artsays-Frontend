

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../../api/axiosConfig";
import getAPI from "../../../../../api/getAPI";

const TestimonialsEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state?.data || location.state?.section; 

  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    status: "draft",
    testimonials: [],
  });

  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(null);

 
  useEffect(() => {
    const ensureAboutUsPage = async () => {
      try {
        const res = await getAPI("/api/about-us");
        let page = res.data.data?.[0];

        if (!page) {
          const createRes = await axiosInstance.post("/api/about-us/create", {
            title: "About Us",
          });
          page = createRes.data.data;
        }

        setAboutUsId(page._id);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };
    ensureAboutUsPage();
  }, []);

  useEffect(() => {
    if (existingData && existingData._id) {
      setFormData({
        mainHeading: existingData.mainHeading || "",
        mainDescription: existingData.mainDescription || "",
        status: existingData.status || "draft",
        testimonials: existingData.testimonials || [],
      });
      return;
    }
    const loadIfMissing = async () => {
      try {
        const res = await getAPI("/api/about-us");
        const pages = Array.isArray(res.data.data) ? res.data.data : [];
        const page = pages[0] || null;
        const s = page?.testimonials || null;
        if (s) {
          setFormData({
            mainHeading: s.mainHeading || "",
            mainDescription: s.mainDescription || "",
            status: s.status || "draft",
            testimonials: Array.isArray(s.testimonials) ? s.testimonials : [],
          });
        } else {
          setFormData({
            mainHeading: "",
            mainDescription: "",
            status: "draft",
            testimonials: [{ name: "", description: "" }],
          });
        }
      } catch (_err) {
        setFormData({
          mainHeading: "",
          mainDescription: "",
          status: "draft",
          testimonials: [{ name: "", description: "" }],
        });
      }
    };
    loadIfMissing();
  }, [existingData]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null && field !== null) {
      const updatedTestimonials = [...formData.testimonials];
      updatedTestimonials[index][field] = value;
      setFormData({ ...formData, testimonials: updatedTestimonials });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { description: "", name: "" }],
    });
  };

  const removeTestimonial = (idx) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aboutUsId) {
      toast.error("About Us page not ready yet. Please wait.");
      return;
    }

    setLoading(true);

    try {
      if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
        toast.error("Main heading and description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.testimonials.length; i++) {
        const t = formData.testimonials[i];
        if (!t.description.trim() || !t.name.trim()) {
          toast.error(`Testimonial ${i + 1} requires description and name`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("mainHeading", formData.mainHeading.trim());
      submissionData.append("mainDescription", formData.mainDescription.trim());
      submissionData.append("status", formData.status);
      
      console.log("Submitting testimonials data:", {
        aboutUsId,
        mainHeading: formData.mainHeading,
        mainDescription: formData.mainDescription,
        status: formData.status,
        testimonials: formData.testimonials,
        sectionId: existingData?._id || 'current'
      });

      formData.testimonials.forEach((t, idx) => {
        submissionData.append(`testimonials[${idx}][description]`, t.description.trim());
        submissionData.append(`testimonials[${idx}][name]`, t.name.trim());
      });

      const sectionId = existingData?._id || 'current';
      
      
      let res;
      try {
        res = await axiosInstance.put(
          `/api/about-us-sections/testimonials/update/${sectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } catch (putError) {
       
        res = await axiosInstance.post(
          `/api/about-us-sections/testimonials/update/${sectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (res.data.success) {
        toast.success(res.data.message || "Testimonials updated successfully!");
        navigate("/super-admin/about-us/edit", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to update testimonials");
      }
    } catch (err) {
      console.error("Testimonials update error:", err);
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Testimonials Page</h2>
        {!aboutUsId && <p className="text-warning">Loading About Us page, please wait...</p>}

        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
             
                <div className="form-group">
                  <label>Main Heading *</label>
                  <input
                    type="text"
                    name="mainHeading"
                    value={formData.mainHeading}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Main Description *</label>
                  <textarea
                    name="mainDescription"
                    value={formData.mainDescription}
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
                {formData.testimonials.map((t, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={t.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => handleChange(e, idx, "name")}
                        className="form-control"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => removeTestimonial(idx)}
                    >
                      Remove Testimonial
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addTestimonial}
                >
                  Add Testimonial
                </button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || !aboutUsId}>
                    {loading ? "Updating..." : "Update Testimonials Page"}
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

export default TestimonialsEdit;
