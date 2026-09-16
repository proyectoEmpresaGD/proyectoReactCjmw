import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "maplibre-gl/dist/maplibre-gl.css";

import { getPuntosVenta } from "../../services/puntosVentaApi.js";
import { useStoreLocatorController } from "../../components/hooks/useStoreLocatorController.js";
import StorePanel from "./StorePanel.jsx";

function StoreLocator({
  stores,
  embedded,
  t,
}) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  const {
    mapContainerRef,
    cityName,
    setCityName,
    mapReady,
    origin,
    nearbyStores,
    allStoresByDistance,
    nearestStoreOutsideRadius,
    selectedStore,
    routeSummary,
    routeErrorCode,
    searchErrorKey,
    googleMapsUrl,
    isGeocodeLoading,
    isLocationLoading,
    isRouteLoading,
    isBusy,
    handleSearchSubmit,
    handleUseMyLocation,
    handleStoreSelection,
    resizeMap,
    setExpandedView,
  } = useStoreLocatorController({
    stores,
    t,
  });

  /*
   * Sincroniza el estado de mapa expandido
   * con el controlador y fuerza el resize
   * de MapLibre después del cambio de layout.
   */
  useEffect(() => {
    setExpandedView(isExpanded);

    let secondFrame = null;

    const firstFrame =
      requestAnimationFrame(() => {
        secondFrame =
          requestAnimationFrame(() => {
            resizeMap();
          });
      });

    return () => {
      cancelAnimationFrame(firstFrame);

      if (secondFrame !== null) {
        cancelAnimationFrame(
          secondFrame
        );
      }
    };
  }, [
    isExpanded,
    resizeMap,
    setExpandedView,
  ]);

  /*
   * Cuando el mapa está expandido:
   * - bloqueamos el scroll de la página
   * - permitimos cerrar con Escape
   */
  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isExpanded]);

  const searchButtonText =
    isGeocodeLoading
      ? t("searchLoading")
      : t("searchButton");

  const locationButtonText =
    isLocationLoading
      ? t("locationLoading")
      : t("useMyLocationButton");

  const routeErrorText =
    routeErrorCode === "QUOTA_EXCEEDED"
      ? t("quotaExceeded")
      : routeErrorCode === "ROUTE_ERROR"
        ? t("routeError")
        : routeErrorCode ===
          "SEARCH_LOCATION_FIRST"
          ? t("searchLocationFirst")
          : null;

  const hasNoNearbyStores =
    Boolean(origin) &&
    nearbyStores.length === 0;

  /*
   * En vista normal solo mostramos:
   * - establecimientos dentro del radio
   * - o el más próximo si no existe ninguno dentro
   *
   * En vista expandida mostramos todos,
   * ordenados por distancia desde el controlador.
   */
  const compactPanelStores =
    nearbyStores.length > 0
      ? nearbyStores
      : nearestStoreOutsideRadius
        ? [
          nearestStoreOutsideRadius,
        ]
        : [];

  const panelStores = isExpanded
    ? allStoresByDistance
    : compactPanelStores;

  return (
    <section
      className={
        isExpanded
          ? `
              fixed inset-0 z-[9999]
              overflow-hidden
              bg-gradient-to-r
              from-[#ebdecf]
              to-[#8a7862]
              p-2 sm:p-4
            `
          : embedded
            ? `
                w-full overflow-hidden
                rounded-2xl
                border border-neutral-200
                bg-white
                shadow-lg
              `
            : `
                mx-auto
                bg-gradient-to-r
                from-[#ebdecf]
                to-[#8a7862]
                pb-[10%]
                lg:px-[5%]
                xl:pb-[5%]
              `
      }
    >
      {!embedded &&
        !isExpanded && (
          <div className="mx-auto max-w-2xl py-[5%] text-center xl:pb-[5%]">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t("findUsTitle")}
            </h2>
          </div>
        )}

      <div
        className={
          isExpanded
            ? `
                grid h-full min-h-0
                grid-cols-1 gap-4
                lg:grid-cols-[minmax(0,1fr)_400px]
              `
            : embedded
              ? "w-full"
              : `
                  grid grid-cols-4
                  gap-4
                  lg:grid-cols-4
                  xl:grid-cols-4
                `
        }
      >
        {/* MAPA */}
        <div
          className={
            isExpanded
              ? "min-w-0 min-h-0"
              : embedded
                ? "w-full"
                : `
                    col-span-4
                    lg:col-span-3
                    xl:col-span-3
                  `
          }
        >
          {/* BUSCADOR */}
          <form
            onSubmit={handleSearchSubmit}
            className={
              embedded &&
                !isExpanded
                ? `
                    mx-auto mb-0
                    flex w-full
                    flex-col gap-2
                    bg-white
                    p-3 sm:p-4
                  `
                : `
                    mx-auto mb-4
                    flex w-full
                    max-w-4xl
                    flex-col gap-2
                    px-2
                    text-center
                    sm:flex-row
                    sm:items-stretch
                    sm:justify-center
                  `
            }
          >
            <label
              htmlFor="store-locator-search"
              className="sr-only"
            >
              {t("inputPlaceholder")}
            </label>

            <input
              id="store-locator-search"
              type="text"
              value={cityName}
              onChange={(event) =>
                setCityName(
                  event.target.value
                )
              }
              placeholder={t(
                "inputPlaceholder"
              )}
              maxLength={160}
              disabled={isBusy}
              className="
                input-clase
                w-full min-w-0
                rounded-xl
                border border-neutral-300
                bg-white
                px-4 py-3
                text-neutral-900
                outline-none
                transition
                focus:border-[#26659E]
                focus:ring-2
                focus:ring-[#26659E]/20
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            />

            {embedded &&
              !isExpanded ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={
                    isBusy ||
                    cityName
                      .trim()
                      .length < 2
                  }
                  className="
                    btn-clase
                    w-full
                    rounded-xl
                    bg-[#26659E]
                    px-5 py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#1f527f]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {searchButtonText}
                </button>

                <button
                  type="button"
                  onClick={
                    handleUseMyLocation
                  }
                  disabled={isBusy}
                  className="
                    w-full
                    rounded-xl
                    border border-neutral-300
                    bg-neutral-100
                    px-5 py-3
                    font-semibold
                    text-neutral-900
                    transition
                    hover:bg-neutral-200
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {locationButtonText}
                </button>
              </div>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={
                    isBusy ||
                    cityName
                      .trim()
                      .length < 2
                  }
                  className="
                    btn-clase
                    rounded-xl
                    bg-[#26659E]
                    px-5 py-3
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#1f527f]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {searchButtonText}
                </button>

                <button
                  type="button"
                  onClick={
                    handleUseMyLocation
                  }
                  disabled={isBusy}
                  className="
                    rounded-xl
                    border border-white
                    bg-white/95
                    px-5 py-3
                    font-semibold
                    text-neutral-900
                    shadow-sm
                    transition
                    hover:bg-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {locationButtonText}
                </button>
              </>
            )}
          </form>

          {/* ERROR DE BÚSQUEDA */}
          {searchErrorKey && (
            <div
              className={`
                mb-4
                rounded-xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-sm font-medium
                text-red-700

                ${embedded &&
                  !isExpanded
                  ? "mx-3"
                  : "mx-2"
                }
              `}
              role="alert"
            >
              {t(searchErrorKey)}
            </div>
          )}

          {/* CARGANDO MAPA */}
          {!mapReady && (
            <div
              className={`
                mb-2
                text-center
                text-sm font-medium

                ${embedded &&
                  !isExpanded
                  ? "text-neutral-600"
                  : "text-white"
                }
              `}
            >
              {t("mapLoading")}
            </div>
          )}

          {/* CONTENEDOR MAPA */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsExpanded(
                  (current) =>
                    !current
                )
              }
              className={`
                absolute top-3 z-20
                rounded-xl
                bg-neutral-900/90
                px-4 py-2
                text-sm font-semibold
                text-white
                shadow-lg
                backdrop-blur
                transition
                hover:bg-neutral-700

                ${embedded &&
                  !isExpanded
                  ? "right-3"
                  : "left-3"
                }
              `}
              aria-pressed={
                isExpanded
              }
            >
              {isExpanded
                ? t(
                  "closeExpandedMapButton"
                )
                : t(
                  "expandMapButton"
                )}
            </button>

            <div
              ref={
                mapContainerRef
              }
              className="
                w-full
                overflow-hidden
                shadow-sm
              "
              style={{
                height: isExpanded
                  ? "calc(100dvh - 8.5rem)"
                  : embedded
                    ? "420px"
                    : "65vh",

                minHeight:
                  isExpanded
                    ? "420px"
                    : embedded
                      ? "320px"
                      : "360px",

                borderRadius:
                  isExpanded
                    ? "1rem"
                    : embedded
                      ? "0 0 1rem 1rem"
                      : "1rem",
              }}
              aria-label={t(
                "mapAriaLabel"
              )}
            />
          </div>

          {/* SIN PUNTOS CERCANOS */}
          {hasNoNearbyStores &&
            nearestStoreOutsideRadius && (
              <div
                className={`
                  mt-4
                  rounded-xl
                  border border-amber-200
                  bg-amber-50
                  px-4 py-3
                  text-center
                  text-sm font-medium
                  text-amber-900

                  ${embedded &&
                    !isExpanded
                    ? "mx-3 mb-3"
                    : "mx-2"
                  }
                `}
              >
                {t(
                  "noNearbyStoresWithNearest",
                  {
                    store:
                      nearestStoreOutsideRadius.title,

                    distance:
                      nearestStoreOutsideRadius
                        .distanceKm
                        .toFixed(1),
                  }
                )}
              </div>
            )}

          {hasNoNearbyStores &&
            !nearestStoreOutsideRadius && (
              <div
                className={`
                  mt-4
                  rounded-xl
                  border border-white/60
                  bg-white/95
                  px-4 py-3
                  text-center
                  text-sm font-medium
                  text-neutral-800

                  ${embedded &&
                    !isExpanded
                    ? "mx-3 mb-3"
                    : "mx-2"
                  }
                `}
              >
                {t(
                  "noNearbyStores"
                )}
              </div>
            )}

          {/* RESUMEN DE RUTA SELECCIONADA */}
          {selectedStore &&
            (!embedded ||
              isExpanded) && (
              <div
                className="
                  mx-2 mt-4
                  overflow-hidden
                  rounded-2xl
                  border border-white/50
                  bg-white/95
                  px-5 py-4
                  text-sm
                  text-neutral-700
                  shadow-sm
                  backdrop-blur
                "
              >
                <div className="flex flex-col gap-1">
                  <p
                    className="
                      text-base
                      font-semibold
                      text-neutral-950
                    "
                  >
                    {
                      selectedStore.title
                    }
                  </p>

                  {selectedStore.direccion && (
                    <p className="text-neutral-500">
                      {
                        selectedStore.direccion
                      }
                    </p>
                  )}
                </div>

                {(selectedStore.telefono ||
                  selectedStore.correo) && (
                    <div
                      className="
                      mt-3
                      flex flex-wrap
                      gap-x-4 gap-y-1
                      border-t
                      border-neutral-100
                      pt-3
                    "
                    >
                      {selectedStore.telefono && (
                        <a
                          href={`tel:${selectedStore.telefono}`}
                          className="
                          font-medium
                          text-neutral-600
                          transition
                          hover:text-[#26659E]
                        "
                        >
                          {
                            selectedStore.telefono
                          }
                        </a>
                      )}

                      {selectedStore.correo && (
                        <a
                          href={`mailto:${selectedStore.correo}`}
                          className="
                          break-all
                          font-medium
                          text-neutral-600
                          transition
                          hover:text-[#26659E]
                        "
                        >
                          {
                            selectedStore.correo
                          }
                        </a>
                      )}
                    </div>
                  )}

                {Number.isFinite(
                  selectedStore.distanceKm
                ) && (
                    <p
                      className="
                      mt-3
                      font-semibold
                      text-[#26659E]
                    "
                    >
                      {t(
                        "distanceFromYou",
                        {
                          distance:
                            selectedStore
                              .distanceKm
                              .toFixed(1),
                        }
                      )}
                    </p>
                  )}

                {isRouteLoading && (
                  <p
                    className="
                      mt-3
                      font-medium
                      text-[#26659E]
                    "
                  >
                    {t(
                      "routeLoading"
                    )}
                  </p>
                )}

                {routeSummary && (
                  <div
                    className="
                      mt-4
                      flex gap-8
                      border-t
                      border-neutral-100
                      pt-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-base
                          font-semibold
                          text-neutral-950
                        "
                      >
                        {routeSummary.distanceKm.toFixed(
                          1
                        )}{" "}
                        km
                      </p>

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-wide
                          text-neutral-400
                        "
                      >
                        {t(
                          "drivingDistanceLabel",
                          {
                            defaultValue:
                              "En coche",
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <p
                        className="
                          text-base
                          font-semibold
                          text-neutral-950
                        "
                      >
                        {Math.round(
                          routeSummary.durationMinutes
                        )}{" "}
                        min
                      </p>

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-wide
                          text-neutral-400
                        "
                      >
                        {t(
                          "estimatedDurationLabel",
                          {
                            defaultValue:
                              "Aprox.",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {routeErrorText && (
                  <p
                    className="
                      mt-3
                      font-medium
                      text-red-700
                    "
                  >
                    {
                      routeErrorText
                    }
                  </p>
                )}

                {googleMapsUrl && (
                  <a
                    href={
                      googleMapsUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      mt-4
                      inline-flex
                      font-semibold
                      text-[#26659E]
                      transition
                      hover:text-[#1f527f]
                    "
                  >
                    {t(
                      "openInGoogleMaps"
                    )}
                    <span className="ml-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            )}
        </div>

        {/* PANEL DERECHO */}
        {(isExpanded ||
          !embedded) && (
            <StorePanel
              stores={panelStores}
              origin={origin}
              nearbyStores={
                nearbyStores
              }
              nearestStoreOutsideRadius={
                nearestStoreOutsideRadius
              }
              selectedStore={
                selectedStore
              }
              onSelect={
                handleStoreSelection
              }
              isExpanded={
                isExpanded
              }
              t={t}
            />
          )}
      </div>
    </section>
  );
}

const GeocodingService = ({
  embedded = false,
}) => {
  const { t } = useTranslation(
    "geocodingService"
  );

  const [stores, setStores] =
    useState([]);

  const [
    storesLoading,
    setStoresLoading,
  ] = useState(true);

  useEffect(() => {
    const controller =
      new AbortController();

    const loadStores =
      async () => {
        setStoresLoading(true);

        try {
          const puntosVenta =
            await getPuntosVenta({
              signal:
                controller.signal,
            });

          if (
            controller.signal.aborted
          ) {
            return;
          }

          setStores(
            puntosVenta
          );
        } catch (error) {
          if (
            error?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "Error cargando puntos de venta:",
            error
          );

          setStores([]);
        } finally {
          if (
            !controller.signal.aborted
          ) {
            setStoresLoading(
              false
            );
          }
        }
      };

    loadStores();

    return () => {
      controller.abort();
    };
  }, []);

  if (storesLoading) {
    return (
      <section
        className={
          embedded
            ? `
                w-full
                overflow-hidden
                rounded-2xl
                border border-neutral-200
                bg-white
                shadow-lg
              `
            : `
                mx-auto
                bg-gradient-to-r
                from-[#ebdecf]
                to-[#8a7862]
                pb-[10%]
                lg:px-[5%]
                xl:pb-[5%]
              `
        }
      >
        {!embedded && (
          <div className="mx-auto max-w-2xl py-[5%] text-center xl:pb-[5%]">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t(
                "findUsTitle"
              )}
            </h2>
          </div>
        )}

        <div
          className={`
            flex
            items-center
            justify-center
            text-center
            font-medium

            ${embedded
              ? `
                    min-h-[320px]
                    text-neutral-600
                  `
              : `
                    min-h-[360px]
                    text-white
                  `
            }
          `}
          role="status"
        >
          {t("mapLoading")}
        </div>
      </section>
    );
  }

  return (
    <StoreLocator
      stores={stores}
      embedded={embedded}
      t={t}
    />
  );
};

export default GeocodingService;