import { FaPalette, FaDollarSign, FaCertificate, FaStar, FaCamera, FaBoxOpen } from "react-icons/fa";

const features = [
    {
      title: "Artist Support",
      desc: "Fair commissions, useful tools, and direct connections with collectors.",
      color: "bg-green-500",
      textColor: "text-green-500",
      icon: <FaPalette size={40} />,
    },
    {
      title: "Transparent Transactions",
      desc: "Fees, shipping, taxes, and provenance details are displayed up front.",
      color: "bg-sky-500",
      textColor: "text-sky-500",
      icon: <FaDollarSign size={40} />,
    },
    {
      title: "Authentication",
      desc: "Artist-signed COAs and third-party certification ensure traceability.",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      icon: <FaCertificate size={40} />,
    },
    {
      title: "Selection Curated",
      desc: "Specialists curate collections to ensure quality and relevance.",
      color: "bg-lime-500",
      textColor: "text-lime-500",
      icon: <FaStar size={40} />,
    },
    {
      title: "Elevated Buying Experience",
      desc: "High-resolution imagery and flexible payment options.",
      color: "bg-purple-500",
      textColor: "text-purple-500",
      icon: <FaCamera size={40} />,
    },
    {
      title: "Trusted Packing & Delivery",
      desc: "Integrated shipping ensures safe delivery for high-value items.",
      color: "bg-orange-500",
      textColor: "text-orange-500",
      icon: <FaBoxOpen size={40} />,
    },
  ];


const WhyArtsaysDifferent = () => {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-4 px-3">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
            {/* title */}
            <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
              Why Artsays Is Different
            </h1>
            <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
              More Details
            </button>
          </div>

          <hr className="my-3 border-dark" />

          {/* Subtitle */}
          <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
            At ArtSays, we make it simple for you to collaborate directly with
            talented artists and bring your creative vision to life.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center relative">
              {/* Pin Icon */}
              <div className="relative mb-0 z-[90]">
                <div
                  className={`${f.color} relative w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl shadow-lg`}
                >
                  <div className="z-[99]">{f.icon}</div>
                  {/* Point (triangle) */}
                  <div
                    className={`${f.color} absolute bottom-[-10px] z-1 left-1/2 transform -translate-x-1/2 rotate-45 w-12 h-12`}
                  ></div>
                </div>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 w-full h-[200px] pt-10 text-center relative z-10">
                <h3 className="text-xl font-bold text-green-600">{f.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WhyArtsaysDifferent;
