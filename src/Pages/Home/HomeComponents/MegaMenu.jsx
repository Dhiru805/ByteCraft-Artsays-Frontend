import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const megaMenuCategories = [
  "BANKING",
  "COLLECT",
  "MARKETING",
  "SALES",
  "HR",
  "IT",
  "OPERATIONS",
];

const bidItem = {
  owner: "Celebrated Classics",
  name: "Golden Era Paintings",
  rating: 4.8,
  price: 68,
  reviewCount: 220,
  url: "",
};
const MegaMenuCategories = () => {
  return (
    <div className="h-full  bg-base  flex flex-col w-[35%]">
      <div className="rounded-t-xl bg-orange-600 py-[10px] mb-4 px-[20px]">
        <p className="text-lg   text-center  text-base">CATEGORIES</p>
      </div>
      <div className="flex  flex-1 flex-col gap-[24px]  overflow-y-scroll">
        {megaMenuCategories.map((cat, index) => {
          return (
            <button
              className="text-center text-orange-200 font-semibold text-lg"
              key={cat}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BidItem = ({ item }) => {
  return (
    <div className="w-[260px]    mx-auto ">
      <div className="bg-blue-300  mx-auto w-[260px]   h-[209px] flex justify-center items-center ">
        <img
          className="max-w-[90%] max-h-[90%] object-contain"
          src={item.url || "/assets/home/biditemurl.jpg"}
          alt=""
        />
      </div>
      <h5 className="text-[12px]   mt-1">Highly Rated</h5>
      <h4 className="text-[15px] font-medium mt-2">Owned by {item.owner}</h4>
      <h3 className="text-[18px] font-semibold my-1 text-black-900">
        {item.name}
      </h3>
      <div className="flex items-center justify-between gap-1 my-2  py-1">
        <div className="flex items-center gap-1">
          <img src="/assets/home/star.svg" alt="star" className="w-4 h-4" />
          <span className="text-sm">
            {item.rating} ({item.reviewCount} Reviews)
          </span>
        </div>
        <span className="font-medium text-[18px] text-black-900">
          ${item.price}
        </span>
      </div>

      <button className="text-center text-sm rounded-lg py-[8px] text-base bg-black-900 w-full">
        PLACE YOUR BID
      </button>
    </div>
  );
};

const SubCategories = () => {
  let categories = [
    "College Club",
    "Sports Club",
    "Booster Clubs",
    "Agency Companies",
    "Financial Planning",
  ];
  return (
    <div className="flex-1 py-4 px-3 bg-base ">
      <h4 className="text-orange-200 font-semibold">
        BANKING CATEGORIES {`   >>`}
      </h4>
      <div className=" h-[65%] w-full ">
        <div className="flex   py-6 flex-row items-start px-2  gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className=" focus:outline-none px-4 py-2 rounded-xl text-black-900 font-semibold"
          >
            {cat}
          </button>
        ))}
        </div>
    
      </div>
      <hr className="font-semibold border-2 border-white-800 py-3" />
      <p className="text-orange-200 font-normal">
        For teams of 300+ with advanced security, control, and support
      </p>
      <button className="border-2 mt-4 border-orange-200 font-normal text-center px-3 py-1.5 rounded-[10px] ">
        Talk to sales
      </button>
    </div>
  );
};

const MegaMenu = () => {
  return (
    <div className=" z-[999] w-full bg-gray-100  h-[500px] mx-auto  rounded-xl  flex flex-row gap-2 p-3 ">
      <MegaMenuCategories />
      <div className="rounded-2xl w-full bg-base  p-2 flex flex-row gap-2">
        <SubCategories />

        <div className="  flex-col  h-full  mx-auto border-[0.4px] border-black-900 rounded-xl flex-1 py-3 px-2">
          <div className="flex flex-row justify-between px-3 py-2 mb-2 ">
            <h4 className="text-black-900 font-semibold text-[18px] ">
              Bidding Deals
            </h4>

            <div className="flex flex-row gap-3  ">
              <button className=" py-[4px] px-[6px] flex items-center justify-center border  rounded-lg border-1">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button className="border bg-orange-300 rounded-lg  items-center justify-center py-[4px] px-[6px] border-1  ">
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>

          <div className=" py-1   border-black-900 ">
            <BidItem item={bidItem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
