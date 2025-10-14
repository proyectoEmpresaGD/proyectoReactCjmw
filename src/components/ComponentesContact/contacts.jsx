import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    CONTACT_BANNER_IMAGE,
    contactInfo
} from '../../Constants/constants';
import ContactForm from './ContactForm';
import IconoMapa from './iconoMapa';
import MapEmbed from './MapEmbed';

const Contacts = () => {
    const { t } = useTranslation('contacts');
    const [activeLocationId, setActiveLocationId] = useState(contactInfo[0]?.id ?? null);

    const handleSelectLocation = (locationId) => setActiveLocationId(locationId);
    const activeLocation = contactInfo.find((l) => l.id === activeLocationId);

    return (
        <section className="bg-neutral-100 pb-20">
            {/* Hero: añade padding-top para compensar el header fijo y más padding-bottom.
          La imagen pasa a z-0/pointer-events-none; el texto a z-10 */}
            <div className="relative isolate overflow-hidden bg-neutral-900/90 text-white pt-24 sm:pt-28">
                <img
                    src={CONTACT_BANNER_IMAGE}
                    alt={t('hero.bannerAlt')}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none select-none -z-0"
                    loading="lazy"
                />
                <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
                    <p className="text-sm uppercase tracking-[0.35em] text-neutral-200">
                        {t('hero.kicker')}
                    </p>
                    <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
                        {t('hero.title')}
                    </h1>
                    <p className="max-w-2xl text-base text-neutral-200 sm:text-lg">
                        {t('hero.subtitle')}
                    </p>
                </div>
            </div>

            {/* Contenido principal: quita los márgenes negativos; usa márgenes POSITIVOS */}
            <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
                    {/* Formulario */}
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-10">
                        <ContactForm />
                    </div>

                    {/* Lateral: Showrooms + Mapa */}
                    <aside className="space-y-6 lg:space-y-10">
                        {/* Showrooms */}
                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-10">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                                        {t('showrooms.kicker')}
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
                                        {t('showrooms.title')}
                                    </h2>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        {t('showrooms.subtitle')}
                                    </p>
                                </div>
                            </div>

                            <ul className="mt-8 space-y-4 sm:space-y-6">
                                {contactInfo.map((location) => (
                                    <li
                                        key={location.id}
                                        className={`rounded-2xl border px-5 py-5 transition ${location.id === activeLocationId
                                            ? 'border-neutral-900 bg-neutral-900/5'
                                            : 'border-transparent bg-neutral-50'
                                            }`}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-1">
                                                <span className="text-xs uppercase tracking-widest text-neutral-500">
                                                    {location.pais}
                                                </span>
                                                <p className="text-lg font-semibold text-neutral-900">
                                                    {location.nombre}
                                                </p>
                                                <p className="text-sm text-neutral-600">
                                                    {`${location.direccion}, ${location.codigoPostal} ${location.ciudad}`}
                                                </p>
                                                {location.horario && (
                                                    <p className="text-xs text-neutral-500">
                                                        {location.horario}
                                                    </p>
                                                )}

                                                {/* Datos de contacto */}
                                                <div className="mt-3 space-y-1 text-sm text-neutral-700">
                                                    <a
                                                        href={`tel:${(location.telefono || '').replace(/\s+/g, '')}`}
                                                        className="block font-medium text-neutral-900 hover:underline"
                                                    >
                                                        {location.telefono}
                                                    </a>
                                                    <a
                                                        href={`mailto:${location.correo}`}
                                                        className="block text-neutral-700 hover:text-neutral-900 hover:underline"
                                                    >
                                                        {location.correo}
                                                    </a>
                                                    {location.googleMapsUrl && (
                                                        <a
                                                            href={location.googleMapsUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block text-neutral-700 hover:text-neutral-900 hover:underline"
                                                        >
                                                            {t('showrooms.viewInMaps')}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex sm:ml-auto sm:shrink-0">
                                                <IconoMapa
                                                    onSelect={() => handleSelectLocation(location.id)}
                                                    label={t('showrooms.focusMap', { location: location.nombre })}
                                                />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mapa (iframe) */}
                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-10">
                            <h3 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
                                {t('map.title')}
                            </h3>
                            <p className="mt-2 text-sm text-neutral-600">
                                {t('map.subtitle')}
                            </p>
                            <div className="mt-6 overflow-hidden rounded-3xl">
                                <MapEmbed
                                    location={activeLocation}
                                    className="h-64 sm:h-72 lg:h-[28rem]"
                                />
                            </div>
                        </div>
                    </aside>
                </div>


            </div>
        </section>
    );
};

export default Contacts;
