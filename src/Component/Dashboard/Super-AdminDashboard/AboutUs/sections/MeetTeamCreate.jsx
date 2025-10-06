import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const MeetTeamCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    //status: "draft",
    teamMembers: [
      { name: "", role: "", description: "", image: null }
    ],
  });

  const [imagePreviews, setImagePreviews] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [aboutUsId, setAboutUsId] = useState(null);

  useEffect(() => {
    const ensureAboutUsPage = async () => {
      try {
        const res = await getAPI("/api/about-us");
        let page = res.data.data?.[0];
        if (!page) {
          const createRes = await postAPI("/api/about-us/create", { title: "About Us" });
          page = createRes.data.data;
        }
        setAboutUsId(page._id);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load About Us page");
      }
    };
    ensureAboutUsPage();
  }, []);

  const validateImageFile = (file) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error("Image must be JPEG or PNG");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (index !== null && field !== null) {
      const updatedMembers = [...formData.teamMembers];
      const previews = [...imagePreviews];

      if (files && files[0]) {
        const file = files[0];
        if (!validateImageFile(file)) return;

        updatedMembers[index][field] = file;
        previews[index] = URL.createObjectURL(file);
        setImagePreviews(previews);
      } else {
        updatedMembers[index][field] = value;
      }

      setFormData({ ...formData, teamMembers: updatedMembers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", role: "", description: "", image: null }],
    });
    setImagePreviews([...imagePreviews, null]);
  };

  const removeMember = (idx) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== idx),
    });
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
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
        toast.error("Main heading and description are required");
        setLoading(false);
        return;
      }

      for (let i = 0; i < formData.teamMembers.length; i++) {
        const member = formData.teamMembers[i];
        if (!member.name.trim() || !member.role.trim() || !member.description.trim() || !member.image) {
          toast.error(`Team member ${i + 1} requires all fields and an image`);
          setLoading(false);
          return;
        }
      }

      const submissionData = new FormData();
      submissionData.append("aboutUsId", aboutUsId);
      submissionData.append("mainHeading", formData.mainHeading.trim());
      submissionData.append("mainDescription", formData.mainDescription.trim());
      //submissionData.append("status", formData.status);

      formData.teamMembers.forEach((m, idx) => {
        submissionData.append(`teamMembers[${idx}][name]`, m.name.trim());
        submissionData.append(`teamMembers[${idx}][role]`, m.role.trim());
        submissionData.append(`teamMembers[${idx}][description]`, m.description.trim());
        submissionData.append(`teamMembers[${idx}][image]`, m.image);
      });

      const res = await postAPI("/api/about-us-sections/meet-team/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.data) {
        toast.success(res.data.message || "Meet the Team page created successfully!");
        navigate("/super-admin/about-us/create", { state: { reload: true } });
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
        <h2>Create Meet the Team Page</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                {formData.teamMembers.map((member, idx) => (
                  <div key={idx} className="border mb-3 p-3 rounded shadow">
                    <div className="form-group">
                      <label>Team Member Image *</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleChange(e, idx, "image")}
                        className="form-control"
                        required
                      />
                      {imagePreviews[idx] && (
                        <img
                          src={imagePreviews[idx]}
                          alt="Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }}
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleChange(e, idx, "name")}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Role *</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleChange(e, idx, "role")}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={member.description}
                        onChange={(e) => handleChange(e, idx, "description")}
                        className="form-control"
                        rows={3}
                        required
                      />
                      <small className="text-muted">
                        Supports multiple lines.
                      </small>
                    </div>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => removeMember(idx)}
                    >
                      Remove Member
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addMember}
                >
                  Add Team Member
                </button>

                <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Meet the Team Page"}
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

export default MeetTeamCreate;
