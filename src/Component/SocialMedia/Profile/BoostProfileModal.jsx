import React, { useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const BoostProfilePopup = ({ onClose }) => {
  const [budget, setBudget] = useState(2000);
  const [days, setDays] = useState(3);
  const [selectedOption, setSelectedOption] = useState("profile");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white w-[90%] max-w-6xl rounded-md shadow-lg flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-[60%] px-6 py-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={onClose}>
            <RiArrowLeftLine size={22} />
            <h2 className="text-lg font-semibold">Promote Profile</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Promote this profile into an ad to increase your reach. We’ll automatically format it
            for different placements across our site and run it wherever it’s likely to perform best.
          </p>

          <h3 className="font-semibold mb-3">What do you want people to do when they see your ad?</h3>
          <div className="flex flex-col gap-4 mb-6">
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="action"
                checked={selectedOption === "profile"}
                onChange={() => setSelectedOption("profile")}
              />
              <div>
                <span className="text-sm font-medium">Visit your profile</span>
                <p className="text-xs text-gray-600">Best for brand awareness and follows</p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="action"
                checked={selectedOption === "website"}
                onChange={() => setSelectedOption("website")}
              />
              <div>
                <span className="text-sm font-medium">Visit your website</span>
                <p className="text-xs text-gray-600">
                  Best for online sales, bookings and helping people learn more about you
                </p>
              </div>
            </label>
          </div>

          <h3 className="font-semibold mb-2">Special requirements</h3>
          <div className="mb-6">
            {/* Add special input if needed */}
          </div>

          <h3 className="font-semibold mb-2">Who should see your ad?</h3>
          <div className="mb-2 text-sm">
            <p className="mb-1 text-gray-700">Suggested audience</p>
            <p className="text-gray-500 text-xs">Targets this ad to people similar to your followers</p>
            <p className="text-sm font-medium mt-1">India <span className="text-blue-500 cursor-pointer ml-2">Edit</span></p>
          </div>

          <div className="text-sm mt-4">
            <p className="font-medium text-blue-500 cursor-pointer">Create your own</p>
            <p className="text-xs text-gray-500">Manually enter your targeting options</p>
          </div>

          {/* Budget */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">What’s your ad budget?</h3>
            <div className="flex justify-between mb-1 text-sm">
              <span>Daily budget: ₹{budget}</span>
              <span>Estimated GST: ₹{(budget * 0.05).toFixed(0)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Duration */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Duration</h3>
            <div className="flex justify-between mb-1 text-sm">
              <span>Number of days: {days} day(s)</span>
              <span>Run this ad until paused</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[40%] bg-[#f9f9f9] border-l border-gray-200 px-6 py-6">
          <h3 className="font-semibold mb-3">Preview ad</h3>
          <div className="w-full h-64 bg-white border shadow-sm mb-6 flex items-center justify-center">
            {/* Replace with dynamic preview if needed */}
            <img
              src="https://i.imgur.com/vq7wZ7F.png"
              alt="Ad preview"
              className="object-contain max-h-full"
            />
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1">Payment method</h4>
            <div className="flex gap-3 text-xl items-center">
              <FaCcVisa />
              <FaCcMastercard />
              <FcGoogle />
              <span className="text-sm ml-2">GPay</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1">Payment summary</h4>
            <p className="text-xs text-gray-500">
              ₹{(budget * days).toLocaleString()} over {days} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostProfilePopup;
