import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import ProfileSuggestion from '../../Component/SocialMedia/Suggestion/ProfileSuggestion';


const SuggestedProfile = () => {
  return (
    <div className=" flex flex-col bg-[#fff]">
     <header className='w-full '>
      <NavBar />
     </header>

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 w-[96%] mx-auto '>
        <Sidebar />
        <ProfileSuggestion/>
      </main>
     
    </div>
  );
};

export default SuggestedProfile;
