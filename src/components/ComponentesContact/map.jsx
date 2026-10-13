import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import "maplibre-gl/dist/maplibre-gl.css";
import "./storeLocatorResponsive.css";

import { getPuntosVenta } from "../../services/puntosVentaApi.js";
import { useStoreLocatorController } from "../../components/hooks/useStoreLocatorController.js";
import StorePanel from "./StorePanel.jsx";
import { normalizeStores } from "../../utils/storeLocator.js";
import { availableCountries, availableProvinces } from "../../utils/storeRegions.js";

function StoreLocator({
  stores,
  embedded,
  showAllStoresOnLoad,
  t,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  // Usamos los mismos puntos válidos que utiliza MapLibre. Cada opción de los
  // desplegables tiene al menos un punto real y visible en el localizador.
  const validStores = useMemo(() => normalizeStores(stores), [stores]);
  const countries = useMemo(() => availableCountries(validStores), [validStores]);
  const provinces = useMemo(
    () => availableProvinces(validStores, selectedCountry),
    [validStores, selectedCountry]
  );
  const hasRegionFilter = Boolean(selectedCountry || selectedProvince);

  const {
    mapContainerRef,
    cityName,
    setCityName,
    mapReady,
    origin,
    nearbyStores,
    allStoresByDistance,
    filteredStores,
    clearStoreSelection,
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
    showAllStoresOnLoad,
    selectedCountry,
    selectedProvince,
  });

  /*
   * Sincroniza el estado de mapa expandido
   * con el controlador y fuerza el resize
   * de MapLibre después del cambio de layout.
   */
  useEffect(() => {
    setExpandedView(isExpanded);

    let secondFrame = null;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        resizeMap();
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);

      if (secondFrame !== null) {
        cancelAnimationFrame(secondFrame);
      }
    };
  }, [isExpanded, resizeMap, setExpandedView]);

  // Ajusta el lienzo de MapLibre cuando cambia el tamaño del contenedor.
  // Es especialmente importante al redimensionar la modal en escritorio.
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return undefined;
    const container = mapContainerRef.current;
    if (!container) return undefined;
    const observer = new ResizeObserver(() => resizeMap());
    observer.observe(container);
    return () => observer.disconnect();
  }, [resizeMap, mapContainerRef]);

  /*
   * Cuando el mapa está expandido:
   * - bloqueamos el scroll de la página
   * - permitimos cerrar con Escape
   */
  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const searchButtonText = isGeocodeLoading
    ? t("searchLoading")
    : t("searchButton");

  const locationButtonText = isLocationLoading
    ? t("locationLoading")
    : t("useMyLocationButton");

  const routeErrorText =
    routeErrorCode === "QUOTA_EXCEEDED"
      ? t("quotaExceeded")
      : routeErrorCode === "ROUTE_ERROR"
        ? t("routeError")
        : routeErrorCode === "SEARCH_LOCATION_FIRST"
          ? t("searchLocationFirst")
          : null;

  const hasNoNearbyStores =
    Boolean(origin) && nearbyStores.length === 0 && !hasRegionFilter;

  const onCountryChange = (event) => {
    clearStoreSelection();
    setSelectedCountry(event.target.value);
    setSelectedProvince("");
  };

  const onProvinceChange = (event) => {
    clearStoreSelection();
    setSelectedProvince(event.target.value);
  };

  const clearRegionFilters = () => {
    clearStoreSelection();
    setSelectedCountry("");
    setSelectedProvince("");
  };

  useEffect(() => {
    if (selectedCountry && !countries.some((country) => country.value === selectedCountry)) {
      clearStoreSelection();
      setSelectedCountry("");
      setSelectedProvince("");
    } else if (selectedProvince && !provinces.some((province) => province.value === selectedProvince)) {
      clearStoreSelection();
      setSelectedProvince("");
    }
  }, [countries, provinces, selectedCountry, selectedProvince, clearStoreSelection]);

  /*
   * Vista normal:
   * - establecimientos dentro del radio
   * - o el más próximo
   *
   * Modal "Dónde comprar":
   * - todas las tiendas al abrir
   *
   * Vista expandida:
   * - todas ordenadas por distancia
   */
  const compactPanelStores =
    nearbyStores.length > 0
      ? nearbyStores
      : nearestStoreOutsideRadius
        ? [nearestStoreOutsideRadius]
        : [];

  const panelStores = hasRegionFilter
    ? allStoresByDistance
    : isExpanded
      ? allStoresByDistance
      : showAllStoresOnLoad && !origin
        ? filteredStores
        : compactPanelStores;

  const showStoresPanel =
    isExpanded ||
    !embedded ||
    showAllStoresOnLoad;

  return (
    <section
      className={`cjmw-store-locator ${showAllStoresOnLoad ? "cjmw-store-locator--modal" : ""} ${isExpanded ? "cjmw-store-locator--expanded" : ""} ${
        isExpanded
          ? `
              fixed inset-0 z-[9999]
              overflow-hidden
              bg-gradient-to-r
              from-[#ebdecf]
              to-[#8a7862]
              p-2 sm:p-4
            `
          : showAllStoresOnLoad
            ? `
      w-full
      bg-white
      lg:h-full
      lg:overflow-hidden
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
      }`}
    >
      {!embedded && !isExpanded && (
        <div className="mx-auto max-w-2xl py-[5%] text-center xl:pb-[5%]">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t("findUsTitle")}
          </h2>
        </div>
      )}

      <div
        className={`cjmw-store-layout ${
          isExpanded
            ? `
                grid h-full min-h-0
                grid-cols-1 gap-4
                lg:grid-cols-[350px_minmax(0,1fr)]
              `
            : showAllStoresOnLoad
              ? `
              grid
              grid-cols-1
              gap-4
              bg-white
              lg:h-full
              lg:min-h-0
              lg:grid-cols-[350px_minmax(0,1fr)]
              lg:overflow-hidden
    `
              : embedded
                ? "w-full"
                : `
                    grid grid-cols-4
                    gap-4
                    lg:grid-cols-4
                    xl:grid-cols-4
                  `
        }`}
      >
        {/* MAPA */}
        <div
          className={`cjmw-store-map-column ${
            showAllStoresOnLoad && !isExpanded
              ? `
                order-1
                min-w-0
                bg-white
                lg:order-2
                lg:flex
                lg:h-full
                lg:min-h-0
                lg:flex-col
                lg:overflow-y-auto
              `
              : isExpanded
                ? "min-h-0 min-w-0 lg:order-2"
                : embedded
                  ? "w-full"
                  : `
                      col-span-4
                      lg:col-span-3
                      xl:col-span-3
                    `
          }`}
        >
          {/* FILTROS DE PAÍS / PROVINCIA, GENERADOS DE LA API */}
          <div className="cjmw-store-filters mb-3 grid grid-cols-1 items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:mb-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:p-2">
            <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-slate-700">
              {t("countryFilterLabel")}
              <select
                value={selectedCountry}
                onChange={onCountryChange}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 lg:h-9 lg:py-1.5 focus:border-[#26659E] focus:outline-none focus:ring-2 focus:ring-[#26659E]/20"
              >
                <option value="">{t("allCountries")}</option>
                {countries.map((country) => (
                  <option value={country.value} key={country.value}>{country.label}</option>
                ))}
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-slate-700">
              {t("provinceFilterLabel")}
              <select
                value={selectedProvince}
                onChange={onProvinceChange}
                disabled={!selectedCountry || provinces.length === 0}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 lg:h-9 lg:py-1.5 focus:border-[#26659E] focus:outline-none focus:ring-2 focus:ring-[#26659E]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">{t("allProvinces")}</option>
                {provinces.map((province) => (
                  <option value={province.value} key={province.value}>{province.label}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={clearRegionFilters}
              disabled={!hasRegionFilter}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 lg:h-9 lg:px-3 lg:py-1.5 transition hover:border-[#26659E] hover:text-[#26659E] disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 lg:col-span-1"
            >
              {t("clearRegionFilters")}
            </button>
            {hasRegionFilter && (
              <p className="text-xs text-slate-600 sm:col-span-2 lg:col-span-3" aria-live="polite">
                {t("filteredStoresCount", { count: filteredStores.length })}
              </p>
            )}
            {countries.length === 0 && (
              <p className="text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
                {t("countryFilterUnavailable")}
              </p>
            )}
            {selectedCountry && provinces.length === 0 && (
              <p className="text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
                {t("provinceFilterUnavailable")}
              </p>
            )}
          </div>

          {/* BUSCADOR */}
          <form
            onSubmit={handleSearchSubmit}
            className={`cjmw-store-search ${
              showAllStoresOnLoad && !isExpanded
                ? `
                  mx-auto
                  mb-4
                  flex
                  w-full
                  flex-col
                  gap-2
                  bg-white
                  px-1
                  sm:px-2
                  md:flex-row
                  md:items-stretch
                  md:justify-center
                  lg:mb-2 lg:justify-start lg:gap-2 lg:px-0
                `
                : embedded && !isExpanded
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
            }`}
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
                setCityName(event.target.value)
              }
              placeholder={t("inputPlaceholder")}
              maxLength={160}
              disabled={isBusy}
              className="
                input-clase
                w-full min-w-0
                rounded-xl
                border border-neutral-300
                bg-white
                px-4 py-3
                lg:h-10 lg:py-2 lg:text-sm
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

            {embedded && !isExpanded ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={
                    isBusy ||
                    cityName.trim().length < 2
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
                  onClick={handleUseMyLocation}
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
                    cityName.trim().length < 2
                  }
                  className="
                    btn-clase
                    rounded-xl
                    bg-[#26659E]
                    px-5 py-3
                    lg:h-10 lg:px-4 lg:py-2 lg:text-sm lg:whitespace-nowrap
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
                  onClick={handleUseMyLocation}
                  disabled={isBusy}
                  className="
                    rounded-xl
                    border border-white
                    bg-white/95
                    px-5 py-3
                    lg:h-10 lg:px-4 lg:py-2 lg:text-sm lg:whitespace-nowrap
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

                ${embedded && !isExpanded
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

                ${embedded && !isExpanded
                  ? "text-neutral-600"
                  : "text-white"
                }
              `}
            >
              {t("mapLoading")}
            </div>
          )}

          {/* CONTENEDOR MAPA: flexibilidad vertical dentro de la modal */}
          <div className={`cjmw-store-map-shell ${showAllStoresOnLoad && !isExpanded
            ? "relative lg:min-h-[260px] lg:flex-1"
            : "relative"
          }`}>
            {!showAllStoresOnLoad && (
              <button
                type="button"
                onClick={() =>
                  setIsExpanded(
                    (current) => !current
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

                  ${embedded && !isExpanded
                    ? "right-3"
                    : "left-3"
                  }
                `}
                aria-pressed={isExpanded}
              >
                {isExpanded
                  ? t("closeExpandedMapButton")
                  : t("expandMapButton")}
              </button>
            )}

            <div
              ref={mapContainerRef}
              className={`
                cjmw-store-map-canvas
                w-full
                overflow-hidden
                shadow-sm
                ${showAllStoresOnLoad && !isExpanded
                  ? "h-[clamp(340px,55dvh,620px)] lg:h-full"
                  : ""
                }
              `}
              style={{
                height: isExpanded
                  ? "calc(100dvh - 8.5rem)"
                  : showAllStoresOnLoad
                    ? undefined
                    : embedded
                      ? "420px"
                      : "65vh",
                minHeight: isExpanded
                  ? "420px"
                  : showAllStoresOnLoad
                    ? undefined
                    : embedded
                      ? "320px"
                      : "360px",

                borderRadius:
                  isExpanded ||
                    showAllStoresOnLoad
                    ? "1rem"
                    : embedded
                      ? "0 0 1rem 1rem"
                      : "1rem",
              }}
              aria-label={t("mapAriaLabel")}
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

                  ${embedded && !isExpanded
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
                      nearestStoreOutsideRadius.distanceKm.toFixed(
                        1
                      ),
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

                  ${embedded && !isExpanded
                    ? "mx-3 mb-3"
                    : "mx-2"
                  }
                `}
              >
                {t("noNearbyStores")}
              </div>
            )}

          {/* RESUMEN DE RUTA SELECCIONADA */}
          {selectedStore &&
            (!embedded ||
              isExpanded ||
              showAllStoresOnLoad) && (
              <div
                className="
                  mx-2 mt-4
                  overflow-hidden
                  rounded-2xl
                  border border-neutral-200
                  bg-white
                  px-5 py-4
                  text-sm
                  text-neutral-700
                  shadow-sm
                "
              >
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-neutral-950">
                    {selectedStore.title}
                  </p>

                  {selectedStore.direccion && (
                    <p className="text-neutral-500">
                      {selectedStore.direccion}
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
                          {selectedStore.telefono}
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
                          {selectedStore.correo}
                        </a>
                      )}
                    </div>
                  )}

                {Number.isFinite(
                  selectedStore.distanceKm
                ) && (
                    <p className="mt-3 font-semibold text-[#26659E]">
                      {t("distanceFromYou", {
                        distance:
                          selectedStore.distanceKm.toFixed(
                            1
                          ),
                      })}
                    </p>
                  )}

                {isRouteLoading && (
                  <p className="mt-3 font-medium text-[#26659E]">
                    {t("routeLoading")}
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
                      <p className="text-base font-semibold text-neutral-950">
                        {routeSummary.distanceKm.toFixed(
                          1
                        )}{" "}
                        km
                      </p>

                      <p className="text-xs uppercase tracking-wide text-neutral-400">
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
                      <p className="text-base font-semibold text-neutral-950">
                        {Math.round(
                          routeSummary.durationMinutes
                        )}{" "}
                        min
                      </p>

                      <p className="text-xs uppercase tracking-wide text-neutral-400">
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
                  <p className="mt-3 font-medium text-red-700">
                    {routeErrorText}
                  </p>
                )}

                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
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
                    {t("openInGoogleMaps")}
                    <span className="ml-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            )}
        </div>

        {/* PUNTOS DE VENTA */}
        {showStoresPanel && (
          <div
            className={`cjmw-store-panel-container ${
              showAllStoresOnLoad && !isExpanded
                ? `
            order-1
            h-full
            min-h-0
            overflow-y-auto
            overflow-x-hidden
            bg-white
            pr-2
          `
                : isExpanded ? "min-h-0 lg:order-1" : "min-h-0"
            }`}
          >
            <StorePanel
              stores={panelStores}
              hasRegionFilter={hasRegionFilter}
              origin={origin}
              nearbyStores={nearbyStores}
              nearestStoreOutsideRadius={
                nearestStoreOutsideRadius
              }
              selectedStore={selectedStore}
              onSelect={handleStoreSelection}
              isExpanded={isExpanded}
              t={t}
            />
          </div>
        )}
      </div>
    </section>
  );
}

const GeocodingService = ({
  embedded = false,
  showAllStoresOnLoad = false,
}) => {
  const { t } = useTranslation(
    "geocodingService"
  );

  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] =
    useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadStores = async () => {
      setStoresLoading(true);

      try {
        const puntosVenta =
          await getPuntosVenta({
            signal: controller.signal,
          });

        if (controller.signal.aborted) {
          return;
        }

        setStores(puntosVenta);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error(
          "Error cargando puntos de venta:",
          error
        );

        setStores([]);
      } finally {
        if (!controller.signal.aborted) {
          setStoresLoading(false);
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
          showAllStoresOnLoad
            ? `
                h-full w-full
                bg-white
              `
            : embedded
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
              {t("findUsTitle")}
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

            ${embedded ||
              showAllStoresOnLoad
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
      showAllStoresOnLoad={
        showAllStoresOnLoad
      }
      t={t}
    />
  );
};

export default GeocodingService;