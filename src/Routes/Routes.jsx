import React, {  useState,useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useLocation,
  Navigate
} from "react-router-dom";
// import Home from "../Pages/Home/Home";
// import About from "../Pages/About/About";
// import StoreProduct from "../Pages/Store/StoreProduct";
// import Blog from "../Pages/Blog/Blog";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ArtistSellerRegister from "../Pages/Register/ArtistSellerRegister"
// import Contact from "../Pages/Contact/Contact";
// import NotFound from "../Component/NotFound";
// import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
// import Career from "../Pages/Career/Career";
// import CartPage from "../Pages/Cart/CartPage";
// import Wishlist from "../Pages/WishList/Wishlist";
// import Partners from "../Pages/Partners/Partners";
// import HelpPage from "../Pages/HelpCenter/HelpPage";
// import HelpSubPage from "../Pages/HelpCenter/HelpSubPage";
// import TermsofServices from "../Pages/TermsAndCondition/TermsofServices";
// import FAQPage from "../Pages/FAQPage/FAQPage";
// import Header from "../Component/Header/Header";
// import Footer from "../Component/Footer";
// import Biddingpage from "../Pages/Art-Biding/BidingPage";
// import WhyChooseUs from "../Pages/WhyChooseUs/WhyChooseUs";
// import NFTCard from "../Pages/Art-Biding/NFTCard";
// import AllComponent from "../Pages/AllComponent";
// import StoreDetails from "../Component/Product-Details/StoreDetails";
// import ArtistSupport from "../Pages/Artist/ArtistSupport";
// import NewSlider from "../Component/newSlider/NewSlider";
import UserProfile from "../Component/Dashboard/Dashboardcomponents/UserProfile/UserInfo";
import ArtistProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/UserProf"
import ArtistProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/UserProf"
import CreateBlog from "../Component/Dashboard/Dashboardcomponents/Blog/ArtistBlog/BlogPost";
import Dashboard from "../Component/Dashboard/Dashboard";
import AppInbox from "../Component/Dashboard/Dashboardcomponents/Chat/AppInbox";
import AppContact from "../Component/Dashboard/Dashboardcomponents/Chat/AppContact";
import AppChat from "../Component/Dashboard/Dashboardcomponents/Chat/AppChat";
// import BlogDashboard from "../Component/Dashboard/Dashboardcomponents/Blog/BlogDashboard";
// import BlogPost from "../Component/Dashboard/Dashboardcomponents/Blog/ArtistBlog/BlogPost";
import BlogList from "../Component/Dashboard/Dashboardcomponents/Blog/ArtistBlog/BlogList";
import UpdateBlog from "../Component/Dashboard/Dashboardcomponents/Blog/ArtistBlog/UpdateBlogList";
import BlogView from '../Component/Dashboard/Dashboardcomponents/Blog/SuperAdminBlog/ViewBlog';
import BlogDetails from "../Component/Dashboard/Dashboardcomponents/Blog/SuperAdminBlog/BlogDetails";
import ArtistBlogDetails from "../Component/Dashboard/Dashboardcomponents/Blog/ArtistBlog/ArtistBlogDetails";
// import FileDashboard from "../Pages/Dashboard/DashBoardPages/FileDashboard";
// import TradingPage from "../Pages/TradingPage/TradingPage";
// import FileDocument from "../Pages/Dashboard/DashBoardPages/FileDocument";
// import FileMedia from "../Pages/Dashboard/DashBoardPages/FileMedia";
// import FileImages from "../Pages/Dashboard/DashBoardPages/FileImages";
// import ForbiddonError from "../Pages/Dashboard/DashBoardPages/ForbiddonError";
// import NotFoundError from "../Pages/Dashboard/DashBoardPages/NotFoundError";
// import ImageGallery from "../Pages/Dashboard/DashBoardPages/ImageGallery";
// import Invoices from "../Pages/Dashboard/DashBoardPages/Invoices";
// import SearchResult from "../Pages/Dashboard/DashBoardPages/SearchResult";
// import Maintenance from "../Pages/Dashboard/DashBoardPages/Maintenance";
// import Teamboards from "../Pages/Dashboard/DashBoardPages/Teamboards";

// import Trial from "../Pages/Trial";
// import ArtistManagement from "../Pages/ArtistManagement";
import ArtistManageTable from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistManageTable";
import ArtistDetail from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistDetail";

import CustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/CustomOrderAll/Customorder";
import CreateCustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/CustomOrderAll/CreateCustomOrder"
// import BuyerRequest from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerRequest/BuyerRequest";


import UpdateCustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/CustomOrderAll/UpdateCustomOrder"
import ViewCustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/Buyer/ViewCustomOrde"
import ViewBuyerRequest from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/Artist/ViewRequest";
import ViewBuyerRequestToArtist from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";


