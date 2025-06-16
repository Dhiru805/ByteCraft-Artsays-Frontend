// import React, { useState, useEffect } from "react";
// import { toast } from 'react-toastify';
// import putAPI from "../../../../api/putAPI";
// import { useConfirm } from '../../StatusConfirm';
// import getAPI from "../../../../api/getAPI";

// const VerifyModal = ({ seller, onClose, refreshSellers }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
//     const [rejectComment, setRejectComment] = useState("");
//     const [selectedImage, setSelectedImage] = useState(null);
//     const confirm = useConfirm();
//     const [loading, setLoading] = useState(false);
//     const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

//     const [formData, setFormData] = useState({
//         gstNumber: '',
//         panNumber: '',
//         documents: {
//             gst: null,
//             pan: null
//         }
//     });

//     useEffect(() => {
//         if (seller?._id) {
//             getAPI(`/auth/gettaxlegalcompliance/${seller._id}`)
//                 .then(response => {
//                     if (response.data?.compliance) {
//                         setFormData(prev => ({
//                             ...prev,
//                             ...response.data.compliance,
//                             documents: { ...prev.documents, ...response.data.compliance.documents }
//                         }));
//                     }
//                 })
//                 .catch(() => console.log("Fetch attempt completed"));
//         }
//     }, [seller]);

//     const updateUserStatus = async (userId, status, comment = "") => {
//         setLoading(true);
//         try {
//             await putAPI(
//                 `/auth/updateuserstatus/${userId}`,
//                 { status, Rejcectcomment: comment },
//                 {},
//                 true
//             );
//             toast[status === 'Verified' ? 'success' : 'error'](`User status is ${status}`);
//             refreshSellers();
//             onClose();
//         } catch (error) {
//             console.error("Error updating user status:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReject = (userId) => {
//         setIsRejectModalOpen(true);
//     };

//     const handleRejectConfirm = (userId) => {
//         if (!rejectComment.trim()) {
//             toast.error('Please provide a rejection comment');
//             return;
//         }
//         confirm(() => updateUserStatus(userId, 'Rejected', rejectComment), 
//                 `Are you sure you want to reject this user ?`);
//         setIsRejectModalOpen(false);
//         setRejectComment("");
//     };

//     const openModal = (imageUrl) => {
//         setSelectedImage(imageUrl);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     const closeRejectModal = () => {
//         setIsRejectModalOpen(false);
//         setRejectComment("");
//     };

//     const renderDocumentPreview = (fileOrUrl) => {
//         if (!fileOrUrl) return null;

//         const fileUrl = typeof fileOrUrl === 'string' ? `${BASE_URL}${fileOrUrl}` : URL.createObjectURL(fileOrUrl);

//         return fileUrl.includes('.pdf') ? (
//             <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-info">
//                 View PDF
//             </a>
//         ) : (
//             <img
//                 src={fileUrl}
//                 alt="Uploaded Document"
//                 className="img-thumbnail"
//                 width="100"
//                 onClick={() => openModal(fileUrl)}
//                 style={{ cursor: 'pointer' }}
//             />
//         );
//     };

//     return (
//         <>
//             <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Verified Seller</h5>
//                             <button type="button" className="close" onClick={onClose}>
//                                 <span>×</span>
//                             </button>
//                         </div>

//                         <div className="modal-body">
//                             <div className="row clearfix">
//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label>First Name</label>
//                                         <input type="text" className="form-control" value={seller?.name} readOnly />
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label>Last Name</label>
//                                         <input type="text" className="form-control" value={seller?.lastName} readOnly />
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label>Email</label>
//                                         <input type="email" className="form-control" value={seller?.email} readOnly />
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label htmlFor="phone">Phone</label>
//                                         <input type="text" className="form-control" id="phone" value={seller?.phone} readOnly />
//                                     </div>
//                                 </div>
//                             </div>

//                             <form>
//                                 {['gst', 'pan'].map((field, index) => (
//                                     <div key={index} className="row clearfix mb-3">
//                                         <div className="col-lg-6 col-md-6">
//                                             <div className="form-group">
//                                                 <label>
//                                                     {field.toUpperCase()} Number <span style={{ color: 'red' }}>*</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     value={formData[`${field}Number`] || ''}
//                                                     disabled
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-6 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Upload Document</label>
//                                                 <div className="mt-2">{renderDocumentPreview(formData.documents[field])}</div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </form>
//                         </div>

//                         <div className="modal-footer">
//                             {seller.status !== 'Verified' && (
//                                 <button
//                                     type="button"
//                                     className="btn btn-success"
//                                     onClick={() => updateUserStatus(seller._id, 'Verified')}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Verifying...' : 'Verified'}
//                                 </button>
//                             )}
//                             {seller.status !== 'Rejected' && (
//                                 <button
//                                     type="button"
//                                     className="btn btn-danger"
//                                     onClick={() => handleReject(seller._id)}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Rejecting...' : 'Rejected'}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {isModalOpen && selectedImage && (
//                 <div className="modal fade show d-block" style={{ backgroundColor: "#000" }} tabIndex="-1">
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content" style={{ backgroundColor: 'transparent', position: 'relative' }}>
//                             <div className="align-items-center">
//                                 <img
//                                     src={selectedImage}
//                                     alt="Document Preview"
//                                     className="img-fluid"
//                                     style={{ width: '100%', height: '400px' }}
//                                 />
//                                 <button
//                                     onClick={closeModal}
//                                     className="btn btn-secondary"
//                                     style={{ position: 'absolute', top: '10px', right: '10px' }}
//                                 >
//                                     <i className="fa fa-times"></i>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {isRejectModalOpen && (
//                 <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Reject Seller</h5>
//                                 <button type="button" className="close" onClick={closeRejectModal}>
//                                     <span>×</span>
//                                 </button>
//                             </div>
//                             <div className="modal-body">
//                                 <div className="form-group">
//                                     <label htmlFor="rejectComment">Rejection Comment</label>
//                                     <textarea
//                                         className="form-control"
//                                         id="rejectComment"
//                                         rows="4"
//                                         value={rejectComment}
//                                         onChange={(e) => setRejectComment(e.target.value)}
//                                         placeholder="Enter reason for rejection"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary" 
//                                     onClick={closeRejectModal}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-danger" 
//                                     onClick={() => handleRejectConfirm(seller._id)}
//                                     disabled={loading || !rejectComment.trim()}
//                                 >
//                                     {loading ? 'Rejecting...' : 'Confirm Reject'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default VerifyModal;


