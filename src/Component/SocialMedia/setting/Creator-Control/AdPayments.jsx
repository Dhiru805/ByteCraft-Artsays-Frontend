import React from 'react'

const AdPayments = () => {
  return (
    <div className='w-full h-full py-2 px-3'>
    <div className='w-full h-full flex flex-col gap-8 px-2'>
    <h1 className='text-[26px] text-[#000000] font-bold'>Ad payments</h1>
    <div className='flex flex-col gap-2 px-3'>
      <h2 className='text-[16px] text-[#000000] font-semibold'>Billing and Payments</h2>
      <div className='flex justify-between'>
        <p className='text-[16px] text-[#000000] font-medium'>Vikas Khanna [789564123546932]</p>
        <i class="ri-arrow-right-s-line text-xl font-semibold"></i>

      </div>
    </div>
    <div className='text-[#48372D] text-[16px] font-bold px-3'>Switch ad account</div>

    </div></div>
  )
}

export default AdPayments