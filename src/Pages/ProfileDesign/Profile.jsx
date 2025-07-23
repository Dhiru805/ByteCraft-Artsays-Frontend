// import React from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "./Side";
// import Suggestion from "./SuggestedProfiles";
// import { IconDots } from '@tabler/icons-react';
// import icon1 from './icon1.svg';
// import icon2 from './icon2.svg';
// import icon3 from './icon3.svg';
// import icon4 from './icon4.svg';
// import icons5 from './icons5.svg';
// import icon6 from './icon6.svg';
// import icon7 from './icon7.svg';
// import icon8 from './icon8.svg';
// import icon9 from './icon9.svg';
// import icon10 from './icon10.svg';
// import icon11 from './icon11.svg';
// import Profile_photo from './Profile_photo.svg';
// import { useState } from "react";

// const Profile = () => {
//     const { username } = useParams();
//     const [isHovered, setIsHovered] = useState(false);



//     return (
//         // <div className="flex min-h-screen font-sans">
//         //     <Sidebar />
//         //  </div>

//         <div
//             style={{
//                 width: "1440px",
//                 height: "1024px",
//                 opacity: 1,
//                 transform: "rotate(0deg)",
//                 margin: "0 auto", // to center if needed
//                 position: "relative", // useful for children using absolute
//             }}
//         >
//             <div
//                 style={{
//                     width: "86px",
//                     height: "31px",
//                     position: "absolute",
//                     top: "131.68px",
//                     left: "966.29px",
//                     opacity: 1,
//                     transform: "rotate(0deg)",
//                 }}
//             >
//                 <div
//                     style={{
//                         width: "84.99px",
//                         height: "29.61px",
//                         position: "absolute",
//                         top: "0.52px",
//                         left: "0.8px",
//                         backgroundColor: "#6F4D34",
//                         borderRadius: "5px",
//                         opacity: 1,
//                         transform: "rotate(0deg)",
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: "75px",
//                             height: "18px",
//                             position: "absolute",
//                             top: "6.32px",
//                             left: "5.8px",
//                             fontFamily: "Public Sans, sans-serif",
//                             fontWeight: 700,
//                             fontStyle: "bold",
//                             fontSize: "12px",
//                             lineHeight: "18px",
//                             letterSpacing: "0%",
//                             color: "#FFFFFF",
//                         }}
//                     >
//                         Boost Profile
//                     </div>




//                 </div>


//             </div>

//             <div className="myprofiledrop"
//                 style={{
//                     width: "155px",
//                     height: "138px",
//                     position: "absolute",
//                     top: "134px",
//                     left: "934px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     zIndex: 1,
//                 }}
//             >
//                 <div
//                     className="myprofiledropdown"
//                     style={{
//                         width: "155px",
//                         height: "107px",
//                         position: "absolute",
//                         top: "31px",
//                         transform: "rotate(0deg)",
//                         opacity: 1,
//                         zIndex: 1,
//                     }}
//                 >
//                     <div
//                         className="dropdowninner"
//                         style={{
//                             width: "154.7421875px",
//                             height: "107px",
//                             position: "absolute",
//                             left: "0.13px",
//                             transform: "rotate(0deg)",
//                             opacity: 1,
//                             // border: "0.5px solid #292929",
//                             borderRadius: "10px",
//                             zIndex: 1,
//                         }}
//                     >
//                         <div
//                             className="dropdowntext1"
//                             style={{
//                                 width: "135px",
//                                 height: "20px",
//                                 position: "absolute",
//                                 top: "11.24px",
//                                 left: "10px",
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 fontFamily: "'Public Sans', sans-serif",
//                                 fontWeight: 400,
//                                 fontStyle: "normal",
//                                 fontSize: "14px",
//                                 lineHeight: "20px",
//                                 letterSpacing: "1%",
//                                 color: "#000000",
//                                 background: "transparent",
//                                 text: "bold",
//                                 zIndex: 2,
//                             }}
//                         >
//                             Settings and privacy
//                         </div>
//                         <div
//                             className="dropdowntext2"
//                             style={{
//                                 width: "93px",
//                                 height: "20px",
//                                 position: "absolute",
//                                 top: "45.24px",
//                                 left: "31px",
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 fontFamily: "'Public Sans', sans-serif",
//                                 fontWeight: 400,
//                                 fontStyle: "normal",
//                                 fontSize: "14px",
//                                 lineHeight: "20px",
//                                 letterSpacing: "1%",
//                                 color: "#000000",
//                                 background: "transparent",
//                                 text: "bold",
//                                 zIndex: 2,
//                             }}
//                         >
//                             Login activity
//                         </div>

//                         <div
//                             className="dropdowntext3"
//                             style={{
//                                 width: "56px",
//                                 height: "20px",
//                                 position: "absolute",
//                                 top: "78.32px",
//                                 left: "49.5px",
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 fontFamily: "'Public Sans', sans-serif",
//                                 fontWeight: 400,
//                                 fontStyle: "normal",
//                                 fontSize: "14px",
//                                 lineHeight: "20px",
//                                 letterSpacing: "1%",
//                                 color: "#000000",
//                                 background: "transparent",
//                                 text: "bold",
//                                 zIndex: 2,
//                             }}
//                         >
//                             Log Out
//                         </div>
//                         <div
//                             className="line1"
//                             style={{
//                                 width: "125px",
//                                 height: "0px",
//                                 position: "absolute",
//                                 top: "73.48px",
//                                 left: "15px",
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 borderWidth: "0.5px",
//                                 borderStyle: "solid",
//                                 borderColor: "#292929",
//                                 zIndex: 2,
//                             }}
//                         ></div>

