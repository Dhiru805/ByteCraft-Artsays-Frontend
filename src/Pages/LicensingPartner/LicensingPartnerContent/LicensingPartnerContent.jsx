import "../../store/products/product.css";
import React, { useState } from "react";

const LicensingPartnerContent = () => {
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* title */}
      <h1 className="text-sm md:text-4xl font-bold text-orange-500 px-3">
        Our Licensing Partner & Benefits
      </h1>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        At ArtSays, we are committed to protecting the creativity of our artists
        while offering buyers a safe and transparent way to enjoy and use
        artworks. To achieve this, we’ve partnered with Creative Rights Alliance
        (CRA), a trusted global licensing body that specializes in safeguarding
        digital and physical art.
        <br />
        <br />
        This partnership ensures that every piece of art shared, sold, or
        commissioned through ArtSays carries clear legal protection, fair usage
        guidelines, and benefits for both the creator and the buyer.
      </p>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
        {/* Sidebar Filters (hidden on mobile, toggleable) */}
        <aside className="rounded-xl filter-sidebar content-center">
          <img src="/herosectionimg/Shrug-bro 1.png" alt="" />
        </aside>

        {/* <!-- Product Grid --> */}
        <main className="md:col-span-3 content-center">
          <div>
            {/* title */}
            <h1 className="text-sm md:text-xl font-bold text-orange-500">
              Who Is Our Licensing Partner?
            </h1>
            <hr className="my-3 border-dark" />
            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
              Creative Rights Alliance (CRA) is a leading organization that
              advocates for artists’ intellectual property rights worldwide.
              With decades of experience in art licensing, copyright management,
              and royalty distribution, CRA empowers artists by protecting their
              ownership while ensuring fair compensation.
              <br /> <br />
              Through this collaboration, ArtSays provides artists with a
              licensing shield that safeguards their work against unauthorized
              use and misuse, while offering buyers an assurance of legitimate
              ownership and usage rights.
            </p>
            <button className="flex-1 bg-red-500 text-white py-2 px-3 mt-2 rounded-full font-semibold shadow buy-now">
              Get Licensed
            </button>
          </div>
        </main>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
        {/* <!-- Product Grid --> */}
        <main className="md:col-span-3 content-center text-right !order-2 md:!order-1">
          <div>
            {/* title */}
            <h1 className="text-sm md:text-xl font-bold text-orange-500">
              Why Licensing Is Important
            </h1>
            <hr className="my-3 border-dark" />
            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
              Artist Protection - Licensing ensures you remain the rightful
              owner of your creation while still benefiting financially when
              others use your work.
              <br />
              <br />
              Buyer Clarity - Licensing provides legal clarity and
              confidence—whether you’re displaying the art in your home, using
              it in your branding, or reproducing it in products.
              <br />
              <br />
              For Businesses -Proper licensing avoids copyright disputes and
              ensures ethical sourcing of creative assets.
            </p>
            <button className="flex-1 bg-red-500 text-white py-2 px-3 mt-2 rounded-full font-semibold shadow buy-now">
              Get Licensed
            </button>
          </div>
        </main>

        {/* Sidebar Filters (hidden on mobile, toggleable) */}
        <aside className="rounded-xl filter-sidebar content-center !order-1 md:!order-2">
          <img src="/herosectionimg/Audit-pana 1.png" alt="" />
        </aside>
      </div>
    </div>
  );
};
export default LicensingPartnerContent;
