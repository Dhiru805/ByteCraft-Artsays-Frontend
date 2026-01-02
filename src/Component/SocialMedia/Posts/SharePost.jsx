import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import { timeAgo } from "../../../utils/TimeAgo";
import postAPI from "../../../api/postAPI";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
const SharePost = () => {
  const [sharePostData, setSharePostData] = useState(null);
  const { postId } = useParams();
  const userId = localStorage.getItem("userId");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigate = useNavigate();
  console.log("aaaaaaaaaaaaaaaaasharepostdata", sharePostData);
  useEffect(() => {
    const fetchSharePostData = async () => {
      try {
        const response = await getAPI(
          `/api/social-media/sharePost?postId=${postId}`,
          {},
          true,
          true
        );
        setSharePostData(response.data.post);
      } catch (error) {
        console.error("Error fetching share post data:", error);
      }
    };
    fetchSharePostData();
  }, [postId]);
  // 🔹 Like / Unlike
  const handleLike = async (postId) => {
    try {
      await postAPI(
        `/api/social-media/posts/${postId}/likeUnlike`,
        { userId },
        false,
        true
      );
      setSharePostData((prev) => ({
        ...prev,
        likes: prev.likes.includes(userId)
          ? prev.likes.filter((id) => id !== userId)
          : [...prev.likes, userId],
      }));
    } catch (err) {
      console.error("Error liking/unliking:", err);
    }
  };
  const ensureBuyer = () => {
    if (sharePostData.user.userType !== "Buyer") {
      toast.warn(
        "Only buyers can use this feature, Register as a Buyer to continue."
      );
      return false;
    }
    return true;
  };
  console.log("activeindexxxxxxxxxxxxxxxxxxxxx",activeImageIndex)
  return (
    <div className="max-w-[50%] mx-auto mt-6">
      {sharePostData && (
        <Helmet>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
          {/* <meta name="title" content={blogDetails.blogTitle} /> */}
          <title>{sharePostData.user?.username}</title>
          <meta name="description" content={sharePostData.caption} />
          <meta name="keywords" content={sharePostData.hashtags.join(", ")} />
          <meta
            name="author"
            content={`${sharePostData.user?.name} ${sharePostData.user?.lastName}`}
          />

          <meta property="og:type" content="post" />
          <meta property="og:title" content={sharePostData.user?.username} />
          <meta property="og:description" content={sharePostData.caption} />
          <meta property="og:url" content={window.location.href} />
          <meta
            property="og:image"
            content={
              sharePostData.images.length > 0
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.images[0]}`
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />

          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content={sharePostData.user?.username} />
          <meta name="twitter:description" content={sharePostData.caption} />
          <meta
            name="twitter:image"
            content={
              sharePostData.images.length > 0
                ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData.images[0]}`
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />
        </Helmet>
      )}

      {sharePostData && (
        <div className="w-full flex flex-col mb-4 relative">
          {/* Post Header */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2 p-2 items-center">
              <img
                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${sharePostData?.user?.profilePhoto}`}
                alt="profile"
                className="h-11 w-11 rounded-full cursor-pointer"
                // onClick={() => goToProfile(sharePostData.user._id)}
              />

              <div>
                <div className="flex items-center">
                  <h3
                    className="font-extrabold cursor-pointer"
                    // onClick={() => goToProfile(sharePostData.user._id)}
                  >
                    {sharePostData?.user?.username}
                  </h3>

                  {sharePostData?.user?.verified?.length > 0 && (
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                        sharePostData?.user?.verified[
                          sharePostData?.user?.verified.length - 1
                        ]?.badgeImage
                      }`}
                      className="inline-block ml-1 w-5 h-5 object-contain"
                      alt={
                        sharePostData?.user?.verified[
                          sharePostData?.user?.verified.length - 1
                        ]?.badgeName || "badge"
                      }
                    />
                  )}
                </div>

                {/* Time + Sponsored */}
                <div className="flex items-center gap-1 text-xs font-light text-gray-500">
                  <p>• {timeAgo(sharePostData.createdAt)}</p>
                  {sharePostData.isPromoted && (
                    <span className="text-[11px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                      Sponsored
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA + Buttons */}
            <div className="flex items-center gap-3 mr-1">
              {sharePostData?.isPromoted && (
                <>
                  {sharePostData?.promotionDetails?.goal ===
                    "Visit your website" && sharePostData?.user.website ? (
                    <button
                      onClick={() =>
                        window.open(sharePostData?.user.website, "_blank")
                      }
                      className="buy-button"
                    >
                      Visit Website
                    </button>
                  ) : sharePostData?.promotionDetails?.goal ===
                    "Visit your profile" ? (
                    <button
                      // onClick={() => goToProfile(sharePostData.user._id)}
                      className="buy-button"
                    >
                      Visit Profile
                    </button>
                  ) : null}
                </>
              )}
              {/* {sharePostData?.showFollowButton ? (
                <button
                  onClick={() => handleFollowToggle(sharePostData.user._id, false)}
                  className="buy-button"
                >
                  Follow
                </button>
              ) : (
                ""
              )} */}

              {sharePostData.forProduct && (
                <button
                  className="flex px-2 items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now"
                  onClick={() => {
                    if (!ensureBuyer()) return;
                    navigate(
                      `/my-account/check-out/${userId}?productId=${
                        sharePostData?.forProduct
                      }&quantity=${1}`
                    );
                  }}
                >
                  <Zap size={18} /> Buy Now
                </button>
              )}
            </div>
          </div>
          {/* Post Image Carousel */}
          <div className="mx-1 relative">
            {sharePostData?.images && sharePostData?.images?.length > 0 && (
              <>
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${
                    sharePostData.images[activeImageIndex || 0]
                  }`}
                  alt="Post content"
                  className="w-full lg:h-[600px] sm:h-[480px] h-[300px] rounded-lg "
                />

                {/* Left Arrow (only if not on first image) */}
                {sharePostData?.images?.length > 1 &&
                  (activeImageIndex ) > 0 && (
                    <button
                      onClick={
                        () => setActiveImageIndex(activeImageIndex  - 1)
                        // setSharePostData((prev) =>
                        //   prev.map((p) =>
                        //     p._id === sharePostData?._id
                        //       ? {
                        //           ...p,
                        //           activeImageIndex:
                        //             (p.activeImageIndex || 0) - 1,
                        //         }
                        //       : p
                        //   )
                        // )
                      }
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2"
                    >
                      <i className="ri-arrow-left-s-line text-xl"></i>
                    </button>
                  )}

                {/* Right Arrow (only if not on last image) */}
                {sharePostData?.images?.length > 1 &&
                  (activeImageIndex || 0) <
                    sharePostData?.images.length - 1 && (
                    <button
                      onClick={
                        () => setActiveImageIndex(activeImageIndex + 1)

                        // setSharePostData((prev) =>
                        //   prev.images.map((p) =>
                        //     p._id === sharePostData?._id
                        //       ? {
                        //           ...p,
                        //           activeImageIndex:
                        //             (p?.activeImageIndex || 0) + 1,
                        //         }
                        //       : p
                        //   )
                        // )
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2"
                    >
                      <i className="ri-arrow-right-s-line text-xl"></i>
                    </button>
                  )}

                {/* Dots */}
                {sharePostData?.images?.length > 1 && (
                  <div className="absolute bottom-2 w-full flex justify-center gap-1">
                    {sharePostData?.images?.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-2 w-2 rounded-full ${
                          (activeImageIndex || 0) === idx
                            ? "bg-gray-100"
                            : "bg-gray-400"
                        }`}
                      ></span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {/* Post Actions */}
          <div className="flex flex-col gap-1.5 mx-1">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-4">
                <button onClick={() => handleLike(postId)}>
                  <i
                    className={`${
                      sharePostData.likes.includes(userId)
                        ? "ri-heart-fill text-red-500"
                        : "ri-heart-line"
                    } text-xl font-medium`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Likes */}
            <div className="text-[13px] font-bold">
              {sharePostData?.likes.length} likes
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SharePost;
