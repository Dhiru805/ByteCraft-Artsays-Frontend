import React, { useState, useEffect } from "react";
import { MdHeadsetMic } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../api/getAPI";
import axiosInstance from "../../../api/axiosConfig";
import ContactUsHero from "../ContactUsHero";
import { getImageUrl } from "../../../utils/getImageUrl";

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

  const formValidate = () => {
    let errors = {};

    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Name is required";
      toast.error("Name is required");
      return false;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
      toast.error("Enter a valid email address");
      return false;
    }

    if (
      !formData.contactNumber ||
      !/^[6-9]\d{9}$/.test(formData.contactNumber)
    ) {
      errors.contactNumber = "Enter a valid 10-digit contact number";
      toast.error("Enter a valid 10-digit contact number");
      return false;
    }

    if (!formData.message || formData.message.trim() === "") {
      errors.message = "Message is required";
      toast.error("Message is required");
      return false;
    }

    // Return true if no errors, else false
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValidate()) return;
    try {
      const response = await axiosInstance.post(
        "/api/enquiry/create",
        formData
      );
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
    return <div className="text-center my-10">{ContactPageSkeleton()}</div>;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      <ContactUsHero 
        heading={pageData.webpageHeading} 
        description={pageData.webpageDescription} 
      />

      <div className="w-full max-w-[1440px] mx-auto p-3">
        <div className="flex flex-col lg:flex-row gap-3 mt-3">
          {/* ---------------- SIDEBAR ---------------- */}
          <aside className="w-full lg:w-[300px] shrink-0 space-y-3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Info</h2>
              <p className="text-sm text-gray-500">We're here to help you</p>
            </div>

            {/* Chat Section Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MdHeadsetMic size={18} className="text-[#6F4D34]" />
                Live Support
              </h3>
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {pageData.chatDescription ||
                    "Have a question about a product, need help with your order, or just want to say hello? Reach out and our team will get back to you within 24 hours."}
                </p>
              </div>
            </div>

            {/* Info Cards */}
            {pageData.cards?.length > 0 && (
              <div className="space-y-3">
                {pageData.cards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-up"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6F4D34]" />
                      {card.cardHeading}
                    </h3>
                    <div className="space-y-4">
                      {card.cardDescription && (
                        <p
                          className="text-sm text-gray-600 leading-relaxed"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {card.cardDescription}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Banner Image */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <img
                src={
                  pageData.bannerImage
                    ? getImageUrl(pageData.bannerImage)
                    : "/herosectionimg/Contact us.svg"
                }
                alt="Contact Banner"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </aside>

          {/* ---------------- MAIN CONTENT (FORM) ---------------- */}
          <main className="flex-grow space-y-3">
            {/* Decorative Header (mimicking store's search bar area) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#6F4D34]/5 text-[#6F4D34] rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                    Connect With Us
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    How can we help you today?
                  </h2>
                </div>
                <div className="hidden md:block">
                  <div className="w-12 h-12 rounded-2xl bg-[#6F4D34]/5 flex items-center justify-center">
                    <MdHeadsetMic className="text-[#6F4D34] text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 animate-fade-in">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6F4D34] uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6F4D34] uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6F4D34] uppercase tracking-widest ml-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      placeholder="10-digit number"
                      value={formData.contactNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                          handleChange(e);
                        }
                      }}
                      maxLength={10}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6F4D34] uppercase tracking-widest ml-1">
                      Inquiry Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] focus:outline-none transition-all appearance-none cursor-pointer text-sm font-medium"
                        required
                      >
                        <option value="">Select category</option>
                        {mainCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.mainCategoryName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6F4D34] uppercase tracking-widest ml-1">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="How can we help you? Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium resize-none"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-[200px] h-[56px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm hover:!bg-[#ffffff] border border-gray-100 transform active:scale-95 flex items-center justify-center overflow-hidden relative"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default ContactUsContent;

const ContactPageSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen animate-pulse font-[poppins]">
      {/* Hero Skeleton */}
      <div className="w-full h-[300px] bg-gray-200" />

      <div className="max-w-[1440px] mx-auto p-3">
        <div className="flex flex-col lg:flex-row gap-3 mt-3">
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-[300px] shrink-0 space-y-3">
            <div className="h-24 bg-white rounded-2xl border border-gray-100" />
            <div className="h-40 bg-white rounded-2xl border border-gray-100" />
            <div className="h-40 bg-white rounded-2xl border border-gray-100" />
            <div className="h-64 bg-white rounded-2xl border border-gray-100" />
          </aside>

          {/* Main Skeleton */}
          <main className="flex-grow space-y-3">
            <div className="h-32 bg-white rounded-2xl border border-gray-100" />
            <div className="h-[600px] bg-white rounded-[24px] border border-gray-100 p-8">
              <div className="h-8 bg-gray-100 rounded w-64 mb-8" />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-16 bg-gray-50 rounded-2xl" />
                  <div className="h-16 bg-gray-50 rounded-2xl" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-16 bg-gray-50 rounded-2xl" />
                  <div className="h-16 bg-gray-50 rounded-2xl" />
                </div>
                <div className="h-40 bg-gray-50 rounded-2xl" />
                <div className="h-[56px] bg-gray-100 rounded-2xl w-[200px]" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

