import React from "react";
import ServiceCard from "./ServiceCard";
import './ServiceList.css'; // Import the CSS file here

const services = [
  {
    images: [
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/app-dev-600x399.jpg",
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/ads-600x399.jpg",
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/comunity-600x399.jpg"
    ],
    profileImg: "https://themebing.com/wp/prolancer/wp-content/uploads/2021/04/pexels-pixabay-220453-80x80.jpg",
    name: "Bayley Robertson",
    delivery: "1-3 Weeks",
    description: "I will teach google ads adwords over zoom, live sessions",
    category: "Marketing",
    price: "20.00",
  },
  {
    images: [
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/ads-600x399.jpg",
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/comunity-600x399.jpg",

    ],
    profileImg: "https://themebing.com/wp/prolancer/wp-content/uploads/2021/04/pexels-mentatdgt-1138903-80x80.jpg",
    name: "Chenai Simon",
    delivery: "2-3 Months",
    description: "I will be your community manager in english or spanish",
    category: "Management",
    price: "80.00",
  },
  {
    images: [
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/comunity-600x399.jpg",
      "https://themebing.com/wp/prolancer/wp-content/uploads/2021/09/ads-600x399.jpg"
    ],
    profileImg: "https://themebing.com/wp/prolancer/wp-content/uploads/2021/04/pexels-andrea-piacquadio-3777566-80x80.jpg",
    name: "David Parker",
    delivery: "6 Months",
    description: "I will do SEO backlinks with blogger outreach",
    category: "Link Building",
    price: "40.00",
  }
];

const ServiceList = () => {
  return (
    <div className="svc-unique-service-list">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
};

export default ServiceList;
