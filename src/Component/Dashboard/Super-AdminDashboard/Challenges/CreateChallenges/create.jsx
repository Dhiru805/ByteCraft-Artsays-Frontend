import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function Challenges() {

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Challenges</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/super-admin/exhibition">Challenges</Link>
              </li>
              <li className="breadcrumb-item">Create Challenges</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">
                      Challenge Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-control"
                      placeholder="Enter Exhibition Title"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="type">
                      Theme Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Type</option>

                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="summary">
                    Challenge Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    className="form-control"
                    placeholder="Enter a short summary of the job"
                    rows="3"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label htmlFor="startDate">
                      Start Date & Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="endDate">
                      End Date & Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="endDate">
                      Submission Deadline <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="startDate">
                      Entry Fee <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="startDate"
                      name="startDate"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="endDate">
                      Prize Details<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label htmlFor="startDate">
                      Judging Criteria <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="startDate"
                      name="startDate"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="endDate">
                      Max Participants 
                    </label>
                    <input
                      type="number"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="endDate">
                      Tagz / Keywords <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-primary mt-3"
                > Create Challenge
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Challenges;