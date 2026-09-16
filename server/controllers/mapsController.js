function isValidCoordinate(lat, lng) {
    return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
}

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 160;

function parsePoint(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    const lat = value.lat;
    const lng = value.lng;

    if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        !isValidCoordinate(lat, lng)
    ) {
        return null;
    }

    return { lat, lng };
}

function sendControllerError(res, error) {
    const status =
        Number.isInteger(error?.status) && error.status >= 400
            ? error.status
            : 500;

    const isServerError = status >= 500;
    const message = isServerError
        ? "Map service unavailable"
        : error?.message || "Map request failed";

    return res.status(status).json({
        error: message,
        code: error?.code || (isServerError ? "MAP_SERVICE_ERROR" : "BAD_REQUEST"),
    });
}

export class MapsController {
    constructor({ mapsModel }) {
        this.mapsModel = mapsModel;
    }

    async geocode(req, res) {
        try {
            const query = String(req.body?.query ?? "").trim();

            if (
                query.length < MIN_QUERY_LENGTH ||
                query.length > MAX_QUERY_LENGTH
            ) {
                return res.status(400).json({
                    error: "Invalid search length",
                    code: "INVALID_SEARCH",
                });
            }

            const response = await this.mapsModel.geocode(query);
            const feature = response?.features?.[0];
            const coordinates = feature?.geometry?.coordinates;

            if (!Array.isArray(coordinates) || coordinates.length < 2) {
                return res.status(404).json({
                    error: "Location not found",
                    code: "NO_RESULTS",
                });
            }

            const lng = Number(coordinates[0]);
            const lat = Number(coordinates[1]);

            if (!isValidCoordinate(lat, lng)) {
                return res.status(502).json({
                    error: "Invalid coordinates returned by geocoding service",
                    code: "INVALID_UPSTREAM_RESPONSE",
                });
            }

            return res.json({
                lat,
                lng,
                label: feature?.properties?.label ?? query,
            });
        } catch (error) {
            return sendControllerError(res, error);
        }
    }

    async route(req, res) {
        try {
            const origin = parsePoint(req.body?.origin);
            const destination = parsePoint(req.body?.destination);

            if (!origin || !destination) {
                return res.status(400).json({
                    error: "Origin and destination must contain valid lat/lng numbers",
                    code: "INVALID_COORDINATES",
                });
            }
            const routeGeoJson = await this.mapsModel.route(origin, destination);

            if (
                routeGeoJson?.type !== "FeatureCollection" ||
                !Array.isArray(routeGeoJson?.features) ||
                routeGeoJson.features.length === 0
            ) {
                return res.status(502).json({
                    error: "Invalid route response",
                    code: "INVALID_UPSTREAM_RESPONSE",
                });
            }

            return res.json(routeGeoJson);
        } catch (error) {
            return sendControllerError(res, error);
        }
    }
}