import React, { useState, useRef, useEffect } from "react";
import "./Notification.css";

const notificationData = [
  {
    id: 1,
    username: "Kumar vk",
    profilepic:
      "",
    description: "Liked your post",
    time: "1h",
    readed: true,
  },
  {
    id: 2,
    username: "Kumar Sharma",
    profilepic:
      "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
    description: "Amazing art piece",
    time: "2h",
    readed: true,
  },
  {
    id: 3,
    username: "Kunal Sharma",
    profilepic: "",
    description:
      "This piece is honestly stunning. The way you’ve blended the colors and paid attention to the small details shows how much thought and care went into it. There’s such a calm, emotional energy coming through — it really pulls the viewer in. You’ve got such a unique style, can’t wait to see more from you!",
    time: "3h",
    readed: true,
  },
  {
    id: 4,
    username: "Gwen Stacy",
    profilepic:
      "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=360",
    description: "New art piece in stock!!!! Check out now!!",
    time: "4h",
    readed: true,
  },
  {
    id: 5,
    username: "Kumar vk",
    profilepic:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
    description: "Liked your post",
    time: "1h",
    readed: true,
  },
  {
    id: 6,
    username: "Kumar Sharma",
    profilepic:
      "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
    description: "Amazing art piece",
    time: "2h",
    readed: true,
  },
  {
    id: 7,
    username: "Kunal Sharma",
    profilepic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuwgGU4p-LPa3mJHvKBMG9Qb7UPVuUM1ZAJiPJbxzwXuSQrkGsKqLUqPYMiy-Mu7l8v0&usqp=CAU",
    description:
      "This piece is honestly stunning. The way you’ve blended the colors and paid attention to the small details shows how much thought and care went into it. There’s such a calm, emotional energy coming through — it really pulls the viewer in. You’ve got such a unique style, can’t wait to see more from you!",
    time: "3h",
    readed: true,
  },
  {
    id: 8,
    username: "Gwen Stacy",
    profilepic:
      "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=360",
    description: "New art piece in stock!!!! Check out now!!",
    time: "4h",
    readed: true,
  },
  {
    id: 9,
    username: "Kumar vk",
    profilepic:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
    description: "Liked your post",
    time: "1h",
    readed: false,
  },
  {
    id: 10,
    username: "Kumar Sharma",
    profilepic:
      "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
    description: "Amazing art piece",
    time: "2h",
    readed: false,
  },
  {
    id: 11,
    username: "Kunal Sharma",
    profilepic: "",
    description:
      "This piece is honestly stunning. The way you’ve blended the colors and paid attention to the small details shows how much thought and care went into it. There’s such a calm, emotional energy coming through — it really pulls the viewer in. You’ve got such a unique style, can’t wait to see more from you!",
    time: "3h",
    readed: false,
  },
  {
    id: 12,
    username: "Gwen Stacy",
    profilepic:
      "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=360",
    description: "New art piece in stock!!!! Check out now!!",
    time: "4h",
    readed: false,
  },
];

const NotificationBar = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lg:w-[56%] w-full px-2 md:px-4 lg:px-20 py-4">
      {/* Notification Tab Bar */}
      <div className="flex flex-row  items-center justify-between sm:gap-4 gap-1 bg-[#E8DAB2] p-2.5 rounded-xl shadow-sm">
        <div className="flex flex-wrap sm:gap-5 gap-1">
          <button className="text-black nt-btn sm:text-lg text-[15px] px-2 py-1 font-semibold sm:px-3.5 sm:py-2.5 rounded-full">All</button>
          <button className="text-black nt-btn sm:text-lg text-[15px] px-2 py-1 font-semibold sm:px-3.5 sm:py-2.5 rounded-full">Mentions</button>
          <button className="text-black nt-btn sm:text-lg text-[15px] px-2 py-1 font-semibold sm:px-3.5 sm:py-2.5 rounded-full">My post</button>
        </div>
        <div>
          <button className="text-black nt-btn sm:text-lg text-[15px] px-2 py-1 font-semibold sm:px-3.5 sm:py-2.5 rounded-full">Mark all as read</button>
        </div>
      </div>

      {/* Notification List */}
      <div className="mt-4 flex flex-col gap-3">
        {notificationData.map((item) => (
          <div
            key={item.id + item.time}
            className={` ${item.readed ? 'bg-[#48372D]' : 'bg-white'} ${item.readed ? 'text-white ' : 'text-[#0000000] font-medium'} ${!item.readed ? 'border-[1px] border-[#48372D]' : ''} sm:p-3 p-1.5 rounded-xl flex justify-between gap-4 shadow-sm relative`}
          >
            {/* Left Section */}
            <div className="flex gap-3 w-full">
              <div className="flex gap-2">
                <div className="h-full flex items-center justify-between">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                </div>
               <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] rounded-full overflow-hidden flex items-center justify-center">
  <img
    src={item.profilepic && item.profilepic.trim() !== "" ? item.profilepic : "https://www.w3schools.com/howto/img_avatar.png"}
    alt={item.username}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }}
    className="w-full h-full object-cover"
  />
</div>


              </div>
              <div className="flex flex-col justify-center text-sm">
                <span>
                  <span className="font-semibold text-lg">{item.username} :</span>{" "}
                  <span className="break-words ">{item.description}</span>

                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end justify-between min-w-fit h-full gap-1 relative" ref={dropdownRef}>
              <span className={`text-sm ${item.readed ? 'text-white' : 'text-[#000000]'} whitespace-nowrap`}>{item.time}</span>
              <i
                className={`ri-more-fill ${item.readed ? 'text-white' : 'text-[#000000]'} text-lg cursor-pointer hover:text-gray-300`}
                onClick={() =>
                  setOpenDropdownId((prev) => (prev === item.id ? null : item.id))
                }
              ></i>

              {/* Dropdown Menu */}
              {openDropdownId === item.id && (
                <div className="absolute right-0 sm:top-12 top-11  text-black shadow-md rounded-lg z-[999] w-40 md:w-40 sm:w-32 bg-gray-200   ">
                <button className="w-full sm:px-2 sm:py-2 p-1 text-[#000000] hover:bg-gray-100">
                    Delete Notification
                  </button>
                  <hr className="my-1 border-gray-300" />
                  <button className="w-full sm:px-2 sm:py-2 p-1 text-[#000000] hover:bg-gray-100">
                   Report
                  </button>
                  <hr className="my-1 border-gray-300" />
                  <button className="w-full sm:px-2 sm:py-2 p-1 text-[#000000] hover:bg-gray-100">
                     Mark as Read
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationBar;
