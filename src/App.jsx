import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
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
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/admin")) {
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


  const showHeaderFooter = !['/login', '/register','/admin','/admin/profile','/admin/services'].includes(location.pathname);

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
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route
            path="/admin/*"
            element={
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="services" element={<ServiceList />} />
                <Route path="profile" element={<AdminProfile />} />
              </Routes>
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
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

