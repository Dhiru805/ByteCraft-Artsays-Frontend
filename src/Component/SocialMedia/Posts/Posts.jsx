import React, { useState } from "react";
import "../Sidebar/Side-post-sugg.css";
const postsData = [
  {
    id: 1,
    username: "Nelson_doley",
    profilePic: "data:image/png;base64,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", // shortened base64
    postImage: "https://i.imgur.com/0y8Ftya.png",
    likes: 45,
    time: "2h",
    description:
      "Struggling with choosing the right colors for your design? Check out our easiest color guide to create any website, app, or UI — perfect for beginners and pros alike!",
  },
  {
    id: 2,
    username: "Nelson_doley",
    profilePic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABgFBMVEWE0Pf///+qOS3qsZgtLS27jXl8IRqje2p9zveE0fh/zvckJCSH1f1jGhR5zPbss5q/kHvvr5KoMyaB1//0+/624volGQ+J0vcjJynB5vuV1vjL6vvw+f4qJiQmHBWmKBem3Pnk9P0pIx/iq5OnLiCw4PpspcLW7vzVoYqkeGSsKQ3I6ftbh55mm7YjIiKVc2SkIg9QcoRFXmt7wONVe4+pgW9LQTxxWlGAZFjLmYNJZXTgqZGqxtnftaO6wcrDvsLXt63PurVhAACKvN2Pq8ecfIqmT016Ix6Yi512EQupQzuLODTz7Ozq1NKjHADCe3XKj4rTop65Ylo3QUc6SFBOTEuwjoEXAAAoMTQ4NDKLdm0RHiIzQkpCREXAmYl3ZFxbS0RgXFtMNyyejYmZnaSWp7ScyeSrn5/OsKaCpsN/dYZ3OUBhMjmeXlNlJiNmQUiTLB50QDqVl62gaXCGPzx+MC2DWlR2FRCmS0eobGGfcHqXkKSMSky8eHS1V0/PmZSQ3N3SAAAQ/klEQVR4nO2d/VsTVxbHJwkhMyFmQgLkBWHICxBQJBBRI2JB3iQCKirFsq12W9ttu7qtwoJdVv/1vXfeMu9z75k7Cd3H7y/tQ+14P5xzzzn3nYv8v4vrdQNC1xfCv76+ELLRULk8PVocHp6cnJyYmJwcHi5eG50uX+3K3x0y4VB5ujhREtLpNM8nO+KTPM+jnwmlieHR8lCoTQiRsHxtAqEhMM5DiDadFiaK4WGGRFgulngE58Vm5kzzpcnpUJoSAuHQ6EQ6TQxnwOTTpWKZeXNYEw5dK/HktnOgzA+X2baILeFoKc2D6UKCZEh4dZIPjKdCpkujzCIPM8LpEqTvuYrnJ8psGsaIsMilGeLJQoZkElyZEA6zck+L0vlrwRvHgLAYIHb6iU8GZgxMWEyGYz+dkQvIGJBwmguXT2ZMBuqPgQivlpjHF0elS+XeEA4zzQ/ejBPg/AgnnBbCd9COkjy0O4IJJ7vJh5UuwUbMQMKy0DUHNTAWu0c43J0IYxUPMSOE8Gq+2x6qKZke7QbhdK/4sPiJ8Al75KGakgKlp1ITTvTSgrJ4uhKHknAo34MYalV6MjzC8iXg43BMDYtwurddsKNknryIoyEc7XkX1JXkyiEQFi+LBWXxpIjkhMOXx4KySEMqMWGP06CDCBFJCScvHSDKGkQlHCEhI0BBSJklCEIQRBIrkhEycFGZrdmcmru+sHB3Eenu3ZvX56aaHOYME5GIsBgwyGC65tTNxaPKyHilMqapUhkfHxl7tjDXBEMS9EUSwmCJHuFxUwvPENtYn6PGKiPPbkIh/ZMGAWE5iAUFhLdYGXeB01UZeT6H/ihASb+hhj/h1QCAQqp5s88XT7Hk+NFcCsKYD0wID3ap1NTiSIUET9H4symAqyZ9ynBfwhJ0OCGkpp6PEJmvo5EFjt6MPsN+P0LopCHyT2o+pEpfE4DoOZXqQwgdTqS4BQCfbMY5esR0GUwIDKNCaq5C0f8siDfpEZNgQlCUQQ66OALlgyF6RRtPwglAlEFZ7SZZfmCJ6DEd7kU4CqhlEB/cQXXE6/SIZQDhEH0nRB1wLDBfHyjcuCZ+D0L6TIgyxDgDPoxInTR4tylGd8JrtD6KDBiwAxp0xNFGObca3JXwKj3gQpAIalFlMUf597v5qSthiRaQY+Whiui7Ij9MRUjrowiQRYgxqNKk9dO040DKhZA2jgop1oB9Y3ep46lj3nchpM31qQXWgMhPp2gRHadtnAlp69HUHMMgo2nsGZOk6EyYp/uw0AwBEI2I6YONQ/HmSHiN1oSLzPKgWdSzqbx9TcqRkLYThuGjWPRGTNorGydC2jWY1FE4gKiyoe6JdiM6ENJmClSshUVIH07tRnQgHKZ10tBM2Df2PLgR7YRDlNVMakrrhQX2iBXqAtxmRDvhJK0J76qB9PiQPWKFfqBoNaKNkLpeS6rVTOGF2GKPCHDTog8hdS+cUuPM8aEoxlkDFr5O0s+G+RDSTl3oFemRGIuJ8ZdMzXg0QB9NrStuVkLqKeDUM/W3/Q0ijMXitxgiHt0YGF+gnz0teRLSD3zVSHpcx4RiLPOaGSICHLjxt6BT4BZC6klurehGcQabECPOM0EsHPUhwIEbN6jzhSVhWAip54C1gqZwqBBixCUGnlq4/QIDDgx8TT3Ut0zymwnpp0hT15VAc7yiEmLE+O2AiIW++cw3x2BCU6wxE9JvSUjdVAi/1QCxWgHNeHw7nokfKoSAYMolJ1wJKUe+HUI1kmpmrMczd8BFXOFWIhOPxzPfym46DiDk0kMuhIDFNNVLj78zEsbE5Th2VQhj4eU85kOErzAhGl4AFsD4URdC2pIUE87JhEfVmEm4MyJGajtiPgUwnpk/HujD8/uQJb6SCyHgU0rRpuUKs6ciRipfLRzf0vmwjvEPx+izBWcqv42EkJ1BSj40d0MVsYoam8nMvyZz1kLh5e0lI198+QX+Of2Em0w47UgIWRDlBEx4fGgnjInYjIgxfgdBelNivIQJL96Kia/Q/zS2CNtHNOlICFq0l+tSpWSzM8ZacQVy/vbLgjMm/unrO8h6Zr6qGBPxeLMCWNXH4p0IYdvX5AHwsSNghzGOAebvvL6FgYzqu3X7TiJupkN8yyIeqHx3DJluUwmvOhACIimnposjN0LMWFfbncGKJxLz83ew5ucTS/LP4hYh+4lKrDqGhlLjONhACPsUDqYOodTcH40UGV1WNPm/1mOi9rHqESIEhVLj7owOIXTvTBMRvvIixIzVuiOPzXzLouFL4ktoKMWyE9JO5euIzsnCBhmrt7zp6sg7zZXRt5AlNlV6R+wQQrfopZ6PERDKkMiULSdbZlr15ZhoLxpe9FXo951ohKM2QuhGYFR7FxIkhCqlGKsu1+stRfX6clX+odMHxO9hdbcsPSPqhGUw4VylsERK2OHU5fHHECEwlHKdtUSdsAjeR9ocKTiVNMElvhroAwcaLm0lBJVsMiE37li0sSC8AavZFMKyhZB+8Ksp9Tw0wnFwoOmEGo0Qvl+dT13/PizCv0M2fqtKDpsJwQe0+Xsrg17hIgjhUmLmB8CuaJVwwkwIDTT8V4Oh0KmEiZmZdagV82ZCYKDh74UHGBMTWDPAylSbNdUIgYGGD48PSSH8Eein6kyGRggsu0M1YTURyIhqulAJqfdaKuJXwwNE40OVcAM4RJw2EgJDqRAiYExsJQK5qXrQRCUEnhzJh+ikMTGjECZ+gBEmi0ZCYLL4KVTCuEp4SL1dWCGcNBLC5mhCJlQBE0tAG04YCWmXflWF6aVaKAV7qTq1H4wwzEijhVJ4QjQRQhP+WoiEWqCBZgu1bFMJYZ8INePjqjRY2WYiBI8sQgOMVYM6KSPC+2EZsdMN8+AhooEQcIhLQ1wJi1DNhjNv4MN8AyF8hC+ElTDUbDgDTRXMCDk+nKyvOunMDwGuBsmzIUSIMczImFPMzOAB/s9B7j7JM+mHHJ5OvL8aW7nPOObk3xwu/bgewEXNGT8QIb58G4lth1zjU7kcfKLNRghetDBishwND/4UDA4raSJkcMsV0/pmhUGDzKOn4N9DYgc4eI8F4TCDytskllOnwX3UOsYHjp7MYhZrBu+zuBtOXbhQCcErT6ZPrrFCZNAY61wbcBbDohIbQjYmtMyXgtdHTWJlRBZtsc55M7rWkklPZGRCbb+J+g/wKr5ZTMIpi1yIVTIRAmf17WJgQgblDJZ1/ZDR743Batsqq+d4imZCFikfK3h1yqwl02ZCNumCCxxsmIUZ/Q4JjRC6q82mgHNTrHy0s4dWI2QUTLmgfsrKRzvb9TXCgGNgowL46eBPzJph39fGpPaWBZ+bYtcJDbv1dUJmoQbeFQfXGF43bd9fyvJNB2B9yqqYkaVfc6IT0h7D9xS/CkFkF2WMx9c6O2hZfp/jAJP98PUJB3XOdnUIaY+p+4gakSmg4XyeYa8+0zvJBW6FzlFLTAENtw0Zzlsw/RsQIwXi4ApbC+pbL82ETOZqDBLIw80KdJnXTYYD68ZzT6wfP8itke07FeusAY03RwQ+u+ah1M8tgr21otiKMxr06jIedQ58/tBDqXg8XvVDFKvxeAa8VO8i460KQc+QekjI4/MxrZjnqS/l9N4hY0LjlQNBzwF7SHijnACqu7qqfnIvAz844iTTtREmQrZJn/+Hdq6p7mRHsXMyMZ55w5TQdJWp+Tw+09o0P6gTyKcmTXcSiOKy8SjbYS7QUx4WmS4XNN+pwGiQKPA8V7q3FhONB9Va9ap24ClWtZ7Uy/x4D7/lwQbTfEe7mTD41LeQyuXy975ajQ3K6d56DM/17Cg+C3z4Zp3LBXixRCcccicMGGsQXvOXX38bHNSKGZwKKJTJfPznr7/AXyxRZLnPzEIIX6ERhFxu/deTHaS3nR4n1v25jIjvHiD965dmkE0Klqu9LYTQcXAqJ2xsRmdrZ/1IO3UgYubfD64gvft9f+s/67kcENJyE631nijIdI2A8P5EeNFoFAP2nz0yHlf2Pv1r1hVZJ9FoVpo9f7gOsqT1IlorIeCS69z6poIX1RB3PoIQM3/IgO/a8pcQ5NZ7jt6Q1ntobfe10RWnQo57f67jaYQmPyV2VNVHrzzSP5aVpA8blIbkrQ952Qhpsr6Qa25mpWzUqG0ZcbtKjZhJKICnps/VZs/fCzSGFKxA9pshiY2I3POD0XyKfle64ompglkmADyU+ba325YPZqXawyYxo82EDoSEPTGV27iw8+lG3LkwIVZ9r1Q4fCcDnj1y+KQkbZIy2m+DdrihlSScIr6t2axDY9wQfeJNRgFEtnf+Zm2fjNHhRm/QLbuCB58RkdhTM0sYcBsBWn20wyhtEgRWhwu9ATclC6j/7bvzRaNtFfHUdC+PdlWNE+C8bEAvQJnxod/DZU4PzTnedu35lRy36dj/7Ihn/XGRgDETx2mi3w8QSYq+9zSj44M6joQe0xlC7n3Wh6+D2L/z1jxPI1btjJnEuwdX+kkAkWa31j0YHR9HcL513vWek9z61qxvMzDiqYJ4dvbRciNLzDTyRT3wjwfKH+0nAES5Y3bT9eEy5wcunAlddrYLuYceAcasR2q7d7Y/2ob3aADckkeKrczb/jPlz21fEH5Yam+4mdGRxeX1B8dgk1s/lwibgRG3O4x16906ilpvd1S+s9Nz0l8dctU/Hc3o8p6l2xsl9rU2IfcfYgPK0jwVtX/n5GNLtKj18VTn274g8VBdtfa6/Vip6cJLAkLbrVGpJlkPNOpcZ+xHA+OTt/gyIaRWfOYtGiqf9et8W1S/OtQb9x/aPdWFxO3nVj/NbRCEULt0V5Wjzo6us86P+y+2opSASI23Fk91fXPVldDkp8hD9wF8WO1TA6RNZ6cnW1l6PqRa1uSpbj7qRWiowAXhA7WHdnT+6MQF8vSCrv+ZNfvegGgbNBEQdh5ESjXPIR5qUPv80emp0TPPtn+7uNhqw8ynI27qndHj0VwPQm2kmFsP1hBN58iYj2SdnG9tBTCersYHdQrZ43FAT0KlK+Y2GkwAw1BtS15b9XxO1pMQlza5DWiM6YZqbXwHkeeTwJ6EkdF07n2AGNMFZaPrKefXyMgII8PgLNEtZaV179fHfQgjnwJG0fDVeOJN4EcYaV/aMKNI+q8PgC/h7uVGrB34AfgSRnYBVWPXlG37tt+fMLLLJuGHoWx0lwVhZLd2SRFJAIkIL6ujEgGSEaJwcwmTRjZLAkhIeBnzIiEgMWHkgGISqhuqtckAyQkjTxq9hjKq9om03eSEkdVLVKJKvokeQhjZuzRZw68WhRJempDaeErRaCpC1BkvgadmpT2aJlMSRlalXntq7RNhEAUSIk/tbdrYf0zZYGrC3npqVlqlbS6AMLIX7VXAkSg9FErYKzNm9z8D2gojRGbsfm+U2lQxNCBhJPLZczsGe2WpkiALwsjuQTcL1cYBfQ8MSohyY61bEUeKUodQJoTIVaVuMNYkoIMyIIzsPtkPm7G2/xjqoCwIEePjRpiMtUYwPgaEmDE0Owa1HyNC7KtSGAV5cPthMSFEetpmvI6albJPGfCxI0RlDnJWZpC1/YM1Ru1iR4icFRmSRY+sNaKfmZhPFktCpL3P2YCQtYb0BFR/uokxIdLek2gD6K5ZqRFlixcJgzCCLflpX6KkzNYa+wdsYotZoRBiIUqpQVbUZWtSo3bwlLXxVIVGiLW3+rjdaEjInI72zGZriK0hHXxeDcF2mkIllLW79/TJ44O2tN/AsKrQvzey7YPHT1f3QoSTFT6hrt09pLXV1VX8z9DBdHWRsEf6QvjX1xfCv77+B6nknjgcN3yFAAAAAElFTkSuQmCC", // same or different
    postImage: "https://i.imgur.com/0y8Ftya.png",
    likes: 45,
    time: "2h",
    description:
      "Struggling with choosing the right colors for your design? Check out our easiest color guide to create any website, app, or UI — perfect for beginners and pros alike!",
  },
];

