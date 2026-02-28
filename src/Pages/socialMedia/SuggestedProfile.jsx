<<<<<<< HEAD
// import NavBar from '../Home/HomeComponents/NavBar';
=======
import NavBar from '../Home/HomeComponents/NavBar';
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';
import ProfileSuggestion from '../../Component/SocialMedia/Suggestion/ProfileSuggestion';


const SuggestedProfile = () => {
  return (
    <div className=" flex flex-col bg-[#fff]">
     

      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='flex flex-row gap-4 w-[96%] mx-auto '>
        <Sidebar />
        <ProfileSuggestion/>
      </main>
     
    </div>
  );
};

export default SuggestedProfile;
