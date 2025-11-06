// import "../../store/products/product.css";

// const WhyInsurance = () => {

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             <div className="w-full py-3 px-3">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                     {/* Breadcrumb */}
//                     <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//                         <a href="#" className="hover:text-red-500">
//                             Home
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Store
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Paintings
//                         </a>
//                         <span>/</span>
//                         <span className="font-medium text-gray-900">Abstract</span>
//                     </nav>
//                 </div>
//             </div>

//                 {/* title */}
//                 <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                     Why Insure Your Art?
//                 </h1>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Safeguard your creativity, confidence, and investment — every brushstroke matters.
//             </p>

//             {/* Main Layout */}
//             <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
//                 {/* ---- Card 1 (4-column equivalent) ---- */}
//                 <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
//                     <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-orange-500">
//                                     Browse & Discover
//                                 </h1>
//                                 <hr className="my-3 border-dark" />
//                                 <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                 </p>
//                             </div>
//                         </main>

//                         <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
//                             <img src="/herosectionimg/choose.svg" alt="" />
//                         </aside>
//                     </div>
//                 </div>

//                 {/* ---- Card 2 (2-column equivalent) ---- */}
//                 <div className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
//                     <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
//                         <img src="/herosectionimg/how1.svg" alt="" />
//                     </aside>
//                     <main className="content-end">
//                         <div>
//                             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//                                 Browse & Discover
//                             </h1>
//                             <hr className="my-3 border-dark" />
//                             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
//                                 Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                             </p>
//                         </div>
//                     </main>
//                 </div>
//             </div>
//             <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
//                 {/* ---- Card 2 (2-column equivalent) ---- */}
//                 <div className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
//                     <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
//                         <img src="/herosectionimg/how1.svg" alt="" />
//                     </aside>
//                     <main className="content-end">
//                         <div>
//                             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//                                 Browse & Discover
//                             </h1>
//                             <hr className="my-3 border-dark" />
//                             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
//                                 Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                             </p>
//                         </div>
//                     </main>
//                 </div>

//                 {/* ---- Card 1 (4-column equivalent) ---- */}
//                 <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
//                     <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-orange-500">
//                                     Browse & Discover
//                                 </h1>
//                                 <hr className="my-3 border-dark" />
//                                 <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                 </p>
//                             </div>
//                         </main>

//                         <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
//                             <img src="/herosectionimg/choose.svg" alt="" />
//                         </aside>
//                     </div>
//                 </div>
//             </div>
//             <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
//                 {/* ---- Card 1 (4-column equivalent) ---- */}
//                 <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
//                     <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-orange-500">
//                                     Browse & Discover
//                                 </h1>
//                                 <hr className="my-3 border-dark" />
//                                 <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                 </p>
//                             </div>
//                         </main>

//                         <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
//                             <img src="/herosectionimg/choose.svg" alt="" />
//                         </aside>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };
// export default WhyInsurance;







import "../../store/products/product.css";
import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const WhyInsurance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAPI("/api/insurance/published", {}, false, false);
                const insuranceData = Array.isArray(res.data.data) ? res.data.data.find(p => p.status === "published") || res.data.data[0] : res.data.data;
                setData(insuranceData);
            } catch (error) {
                console.error("Error fetching Why Insurance data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-[1440px] mx-auto py-4">
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

                {/* title */}
                <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                    {data?.section1Heading || "Why Insure Your Art?"}
                </h1>

            <hr className="my-3 border-dark" />

            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                {data?.section1Description || "Safeguard your creativity, confidence, and investment — every brushstroke matters."}
            </p>

            {/* Main Layout */}
            {data?.section1Cards?.reduce((rows, card, index) => {
                if (index % 2 === 0) {
                    rows.push([card]);
                } else {
                    rows[rows.length - 1].push(card);
                }
                return rows;
            }, []).map((pair, rowIndex) => (
                <div key={rowIndex} className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
                    {pair.map((card, cardIndex) => {
                        const isWide = rowIndex % 2 === 0 ? cardIndex === 0 : cardIndex === 1;
                        return isWide ? (
                            <div key={cardIndex} className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                                <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
                                    <main className="md:col-span-2 content-end">
                                        <div>
                                            <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                                {card.title}
                                            </h1>
                                            <hr className="my-3 border-dark" />
                                            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                    </main>

                                    <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
                                        <img src={`${process.env.REACT_APP_API_URL}/${card.image}`} alt={card.title} />
                                    </aside>
                                </div>
                            </div>
                        ) : (
                            <div key={cardIndex} className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                                <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
                                    <img src={`${process.env.REACT_APP_API_URL}/${card.image}`} alt={card.title} />
                                </aside>
                                <main className="content-end">
                                    <div>
                                        <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                            {card.title}
                                        </h1>
                                        <hr className="my-3 border-dark" />
                                        <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                            {card.description}
                                        </p>
                                    </div>
                                </main>
                            </div>
                        );
                    })}
                </div>
            ))}


        </div>
    );
};
export default WhyInsurance;
