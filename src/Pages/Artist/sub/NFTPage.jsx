import React, { useState, useEffect } from "react";
// import "./NFTPage.css";
import { MdOutlineVerified } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";

function NFTPage() {
  // Odometer-like counters
  const [totalSales, setTotalSales] = useState(0);
  const [auctions, setAuctions] = useState(0);
  const [artists, setArtists] = useState(0);

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 50,
    seconds: 34,
  });

  // Target values for the counters (60, 30, 12)
  const targetSales = 60;
  const targetAuctions = 30;
  const targetArtists = 12;

  // Increment the values gradually
  useEffect(() => {
    const salesInterval = setInterval(() => {
      setTotalSales((prev) => {
        if (prev < targetSales) {
          return prev + 1; // Increment by 1
        } else {
          clearInterval(salesInterval);
          return targetSales;
        }
      });
    }, 100); // Adjust speed as needed

    const auctionsInterval = setInterval(() => {
      setAuctions((prev) => {
        if (prev < targetAuctions) {
          return prev + 1;
        } else {
          clearInterval(auctionsInterval);
          return targetAuctions;
        }
      });
    }, 100);

    const artistsInterval = setInterval(() => {
      setArtists((prev) => {
        if (prev < targetArtists) {
          return prev + 1;
        } else {
          clearInterval(artistsInterval);
          return targetArtists;
        }
      });
    }, 100);

    return () => {
      clearInterval(salesInterval);
      clearInterval(auctionsInterval);
      clearInterval(artistsInterval);
    };
  }, [targetSales, targetAuctions, targetArtists]);

  // Countdown timer logic
  useEffect(() => {
    const endTime = new Date().getTime() + 23 * 60 * 60 * 1000 + 50 * 60 * 1000 + 34 * 1000; // Example end time

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timerInterval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <>
      <div className="nft-main-box">
        <div className="nft-left-box">
          <div className="nft-left-upper">
            <div className="nft-heading">
              <h1>
                Find Biggest NFT <MdOutlineVerified /> Digital Artwork in the
                Market
                <span className="mil-text-image">
                  <img
                    className="hero-image"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm5uSeCbyC3l91LtajJomCPR0lm6rms6jx4A&s"
                    alt="team"
                  />
                </span>
              </h1>
              <div className="nft-des">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Similique, doloribus  fugit
                  provident aut veritatis. Eaque.
                </p>
              </div>
              <div className="btn-div">
                <button className="button-64" role="button">
                  <span className="text">Explore More</span>
                </button>
              </div>
            </div>
          </div>
          <div className="nft-left-lower">
            <div className="nft-lower-left">
              <div className="nft-img">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRQcFv25Ir-y4fXZGQp4AmS02j1ts9C-ecMQ&s"
                  alt=""
                />
                <div className="img-content">
                  <h1>unknown artist</h1>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Delectus, facere.
                  </p>
                </div>
              </div>
            </div>
            <div className="nft-lower-right">
              <div className="nft-img">
                <img
                  src="https://mtr-cdn.com/images/nft_trader.width-648.jpg"
                  alt=""
                />
                <div className="img-content">
                  <h1>unknown artist</h1>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Delectus, facere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nft-right-box">
          <div className="nft-card">
            <div className="card-container-box">
              <a href="/" className="hero-image-container">
                <img
                  className="hero-image"
                  src="https://pics.craiyon.com/2023-10-01/726ab4051ad04badabf0f1315c67db5a.webp"
                  alt="Spinning glass cube"
                />
                <div className="img-content-artist">
                  <h1>unknown artist</h1>
                  <p>@artist</p>
                </div>
              </a>
              <main className="main-content-box">
                <div className="flex-row">
                  <div className="coin-base">
                    <h4>Current bid:</h4>
                    <h2>
                      <span>
                        <FaEthereum />{" "}
                      </span>
                      0.041 ETH
                    </h2>
                  </div>
                  <div className="time-left">
                    <h4>Remaining Time</h4>
                    <h2>
                      {timeLeft.hours}hrs: {timeLeft.minutes}min: {timeLeft.seconds}sec
                    </h2>
                  </div>
                </div>
              </main>
              <div className="card-attribute">
                <button className="button-64" role="button">
                  <span className="text">Button 64</span>
                </button>
                <button className="button-64" role="button">
                  <span className="text">Button 50</span>
                </button>
              </div>
            </div>
          </div>
          <div className="nft-artist-info">
            <div className="nft-artist-stats-artist">
              <div className="artist-stat">
                <h2>{totalSales}K</h2>
                <p>Total</p>
              </div>
              <div className="arist-line"></div>
              <div className="artist-stat">
                <h2>{auctions}K</h2>
                <p>Auctions</p>
              </div>
              <div className="arist-line"></div>
              <div className="artist-stat">
                <h2>{artists}K</h2>
                <p>Artists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NFTPage;
