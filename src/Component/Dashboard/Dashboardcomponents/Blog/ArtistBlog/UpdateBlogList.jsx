import React, { useState } from "react";

const UpdateModal = ({ showModal, setShowModal, selectedBlog, setBlogs }) => {
  const [formData, setFormData] = useState({
    blogName: selectedBlog?.blogName || "",
    blogDescription: selectedBlog?.blogDescription || "",
    blogAuthor: selectedBlog?.blogAuthor || "",
    category: selectedBlog?.category || "",
    blogImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, blogImage: e.target.files[0] });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("blogName", formData.blogName);
    form.append("blogDescription", formData.blogDescription);
    form.append("blogAuthor", formData.blogAuthor);
    form.append("category", formData.category);
    if (formData.blogImage) form.append("blogImage", formData.blogImage);

    fetch(`http://localhost:3001/Blog-Post/update/${selectedBlog._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: form,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update blog");
        return response.json();
      })
      .then((updatedBlog) => {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
        );
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating blog:", error);
      });
  };

  return (
    showModal && (
      <div className="modal" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Blog</h5>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="blogName" className="form-label">
                    Blog Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="blogName"
                    name="blogName"
                    value={formData.blogName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="authorName" className="form-label">
                    Author Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="authorName"
                    name="authorName"
                    value={formData.blogAuthor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="form-control show-tick"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="blogDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="blogDescription"
                    name="blogDescription"
                    rows="4"
                    value={formData.blogDescription}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="blogImage" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="blogImage"
                    name="blogImage"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateModal;
