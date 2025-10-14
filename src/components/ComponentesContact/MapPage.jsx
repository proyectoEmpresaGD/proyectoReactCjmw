import { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';

const defaultMapClassName = 'h-64 sm:h-72 lg:h-[28rem]';

const defaultCenter = { lat: 37.587606, lng: -4.632214 };

const MapPage = ({ locations, activeLocationId, className }) => {
    const { t } = useTranslation('contacts');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [mapInstance, setMapInstance] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'contacto-rgpd-map',
        googleMapsApiKey: apiKey ?? '',
        libraries: ['places'],
    });

    const activeLocation = useMemo(() => {
        if (!Array.isArray(locations) || locations.length === 0) return null;
        return locations.find((item) => item.id === activeLocationId) ?? locations[0];
    }, [locations, activeLocationId]);

    const handleOnLoad = useCallback(
        (map) => {
            setMapInstance(map);
            if (activeLocation?.coordenadas) {
                map.setCenter(activeLocation.coordenadas);
                map.setZoom(12);
            }
        },
        [activeLocation]
    );

    const handleOnUnmount = useCallback(() => {
        setMapInstance(null);
    }, []);

    useEffect(() => {
        if (mapInstance && activeLocation?.coordenadas) {
            mapInstance.panTo(activeLocation.coordenadas);
            mapInstance.setZoom(12);
        }
    }, [activeLocation, mapInstance]);

    if (!apiKey) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                {t('map.apiKeyMissing')}
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {t('map.loadError')}
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                {t('map.loading')}
            </div>
        );
    }

    const mapContainerClassName = `w-full ${className ?? defaultMapClassName}`;

    return (
        <GoogleMap
            mapContainerClassName={mapContainerClassName}
            center={activeLocation?.coordenadas ?? defaultCenter}
            zoom={activeLocation ? 12 : 5}
            onLoad={handleOnLoad}
            onUnmount={handleOnUnmount}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            }}
        >
            {Array.isArray(locations) &&
                locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={location.coordenadas ?? defaultCenter}
                        title={location.nombre}
                        icon={
                            location.id === activeLocation?.id
                                ? {
                                    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
                                }
                                : undefined
                        }
                    />
                ))}
        </GoogleMap>
    );
};

export default MapPage;