//                         <div
//                             className="line2"
//                             style={{
//                                 width: "125px",
//                                 height: "0px",
//                                 position: "absolute",
//                                 top: "37.48px",
//                                 left: "15px",
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 border: "0.5px solid #292929",
//                                 borderWidth: "0.5px",
//                                 zIndex: 2,
//                             }}
//                         ></div>

//                         <div
//                             className="rectangle1"
//                             style={{
//                                 width: "154.7421875px",
//                                 height: "34.109375px",
//                                 position: "absolute",
//                                 top: "72.48px",
//                                 left: "0.13px",
//                                 zIndex: 1,
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 borderTopLeftRadius: "10px",
//                                 borderTopRightRadius: "10px",
//                                 background: "#D9D9D9",
//                                 background: isHovered ? "#a7a1a1ff" : "#D9D9D9",
//                                 transition: "background-color 0.3s ease",
//                             }}
//                             onMouseEnter={() => setIsHovered(true)}
//                             onMouseLeave={() => setIsHovered(false)}
//                         >
//                         </div>
//                         <div
//                             className="rectangle2"
//                             style={{
//                                 width: "154.7421875px",
//                                 height: "36px",
//                                 position: "absolute",
//                                 top: "36.78px",
//                                 left: "0.13px",
//                                 transform: "rotate(0deg)",
//                                 zIndex: 1,
//                                 opacity: 1,
//                                 background: "#D9D9D9",
//                             }}
//                         ></div>
//                         <div
//                             className="rectangle3"
//                             style={{
//                                 width: "154.7421875px",
//                                 height: "37.48046875px",
//                                 position: "absolute",
//                                 top: "-0.7px",
//                                 left: "0.13px",
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 zIndex: 1,
//                                 background: "#D9D9D9",
//                                 borderTopLeftRadius: "10px",
//                                 borderTopRightRadius: "10px",
//                             }}
//                         ></div>

//                         <div
//                             className="rectangle4"
//                             style={{
//                                 width: "154.7421875px",
//                                 height: "107px",
//                                 position: "absolute",
//                                 left: "0.13px",
//                                 top: "0px", // if not specified, defaulting to 0
//                                 transform: "rotate(0deg)",
//                                 opacity: 1,
//                                 background: "#f7f7f7ff",
//                                 borderRadius: "10px",
//                                 zIndex: 1,
//                             }}
//                         ></div>





//                     </div>


//                 </div>


//                 <div
//                     className="tabular-dots-div"
//                     style={{
//                         position: "absolute",
//                         width: "24px",
//                         height: "24px",
//                         left: "121.71px",
//                         top: "0px", // Add if needed
//                         transform: "rotate(0deg)",
//                         opacity: 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         color: "black",
//                     }}
//                 >
//                     <IconDots size={24} />

//                     {/* <div className="tabular-dots"
//                         style={{
//                             position: "absolute",
//                             width: "12px",
//                             height: "2px",
//                             top: "11px",
//                             left: "4px",
//                             transform: "rotate(0deg)",
//                             opacity: 1,
//                             border: "2px solid #000000",
//                             boxSizing: "border-box",
//                         }}
//                     >
                        
//                     </div> */}


//                 </div>


//             </div>

//             <div className="edit-profile"
//                 style={{
//                     position: "absolute",
//                     width: "84px",
//                     height: "30px",
//                     top: "132.68px",
//                     left: "873px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >

//                 <div
//                     className="edit-profile1"
//                     style={{
//                         width: "83.85px",
//                         height: "29.61px",
//                         transform: "rotate(0deg)",
//                         opacity: 1,
//                         borderRadius: "5px",
//                         background: "#6F4D34",
//                     }}
//                 ></div>

//                 <div
//                     className="edit-profile-text"
//                     style={{
//                         position: "absolute",
//                         width: "63px",
//                         height: "18px",
//                         top: "4.72px",
//                         left: "9.3px",
//                         transform: "rotate(0deg)",
//                         opacity: 1,
//                         fontFamily: "Segoe UI",
//                         fontWeight: 700,
//                         fontStyle: "bold",
//                         fontSize: "12px",
//                         lineHeight: "18px",
//                         letterSpacing: "0%",
//                         color: "#FFFFFF",

//                     }}
//                 >
//                     Edit Profile
//                 </div>



//             </div>

//             <div
//                 className="deputy_profile"
//                 style={{
//                     position: "absolute",
//                     width: "1043px",
//                     height: "512.3px",
//                     top: "125px",
//                     left: "360px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >

//             </div>

//             <div
//                 className="deputy_profile1"
//                 style={{
//                     position: "absolute",
//                     width: "496px",
//                     height: "177.09375px",
//                     top: "126.23px",
//                     left: "584.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Add your content here */}
//             </div>

//             <div
//                 className="deputy_profile2"
//                 style={{
//                     position: "absolute",
//                     width: "496px",
//                     height: "177.09375px",
//                     top: "126.23px",
//                     left: "584.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Content goes here */}
//             </div>

//             <div
//                 className="deputy_profile3"
//                 style={{
//                     position: "absolute",
//                     width: "496px",
//                     height: "94.1640625px",
//                     top: "239.16px",
//                     left: "580.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Content goes here */}
//                 <div
//                     className="Artist"
//                     style={{
//                         fontFamily: "Public Sans",
//                         fontWeight: 400,
//                         fontStyle: "normal",
//                         fontSize: "14px",
//                         lineHeight: "20px",
//                         textIndent: "1px",
//                         letterSpacing: "1%",
//                         // background: "#6E4E37",
//                     }}
//                 >
//                     Artist
//                 </div>

