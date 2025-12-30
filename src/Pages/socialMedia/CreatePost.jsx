import React from 'react';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import Createpost from '../../Component/SocialMedia/Create-post/Createpost';

const CreatePost = () => {
  return (
    <div className=" flex flex-col">
    
      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='grid grid-cols-12 gap-2 p-2'>
        <Sidebar />
        <Createpost/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default CreatePost;
