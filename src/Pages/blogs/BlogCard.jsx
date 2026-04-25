import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import blog1 from "../../assets/blog/blog-1.jpg";
import { getImageUrl } from "../../utils/getImageUrl";

function BlogCard({ blog }) {
    let navigate = useNavigate();

    const handleChangeURL = () => {
        navigate(`/blog/${blog.slug}`);
    };

    return (
        <div 
            className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100" 
            onClick={handleChangeURL}
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                    src={getImageUrl(blog?.blogImage) || blog1}
                    alt={blog.blogName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => e.currentTarget.src = blog1}
                />
                
                {/* Category Badge - if available in blog object */}
                {blog.blogCategory && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#6F4D34] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {blog.blogCategory}
                    </div>
                )}

                {/* Like Button */}
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-sm">
                    <ThumbsUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-700" />
                </button>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-4 md:p-5">
                {/* Meta Information */}
                <div className="flex items-center gap-2 mb-3 text-[10px] md:text-xs text-gray-500 font-medium">
                    <span className="bg-[#6F4D34]/10 text-[#6F4D34] px-2 py-0.5 rounded">
                        {blog.blogAuthor}
                    </span>
                    <span>•</span>
                    <span>{moment(blog.createdAt).format("MMM D, YYYY")}</span>
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6F4D34] transition-colors leading-tight">
                    {blog.blogName}
                </h2>

                {/* Summary */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {blog.summary}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <span className="text-[#6F4D34] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        Read Story 
                        <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {blog.readingTime || "5"} min read
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;