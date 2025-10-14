




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
    return <p className="text-center my-10">Loading Contact Us...</p>;
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
                  type="tel"
                  name="contactNumber"
                  placeholder="Type your Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
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
