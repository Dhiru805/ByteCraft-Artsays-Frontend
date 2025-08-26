import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Createpost from '../../Component/SocialMedia/Create-post/Createpost';

const CreatePost = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full  '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row lg:gap-4 lg:w-[96%] w-full mx-auto'>
        <Sidebar />
        <Createpost/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default CreatePost;
