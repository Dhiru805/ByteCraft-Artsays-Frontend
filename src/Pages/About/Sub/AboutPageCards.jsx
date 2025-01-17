import React, { useEffect, useState } from 'react';
import './AboutPageCards.css';

const OverlappingCards = () => {
  const cards = [
    {
      id: 1,
      alt: "Card 1",
      src:"./artimages/product3.webp",
      text: "Poème by Helena Vitto, Criciuma, SC, BR"
    },
    {
      id: 2,
      alt: "Card 2",
      src:"./artimages/product9.jpg",
      text: "Art by John Doe, New York, NY, US"
    },
    {
      id: 3,
      alt: "Card 3",
      src:"./artimages/product4.webp",
      text: "Masterpiece by Jane Smith, London, UK"
    },
    {
      id: 4,
      alt: "Card 4",
      src:"./artimages/product6.webp",
      text: "Design by Mark Lee, Sydney, AU"
    },
    {
      id: 5,
      alt: "Card 5",
      src:"./artimages/product7.webp",
      text: "Creation by Sara Kim, Seoul, KR"
    },
    {
      id: 6,
      alt: "Card 6",
      src:"./artimages/product8.jpg",
      text: "Craft by Alex Johnson, Toronto, CA"
    },
    {
      id: 7,
      alt: "Card 7",
      src:"./artimages/product9.jpg",
      text: "Design by Alice Brown, Berlin, DE"
    },
    {
      id: 8,
      alt: "Card 8",
      src:"./artimages/product8.jpg",
      text: "Craft by Alex Johnson, Toronto, IN"
    },
    {
      id: 9,
      alt: "Card 9",
      src:"./artimages/product8.jpg",
      text: "Craft by Alex Johnson, Toronto, IN"
    },
  ];

  const [activeCard, setActiveCard] = useState(1); // Start with the second card (index 1)

  useEffect(() => {
    const interval = setInterval(() => {
      const firstCard = document.querySelector('.overlap-cards .about-card:first-child');
      const container = document.querySelector('.overlap-cards');
  
      if (firstCard && container) {
        firstCard.classList.add('move-out');
        setTimeout(() => {
          container.appendChild(firstCard);
          firstCard.classList.remove('move-out');
          setActiveCard((prev) => (prev + 1) % cards.length);
        }, 1500); // Duration matches the transition for smooth effect
      }
    }, 2500);
  
    return () => clearInterval(interval);
  }, [cards.length]);
  
  return (
    <div className="card-container">
      <div className="overlap-cards">
        {cards.map((card) => (
          <div key={card.id} className="about-card">
            <img src={card.src} alt={card.alt} className="about-card-img" />
          </div>
        ))}
      </div>
      <div className="submission-info">
        <span className="submission-text">Just submitted:</span>
        <span className="submission-author">
          {cards[activeCard].text} {/* Dynamically show the text for the active card */}
        </span>
      </div>
    </div>
  );
};

export default OverlappingCards;