//             </div>

//             <div
//                 className="deputy_profile4"
//                 style={{
//                     width: "496px",
//                     height: "44px",
//                     position: "absolute",
//                     top: "259.33px",
//                     left: "584.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Add your content here */}
//             </div>

//             <div
//                 className="artsays"
//                 style={{
//                     width: "136.33px",
//                     height: "20px",
//                     position: "absolute",
//                     top: "283.33px",
//                     left: "584.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Add your content here */}



//             </div>

//             <div
//                 className="artsaystext"
//                 style={{
//                     width: "112.33px",
//                     height: "20px",
//                     position: "absolute",
//                     top: "284.33px",
//                     left: "600.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans, sans-serif",
//                     fontWeight: 400,
//                     fontStyle: "normal",
//                     fontSize: "14px",
//                     lineHeight: "20px",
//                     textIndent: "1px",
//                     letterSpacing: "1%",
                    // color: "#000000",
                    // color: "#FFFFFF", // for visibility against black background
//                     // paddingLeft: "4px", // optional for visual balance
//                 }}
//             >
//                 artsays.com
//             </div>

//             <div
//                 className="tabularlink"
//                 style={{
//                     width: "20px",
//                     height: "20px",
//                     position: "absolute",
//                     top: "290.33px",
//                     left: "584.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* You can insert an icon or image here if needed */}

//                 <div
//                     className="tabularlinkvector"
//                     style={{
//                         width: "13.33px",
//                         height: "13.33px",
//                         border: "2px solid #000000",
//                         opacity: 1,
//                         transform: "rotate(0deg)",
//                         position: "absolute",
//                         top: "3.33px",
//                         left: "3.33px",
//                         transform: "translate(-50%, -50%)", // Center alignment
//                         boxSizing: "border-box",
//                     }}
//                 ></div>



//             </div>

//             <div
//                 className="text"
//                 style={{
//                     width: "494.8px",
//                     height: "20px",
//                     position: "absolute",
//                     top: "259.33px",
//                     left: "580.77px",
//                     transform: "rotate(0deg)",
//                     fontFamily: "Public Sans, sans-serif",
//                     fontWeight: 400,
//                     fontStyle: "normal",
//                     fontSize: "14px",
//                     lineHeight: "20px",
//                     textIndent: "1px",
//                     letterSpacing: "1%",
//                     color: "#000000",
//                     opacity: 1,
//                 }}
//             >
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, est laborum.
//             </div>

//             <div
//                 className="vikash"
//                 style={{
//                     width: "54.27px",
//                     height: "25.34px",
//                     position: "absolute",
//                     top: "209.16px",
//                     left: "580.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans ",
//                     fontWeight: 500,
//                     fontStyle: "normal",
//                     fontSize: "20px",
//                     lineHeight: "34.87px",
//                     textIndent: "1px",
//                     letterSpacing: "1%",
//                     color: "#000000",
//                     // color: "#ffffff",
//                     // textAlign: "center",
//                     // display: "flex",
//                     // alignItems: "center",
//                     // justifyContent: "center"
//                 }}
//             >
//                 Vikas
//             </div>

//             <div
//                 className="deputy_profile5"
//                 style={{
//                     width: "369.07px",
//                     height: "17.72px",
//                     position: "absolute",
//                     top: "176.45px",
//                     left: "585.77px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Content goes here */}
//             </div>
//             <div
//                 className="following"
//                 style={{
//                     width: "118.01px",
//                     height: "17.72px",
//                     position: "absolute",
//                     top: "176.45px",
//                     left: "836.83px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Content goes here */}
//             </div>

//             <div
//                 className="fivehundred"
//                 style={{
//                     width: "38.29px",
//                     height: "16.04px",
//                     position: "absolute",
//                     top: "177.29px",
//                     left: "839.83px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 700,
//                     fontStyle: "bold",
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#48372D",
//                 }}
//             >
//                 500
//             </div>

//             <div
//                 className="following"
//                 style={{
//                     width: "74.72px",
//                     height: "17.72px",
//                     position: "absolute",
//                     top: "177.45px",
//                     left: "879.11px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 500,
//                     fontStyle: "normal", // "Medium" is not a valid CSS value
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#6E4E37",
//                 }}
//             >
//                 Following
//             </div>

//             <div
//                 className="deputy_profile6"
//                 style={{
//                     width: "369.07px",
//                     height: "17.72px",
//                     position: "absolute",
//                     top: "176.45px",
//                     left: "585.77px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* Add content here if needed */}
//             </div>

//             <div
//                 className="twelveM"
//                 style={{
//                     width: "34.83px",
//                     height: "16.04px",
//                     position: "absolute",
//                     top: "177.29px",
//                     left: "695.1px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 700,
//                     fontStyle: "bold",
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#48372D",
//                 }}
//             >
//                 12M
//             </div>

//             <div
//                 className="followers"
//                 style={{
//                     width: "75.89px",
//                     height: "17.72px",
//                     position: "absolute",
//                     top: "177.45px",
//                     left: "727.93px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 500,
//                     fontStyle: "normal", // 'Medium' is not a valid value; defaulted to normal
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#6E4E37",
//                 }}
//             >
//                 Followers
//             </div>
//             <div
//                 className="deputy_profile7"
//                 style={{
//                     width: "80.34px",
//                     height: "16.57px",
//                     position: "absolute",
//                     top: "177.02px",
//                     left: "585.77px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                 }}
//             >
//                 {/* You can add content here if needed */}
//             </div>

