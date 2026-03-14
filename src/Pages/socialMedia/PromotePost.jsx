import React, { useEffect, useState } from "react";
import {
  RiArrowLeftLine,
  // RiArrowDownSLine,
  // RiArrowUpSLine,
} from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import { toast } from "react-toastify";

const PromotePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.state?.postId;
  const postImage = location.state?.postImage;
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  // const firstName = localStorage.getItem("firstName");
  // const lastName = localStorage.getItem("lastName");
  const [budget, setBudget] = useState(346);
  const [days, setDays] = useState(3);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goal, setGoal] = useState("Visit your profile");
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [requirementToggle, setRequirementToggle] = useState(false);
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

  const hasValidUsername =
    typeof username === "string" &&
    username.trim() !== "" &&
    username !== "undefined" &&
    username !== "null";

  // 💰 Budget and reach calculations
  const totalBudget = budget * days;
  const estimatedReach = `${Math.floor(budget * 10 * days)}-${Math.floor(
    budget * 20 * days
  )}`;
  const gst = +(totalBudget * 0.18).toFixed(2);
  const Total = +(totalBudget + gst).toFixed(2);

  // 🚀 Promote Post Function
  const handleBoostPost = async () => {
    if (!postId) return toast.error("Missing post ID. Please try again.");
    if (!days || !budget)
      return toast.error("Please select budget and duration.");

    if (website) {
      const urlPattern =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
      if (!urlPattern.test(website)) {
        setError("Enter a valid website URL");
        return;
      }
    }

    const payload = {
      postId,
      category: selectedCategory || null,
      goal,
      website,
      dailyBudget: budget,
      durationDays: days,
      userId,
    };

    try {
      setLoading(true);
      const res = await postAPI(
        "/api/social-media/posts/promote",
        payload,
        true,
        true
      );
      // if (res?.data?.success) {
      //   toast.success("Post promoted successfully!");
      //   navigate("/social-media/profile");
      // } else {
      //   toast.error(res?.data?.message || "Failed to promote post.");
      // }
       if (res?.data?.data?.paymentUrl) {
              window.location.href = res.data.data.paymentUrl;
            } else {
              toast.error(`Failed to create certifications: ${res.message}`);
            }
    } catch (error) {
      toast.error("Error promoting post. Please try again.");
      console.error("PromotePost Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="justify-self-center min-h-screen bg-white">
      <div className="flex flex-col px-2 py-3 text-[#1c1c1c] mx-auto gap-3 h-full">
        {/* Header */}
        <header className="flex flex-col w-full">
          <div className="flex items-center gap-2">

            <RiArrowLeftLine className="text-xl" onClick={() => navigate(-1)} />
            <h2 className="text-xl font-bold">Promote Post</h2>
          </div>
        </header>

        <div className="w-full mx-auto">
          <p className="text-sm font-medium text-[#000000]">
            Promote this post into an ad to increase your reach. We’ll
            automatically format it for different placements across our site and
            run it wherever it’s likely to perform best.
          </p>
        </div>
        <hr className="w-full border-t border-gray-800" />
        {/* Main */}
        <div className="flex grid grid-cols-12 gap-3">
          {/* Left Section */}
          <div className="w-full col-span-12 lg:col-span-8 space-y-3">
            {/* Goal Section */}
            <p className="font-medium mb-2 text-sm text-[#000000]">
              What do you want people to do when they see your ad?
            </p>

            <div>
              <div className="mb-1">
                <span className="bg-[#EBEBEB] text-[#000000] text-xs px-2 py-1 rounded-md">
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
                  <p className="font-semibold text-lg text-[#000000]">
                    Visit Your Profile
                  </p>
                  <p className="text-xs text-[#000000]">
                    Best For Brand Awareness And Follows
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
                  <p className="font-semibold text-lg text-[#000000]">
                    Visit Your Website
                  </p>
                  <p className="text-xs text-[#000000]">
                    Best For Online Sales, Bookings and Leads
                  </p>
                </div>
              </label>

              {goal === "Visit your website" && (
                <div>
                  <label className="block font-medium text-lg mb-1">
                    Enter your website
                  </label>

                  <input
                    type="text"
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                    }}
                    placeholder="https://yourwebsite.com"
                    className="w-full border p-2 rounded-md outline-none"
                  />

                  {/* Error Message */}
                  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                </div>
              )}
            </div>

            {/* Special Requirements */}
            <div>
              <div
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-lg font-semibold">Special requirements</h3>
              </div>

              <div
                className="transition-all duration-300"
              >
                <div className="text-sm text-[#000000] flex justify-between items-center">
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
                      onChange={() => setRequirementToggle(!requirementToggle)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#000000]"></div>
                    <div className="absolute left-1 top-1 bg-gray-100 w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                  </label>
                </div>

                {/* Category list */}
                {requirementToggle && (
                  <div className="transition-all duration-300 space-y-2">
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
              <h3 className="font-semibold text-lg">What’s your ad budget?</h3>
              <div className="py-2 px-3 rounded-sm bg-[#EBEBEB] flex justify-between items-center w-full">
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
            <div>
              <p className="font-semibold text-lg mb-1">Daily budget</p>
              <p className="text-[#000000] text-sm mb-1">
                Budget per day: ₹{budget}
              </p>
              <input
                type="range"
                min="100"
                max="4000"
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-red-500 text-gray-800"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <p className="font-semibold text-lg mb-1">Duration</p>

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
            </div>

            <div className="hidden lg:block">
              {/* Boost Post Button */}
              <button
                onClick={handleBoostPost}
                disabled={loading}
                className={`bg-[#48372D] w-full text-white text-lg font-semibold py-2 rounded transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? "Processing..." : "Boost Post"}
              </button>

              <p className="text-xs text-[#000000] mt-2">
                Ads are reviewed within 24 hours, although in some cases it may
                take longer. Once they’re running, you can pause spending at any
                time.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full col-span-12 lg:col-span-4 space-y-3">
            <h3 className="font-semibold text-lg">Preview ad</h3>
            <div className="rounded ">
              <img
                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${postImage}`}
                alt="Ad Preview"
                className="rounded w-full h-[350px] object-contain bg-[#EBEBEB] rounded-md"
              />
            </div>

            <div className="rounded">
              <h3 className="font-semibold text-lg">Payment method</h3>
              <div className="flex gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtroC78ml1CoAkcniu2KDlpXVAojoYpYZTgA&s"
                  alt="Payment Method"
                  className="h-20"
                />
              </div>
            </div>

            <div className="rounded text-sm space-y-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2">Payment summary</h3>

              <div className="flex flex-row justify-between align-center">
                <p className="text-sm text-[#000000]"> Budget</p>
                <p className="text-sm text-[#000000]">₹{totalBudget}</p>
              </div>
              <div className="flex flex-row justify-between align-center">
                <p className="text-sm text-[#000000]">GST</p>
                <p className="text-sm text-[#000000]">₹{gst}</p>
              </div>
              <div className="flex flex-row justify-between align-center">
                <p className="text-sm text-[#000000] font-semibold">
                  Total amount
                </p>
                <p className="text-sm text-[#000000] font-semibold">₹{Total}</p>
              </div>
            </div>

            <div className="block lg:hidden">
              {/* Boost Post Button */}
              <button
                onClick={handleBoostPost}
                disabled={loading}
                className={`bg-[#48372D] w-full text-white text-lg font-semibold py-2 rounded mt-4 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotePost;