import BlogRequest from "../Component/Dashboard/Dashboardcomponents/Blog/SuperAdminBlog/BlogRequest";

//Artist
import ArtistBlogRequestTable from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistBlogRequest/BlogRequestTable";
import ArtistBlogView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistBlogRequest/Artistviewblog";
import Artistblogdetails from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistBlogRequest/Artistblogdetails";
import Artistblogs from"../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistBlogs/BlogList"
import UpdateArtistblogs from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistBlogs/UpdateBlogList"
import ArtistBlogs from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ArtistBlogs/ArtistBlogDetails"
import ArtistProductRequest from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ProductRequest/ProductRequestTable"
import ArtistProductRequestView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ProductRequest/ProductRequestView"
import AllArtistProduct from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/Product/AllArtistProduct"
import ArtistEditProduct from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/Product/Editproduct"
import ArtistSoldProduct from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/SoldProduct/SoldProduct"
import ArtistSoldProductDetails from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/SoldProduct/SoldProductDetails"
import ArtistTransaction from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/Transaction/ArtistTransaction"
import ArtistTransactionDetails from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/Transaction/TransactionProductDetails"
import PackagingMaterialProductpurchasedArtist from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/PackagingMaterial/ProductPurchasedArtist"
import PackagingMaterialProductpurchasedArtistDetails from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/PackagingMaterial/Productinfo"
import ArtistApprovedProductdetails from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/Product/ArtistProductDetails"
import ArtistApprovedProductdetailsEdit from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/Product/Editproduct"
import ArtistProductRequestEdit from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ProductRequest/Editproduct"

//Artist Profile
import ArtistProductDetailsProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/Products/ArtistProductDetails";
import ArtistProductDetailsProfileEdit from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/Products/Editproduct";
import ArtistTransactionDetailsProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/Transaction/TransactionDetails";
import ArtistPackagingMaterialDetailsProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/PackagingMaterial/Productinfo";
import ArtistSoldProductDetailsProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/SoldProduct/SoldProductDetails";
import ArtistProductRequestDetailsProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/ProductRequest/ProductRequestView"
import ArtistProductRequestDetailsEditProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/ProductRequest/Editproduct"
import ArtistBlogRequestDetailsProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/BlogRequest/ArtistBlogDetails"
import ArtistBlogRequestDetailsEditProfile from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/UserProfile/BlogRequest/UpdateBlogList"

//Artist Profile View
import ArtistProductDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/Products/ArtistProductDetails";
import ArtistTransactionDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/Transaction/TransactionDetails";
import ArtistPackagingMaterialDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/PackagingMaterial/Productinfo";
import ArtistSoldProductDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/SoldProduct/SoldProductDetails";
import ArtistProductRequestDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/ProductRequest/ProductRequestView"
import ArtistBlogRequestDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/ArtistDetails/ViewUserProfile/BlogRequest/ArtistBlogDetails"

//Buyer
import BuyerProductRequest from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/ProductRequest/ProductRequestTable"
import BuyerProductRequestView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/ProductRequest/ProductRequestView"
import BuyerEditProduct from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/ProductRequest/Editproduct"
import BuyerProductPurchased from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/ProductPurchased/ProductPurchased"
import BuyerProductPurchasedDetails from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/ProductPurchased/ProductPurchasedDetails"
import BuyerSoldProduct from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/SoldProduct/SoldProduct"
import BuyerSoldProductDetails from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/SoldProduct/SoldProductDetails"
import BuyerTransaction from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/Transaction/BuyerTransaction"
import BuyerTransactionDetails from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/Transaction/ResellTransactionProductDetails"
import PackagingMaterialProductpurchasedBuyer from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/PackagingMaterial/ProductPurchasedBuyer"
import PackagingMaterialProductpurchasedBuyerDetails from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/PackagingMaterial/Productinfo"

