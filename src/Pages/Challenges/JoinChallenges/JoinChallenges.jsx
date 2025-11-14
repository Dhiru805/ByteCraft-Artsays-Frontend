import { useEffect, useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import postAPI from "../../../api/postAPI";
import "./JoinChallenges.css";
import getAPI from "../../../api/getAPI";

const JoinChallenges = () => {

  const location = useLocation()
  const challengeDetails = location?.state;

  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    userName: "",
    category: "",
    challengeName: challengeDetails?.title || "",
    description: "",
    guidelines: false
  })
  const [works, setWorks] = useState(null)
  const [categories, setCategories] = useState()

  const handleApplicationData = (e) => {
    const { value, name, type, checked } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: type === "checkbox" ? checked : value
    })
  };

  const handleWorkFile = (e) => {
    e.preventDefault()
    setWorks(e.target.files[0])
  };

  const fetchCategories = async () => {
    try {
      const response = await getAPI("/api/main-category")

      if (response?.hasError === false) {
        setCategories(response.data.data)
      }
      else {
        console.log(response)
      }
    }
    catch (error) {
      console.log("Error while fetching categories", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, []);

  const handleSubmitApplication = async (e) => {
    e.preventDefault()

    if (!works) {
      toast.warning("Please upload your work")
      return;
    }

    const formData = new FormData()
    formData.append("fullName", applicationData.fullName)
    formData.append("email", applicationData.email)
    formData.append("contactNumber", applicationData.contactNumber)
    formData.append("userName", applicationData.userName)
    formData.append("category", applicationData.category)
    formData.append("challengeName", applicationData.challengeName)
    formData.append("description", applicationData.description)
    formData.append("guidelines", applicationData.guidelines)
    formData.append("works", works)

    try {
      const response = await postAPI("/api/join-challenge", formData, {}, false)

      if (response?.hasError === false) {
        toast.success(response?.message)
        setApplicationData({
          fullName: "",
          email: "",
          contactNumber: "",
          userName: "",
          category: "",
          challengeName: challengeDetails?.title || "",
          description: "",
          guidelines: false
        })
        setWorks(null)
      }
      else {
        console.log(response)
      }
    }
    catch (error) {
      console.error("Error submiting application: ", error)
    }
  }

  return (
    <div className="mb-4">

      <div>
        {/* Top Section: Breadcrumb + Search */}
        <div className="w-full py-3 px-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumb */}
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
            Join Challenges
          </h1>
        </div>

        <hr className="my-3 border-dark" />

        {/* Subtitle */}
        <p className="mt-3 text-xs md:text-base font-medium text-dark leading-relaxed px-3">
          At ArtSays, we make it simple for you to collaborate directly with
          talented artists and bring your creative vision to life. Commissioning
          custom artwork is a personalized process designed to give you a unique
          piece that reflects your ideas, style, and story.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Challenge details */}
        <div className="md:p-4 content-center">
          <div className="max-w-3xl text-[#48372D] space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Theme</h2>
              <p className="mt-1">{challengeDetails?.title || "Challenge Title"}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="mt-1">
                {challengeDetails?.description || "Challenge description"}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Submission Deadline</h2>
              <p className="mt-1">
                {challengeDetails?.submissionDeadline ? format(new Date(challengeDetails.submissionDeadline), "do MMMM, yyyy") : "N/A"}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Entry Charges</h2>
              <p className="mt-1">{challengeDetails?.entryFee || "Entry fees"}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Prizes</h2>
              <p className="mt-1">
                {challengeDetails?.prizeDetails || "Prize details"}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Eligibility</h2>
              <p className="mt-1">
                {challengeDetails?.judgingCriteria || "Eligibility criteria"}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Rules</h2>
              {challengeDetails && (
                <div
                  dangerouslySetInnerHTML={{ __html: challengeDetails.rules }}
                  className="rules-text"
                />
              )}

            </div>
          </div>
        </div>

        {/* Application details */}
        <div className="justify-center items-center border !border-[#48372D] !border-t-[20px] rounded-2xl p-4 md:!p-5">
          <h1 className="text-2xl md:text-4xl font-bold text-[#48372D] text-center">
            Apply Now
          </h1>
          <p className="text-center text-md py-2">
            Apply As you want to join Artsays!
          </p>
          <br />
          <form class="space-y-6" onSubmit={handleSubmitApplication}>

            {/* <!-- Name --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">Name</label>
              <input
                type="text"
                placeholder="Type your Full name"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                name="fullName"
                value={applicationData.fullName}
                onChange={handleApplicationData}
                required
              />
            </div>

            {/* <!-- Email --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Type your Email Address"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                name="email"
                value={applicationData.email}
                onChange={handleApplicationData}
                required
              />
            </div>

            {/* <!-- Contact --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="Type your Contact Number"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                name="contactNumber"
                value={applicationData.contactNumber}
                onChange={handleApplicationData}
                required
              />
            </div>

            {/* <!-- Artist Username [Handel] --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Artist Username [Handel]
              </label>
              <input
                type="text"
                placeholder="Type your Full name"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                name="userName"
                value={applicationData.userName}
                onChange={handleApplicationData}
                required
              />
            </div>

            {/* <!-- Category --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Category
              </label>
              <select className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2 bg-transparent"
                onChange={handleApplicationData} value={applicationData.category} name="category">
                <option value="" disabled>Choose your Category</option>
                {categories && categories.map((category, index)=> (
                  <option key={index} value={category.mainCategoryName}>{category.mainCategoryName}</option>
                ))}
              </select>
            </div>

            {/* Challenge Title */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Challenge Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                name="challengeName"
                value={challengeDetails?.title}
                onChange={handleApplicationData}
                disabled
                required
              />
            </div>

            {/* <!-- Description of your Entry --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Description of your Entry
              </label>
              <textarea
                placeholder="Short Description of your Entry"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                name="description"
                value={applicationData.description}
                onChange={handleApplicationData}
                required
              />
            </div>

            {/* Upload Challenge Artwork */}
            <div className="py-2">
              <label className="block font-semibold text-gray-800 mb-1">
                Upload Challenge Artwork
              </label>

              {/* <label className="w-full border-b border-gray-300 py-6 text-center text-gray-500" htmlFor="work-upload">
                Drag photos and videos here
                <br />
                <span className="flex align-items-center justify-center text-blue-600 mt-3 cursor-pointer">
                  Browse <IoCloudUpload className="ml-2 color-dark" />
                </span>
              </label> */}

              <input type="file" accept=".pdf,.doc,.docx" onChange={handleWorkFile} />

            </div>

            {/* Checkbox */}
            <div className="flex items-center py-2">
              <input
                type="checkbox"
                className="mr-2"
                id="rules"
                name="guidelines"
                checked={applicationData.guidelines}
                onChange={handleApplicationData}
                required
              />
              <label htmlFor="rules" className="text-sm text-gray-700 mb-0">
                I agree to the challenge rules & community guidelines.
              </label>
            </div>

            {/* <!-- Submit --> */}
            <div class="text-center py-2" type="submit">
              <button className="flex-1 bg-[#48372D] text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default JoinChallenges;



