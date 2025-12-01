import React from 'react';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Profile from '../../Component/SocialMedia/Profile/Profile';
import { useParams } from 'react-router-dom';
const SocialProfile = () => {
  const {shareProfileId}=useParams();
  return (
    <div className=" flex flex-col bg-[#fff]">
    
      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 w-[96%] mx-auto '>
        <Sidebar />
        <Profile shareprofileid={shareProfileId}/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default SocialProfile;
