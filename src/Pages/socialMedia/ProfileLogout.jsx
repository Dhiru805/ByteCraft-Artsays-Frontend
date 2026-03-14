import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'

const ProfileLogout = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    const handleSignOut = () => {
      try {
        logout();
        
        localStorage.removeItem("profilePhoto");
        localStorage.removeItem("sidebarToggle");
        
        window.dispatchEvent(new Event("profilePhotoUpdated"));
        
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } catch (error) {
        console.error("Logout error:", error);
        window.location.href = "/";
      }
    };
    
    handleSignOut();
  }, [logout, isLoggingOut]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Logging out...</p>
      </div>
    </div>
  )
}

export default ProfileLogout