const Post = () => {
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleMoreClick = (id) => {
    setMenuOpenId(id);
  };

  const handleCancel = () => {
    setMenuOpenId(null);
  };

  return (
    <div className="lg:w-[56%] w-full flex flex-col mx-auto">
      {postsData.map((post) => (
        <div key={post.id} className="w-full flex flex-col mb-4 relative">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 p-2 items-center">
              <img
                src={post.profilePic}
                alt="profile"
                className="h-10"
              />
              <h3 className="font-extrabold">{post.username}</h3>
              <p className="text-xs font-light">. {post.time}</p>
            </div>
            <div className="flex item-center gap-3 mr-1">
              <button className="buy-button">
  Buy <i className="cart-icon ri-shopping-cart-fill"></i>
</button>

              <button onClick={() => handleMoreClick(post.id)}>
                <i className="ri-more-fill text-lg"></i>
              </button>
            </div>
          </div>

        {menuOpenId === post.id && (
  <ul className="absolute flex flex-col rounded-xl items-center justify-between right-1 top-12 mt-2 w-40 bg-gray-200 border  shadow-lg z-10">
    {[
      'Pay Tip',
      'Report',
      'Unfollow',
      'Save',
      'Copy Link',
      'Embed',
      'About This Account',
    ].map((label) => (
      <React.Fragment key={label}>
        <li className="w-full px-3 py-2 flex flex-col items-center justify-between  text-left cursor-pointer hover:bg-gray-400 ">
          {label}
        </li>
        <hr className="w-[75%] border-t border-gray-800" />
      </React.Fragment>
    ))}
    <li
      className="w-full px-3 py-2 flex flex-col items-center justify-between  text-left cursor-pointer hover:bg-gray-400 text-red-500 "
      onClick={handleCancel}
    >
      Cancel
    </li>
  </ul>
)}


          <div className="mx-1 ">
            <img
              src={post.postImage}
              alt="Post content"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-1.5 mx-1">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-4 justify-between items-center">
                <button>
                  <i className="ri-heart-line text-lg font-medium"></i>
                </button>
                <button>
                  <i className="ri-chat-3-line text-lg font-medium"></i>
                </button>
                <button>
                  <i className="ri-send-plane-fill text-lg font-medium"></i>
                </button>
              </div>
              <div className="flex items-center">
                <button>
                  <i className="ri-bookmark-line text-lg font-medium"></i>
                </button>
              </div>
            </div>
            <div className="text-[13px] font-bold">{post.likes} likes</div>
            <div>
              <p className="text-[12px] mt-0.5 font-semibold ">
                {post.username} . {post.description}
              </p>
            </div>
            <div className="text-[13px] font-light">View all {post.likes} comments</div>
            <div>
              <input
                type="text"
                placeholder="Add a comment..."
                className=" w-full  rounded  text-[13px] focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
          <hr className="h-0.5 bg-gray-300 border-none mt-2" />
        </div>
      ))}
    </div>
  );
};

export default Post;