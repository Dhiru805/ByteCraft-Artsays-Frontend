import React from 'react';
import Translate from './Translate'; // Adjust the path as necessary

const ParentComponent = () => {
  const translatePage = (languageCode) => {
    if (window.google && window.google.translate) {
      const selectField = document.querySelector(".goog-te-combo");
      if (selectField) {
        selectField.value = languageCode;
        setTimeout(() => {
          selectField.dispatchEvent(new Event("change"));
        }, 100); // Slight delay to ensure the event is processed
      }
    }
  };

  return (
    <div className='lang'>
      <li className="dropdown" id="languageSelect">
        <a
          className="dropdown-toggle text-uppercase"
          data-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Lng
        </a>
        <div className="dropdown-menu pl-4 pr-4">
          <a
            className="dropdown-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              translatePage('en');
            }}
            data-value="en"
          >
            English
          </a>
          <a
            className="dropdown-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              translatePage('es');
            }}
            data-value="es"
          >
            Spanish
          </a>
          <a
            className="dropdown-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              translatePage('fr');
            }}
            data-value="fr"
          >
            French
          </a>
        </div>
      </li>
      <Translate />
    </div>
  );
};

export default ParentComponent;
