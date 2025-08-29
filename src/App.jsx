import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from "./app/paginaPrincipal.jsx"
import About from "./app/about/about.jsx"
import Contacto from "./app/contact/contactanos.jsx"
import HarbourHome from './app/harbour/pageHarbour.jsx'
import ArenaHome from "./app/arena/pageArena.jsx"
import CjmHome from "./app/cjm/pageCjm.jsx"
import BassariHome from "./app/bassari/pageBassari.jsx"
import FlamencoHome from './app/flamenco/pageFlamenco.jsx'
import BlogHome from './app/blog/pageBlog.jsx'
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
        <Route path="/harbourHome" element={<HarbourHome />} />
        <Route path="/cjmHome" element={<CjmHome />} />
        <Route path="/arenaHome" element={<ArenaHome />} />
        <Route path="/flamencoHome" element={<FlamencoHome />} />
        <Route path="/bassariHome" element={<BassariHome />} />
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