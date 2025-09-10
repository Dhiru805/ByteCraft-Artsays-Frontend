import React, { useEffect, useState } from 'react';
import getAPI from '../../../../../../api/getAPI';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../../../../StatusConfirm';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';
import ConfirmationDialog from '../../../../ConfirmationDialog';
import UpdateModal from '../../../Blog/ArtistBlog/UpdateBlogList';
import useUserType from '../../../../urlconfig';

const Billings = ({ userId, profileData, previewImage }) => {
  const userType = useUserType();
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState(null);
  const [hoveredBlogId, setHoveredBlogId] = useState(null); // State to track hovered blog
  const [loadingIds, setLoadingIds] = useState([]);

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

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;


  const updateBlogStatus = async (blogId, status) => {
    setLoadingIds(prev => [...prev, blogId]);
    try {
      await putAPI(
        `/Blog-Post/update-status/${blogId}`,
        { blogStatus: status },
        {},
        true
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, blogStatus: status } : blog
        )
      );

      if (status === 'Approved') {
        toast.success('Blog Request is Approved');
      } else if (status === 'Rejected') {
        toast.error('Blog Request is Rejected');
      }
    } catch (error) {
      console.error("Error updating blog status:", error);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== blogId));
    }
  };

  const handleReject = (blogId) => {
    confirm(() => updateBlogStatus(blogId, 'Rejected'), "Are you sure you want to reject this blog?");
  };

  const fetchBlog = async () => {
    try {
      const result = await getAPI(
        `/Blog-Post/blogs/user/${userId}`,
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

  const getOverallStatus = () => {
    if (blogs.some(blog => blog.blogStatus === 'Pending')) {
      return 'Pending';
    }
    if (blogs.some(blog => blog.blogStatus === 'Rejected')) {
      return 'Rejected';
    }
    return 'Approved';
  };

  // const overallStatus = getOverallStatus();

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
                              ? `${BASE_URL}/${blog.blogImage.replace(/\\/g, "/")}`
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
                            onClick={() => navigate(`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/blogrequestdetails/${blog._id}`, { state: { userId } })}
                          >
                            <i className="fa fa-eye"></i>
                          </button>

                          <button
                            // onClick={() => handleUpdateClick(blog)}
                            className="btn btn-outline-primary btn-sm mx-1"
                          onClick={() => navigate(`/super-admin/artist/management/artisteditreuqest/update-blog`, { state: { blogData: blog, userId } })}
                            >
                            <i className="fa fa-edit"></i>
                          </button>
                            {/* onClick={() => {
    navigate(`/super-admin/artist/blogrequest/update-blog`, {
      state: { blog, userId }
    });
  }} */}


                          <button
                            onClick={() => openDeleteDialog(blog)}
                            className="btn btn-outline-danger btn-sm mx-1"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                          <button
                            type="button"
                            className="btn bt n-sm btn-outline-success mx-1"
                            title="Approved"
                            onClick={() => updateBlogStatus(blog._id, 'Approved')}
                            disabled={loadingIds.includes(blog._id)}
                          >
                            {loadingIds.includes(blog._id) ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa fa-check"></i>
                            )}
                          </button>                            <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mx-1"
                            title="Declined"
                            onClick={() => handleReject(blog._id)}
                            disabled={loadingIds.includes(blog._id)}
                          >
                            {loadingIds.includes(blog._id) ? ( 
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa fa-ban"></i>
                            )}
                          </button>                        </li>
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

      {showModal && (
        <UpdateModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedBlog={selectedBlog}
          setBlogs={setBlogs}
          fetchBlog={fetchBlog}
        />
      )}
    </>
  );
};

export default Billings;