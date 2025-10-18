import React, { useState } from "react";

const Faq = () => {
  const [faqToggle, setFaqToggle] = useState(false);
  return (
    <div className="w-full h-full  flex flex-col gap-5 py-2">
      <h1 className="w-[97%] mx-auto text-[26px] text-[#000000] font-bold px-4">
        FAQ'S
      </h1>
      <div className="w-[93%] mx-auto px-4 flex flex-col gap-5">
        <label className="inline-flex items-center justify-between cursor-pointer">
          <div className="text-[21px] font-bold text-[#000000]">
            Frequently Asked Questions
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={faqToggle}
              onChange={() => setFaqToggle((s) => !s)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition ${
                faqToggle ? "bg-[#4f3823]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                faqToggle ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>

        <div className="flex flex-col gap-3">
          <h2 className="text-[21px] text-[#000000] font-bold">
            Add a question
          </h2>
          <p className="text-[17px] text-[#000000] font-medium">
            Suggest questions people can ask at the beginning of a chat. Then
            set up automated responses to those questions.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[19px] text-[#000000] font-semibold">Question</h2>
          <div className="w-full bg-gray-100">
            <input
              type="text"
              placeholder="What are your hours?"
              className="w-full h-full placeholder:text-[16px] placeholder:text-[#000000] placeholder:font-medium outline-none flex-1 bg-gray-100 py-3 px-3"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[19px] text-[#000000] font-semibold">
            Automated response (optional)
          </h2>
          <div className="w-full bg-gray-100">
            <input
              type="text"
              placeholder="We're open 10am-4pm PT"
              className="w-full h-full placeholder:text-[16px] placeholder:text-[#000000] placeholder:font-medium outline-none flex-1 bg-gray-100 py-3 px-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
