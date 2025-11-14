import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatableSelect from 'react-select/creatable';
import postAPI from "../../../../api/postAPI";


function CareerPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    category: "",
    workMode: "",
    location: "",
    summary: "",
    experienceLevel: "",
    education: [],
    salaryRange: "",
    deadline: "",
    publishDate: "",
    status: "",
    requiredSkills: [],
    preferredSkills: [],
  });
  const [rolesResponsibilities, setRolesResponsibilities] = useState("");
  const [requiredSkillInput, setRequiredSkillInput] = useState("");
  const [preferredSkillInput, setPreferredSkillInput] = useState("");
  const [educationInput, setEducationInput] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("careerPostDraft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.formData || draft.rolesResponsibilities) {
          const normalizedDate = new Date(draft.formData?.publishDate).toISOString().split("T")[0];
          setFormData(prev => ({
            ...prev,
            ...draft.formData,
            publishDate: normalizedDate,
            education: Array.isArray(draft.formData?.education) ? draft.formData.education : [],
            requiredSkills: Array.isArray(draft.formData?.requiredSkills) ? draft.formData.requiredSkills : [],
            preferredSkills: Array.isArray(draft.formData?.preferredSkills) ? draft.formData.preferredSkills : [],
          }));
          setRolesResponsibilities(draft.rolesResponsibilities || "");
          return;
        }
      } catch (err) {
        console.warn("Failed to parse draft:", err);
        toast.warn("Failed to load saved draft.");
      }
    }

    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      publishDate: today,
    }));
  }, []);


  useEffect(() => {
    const draft = {
      formData: { ...formData },
      rolesResponsibilities,
    };
    localStorage.setItem("careerPostDraft", JSON.stringify(draft));
  }, [formData, rolesResponsibilities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "jobTitle") {
      const capitalizedTitle = value.charAt(0).toUpperCase() + value.slice(1);
      setFormData({ ...formData, jobTitle: capitalizedTitle });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkillInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "required") {
      setRequiredSkillInput(value);
    } else if (type === "preferred") {
      setPreferredSkillInput(value);
    } else if (type === "education") {
      setEducationInput(value);
    }
  };

  const handleAddSkill = (e, type) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = type === "required" ? requiredSkillInput.trim() :
        type === "preferred" ? preferredSkillInput.trim() :
          educationInput.trim();
      const array = type === "required" ? formData.requiredSkills :
        type === "preferred" ? formData.preferredSkills :
          formData.education;
      if (input && !array.includes(input)) {
        setFormData({
          ...formData,
          [type === "required" ? "requiredSkills" :
            type === "preferred" ? "preferredSkills" : "education"]: [...array, input],
        });
        if (type === "required") setRequiredSkillInput("");
        else if (type === "preferred") setPreferredSkillInput("");
        else setEducationInput("");
      }
    }
  };

  const removeSkill = (index, type) => {
    const array = type === "required" ? formData.requiredSkills :
      type === "preferred" ? formData.preferredSkills :
        formData.education;
    setFormData({
      ...formData,
      [type === "required" ? "requiredSkills" :
        type === "preferred" ? "preferredSkills" : "education"]: array.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    const errors = [];
    if (!formData.jobTitle) errors.push("Job title is required.");
    if (!formData.department) errors.push("Department is required.");
    if (!formData.category) errors.push("Job category is required.");
    if (!formData.workMode) errors.push("Work mode is required.");
    if (formData.workMode !== "Remote" && !formData.location) errors.push("Location is required for non-remote jobs.");
    if (!formData.summary) errors.push("Job summary is required.");
    if (!rolesResponsibilities) errors.push("Roles and responsibilities are required.");
    if (!formData.requiredSkills.length) errors.push("At least one required skill is needed.");
    if (!formData.preferredSkills.length) errors.push("At least one preferred skill is needed.");
    if (!formData.education.length) errors.push("At least one education requirement is needed.");
    if (!formData.experienceLevel) errors.push("Experience level is required.");
    if (!formData.deadline) errors.push("Application deadline is required.");
    if (!formData.publishDate) errors.push("Publish date is required.");
    if (!formData.status) errors.push("Job status is required.");

    if (errors.length > 0) {
      toast.error(errors.join(" "));
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      rolesResponsibilities,
      location: formData.workMode === "Remote" && !formData.location ? "Remote" : formData.location,
    };

    try {
      await postAPI("/api/create-career", payload);
      toast.success('Job post created successfully!');
      localStorage.removeItem("careerPostDraft");
      setFormData({
        jobTitle: "",
        department: "",
        category: "",
        workMode: "",
        location: "",
        summary: "",
        experienceLevel: "",
        education: [],
        salaryRange: "",
        deadline: "",
        publishDate: "",
        status: "",
        requiredSkills: [],
        preferredSkills: [],
      });
      setRolesResponsibilities("");
      setRequiredSkillInput("");
      setPreferredSkillInput("");
      setEducationInput("");
      navigate(`/super-admin/career`);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': ['sans-serif', 'serif', 'monospace'] }, { 'size': ['small', 'large', 'huge'] }],
      [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote'],
    ],
  };

  const editorStyle = {
    fontFamily: 'Nunito, Ubuntu, Raleway, IBM Plex Sans, sans-serif',
    fontSize: '12px',
  };

  const departmentOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
  ];
  const categories = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];
  const workModes = ["On-site", "Remote", "Hybrid"];
  const experienceOptions = [
    { value: "0–2 years", label: "0–2 years" },
    { value: "3–5 years", label: "3–5 years" },
    { value: "5–10 years", label: "5–10 years" },
    { value: "10+ years", label: "10+ years" },
  ];
  const statuses = ["Open", "Closed", "Draft", "Paused"];

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Job Post</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active"><Link to={`/super-admin/career`}>Career</Link></li>
              <li className="breadcrumb-item">Create Job Post</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="jobTitle">
                      Job Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Job Title"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="department">
                      Department <span className="text-danger">*</span>
                    </label>
                    <CreatableSelect
                      id="department"
                      name="department"
                      options={departmentOptions}
                      value={departmentOptions.find(opt => opt.value === formData.department) || { value: formData.department, label: formData.department }}
                      onChange={(option) => setFormData({ ...formData, department: option ? option.value : "" })}
                      placeholder="Select or type department"
                      isClearable
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="category">
                      Job Category <span className="text-danger">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="workMode">
                      Work Mode <span className="text-danger">*</span>
                    </label>
                    <select
                      id="workMode"
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Work Mode</option>
                      {workModes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="location">
                      Job Location {formData.workMode !== "Remote" && <span className="text-danger">*</span>}
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter City, State, Country or Remote"
                      required={formData.workMode !== "Remote"}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="experienceLevel">
                      Experience Level <span className="text-danger">*</span>
                    </label>
                    <CreatableSelect
                      id="experienceLevel"
                      name="experienceLevel"
                      options={experienceOptions}
                      value={experienceOptions.find(opt => opt.value === formData.experienceLevel) || { value: formData.experienceLevel, label: formData.experienceLevel }}
                      onChange={(option) => setFormData({ ...formData, experienceLevel: option ? option.value : "" })}
                      placeholder="Select or type experience level"
                      isClearable
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="summary">
                    Job Summary <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter a short summary of the job"
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rolesResponsibilities">
                    Roles & Responsibilities <span className="text-danger">*</span>
                  </label>
                  <ReactQuill
                    value={rolesResponsibilities}
                    onChange={(newContent) => setRolesResponsibilities(newContent)}
                    placeholder="Enter roles and responsibilities"
                    modules={modules}
                    theme="snow"
                    style={editorStyle}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="requiredSkills">
                      Required Skills & Tools <span className="text-danger">*</span>
                    </label>
                    <div
                      className="d-flex flex-wrap align-items-center form-control p-2"
                      style={{ minHeight: '44px' }}
                    >
                      {formData.requiredSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                        >
                          <span className="mr-1">{skill}</span>
                          <span
                            className="ml-1 text-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeSkill(index, "required")}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                      <input
                        type="text"
                        id="requiredSkills"
                        value={requiredSkillInput}
                        onChange={(e) => handleSkillInputChange(e, "required")}
                        onKeyDown={(e) => handleAddSkill(e, "required")}
                        className="border-0 flex-grow-1 px-2"
                        style={{ outline: 'none', minWidth: '100px' }}
                        placeholder="Type skills and press enter or comma"
                      />
                    </div>
                    <small className="form-text text-muted">
                      Add required skills or tools (e.g., JavaScript, Python)
                    </small>
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="preferredSkills">
                      Preferred Skills <span className="text-danger">*</span>
                    </label>
                    <div
                      className="d-flex flex-wrap align-items-center form-control p-2"
                      style={{ minHeight: '44px' }}
                    >
                      {formData.preferredSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                        >
                          <span className="mr-1">{skill}</span>
                          <span
                            className="ml-1 text-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeSkill(index, "preferred")}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                      <input
                        type="text"
                        id="preferredSkills"
                        value={preferredSkillInput}
                        onChange={(e) => handleSkillInputChange(e, "preferred")}
                        onKeyDown={(e) => handleAddSkill(e, "preferred")}
                        className="border-0 flex-grow-1 px-2"
                        style={{ outline: 'none', minWidth: '100px' }}
                        placeholder="Type preferred skills and press enter or comma"
                      />
                    </div>
                    <small className="form-text text-muted">
                      Add preferred skills (e.g., AWS, React)
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label htmlFor="education">
                      Education Requirements <span className="text-danger">*</span>
                    </label>
                    <div
                      className="d-flex flex-wrap align-items-center form-control p-2"
                      style={{ minHeight: '44px' }}
                    >
                      {formData.education.map((edu, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                        >
                          <span className="mr-1">{edu}</span>
                          <span
                            className="ml-1 text-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeSkill(index, "education")}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                      <input
                        type="text"
                        id="education"
                        value={educationInput}
                        onChange={(e) => handleSkillInputChange(e, "education")}
                        onKeyDown={(e) => handleAddSkill(e, "education")}
                        className="border-0 flex-grow-1 px-2"
                        style={{ outline: 'none', minWidth: '100px' }}
                        placeholder="Type education requirements and press enter or comma"
                      />
                    </div>
                    <small className="form-text text-muted">
                      Add education requirements (e.g., Bachelor's in CS, Master's in IT)
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="salaryRange">Salary Range (Optional)</label>
                    <input
                      type="text"
                      id="salaryRange"
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter salary range (e.g., ₹3–6 LPA or Negotiable)"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="deadline">
                      Application Deadline <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="publishDate">
                      Publish Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="publishDate"
                      name="publishDate"
                      value={formData.publishDate}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">
                      Job Status <span className="text-danger">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-primary mt-3"
                  disabled={loading}
                >
                  {loading ? "Creating Job Post..." : "Create Job Post"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerPost;