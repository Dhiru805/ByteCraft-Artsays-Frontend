import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import { Helmet } from 'react-helmet';

function ArtistBlogDetails() {
  const location = useLocation();
  const [blogData] = useState(location.state?.blogData || null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();


  const fetchBlog = async () => {
    try {
      const result = await getAPI(`/Blog-Post/getblogbyid/${blogData._id}`, {}, true, false);
      if (result.data) {
        setBlogs([result.data.blog]);
        console.log([result.data.blog]);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogData._id]);



  return (
    <div className="container-fluid">
      {blogs.length > 0 && (
        <Helmet>
          <title>{`${blogs[0].blogName} | My Blog`}</title>
          <meta name="description" content={blogs[0].summary} />
          <meta name="keywords" content={blogs[0].tags.join(', ')} />
          <meta name="author" content={blogs[0].author || 'Admin'} />


          <meta property="og:type" content="article" />
          <meta property="og:title" content={blogs[0].blogName} />
          <meta property="og:description" content={blogs[0].summary} />
          <meta property="og:url" content={window.location.href} />
          {blogs[0].blogImage && (
            <meta
              property="og:image"
              content={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${blogs[0].blogImage.replace(/\\/g, "/")}`}
            />
          )}

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blogs[0].blogName} />
          <meta name="twitter:description" content={blogs[0].summary} />
          {blogs[0].blogImage && (
            <meta
              name="twitter:image"
              content={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${blogs[0].blogImage.replace(/\\/g, "/")}`}
            />
          )}
        </Helmet>
      )}


      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Blog Details</h2>
            <ul className="breadcrumb">
              <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                <i className="fa fa-dashboard"></i>
              </span>
              <li className="breadcrumb-item">
              <span onClick={() => navigate('/super-admin/blog')} style={{ cursor: 'pointer' }}>
                 &nbsp; / Blogs
              </span>
              </li>
              <li className="breadcrumb-item">Blog Details</li>
            </ul>
          </div>
        </div>
      </div>


      <div className="row clearfix">

        <div className="col-lg-8 col-md-12 left-box">
          {blogs.length > 0 ? (
            <div className="card single_post">
              <div className="body">

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-secondary-subtle text-secondary ">{blogs[0].category}</span>
                  <small className="text-muted">
                    {new Date(blogs[0].createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                </div>

                {blogs[0].blogImage && (
                  <div className="img-post mb-4">
                    <img
                      className="img-fluid rounded"
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${blogs[0].blogImage.replace(/\\/g, "/")}`}
                      alt={blogs[0].blogName}
                      style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                    />
                  </div>
                )}

                <h1 className="mb-3">{blogs[0].blogName}</h1>

                <div className="lead mb-4 p-3 bg-light rounded">
                  {blogs[0].summary}
                </div>

                <div className="mb-4">
                  {blogs[0].tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary-subtle text-secondary me-2 mb-2">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>

                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html: blogs[0].blogDescription
                      .replace(/<img/g, '<img class="img-fluid mb-3 rounded" style="max-width: 100%; height: auto;"')
                  }}
                />
              </div>
              <div className="footer p-3 bg-light">
                <div className="actions d-flex justify-content-between">
                  <div>
                    <span className="me-3">
                      <i className="fa fa-eye me-1"></i> {blogs[0].views || 0} views
                    </span>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <i className="fa fa-facebook"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-info me-2 mx-2">
                      <i className="fa fa-twitter"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fa fa-linkedin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="col-lg-4 col-md-12 right-box">
          <div className="card mb-4 ">
            <div className="header px-4 pt-4">
              <h2>About Author</h2>
            </div>
            <div className="body text-center px-4 pb-4 pt-2">
              <img
                src={
                  blogs[0]?.uploadedBy?.id?.profilePhoto
                    ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${blogs[0].uploadedBy.id.profilePhoto.replace(/\\/g, "/")}`
                    : "/default-profile.jpg"
                }
                alt="Author"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '1rem'
                }}
              />
              <h5 className="mb-2"> {blogs[0]?.uploadedBy?.id?.name} {blogs[0]?.uploadedBy?.id?.lastName}</h5>
              <p className="text-muted mb-2">Blog Writer</p>
              <p className="mb-0">{blogs[0]?.category || "Category not specified"}</p>
            </div>
          </div>

          {/* Popular Posts */}
          <div className="card">
            <div className="header">
              <h2>Popular Posts</h2>
            </div>
            <div className="body widget popular-post">
              <div className="row">
                <div className="col-lg-12">
                  <div className="single_post mb-3">
                    <p className="mb-1 fw-bold">Apple Introduces Search Ads Basic</p>
                    <span className="text-muted small">Jun 22, 2023</span>
                    <div className="img-post mt-2">
                      <img
                        src="/DashboardAssets/assets/images/blog/blog-page-2.jpg"
                        className="img-fluid rounded"
                        alt="Popular Post"
                      />
                    </div>
                  </div>
                  <div className="single_post">
                    <p className="mb-1 fw-bold">New Rules, More Cars, More Races</p>
                    <span className="text-muted small">Jun 8, 2023</span>
                    <div className="img-post mt-2">
                      <img
                        src="/DashboardAssets/assets/images/blog/blog-page-3.jpg"
                        className="img-fluid rounded"
                        alt="Popular Post"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistBlogDetails;
