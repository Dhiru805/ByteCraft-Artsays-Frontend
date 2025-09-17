import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import { MdHeadsetMic } from "react-icons/md";

const ContactUsContent = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto my-5">
      {/* title */}
      <h1 className="text-lg md:text-4xl font-bold text-center text-orange-500 px-3">
        Contact Us
      </h1>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-base text-center font-medium text-black leading-relaxed px-3">
        Have a question about a product, need help with your order, or just want
        to say hello? <br /> Reach out and our team will get back to you within
        24 hours.
      </p>

      <div className="my-5">
        <main className="md:col-span-3 px-3">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3">
            {/* <!-- Product Card --> */}

            <div className="w-full mx-auto border rounded-2xl shadow-2xl">
              <p className="flex text-lg text-dark font-semibold mt-1 p-3 pb-0 text-center align-items-center justify-center">
                <FaLocationDot className="mr-2" /> Visit Us At
              </p>
              <p className="text-lg text-dark font-semibold mt-1 p-3 text-center">
                Hinjewadi Phase 1 - PCMC <br /> Pune - India
              </p>
            </div>

            <div className="w-full mx-auto border rounded-2xl shadow-2xl">
              <p className="flex text-lg text-dark font-semibold mt-1 p-3 pb-0 text-center align-items-center justify-center">
                <PiPhoneCallFill className="mr-2" /> Call Us On
              </p>
              <p className="text-lg text-dark font-semibold mt-1 p-3 text-center">
                +91 8668 36 7265
              </p>
            </div>

            <div className="w-full mx-auto border rounded-2xl shadow-2xl">
              <p className="flex text-lg text-dark font-semibold mt-1 p-3 pb-0 text-center align-items-center justify-center">
                <IoIosMail className="mr-2" /> Mail us at
              </p>
              <p className="text-lg text-dark font-semibold mt-1 p-3 text-center">
                contact@artsays.in <br /> sales@artsays.in
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 sm:px-6 my-5">
        <div className="content-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
            <div className="max-w-[100px] text-7xl content-center rounded-full rounded-br-none bg-[#EAE9E9] p-3 justify-self-center">
              <aside className="rounded-xl filter-sidebar text-[#E56500] content-center bg-transparent justify-items-center">
                <MdHeadsetMic />
              </aside>
            </div>
            <div className="md:col-span-3 content-center">
              <h1 className="text-sm md:text-xl font-bold text-orange-500">
                Chat with Live!
              </h1>
              <hr className="my-1 border-dark" />
              <p className="mt-3 text-xs font-medium text-black leading-relaxed">
                Have a question about a product, need help with your order, or
                just want to say hello? Reach out and our team will get back to
                you within 24 hours.
              </p>
            </div>
          </div>
          <aside className="rounded-xl filter-sidebar content-center justify-items-center">
            <img src="/herosectionimg/Contact us.svg" alt="" />
          </aside>
        </div>

        <main className="content-center">
          <div className="border rounded-lg p-4">
            <h1 className="text-sm md:text-xl font-bold text-orange-500 text-center">
              Reach & Get In Touch <br /> With Us!
            </h1>
            <hr className="my-3 border-dark" />

            <form action="#" method="POST" class="space-y-6">
              {/* <!-- Name --> */}
              <div className="py-2">
                <label class="block font-semibold text-gray-800 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Type your Full name"
                  class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
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
                  class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
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
                  class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                />
              </div>

              {/* <!-- Category --> */}
              <div className="py-2">
                <label class="block font-semibold text-gray-800 mb-1">
                  Category
                </label>
                <select class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2 bg-transparent">
                  <option>Choose your Category</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Feedback</option>
                </select>
              </div>

              {/* <!-- Message --> */}
              <div className="py-2">
                <label class="block font-semibold text-gray-800 mb-1">
                  Message
                </label>
                <textarea
                  placeholder="Enter your message"
                  class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                ></textarea>
              </div>

              {/* <!-- Submit --> */}
              <div class="text-center py-2">
                <button className="flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
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
