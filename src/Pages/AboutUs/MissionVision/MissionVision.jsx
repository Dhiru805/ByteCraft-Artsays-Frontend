const MissionVision = () => {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-3 my-5">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="order-2 md:!order-1 content-center justify-items-center mx-5">
            <div className="bg-[#ffffff] p-4 border rounded-2xl shadow">
              <h1 className="flex text-[#6F4D34] text-2xl font-bold text-center justify-center pb-3 items-center">
                <img src="/herosectionimg/micon.svg" className="pr-3" />Our Mission
              </h1>
              <p className="text-center">
                Empower artists to grow without limits, by giving them a
                supportive space to share and sell their work.
              </p>
            </div>
          </div>
          <div className="order-1 md:!order-2 content-center justify-items-center">
            <img src="/herosectionimg/mission.svg" alt="" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="content-center justify-items-center">
            <img src="/herosectionimg/vision.svg" alt="" />
          </div>
          <div className="content-center justify-items-center mx-5">
            <div className="bg-[#ffffff] p-4 border rounded-2xl shadow">
              <h1 className="flex text-[#6F4D34] text-2xl font-bold text-center justify-center pb-3 items-center">
                <img src="/herosectionimg/vicon.svg" className="pr-3" />Our Vision
              </h1>
              <p className="text-center">
                To build the most vibrant online art community — one that
                celebrates creativity over algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MissionVision;
