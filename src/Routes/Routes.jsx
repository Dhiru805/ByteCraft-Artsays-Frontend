import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import WebsiteLayout from "../Layouts/WebsiteLayout";
import { useAuth } from "../AuthContext";
import PreloaderAnimation from "../Pages/Animation/PreloaderAnimation";

//----------------------------------------Auth Pages------------------------------------------//
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ArtistSellerRegister from "../Pages/Register/ArtistSellerRegister";
import ForgotPassword from "../Pages/Login/Forgotpassword";
//-----public routes-----//
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import TermsofServices from "../Pages/Terms&Condition/TermsofServices";
import BiddingPass from "../Pages/Art-Biding/BidingPage";
// import Challenge from "../Pages/Challenges/Challenge";

//----------------------------------------My Account-----------------------------------------//
import MyAccountMainLayout from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/MyAccountMainLayout";
import { AccountPage } from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyAccountPage";
import { AccountForm } from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/PersonaInformation";
import ManageAddress from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/ManageAddress";
import BankPaymentDetails from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/BankPaymentDetails";
import PaymentMethod from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/PaymentMethod";
import PasswordManager from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/PasswordManager";
import AccountVerification from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/AccountVerification";
import SocialMediaPromotion from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/SocialMediaPromotion";
import CustomRequest from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/CustomRequest";
import NotificationAndPreferences from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/NotificationAndPreferences";
import AccountSecurityAndAgreements from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/AccountSecurityAndAgreements";
import MyOrders from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyOrders";
import Logout from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/Logout";
import TrackOrder from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/TrackOrder";
import WishListTable from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/WishListTable";
import MyCartList from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/MyCartList";
import CheckOut from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/CheckOut";
import OrderCompleted from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/OrderCompleted";
import MyOrderView from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyOrderView";

//----------------------------------------Error Pages-----------------------------------------//
import PagenotFound404 from "../Pages/Error/404Error";
import UnauthorizedAccess from "../Pages/Error/403Error";

//----------------------------------------WebsiteRoutes-----------------------------------------//
// import WebsiteMain from "../Pages/Home/Home";
import WebsiteMain from "../Pages/Homepage/Homepage";
//----------------------------------------User Profile---------------------------------------//
import UserProfile from "../Component/Dashboard/UserProfile/UserInfo";

//----------------------------------------Dashboard Layouts-----------------------------------//
import SuperAdminLayout from "../Component/Dashboard/Super-AdminDashboard/MainDashboard";
import ArtistLayout from "../Component/Dashboard/ArtistDashbooard/MainDashboard";
import BuyerLayout from "../Component/Dashboard/BuyerDashboard/MainDashboard";
import SellerLayout from "../Component/Dashboard/SellerDashboard/MainDashboard";

//----------------------------------------Wallet-----------------------------------//
import WalletDashboard from "../Component/Dashboard/Super-AdminDashboard/wallet/walletDashboard";
import AdminWalletManagement from "../Component/Dashboard/Super-AdminDashboard/wallet/AdminWalletManagement";
import BuyerWallet from "../Component/Dashboard/BuyerDashboard/Wallet/BuyerWallet";
import ArtistSellerWallet from "../Component/Dashboard/ArtistDashbooard/Wallet/ArtistSellerWallet";
import SellerWallet from "../Component/Dashboard/SellerDashboard/Wallet/SellerWallet";

//----------------------------------------Super-Admin Components-----------------------------//
import SuperAdminDashboard from "../Component/Dashboard/Super-AdminDashboard/Dashboard/MainContent";
import SuperAdminBlog from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/BlogRequest";
import SuperAdminBlogPost from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/BlogPost";
import SuperAdminViewBlog from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/ViewBlog";
import SuperAdminUpdateBlog from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/UpdateBlogList";
import SuperAdminProductInfo from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/Productinfo";
import SuperAdminMarketing from "../Component/Dashboard/Super-AdminDashboard/Settings/EmailMarketing/Marketing/MarketingEmail";
import UserRole from "../Component/Dashboard/Super-AdminDashboard/Settings/UserRole/UserRole";
import CreateRole from "../Component/Dashboard/Super-AdminDashboard/Settings/UserRole/CreateRole";
import SuperAdminBiddingPass from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/BiddingPass";
import SuperAdminArtistAdvertise from "../Component/Dashboard/Super-AdminDashboard/Advertise/Advertise";
import SuperAdminArtistSponsor from "../Component/Dashboard/Super-AdminDashboard/Advertise/Sponser";
import SuperAdminCertification from "../Component/Dashboard/Super-AdminDashboard/Certification/Certification";
import CreateCertifications from "../Component/Dashboard/Super-AdminDashboard/Certification/create";
import FAQ from "../Component/Dashboard/Super-AdminDashboard/FAQ/FAQ";
import Carrer from "../Component/Dashboard/Super-AdminDashboard/Career/Career";
import CreateCarrer from "../Component/Dashboard/Super-AdminDashboard/Career/CreateCarrer";
import UpdateCareer from "../Component/Dashboard/Super-AdminDashboard/Career/EditCareer";
import ViewCareer from "../Component/Dashboard/Super-AdminDashboard/Career/CarrerView";

import CarrerTable from "../Component/Dashboard/Super-AdminDashboard/Career/applications/Applications";
import UpdateCareerApp from "../Component/Dashboard/Super-AdminDashboard/Career/applications/UpdateApplication";
import ViewCareerApp from "../Component/Dashboard/Super-AdminDashboard/Career/applications/ViewApplication";

import Exhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/exhibition";
import CreateExhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/create";
import UpdateExhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/editExhibition";
import ViewExhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/exhibitionView";
import ExhibitionRequest from "../Component/Dashboard/Super-AdminDashboard/Exhibition/ExhibitionRequest/exhibitionRequest";
import UpdateExhibitionRequest from "../Component/Dashboard/Super-AdminDashboard/Exhibition/ExhibitionRequest/editExhibitionRequest";
import ViewExhibitionRequest from "../Component/Dashboard/Super-AdminDashboard/Exhibition/ExhibitionRequest/exhibitionRequestView";
import AutoTargetingSetting from "../Component/Dashboard/Super-AdminDashboard/Settings/DefaultAutoTargeting/DefaultAutoTargeting";
import GroupTargetingSetting from "../Component/Dashboard/Super-AdminDashboard/Settings/AutoTargetingGroup/GroupTargetingSetting";
import KeywordTargetingSetting from "../Component/Dashboard/Super-AdminDashboard/Settings/KeywordTargeting/KeywordTargetingSetting";

import PolicyTable from "../Component/Dashboard/Super-AdminDashboard/Policys/PolicyTable";
import CreatePolicy from "../Component/Dashboard/Super-AdminDashboard/Policys/createPolicy";
import UpdatePolicy from "../Component/Dashboard/Super-AdminDashboard/Policys/editPolicy";
//import ViewPolicy from '../Component/Dashboard/Super-AdminDashboard/Policys/PolicyView';

import How_To_Buy from "../Component/Dashboard/Super-AdminDashboard/HowToBuy/buyTable";
import CreateHowToBuy from "../Component/Dashboard/Super-AdminDashboard/HowToBuy/create";
import UpdateHowToBuy from "../Component/Dashboard/Super-AdminDashboard/HowToBuy/edit";
//import ViewHowToBuy from "../Component/Dashboard/Super-AdminDashboard/HowToBuy/view";

import How_To_Sell from "../Component/Dashboard/Super-AdminDashboard/HowToSell/sellTable";
import CreateHowToSell from "../Component/Dashboard/Super-AdminDashboard/HowToSell/create";
import UpdateHowToSell from "../Component/Dashboard/Super-AdminDashboard/HowToSell/edit";
//import ViewHowToSell from "../Component/Dashboard/Super-AdminDashboard/HowToSell/view";

import Celebrities from "../Component/Dashboard/Super-AdminDashboard/Celebraties/Celebraties";
import CreateCelebrities from "../Component/Dashboard/Super-AdminDashboard/Celebraties/CreateCelebraties";
import ViewCelebrity from "../Component/Dashboard/Super-AdminDashboard/Celebraties/ViewCelebrity";
import UpdateCelebrity from "../Component/Dashboard/Super-AdminDashboard/Celebraties/UpdateCelebrity";

import How_To_Resell from "../Component/Dashboard/Super-AdminDashboard/HowToResell/resellTable";
import CreateHowToResell from "../Component/Dashboard/Super-AdminDashboard/HowToResell/create";
import UpdateHowToResell from "../Component/Dashboard/Super-AdminDashboard/HowToResell/edit";

