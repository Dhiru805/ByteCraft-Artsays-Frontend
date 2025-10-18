import React from 'react'
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Customization from '../../Component/SocialMedia/live/Customization';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
const CreateLive = () => {
  return (
     <div className=" flex flex-col">
     <header className='w-full   '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex  flex-row items-start sm:gap-4 w-full sm:w-[96%] mx-auto '>
        <Sidebar />
        <Customization/>
        <Suggestion/>
      </main>
     
    </div>
  )
}

export default CreateLive