//Buyer Profile 
import BuyerProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/UserProf"
import BuyerManageTable from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerManageTable"
import BuyerProductPurchasedProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/ProductPurchased/ProductPurchasedDetails"
import BuyerCustomRequestProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/CustomRequest/ViewBuyerRequestToArtist"
import BuyerTransactionProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/Transaction/ResellTransactionProductDetails"
import BuyerPackagingMaterialDetailsProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/PackagingMaterial/Productinfo";
import BuyerResellProductDetailsProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/ResellProductRequest/ProductRequestView";
import BuyerProductDetailsProfileEdit   from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/ResellProductRequest/Editproduct"
import BuyerSoldlProductDetailsProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/Soldproduct/SoldProductDetails";
//Buyer Profile View
import BuyerProfileView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/UserProf"
import BuyerProductPurchasedProfileview from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/ProductPurchased/ProductPurchasedDetails"
import BuyerCustomRequestProfileView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/CustomRequest/ViewBuyerRequestToArtist"
import BuyerTransactionProfileView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/Transaction/ResellTransactionProductDetails"
import BuyerPackagingMaterialDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/PackagingMaterial/Productinfo";
import BuyerResellProductDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/ResellProductRequest/ProductRequestView";
import BuyerSoldlProductDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerUserProdileView/Soldproduct/SoldProductDetails";
//Seller
import SellerManageTable from "../Component/Dashboard/Dashboardcomponents/Seller/SellerManageTable";
import SellerProfile from  "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/UserProf";
import SellerProduct from "../Component/Dashboard/Dashboardcomponents/Seller/SellerProducts/SellerProduct";
import SellerProductDetails from "../Component/Dashboard/Dashboardcomponents/Seller/SellerProducts/SellerProductDetails";
import SellerProductDetailsEdit from "../Component/Dashboard/Dashboardcomponents/Seller/SellerProducts/Editproduct";

import SellerSoldProduct from "../Component/Dashboard/Dashboardcomponents/Seller/SoldProduct/SoldProduct";
import SellerSoldProductDetails from "../Component/Dashboard/Dashboardcomponents/Seller/SoldProduct/SoldProductDetails"
import SellerTransaction from "../Component/Dashboard/Dashboardcomponents/Seller/Transaction/SellerTransaction"
import SellerTransactionDetails from "../Component/Dashboard/Dashboardcomponents/Seller/Transaction/TransactionProductDetails"
import PackagingMaterialProductpurchasedSeller from "../Component/Dashboard/Dashboardcomponents/Seller/PackagingMaterial/ProductPurchasedSeller"
import PackagingMaterialProductpurchasedSellerDetails from "../Component/Dashboard/Dashboardcomponents/Seller/PackagingMaterial/Productinfo"
import SellerProductRequest from "../Component/Dashboard/Dashboardcomponents/Seller/ProductRequest/ProductRequestTable"
import SellerProductRequestDetails from "../Component/Dashboard/Dashboardcomponents/Seller/ProductRequest/ProductRequestView"
import SellerProductRequestDetailsEdit from "../Component/Dashboard/Dashboardcomponents/Seller/ProductRequest/Editproduct"

  //Seller Profile
import SellerProductDetailsProfile from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/Products/SellerProductDetails";
import SellerProductDetailsProfileEdit from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/Products/Editproduct";
import SellerTransactionDetailsProfile from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/Transaction/TransactionDetails";
import SellerPackagingMaterialDetailsProfile from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/PackagingMaterial/Productinfo";
import SellerSoldProductDetailsProfile from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/SoldProduct/SoldProductDetails";
  
   //Seller Profile View
import SellerProfileView from  "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProdileView/UserProf";
import SellerProductDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProdileView/Products/SellerProductDetails";
import SellerTransactionDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProdileView/Transaction/TransactionDetails";
import SellerPackagingMaterialDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProdileView/PackagingMaterial/Productinfo";
import SellerSoldProductDetailsProfileView from "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProdileView/SoldProduct/SoldProductDetails";

// import ResellPage from "../Pages/ResellPage/ResellPage";

//Resell Product 
import AllResellProduct from "../Component/Dashboard/Dashboardcomponents/ResellProduct/Allproduct/Product";
import AllResellproductDetails from "../Component/Dashboard/Dashboardcomponents/ResellProduct/Allproduct/ResellProductinfo";
import ResellProductPurchased from "../Component/Dashboard/Dashboardcomponents/ResellProduct/ProductPurchased/ProductPurchased";
import ResellProductPurchasedDetails from "../Component/Dashboard/Dashboardcomponents/ResellProduct/ProductPurchased/ProductPurchasedDetails";
import ResellProductEdit from "../Component/Dashboard/Dashboardcomponents/ResellProduct/Allproduct/Editproduct"
import ResellTransaction from "../Component/Dashboard/Dashboardcomponents/ResellProduct/Transaction/ResellproductTransaction"
import ResellTransactionDetails from "../Component/Dashboard/Dashboardcomponents/ResellProduct/Transaction/ResellTransactionProductDetails"

//Product
import ProductUpload from "../Component/Dashboard/Dashboardcomponents/ProductDetails/ProductUpload/productUploade";
import AllProduct from "../Component/Dashboard/Dashboardcomponents/ProductDetails/Product"
import ProductRequest from "../Component/Dashboard/Dashboardcomponents/ProductDetails/ProductRequest/ProductRequest"
import ProductInfo from "../Component/Dashboard/Dashboardcomponents/ProductDetails/Productinfo";
import ProductRequestDetails from "../Component/Dashboard/Dashboardcomponents/ProductDetails/ProductRequest/ProductRequestView"
import ProductPurchased from "../Component/Dashboard/Dashboardcomponents/ProductDetails/ProductPurchased/ProductPurchased";
import ProductPurchasedDetails from "../Component/Dashboard/Dashboardcomponents/ProductDetails/ProductPurchased/ProductPurchasedDetails";

