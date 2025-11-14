// const steps = [
//   {
//     title: "Browse Products/Categories",
//     desc: "Explore our handpicked collection across categories.",
//     img: "/images/browse.png", // replace with your image path
//   },
//   {
//     title: "Add to Cart or Buy Now",
//     desc: "Hit Add to Cart to continue browsing Or Buy Now to go directly to checkout.",
//     img: "/images/add-to-cart.png",
//   },
//   {
//     title: "Enter Shipping Information",
//     desc: "Provide your full name, delivery address, and contact number so we can safely deliver your artwork.",
//     img: "/images/shipping.png",
//   },
//   {
//     title: "Review Your Cart",
//     desc: "Check your selected artworks. Confirm quantities, framing choices, shipping fees, and estimated delivery time.",
//     img: "/images/review.png",
//   },
//   {
//     title: "Choose a Payment Method",
//     desc: "We support: Mastercard, Visa, UPI, Rupay, Paytm.",
//     img: "/images/payment.png",
//   },
//   {
//     title: "Confirm & Place Order",
//     desc: "Review all details. Click Place Order to complete your purchase.",
//     img: "/images/place-order.png",
//   },
// ];

// const HowToBuy = () => {
//   return (
//     <div className="bg-[#F8F8F8]">
//       <div className="max-w-[1440px] mx-auto py-4 px-3">
//         <div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//             {/* title */}
//             <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//               From Browse to Buy
//             </h1>
//             <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//               Discover More Products
//             </button>
//           </div>

//           <hr className="my-3 border-dark" />

//           {/* Subtitle */}
//           <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//             At ArtSays, we make it simple for you to collaborate directly with
//             talented artists and bring your creative vision to life.
//           </p>
//         </div>

//         <section className="w-full py-16">
//           {/* Steps Row 1 */}
//           <div className="flex flex-col lg:flex-row items-stretch justify-center gap-10 md:gap-0 mb-8">
//             {/* Card 1 */}
//             <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-md p-6 text-center relative z-10">
//               <img
//                 src="/herosectionimg/Shrug-bro 1.png"
//                 alt="Browse"
//                 className="mx-auto mb-4 w-full h-40 object-contain"
//               />
//               <h3 className="text-lg font-semibold">
//                 Browse Products/Categories
//               </h3>
//               <p className="text-gray-600 mt-2 text-sm">
//                 Explore our handpicked collection across categories.
//               </p>
//             </div>

//             {/* Connector */}
//             <div className="hidden lg:flex items-center justify-center relative z-0 w-6">
//               <div className="h-[10%] w-full bg-[#ffffff] shadow-lg absolute top-1/2 -translate-y-1/2"></div>
//             </div>

//             {/* Card 2 */}
//             <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-md p-6 text-center relative z-10">
//               <img
//                 src="/herosectionimg/Shrug-bro 1.png"
//                 alt="Cart"
//                 className="mx-auto mb-4 w-40 h-40 object-contain"
//               />
//               <h3 className="text-lg font-semibold">Add to Cart or Buy Now</h3>
//               <p className="text-gray-600 mt-2 text-sm">
//                 Hit Add to Cart to continue browsing
//                 <br />
//                 Or Buy Now to go directly to checkout.
//               </p>
//             </div>

//             {/* Connector */}
//             <div className="hidden lg:flex items-center justify-center relative z-0 w-6">
//               <div className="h-[10%] w-full bg-[#ffffff] shadow-lg absolute top-1/2 -translate-y-1/2"></div>
//             </div>

//             {/* Card 3 */}
//             <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-md p-6 text-center relative z-10">
//               <img
//                 src="/herosectionimg/Shrug-bro 1.png"
//                 alt="Shipping"
//                 className="mx-auto mb-4 w-40 h-40 object-contain"
//               />
//               <h3 className="text-lg font-semibold">
//                 Enter Shipping Information
//               </h3>
//               <p className="text-gray-600 mt-2 text-sm">
//                 Provide your full name, delivery address, and contact number so
//                 we can safely deliver your artwork.
//               </p>
//             </div>
//           </div>

//           {/* Steps Row 2 */}
//           <div className="flex flex-col lg:flex-row items-stretch justify-center gap-10 md:gap-0">
//             {/* Card 4 */}
//             <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-md p-6 text-center relative z-10">
//               <img
//                 src="/herosectionimg/Shrug-bro 1.png"
//                 alt="Review Cart"
//                 className="mx-auto mb-4 w-40 h-40 object-contain"
//               />
//               <h3 className="text-lg font-semibold">Review Your Cart</h3>
//               <p className="text-gray-600 mt-2 text-sm">
//                 Check your selected artworks. Confirm quantities, framing
//                 choices, shipping fees, and estimated delivery time.
//               </p>
//             </div>

