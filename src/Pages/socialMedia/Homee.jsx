import React from 'react';
// import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Post from '../../Component/SocialMedia/Posts/Posts';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';

const Homee = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full   '>
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='grid grid-cols-12 gap-2 p-2'>
        <Sidebar />
        <Post />
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Homee;
