import React from 'react'

const PersonalInformationSkeleton = () => {
  return (
    <div>
      {/* Profile Page Skeleton Loader */}
<div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6 animate-pulse">

  {/* Heading */}
  <div className="h-6 w-40 bg-gray-300 rounded"></div>

  {/* Profile Image + Upload Button */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    <div className="w-24 h-24 bg-gray-300 rounded-full"></div>

    <div className="w-40 h-10 bg-gray-300 rounded-3xl"></div>
  </div>

  {/* First Name + Last Name */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>

    {/* Username */}
    <div className="md:col-span-2 space-y-2">
      <div className="h-4 w-28 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>

    {/* Email */}
    <div className="md:col-span-2 space-y-2">
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>

    {/* Phone */}
    <div className="md:col-span-2 space-y-2">
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>
  </div>

  {/* Gender + Date of Birth */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Gender Skeleton */}
    <div className="space-y-3">
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
      <div className="flex gap-4">
        <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
        <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
      </div>
    </div>

    {/* DOB Skeleton */}
    <div className="space-y-3">
      <div className="h-4 w-28 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded-xl"></div>
    </div>
  </div>

  {/* Bio */}
  <div className="space-y-2">
    <div className="h-4 w-16 bg-gray-300 rounded"></div>
    <div className="h-24 bg-gray-300 rounded-xl"></div>
  </div>

  {/* Submit Button */}
  <div className="w-full sm:w-[200px] h-12 bg-gray-300 rounded-3xl"></div>
</div>

    </div>
  )
}

export default PersonalInformationSkeleton
