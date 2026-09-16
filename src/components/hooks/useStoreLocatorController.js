import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { createStoreMapPopup } from "../ComponentesContact/StoreMapPopup.js";
import {
    geocodeLocation,
    requestDrivingRoute,
} from "../../services/mapsApi.js";

import {
    SEARCH_RADIUS_KM,
    buildRadiusCircleGeoJson,
    getGoogleMapsDirectionsUrl,
    haversineDistanceKm,
    isValidCoordinate,
    normalizeStores,
} from "../../utils/storeLocator.js";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

export const MAP_STYLE_URL =
    "https://tiles.openfreemap.org/styles/liberty";

const DEFAULT_CENTER = {
    lat: 40.436437195598145,
    lng: -3.693919201706416,
};

const DEFAULT_ZOOM = 8;
const ROUTE_SOURCE_ID = "store-locator-route";
const ROUTE_LAYER_ID = "store-locator-route-line";
const RADIUS_SOURCE_ID = "store-locator-radius";
const RADIUS_FILL_LAYER_ID = "store-locator-radius-fill";
const RADIUS_LINE_LAYER_ID = "store-locator-radius-line";

const EMPTY_FEATURE_COLLECTION = {
    type: "FeatureCollection",
    features: [],
};

function getRouteSummary(routeGeoJson) {
    const summary = routeGeoJson?.features?.[0]?.properties?.summary;

    if (!summary) return null;

    const distanceMeters = Number(summary.distance);
    const durationSeconds = Number(summary.duration);

    if (!Number.isFinite(distanceMeters) || !Number.isFinite(durationSeconds)) {
        return null;
    }

    return {
        distanceKm: distanceMeters / 1000,
        durationMinutes: Math.max(1, Math.round(durationSeconds / 60)),
    };
}

function extendBoundsWithGeometry(bounds, geometry) {
    if (!geometry) return;

    if (geometry.type === "LineString") {
        geometry.coordinates.forEach((coordinate) => bounds.extend(coordinate));
        return;
    }

    if (geometry.type === "MultiLineString") {
        geometry.coordinates.forEach((line) => {
            line.forEach((coordinate) => bounds.extend(coordinate));
        });
    }
}

