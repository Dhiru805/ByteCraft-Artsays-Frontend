import { useParams } from "react-router-dom";
import Adminandsuperadmin from "./SuperAdmin/UserProf";
import Artist from "./Artist/UserProfile/UserProf"
import Buyer from "./Buyer/UserProf"
import useUserType from '../urlconfig';

const UserProfileForm = () => {
  const { userId } = useParams();
  const userType = useUserType();

  return (
    <>
      {(userType === "Super-Admin" || userType === "Admin") && (
        <Adminandsuperadmin userId={userId} />
      )}
      {userType === "Artist" && <Artist userId={userId} />}
      {userType === "Buyer" && <Buyer userId={userId} />}
    </>
  );
};

export default UserProfileForm;