//             {/* Connector */}
//             <div className="hidden lg:flex items-center justify-center relative z-0 w-6">
//               <div className="h-[10%] w-full bg-[#ffffff] shadow-lg absolute top-1/2 -translate-y-1/2"></div>
//             </div>

//             {/* Card 5 */}
//             <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-md p-6 text-center relative z-10">
//               <img
//                 src="/herosectionimg/Shrug-bro 1.png"
//                 alt="Payment"
//                 className="mx-auto mb-4 w-40 h-40 object-contain"
//               />
//               <h3 className="text-lg font-semibold">Choose a Payment Method</h3>
//               <p className="text-gray-600 mt-2 text-sm">We support:</p>
//               <div className="flex justify-center gap-3 mt-3">
//                 <img
//                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXnXkBmw2uSAI7UPnfI8ZWleOP_9jguz46rQ&s"
//                   className="h-6"
//                   alt="Mastercard"
//                 />
//                 <img
//                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvGspplJJLok3PvZdIoyIpKQ6q-TtIEy5PzQ&s"
//                   className="h-6"
//                   alt="Visa"
//                 />
//                 <img
//                   src="https://icon2.cleanpng.com/20180330/qzq/avc3fqk7p.webp"
//                   className="h-6"
//                   alt="UPI"
//                 />
//                 <img
//                   src="https://img.favpng.com/2/7/19/paytm-logo-brand-service-product-png-favpng-G3rLWKWtLxF4jUFAz8akrHjzx.jpg"
//                   className="h-6"
//                   alt="Paytm"
//                 />
//                 <img
//                   src="https://w7.pngwing.com/pngs/332/615/png-transparent-phonepe-india-unified-payments-interface-india-purple-violet-text.png"
//                   className="h-6"
//                   alt="Phonepe"
//                 />
//                 <img
//                   src="https://toppng.com/uploads/small/11735759504pvxnd3mon8eobctp8qktesr6ayeytipihdlcxiotspns27ljc8xuhkl76cxstyyuftl5e38e1pq1tycfmezlpbrmtro5v5rglc58.webp"
//                   className="h-6"
//                   alt="Google Pay"
//                 />
//               </div>
//             </div>

//             {/* Connector */}
//             <div className="hidden lg:flex items-center justify-center relative z-0 w-6">
//               <div className="h-[10%] w-full bg-[#ffffff] shadow-lg absolute top-1/2 -translate-y-1/2"></div>
//             </div>

//             {/* Card 6 */}
//             <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-md p-6 text-center relative z-10">
//               <img
//                 src="/herosectionimg/Shrug-bro 1.png"
//                 alt="Place Order"
//                 className="mx-auto mb-4 w-40 h-40 object-contain"
//               />
//               <h3 className="text-lg font-semibold">Confirm & Place Order</h3>
//               <p className="text-gray-600 mt-2 text-sm">
//                 Review all details.
//                 <br />
//                 Click Place Order to complete your purchase.
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };
// export default HowToBuy;



import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const HowToBuy = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        
        if (!homepage?._id) throw new Error("No published homepage found");

        const sectionRes = await getAPI(
          `/api/homepage-sections/how-to-buy/${homepage._id}`
        );
        if (!sectionRes.data.success) throw new Error("How To Buy section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>How To Buy section not available</div>;

  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-4 px-3">
       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
            {data.heading}
          </h1>
          {data.buttonName && (
            <a
              href={data.buttonLink || "#"}
              className="hidden md:inline-flex items-center justify-center bg-red-500 text-white font-semibold rounded-full shadow px-6 py-2 min-w-[0] text-center"
              style={{ minWidth: "auto" }}
            >
              {data.buttonName}
            </a>
          )}
        </div>

        <hr className="my-3 border-dark" />

        <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
          {data.description}
        </p>

        <section className="w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {data.cards?.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-6 text-center"
              >
                {card.image && (
                  <img
                    src={`${imageBaseURL}/${card.image}`}
                    alt={card.title}
                    className="mx-auto mb-4 w-full max-w-[200px] h-auto object-contain"
                  />
                )}
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{card.description}</p>

                {card.icons?.length > 0 && (
                  <div className="flex justify-center gap-3 mt-3">
                    {card.icons.map((icon, i) => (
                      <img
                        key={i}
                        src={`${imageBaseURL}/${icon}`}
                        alt="icon"
                        className="h-6"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToBuy;