import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import putAPI from "../../../../api/putAPI";
import { useConfirm } from '../../StatusConfirm';
import getAPI from "../../../../api/getAPI";

const VerifyModal = ({ seller, onClose, refreshSellers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const confirm = useConfirm();
    const [loading, setLoading] = useState(false);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    const [formData, setFormData] = useState({
        gstNumber: '',
        panNumber: '',
        documents: {
            gst: null,
            pan: null
        }
    });

    useEffect(() => {
        if (seller?._id) {
            getAPI(`/auth/gettaxlegalcompliance/${seller._id}`)
                .then(response => {
                    if (response.data?.compliance) {
                        setFormData(prev => ({
                            ...prev,
                            ...response.data.compliance,
                            documents: { ...prev.documents, ...response.data.compliance.documents }
                        }));
                    }
                })
                .catch(() => console.log("Fetch attempt completed"));
        }
    }, [seller]);

    // Check if all required data is present
    const isDataComplete = () => {
        return (
            formData.gstNumber?.trim() &&
            formData.panNumber?.trim() &&
            formData.documents.gst &&
            formData.documents.pan
        );
    };

    const updateUserStatus = async (userId, status, comment = "") => {
        setLoading(true);
        try {
            await putAPI(
                `/auth/updateuserstatus/${userId}`,
                { status, Rejcectcomment: comment },
                {},
                true
            );
            toast[status === 'Verified' ? 'success' : 'error'](`User status is ${status}`);
            refreshSellers();
            onClose();
        } catch (error) {
            console.error("Error updating user status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = (userId) => {
        setIsRejectModalOpen(true);
    };

    const handleRejectConfirm = (userId) => {
        if (!rejectComment.trim()) {
            toast.error('Please provide a rejection comment');
            return;
        }
        confirm(() => updateUserStatus(userId, 'Rejected', rejectComment), 
                `Are you sure you want to reject this user ?`);
        setIsRejectModalOpen(false);
        setRejectComment("");
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
        setRejectComment("");
    };

    const renderDocumentPreview = (fileOrUrl) => {
        if (!fileOrUrl) return null;

        const fileUrl = typeof fileOrUrl === 'string' ? `${BASE_URL}${fileOrUrl}` : URL.createObjectURL(fileOrUrl);

        return fileUrl.includes('.pdf') ? (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                View PDF
            </a>
        ) : (
            <img
                src={fileUrl}
                alt="Uploaded Document"
                className="img-thumbnail"
                width="100"
                onClick={() => openModal(fileUrl)}
                style={{ cursor: 'pointer' }}
            />
        );
    };

    return (
        <>
            <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Verified Seller</h5>
                            <button type="button" className="close" onClick={onClose}>
                                <span>×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="row clearfix">
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" className="form-control" value={seller?.name} readOnly />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control" value={seller?.lastName} readOnly />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" className="form-control" value={seller?.email} readOnly />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input type="text" className="form-control" id="phone" value={seller?.phone} readOnly />
                                    </div>
                                </div>
                            </div>

                            <form>
                                {['gst', 'pan'].map((field, index) => (
                                    <div key={index} className="row clearfix mb-3">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="form-group">
                                                <label>
                                                    {field.toUpperCase()} Number <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData[`${field}Number`] || ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="form-group">
                                                <label>Upload Document</label>
                                                <div className="mt-2">{renderDocumentPreview(formData.documents[field])}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </form>
                        </div>

                        <div className="modal-footer">
                            {seller.status !== 'Verified' && isDataComplete() && (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => updateUserStatus(seller._id, 'Verified')}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verified'}
                                </button>
                            )}
                            {seller.status !== 'Rejected' && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleReject(seller._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Rejecting...' : 'Rejected'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedImage && (
                <div className="modal fade show d-block" style={{ backgroundColor: "#000" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: 'transparent', position: 'relative' }}>
                            <div className="align-items-center">
                                <img
                                    src={selectedImage}
                                    alt="Document Preview"
                                    className="img-fluid"
                                    style={{ width: '100%', height: '400px' }}
                                />
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isRejectModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reject Seller</h5>
                                <button type="button" className="close" onClick={closeRejectModal}>
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="rejectComment">Rejection Comment</label>
                                    <textarea
                                        className="form-control"
                                        id="rejectComment"
                                        rows="4"
                                        value={rejectComment}
                                        onChange={(e) => setRejectComment(e.target.value)}
                                        placeholder="Enter reason for rejection"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={closeRejectModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={() => handleRejectConfirm(seller._id)}
                                    disabled={loading || !rejectComment.trim()}
                                >
                                    {loading ? 'Rejecting...' : 'Confirm Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VerifyModal;