import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing_Page from './pages/Landing_Page'
import About_Page from './pages/About_Page'
import Products_Page from './pages/Products_Page'
import Contact_Page from './pages/Contact_Page'
import Product_Detail_Page from './pages/Product_Detail_Page'
import Not_Found_Page from './pages/Not_Found_Page'
import Footer from './components/layout/Footer'

import ScrollToTop from './components/ScrollToTop'

// Admin imports
import { AuthProvider } from './admin/context/AuthContext'
import { ToastProvider } from './admin/components/common/Toast'
import ProtectedRoute from './admin/components/ProtectedRoute'
import LoginPage from './admin/pages/LoginPage'
import DashboardPage from './admin/pages/DashboardPage'
import ProductsPage from './admin/pages/ProductsPage'
import TestimonialsPage from './admin/pages/TestimonialsPage'
import LeadsPage from './admin/pages/LeadsPage'
import QuotesPage from './admin/pages/QuotesPage'
import SubscribersPage from './admin/pages/SubscribersPage'
import ProfilePage from './admin/pages/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing_Page />} />
            <Route path="/about" element={<About_Page />} />
            <Route path="/products" element={<Products_Page />} />
            <Route path="/contact" element={<Contact_Page />} />
            <Route path="/products/:id" element={<Product_Detail_Page />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/testimonials" 
              element={
                <ProtectedRoute>
                  <TestimonialsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/leads" 
              element={
                <ProtectedRoute>
                  <LeadsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/quotes" 
              element={
                <ProtectedRoute>
                  <QuotesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/subscribers" 
              element={
                <ProtectedRoute>
                  <SubscribersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<Not_Found_Page />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
