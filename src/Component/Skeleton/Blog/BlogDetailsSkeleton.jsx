import React from "react";

export function BlogDetailsSkeleton() {
    return (
        <div className="w-full min-h-screen bg-white animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="bg-gray-900 py-12 lg:py-20">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            {/* Category Badge */}
                            <div className="w-32 h-6 bg-gray-800 rounded-full mb-6" />
                            {/* Title */}
                            <div className="w-full h-12 bg-gray-800 rounded mb-4" />
                            <div className="w-2/3 h-12 bg-gray-800 rounded mb-8" />
                            {/* Summary */}
                            <div className="space-y-2 mb-10">
                                <div className="w-full h-4 bg-gray-800 rounded opacity-50" />
                                <div className="w-full h-4 bg-gray-800 rounded opacity-50" />
                                <div className="w-3/4 h-4 bg-gray-800 rounded opacity-50" />
                            </div>
                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-6">
                                <div className="w-24 h-4 bg-gray-800 rounded" />
                                <div className="w-24 h-4 bg-gray-800 rounded" />
                                <div className="w-32 h-4 bg-gray-800 rounded" />
                            </div>
                        </div>
                        {/* Hero Image */}
                        <div className="aspect-[4/3] bg-gray-800 rounded-3xl" />
                    </div>
                </div>
            </div>

            {/* Main Content Area Skeleton */}
            <div className="max-w-[1440px] mx-auto p-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Blog Content */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6 mb-16">
                            <div className="w-full h-4 bg-gray-100 rounded" />
                            <div className="w-full h-4 bg-gray-100 rounded" />
                            <div className="w-5/6 h-4 bg-gray-100 rounded" />
                            <div className="w-full h-64 bg-gray-50 rounded-2xl" />
                            <div className="w-full h-4 bg-gray-100 rounded" />
                            <div className="w-4/5 h-4 bg-gray-100 rounded" />
                        </div>
                        {/* Tags */}
                        <div className="pt-12 border-t border-gray-100">
                            <div className="w-40 h-6 bg-gray-200 rounded mb-6" />
                            <div className="flex flex-wrap gap-3">
                                <div className="w-20 h-9 bg-gray-50 rounded-xl" />
                                <div className="w-24 h-9 bg-gray-50 rounded-xl" />
                                <div className="w-20 h-9 bg-gray-50 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Author Profile Card */}
                        <div className="bg-gray-900 p-8 rounded-[2.5rem]">
                            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-6" />
                            <div className="w-32 h-6 bg-gray-800 rounded mx-auto mb-2" />
                            <div className="w-24 h-4 bg-gray-800 rounded mx-auto mb-8" />
                            <div className="h-16 bg-gray-800 rounded-2xl" />
                        </div>

                        {/* TOC Card */}
                        <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-4">
                            <div className="w-full h-6 bg-gray-200 rounded" />
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-gray-100 rounded" />
                                <div className="w-full h-4 bg-gray-100 rounded" />
                                <div className="w-3/4 h-4 bg-gray-100 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
