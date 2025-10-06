import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import useUserType from "../../../urlconfig";
import ConfirmationDialog from "../../../ConfirmationDialog";


const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(10);
  const navigate = useNavigate();
  const userType = useUserType();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await getAPI("/Blog-Post/statusapproved-blogs", {}, true, false);
        if (result.data) {
          setBlogs(result.data.blogs);
          console.log(result.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlog();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.blogName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleBlogsPerPageChange = (e) => {
    setBlogsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
            <h2>Blogs</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Blogs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={blogsPerPage}
                  onChange={handleBlogsPerPageChange}
                  style={{ minWidth: "70px" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "150px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i
                    className="fa fa-search"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover table-custom m-b-0">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>View</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedBlogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      displayedBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>{(currentPage - 1) * blogsPerPage + index + 1}</td>
                          <td>{blog.blogName}</td>
                          <td>{blog.uploadedBy?.name || "Unknown"}</td>
                          <td>{new Date(blog.createdAt).toLocaleDateString("en-IN")}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() =>
                                navigate(`/super-admin/artist/blogs/blog-details/${blog.slug}`, {
                                  state: { blogData: blog }
                                })
                              }
                            >
                              View
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger mr-2"
                              onClick={() => openDeleteDialog(blog)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate(`/super-admin/artist/blogs/blog-update/${blog.slug}`, {
                                  state: { blogData: blog }
                                })
                              }
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="d-none d-sm-inline-block">
                  Showing {(currentPage - 1) * blogsPerPage + 1} to{" "}
                  {Math.min(currentPage * blogsPerPage, filteredBlogs.length)} of{" "}
                  {filteredBlogs.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  <li className={`paginate_button page-item active`}>
                    <button className="page-link">{currentPage}</button>
                  </li>
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                    onClick={handleNext}
                  >
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDeleteDialogOpen && selectedBlogToDelete && (
        <ConfirmationDialog
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedBlogToDelete(null);
          }}
          deleteType="blog"
          id={selectedBlogToDelete._id}
          onDeleted={(id) => {
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
            setIsDeleteDialogOpen(false);
            setSelectedBlogToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default BlogList;
