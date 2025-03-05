import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useLocation,
} from "react-router-dom";
// import Home from "../Pages/Home/Home";
// import About from "../Pages/About/About";
// import StoreProduct from "../Pages/Store/StoreProduct";
// import Blog from "../Pages/Blog/Blog";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
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
import UserProfile from "../Component/Dashboard/Dashboardcomponents/UserProfile/UserProf";
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
import BuyerManageTable from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerManageTable"
import CustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/CustomOrderAll/Customorder";
import CreateCustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/CustomOrderAll/CreateCustomOrder"
// import BuyerRequest from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/BuyerRequest/BuyerRequest";
import BuyerProfile from "../Component/Dashboard/Dashboardcomponents/BuyerManagement/UserProfile/UserProf"

import UpdateCustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/CustomOrderAll/UpdateCustomOrder"
import ViewCustomOrder from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/Buyer/ViewCustomOrde"
import ViewBuyerRequest from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/Artist/ViewRequest";
import ViewBuyerRequestToArtist from "../Component/Dashboard/Dashboardcomponents/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";
import ProductUpload from "../Component/Dashboard/Dashboardcomponents/ProductDetails/productUploade";

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
//Seller
import SellerManageTable from "../Component/Dashboard/Dashboardcomponents/Seller/SellerManageTable";
import SellerProfile from  "../Component/Dashboard/Dashboardcomponents/Seller/SellerUserProfile/UserProf";
import SellerProduct from "../Component/Dashboard/Dashboardcomponents/Seller/SellerProducts/SellerProduct";
import SellerProductDetails from "../Component/Dashboard/Dashboardcomponents/Seller/SellerProducts/SellerProductDetails";
import SellerSoldProduct from "../Component/Dashboard/Dashboardcomponents/Seller/SoldProduct/SoldProduct";
import SellerSoldProductDetails from "../Component/Dashboard/Dashboardcomponents/Seller/SoldProduct/SoldProductDetails"
import SellerTransaction from "../Component/Dashboard/Dashboardcomponents/Seller/Transaction/SellerTransaction"
import SellerTransactionDetails from "../Component/Dashboard/Dashboardcomponents/Seller/Transaction/TransactionProductDetails"
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
import AllProduct from "../Component/Dashboard/Dashboardcomponents/ProductDetails/Product"
import ProductRequest from "../Component/Dashboard/Dashboardcomponents/ProductDetails/ProductRequest/ProductRequest"
import ProductInfo from "../Component/Dashboard/Dashboardcomponents/ProductDetails/Productinfo";

//Transaction
import AllTransaction from "../Component/Dashboard/Dashboardcomponents/Transaction/AllTransaction"
import AllTransactionDetails from "../Component/Dashboard/Dashboardcomponents/Transaction/TransactionProductDetails"

const AppRoutes = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);
  
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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

<Route path={`/${userType}/Dashboard`} element={<Dashboard />}>
  
  {/* Blog Routes */}
  <Route path="BlogRequest/view-blog/BlogDetails/:blogId" element={<BlogDetails />} />
  <Route path="Bloglist/BlogDetails/:blogId" element={<ArtistBlogDetails />} />
  <Route path="BlogRequest" element={<BlogRequest />} />
  <Route path="BlogRequest/view-blog/:blogId" element={<BlogView />} />
  <Route path="Bloglist" element={<BlogList />} />
  {/* <Route path="Blogdashboard" element={<BlogDashboard />} /> */}
  <Route path="Bloglist/CreateBlog" element={<CreateBlog />} />

  {/* App Routes */}
  <Route path="Appinbox" element={<AppInbox />} />
  <Route path="Appcontact" element={<AppContact />} />
  <Route path="Appchat" element={<AppChat />} />

  {/* Artist Routes */}

   {/* Artist ManageTable */}
  <Route path="ArtistManageTable" element={<ArtistManageTable />} />

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
  <Route path="allartistproduct/editproduct/:productId" element={<ArtistEditProduct/>} />
  <Route path="artistsoldproduct" element={<ArtistSoldProduct/>} />
  <Route path="artistsoldproduct/soldproductdetails/:productId" element={<ArtistSoldProductDetails />} />
  <Route path="artisttransaction" element={<ArtistTransaction/>} />
  <Route path="artisttransaction/transcationproductdetails/:productId" element={<ArtistTransactionDetails/>} />

 
 


  <Route path="artists/:id" element={<ArtistDetail />} />
  <Route path="ArtistManageTable/ArtistProfile/:userId" element={<ArtistProfile />} />
  <Route path="ArtistManageTable/ArtistProfileView/:userId" element={<ArtistProfileView />} />

  {/* Product Routes */}
  <Route path="allproduct/createproduct" element={<ProductUpload />} />
  <Route path="allproduct"  element={<AllProduct/>}/>
  <Route path="productrequest" element={<ProductRequest />} />
  <Route path="allproduct/productinfo/:productId" element={<ProductInfo />} />

  {/* Buyer Routes */}
  <Route path="BuyerManageTable" element={<BuyerManageTable />} />
  <Route path="BuyerManageTable/BuyerProfile/:userId" element={<BuyerProfile />} />
  <Route path="buyerproductrequest" element={<BuyerProductRequest />} />
  <Route path="buyerproductrequest/productview/:productId" element={<BuyerProductRequestView />} />
  <Route path="buyerproductrequest/productview/editproduct/:userId" element={<BuyerEditProduct/>} />
  <Route path="buyerproductpurchased" element={<BuyerProductPurchased/>} />
  <Route path="buyerproductpurchased/productpurchaseddetails/:productId" element={<BuyerProductPurchasedDetails />} />
  <Route path="buyersoldproduct" element={<BuyerSoldProduct/>} />
  <Route path="buyersoldproduct/soldproductdetails/:productId" element={<BuyerSoldProductDetails />} />
  <Route path="buyertransaction" element={<BuyerTransaction/>} />
  <Route path="buyertransaction/transcationproductdetails/:productId" element={<BuyerTransactionDetails/>} />


    {/* Seller Routes */}
    <Route path="sellermanagetable" element={<SellerManageTable/>} />
    <Route path="sellermanagetable/sellerprofile/:userId" element={<SellerProfile />} />
    <Route path="sellerproduct" element={<SellerProduct/>} />
    <Route path="sellerproduct/sellerproductdetails/:productId" element={<SellerProductDetails />} />
    <Route path="sellersoldproduct" element={<SellerSoldProduct/>} />
    <Route path="sellersoldproduct/sellersoldproductdetails/:productId" element={<SellerSoldProductDetails/>} />
    <Route path="sellertransaction" element={<SellerTransaction/>} />
    <Route path="sellertransaction/transcationproductdetails/:productId" element={< SellerTransactionDetails/>} />
   
   
    
    
    {/* products Routes */}
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
  {/* User Profile Route */}
  <Route path="completeprofile/:userId" element={<UserProfile />} />
</Route>




          {/* <Route path="/trial" element={<Trial />} />
          <Route path="/artist" element={<ArtistManagement />} /> */}
          
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
