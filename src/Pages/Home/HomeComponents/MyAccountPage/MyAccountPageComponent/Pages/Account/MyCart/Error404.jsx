import React from "react";
import img404 from "../../../../../../../../assets/404.png"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1464px] flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white">
      {/* 404 Image */}
      <img
        src={img404}
        alt="404"
        className="w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] py-12"
      />

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-semibold py-6">
        <span className="text-gray-800">Oops! </span>
         <span className="text-[#6E4E37]">Page not Found</span>
     </h2>

      {/* Description */}
      <p className="text-[#7B7B7B] sm:text-lg md:text-xl lg:text-[24px] px-2 max-w-[800px] pb-10">
        The page you are looking for cannot be found. Take a break before trying again.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="bg-[#6E4E37] text-white text-sm sm:text-base font-semibold w-40 sm:w-48 h-12 rounded-full hover:bg-[#5b3f2a] transition"
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default ErrorPage;
