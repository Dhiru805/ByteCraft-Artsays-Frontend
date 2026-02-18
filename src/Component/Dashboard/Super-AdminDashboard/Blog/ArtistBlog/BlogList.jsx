import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import getAPI from "../../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import useUserType from '../../urlconfig';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const [blogsPerPage, setBlogsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
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
  }, []);



  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBlogToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (blog) => {
    setSelectedBlogToDelete(blog);
    setIsDeleteDialogOpen(true);
  };

  const handleProductsPerPageChange = (e) => {
    setBlogsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  
  // const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const displayedBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  return (
    <div className="container-fluid">
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
              <li className="breadcrumb-item">Blogs</li>
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
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={blogsPerPage}
                  onChange={handleProductsPerPageChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark text-nowrap">
                    <tr>
                      <th>#</th>
                      <th>Blog Image</th>
                      <th>Blog Name</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedBlogs.map((blog, index) => (
                      <tr key={blog._id}>
                        <td>{(currentPage - 1) * blogsPerPage + index + 1}</td>
                        <td>
                          <img
                            src={
                              blog.blogImage
                                ? `${process.env.REACT_APP_API_URL}/${blog.blogImage.replace(/\\/g, "/")}`
                                : "/placeholder.jpg"
                            }
                            className="rounded-circle"
                            alt={blog.blogName}
                            style={{
                              width: '30px',
                              height: '30px',
                              objectFit: 'cover',
                              marginRight: '10px'
                            }}
                          />
                        </td>
                        <td>{blog.blogName}</td>
                        <td>{blog.category}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info mr-2"
                            onClick={() =>
                              navigate(`/${userType}/Dashboard/bloglist/blogDetails/${blog.slug}`, {
                                state: { id: blog._id },
                              })
                            }
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger mr-2"
                            onClick={() => openDeleteDialog(blog)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => 
                              navigate(`/${userType}/Dashboard/bloglist/update-blog/${blog._id}`, {
                                state: { blogData: blog }
                              })
                            }
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

export default BlogList;