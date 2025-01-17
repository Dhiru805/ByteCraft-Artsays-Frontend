import React, { useEffect, useState } from 'react';
import Layout from '../Layout';


function BlogDetails() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/Blog-Post/all-blogs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch blogs");
        return response.json();
      })
      .then((data) => {
        setBlogs(data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);


  return (
  //  <Layout>
        <div className="container-fluid">
          <div className="block-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h2>Blog Details</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
                  <li className="breadcrumb-item">App</li>
                  <li className="breadcrumb-item active">Blog</li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="d-flex flex-row-reverse">
                  <div className="page_action">
                    {/* <button type="button" className="btn btn-primary mx-2">Generate Report</button>
                    <a href="blog-post.html" className="btn btn-secondary" title="new post">New post</a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-lg-8 col-md-12 left-box">
              {loading ? (
                <p>Loading blogs...</p>
              ) : (
                blogs.map((blog) => {
                  const isExpanded = blog._id === selectedBlog?._id;

                  return (
                    <div key={blog._id} className="card single_post">
                      <div className="body">
                        <div className="img-post">
                          <img
                            className="d-block img-fluid"
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
                          {/* Uncomment for delete or update */}
                          {/* <button
                            className="btn btn-outline-danger mx-2"
                            onClick={() => handleDelete(blog._id)}
                          >
                            Delete
                          </button> */}
                          {/* <button
                            className="btn btn-outline-dark"
                            onClick={() => handleUpdateClick(blog)}
                          >
                            Update
                          </button> */}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

            {/* <div className="row clearfix">
                <div className="col-lg-8 col-md-12 left-box">
                    <div className="card single_post">
                        <div className="body">
                            <div className="img-post">
                                <img className="d-block img-fluid" src="DashboardAssets/assets/images/blog/blog-page-1.jpg" alt="First slide"/>
                            </div>
                            <h3><a href="blog-details.html">All photographs are accurate</a></h3>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        </div>                        
                    </div> */}
                    <div className="card">
                            <div className="header">
                                <h2>Comments 3</h2>
                            </div>
                            <div className="body">
                                <ul className="comment-reply list-unstyled">
                                    <li className="row clearfix">
                                        <div className="icon-box col-md-2 col-4"><img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/sm/avatar2.jpg" alt="Awesome Image"/></div>
                                        <div className="text-box col-md-10 col-8 p-l-0 p-r0">
                                            <h5 className="mb-0">Gigi Hadid </h5>
                                            <p>Why are there so many tutorials on how to decouple WordPress? how fast and easy it is to get it running (and keep it running!) and its massive ecosystem. </p>
                                            <ul className="list-inline">
                                                <li><a href="javascript:void(0);">Mar 09 2018</a></li>
                                                <li><a href="javascript:void(0);">Reply</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="row clearfix">
                                        <div className="icon-box col-md-2 col-4"><img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/sm/avatar3.jpg" alt="Awesome Image"/></div>
                                        <div className="text-box col-md-10 col-8 p-l-0 p-r0">
                                            <h5 className="mb-0">Christian Louboutin</h5>
                                            <p>Great tutorial but few issues with it? If i try open post i get following errors. Please can you help me?</p>
                                            <ul className="list-inline">
                                                <li><a href="javascript:void(0);">Mar 12 2018</a></li>
                                                <li><a href="javascript:void(0);">Reply</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="row clearfix">
                                        <div className="icon-box col-md-2 col-4"><img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/sm/avatar4.jpg" alt="Awesome Image"/></div>
                                        <div className="text-box col-md-10 col-8 p-l-0 p-r0">
                                            <h5 className="mb-0">Kendall Jenner</h5>
                                            <p>Very nice and informative article. In all the years I've done small and side-projects as a freelancer, I've ran into a few problems here and there.</p>
                                            <ul className="list-inline">
                                                <li><a href="javascript:void(0);">Mar 20 2018</a></li>
                                                <li><a href="javascript:void(0);">Reply</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>                                        
                            </div>
                        </div>
                        <div className="card">
                            <div className="header">
                                <h2>Leave a reply <small>Your email address will not be published. Required fields are marked*</small></h2>
                            </div>
                            <div className="body">
                                <div className="comment-form">
                                    <form className="row clearfix">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="text" className="form-control" placeholder="Your Name"/>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="text" className="form-control" placeholder="Email Address"/>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <textarea rows="4" className="form-control no-resize" placeholder="Please type what you want..."></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-block btn-primary">SUBMIT</button>
                                        </div>                                
                                    </form>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="col-lg-4 col-md-12 right-box">
                    <div className="card">
                        <div className="body search">
                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i class="fas fa-search"></i></span>
                                </div>
                                <input type="text" className="form-control" placeholder="Search..."/>                                    
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="header">
                            <h2>Categories Clouds</h2>
                        </div>
                        <div className="body widget">
                            <ul className="list-unstyled categories-clouds mb-0">
                                <li><a href="javascript:void(0);">eCommerce</a></li>
                                <li><a href="javascript:void(0);">Microsoft Technologies</a></li>
                                <li><a href="javascript:void(0);">Creative UX</a></li>
                                <li><a href="javascript:void(0);">Wordpress</a></li>
                                <li><a href="javascript:void(0);">Angular JS</a></li>
                                <li><a href="javascript:void(0);">Enterprise Mobility</a></li>
                                <li><a href="javascript:void(0);">Website Design</a></li>
                                <li><a href="javascript:void(0);">HTML5</a></li>
                                <li><a href="javascript:void(0);">Infographics</a></li>
                                <li><a href="javascript:void(0);">Wordpress Development</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="card">
                        <div className="header">
                            <h2>Popular Posts</h2>                        
                        </div>
                        <div className="body widget popular-post">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="single_post">
                                        <p className="mb-0">Apple Introduces Search Ads Basic</p>
                                        <span>jun 22, 2018</span>
                                        <div className="img-post">
                                            <img src="DashboardAssets/assets/images/blog/blog-page-2.jpg" alt="Awesome Image"/>                                        
                                        </div>                                            
                                    </div>
                                    <div className="single_post">
                                        <p className="mb-0">new rules, more cars, more races</p>
                                        <span>jun 8, 2018</span>
                                        <div className="img-post">
                                            <img src="DashboardAssets/assets/images/blog/blog-page-3.jpg" alt="Awesome Image"/>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="header">
                            <h2>Instagram Post</h2>
                        </div>
                        <div className="body widget">
                            <ul className="list-unstyled instagram-plugin mb-0">
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/05-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/06-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/07-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/08-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/09-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/10-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/11-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/12-img.jpg" alt="image description"/></a></li>
                                <li><a href="javascript:void(0);"><img src="DashboardAssets/assets/images/blog/13-img.jpg" alt="image description"/></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="card">
                        <div className="header">
                            <h2>Email Newsletter <small>Get our products/news earlier than others, let’s get in touch.</small></h2>
                        </div>
                        <div className="body widget newsletter">                        
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Enter Email"/>
                                <div className="input-group-append">
                                    <span className="input-group-text"><i className="icon-paper-plane"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        // </Layout>
  )
}

export default BlogDetails
