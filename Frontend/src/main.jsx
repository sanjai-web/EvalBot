// Frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";


import Details from "./Pages/details";
import GetStart from "./Pages/getstart";
import NotFound from "./Pages/notfound";


//Domains
import Interview from "./Domains/ComputerBased";
import Rolebased from "./Domains/rolebased";

function Layout() {
  const location = useLocation();

  // Define routes that should use AuthNavbar
  const authRoutes = ["/"];
  const isAuthPage = authRoutes.includes(location.pathname);

  // Hide navbar for interview page
  const hideNavbarRoutes = ["/ComputerBased","/rolebased"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (isAuthPage ? <Navbar /> : <Navbar />)}
      <div className="min-h-screen bg-gray-50">
        {/* <BrowserRouter></BrowserRouter> */}
        <Routes>
          <Route path="/" element={<GetStart />} />
          <Route path="/details" element={<Details />} />
           <Route path="*" element={<NotFound />} />
          {/* Domains */}
          <Route path="/ComputerBased" element={<Interview />} />
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
