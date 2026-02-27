import React, { useState } from 'react'

const WelcomeMessage = () => {
      const [welcomeToggle, setWelcomeToggle] = useState(false);

  return (
    <div className='w-full h-full flex flex-col py-2 gap-6'>
            <h1 className='pl-4 text-[26px] text-[#000000] font-bold px-4'>Welcome message</h1>
            <div className='pl-8 flex flex-col gap-6 pr-2'>
                <div className='flex flex-col gap-2'>
                    <label className="inline-flex items-center justify-between cursor-pointer pr-2">
          <div className="text-[21px] font-bold text-[#000000]">
            Show welcome message
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={welcomeToggle}
              onChange={() => setWelcomeToggle((s) => !s)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition ${
                welcomeToggle ? "bg-[#4f3823]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                welcomeToggle ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>
        <p className='text-[17px] text-[#000000] font-medium'>This message welcomes people when they open a chat with you and goes away once they send the first message.</p>
                </div>
                <div className="flex flex-col gap-2">
          <h2 className="text-[19px] text-[#000000] font-semibold">
            Message
          </h2>
          <div className="w-full bg-gray-100">
            <input
              type="text"
              placeholder="Welcome to Sculpture Studio!!"
              className="w-full h-full placeholder:text-[16px] placeholder:text-[#000000] placeholder:font-medium outline-none flex-1 bg-gray-100 py-3 px-3"
            />
          </div>
        </div>
            </div>
    </div>
  )
}

export default WelcomeMessage