//             <div
//                 className="twohundred"
//                 style={{
//                     width: "32.70px",
//                     height: "16.04px",
//                     position: "absolute",
//                     top: "177.29px",
//                     left: "585.77px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 700,
//                     fontStyle: "bold",
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#48372D",
//                 }}
//             >
//                 200
//             </div>
//             <div
//                 className="Posts"
//                 style={{
//                     width: "43px",
//                     height: "16.57px",
//                     position: "absolute",
//                     top: "177.02px",
//                     left: "615.1px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 500,
//                     fontStyle: "Medium",
//                     fontSize: "16px",
//                     lineHeight: "20px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#6E4E37",
//                 }}
//             >
//                 Posts
//             </div>

//             <div
//                 className="headingname"
//                 style={{
//                     width: "204.44px",
//                     height: "36.45px",
//                     position: "absolute",
//                     top: "126.23px",
//                     left: "574.56px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     fontFamily: "Public Sans",
//                     fontWeight: 500,
//                     fontStyle: "Medium",
//                     fontSize: "30px",
//                     lineHeight: "44px",
//                     letterSpacing: "1%",
//                     textAlign: "center",
//                     color: "#000000",
//                 }}
//             >
//                 Vikas_Khanna
//             </div>
//             <div
//                 className="profile_photo"
//                 style={{
//                     width: "167.65px",
//                     height: "167.65px",
//                     position: "absolute",
//                     top: "125px",
//                     left: "375.68px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     backgroundColor: "#ccc", // Placeholder color
//                     borderRadius: "50%", // Assuming it's a circular photo
//                     overflow: "hidden",
//                 }}
//             >
//                 <img src={Profile_photo} width={167.65} height={167.65} />
//             </div>


//             <div
//                 className="photo_symbol"
//                 style={{
//                     width: "720px",
//                     height: "289.3px",
//                     position: "absolute",
//                     top: "348px",
//                     left: "360px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     // backgroundColor: "#e0e0e0", // Placeholder background
//                 }}
//             >
//                 {/* You can add image, symbol, or content here */}
//             </div>


//             <div
//                 className="symbol"
//                 style={{
//                     width: "552px",
//                     height: "50px",
//                     position: "absolute",
//                     top: "348px",
//                     left: "428.1px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     // backgroundColor: "#e7da19ff", // Optional placeholder color
//                 }}
//             >
//                 {/* Add your content here */}
//             </div>

//             <div
//                 className="grid_icons1"
//                 style={{
//                     width: "24px",
//                     height: "24px",
//                     position: "absolute",
//                     top: "364.77px",
//                     left: "801.1px",
//                     transform: "rotate(0deg)",
//                     opacity: 1,
//                     // backgroundColor: "green" // Optional: placeholder background
//                 }}
//             >
//                 <div
//                     className="grid_icons1Image"
//                     style={{
//                         top: '3px',
//                         left: '2px',
//                         width: '20px',
//                         height: '19px',
//                         opacity: 1,
//                     }}
//                 >
//                     <img src={icon1} alt="Icon" width={20} height={19} />
//                 </div>
//             </div>

//             <div
//                 className="grid_icons2"
//                 style={{
//                     position: 'absolute',
//                     top: '348px',
//                     left: '428.1px',
//                     width: '87px',
//                     height: '50px',
//                     opacity: 1,
//                 }}
//             >
//                 <img src={icon2} alt="Icon2" width={87} height={50} />
//             </div>

//             <div
//                 className="grid_icons2inner"
//                 style={{
//                     position: 'absolute',
//                     top: '361.27px',
//                     left: '459.18px',
//                     width: '24px',
//                     height: '24px',
//                     opacity: 1,
//                 }}
//             >
//                 <img src={icon3} alt="Icon3" width={24} height={24} />

//                 <div
//                     className="grid_icons2innerImage"
//                     style={{
//                         position: 'absolute',
//                         top: '2px',
//                         left: '2px',
//                         width: '20px',
//                         height: '20px',
//                         opacity: 1,
//                         color: '#FFFFFF',
//                     }}
//                 >
//                     <img src={icon4} width={20} height={20} fill="white" />
//                 </div>




//             </div>

//             <div
//                 className="Rectangle"
//                 style={{
//                     position: 'absolute',
//                     top: '348px',
//                     left: '428.1px',
//                     width: '87px',
//                     height: '50px',
//                     opacity: 0,
//                     backgroundColor: '#48372D',
//                     borderRadius: '50px',
//                 }}
//             >
//             </div>

//             <div className="icons3"
//                 style={{
//                     position: 'absolute',
//                     top: '362.77px',
//                     left: '956.1px',
//                     width: '24px',
//                     height: '24px',
//                     opacity: 1,
//                 }}
//             ><img src={icons5} width={24} height={24} />

//                 <div
//                     className="icons3inner"
//                     style={{
//                         position: 'absolute',
//                         top: '3px',
//                         left: '3px',
//                         width: '18px',
//                         height: '20px',
//                         opacity: 1,
//                         color: '#000000',
//                     }}
//                 >
//                     <img src={icon6} width={18} height={20} fill='#000000' />
//                 </div>
//             </div>
//             <div
//                 className="grid_icons4"
//                 style={{
//                     position: 'absolute',
//                     top: '362.77px',
//                     left: '646.1px',
//                     width: '24px',
//                     height: '24px',
//                     opacity: 1,
//                     transform: 'rotate(0deg)',
//                 }}
//             >
//                 <img src={icon7} width={24} height={24} />

