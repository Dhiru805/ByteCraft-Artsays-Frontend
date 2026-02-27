import React from 'react'

const PartnershipAds = () => {
  return (
    <div className='flex flex-col py-3 gap-6'>
      <h1 className='text-[26px] text-[#000000] font-bold px-4'>Partnership ads</h1>
      <div className='px-4 flex flex flex-col gap-5'>
        <h2 className='text-[21px] text-[#000000] font-bold'>View ads and insights</h2>

        <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between'>
            <p className='text-[19px] text-[#000000] font-semibold'>Active ads</p>
            <i class="ri-arrow-right-s-line text-[22px] text-[#000000] font-semibold"></i>
            <div className='lg:flex hidden'></div>
          </div>
                    <div className='flex items-center justify-between'>
            <p className='text-[19px] text-[#000000] font-semibold'>Inactive ads</p>
            <i class="ri-arrow-right-s-line text-[22px] text-[#000000] font-semibold mr-1"></i>
            <div className='hidden lg:flex '></div>
          </div>
        </div>
      </div>
       <hr className="w-full h-[1px] bg-[#000000] " />
       <div className='px-4 flex flex flex-col gap-3'>
        <h2 className='text-[21px] text-[#000000] font-bold'>Manage ad permissions</h2>
        <div className='flex items-center justify-between'>
            <p className='text-[19px] text-[#000000] font-semibold'>Ad partners</p>
            <i class="ri-arrow-right-s-line text-[22px] text-[#000000] font-semibold"></i>
            <div className='lg:flex hidden'></div>
          </div>
      </div>
    </div>
  )
}

export default PartnershipAds