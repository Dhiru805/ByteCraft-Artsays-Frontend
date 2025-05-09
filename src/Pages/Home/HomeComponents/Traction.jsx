import React from "react";
const tractionInfo = [
  { count: "2020", title: "Year of Establishment" },
  { count: "25+", title: "Customers Worldwide" },
  { count: "14+", title: "Active Client Base" },
  { count: "5", title: "Customer Rating" },
];
const Traction = () => {
  return (
    <div className="w-full bg-base mx-auto ">
      <div className="w-full min-h-[408px] bg-black-900 mx-auto mb-[80px]">
        <div className="bg-black-900 max-w-[1440px] px-[80px] flex   min-h-[290px] relative ">
          <span className="  mt-4 my-auto font-bold text-center text-wrap text-base">
            <p className="text-[50px]">
              {" "}
              We develop strategic software solutions for businesses.
            </p>
          </span>

          <div className="z-30 flex flex-row justify-between   mx-auto gap-8  w-full px-[80px]  absolute bottom-[-70%]">
            {tractionInfo.map((info) => {
              return (
                <>
                  <div
                    key={info.title}
                    className=" flex-1 bg-base rounded-[10px]  h-[170px] px-[69px] py-[14] gap-[10px] shadow-lg flex items-center flex-col justify-center"
                  >
                    <p className="text-[50px] font-semibold text-black-900">
                      {info.count}
                    </p>
                    <h4 className="text-[14px] w-full text-center font-semibold text-black-900">
                      {info.title}
                    </h4>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Traction;
