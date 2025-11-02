import React, { useState, useEffect } from 'react';
import './NFTCard.css';
import InteractiveCardComponent from './InteractiveCardComponent';

const cardData = [
    {
        background: "#5A9597",
        avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
        sub: "Support",
        bid: "2.5 ETH",
    },
    {
        background: "#EEF999",
        avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
        sub: " Integration",
        bid: "3.0 ETH",
    },
    {
        background: "#5A9597",
        avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
        sub: "Support",
        bid: "2.5 ETH",
    },
    {
        background: "#5A9597",
        avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
        sub: "Support",
        bid: "2.5 ETH",
    },
];

const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return {
        hours: h,
        minutes: m,
        seconds: s
    };
};

const NFTCard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            rotateCards(activeIndex);
            setActiveIndex((prevIndex) => (prevIndex + 1) % cardData.length);
        }, 1000); // Change cards every 1 second

        return () => clearInterval(interval);
    }, [activeIndex]);

    const rotateCards = (index) => {
        const cards = document.querySelectorAll(".unique-card");
        cards.forEach((card, i) => {
            if (i <= index) {
                card.style.transform = `translate(0%, -120vh) rotate(-48deg)`;
            } else {
                card.style.transform = `translate(0%, -50%) rotate(${i * 30}deg)`;
            }
        });

        setTimeout(resetCards, 3000);
    };

    const resetCards = () => {
        const cards = document.querySelectorAll(".unique-card");
        cards.forEach((card, i) => {
            card.style.transform = `translate(-50%, -50%) rotate(${i * 10}deg)`;
        });
    };

    // State for the stats
    const [stats, setStats] = useState({
        totalSales: 0,
        auctions: 0,
        artists: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats => {
                const newTotalSales = prevStats.totalSales < 5000 ? Math.min(prevStats.totalSales + 100, 5000) : prevStats.totalSales;
                const newAuctions = prevStats.auctions < 2500 ? Math.min(prevStats.auctions + 20, 2500) : prevStats.auctions;
                const newArtists = prevStats.artists < 1000 ? Math.min(prevStats.artists + 10, 1000) : prevStats.artists;

                if (newTotalSales === 5000 && newAuctions === 2500 && newArtists === 1000) {
                    clearInterval(interval); // Stop updating when all limits are reached
                }

                return {
                    totalSales: newTotalSales,
                    auctions: newAuctions,
                    artists: newArtists,
                };
            });
        }, 50); // Update every 50ms to simulate a fast increase

        return () => clearInterval(interval);
    }, []);

    return (
        <>
        {/* <div className="spacer"></div> */}
        <div className="nft-collection NFTgrad-container">
            <div className="nft-left-column">
                <div className="nft-header">
                    <h1>Buy and sell digital art, <span className="highlighter mx-1">NFTs</span> Collection</h1>
                    <p>The world's first and largest digital marketplace for crypto collectibles and NFTs</p>
                </div>
                <div className="nft-buttons">
                    <button className="ci-notify-btn btn btn mr-4">Explore →</button>
                    <button className="ci-notify-btn btn btn">Create →</button>
                </div>
                <div className="nft-stats ">
                    <div className="stat">
                        <h2>{stats.totalSales.toLocaleString()}+</h2>
                        <p> Sales</p>
                    </div>
                    <div className="line"></div>
                    <div className="stat">
                        <h2>{stats.auctions.toLocaleString()}+</h2>
                        <p>Auctions</p>
                    </div>
                    <div className="line"></div>
                    <div className="stat">
                        <h2>{stats.artists.toLocaleString()}+</h2>
                        <p>Artists</p>
                    </div>
                    <div className="line"></div>
                </div>
            </div>
            <div className="nft-right-column">
                <InteractiveCardComponent/>
            </div>
        </div>
        </>
    );
};

export default NFTCard;
