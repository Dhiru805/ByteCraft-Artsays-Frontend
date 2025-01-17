import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
 
function ScrollToTop() {
  const { pathname } = useLocation();
 
  useEffect(() => {
    window.scrollTo(0, 0); // Correct method to scroll to the top
  }, [pathname]);
 
  return null;
}
 
export default ScrollToTop;
 
 