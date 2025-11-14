import React, { useState, useEffect, useRef } from "react";
import Sidebarprofile from './Sidebarprofile';
import Sidebar from './sidebar';
import SettingsPanel from './seetingpanel'
import getAPI from "../../../api/getAPI"

const UserAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const users = [];

  const [notifications, setNotifications] = useState(true);
  const [offline, setOffline] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState("cyan");
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem('selectedFont') || 'font-nunito';
  });
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [rtlMode, setRtlMode] = useState(false);

  const handleToggleSidebar = () => {
    const sidebar = document.getElementById('left-sidebar');

    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    } else {
      sidebar.classList.add('open');
    }
  };



  useEffect(() => {
    const storedRtlMode = localStorage.getItem('rtlMode') === 'true';
    setRtlMode(storedRtlMode);
  }, []);

  useEffect(() => {
    const body = document.body;

    if (rtlMode) {
      body.classList.add('rtl_mode');
    } else {
      body.classList.remove('rtl_mode');
    }

    localStorage.setItem('rtlMode', rtlMode);
  }, [rtlMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      if (savedTheme === 'dark') {
        setDarkMode(true);
        setHighContrastMode(false);
      } else if (savedTheme === 'high-contrast') {
        setDarkMode(false);
        setHighContrastMode(true);
      } else {
        setDarkMode(false);
        setHighContrastMode(false);
      }
    } else {
      setDarkMode(false);
      setHighContrastMode(false);
    }


  }, []);

  useEffect(() => {

    if (highContrastMode) {
      document.documentElement.setAttribute("data-theme", "high-contrast");
      document.body.setAttribute("data-theme", "high-contrast");
      localStorage.setItem('theme', 'high-contrast');
      setDarkMode(false);
    }

    else if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem('theme', 'dark');
      setHighContrastMode(false);
    }

    else {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem('theme', 'light');
    }

  }, [darkMode, highContrastMode]);

  useEffect(() => {
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
      setSelectedColor(savedColor);
    }
  }, []);

  useEffect(() => {
    if (selectedColor) {

      document.getElementById("wrapper").className = `theme-${selectedColor}`;

      localStorage.setItem('selectedColor', selectedColor);
    }
  }, [selectedColor]);


  const handleFontChange = (event) => {
    const font = event.target.value;
    setSelectedFont(font);
    localStorage.setItem('selectedFont', font);
  };

  useEffect(() => {
    const fontLinks = ["font-nunito", "font-ubuntu", "font-raleway", "font-IBMplex"];
    fontLinks.forEach((font) => {
      document.getElementById(font).disabled = true;
    });
    document.getElementById(selectedFont).disabled = false;
    document.body.className = selectedFont;
  }, [selectedFont]);


  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null)

  const HandletoggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fonts = [
    { label: "Poppins", value: "poppins" },
    { label: "Ubuntu Font", value: "font-ubuntu" },
    { label: "Raleway Google Font", value: "font-raleway" },
    { label: "IBM Plex Google Font", value: "font-IBMplex" },
  ];


  const decodeJWT = (token) => {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  };


  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    const decodedToken = decodeJWT(token);
    const userId = decodedToken.userId;

    try {
      const response = await getAPI(`/auth/user/${userId}`); 
      setUser(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
      fetchUserDetails();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="left-sidebar" className="sidebar ">
      <Sidebarprofile
        user={user}
        isOpen={isOpen}
        handleToggleSidebar={handleToggleSidebar}
        HandletoggleDropdown={HandletoggleDropdown}
        userId={user?._id} 
        fetchUserDetails={fetchUserDetails}
      />
      <div className="sidebar-scroll">

        <ul className="nav nav-tabs justify-content-between align-items-center">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#menu" style={{ padding: "13px 20px" }}>
              Menu
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#setting">
              <i class="fa fa-cog" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
        <div className="tab-content padding-0">
          <div className="tab-pane active" id="menu">
            <Sidebar />
          </div>
          <div className="tab-pane" id="Chat">
            <form>
              <div className="input-group m-b-20">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="icon-magnifier"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
              </div>
            </form>
            <ul className="right_chat list-unstyled li_animation_delay">
              {users.map((user, index) => (
                <li key={index}>
                  <a href="#" className="media">
                    <img
                      className="media-object"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <div className="media-body">
                      <span className="name d-flex justify-content-between">
                        {user.name} <i className="fa fa-heart-o font-12"></i>
                      </span>
                      <span className="message">{user.email}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="tab-pane" id="setting">

            <SettingsPanel
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              highContrastMode={highContrastMode}
              setHighContrastMode={setHighContrastMode}
              rtlMode={rtlMode}
              setRtlMode={setRtlMode}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              handleFontChange={handleFontChange}
              notifications={notifications}
              setNotifications={setNotifications}
              offline={offline}
              setOffline={setOffline}
              locationPermission={locationPermission}
              setLocationPermission={setLocationPermission}
              fonts={fonts}
            />


            {/* <a
              href="https://themeforest.net/item/iconic-boostrap-admin-dashboard-html-template/33511081"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-block btn-primary"
            >
              Buy this item
            </a>
            <a
              href="https://themeforest.net/user/wrraptheme/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-block btn-secondary"
            >
              View portfolio
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;