import Gallery from "../Component/Dashboard/Super-AdminDashboard/ArtsaysGallery/table";
import CreateGallery from "../Component/Dashboard/Super-AdminDashboard/ArtsaysGallery/create";
import UpdateGallery from "../Component/Dashboard/Super-AdminDashboard/ArtsaysGallery/edit";

import ArtsaysGalleryTable from "../Component/Dashboard/Super-AdminDashboard/CMSArtsaysGallery/table";
import ArtsaysGalleryCreate from "../Component/Dashboard/Super-AdminDashboard/CMSArtsaysGallery/create";
import ArtsaysGalleryEdit from "../Component/Dashboard/Super-AdminDashboard/CMSArtsaysGallery/edit";

import WhyArtSays from "../Component/Dashboard/Super-AdminDashboard/WhyArtSays/whyTable";
import CreateWhyArtSays from "../Component/Dashboard/Super-AdminDashboard/WhyArtSays/create";
import UpdateWhyArtSays from "../Component/Dashboard/Super-AdminDashboard/WhyArtSays/edit";

import LicensingTable from "../Component/Dashboard/Super-AdminDashboard/Licensing/LicensingTable";
import CreateLicensing from "../Component/Dashboard/Super-AdminDashboard/Licensing/create";
import UpdateLicensing from "../Component/Dashboard/Super-AdminDashboard/Licensing/UpdateLicensing";

import CommissionTable from "../Component/Dashboard/Super-AdminDashboard/Commission/commTable";
import CreateCommission from "../Component/Dashboard/Super-AdminDashboard/Commission/create";
import UpdateCommission from "../Component/Dashboard/Super-AdminDashboard/Commission/edit";

import HowToBidTable from "../Component/Dashboard/Super-AdminDashboard/HowToBid/bidTable";
import CreateHowToBid from "../Component/Dashboard/Super-AdminDashboard/HowToBid/create";
import UpdateHowToBid from "../Component/Dashboard/Super-AdminDashboard/HowToBid/edit";

import AffiliateTable from "../Component/Dashboard/Super-AdminDashboard/Affiliate/affiTable";
import CreateAffiliate from "../Component/Dashboard/Super-AdminDashboard/Affiliate/create";
import UpdateAffiliate from "../Component/Dashboard/Super-AdminDashboard/Affiliate/edit";

import AffiliateBPTable from "../Component/Dashboard/Super-AdminDashboard/Affiliatebp/affibpTable";
import CreateAffiliateBP from "../Component/Dashboard/Super-AdminDashboard/Affiliatebp/create";
import UpdateAffiliateBP from "../Component/Dashboard/Super-AdminDashboard/Affiliatebp/edit";

import ContactUsEntries from "../Component/Dashboard/Super-AdminDashboard/ContactUs/table";
import CreateContactUsEntry from "../Component/Dashboard/Super-AdminDashboard/ContactUs/create";
import UpdateContactUsEntry from "../Component/Dashboard/Super-AdminDashboard/ContactUs/edit";

import CertificateTable from "../Component/Dashboard/Super-AdminDashboard/CertificateCMS/table";
import CreateCertificate from "../Component/Dashboard/Super-AdminDashboard/CertificateCMS/create";
import EditCertificate from "../Component/Dashboard/Super-AdminDashboard/CertificateCMS/edit";

import PartnerTable from "../Component/Dashboard/Super-AdminDashboard/PartnerPage/table";
import CreatePartner from "../Component/Dashboard/Super-AdminDashboard/PartnerPage/create";
import EditPartner from "../Component/Dashboard/Super-AdminDashboard/PartnerPage/edit";

import InsuranceTable from "../Component/Dashboard/Super-AdminDashboard/Insurance/table";
import CreateInsurance from "../Component/Dashboard/Super-AdminDashboard/Insurance/create";
import EditInsurance from "../Component/Dashboard/Super-AdminDashboard/Insurance/edit";

import EnquiryTable from "../Component/Dashboard/Super-AdminDashboard/Enquiry/table";
import ViewEnquiry from "../Component/Dashboard/Super-AdminDashboard/Enquiry/view";

//----------------------------------------Homepage Super-Admin Dashboard-----------------------------------------------------------
import Homepage from "../Component/Dashboard/Super-AdminDashboard/Homepage/table";
import CreateHomepage from "../Component/Dashboard/Super-AdminDashboard/Homepage/create";

//Hero Section
import CreateHero from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/Hero";

//Browse categories
import CreateCategories from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/browseCategoriesCreate";

//Why Buy From Artsays
import CreateWhyBuyArtsays from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/whyFromArtSaysCreate";

//Bidding Arena
import CreateBiddingArena from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/biddingArena";

//How To Buy
import CreateHowToBuyHomepage from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/howToBuyCreate";

//Discover Artist
import CreateDiscoverArtist from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/discoverArtist";

//Why Artsays is Different
import CreateWhyArtsaysDifferent from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/whyArtSaysDifferent";

//Challenges
import CreateChallengesHomepage from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/homeChallenges";

//Art Icon
import CreateArtIcon from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/articon";

//How to Sell
import CreateHowToSellHomepage from "../Component/Dashboard/Super-AdminDashboard/Homepage/sections/howToSellCreate";

//----------------------------------------About Us Super-Admin Dashboard-----------------------------------------------------------
// Main About Us
import Aboutus from "../Component/Dashboard/Super-AdminDashboard/AboutUs/AboutUsTable";
import CreateAboutUs from "../Component/Dashboard/Super-AdminDashboard/AboutUs/AboutUsCreate";
import UpdateAboutUs from "../Component/Dashboard/Super-AdminDashboard/AboutUs/AboutUsEdit";

// Who We Are
import CreateWhoWeAre from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/WhoWeAreCreate";
import UpdateWhoWeAre from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/WhoWeAreEdit";

// What We Do
import CreateWhatWeDo from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/WhatWeDoCreate";
import UpdateWhatWeDo from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/WhatWeDoEdit";

// Mission & Vision
import CreateMissionVision from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/MissionVisionCreate";
import UpdateMissionVision from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/MissionVisionEdit";

// Our Values
import CreateOurValues from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/OurValuesCreate";
import UpdateOurValues from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/OurValuesEdit";

// Delivery Process
import CreateDeliveryProcess from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/DeliveryProcessCreate";
import UpdateDeliveryProcess from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/DeliveryProcessEdit";

// Meet The Team
import CreateMeetTeam from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/MeetTeamCreate";
import UpdateMeetTeam from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/MeetTeamEdit";

// Testimonials
import CreateTestimonials from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/TestimonialsCreate";
import UpdateTestimonials from "../Component/Dashboard/Super-AdminDashboard/AboutUs/sections/TestimonialsEdit";

import Challenges from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/challenges";
import CreateChallenges from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/create";
//import ChallengesEntries from "../Component/Dashboard/Super-AdminDashboard/Challenges/ChallengesEntries/challengesEntries";

import ChallengesTable from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/challenges";
import CreateChallenge from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/CreateChallenge";
import ViewChallenge from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/ViewChallenge";
import UpdateChallenge from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/UpdateChallenge";
import ChallengesEntries from "../Component/Dashboard/Super-AdminDashboard/Challenges/ChallengesEntries/challengesEntries";
import ViewChallengeApplication from "../Component/Dashboard/Super-AdminDashboard/Challenges/ChallengesEntries/ViewChallengeApplication";
import UpdateChallengeApplication from "../Component/Dashboard/Super-AdminDashboard/Challenges/ChallengesEntries/UpdateChallengeApplication";

// import ViewCareer from "../Component/Dashboard/Super-AdminDashboard/Career/CarrerView";
// import Exhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/exhibition";
// import CreateExhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/create";
// import UpdateExhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/editExhibition";
// import ViewExhibition from "../Component/Dashboard/Super-AdminDashboard/Exhibition/exhibitionView";
// import ExhibitionRequest from '../Component/Dashboard/Super-AdminDashboard/Exhibition/ExhibitionRequest/exhibitionRequest';
// import UpdateExhibitionRequest from "../Component/Dashboard/Super-AdminDashboard/Exhibition/ExhibitionRequest/editExhibitionRequest";
// import ViewExhibitionRequest from "../Component/Dashboard/Super-AdminDashboard/Exhibition/ExhibitionRequest/exhibitionRequestView";
// import AutoTargetingSetting from '../Component/Dashboard/Super-AdminDashboard/Settings/DefaultAutoTargeting/DefaultAutoTargeting';
// import GroupTargetingSetting from '../Component/Dashboard/Super-AdminDashboard/Settings/AutoTargetingGroup/GroupTargetingSetting';
// import KeywordTargetingSetting from '../Component/Dashboard/Super-AdminDashboard/Settings/KeywordTargeting/KeywordTargetingSetting';

