import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import millify from "millify";
import { FaFacebookSquare, FaLinkedin, FaShareAlt } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoWhatsapp, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { BiSolidEdit } from "react-icons/bi";
import { Helmet } from "react-helmet-async";
import { intervalToDuration } from "date-fns";

import blog1 from "../../assets/blog/blog-1.jpg";
import artist from "../../assets/blog/artist-image.png";
import "./BlogCardDetails.css";
import getAPI from "../../api/getAPI";
import putAPI from "../../api/putAPI";

function BlogCardDetails() {

    const [open, setOpen] = useState(false);
    const { blogId } = useParams()
    const [blogDetails, setBlogDetails] = useState(null)

    const [readingTime, setReadingTime] = useState(0)
    const startTimeRef = useRef(null)
    const [artistId, setArtistId] = useState(null)
    const [userDetails, setUserDetails] = useState(null)

    // Function to fetch blog details
    const fetchBlogDetails = async () => {

        try {
            const { data } = await getAPI('/Blog-Post/statusapproved-blogs')

            if (data?.blogs) {
                const matchedBlog = data.blogs.find((blog) => blog.slug === blogId)

                if (matchedBlog) {
                    fetchBlogViews(matchedBlog._id)
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    // Function to fetch blog views
    const fetchBlogViews = async (id) => {
        try {
            const response = await putAPI(`/Blog-Post/blogs/${id}/views`);
            if (response.data) {
                setBlogDetails(response.data)
                setArtistId(response.data.uploadedBy.id)
                localStorage.setItem("blog-id", response.data._id);
                if (response.data.readingTime) {
                    setReadingTime(response.data.readingTime)
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    // useEffect to call fetchBlogDetails function
    useEffect(() => {

        if (blogId) {
            const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs")) || [];

            // Check if this blogId is already in viewedBlogs
            if (!viewedBlogs.includes(blogId)) {
                fetchBlogDetails();

                // Save blogId in Local storage
                localStorage.setItem("viewedBlogs", JSON.stringify([...viewedBlogs, blogId]));
            }
            else {
                // Already viewed, just fetch details without incrementing
                getAPI("/Blog-Post/statusapproved-blogs")
                    .then(({ data }) => {
                        const filteredBlog = data?.blogs?.find(blog => blog.slug === blogId);
                        if (filteredBlog) {
                            setBlogDetails(filteredBlog)
                            setArtistId(filteredBlog.uploadedBy.id)
                            localStorage.setItem("blog-id", filteredBlog._id)
                            if (filteredBlog.readingTime) {
                                setReadingTime(filteredBlog.readingTime)
                            }
                        }
                    })
                    .catch(console.log)
            }
        }

        // Start blog reading time tracking
        startTimeRef.current = Date.now();

        return () => {
            saveReadingTime()
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId]);

    // Function to fetch heading elements
    // eslint-disable-next-line no-unused-vars
    const renderHeadingElements = (description) => {
        if (!description) return null;

        const parser = new DOMParser();
        const doc = parser.parseFromString(description, "text/html");
        const headings = Array.from(doc.querySelectorAll('h2'))

        return headings;
    };

    // Function to format the blog views count
    const formatBlogViews = (views) => {
        return millify(views, { precision: 1 });
    };

    // Function to add blog likes
    const handleBlogLikes = async () => {

        try {
            let blog_id = localStorage.getItem("blog-id");
            const response = await putAPI(`/Blog-Post/blogs/${blog_id}/likes`);
            if (response.data) {
                setBlogDetails(response.data)
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    // Function to store the blog reading time on exit
    const saveReadingTime = async () => {

        let blog_id = localStorage.getItem("blog-id")
        const endTime = Date.now();
        const sessionTime = Math.floor((endTime - startTimeRef.current) / 1000);

        if (sessionTime > 0) {

            try {
                const response = await putAPI(`/Blog-Post/blogs/${blog_id}/reading-time`, { readingTime: sessionTime });
                if (response.data) {
                    setReadingTime(response.data.readingTime);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    };

    // Function to format the blog reading time
    const formatTime = (timeInSeconds) => {
        const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 });

        let result = [];
        if (duration.hours) result.push(`${duration.hours}h`);
        if (duration.minutes) result.push(`${duration.minutes}m`);
        if (duration.seconds || result.length === 0) result.push(`${duration.seconds}s`);

        return result.join(" ");
    };

    // Function to fetch user details
    const fetchUserDetails = async () => {
        try {
            const { data } = await getAPI(`/auth/userid/${artistId}`)
            console.log(data)
            if (data.user) {
                setUserDetails(data.user)
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    // useEffect to call fetchUserDetails function
    useEffect(() => {
        if (artistId) {
            fetchUserDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [artistId]);

    /* -------------------- STATE -------------------- */
    const [activeHeading, setActiveHeading] = useState(null);

    /* -------------------- HELPERS -------------------- */

    // Inject IDs into headings
    const addIdsToHeadings = (html) => {
        if (!html) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const headings = doc.querySelectorAll("h1, h2");

        headings.forEach((heading, index) => {
            const id = heading.innerText
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "");

            heading.id = `${id}-${index}`;
        });

        return doc.body.innerHTML;
    };

    // Build TOC list
    const getTocItems = (html) => {
        if (!html) return [];

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        return Array.from(doc.querySelectorAll("h1, h2")).map(
            (heading, index) => {
                const id = heading.innerText
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "");

                return {
                    id: `${id}-${index}`,
                    text: heading.innerText,
                };
            }
        );
    };

    // Scroll with offset (for fixed headers)
    const scrollToHeading = (id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const offset = -80;
        const y =
            el.getBoundingClientRect().top + window.pageYOffset + offset;

        window.scrollTo({ top: y, behavior: "smooth" });
    };

    // Observe headings to set active state
    useEffect(() => {
        if (!blogDetails?.blogDescription) return;

        const headings = document.querySelectorAll("h1, h2");
        if (!headings.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-120px 0px -60% 0px",
                threshold: 0.1,
            }
        );

        headings.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [blogDetails]);

    const shareUrl = window.location.href;
const shareTitle = blogDetails?.title || "Check out this blog on ArtSays";
const shareText = blogDetails?.shortDescription || "Interesting read from ArtSays";

const openShareWindow = (url) => {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
};

const handleFacebookShare = () => {
  openShareWindow(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`
  );
};

const handleLinkedInShare = () => {
  openShareWindow(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`
  );
};

const handleTwitterShare = () => {
  openShareWindow(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareTitle)}`
  );
};

const handleWhatsappShare = () => {
  openShareWindow(
    `https://wa.me/?text=${encodeURIComponent(
      `${shareTitle} - ${shareUrl}`
    )}`
  );
};

const handleNativeShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      console.log("Share cancelled");
    }
  } else {
    alert("Sharing not supported on this browser");
  }
};



    return (
        <div className="w-full">

            {blogDetails && (
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="robots" content="index, follow" />
                    <meta name="title" content={blogDetails.blogTitle} />
                    <title>{blogDetails.blogName || 'My Blog'}</title>
                    <meta name="description" content={blogDetails.summary} />
                    <meta name="keywords" content={blogDetails.tags.join(', ')} />
                    <meta name="author" content={blogDetails.blogAuthor} />

                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={blogDetails.blogName} />
                    <meta property="og:description" content={blogDetails.summary} />
                    <meta property="og:url" content={window.location.href} />
                    {blogDetails.blogImage && (
                        <meta property="og:image"
                            content={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${blogDetails.blogImage.replace(/\\/g, "/")}`}
                        />
                    )}

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={blogDetails.blogName} />
                    <meta name="twitter:description" content={blogDetails.summary} />
                    {blogDetails.blogImage && (
                        <meta name="twitter:image"
                            content={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${blogDetails.blogImage.replace(/\\/g, "/")}`}
                        />
                    )}
                </Helmet>
            )}

            <div className="w-full bg-[#48372D]">
                <div className="w-full max-w-[1440px] mx-auto p-3 md:!p-6">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-center">
                        <div className="text-white flex flex-col justify-center">
                            <h2 className="text-[25px] lg:text-[34px] font-bold mb-3">
                                {blogDetails ? blogDetails.blogName : 'Blog Title'}
                            </h2>
                            <div className="text-white overflow-hidden text-break">{blogDetails ? blogDetails.summary : 'Blog summary'}</div>
                            <div className="flex gap-2 my-2">
                                <span>{blogDetails ? blogDetails.blogAuthor : 'Author Name'}</span>
                                <span>|</span>
                                <span>{blogDetails && moment(blogDetails.createdAt).format("MMM D, YYYY")}</span>
                            </div>
                            <div className="flex gap-2">
                                <span>{blogDetails ? formatTime(readingTime) : 0}</span>
                                <span>|</span>
                                <span>{blogDetails ? formatBlogViews(blogDetails.views) : 0} view</span>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="bg-[#EBEBEB] rounded-2xl">
                                <div className="relative h-full md:h-[400px] content-center">
                                    <div className="w-full h-48 md:h-80 overflow-hidden">
                                        <img src={blogDetails ? `${process.env.REACT_APP_API_URL}/${blogDetails.blogImage}` : blog1}
                                            alt="Blog" className="w-full h-full object-cover"
                                            onError={(e) => e.currentTarget.src = blog1} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="w-full max-w-[1440px] mx-auto p-3 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-1">
                    <div className="col-span-12 md:col-span-9 space-y-6 order-2 md:!order-1">
                        {blogDetails &&
                            <div dangerouslySetInnerHTML={{ __html: blogDetails.blogDescription }}
                                className="rich-text break-all overflow-hidden">
                            </div>
                        }
                        <div>
                            <h4 className="font-semibold text-lg">Keywords:</h4>
                            <div className="flex gap-3 mt-2">
                                {
                                    blogDetails && blogDetails.tags.map((tag, index) => (
                                        <span className="bg-[#EBEBEB] border border-blue-200 px-3 py-1 rounded-full font-medium">#{tag}</span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block col-span-12 md:col-span-3 space-y-4 order-1 md:order-2 md:sticky md:top-6 self-start overflow-visible">
                        <div className="w-full bg-[#48372D] rounded-lg p-3 text-white flex flex-col justify-center items-center text-center">
                            <img src={userDetails ? `${process.env.REACT_APP_API_URL}/${userDetails.profilePhoto}` : artist}
                                alt="Artist" id="artist-image" className="m-3"
                                onError={(e) => e.currentTarget.src = artist} />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h5 className="text-[16px] lg:text-lg font-semibold line-clamp-1 py-1 md:py-2">
                                        {blogDetails ? blogDetails.blogAuthor : 'Author Name'}
                                    </h5>
                                    <BiSolidEdit className="cursor-pointer text-[16px] lg:text-lg" />
                                </div>
                                <div className="text-[14px] lg:text-[16px] py-1 md:py-2">
                                    {userDetails?.role
                                        ? userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1) : 'Role'}
                                </div>
                                <div className="text-[14px] lg:text-[16px] py-1 md:py-2">{blogDetails ? blogDetails.category : 'Category'}</div>
                                <div className="flex items-center justify-center gap-4 py-1 md:py-2">
                                    <div className="flex items-center gap-1">
                                        <button className="focus:outline-0" onClick={handleBlogLikes}><ThumbsUp size={20} /></button>
                                        <span className="font-semibold">{blogDetails ? blogDetails.likes : 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="focus:outline-0">
                                            <MessageCircle size={20} />
                                        </button>
                                        <span className="font-semibold">{blogDetails ? blogDetails.comments.length : 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#48372D] rounded-lg text-white p-3 md:!p-4">
                            <h5 className="text-lg md:text-lg font-semibold flex justify-between items-center cursor-pointer"
                                onClick={() => setOpen(!open)}>
                                Table of Contents {open ? <IoIosArrowUp className="text-lg md:text-2xl" /> : <IoIosArrowDown className="text-[12px] lg:text-16px]" />}
                            </h5>
                            {
                                open && (
                                    <div className="mt-3 md:mt-4 text-sm space-y-2 text-gray-300">
                                        {blogDetails && (
                                            renderHeadingElements(blogDetails.blogDescription).map((content, index) => (
                                                <p>{content.innerText}</p>
                                            ))
                                        )}
                                    </div>
                                )
                            }
                        </div>

                        <div className="bg-[#48372D] rounded-lg text-white px-2 py-3 lg:px-5 lg:py-4">
                            <h5 className="text-[14px] lg:text-lg font-semibold">Share:</h5>
                            <div className="flex gap-2 mt-2">
                                <FaFacebookSquare className="text-[17px] lg:text-xl" />
                                <FaLinkedin className="text-[17px] lg:text-xl" />
                                <FaSquareXTwitter className="text-[17px] lg:text-xl" />
                                <IoLogoWhatsapp className="text-[17px] lg:text-xl" />
                                <FaShareAlt className="text-[17px] lg:text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="block md:hidden col-span-12 bg-[#48372D] rounded-lg text-white p-3 md:!p-4" id="blog_tocSticky">
                        <h5 className="text-lg md:text-lg font-semibold flex justify-between items-center cursor-pointer"
                            onClick={() => setOpen(!open)}>
                            Table of Contents {open ? <IoIosArrowUp className="text-lg md:text-2xl" /> : <IoIosArrowDown className="text-[12px] lg:text-16px]" />}
                        </h5>
                        {
                            open && (
                                <div className="mt-3 md:mt-4 text-sm space-y-2 text-gray-300">
                                    {blogDetails && (
                                        renderHeadingElements(blogDetails.blogDescription).map((content, index) => (
                                            <p>{content.innerText}</p>
                                        ))
                                    )}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div> */}

            <div className="w-full max-w-[1440px] mx-auto p-3 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-1">

                    {/* ================= BLOG CONTENT ================= */}
                    <div className="col-span-12 md:col-span-9 space-y-6 order-2 md:order-1">

                        {blogDetails && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: addIdsToHeadings(blogDetails.blogDescription),
                                }}
                                className="rich-text break-words"
                            />
                        )}

                        <div>
                            <h4 className="font-semibold text-lg">Keywords:</h4>
                            <div className="flex gap-3 mt-2 flex-wrap">
                                {blogDetails?.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#EBEBEB] border border-blue-200 px-3 py-1 rounded-full font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= DESKTOP SIDEBAR ================= */}
                    <div className="hidden md:block col-span-12 md:col-span-3 space-y-4 order-1 md:order-2 md:sticky md:top-6 self-start">

                        {/* AUTHOR CARD */}
                        <div className="w-full bg-[#48372D] rounded-lg p-3 text-white flex flex-col justify-center items-center text-center">
                            <img src={userDetails ? `${process.env.REACT_APP_API_URL}/${userDetails.profilePhoto}` : artist}
                                alt="Artist" id="artist-image" className="m-3"
                                onError={(e) => e.currentTarget.src = artist} />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h5 className="text-[16px] lg:text-lg font-semibold line-clamp-1 py-1 md:py-2">
                                        {blogDetails ? blogDetails.blogAuthor : 'Author Name'}
                                    </h5>
                                    <BiSolidEdit className="cursor-pointer text-[16px] lg:text-lg" />
                                </div>
                                <div className="text-[14px] lg:text-[16px] py-1 md:py-2">
                                    {userDetails?.role
                                        ? userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1) : 'Role'}
                                </div>
                                <div className="text-[14px] lg:text-[16px] py-1 md:py-2">{blogDetails ? blogDetails.category : 'Category'}</div>
                                <div className="flex items-center justify-center gap-4 py-1 md:py-2">
                                    <div className="flex items-center gap-1">
                                        <button className="focus:outline-0" onClick={handleBlogLikes}><ThumbsUp size={20} /></button>
                                        <span className="font-semibold">{blogDetails ? blogDetails.likes : 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="focus:outline-0">
                                            <MessageCircle size={20} />
                                        </button>
                                        <span className="font-semibold">{blogDetails ? blogDetails.comments.length : 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* DESKTOP TOC */}
                        <div className="bg-[#48372D] rounded-lg text-white p-4">
                            <h5
                                className="text-lg font-semibold flex justify-between items-center cursor-pointer"
                                onClick={() => setOpen(!open)}
                            >
                                Table of Contents
                                {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </h5>

                            {open && (
                                <div className="mt-3 text-sm space-y-1">
                                    {blogDetails &&
                                        getTocItems(blogDetails.blogDescription).map((item, index) => {
                                            const isActive = activeHeading === item.id;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => scrollToHeading(item.id)}
                                                    className={`block w-full text-left py-1 rounded transition
                      ${isActive
                                                            ? "bg-white text-[#48372D] px-2 font-semibold"
                                                            : "text-gray-300 hover:text-white"
                                                        }`}
                                                >
                                                    • {item.text}
                                                </button>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        {/* SHARE */}
                        <div className="bg-[#48372D] rounded-lg text-white p-4">
  <h5 className="text-[14px] lg:text-lg font-semibold">Share:</h5>

  <div className="flex gap-3 mt-3 items-center">
    <button
      onClick={handleFacebookShare}
      className="hover:scale-110 transition"
      aria-label="Share on Facebook"
    >
      <FaFacebookSquare className="text-[17px] lg:text-xl" />
    </button>

    <button
      onClick={handleLinkedInShare}
      className="hover:scale-110 transition"
      aria-label="Share on LinkedIn"
    >
      <FaLinkedin className="text-[17px] lg:text-xl" />
    </button>

    <button
      onClick={handleTwitterShare}
      className="hover:scale-110 transition"
      aria-label="Share on Twitter"
    >
      <FaSquareXTwitter className="text-[17px] lg:text-xl" />
    </button>

    <button
      onClick={handleWhatsappShare}
      className="hover:scale-110 transition"
      aria-label="Share on WhatsApp"
    >
      <IoLogoWhatsapp className="text-[17px] lg:text-xl" />
    </button>

    <button
      onClick={handleNativeShare}
      className="hover:scale-110 transition"
      aria-label="More share options"
    >
      <FaShareAlt className="text-[17px] lg:text-xl" />
    </button>
  </div>
</div>

                    </div>

                    {/* ================= MOBILE TOC ================= */}
                    <div className="block md:hidden col-span-12 bg-[#48372D] rounded-lg text-white p-3 md:!p-4" id="blog_tocSticky">
                        <h5
                            className="text-lg font-semibold flex justify-between items-center cursor-pointer"
                            onClick={() => setOpen(!open)}
                        >
                            Table of Contents
                            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </h5>

                        {open && (
                            <div className="mt-3 text-sm space-y-1">
                                {blogDetails &&
                                    getTocItems(blogDetails.blogDescription).map((item, index) => {
                                        const isActive = activeHeading === item.id;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    scrollToHeading(item.id);
                                                    setOpen(false);
                                                }}
                                                className={`block w-full text-left py-1 rounded transition
                    ${isActive
                                                        ? "bg-[#ffffff] text-[#48372D] px-2 font-semibold"
                                                        : "text-gray-300 hover:text-white"
                                                    }`}
                                            >
                                                • {item.text}
                                            </button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}

export default BlogCardDetails;
