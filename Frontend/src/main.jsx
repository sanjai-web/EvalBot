// Frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import AuthNavbar from "./components/NavbarLogin";
import Home from "./Pages/home";
import Login from "./Pages/login";
import Signup from "./Pages/signup";
import Profile from "./Pages/profile";
import Result from "./Pages/result";
import Details from "./Pages/details";
import GetStart from "./Pages/getstart";
import NotFound from "./Pages/notfound";


//Domains
import Interview from "./Domains/interview";
import Rolebased from "./Domains/rolebased";

function Layout() {
  const location = useLocation();

  // Define routes that should use AuthNavbar
  const authRoutes = ["/login", "/signup", "/"];
  const isAuthPage = authRoutes.includes(location.pathname);

  // Hide navbar for interview page
  const hideNavbarRoutes = ["/interview","/rolebased"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (isAuthPage ? <AuthNavbar /> : <Navbar />)}
      <div className="min-h-screen bg-gray-50">
        {/* <BrowserRouter></BrowserRouter> */}
        <Routes>
          <Route path="/" element={<GetStart />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />}  />
          <Route path="/profile" element={<Profile />} />
          <Route path="/result" element={<Result />} />
          <Route path="/details" element={<Details />} />
           <Route path="*" element={<NotFound />} />
          {/* Domains */}
          <Route path="/interview" element={<Interview />} />
          <Route path="/rolebased" element={<Rolebased />} />


        </Routes>
      </div>
    </>
  );
}
export default Layout;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);
