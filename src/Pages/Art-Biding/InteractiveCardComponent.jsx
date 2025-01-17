import React, { useEffect, useRef, useState } from 'react';
import "./InteractiveCardComponent.css";
 
const InteractiveCardComponent = () => {
  const cardContainerRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [time, setTime] = useState(getCurrentTime());
  const cardCount = 3; // Update this if you add more cards
 
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return { hours, minutes, seconds };
  }
 
  const cardImages = [
    "https://images.squarespace-cdn.com/content/v1/56c462e37da24f9466fa8ed8/1457520354768-8Q7IHP63XPVAW5XXK5PI/01+-+sy6UkVX.jpg",
    "https://images.squarespace-cdn.com/content/v1/56c462e37da24f9466fa8ed8/1457520354768-8Q7IHP63XPVAW5XXK5PI/01+-+sy6UkVX.jpg",
    "https://images.squarespace-cdn.com/content/v1/56c462e37da24f9466fa8ed8/1457520354768-8Q7IHP63XPVAW5XXK5PI/01+-+sy6UkVX.jpg",
  ];
 
  const designations = [
    "Software Developer",
    "Graphic Designer",
    "Product Manager",
  ];
 
  const bids = [
    "$1000",
    "$1500",
    "$2000",
  ];
 
  const avatarImages = [
    "https://c0.klipartz.com/pngpicture/136/22/gratis-png-perfil-de-usuario-computadora-iconos-chica-cliente-avatar.png",
    "https://c0.klipartz.com/pngpicture/136/22/gratis-png-perfil-de-usuario-computadora-iconos-chica-cliente-avatar.png",
    "https://c0.klipartz.com/pngpicture/136/22/gratis-png-perfil-de-usuario-computadora-iconos-chica-cliente-avatar.png",
  ];
 
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentCard(prevCard => (prevCard + 1) % cardCount);
    }, 3000); // Change to the interval you need
 
    return () => clearInterval(intervalId);
  }, [cardCount]);
 
  useEffect(() => {
    const cards = cardContainerRef.current.querySelectorAll('.icc-card');
 
    cards.forEach((card, index) => {
      card.classList.remove('icc-card--current', 'icc-card--out', 'icc-card--next');
     
      if (index === currentCard) {
        card.classList.add('icc-card--current');
        card.style.transform = 'translateY(0px) rotate(0deg) translateX(0px) scale(1)';
      } else if (index === (currentCard - 1 + cardCount) % cardCount) {
        card.classList.add('icc-card--out');
        card.style.transform = 'translateY(0px) rotate(15deg) translateX(80px) scale(0.9)';
      } else if (index === (currentCard + 1) % cardCount) {
        card.classList.add('icc-card--next');
        card.style.transform = 'translateY(0px) rotate(10deg) translateX(20px) scale(1)';
      } else {
        card.style.transform = 'translateY(0px) rotate(0deg) translateX(30px) scale(0.9)';
      }
    });
  }, [currentCard, cardCount]);
 
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
 
    return () => clearInterval(intervalId);
  }, []);
 
  return (
    <div className="card-box grad-container">
      <ul className="icc-cards" ref={cardContainerRef}>
        {cardImages.map((image, index) => (
          <li className={`icc-card card-${index + 1}`} key={index}>
            <div className="icc-image-container">
              <img src={image} alt={`Main item ${index + 1}`} className="icc-main-image" />
            </div>
            <div className="icc-avatar-container">
              <img src={avatarImages[index]} alt="Avatar" className="icc-avatar" />
              <span className="icc-designation">{designations[index]}</span>
            </div>
            <div className="icc-clock">
              <div className="icc-time">{time.hours} <span>hrs</span></div>
              <div className="icc-dot"> <span>:</span></div>
              <div className="icc-time">{time.minutes} <span>min</span></div>
              <div className="icc-dot"> <span>:</span></div>
              <div className="icc-time">{time.seconds} <span>sec</span></div>
            </div>
            <div className="bar-container">
              <div className="bar"></div>
            </div>
            <div className="icc-bid">Current Bid: {bids[index]}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default InteractiveCardComponent;
 
 