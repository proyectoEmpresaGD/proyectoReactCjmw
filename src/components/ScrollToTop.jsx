import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollPosition } from "../Constants/constants";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(scrollPosition.x, scrollPosition.y); // Usar constantes
  }, [pathname]);

  return null;
}

export default ScrollToTop;
