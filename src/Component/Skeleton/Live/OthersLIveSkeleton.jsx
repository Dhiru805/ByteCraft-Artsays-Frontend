import React from 'react';

const OthersLiveSkeleton = ({ showChat = true }) => {
  // Determine video and chat widths based on the showChat prop (mimicking the component logic)
  const videoDetailsWidth = showChat ? "lg:w-[70%]" : "lg:w-full";
  const chatSidebarWidth = "lg:w-[29%]";

  // Skeleton for a chat message row
  const ChatMessageSkeleton = () => (
    <div className="flex gap-1 mb-2 items-center px-2 py-1">
      {/* Profile Pic Placeholder */}
      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-300"></div>
      
      {/* Text Placeholder */}
      <div className="flex flex-col gap-1 w-full">
        <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Skeleton for the Ad/Sponsor Card
  const FeatureCardSkeleton = () => (
    <div className="sm:w-1/2 bg-gray-100 rounded-xl flex overflow-hidden h-40">
      {/* Image Placeholder */}
      <div className="w-[28%] flex-shrink-0 bg-gray-300"></div>
      
      {/* Detail Placeholder */}
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <div className="h-4 w-3/4 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div> 
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:w-[78%] w-full lg:mx-auto mx-0 flex flex-col lg:flex-row px-1 animate-pulse">
      
      {/* 1. Video Player & Details Column */}
      <div className={`${videoDetailsWidth} w-full lg:px-2 flex flex-col gap-4`}>
        
        {/* Video Player Placeholder */}
        <div className="w-full lg:h-[60vh] sm:h-[50vh] h-[40vh] relative bg-gray-400 rounded-xl flex items-center justify-center">
          <div className="text-gray-500 text-lg">Video Loading...</div>
          {/* Controls Placeholder at the bottom */}
          <div className="absolute w-full mx-auto bottom-0 h-10 bg-black bg-opacity-70 rounded-b-xl flex justify-between px-4 items-center">
            <div className="flex gap-4">
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div> {/* Play/Pause */}
                <div className="h-6 w-16 bg-gray-300 rounded-full"></div> {/* Volume */}
            </div>
            <div className="flex gap-2">
                <div className="h-6 w-12 bg-red-500 rounded-full"></div> {/* Live Status */}
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div> {/* Fullscreen */}
            </div>
          </div>
        </div>

        {/* Mobile Chat Toggle Placeholder (if chat is hidden) */}
        {showChat === false && (
          <div className="w-full h-8 bg-orange-200 rounded-full"></div>
        )}
        
        {/* Video Detail Segment */}
        <div className="w-full flex flex-col gap-4">
          
          {/* Title and Tags Placeholder */}
          <div className="flex flex-col gap-1 px-3">
            <div className="h-6 bg-gray-400 rounded w-full max-w-[90%]"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mt-1"></div>
          </div>
          
          {/* Streamer Info and Action Buttons Placeholder */}
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 sm:gap-0 sm:justify-between px-3">
            <div className="flex gap-3 items-center">
              {/* Profile Avatar Placeholder */}
              <div className="w-[40px] h-[40px] rounded-full bg-gray-400"></div>
              <div className="flex flex-col justify-betweeen">
                <div className="h-5 bg-gray-400 rounded w-32 mb-1"></div> {/* Name */}
                <div className="h-3 bg-gray-300 rounded w-24"></div> {/* Followers/Category */}
              </div>
              <div className="h-8 w-20 bg-gray-500 rounded-full ml-3"></div> {/* Follow/Unfollow Button */}
            </div>

            {/* Like, Share, Report Buttons Placeholder */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex bg-gray-500 rounded-full h-8 w-28"></div> {/* Like/Dislike */}
              <div className="h-8 w-20 bg-gray-500 rounded-full"></div> {/* Share */}
              <div className="h-8 w-20 bg-gray-500 rounded-full"></div> {/* Report */}
            </div>
          </div>

          {/* Description Section Placeholder */}
          <div className="w-full bg-orange-100 flex flex-col px-4 py-3 rounded-xl gap-2">
            <div className="flex justify-between items-center h-4">
              <div className="w-1/4 bg-gray-300 rounded"></div>
              <div className="w-1/6 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-1 mt-1">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-11/12"></div>
            </div>
          </div>

          {/* Ad and Sponsor Cards Placeholder */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <FeatureCardSkeleton />
            <FeatureCardSkeleton />
          </div>
        </div>
      </div>

      {/* 2. Live Chat Sidebar (Only visible on large screens if showChat is true) */}
      {showChat && (
        <div className={`hidden lg:flex ${chatSidebarWidth} w-full h-[70vh] border-[1px] border-gray-400 rounded-xl flex-col`}>
          
          {/* Header Placeholder */}
          <header className="rounded-t-xl w-full bg-gray-500 flex justify-between items-center p-3 h-12">
            <div className="h-5 w-20 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
                <div className="h-5 w-5 bg-gray-300 rounded-full"></div> 
                <div className="h-5 w-5 bg-gray-300 rounded-full"></div> 
            </div>
          </header>

          {/* Main Chat Content Placeholder */}
          <main className="w-full flex-1 overflow-hidden p-2">
            {/* 6-8 chat messages */}
            {[...Array(7)].map((_, i) => (
              <ChatMessageSkeleton key={i} />
            ))}
          </main>

          {/* Footer Placeholder (Input/Actions) */}
          <div className="border-t border-gray-400 bg-gray-500 w-full flex items-center justify-between px-3 py-3 h-16 rounded-b-xl">
            {/* Input Box Placeholder */}
            <div className="h-10 w-3/4 bg-gray-400 rounded-full"></div>
            {/* Action Icons Placeholder */}
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OthersLiveSkeleton;