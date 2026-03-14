import { useLocation, Link } from "react-router-dom";
import { format } from "date-fns";

function ViewApplication() {

    const location = useLocation()
    const application = location?.state.applicant

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
                                <Link to={'/super-admin/career'} className="text-decoration-none">Careers</Link>
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
                                    <label>Applied Job Position</label>
                                    <input
                                        className="form-control"
                                        value={application?.jobPosition || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="form-group">
                                <label>Cover Letter</label>
                                <textarea
                                    className="form-control"
                                    disabled
                                    rows={3}
                                >{application?.coverLetter || ''}</textarea>
                            </div>

                            {/* Resume and Applyed date */}
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Resume</label>
                                    <div>
                                        <a href={`${process.env.REACT_APP_API_URL}/uploads/careerApplications/${application?.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >View Resume</a>
                                    </div>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Applied date</label>
                                    <input
                                        className="form-control"
                                        value={application?.date ? format(new Date(application.date), "dd MMM yyyy") : ""}
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

export default ViewApplication;