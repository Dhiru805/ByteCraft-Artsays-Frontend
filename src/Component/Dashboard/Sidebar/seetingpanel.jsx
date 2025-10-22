import React from "react";

const SettingsPanel = ({
  darkMode,
  setDarkMode,
  highContrastMode,
  setHighContrastMode,
  rtlMode,
  setRtlMode,
  selectedColor,
  setSelectedColor,
  selectedFont,
  // setSelectedFont,
  handleFontChange,
  notifications,
  setNotifications,
  offline,
  setOffline,
  locationPermission,
  setLocationPermission,
  fonts,
}) => {
  return (
    <div>
      {/* <h6>Choose Skin</h6>
      <ul className="choose-skin list-unstyled">
        {["purple", "blue", "cyan", "green", "orange", "blush", "red"].map((color, index) => (
          <li
            key={index}
            data-theme={color}
            onClick={() => setSelectedColor(color)}
            style={{ cursor: "pointer" }}
            className={selectedColor === color ? "active" : ""}
          >
            <div className={color}></div>
          </li>
        ))}
      </ul> */}

      <ul className="list-unstyled font_setting mt-3">
        {fonts.map((font, index) => (
          <li key={index}>
            <label className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                className="custom-control-input"
                name="font"
                value={font.value}
                checked={selectedFont === font.value}
                onChange={handleFontChange}
              />
              <span className="custom-control-label">{font.label}</span>
            </label>
          </li>
        ))}
      </ul>

      <hr />


      <ul className="list-unstyled mt-3">
        <li className="d-flex align-items-center mb-2">
          <label className="toggle-switch theme-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => {
                setDarkMode(!darkMode);
                if (!darkMode) {
                  setHighContrastMode(false);
                }
              }}
            />
            <span className="toggle-switch-slider"></span>
          </label>
          <span className="ml-3">Enable Dark Mode!</span>
        </li>
        <li className="d-flex align-items-center mb-2">
          <label className="toggle-switch theme-rtl">
            <input
              type="checkbox"
              checked={rtlMode}
              onChange={() => setRtlMode(!rtlMode)}
            />
            <span className="toggle-switch-slider"></span>
          </label>
          <span className="ml-3">Enable RTL Mode!</span>
        </li>
        <li className="d-flex align-items-center mb-2">
          <label className="toggle-switch theme-high-contrast">
            <input
              type="checkbox"
              checked={highContrastMode}
              onChange={() => {
                setHighContrastMode(!highContrastMode);
                if (!highContrastMode) {
                  setDarkMode(false);
                }
              }}
            />
            <span className="toggle-switch-slider"></span>
          </label>
          <span className="ml-3">Enable High Contrast Mode!</span>
        </li>
      </ul>

      {/* <h6>General Settings</h6>
      <ul className="setting-list list-unstyled">
        <li>
          <label className="fancy-checkbox">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span>Allowed Notifications</span>
          </label>
        </li>
        <li>
          <label className="fancy-checkbox">
            <input
              type="checkbox"
              checked={offline}
              onChange={() => setOffline(!offline)}
            />
            <span>Offline</span>
          </label>
        </li>
        <li>
          <label className="fancy-checkbox">
            <input
              type="checkbox"
              checked={locationPermission}
              onChange={() => setLocationPermission(!locationPermission)}
            />
            <span>Location Permission</span>
          </label>
        </li>
      </ul>  */}
    </div>
  );
};

export default SettingsPanel;
