import React, { useState } from 'react';
import './ChallengeCard.css';

const ChallengeCard = ({
  title = "Celebrate The Spirit Of Diwali Through Art",
  subtitle = "Show Us Your Corner Of Diwali.",
  image = "https://c.animaapp.com/mfc58pccnbalUD/img/rectangle-4840-2.png",
  daysLeft = "15 Days Left",
  categories = ["Handmade", "Oil Acrylic Watercolor Paintings", "Photography"],
  prizeTitle = "Prize",
  prizeDescription = "Spotlight On ArtSays Homepage\nLimited Edition Print Feature",
  isReversed = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="challenge-card-container">
      <div className={`challenge-card ${isReversed ? 'reverse' : ''}`}>
        {/* Text Section */}
        <div className="challenge-details">

          {/* Toggle between CHALLENGE VIEW and LEARN MORE VIEW */}
          {!showDetails ? (
            <>
              <div className="badge">
                <span>{daysLeft}</span>
              </div>

              <h1 className="challenge-title">{title}</h1>
              <p className="challenge-subtitle">{subtitle}</p>

              <div className="categories">
                {categories.map((category, index) => (
                  <span key={index} className="category">
                    {category}
                  </span>
                ))}
              </div>

              <div className="prize">
                <div className="prize-header">
                  <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 26 26" fill="#ff4d4d">
                      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.781 1.402 8.174L12 18.896l-7.336 3.87 1.402-8.174L.132 9.211l8.2-1.193z" />
                    </svg>
                  </div>
                  <div className="prize-text">
                    <p className="prize-title">{prizeTitle}</p>
                    <p className="prize-description">{prizeDescription}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="challenge-details-expanded">
                <h3>About This Challenge</h3>
                <p><strong>Theme -</strong> Celebrate the Spirit of Diwali Through Art 🪔✨</p>
                <p><strong>Description -</strong> Artists are invited to express the joy, lights, and festive spirit of Diwali through their unique style — whether it’s painting, digital art, illustration, or photography. Show how you see the festival of lights!</p>
                <p><strong>Submission Deadline -</strong> 25th October 2025</p>
                <p><strong>Prizes -</strong> Featured spot on ArtSays, social media shoutouts, and a digital certificate.</p>
                <p><strong>Eligibility -</strong> Open to all registered ArtSays creators worldwide.</p>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="buttons">
            <button
              className={`join-button ${!showDetails ? 'active' : ''}`}
              onClick={() => setShowDetails(false)}
            >
              Join The Challenge
            </button>
            <button
              className={`learn-more-button ${showDetails ? 'active' : ''}`}
              onClick={() => setShowDetails(true)}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Image Section (you can optionally hide on Learn More if needed) */}
        <div className="challenge-image-container">
          <img
            className="challenge-image"
            alt="Challenge artwork"
            src={image}
          />
        </div>
      </div>
    </section>
  );
};

export default ChallengeCard;
