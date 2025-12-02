import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import AdminHome from './Pages/AdminHome.jsx'
import AdminDetails from './Pages/AdminDetails.jsx'
import AdminCodeUpload from './Pages/AdminCodeUpload.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/Details" element={<AdminDetails />} />
        <Route path="/CodeUpload" element={<AdminCodeUpload />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
