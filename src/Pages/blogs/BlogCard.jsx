import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import blog1 from "../../assets/blog/blog-1.jpg";

function BlogCard({ blog }) {

    let navigate = useNavigate();

    const handleChangeURL = () => {
        navigate(`/blog/${blog.slug}`)
    };

    return (
        <div className="flex cursor-pointer" onClick={handleChangeURL}>
            <div className="flex flex-col w-full border-2 border-[#6F4D34] bg-[#fff] rounded-[20px] lg:rounded-[25px] overflow-hidden">
                <div className="w-full h-[140px] lg:h-[200px] bg-gray-100 rounded-[20px] lg:rounded-[25px] relative z-10" id="blogGrid_imageCont">
                    <img src={blog ? `${process.env.REACT_APP_API_URL}/${blog.blogImage.replace(/\\/g, "/")}` : blog1} alt="Blog image" className="w-full h-100 object-cover"
                        onError={(e) => e.currentTarget.src = blog1} />
                    <button className="absolute bottom-2 right-2 bg-[#fff] p-2 rounded-full focus:outline-0">
                        <ThumbsUp className="w-4 h-4 md:w-5 md:h-5 text-[#000]" />
                    </button>
                </div>
                <div className="w-full overflow-hidden  bg-[#6F4D34] text-[#fff] rounded-b-[20px] 
                    lg:rounded-b-[25px] blogGrid_productDate relative bottom-5 text-[10px] md:text-xs">
                    <span>{blog.blogAuthor} • {moment(blog.createdAt).format("MMM D, YYYY")}</span>
                </div>
                <div className="text-[#000] blogGrid_productTitleCont">
                    <h2 className="text-[16px] lg:text-[22px] font-semibold mb-2 blogGrid_productTitle">{blog.blogName}</h2>
                    <p className="text-[12px] lg:text-[15px] overflow-hidden text-clip">
                        {blog.summary.length > 55 ? blog.summary.substring(0, 55) + "..." : blog.summary}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;