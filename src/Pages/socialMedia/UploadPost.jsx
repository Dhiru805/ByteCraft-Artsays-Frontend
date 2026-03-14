import React from 'react';
import Uploadpost from '../../Component/SocialMedia/Create-post/Uploadpost';

const UploadPost = () => {
  return (
    <div className=" flex flex-col">
     

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row w-full mx-auto'>
        <Uploadpost />
      </main>
     
    </div>
  );
};

export default UploadPost;
