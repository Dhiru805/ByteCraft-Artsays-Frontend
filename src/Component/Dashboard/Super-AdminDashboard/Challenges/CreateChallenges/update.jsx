import { useNavigate, Link, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import putAPI from "../../../../../api/putAPI";
import getAPI from "../../../../../api/getAPI";
import { Helmet } from 'react-helmet';

function UpdateChallenges() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const location = useLocation();
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const challengeId = location.state?.id;

  const handleImageClick = (imageUrl) => {
    const images = [imageUrl];
    setCurrentImages(images);
    setCurrentImageIndex(0);
    setShowPopup(true);
  };

  useEffect(() => {
    if (!challengeId) {
      toast.error("No challenge ID provided.");
      navigate("/super-admin/challenges");
      return;
    }

    const fetchChallenge = async () => {
      try {
        const res = await getAPI(`/api/getchallengebyid/${challengeId}`);
        const { challenge } = res.data;

        setFormValues({
          title: challenge.title || '',
          type: challenge.type || '',
          summary: challenge.description || '',
          startDate: challenge.startDate || '',
          endDate: challenge.endDate || '',
          submissionDeadline: challenge.submissionDeadline || '',
          entryFee: challenge.entryFee || '',
          prizeDetails: challenge.prizeDetails || '',
          judgingCriteria: challenge.judgingCriteria || '',
          maxParticipants: challenge.maxParticipants || '',
          status: challenge.status || '',
          tagsInput: '',
        });

        setTags(challenge.tags || []);

        // Handle image preview URL here
        if (challenge.bannerImage) {
          setImagePreview(challenge.bannerImage);  // Make sure to use the full URL returned from the server
        }
      } catch (error) {
        toast.error("Failed to fetch challenge data.");
        navigate("/super-admin/challenges");
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setBannerFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      tagsInput: value,
    }));
  };

  const handleTagKeyDown = (e) => {
    const inputTag = formValues.tagsInput;
    if ((e.key === "Enter" || e.key === ",") && inputTag.trim()) {
      const newTags = [...tags, inputTag.trim()];
      setTags(newTags);
      setFormValues((prev) => ({
        ...prev,
        tagsInput: "",
      }));
      e.preventDefault();
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleSubmit = async (e, actionType = "live") => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    let requiredFieldsFilled = true;

    // Validation for Live and Closed challenges: All fields are required.
    if (actionType !== "draft") {
      requiredFieldsFilled =
        formValues.title &&
        formValues.type &&
        formValues.summary &&
        formValues.startDate &&
        formValues.endDate &&
        formValues.submissionDeadline &&
        formValues.entryFee &&
        formValues.prizeDetails &&
        formValues.judgingCriteria &&
        formValues.maxParticipants &&
        formValues.status &&
        tags.length > 0 &&
        bannerFile;
    } else {
      // For Draft, only the essential fields and status should be validated.
      requiredFieldsFilled =
        formValues.title && formValues.type && formValues.status;
    }

    if (!requiredFieldsFilled) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("title", formValues.title || "");
    formData.append("type", formValues.type || "");
    formData.append("description", formValues.summary || "");
    formData.append("startDate", formValues.startDate || "");
    formData.append("endDate", formValues.endDate || "");
    formData.append("submissionDeadline", formValues.submissionDeadline || "");
    formData.append("entryFee", formValues.entryFee || "");
    formData.append("prizeDetails", formValues.prizeDetails || "");
    formData.append("judgingCriteria", formValues.judgingCriteria || "");
    formData.append("maxParticipants", formValues.maxParticipants || "");
    formData.append("tags", tags.join(", "));

    if (actionType === "draft") {
      formData.append("status", "draft");
    } else if (actionType === "closed") {
      formData.append("status", "closed");
    } else {
      formData.append("status", formValues.status || "live");
    }

    if (bannerFile) {
      formData.append("bannerImage", bannerFile);
    }

    console.log("Submitting Challenge Payload:", Object.fromEntries(formData.entries()));
    setLoading(true);

    try {
      const res = await putAPI(`/api/update/${challengeId}`, formData);

      toast.success(
        actionType === "draft"
          ? "Challenge saved as draft!"
          : actionType === "closed"
            ? "Challenge closed successfully!"
            : "Challenge updated successfully!"
      );
      navigate("/super-admin/challenges");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{formValues.title ? `${formValues.title} | Update Challenge` : 'Update Challenge | Admin Panel'}</title>
        <meta
          name="description"
          content={
            formValues.summary
              ? formValues.summary
              : "Update an existing challenge with title, theme, rules, entry fee, prizes, and more."
          }
        />
        <meta name="keywords" content={tags.length ? tags.join(', ') : "challenge, update, competition, admin"} />
        <meta name="author" content="Admin" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={formValues.title || "Update Challenge"} />
        <meta property="og:description" content={formValues.summary || "Update an existing challenge for users to participate in."} />
        <meta property="og:url" content={window.location.href} />
        {imagePreview && <meta property="og:image" content={imagePreview} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={formValues.title || "Update Challenge"} />
        <meta name="twitter:description" content={formValues.summary || "Update a challenge now!"} />
        {imagePreview && <meta name="twitter:image" content={imagePreview} />}
      </Helmet>

      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Update Challenge</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="fa fa-dashboard"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active">
                  <Link to="/super-admin/challenges">Challenges</Link>
                </li>
                <li className="breadcrumb-item">Update Challenge</li>
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
                      <label htmlFor="title">
                        Challenge Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        placeholder="Enter Exhibition Title"
                        value={formValues.title || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="type">
                        Theme Type <span className="text-danger">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        className="form-control show-tick"
                        value={formValues.type || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        <option value="Art">Art</option>
                        <option value="Photography">Photography</option>
                        <option value="Design">Design</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="summary">
                      Challenge Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="summary"
                      name="summary"
                      className="form-control"
                      placeholder="Enter challenge description"
                      rows="3"
                      value={formValues.summary || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 form-group">
                      <label htmlFor="startDate">
                        Start Date & Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="form-control"
                        value={formValues.startDate || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4 form-group">
                      <label htmlFor="endDate">
                        End Date & Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="form-control"
                        value={formValues.endDate || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4 form-group">
                      <label htmlFor="submissionDeadline">
                        Submission Deadline <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="submissionDeadline"
                        name="submissionDeadline"
                        className="form-control"
                        value={formValues.submissionDeadline || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="entryFee">
                        Entry Fee <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="entryFee"
                        name="entryFee"
                        className="form-control"
                        value={formValues.entryFee || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="prizeDetails">
                        Prize Details<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="prizeDetails"
                        name="prizeDetails"
                        className="form-control"
                        value={formValues.prizeDetails || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="judgingCriteria">
                        Judging Criteria <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="judgingCriteria"
                        name="judgingCriteria"
                        className="form-control"
                        value={formValues.judgingCriteria || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="maxParticipants">
                        Max Participants
                      </label>
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        className="form-control"
                        value={formValues.maxParticipants || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label htmlFor="tags">
                        Tags / Keywords <span className="text-danger">*</span>
                      </label>
                      <div
                        className="d-flex flex-wrap align-items-center form-control p-2"
                        style={{ minHeight: "44px" }}
                      >
                        {tags.map((tag, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                          >
                            <span className="mr-1">#{tag}</span>
                            <span
                              className="ml-1 text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => removeTag(index)}
                            >
                              &times;
                            </span>
                          </div>
                        ))}
                        <input
                          type="text"
                          id="tagsInput"
                          className="border-0 flex-grow-1 px-2"
                          style={{ outline: "none", minWidth: "100px" }}
                          placeholder="Type tags and press enter or comma"
                          value={formValues.tagsInput || ""}
                          onChange={handleTagInputChange}
                          onKeyDown={handleTagKeyDown}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="bannerImage">
                        Banner/Cover Image <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        id="bannerImage"
                        name="bannerImage"
                        className="form-control"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          {showPopup && (
                            <div
                              onClick={() => setShowPopup(false)}
                              style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                              }}
                            >
                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: 'relative',
                                  height: '50%',
                                  backgroundColor: '#111',
                                  borderRadius: '12px',
                                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  overflow: 'hidden',
                                }}
                              >
                                <img
                                  src={currentImages[currentImageIndex]?.replace(/\\/g, '/')}
                                  alt="Popup"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid"
                            style={{ maxWidth: "100%", height: "auto", cursor: "pointer" }}
                            onClick={() => handleImageClick(imagePreview)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 form-group">
                      <label htmlFor="status">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="form-control show-tick"
                        value={formValues.status || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="live">Live</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-between mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={(e) => handleSubmit(e, "draft")}
                      disabled={loading}
                      style={{ width: "48%" }}
                    >
                      {loading ? "Saving as Draft..." : "Save as Draft"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => handleSubmit(e, "live")}
                      disabled={loading}
                      style={{ width: "48%" }}
                    >
                      {loading ? "Updating Challenge..." : "Update Challenge"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateChallenges;