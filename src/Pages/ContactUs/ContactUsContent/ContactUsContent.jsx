




import React, { useState, useEffect } from "react";
import { MdHeadsetMic } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../api/getAPI";
import axiosInstance from "../../../api/axiosConfig";

const ContactUsContent = () => {
  const [pageData, setPageData] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    category: "",
    message: "",
  });
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await getAPI("/api/contactus/published");
        if (!response.hasError && response.data.success) {
          setPageData(response.data.data);
        } else {
          toast.error("Failed to load Contact Us page");
        }
      } catch (err) {
        toast.error("Error fetching Contact Us page");
      }
    };
    fetchPage();
  }, []);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getAPI("/api/main-category", true);
        if (!response.hasError) {
          setMainCategories(response.data.data);
        } else {
          toast.error(`Failed to fetch Main Categories: ${response.message}`);
        }
      } catch (error) {
        toast.error("Error fetching Main Categories.");
      }
    };
    fetchMainCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/enquiry/create", formData);
      if (response.data.success) {
        toast.success("Enquiry submitted successfully!");
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          category: "",
          message: "",
        });
      } else {
        toast.error(response.data.message || "Failed to submit enquiry.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit enquiry.");
    }
  };

  if (!pageData) {
    return <p className="text-center my-10">{ContactPageSkeleton()}</p>;
  }

  return (
    <div className="max-w-[1440px] mx-auto my-5 px-3">
     
      <h1 className="text-lg md:text-4xl font-bold text-center text-orange-500">
        {pageData.webpageHeading}
      </h1>

      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-base text-center font-medium text-black leading-relaxed">
        {pageData.webpageDescription}
      </p>

      {pageData.cards?.length > 0 && (
        <div className="my-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3">
          {pageData.cards.map((card, index) => (
            <div
              key={index}
              className="w-full mx-auto border rounded-2xl shadow-2xl p-3 text-center"
            >
              <p className="text-xl font-semibold text-dark mb-2">{card.cardHeading}</p>
              {card.cardDescription && (
                <p
                  className="text-lg text-dark"
                  style={{ whiteSpace: "pre-line" }} 
                >
                  {card.cardDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
      
        <div className="flex flex-col items-center justify-start space-y-6 justify-content-center">
       
          <div className="grid grid-cols-4 md:grid-cols-4 gap-6 mt-3">
            <div className="max-w-[100px] text-7xl content-center rounded-full rounded-br-none bg-[#EAE9E9] p-3 justify-self-center">
              <aside className="rounded-xl filter-sidebar text-[#E56500] content-center bg-transparent justify-items-center">
                <MdHeadsetMic />
              </aside>
            </div>
            <div className="col-span-3 content-center">
              <h1 className="text-sm md:text-xl font-bold text-orange-500">Chat with Live!</h1>
              <hr className="my-1 border-dark" />
              <p className="mt-3 text-xs font-medium text-black leading-relaxed">
                {pageData.chatDescription ||
                  "Have a question about a product, need help with your order, or just want to say hello? Reach out and our team will get back to you within 24 hours."}
              </p>
            </div>
          </div>

          <img
            src={
              pageData.bannerImage
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${pageData.bannerImage}`
                : "/herosectionimg/Contact us.svg"
            }
            alt="Contact Banner"
            className="rounded-xl filter-sidebar content-center justify-items-center"
          />
        </div>

        <main className="content-center">
          <div className="border rounded-lg p-4 shadow">
            <h1 className="text-sm md:text-xl font-bold text-orange-500 text-center">
              Reach & Get In Touch <br /> With Us!
            </h1>
            <hr className="my-3 border-dark" />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="py-2">
                <label className="block font-semibold text-gray-800 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Type your Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                  required
                />
              </div>

              <div className="py-2">
                <label className="block font-semibold text-gray-800 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Type your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                  required
                />
              </div>

              <div className="py-2">
                <label className="block font-semibold text-gray-800 mb-1">Contact Number</label>
                <input
  type="text"
  name="contactNumber"
  placeholder="Type your Contact Number"
  value={formData.contactNumber}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      handleChange(e); 
    }
  }}
  maxLength={10}   
  className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
  required
/>

              </div>

              <div className="py-2">
                <label className="block font-semibold text-gray-800 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2 bg-transparent"
                  required
                >
                  <option value="">Choose your Category</option>
                  {mainCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.mainCategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="py-2">
                <label className="block font-semibold text-gray-800 mb-1">Message</label>
                <textarea
                  name="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                  required
                />
              </div>

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
        </main>
      </div>
    </div>
  );
};
export default ContactUsContent;

const ContactPageSkeleton = () => {
  return (
    <div className="max-w-[1440px] mx-auto my-5 px-3 animate-pulse">

      {/* PAGE HEADING */}
      <div className="mx-auto text-center mt-2">
        <div className="h-7 md:h-10 w-60 md:w-96 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-[1px] bg-gray-300 my-3"></div>
      </div>

      {/* PAGE DESCRIPTION */}
      <div className="text-center">
        <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6 mx-auto mt-2"></div>
      </div>

      {/* CARDS SECTION */}
      <div className="my-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full border rounded-2xl shadow-2xl p-3 text-center bg-gray-100"
          >
            <div className="h-6 bg-gray-300 w-32 mx-auto rounded mb-3"></div>
            <div className="h-4 bg-gray-300 w-full rounded mb-2"></div>
            <div className="h-4 bg-gray-300 w-5/6 mx-auto rounded mb-2"></div>
            <div className="h-4 bg-gray-300 w-4/6 mx-auto rounded"></div>
          </div>
        ))}
      </div>

      {/* MAIN GRID LEFT + RIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">

        {/* LEFT SECTION */}
        <div className="flex flex-col items-center space-y-6">

          {/* ICON + TEXT BLOCK */}
          <div className="grid grid-cols-4 gap-6 w-full mt-3">
            {/* Icon Circle */}
            <div className="max-w-[100px] text-7xl rounded-full bg-gray-300 p-3 justify-self-center"></div>

            {/* Text Right */}
            <div className="col-span-3">
              <div className="h-6 bg-gray-300 w-44 rounded"></div>
              <div className="w-full h-[1px] bg-gray-300 my-2"></div>

              <div className="space-y-2">
                <div className="h-4 bg-gray-300 w-full rounded"></div>
                <div className="h-4 bg-gray-300 w-5/6 rounded"></div>
                <div className="h-4 bg-gray-300 w-4/6 rounded"></div>
              </div>
            </div>
          </div>

          {/* IMAGE SKELETON */}
          <div className="w-full h-56 bg-gray-300 rounded-xl"></div>
        </div>

        {/* RIGHT --- CONTACT FORM */}
        <main className="content-center">
          <div className="border rounded-lg p-4 shadow bg-gray-100">

            {/* Form Heading */}
            <div className="text-center">
              <div className="h-6 bg-gray-300 w-40 md:w-64 mx-auto rounded"></div>
              <div className="w-full h-[1px] bg-gray-300 my-3"></div>
            </div>

            <div className="space-y-6">

              {/* Name */}
              <div>
                <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-8 bg-gray-300 rounded"></div>
              </div>

              {/* Email */}
              <div>
                <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-8 bg-gray-300 rounded"></div>
              </div>

              {/* Contact */}
              <div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-8 bg-gray-300 rounded"></div>
              </div>

              {/* Category */}
              <div>
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-8 bg-gray-300 rounded"></div>
              </div>

              {/* Message */}
              <div>
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-20 bg-gray-300 rounded"></div>
              </div>

              {/* Submit Button */}
              <div className="text-center py-3">
                <div className="h-9 w-32 mx-auto bg-gray-300 rounded-full"></div>
              </div>

            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

