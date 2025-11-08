import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import UpdateModal from "./UpdateBlogList";
import getAPI from "../../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import useUserType from '../../urlconfig';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const navigate = useNavigate();
  const userType = useUserType(); 

  const fetchBlog = async () => {
    try {
      const result = await getAPI(`${process.env.REACT_APP_API_URL}/Blog-Post/user-blogs`, {}, true, false);
      if (result.data) {
        setBlogs(result.data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  useEffect(() => {
    fetchBlog();
  }, [showModal]);


  const handleUpdateClick = (blog) => {
    setSelectedBlog(blog);
    fetchBlog();
    setShowModal(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBlogToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog._id !== id)
    );
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (blog) => {
    setSelectedBlogToDelete(blog);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Blogs</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              {/* <li className="breadcrumb-item">App</li> */}
              <li className="breadcrumb-item ">Blogs</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate(`/${userType}/Dashboard/bloglist/create-blog`)}
                >
                  <i className="fa fa-plus"></i> Add Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        {blogs && Array.isArray(blogs) && blogs.length > 0 ? (
          blogs.map((blog) => {
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
                            ? `${process.env.REACT_APP_API_URL}/${blog.blogImage.replace(/\\/g, "/")}`
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
                        WebkitLineClamp: 1,
                        maxHeight: "3em",
                      }}
                    >
                      {blog.blogDescription.replace(/<\/?[^>]+(>|$)/g, "")}
                    </p>
                  </div>
                  <div className="footer">
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn-outline-secondary mx-2"
                        onClick={() =>
                          navigate(`/${userType}/Dashboard/bloglist/blogDetails/${blog.slug}`, {
                            state: { id: blog._id }, 
                          })
                        }
                      >
                        Continue Reading
                      </button>
                      <button
                        className="btn btn-outline-danger mx-2"
                        onClick={() => openDeleteDialog(blog)}
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
          })
        ) : null}
      </div>

      {showModal && (
        <UpdateModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedBlog={selectedBlog}
          setBlogs={setBlogs}
          fetchBlog={fetchBlog}
        />
      )}
        {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="blog"
          id={selectedBlogToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </>

  );
}

export default BlogList;
