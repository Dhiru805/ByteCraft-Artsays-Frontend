import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import OthersLive from '../../Component/SocialMedia/live/OthersLive';

const Live = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full   '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex  flex-row gap-4 sm:w-[96%] w-full mx-auto'>
       <Sidebar />
       <OthersLive />
       
      </main>
     
    </div>
  );
};

export default Live;
