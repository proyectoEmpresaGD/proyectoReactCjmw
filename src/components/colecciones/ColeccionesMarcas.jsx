// src/components/ColeccionesMarcas.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartProvider } from '../CartContext';
import CarruselColecciones from '../ComponentesBrands/CarruselColecciones';
import { imageSet } from '../../Constants/constants';
import { useTranslation } from 'react-i18next';

function ColeccionesMarcas({ marca }) {
  const { t } = useTranslation('coleccionesMarcas');
  const [colecciones, setColecciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageSetsForMarca = imageSet[marca] || {};
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let isMounted = true;

    const fetchCollectionsByBrand = async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/products/getCollectionsByBrand?brand=${marca}`;
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`${t('httpError')} ${response.status}`);

        let data = await response.json();

        // Filtrados según marca
        if (marca === "CJM") {
          data = data.filter(c => c !== "REVOLTOSO");
        } else if (marca === "ARE") {
          data = data.filter(c => !["VELVETY", "LIGHTHOUSE"].includes(c));
        } else if (marca === "FLA") {
          data = data.filter(c => !["REVOLTOSO VOL II", "LUXURY DRAPES"].includes(c));
        } else if (marca === "HAR") {
          data = data.filter(c => !["RUSTICA", "CARIBEAN PARTY", "RIVIERA"].includes(c));
        }

        if (isMounted) setColecciones(data);
      } catch (err) {
        console.error(`[ColeccionesMarcas] ${err}`);
        if (retryCount < MAX_RETRIES && isMounted) {
          setTimeout(() => setRetryCount(prev => prev + 1), 1000);
        } else if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (marca) fetchCollectionsByBrand();
    return () => { isMounted = false; };
  }, [marca, retryCount, t]);

  const handleCollectionClick = (coleccion) => {
    navigate(`/products?collection=${encodeURIComponent(coleccion)}`);
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-center text-red-600">{t('errorPrefix')} {error}</div>;
  if (colecciones.length === 0)
    return <div className="text-center">{t('noCollections', { marca })}</div>;

  return (
    <CartProvider>
      <div className="mt-[20%] md:mt-[10%] lg:mt-[5%] xl:mt-[3%] px-5">
        <div className="flex items-center justify-center h-full pt-7">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mx-auto">
            {t('title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 py-5">
          {colecciones.map((coleccion, idx) => (
            <div
              key={idx}
              onClick={() => handleCollectionClick(coleccion)}
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

              {imageSetsForMarca[coleccion] && (
                <CarruselColecciones imageSets={imageSetsForMarca[coleccion]} />
              )}
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default ColeccionesMarcas;
