// src/contexts/MarcaContext.jsx
import { createContext, useContext, useState } from "react";

const MarcaContext = createContext();

export const MarcaProvider = ({ children }) => {
    const [marcaActiva, setMarcaActiva] = useState(null);
    return (
        <MarcaContext.Provider value={{ marcaActiva, setMarcaActiva }}>
            {children}
        </MarcaContext.Provider>
    );
};

export const useMarca = () => useContext(MarcaContext);
