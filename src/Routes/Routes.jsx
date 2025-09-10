import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";
import WebsiteLayout from "../Layouts/WebsiteLayout";
import { useAuth } from '../AuthContext';
import PreloaderAnimation from '../Pages/Animation/PreloaderAnimation';

//----------------------------------------Auth Pages------------------------------------------//
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ArtistSellerRegister from "../Pages/Register/ArtistSellerRegister";
import ForgotPassword from "../Pages/Login/Forgotpassword";
//-----piublic routes-----//
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import TermsofServices from "../Pages/Terms&Condition/TermsofServices";

//----------------------------------------My Account-----------------------------------------//
import MyAccountMainLayout from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/MyAccountMainLayout';
import { AccountPage } from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyAccountPage';
import { AccountForm } from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/PersonaInformation';
import ManageAddress from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/ManageAddress';
import BankPaymentDetails from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/BankPaymentDetails';
import PaymentMethod from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/PaymentMethod';
import PasswordManager from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/PasswordManager';
import AccountVerification from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/AccountVerification';
import SocialMediaPromotion from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/SocialMediaPromotion';
import CustomRequest from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/CustomRequest';
import NotificationAndPreferences from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/NotificationAndPreferences';
import AccountSecurityAndAgreements from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/AccountSecurityAndAgreements';
import MyOrders from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyOrders";
import Logout from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/Logout';
import TrackOrder from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/TrackOrder";
import WishListTable from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/WishListTable";
import MyCartList from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/MyCartList";
import CheckOut from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/CheckOut";
import OrderCompleted from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/MyCart/OrderCompleted";

//----------------------------------------Error Pages-----------------------------------------//
import PagenotFound404 from "../Pages/Error/404Error";
import UnauthorizedAccess from "../Pages/Error/403Error";

//----------------------------------------WebsiteRoutes-----------------------------------------//
import WebsiteMain from "../Pages/Home/Home";

//----------------------------------------User Profile---------------------------------------//
import UserProfile from "../Component/Dashboard/UserProfile/UserInfo";

//----------------------------------------Dashboard Layouts-----------------------------------//
import SuperAdminLayout from "../Component/Dashboard/Super-AdminDashboard/MainDashboard";
import ArtistLayout from "../Component/Dashboard/ArtistDashbooard/MainDashboard";
import BuyerLayout from "../Component/Dashboard/BuyerDashboard/MainDashboard";
import SellerLayout from "../Component/Dashboard/SellerDashboard/MainDashboard";

//----------------------------------------Super-Admin Components-----------------------------//
import SuperAdminDashboard from "../Component/Dashboard/Super-AdminDashboard/Dashboard/MainContent";
import SuperAdminBlog from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/BlogRequest";
import SuperAdminBlogPost from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/BlogPost";
import SuperAdminViewBlog from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/ViewBlog";
import SuperAdminUpdateBlog from "../Component/Dashboard/Super-AdminDashboard/Blog/SuperAdminBlog/UpdateBlogList";
import SuperAdminProductInfo from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/Productinfo";
import SuperAdminMarketing from "../Component/Dashboard/Super-AdminDashboard/Settings/EmailMarketing/Marketing/MarketingEmail";
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
import ArtistTransaction from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Transaction/ArtistTransaction";
import ArtistPackagingMaterial from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/PackagingMaterial/ProductPurchasedArtist";
import ArtistProductsDetails from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Product/ArtistProductDetails";

import BuyerManagement from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/BuyerManageTable";
import BuyerProductPurchase from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductPurchased/ProductPurchased";
import BuyerProductRequest from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductRequest/ProductRequestTable";
import BuyerSoldProduct from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/SoldProduct/SoldProduct";
import BuyerTransaction from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/Transaction/BuyerTransaction";
import BuyerPackagingMaterial from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/PackagingMaterial/ProductPurchasedBuyer";
import BuyermanageProductView from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/BuyerUserProdileView/UserProf";
import BuyermanageProductEdit from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/UserProfile/UserProf";
import BuyerResellProductView from "../Component/Dashboard/Super-AdminDashboard/BuyerManagement/ProductRequest/ProductRequestView";

