// import { RiPoliceBadgeFill } from "react-icons/ri";

// const DiscoverArtist = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto py-4 px-3">
//       <div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//           {/* title */}
//           <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//             Discover Artist
//           </h1>
//           {/* Search Bar */}
//           <div className="hidden lg:block justify-self-end relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
//               />
//             </svg>
//           </div>
//         </div>

//         <hr className="my-3 border-dark" />

//         {/* Subtitle */}
//         <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//           At ArtSays, we make it simple for you to collaborate directly with
//           talented artists and bring your creative vision to life.
//         </p>
//       </div>
//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-4">
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full mx-auto product-card artist-card border-5">
//           {/* Premium Label */}
//           <div className="relative p-img artist-img">
//             {/* Product Image */}
//             <img
//               src="/herosectionimg/1.jpg"
//               alt="Beauty of Joseon Mandala Art"
//               className="w-full h-40 sm:h-64 object-contain product-img a-product-img"
//             />
//           </div>
//           {/* Product Category */}
//           <div className="p-1 text-center product-info product-cat">
//             <p className="text-brown-500 text-[10px] md:text-xs font-bold">
//               Featured Art Work
//             </p>
//           </div>

//           <div class="py-4 px-2">
//             <div class="flex items-stretch justify-between">
//               {/* <!-- Left Big Container (80%) --> */}
//               <div class="w-full md:w-4/5 flex flex-col justify-between">
//                 {/* <!-- Top: Name --> */}
//                 <div>
//                   <h2 class="text-white text-sm md:text-lg font-bold flex items-center">
//                     Ananya Kapoor
//                     <span class="ml-2 text-orange-500 text-md">
//                       <RiPoliceBadgeFill />
//                     </span>
//                   </h2>
//                 </div>
//                 {/* <!-- Bottom: Tag --> */}
//                 <div class="mt-2">
//                   <span class="bg-[#29221C] text-white text-[10px] px-2 md:px-3 py-1 rounded-full">
//                     Contemporary Portraits
//                   </span>
//                 </div>
//               </div>

//               {/* <!-- Divider --> */}
//               <div class="w-px bg-gray-600 mx-3 hidden md:block"></div>

//               {/* <!-- Right Big Container (20%) --> */}
//               <div class="w-1/5 flex flex-col justify-between items-end place-items-center hidden md:block">
//                 {/* <!-- Top: Follow --> */}
//                 <div>
//                   <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-medium text-xs">
//                     Follow
//                   </button>
//                 </div>
//                 {/* <!-- Bottom: Visit Store --> */}
//                 <div class="mt-2">
//                   <a
//                     href="#"
//                     class="text-white underline text-xs hover:text-gray-300"
//                   >
//                     Visit Store
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DiscoverArtist;






import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const DiscoverArtist = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        if (!homepage?._id) throw new Error("No published homepage found");

        const sectionRes = await getAPI(
          `/api/homepage-sections/discover-artist/${homepage._id}`
        );
        if (!sectionRes.data.success || !sectionRes.data.data)
          throw new Error("Discover Artist section not found");

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
  if (!data) return <div>No Discover Artist section available</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-4 px-3">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
  
          <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
            {data.heading}
          </h1>

          <div className="hidden lg:block justify-self-end relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>

        <hr className="my-3 border-dark" />

        <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default DiscoverArtist;
