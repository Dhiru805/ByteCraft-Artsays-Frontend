import React, { useState } from 'react'

const AppointmentRequests = () => {
      const [appointmentToggle, setAppointmentToggle] = useState(false);
  return (
        <div className="w-full h-full py-2 flex flex-col gap-8 px-4">
      <h1 className=" text-[26px] text-[#000000] font-bold ">
        Appointment requests
      </h1>

      <div className='px-4 flex flex-col gap-3'>
        <label className=" inline-flex items-center justify-between cursor-pointer ">
        <div className="text-[17px] font-semibold text-[#000000]">
          Receive appointment requests
        </div>
        <div className="relative">
          <input
            type="checkbox"
            checked={appointmentToggle}
            onChange={() => setAppointmentToggle((s) => !s)}
            className="sr-only"
          />
          <div
            className={`w-10 h-5 rounded-full transition ${
              appointmentToggle ? "bg-[#4f3823]" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
              appointmentToggle ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </div>
      </label>
      <p className='text-[17px] text-[#000000] font-medium'>Allow customers to send you appointment booking requests.</p>
      </div>
    </div>
  )
}

export default AppointmentRequests