// import Challenges from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/challenges";
// import CreateChallenges from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/create";
// import UpdateChallenges from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/update";
// import ViewChallenges from "../Component/Dashboard/Super-AdminDashboard/Challenges/CreateChallenges/challengeview";
// import ChallengesEntries from '../Component/Dashboard/Super-AdminDashboard/Challenges/ChallengesEntries/challengesEntries';

//------------------------------PackagingMaterial--------------------------------//
import Material from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterial/Material";
import ViewMaterial from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterial/viewMaterial";
import UpdateMaterial from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterial/UpdateMaterial";
import Order from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterial/Order/Order";
import OrderView from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterial/Order/OrderView";

//------------------------------PackagingMaterialSettings--------------------------------//
import MaterialName from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/MaterialName";
import MaterialSize from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/MaterialSize";
import Capacity from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/Capacity";
import Stamp from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/Stamp";
import Stickers from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/Stickers";
import Vouchers from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/Vouchers";
import Card from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterialSettings/Card";

//-----------------------------Admin--------------------------//
import Admin from "../Component/Dashboard/Super-AdminDashboard/Admin/Admin";
import AdminProfile from "../Component/Dashboard/Super-AdminDashboard/Admin/Profile/UserProf";
//-----------------------------Artist--------------------------//
import AdminViewProfile from "../Component/Dashboard/Super-AdminDashboard/Admin/ViewProfile/UserProf";
import ArtistManagement from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistManageTable";
import BlogRequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogRequest/BlogRequestTable";
import BlogRequestView from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogRequest/Artistviewblog";
import BlogRequestUpdate from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogRequest/UpdateBlogList";
import BlogRequestDetails from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogRequest/Artistblogdetails";
import ApprovedBlogs from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogs/BlogList";
import ApprovedBlogsDetails from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogs/ArtistBlogDetails";
import ApprovedBlogsUpdate from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistBlogs/UpdateBlogList";
import SoldProduct from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/SoldProduct/SoldProduct";
import Artistproductrequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ProductRequest/ProductRequestTable";
import ArtistAllProduct from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Product/AllArtistProduct";
import ProductEditRequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/UserProfile/UserProf";
import EditBlogRequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/UserProfile/BlogRequest/UpdateBlogList";
import ProductViewRequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ViewUserProfile/UserProf";
import ArtistProductRequestView from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ProductRequest/ProductRequestView";
import ArtistSoldProductTable from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/SoldProduct/SoldProduct";
import ArtistSoldProductView from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/SoldProduct/SoldProductDetails";
import ArtistTransaction from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Transaction/ArtistTransaction";
import ArtistPackagingMaterial from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/PackagingMaterial/ProductPurchasedArtist";
import ArtistProductsDetails from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Product/ArtistProductDetails";
import ArtistProductBidding from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Product/BiddingPass";

import BuyerManagement from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/BuyerManageTable";
import BuyerProductPurchase from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductPurchased/ProductPurchased";
import BuyerProductPurchaseView from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductPurchased/ProductPurchasedDetails";
import BuyerProductRequest from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductRequest/ProductRequestTable";
import BuyerSoldProduct from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/SoldProduct/SoldProduct";
import BuyerTransaction from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/Transaction/BuyerTransaction";
import BuyerPackagingMaterial from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/PackagingMaterial/ProductPurchasedBuyer";
import BuyermanageProductView from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/BuyerUserProdileView/UserProf";
import BuyermanageProductEdit from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/UserProfile/UserProf";
import BuyerResellProductView from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductRequest/ProductRequestView";

import OrderMaterial from "../Component/Dashboard/ArtistDashbooard/PackagingMaterial/OrderMaterial";
import CreateOrder from "../Component/Dashboard/ArtistDashbooard/PackagingMaterial/CreateOrder";
import UpdateOrder from "../Component/Dashboard/ArtistDashbooard/PackagingMaterial/UpdateOrder";
import ViewOrder from "../Component/Dashboard/ArtistDashbooard/PackagingMaterial/ViewOrder";
//------Seller tab-----//
import SellerManagement from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerManageTable";
import SellerProducts from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerProducts/SellerProduct";
import SellerProductRequest from "../Component/Dashboard/Super-AdminDashboard/Seller/ProductRequest/ProductRequestTable";
import SellerSoldProducts from "../Component/Dashboard/Super-AdminDashboard/Seller/SoldProduct/SoldProduct";
import SellerTransaction from "../Component/Dashboard/Super-AdminDashboard/Seller/Transaction/SellerTransaction";
import SellerPackaging from "../Component/Dashboard/Super-AdminDashboard/Seller/PackagingMaterial/ProductPurchasedSeller";
import SellerManageProductView from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerUserProdileView/UserProf";
import SellerManageProductEdit from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerUserProfile/UserProf";
import SellerProductBidding from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerProducts/BiddingPass";

//-----------------------------Product--------------------------//
import ProductTableView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/Product";
import CustomOrderView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/CustomOrderAll/Customorder";
import PurchaseTable from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductPurchased/ProductPurchased";
import PurchaseTableView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductPurchased/ProductPurchasedDetails";
import ProductUploads from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductUpload/productUploade";
// import ProductRequestView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";
import ViewCustomRequestsuperadmin from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";

//-----------------------------Bidding--------------------------//
import AllBiddingProduct from "../Component/Dashboard/Super-AdminDashboard/Bidding/AllProduct/BiddingProduct";
import BiddedProduct from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddedproduct/Biddedproduct";
import BiddedProductTransaction from "../Component/Dashboard/Super-AdminDashboard/Bidding/Transaction/BiddedproductTransaction";
import BiddingTable from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddingpass/BiddingTable";
import BiddingTablePass from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddingpass/Biddingpass";
import PassOrderTable from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddingpass/PassOrderTable";
import CreatePassType from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddingpass/CreatePassType";

//-----------------------------Settings--------------------------//
import EmailSettings from "../Component/Dashboard/Super-AdminDashboard/Settings/EmailSetting/EmailSetting";
import BlogCategory from "../Component/Dashboard/Super-AdminDashboard/Settings/Blogcategory/Category";
import ProductCategory from "../Component/Dashboard/Super-AdminDashboard/Settings/Productcategory/Category";
import CertificationSetting from "../Component/Dashboard/Super-AdminDashboard/Settings/Certification/Certifiaction";

//----------------------------------------Artist Components----------------------------------//
import ArtistDashboard from "../Component/Dashboard/ArtistDashbooard/Dashboard/MainContent";
import ArtistAdvertise from "../Component/Dashboard/ArtistDashbooard/Advertise/Advertise";
import ArtistBiddingPass from "../Component/Dashboard/ArtistDashbooard/ProductDetails/BiddingPass";
import ArtistBidingAllProducts from "../Component/Dashboard/ArtistDashbooard/Bidding/AllProduct/BiddingProduct";
import ArtistBiddedProducts from "../Component/Dashboard/ArtistDashbooard/Bidding/Biddedproduct/Biddedproduct";
import ArtistBiddingTable from "../Component/Dashboard/ArtistDashbooard/Bidding/Biddingpass/BiddingTable";
import ArtistBiddingTablePass from "../Component/Dashboard/ArtistDashbooard/Bidding/Biddingpass/Biddingpass";
import ArtistBiddingTablePassUpgrade from "../Component/Dashboard/ArtistDashbooard/Bidding/Biddingpass/UpgradePass";
import ArtistCertification from "../Component/Dashboard/ArtistDashbooard/Certification/Certification";
import CreateArtitstCertifications from "../Component/Dashboard/ArtistDashbooard/Certification/create";
import ArtistExhibition from "../Component/Dashboard/ArtistDashbooard/Exhibition/exhibition";
import ArtistCreateExhibition from "../Component/Dashboard/ArtistDashbooard/Exhibition/create";
import ArtistUpdateExhibition from "../Component/Dashboard/ArtistDashbooard/Exhibition/editExhibition";
import ArtistViewExhibition from "../Component/Dashboard/ArtistDashbooard/Exhibition/exhibitionView";
import ArtistSponser from "../Component/Dashboard/ArtistDashbooard/Advertise/Sponser";
//-----------------------------Blogs--------------------------//
import BlogList from "../Component/Dashboard/ArtistDashbooard/Blog/BlogList";
import BlogPost from "../Component/Dashboard/ArtistDashbooard/Blog/BlogPost";
import UpdateBlog from "../Component/Dashboard/ArtistDashbooard/Blog/UpdateBlogList";
import BlogDetails from "../Component/Dashboard/ArtistDashbooard/Blog/ArtistBlogDetails";