//Transaction
import AllTransaction from "../Component/Dashboard/Dashboardcomponents/Transaction/AllTransaction"
import AllTransactionDetails from "../Component/Dashboard/Dashboardcomponents/Transaction/TransactionProductDetails"

 // Packaging Material Routes 
 import PackagingMaterialProduct from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/Product/Product"
 import UpdatePackagingMaterialProduct from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/Product/updateproduct"
 import AddPackagingMaterialProduct from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/Product/productadd"
 import PackagingMaterialProductdetails from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/Product/Productinfo"
 import PackagingMaterialProductpurchased from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/ProductPurchased/ProductPurchased"
 import PackagingMaterialProductpurchaseddetails from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/ProductPurchased/Productinfo"
 import PackagingProductTransaction from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/Transaction/PackagingproductBuyerTransaction"
 import PackagingProductTransactiondetails from "../Component/Dashboard/Dashboardcomponents/PackagingMaterial/Transaction/Productinfo"


 // Bidding Routes 
 import AllBidingProduct from "../Component/Dashboard/Dashboardcomponents/Bidding/AllProduct/BiddingProduct"
 import AllBidingProductDetails from "../Component/Dashboard/Dashboardcomponents/Bidding/AllProduct/ProductRequestView"
 import BidingProductStatus from "../Component/Dashboard/Dashboardcomponents/Bidding/ProductStatus/BiddingProductStatus"
 import BidingProductStatusDetails from "../Component/Dashboard/Dashboardcomponents/Bidding/ProductStatus/ProductRequestView"
 import Biddedproduct from "../Component/Dashboard/Dashboardcomponents/Bidding/Biddedproduct/Biddedproduct"
 import BiddedproductDetails from "../Component/Dashboard/Dashboardcomponents/Bidding/Biddedproduct/ProductRequestView"
 import BiddedproductTransaction from "../Component/Dashboard/Dashboardcomponents/Bidding/Transaction/BiddedproductTransaction"
 import BiddedproductTransactionDetails from "../Component/Dashboard/Dashboardcomponents/Bidding/Transaction/BiddedproducTransactionView"

 //Category
 import ProductCategory from "../Component/Dashboard/Dashboardcomponents/Category/Productcategory/Category";
 import BlogCategory from "../Component/Dashboard/Dashboardcomponents/Category/Blogcategory/Category";

 //Admin
 import Admin from "../Component/Dashboard/Dashboardcomponents/Admin/Admin"
 import AdminProfile  from "../Component/Dashboard/Dashboardcomponents/Admin/Profile/UserProf"
 import AdminProfileView  from "../Component/Dashboard/Dashboardcomponents/Admin/ViewProfile/UserProf"

//  const PrivateRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("token");
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };


// const PublicRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("token");
//   return !isAuthenticated ? children : <Navigate to="/" />; 
// };

const AppRoutes = () => {
 
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "defaultuser");

  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("userType") || "defaultuser");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
        <Route
        path="/login"
        element={
          // <PublicRoute>
            <Login />
          // </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          // <PublicRoute>
            <Register />
          // </PublicRoute>
        }
      />

