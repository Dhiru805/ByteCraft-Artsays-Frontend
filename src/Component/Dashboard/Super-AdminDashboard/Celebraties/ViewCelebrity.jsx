import { useLocation, Link } from "react-router-dom";
import ReactQuill from "react-quill";

function ViewCelebrity() {

    const location = useLocation()
    const celebrity = location?.state?.celebrity;

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>View Celebrity</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to="/super-admin/celebrities" className="text-decoration-none">Celebrities</Link>
                            </li>
                            <li className="breadcrumb-item">View Celebrity</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* */}
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">

                            {/* Full name & Profession */}
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Full Name</label>
                                    <input
                                        value={celebrity?.artistName || ""}
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Profession</label>
                                    <input
                                        value={celebrity?.profession || ""}
                                        className="form-control"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Journey highlights */}
                            <div className="form-group">
                                <label>Highlights of Journey</label>
                                <ReactQuill
                                    theme="snow"
                                    value={celebrity?.highlightsOfJourney}
                                    readOnly
                                />
                            </div>

                            {/* Artworks collected, Years active in art & Exhibition featured */}
                            <div className="row">
                                <div className="col-md-4 form-group">
                                    <label>Artworks Collected</label>
                                    <input
                                        className="form-control"
                                        value={celebrity?.artWorkCollected}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Years ACtive in Art</label>
                                    <input
                                        className="form-control"
                                        value={celebrity?.yearsActiveInArt}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Exhibitions Featured</label>
                                    <input
                                        className="form-control"
                                        value={celebrity?.exhibitionFeatured}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Profile picture */}
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Profile Picture</label>
                                    {celebrity?.profilePicture ? (
                                        <div>
                                            <img 
                                                src={celebrity.profilePicture}
                                                alt={celebrity.artistName || "Profile"}
                                                style={{
                                                    width: "150px",
                                                    height: "150px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    border: "1px solid #ddd",
                                                    padding: "3px"
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-muted mt-2">No profile picture uploaded</p>
                                    )}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCelebrity;