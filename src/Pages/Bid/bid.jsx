import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import HeroImgBid from './hero-img/hero-img';
import BidProduct from './bidProduct/bidProduct';
import SponsoredProducts from '../../Component/Common/SponsoredProducts';

const Bid = () => {
  return (
    <div className="w-full mx-auto font-[poppins]">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" },
              { "@type": "ListItem", "position": 2, "name": "Bidding Arena", "item": "https://artsays.in/bid" }
            ]
          })}
        </script>
      </Helmet>
      <HeroImgBid/>
      <nav aria-label="breadcrumb" className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-2 text-sm text-gray-500 py-3">
        <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
        <ChevronRight size={14} />
        <span className="text-[#6F4D34] font-semibold" aria-current="page">Bidding Arena</span>
      </nav>
      <BidProduct/>
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
          <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

export default Bid;
