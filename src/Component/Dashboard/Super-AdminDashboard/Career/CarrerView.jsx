import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatableSelect from 'react-select/creatable';

function CareerEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const career = location.state?.career;

  const [formData, setFormData] = useState({
    jobTitle: career?.jobTitle || "",
    department: career?.department || "",
    category: career?.category || "",
    workMode: career?.workMode || "",
    location: career?.location || "",
    summary: career?.summary || "",
    experienceLevel: career?.experienceLevel || "",
    education: Array.isArray(career?.education) ? career.education : [],
    salaryRange: career?.salaryRange || "",
    deadline: career?.deadline ? new Date(career.deadline).toISOString().split('T')[0] : "",
    publishDate: career?.publishDate ? new Date(career.publishDate).toISOString().split('T')[0] : "",
    status: career?.status || "",
    requiredSkills: Array.isArray(career?.requiredSkills) ? career.requiredSkills : [],
    preferredSkills: Array.isArray(career?.preferredSkills) ? career.preferredSkills : [],
  });
  const [rolesResponsibilities, setRolesResponsibilities] = useState(career?.rolesResponsibilities || "");

  useEffect(() => {
    if (!career) {
      toast.error("No career data provided. Please select a career to view.");
      navigate("/careers");
      return;
    }
  }, [career, navigate]);

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
    { value: "5–10 years", label: "5-10 years" },
    { value: "10+ years", label: "10+ years" },
  ];
  const statuses = ["Open", "Closed", "Draft", "Paused"];

  const modules = {
    toolbar: false, // Disable toolbar for read-only
  };

  const editorStyle = {
    fontFamily: 'Nunito, Ubuntu, Raleway, IBM Plex Sans, sans-serif',
    fontSize: '12px',
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Job Post</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item"><Link to={`/super-admin/career`}>Career</Link></li>
              <li className="breadcrumb-item active">View Job Post</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      className="form-control"
                      placeholder="Enter Job Title"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="department">Department</label>
                    <CreatableSelect
                      id="department"
                      name="department"
                      options={departmentOptions}
                      value={departmentOptions.find(opt => opt.value === formData.department) || { value: formData.department, label: formData.department }}
                      placeholder="Select or type department"
                      isDisabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="category">Job Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      className="form-control show-tick"
                      disabled
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
                    <label htmlFor="workMode">Work Mode</label>
                    <select
                      id="workMode"
                      name="workMode"
                      value={formData.workMode}
                      className="form-control show-tick"
                      disabled
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
                    <label htmlFor="location">Job Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      className="form-control"
                      placeholder="Enter City, State, Country or Remote"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="experienceLevel">Experience Level</label>
                    <CreatableSelect
                      id="experienceLevel"
                      name="experienceLevel"
                      options={experienceOptions}
                      value={experienceOptions.find(opt => opt.value === formData.experienceLevel) || { value: formData.experienceLevel, label: formData.experienceLevel }}
                      placeholder="Select or type experience level"
                      isDisabled
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="summary">Job Summary</label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    className="form-control"
                    placeholder="Enter a short summary of the job"
                    rows="3"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rolesResponsibilities">Roles & Responsibilities</label>
                  <ReactQuill
                    value={rolesResponsibilities}
                    readOnly
                    theme="snow"
                    modules={modules}
                    style={editorStyle}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="requiredSkills">Required Skills & Tools</label>
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
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="preferredSkills">Preferred Skills</label>
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label htmlFor="education">Education Requirements</label>
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="salaryRange">Salary Range</label>
                    <input
                      type="text"
                      id="salaryRange"
                      name="salaryRange"
                      value={formData.salaryRange}
                      className="form-control"
                      placeholder="Enter salary range (e.g., ₹3–6 LPA or Negotiable)"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="deadline">Application Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="publishDate">Publish Date</label>
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
                    <label htmlFor="status">Job Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      className="form-control show-tick"
                      disabled
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerEdit;