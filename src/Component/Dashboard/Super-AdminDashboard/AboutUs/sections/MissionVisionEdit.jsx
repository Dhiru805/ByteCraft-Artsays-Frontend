import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";
import axiosInstance from "../../../../../api/axiosConfig";

const MissionVisionEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: initialSectionId, aboutUsId: passedAboutUsId, section: passedSection } = location.state || {}; 

  const [cards, setCards] = useState([]);
  const [iconPreviews, setIconPreviews] = useState([]);
  const [sideImagePreviews, setSideImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(null);
  const [sectionId, setSectionId] = useState(initialSectionId || (passedSection && passedSection._id) || null);

  useEffect(() => {
    const ensureAboutUsPage = async () => {
      try {
        if (passedAboutUsId) {
          setAboutUsId(passedAboutUsId);
        } else {
          const res = await getAPI("/api/about-us");
          const pages = Array.isArray(res.data.data) ? res.data.data : [];
          const latest = pages[0];
          if (latest?._id) setAboutUsId(latest._id);
        }
        
        if (passedSection && passedSection._id) {
          setSectionId(passedSection._id);
        } else if (!sectionId) {
          const res = await getAPI("/api/about-us");
          const pages = Array.isArray(res.data.data) ? res.data.data : [];
          const latest = pages[0];
          if (latest?.missionVision?._id) setSectionId(latest.missionVision._id);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };
    ensureAboutUsPage();
  }, [sectionId, passedAboutUsId, passedSection]);

  useEffect(() => {
    if (!sectionId) return;
    fetchData(sectionId);
  }, [sectionId]);

  const fetchData = async (sid) => {
    try {
      const res = await getAPI(`/api/about-us`);
      const page = Array.isArray(res.data.data) ? res.data.data[0] : null;
      const section = page?.missionVision || {};
      if (section?.cards) {
        setCards(section.cards.map(c => ({
          icon: c.icon || null,
          heading: c.heading,
          description: c.description,
          sideImage: c.sideImage || null,
          _id: c._id,
        })));
        setIconPreviews(section.cards.map(c => c.icon || null));
        setSideImagePreviews(section.cards.map(c => c.sideImage || null));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch data");
    }
  };

  const validateImageFile = (file, type) => {
    if (!file.type.match(/image\/(jpeg|png|svg)/)) {
      toast.error(`${type} must be JPEG, PNG or SVG`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${type} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const handleChange = (e, index, field) => {
    const { files, value } = e.target;
    const updatedCards = [...cards];
    const updatedIconPreviews = [...iconPreviews];
    const updatedSidePreviews = [...sideImagePreviews];

    if (files && files[0]) {
      const file = files[0];
      if (!validateImageFile(file, field === "icon" ? "Icon" : "Side Image")) return;

      updatedCards[index][field] = file;

      if (field === "icon") updatedIconPreviews[index] = URL.createObjectURL(file);
      else updatedSidePreviews[index] = URL.createObjectURL(file);
    } else {
      updatedCards[index][field] = value;
    }

    setCards(updatedCards);
    setIconPreviews(updatedIconPreviews);
    setSideImagePreviews(updatedSidePreviews);
  };

  const addCard = () => {
    setCards([...cards, { icon: null, heading: "", description: "", sideImage: null }]);
    setIconPreviews([...iconPreviews, null]);
    setSideImagePreviews([...sideImagePreviews, null]);
  };

  const removeCard = (idx) => {
    setCards(cards.filter((_, i) => i !== idx));
    setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
    setSideImagePreviews(sideImagePreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (!c.heading.trim() || !c.description.trim()) {
          toast.error(`Card ${i + 1} requires heading & description`);
          setLoading(false);
          return;
        }
        if (!c.icon || !c.sideImage) {
          toast.error(`Card ${i + 1} requires icon and side image`);
          setLoading(false);
          return;
        }
      }

      if (!aboutUsId) {
        toast.error("About Us page not ready yet. Please wait.");
        setLoading(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      cards.forEach((c, idx) => {
        submissionData.append(`cards[${idx}][heading]`, c.heading.trim());
        submissionData.append(`cards[${idx}][description]`, c.description.trim());
        if (c.icon instanceof File) submissionData.append(`cards[${idx}][icon]`, c.icon);
        if (c.sideImage instanceof File) submissionData.append(`cards[${idx}][sideImage]`, c.sideImage);
        if (c._id) submissionData.append(`cards[${idx}][_id]`, c._id); 
      });

      const effectiveSectionId = sectionId || 'current';
      let res;
      try {
        res = await axiosInstance.put(`/api/about-us-sections/mission-vision/update/${effectiveSectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } catch (putErr) {
        res = await axiosInstance.post(`/api/about-us-sections/mission-vision/update/${effectiveSectionId}`,
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (res.data.data) {
        toast.success(res.data.message || "Mission & Vision cards updated successfully!");
        navigate("/super-admin/about-us/edit", { state: { reload: true } });
      } else {
        toast.error(res.data.message || "Failed to update cards");
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
        <h2>Edit Mission & Vision Cards</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {cards.map((c, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Emoji/Icon *</label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "icon")} className="form-control" />
                      {iconPreviews[idx] && <img src={iconPreviews[idx]} alt="Icon Preview" style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }} />}
                    </div>

                    <div className="form-group">
                      <label>Heading *</label>
                      <input type="text" value={c.heading} onChange={(e) => handleChange(e, idx, "heading")} className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea value={c.description} onChange={(e) => handleChange(e, idx, "description")} className="form-control" rows={3} required />
                    </div>

                    <div className="form-group">
                      <label>Side Image *</label>
                      <input type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleChange(e, idx, "sideImage")} className="form-control" />
                      {sideImagePreviews[idx] && <img src={sideImagePreviews[idx]} alt="Side Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }} />}
                    </div>

                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
                  </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={addCard}>Add Card</button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Cards"}
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

export default MissionVisionEdit;
