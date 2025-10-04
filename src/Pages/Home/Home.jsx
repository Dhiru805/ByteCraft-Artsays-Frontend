import NavBar from "./HomeComponents/NavBar";
import Footer from "./HomeComponents/Footer";

import FeaturedProducts from "./HomeComponents/FeaturedProducts";
import HowItWorks from "./HomeComponents/HowItWorks";
import Deals from "./HomeComponents/Deals";
import Traction from "./HomeComponents/Traction";
import LeaderBar from "./HomeComponents/LeaderBar";
import FAQS from "./HomeComponents/FAQS";

import HeroSection from "./HomeComponents/HeroSection";

const deals = [
  {
    title: "Bidding Deals",
    description:
      "Explore our most sought-after artworks and exclusive artifacts.",
  },
  {
    title: "Daily Deals",
    description:
      "Explore our most sought-after artworks and exclusive artifacts.",
  },
];
const Home = () => {
  return (
    <div className="w-full     mx-auto h-screen  bg-base ">
      <div className="  border-b-[0.6px] border-orange-200">
        <NavBar />
      </div>

      <HeroSection />

      <FeaturedProducts />

      <HowItWorks />

      <div className="w-full bg-base flex flex-col gap-8 ">
        {deals.map((deal) => {
          return <Deals deal={deal} key={deal.title} />;
        })}
      </div>

      <Traction />
      <LeaderBar />
      <FAQS />
      <Footer />
    </div>
  );
};

export default Home;
