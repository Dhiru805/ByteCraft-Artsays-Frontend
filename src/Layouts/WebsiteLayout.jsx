
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from '../Pages/Home/HomeComponents/NavBar';


const WebsiteLayout = () => {
    useEffect(() => {
    import('../index.css');
  }, [])
  return (
    <div >
      <NavBar />
      <Outlet />
    </div>
  );
};

export default WebsiteLayout;