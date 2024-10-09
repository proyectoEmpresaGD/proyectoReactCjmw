import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./app/paginaPrincipal.jsx"
import About from "./app/about/about.jsx"
import Contacto from "./app/contact/contactanos.jsx"
import HarbourHome from './app/harbour/page.jsx'
import ArenaHome from "./app/arena/page.jsx"
import CjmHome from "./app/cjm/page.jsx"
import BassariHome from "./app/bassari/page.jsx"
import FlamencoHome from './app/flamenco/page.jsx'
import BlogHome from './app/blog/page.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Products from "./app/products/products.jsx"
import Usages from './app/usages/page.jsx'
import GeocodingService from "./components/ComponentesContact/map.jsx"
import CookieConsent from './components/ComponenetesCookies/CookieConsent.jsx';
import Contract from "./app/contract/PaginaContract.jsx"

function App() {
  return (
    <>
      <ScrollToTop />
      <CookieConsent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contacto />} />
        <Route path="/harbour" element={<HarbourHome />} />
        <Route path="/cjm" element={<CjmHome />} />
        <Route path="/arena" element={<ArenaHome />} />
        <Route path="/flamenco" element={<FlamencoHome />} />
        <Route path="/bassari" element={<BassariHome />} />
        <Route path="/BlogHome/:newsId" element={<BlogHome />} />
        <Route path="/products" element={<Products />} />
        <Route path="/usages" element={<Usages />} />
        <Route path="/map/:direccion" element={<GeocodingService />} />
        <Route path="/Contract" element={<Contract />} />
      </Routes>
    </>
  )
}

export default App