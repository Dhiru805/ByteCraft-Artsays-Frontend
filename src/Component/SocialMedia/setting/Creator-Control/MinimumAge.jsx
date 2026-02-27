import React from 'react'

const MinimumAge = () => {
  return (
    <div className='w-full h-full py-2 flex  flex-col pl-4 gap-5'>
            <h1 className=" text-[26px] text-[#000000] font-bold ">
        Minimum Age
      </h1>

      <div className='pl-3 flex flex-col gap-6'>
        <p className='pr-3 text-[17px] text-[#000000] font-medium mb-3'>Require people to be a certain age to see your account, including your profile, posts and stories.</p>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center pr-8'>
            <h2 className='text-[21px] text-[#000000] font-bold'>Default</h2>
            <i class="ri-add-large-line text-[21px] text-[#000000] font-bold"></i>
          </div>
          <h2 className='text-[17px] text-[#000000] font-medium'>Set a minimum age for people everywhere.</h2>
        </div>
         <div className="w-full bg-gray-100">
            <input
              type="text"
              placeholder="Minimum age"
              className="w-full h-full placeholder:text-[16px] placeholder:text-[#000000] placeholder:font-medium outline-none flex-1 bg-gray-100 py-3 px-3"
            />
          </div>
      </div>
         
    </div>
  )
}

export default MinimumAge