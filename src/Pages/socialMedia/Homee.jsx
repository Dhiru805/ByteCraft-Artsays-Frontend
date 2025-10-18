import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Post from '../../Component/SocialMedia/Posts/Posts';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';

const Homee = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full   '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex l flex-row lg:gap-4 lg:w-[96%] mx-auto'>
        <Sidebar />
        <Post />
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Homee;
