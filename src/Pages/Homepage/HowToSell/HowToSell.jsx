import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Package
} from "lucide-react";
import getAPI from "../../../api/getAPI";
import HowToSellSkeleton from "../../../Component/Skeleton/HowToSellSkeleton";
import { getImageUrl } from '../../../utils/getImageUrl';

const HowToSell = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        if (!homepage?._id) throw new Error("No published homepage found");

        const sectionRes = await getAPI(
          `/api/homepage-sections/how-to-sell/${homepage._id}`
        );
        if (!sectionRes.data.success) throw new Error("How To Sell not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div><HowToSellSkeleton /></div>;
  if (!data) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="w-full bg-white font-[poppins] py-20 px-4 md:px-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#6F4D34]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header Section - Matching HomeChallenges style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 flex-1"
          >
            <div className="flex items-center gap-2 text-[#6F4D34] font-bold tracking-[0.2em] uppercase text-sm">
              <Sparkles size={18} className="animate-pulse" />
              <span>Step-by-step Guide</span>
            </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
                {data.heading}
              </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              {data.description}
            </p>
          </motion.div>

          {data.buttonName && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <a
                href={data.buttonLink || "#"}
                className="hidden lg:flex group relative inline-flex items-center gap-3 bg-[#6F4D34] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-[#6F4D34]/30 hover:bg-gray-900 hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">{data.buttonName}</span>
                <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
            </motion.div>
          )}
        </div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data.cards?.map((card, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-gray-50/50 rounded-[48px] p-8 md:p-10 border border-gray-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(111,77,52,0.12)] hover:border-[#6F4D34]/20"
            >
              {/* Step Number Badge */}
              <div className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-[#6F4D34] group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                <span className="text-2xl font-black italic">0{idx + 1}</span>
              </div>

              {/* Icon/Image Container */}
              <div className="mb-10 relative">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                  {card.image ? (
                    <img
                      src={getImageUrl(card.image)}
                      alt={card.title}
                      className="w-14 h-14 object-contain group-hover:rotate-6 transition-transform"
                    />
                  ) : (
                    <Package className="w-10 h-10 text-[#6F4D34]" />
                  )}
                </div>
                
                {/* Decorative dots for the first card */}
                {idx === 0 && (
                   <div className="absolute -left-4 -top-4 w-20 h-20 bg-[#6F4D34]/10 rounded-full blur-2xl -z-10" />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-[#6F4D34] transition-colors tracking-tight">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              {/* Bottom Interactive Bar */}
              <div className="mt-8 flex items-center justify-between">
                {card.icons?.length > 0 && (
                  <div className="flex -space-x-2">
                    {card.icons.map((icon, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-gray-50 p-1.5 shadow-sm overflow-hidden hover:z-10 transition-all hover:-translate-y-1">
                        <img
                          src={getImageUrl(icon)}
                          alt="tech"
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full group-hover:bg-[#6F4D34] group-hover:w-24 transition-all duration-700" />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-[#6F4D34]/0 via-transparent to-[#6F4D34]/0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-3 md:!gap-8 py-6 px-4 md:!px-10 bg-gray-50 rounded-full border border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-gray-700 font-bold text-xs md:!text-sm">Safe Delivery</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2">
              <UserCheck className="text-blue-500" size={20} />
              <span className="text-gray-700 font-bold text-xs md:!text-sm">Verified Sellers</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2">
              <TrendingUp className="text-amber-500" size={20} />
              <span className="text-gray-700 font-bold text-xs md:!text-sm">Instant Selling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToSell;
