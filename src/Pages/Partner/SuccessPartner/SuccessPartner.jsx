import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const SuccessPartner = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAPI("/api/partner");
                const partnerData = Array.isArray(res.data.data) 
                    ? res.data.data.find(p => p.status === "published") || res.data.data[0] 
                    : res.data.data;
                setData(partnerData);
            } catch (err) {
                console.error("Error fetching partner data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <SuccessPartnerSkeleton />;
    if (!data) return null;

    const slides = (data.section1Images || []).map(img => 
        img.startsWith('http') ? img : `${API_BASE}/${img}`
    );

    if (!slides.length) return null;

    // Duplicate slides for seamless infinite loop
    const marqueeItems = [...slides, ...slides, ...slides];

    return (
        <div className="w-full py-16 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-primary-900 uppercase bg-primary-100 rounded-full">
                    Our Collaborations
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-primary-900 mb-4 font-oswald uppercase tracking-tight">
                    {data.section1Heading || "Success Stories"}
                </h2>
                <div className="h-1 w-24 bg-primary-600 mx-auto mb-6 rounded-full"></div>
                <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-lg leading-relaxed font-light">
                    {data.section1Description || "Safeguard your creativity, confidence, and investment — every brushstroke matters."}
                </p>
            </div>

            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10"></div>

                <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
                    {marqueeItems.map((src, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 mx-4 md:mx-8 w-48 md:w-64 group/card"
                        >
                            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-900/5 group-hover/card:-translate-y-2">
                                <div className="aspect-[4/3] flex items-center justify-center p-4">
                                    <img
                                        src={src}
                                        alt={`Partner ${index + 1}`}
                                        className="max-w-full max-h-full object-contain grayscale opacity-60 transition-all duration-500 group-hover/card:grayscale-0 group-hover/card:opacity-100"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/220x190?text=Partner'}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

const SuccessPartnerSkeleton = () => (
    <div className="w-full py-16 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
            <div className="h-6 w-24 bg-gray-200 mx-auto mb-4 rounded-full"></div>
            <div className="h-10 md:h-12 w-64 md:w-96 bg-gray-200 mx-auto mb-6 rounded-lg"></div>
            <div className="h-4 w-full max-w-lg bg-gray-100 mx-auto rounded"></div>
        </div>
        <div className="flex gap-8 px-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-64 h-48 bg-gray-100 rounded-2xl"></div>
            ))}
        </div>
    </div>
);

export default SuccessPartner;
