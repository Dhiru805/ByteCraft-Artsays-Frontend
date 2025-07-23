import React, { useState } from 'react';
import "./Side-post-sugg.css";
const Suggestion = () => {
  const users = [
    {
      name: 'James Patel',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
    {
      name: 'James Patel',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
    {
      name: 'James Patel',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
    {
      name: 'James Patel',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
  ];
 
  const adImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3oql1QTjEkuSfZYyT2Rxsxb_CNSSjwUeyXg&s',
    'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?cs=srgb&dl=pexels-steve-1585325.jpg&fm=jpg',
    'https://i0.wp.com/montessorifromtheheart.com/wp-content/uploads/2023/03/Straw-Print-Flower-Painting-Craft.jpg?resize=1080%2C1350&ssl=1',
  ];
 
  const [activeAdIndex, setActiveAdIndex] = useState(0);
 
  return (
    <div className=" w-full  sm:w-[60%] md:w-[30%] lg:w-[22%] px-2 mt-1">
      <h3 className="text-lg font-bold my-2 ml-1">Suggested for you</h3>
 
{users.map((user, index) => (
   <div
    key={index}
    className={`suggested flex flex-col sm:flex-row p-1 items-start sm:items-center justify-between mb-2 gap-2
      ${index === 0 ? 'border-t border-t-[#6E4E37]' : ''}
      ${index === users.length - 1 ? 'border-b border-b-[#6E4E37]' : ''}`}
  >
    {/* Avatar + Name */}
    <div className="flex items-center gap-2 ">
      <img
        src={user.avatar}
        alt="avatar"
        className="rounded-full w-9 h-9 object-cover"
      />
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
        <p className="text-[8px] text-gray-600">Suggested for you</p>
      </div>
    </div>
 
    {/* Buttons stack on mobile, inline on tablet+ */}
    <div className="flex flex-row sm:flex-row gap-1 items-center sm:ml-auto">
      <button className="bg-[#6F4D34] hover:bg-gray-200 text-white text-[11px] sm:text-sm px-2 py-[5px] rounded-lg border border-gray-300 font-semibold transition-colors duration-300 whitespace-nowrap">
        Follow
      </button>
      <button className="text-[#6E4E37] text-xl leading-none">
        <i className="ri-close-line"></i>
      </button>
    </div>
  </div>
))}
 
 
 
      <hr className="h-0.5 bg-gray-700 text-gray-400 border-none mt-2" />
 
      {/* Ad Section */}
      <div className="mt-3 w-full flex flex-col">
        <div className="flex border-4 border-[#4C3427] bg-[#4C3427] mb-3 rounded-xl overflow-hidden h-40 w-full">
          {adImages.map((src, idx) => {
            const isActive = idx === activeAdIndex;
            return (
              <div
                key={idx}
                onClick={() => setActiveAdIndex(idx)}
                className={`cursor-pointer transition-all duration-300 ease-in overflow-hidden ${
                  idx === 0 ? 'border-l-0' : 'border-l-4 border-l-[#2C211B]'
                }`}
                style={{
                  flexGrow: isActive ? 5 : 1,
                  flexBasis: isActive ? '65%' : '15%',
                  transitionProperty: 'flex-grow, flex-basis',
                }}
              >
                <img
                  src={src}
                  alt={`ad-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
 
        <p className="w-full text-sm text-[#564138] p-1.5 rounded-xl border-2 border-[#4C3427] font-bold text-[#333]">
          The art drop you didn’t know you needed!!
        </p>
 
        {/* Responsive Explore Now Button */}
        <button className="text-xs mt-2 sm:text-sm w-full font-semibold text-white bg-[#6F4D34] px-3 sm:px-4 py-2 rounded hover:bg-[#cc3e0e] transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};
 
export default Suggestion;