import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import getAPI from "../../../../../api/getAPI";

function Applications() {

    const navigate = useNavigate()

    const [applicationsPerPage, setApplicationsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState("")
    const [applications, setApplications] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const handleApplicationsPerPage = (e) => {
        setApplicationsPerPage(Number(e.target.value))
    }

    // Fetching careers applications
    const fetchCareerApplications = async () => {
        try {
            const response = await getAPI('/api/career-jobs-applications')
            
            if (response?.hasError === false) {
                setApplications(response.data.data)
            }
            else {
                console.log(response)
            }
        }
        catch (error) {
            console.log("Error fetch careers application: ", error)
        }
    }

    useEffect(() => {
        fetchCareerApplications()
    }, [])

    // Filtering applications by user searches
    const filteredApplications = applications.filter((application) =>
        application.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage)
    const displayedApplications = filteredApplications.slice(
        (currentPage - 1) * applicationsPerPage,
        currentPage * applicationsPerPage
    )

    // Handling navigate to previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    // Handling navigate to next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }


    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Career</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Career</li>
                            <li className="breadcrumb-item">Applications</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header d-flex justify-content-between align-items-center">
                            <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    className="form-control form-control-sm"
                                    style={{ minWidth: '70px' }}
                                    value={applicationsPerPage}
                                    onChange={handleApplicationsPerPage}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                                <label className="mb-0 ml-2">entries</label>
                            </div>

                            <div className="w-100 w-md-auto d-flex justify-content-end">
                                <div className="input-group" style={{ maxWidth: "150px" }}>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <i className="fa fa-search"
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            pointerEvents: "none"
                                        }}
                                    ></i>
                                </div>
                            </div>
                        </div>

                        <div className="body">
                            {/* Applications data */}
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Full Name</th>
                                            <th>Email ID</th>
                                            <th>Contact Number</th>
                                            <th>Job Position</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApplications.length > 0 ? (
                                            displayedApplications.map((applicant, index) => (
                                                <tr key={applicant._id}>
                                                    <td>{(currentPage - 1) * applicationsPerPage + index + 1}</td>
                                                    <td>{applicant.fullName || '_'}</td>
                                                    <td>{applicant.email || '_'}</td>
                                                    <td>{applicant.contactNumber || '_'}</td>
                                                    <td>{applicant.jobPosition || '_'}</td>
                                                    <td>
                                                        <button className="btn btn-outline-primary btn-sm mr-2"
                                                            title="View"
                                                            onClick={() => navigate('/super-admin/career/applications/view-job-post', { state: { applicant } })}>
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        <button className="btn btn-outline-info btn-sm"
                                                            title="Edit"
                                                            onClick={() => navigate('/super-admin/career/applications/update-job-post', { state: { applicant } })}>
                                                            <i className="fa fa-pencil"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) :
                                            (<div className="text-center">No applications</div>)}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="pagination d-flex justify-content-between mt-4">

                                {/* Left side content */}
                                <span className="d-none d-sm-inline-block text-truncate w-100 mx-1">
                                    Showing {(filteredApplications.length === 0 ? 0 : (currentPage - 1) * applicationsPerPage + 1)} to {Math.min(currentPage * applicationsPerPage, filteredApplications.length)} of {filteredApplications.length} entries
                                </span>

                                {/* Right side content */}
                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li 
                                        className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={handlePreviousPage}
                                    >
                                        <button className="page-link">Previous</button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                                        <li key={pageNum}
                                            className={`paginate_button page-item ${currentPage === pageNum ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}>
                                            <button className="page-link">{pageNum}</button>
                                        </li>
                                    ))}
                                    <li 
                                        className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                                        onClick={handleNextPage}
                                    >
                                        <button className="page-link">Next</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Applications;