import React from 'react'
import { useEffect} from 'react'

const ProfileLogout = () => {
 

  useEffect(()=>{
 const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("profilePhoto");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    window.dispatchEvent(new Event("profilePhotoUpdated"));
    window.location.href = "/";
  };
handleSignOut()
},[])
  return (
    <div>
      
    </div>
  )
}

export default ProfileLogout
