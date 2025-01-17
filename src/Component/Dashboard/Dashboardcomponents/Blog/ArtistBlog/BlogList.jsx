import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UpdateModal from "./UpdateBlogList";
import getAPI from "../../../../../api/getAPI";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await getAPI("http://localhost:3001/Blog-Post/user-blogs", {}, true, false);
        if (result.data) {
          setBlogs(result.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [showModal]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/Blog-Post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete blog");

      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleUpdateClick = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  return (
    <>
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Blog List</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item">App</li>
              <li className="breadcrumb-item active">Blog List</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/Dashboard/Blogpost")}
                >
                  <i className="fa fa-plus"></i> Add Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        {blogs.map((blog) => {
          const isExpanded = blog._id === selectedBlog?._id;

          return (
            <div key={blog._id} className="col-md-4 col-sm-12 mb-4">

              <div className="card single_post">
                <div className="body">
                  <div className="img-post overflow-hidden" style={{ height: "200px" }}>
                    <img
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: "cover" }}
                      src={
                        blog.blogImage
                          ? `http://localhost:3001/${blog.blogImage.replace(/\\/g, "/")}`
                          : "/placeholder.jpg"
                      }
                      alt={blog.blogName}
                    />
                  </div>

                  <h3>{blog.blogName}</h3>
                  <p
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: isExpanded ? "unset" : 2,
                      maxHeight: isExpanded ? "none" : "3em",
                    }}
                  >
                    {blog.blogDescription.replace(/<\/?[^>]+(>|$)/g, "")}
                  </p>
                </div>
                <div className="footer">
                  <div className="actions">
                    <button
                      className="btn btn-outline-secondary mx-2"
                      onClick={() => setSelectedBlog(isExpanded ? null : blog)}
                    >
                      {isExpanded ? "Show Less" : "Continue Reading"}
                    </button>
                    <button
                      className="btn btn-outline-danger mx-2"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => handleUpdateClick(blog)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <UpdateModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedBlog={selectedBlog}
          setBlogs={setBlogs}
        />
      )}
      </>

  );
}

export default BlogList;
