import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import getAPI from '../../../../../api/getAPI';
// import UpdateModal from "./../ArtistBlog/UpdateBlogList";
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../ConfirmationDialog';
import useUserType from '../../urlconfig';

function BlogDetails() {
  const { blogId } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const navigate = useNavigate();  
  const userType = useUserType(); 

  const fetchBlog = async () => {
    try {
      const result = await getAPI(`http://localhost:3001/Blog-Post/getblogbyid/${blogId}`, {}, true, false);
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
    navigate('/Dashboard/artistblogrequest');
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
            <h2>View Artist Blog</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item active"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
              <li className="breadcrumb-item active" >
                <Link to={`/${userType}/Dashboard/artistblogrequest`}>Artist Blog Request</Link></li>
              <li className="breadcrumb-item">View Artist Blog</li>
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
                        src={blog.blogImage ? `http://localhost:3001/${blog.blogImage.replace(/\\/g, "/")}` : "/placeholder.jpg"}
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
                        onClick={() => navigate(`/${userType}/Dashboard/artistblogrequest/viewblog/blogdetails/${blog._id}`)}
                      >
                        Continue Reading
                      </button>
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => handleUpdateClick(blog)}
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
      
      {/* {showModal && (
        <UpdateModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedBlog={selectedBlog}
          setBlogs={setBlogs}
          fetchBlog={fetchBlog}
        />
      )} */}
    </div>
  );
}

export default BlogDetails;
