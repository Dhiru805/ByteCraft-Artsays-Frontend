import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { useConfirm } from './StatusConfirm';
import { toast } from 'react-toastify';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { useNavigate } from 'react-router-dom';


const BlogRequest = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const confirm = useConfirm();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const result = await getAPI("http://localhost:3001/Blog-Post/user-blogs", {}, true, false);
                if (result.data) {
                    setBlogs(result.data.blogs);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    const updateBlogStatus = async (blogId, status) => {
        try {
            await putAPI(
                `http://localhost:3001/Blog-Post/update-status/${blogId}`,
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
        }
    };

    const handleReject = (blogId) => {
        confirm(() => updateBlogStatus(blogId, 'Rejected'), "Are you sure you want to reject this blog?");
    };



    const filteredBlogs = blogs.filter(blog => {
        const matchName = blog.blogAuthor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = blog.blogStatus.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDate = new Date(blog.createdAt).toLocaleDateString('en-IN').includes(searchTerm);
        return matchName || matchStatus || matchDate;
    });

    return (
            <div className="container-fluid">
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>Blog Request</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">
                                        <i className="fa fa-dashboard"></i>
                                    </a>
                                </li>
                                <li className="breadcrumb-item">APP</li>
                                <li className="breadcrumb-item active">Blog Request</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="header d-flex justify-content-between align-items-center">
                                <h2>Blog Request List</h2>
                                <div className="d-flex">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-sm btn-outline-secondary">
                                                <i className="fa fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="body">
                                <div className="table-responsive">
                                    <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Blog View</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBlogs.map((blog) => (
                                                <tr key={blog.id}>
                                                    <td>
                                                        <h6 className="mb-0">{blog.blogId}</h6>
                                                    </td>
                                                    <td>
                                                        <span>{blog.blogAuthor}</span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-info"
                                                            onClick={() => navigate(`/Dashboard/BlogRequest/view-blog/${blog._id}`)}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                    <td>{new Date(blog.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                    <td>
                                                        <button className={`btn btn-sm text-white ${blog.blogStatus === 'Pending' ? 'btn-warning' : blog.blogStatus === 'Approved' ? 'btn-success' : 'btn-danger'}`} >
                                                            {blog.blogStatus}
                                                        </button>
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-success w-2 mr-2"
                                                            title="Approved"
                                                            onClick={() => updateBlogStatus(blog._id, 'Approved')}
                                                        >
                                                            <i className="fa fa-check"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Declined"
                                                            onClick={() => handleReject(blog._id)}
                                                        >
                                                            <i className="fa fa-ban"></i>
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
            </div>
        
    );
};

export default BlogRequest;
