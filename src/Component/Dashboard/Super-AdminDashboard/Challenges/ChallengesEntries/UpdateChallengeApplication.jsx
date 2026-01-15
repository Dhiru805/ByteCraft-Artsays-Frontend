// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import putAPI from "../../../../../api/putAPI";
// import { toast } from "react-toastify";

// function UpdateChallengeApplication() {

//     const location = useLocation()
//     const application = location?.state?.applicantion;
//     const navigate = useNavigate()

//     const [formData, setFormData] = useState({
//         fullName: application?.fullName || "",
//         email: application?.email || "",
//         contactNumber: application?.contactNumber || "",
//         userName: application?.artistUsername || "",
//         description: application?.description || "",
//         guidelines: application?.guidelines || false,
//         challenge: application?.challenge || "",
//         category: application?.category || ""
//     })
//     const [works, setWorks] = useState(null)
//     const [loading, setLoading] = useState(false)
//     const [bannerImage, setBannerImage] = useState(application?.bannerImage || null);

//     const handleInputChange = (e) => {
//         const { value, name, type, checked } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value
//         }))
//     }

//     const handleWorksChange = (e) => {
//         setWorks(e.target.files[0])
//     }

//     const handleFormSubmit = async (e) => {
//         e.preventDefault()

//         setLoading(true)

//         const data = new FormData()
//         data.append("fullName", formData.fullName)
//         data.append("email", formData.email)
//         data.append("contactNumber", formData.contactNumber)
//         data.append("userName", formData.userName)
//         data.append("challengeName", formData.challenge)
//         data.append("category", formData.category)
//         data.append("description", formData.description)
//         data.append("guidelines", formData.guidelines)
//         if (works) {
//             data.append("works", works)
//         }

//         try {
//             // const response = await putAPI(`/api/challenges/update-application/${application._id}`, data,
//             //     { headers: { "Content-Type": "multipart/form-data" } })
//             const response = await putAPI(
//   `/api/challenges/update-application/${application._id}`,
//   data
// );

//                 console.log(response)

//             if (response?.hasError === false) {
//                 toast.success("Update successfully")
//                 navigate('/super-admin/challenges-entries')
//             }
//             else {
//                 toast.error("Failed to update application")
//                 console.log(response)
//             }
//         }
//         catch (error) {
//             console.log("Error updating application:", error)
//         }
//     }

//     return (
//         <div className="container-fluid">

//             {/* Header */}
//             <div className="block-header">
//                 <div className="row">
//                     <div className="col-sm-12 col-md-6 col-lg-6">
//                         <h2>View Application</h2>
//                         <ul className="breadcrumb">
//                             <li className="breadcrumb-item">
//                                 <Link to={'/'}>
//                                     <i className="fa fa-dashboard"></i>
//                                 </Link>
//                             </li>
//                             <li className="breadcrumb-item">
//                                 <Link to={'/super-admin/challenges-entries'} className="text-decoration-none">Challenges Applications</Link>
//                             </li>
//                             <li className="breadcrumb-item">Update Application</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             {/* Application Details */}
//             <div className="row clearfix">
//                 <div className="col-lg-12">
//                     <div className="card">
//                         <div className="body">
//                             <form onSubmit={handleFormSubmit}>

//                                 {/* Full Name and Email */}
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label>Full Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Enter full name"
//                                             name="fullName"
//                                             value={formData.fullName}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 form-group">
//                                         <label>Email ID</label>
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             placeholder="Enter email"
//                                             name="email"
//                                             value={formData.email}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Contact Number and User name */}
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label>Contact Number</label>
//                                         <input
//                                             type="tel"
//                                             className="form-control"
//                                             name="contactNumber"
//                                             value={formData.contactNumber}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 form-group">
//                                         <label>Artist User Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="userName"
//                                             value={formData.userName}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Challenge theme and Category */}
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label>Challenge Theme</label>
//                                         <input
//                                             type="tel"
//                                             className="form-control"
//                                             name="challenge"
//                                             value={formData.challenge}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 form-group">
//                                         <label>Category</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="category"
//                                             value={formData.category}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Description */}
//                                 <div className="form-group">
//                                     <label>Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleInputChange}
//                                         rows={4}
//                                         required
//                                     />
//                                 </div>

