// useSidebarToggle.js
import { useEffect } from 'react';

const useSidebarToggle = () => {
  const handleToggleSidebar = () => {
    const isSmallScreen = window.innerWidth <= 768;

    if (isSmallScreen) {
      const sidebar = document.getElementById('left-sidebar');
      sidebar.classList.toggle('open');

      if (sidebar.classList.contains('open')) {
        document.body.classList.add('offcanvas-active');
      } else {
        document.body.classList.remove('offcanvas-active');
      }
    } else {
      document.body.classList.toggle('layout-fullwidth');
      document.body.classList.toggle('sidebar_toggle');
    }

    const isSidebarToggled = document.body.classList.contains('sidebar_toggle');
    localStorage.setItem('sidebarToggle', isSidebarToggled ? 'true' : 'false');
  };

  useEffect(() => {
    const savedToggleState = localStorage.getItem('sidebarToggle');
    const isSmallScreen = window.innerWidth <= 768;

    setTimeout(() => {
      if (savedToggleState === 'true' || isSmallScreen) {
        document.body.classList.add('layout-fullwidth', 'sidebar_toggle');
        document.body.classList.remove('offcanvas-active');
      }

      const mediaQuery = window.matchMedia('(max-width: 768px)');

      const handleResize = () => {
        if (mediaQuery.matches) {
          if (!document.body.classList.contains('layout-fullwidth')) {
            document.body.classList.add('layout-fullwidth', 'sidebar_toggle');
            document.body.classList.remove('offcanvas-active');
          }
        } else {
          document.body.classList.remove('layout-fullwidth', 'sidebar_toggle');
        }
      };

      mediaQuery.addEventListener('change', handleResize);
      handleResize();

      return () => {
        mediaQuery.removeEventListener('change', handleResize);
      };
    }, 100);
  }, []);

  return { handleToggleSidebar };
};

export default useSidebarToggle;
