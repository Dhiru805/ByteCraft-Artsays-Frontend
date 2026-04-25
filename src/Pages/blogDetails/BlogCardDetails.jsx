import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import millify from "millify";
import { FaFacebookF, FaLinkedinIn, FaShareAlt, FaWhatsapp, FaRegClock, FaRegEye, FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Helmet } from "react-helmet-async";
import { intervalToDuration } from "date-fns";

import { BlogDetailsSkeleton } from "../../Component/Skeleton/Blog/BlogDetailsSkeleton";
import blog1 from "../../assets/blog/blog-1.jpg";
import artist from "../../assets/blog/artist-image.png";
import "./BlogCardDetails.css";
import getAPI from "../../api/getAPI";
import putAPI from "../../api/putAPI";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";
import { getImageUrl } from "../../utils/getImageUrl";

function BlogCardDetails() {
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { blogId } = useParams();
    const [blogDetails, setBlogDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [readingTime, setReadingTime] = useState(0);
    const startTimeRef = useRef(null);
    const [artistId, setArtistId] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [activeHeading, setActiveHeading] = useState(null);

    // Reading Progress
    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setScrollProgress((currentScroll / scrollHeight) * 100);
            }
        };
        window.addEventListener("scroll", updateProgress);
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    // Function to fetch blog details
    const fetchBlogDetails = async () => {
        setLoading(true);
        try {
            const { data } = await getAPI('/Blog-Post/statusapproved-blogs');
            if (data?.blogs) {
                const matchedBlog = data.blogs.find((blog) => blog.slug === blogId);
                if (matchedBlog) {
                    await fetchBlogViews(matchedBlog._id);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch blog views
    const fetchBlogViews = async (id) => {
        try {
            const response = await putAPI(`/Blog-Post/blogs/${id}/views`);
            if (response.data) {
                setBlogDetails(response.data);
                setArtistId(response.data.uploadedBy.id);
                localStorage.setItem("blog-id", response.data._id);
                if (response.data.readingTime) {
                    setReadingTime(response.data.readingTime);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (blogId) {
            const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs")) || [];
            if (!viewedBlogs.includes(blogId)) {
                fetchBlogDetails();
                localStorage.setItem("viewedBlogs", JSON.stringify([...viewedBlogs, blogId]));
            } else {
                setLoading(true);
                getAPI("/Blog-Post/statusapproved-blogs")
                    .then(({ data }) => {
                        const filteredBlog = data?.blogs?.find(blog => blog.slug === blogId);
                        if (filteredBlog) {
                            setBlogDetails(filteredBlog);
                            setArtistId(filteredBlog.uploadedBy.id);
                            localStorage.setItem("blog-id", filteredBlog._id);
                            if (filteredBlog.readingTime) {
                                setReadingTime(filteredBlog.readingTime);
                            }
                        }
                    })
                    .catch(console.log)
                    .finally(() => setLoading(false));
            }
        }
        startTimeRef.current = Date.now();
        return () => {
            saveReadingTime();
        };
    }, [blogId]);

    const formatBlogViews = (views) => millify(views, { precision: 1 });

    const handleBlogLikes = async () => {
        try {
            let blog_id = localStorage.getItem("blog-id");
            const response = await putAPI(`/Blog-Post/blogs/${blog_id}/likes`);
            if (response.data) setBlogDetails(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const saveReadingTime = async () => {
        let blog_id = localStorage.getItem("blog-id");
        const endTime = Date.now();
        const sessionTime = Math.floor((endTime - startTimeRef.current) / 1000);
        if (sessionTime > 0) {
            try {
                const response = await putAPI(`/Blog-Post/blogs/${blog_id}/reading-time`, { readingTime: sessionTime });
                if (response.data) setReadingTime(response.data.readingTime);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const formatTime = (timeInSeconds) => {
        const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 });
        let result = [];
        if (duration.hours) result.push(`${duration.hours}h`);
        if (duration.minutes) result.push(`${duration.minutes}m`);
        if (duration.seconds || result.length === 0) result.push(`${duration.seconds}s`);
        return result.join(" ");
    };

    const fetchUserDetails = async () => {
        if (!artistId) return;
        try {
            const { data } = await getAPI(`/auth/userid/${artistId}`, {}, false, false);
            if (data?.user) setUserDetails(data.user);
        } catch (error) {
            console.error("Fetching user error:", error);
        }
    };

    const getAuthorImageUrl = () => {
        return getImageUrl(userDetails?.profilePhoto) || artist;
    };

    useEffect(() => {
        if (artistId) fetchUserDetails();
    }, [artistId]);

    const addIdsToHeadings = (html) => {
        if (!html) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const headings = doc.querySelectorAll("h1, h2");
        headings.forEach((heading, index) => {
            const id = heading.innerText.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
            heading.id = `${id}-${index}`;
        });
        return doc.body.innerHTML;
    };

    const getTocItems = (html) => {
        if (!html) return [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return Array.from(doc.querySelectorAll("h1, h2")).map((heading, index) => {
            const id = heading.innerText.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
            return { id: `${id}-${index}`, text: heading.innerText };
        });
    };

    const scrollToHeading = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const offset = -100;
        const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    useEffect(() => {
        if (!blogDetails?.blogDescription) return;
        const headings = document.querySelectorAll("h1, h2");
        if (!headings.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveHeading(entry.target.id);
                });
            },
            { rootMargin: "-120px 0px -60% 0px", threshold: 0.1 }
        );
        headings.forEach((heading) => observer.observe(heading));
        return () => observer.disconnect();
    }, [blogDetails]);

    const shareUrl = window.location.href;
    const shareTitle = blogDetails?.blogName || "ArtSays Blog";
    const shareText = blogDetails?.summary || "Interesting read from ArtSays";

    const openShareWindow = (url) => {
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    };

    const handleFacebookShare = () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
    const handleLinkedInShare = () => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
    const handleTwitterShare = () => openShareWindow(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`);
    const handleWhatsappShare = () => openShareWindow(`https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`);
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
            } catch (error) {
                console.log("Share cancelled");
            }
        } else {
            alert("Sharing not supported on this browser");
        }
    };

    if (loading) {
        return <BlogDetailsSkeleton />;
    }

    return (
        <div className="w-full min-h-screen bg-white blog-details-container">
            <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

            {blogDetails && (
                <Helmet>
                    <title>{blogDetails.blogName} | ArtSays</title>
                    <meta name="description" content={blogDetails.summary} />
                    <meta name="keywords" content={blogDetails.tags.join(', ')} />
                    <meta property="og:title" content={blogDetails.blogName} />
                    <meta property="og:description" content={blogDetails.summary} />
                    <meta property="og:url" content={window.location.href} />
                    {blogDetails.blogImage && (
                        <meta property="og:image" content={getImageUrl(blogDetails.blogImage.replace(/\\/g, "/"))} />
                    )}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" },
                                { "@type": "ListItem", "position": 2, "name": "Blogs", "item": "https://artsays.in/blogs" },
                                { "@type": "ListItem", "position": 3, "name": blogDetails.blogName, "item": window.location.href }
                            ]
                        })}
                    </script>
                </Helmet>
            )}

            {/* Hero Section */}
            <div className="py-12 blog-hero lg:py-20">
                <div className="hero-overlay" />
                <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                    <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="animate-fade-in">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                                {blogDetails?.category || 'Inspiration'}
                            </span>
                            <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
                                {blogDetails ? blogDetails.blogName : 'Loading...'}
                            </h1>
                            <p className="mb-10 text-lg font-light leading-relaxed text-white/80">
                                {blogDetails?.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-6 text-white/70">
                                <div className="flex items-center gap-2.5">
                                    <FaRegClock className="text-primary-color" />
                                    <span>{blogDetails ? formatTime(readingTime) : '0s'} read</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FaRegEye className="text-primary-color" />
                                    <span>{blogDetails ? formatBlogViews(blogDetails.views) : 0} views</span>
                                </div>
                                <div className="hidden w-px h-4 bg-white/20 md:block" />
                                <div className="font-medium text-white">
                                    {blogDetails && moment(blogDetails.createdAt).format("MMMM D, YYYY")}
                                </div>
                            </div>
                        </div>
                        <div className="relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="absolute -inset-4 bg-white/5 rounded-[2.5rem] backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-500" />
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={getImageUrl(blogDetails?.blogImage) || blog1}
                                    alt="Blog Hero"
                                    className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110"
                                    onError={(e) => e.currentTarget.src = blog1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Table of Contents - Sticky after Hero */}
            <div className="lg:hidden sticky top-3 mx-3 z-40 bg-white rounded-[1.25rem] border-b border-gray-100 shadow-lg transition-all duration-300">
                <div className="p-4 mx-auto max-w-7xl">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#6F4D34]/10 flex items-center justify-center">
                                <FaRegClock className="text-[#6F4D34]" />
                            </div>
                            <span className="font-bold text-gray-900">Jump to Section</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {mobileOpen ? <IoIosArrowUp className="text-[#6F4D34]" size={20} /> : <IoIosArrowDown className="text-[#6F4D34]" size={20} />}
                        </div>
                    </div>
                    {mobileOpen && (
                        <div className="mt-4 max-h-[60vh] overflow-y-auto pb-2 animate-fade-in">
                            <nav className="space-y-1">
                                {blogDetails && getTocItems(blogDetails.blogDescription).map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            scrollToHeading(item.id);
                                            setMobileOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeHeading === item.id
                                                ? 'bg-[#6F4D34] text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeHeading === item.id ? 'bg-white' : 'bg-[#6F4D34]/30'}`} />
                                        <span className="text-sm font-medium truncate">{item.text}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1440px] mx-auto p-6">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    {/* Blog Content */}
                    <article className="lg:col-span-8">
                        {blogDetails && (
                            <div
                                dangerouslySetInnerHTML={{ __html: addIdsToHeadings(blogDetails.blogDescription) }}
                                className="mb-16 rich-text"
                            />
                        )}

                        {/* Tags */}
                        <div className="pt-12 border-t border-gray-100">
                            <h4 className="mb-6 text-xl font-bold text-gray-900">Explore Topics</h4>
                            <div className="flex flex-wrap gap-3">
                                {blogDetails?.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-5 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:bg-[#6F4D34] hover:text-white hover:border-[#6F4D34] transition-all cursor-pointer font-medium text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-10 lg:col-span-4">
                        {/* Author Profile */}
                        <div className="relative p-8 text-center sidebar-card-dark group">
                            <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 transition-transform duration-700 rounded-full bg-white/5 group-hover:scale-150" />
                            <div className="relative z-10">
                                <div className="inline-block mb-6">
                                    <img
                                        src={getAuthorImageUrl()}
                                        alt="Author"
                                        id="artist-image"
                                        className="mx-auto shadow-2xl"
                                        onError={(e) => e.currentTarget.src = artist}
                                    />
                                </div>
                                <h5 className="mb-2 text-2xl font-bold text-white">
                                    {blogDetails ? blogDetails.blogAuthor : 'Author Name'}
                                </h5>
                                <p className="mb-8 font-medium tracking-wide text-white/60">
                                    {userDetails?.role?.toUpperCase() || 'CONTRIBUTOR'}
                                </p>

                                <div className="flex items-center justify-center gap-8 px-6 py-4 border rounded-2xl bg-white/5 border-white/10">
                                    <button
                                        onClick={handleBlogLikes}
                                        className="flex flex-col items-center gap-1.5 hover:text-white transition-colors"
                                    >
                                        <FaRegThumbsUp size={22} className="text-primary-color" />
                                        <span className="text-sm font-bold">{blogDetails?.likes || 0}</span>
                                    </button>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex flex-col items-center gap-1.5">
                                        <FaRegComment size={22} className="text-primary-color" />
                                        <span className="text-sm font-bold">{blogDetails?.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table of Contents */}
                        <div className="sticky hidden p-8 sidebar-card top-10 lg:block">
                            <div
                                className="flex items-center justify-between mb-6 cursor-pointer"
                                onClick={() => setOpen(!open)}
                            >
                                <h5 className="text-xl font-bold text-gray-900">In this article</h5>
                                {open ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
                            </div>

                            {open && (
                                <nav className="space-y-1.5">
                                    {blogDetails && getTocItems(blogDetails.blogDescription).map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => scrollToHeading(item.id)}
                                            className={`toc-item w-full text-left flex items-center gap-3 ${activeHeading === item.id ? 'active' : 'text-gray-500'}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${activeHeading === item.id ? 'bg-white' : 'bg-gray-300'}`} />
                                            <span className="truncate">{item.text}</span>
                                        </button>
                                    ))}
                                </nav>
                            )}

                            {/* Share Section */}
                            <div className="pt-8 mt-12 border-t border-gray-100">
                                <p className="mb-6 text-sm font-bold tracking-widest text-gray-900 uppercase">Share this story</p>
                                <div className="flex gap-4">
                                    <button onClick={handleFacebookShare} className="share-btn" aria-label="Facebook">
                                        <FaFacebookF size={18} />
                                    </button>
                                    <button onClick={handleTwitterShare} className="share-btn" aria-label="Twitter">
                                        <FaXTwitter size={18} />
                                    </button>
                                    <button onClick={handleLinkedInShare} className="share-btn" aria-label="LinkedIn">
                                        <FaLinkedinIn size={18} />
                                    </button>
                                    <button onClick={handleWhatsappShare} className="share-btn" aria-label="WhatsApp">
                                        <FaWhatsapp size={18} />
                                    </button>
                                    <button onClick={handleNativeShare} className="share-btn" aria-label="More">
                                        <FaShareAlt size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
                <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
            </div>
        </div>
    );
}

export default BlogCardDetails;