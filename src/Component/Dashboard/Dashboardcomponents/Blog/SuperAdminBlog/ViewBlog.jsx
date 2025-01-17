import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';

function BlogDetails() {
  const { blogId } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
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
  
    fetchBlog();
  }, [blogId]);
  

  return (
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
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 left-box">
          {blogs && Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((blog) => {
              const isExpanded = blog._id === selectedBlog?._id;

              return (
                <div key={blog._id} className="card single_post">
                  <div className="body">
                    <div className="img-post" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                      <img
                        className="d-block w-100 h-100 object-fit-cover"
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
                    </div>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
