import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);  // Se ejecuta solo cuando cambia la ruta

  return null;  // Este componente no renderiza nada
}

export default ScrollToTop;