
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';


const WebsiteLayout = () => {
    useEffect(() => {
    import('../index.css'); 
  }, [])
  return (
    <div >
      <Outlet />
    </div>
  );
};

export default WebsiteLayout;