function addDistanceData(origin, stores) {
    return stores
        .map((store) => {
            const distanceKm = haversineDistanceKm(origin, store);

            return {
                ...store,
                distanceKm,
                isWithinRadius: distanceKm <= SEARCH_RADIUS_KM,
            };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function useStoreLocatorController({ stores, t }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const storeMarkersRef = useRef([]);
    const customerMarkerRef = useRef(null);
    const popupRef = useRef(null);
    const activePopupStoreRef = useRef(null);
    const originRef = useRef(null);
    const geocodeAbortRef = useRef(null);
    const routeAbortRef = useRef(null);
    const activeRouteKeyRef = useRef(null);
    const storeSelectionHandlerRef = useRef(null);
    const routeRequestHandlerRef = useRef(null);
    const openStorePopupRef = useRef(null);
    const isExpandedRef = useRef(false);

    const routeStatusRef = useRef({
        storeId: null,
        loading: false,
        summary: null,
        errorCode: null,
    });

    const [cityName, setCityName] = useState("");
    const [mapReady, setMapReady] = useState(false);
    const [origin, setOrigin] = useState(null);
    const [nearbyStores, setNearbyStores] = useState([]);
    const [allStoresByDistance, setAllStoresByDistance] = useState([]);
    const [nearestStoreOutsideRadius, setNearestStoreOutsideRadius] =
        useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [routeSummary, setRouteSummary] = useState(null);
    const [routeErrorCode, setRouteErrorCode] = useState(null);
    const [searchErrorKey, setSearchErrorKey] = useState(null);
    const [isGeocodeLoading, setIsGeocodeLoading] = useState(false);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [isRouteLoading, setIsRouteLoading] = useState(false);

    const validStores = useMemo(() => normalizeStores(stores), [stores]);

    const closePopup = useCallback(() => {
        popupRef.current?.remove();
        popupRef.current = null;
        activePopupStoreRef.current = null;
    }, []);

    const clearRoute = useCallback(({ abortRequest = false } = {}) => {
        if (abortRequest) {
            routeAbortRef.current?.abort();
            routeAbortRef.current = null;
            activeRouteKeyRef.current = null;
        }

        const map = mapRef.current;
        const source = map?.getSource(ROUTE_SOURCE_ID);

        if (source && typeof source.setData === "function") {
            source.setData(EMPTY_FEATURE_COLLECTION);
        }

        routeStatusRef.current = {
            storeId: null,
            loading: false,
            summary: null,
            errorCode: null,
        };

        setRouteSummary(null);
        setRouteErrorCode(null);
    }, []);

    const drawRoute = useCallback((routeGeoJson) => {
        const map = mapRef.current;

        if (!map || !map.isStyleLoaded()) return;

        const source = map.getSource(ROUTE_SOURCE_ID);

        if (source && typeof source.setData === "function") {
            source.setData(routeGeoJson);
        } else {
            map.addSource(ROUTE_SOURCE_ID, {
                type: "geojson",
                data: routeGeoJson,
            });
        }

        if (!map.getLayer(ROUTE_LAYER_ID)) {
            map.addLayer({
                id: ROUTE_LAYER_ID,
                type: "line",
                source: ROUTE_SOURCE_ID,
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "#6f5d49",
                    "line-width": 5,
                    "line-opacity": 0.9,
                },
            });
        }

        const bounds = new maplibregl.LngLatBounds();

        routeGeoJson?.features?.forEach((feature) => {
            extendBoundsWithGeometry(bounds, feature?.geometry);
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
                padding: 70,
                maxZoom: 15,
                duration: 700,
            });
        }
    }, []);

    const drawRadius = useCallback((currentOrigin) => {
        const map = mapRef.current;

        if (!map || !map.isStyleLoaded()) return;

        const radiusGeoJson = buildRadiusCircleGeoJson(
            currentOrigin,
            SEARCH_RADIUS_KM
        );

        const source = map.getSource(RADIUS_SOURCE_ID);

        if (source && typeof source.setData === "function") {
            source.setData(radiusGeoJson);
        } else {
            map.addSource(RADIUS_SOURCE_ID, {
                type: "geojson",
                data: radiusGeoJson,
            });
        }

        if (!map.getLayer(RADIUS_FILL_LAYER_ID)) {
            map.addLayer({
                id: RADIUS_FILL_LAYER_ID,
                type: "fill",
                source: RADIUS_SOURCE_ID,
                paint: {
                    "fill-color": "#2563eb",
                    "fill-opacity": 0.12,
                },
            });
        }

        if (!map.getLayer(RADIUS_LINE_LAYER_ID)) {
            map.addLayer({
                id: RADIUS_LINE_LAYER_ID,
                type: "line",
                source: RADIUS_SOURCE_ID,
                paint: {
                    "line-color": "#2563eb",
                    "line-width": 2,
                    "line-opacity": 0.75,
                },
            });
        }
    }, []);

    const showCustomerMarker = useCallback((currentOrigin) => {
        const map = mapRef.current;

        if (!map) return;

        if (customerMarkerRef.current) {
            customerMarkerRef.current.setLngLat([
                currentOrigin.lng,
                currentOrigin.lat,
            ]);

            return;
        }

        customerMarkerRef.current = new maplibregl.Marker({
            color: "#2563eb",
        })
            .setLngLat([currentOrigin.lng, currentOrigin.lat])
            .addTo(map);
    }, []);

    const setVisibleStoreMarkers = useCallback((visibleStores) => {
        const visibleIds = new Set(
            visibleStores.map((store) => store.__storeId)
        );

        storeMarkersRef.current.forEach(({ store, marker }) => {
            marker.getElement().style.display = visibleIds.has(store.__storeId)
                ? ""
                : "none";
        });
    }, []);

    const fitOriginAndStores = useCallback((currentOrigin, storesToFit) => {
        const map = mapRef.current;

        if (!map) return;

        const bounds = new maplibregl.LngLatBounds(
            [currentOrigin.lng, currentOrigin.lat],
            [currentOrigin.lng, currentOrigin.lat]
        );

        storesToFit.forEach((store) => {
            bounds.extend([store.lng, store.lat]);
        });

        if (storesToFit.length === 0) {
            const radiusGeoJson = buildRadiusCircleGeoJson(
                currentOrigin,
                SEARCH_RADIUS_KM
            );

            radiusGeoJson.features?.[0]?.geometry?.coordinates?.[0]?.forEach(
                (coordinate) => bounds.extend(coordinate)
            );
        }

        map.fitBounds(bounds, {
            padding: 60,
            maxZoom: storesToFit.length > 0 ? 13 : 12,
            duration: 700,
        });
    }, []);

    const buildStorePopup = useCallback(
        (store) => {
            const currentOrigin = originRef.current;
            const status = routeStatusRef.current;

            const googleMapsUrl = currentOrigin
                ? getGoogleMapsDirectionsUrl(
                    currentOrigin,
                    store
                )
                : null;

            return createStoreMapPopup({
                store,
                status,
                currentOrigin,
                googleMapsUrl,
                t,

                onRouteRequest: () => {
                    routeRequestHandlerRef.current?.(store);
                },
            });
        },
        [t]
    );

    const openStorePopup = useCallback(
        (store) => {
            const map = mapRef.current;

            if (!map) return;

            popupRef.current?.remove();

            const popup = new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                maxWidth: "320px",
                offset: 28,
            })
                .setLngLat([store.lng, store.lat])
                .setDOMContent(buildStorePopup(store))
                .addTo(map);

            const popupElement = popup.getElement();

            const closeButton =
                popupElement?.querySelector(
                    ".maplibregl-popup-close-button"
                );

            if (closeButton) {
                closeButton.style.fontSize = "28px";
                closeButton.style.width = "40px";
                closeButton.style.height = "40px";
                closeButton.style.lineHeight = "40px";
                closeButton.style.padding = "0";
                closeButton.style.fontWeight = "600";
            }

            popup.on("close", () => {
                if (popupRef.current === popup) {
                    popupRef.current = null;
                    activePopupStoreRef.current = null;
                }
            });

            popupRef.current = popup;
            activePopupStoreRef.current = store;
        },
        [buildStorePopup]
    );

    useEffect(() => {
        openStorePopupRef.current = openStorePopup;
    }, [openStorePopup]);

    const refreshActivePopup = useCallback((store) => {
        if (
            activePopupStoreRef.current?.__storeId !==
            store.__storeId
        ) {
            return;
        }

        openStorePopupRef.current?.(store);
    }, []);

    const requestRoute = useCallback(
        async (store) => {
            const currentOrigin = originRef.current;

            if (
                !currentOrigin ||
                !isValidCoordinate(store.lat, store.lng)
            ) {
                setRouteErrorCode("SEARCH_LOCATION_FIRST");
                return;
            }

            const requestKey = [
                currentOrigin.lat.toFixed(6),
                currentOrigin.lng.toFixed(6),
                store.lat.toFixed(6),
                store.lng.toFixed(6),
            ].join(":");

            if (
                activeRouteKeyRef.current === requestKey &&
                routeAbortRef.current
            ) {
                return;
            }

            routeAbortRef.current?.abort();

            const controller = new AbortController();
            routeAbortRef.current = controller;
            activeRouteKeyRef.current = requestKey;

            setSelectedStore(store);
            setRouteSummary(null);
            setRouteErrorCode(null);
            setIsRouteLoading(true);

            routeStatusRef.current = {
                storeId: store.__storeId,
                loading: true,
                summary: null,
                errorCode: null,
            };

            refreshActivePopup(store);

            try {
                const routeGeoJson = await requestDrivingRoute(
                    currentOrigin,
                    store,
                    {
                        signal: controller.signal,
                    }
                );

                if (controller.signal.aborted) return;

                drawRoute(routeGeoJson);

                const summary = getRouteSummary(routeGeoJson);

                setRouteSummary(summary);

                routeStatusRef.current = {
                    storeId: store.__storeId,
                    loading: false,
                    summary,
                    errorCode: null,
                };

                refreshActivePopup(store);
            } catch (error) {
                if (error?.name === "AbortError") return;

                const errorCode =
                    error?.status === 429 ||
                        error?.code === "QUOTA_EXCEEDED"
                        ? "QUOTA_EXCEEDED"
                        : "ROUTE_ERROR";

                clearRoute();
                setSelectedStore(store);
                setRouteErrorCode(errorCode);

                routeStatusRef.current = {
                    storeId: store.__storeId,
                    loading: false,
                    summary: null,
                    errorCode,
                };

                refreshActivePopup(store);
            } finally {
                if (routeAbortRef.current === controller) {
                    routeAbortRef.current = null;
                    activeRouteKeyRef.current = null;
                    setIsRouteLoading(false);
                }
            }
        },
        [clearRoute, drawRoute, refreshActivePopup]
    );

    useEffect(() => {
        routeRequestHandlerRef.current = requestRoute;
    }, [requestRoute]);

    const handleStoreSelection = useCallback(
        (store) => {
            const currentOrigin = originRef.current;

            const storeWithDistance = currentOrigin
                ? {
                    ...store,
                    distanceKm: haversineDistanceKm(
                        currentOrigin,
                        store
                    ),
                }
                : store;

            if (currentOrigin) {
                storeWithDistance.isWithinRadius =
                    storeWithDistance.distanceKm <= SEARCH_RADIUS_KM;
            }

            setSelectedStore(storeWithDistance);
            openStorePopup(storeWithDistance);

            mapRef.current?.easeTo({
                center: [storeWithDistance.lng, storeWithDistance.lat],
                duration: 450,
            });

            if (currentOrigin) {
                requestRoute(storeWithDistance);
            } else {
                setRouteErrorCode("SEARCH_LOCATION_FIRST");
            }
        },
        [openStorePopup, requestRoute]
    );

    useEffect(() => {
        storeSelectionHandlerRef.current = handleStoreSelection;
    }, [handleStoreSelection]);

    const processOrigin = useCallback(
        (currentOrigin) => {
            if (
                !isValidCoordinate(
                    currentOrigin.lat,
                    currentOrigin.lng
                )
            ) {
                setSearchErrorKey("invalidCoordinates");
                return;
            }

            closePopup();
            clearRoute({
                abortRequest: true,
            });

            originRef.current = currentOrigin;
            setOrigin(currentOrigin);
            setSearchErrorKey(null);

            showCustomerMarker(currentOrigin);
            drawRadius(currentOrigin);

            const storesByDistance = addDistanceData(
                currentOrigin,
                validStores
            );

            const foundStores = storesByDistance.filter(
                (store) => store.isWithinRadius
            );

            const nearestStore =
                foundStores.length === 0
                    ? storesByDistance[0] ?? null
                    : null;

            setAllStoresByDistance(storesByDistance);
            setNearbyStores(foundStores);
            setNearestStoreOutsideRadius(nearestStore);

            if (isExpandedRef.current) {
                setVisibleStoreMarkers(storesByDistance);
            } else if (foundStores.length > 0) {
                setVisibleStoreMarkers(foundStores);
            } else if (nearestStore) {
                setVisibleStoreMarkers([nearestStore]);
            } else {
                setVisibleStoreMarkers([]);
            }

            const storesToFit =
                foundStores.length > 0
                    ? foundStores
                    : nearestStore
                        ? [nearestStore]
                        : [];

            fitOriginAndStores(currentOrigin, storesToFit);

            const storeToSelect =
                foundStores[0] ?? nearestStore;

            if (!storeToSelect) {
                setSelectedStore(null);
                return;
            }

            setSelectedStore(storeToSelect);
            requestRoute(storeToSelect);
        },
        [
            clearRoute,
            closePopup,
            drawRadius,
            fitOriginAndStores,
            requestRoute,
            setVisibleStoreMarkers,
            showCustomerMarker,
            validStores,
        ]
    );

    const handleSearchSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            const query = cityName.trim();

            if (
                query.length < 2 ||
                query.length > 160
            ) {
                setSearchErrorKey("invalidSearch");
                return;
            }

            geocodeAbortRef.current?.abort();

            const controller = new AbortController();
            geocodeAbortRef.current = controller;

            setIsGeocodeLoading(true);
            setSearchErrorKey(null);

            try {
                const result = await geocodeLocation(query, {
                    signal: controller.signal,
                });

                if (controller.signal.aborted) return;

                processOrigin({
                    lat: Number(result.lat),
                    lng: Number(result.lng),
                });
            } catch (error) {
                if (error?.name === "AbortError") return;

                if (
                    error?.status === 429 ||
                    error?.code === "QUOTA_EXCEEDED"
                ) {
                    setSearchErrorKey("quotaExceeded");
                } else if (
                    error?.status === 404 ||
                    error?.code === "NO_RESULTS"
                ) {
                    setSearchErrorKey("geocodeNoResults");
                } else {
                    setSearchErrorKey("geocodeError");
                }
            } finally {
                if (geocodeAbortRef.current === controller) {
                    geocodeAbortRef.current = null;
                    setIsGeocodeLoading(false);
                }
            }
        },
        [cityName, processOrigin]
    );

    const handleUseMyLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setSearchErrorKey("locationUnavailable");
            return;
        }

        setIsLocationLoading(true);
        setSearchErrorKey(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocationLoading(false);

                const lat = Number(position.coords?.latitude);
                const lng = Number(position.coords?.longitude);

                if (!isValidCoordinate(lat, lng)) {
                    setSearchErrorKey("invalidCoordinates");
                    return;
                }

                processOrigin({
                    lat,
                    lng,
                });
            },
            (error) => {
                setIsLocationLoading(false);

                if (error.code === error.PERMISSION_DENIED) {
                    setSearchErrorKey(
                        "locationPermissionDenied"
                    );
                    return;
                }

                if (error.code === error.TIMEOUT) {
                    setSearchErrorKey("locationTimeout");
                    return;
                }

                setSearchErrorKey("locationUnavailable");
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000,
            }
        );
    }, [processOrigin]);

    const resizeMap = useCallback(() => {
        mapRef.current?.resize();
    }, []);

    const setExpandedView = useCallback(
        (expanded) => {
            isExpandedRef.current = expanded;

            if (!mapRef.current) return;

            if (expanded) {
                const storesToShow = originRef.current
                    ? allStoresByDistance
                    : validStores;

                setVisibleStoreMarkers(storesToShow);
                return;
            }

            if (!originRef.current) {
                setVisibleStoreMarkers(validStores);
                return;
            }

            if (nearbyStores.length > 0) {
                setVisibleStoreMarkers(nearbyStores);
                return;
            }

            if (nearestStoreOutsideRadius) {
                setVisibleStoreMarkers([
                    nearestStoreOutsideRadius,
                ]);
                return;
            }

            setVisibleStoreMarkers([]);
        },
        [
            allStoresByDistance,
            nearbyStores,
            nearestStoreOutsideRadius,
            setVisibleStoreMarkers,
            validStores,
        ]
    );

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return undefined;
        }

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLE_URL,
            center: [
                DEFAULT_CENTER.lng,
                DEFAULT_CENTER.lat,
            ],
            zoom: DEFAULT_ZOOM,
            attributionControl: false,
        });

        mapRef.current = map;

        map.addControl(
            new maplibregl.NavigationControl({
                showCompass: false,
            }),
            "top-right"
        );

        map.addControl(
            new maplibregl.AttributionControl({
                compact: false,
            }),
            "bottom-right"
        );

        const handleLoad = () => {
            setMapReady(true);

            storeMarkersRef.current = validStores.map(
                (store) => {
                    const marker = new maplibregl.Marker()
                        .setLngLat([store.lng, store.lat])
                        .addTo(map);

                    const element = marker.getElement();

                    const handleClick = () => {
                        storeSelectionHandlerRef.current?.(
                            store
                        );
                    };

                    element.addEventListener(
                        "click",
                        handleClick
                    );

                    return {
                        store,
                        marker,
                        handleClick,
                    };
                }
            );
        };

        map.on("load", handleLoad);

        return () => {
            setMapReady(false);

            geocodeAbortRef.current?.abort();
            routeAbortRef.current?.abort();

            popupRef.current?.remove();
            popupRef.current = null;

            customerMarkerRef.current?.remove();
            customerMarkerRef.current = null;

            storeMarkersRef.current.forEach(
                ({ marker, handleClick }) => {
                    marker
                        .getElement()
                        .removeEventListener(
                            "click",
                            handleClick
                        );

                    marker.remove();
                }
            );

            storeMarkersRef.current = [];

            map.off("load", handleLoad);
            map.remove();
            mapRef.current = null;
        };
    }, [validStores]);

    const googleMapsUrl = useMemo(
        () =>
            getGoogleMapsDirectionsUrl(
                origin,
                selectedStore
            ),
        [origin, selectedStore]
    );

    const isBusy =
        !mapReady ||
        isGeocodeLoading ||
        isLocationLoading ||
        isRouteLoading;

    return {
        mapContainerRef,
        cityName,
        setCityName,
        mapReady,
        origin,
        nearbyStores,
        allStoresByDistance:
            origin ? allStoresByDistance : validStores,
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
    };
}