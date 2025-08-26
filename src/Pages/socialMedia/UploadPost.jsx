import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Uploadpost from '../../Component/SocialMedia/Create-post/Uploadpost';

const UploadPost = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full   '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 lg:w-[96%] w-full mx-auto'>
        <Uploadpost />
      </main>
     
    </div>
  );
};

export default UploadPost;
