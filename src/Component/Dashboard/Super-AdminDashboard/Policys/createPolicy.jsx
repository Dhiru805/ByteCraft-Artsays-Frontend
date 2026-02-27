
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

function CreatePolicy({ onPolicyCreated }) { 
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState("wysiwyg");
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: storedUserId,
      }));
    } else {
      toast.error("User ID not found. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleEditorMode = () => {
    const quill = quillRef.current?.getEditor();
    if (editorMode === "wysiwyg") {
      if (quill) {
        setFormData((prev) => ({ ...prev, description: quill.root.innerHTML }));
      }
    } else {
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(formData.description);
      }
    }
    setEditorMode(editorMode === "wysiwyg" ? "html" : "wysiwyg");
    setShowHtmlPreview(false);
  };

  const sanitizeHtml = (html) => {
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(html);
    }
    return html;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description) {
      toast.error("Title and Description are required");
      setLoading(false);
      return;
    }

    try {
      const submissionData = {
        userId: formData.userId,
        title: formData.title,
        description: sanitizeHtml(formData.description),
        // status: "draft",
        status: formData.status,
      };

      const response = await postAPI("/api/createPolicy", submissionData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.data) {
        console.log(response.data);
        toast.success("Policy created successfully!");
       
       if (onPolicyCreated) onPolicyCreated(response.data.data);
       console.log(response.data);
        navigate("/super-admin/policy"); 
      } else {
        toast.error("Failed to create policy");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <h2>Create Policy</h2>
          <div className="col-lg-12">
            <div className="card">
              <div className="body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
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
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="mb-0">Content *</label>
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm"
                        onClick={toggleEditorMode}
                      >
                        {editorMode === "wysiwyg"
                          ? "Switch to HTML Editor"
                          : "Switch to Text Editor"}
                      </button>
                    </div>

                    {editorMode === "wysiwyg" ? (
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.description}
                        onChange={(description, _, __, editor) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: editor.getHTML(),
                          }))
                        }
                        className="quill-editor-custom mt-2"
                      />
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary mb-2 mt-2"
                          onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                        >
                          {showHtmlPreview ? "Edit HTML" : "Preview Content"}
                        </button>
                        {showHtmlPreview ? (
                          <div
                            className="border p-3 bg-white"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(formData.description),
                            }}
                          />
                        ) : (
                          <textarea
                            className="form-control"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={10}
                          />
                        )}
                      </>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating Policy..." : "Create Policy"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePolicy;
