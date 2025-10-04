import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../../ConfirmationDialog';


function ViewDetails() {
  const location = useLocation();
  const { blog } = location.state || {};
  const [blogs, setBlogs] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const navigate = useNavigate();


  const fetchBlog = async () => {
    try {
      const result = await getAPI(`/Blog-Post/getblogbyid/${blog._id}`, {}, true, false);
      if (result.data) {
        setBlogs([result.data.blog]);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);


  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBlogToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog._id !== id)
    );
    navigate('/super-admin/artist/blogrequest');
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (blog) => {
    setSelectedBlogToDelete(blog);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Blog</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item active"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
              <li className="breadcrumb-item active" >
                <Link to={`/super-admin/artist/blogrequest`}> Blog Request</Link></li>
              <li className="breadcrumb-item">View Blog</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-5 col-md-12 left-box">
          {blogs && Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((blog) => {
              return (
                <div key={blog._id} className="card single_post">
                  <div className="body">
                    <div className="img-post" >
                      <img
                        className="d-block object-fit-cover"
                        src={blog.blogImage ? `${BASE_URL}/${blog.blogImage.replace(/\\/g, "/")}` : "/placeholder.jpg"}
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
                        WebkitLineClamp: 2,
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
                          navigate(`/super-admin/artist/blogrequest/blog-details/${blog.slug}`, {
                            state: { blogData: blog }
                          })
                        }
                      >
                        Continue Reading
                      </button>
                      <button
                        className="btn btn-outline-dark"
                        onClick={() =>
                          navigate(`/super-admin/artist/blogrequest/update-blog`, {
                            state: { blogData: blog }
                          })
                        }

                      >
                        Update
                      </button>
                      <button
                        className="btn btn-outline-danger mx-2"
                        onClick={() => openDeleteDialog(blog)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType="blog"
          id={selectedBlogToDelete._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

    </div>
  );
}

export default ViewDetails;
