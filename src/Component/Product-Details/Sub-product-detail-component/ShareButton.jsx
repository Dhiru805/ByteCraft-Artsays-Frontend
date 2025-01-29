import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaShareSquare, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { IoIosLink } from 'react-icons/io';
import './ShareButton.css'; // Import your CSS for styling

const ShareButton = ({ url, title }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const handleShare = (platform) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    // Open a small new window
    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(
      shareUrls[platform],
      'ShareWindow',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no`
    );

    // Close the dropdown after sharing
    setDropdownVisible(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="share-button-container" ref={dropdownRef}>
      <FaShareSquare onClick={toggleDropdown} className="share-icon" />
      {dropdownVisible && (
        <div className="dropdown-menu-share">
          <div className="dropdown-content-share">
            <div className="dropdown-item-share" onClick={() => handleShare('facebook')}>
              <FaFacebookF />
              Facebook
            </div>
            <div className="dropdown-item-share" onClick={() => handleShare('twitter')}>
              <FaTwitter />
              Twitter
            </div>
            <div className="dropdown-item-share" onClick={() => handleShare('linkedin')}>
              <FaLinkedinIn />
              LinkedIn
            </div>
            <div className="dropdown-item-share">
              <IoIosLink />
              Copy Link
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ShareButton;
