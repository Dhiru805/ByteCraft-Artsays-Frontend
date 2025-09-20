import Hero from './Hero/Hero'
import BrowseCategories from './BrowseCategories/BrowseCategories'
import WhyFromArtsays from './WhyFromArtsays/WhyFromArtsays'
import BiddingArena from './BiddingArena/BiddingArena'
import HowToBuy from './HowToBuy/HowToBuy'
import DiscoverArtist from './DiscoverArtist/DiscoverArtist'
import WhyArtsaysDifferent from './WhyArtsaysDifferent/WhyArtsaysDifferent.jsx'
import HomeChallenges from './HomeChallenges/HomeChallenges'
import ArtIcon from './ArtIcon/ArtIcon'
import HowToSell from './HowToSell/HowToSell'

const Homepage = () => {
  return (
    <div className="font-[poppins] !bg-[#ffffff]">
        <Hero/>
        <BrowseCategories/>
        <WhyFromArtsays/>
        <BiddingArena/>
        <HowToBuy/>
        <DiscoverArtist/>
        <WhyArtsaysDifferent/>
        <HomeChallenges/>
        <ArtIcon/>
        <HowToSell/>
    </div>
  );
};

export default Homepage;
