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
      <main className="grid grid-cols-12 gap-2 p-2">
        <Sidebar />
        <Profile shareprofileid={artistId} />
        <Suggestion />
      </main>
    </div>
  );
};

export default ProductView;

