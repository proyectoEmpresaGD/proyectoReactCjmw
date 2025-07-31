import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CarruselColecciones from '../ComponentesBrands/CarruselColecciones';
import { CartProvider } from '../CartContext';
import { coleccionesPorMarca } from '../../Constants/constants';

function ColeccionesMarcas({ marca }) {
  const { t } = useTranslation('coleccionesMarcas');
  const [imagenes, setImagenes] = useState({});
  const navigate = useNavigate();


  const colecciones = coleccionesPorMarca[marca] || [];

  useEffect(() => {
    const fetchImagenes = async () => {
      const nuevasImagenes = {};

      await Promise.all(colecciones.map(async (coleccion) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/ftp/image?marca=${marca}&coleccion=${encodeURIComponent(coleccion)}`
          );
          const data = await response.json();
          nuevasImagenes[coleccion] = data.imageUrl || null;
        } catch {
          nuevasImagenes[coleccion] = null;
        }
      }));

      setImagenes(nuevasImagenes);
    };

    fetchImagenes();
  }, [marca]);

  const handleClick = (coleccion) => {
    navigate(`/products?collection=${encodeURIComponent(coleccion)}`);
  };

  return (
    <CartProvider>
      <div className="mt-[20%] md:mt-[10%] lg:mt-[5%] xl:mt-[3%] px-5">
        <div className="flex items-center justify-center h-full pt-7">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mx-auto">
            {t('title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5">
          {colecciones.map((coleccion, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(coleccion)}
              className="relative group cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden bg-white w-full"
            >
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg md:hidden lg:hidden xl:hidden">
                {t('mobileHint')}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 group-hover:bg-opacity-30 transition duration-300">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white text-center px-4 py-2 bg-opacity-80 rounded-md">
                  {coleccion}
                </h1>
              </div>

              <CarruselColecciones imageUrl={imagenes[coleccion]} />
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default ColeccionesMarcas;
