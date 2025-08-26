import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Profile from '../../Component/SocialMedia/Profile/Profile';

const SocialProfile = () => {
  return (
    <div className=" flex flex-col bg-[#fff]">
     <header className='w-full '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 w-[96%] mx-auto '>
        <Sidebar />
        <Profile />
        <Suggestion />
      </main>
     
    </div>
  );
};

export default SocialProfile;
