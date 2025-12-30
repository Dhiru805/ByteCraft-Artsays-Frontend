import React from 'react';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Explorebar from '../../Component/SocialMedia/explore/Explorebar';

const Explore = () => {
  return (
    <div className=" flex flex-col">
     

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='grid grid-cols-12 gap-2 p-2'>
        <Sidebar />
        <Explorebar/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Explore;
