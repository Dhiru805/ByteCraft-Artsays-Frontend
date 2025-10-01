import { useEffect, useState } from "react";
import getAPI from "../../../api/getAPI";
import { useNavigate } from "react-router-dom";

function OpenRoles() {

  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()

  const fetchOpenJobs = async () => {
    try {
      const response = await getAPI('/api/get-career')

      if (response?.data) {
        setJobs(response.data.data)
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchOpenJobs()
  }, []);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  };

  return (
    <div className="max-w-[1440px] mx-auto mb-4 px-3">
      {/* Title Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 items-center">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34]">
          Open Roles
        </h1>
      </div>

      <hr className="my-3 border-gray-400" />

      {/* Subtitle */}
      <p className="mt-3 text-sm md:text-md font-medium text-gray-800 leading-relaxed">
        At Artsays, we’re building more than just a platform — we’re shaping the
        future of how art is shared, discovered, and celebrated. We believe in
        creativity, collaboration, and growth. If you’re passionate about
        design, technology, and empowering artists worldwide, this is your
        place.
      </p>

      {/* Roles Section */}
      <div className="my-5">
        <main>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:!gap-6">

            {jobs.length > 0 ?
              jobs.map((job, index) => (
                <div key={job._id} className="w-full border !border-[#FB5934] !border-t-[20px] rounded-2xl shadow-xl p-2 md:!p-4 hover:shadow-2xl transition">
                  <p className="text-md text-red-500">{job.category}</p>
                  <h2 className="text-gray-900 font-bold mt-1 text-lg sm:text-xl">{job.jobTitle}</h2>
                  <p className="text-sm text-gray-700 font-semibold mt-1">Read Job Description</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {job.summary.length > 150 ? job.summary.substring(0, 140) + '...' : job.summary}
                  </p>
                  <div className="text-center my-3">
                    <button className="bg-[#48372D] text-[#fff] py-2 px-4 rounded-full font-semibold shadow transition
                      hover:bg-[#fff] hover:text-[#48372D] hover:!border border-dark"
                      onClick={() => navigate(`/careers/${slugify(job.jobTitle)}-${job._id}`)}>
                      Apply Now
                    </button>
                  </div>
                </div>
              )) :
              <div className="text-lg font-semibold text-red-500">No open jobs</div>
            }

            {/* Product Card */}

            {/* <div className="w-full border !border-t-[20px] !border-[#FB5934] rounded-2xl shadow-xl p-2 md:!p-4 hover:shadow-2xl transition">
              <p className="text-md text-red-500">Internship</p>
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold mt-1">
                Content Writer
              </h2>
              <p className="text-sm text-gray-700 font-semibold mt-1">
                Read Job Description
              </p>
              <p className="text-sm text-gray-700 mt-2">
                You’ll help craft seamless, user-friendly experiences for
                thousands of artists. Your words will directly shape how people
                connect with Artsays.
              </p>
              <div className="text-center">
                <button className="justify-self-end bg-[#48372D] text-white hover:bg-[#ffffff] hover:!text-[#48372D] hover:!border border-dark py-2 px-4 my-3 rounded-full font-semibold shadow transition">
                  Apply Now
                </button>
              </div>
            </div> */}

            {/* <div className="w-full border !border-t-[20px] !border-[#FB5934] rounded-2xl shadow-xl p-2 md:!p-4 hover:shadow-2xl transition">
              <p className="text-md text-red-500">Internship</p>
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold mt-1">
                Content Writer
              </h2>
              <p className="text-sm text-gray-700 font-semibold mt-1">
                Read Job Description
              </p>
              <p className="text-sm text-gray-700 mt-2">
                You’ll help craft seamless, user-friendly experiences for
                thousands of artists. Your words will directly shape how people
                connect with Artsays.
              </p>
              <div className="text-center">
                <button className="justify-self-end bg-[#48372D] text-white hover:bg-[#ffffff] hover:!text-[#48372D] hover:!border border-dark py-2 px-4 my-3 rounded-full font-semibold shadow transition">
                  Apply Now
                </button>
              </div>
            </div> */}

            {/* <div className="w-full border !border-t-[20px] !border-[#FB5934] rounded-2xl shadow-xl p-2 md:!p-4 hover:shadow-2xl transition">
              <p className="text-md text-red-500">Internship</p>
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold mt-1">
                Content Writer
              </h2>
              <p className="text-sm text-gray-700 font-semibold mt-1">
                Read Job Description
              </p>
              <p className="text-sm text-gray-700 mt-2">
                You’ll help craft seamless, user-friendly experiences for
                thousands of artists. Your words will directly shape how people
                connect with Artsays.
              </p>
              <div className="text-center">
                <button className="justify-self-end bg-[#48372D] text-white hover:bg-[#ffffff] hover:!text-[#48372D] hover:!border border-dark py-2 px-4 my-3 rounded-full font-semibold shadow transition">
                  Apply Now
                </button>
              </div>
            </div> */}

            {/* <div className="w-full border !border-t-[20px] !border-[#FB5934] rounded-2xl shadow-xl p-2 md:!p-4 hover:shadow-2xl transition">
              <p className="text-md text-red-500">Internship</p>
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold mt-1">
                Content Writer
              </h2>
              <p className="text-sm text-gray-700 font-semibold mt-1">
                Read Job Description
              </p>
              <p className="text-sm text-gray-700 mt-2">
                You’ll help craft seamless, user-friendly experiences for
                thousands of artists. Your words will directly shape how people
                connect with Artsays.
              </p>
              <div className="text-center">
                <button className="justify-self-end bg-[#48372D] text-white hover:bg-[#ffffff] hover:!text-[#48372D] hover:!border border-dark py-2 px-4 my-3 rounded-full font-semibold shadow transition">
                  Apply Now
                </button>
              </div>
            </div> */}

          </div>
        </main>
      </div>
    </div>
  );
};

export default OpenRoles;
