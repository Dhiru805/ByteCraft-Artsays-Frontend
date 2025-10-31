import "../../store/products/product.css";

const Path = () => {

    return (
        <div className="max-w-[1440px] mx-auto py-4">
                {/* title */}
                <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                    Your Path to Certification
                </h1>

            <hr className="my-3 border-dark" />

            {/* Subtitle */}
            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                Showcase authenticity and build trust with verified certifications.
            </p>

            {/* Main Layout */}
            <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
                {/* ---- Card 1 (4-column equivalent) ---- */}
                <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
                        <main className="md:col-span-2 content-end">
                            <div>
                                <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                    Browse & Discover
                                </h1>
                                <hr className="my-3 border-dark" />
                                <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                    Fill out the Commission Request Form with details about your concept, size, medium, and budget.
                                </p>
                            </div>
                        </main>

                        <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
                            <img src="/herosectionimg/choose.svg" alt="" />
                        </aside>
                    </div>
                </div>

                {/* ---- Card 2 (2-column equivalent) ---- */}
                <div className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                    <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
                        <img src="/herosectionimg/how1.svg" alt="" />
                    </aside>
                    <main className="content-end">
                        <div>
                            <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                Browse & Discover
                            </h1>
                            <hr className="my-3 border-dark" />
                            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                Fill out the Commission Request Form with details about your concept, size, medium, and budget.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
            <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
                {/* ---- Card 2 (2-column equivalent) ---- */}
                <div className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                    <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
                        <img src="/herosectionimg/how1.svg" alt="" />
                    </aside>
                    <main className="content-end">
                        <div>
                            <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                Browse & Discover
                            </h1>
                            <hr className="my-3 border-dark" />
                            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                Fill out the Commission Request Form with details about your concept, size, medium, and budget.
                            </p>
                        </div>
                    </main>
                </div>

                {/* ---- Card 1 (4-column equivalent) ---- */}
                <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
                        <main className="md:col-span-2 content-end">
                            <div>
                                <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                    Browse & Discover
                                </h1>
                                <hr className="my-3 border-dark" />
                                <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                    Fill out the Commission Request Form with details about your concept, size, medium, and budget.
                                </p>
                            </div>
                        </main>

                        <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
                            <img src="/herosectionimg/choose.svg" alt="" />
                        </aside>
                    </div>
                </div>
            </div>
            <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
                {/* ---- Card 1 (4-column equivalent) ---- */}
                <div className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
                        <main className="md:col-span-2 content-end">
                            <div>
                                <h1 className="text-sm md:text-xl font-bold text-orange-500">
                                    Browse & Discover
                                </h1>
                                <hr className="my-3 border-dark" />
                                <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                    Fill out the Commission Request Form with details about your concept, size, medium, and budget.
                                </p>
                            </div>
                        </main>

                        <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
                            <img src="/herosectionimg/choose.svg" alt="" />
                        </aside>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default Path;
