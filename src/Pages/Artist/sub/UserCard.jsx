import React from "react";
import { FaCheckCircle, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai"; // Use filled star icon
import "./CardLayout.css"; // Custom CSS for styling

const users = [
  {
    name: "Harry Olson",
    rate: "$40.00",
    role: "Student",
    location: "Australia",
    image: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
    type: "Student",
    country: "Australia",
    rating: 4.5,
  },
  {
    name: "David Parker",
    rate: "$25.00",
    role: "Individual",
    location: "Qatar",
    image: "https://i.pinimg.com/474x/0a/a8/58/0aa8581c2cb0aa948d63ce3ddad90c81.jpg",
    type: "Individual",
    country: "Qatar",
    rating: 4.5,
  },
  {
    name: "Chenai Simon",
    rate: "$55.00",
    role: "Group",
    location: "Australia",
    image: "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png",
    type: "Group",
    country: "Australia",
    rating: 4.5,
  },
  {
    name: "Bayley Robert",
    rate: "$35.00",
    role: "Student",
    location: "Germany",
    image: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
    type: "Student",
    country: "Germany",
    rating: 4.5,
  },
];

const UserProfileCard = () => {
  return (
    <div className="user-profile-crd-container">
      {users.map((user, index) => (
        <div key={index} className="user-profile-crd">
          <div className="user-profile-crd-avatar">
            <img src={user.image} alt={user.name} className="user-profile-crd-avatar-image" />
          </div>
          <div className="user-profile-crd-info">
            <h3 className="user-profile-crd-name">
              {user.name}
              <FaCheckCircle className="user-profile-crd-check-icon" />
            </h3>
            <p className="user-profile-crd-rate">Hourly rate: {user.rate}</p>
            <div className="user-profile-crd-rating">
              {Array.from({ length: 5 }, (_, i) => (
                <AiFillStar
                  key={i}
                  className={i < Math.floor(user.rating) ? "user-profile-crd-star-filled" : ""}
                />
              ))}
            </div>
            <div className="user-profile-crd-tags">
              <span>
                <FaUserTag className="user-profile-crd-tag-icon" /> {user.type}
              </span>
              <span>
                <FaMapMarkerAlt className="user-profile-crd-tag-icon" /> {user.country}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfileCard;
