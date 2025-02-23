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
import { EditProfilePage } from "./pages/user/EditProfilePage"
import { UserRegisterPage } from "./pages/auth/UserRegisterPage"
import { ProviderRegisterPage } from "./pages/auth/ProviderRegisterPage"
import { ServiceProviderDashboard } from "./pages/serviceProvider/Dashboard"
import { ServiceProviderServiceList } from "./pages/serviceProvider/ServiceList"
import { ServiceProviderProfile } from "./pages/serviceProvider/Profile"
import { PrivateRoute } from "./auth/PrivateRoute"
import { AuthProvider } from "./auth/AuthContext"
import { Toaster } from "react-hot-toast"

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
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/provider")) {
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

  const showHeaderFooter = ![
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
  ].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/user" element={<UserRegisterPage />} />
          <Route path="/register/provider" element={<ProviderRegisterPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["ROLE_ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <PrivateRoute roles={["ROLE_ADMIN"]}>
                <ServiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <PrivateRoute roles={["ROLE_ADMIN"]}>
                <AdminProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider"
            element={
              <PrivateRoute roles={["ROLE_SERVICE_PROVIDER"]}>
                <ServiceProviderDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services"
            element={
              <PrivateRoute roles={["ROLE_SERVICE_PROVIDER"]}>
                <ServiceProviderServiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/profile"
            element={
              <PrivateRoute roles={["ROLE_SERVICE_PROVIDER"]}>
                <ServiceProviderProfile />
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
  );
}

export default App