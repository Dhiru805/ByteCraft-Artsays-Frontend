// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

// const megaMenuCategories = [
//   "BANKING",
//   "COLLECT",
//   "MARKETING",
//   "SALES",
//   "HR",
//   "IT",
//   "OPERATIONS",
// ];

// const bidItem = {
//   owner: "Celebrated Classics",
//   name: "Golden Era Paintings",
//   rating: 4.8,
//   price: 68,
//   reviewCount: 220,
//   url: "",
// };
// const MegaMenuCategories = () => {
//   return (
//     <div className="h-full  bg-base  flex flex-col w-[35%]">
//       <div className="rounded-t-xl bg-orange-600 py-[10px] mb-4 px-[20px]">
//         <p className="text-lg   text-center  text-base">CATEGORIES</p>
//       </div>
//       <div className="flex  flex-1 flex-col gap-[24px]  overflow-y-scroll">
//         {megaMenuCategories.map((cat, index) => {
//           return (
//             <button
//               className="text-center text-orange-200 font-semibold text-lg"
//               key={cat}
//             >
//               {cat}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const BidItem = ({ item }) => {
//   return (
//     <div className="w-[260px]    mx-auto ">
//       <div className="bg-blue-300  mx-auto w-[260px]   h-[209px] flex justify-center items-center ">
//         <img
//           className="max-w-[90%] max-h-[90%] object-contain"
//           src={item.url || "/assets/home/biditemurl.jpg"}
//           alt=""
//         />
//       </div>
//       <h5 className="text-[12px]   mt-1">Highly Rated</h5>
//       <h4 className="text-[15px] font-medium mt-2">Owned by {item.owner}</h4>
//       <h3 className="text-[18px] font-semibold my-1 text-black-900">
//         {item.name}
//       </h3>
//       <div className="flex items-center justify-between gap-1 my-2  py-1">
//         <div className="flex items-center gap-1">
//           <img src="/assets/home/star.svg" alt="star" className="w-4 h-4" />
//           <span className="text-sm">
//             {item.rating} ({item.reviewCount} Reviews)
//           </span>
//         </div>
//         <span className="font-medium text-[18px] text-black-900">
//           ${item.price}
//         </span>
//       </div>

//       <button className="text-center text-sm rounded-lg py-[8px] text-base bg-black-900 w-full">
//         PLACE YOUR BID
//       </button>
//     </div>
//   );
// };

// const SubCategories = () => {
//   let categories = [
//     "College Club",
//     "Sports Club",
//     "Booster Clubs",
//     "Agency Companies",
//     "Financial Planning",
//   ];
//   return (
//     <div className="flex-1 py-4 px-3 bg-base ">
//       <h4 className="text-orange-200 font-semibold">
//         BANKING CATEGORIES {`   >>`}
//       </h4>
//       <div className=" h-[65%] w-full ">
//         <div className="flex   py-6 flex-row items-start px-2  gap-2 flex-wrap">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             className=" focus:outline-none px-4 py-2 rounded-xl text-black-900 font-semibold"
//           >
//             {cat}
//           </button>
//         ))}
//         </div>
    
//       </div>
//       <hr className="font-semibold border-2 border-white-800 py-3" />
//       <p className="text-orange-200 font-normal">
//         For teams of 300+ with advanced security, control, and support
//       </p>
//       <button className="border-2 mt-4 border-orange-200 font-normal text-center px-3 py-1.5 rounded-[10px] ">
//         Talk to sales
//       </button>
//     </div>
//   );
// };

// const MegaMenu = () => {
//   return (
//     <div className=" z-[999] w-full bg-gray-100  h-[500px] mx-auto  rounded-xl  flex flex-row gap-2 p-3 ">
//       <MegaMenuCategories />
//       <div className="rounded-2xl w-full bg-base  p-2 flex flex-row gap-2">
//         <SubCategories />

//         <div className="  flex-col  h-full  mx-auto border-[0.4px] border-black-900 rounded-xl flex-1 py-3 px-2">
//           <div className="flex flex-row justify-between px-3 py-2 mb-2 ">
//             <h4 className="text-black-900 font-semibold text-[18px] ">
//               Bidding Deals
//             </h4>

//             <div className="flex flex-row gap-3  ">
//               <button className=" py-[4px] px-[6px] flex items-center justify-center border  rounded-lg border-1">
//                 <FontAwesomeIcon icon={faArrowLeft} />
//               </button>
//               <button className="border bg-orange-300 rounded-lg  items-center justify-center py-[4px] px-[6px] border-1  ">
//                 <FontAwesomeIcon icon={faArrowRight} />
//               </button>
//             </div>
//           </div>

