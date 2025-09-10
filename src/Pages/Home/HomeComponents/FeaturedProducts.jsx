import clsx from "clsx";
import React, { useState } from "react";
import { Heart } from "lucide-react";

const featuredProductCategory = [
  "Photoshop",
  "Best of Behance",
  "Graphic Design",
  "Photography",
  "Illustration",
  "Best",
  "Photo",
  "3D Art",
];
export const bidItem = {
  owner: "Celebrated Classics",
  name: "Golden Era Paintings",
  rating: 4.8,
  price: 68,
  reviewCount: 220,
  url: "/assets/product/product3.jpg",
};

export const Product = ({ product }) => {
  return (
    <div className="w-[300px]    mx-auto ">
      <div className="bg-blue-200 p-8  relative mx-auto w-full  h-[209px] flex justify-center items-center ">
        <button className="absolute right-2 top-2 z-50 flex justify-center items-center bg-white rounded-full w-[40px] h-[40px]">
          <Heart className="" color="black" size={20} strokeWidth={2} />
        </button>

        <img
          className="max-w-full max-h-full object-contain "
          src={product.url || "/assets/home/biditemurl.jpg"}
          alt=""
        />
      </div>
      <h5 className="text-[12px]  mt-2 ">Highly Rated</h5>
      <h4 className="text-[15px] font-medium mt-2">Owned by {product.owner}</h4>
      <h3 className="text-[18px] font-semibold my-1 text-black-900">
        {product.name}
      </h3>
      <div className="flex items-center justify-between gap-1 my-[5px]  py-1">
        <div className="flex items-center gap-1">
          <img src="/assets/home/star.svg" alt="star" className="w-4 h-4" />
          <span className="text-sm">
            {product.rating} ({product.reviewCount} Reviews)
          </span>
        </div>
        <span className="font-medium text-[18px] text-black-900">
          ${product.price}
        </span>
      </div>
      <div className="flex flex-row items-center gap-[20px] justify-between">
        <button className="text-center border-2 border-orange-200 rounded-[30px] text-sm  p-[10px] text-back-900 bg-base w-full">
          ADD TO CART
        </button>
        <button className="text-center text-sm  rounded-[30px]  p-[10px] text-base bg-black-900 w-full">
          BUY NOW
        </button>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const [selected, SetSelected] = useState("Photoshop");
  return (
    <div className="p-[80px] max-w-[1440px] mx-auto  bg-base">
      <p className="text-center text-black-900 text-[20px] ">
        FEATURED PRODUCT
      </p>
      <h2 className="text-center text-[40px] my-[30px] font-bold text-orange-200 ">
        HANDPICKED ART & UNIQUE ARTIFACTS JUST FOR YOU
      </h2>
      <p className="text-center">
        <i className="text-center text-wrap mx-auto text-black-900 text-[20px]">
          {" "}
          Explore paintings, sculptures, vintage pieces, and exclusive
          collections from around the world.{" "}
        </i>
      </p>

      <div className="flex flex-row gap-x-[60px] gap-y-2 mx-auto flex-wrap  justify-center my-[30px]">
        {featuredProductCategory.map((cat) => {
          return (
            <button
              onClick={() => {
                SetSelected(cat);
              }}
              className={clsx(
                "font-semibold transition-colors duration-300 outline-none focus:outline-none  text-[20px]",
                selected === cat ? "text-red-500 underline" : "text-orange-200"
              )}
              key={cat}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap flex-row justify-start  gap-[26px]">
        <Product product={bidItem} />
        <Product product={bidItem} />
        <Product product={bidItem} />
        <Product product={bidItem} />
        <Product product={bidItem} />
        <Product product={bidItem} />
        <Product product={bidItem} />
        <Product product={bidItem} />
      </div>

      <button className="mx-auto block text-orange-200 font-semibold text-center w-[250px] h-[60px] mt-[60px] border-[1.6px] rounded-[10px]  border-orange-200 text-[20px] ">
        View Collection
      </button>
    </div>
  );
};

export default FeaturedProducts;