//-----------------------------Products Route--------------------------//
import AllProduct from "../Component/Dashboard/ArtistDashbooard/ProductDetails/Product";
import ProductUploade from "../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductUpload/productUploade";
import CustomOrder from "../Component/Dashboard/ArtistDashbooard/ProductDetails/CustomOrder/CustomOrderAll/Customorder";
import ProductView from "../Component/Dashboard/ArtistDashbooard/ProductDetails/Productinfo";
import ViewCustomRequest from "../Component/Dashboard/ArtistDashbooard/ProductDetails/CustomOrder/Artist/ViewRequest";
import Productpurchase from "../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductPurchased/ProductPurchased";
import ProductpurchaseView from "../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductPurchased/ProductPurchasedDetails";

//----------------------------------------Buyer Components-----------------------------------//
import BuyerDashboard from "../Component/Dashboard/BuyerDashboard/Dashboard/MainContent";

//----------------------------------------Seller Components----------------------------------//
import SellerDashboard from "../Component/Dashboard/SellerDashboard/Dashboard/MainContent";
import ViewProductDetails from "../Component/Dashboard/SellerDashboard/ProductsDetails/Product";
import SellerProductUpload from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductUpload/productUploade";
import SellerPurchasedProducts from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductPurchased/ProductPurchased";
import SellerAdvertise from "../Component/Dashboard/SellerDashboard/Advertise/Advertise";
import SellerSponser from "../Component/Dashboard/SellerDashboard/Advertise/Sponser";
import SellerBiddingPass from "../Component/Dashboard/SellerDashboard/ProductsDetails/BiddingPass";
import SellerBidingAllProducts from "../Component/Dashboard/SellerDashboard/Bidding/AllProduct/BiddingProduct";
import SellerBiddedProducts from "../Component/Dashboard/SellerDashboard/Bidding/Biddedproduct/Biddedproduct";
import SellerBidTable from "../Component/Dashboard/SellerDashboard/Bidding/Biddingpass/BiddingTable";
import SellerBidPassTable from "../Component/Dashboard/SellerDashboard/Bidding/Biddingpass/Biddingpass";
import SellerBidPassUpgrade from "../Component/Dashboard/SellerDashboard/Bidding/Biddingpass/UpgradePass";
import SellerCertification from "../Component/Dashboard/SellerDashboard/Certification/Certification";
import CreateSellerCertifications from "../Component/Dashboard/SellerDashboard/Certification/create";

import SellerExhibition from "../Component/Dashboard/SellerDashboard/Exhibition/exhibition";
import SellerCreateExhibition from "../Component/Dashboard/SellerDashboard/Exhibition/create";
import SellerUpdateExhibition from "../Component/Dashboard/SellerDashboard/Exhibition/editExhibition";
import SellerViewExhibition from "../Component/Dashboard/SellerDashboard/Exhibition/exhibitionView";

//-----------------------------Website Pages--------------------------//
import Store from "../Pages/store/store";
import Bid from "../Pages/Bid/bid";
import Artist from "../Pages/Artist/artist";
import Celebrity from "../Pages/Celebrity/celebrity";
//import CelebrityCollections from "../Pages/Celebrity/celebrityCollections";
import TermsPolicy from "../Pages/Terms&Policy/Terms&Policy";
import Commission from "../Pages/CommissionWork/CommissionWork";
import HowToBid from "../Pages/HowToBid/HowToBidWork";
import LicensingPartner from "../Pages/LicensingPartner/LicensingPartner";
import AffiliateProgram from "../Pages/AffiliateProgram/AffiliateProgram";
import AffiliateBP from "../Pages/AffiliateBrandPartner/AffiliateBP";
import ContactUs from "../Pages/ContactUs/ContactUs";
import HowToBuy from "../Pages/HowToBuy/HowToBuy";
import HowToSell from "../Pages/HowToSell/HowToSell";
import HowToResell from "../Pages/HowToResell/HowToResell";
import ArtGallery from "../Pages/ArtGallery/ArtGallery";
import Career from "../Pages/Career/Career";
import WhyArtsays from "../Pages/WhyArtsays/WhyArtsays";
import Challenge from "../Pages/Challenges/Challenges";
import AboutUs from "../Pages/AboutUs/AboutUs";
import CelebrityContent from "../Pages/Celebrity/celebrityContent/celebrityContent";
//import TermsPolicy from "../Pages/Terms&Policy/Terms&Policy";
//import Commission from "../Pages/CommissionWork/CommissionWork";
//import LicensingPartner from "../Pages/LicensingPartner/LicensingPartner"
//import AffiliateProgram from "../Pages/AffiliateProgram/AffiliateProgram"
//import ContactUs from "../Pages/ContactUs/ContactUs"
// import HowToBuy from "../Pages/HowToBuy/HowToBuy"
// import HowToSell from "../Pages/HowToSell/HowToSell"
// import Collections from "../Pages/Collections/Collections"
// import Career from "../Pages/Career/Career"
import JobRoles from "../Pages/Career/JobRoles";
import Blogs from "../Pages/blogs/Blogs";
import BlogCardDetails from "../Pages/blogDetails/BlogCardDetails";
import ChallengesContent from "../Pages/Challenges/ChallengesContent/ChallengesContent";
import JoinChallenges from "../Pages/Challenges/JoinChallenges/JoinChallenges";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import BidDetails from "../Pages/BidDetails/BidDetails";
import Certification from "../Pages/Certification/Certification";
import Insurance from "../Pages/Insurance/Insurance";
import Partner from "../Pages/Partner/Partner";

//-----------------------------Artist Premium Badges--------------------------//

import ArtistPremiumBages from "../Component/Dashboard/ArtistDashbooard/Badges/PremiumBadges";

//-----------------------------Seller Premium Badges--------------------------//

import SellerPremiumBages from "../Component/Dashboard/SellerDashboard/Badges/PremiumBadges";

//-----------------------------Error 404--------------------------//

import Error404Page from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/Error404";
// import { Store } from 'lucide-react';
import OrderMaterialSeller from "../Component/Dashboard/SellerDashboard/PackageMaterial/OrderMaterialSeller";
import CreateMaterialOrder from "../Component/Dashboard/SellerDashboard/PackageMaterial/createMaterialOrder";
import UpdateMaterialOrder from "../Component/Dashboard/SellerDashboard/PackageMaterial/UpdateMaterialOrder";
import ViewMaterialOrder from "../Component/Dashboard/SellerDashboard/PackageMaterial/ViewMaterialOrder";

//----------------------------------------Social Media----------------------------------//
import Homee from "../Pages/socialMedia/Homee";
import Notification from "../Pages/socialMedia/Notification";
import Search from "../Pages/socialMedia/Search";
import Explore from "../Pages/socialMedia/Explore";
import CreatePost from "../Pages/socialMedia/CreatePost";
import UploadPost from "../Pages/socialMedia/UploadPost";
import SocialProfile from "../Pages/socialMedia/SocialProfile";
import PromoteProfile from "../Pages/socialMedia/PromoteProfile";
import PromotePost from "../Pages/socialMedia/PromotePost";
import CreateLive from "../Pages/socialMedia/CreateLive";
import MyLive from "../Pages/socialMedia/MyLive";
import Live from "../Pages/socialMedia/Live";
import Test from "../Pages/socialMedia/Test";
import Settings from "../Pages/socialMedia/Settings";
import SuggestedProfile from "../Pages/socialMedia/SuggestedProfile";
import Policies from "../Component/Dashboard/Super-AdminDashboard/Community CMS/Policies";
import VerificationBadge from "../Component/Dashboard/Super-AdminDashboard/Community CMS/verificationBadge/VerificationBadge";
import CreatePolicies from "../Component/Dashboard/Super-AdminDashboard/Community CMS/policy/CreatePolicies";
import EditPolicy from "../Component/Dashboard/Super-AdminDashboard/Community CMS/policy/EditPolicy";
import ViewPolicy from "../Component/Dashboard/Super-AdminDashboard/Community CMS/policy/ViewPolicy";
import EditVerificationBadge from "../Component/Dashboard/Super-AdminDashboard/Community CMS/verificationBadge/EditVerificationBadge";
import CreateVerificationBadge from "../Component/Dashboard/Super-AdminDashboard/Community CMS/verificationBadge/CreateBadge";
import EdprowiseInvoice from "../Pages/Invoice/EdprowiseInvoice";
import Invoice from "../Pages/Invoice/Invoice";
import CreateMaterial from "../Component/Dashboard/Super-AdminDashboard/PackagingMaterial/CreateMaterial";

