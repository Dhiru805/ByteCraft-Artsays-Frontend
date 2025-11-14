// import "../../store/products/product.css";

// const Path = () => {

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//                 {/* title */}
//                 <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                     Your Path to Certification
//                 </h1>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Showcase authenticity and build trust with verified certifications.
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
// export default Path;




import "../../store/products/product.css";
import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const Path = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAPI("/api/certificate/published");
                if (res.data && res.data.data) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch certificate data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-[1440px] mx-auto py-4">
                {/* title */}
              
                <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                    {data?.section2Heading || "Your Path to Certification"}
                </h1>

            <hr className="my-3 border-dark" />

            {/* Subtitle */}
          
            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                {data?.section2Description || "Showcase authenticity and build trust with verified certifications."}
            </p>

            {/* Main Layout */}
            {data?.section2?.cards && data.section2.cards.length > 0 ? (
                data.section2.cards.map((card, index) => (
                    <div key={index} className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
                        {index % 2 === 0 ? (
                            <>
                                <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
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
                                            {card.image && <img src={`${process.env.REACT_APP_API_URL}/${card.image}`} alt={card.title} />}
                                        </aside>
                                    </div>
                                </div>

                                {data.section2.cards[index + 1] && (
                                    <div className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                                        <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
                                            {data.section2.cards[index + 1].image && <img src={`${process.env.REACT_APP_API_URL}/${data.section2.cards[index + 1].image}`} alt={data.section2.cards[index + 1].title} />}
                                        </aside>
                                        <main className="content-end">
                                            <div>
                                                <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                                    {data.section2.cards[index + 1].title}
                                                </h1>
                                                <hr className="my-3 border-dark" />
                                                <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                                    {data.section2.cards[index + 1].description}
                                                </p>
                                            </div>
                                        </main>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                                    <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
                                        {card.image && <img src={`${process.env.REACT_APP_API_URL}/${card.image}`} alt={card.title} />}
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
                                {data.section2.cards[index + 1] && (
                                    <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
                                            <main className="md:col-span-2 content-end">
                                                <div>
                                                    <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                                        {data.section2.cards[index + 1].title}
                                                    </h1>
                                                    <hr className="my-3 border-dark" />
                                                    <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                                        {data.section2.cards[index + 1].description}
                                                    </p>
                                                </div>
                                            </main>

                                            <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
                                                {data.section2.cards[index + 1].image && <img src={`${process.env.REACT_APP_API_URL}/${data.section2.cards[index + 1].image}`} alt={data.section2.cards[index + 1].title} />}
                                            </aside>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))
            ) : (
                <>
                </>
            )}

        </div>
    );
};
export default Path;
