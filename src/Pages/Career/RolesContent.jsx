import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getAPI from "../../api/getAPI";
import "./RolesContent.css";
import postAPI from "../../api/postAPI";
import { toast } from "react-toastify";

function LifeAtArtsays() {

  const { slug } = useParams()
  const jobId = slug.split("-").pop()

  const [jobData, setJobData] = useState({})
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    jobPosition: jobData?.jobTitle,
    coverLetter: "",
    condition: false,
    jobId: jobId
  })
  const [resume, setResume] = useState(null)
  const [message, setMessage] = useState("")


  const fetchCareersById = async () => {
    try {
      const response = await getAPI(`/api/get-career/${jobId}`);

      if (response?.data) {
        setJobData(response.data.data)
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (jobId) fetchCareersById();
  }, [jobId]);

  useEffect(() => {
    if (jobData?.jobTitle) {
      setFormData(prev => ({ ...prev, jobPosition: jobData.jobTitle }))
    }
  }, [jobData?.jobTitle])

  const handleFormData = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleResume = (e) => {
    setResume(e.target.files[0])
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.jobPosition || !formData.coverLetter) {
      setMessage("Please fill all required fields.")
      return;
    }

    try {
      const submissionData = new FormData()
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key])
      })
      if (resume) {
        submissionData.append("resume", resume)
      }

      const response = await postAPI("/api/apply-career-job", submissionData)

      if (response?.data?.hasError === false) {
        toast.success(response.data.message)
        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          jobPosition: "",
          coverLetter: "",
          condition: false,
          jobId: jobId
        })
        setResume(null)
        setMessage("")
      }
      else {
        toast.error("Something went wrong, Try again")
        setMessage("Something went wrong. Try again")
      }
    }
    catch (error) {
      console.error("Error submitting application: ", error)
      setMessage("Failed to submit application")
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
       
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="#" className="hover:text-red-500">
              Home
            </a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">
              Store
            </a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">
              Paintings
            </a>
            <span>/</span>
            <span className="font-medium text-gray-900">Abstract</span>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        {/* title */}
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {jobData?.jobTitle || 'Job Title'}
        </h1>
      </div>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        At Artsays, we’re more than just a team — we’re a creative family. Every
        day, we celebrate imagination, innovation, and inclusivity. Whether
        you’re coding a new feature, designing a fresh interface, or
        brainstorming the next big art challenge, you’ll find yourself
        surrounded by people who truly believe in the power of art.
      </p>

      <div className="my-5">
        <main className="md:col-span-3 px-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className=" md:col-span-3 mx-auto border !border-[#48372D] !border-l-[20px] rounded-2xl p-4 md:!p-5">
              <p className="text-sm md:text-lg">{jobData ? jobData.category : 'Job Category'}</p>
              <h2 className="text-lg sm:text-4xl text-dark font-bold mt-1">
                {jobData?.jobTitle || 'Job Title'}
              </h2>

              <div className="my-4">
                <h6 className="font-semibold text-[20px] text-[#48372D]">About the Role</h6>
                <p>{jobData?.summary || 'Job Summary'}</p>
              </div>

              {jobData?.rolesResponsibilities && (
                <div dangerouslySetInnerHTML={{ __html: jobData.rolesResponsibilities }} className="jobRoles-text">

                </div>
              )}

            </div>

            {/* Application Form */}
            <div className="md:col-span-2 justify-center items-center border !border-[#48372D] !border-t-[20px] rounded-2xl p-4 md:!p-5">
              <h1 className="text-2xl md:text-4xl font-bold text-[#48372D] text-center">
                Apply Now
              </h1>
              <p className="text-center text-md py-2">Apply As you want to join Artsays!</p>

              {message && <p className="text-center text-red-500">{message}</p>}

              <form className="space-y-6" onSubmit={handleFormSubmit}>

                {/* Full Name */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Type your Full name"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormData}
                    required
                  />
                </div>

                {/* Email */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Type your Email Address"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                    name="email"
                    value={formData.email}
                    onChange={handleFormData}
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="Type your Contact Number"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleFormData}
                    required
                  />
                </div>

                {/* Job Positions */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">Job Positions</label>
                  <input
                    className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2 bg-transparent"
                    name="jobPosition"
                    value={jobData?.jobTitle}
                    onChange={handleFormData}
                    disabled
                  />
                </div>

                {/* Cover Letter */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">Cover Letter</label>
                  <textarea
                    placeholder="Short description of your entry"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleFormData}
                  ></textarea>
                </div>

                {/* Upload Resume */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">Upload Resume</label>
                  {/* <div className="w-full border-b border-gray-300 py-6 text-center text-gray-500">
                    Drag photos and videos here
                    <br />
                    <span className="flex align-items-center justify-center text-blue-600 mt-3 cursor-pointer">
                      Browse <IoCloudUpload className="ml-2 color-dark" />
                    </span>{" "}

                  </div> */}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResume} />
                  {resume && <p className="text-sm text-green-600 mt-1">{resume.name}</p>}
                </div>

                {/* Checkbox */}
                <div className="flex items-center py-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    id="rules"
                    name="condition"
                    value={formData.condition}
                    onChange={handleFormData}
                    required
                    checked={formData.condition}
                  />
                  <label htmlFor="rules" className="text-sm text-gray-700 mb-0">
                    By using this form you agree with the storage and handling of your data.
                  </label>
                </div>

                {/* Submit */}
                <div className="text-center py-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  )

}
export default LifeAtArtsays;