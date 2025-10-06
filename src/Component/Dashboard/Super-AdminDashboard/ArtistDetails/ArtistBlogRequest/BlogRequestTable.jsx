import React, { useState, useEffect } from 'react';
import { useConfirm } from '../../../StatusConfirm';
import { toast } from 'react-toastify';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import { useNavigate } from 'react-router-dom';


const BlogRequest = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(10);
    const confirm = useConfirm();
    const navigate = useNavigate();
    const [loadingBlogId, setLoadingBlogId] = useState(null);
    const [actionType, setActionType] = useState('');

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionComment, setRejectionComment] = useState('');
    const [selectedArtistToReject, setSelectedArtistToReject] = useState(null);


    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const result = await getAPI("/Blog-Post/all-blogs", {}, true, false);
                if (result.data) {
                    setBlogs(result.data.blogs);
                    console.log(result.data.blogs);

                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    const updateBlogStatus = async (blogId, status) => {
        setLoadingBlogId(blogId);
        setActionType(status);

        try {
            await putAPI(
                `/Blog-Post/update-status/${blogId}`,
                {
                    blogStatus: status,
                    adminComments: status === 'Rejected' ? rejectionComment : ''
                },
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
            setLoadingBlogId(null);
            setActionType('');
        }
    };

    const handleReject = (blogId) => {
        setSelectedArtistToReject(blogId);
        setIsRejectModalOpen(true);
    };

    const submitRejection = async () => {
        if (!rejectionComment.trim()) {
            toast.error("Rejection comment is required.");
            return;
        }

        setLoadingBlogId(selectedArtistToReject);
        setActionType('Rejected');

        try {
            await putAPI(
                `/Blog-Post/update-status/${selectedArtistToReject}`,
                {
                    blogStatus: 'Rejected',
                    rejectionComment: rejectionComment.trim()
                },
                {},
                true
            );

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog._id === selectedArtistToReject
                        ? { ...blog, blogStatus: 'Rejected' }
                        : blog
                )
            );

            toast.error("Blog Request is Rejected");

            setIsRejectModalOpen(false);
            setRejectionComment('');
            setSelectedArtistToReject(null);
        } catch (error) {
            console.error("Error rejecting blog:", error);
        } finally {
            setLoadingBlogId(null);
            setActionType('');
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const authorName = blog?.uploadedBy?.name || blog.blogAuthor;
        const matchName = authorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = blog.blogStatus.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDate = new Date(blog.createdAt).toLocaleDateString('en-IN').includes(searchTerm);
        return matchName || matchStatus || matchDate;
    });

    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const displayedBlogs = filteredBlogs.slice(
        (currentPage - 1) * blogsPerPage,
        currentPage * blogsPerPage
    );

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleBlogsPerPageChange = (event) => {
        setBlogsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };



    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Blog Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Blog Request</li>
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
                                    name="DataTables_Table_0_length"
                                    aria-controls="DataTables_Table_0"
                                    className="form-control form-control-sm"
                                    value={blogsPerPage}
                                    onChange={handleBlogsPerPageChange}
                                    style={{ minWidth: '70px' }}
                                >
                                    {/* <option value="5">5</option> */}
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
                            </div>


                            <div className="w-100 w-md-auto d-flex justify-content-end">
                                <div className="input-group" style={{ maxWidth: '150px' }}>
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
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                        }}
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <div className="body">
                            <div className="table-responsive">
                                <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Blog View</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Action</th>

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
                                                    <td>
                                                        <h6 className="mb-0">{(currentPage - 1) * blogsPerPage + index + 1}</h6>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            {blog?.uploadedBy?.name || blog?.blogAuthor}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-info"
                                                            onClick={() => navigate(`/super-admin/artist/blogrequest/view-Blog`, { state: { blog } })}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                    <td>{new Date(blog.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                    <td>
                                                        <button className={`btn btn-sm  ${blog.blogStatus === 'Pending' ? 'btn-outline-warning' : blog.blogStatus === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                                                            {blog.blogStatus}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        {blog.blogStatus !== 'Approved' && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-success w-2 mr-2"
                                                                title="Approved"
                                                                onClick={() => updateBlogStatus(blog._id, 'Approved')}
                                                                disabled={loadingBlogId}
                                                            >
                                                                {loadingBlogId === blog._id && actionType === 'Approved' ? (
                                                                    <i className="fa fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fa fa-check"></i>
                                                                )}
                                                            </button>
                                                        )}
                                                        {blog.blogStatus !== 'Rejected' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Declined"
                                                                onClick={() => handleReject(blog._id)}
                                                                disabled={loadingBlogId}
                                                            >
                                                                {loadingBlogId === blog._id && actionType === 'Rejected' ? (
                                                                    <i className="fa fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fa fa-ban"></i>
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                    Showing {(currentPage - 1) * blogsPerPage + 1} to {Math.min(currentPage * blogsPerPage, filteredBlogs.length)} of {filteredBlogs.length} entries
                                </span>

                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li
                                        className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={handlePrevious}
                                    >
                                        <button className="page-link">Previous</button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                                        .filter((pageNumber) => pageNumber === currentPage)
                                        .map((pageNumber, index, array) => {
                                            const prevPage = array[index - 1];
                                            if (prevPage && pageNumber - prevPage > 1) {
                                                return (
                                                    <React.Fragment key={`ellipsis-${pageNumber}`}>
                                                        <li className="page-item disabled"><span className="page-link">...</span></li>
                                                        <li
                                                            key={pageNumber}
                                                            className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                            onClick={() => setCurrentPage(pageNumber)}
                                                        >
                                                            <button className="page-link">{pageNumber}</button>
                                                        </li>
                                                    </React.Fragment>
                                                );
                                            }

                                            return (
                                                <li
                                                    key={pageNumber}
                                                    className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                >
                                                    <button className="page-link">{pageNumber}</button>
                                                </li>
                                            );
                                        })}

                                    <li
                                        className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
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
            {isRejectModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reject Blog</h5>
                                <button type="button" className="close" onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setRejectionComment('');
                                    setSelectedArtistToReject(null);
                                }}>
                                    <span></span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="rejectComment">Rejection Comment</label>
                                    <textarea
                                        className="form-control"
                                        id="rejectComment"
                                        rows="4"
                                        value={rejectionComment}
                                        onChange={(e) => setRejectionComment(e.target.value)}
                                        placeholder="Enter reason for rejection"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setIsRejectModalOpen(false);
                                        setRejectionComment('');
                                        setSelectedArtistToReject(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={submitRejection}
                                    disabled={loadingBlogId === selectedArtistToReject || !rejectionComment.trim()}
                                >
                                    {loadingBlogId === selectedArtistToReject ? "Rejecting..." : "Confirm Reject"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default BlogRequest;
