import React from 'react';

import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import NavBar from '../Home/HomeComponents/NavBar';



const Test = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full   '> 
      <NavBar/>
      </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row  w-[96%] mx-auto'>
        <Sidebar />
        
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Test;
