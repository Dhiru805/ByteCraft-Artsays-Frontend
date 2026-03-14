import React from 'react';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Setting from '../../Component/SocialMedia/setting/Setting';
const Settings = () => {
  return (
    <div className=" flex flex-col">
    

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex grid grid-cols-12 flex-row lg:bg-white gap-2 w-full mx-auto px-2'>
       <Sidebar />
       <Setting/>
       
      </main>
     
    </div>
  );
};

export default Settings;
