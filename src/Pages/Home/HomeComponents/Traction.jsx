import React from "react";
const tractionInfo = [
  { count: "2020", title: "Year of Establishment" },
  { count: "25+", title: "Customers Worldwide" },
  { count: "14+", title: "Active Client Base" },
  { count: "5", title: "Customer Rating" },
];
const Traction = () => {
  return (
    // <div className="w-full bg-base mx-auto ">
    //   <div className="w-full min-h-[408px] bg-black-900 mx-auto mb-[80px]  ">
    //     <div className="bg-black-900 flex max-w-[1440px] px-[80px]  mx-auto  min-h-[290px]  ">
    //       <div className="mt-4 my- flex-1 w-full font-bold text-center  bg-red-500 text-wrap text-base">
    //         <h2 className="text-[50px] ">
    //           We develop strategic software solutions for businesses.
    //         </h2>
    //       </div>

    //       <div className="z-30 flex flex-row  justify-between  translate-y-[100%]  mx-auto gap-8  max-w-[1440px]   ">
    //         {tractionInfo.map((info) => {
    //           return (
    //             <>
    //               <div
    //                 key={info.title}
    //                 className=" flex-1 bg-base rounded-[10px]  h-[170px] px-[69px] py-[14] gap-[10px] shadow-lg flex items-center flex-col justify-center"
    //               >
    //                 <p className="text-[50px] font-semibold text-black-900">
    //                   {info.count}
    //                 </p>
    //                 <h4 className="text-[14px] w-full text-center font-semibold text-black-900">
    //                   {info.title}
    //                 </h4>
    //               </div>
    //             </>
    //           );
    //         })}
    //       </div>
    //     </div>
    //   </div>
    // </div>




<div className="w-full bg-black-900 ">
  {/* Inner container with text */}
  <div className="mx-auto w-[80%] sm:px-8 px-[80px] py-12 text-center text-white min-h-[290px]">
    <h2 className="text-[28px] sm:text-[36px] md:text-[50px] font-bold leading-tight">
      We develop strategic software solutions for businesses.
    </h2>
  </div>

  {/* Traction Info section that OVERLAPS */}
  <div className="relative ">
    {/* White background below (like next section) */}
    <div className="h-[200px] bg-white " />

    {/* Floating cards */}
    <div className="absolute top-0 left-1/2 px-[80px] -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[1440px]  sm:px-8 lg:px-[80px] flex flex-wrap justify-between gap-4">
      {tractionInfo.map((info) => (
        <div
          key={info.title}
          className="flex-1 min-w-[220px] bg-base rounded-[10px] h-[170px] px-6 py-4 gap-2 shadow-lg flex items-center flex-col justify-center"
        >
          <p className="text-[32px] sm:text-[40px] font-semibold text-black-900">
            {info.count}
          </p>
          <h4 className="text-[14px] text-center font-semibold text-black-900">
            {info.title}
          </h4>
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default Traction;
