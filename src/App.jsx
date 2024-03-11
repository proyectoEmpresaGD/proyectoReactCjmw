import './App.css'
import {Routes,Route} from "react-router-dom"
import  Home from "./paginaPrincipal.jsx"
import  About from "./about.jsx"
import Contacto from "./contactanos.jsx"
import Interores from "./interiores.jsx"
import Dormitorios from "./Dormitorios.jsx"
import Cocinas from "./cocinas.jsx"
import Salones from "./Salones.jsx"

function App() {


  return (
    <>
    <div className='Aplicacion'>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About />}/> 
            <Route path="/contacto" element={<Contacto />}/>
            <Route path="/interiores" element={<Interores />}/>
            <Route path="/dormitorios" element={<Dormitorios />}/>
            <Route path="/cocinas" element={<Cocinas />}/>
            <Route path="/salones" element={<Salones />}/>
        </Routes>
    </div>
    </>
  )
}

export default App
