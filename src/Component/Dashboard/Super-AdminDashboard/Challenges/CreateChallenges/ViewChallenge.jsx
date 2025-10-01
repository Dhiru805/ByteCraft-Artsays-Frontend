import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import { Helmet } from 'react-helmet';
import ReactQuill from "react-quill";

function ViewChallenge() {

    const navigate = useNavigate();
    const location = useLocation();
    
    const [formValues, setFormValues] = useState({});
    const [tags, setTags] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const challengeId = location.state?.id;

    const handleImageClick = (imageUrl) => {
        setImagePreview(imageUrl);
        setShowPopup(true);
    };

    useEffect(() => {
        if (!challengeId) {
            toast.error("No challenge ID provided.");
            navigate("/super-admin/challenges");
            return;
        }

        const fetchChallenge = async () => {
            try {
                const res = await getAPI(`/api/getchallengebyid/${challengeId}`);
                const { challenge } = res.data;
                console.log(challenge)

                setFormValues({
                    title: challenge.title || '',
                    type: challenge.type || '',
                    summary: challenge.description || '',
                    startDate: challenge.startDate || '',
                    endDate: challenge.endDate || '',
                    submissionDeadline: challenge.submissionDeadline || '',
                    entryFee: challenge.entryFee || '',
                    prizeDetails: challenge.prizeDetails || '',
                    judgingCriteria: challenge.judgingCriteria || '',
                    maxParticipants: challenge.maxParticipants || '',
                    status: challenge.status || '',
                    rules: challenge.rules || ""
                });

                setTags(challenge.tags || []);


                if (challenge.bannerImage) {
                    setImagePreview(challenge.bannerImage);
                }
            } catch (error) {
                toast.error("Failed to fetch challenge data.");
                navigate("/super-admin/challenges");
            }
        };

        fetchChallenge();
    }, [challengeId, navigate]);

    return (
        <>
            <Helmet>
                <title>{formValues.title ? `${formValues.title} | View Challenge` : 'View Challenge | Admin Panel'}</title>
                <meta name="description" content={formValues.summary || "View the details of this challenge."} />
                <meta name="keywords" content={tags.length ? tags.join(', ') : "challenge, view, competition"} />
            </Helmet>

            <div className="container-fluid">

                {/* Header */}
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>View Challenge</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/">
                                        <i className="fa fa-dashboard"></i>
                                    </a>
                                </li>
                                <li className="breadcrumb-item active">
                                    <Link to="/super-admin/challenges">Challenges</Link>
                                </li>
                                <li className="breadcrumb-item">View Challenge</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Challenge details */}
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="body">
                                <form>

                                    {/* Title and Theme */}
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <label>Challenge Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.title || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label>Theme Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.type || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="form-group">
                                        <label>Challenge Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formValues.summary || ""}
                                            readOnly
                                        />
                                    </div>

                                    {/* Start, End and Submission dates */}
                                    <div className="row">
                                        <div className="col-md-4 form-group">
                                            <label>Start Date</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.startDate || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-4 form-group">
                                            <label>End Date</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.endDate || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-4 form-group">
                                            <label>Submission Deadline</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.submissionDeadline || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* Entry fee and Prize details */}
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <label>Entry Fee</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.entryFee || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label>Prize Details</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.prizeDetails || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* Judging criteria and Maximum participants */}
                                    <div className="row">
                                        <div className="col-md-8 form-group">
                                            <label>Judging Criteria</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.judgingCriteria || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-2 form-group">
                                            <label>Max Participants</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.maxParticipants || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-2 form-group">
                                            <label>Status</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formValues.status || ""}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* Tags or keywords */}
                                    <div className="row">
                                        <div className="col-md-12 form-group">
                                            <label>Tags / Keywords</label>
                                            <div
                                                className="d-flex flex-wrap align-items-center form-control p-2"
                                                style={{ minHeight: "44px" }}
                                            >
                                                {tags.map((tag, index) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                                                    >
                                                        <span className="mr-1">#{tag}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rules */}
                                    <div className="form-group">
                                        <label>Rules <span className="text-danger">*</span></label>
                                        <ReactQuill
                                            theme="snow"
                                            value={formValues.rules}
                                            readOnly
                                        />
                                    </div>

                                    {/* Banner or Cover image */}
                                    <div className="row">
                                        <div className="col-md-12 form-group">
                                            <label>Banner/Cover Image</label>
                                            {imagePreview && (
                                                <div className="mt-3">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Challenge Banner"
                                                        className="img-fluid"
                                                        style={{ maxWidth: "100%", height: "auto", cursor: "pointer" }}
                                                        onClick={() => handleImageClick(imagePreview)} // Click to open popup
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {showPopup && (
                <div
                    onClick={() => setShowPopup(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            height: '50%',
                            backgroundColor: '#111',
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={imagePreview}
                            alt="Popup"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewChallenge;