import Reports from "../Component/Dashboard/Super-AdminDashboard/Community CMS/reports/Reports";
import ViewReports from "../Component/Dashboard/Super-AdminDashboard/Community CMS/reports/ViewReports";
import PreviewReport from "../Component/Dashboard/Super-AdminDashboard/Community CMS/reports/PreviewReport";
import Sponsors from "../Component/Dashboard/Super-AdminDashboard/Community CMS/Sponsors/Sponsors";
import ViewSponsors from "../Component/Dashboard/Super-AdminDashboard/Community CMS/Sponsors/ViewSponsors";
import PurchaseBadge from "../Component/Dashboard/Super-AdminDashboard/Community CMS/PurchaseBadge/PurchaseBadge";
import ShowPurchasedBadge from "../Component/Dashboard/Super-AdminDashboard/Community CMS/PurchaseBadge/ShowPurchasedBadge";
import ProductViewing from "../Component/SocialMedia/Profile/ProductView";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userType, status: userStatus } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    (userType === "Artist" || userType === "Seller") &&
    (userStatus === "Unverified" || userStatus === "Rejected") &&
    location.pathname !== `/${userType.toLowerCase()}/profile`
  ) {
    return <Navigate to={`/${userType.toLowerCase()}/profile`} replace />;
  }

  return children ? children : <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, userType, status: userStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && authPages.includes(location.pathname)) {
      if (
        (userType === "Artist" || userType === "Seller") &&
        (userStatus === "Unverified" || userStatus === "Rejected") &&
        location.pathname === "/login"
      ) {
        return;
      }
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, userType, userStatus, location.pathname, navigate]);

  const authPages = [
    "/login",
    "/register",
    "/artist-seller-register",
    "/forgotpassword",
  ];

  return children ? children : <Outlet />;
};

const WebsiteWrapper = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 6000); // Preloader duration (6 seconds)
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false); // Skip preloader for other routes
    }
  }, [location.pathname]);

  return showAnimation && location.pathname === "/" ? (
    <PreloaderAnimation />
  ) : (
    <WebsiteLayout>
      <Outlet />
    </WebsiteLayout>
  );
};

//without animation funtion
// const WebsiteWrapper = () => {
//   const location = useLocation();

//   useEffect(() => {
//   }, [location.pathname]);

//   return (
//     <WebsiteLayout>
//       <Outlet />
//     </WebsiteLayout>
//   );
// };

