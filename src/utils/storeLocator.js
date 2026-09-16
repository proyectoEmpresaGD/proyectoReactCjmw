const EARTH_RADIUS_KM = 6371;
const CIRCLE_SEGMENTS = 96;

export const SEARCH_RADIUS_KM = 10;

export function isValidCoordinate(lat, lng) {
    return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
}

export function normalizeStores(stores) {
    if (!Array.isArray(stores)) return [];

    return stores
        .map((store, index) => {
            const lat = Number(store?.lat);
            const lng = Number(store?.lng);

            if (!isValidCoordinate(lat, lng)) return null;

            return {
                ...store,
                lat,
                lng,
                __storeId: `store-${index}-${lat}-${lng}`,
            };
        })
        .filter(Boolean);
}

export function haversineDistanceKm(origin, destination) {
    if (
        !origin ||
        !destination ||
        !isValidCoordinate(origin.lat, origin.lng) ||
        !isValidCoordinate(destination.lat, destination.lng)
    ) {
        return Number.POSITIVE_INFINITY;
    }

    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const lat1 = toRadians(origin.lat);
    const lat2 = toRadians(destination.lat);
    const deltaLat = toRadians(destination.lat - origin.lat);
    const deltaLng = toRadians(destination.lng - origin.lng);

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
}

export function buildRadiusCircleGeoJson(center, radiusKm = SEARCH_RADIUS_KM) {
    if (!center || !isValidCoordinate(center.lat, center.lng)) {
        return {
            type: "FeatureCollection",
            features: [],
        };
    }

    const angularDistance = radiusKm / EARTH_RADIUS_KM;
    const centerLat = (center.lat * Math.PI) / 180;
    const centerLng = (center.lng * Math.PI) / 180;
    const coordinates = [];

    for (let index = 0; index <= CIRCLE_SEGMENTS; index += 1) {
        const bearing = (2 * Math.PI * index) / CIRCLE_SEGMENTS;

        const lat = Math.asin(
            Math.sin(centerLat) * Math.cos(angularDistance) +
            Math.cos(centerLat) * Math.sin(angularDistance) * Math.cos(bearing)
        );

        const lng =
            centerLng +
            Math.atan2(
                Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(centerLat),
                Math.cos(angularDistance) - Math.sin(centerLat) * Math.sin(lat)
            );

        coordinates.push([(lng * 180) / Math.PI, (lat * 180) / Math.PI]);
    }

    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    radiusKm,
                },
                geometry: {
                    type: "Polygon",
                    coordinates: [coordinates],
                },
            },
        ],
    };
}

export function getGoogleMapsDirectionsUrl(origin, destination) {
    if (
        !origin ||
        !destination ||
        !isValidCoordinate(origin.lat, origin.lng) ||
        !isValidCoordinate(destination.lat, destination.lng)
    ) {
        return null;
    }

    const params = new URLSearchParams({
        api: "1",
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        travelmode: "driving",
    });

    return `https://www.google.com/maps/dir/?${params.toString()}`;
}
