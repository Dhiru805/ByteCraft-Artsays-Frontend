import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Setting from '../../Component/SocialMedia/setting/Setting';
const Settings = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full   '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex  flex-row lg:bg-white  w-full mx-auto'>
       <Sidebar />
       <Setting/>
       
      </main>
     
    </div>
  );
};

export default Settings;
