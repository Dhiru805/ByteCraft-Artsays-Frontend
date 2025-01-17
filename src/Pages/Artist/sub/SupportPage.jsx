import React from 'react';
import './SupportPage.css'; // Make sure the CSS filename matches your setup
import { MdPerson, MdWork, MdMessage, MdHelp, MdSearch } from 'react-icons/md'; // Import icons

const SupportCenter = () => {
    return (
        <div className="support-center-container">
            <header className="support-header-wrapper">
                <div className="header-content-wrapper">
                    <div className="header-text-block">
                        <h1 className="support-header-title">Find a solution fast.</h1>
                        <p className="header-description-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt harum pariatur aliquam ullam quos nisi doloribus placeat excepturi, ut voluptate.</p>
                        <div className="search-bar-container">
                            <input type="text" className="search-input-field" placeholder="Search Articles on Support Help" />
                            <MdSearch className="search-icon-style" />
                        </div>
                        <p className="text-with-link">Lorem ipsum dolor sit amet. <a href="#" className="create-account-link">create an account</a></p>
                    </div>
                    <div className="header-image-container">
                        <img src="artimages/Screenshot 2024-09-05 104539.png" className="main-header-image"/>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default SupportCenter;
