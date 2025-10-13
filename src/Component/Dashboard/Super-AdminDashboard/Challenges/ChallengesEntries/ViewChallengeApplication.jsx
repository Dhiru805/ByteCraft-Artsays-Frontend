import { useLocation, Link } from "react-router-dom";
import { format } from "date-fns";

function ViewChallengeApplication() {

    const location = useLocation()
    const application = location?.state.applicantion

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="block-header">
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <h2>View Application</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to={'/'}>
                                    <i className="fa fa-dashboard"></i>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={'/super-admin/challenges-entries'} className="text-decoration-none">Challenges Applications</Link>
                            </li>
                            <li className="breadcrumb-item">View Application</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Application details */}
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">

                            {/* Full Name and Email ID */}
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Full Name</label>
                                    <input
                                        className="form-control"
                                        value={application?.fullName || ''}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Email ID</label>
                                    <input
                                        className="form-control"
                                        value={application?.email || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Contact Number and Job Position */}
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        value={application?.contactNumber || ''}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>User Name</label>
                                    <input
                                        className="form-control"
                                        value={application?.artistUsername || ''}
                                        disabled
                                    />
                                </div>
                            </div>


                            {/* Challenge and Category */}
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Challenge Theme</label>
                                    <input
                                        className="form-control"
                                        value={application?.challenge || ''}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Category</label>
                                    <input
                                        className="form-control"
                                        value={application?.category || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    disabled
                                    rows={3}
                                    value={application?.description || ''}
                                />
                            </div>

                            {/* Work and Joined date */}
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Work</label>
                                    <div>
                                        <a href={application?.work}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >View Work</a>
                                    </div>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Joined Date</label>
                                    <input
                                        className="form-control"
                                        // value={application?.date ? format(new Date(application.date), "dd MMM yyyy") : ""}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewChallengeApplication;