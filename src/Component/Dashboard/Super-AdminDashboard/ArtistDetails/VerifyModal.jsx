// import React, { useState, useEffect } from "react";
// import { toast } from 'react-toastify';
// import putAPI from "../../../../api/putAPI";
// import { useConfirm } from '../../StatusConfirm';

// const VerifyModal = ({ artist, onClose, refreshArtists }) => {
//     const [filePreview, setFilePreview] = useState(null);
//     const [fileType, setFileType] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
//     const [rejectComment, setRejectComment] = useState("");
//     const [users, setUsers] = useState([]);
//     const confirm = useConfirm();
//     const [loading, setLoading] = useState(false);

//     const updateUserStatus = async (userId, status, comment = "") => {
//         setLoading(true);
//         try {
//             await putAPI(
//                 `/auth/updateuserstatus/${userId}`,
//                 { status, Rejcectcomment: comment },
//                 {},
//                 true
//             );

//             setUsers((prevUsers) =>
//                 prevUsers.map((user) =>
//                     user._id === userId ? { ...user, status, Rejcectcomment: comment } : user
//                 )
//             );

//             if (status === 'Verified') {
//                 toast.success('User status is Verified');
//             } else if (status === 'Rejected') {
//                 toast.error('User status is Rejected');
//             } else if (status === 'Unverified') {
//                 toast.error('User status is Unverified');
//             }
//             refreshArtists();
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

//     useEffect(() => {
//         if (artist?.verification?.documentFile) {
//             setFilePreview(`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${artist.verification.documentFile}`);
//             setFileType(artist.verification.documentFile.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
//         }
//     }, [artist]);

//     const handleImageClick = () => {
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     const closeRejectModal = () => {
//         setIsRejectModalOpen(false);
//         setRejectComment("");
//     };

//     return (
//         <>
//             <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Verified Artist</h5>
//                             <button type="button" className="close" onClick={onClose}>
//                                 <span>×</span>
//                             </button>
//                         </div>

//                         <div className="modal-body">
//                             <div className="row clearfix">
//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label htmlFor="firstName">First Name</label>
//                                         <input type="text" className="form-control" id="firstName" value={artist.name} readOnly />
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label htmlFor="lastName">Last Name</label>
//                                         <input type="text" className="form-control" id="lastName" value={artist.lastName} readOnly />
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label htmlFor="email">Email</label>
//                                         <input type="email" className="form-control" id="email" value={artist.email} readOnly />
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label htmlFor="phone">Phone</label>
//                                         <input type="text" className="form-control" id="phone" value={artist.phone} readOnly />
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label htmlFor="documentType">Document Type</label>
//                                         <input type="text" className="form-control" id="documentType" value={artist.verification.documentType} readOnly />
//                                         {filePreview && (
//                                             <div className="mt-3">
//                                                 {fileType === "application/pdf" ? (
//                                                     <div>
//                                                         <a href={filePreview} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
//                                                             View PDF
//                                                         </a>
//                                                     </div>
//                                                 ) : (
//                                                     <img
//                                                         src={filePreview}
//                                                         alt="Uploaded Document"
//                                                         onClick={handleImageClick}
//                                                         className="img-fluid"
//                                                         style={{ width: "250px", height: "150px" }}
//                                                     />
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-6 col-md-12">
//                                     <div className="form-group">
//                                         <label>Document Number</label>
//                                         <input type="text" className="form-control" id="documentType" value={artist.verification.documentNumber} readOnly />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="modal-footer">
//                             {artist.status !== 'Verified' && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-success" 
//                                     onClick={() => updateUserStatus(artist._id, 'Verified')}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Verified....' : 'Verified'}
//                                 </button>
//                             )}
//                             {artist.status !== 'Rejected' && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-danger" 
//                                     onClick={() => handleReject(artist._id)}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Rejected....' : 'Rejected'}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {isModalOpen && (
//                 <div className="modal show d-block" style={{ backgroundColor: "#000" }} tabIndex="-1">
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content" style={{ backgroundColor: "transparent", position: "relative" }}>
//                             <div className="align-items-center" style={{ height: "100%", backgroundColor: "transparent" }}>
//                                 <img src={filePreview} alt="Document Preview" className="img-fluid" style={{ width: "100%", height: "400px", backgroundColor: "transparent" }} />
//                                 <button
//                                     onClick={closeModal}
//                                     className="btn btn-secondary"
//                                     style={{
//                                         position: "absolute",
//                                         top: "10px",
//                                         right: "10px",
//                                         zIndex: 10,
//                                     }}
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
//                                 <h5 className="modal-title">Reject User</h5>
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
//                                     onClick={() => handleRejectConfirm(artist._id)}
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

const VerifyModal = ({ artist, onClose, refreshArtists }) => {
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState("");
    const [users, setUsers] = useState([]);
    const confirm = useConfirm();
    const [loading, setLoading] = useState(false);

    // Check if all required data is present
    const isDataComplete = () => {
        return (
            artist?.name?.trim() &&
            artist?.lastName?.trim() &&
            artist?.email?.trim() &&
            artist?.phone?.trim() &&
            artist?.verification?.documentType?.trim() &&
            artist?.verification?.documentNumber?.trim() &&
            artist?.verification?.documentFile
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

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, status, Rejcectcomment: comment } : user
                )
            );

            if (status === 'Verified') {
                toast.success('User status is Verified');
            } else if (status === 'Rejected') {
                toast.error('User status is Rejected');
            } else if (status === 'Unverified') {
                toast.error('User status is Unverified');
            }
            refreshArtists();
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

    useEffect(() => {
        if (artist?.verification?.documentFile) {
            setFilePreview(`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${artist.verification.documentFile}`);
            setFileType(artist.verification.documentFile.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
        }
    }, [artist]);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
        setRejectComment("");
    };

    return (
        <>
            <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Verified Artist</h5>
                            <button type="button" className="close" onClick={onClose}>
                                <span>×</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="row clearfix">
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name</label>
                                        <input type="text" className="form-control" id="firstName" value={artist.name} readOnly />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" value={artist.lastName} readOnly />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" value={artist.email} readOnly />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input type="text" className="form-control" id="phone" value={artist.phone} readOnly />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="documentType">Document Type</label>
                                        <input type="text" className="form-control" id="documentType" value={artist.verification.documentType} readOnly />
                                        {filePreview && (
                                            <div className="mt-3">
                                                {fileType === "application/pdf" ? (
                                                    <div>
                                                        <a href={filePreview} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                            View PDF
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={filePreview}
                                                        alt="Uploaded Document"
                                                        onClick={handleImageClick}
                                                        className="img-fluid"
                                                        style={{ width: "250px", height: "150px" }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Document Number</label>
                                        <input type="text" className="form-control" id="documentType" value={artist.verification.documentNumber} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {artist.status !== 'Verified' && isDataComplete() && (
                                <button 
                                    type="button" 
                                    className="btn btn-success" 
                                    onClick={() => updateUserStatus(artist._id, 'Verified')}
                                    disabled={loading}
                                >
                                    {loading ? 'Verified....' : 'Verified'}
                                </button>
                            )}
                            {artist.status !== 'Rejected' && (
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={() => handleReject(artist._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Rejected....' : 'Rejected'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "#000" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: "transparent", position: "relative" }}>
                            <div className="align-items-center" style={{ height: "100%", backgroundColor: "transparent" }}>
                                <img src={filePreview} alt="Document Preview" className="img-fluid" style={{ width: "100%", height: "400px", backgroundColor: "transparent" }} />
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        zIndex: 10,
                                    }}
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
                                <h5 className="modal-title">Reject User</h5>
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
                                    onClick={() => handleRejectConfirm(artist._id)}
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