import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";

function UpdateApplication() {

    const backendURL = '${process.env.REACT_APP_API_URL}/uploads/careerApplications'
    const location = useLocation()
    const application = location?.state?.applicant;
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: application?.fullName || "",
        email: application?.email || "",
        contactNumber: application?.contactNumber || "",
        jobPosition: application?.jobPosition || "",
        coverLetter: application?.coverLetter || "",
        condition: application?.condition || false,
        jobId: application?.jobId
    })
    const [resume, setResume] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e) => {
        const { value, name, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleResumeChange = (e) => {
        setResume(e.target.files[0])
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            const data = new FormData()
            data.append("fullName", formData.fullName)
            data.append("email", formData.email)
            data.append("contactNumber", formData.contactNumber)
            data.append("jobPosition", formData.jobPosition)
            data.append("coverLetter", formData.coverLetter)
            data.append("condition", formData.condition)
            if (resume) {
                data.append("resume", resume)
            }

            const response = await putAPI(`/api/update-career-application/${application._id}`, data,
                { headers: { "Content-Type": "multipart/form-data" } })
            
            if(response?.hasError === false){
                toast.success("Update successfully")
                navigate('/super-admin/career/applications')
            }
            else{
                toast.error("Failed to update application")
                console.log(response)
            }
        }
        catch (error) {
            console.log("Error updating application:", error)
        }
    }

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
                            <li className="breadcrumb-item">Update Application</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Application Details */}
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">
                            <form onSubmit={handleFormSubmit}>

                                {/* Full Name and Email */}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter full name"
                                            name="fullname"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Email ID</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contact Number and Job Position */}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Contact Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Job Position</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            name="jobPosition"
                                            value={formData.jobPosition}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="form-group">
                                    <label>Cover Letter</label>
                                    <textarea
                                        className="form-control"
                                        name="coverLetter"
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        rows={4}
                                        required
                                    />
                                </div>

                                {/* Resume */}
                                <div>
                                    <label>Resume</label>
                                    {application?.resume && (
                                        <div className="mb-2">
                                            <a href={`${backendURL}/${application.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                View Resume
                                            </a>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="resume"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                    />
                                </div>

                                {/* Terms & Conditions */}
                                <div className="form-group form-check my-4">
                                    <input
                                        type="checkbox"
                                        name="condition"
                                        className="form-check-input"
                                        onChange={handleInputChange}
                                        checked={formData.condition}
                                        required
                                    />
                                    <label className="form-check-label">
                                        By using this form you agree with the storage and handling of your data.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-block btn-success mt-2"
                                    disabled={loading}
                                >
                                    {loading ? "Updating Application" : "Update Application"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateApplication;