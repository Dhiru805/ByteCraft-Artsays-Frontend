import React from 'react';
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';

import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import NotificationBar from '../../Component/SocialMedia/notification/NotificationBar';

const Notification = () => {
  return (
    <div className=" flex flex-col">
     <header className='w-full '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 w-[96%] mx-auto'>
        <Sidebar />
        <NotificationBar/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Notification;
