import React, { useState } from 'react';

const NotificationAndPreferences = () => {
  const [newsletter, setNewsletter] = useState("no"); // default to "no"

  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="w-[1208px] mx-auto  text-gray-800 text-[16px]">
      <h2 className="text-xl text-gray-950 font-semibold mb-6">Notification and Preferences</h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Preferred Art Categories</label>
        <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-500">
          <option>Select categories...</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Subscription to Newsletter & Offers</label>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="newsletter"
              value="yes"
              checked={newsletter === "yes"}
              onChange={() => setNewsletter("yes")}
              className="accent-black"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="newsletter"
              value="no"
              checked={newsletter === "no"}
              onChange={() => setNewsletter("no")}
              className="accent-blue-500"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          SMS/Email Alerts for Bids & Offer
          </label>
        <div
          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#6B5A5C]' : 'bg-gray-200'
            }`}
          onClick={handleToggle}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-4' : ''
              }`}
          ></div>
        </div>
      </div>
      <button className="bg-[#6F4D34] text-white px-9 py-2 rounded-full">Update</button>
    </div>
  );
};

export default NotificationAndPreferences;
