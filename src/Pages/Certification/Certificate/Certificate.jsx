// import "../../store/products/product.css";
// import { useRef } from "react";

// const Certificate = () => {
//     const scroller = useRef(null);

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             {/* Top Section: Breadcrumb + Search */}
//             <div className="w-full py-3 px-3">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                     {/* Breadcrumb */}
//                     <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//                         <a href="#" className="hover:text-red-500">
//                             Home
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Store
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Paintings
//                         </a>
//                         <span>/</span>
//                         <span className="font-medium text-gray-900">Abstract</span>
//                     </nav>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//                 {/* title */}
//                 <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                     Certificates
//                 </h1>
//                 <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//                     Get Your Certificate
//                 </button>
//             </div>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Showcase authenticity and build trust with verified certifications.
//             </p>

//             {/* Main Layout */}
//             <div
//                 ref={scroller}
//                 className="mt-3 overflow-x-auto scroll-smooth scrollbar-hide"
//                 onWheel={(e) => {
//                     // convert vertical scroll to horizontal; multiplier adjusts speed
//                     if (scroller.current) {
//                         scroller.current.scrollLeft += e.deltaY * 1;
//                     }
//                 }}>
//                 <div className="flex gap-3 px-2 md:px-0 py-2 w-max">
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                     <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                         Certificate of Authenticity
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };
// export default Certificate;




// import "../../store/products/product.css";
// import { useRef, useState, useEffect } from "react";
// import getAPI from "../../../api/getAPI";

// const Certificate = () => {
//     const scroller = useRef(null);
//     const [data, setData] = useState(null);
//     const [certifications, setCertifications] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await getAPI("/api/certificate/published");
//                 if (res.data && res.data.data) {
//                     setData(res.data.data);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch certificate data:", err);
//             }
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         const fetchCertifications = async () => {
//             try {
//                 const res = await getAPI("/api/get-certification-setting");
//                 console.log("API Response:", res);
//                 if (res.data && res.data.data) {
//                     console.log("Certifications data:", res.data.data);
//                     setCertifications(res.data.data);
//                 } else {
//                     console.log("No data in response");
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch certifications:", err);
//             }
//         };
//         fetchCertifications();
//     }, []);

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             <div className="w-full py-3 px-3">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                     {/* Breadcrumb */}
//                     <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//                         <a href="#" className="hover:text-red-500">
//                             Home
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Store
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Paintings
//                         </a>
//                         <span>/</span>
//                         <span className="font-medium text-gray-900">Abstract</span>
//                     </nav>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//                 {/* title */}
                
//                 <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                     {data?.webpageHeading || "Certificates"}
//                 </h1>
                
//                 {data?.buttonName && data?.buttonLink && (
//                     <a
//                         href={data.buttonLink}
//                         className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now text-center"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                     >
//                         {data.buttonName}
//                     </a>
//                 )}
//             </div>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
            
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 {data?.webpageDescription || "Showcase authenticity and build trust with verified certifications."}
//             </p>

//             {/* Main Layout */}
//             <div
//                 ref={scroller}
//                 className="mt-3 overflow-x-auto scroll-smooth scrollbar-hide"
//                 onWheel={(e) => {
//                     if (scroller.current) {
//                         scroller.current.scrollLeft += e.deltaY * 1;
//                     }
//                 }}>
//                 <div className="flex gap-3 px-2 md:px-0 py-2 w-max">
//                     {certifications.map((cert, index) => (
//                         <div key={index} className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
//                             {cert.certificationName}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </div>
//     );
// };
// export default Certificate;


import "../../store/products/product.css";
import { useRef, useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const Certificate = () => {
  const scroller = useRef(null);
  const [data, setData] = useState(null);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/certificate/published");
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch certificate data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await getAPI("/api/get-certification-setting"); 
        if (res.data && res.data.data) {
          const names = res.data.data
            .map((item) => item.certificationName)
            .filter(Boolean);
          setCertifications(names);
        } else {
          console.log("No data in response");
        }
      } catch (err) {
        console.error("Failed to fetch certifications:", err);
      }
    };
    fetchCertifications();
  }, []);

  const fallbackCertifications = [
    "Certificate of Authenticity",
    "Certificate of Ownership",
    "Artist Verification",
    "Provenance Certificate",
  ];

  const itemsToRender =
    certifications.length > 0 ? certifications : fallbackCertifications;

  return (
    <div className="max-w-[1440px] mx-auto py-4">
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {data?.webpageHeading || "Certificates"}
        </h1>

        {data?.buttonName && data?.buttonLink && (
          <a
            href={data.buttonLink}
            className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.buttonName}
          </a>
        )}
      </div>

      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
        {data?.webpageDescription ||
          "Showcase authenticity and build trust with verified certifications."}
      </p>

      <div
        ref={scroller}
        className="mt-3 overflow-x-auto scroll-smooth scrollbar-hide"
        onWheel={(e) => {
          if (scroller.current) {
            scroller.current.scrollLeft += e.deltaY * 1;
          }
        }}
      >
        <div className="flex gap-6 px-4 md:px-8 py-4 w-max">
          {itemsToRender.map((name, index) => (
            <div
              key={index}
              className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px]
                        p-3 md:p-4 rounded-lg font-semibold text-[#48372D]
                        text-center text-lg whitespace-nowrap
                        transition-all duration-300 hover:scale-105 hover:bg-[#FFF1EE]"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
