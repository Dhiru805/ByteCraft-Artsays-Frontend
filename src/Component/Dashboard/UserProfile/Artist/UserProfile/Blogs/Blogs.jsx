import React, { useEffect, useState } from 'react';
import getAPI from '../../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../../../ConfirmationDialog';
import useUserType from '../../../urlconfig';

const Billings = ({ userId, profileData, previewImage }) => {
  const userType = useUserType(); 
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const [hoveredBlogId, setHoveredBlogId] = useState(null); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const getOrdinalSuffix = (day) => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const value = day % 100;
      return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    };

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const ordinalDay = `${day}${getOrdinalSuffix(day)}`;

    return `${month} ${ordinalDay}, ${year}`;
  };





  const fetchBlog = async () => {
    try {
      const result = await getAPI(
        `${process.env.REACT_APP_API_URL}/Blog-Post/blogs/user/${userId}`,
        {},
        true,
        false
      );
      if (result.data) {
        setBlogs(result.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (blog) => {
    setSelectedBlogToDelete(blog);
    setIsDeleteDialogOpen(true);
  };


  return (
    <>
      <div className="row clearfix">
        {/* Blog Section */}
        <div className="col-lg-9 col-md-12">
          <div className="tab-content padding-0">
            <div className="tab-pane active" id="Overview">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="card single_post mx-auto mb-4"
                    onMouseEnter={() => setHoveredBlogId(blog._id)}
                    onMouseLeave={() => setHoveredBlogId(null)}
                  >
                    <div
                      className={`status-dot ${blog.blogStatus === 'Pending' ? 'bg-warning' : blog.blogStatus === 'Approved' ? 'bg-success' : 'bg-danger'}`}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        left: '98%',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        zIndex: 1
                      }}
                    ></div>
                    <div className="body p-4">
                      <div className="img-post" style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover'
                      }}>
                        <img
                          className="d-block img-fluid rounded"
                          src={
                            blog.blogImage
                              ? `${process.env.REACT_APP_API_URL}/${blog.blogImage.replace(/\\/g, "/")}`
                              : "/placeholder.jpg"
                          }
                          alt={blog.blogName}
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <h3>
                        <a href="#">{blog.blogName}</a>
                      </h3>
                      <p style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        maxHeight: "3em",
                      }}>{blog.blogDescription.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                    </div>
                    <div className="footer p-1">
                      <ul className="stats list-inline ">
                        <li className="list-inline-item  mb-3" 
                        style={{ display: hoveredBlogId === blog._id ? 'block' : 'none' }}>
                            <button
                              className="btn btn-outline-secondary btn-sm mx-1"
                              // onClick={() =>
                              //   navigate(`/Dashboard/BlogRequest/view-blog/BlogDetails/${blog._id}`)
                              // }
                              onClick={() => navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/blogrequestdetails/${blog._id}`, { state: {userId } })}
                            >
                              <i className="fa fa-eye"></i>
                            </button>

                            <button
                              // onClick={() => handleUpdateClick(blog)}
                              onClick={() => navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/blogrequestdetails/editblog/${blog._id}`, { state: { blog,userId } })}
                              className="btn btn-outline-primary btn-sm mx-1"
                            >
                              <i className="fa fa-edit"></i>
                            </button>

                            <button
                              onClick={() => openDeleteDialog(blog)}
                              className="btn btn-outline-danger btn-sm mx-1"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p>No blogs available.</p>
              )}
            </div>
          </div>
        </div>
        {/* Profile Section */}
        <div className="col-lg-3 col-md-12">
          <div className="card profile-header mb-4">
            <div className="body">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  className="profile-image mb-3"
                  style={{ width: '140px', height: '140px', overflow: 'hidden' }}
                >
                  <img
                    src={previewImage}
                    className="rounded-circle"
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div>
                <h4 className="mb-0">
                  <strong>{profileData.name}</strong> {profileData.lastName}
                </h4>
                <span>{profileData.userType}</span>
              </div>
            </div>
          </div>
          <div className="card mb-4">
            <div className="header">
              <h2>Info</h2>
            </div>
            <div className="body">
              <small className="text-muted">Address: </small>
              <p>
                {[profileData.address?.line1, profileData.address?.line2, profileData.address?.city, profileData.address?.state, profileData.address?.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>

              <hr />
              <small className="text-muted">Email address: </small>
              <p>{profileData.email}</p>
              <hr />
              <small className="text-muted">Mobile: </small>
              <p>{profileData.phone}</p>
              <hr />
              <small className="text-muted">Birth Date: </small>
              <p className="mb-0">{formatDate(profileData.birthdate)}</p>
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
    </>
  );
};

export default Billings;