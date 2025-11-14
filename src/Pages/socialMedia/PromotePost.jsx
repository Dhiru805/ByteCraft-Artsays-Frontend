import React, { useEffect, useState } from "react";
import {
  RiArrowLeftLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import { toast } from "react-toastify";

const PromotePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.state?.postId;
  const postImage = location.state?.postImage[0];
  const userId = localStorage.getItem("userId");

  const [budget, setBudget] = useState(346);
  const [days, setDays] = useState(3);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goal, setGoal] = useState("Visit your profile");
  const [loading, setLoading] = useState(false);

  const [showRequirements, setShowRequirements] = useState(false);
  const [requirementToggle, setRequirementToggle] = useState(false);
  const [durationToggle, setDurationToggle] = useState(false);

  // 🧭 Fetch all main categories
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getAPI("/api/main-category", true);
        if (!response.hasError) {
          setCategories(response.data.data);
        } else {
          toast.error(`Failed to fetch Main Categories: ${response.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while fetching main categories.");
      }
    };
    fetchMainCategories();
  }, []);

  // 💰 Budget and reach calculations
  const totalBudget = budget * days;
  const estimatedReach = `${1800 + days * 100}-${4800 + days * 150}`;
  const gst = (budget * 0.18).toFixed(2);
  const dailyTotal = (budget + parseFloat(gst)).toFixed(2);

  // 🚀 Promote Post Function
// 🚀 Promote Post Function
const handleBoostPost = async () => {
  if (!postId) return toast.error("Missing post ID. Please try again.");
  if (!days || !budget) return toast.error("Please select budget and duration.");

  const payload = {
    postId,
    category: selectedCategory || null, // ✅ make category optional
    goal,
    dailyBudget: budget,
    durationDays: days,
    userId,
  };

  try {
    setLoading(true);
    const res = await postAPI("/api/social-media/posts/promote", payload, true, true);
    if (res?.data?.success) {
      toast.success("Post promoted successfully!");
      navigate("/social-media/profile");
    } else {
      toast.error(res?.data?.message || "Failed to promote post.");
    }
  } catch (error) {
    toast.error("Error promoting post. Please try again.");
    console.error("PromotePost Error:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col px-6 py-6 text-[#1c1c1c] lg:w-[85%] mx-auto gap-3 h-full">
        {/* Header */}
        <header className="flex flex-col w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to={"/social-media/profile"}>
              <RiArrowLeftLine className="text-xl" />
            </Link>
            <h2 className="text-xl font-bold">Promote Post</h2>
          </div>
        </header>

        <div className="w-[97%] mx-auto">
          <p className="text-sm font-medium text-[#000000] mb-6">
            Promote this post into an ad to increase your reach. We’ll
            automatically format it for different placements across our site and
            run it wherever it’s likely to perform best.
          </p>
        </div>

        {/* Main */}
        <div className="flex flex-col lg:flex-row gap-12 w-[97%] mx-auto">
          {/* Left Section */}
          <div className="flex flex-col w-full lg:w-[60%] space-y-6">
            {/* Goal Section */}
            <p className="font-semibold mb-2 text-lg text-[#000000]">
              What do you want people to do when they see your ad?
            </p>

            <div>
              <div>
                <span className="bg-[#DEDEDE] text-[#414141] text-[11px] px-2 py-0.5 rounded-xl">
                  Recommended
                </span>
              </div>
              <label className="flex items-center justify-between flex-row-reverse gap-2 mb-2">
                <input
                  type="radio"
                  name="goal"
                  checked={goal === "Visit your profile"}
                  onChange={() => setGoal("Visit your profile")}
                />
                <div>
                  <p className="font-medium text-lg text-[#000000]">
                    Visit your profile
                  </p>
                  <p className="text-sm text-[#000000] font-medium">
                    Best for brand awareness and follows
                  </p>
                </div>
              </label>
              <label className="flex items-center justify-between flex-row-reverse gap-2">
                <input
                  type="radio"
                  name="goal"
                  checked={goal === "Visit your website"}
                  onChange={() => setGoal("Visit your website")}
                />
                <div>
                  <p className="font-medium text-lg text-[#000000]">
                    Visit your website
                  </p>
                  <p className="text-sm text-[#000000] font-medium">
                    Best for online sales, bookings and leads
                  </p>
                </div>
              </label>
            </div>

            {/* Special Requirements */}
            <div>
              <div
                onClick={() => setShowRequirements(!showRequirements)}
                className="flex justify-between items-center cursor-pointer select-none"
              >
                <h3 className="text-lg font-semibold">Special requirements</h3>
                {showRequirements ? (
                  <RiArrowUpSLine size={20} />
                ) : (
                  <RiArrowDownSLine size={20} />
                )}
              </div>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  showRequirements ? "max-h-[600px] mt-3" : "max-h-0"
                }`}
              >
                <div className="text-sm text-[#000000] flex justify-between items-center mb-3">
                  <span>
                    Review if your ads are about financial products and
                    services, employment, housing, social issues, elections or
                    politics.
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requirementToggle}
                      onChange={() =>
                        setRequirementToggle(!requirementToggle)
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#000000]"></div>
                    <div className="absolute left-1 top-1 bg-gray-100 w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                  </label>
                </div>

                {/* Category list */}
                {requirementToggle && (
                  <div className="transition-all duration-300 space-y-4 mt-4">
                    {categories.map((cat) => (
                      <label
                        key={cat._id}
                        className="flex gap-2 items-center justify-between flex-row-reverse"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat._id}
                          onChange={() => setSelectedCategory(cat._id)}
                        />
                        <div>
                          <p className="font-semibold text-[16px]">
                            {cat.mainCategoryName}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">
                What’s your ad budget?
              </h3>
              <div className="p-4 rounded-sm bg-[#F4F6F8] flex justify-between items-center w-full">
                <div>
                  <p className="text-lg font-semibold">
                    ₹ {totalBudget} over {days} days
                  </p>
                  <p className="text-sm text-[#000000]">Ad budget</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{estimatedReach}</p>
                  <p className="text-sm text-[#000000]">Estimated reach</p>
                </div>
              </div>
            </div>

            {/* Daily Budget Slider */}
            <div className="mb-3">
              <p className="font-semibold text-lg mb-1">Daily budget</p>
              <p className="text-[#000000] text-sm mb-1">
                Budget per day: ₹{budget}
              </p>
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-red-500 text-gray-800"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <p className="font-semibold text-lg mb-1">Duration</p>
              <label className="flex items-center justify-between flex-row-reverse gap-2">
                <input
                  type="radio"
                  name="duration"
                  onClick={() => setDurationToggle(false)}
                />
                <p className="text-sm text-[#000000] font-medium">
                  Run this ad until I pause it
                </p>
              </label>
              <label className="flex items-center justify-between flex-row-reverse">
                <input
                  type="radio"
                  name="duration"
                  onClick={() => setDurationToggle(!durationToggle)}
                />
                <p className="text-sm text-[#000000] font-medium">
                  Set duration
                </p>
              </label>
              {durationToggle && (
                <div>
                  <p className="text-sm text-[#000000] mb-1">
                    Number of days: {days} days
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>
              )}
            </div>

            {/* Boost Post Button */}
            <button
              onClick={handleBoostPost}
              disabled={loading}
              className={`bg-[#48372D] text-white text-lg font-semibold py-3 rounded mt-4 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Boost Post"}
            </button>

            <p className="text-xs text-[#000000]">
              Ads are reviewed within 24 hours, although in some cases it may
              take longer. Once they’re running, you can pause spending at any
              time.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-[1px] bg-gray-800 "></div>

          {/* Right Section */}
          <div className="hidden lg:flex flex-col w-[40%]">
            <div className="rounded p-4">
              <h3 className="font-semibold text-lg mb-4">Preview ad</h3>
              <img
                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${postImage}`}
                alt="Ad Preview"
                className="rounded w-full h-[350px] object-cover"
              />
            </div>

            <div className="rounded p-4">
              <h3 className="font-semibold mb-2 text-lg">Payment method</h3>
              <div className="flex gap-4">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtroC78ml1CoAkcniu2KDlpXVAojoYpYZTgA&s"
                  alt="Payment Method"
                  className="h-20"
                />
              </div>
            </div>

            <div className="rounded p-4 text-sm space-y-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2">Payment summary</h3>
              <p className="text-sm text-[#000000]">
                Your ad will run until you pause it.
              </p>
              <div className="flex flex-row justify-between align-center">
                <p className="text-sm text-[#000000]">Daily budget</p>
                <p className="text-sm text-[#000000]">₹{budget}</p>
              </div>
              <div className="flex flex-row justify-between align-center">
                <p className="text-sm text-[#000000]">Estimated GST</p>
                <p className="text-sm text-[#000000]">₹{gst}</p>
              </div>
              <div className="flex flex-row justify-between align-center">
                <p className="text-sm text-[#000000] font-semibold">
                  Estimated daily amount
                </p>
                <p className="text-sm text-[#000000] font-semibold">
                  ₹{dailyTotal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotePost;