//                 <div
//                     className="grid_icons4image"
//                     style={{
//                         position: 'absolute',
//                         top: '3px',
//                         left: '5px',
//                         width: '14px',
//                         height: '18px',
//                         opacity: 1,
//                         transform: 'rotate(0deg)',
//                         border: '1.6px solid #000000',
//                     }}
//                 >
//                     <img src={icon8} width={14} height={18} />

//                 </div>

//             </div>


//             <div
//                 className="photos"
//                 style={{
//                     position: 'absolute',
//                     top: '413.22px',
//                     left: '360px',
//                     width: '720px',
//                     height: '224.078125px',
//                     opacity: 1,
//                     transform: 'rotate(0deg)',
//                     borderRadius: '5px',
//                     // backgroundColor: '#6fa7b8ff' // Optional placeholder background
//                 }}
//             >

//             </div>

//             <div
//                 className="photo1"
//                 style={{
//                     position: 'absolute',
//                     top: '413.3px',
//                     left: '856px',
//                     width: '224px',
//                     height: '224px',
//                     opacity: 1,
//                     transform: 'rotate(0deg)',
//                     borderRadius: '5px',
//                     // backgroundColor: '#ccc' // Optional placeholder background
//                 }}
//             >
//                 <img src={icon9} width={224} height={224} />
//             </div>


//             <div
//                 className="photo2"
//                 style={{
//                     position: 'absolute',
//                     top: '413.22px',
//                     left: '608px',
//                     width: '224px',
//                     height: '224px',
//                     opacity: 1,
//                     transform: 'rotate(0deg)',
//                     borderRadius: '5px', // optional placeholder color
//                 }}
//             >
//                 <img src={icon10} width={224} height={224} />
//             </div>

//             <div
//                 className="photo3"
//                 style={{
//                     position: 'absolute',
//                     top: '413.22px',
//                     left: '360px',
//                     width: '224px',
//                     height: '224px',
//                     opacity: 1,
//                     transform: 'rotate(0deg)',
//                     borderRadius: '5px',
//                     // backgroundColor: '#ccc' // optional placeholder color
//                 }}
//             >   <img src={icon11} width={224} height={224} />
//             </div>



//         </div>
//     );
// };

// export default Profile;
    



import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import Sidebar from "./Side";
import { IconDots } from '@tabler/icons-react';
import icon1 from './icon1.svg';
import icon2 from './icon2.svg';
import icon3 from './icon3.svg';
import icon4 from './icon4.svg';
import icons5 from './icons5.svg';
import icon6 from './icon6.svg';
import icon7 from './icon7.svg';
import icon8 from './icon8.svg';
import icon9 from './icon9.svg';
import icon10 from './icon10.svg';
import icon11 from './icon11.svg';
import Profile_photo from './Profile_photo.svg';

// Boost Profile Component
const BoostProfile = () => (
  <div className="absolute top-[131.68px] left-[966.29px] w-[86px] h-[31px]">
    <div className="relative w-[84.99px] h-[29.61px] top-[0.52px] left-[0.8px] bg-[#6F4D34] rounded-[5px]">
      <div className="absolute top-[6.32px] left-[5.8px] font-bold text-[12px] leading-[18px] text-white">
        Boost Profile
      </div>
    </div>
  </div>
);


// Profile Dropdown Component
const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="absolute top-[127px] left-[910px] w-[155px] h-[138px] z-10 ">
      {/* <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
      >
        <IconDots size={24} />
      </button> */}

      <button 
        onClick={() => setIsOpen(!isOpen)}
