import "../../store/products/product.css";
import { useRef } from "react";

const Examples = () => {
    const scroller = useRef(null);

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            {/* title */}
            <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] text-center px-3">
                Here’s how your Certificate will shine
            </h1>

            <hr className="my-3 border-dark" />

            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-lg font-medium text-black text-center leading-relaxed px-3">
                A glimpse of what your verified certificate will look like.
            </p>

            {/* Main Layout */}
            <div className="p-5 justify-items-center">
                <img src="/herosectionimg/certificate.svg" alt="" />
                </div>


        </div>
    );
};
export default Examples;