//                                 {/* Works */}
//                                 <div>
//                                     <label>Artist Works</label>
//                                     {application?.work && (
//                                         <div className="mb-2">
//                                             <a href={application?.work}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="btn btn-sm btn-outline-primary"
//                                             >
//                                                 View Works
//                                             </a>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         name="works"
//                                         accept=".pdf,.doc,.docx"
//                                         onChange={handleWorksChange}
//                                     />
//                                 </div>

//                                 {/* Terms & Conditions */}
//                                 <div className="form-group form-check my-4">
//                                     <input
//                                         type="checkbox"
//                                         name="guidelines"
//                                         className="form-check-input"
//                                         onChange={handleInputChange}
//                                         checked={formData.guidelines}
//                                         required
//                                     />
//                                     <label className="form-check-label">
//                                         I agree to the challenge rules & community guidelines.
//                                     </label>
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     className="btn btn-block btn-success mt-2"
//                                     disabled={loading}
//                                 >
//                                     {loading ? "Updating Application" : "Update Application"}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UpdateChallengeApplication;
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import putAPI from "../../../../../api/putAPI";
import getAPI from "../../../../../api/getAPI";
import { toast } from "react-toastify";

function UpdateChallengeApplication() {
  const { id } = useParams(); // Get the application ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    userName: "",
    description: "",
    guidelines: false,
    challenge: "",
    category: "",
  });

  const [works, setWorks] = useState(null);
  const [bannerFile, setBannerFile] = useState(null); // New file to upload
  const [existingBanner, setExistingBanner] = useState(null); // Existing banner URL
  const [loading, setLoading] = useState(false);

  // Fetch application on component mount
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getAPI(`/api/challenge-applications/applications/${id}`);
        if (response.hasError === false) {
          const app = response.data;
          setFormData({
            fullName: app.fullName || "",
            email: app.email || "",
            contactNumber: app.contactNumber || "",
            userName: app.artistUsername || "",
            description: app.description || "",
            guidelines: app.guidelines || false,
            challenge: app.challenge || "",
            category: app.category || "",
          });
          setExistingBanner(app.bannerImage || null);
        } else {
          toast.error("Failed to fetch application data");
        }
      } catch (error) {
        console.log("Error fetching application:", error);
      }
    };

    fetchApplication();
  }, [id]);

  const handleInputChange = (e) => {
    const { value, name, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWorksChange = (e) => setWorks(e.target.files[0]);
  const handleBannerChange = (e) => setBannerFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("contactNumber", formData.contactNumber);
    data.append("userName", formData.userName);
    data.append("challengeName", formData.challenge);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("guidelines", formData.guidelines);

    if (works) data.append("works", works);
    if (bannerFile) data.append("bannerImage", bannerFile);

    try {
      const response = await putAPI(
        `/api/challenges/update-application/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.hasError === false) {
        toast.success("Application updated successfully");
        navigate("/super-admin/challenges-entries");
      } else {
        toast.error("Failed to update application");
        console.log(response);
      }
    } catch (error) {
      console.log("Error updating application:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="block-header">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6">
            <h2>Update Application</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}><i className="fa fa-dashboard"></i></Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={"/super-admin/challenges-entries"} className="text-decoration-none">
                  Challenges Applications
                </Link>
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
                      name="fullName"
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
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Contact Number and Username */}
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
                    <label>Artist User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Challenge theme and Category */}
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Challenge Theme</label>
                    <input
                      type="text"
                      className="form-control"
                      name="challenge"
                      value={formData.challenge}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                {/* Banner Image */}
                <div className="form-group mb-3">
                  <label>Banner Image</label>
                  {existingBanner && !bannerFile && (
                    <div className="mb-2">
                      <img src={existingBanner} alt="Banner" style={{ width: "200px" }} />
                    </div>
                  )}
                  <input
                    type="file"
                    name="bannerImage"
                    accept="image/*"
                    onChange={handleBannerChange}
                  />
                </div>

                {/* Works */}
                <div className="form-group mb-3">
                  <label>Artist Works</label>
                  {formData.work && (
                    <div className="mb-2">
                      <a
                        href={formData.work}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Works
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    name="works"
                    accept=".pdf,.doc,.docx"
                    onChange={handleWorksChange}
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="form-group form-check my-4">
                  <input
                    type="checkbox"
                    name="guidelines"
                    className="form-check-input"
                    onChange={handleInputChange}
                    checked={formData.guidelines}
                    required
                  />
                  <label className="form-check-label">
                    I agree to the challenge rules & community guidelines.
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
  );
}

export default UpdateChallengeApplication;
