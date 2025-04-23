import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ArtistSellerRegister from "../Pages/Register/ArtistSellerRegister";
import ForgotPassword from "../Pages/Login/Forgotpassword";
import PagenotFound404 from "../Pages/404Error/404Error";

//----------------------------------------UserProfile---------------------------------------------------------------------//
import SuperAdminProfile from "../Component/Dashboard/UserProfile/UserInfo" ; 
import ArtistProfile from "../Component/Dashboard/UserProfile/UserInfo"; 
import BuyerProfile from "../Component/Dashboard/UserProfile/UserInfo";
import SellerProfile from "../Component/Dashboard/UserProfile/UserInfo"


//-----------------------------------------Dashboard----------------------------------------------------------------------//
import SuperAdminDashboardMain from "../Component/Dashboard/Super-AdminDashboard/MainDashboard";
import ArtistDashboardMain from "../Component/Dashboard/ArtistDashbooard/MainDashboard";
import BuyerDashboardMain from "../Component/Dashboard/BuyerDashboard/MainDashboard";
import SellerDashboardMain from "../Component/Dashboard/SellerDashboard/MainDashboard";

//----------------------------------------Super-Admin-------------------------------------------------------------------//
import SuperAdminDashboard from "../Component/Dashboard/Super-AdminDashboard/Dashboard/MainContent";
                            //-----------------Admin-------------------//
import Admin from "../Component/Dashboard/Super-AdminDashboard/Admin/Admin";
import AdminProfile from "../Component/Dashboard/Super-AdminDashboard/Admin/Profile/UserProf";
import AdminViewProfile from "../Component/Dashboard/Super-AdminDashboard/Admin/ViewProfile/UserProf";

                               //-----------------Artist Management-------------------//
import ArtistManagement from "../Component/Dashboard/Super-AdminDashboard/ArtistDetails/ArtistManageTable";

//----------------------------------------Artist-------------------------------------------------------------------//
import ArtistDashboard from "../Component/Dashboard/ArtistDashbooard/Dashboard/MainContent";

//----------------------------------------Buyer-------------------------------------------------------------------//
import BuyerDashboard from "../Component/Dashboard/BuyerDashboard/Dashboard/MainContent";

//----------------------------------------Seller-------------------------------------------------------------------//
import SellerDashboard from "../Component/Dashboard/SellerDashboard/Dashboard/MainContent";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgotpassword"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/artist-seller-register"
        element={
          <PublicRoute>
            <ArtistSellerRegister />
          </PublicRoute>
        }
      />

      {/*--------------------------------- Super Admin------------------------------------------------- */}
      <Route
        path="/super-admin"
        element={
          <PrivateRoute>
            <SuperAdminDashboardMain  />
          </PrivateRoute>
        }
      >       
        <Route index element={<Login />} />
        <Route path="dashboard"element={<SuperAdminDashboard/>}/>
        <Route path="profile"element={<SuperAdminProfile/>}/>
        
                    {/*--------------------Admin----------------------------- */}
           <Route path="admin"element={<Admin/>}/>
           <Route path="admin/editprofile"element={<AdminProfile/>}/>
           <Route path="admin/viewprofile"element={< AdminViewProfile/>}/>

             {/*--------------------Artist management----------------------------- */}
           
           <Route path="artistmanagement"element={< ArtistManagement/>}/>
       
         
       
      </Route>

    {/*---------------------------------Artist------------------------------------------------- */}
      <Route
        path="/artist"
        element={
          <PrivateRoute>
            <ArtistDashboardMain />
          </PrivateRoute>
        }
      >
      <Route index element={<Login />} />
      <Route path="dashboard"element={<ArtistDashboard/>}/>
      <Route path="profile"element={<ArtistProfile/>}/>
      </Route>

    {/*---------------------------------Buyer------------------------------------------------- */}
       <Route
        path="/buyer"
        element={
          <PrivateRoute>
            <BuyerDashboardMain/>
          </PrivateRoute>
        }
      >
      <Route index element={<Login />} />
      <Route path="dashboard"element={<BuyerDashboard/>}/>
      <Route path="profile"element={<BuyerProfile/>}/>
      </Route>
    
    {/*---------------------------------Seller------------------------------------------------- */}
       <Route
        path="/seller"
        element={
          <PrivateRoute>
            <SellerDashboardMain/>
          </PrivateRoute>
        }
      >
      <Route index element={<Login />} />
      <Route path="dashboard"element={<SellerDashboard/>}/>
      <Route path="profile"element={<SellerProfile/>}/>
      </Route>

      <Route path="*" element={<PagenotFound404 />} />
    
    </Routes>
  );
};

export default AppRoutes;
