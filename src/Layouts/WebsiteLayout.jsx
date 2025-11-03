
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from '../Pages/Home/HomeComponents/NavBar';
import Footer from '../Pages/Home/HomeComponents/Footer';


const WebsiteLayout = () => {
    useEffect(() => {
    import('../index.css');
  }, [])
  return (
    <div >
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default WebsiteLayout;