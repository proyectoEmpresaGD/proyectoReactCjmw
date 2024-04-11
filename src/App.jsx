import './App.css'
import {Routes,Route} from "react-router-dom"
import  Home from "./app/paginaPrincipal.jsx"
import  About from "./about/about.jsx"
import Contacto from "./contact/contactanos.jsx"
import Interores from "./interiores/interiores.jsx"
import Dormitorios from "./dormitorios/Dormitorios.jsx"
import Cocinas from "./cocinas/cocinas.jsx"
import Salones from "./salones/Salones.jsx"
import Tienda from "./tienda/tienda.jsx"

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
            <Route path="/tienda" element={<Tienda />}/>
        </Routes>
    </div>
    </>
  )
}

export default App
