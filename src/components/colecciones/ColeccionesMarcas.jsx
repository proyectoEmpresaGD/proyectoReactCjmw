// ColeccionesMarcas.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartProvider } from '../CartContext';
import { coleccionesPorMarca } from '../../Constants/constants';
import { cdnUrl } from '../../Constants/cdn';

// Normaliza: sin tildes/diacríticos, sin símbolos, MAYÚSCULAS
const normalizeKey = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'AND')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();

const CarruselColecciones = ({ imageUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasImage = Boolean(imageUrl);

  return (
    <div className="relative w-full h-[35vh] sm:h-[45vh] bg-gray-100 rounded-xl overflow-hidden shadow-md group">
      {!isLoaded && hasImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 bg-[length:300%_300%] animate-pulse" />
      )}
      {hasImage ? (
        <img
          src={imageUrl}
          alt="Imagen colección"
          onLoad={() => setIsLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 ease-in-out 
            ${isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'}`}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-center text-sm text-gray-500 px-4">
          Imagen no disponible
        </div>
      )}
    </div>
  );
};

function ColeccionesMarcas({ marca }) {
  const { t } = useTranslation('coleccionesMarcas');
  const [imagenes, setImagenes] = useState({});
  const navigate = useNavigate();

  const colecciones = coleccionesPorMarca[marca] || [];

  // Mapeo normalizado de lo que pide el front (Constants)
  const coleccionesNorm = useMemo(
    () =>
      new Map(
        colecciones.map((c) => [normalizeKey(c), c]) // key normalizada -> nombre “bonito”
      ),
    [colecciones]
  );

  useEffect(() => {
    if (!marca || colecciones.length === 0) {
      setImagenes({});
      return;
    }

    const ac = new AbortController();

    const fetchTodo = async () => {
      try {
        // Pedimos TODO lo de la marca de una vez (sin FTP)
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/collections/brand/${encodeURIComponent(
          marca
        )}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json(); // { marca, collections: { "KANNATURA VOL II": [ ... ], ... } }

        // Construimos un diccionario normalizado desde el backend
        const byNormKey = {};
        for (const [nombreColeccion, arrUrls] of Object.entries(data.collections || {})) {
          const k = normalizeKey(nombreColeccion);
          byNormKey[k] = Array.isArray(arrUrls) ? arrUrls : [];
        }

        // Para cada colección que mostramos en la UI, elige una imagen (primera o aleatoria)
        const out = {};
        for (const [normKey, displayName] of coleccionesNorm.entries()) {
          const lista = byNormKey[normKey] || [];
          if (lista.length > 0) {
            // Puedes cambiar a aleatoria si prefieres:
            // const pick = lista[Math.floor(Math.random() * lista.length)];
            const pick = lista[0]; // primera
            out[displayName] = cdnUrl(pick); // reescritura a tu CDN
          } else {
            // Intenta heurística extra si no hay match exacto (p.ej. quitar VOL/II)
            // pero con nuestro normalizeKey debería bastar
            out[displayName] = null;
            // Útil para depurar colecciones que no matchean
            // console.warn('Sin imágenes para', displayName, '-> clave', normKey);
          }
        }

        if (!ac.signal.aborted) setImagenes(out);
      } catch (err) {
        console.error('Error cargando colecciones:', err);
        if (!ac.signal.aborted) {
          // al menos rellena nulos para no romper el render
          const nulos = {};
          colecciones.forEach((c) => (nulos[c] = null));
          setImagenes(nulos);
        }
      }
    };

    fetchTodo();
    return () => ac.abort();
  }, [marca, colecciones, coleccionesNorm]);

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
              <div className="absolute inset-0 z-20 flex items-center justify-center group-hover:bg-black/10 transition duration-300">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105">
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