const AppRoutes = () => {
  const { isAuthenticated, userType, status: userStatus } = useAuth();

  return (
    <Routes>
      {/* -------------------------------------------Public Routes------------------------------------------------- */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bidding" element={<BiddingPass />} />
        <Route
          path="/artist-seller-register"
          element={<ArtistSellerRegister />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-services" element={<TermsofServices />} />
      </Route>

      {/*-------------------------------------------Super Admin Routes--------------------------------------------- */}
      <Route
        path="/super-admin"
        element={
          <PrivateRoute allowedRoles={["Super-Admin"]}>
            <SuperAdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="blog" element={<SuperAdminBlog />} />
        <Route path="blog/create-blog" element={<SuperAdminBlogPost />} />
        <Route path="blog/view-blog" element={<SuperAdminViewBlog />} />
        <Route path="blog/update-blog" element={<SuperAdminUpdateBlog />} />
        <Route
          path="product/product-info"
          element={<SuperAdminProductInfo />}
        />
        {/* Admin Management */}
        <Route path="admin" element={<Admin />} />
        <Route path="admin/editprofile" element={<AdminProfile />} />
        <Route path="admin/viewprofile" element={<AdminViewProfile />} />
        {/* Artist Management */}
        <Route path="artist/management" element={<ArtistManagement />} />
        <Route path="artist/artist-edit" element={<ProductEditRequest />} />
        <Route path="artist/blogrequest" element={<BlogRequest />} />
        <Route
          path="artist/blogrequest/view-Blog"
          element={<BlogRequestView />}
        />
        <Route
          path="artist/blogrequest/update-blog"
          element={<BlogRequestUpdate />}
        />
        <Route
          path="artist/blogrequest/blog-details/:slug"
          element={<BlogRequestDetails />}
        />
        <Route path="artist/blogs" element={<ApprovedBlogs />} />
        <Route
          path="artist/blogs/blog-details/:slug"
          element={<ApprovedBlogsDetails />}
        />
        <Route
          path="artist/blogs/blog-update/:slug"
          element={<ApprovedBlogsUpdate />}
        />
        <Route
          path="artist/artistproductrequest"
          element={<Artistproductrequest />}
        />
        <Route path="artist/allartistproduct" element={<ArtistAllProduct />} />
        <Route path="artist/sold-product" element={<SoldProduct />} />
        <Route
          path="artist/management/artistprofileview/"
          element={<ProductViewRequest />}
        />
        <Route
          path="artist/artistprofileview/:userId"
          element={<ProductViewRequest />}
        />
        <Route
          path="artist/soldproducts"
          element={<ArtistSoldProductTable />}
        />
        <Route
          path="artist/soldproducts/view"
          element={<ArtistSoldProductView />}
        />
        <Route
          path="artist/artisttransaction"
          element={<ArtistTransaction />}
        />
        <Route
          path="artist/artistpackagingmaterial"
          element={<ArtistPackagingMaterial />}
        />
        <Route
          path="artist/management/productrequest/:userId"
          element={<ArtistProductRequestView />}
        />
        <Route
          path="artist/management/artisteditreuqest/update-blog"
          element={<EditBlogRequest />}
        />
        <Route
          path="artist/management/artisteditreuqest/"
          element={<ProductEditRequest />}
        />
        <Route
          path="artist/allartistproduct/productdetails/:userId"
          element={<ArtistProductsDetails />}
        />
        <Route
          path="artist/allartistproduct/productdetails/:userId"
          element={<ArtistProductsDetails />}
        />
        <Route path="artist/bidding-pass" element={<ArtistProductBidding />} />
        {/* Buyer Management */}
        <Route path="buyer/management" element={<BuyerManagement />} />
        <Route
          path="buyer/productpurchased"
          element={<BuyerProductPurchase />}
        />
        <Route
          path="buyer/productpurchased/view"
          element={<BuyerProductPurchaseView />}
        />
        <Route path="buyer/resellproduct" element={<BuyerProductRequest />} />
        <Route path="buyer/soldproduct" element={<BuyerSoldProduct />} />
        <Route path="buyer/transaction" element={<BuyerTransaction />} />
        <Route
          path="buyer/packagingmaterial"
          element={<BuyerPackagingMaterial />}
        />
        <Route
          path="buyer/management/productview/"
          element={<BuyermanageProductView />}
        />
        <Route
          path="buyer/management/productedit/"
          element={<BuyermanageProductEdit />}
        />
        <Route
          path="buyer/resellproduct/productview/:userId"
          element={<BuyerResellProductView />}
        />
        {/* Seller Management */}
        <Route path="seller/management" element={<SellerManagement />} />
        <Route path="seller/product" element={<SellerProducts />} />
        <Route
          path="seller/productrequest"
          element={<SellerProductRequest />}
        />
        <Route path="seller/soldproduct" element={<SellerSoldProducts />} />
        <Route path="seller/transaction" element={<SellerTransaction />} />
        <Route path="seller/packagingmaterial" element={<SellerPackaging />} />
        <Route
          path="seller/management/productdetails-view"
          element={<SellerManageProductView />}
        />
        <Route
          path="seller/management/productdetails-edit"
          element={<SellerManageProductEdit />}
        />
        <Route path="seller/bidding-pass" element={<SellerProductBidding />} />
        {/* Product Management */}
        <Route path="product-table" element={<ProductTableView />} />
        <Route
          path="product-table/bidding-pass"
          element={<SuperAdminBiddingPass />}
        />
        <Route path="customordertable" element={<CustomOrderView />} />
        <Route
          path="customordertable/view-request"
          element={<ViewCustomRequestsuperadmin />}
        />
        <Route path="purchasetable" element={<PurchaseTable />} />
        <Route path="purchasetable/view" element={<PurchaseTableView />} />
        <Route path="product-upload" element={<ProductUploads />} />
        {/* Bidding Management */}
        <Route path="bidding/allproduct" element={<AllBiddingProduct />} />
        <Route path="bidding/bidded-product" element={<BiddedProduct />} />
        <Route
          path="bidding/transaction"
          element={<BiddedProductTransaction />}
        />
        <Route path="bidding/pass-table" element={<BiddingTable />} />
        <Route path="bidding/pass-table/create" element={<CreatePassType />} />
        <Route
          path="bidding/pass-table/bidding-pass"
          element={<BiddingTablePass />}
        />
        <Route path="bidding/pass-order-table" element={<PassOrderTable />} />
        <Route
          path="bidding/pass-table/edit/:id"
          element={<CreatePassType />}
        />
        {/* Packaging Material */}
        <Route path="packaging-material/material" element={<Material />} />
        <Route
          path="packaging-material/create-packaging-material"
          element={<CreateMaterial />}
        />
        <Route
          path="packaging-material/material/view/:id"
          element={<ViewMaterial />}
        />
        <Route
          path="packaging-material/material/edit/:id"
          element={<UpdateMaterial />}
        />
        <Route path="packaging-material/order" element={<Order />} />
        <Route
          path="packaging-material/order/view/:id"
          element={<OrderView />}
        />
        {/* Community CMS */}
        <Route path="community-cms/policies" element={<Policies />} />
        <Route
          path="community-cms/policies/create"
          element={<CreatePolicies />}
        />
        <Route path="community-cms/policies/edit" element={<EditPolicy />} />
        <Route path="community-cms/policies/view" element={<ViewPolicy />} />
        <Route
          path="community-cms/verification-badge"
          element={<VerificationBadge />}
        />
        <Route
          path="community-cms/verification-badge/edit"
          element={<EditVerificationBadge />}
        />
        <Route
          path="community-cms/verification-badge/create"
          element={<CreateVerificationBadge />}
        />
        <Route path="community-cms/reports" element={<Reports />} />
        <Route path="community-cms/reports/view" element={<ViewReports />} />
        <Route
          path="community-cms/reports/view/preview"
          element={<PreviewReport />}
        />
        <Route path="community-cms/sponsors" element={<Sponsors />} />
        <Route path="community-cms/sponsors/view" element={<ViewSponsors />} />
        <Route
          path="community-cms/purchase-badge"
          element={<PurchaseBadge />}
        />
        <Route
          path="community-cms/purchase-badge/show"
          element={<ShowPurchasedBadge />}
        />
        {/*PackagingMaterialSettings */}
        <Route
          path="packaging-material-setting/material-name"
          element={<MaterialName />}
        />
        <Route
          path="packaging-material-setting/material-size"
          element={<MaterialSize />}
        />
        <Route
          path="packaging-material-setting/capacity"
          element={<Capacity />}
        />
        <Route path="packaging-material-setting/stamp" element={<Stamp />} />
        <Route
          path="packaging-material-setting/stickers"
          element={<Stickers />}
        />
        <Route
          path="packaging-material-setting/vouchers"
          element={<Vouchers />}
        />
        <Route path="packaging-material-setting/card" element={<Card />} />
        {/* Settings */}
        <Route path="settings/email-setting" element={<EmailSettings />} />
        <Route path="settings/blog-category" element={<BlogCategory />} />
        <Route path="settings/product-category" element={<ProductCategory />} />
        <Route path="settings/marketing" element={<SuperAdminMarketing />} />
        <Route
          path="settings/certification"
          element={<CertificationSetting />}
        />
        <Route
          path="settings/auto-targeting"
          element={<AutoTargetingSetting />}
        />
        <Route
          path="settings/group-targeting"
          element={<GroupTargetingSetting />}
        />
        <Route
          path="settings/keyword-targeting"
          element={<KeywordTargetingSetting />}
        />
        <Route path="settings/user-role" element={<UserRole />} />
        <Route path="settings/create-user-role" element={<CreateRole />} />
        {/* Advertise Routes */}
        <Route path="advertise" element={<SuperAdminArtistAdvertise />} />
        <Route path="advertise/sponser" element={<SuperAdminArtistSponsor />} />
        {/* Certification Routes */}
        <Route path="certification" element={<SuperAdminCertification />} />
        <Route
          path="certification/create-certification"
          element={<CreateCertifications />}
        />
        {/* FAQ Routes */}
        <Route path="faq" element={<FAQ />} />
        {/* Career */}
        <Route path="career" element={<Carrer />} />
        <Route path="career/creer-job-post" element={<CreateCarrer />} />
        <Route path="career/update-job-post" element={<UpdateCareer />} />
        <Route path="career/view-job-post" element={<ViewCareer />} />
        {/* Career Applications */}
        <Route path="career/applications" element={<CarrerTable />} />
        <Route
          path="career/applications/update-job-post"
          element={<UpdateCareerApp />}
        />
        <Route
          path="career/applications/view-job-post"
          element={<ViewCareerApp />}
        />
        {/* Exhibition */}
        <Route path="exhibition" element={<Exhibition />} />
        <Route
          path="exhibition/create-exhibition"
          element={<CreateExhibition />}
        />
        <Route
          path="exhibition/update-exhibition"
          element={<UpdateExhibition />}
        />
        <Route path="exhibition/view-exhibition" element={<ViewExhibition />} />
        <Route path="exhibition-request" element={<ExhibitionRequest />} />
        <Route
          path="exhibition-request/update-exhibition"
          element={<UpdateExhibitionRequest />}
        />
        <Route
          path="exhibition-request/view-exhibition"
          element={<ViewExhibitionRequest />}
        />
        {/* Challenges */}
        <Route path="challenges" element={<Challenges />} />
        <Route
          path="challenges/create-Challenges"
          element={<CreateChallenges />}
        />
        <Route path="challenges-entries" element={<ChallengesEntries />} />
        {/* Contact Us*/}
        <Route path="contactus" element={<ContactUsEntries />} />{" "}
        {/* Table/List */}
        <Route
          path="contactus/create"
          element={<CreateContactUsEntry />}
        />{" "}
        {/* Create new entry */}
        <Route
          path="contactus/update"
          element={<UpdateContactUsEntry />}
        />{" "}
        {/* Update entry */}
        {/* Artsays Gallery Routes */}
        <Route path="art-gallery" element={<Gallery />} />
        <Route path="art-gallery/create" element={<CreateGallery />} />
        <Route path="art-gallery/update/:id" element={<UpdateGallery />} />
        {/* Artsays Gallery CMS Routes */}
        <Route path="CMS-art-gallery" element={<ArtsaysGalleryTable />} />
        <Route
          path="CMS-art-gallery/create"
          element={<ArtsaysGalleryCreate />}
        />
        <Route
          path="CMS-art-gallery/edit/:id"
          element={<ArtsaysGalleryEdit />}
        />
        {/* Enquiries */}
        <Route path="enquiry" element={<EnquiryTable />} />
        <Route path="enquiry/view" element={<ViewEnquiry />} />
        {/* Policy Routes */}
        <Route path="policy" element={<PolicyTable />} />
        <Route path="policy/create-policy" element={<CreatePolicy />} />
        <Route path="policy/update-policy" element={<UpdatePolicy />} />
        {/* <Route path="policy/view-policy" element={<ViewPolicy />} /> */}
        {/*How_To_Buy*/}
        <Route path="how-to-buy" element={<How_To_Buy />} />
        <Route path="how-to-buy/create" element={<CreateHowToBuy />} />
        <Route path="how-to-buy/update" element={<UpdateHowToBuy />} />
        {/* <Route path="how-to-buy/view" element={<ViewHowToBuy />} />   */}
        {/*How_To_Sell*/}
        <Route path="how-to-sell" element={<How_To_Sell />} />
        <Route path="how-to-sell/create" element={<CreateHowToSell />} />
        <Route path="how-to-sell/update" element={<UpdateHowToSell />} />
        {/* <Route path="how-to-sell/view" element={<ViewHowToSell />} />   */}
        {/*How_To_Resell*/}
        <Route path="how-to-resell" element={<How_To_Resell />} />
        <Route path="how-to-resell/create" element={<CreateHowToResell />} />
        <Route path="how-to-resell/update" element={<UpdateHowToResell />} />
        {/*WhyArtSays */}
        <Route path="why-artsays" element={<WhyArtSays />} />
        <Route path="why-artsays/create" element={<CreateWhyArtSays />} />
        <Route path="why-artsays/update" element={<UpdateWhyArtSays />} />
        {/* Licensing Pages */}
        <Route path="licensing" element={<LicensingTable />} />
        <Route path="licensing/create" element={<CreateLicensing />} />
        <Route path="licensing/update" element={<UpdateLicensing />} />
        {/* Commission Pages */}
        <Route path="commission" element={<CommissionTable />} />
        <Route path="commission/create" element={<CreateCommission />} />
        <Route path="commission/update" element={<UpdateCommission />} />
        {/* How to Bid Pages */}
        <Route path="how-to-bid" element={<HowToBidTable />} />
        <Route path="how-to-bid/create" element={<CreateHowToBid />} />
        <Route path="how-to-bid/update" element={<UpdateHowToBid />} />
        {/* Affiliate Pages */}
        <Route path="affiliate" element={<AffiliateTable />} />
        <Route path="affiliate/create" element={<CreateAffiliate />} />
        <Route path="affiliate/update" element={<UpdateAffiliate />} />
        {/* Affiliate Pages */}
        <Route path="affiliate-bp" element={<AffiliateBPTable />} />
        <Route path="affiliate-bp/create" element={<CreateAffiliateBP />} />
        <Route path="affiliate-bp/update" element={<UpdateAffiliateBP />} />
        {/* Challenges */}
        <Route path="challenges" element={<ChallengesTable />} />
        <Route
          path="challenges/create-challenge"
          element={<CreateChallenge />}
        />
        <Route path="challenges/view-challenge" element={<ViewChallenge />} />
        <Route
          path="challenges/update-challenge"
          element={<UpdateChallenge />}
        />
        <Route path="challenges-entries" element={<ChallengesEntries />} />
        <Route
          path="challenges/view-application"
          element={<ViewChallengeApplication />}
        />
        <Route
          path="challenges/update-application"
          element={<UpdateChallengeApplication />}
        />
        {/* Celebraties */}
        <Route path="celebrities" element={<Celebrities />} />
        <Route path="celebrities/create" element={<CreateCelebrities />} />
        <Route path="celebrities/view-celebrity" element={<ViewCelebrity />} />
        <Route
          path="celebrities/update-celebrity"
          element={<UpdateCelebrity />}
        />
        {/* Certification Website CMS */}
        <Route path="certificate" element={<CertificateTable />} />
        <Route path="certificate/create" element={<CreateCertificate />} />
        <Route path="certificate/edit" element={<EditCertificate />} />

        {/* Partner Page Website CMS */}
        <Route path="partner" element={<PartnerTable />} />
        <Route path="partner/create" element={<CreatePartner />} />
        <Route path="partner/edit" element={<EditPartner />} />

        {/* Insurance Website CMS */}
        <Route path="insurance" element={<InsuranceTable />} />
        <Route path="insurance/create" element={<CreateInsurance />} />
        <Route path="insurance/edit" element={<EditInsurance />} />

        {/* Homepage Admin Routes*/}
        <Route path="homepage" element={<Homepage />} />
        <Route path="homepage/create" element={<CreateHomepage />} />
        {/* Hero Section */}
        <Route
          path="/super-admin/homepage/hero/create"
          element={<CreateHero />}
        />
        {/* Browse Categories */}
        <Route
          path="/super-admin/homepage/browse-categories/create"
          element={<CreateCategories />}
        />
        {/* Why Buy From Artsays */}
        <Route
          path="/super-admin/homepage/why-buy-artsays/create"
          element={<CreateWhyBuyArtsays />}
        />
        {/* Bidding Arena */}
        <Route
          path="/super-admin/homepage/bidding-arena/create"
          element={<CreateBiddingArena />}
        />
        {/* How To Buy */}
        <Route
          path="/super-admin/homepage/how-to-buy/create"
          element={<CreateHowToBuyHomepage />}
        />
        {/* Discover Artist */}
        <Route
          path="/super-admin/homepage/discover-artist/create"
          element={<CreateDiscoverArtist />}
        />
        {/* Why Artsays is Different */}
        <Route
          path="/super-admin/homepage/why-artsays-different/create"
          element={<CreateWhyArtsaysDifferent />}
        />
        {/* Challenges */}
        <Route
          path="/super-admin/homepage/challenges/create"
          element={<CreateChallengesHomepage />}
        />
        {/* Art Icon */}
        <Route
          path="/super-admin/homepage/art-icon/create"
          element={<CreateArtIcon />}
        />
        {/* How to Sell */}
        <Route
          path="/super-admin/homepage/how-to-sell/create"
          element={<CreateHowToSellHomepage />}
        />
        {/* About us Admin Routes*/}
        {/* About Us */}
        <Route path="about-us" element={<Aboutus />} />
        <Route path="about-us/create" element={<CreateAboutUs />} />
        <Route path="about-us/edit" element={<UpdateAboutUs />} />
        {/* Who We Are */}
        <Route path="about-us/who-we-are/create" element={<CreateWhoWeAre />} />
        <Route path="about-us/who-we-are/edit" element={<UpdateWhoWeAre />} />
        {/* What We Do */}
        <Route path="about-us/what-we-do/create" element={<CreateWhatWeDo />} />
        <Route path="about-us/what-we-do/edit" element={<UpdateWhatWeDo />} />
        {/* Mission & Vision */}
        <Route
          path="about-us/mission-vision/create"
          element={<CreateMissionVision />}
        />
        <Route
          path="about-us/mission-vision/edit"
          element={<UpdateMissionVision />}
        />
        {/* Our Values */}
        <Route
          path="about-us/our-values/create"
          element={<CreateOurValues />}
        />
        <Route path="about-us/our-values/edit" element={<UpdateOurValues />} />
        {/* Delivery Process */}
        <Route
          path="about-us/delivery-process/create"
          element={<CreateDeliveryProcess />}
        />
        <Route
          path="about-us/delivery-process/edit"
          element={<UpdateDeliveryProcess />}
        />
        {/* Meet The Team */}
        <Route path="about-us/meet-team/create" element={<CreateMeetTeam />} />
        <Route path="about-us/meet-team/edit" element={<UpdateMeetTeam />} />
        {/* Testimonials */}
        <Route
          path="about-us/testimonials/create"
          element={<CreateTestimonials />}
        />
        <Route
          path="about-us/testimonials/edit"
          element={<UpdateTestimonials />}
        />
        {/*-------------------------------------------- wallet Routes under super-ADMIN-------------------------------------------------- */}
        {/* Wallet Routes */}
        <Route path="wallet" element={<WalletDashboard />} />
        <Route path="wallet-management" element={<AdminWalletManagement />} />
      </Route>

      {/*-------------------------------------------- Artist Routes-------------------------------------------------- */}
      <Route
        path="/artist"
        element={
          <PrivateRoute allowedRoles={["Artist"]}>
            <ArtistLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<ArtistDashboard />} />
        <Route path="dashboard" element={<ArtistDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        {/* Blogs */}
        <Route path="bloglist" element={<BlogList />} />
        <Route path="bloglist/create-blog" element={<BlogPost />} />
        <Route path="bloglist/update-blog" element={<UpdateBlog />} />
        <Route path="bloglist/blog-details/:slug" element={<BlogDetails />} />
        {/* Product Routes */}
        <Route path="product" element={<AllProduct />} />
        <Route path="product/bidding-pass" element={<ArtistBiddingPass />} />
        <Route path="productUpload" element={<ProductUploade />} />
        <Route path="custom-order" element={<CustomOrder />} />
        <Route path="product/view-product" element={<ProductView />} />
        <Route
          path="custom-order/view-request"
          element={<ViewCustomRequest />}
        />
        <Route path="purchase" element={<Productpurchase />} />
        <Route path="purchase/view" element={<ProductpurchaseView />} />
        <Route path="product-purchase" element={<Productpurchase />} />

        {/* Advertise Routes */}
        <Route path="advertise" element={<ArtistAdvertise />} />
        <Route path="advertise/sponser" element={<ArtistSponser />} />

        {/* Bidding Routes */}
        <Route
          path="bidding-products-table"
          element={<ArtistBidingAllProducts />}
        />
        <Route
          path="bidded-products-table"
          element={<ArtistBiddedProducts />}
        />
        <Route path="bidding-pass-table" element={<ArtistBiddingTable />} />
        <Route
          path="bidding-pass-table/bidding-pass"
          element={<ArtistBiddingTablePass />}
        />
        <Route
          path="bidding-pass-table/upgrade"
          element={<ArtistBiddingTablePassUpgrade />}
        />

        {/* Certification Routes */}
        <Route path="certification" element={<ArtistCertification />} />
        <Route
          path="certification/create-certification"
          element={<CreateArtitstCertifications />}
        />

        {/* Exhibition */}
        <Route path="exhibition" element={<ArtistExhibition />} />
        <Route
          path="exhibition/create-exhibition"
          element={<ArtistCreateExhibition />}
        />
        <Route
          path="exhibition/update-exhibition"
          element={<ArtistUpdateExhibition />}
        />
        <Route
          path="exhibition/view-exhibition"
          element={<ArtistViewExhibition />}
        />

        {/* Premium Badges */}
        <Route path="premium-badges" element={<ArtistPremiumBages />} />

        <Route path="product-purchase" element={<Productpurchase />} />
        {/* Packaging Material */}
        <Route path="packaging-material" element={<OrderMaterial />} />
        <Route path="packaging-material/create" element={<CreateOrder />} />
        <Route path="packaging-material/edit/:id" element={<UpdateOrder />} />
        <Route path="packaging-material/view/:id" element={<ViewOrder />} />

        {/* Wallet */}
        <Route path="wallet" element={<ArtistSellerWallet />} />
      </Route>

      {/* --------------------------------------------Buyer Routes---------------------------------------------------- */}
      <Route
        path="/buyer"
        element={
          <PrivateRoute allowedRoles={["Buyer"]}>
            <BuyerLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<BuyerDashboard />} />
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="profile" element={<UserProfile />} />

        {/* Wallet */}
        {/* <Route path="wallet" element={<BuyerWallet />} /> */}
      </Route>

      {/*-------------------------------------------------- Seller Routes -----------------------------------------------*/}
      <Route
        path="/seller"
        element={
          <PrivateRoute allowedRoles={["Seller"]}>
            <SellerLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        {/* Product Routes */}
        <Route path="product-details" element={<ViewProductDetails />} />
        <Route
          path="product-details/bidding-pass"
          element={<SellerBiddingPass />}
        />
        <Route path="SellerProductUpload" element={<SellerProductUpload />} />
        <Route path="purchased-product" element={<SellerPurchasedProducts />} />

        {/* Advertise Routes */}
        <Route path="advertise" element={<SellerAdvertise />} />
        <Route path="advertise/sponser" element={<SellerSponser />} />

        {/* Bidding Routes */}
        <Route
          path="bidding-products-table"
          element={<SellerBidingAllProducts />}
        />
        <Route
          path="bidded-products-table"
          element={<SellerBiddedProducts />}
        />
        <Route path="bidding-pass-table" element={<SellerBidTable />} />
        <Route
          path="bidding-pass-table/bidding-pass"
          element={<SellerBidPassTable />}
        />
        <Route
          path="bidding-pass-table/upgrade"
          element={<SellerBidPassUpgrade />}
        />
        {/* Certification Routes */}
        <Route path="certification" element={<SellerCertification />} />
        <Route
          path="certification/create-certification"
          element={<CreateSellerCertifications />}
        />

        {/* Exhibition */}
        <Route path="exhibition" element={<SellerExhibition />} />
        <Route
          path="exhibition/create-exhibition"
          element={<SellerCreateExhibition />}
        />
        <Route
          path="exhibition/update-exhibition"
          element={<SellerUpdateExhibition />}
        />
        <Route
          path="exhibition/view-exhibition"
          element={<SellerViewExhibition />}
        />

        <Route path="premium-badges" element={<SellerPremiumBages />} />
        <Route path="SellerProductUpload" element={<SellerProductUpload />} />
        <Route path="purchased-product" element={<SellerPurchasedProducts />} />
        <Route path="packaging-material" element={<OrderMaterialSeller />} />
        <Route
          path="packaging-material/create"
          element={<CreateMaterialOrder />}
        />
        <Route
          path="packaging-material/edit/:id"
          element={<UpdateMaterialOrder />}
        />
        <Route
          path="packaging-material/view/:id"
          element={<ViewMaterialOrder />}
        />

        {/* Wallet */}
        <Route path="wallet" element={<SellerWallet />} />
      </Route>

      {/*-------------------------------------------- Website Routes-------------------------------------------------- */}
      <Route path="/" element={<WebsiteWrapper />}>
        <Route index element={<WebsiteMain />} />
        <Route
          path="/my-account"
          element={
            <PrivateRoute allowedRoles={["Buyer"]}>
              <MyAccountMainLayout />
            </PrivateRoute>
          }
        >
          <Route element={<AccountPage />}>
            <Route index element={<AccountForm />} />
            <Route path="personal-info" element={<AccountForm />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="my-orders/view" element={<MyOrderView />} />
            <Route path="manage-address" element={<ManageAddress />} />
            <Route
              path="bank-payment-details"
              element={<BankPaymentDetails />}
            />
            <Route path="payment-method" element={<PaymentMethod />} />
            <Route path="buyer-wallet" element={<BuyerWallet />} />
            <Route path="password-manager" element={<PasswordManager />} />
            <Route
              path="account-verification"
              element={<AccountVerification />}
            />
            <Route
              path="social-media-promotion"
              element={<SocialMediaPromotion />}
            />
            <Route path="custom-request" element={<CustomRequest />} />
            <Route
              path="notification-preferences"
              element={<NotificationAndPreferences />}
            />
            <Route
              path="security-agreements"
              element={<AccountSecurityAndAgreements />}
            />
            <Route path="logout" element={<Logout />} />
            <Route path="track-your-order" element={<TrackOrder />} />
            <Route path="wishlist" element={<WishListTable />} />
            <Route path="my-cart" element={<MyCartList />} />
            <Route path="check-out" element={<CheckOut />} />
            <Route path="order-completed" element={<OrderCompleted />} />
            <Route path="error404" element={<Error404Page />} />
          </Route>
        </Route>
        {/*-------------------------------------------- Website Routes----------------------------------------- */}
        <Route path="/store" element={<Store />} />
        <Route path="/bid" element={<Bid />} />
        <Route path="/artist-card" element={<Artist />} />
        <Route path="/celebrity" element={<Celebrity />} />
        {/* <Route */}
        {/* path="/celebrity-collections"
           element={<CelebrityCollections />}
         /> */}
        <Route path="/celebrity/:slug" element={<CelebrityContent />} />
        <Route path="/policy" element={<TermsPolicy />} />
        <Route path="/commission" element={<Commission />} />
        <Route path="/how-to-bid" element={<HowToBid />} />
        <Route path="/licensing-partner" element={<LicensingPartner />} />
        <Route path="/affiliate-program" element={<AffiliateProgram />} />
        <Route path="/affiliate-brand-partner" element={<AffiliateBP />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/how-to-buy" element={<HowToBuy />} />
        <Route path="/how-to-sell" element={<HowToSell />} />
        <Route path="/how-to-resell" element={<HowToResell />} />
        <Route path="/art-gallery" element={<ArtGallery />} />
        {/* <Route path="/career" element={<Career />} /> */}
        <Route path="/why-artsays" element={<WhyArtsays />} />
        {/* <Route path="/challenges" element={<Challenge />} /> */}
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/career" element={<Career />} />
        <Route path="/careers/:slug" element={<JobRoles />} />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:blogId" element={<BlogCardDetails />} />

        <Route path="/challenge" element={<ChallengesContent />} />
        <Route path="/challenge/:theme" element={<JoinChallenges />} />

        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/bid-details" element={<BidDetails />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/partner" element={<Partner />} />

        {/* ----------------------------------------------------social media Route ----------------------------------------------- */}

        <Route path="/social-media" element={<Homee />} />
        <Route path="/social-media/notification" element={<Notification />} />
        <Route path="/social-media/search" element={<Search />} />
        <Route path="/social-media/explore" element={<Explore />} />
        <Route path="/social-media/create-post" element={<CreatePost />} />
        <Route path="/social-media/upload-post" element={<UploadPost />} />
        <Route path="/social-media/profile" element={<SocialProfile />} />
        <Route
          path="/social-media/profile/product-view"
          element={<ProductViewing />}
        />
        <Route
          path="/social-media/profile/suggestion"
          element={<SuggestedProfile />}
        />
        <Route
          path="/social-media/profile/promote-profile"
          element={<PromoteProfile />}
        />
        <Route
          path="/social-media/profile/promote-post"
          element={<PromotePost />}
        />
        <Route path="/social-media/create-live" element={<CreateLive />} />
        <Route path="/social-media/:streamKey/:username" element={<MyLive />} />
        <Route path="/social-media/live/:streamKey" element={<Live />} />
        <Route path="/social-media/test" element={<Test />} />
        <Route path="/social-media/setting" element={<Settings />} />

        <Route path="/invoice" element={<EdprowiseInvoice />} />
        <Route path="/invoice1" element={<Invoice />} />
      </Route>

      {/*-------------------------------------------- Root Route - Auto Redirect----------------------------------------- */}
      <Route
        index
        element={
          isAuthenticated ? (
            userType === "Super-Admin" ? (
              <Navigate to="/super-admin/dashboard" replace />
            ) : userType === "Artist" ? (
              <Navigate
                to={
                  userStatus === "Unverified" || userStatus === "Rejected"
                    ? "/artist/profile"
                    : "/artist/dashboard"
                }
                replace
              />
            ) : userType === "Buyer" ? (
              <Navigate to="/buyer/dashboard" replace />
            ) : userType === "Seller" ? (
              <Navigate
                to={
                  userStatus === "Unverified" || userStatus === "Rejected"
                    ? "/seller/profile"
                    : "/seller/dashboard"
                }
                replace
              />
            ) : (
              <WebsiteMain />
            )
          ) : (
            <WebsiteMain />
          )
        }
      />

      {/*----------------------------------------- Error Routes-------------------------------------------------------- */}
      <Route path="/404" element={<PagenotFound404 />} />
      <Route path="/unauthorized" element={<UnauthorizedAccess />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
