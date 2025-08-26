import React, { useState, useEffect, useRef } from 'react';
import '../Searchbar/searchb.css';

const purchaseArt = [
  {
    id: 1,
    username: 'nelson_deloy',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHKpNAnotdZoCP1iBPj3P1ZOQmzRyiEH99LA&s',
  },
  {
    id: 2,
    username: 'nelson_deloy',
    image:
      'https://cdn.shopify.com/s/files/1/2663/8918/files/a_2_254285bb-28ce-4294-b1f8-0e207b9c76a5.jpg?v=1735175174',
  },
  {
    id: 3,
    username: 'nelson_deloy',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7gEg42AQ-6ROYp3fqylmcyov9GE9bARqSAu_mr57V7Ohvfn_CHdqm4NaFZW_xIrNI28Y&usqp=CAU',
  },
  {
    id: 4,
    username: 'nelson_deloy',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Z69I0Wb7noLFUHTQ0mLaGp50NlXxpacs3w&s',
  },
  {
    id: 5,
    username: 'nelson_deloy',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZaDaT_QSBM2l3abTsOzRCp-qVvwFXIVmqw&s',
  },
  {
    id: 6,
    username: 'nelson_deloy',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShxHmdVfKWsT70dH1VEiyv94HvHUDmaYQ98hI_x-1ddpKFvwB7lmNwPPtgspaLtewpP3g&usqp=CAU',
  },
  {
    id: 7,
    username: 'nelson_deloy',
    image:
      'https://www.shutterstock.com/image-photo/panoramic-view-picturesque-valley-morning-260nw-2462509707.jpg',
  },
  
  {
    id: 8,
    username: 'nelson_deloy',
    image:
      'https://www.shutterstock.com/image-photo/panoramic-view-picturesque-valley-morning-260nw-2462509707.jpg',
  },

];

const Explorebar = () => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="lg:w-[56%] w-full max-w-6xl mx-auto flex flex-col gap-6 lg:mt-6 lg:px-4">
    
      {/* Art Grid */}
      <div className="art-grid ">
        {purchaseArt.map((art) => (
          <div key={art.id} className="art relative rounded-xl ">
            <img
              src={art.image}
              alt="Art"
              className="w-full h-60 object-cover rounded-2xl"
            />
            {/* Overlay Header */}
            <div className="absolute top-0 left-0 w-full bg-[#000000BF] bg-opacity-50 text-white flex justify-between items-center px-2 py-2.5 text-xs">
              <span className="font-medium text-lg">{art.username}</span>
              <div className="flex gap-2 items-center text-lg">
                <i className="ri-shopping-cart-2-fill text-[#FB5934]"></i>
                <i
                  className="ri-more-fill cursor-pointer"
                  onClick={() =>
                    setActiveMenuId((prev) => (prev === art.id ? null : art.id))
                  }
                ></i>
              </div>
            </div>

            {/* Dropdown Menu */}
            {activeMenuId === art.id && (
              <div
                ref={menuRef}
                className="absolute top-2 right-1 flex flex-col items-center  z-10 bg-white text-black text-sm rounded-xl  shadow-lg  w-32"
              >
                <button className=" bg-gray-100 w-full px-4 py-2  hover:bg-gray-400 rounded-t-lg ">
                  Report
                </button>
                 <hr className="w-full border-t border-gray-800" />
                <button className="bg-gray-100 w-full px-4 py-2  hover:bg-gray-400">
                  Save
                </button>
                 <hr className="w-full border-t border-gray-800" />
                <button className=" bg-gray-100 w-full px-4 py-2  hover:bg-gray-400">
                  Go to post
                </button>
                 <hr className="w-full border-t border-gray-800" />
                <button className=" bg-gray-100 w-full px-4 py-2  hover:bg-gray-400 rounded-b-lg">
                  Share
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorebar;
