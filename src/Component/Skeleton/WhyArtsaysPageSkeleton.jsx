import React from "react";
import CommissionContentSkeliton from "./Home/Account/CommissionContentSkeliton";

const WhyArtsaysPageSkeleton = () => {
    return (
        <div className="w-full font-[poppins] animate-pulse">
            {/* Hero Skeleton */}
            <div className="relative w-full h-[300px] sm:h-[250px] md:h-[300px] bg-gray-200 overflow-hidden flex items-center">
                <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
                    <div className="w-full space-y-4">
                        <div className="h-6 w-48 bg-gray-300 rounded-full"></div>
                        <div className="h-12 w-96 bg-gray-300 rounded-lg"></div>
                        <div className="h-6 w-full max-w-xl bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="py-8 bg-gray-50">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6">
                    <CommissionContentSkeliton />
                </div>
            </div>

            {/* Testimonials Skeleton Placeholder */}
            <div className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-[1440px] mx-auto px-6 text-center space-y-8">
                    <div className="h-10 w-64 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-1 w-16 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-6 w-full max-w-2xl bg-gray-100 rounded mx-auto"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 space-y-6">
                                <div className="h-10 w-10 bg-gray-200 rounded-full ml-auto"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyArtsaysPageSkeleton;
