import "../../store/products/product.css";
import { useRef } from "react";

const Certificate = () => {
    const scroller = useRef(null);

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            {/* Top Section: Breadcrumb + Search */}
            <div className="w-full py-3 px-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Breadcrumb */}
                    <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
                        <a href="#" className="hover:text-red-500">
                            Home
                        </a>
                        <span>/</span>
                        <a href="#" className="hover:text-red-500">
                            Store
                        </a>
                        <span>/</span>
                        <a href="#" className="hover:text-red-500">
                            Paintings
                        </a>
                        <span>/</span>
                        <span className="font-medium text-gray-900">Abstract</span>
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
                {/* title */}
                <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                    Certificates
                </h1>
                <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
                    Get Your Certificate
                </button>
            </div>

            <hr className="my-3 border-dark" />

            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                Showcase authenticity and build trust with verified certifications.
            </p>

            {/* Main Layout */}
            <div
                ref={scroller}
                className="mt-3 overflow-x-auto scroll-smooth scrollbar-hide"
                onWheel={(e) => {
                    // convert vertical scroll to horizontal; multiplier adjusts speed
                    if (scroller.current) {
                        scroller.current.scrollLeft += e.deltaY * 1;
                    }
                }}>
                <div className="flex gap-3 px-2 md:px-0 py-2 w-max">
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                    <div className="border !border-[#FF725E] !border-r-[10px] !border-l-[10px] p-3 rounded-lg font-semibold text-[#48372D] text-center text-lg whitespace-nowrap">
                        Certificate of Authenticity
                    </div>
                </div>
            </div>

        </div>
    );
};
export default Certificate;
