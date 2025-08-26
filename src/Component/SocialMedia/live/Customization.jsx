import React, { useState } from "react";
import { RiImageAddLine } from "react-icons/ri";

const Customization = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="lg:w-[56%] w-full sm:mx-auto sm:border-[0.5px] sm:border-[#48372D]  bg-white flex flex-col sm:h-[80vh] sm:rounded-t-xl sm:rounded-b-xl">
      
      {/* Header Tabs */}
      <header className="flex flex-col w-full border-b border-[#48372D] mb-2 sm:mb-0 ">
      <div className="flex justify-evenly w-full rounded-t-xl border-b border-[#48372D]">
       <div
  className={`flex w-1/2 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 rounded-tl-2xl ${
    activeTab === "details" ? "bg-[#48372D] text-white" : ""
  }`}
  onClick={() => setActiveTab("details")}
>
  Details
</div>
<div
  className={`flex w-1/2 justify-center items-center text-[#48372D] text-lg border border-solid py-3 font-semibold cursor-pointer py-4 rounded-tr-2xl ${
    activeTab === "customization" ? "bg-[#48372D] text-white" : ""
  }`}
 
>
  Customization
</div>
</div>
 {activeTab === "details" && (
    <div className="text-xl text-[#48372D] font-bold border-[1px] border-solid p-3 border border-[#48372D]">
      Details
    </div>
  )}

  {activeTab === "customization" && (
    <div className="p-3 ">
      <h2 className="text-[26px]  font-bold text-[#48372D]">Customization</h2>
      <p className="text-[16px] text-[#474242]">
        Settings to tailor your stream to your needs
      </p>
    </div>
  )}
 

      </header>

      {/* Scrollable main content */}
      <main className="flex-1 overflow-y-auto w-full sm:w-[90%] sm:mx-auto">
        {activeTab === "details" && (
            <div className="flex flex-col gap-6 sm:p-2">
              {/* Title */}
              <div className="flex items-center p-2.5 border-[1px] border-[#48372D] rounded-xl gap-1">
                <div className="text-[18px] text-[#474242] font-semibold">Title</div>
                <input
                  type="text"
                  className="rounded-md outline-none border-none placeholder:text-[18px] placeholder:text-[#474242] flex-1"
                  placeholder="(required)"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col items-start p-3 rounded-xl border-[1px] border-[#48372D] ">
                <div className="text-[18px] text-[#474242] font-semibold">Description</div>
                <textarea
                  className="w-full rounded-lg placeholder:text-[#474242] placeholder:text-[18px] "
                  placeholder="Tell viewers more about your stream"
                ></textarea>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[#48372D] text-[20px] font-semibold">Category</h2>
                <p className="text-[#474242] text-[16px] ">Add your stream to a category so viewers can find it easily.</p>
                <select className="border-[1px] border-[#48372D] w-1/2 rounded-md p-2  text-[18px] font-bold  text-[#48372D]">
                  <option className="text-[18px] font-bold text-[#474242]">Art</option>
                </select>
              </div>

              {/* Thumbnail */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[#48372D] text-[20px] font-semibold">Thumbnail</h2>
                <p className="text-[#474242] text-[16px]">
                  Select or upload a picture that represents your stream
                </p>
                <label
                  htmlFor="thumbnail"
                  className="w-1/3 h-40 border-dashed border-2 border-gray-400 rounded-md flex flex-col items-center justify-between py-3 text-center cursor-pointer hover:border-[#6B4A3A] hover:bg-gray-50"
                >
                  <RiImageAddLine size={22} className="text-gray-600 mt-5" />
                  <span className="text-sm text-gray-600">Upload thumbnail</span>
                  <input type="file" id="thumbnail" className="hidden" accept="image/*" />
                </label>
              </div>

              {/* Paid Promotion */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[#48372D] text-[20px] font-semibold">Paid Promotion</h2>
                <p className="text-[#474242] text-[16px]">
                  If you accepted anything of value from a third party to make a stream, you must
                  let us know. We'll show viewers a message that your stream contains paid promotion.
                </p>
                <label className="mt-1 text-[#48372D] text-[20px] font-semibold">
                  <input type="checkbox" className="mr-2" />
                  This stream contains paid promotion (product, sponsorship, endorsement)
                </label>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[#48372D] text-[20px] font-semibold">Tags</h2>
                <p className="text-[#474242] text-[16px]">Tags can help users find your stream.</p>
                <div className="flex items-center p-2 rounded-xl border-[1px] border-[#48372D]">
                  <div className="text-[18px] text-[#474242] font-semibold">Enter your tags</div>
                  <input
                    type="text"
                    className="rounded-md outline-none border-none placeholder:text-[18px] placeholder:text-[#474242] flex-1"
                    placeholder="(enter a comma after each tag)"
                  />
                </div>
              </div>

              {/* Language */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[#48372D] text-[20px] font-semibold">Language</h2>
                <p className="text-[#474242] text-[16px]">Select your stream's language</p>
                <div className="w-1/2 rounded-xl border-[1px] border-[#48372D] py-3 px-3">
                  <p className="text-[18px] text-[#474242]">Select Language</p>
                  <select className="w-full rounded-md p-2 text-[18px] font-bold text-[#474242]">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              {/* License */}
              <div className="flex flex-col gap-2">
                <h2 className="text-[#48372D] text-[20px] font-semibold">License</h2>
                <div className="sm:w-1/2 w-full border-[1px] border-[#48372D] rounded-xl flex flex-col py-3 px-3">
                  <p className="text-[18px] text-[#474242]">License</p>
                  <p className="text-[18px] text-[#474242] font-bold">Standard Youtube License</p>
                </div>
                <label className="text-[18px] text-[#474242]">
                  <input type="checkbox" className="mr-2" />
                  Allow embedding
                </label>
              </div>

              {/* Comments */}
              <div className="">
                <h2 className="text-[#48372D] text-[20px] font-semibold">Comments</h2>
                <div className="flex gap-6">
                  <div className="sm:w-1/3 w-1/2 border-[1px] border-[#48372D] rounded-xl p-2">
                    <p className="text-[18px] text-[#474242]">Comments</p>
                    <select className="w-full rounded-md p-2 text-[18px] font-bold text-[#474242]">
                      <option>ON</option>
                      <option>OFF</option>
                    </select>
                  </div>
                  <div className="sm:w-1/3 w-1/2 border-[1px] border-[#48372D] rounded-xl p-2">
                    <p className="text-[18px] text-[#474242]">Sort by</p>
                    <select className="w-full rounded-md p-2 text-[18px] font-bold text-[#474242]">
                      <option>Top</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          
        )}
      {activeTab === "customization" && (
  <div className="min-h-full flex flex-col gap-6 ">
    

    {/* Comments Section */}
    <div className="border-t pt-4">
      <h3 className="font-semibold text-[#48372D] text-[20px] mb-2">Comments</h3>
      <div className="flex flex-col gap-2 text-[#48372D] text-[16px] ml-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#48372D]" />
          <span>Live chat</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#48372D]" />
          <span>Live chat replay</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#48372D]" />
          <span>Live chat summary</span>
        </label>
      </div>
    </div>

    {/* Participant Modes */}
    <div>
      <h3 className="font-semibold text-[#48372D] text-[20px] mb-2">Participant modes</h3>
      <p className="text-[16px] text-[#474242] mb-2">Who can send messages</p>
      <div className="flex flex-col gap-2 text-[#48372D] text-[16px] ml-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#48372D]" />
          <span>Anyone</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#48372D]" />
          <span>Subscribers</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#48372D]" />
          <span>Live commentary (approved users)</span>
        </label>
      </div>
    </div>

    {/* Reactions */}
    <div>
      <h3 className="font-semibold text-[#48372D] text-[20px] mb-2">Reactions</h3>
      <label className="flex items-center text-[#48372D] text-[16px] ml-4  gap-2">
        <input type="checkbox" className="accent-[#48372D]" />
        <span>Live reactions</span>
      </label>
    </div>
  </div>
)}

      </main>

      {/* Footer stays fixed at the bottom */}
      <div className="p-3 flex justify-end bg-white rounded-b-xl sm:border-t sm:border-[#48372D] ">
        <button className="bg-[#48372D] text-white px-6 py-2 rounded-md"
        onClick={() => setActiveTab("customization")}>{activeTab==="details"?"Next":"Done" }</button>
      </div>
    </div>
  );
};

export default Customization;
