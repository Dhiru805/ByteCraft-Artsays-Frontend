import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import getAPI from "../../../../../api/getAPI";


const ChallengesEntries = () => {

  const navigate = useNavigate();

  const [applicationsPerPage, setApplicationsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [applications, setApplications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const handleApplicationsPerPage = (e) => {
    setApplicationsPerPage(Number(e.target.value))
  }

  const fetchChallengeApplications = async () => {
    try {
      const response = await getAPI("/api/challenges-applications")

      if (response?.hasError === false) {
        setApplications(response.data.data)
      }
      else {
        console.log(response)
      }
    }
    catch (error) {
      console.log("Error fetching challenge applications: ", error)
    }
  }

  useEffect(() => {
    fetchChallengeApplications()
  }, [])

  // Filtering applications by user searches
  const filteredApplications = applications.filter((application) =>
    (application.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (application.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (application.contactNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (application.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (application.challenge || "").toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2>Challenges Entries</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/challenges")} style={{ cursor: "pointer" }}>Challenges</span>
              </li>
              <li className="breadcrumb-item">Challenges Entries</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">

            {/* Filters setion */}
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  style={{ minWidth: "70px" }}
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
                  <i
                    className="fa fa-search"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: 'none',
                    }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact Number</th>
                      <th>Challenge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length > 0 ? (
                      displayedApplications.map((application, index) => (
                        <tr key={application._id}>
                          <td>{(currentPage - 1) * applicationsPerPage + index + 1}</td>
                          <td>{application.fullName || '_'}</td>
                          <td>{application.email || '_'}</td>
                          <td>{application.contactNumber || '_'}</td>
                          <td>{application.challenge || '_'}</td>
                          <td>
                            <button className="btn btn-outline-primary btn-sm mr-2"
                              title="View"
                              onClick={() => navigate('/super-admin/challenges/view-application', { state: { applicantion: application } })}>
                              <i className="fa fa-eye"></i>
                            </button>
                            <button className="btn btn-outline-info btn-sm"
                              title="Update"
                              onClick={() => navigate('/super-admin/challenges/update-application', { state: { applicantion: application } })}>
                              <i className="fa fa-pencil"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No applications</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredExhibitions.length === 0
                    ? 0
                    : (currentPage - 1) * exhibitionsPerPage + 1}{" "}
                  to {Math.min(currentPage * exhibitionsPerPage, filteredExhibitions.length)} of{" "}
                  {filteredExhibitions.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""}`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      <button className="page-link">{pageNumber}</button>
                      <th>Contact Number</th>
                      <th>Challenge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length > 0 ? (
                      displayedApplications.map((applicantion, index) => (
                        <tr key={applicantion._id}>
                          <td>{(currentPage - 1) * applicationsPerPage + index + 1}</td>
                          <td>{applicantion.fullName || '_'}</td>
                          <td>{applicantion.email || '_'}</td>
                          <td>{applicantion.contactNumber || '_'}</td>
                          <td>{applicantion.challenge || '_'}</td>
                          <td>
                            <button className="btn btn-outline-primary btn-sm mr-2"
                              title="View"
                              onClick={() => navigate('/super-admin/challenges/view-application', { state: { applicantion } })}>
                              <i className="fa fa-eye"></i>
                            </button>
                            <button className="btn btn-outline-info btn-sm"
                              title="Update"
                              onClick={() => navigate('/super-admin/challenges/update-application', { state: { applicantion } })}>
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
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePreviousPage}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                    <li
                      key={pageNum}
                      className={`paginate_button page-item ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      <button className="page-link">{pageNum}</button>
                    </li>
                  ))}
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
  );
};

export default ChallengesEntries;