<Route
        path="/artist-seller-register"
        element={
          // <PublicRoute>
            <ArtistSellerRegister/>
          // </PublicRoute>
        }
      />


        
        <Route path="/" element={<Login />} />
          {/* {!isAuthenticated ? (
            <Route path="*" element={<Navigate to="/login" replace />} />
          ) : ( */}
            <>
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/store" element={<StoreProduct />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart-page" element={<CartPage />} />
          <Route path="/career" element={<Career />} />
          <Route path="/partner" element={<Partners />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/help/:title" element={<HelpSubPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsofServices />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/art" element={<NFTCard />} />
          <Route path="/why-artsays?" element={<WhyChooseUs />} />
          <Route path="/product-details" element={<StoreDetails />} />
          <Route path="/Allcom" element={<AllComponent />} /> */}
         
         
          {/* <Route path="/view-blog" element={<BlogView />} /> */}

          {/* <Route path="/Filedashboard" element={<FileDashboard />} />
          <Route path="/Filedocs" element={<FileDocument />} />
          <Route path="/Filemedia" element={<FileMedia />} />
          <Route path="/Fileimages" element={<FileImages />} />
          <Route path="/imagegallery" element={<ImageGallery />} />
          <Route path="/invoice" element={<Invoices />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/teamboard" element={<Teamboards />} /> */}

          {/* <Route path="/create-blog" element={<BlogPost />} /> */}
          {/* <Route path="/Bidding-page" element={<Biddingpage />} />
          <Route path="/Trading-page" element={<TradingPage />} />
          <Route path="/Resell-page" element={<ResellPage />} /> */}
         

          {/* <Route path="/403" element={<ForbiddonError />} />
          <Route path="/404" element={<NotFoundError />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/Support" element={<ArtistSupport />} />
          <Route path="/new-slider" element={<NewSlider />} />
          <Route path="*" element={<NotFound />} /> */}
           {/* <Route index element={<Dashboard />} /> */}
 <Route path={`/${userType}/Dashboard`} element={
  // <PrivateRoute>
  <Dashboard />
  // </PrivateRoute>
} 
  >

  
  {/* Blog Routes */}
  <Route path="BlogRequest/view-blog/BlogDetails/:slug" element={<BlogDetails />} />
  <Route path="bloglist/blogDetails/:slug" element={<ArtistBlogDetails />} />
  <Route path="BlogRequest" element={<BlogRequest />} />
  <Route path="BlogRequest/view-blog/:blogId" element={<BlogView />} />
  <Route path="bloglist" element={<BlogList />} />
  {/* <Route path="Blogdashboard" element={<BlogDashboard />} /> */}
  <Route path="bloglist/create-blog" element={<CreateBlog/>} />
  <Route path="bloglist/update-blog/:id" element={<UpdateBlog/>} />
 

  {/* App Routes */}
  <Route path="Appinbox" element={<AppInbox />} />
  <Route path="Appcontact" element={<AppContact />} />
  <Route path="Appchat" element={<AppChat />} />

  {/* Artist Routes */}



   {/* Artist Blog  */}
  <Route path="artistblogrequest" element={<ArtistBlogRequestTable/>} />
  <Route path="artistblogrequest/viewblog/:blogId" element={<ArtistBlogView/>} />
  <Route path="artistblogrequest/viewblog/blogdetails/:blogId" element={<Artistblogdetails/>} />
  <Route path="artistblogs" element={<Artistblogs />} />
  <Route path="artistblogs/updateblog/:blogId" element={<UpdateArtistblogs />} />
  <Route path="artistblogs/blogs/:blogId" element={<ArtistBlogs />} />
  <Route path="artistproductrequest" element={<ArtistProductRequest/>} />
  <Route path="artistproductrequest/artistproductview/:productId" element={<ArtistProductRequestView />} />
  <Route path="Product-uploade/:id" element={<ProductUpload />} />
  <Route path="allartistproduct" element={<AllArtistProduct/>} />
  <Route path="allartistproduct/productdetails/:productId" element={< ArtistApprovedProductdetails/>} />
  <Route path="allartistproduct/productdetails/editproduct/:productId" element={<  ArtistApprovedProductdetailsEdit />} />
  <Route path="artistproductrequest/artistproductview/editproduct/:productId" element={<  ArtistProductRequestEdit />} />
 

  <Route path="allartistproduct/editproduct/:productId" element={<ArtistEditProduct/>} />
  <Route path="artistsoldproduct" element={<ArtistSoldProduct/>} />
  <Route path="artistsoldproduct/soldproductdetails/:productId" element={<ArtistSoldProductDetails />} />
  <Route path="artisttransaction" element={<ArtistTransaction/>} />
  <Route path="artisttransaction/transcationproductdetails/:productId" element={<ArtistTransactionDetails/>} />
  <Route path="artistpackagingmaterial" element={<PackagingMaterialProductpurchasedArtist/>} />
  <Route path="artistpackagingmaterial/productdetails/:productId" element={<PackagingMaterialProductpurchasedArtistDetails/>} />
     {/* Artist ManageTable */}
     <Route path="artistmanagetable" element={<ArtistManageTable />} />
     <Route path="artists/:id" element={<ArtistDetail />} />

   

     {/* Artist Profile */}
     <Route path="artistmanageTable/artistprofile/:userId" element={<ArtistProfile />} />
     <Route path="artistmanagetable/artistprofile/:userId/artistproductdetails/:productId" element={<ArtistProductDetailsProfile/>} />
     <Route path="artistmanagetable/artistprofile/:userId/artistproductdetails/editprdouct/:productId" element={<ArtistProductDetailsProfileEdit/>} />
     <Route path="artistmanagetable/artistprofile/:userId/transactionproductdetails/:productId" element={<ArtistTransactionDetailsProfile/>}/>
     <Route path="artistmanagetable/artistprofile/:userId/packagingproductdetails/:productId" element={<ArtistPackagingMaterialDetailsProfile/>}/>
     <Route path="artistmanagetable/artistprofile/:userId/soldproductdetails/:productId"element={<ArtistSoldProductDetailsProfile/>}/>
     <Route path="artistmanagetable/artistprofile/:userId/productrequestdetails/:productId"element={< ArtistProductRequestDetailsProfile/>}/>
     <Route path="artistmanagetable/artistprofile/:userId/productrequestdetails/editproduct/:productId"element={< ArtistProductRequestDetailsEditProfile/>}/>
     <Route path="artistmanagetable/artistprofile/:userId/blogrequestdetails/:blogId"element={< ArtistBlogRequestDetailsProfile/>}/>
     <Route path="artistmanagetable/artistprofile/:userId/blogrequestdetails/editblog/:blogId"element={< ArtistBlogRequestDetailsEditProfile/>}/>

    {/* Artist Profile View */}
    <Route path="artistManagetable/artistprofileview/:userId" element={<ArtistProfileView />} />
    <Route path="artistmanagetable/artistprofileview/:userId/artistproductdetails/:productId" element={<ArtistProductDetailsProfileView/>} />
    <Route path="artistmanagetable/artistprofileview/:userId/transactionproductdetails/:productId" element={<ArtistTransactionDetailsProfileView />}/>
    <Route path="artistmanagetable/artistprofileview/:userId/packagingproductdetails/:productId" element={<ArtistPackagingMaterialDetailsProfileView />}/>
    <Route path="artistmanagetable/artistprofileview/:userId/soldproductdetails/:productId"element={<ArtistSoldProductDetailsProfileView />}/>
    <Route path="artistmanagetable/artistprofileview/:userId/productrequestdetails/:productId"element={< ArtistProductRequestDetailsProfileView/>}/>
    <Route path="artistmanagetable/artistprofileview/:userId/blogrequestdetails/:blogId"element={< ArtistBlogRequestDetailsProfileView/>}/>

  {/* Buyer Routes */}

  <Route path="buyermanagetable" element={<BuyerManageTable />} />
  <Route path="buyerproductrequest" element={<BuyerProductRequest />} />
  <Route path="buyerproductrequest/productview/:productId" element={<BuyerProductRequestView />} />
  <Route path="buyerproductrequest/productview/editproduct/:userId" element={<BuyerEditProduct/>} />
  <Route path="buyerproductpurchased" element={<BuyerProductPurchased/>} />
  <Route path="buyerproductpurchased/productpurchaseddetails/:productId" element={<BuyerProductPurchasedDetails />} />
  <Route path="buyersoldproduct" element={<BuyerSoldProduct/>} />
  <Route path="buyersoldproduct/soldproductdetails/:productId" element={<BuyerSoldProductDetails />} />
  <Route path="buyertransaction" element={<BuyerTransaction/>} />
  <Route path="buyertransaction/transcationproductdetails/:productId" element={<BuyerTransactionDetails/>} />
  <Route path="buyerpackagingmaterial" element={< PackagingMaterialProductpurchasedBuyer/>} />
  <Route path="buyerpackagingmaterial/productdetails/:productId" element={<PackagingMaterialProductpurchasedBuyerDetails/>} />

       {/* Buyer Profile */}

       <Route path="buyermanagetable/buyerprofile/:userId" element={<BuyerProfile />} />
       <Route path="buyermanagetable/buyerprofile/:userId/productdetails/:productId" element={<BuyerProductPurchasedProfile/>} />
       <Route path="buyermanagetable/buyerprofile/:userId/viewrequesttoartist/:id" element={<BuyerCustomRequestProfile/>} />
       <Route path="buyermanagetable/buyerprofile/:userId/transactionproductdetails/:productId" element={<BuyerTransactionProfile/>} />
       <Route path="buyermanagetable/buyerprofile/:userId/packagingproductdetails/:productId" element={<BuyerPackagingMaterialDetailsProfile/>} />
       <Route path="buyermanagetable/buyerprofile/:userId/resellproductdetails/:productId" element={<BuyerResellProductDetailsProfile/>} />
       <Route path="buyermanagetable/buyerprofile/:userId/buyerproductdetails/editprdouct/:productId" element={<BuyerProductDetailsProfileEdit/>} />
       <Route path="buyermanagetable/buyerprofile/:userId/soldproductdetails/:productId" element={<BuyerSoldlProductDetailsProfile/>} />

      {/* Buyer Profile View*/}
      <Route path="buyermanagetable/buyerprofileview/:userId" element={<BuyerProfileView/>} />
      <Route path="buyermanagetable/buyerprofileview/:userId/productdetails/:productId" element={<BuyerProductPurchasedProfileview/>} />
      <Route path="buyermanagetable/buyerprofileview/:userId/viewrequesttoartist/:id" element={<BuyerCustomRequestProfileView/>} />
      <Route path="buyermanagetable/buyerprofileview/:userId/transactionproductdetails/:productId" element={<BuyerTransactionProfileView/>} />
      <Route path="buyermanagetable/buyerprofileview/:userId/packagingproductdetails/:productId" element={<BuyerPackagingMaterialDetailsProfileView/>} />
      <Route path="buyermanagetable/buyerprofileview/:userId/resellproductdetails/:productId" element={<BuyerResellProductDetailsProfileView/>} />
      <Route path="buyermanagetable/buyerprofileview/:userId/soldproductdetails/:productId" element={<BuyerSoldlProductDetailsProfileView/>} />

    {/* Seller Routes */}
    <Route path="sellermanagetable" element={<SellerManageTable/>} />
    <Route path="sellermanagetable/sellerprofile/:userId" element={<SellerProfile />} />
    <Route path="sellerproduct" element={<SellerProduct/>} />
    <Route path="sellerproduct/sellerproductdetails/:productId" element={<SellerProductDetails />} />
    <Route path="sellersoldproduct" element={<SellerSoldProduct/>} />
    <Route path="sellersoldproduct/sellersoldproductdetails/:productId" element={<SellerSoldProductDetails/>} />
    <Route path="sellertransaction" element={<SellerTransaction/>} />
    <Route path="sellertransaction/transcationproductdetails/:productId" element={< SellerTransactionDetails/>} />
    <Route path="sellerpackagingmaterial" element={< PackagingMaterialProductpurchasedSeller/>} />
    <Route path="sellerpackagingmaterial/productdetails/:productId" element={<PackagingMaterialProductpurchasedSellerDetails/>} />
    <Route path="sellerrequest" element={<SellerProductRequest/>} />
    <Route path="sellerrequest/prdouctdetails/:productId" element={<SellerProductRequestDetails/>} />
    <Route path="sellerrequest/prdouctdetails/editproduct/:productId" element={<SellerProductRequestDetailsEdit/>} />
    <Route path="sellerproduct/sellerproductdetails/edit/:productId" element={<SellerProductDetailsEdit />} />
     
          {/* Seller Profile */}
      <Route path="sellermanagetable/sellerprofile/:userId/transactionproductdetails/:productId" element={<SellerTransactionDetailsProfile />} />
      <Route path="sellermanagetable/sellerprofile/:userId/packagingproductdetails/:productId" element={<SellerPackagingMaterialDetailsProfile/>} />
      <Route path="sellermanagetable/sellerprofile/:userId/soldproductdetails/:productId" element={<SellerSoldProductDetailsProfile/>} />
      <Route path="sellermanagetable/sellerprofile/:userId/sellerproductdetails/:productId" element={<SellerProductDetailsProfile/>} />
      <Route path="sellermanagetable/sellerprofile/:userId/sellerproductdetails/editprdouct/:productId" element={<SellerProductDetailsProfileEdit/>} />

          {/* Seller Profile View*/}
      <Route path="sellermanagetable/sellerprofileview/:userId" element={<SellerProfileView />} />
      <Route path="sellermanagetable/sellerprofileview/:userId/sellerproductdetails/:productId" element={<SellerProductDetailsProfileView />} />
      <Route path="sellermanagetable/sellerprofileview/:userId/transactionproductdetails/:productId" element={< SellerTransactionDetailsProfileView/>} />
      <Route path="sellermanagetable/sellerprofileview/:userId/packagingproductdetails/:productId" element={<SellerPackagingMaterialDetailsProfileView/>} />
      <Route path="sellermanagetable/sellerprofileview/:userId/soldproductdetails/:productId" element={<SellerSoldProductDetailsProfileView/>} />
    
    
    {/* products Routes */}
    <Route path="allproduct"  element={<AllProduct/>}/>
    <Route path="allproduct/createproduct" element={<ProductUpload />} />
    <Route path="productrequest" element={<ProductRequest />} />
    <Route path="productrequest/productdetails/:productId" element={<ProductRequestDetails/>} />
    <Route path="productpurchased" element={<ProductPurchased  />} />
    <Route path="productpurchased/productview/:productId" element={<ProductPurchasedDetails/>} />
    <Route path="allproduct/productinfo/:productId" element={<ProductInfo />} />
    <Route path="customrequest" element={<CustomOrder />} />
    <Route path="customrequest/createcustomrequest" element={<CreateCustomOrder />} />
    <Route path="customrequest/updatecustomrequest/:id" element={<UpdateCustomOrder />} />
    <Route path="customrequest/viewcustomrequest/:id" element={<ViewCustomOrder />} />
    <Route path="customRequest/viewrequest/:id" element={<ViewBuyerRequest />} />
    {/* <Route path="customrequesttoartist" element={<BuyerRequestToArtist />} /> */}
    <Route path="customrequesttoartist/viewrequesttoartist/:id" element={<ViewBuyerRequestToArtist />} />
  

    {/* Resell products Routes */}
    <Route path="allresellproduct" element={<AllResellProduct />} />
    <Route path="allresellproduct/productdetails/:productId" element={<AllResellproductDetails />} />
    <Route path="allresellproduct/productdetails/editproduct/:userId" element={<ResellProductEdit/>} />
    <Route path="resellproductpurchased" element={<ResellProductPurchased  />} />
    <Route path="resellproductpurchased/productview/:productId" element={<ResellProductPurchasedDetails/>} />
    <Route path="reselltransaction" element={<ResellTransaction/>} />
    <Route path="reselltransaction/transcationproductdetails/:productId" element={<ResellTransactionDetails/>} />
 
    {/* Transaction Routes */}
    <Route path="alltransaction" element={<AllTransaction />} />
    <Route path="alltransaction/transcationproductdetails/:productId" element={<AllTransactionDetails/>} />

    {/* Packaging Material Routes */}
    <Route path="packagingmaterialproduct"element={< PackagingMaterialProduct/>}/>
    <Route path="packagingmaterialproduct/productdetails/updateproduct/:productId"element={<UpdatePackagingMaterialProduct/>}/>
    <Route path="packagingmaterialproduct/addproduct" element={<AddPackagingMaterialProduct/>} />
    <Route path="packagingmaterialproduct/productdetails/:productId" element={<PackagingMaterialProductdetails/>} />
    <Route path="packagingproductpurchased"element={<PackagingMaterialProductpurchased/>}/>
    <Route path="packagingproductpurchased/productdetails/:productId" element={<PackagingMaterialProductpurchaseddetails/>} />
    <Route path="packagingproducttransaction"element={<  PackagingProductTransaction />}/>
    <Route path="packagingproducttransaction/productdetails/:productId" element={<PackagingProductTransactiondetails/>} />
    

    {/* Bidding Routes */}
    <Route path="allbiddingproduct"element={< AllBidingProduct/>}/>
    <Route path="allbiddingproduct/productdetails/:productId" element={<AllBidingProductDetails/>} />
    <Route path="biddingproductststus"element={< BidingProductStatus />}/>
    <Route path="biddingproductststus/productdetails/:productId" element={<BidingProductStatusDetails/>} />
    <Route path="biddedproduct"element={<Biddedproduct/>}/>
    <Route path="biddedproduct/productdetails/:productId" element={<BiddedproductDetails/>} />
    <Route path="transactionbiddedprdouct"element={<BiddedproductTransaction/>}/>
    <Route path="transactionbiddedprdouct/productdetails/:productId" element={<BiddedproductTransactionDetails/>} />
  
    {/* Category Routes */}
    <Route path="productcategory"element={< ProductCategory/>}/>
    <Route path="blogcategory"element={< BlogCategory/>}/>
   
       {/* Admin*/}
    <Route path="admin"element={< Admin/>}/>
    <Route path="admin/adminprofile/:userId" element={<AdminProfile />} />
    <Route path="admin/adminprofileview/:userId" element={<  AdminProfileView/>} />
  
  

  
    

  {/* User Profile Route */}
  <Route path="completeprofile/:userId" element={<UserProfile />} />
