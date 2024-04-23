import './App.css'
import {  BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./app/paginaPrincipal.jsx"
import About from "./about/about.jsx"
import Contacto from "./contact/contactanos.jsx"
import Interores from "./interiores/interiores.jsx"
import HarbourHome from './app/harbour/page.jsx'
import ArenaHome from "./app/arena/page.jsx"
import CjmHome from "./app/cjm/page.jsx"
import FlamencoHome from './app/flamenco/page.jsx'
import BlogHome from './app/blog/page.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

function App() {


  return (
    <>  
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contacto />} />
            <Route path="/interiores" element={<Interores />} />
            <Route path="/harbourHome" element={<HarbourHome />} />
            <Route path="/cjmHome" element={<CjmHome />} />
            <Route path="/arenaHome" element={<ArenaHome />} />
            <Route path="/flamencoHome" element={<FlamencoHome />} />
            <Route path="/BlogHome" element={<BlogHome />} />
          </Routes>
    </>
  )
}

export default App
