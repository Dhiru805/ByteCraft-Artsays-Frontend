import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";
import WebsiteLayout from "../Layouts/WebsiteLayout";
import { useAuth } from '../AuthContext';

//----------------------------------------Auth Pages------------------------------------------//
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ArtistSellerRegister from "../Pages/Register/ArtistSellerRegister";
import ForgotPassword from "../Pages/Login/Forgotpassword";

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
import Artistproductrequest from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ProductRequest/ProductRequestTable";
    //------Seller tab-----//
import SellerProductRequest from "../Component/Dashboard/Super-AdminDashboard/Seller/ProductRequest/ProductRequestTable";
    //------Products tab---//
import ProductTableView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/Product";
import CustomOrderView from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/CustomOrderAll/Customorder";
import PurchaseTable from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductPurchased/ProductPurchased";
import ProductUploads from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/ProductUpload/productUploade";
import ProductRequestView  from "../Component/Dashboard/Super-AdminDashboard/ProductDetails/CustomOrder/SuperAdmin/ViewBuyerRequestToArtist";



//-----------------------------Bidding--------------------------//
import AllBiddingProduct from "../Component/Dashboard/Super-AdminDashboard/Bidding/AllProduct/BiddingProduct";
import BiddedProduct from "../Component/Dashboard/Super-AdminDashboard/Bidding/Biddedproduct/Biddedproduct";
import BiddedProductTransaction from "../Component/Dashboard/Super-AdminDashboard/Bidding/Transaction/BiddedproductTransaction"
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
import Productpurchase from '../Component/Dashboard/ArtistDashbooard/ProductDetails/ProductPurchased/ProductPurchased';


//----------------------------------------Buyer Components-----------------------------------//
import BuyerDashboard from "../Component/Dashboard/BuyerDashboard/Dashboard/MainContent";

//----------------------------------------Seller Components----------------------------------//
import SellerDashboard from "../Component/Dashboard/SellerDashboard/Dashboard/MainContent";
import ViewProductDetails from "../Component/Dashboard/SellerDashboard/ProductsDetails/Product";
import SellerProductUpload from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductUpload/productUploade";
import SellerPurchasedProducts from "../Component/Dashboard/SellerDashboard/ProductsDetails/ProductPurchased/ProductPurchased";

// Route Protection Components
const PrivateRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Only redirect auth pages if authenticated
  const authPages = ['/login', '/register', '/artist-seller-register', '/forgotpassword'];
  if (isAuthenticated && authPages.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

const AppRoutes = () => {
  const { isAuthenticated, userType } = useAuth();

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
        <Route path="artist/blogrequest" element={<BlogRequest />} />
        <Route path="artist/blogrequest/view-Blog" element={<BlogRequestView />} />
        <Route path="artist/blogrequest/update-blog" element={<BlogRequestUpdate />} />
        <Route path="artist/blogrequest/blog-details/:slug" element={<BlogRequestDetails/>} />
        <Route path="artist/blogs" element={<ApprovedBlogs/>} />
        <Route path="artist/blogs/blog-details/:slug" element={<ApprovedBlogsDetails/>} />
        <Route path="artist/artistproductrequest" element={<Artistproductrequest/>} />
        <Route path="artist/viewrequesttoartist/:id" element={<ProductRequestView/>} />

        {/* Seller Management */}
        <Route path="sellerrequest" element={<SellerProductRequest/>} />

        {/* Product Management */}
        <Route path="product-table" element={<ProductTableView/>} />
        <Route path="customordertable" element={<CustomOrderView/>} />
        <Route path="purchasetable" element={<PurchaseTable/>} />
        <Route path="product-upload" element={<ProductUploads/>} />

        
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
        <Route path="bloglist" element={<BlogList/>} />
        <Route path="bloglist/create-blog" element={<BlogPost/>} />
        <Route path="bloglist/update-blog" element={<UpdateBlog/>} />
        <Route path="bloglist/blog-details/:slug" element={<BlogDetails/>}/>
      {/* ----Product Route-------*/}
        <Route path="product" element={<AllProduct/>}/>
        <Route path="productUpload" element={<ProductUploade />}/>
        <Route path="custom-order" element={<CustomOrder />}/>
        <Route path="product-purchase" element={<Productpurchase />}/>
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
        <Route path="profile" element={<UserProfile />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="product-details" element={<ViewProductDetails/>}/>
        <Route path="SellerProductUpload" element={<SellerProductUpload />}/>
        <Route path="purchased-product" element={<SellerPurchasedProducts/>}/>


      </Route>

      {/*-------------------------------------------- Website Routes-------------------------------------------------- */}

      
<Route path="/" element={<WebsiteLayout />}>
  <Route index element={<WebsiteMain />} />
</Route>

      {/*-------------------------------------------- Root Route - Auto Redirect----------------------------------------- */}
      <Route
        index
        element={
          isAuthenticated ? (
            userType === "Super-Admin" ? (
              <Navigate to="/super-admin/dashboard" replace />
            ) : userType === "Ar  tist" ? (
              <Navigate to="/artist/dashboard" replace />
            ) : userType === "Buyer" ? (
              <Navigate to="/buyer/dashboard" replace />
            ) : userType === "Seller" ? (
              <Navigate to="/seller/dashboard" replace />
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
      <Route path="/unauthorized" element={<UnauthorizedAccess/>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;