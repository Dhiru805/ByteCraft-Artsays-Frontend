import React from "react";

export function BlogSkeleton() {
    return (
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-[16/10] bg-gray-200" />

            {/* Content Skeleton */}
            <div className="flex flex-col flex-grow p-4 md:p-5">
                {/* Meta Skeleton */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                    <div className="w-2 h-2 bg-gray-200 rounded-full" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>

                {/* Title Skeleton */}
                <div className="w-full h-6 bg-gray-200 rounded mb-2" />
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-4" />

                {/* Summary Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="w-full h-3 bg-gray-100 rounded" />
                    <div className="w-full h-3 bg-gray-100 rounded" />
                    <div className="w-5/6 h-3 bg-gray-100 rounded" />
                </div>

                {/* Footer Skeleton */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}

export function BlogGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <BlogSkeleton key={i} />
            ))}
        </div>
    );
}
