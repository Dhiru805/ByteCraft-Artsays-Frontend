import React from 'react';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Explorebar from '../../Component/SocialMedia/explore/Explorebar';

const Explore = () => {
  return (
    <div className=" flex flex-col">
     

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex  flex-row gap-4 w-[96%] mx-auto'>
        <Sidebar />
        <Explorebar/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Explore;
