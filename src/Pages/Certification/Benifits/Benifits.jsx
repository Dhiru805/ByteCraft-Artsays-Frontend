import "../../store/products/product.css";
import { useRef } from "react";

const Benifits = () => {
    const scroller = useRef(null);

    return (
        <div className="max-w-[1440px] mx-auto py-4">
                {/* title */}
                <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                    Benefits of Certification
                </h1>

            <hr className="my-3 border-dark" />

            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                Ultimate protection for your masterpieces — because your art deserves nothing less
            </p>

            {/* Main Layout */}
            <div className="flex mt-3 justify-evenly gap-2 md:gap-3 px-2 md:px-0 py-2">
                <div className="border !border-[#FB5934] !rounded-tr-[100px] !rounded-tl-[100px] !rounded-sm p-2 md:!p-12 text-center">
                    <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
                        Certified pieces attract higher prices.
                    </p>
                    <h1 className="text-sm md:text-xl font-bold text-dark">
                        Boosts Artwork Value
                    </h1>
                    <img
                        src='./herosectionimg/boost.svg'
                        alt="boost"
                        className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
                    />
                </div>
                <div className="border !border-[#FB5934] !rounded-tr-[100px] !rounded-tl-[100px] !rounded-sm p-2 md:!p-12 text-center">
                    <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
                        Certified pieces attract higher prices.
                    </p>
                    <h1 className="text-sm md:text-xl font-bold text-dark">
                        Boosts Artwork Value
                    </h1>
                    <img
                        src='./herosectionimg/boost.svg'
                        alt="boost"
                        className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
                    />
                </div>
                <div className="border !border-[#FB5934] !rounded-tr-[100px] !rounded-tl-[100px] !rounded-sm p-2 md:!p-12 text-center">
                    <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
                        Certified pieces attract higher prices.
                    </p>
                    <h1 className="text-sm md:text-xl font-bold text-dark">
                        Boosts Artwork Value
                    </h1>
                    <img
                        src='./herosectionimg/boost.svg'
                        alt="boost"
                        className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
                    />
                </div>
            </div>
            <div className="flex mt-0 md:!mt-3 justify-evenly gap-2 md:gap-3 px-2 md:px-0">
                <div className="border !border-[#FB5934] !rounded-br-[100px] !rounded-bl-[100px] !rounded-sm p-2 md:!p-12 text-center">
                    <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
                        Certified pieces attract higher prices.
                    </p>
                    <h1 className="text-sm md:text-xl font-bold text-dark">
                        Boosts Artwork Value
                    </h1>
                    <img
                        src='./herosectionimg/boost.svg'
                        alt="boost"
                        className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
                    />
                </div>
                <div className="border !border-[#FB5934] !rounded-br-[100px] !rounded-bl-[100px] !rounded-sm p-2 md:!p-12 text-center">
                    <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
                        Certified pieces attract higher prices.
                    </p>
                    <h1 className="text-sm md:text-xl font-bold text-dark">
                        Boosts Artwork Value
                    </h1>
                    <img
                        src='./herosectionimg/boost.svg'
                        alt="boost"
                        className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
                    />
                </div>
                <div className="border !border-[#FB5934] !rounded-br-[100px] !rounded-bl-[100px] !rounded-sm p-2 md:!p-12 text-center">
                    <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
                        Certified pieces attract higher prices.
                    </p>
                    <h1 className="text-sm md:text-xl font-bold text-dark">
                        Boosts Artwork Value
                    </h1>
                    <img
                        src='./herosectionimg/boost.svg'
                        alt="boost"
                        className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
                    />
                </div>
            </div>

        </div>
    );
};
export default Benifits;
