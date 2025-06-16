// src/Routes/Routes.jsx
import React, { useEffect } from 'react';
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

//----------------------------------------Auth Pages------------------------------------------//
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ArtistSellerRegister from "../Pages/Register/ArtistSellerRegister";
import ForgotPassword from "../Pages/Login/Forgotpassword";

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
import TrackOrder from "../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/TrackOrder";
import Logout from '../Pages/Home/HomeComponents/MyAccountPage/MyAccountPageComponent/Pages/Account/Logout';

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
import SoldProduct from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/SoldProduct/SoldProduct";
import Artistproductrequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ProductRequest/ProductRequestTable";
import ArtistAllProduct from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/Product/AllArtistProduct";
import ProductEditRequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/UserProfile/UserProf";

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
import ViewCustomRequest from '../Component/Dashboard/ArtistDashbooard/ProductDetails/CustomOrder/Artist/ViewRequest';
import Productpurchase from '../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductPurchased/ProductPurchased';

//----------------------------------------Buyer Components-----------------------------------//
import BuyerDashboard from "../Component/Dashboard/BuyerDashboard/Dashboard/MainContent";

//----------------------------------------Seller Components----------------------------------//
import SellerDashboard from "../Component/Dashboard/SellerDashboard/Dashboard/MainContent";
import ViewProductDetails from "../Component/Dashboard/SellerDashboard/ProductsDetails/Product";
import SellerProductUpload from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductUpload/productUploade";
import SellerPurchasedProducts from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductPurchased/ProductPurchased";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userType, status: userStatus } = useAuth();
  const location = useLocation();


  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }
  

  if ((userType === 'Artist' || userType === 'Seller') && (userStatus === 'Unverified' ||userStatus === 'Rejected') && location.pathname !== `/${userType.toLowerCase()}/profile`) {
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
      if ((userType === 'Artist' || userType === 'Seller') && (userStatus === 'Unverified'|| userStatus === 'Rejected' )&& location.pathname === '/login') {
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
        <Route path="artist/artistproductrequest" element={<Artistproductrequest />} />
        <Route path="artist/allartistproduct" element={<ArtistAllProduct />} />
        <Route path="artist/sold-product" element={<SoldProduct />} />

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

        {/*Blogs*/}
        <Route path="bloglist" element={<BlogList />} />
        <Route path="bloglist/create-blog" element={<BlogPost />} />
        <Route path="bloglist/update-blog" element={<UpdateBlog />} />
        <Route path="bloglist/blog-details/:slug" element={<BlogDetails />} />

        {/* ----Product Route-------*/}
        <Route path="product" element={<AllProduct />} />
        <Route path="productUpload" element={<ProductUploade />} />
        <Route path="custom-order" element={<CustomOrder />} />
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
        {/* ----Product Route-------*/}
        <Route path="product-details" element={<ViewProductDetails />} />
        <Route path="SellerProductUpload" element={<SellerProductUpload />} />
        <Route path="purchased-product" element={<SellerPurchasedProducts />} />
      </Route>

      {/*-------------------------------------------- Website Routes-------------------------------------------------- */}
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<WebsiteMain />} />
        <Route path="/my-account" element={<MyAccountMainLayout />}>
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
          </Route>
        </Route>
      </Route>

      {/*-------------------------------------------- Root Route - Auto Redirect----------------------------------------- */}
    <Route
  index
  element={
    isAuthenticated ? (
      userType === 'Super-Admin' ? (
        <Navigate to="/super-admin/dashboard" replace />
      ) : userType === 'Artist' ? (
        <Navigate to={(userStatus === 'Unverified' ||userStatus === 'Rejected') ? '/artist/profile' : '/artist/dashboard'} replace />
      ) : userType === 'Buyer' ? (
        <Navigate to="/buyer/dashboard" replace />
      ) : userType === 'Seller' ? (
        <Navigate to={(userStatus === 'Unverified' ||userStatus === 'Rejected') ? '/seller/profile' : '/seller/dashboard'} replace />
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