//------Seller tab-----//
import SellerManagement from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerManageTable";
import SellerProducts from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerProducts/SellerProduct";
import SellerProductRequest from "../Component/Dashboard/Super-AdminDashboard/Seller/ProductRequest/ProductRequestTable";
import SellerSoldProducts from "../Component/Dashboard/Super-AdminDashboard/Seller/SoldProduct/SoldProduct";
import SellerTransaction from "../Component/Dashboard/Super-AdminDashboard/Seller/Transaction/SellerTransaction";
import SellerPackaging from "../Component/Dashboard/Super-AdminDashboard/Seller/PackagingMaterial/ProductPurchasedSeller";
import SellerManageProductView from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerUserProdileView/UserProf";
import SellerManageProductEdit from "../Component/Dashboard/Super-AdminDashboard/Seller/SellerUserProfile/UserProf";

//-----------------------------Product--------------------------//
import ProductTableView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/Product";
import CustomOrderView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/CustomOrderAll/Customorder";
import PurchaseTable from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductPurchased/ProductPurchased";
import ProductUploads from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductUpload/productUploade";
// eslint-disable-next-line no-unused-vars
import ProductRequestView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";
import ViewCustomRequestsuperadmin from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";

//-----------------------------Bidding--------------------------//
import AllBiddingProduct from "../Component/Dashboard/Super-AdminDashboard/Bidding/AllProduct/BiddingProduct";
import BiddedProduct from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddedproduct/Biddedproduct";
import BiddedProductTransaction from "../Component/Dashboard/Super-AdminDashboard/Bidding/Transaction/BiddedproductTransaction";

//-----------------------------Settings--------------------------//
import EmailSettings from "../Component/Dashboard/Super-AdminDashboard/Settings/EmailSetting/EmailSetting";
import BlogCategory from "../Component/Dashboard/Super-AdminDashboard/Settings/Blogcategory/Category";
import ProductCategory from "../Component/Dashboard/Super-AdminDashboard/Settings/Productcategory/Category";

//----------------------------------------Artist Components----------------------------------//
import ArtistDashboard from "../Component/Dashboard/ArtistDashbooard/Dashboard/MainContent";
//-----------------------------Blogs--------------------------//
import BlogList from "../Component/Dashboard/ArtistDashbooard/Blog/BlogList";
import BlogPost from "../Component/Dashboard/ArtistDashbooard/Blog/BlogPost";
import UpdateBlog from "../Component/Dashboard/ArtistDashbooard/Blog/UpdateBlogList";
import BlogDetails from "../Component/Dashboard/ArtistDashbooard/Blog/ArtistBlogDetails";

//-----------------------------Products Route--------------------------//
import AllProduct from "../Component/Dashboard/ArtistDashbooard/ProductDetails/Product";
import ProductUploade from '../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductUpload/productUploade';
import CustomOrder from '../Component/Dashboard/ArtistDashbooard/ProductDetails/CustomOrder/CustomOrderAll/Customorder';
import ProductView from '../Component/Dashboard/ArtistDashbooard/ProductDetails/Productinfo';
import ViewCustomRequest from '../Component/Dashboard/ArtistDashbooard/ProductDetails/CustomOrder/Artist/ViewRequest';
import Productpurchase from '../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductPurchased/ProductPurchased';

//----------------------------------------Buyer Components-----------------------------------//
import BuyerDashboard from "../Component/Dashboard/BuyerDashboard/Dashboard/MainContent";

//----------------------------------------Seller Components----------------------------------//
import SellerDashboard from "../Component/Dashboard/SellerDashboard/Dashboard/MainContent";
import ViewProductDetails from "../Component/Dashboard/SellerDashboard/ProductsDetails/Product";
import SellerProductUpload from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductUpload/productUploade";
import SellerPurchasedProducts from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductPurchased/ProductPurchased";

//----------------------------------------Social Media----------------------------------//
import Homee from '../Pages/socialMedia/Homee';
import Notification from '../Pages/socialMedia/Notification';
import Search from '../Pages/socialMedia/Search';
import Explore from '../Pages/socialMedia/Explore';
import CreatePost from '../Pages/socialMedia/CreatePost';
import UploadPost from '../Pages/socialMedia/UploadPost';
import SocialProfile from '../Pages/socialMedia/SocialProfile';
import PromoteProfile from '../Pages/socialMedia/PromoteProfile';
import PromotePost from '../Pages/socialMedia/PromotePost';
import CreateLive from '../Pages/socialMedia/CreateLive';
import MyLive from '../Pages/socialMedia/MyLive';
import Live from '../Pages/socialMedia/Live';
import Test from '../Pages/socialMedia/Test';
import Settings from '../Pages/socialMedia/Settings';

const PrivateRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userType, status: userStatus } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if ((userType === 'Artist' || userType === 'Seller') && (userStatus === 'Unverified' || userStatus === 'Rejected') && location.pathname !== `/${userType.toLowerCase()}/profile`) {
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
      if ((userType === 'Artist' || userType === 'Seller') && (userStatus === 'Unverified' || userStatus === 'Rejected') && location.pathname === '/login') {
        return;
      }
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, userType, userStatus, location.pathname, navigate]);

  const authPages = ['/login', '/register', '/artist-seller-register', '/forgotpassword'];

  return children ? children : <Outlet />;
};

const WebsiteWrapper = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 6000); // Preloader duration (6 seconds)
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false); // Skip preloader for other routes
    }
  }, [location.pathname]);

  return showAnimation && location.pathname === '/' ? (
    <PreloaderAnimation />
  ) : (
    <WebsiteLayout>
      <Outlet />
    </WebsiteLayout>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, userType, status: userStatus } = useAuth();

  return (
    <Routes>
      {/* -------------------------------------------Public Routes------------------------------------------------- */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/artist-seller-register" element={<ArtistSellerRegister />} />
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
        <Route path="product/product-info" element={<SuperAdminProductInfo />} />

        {/* Admin Management */}
        <Route path="admin" element={<Admin />} />
        <Route path="admin/editprofile" element={<AdminProfile />} />
        <Route path="admin/viewprofile" element={<AdminViewProfile />} />

        {/* Artist Management */}
        <Route path="artist/management" element={<ArtistManagement />} />
        <Route path="artist/artist-edit" element={<ProductEditRequest />} />
        <Route path="artist/blogrequest" element={<BlogRequest />} />
        <Route path="artist/blogrequest/view-Blog" element={<BlogRequestView />} />
        <Route path="artist/blogrequest/update-blog" element={<BlogRequestUpdate />} />
        <Route path="artist/blogrequest/blog-details/:slug" element={<BlogRequestDetails />} />
        <Route path="artist/blogs" element={<ApprovedBlogs />} />
        <Route path="artist/blogs/blog-details/:slug" element={<ApprovedBlogsDetails />} />
        <Route path="artist/blogs/blog-update/:slug" element={<ApprovedBlogsUpdate />} />
        <Route path="artist/artistproductrequest" element={<Artistproductrequest />} />
        <Route path="artist/allartistproduct" element={<ArtistAllProduct />} />
        <Route path="artist/sold-product" element={<SoldProduct />} />
        <Route path="artist/management/artistprofileview/" element={<ProductViewRequest />} />
        <Route path="artist/artistprofileview/:userId" element={<ProductViewRequest />} />
        <Route path="artist/soldproducts" element={<ArtistSoldProductTable />} />
        <Route path="artist/artisttransaction" element={<ArtistTransaction />} />
        <Route path="artist/artistpackagingmaterial" element={<ArtistPackagingMaterial />} />
        <Route path="artist/management/productrequest/:userId" element={<ArtistProductRequestView />} />
        <Route path="artist/management/artisteditreuqest/update-blog" element={<EditBlogRequest />} />
        <Route path="artist/management/artisteditreuqest/" element={<ProductEditRequest />} />
        <Route path="artist/allartistproduct/productdetails/:userId" element={<ArtistProductsDetails />} />
        <Route path="artist/allartistproduct/productdetails/:userId" element={<ArtistProductsDetails />} />

        {/* Buyer Management */}
        <Route path="buyer/management" element={<BuyerManagement />} />
        <Route path="buyer/productpurchased" element={<BuyerProductPurchase />} />
        <Route path="buyer/resellproduct" element={<BuyerProductRequest />} />
        <Route path="buyer/soldproduct" element={<BuyerSoldProduct />} />
        <Route path="buyer/transaction" element={<BuyerTransaction />} />
        <Route path="buyer/packagingmaterial" element={<BuyerPackagingMaterial />} />
        <Route path="buyer/management/productview/" element={<BuyermanageProductView />} />
        <Route path="buyer/management/productedit/" element={<BuyermanageProductEdit />} />
        <Route path="buyer/resellproduct/productview/:userId" element={<BuyerResellProductView />} />

        {/* Seller Management */}
        <Route path="seller/management" element={<SellerManagement />} />
        <Route path="seller/product" element={<SellerProducts />} />
        <Route path="seller/productrequest" element={<SellerProductRequest />} />
        <Route path="seller/soldproduct" element={<SellerSoldProducts />} />
        <Route path="seller/transaction" element={<SellerTransaction />} />
        <Route path="seller/packagingmaterial" element={<SellerPackaging />} />
        <Route path="seller/management/productdetails-view" element={<SellerManageProductView />} />
        <Route path="seller/management/productdetails-edit" element={<SellerManageProductEdit />} />

        {/* Product Management */}
        <Route path="product-table" element={<ProductTableView />} />
        <Route path="customordertable" element={<CustomOrderView />} />
        <Route path="customordertable/view-request" element={<ViewCustomRequestsuperadmin />} />
        <Route path="purchasetable" element={<PurchaseTable />} />
        <Route path="product-upload" element={<ProductUploads />} />

        {/* Bidding Management */}
        <Route path="bidding/allproduct" element={<AllBiddingProduct />} />
        <Route path="bidding/bidded-product" element={<BiddedProduct />} />
        <Route path="bidding/transaction" element={<BiddedProductTransaction />} />

        {/* Settings */}
        <Route path="settings/email-setting" element={<EmailSettings />} />
        <Route path="settings/blog-category" element={<BlogCategory />} />
        <Route path="settings/product-category" element={<ProductCategory />} />
        <Route path="settings/marketing" element={<SuperAdminMarketing />} />
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
        <Route path="productUpload" element={<ProductUploade />} />
        <Route path="custom-order" element={<CustomOrder />} />
        <Route path="product/view-product" element={<ProductView />} />
        <Route path="custom-order/view-request" element={<ViewCustomRequest />} />
        <Route path="product-purchase" element={<Productpurchase />} />
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
        <Route path="SellerProductUpload" element={<SellerProductUpload />} />
        <Route path="purchased-product" element={<SellerPurchasedProducts />} />
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
            <Route path="manage-address" element={<ManageAddress />} />
            <Route path="bank-payment-details" element={<BankPaymentDetails />} />
            <Route path="payment-method" element={<PaymentMethod />} />
            <Route path="password-manager" element={<PasswordManager />} />
            <Route path="account-verification" element={<AccountVerification />} />
            <Route path="social-media-promotion" element={<SocialMediaPromotion />} />
            <Route path="custom-request" element={<CustomRequest />} />
            <Route path="notification-preferences" element={<NotificationAndPreferences />} />
            <Route path="security-agreements" element={<AccountSecurityAndAgreements />} />
            <Route path="logout" element={<Logout />} />
            <Route path="track-your-order" element={<TrackOrder />} />
            <Route path="wishlist" element={<WishListTable />} />
            <Route path="my-cart" element={<MyCartList />} />
            <Route path="check-out" element={<CheckOut />} />
            <Route path="order-completed" element={<OrderCompleted />} />
          </Route>
        </Route>
      </Route>

      {/* ----------------------------------------------------social media Route ----------------------------------------------- */}

<Route path="/social-media" element={<Homee />} />
<Route path="/social-media/notification" element={<Notification />} />
<Route path="/social-media/search" element={<Search />} />
<Route path="/social-media/explore" element={<Explore />} />
<Route path="/social-media/create-post" element={<CreatePost />} />
<Route path="/social-media/upload-post" element={<UploadPost />} />
<Route path="/social-media/profile" element={<SocialProfile />} />
<Route path='/social-media/profile/promote-profile' element={<PromoteProfile/>}/>
<Route path='/social-media/profile/promote-post' element={<PromotePost/>}/>
<Route path='/social-media/create-live' element={<CreateLive/>}/>
<Route path='/social-media/my-live/:streamKey' element={<MyLive/>}/>
<Route path='/social-media/live' element={<Live/>}/>
<Route path='/social-media/test' element={<Test/>}/>
<Route path='/social-media/setting' element={<Settings/>}/>


      {/*-------------------------------------------- Root Route - Auto Redirect----------------------------------------- */}
      <Route
        index
        element={
          isAuthenticated ? (
            userType === 'Super-Admin' ? (
              <Navigate to="/super-admin/dashboard" replace />
            ) : userType === 'Artist' ? (
              <Navigate to={(userStatus === 'Unverified' || userStatus === 'Rejected') ? '/artist/profile' : '/artist/dashboard'} replace />
            ) : userType === 'Buyer' ? (
              <Navigate to="/buyer/dashboard" replace />
            ) : userType === 'Seller' ? (
              <Navigate to={(userStatus === 'Unverified' || userStatus === 'Rejected') ? '/seller/profile' : '/seller/dashboard'} replace />
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