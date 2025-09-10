import React, { useState } from "react";

const TermsPolicySidebar = () => {
  const [showFilters, setShowFilters] = useState(false);

  const termsList = [
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Use", href: "#" },
    { title: "Return & Exchange Policy", href: "#" },
    { title: "Pricing & Fees", href: "#" },
    { title: "Shipping & Delivery", href: "#" },
    { title: "Copyright & Licensing", href: "#" },
  ];

  return (
    <div>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block rounded-xl bg-gray-50 sticky top-12 self-start">
        {/* `sticky top-24` makes it sticky with 6rem offset from top */}
        <h2 className="font-bold text-dark text-2xl mb-3">List of Terms and Policies</h2>
        <hr className="mb-3 border-dark" />
        {termsList.map((term, index) => (
          <p
            key={index}
            className={`text-lg text-dark mb-2 ${index === 0 ? "underline font-bold" : ""}`}
          >
            <a href={term.href}>{term.title}</a>
          </p>
        ))}
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden mb-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h18M3 12h18M3 20h18"
            />
          </svg>
          List of Terms and Policies
        </button>

        {/* Slide-over sidebar for mobile */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex">
            {/* Background Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowFilters(false)}
            ></div>

            {/* Sidebar */}
            <div className="relative bg-white w-72 max-w-full h-full shadow-xl p-5 overflow-y-auto">
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-3 right-3 text-gray-600 text-lg font-bold"
              >
                ✕
              </button>

              <h2 className="font-bold text-dark text-2xl mb-3">List of Terms and Policies</h2>
              <hr className="mb-3 border-dark" />
              {termsList.map((term, index) => (
                <p
                  key={index}
                  className={`text-lg text-dark mb-2 ${index === 0 ? "underline font-bold" : ""}`}
                >
                  <a href={term.href}>{term.title}</a>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsPolicySidebar;
