import React, { useMemo, useEffect } from 'react'
import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import Customization from '../../Component/SocialMedia/live/Customization';
import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../AuthContext';
const CreateLive = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userType === 'Buyer') {
      navigate('/artsays-community/live-history');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleLogin = useMemo(
    () => () => {
      toast.info('Please log in to create a live stream');
      navigate('/login');
    },
    [navigate]
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        {/* <header className='w-full'>
          <NavBar />
        </header> */}
        <main className='flex flex-row items-start sm:gap-4 w-full sm:w-[96%] mx-auto'>
          <Sidebar />
          <div className="flex-1 flex justify-center">
            <LoginGate onLogin={handleLogin} />
          </div>
          <Suggestion />
        </main>
      </div>
    );
  }

  // Restrict access to Creators only
  if (userType !== 'Artist' && userType !== 'Seller' && userType !== 'Super-Admin') {
     // If user is Buyer, we are redirecting in useEffect, so return null to avoid flash
     if (userType === 'Buyer') return null;
     
     return (
       <div className="flex flex-col">
         <main className='flex flex-row items-start sm:gap-4 w-full sm:w-[96%] mx-auto'>
           <Sidebar />
           <div className="flex-1 flex justify-center py-12">
             <div className="bg-[#FEE2CC] p-8 rounded-xl text-center shadow-sm w-full max-w-2xl">
                 <h2 className="text-2xl font-bold text-[#48372D] mb-3">Creator Access Only</h2>
                 <p className="text-[#5E3F24] mb-6">
                   Only Artists and Sellers can create live streams. 
                   As a {userType || 'Visitor'}, you can watch lives in the Live History section.
                 </p>
                 <button 
                     onClick={() => navigate('/artsays-community/live-history')}
                     className="bg-[#6E4E37] text-white px-6 py-2 rounded-lg hover:bg-[#5a3c2d] transition"
                 >
                     Watch Live Streams
                 </button>
             </div>
           </div>
           <Suggestion />
         </main>
       </div>
     );
  }

  return (
     <div className=" flex flex-col">
     {/* <header className='w-full   '>
      <NavBar />
     </header> */}

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex  flex-row items-start sm:gap-4 w-full sm:w-[96%] mx-auto '>
        <Sidebar />
        <div className="flex-1 relative z-10">
          <Customization/>
        </div>
        <Suggestion/>
      </main>
     
    </div>
  )
}

const LoginGate = ({ onLogin }) => (
  <div className="w-full flex flex-col items-center justify-center py-12 px-4 bg-[#FEE2CC] rounded-xl text-center">
    <h2 className="text-2xl font-bold text-[#48372D] mb-3">Log in to start a live</h2>
    <p className="text-[#5E3F24] mb-6 max-w-xl">
      You need an account to create and manage live streams. Please sign in to continue.
    </p>
    <button
      onClick={onLogin}
      className="bg-[#6E4E37] hover:bg-[#5a3c2d] text-white font-semibold px-5 py-2 rounded-lg shadow"
    >
      Go to Login
    </button>
  </div>
);

export default CreateLive