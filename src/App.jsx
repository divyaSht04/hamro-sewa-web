"use client"

import { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { ArrowUp } from "lucide-react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/staticPages/HomePage"
import AboutUsPage from "./pages/staticPages/AboutUsPage"
import ServicePage from "./pages/staticPages/ServicePage"
import ContactPage from "./pages/staticPages/ContactPage"
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ServiceList from "./pages/admin/ServiceList"
import AdminProfile from "./pages/admin/AdminProfile"
import Aos from "aos"
import "aos/dist/aos.css"
import { UserRegisterPage } from "./pages/auth/UserRegisterPage"
import { ProviderRegisterPage } from "./pages/auth/ProviderRegisterPage"
import { ServiceProviderDashboard } from "./pages/serviceProvider/Dashboard"
import { ServiceProviderServiceList } from "./pages/serviceProvider/ServiceList"
import { ServiceProviderProfile } from "./pages/serviceProvider/Profile"
import { PrivateRoute } from "./auth/PrivateRoute"
import { PublicRoute } from "./auth/PublicRoute"
import { AuthProvider } from "./auth/AuthContext"
import { Toaster } from "react-hot-toast"
import { ROLES } from "./constants/roles"
import { AccessDenied } from "./pages/AccessDenied"
import { EditProfilePage } from "./pages/customer/EditProfilePage"
import { CustomerProfile } from "./pages/customer/CustomerProfile"
import { AddEditService } from "./pages/serviceProvider/AddEditService"
import ServiceDetailsPage from "./pages/staticPages/ServiceDetailsPage"

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Hide button on login, register, and admin pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/provider")
  ) {
    return null
  }

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  ) : null
}

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    Aos.init({
      duration: 900,
      once: true,
      offset: 10,
      delay: 2,
    })
  }, [])

  // Update the condition to hide header/footer on all provider routes and service details page
  const showHeaderFooter =
    ![
      "/login",
      "/register",
      "/register/user",
      "/register/provider",
      "/admin",
      "/admin/profile",
      "/admin/services",
      "/provider",
      "/provider/dashboard",
      "/provider/services",
      "/provider/services/new",
      "/provider/services/edit",
      "/provider/profile",
      "/access-denied",
    ].includes(location.pathname) &&
    !location.pathname.startsWith("/provider/") &&
    !location.pathname.startsWith("/service-details/")

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className={`flex-grow ${!showHeaderFooter ? "bg-gray-50" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/service-details/:id" element={<ServiceDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register/user"
            element={
              <PublicRoute>
                <UserRegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register/provider"
            element={
              <PublicRoute>
                <ProviderRegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Protected Routes */}
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfilePage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
                <ServiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <PrivateRoute requiredRoles={[ROLES.ADMIN]}>
                <AdminProfile />
              </PrivateRoute>
            }
          />

          {/* Service Provider Routes */}
          <Route
            path="/provider"
            element={
              <PrivateRoute requiredRoles={[ROLES.SERVICE_PROVIDER]}>
                <ServiceProviderDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services"
            element={
              <PrivateRoute requiredRoles={[ROLES.SERVICE_PROVIDER]}>
                <ServiceProviderServiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services/new"
            element={
              <PrivateRoute requiredRoles={[ROLES.SERVICE_PROVIDER]}>
                <AddEditService />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services/edit/:id"
            element={
              <PrivateRoute requiredRoles={[ROLES.SERVICE_PROVIDER]}>
                <AddEditService />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/profile"
            element={
              <PrivateRoute requiredRoles={[ROLES.SERVICE_PROVIDER]}>
                <ServiceProviderProfile />
              </PrivateRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/profile"
            element={
              <PrivateRoute requiredRoles={[ROLES.CUSTOMER]}>
                <CustomerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/edit-profile"
            element={
              <PrivateRoute requiredRoles={[ROLES.CUSTOMER]}>
                <EditProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  )
}

export default App