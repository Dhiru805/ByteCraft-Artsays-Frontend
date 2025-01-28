import React from 'react';

const partnersData = [
    { img: 'images/p-logo1.png', alt: 'Partner Logo 1' },
    { img: 'images/p-logo2.png', alt: 'Partner Logo 2' },
    { img: 'images/p-logo3.png', alt: 'Partner Logo 3' },
    { img: 'images/p-logo4.png', alt: 'Partner Logo 4' },
    { img: 'images/p-logo5.png', alt: 'Partner Logo 5' },
    { img: 'images/p-logo6.png', alt: 'Partner Logo 6' },
    { img: 'images/p-logo4.png', alt: 'Partner Logo 4' }
];

const PartnerSection = () => {
    return (
        <div className="partnerSec  overflow-hidden pt-xl-15 pt-lg-10 pt-md-8 pt-15 pb-md-16 pb-5">
            <div className="row">
                <div className="col-12">
                    {/* partnerSlider */}
                    <div className="partnerSliders">
                        <div className="partnerSliderTrack">
                            {partnersData.concat(partnersData).map((partner, index) => (
                                <div key={index} className="logoColumn d-flex align-items-center justify-content-center">
                                    <a href="#">
                                        <img src={partner.img} alt={partner.alt} className="img-fluid" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerSection;