</Route>
</>
 {/* )}  */}




          {/* <Route path="/trial" element={<Trial />} />
          <Route path="/artist" element={<ArtistManagement />} /> */}
            {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

const LayoutWrapper = ({ children }) => {
  // const location = useLocation(); // Now inside the Router
  // const hideHeaderFooterRoutes = [
  //   "/completeprofile",
  //   "/image-edit",
  //   "/artists/:id",
  //   "/ArtistManageTable",//superadmin ,admin  
  //   "/BuyerManageTable",//superadmin ,admin  
  //   "/teamboard",//superadmin ,admin  
  //   "/maintenance",//superadmin ,admin  
  //   "/search",
  //   "/invoice",
  //   "/imagegallery",
  //   "/Fileimages",
  //   "/403",
  //   "/404",
  //   "/Filemedia",
  //   "/Filedocs",
  //   "/create-blog",
  //   "/dashboardaccess",
  //   "/Bloglist",//superadmin ,admin  
  //   "/Filedashboard",
  //   "/Blogdetails",
  //   "/Blogpost",
  //   "/Appinbox",
  //   "/Appcontact",
  //   "/Appchat",
  //   "/Blogdashboard",
  //   "/BlogRequest",    //superadmin ,admin
  //   "/Product-uploade"
  // ];
  // const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
  //   location.pathname
  // );

  return (
    <>
      {/* {!shouldHideHeaderFooter && <Header />} */}
      {children}
      {/* {!shouldHideHeaderFooter && <Footer />} */}
    </>
  );
};

export default AppRoutes;
