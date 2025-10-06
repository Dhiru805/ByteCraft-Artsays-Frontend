import { useNavigate } from "react-router-dom";


const ChallengesTable = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
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
              <li className="breadcrumb-item">Challenges</li>
              <li className="breadcrumb-item">Challenges Entries</li>
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
                  style={{ minWidth: "70px" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "150px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
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
                      <th>Category</th>
                      <th>Entry Fee</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {displayedExhibitions.map((exhibition, index) => (
                      <tr key={exhibition._id}>
                        <td>{(currentPage - 1) * exhibitionsPerPage + index + 1}</td>
                        <td>{exhibition.title || "-"}</td>
                        <td>{exhibition.type || "-"}</td>
                        <td>{exhibition.hostedBy || "-"}</td>
                        <td>{new Date(exhibition.startDate).toLocaleDateString() || "-"}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mr-1"
                            title="View"
                            onClick={() =>
                              navigate(`/super-admin/exhibition/view-exhibition`, { state: { exhibition } })
                            }
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm mr-2"
                            title="Edit"
                            onClick={() =>
                              navigate(`/super-admin/exhibition/update-exhibition`, { state: { exhibition } })
                            }
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            title="Delete"
                            onClick={() => openDeleteDialog(exhibition)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
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
                    </li>
                  ))}
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    onClick={handleNext}
                  >
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesTable;