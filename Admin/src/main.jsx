import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import AdminHome from './Pages/AdminHome.jsx'
import AdminDetails from './Pages/AdminDetails.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/Details" element={<AdminDetails />} />
      
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
