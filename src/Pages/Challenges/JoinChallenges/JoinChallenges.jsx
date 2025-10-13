<<<<<<< HEAD
import React, { useState } from "react";
import { IoCloudUpload } from "react-icons/io5";

const JoinChallenges = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-4">
=======
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
      const response = await postAPI("/api/join-challenge", formData)

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

>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
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
<<<<<<< HEAD
=======

        {/* Challenge details */}
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
        <div className="md:p-4 content-center">
          <div className="max-w-3xl text-[#48372D] space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Theme</h2>
<<<<<<< HEAD
              <p className="mt-1">Celebrate the Spirit of Diwali Through Art</p>
=======
              <p className="mt-1">{challengeDetails?.title || "Challenge Title"}</p>
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            </div>

            <div>
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="mt-1">
<<<<<<< HEAD
                Artists are invited to express the joy, lights, and festive
                spirit of Diwali through their unique style — whether it&apos;s
                painting, digital art, illustration, or photography. Show how
                you see the festival of lights!
=======
                {challengeDetails?.description || "Challenge description"}
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Submission Deadline</h2>
<<<<<<< HEAD
              <p className="mt-1">25th October 2025</p>
=======
              <p className="mt-1">
                {challengeDetails?.submissionDeadline ? format(new Date(challengeDetails.submissionDeadline), "do MMMM, yyyy") : "N/A"}
              </p>
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            </div>

            <div>
              <h2 className="text-2xl font-bold">Entry Charges</h2>
<<<<<<< HEAD
              <p className="mt-1">₹199 / $5 (per artwork submission)</p>
=======
              <p className="mt-1">{challengeDetails?.entryFee || "Entry fees"}</p>
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            </div>

            <div>
              <h2 className="text-2xl font-bold">Prizes</h2>
              <p className="mt-1">
<<<<<<< HEAD
                Featured spot on ArtSays, social media shoutouts, and a digital
                certificate.
=======
                {challengeDetails?.prizeDetails || "Prize details"}
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Eligibility</h2>
              <p className="mt-1">
<<<<<<< HEAD
                Open to all registered ArtSays creators worldwide.
=======
                {challengeDetails?.judgingCriteria || "Eligibility criteria"}
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Rules</h2>
<<<<<<< HEAD
              <ul className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Stick to the Diwali theme (lights, diyas, rangoli, joy,
                  family, celebration).
                </li>
                <li>
                  Submit original artwork only (no plagiarism or AI-generated
                  art).
                </li>
                <li>
                  Any medium is allowed (digital, traditional, photography,
                  mixed media).
                </li>
                <li>Add a caption/description for context.</li>
                <li>Keep it festive & respectful to culture.</li>
              </ul>
            </div>
          </div>
        </div>
=======
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
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
        <div className="justify-center items-center border !border-[#48372D] !border-t-[20px] rounded-2xl p-4 md:!p-5">
          <h1 className="text-2xl md:text-4xl font-bold text-[#48372D] text-center">
            Apply Now
          </h1>
          <p className="text-center text-md py-2">
            Apply As you want to join Artsays!
          </p>
          <br />
<<<<<<< HEAD
          <form action="#" method="POST" class="space-y-6">
=======
          <form class="space-y-6" onSubmit={handleSubmitApplication}>

>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            {/* <!-- Name --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">Name</label>
              <input
                type="text"
                placeholder="Type your Full name"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
<<<<<<< HEAD
=======
                name="fullName"
                value={applicationData.fullName}
                onChange={handleApplicationData}
                required
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
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
<<<<<<< HEAD
=======
                name="email"
                value={applicationData.email}
                onChange={handleApplicationData}
                required
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
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
<<<<<<< HEAD
=======
                name="contactNumber"
                value={applicationData.contactNumber}
                onChange={handleApplicationData}
                required
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
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
<<<<<<< HEAD
=======
                name="userName"
                value={applicationData.userName}
                onChange={handleApplicationData}
                required
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
              />
            </div>

            {/* <!-- Category --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Category
              </label>
<<<<<<< HEAD
              <select class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2 bg-transparent">
                <option>Choose your Category</option>
                <option>Painting</option>
                <option>Mandala</option>
                <option>Senior Devloper</option>
              </select>
            </div>

=======
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

>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            {/* <!-- Description of your Entry --> */}
            <div className="py-2">
              <label class="block font-semibold text-gray-800 mb-1">
                Description of your Entry
              </label>
              <textarea
                placeholder="Short Description of your Entry"
                class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
<<<<<<< HEAD
              ></textarea>
=======
                name="description"
                value={applicationData.description}
                onChange={handleApplicationData}
                required
              />
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            </div>

            {/* Upload Challenge Artwork */}
            <div className="py-2">
              <label className="block font-semibold text-gray-800 mb-1">
                Upload Challenge Artwork
              </label>
<<<<<<< HEAD
              <div className="w-full border-b border-gray-300 py-6 text-center text-gray-500">
=======

              {/* <label className="w-full border-b border-gray-300 py-6 text-center text-gray-500" htmlFor="work-upload">
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
                Drag photos and videos here
                <br />
                <span className="flex align-items-center justify-center text-blue-600 mt-3 cursor-pointer">
                  Browse <IoCloudUpload className="ml-2 color-dark" />
<<<<<<< HEAD
                </span>{" "}
              </div>
=======
                </span>
              </label> */}

              <input type="file" accept=".pdf,.doc,.docx" onChange={handleWorkFile} />

>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
            </div>

            {/* Checkbox */}
            <div className="flex items-center py-2">
<<<<<<< HEAD
              <input type="checkbox" className="mr-2" id="rules" />
=======
              <input
                type="checkbox"
                className="mr-2"
                id="rules"
                name="guidelines"
                value={applicationData.guidelines}
                onChange={handleApplicationData}
                required
              />
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
              <label htmlFor="rules" className="text-sm text-gray-700 mb-0">
                I agree to the challenge rules & community guidelines.
              </label>
            </div>

            {/* <!-- Submit --> */}
<<<<<<< HEAD
            <div class="text-center py-2">
=======
            <div class="text-center py-2" type="submit">
>>>>>>> 295168fa465d90b112a64d9087dfe678537dbcd5
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