>
          <div className="absolute top-[8px] left-[143.71px] w-[24px] h-[24px] flex items-center justify-between text-black">
        <IconDots size={24} />
            </div>
        </button>
          




      {isOpen && (
        <div className="absolute right-0 mt-3 w-155 h-107  bg-gray  shadow-lg border border-gray-200 bg-gray-100 relative z-50 rounded-xl">
          <div 
            className={`px-1 py-1 text-sm rounded-lg bg-gray-100 ${hoveredItem === 0 ? 'bg-gray-300' : ''}`}
            onMouseEnter={() => setHoveredItem(0)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Settings and privacy
          </div>
          <div className="absolute border-[0.5px] border-[#292929] left-[14px] right-[14px] rounded-3xl"></div>
          <div 
            className={`px-4 py-2 text-sm bg-gray-100   ${hoveredItem === 1 ? 'bg-gray-300' : ''}`}
            onMouseEnter={() => setHoveredItem(1)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Login activity
          </div>
          <div className="absolute border-[0.5px] border-[#292929] left-[14px] right-[14px]"></div>
          <div 
            className={`px-4 py-2 text-sm rounded-xl bg-gray-100   ${hoveredItem === 2 ? 'bg-gray-300' : ''}`}
            onMouseEnter={() => setHoveredItem(2)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Profile Component
const EditProfile = () => (
  <button className="bg-[#6F4D34] hover:bg-[#5a3d28] relative left-[1px] text-white text-xs sm:text-sm px-2.5 py-1.5 rounded-md font-bold transition-colors">
    Edit Profile
  </button>
);

// User Stats Component
const UserStats = () => (
  <div className="flex gap-8 absolute top-[176.45px] left-[585.77px]">
    <div className="flex items-center gap-1">
      <span className="font-bold text-[16px] leading-[20px] text-[#48372D]">200</span>
      <span className="font-medium text-[16px] leading-[20px] text-[#6E4E37]">Posts</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="font-bold text-[16px] leading-[20px] text-[#48372D]">12M</span>
      <span className="font-medium text-[16px] leading-[20px] text-[#6E4E37]">Followers</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="font-bold text-[16px] leading-[20px] text-[#48372D]">500</span>
      <span className="font-medium text-[16px] leading-[20px] text-[#6E4E37]">Following</span>
    </div>
  </div>
);

// Profile Photos Component
const ProfilePhotos = () => (
  <div className="absolute top-[413.22px] left-[360px] w-[720px] h-[224.08px] rounded-[5px]">
    <div className="flex gap-8">
      <div className="w-[224px] h-[224px] rounded-[5px]">
        <img src={icon11} alt="Photo 3" className="w-full h-full object-cover rounded-[5px]" />
      </div>
      <div className="w-[224px] h-[224px] rounded-[5px]">
        <img src={icon10} alt="Photo 2" className="w-full h-full object-cover rounded-[5px]" />
      </div>
      <div className="w-[224px] h-[224px] rounded-[5px]">
        <img src={icon9} alt="Photo 1" className="w-full h-full object-cover rounded-[5px]" />
      </div>
    </div>
  </div>
);

// Grid Icons Component
const GridIcons = () => (
  <div className="absolute top-[348px] left-[428.1px] w-[552px] h-[50px] flex items-center justify-between">
    <div className="w-[87px] h-[50px] relative">
      <img src={icon2} alt="Icon 2" className="w-full h-full" />
      <div className="absolute top-[13.27px] left-[31.18px] w-[24px] h-[24px]">
        <img src={icon3} alt="Icon 3" className="w-full h-full" />
        <div className="absolute top-[2px] left-[2px] w-[20px] h-[20px]">
          <img src={icon4} alt="Icon 4" className="w-full h-full" />
        </div>
      </div>
    </div>
    
    <div className="w-[24px] h-[24px] relative">
      <img src={icon7} alt="Icon 7" className="w-full h-full" />
      <div className="absolute top-[3px] left-[5px] w-[14px] h-[18px] border-[1.6px] border-black">
        <img src={icon8} alt="Icon 8" className="w-full h-full" />
      </div>
    </div>
    
    <div className="w-[24px] h-[24px] relative">
      <img src={icon1} alt="Icon 1" className="w-[20px] h-[19px] mt-[3px] ml-[2px]" />
    </div>
    
    <div className="w-[24px] h-[24px] relative">
      <img src={icons5} alt="Icon 5" className="w-full h-full" />
      <div className="absolute top-[3px] left-[3px] w-[18px] h-[20px]">
        <img src={icon6} alt="Icon 6" className="w-full h-full" />
      </div>
    </div>
  </div>
);

// Main Profile Component
const Profile = () => {
  const { username } = useParams();

  return (
    <div className="relative w-[1440px] h-[1024px] mx-auto">
      {/* <Sidebar /> */}
      
      {/* Profile Header */}
      <div className="absolute top-[125px] left-[375.68px] w-[167.65px] h-[167.65px] rounded-full overflow-hidden">
        <img src={Profile_photo} alt="Profile" className="w-full h-full" />
      </div>
      
      <div className="absolute top-[126.23px] left-[574.56px] w-[204.44px] h-[36.45px] opacity-100 
       font-medium 
       text-[30px] 
      leading-[44px] 
   [letter-spacing:1%] 
      text-center 
      text-black 
     font-[Public Sans]">
        Vikas_Khanna
      </div>
      
      <UserStats />
      
      <div className="absolute top-[209.16px] left-[577.56px] w-[54.27px] h-[25.34px] rotate-0 opacity-100 text-[20px] leading-[34.87px] text-black text-center font-medium [text-indent:1px] [letter-spacing:1%] font-[Public Sans] ">
        Vikas
      </div>
      
      <div className="absolute top-[239.16px] left-[580.56px] font-public font-normal text-[14px] leading-[20px] text-[#6E4E37] indent-[1px] tracking-[0.01em]">
        Artist
      </div>
      
      <div className="absolute top-[259.33px] left-[580.77px] w-[494.8px] h-[20px]  opacity-100 
  font-normal 
  text-[14px] 
  leading-[20px] 
  [text-indent:1px] 
  [letter-spacing:1%] 
  text-black 
  font-[Public_Sans]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, est laborum.
      </div>
      
      <div className="absolute top-[283.33px] left-[584.56px] flex items-center">
        <div className="w-[20px] h-[20px] relative mr-2">
          <div className="absolute top-[50%] left-[50%] w-[13.33px] h-[13.33px] border-2 border-black transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <span className=" font-normal 
          text-[14px] 
         leading-[20px] 
        [text-indent:1px] 
         [letter-spacing:1%] 
            text-black 
        font-[Public_Sans]">artsays.com</span>
      </div>
      
      <div className="absolute top-[132.68px] left-[873px]">
        <EditProfile />
      </div>
      
      <BoostProfile />
      
      <ProfileDropdown />
      
      <GridIcons />
      
      <ProfilePhotos />
      
      <Suggestion />
    </div>
  );
};

// Suggestion Component
const Suggestion = () => {
  const users = [
    {
      name: 'James Patel',
      avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
    {
      name: 'James Patel',
      avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
    {
      name: 'James Patel',
      avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
    {
      name: 'James Patel',
      avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
    },
  ];

  const adImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3oql1QTjEkuSfZYyT2Rxsxb_CNSSjwUeyXg&s',
    'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?cs=srgb&dl=pexels-steve-1585325.jpg&fm=jpg',
    'https://i0.wp.com/montessorifromtheheart.com/wp-content/uploads/2023/03/Straw-Print-Flower-Painting-Craft.jpg?resize=1080%2C1350&ssl=1',
  ];

  const [activeAdIndex, setActiveAdIndex] = useState(0);

  return (
    <div className="absolute top-[125px] right-[40px] w-[22%] px-2 mt-1">
      <h3 className="text-lg font-bold my-2 ml-1">Suggested for you</h3>
      
      {users.map((user, index) => (
        <div key={index} className={`flex flex-col sm:flex-row p-1 items-start sm:items-center justify-between mb-2 gap-2
          ${index === 0 ? 'border-t border-t-[#6E4E37]' : ''}
          ${index === users.length - 1 ? 'border-b border-b-[#6E4E37]' : ''}`}
        >
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt="avatar"
              className="rounded-full w-9 h-9 object-cover"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-[8px] text-gray-600">Suggested for you</p>
            </div>
          </div>
        
          <div className="flex flex-row sm:flex-row gap-1 items-center sm:ml-auto">
            <button className="bg-[#6F4D34] hover:bg-gray-200 text-white text-[11px] sm:text-sm px-2 py-[5px] rounded-lg border border-gray-300 font-semibold transition-colors duration-300 whitespace-nowrap">
              Follow
            </button>
            <button className="text-[#6E4E37] text-xl leading-none">
              ×
            </button>
          </div>
        </div>
      ))}
      
      <hr className="h-0.5 bg-gray-700 text-gray-400 border-none mt-2" />
      
      {/* Ad Section */}
      <div className="mt-3 w-full flex flex-col">
        <div className="flex border-4 border-[#4C3427] bg-[#4C3427] mb-3 rounded-xl overflow-hidden h-40 w-full">
          {adImages.map((src, idx) => {
            const isActive = idx === activeAdIndex;
            return (
              <div
                key={idx}
                onClick={() => setActiveAdIndex(idx)}
                className={`cursor-pointer transition-all duration-300 ease-in overflow-hidden ${
                  idx === 0 ? 'border-l-0' : 'border-l-4 border-l-[#2C211B]'
                }`}
                style={{
                  flexGrow: isActive ? 5 : 1,
                  flexBasis: isActive ? '65%' : '15%',
                }}
              >
                <img
                  src={src}
                  alt={`ad-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        
        <p className="w-full text-sm text-[#564138] p-1.5 rounded-xl border-2 border-[#4C3427] font-bold text-[#333]">
          The art drop you didn't know you needed!!
        </p>
        
        <button className="text-xs mt-2 sm:text-sm w-full font-semibold text-white bg-[#6F4D34] px-3 sm:px-4 py-2 rounded hover:bg-[#cc3e0e] transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Profile;




// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "./Side";
// import { IconDots } from '@tabler/icons-react';
// import icon1 from './icon1.svg';
// import icon2 from './icon2.svg';
// import icon3 from './icon3.svg';
// import icon4 from './icon4.svg';
// import icons5 from './icons5.svg';
// import icon6 from './icon6.svg';
// import icon7 from './icon7.svg';
// import icon8 from './icon8.svg';
// import icon9 from './icon9.svg';
// import icon10 from './icon10.svg';
// import icon11 from './icon11.svg';
// import Profile_photo from './Profile_photo.svg';

// // Boost Profile Component
// const BoostProfile = () => (
//   <div className="ml-2">
//     <button className="bg-[#6F4D34] hover:bg-[#5a3d28] text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-bold transition-colors">
//       Boost Profile
//     </button>
//   </div>
// );

// // Profile Dropdown Component
// const ProfileDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hoveredItem, setHoveredItem] = useState(null);

//   return (
//     <div className="relative ml-2">
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-1 rounded-full hover:bg-gray-200 transition-colors"
//       >
//         <IconDots size={24} />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//           <div 
//             className={`px-4 py-2 text-sm ${hoveredItem === 0 ? 'bg-gray-100' : ''}`}
//             onMouseEnter={() => setHoveredItem(0)}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             Settings and privacy
//           </div>
//           <div className="border-t border-gray-200"></div>
//           <div 
//             className={`px-4 py-2 text-sm ${hoveredItem === 1 ? 'bg-gray-100' : ''}`}
//             onMouseEnter={() => setHoveredItem(1)}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             Login activity
//           </div>
//           <div className="border-t border-gray-200"></div>
//           <div 
//             className={`px-4 py-2 text-sm rounded-b-lg ${hoveredItem === 2 ? 'bg-gray-100' : ''}`}
//             onMouseEnter={() => setHoveredItem(2)}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             Log Out
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Edit Profile Component
// const EditProfile = () => (
//   <button className="bg-[#6F4D34] hover:bg-[#5a3d28] text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-bold transition-colors">
//     Edit Profile
//   </button>
// );

// // User Stats Component
// const UserStats = () => (
//   <div className="flex flex-wrap gap-4 sm:gap-8 mt-4">
//     <div className="flex flex-col items-center sm:flex-row sm:gap-1">
//       <span className="font-bold text-sm sm:text-base text-[#48372D]">200</span>
//       <span className="font-medium text-sm sm:text-base text-[#6E4E37]">Posts</span>
//     </div>
//     <div className="flex flex-col items-center sm:flex-row sm:gap-1">
//       <span className="font-bold text-sm sm:text-base text-[#48372D]">12M</span>
//       <span className="font-medium text-sm sm:text-base text-[#6E4E37]">Followers</span>
//     </div>
//     <div className="flex flex-col items-center sm:flex-row sm:gap-1">
//       <span className="font-bold text-sm sm:text-base text-[#48372D]">500</span>
//       <span className="font-medium text-sm sm:text-base text-[#6E4E37]">Following</span>
//     </div>
//   </div>
// );

// // Profile Photos Component
// const ProfilePhotos = () => (
//   <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//     <div className="aspect-square rounded-lg overflow-hidden">
//       <img src={icon11} alt="Photo 3" className="w-full h-full object-cover" />
//     </div>
//     <div className="aspect-square rounded-lg overflow-hidden">
//       <img src={icon10} alt="Photo 2" className="w-full h-full object-cover" />
//     </div>
//     <div className="aspect-square rounded-lg overflow-hidden">
//       <img src={icon9} alt="Photo 1" className="w-full h-full object-cover" />
//     </div>
//   </div>
// );

// // Grid Icons Component
// const GridIcons = () => (
//   <div className="flex justify-center sm:justify-between items-center mt-8 mb-4 px-4 sm:px-0">
//     <div className="hidden sm:block w-20 h-12 relative">
//       <img src={icon2} alt="Icon 2" className="w-full h-full" />
//       <div className="absolute top-3 left-8 w-6 h-6">
//         <img src={icon3} alt="Icon 3" className="w-full h-full" />
//         <div className="absolute top-0.5 left-0.5 w-5 h-5">
//           <img src={icon4} alt="Icon 4" className="w-full h-full" />
//         </div>
//       </div>
//     </div>
    
//     <div className="flex gap-6 sm:gap-8">
//       <div className="w-6 h-6 relative">
//         <img src={icon7} alt="Icon 7" className="w-full h-full" />
//         <div className="absolute top-0.5 left-1 w-3.5 h-4.5 border border-black">
//           <img src={icon8} alt="Icon 8" className="w-full h-full" />
//         </div>
//       </div>
      
//       <div className="w-6 h-6 relative">
//         <img src={icon1} alt="Icon 1" className="w-5 h-4.5 mt-0.5 ml-0.5" />
//       </div>
      
//       <div className="w-6 h-6 relative">
//         <img src={icons5} alt="Icon 5" className="w-full h-full" />
//         <div className="absolute top-0.5 left-0.5 w-4.5 h-5">
//           <img src={icon6} alt="Icon 6" className="w-full h-full" />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Suggestion Component
// const Suggestion = () => {
//   const users = [
//     {
//       name: 'James Patel',
//       avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
//     },
//     {
//       name: 'Sarah Johnson',
//       avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
//     },
//     {
//       name: 'Michael Chen',
//       avatar: 'https://static.vecteezy.com/system/resources/previews/024/183/538/non_2x/male-avatar-portrait-of-a-business-man-in-a-suit-illustration-of-male-character-in-modern-color-style-vector.jpg',
//     },
//   ];

//   return (
//     <div className="hidden lg:block lg:w-72 xl:w-80 pl-8">
//       <h3 className="text-lg font-bold mb-4">Suggested for you</h3>
      
//       {users.map((user, index) => (
//         <div key={index} className={`flex items-center justify-between py-3 ${index !== users.length - 1 ? 'border-b border-[#6E4E37]' : ''}`}>
//           <div className="flex items-center">
//             <img
//               src={user.avatar}
//               alt="avatar"
//               className="rounded-full w-9 h-9 object-cover mr-2"
//             />
//             <div>
//               <p className="text-sm font-semibold">{user.name}</p>
//               <p className="text-xs text-gray-500">Suggested for you</p>
//             </div>
//           </div>
        
//           <div className="flex items-center">
//             <button className="bg-[#6F4D34] hover:bg-[#5a3d28] text-white text-xs px-2 py-1 rounded-md font-semibold mr-1">
//               Follow
//             </button>
//             <button className="text-[#6E4E37] text-lg">
//               ×
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Main Profile Component
// const Profile = () => {
//   const { username } = useParams();

//   return (
//     <div className="flex min-h-screen bg-white">
//       <Sidebar />
      
//       <div className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto">
//         {/* Profile Header */}
//         <div className="flex flex-col sm:flex-row">
//           {/* Profile Photo */}
//           <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mx-auto sm:mx-0 mb-4 sm:mb-0 sm:mr-8">
//             <img src={Profile_photo} alt="Profile" className="w-full h-full object-cover" />
//           </div>
          
//           {/* Profile Info */}
//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between">
//               <h1 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-0">Vikas_Khanna</h1>
              
//               <div className="flex items-center mt-2 sm:mt-0">
//                 <EditProfile />
//                 <BoostProfile />
//                 <ProfileDropdown />
//               </div>
//             </div>
            
//             <UserStats />
            
//             <div className="mt-4">
//               <h2 className="text-lg font-medium">Vikas</h2>
//               <p className="text-sm text-gray-600">Artist</p>
//               <p className="mt-2 text-sm">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, est laborum.
//               </p>
//               <div className="flex items-center mt-2">
//                 <div className="w-4 h-4 border border-black mr-1"></div>
//                 <a href="#" className="text-sm text-[#6E4E37] hover:underline">artsays.com</a>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <GridIcons />
//         <ProfilePhotos />
//       </div>
      
//       <Suggestion />
//     </div>
//   );
// };

// export default Profile;