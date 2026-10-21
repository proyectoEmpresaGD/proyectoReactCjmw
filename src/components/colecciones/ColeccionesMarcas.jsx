// src/components/colecciones/ColeccionesMarcas.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CartProvider } from "../CartContext";
import { coleccionesPorMarca } from "../../Constants/constants";
import { cdnUrl } from "../../Constants/cdn";

const normalizeKey = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "AND")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();

const CarruselColecciones = ({
  imageUrl,
  collectionName,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [imageUrl]);

  const hasImage = Boolean(imageUrl);

  return (
    <div className="relative w-full h-[35vh] sm:h-[45vh] bg-gray-100 rounded-xl overflow-hidden shadow-md group">
      {!isLoaded && hasImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 bg-[length:300%_300%] animate-pulse" />
      )}

      {hasImage ? (
        <img
          src={imageUrl}
          alt={`Colección ${collectionName}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={(event) => {
            console.error(
              "Error cargando imagen de colección:",
              imageUrl
            );

            setIsLoaded(true);
            event.currentTarget.style.display = "none";
          }}
          className={`
                        object-cover
                        w-full
                        h-full
                        transition-all
                        duration-700
                        ease-in-out
                        ${isLoaded
              ? "opacity-100 blur-0 scale-100"
              : "opacity-0 blur-sm scale-105"
            }
                    `}
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
  const { t } = useTranslation("coleccionesMarcas");
  const navigate = useNavigate();

  const [imagenes, setImagenes] = useState({});

  const colecciones = useMemo(
    () => coleccionesPorMarca[marca] || [],
    [marca]
  );

  const coleccionesNorm = useMemo(
    () =>
      new Map(
        colecciones.map((coleccion) => [
          normalizeKey(coleccion),
          coleccion,
        ])
      ),
    [colecciones]
  );

  useEffect(() => {
    if (!marca || colecciones.length === 0) {
      setImagenes({});
      return;
    }

    const controller = new AbortController();

    const fetchPreviews = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL
          }/api/collections/previews/${encodeURIComponent(
            marca
          )}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Formato esperado:
         *
         * {
         *   marca: "HAR",
         *   collections: {
         *      "BOHEMIAN": "url-preview.webp",
         *      "HUSKY": "url-preview.webp"
         *   }
         * }
         */

        const byNormKey = {};

        for (const [
          nombreColeccion,
          imageUrl,
        ] of Object.entries(
          data?.collections || {}
        )) {
          const key =
            normalizeKey(nombreColeccion);

          byNormKey[key] =
            typeof imageUrl === "string" &&
              imageUrl.trim()
              ? imageUrl.trim()
              : null;
        }

        const nextImages = {};

        for (const [
          normalizedName,
          displayName,
        ] of coleccionesNorm.entries()) {
          const imageUrl =
            byNormKey[normalizedName];

          nextImages[displayName] =
            imageUrl
              ? cdnUrl(imageUrl)
              : null;
        }

        if (!controller.signal.aborted) {
          setImagenes(nextImages);
        }
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error(
          `Error cargando previews de colecciones ${marca}:`,
          error
        );

        if (!controller.signal.aborted) {
          const emptyImages = {};

          colecciones.forEach((coleccion) => {
            emptyImages[coleccion] = null;
          });

          setImagenes(emptyImages);
        }
      }
    };

    fetchPreviews();

    return () => {
      controller.abort();
    };
  }, [
    marca,
    colecciones,
    coleccionesNorm,
  ]);

  const handleClick = (coleccion) => {
    navigate(
      `/coleccion/${encodeURIComponent(
        coleccion
      )}?brand=${encodeURIComponent(
        marca
      )}`
    );
  };

  return (
    <CartProvider>
      <div className="mt-[20%] md:mt-[10%] lg:mt-[5%] xl:mt-[3%] px-5">
        <div className="flex items-center justify-center h-full pt-7">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mx-auto">
            {t("title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5">
          {colecciones.map((coleccion) => (
            <div
              key={coleccion}
              onClick={() =>
                handleClick(coleccion)
              }
              className="relative group cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden w-full"
            >
              <div className="absolute inset-0 z-20 flex items-center justify-center group-hover:bg-black/10 transition duration-300">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105">
                  {coleccion}
                </h2>
              </div>

              <CarruselColecciones
                imageUrl={
                  imagenes[coleccion]
                }
                collectionName={
                  coleccion
                }
              />
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default ColeccionesMarcas;