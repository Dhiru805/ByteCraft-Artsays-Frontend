
const MeetTeam = () => {
  return (
    <div className="max-w-[1440px] mx-auto py-3 my-5">
      <div>
        <h1 className="text-lg md:text-4xl font-bold text-center text-orange-500 px-3">
          Meet Our Founders
        </h1>

        <hr className="my-3 border-dark" />

        <p className="mt-3 text-xs md:text-base text-center font-medium text-black leading-relaxed px-3">
          ArtSays is a creator-first platform built for artists of every style,
          from digital dreamers to traditional painters. We believe that art is
          more than visuals — it’s stories, emotions, and connections. Our
          mission? To make sure every artist finds their stage and every
          audience finds art that speaks to them.
        </p>
      </div>
      <div>
        <section className="py-16 bg-white text-center">
          {/* Team Members */}
          <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
            {/* Member 1 */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full border-8 border-[#6F4D34] overflow-hidden">
                <img
                  src="/herosectionimg/shraddha.jpg"
                  alt="Shraddha Lohar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-red-600">
                Shraddha Lohar
              </h3>
              <p className="text-black mt-1 text-lg">Co-Founder &amp; CEO</p>
            </div>

            {/* Member 2 */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full border-8 border-[#6F4D34] overflow-hidden">
                <img
                  src="/herosectionimg/dhiraj.jpg"
                  alt="Dhiraj Zope"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-red-600">
                Dhiraj Zope
              </h3>
              <p className="text-black mt-1 text-lg">
                Co-Founder &amp; CTO &amp; COO
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default MeetTeam;
