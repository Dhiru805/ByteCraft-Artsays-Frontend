import "../../store/products/product.css";
import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const HowToGet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/insurance/published", {}, false, false);
        const insuranceData = Array.isArray(res.data.data)
          ? res.data.data.find((p) => p.status === "published") ||
            res.data.data[0]
          : res.data.data;
        setData(insuranceData);
      } catch (error) {
        console.error("Error fetching How To Get data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>{HowToGetSkeleton()}</div>;

  const cards = data?.section2Cards || [];

  return (
    <div className="max-w-[1440px] mx-auto py-4">
      {/* Title */}
      <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
        {data?.section2Heading || "How to Get Insured?"}
      </h1>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
        {data?.section2Description ||
          "Simple steps to protect your artwork with Artsays insurance."}
      </p>

      {/* Cards — alternating wide/narrow like WhyInsurance */}
      {cards
        .reduce((rows, card, index) => {
          if (index % 2 === 0) rows.push([card]);
          else rows[rows.length - 1].push(card);
          return rows;
        }, [])
        .map((pair, rowIndex) => (
          <div
            key={rowIndex}
            className="md:flex justify-center gap-6 px-3 sm:px-6 my-3"
          >
            {pair.map((card, cardIndex) => {
              const isWide =
                rowIndex % 2 === 0 ? cardIndex === 0 : cardIndex === 1;
              return isWide ? (
                <div
                  key={cardIndex}
                  className="w-full md:w-4/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
                    <main className="md:col-span-2 content-end">
                      <div>
                        <h1 className="text-sm md:text-xl font-bold text-orange-500">
                          {card.title}
                        </h1>
                        <hr className="my-3 border-dark" />
                        <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </main>
                    <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center items-center bg-transparent">
                      {card.image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${card.image}`}
                          alt={card.title}
                          className="max-h-48 object-contain"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-orange-50 rounded-2xl flex items-center justify-center">
                          <span className="text-4xl font-black text-orange-200">
                            {rowIndex * 2 + cardIndex + 1}
                          </span>
                        </div>
                      )}
                    </aside>
                  </div>
                </div>
              ) : (
                <div
                  key={cardIndex}
                  className="w-full md:w-2/6 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0"
                >
                  <aside className="rounded-xl flex justify-center items-center bg-transparent mb-3">
                    {card.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${card.image}`}
                        alt={card.title}
                        className="max-h-36 object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-orange-50 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl font-black text-orange-200">
                          {rowIndex * 2 + cardIndex + 1}
                        </span>
                      </div>
                    )}
                  </aside>
                  <main className="content-end">
                    <div>
                      <h1 className="text-sm md:text-xl font-bold text-orange-500">
                        {card.title}
                      </h1>
                      <hr className="my-3 border-dark" />
                      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </main>
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
};

export default HowToGet;

const HowToGetSkeleton = () => {
  return (
    <div className="max-w-[1440px] mx-auto py-4 animate-pulse px-3">
      <div className="h-8 w-64 bg-gray-300 rounded mb-3"></div>
      <hr className="my-3 border-dark" />
      <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-[90%] bg-gray-300 rounded mb-6"></div>

      {[1, 2].map((row, rowIndex) => (
        <div key={rowIndex} className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
          <div
            className={`w-full ${rowIndex % 2 === 0 ? "md:w-4/6" : "md:w-2/6"} border border-gray-300 rounded-2xl p-4 mb-6 md:mb-0`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 h-full gap-6">
              <main className="md:col-span-2">
                <div className="h-5 w-40 bg-gray-300 rounded mb-3"></div>
                <hr className="my-3 border-dark" />
                <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-[90%] bg-gray-300 rounded mb-2"></div>
              </main>
              <aside className="md:col-span-2 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-xl"></div>
              </aside>
            </div>
          </div>
          <div
            className={`w-full ${rowIndex % 2 === 0 ? "md:w-2/6" : "md:w-4/6"} border border-gray-300 rounded-2xl p-4 mb-6 md:mb-0`}
          >
            <aside className="flex justify-center mb-3">
              <div className="w-28 h-28 bg-gray-300 rounded-xl"></div>
            </aside>
            <main>
              <div className="h-5 w-40 bg-gray-300 rounded mb-3"></div>
              <hr className="my-3 border-dark" />
              <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-[90%] bg-gray-300 rounded mb-2"></div>
            </main>
          </div>
        </div>
      ))}
    </div>
  );
};
