import React from 'react';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Profile from '../../Component/SocialMedia/Profile/Profile';
import { useParams } from 'react-router-dom';
const SocialProfile = () => {
  const {ProfileUserId}=useParams();
  const parts =ProfileUserId?.split("_");
const lastPart = parts?.[parts.length - 1];
const isValidUserId = /^[a-f\d]{24}$/i.test(lastPart);
const profileId = isValidUserId ? lastPart : null;
  return (
    <div className=" flex flex-col bg-[#fff]">
    
      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 w-[96%] mx-auto '>
        <Sidebar />
        <Profile {...(profileId && { shareprofileid: profileId })}/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default SocialProfile;