//           <div className=" py-1   border-black-900 ">
//             <BidItem item={bidItem} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MegaMenu;


"use client"

import React, { useState, useRef, useEffect } from "react"

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState("Paintings")
  const [activeSubcategory, setActiveSubcategory] = useState("Abstract")
  const scrollContainerRef = useRef(null) // Removed type annotation
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const categories = [
    "Paintings",
    "Crafts",
    "Sculptures",
    "Photography",
    "Digital Art",
    "Textile Art",
    "Ceramics",
    "Jewelry",
  ]

  const subcategories = {
    Paintings: ["Abstract", "Landscape", "Portrait", "Still Life", "Figurative"],
    Crafts: ["Pottery", "Woodwork", "Glass Art", "Metalwork", "Textile Crafts"],
    Sculptures: ["Bronze", "Marble", "Wood", "Mixed Media"],
    Photography: ["Nature", "Street", "Portrait", "Abstract", "Documentary"],
    "Digital Art": ["Generative", "Pixel Art", "Vector Art", "3D Rendering"],
    "Textile Art": ["Weaving", "Embroidery", "Quilting", "Tapestry"],
    Ceramics: ["Vases", "Tableware", "Figurines"],
    Jewelry: ["Necklaces", "Earrings", "Rings", "Bracelets"],
  }

  const handleMouseDown = (e) => { // Removed type annotation
    if (scrollContainerRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
      setScrollLeft(scrollContainerRef.current.scrollLeft)
    }
  }

  const handleMouseMove = (e) => { // Removed type annotation
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // The speed of the scroll
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleMouseLeave = () => {
      setIsDragging(false)
    }
    const currentRef = scrollContainerRef.current
    if (currentRef) {
      currentRef.addEventListener("mouseleave", handleMouseLeave)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isDragging])

  return (
    <div className="mega-menu">
      <div className="header-wrapper">
        <div className="corner left-corner" />
        <div
          className={`scroll-container ${isDragging ? "dragging" : ""}`}
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // End drag if mouse leaves container
        >
          <div className="header-bar">
            {categories.map((category) => (
              <button
                key={category}
                className={`art-type ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="corner right-corner" />
      </div>

      <div className="container-custom">
        <div className="sidebar-wrapper">
          <div className="sidebar">
            {/* Removed type assertion for subcategories[activeCategory] */}
            {subcategories[activeCategory]?.map((sub) => (
              <button
                key={sub}
                className={activeSubcategory === sub ? "active" : ""}
                onClick={() => setActiveSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="table-section">
          <div className="table-wrapper">
            <table>
              <tbody>
                <tr>
                  <td className={activeSubcategory === "Abstract" ? "active-td" : ""}>
                    <span className="hover-underline">Abstract</span>
                  </td>
                  <td className={activeSubcategory === "Landscape" ? "active-td" : ""}>
                    <span className="hover-underline">Landscape</span>
                  </td>
                  <td className={activeSubcategory === "Portrait" ? "active-td" : ""}>
                    <span className="hover-underline">Portrait</span>
                  </td>
                </tr>
                <tr>
                  <td className={activeSubcategory === "Still Life" ? "active-td" : ""}>
                    <span className="hover-underline">Still Life</span>
                  </td>
                  <td className={activeSubcategory === "Figurative" ? "active-td" : ""}>
                    <span className="hover-underline">Figurative</span>
                  </td>
                  <td className={activeSubcategory === "Pottery" ? "active-td" : ""}>
                    <span className="hover-underline">Pottery</span>
                  </td>
                </tr>
                <tr>
                  <td className={activeSubcategory === "Woodwork" ? "active-td" : ""}>
                    <span className="hover-underline">Woodwork</span>
                  </td>
                  <td className={activeSubcategory === "Glass Art" ? "active-td" : ""}>
                    <span className="hover-underline">Glass Art</span>
                  </td>
                  <td className={activeSubcategory === "Metalwork" ? "active-td" : ""}>
                    <span className="hover-underline">Metalwork</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sales-support">
            <span>Sales Support</span>
          </div>
        </div>

        <div className="art-card">
          <img
            src="/placeholder.svg?height=500&width=400"
            alt="Abstract Painting"
            width={400}
            height={500}
            className="card-image"
          />
          <div className="card-overlay" />
        </div>
      </div>

      <style jsx>{`
        .mega-menu {
          position: absolute;
          top: 115%;
          left: 50%;
          transform: translateX(-50%);
          width: 90vw;
          background-color: white;
          z-index: 1000;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease-out, opacity 0.3s ease;
          opacity: 0;
          box-sizing: border-box;
          border-radius: 0px 0px 15px 15px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        /* This class is controlled by the parent NavBar component's hover state */
        .mega-menu.active {
          max-height: 725px; /* Adjust based on your content */
          opacity: 1;
        }

        .header-wrapper {
          display: flex;
          align-items: center;
          background-color: #3a261c;
          height: 80px;
          position: relative;
        }
        .corner {
          width: 25px;
          height: 80px;
          background-color: #f15d3c;
          z-index: 2;
        }
        .left-corner {
          border-radius: 0 10px 10px 0;
          margin-right: 0.5rem;
        }
        .right-corner {
          border-radius: 10px 0 0 10px;
          margin-left: 0.5rem;
        }
        .scroll-container {
          overflow-x: auto;
          flex: 1;
          height: 100%;
          scrollbar-width: none; /* Firefox */
        }
        .scroll-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .header-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          white-space: nowrap;
          height: 100%;
          cursor: grab;
        }
        .header-bar.dragging {
          cursor: grabbing;
          user-select: none;
        }
        .art-type {
          flex: 0 0 auto;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          color: #fff;
          font-size: 20px;
          transition: 0.3s all;
          background: none;
          border: none;
          cursor: pointer;
        }
        .art-type:hover {
          border: 2px solid white;
        }
        .art-type.active {
          background-color: #ffffff;
          color: #3a261c;
          font-weight: bold;
        }
        .container-custom {
          display: flex;
          gap: 40px;
          justify-content: space-between;
          padding: 40px 10px 40px 0;
          background-color: #fff;
          border: 2px solid black;
          border-radius: 0px 0px 15px 15px;
        }
        .sidebar-wrapper {
          flex: 0 0 20%;
          max-height: 100vh;
          overflow-y: auto;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: 500px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .sidebar::-webkit-scrollbar {
          display: none;
        }
        .sidebar button {
          background-color: #ece6c8;
          border: none;
          padding: 12px 24px;
          border-radius: 0 30px 30px 0;
          font-weight: 600;
          font-size: 20px;
          text-align: left;
          cursor: pointer;
        }
        .sidebar .active {
          background-color: #3a261c;
          color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .table-section {
          flex: 0 0 50%;
          max-height: 600px;
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 0px 15px 15px 0px;
        }
        .table-wrapper {
          flex: 1;
          overflow-x: auto;
        }
        .table-section table {
          width: max-content;
          border-collapse: collapse;
          font-size: 20px;
          text-align: left;
        }
        .table-section td {
          padding: 12px 40px 12px 0;
          white-space: nowrap;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .hover-underline {
          display: inline-block;
          position: relative;
          cursor: pointer;
          transition: color 0.3s ease, font-weight 0.3s ease;
        }
        .hover-underline::after {
          content: "";
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #3a261c;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .hover-underline:hover {
          font-weight: bold;
        }
        .hover-underline:hover::after {
          transform: scaleX(1);
        }
        .active-td .hover-underline {
          font-weight: bold;
        }
        .active-td .hover-underline::after {
          transform: scaleX(1);
        }
        .table-section td.active-td {
          font-weight: bold;
          text-decoration: underline;
        }
        .art-card {
          height: 500px;
          transition: transform 0.3s ease;
          cursor: pointer;
          background-color: #fee2cc;
          position: relative;
          overflow: hidden;
          border-radius: 15px;
        }
        .art-card:hover {
          transform: scale(1.02);
        }
        .card-image {
          object-fit: cover;
          transition: transform 0.4s ease;
          width: 100%;
          height: 100%;
        }
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          pointer-events: none;
        }
        .art-card:hover .card-overlay {
          opacity: 1;
          pointer-events: auto;
        }
        .sales-support {
          position: sticky;
          bottom: 0;
          z-index: 10;
          background-color: #ffe2d1;
          border-radius: 0 15px 15px 0;
          height: 50px;
          padding-left: 20px;
          display: flex;
          align-items: center;
          text-align: left;
          overflow: hidden; /* Ensure the span animation is clipped */
        }
        .sales-support span {
          position: absolute;
          height: 50px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #3a261c;
          color: white;
          padding: 6px 18px;
          border-radius: 0 15px 15px 0;
          white-space: nowrap;
          z-index: 2;
          animation: slideOver 1s ease-in-out forwards;
          opacity: 0;
        }
        @keyframes slideOver {
          0% {
            left: -60px;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            left: calc(100% - 146px); /* Adjust based on actual width of "Sales Support" text */
            opacity: 1;
          }
        }

        @media (max-width: 992px) {
          .header-wrapper,
          .container-custom {
            display: none; /* Hide mega menu content on mobile */
          }
        }
      `}</style>
    </div>
  )
}
