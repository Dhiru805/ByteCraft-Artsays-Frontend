import React, { useState } from "react";
import { IoCloudUpload } from "react-icons/io5";


const LifeAtArtsays = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
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
          UI/UX Designer
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
              <p className="text-sm md:text-lg">Internship</p>
              <h2 className="text-lg sm:text-4xl text-dark font-bold mt-1">
                UI/UX Designer
              </h2>
              <p>
                React.JS Internship Opportunity at ByteCraft Studio
                <br />
                Position: Intern (React.js Developer)
                <br />
                Duration: 6 months
                <br />
                Internship Contract: Based on the chosen track.
                <br />
                We are offering an exciting internship opportunity with the
                potential for permanent employment based on performance. Our
                internship program has two tracks, allowing applicants to choose
                the one that best suits their career goals:
                <br />
                Track 1: Performance-Based Incentive Track
                <br />
                – Duration: 6 months
                <br />
                – Incentives:
                <br />
                — First 3 months: Unpaid
                <br />
                — After 3 months: Performance evaluated, with potential
                incentives for the remaining 3 months
                <br />
                — If performance does not meet standards, the internship may be
                terminated after 3 months
                <br />
                – Post-Internship: Successful completion with satisfactory
                performance may lead to a permanent position.
                <br />
                Track 2: No-Incentive Track
                <br />
                – Duration: 6 months
                <br />
                – Incentives: Entire internship is unpaid
                <br />
                – Post-Internship: Performance evaluated at the end of the
                6-month period, with potential for a permanent position and
                competitive payment package.
                <br />
                Position Requirements
                <br />
                React.js Developer – 10 Vacancies
                <br />
                – Proficiency in React.js and its core principles
                <br />
                – Experience with popular React.js workflows (such as Redux)
                <br />
                – Familiarity with RESTful APIs and modern front-end build
                pipelines and tools
                <br />
                – Understanding of front-end technologies, including HTML, CSS,
                and JavaScript
                <br />
                – Strong problem-solving skills and a proactive approach to
                learning
                <br />
                General Requirements for All Positions
                <br />
                – Currently pursuing or recently completed a degree in a
                relevant field
                <br />
                – Strong willingness to learn and adapt
                <br />
                – Excellent communication and teamwork skills
                <br />
                – Ability to work independently and meet deadlines
                <br />
                Benefits
                <br />
                – Gain hands-on experience in a dynamic work environment
                <br />
                – Mentorship and guidance from experienced professionals
                <br />
                – Opportunity to work on live projects, providing real-world
                experience
                <br />
                – Potential for permanent employment based on performance
                <br />
                We look forward to welcoming motivated and talented individuals
                to ByteCraft Studios!
              </p>
            </div>

            <div className="md:col-span-2 justify-center items-center border !border-[#48372D] !border-t-[20px] rounded-2xl p-4 md:!p-5">
              <h1 className="text-2xl md:text-4xl font-bold text-[#48372D] text-center">
                Apply Now
              </h1>
              <p className="text-center text-md py-2">Apply As you want to join Artsays!</p>
              <br />
              <form action="#" method="POST" class="space-y-6">
                {/* <!-- Name --> */}
                <div className="py-2">
                  <label class="block font-semibold text-gray-800 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Type your Full name"
                    class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
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
                  />
                </div>

                {/* <!-- Job Positions --> */}
                <div className="py-2">
                  <label class="block font-semibold text-gray-800 mb-1">
                    Job Positions
                  </label>
                  <select class="w-full border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2 bg-transparent">
                    <option>Choose your Job Positions</option>
                    <option>Internship</option>
                    <option>Ui/UX Designer</option>
                    <option>Senior Devloper</option>
                  </select>
                </div>

                {/* <!-- Description of your Entry --> */}
                <div className="py-2">
                  <label class="block font-semibold text-gray-800 mb-1">
                    Description of your Entry
                  </label>
                  <textarea
                    placeholder="Short Description of your Entry"
                    class="w-full bg-transparent border-b border-gray-300 focus:border-[#E56500] focus:outline-none py-2"
                  ></textarea>
                </div>

                {/* Upload Resume */}
                <div className="py-2">
                  <label className="block font-semibold text-gray-800 mb-1">
                    Upload Resume
                  </label>
                  <div className="w-full border-b border-gray-300 py-6 text-center text-gray-500">
                    Drag photos and videos here
                    <br />
                    <span className="flex align-items-center justify-center text-blue-600 mt-3 cursor-pointer">
                      Browse <IoCloudUpload className="ml-2 color-dark" />
                    </span>{" "}
                    
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center py-2">
                  <input type="checkbox" className="mr-2" id="rules" />
                  <label htmlFor="rules" className="text-sm text-gray-700 mb-0">
                    I agree to the challenge rules & community guidelines.
                  </label>
                </div>

                {/* <!-- Submit --> */}
                <div class="text-center py-2">
                  <button className="flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default LifeAtArtsays;
