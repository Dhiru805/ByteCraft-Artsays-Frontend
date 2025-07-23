// import React, { useState } from 'react';
// import './Form.css';

// const CustomizationTab = () => {
//   const [formData, setFormData] = useState({
//     liveChat: false,
//     liveChatReplay: false,
//     liveChatSummary: false,
//     participantMode: {
//       anyone: false,
//       subscribers: false,
//       commentary: false,
//     },
//     liveReactions: false,
//   });

//   const handleChange = (e, section = null) => {
//     const { name, checked } = e.target;

//     if (section === 'participant') {
//       setFormData(prev => ({
//         ...prev,
//         participantMode: {
//           ...prev.participantMode,
//           [name]: checked,
//         },
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: checked,
//       }));
//     }
//   };

//   const handleSubmit = () => {
//     console.log("Customization submitted:", formData);
//     alert("Customization submitted!");
//   };

//   return (
//     <div className="customization-container">
//       <p className="subheading">Settings to tailor your stream to your needs</p>

//       <div className="section">
//         <h4>Comments</h4>
//         <label><input type="checkbox" name="liveChat" onChange={handleChange} /> Live chat</label>
//         <label><input type="checkbox" name="liveChatReplay" onChange={handleChange} /> Live chat replay</label>
//         <label><input type="checkbox" name="liveChatSummary" onChange={handleChange} /> Live chat summary</label>
//       </div>

//       <div className="section">
//         <h4>Participant modes</h4>
//         <p className="description">Who can send messages</p>
//         <label><input type="checkbox" name="anyone" onChange={(e) => handleChange(e, 'participant')} /> Anyone</label>
//         <label><input type="checkbox" name="subscribers" onChange={(e) => handleChange(e, 'participant')} /> Subscribers</label>
//         <label><input type="checkbox" name="commentary" onChange={(e) => handleChange(e, 'participant')} /> Live commentary (approved users)</label>
//       </div>

//       <div className="section">
//         <h4>Reactions</h4>
//         <label><input type="checkbox" name="liveReactions" onChange={handleChange} /> Live reactions</label>
//       </div>

//       <button className="done-btn" onClick={handleSubmit}>Done</button>
//     </div>
//   );
// };

// export default CustomizationTab;








// import React, { useState } from 'react';
// import './Form.css';

// const CustomizationTab = () => {
//   const [formData, setFormData] = useState({
//     liveChat: false,
//     liveChatReplay: false,
//     liveChatSummary: false,
//     participantMode: {
//       anyone: false,
//       subscribers: false,
//       commentary: false,
//     },
//     liveReactions: false,
//   });

//   const handleChange = (e, section = null) => {
//     const { name, checked } = e.target;

//     if (section === 'participant') {
//       setFormData(prev => ({
//         ...prev,
//         participantMode: {
//           ...prev.participantMode,
//           [name]: checked,
//         },
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: checked,
//       }));
//     }
//   };

//   const handleSubmit = () => {
//     console.log("Customization submitted:", formData);
//     alert("Customization submitted!");
//   };

//   return (
//     <div className="customization-container">
//       <p className="subheading">Settings to tailor your stream to your needs</p>

//       <div className="section">
//         <h4>Comments</h4>
//         <label><input type="checkbox" name="liveChat" onChange={handleChange} /> Live chat</label>
//         <label><input type="checkbox" name="liveChatReplay" onChange={handleChange} /> Live chat replay</label>
//         <label><input type="checkbox" name="liveChatSummary" onChange={handleChange} /> Live chat summary</label>
//       </div>

//       <div className="section">
//         <h4>Participant modes</h4>
//         <p className="description">Who can send messages</p>
//         <label><input type="checkbox" name="anyone" onChange={(e) => handleChange(e, 'participant')} /> Anyone</label>
//         <label><input type="checkbox" name="subscribers" onChange={(e) => handleChange(e, 'participant')} /> Subscribers</label>
//         <label><input type="checkbox" name="commentary" onChange={(e) => handleChange(e, 'participant')} /> Live commentary (approved users)</label>
//       </div>

//       <div className="section">
//         <h4>Reactions</h4>
//         <label><input type="checkbox" name="liveReactions" onChange={handleChange} /> Live reactions</label>
//       </div>

//       <button className="done-btn" onClick={handleSubmit}>Done</button>
//     </div>
//   );
// };

// export default CustomizationTab;














import React, { useState } from 'react';
import './Form.css';

const CustomizationTab = () => {
  const [formData, setFormData] = useState({
    liveChat: false,
    liveChatReplay: false,
    liveChatSummary: false,
    participantMode: {
      anyone: false,
      subscribers: false,
      commentary: false,
    },
    liveReactions: false,
  });

  const handleChange = (e, section = null) => {
    const { name, checked } = e.target;

    if (section === 'participant') {
      setFormData(prev => ({
        ...prev,
        participantMode: {
          ...prev.participantMode,
          [name]: checked,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Customization submitted:", formData);
    alert("Customization submitted!");
  };

  return (
    <div className="customization-container">
      <p className="subheading">Settings to tailor your stream to your needs</p>

      <div className="section">
        <h4>Comments</h4>
        <label><input type="checkbox" name="liveChat" onChange={handleChange} /> Live chat</label>
        <label><input type="checkbox" name="liveChatReplay" onChange={handleChange} /> Live chat replay</label>
        <label><input type="checkbox" name="liveChatSummary" onChange={handleChange} /> Live chat summary</label>
      </div>

      <div className="section">
        <h4>Participant modes</h4>
        <p className="description">Who can send messages</p>
        <label><input type="checkbox" name="anyone" onChange={(e) => handleChange(e, 'participant')} /> Anyone</label>
        <label><input type="checkbox" name="subscribers" onChange={(e) => handleChange(e, 'participant')} /> Subscribers</label>
        <label><input type="checkbox" name="commentary" onChange={(e) => handleChange(e, 'participant')} /> Live commentary (approved users)</label>
      </div>

      <div className="section">
        <h4>Reactions</h4>
        <label><input type="checkbox" name="liveReactions" onChange={handleChange} /> Live reactions</label>
      </div>

      <button className="done-btn" onClick={handleSubmit}>Done</button>
    </div>
  );
};

export default CustomizationTab;
