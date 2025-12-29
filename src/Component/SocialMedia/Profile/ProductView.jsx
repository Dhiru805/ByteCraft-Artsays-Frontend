import React from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Suggestion from "../Suggestion/Suggestion";
import Profile from "./Profile";

// Dedicated product-view profile page; shows the selected artist's profile/store.
const ProductView = () => {
  const [searchParams] = useSearchParams();
  const artistId = searchParams.get("artistId") || "";

  return (
    <div className="flex flex-col bg-[#fff]">
      <main className="flex flex-row gap-4 w-[96%] mx-auto">
        <Sidebar />
        <Profile shareprofileid={artistId} />
        <Suggestion />
      </main>
    </div>
  );
};

export default ProductView;

