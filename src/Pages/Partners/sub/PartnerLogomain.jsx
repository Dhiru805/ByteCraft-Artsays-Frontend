import React, { useEffect } from 'react';
import gsap from 'gsap';
import './partnerlogomain.css';

const PartnerLogomain = () => {
    useEffect(() => {
        const logos = [
            "partner-page-logos/dashboard.png",
            "partner-page-logos/figma.png",
            "partner-page-logos/gmail.png",
            "partner-page-logos/jira.png",
            "partner-page-logos/slack.png",
            "partner-page-logos/youtube.png",
            "partner-page-logos/social.png",
            "partner-page-logos/salesforce.png",
            "partner-page-logos/gmail.png",
            "partner-page-logos/jira.png",
            "partner-page-logos/slack.png",
            "partner-page-logos/zoom.png" // Added sixth logo
        ];

        const logoContainers = document.querySelectorAll('.logo-section-imgs');
        const totalLogos = logos.length;
        let currentIndex = 0;

        function updateLogos() {
            logoContainers.forEach((container, index) => {
                const logo = container.querySelector('img');
                logo.src = logos[(currentIndex + index) % totalLogos];
                gsap.set(logo, { y: '100%', opacity: 0 });
            });
        }

        function animateLogos() {
            logoContainers.forEach((container, index) => {
                const logo = container.querySelector('img');
                const timeline = gsap.timeline({
                    repeat: -1, // Infinite loop
                    repeatDelay: 2, // Wait 2 seconds before repeating
                });

                timeline
                    .to(logo, {
                        y: '0%',
                        opacity: 1,
                        duration: 1,
                        delay: index * 0.1, // Adjusted delay to ensure smooth entry
                    })
                    .to(logo, {
                        y: '0%',
                        opacity: 1,
                        duration: 3, // Display for 3 seconds
                    })
                    .to(logo, {
                        y: '-100%',
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            currentIndex = (currentIndex + 1) % totalLogos;
                            logo.src = logos[(currentIndex + index) % totalLogos];
                            gsap.set(logo, { y: '100%', opacity: 0 });
                        },
                    });
            });
        }

        updateLogos();
        animateLogos();

        return () => {
            logoContainers.forEach((container) => {
                const logo = container.querySelector('img');
                gsap.killTweensOf(logo); // Ensure all GSAP animations are stopped
            });
        };
    }, []);

    return (
        <div className='main-section-partners'>
            <div className='logo-heading'>
                <h1>Our growing team of Services Partners</h1>
            </div>
            <div className='logo-section'>
                {Array(6).fill().map((_, index) => (
                    <div key={index} className='logo-section-imgs'>
                        <img src={`${index + 1}.png`} alt={`Brand Logo ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PartnerLogomain;
