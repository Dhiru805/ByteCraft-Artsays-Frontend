import React from "react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
const faqscol1 = [
  {
    question: "How does Idukki identify and curate UGC for my brand?",
    answer:
      "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand.",
  },
  {
    question: "How Does Idukki Improve My SEO Rankings?",
    answer:
      "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand.",
  },
  {
    question: "How Does Idukki Improve My SEO Rankings?",
    answer:
      "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand.",
  },
];

const faqscol2 = [
  {
    question: "What is User-Generated Content (UGC)?",
    answer:
      "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand.",
  },
  {
    question:
      "the impact of Idukki's UGC on my sales and marketing performance?",
    answer:
      "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand.",
  },
  {
    question:
      "Is it possible widget into my existing marketing workflows and tech stack?",
    answer:
      "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand.",
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      key={index}
      className="group max-w-[600px] min-h-[122px]   flex-shrink-0  rounded-[16px] border-gray-300  px-[32px] py-[22px] shadow-md transition-all"
      onToggle={(e) => setIsOpen(e.target.open)}
    >
      <summary className="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-black gap-[10px]">
        <p className="text-[22px] font-medium text-orange-200 w-[97%]">
          {faq.question}
        </p>
        <span
          className={clsx(
            isOpen && "bg-orange-200  text-base",
            "text-2xl text-orange-200 bg-[#F7F7FF] w-[42px] h-[42px] flex items-center justify-center rounded-[8px] font-bold transition-transform duration-200"
          )}
        >
          {isOpen ? (
            <Minus className="mx-auto animate" color="white" />
          ) : (
            <Plus className="mx-auto" />
          )}
        </span>
      </summary>
      <p className="mt-2 font-normal text-[18px] break-words text-orange-200 w-[97%]">
        {faq.answer}
      </p>
    </details>
  );
}

const FAQS = () => {
  return (
    <div className="w-full bg-base  ">
      <div className="max-w-[1440px] min-h-[408px] mx-auto px-[80px] mb-[40px]">
        <div className="flex flex-col gap-[24px]">
          <h4 className="text-orange-200 font-semibold text-[40px] ">
            Frequently Asked Questions
          </h4>
          <p className="text-sm text-black-900">
            Get the answers to the most commonly asked questions.
          </p>
        </div>
        <div className="mt-8  pl-[40px] mx-auto flex flex-row flex-wrap gap-3  items-start">
          <div className="flex flex-col w-[50%] gap-3">
            {faqscol1.map((faq, index) => (
              <FAQItem faq={faq} index={index} />
            ))}
          </div>
          <div className="flex flex-col w-[50% gap-3">
            {faqscol2.map((faq, index) => (
              <FAQItem faq={faq} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQS;
