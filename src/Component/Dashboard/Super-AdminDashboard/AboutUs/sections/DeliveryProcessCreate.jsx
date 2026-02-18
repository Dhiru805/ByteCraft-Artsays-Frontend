import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const DeliveryProcessCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    //status: "draft",
    cards: [{ step: 1, heading: "", description: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const loadAboutUsAndSection = async () => {
      try {
        const res = await getAPI("/api/about-us");
        let page = res.data.data?.[0];
        if (!page) {
          toast.error("No About Us draft found. Create the page first.");
          navigate("/super-admin/about-us/create");
          return;
        }
        setAboutUsId(page._id);
        
        const sectionRes = await getAPI(`/api/about-us-sections/delivery-process/${page._id}`);
        
        let section = null;
        if (sectionRes.data.success && sectionRes.data.data) {
          section = sectionRes.data.data;
        } else if (sectionRes.data.data) {
          section = sectionRes.data.data;
        }
        
        if (section) {
          setSectionId(section._id);
          
          const mappedCards = section.steps?.length 
            ? section.steps.map((step, index) => ({
                step: index + 1,
                heading: step.stepTitle || "",
                description: step.stepDescription || ""
              }))
            : [{ step: 1, heading: "", description: "" }];
          
          setFormData({
            mainHeading: section.heading || "", 
            mainDescription: section.description || "", 
            cards: mappedCards,
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };
    loadAboutUsAndSection();
  }, []);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null && field !== null) {
      const updatedCards = [...formData.cards];
      updatedCards[index][field] = value;
      setFormData({ ...formData, cards: updatedCards });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { step: formData.cards.length + 1, heading: "", description: "" }],
    });
  };

  const removeCard = (idx) => {
    const updatedCards = formData.cards.filter((_, i) => i !== idx).map((c, index) => ({ ...c, step: index + 1 }));
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!aboutUsId) {
        toast.error("About Us page not ready yet. Please wait.");
        setLoading(false);
        return;
      }
      if (!formData.mainHeading.trim() || !formData.mainDescription.trim()) {
        toast.error("Main Heading & Description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.cards.length; i++) {
        const c = formData.cards[i];
        if (!c.heading.trim() || !c.description.trim()) {
          toast.error(`Card ${i + 1} requires heading and description`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("mainHeading", formData.mainHeading.trim());
      submissionData.append("mainDescription", formData.mainDescription.trim());
      //submissionData.append("status", formData.status);

      const cardsForBackend = formData.cards.map(c => ({
        heading: c.heading.trim(),
        description: c.description.trim(),
        stepImage: c.stepImage || undefined
      }));
      
      submissionData.append("cards", JSON.stringify(cardsForBackend));

      const endpoint = sectionId
        ? `/api/about-us-sections/delivery-process/update/${sectionId}`
        : "/api/about-us-sections/delivery-process/create";

      const res = await postAPI(endpoint, submissionData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success(res.data.message || "Delivery Process saved successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to save delivery process");
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
        <h2>{sectionId ? "Edit Delivery Process" : "Create Delivery Process"}</h2>
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
                  <small className="text-muted">
                    Supports multiple lines. Markdown tags like **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt; will be rendered.
                  </small>
                </div>

               
                {/* <div className="form-group">
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
                </div> */}

                {formData.cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Step Number</label>
                      <input
                        type="number"
                        value={c.step}
                        onChange={(e) => handleChange(e, idx, "step")}
                        className="form-control"
                        min={1}
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Heading *</label>
                      <input
                        type="text"
                        value={c.heading}
                        onChange={(e) => handleChange(e, idx, "heading")}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Description *</label>
                      <textarea
                        value={c.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={4}
                        required
                      />
                      <small className="text-muted">
                        Supports multiple lines and basic formatting: **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt;
                      </small>
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
                    {loading ? "Saving..." : sectionId ? "Update Delivery Process" : "Create Delivery Process"}
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

export default DeliveryProcessCreate;
