import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';


function BlogDetails() {
  const { blogId } = useParams();
  const [blogs, setBlogs] = useState([]);


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
    // Apply inline styles to .ql-container and .ql-editor
    // const quillContainer = document.querySelector('.ql-container');
    // const quillEditor = document.querySelector('.ql-editor');

    // if (quillContainer && quillEditor) {
    //   quillContainer.style.border = 'none';
    //   quillContainer.style.background = 'none';
    //   quillContainer.style.padding = '0';
    //   quillContainer.style.margin = '0';

    //   quillEditor.style.padding = '0';
    //   quillEditor.style.minHeight = '0';
    // }
  }, [blogId]);




  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Blog Details</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
              <li className="breadcrumb-item"><Link to="/Dashboard/BlogRequest">Blog Request</Link></li>
              <li className="breadcrumb-item"><Link to={`/Dashboard/BlogRequest/view-blog/${blogId}`}>View Blog</Link></li>
              <li className="breadcrumb-item">Blog Details</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-8 col-md-12 left-box">
          {blogs.length > 0 && (
            <div key={blogs[0]._id} className="card single_post">
              <div className="body">
                <div className="img-post">
                  <img
                    className="d-block img-fluid"
                    src={
                      blogs[0].blogImage
                        ? `http://localhost:3001/${blogs[0].blogImage.replace(/\\/g, "/")}`
                        : "/placeholder.jpg"
                    }
                    alt={blogs[0].blogName}

                  />
                </div>
                <h6>{blogs[0].blogName}</h6>
                {/* <div className="form-group mt-3">
                  <ReactQuill
                    value={blogs[0].blogDescription}
                    readOnly={true}
                    theme="snow"
                    modules={{ toolbar: false }}
                  />
                </div> */}
                <p
                  dangerouslySetInnerHTML={{
                    __html: blogs[0].blogDescription.replace(/<img[^>]*>/g, (match) => {
                      return `<img src="${match.match(/src="([^"]+)"/)[1]}" style="max-width: 70%; height: auto; object-fit: contain;" />`;
                    })
                  }}
                />
              </div>
              <div className="footer">
                <div className="actions"></div>
              </div>
            </div>
          )}


        </div>
        <div className="col-lg-4 col-md-12 right-box">
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
                      <img src="DashboardAssets/assets/images/blog/blog-page-2.jpg" alt="Awesome Image" />
                    </div>
                  </div>
                  <div className="single_post">
                    <p className="mb-0">new rules, more cars, more races</p>
                    <span>jun 8, 2018</span>
                    <div className="img-post">
                      <img src="DashboardAssets/assets/images/blog/blog-page-3.jpg" alt="Awesome Image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
