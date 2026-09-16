function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text != null) {
        element.textContent = text;
    }

    return element;
}

function createRouteStat(value, label) {
    const wrapper = createElement(
        'div',
        'flex flex-col gap-0.5'
    );

    const valueElement = createElement(
        'span',
        'text-base font-semibold text-slate-900',
        value
    );

    const labelElement = createElement(
        'span',
        'text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate-400',
        label
    );

    wrapper.appendChild(valueElement);
    wrapper.appendChild(labelElement);

    return wrapper;
}

export function createStoreMapPopup({
    store,
    status,
    currentOrigin,
    googleMapsUrl,
    t,
    onRouteRequest,
}) {
    const container = createElement(
        'div',
        'store-popup-card'
    );

    const content = createElement(
        'div',
        'px-5 pb-5 pt-5'
    );

    container.appendChild(content);

    /*
     * Cabecera
     */
    const eyebrow = createElement(
        'div',
        'mb-3 flex items-center gap-2'
    );

    const indicator = createElement(
        'span',
        'h-2 w-2 rounded-full bg-[#26659E]'
    );

    const eyebrowText = createElement(
        'span',
        'text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#26659E]',
        t('storePoint', 'Punto de venta')
    );

    eyebrow.appendChild(indicator);
    eyebrow.appendChild(eyebrowText);

    content.appendChild(eyebrow);

    /*
     * Nombre
     */
    const title = createElement(
        'h3',
        'pr-8 text-xl font-semibold leading-tight tracking-tight text-slate-950',
        store.title
    );

    content.appendChild(title);

    /*
     * Descripción
     */
    if (store.description) {
        const description = createElement(
            'p',
            'mt-1.5 text-sm leading-relaxed text-slate-500',
            store.description
        );

        content.appendChild(description);
    }

    /*
     * Dirección
     */
    if (store.direccion || store.cp) {
        const address = createElement(
            'div',
            'mt-5 border-t border-slate-100 pt-4'
        );

        if (store.direccion) {
            const addressLine = createElement(
                'p',
                'text-sm font-medium leading-relaxed text-slate-700',
                store.direccion
            );

            address.appendChild(addressLine);
        }

        if (store.cp) {
            const postalCode = createElement(
                'p',
                'mt-0.5 text-sm text-slate-400',
                store.cp
            );

            address.appendChild(postalCode);
        }

        content.appendChild(address);
    }

    /*
     * Teléfono
     */
    if (store.telefono) {
        const phone = createElement(
            'a',
            'mt-3 inline-flex text-sm font-medium text-slate-600 transition hover:text-[#26659E]',
            store.telefono
        );

        phone.href = `tel:${store.telefono}`;

        content.appendChild(phone);
    }

    /*
     * Distancia desde el usuario
     */
    if (Number.isFinite(store.distanceKm)) {
        const distance = createElement(
            'p',
            'mt-4 text-sm font-medium text-[#26659E]',
            t('distanceFromYou', {
                distance: store.distanceKm.toFixed(1),
                defaultValue: `${store.distanceKm.toFixed(1)} km de tu ubicación`,
            })
        );

        content.appendChild(distance);
    }

    const isCurrentStore =
        status?.storeId === store.__storeId;

    /*
     * Cargando ruta
     */
    if (isCurrentStore && status.loading) {
        const loading = createElement(
            'div',
            'mt-5 border-t border-slate-100 pt-4 text-sm font-medium text-[#26659E]',
            t('routeLoading', 'Calculando ruta...')
        );

        content.appendChild(loading);
    }

    /*
     * Información de ruta
     */
    if (isCurrentStore && status.summary) {
        const routeInfo = createElement(
            'div',
            'mt-5 flex items-center gap-10 border-t border-slate-100 pt-4'
        );

        routeInfo.appendChild(
            createRouteStat(
                `${status.summary.distanceKm.toFixed(1)} km`,
                t('drivingLabel', 'En coche')
            )
        );

        routeInfo.appendChild(
            createRouteStat(
                `${Math.round(status.summary.durationMinutes)} min`,
                t('estimatedLabel', 'Aprox.')
            )
        );

        content.appendChild(routeInfo);
    }

    /*
     * Error de ruta
     */
    if (isCurrentStore && status.errorCode) {
        const errorMessage =
            status.errorCode === 'QUOTA_EXCEEDED'
                ? t(
                    'quotaExceeded',
                    'No se puede calcular la ruta en este momento.'
                )
                : t(
                    'routeError',
                    'No hemos podido calcular la ruta.'
                );

        const error = createElement(
            'p',
            'mt-4 text-sm font-medium text-red-600',
            errorMessage
        );

        content.appendChild(error);
    }

    /*
     * Acción principal
     */
    const isLoading =
        isCurrentStore && status?.loading;

    const routeButton = createElement(
        'button',
        `
            mt-5 flex w-full items-center justify-center
            rounded-xl bg-[#26659E]
            px-4 py-3
            text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-[#1f527f]
            focus:outline-none
            focus:ring-2
            focus:ring-[#26659E]/30
            disabled:cursor-not-allowed
            disabled:bg-slate-200
            disabled:text-slate-400
            disabled:shadow-none
        `
    );

    routeButton.type = 'button';

    routeButton.textContent = isLoading
        ? t('routeLoading', 'Calculando...')
        : isCurrentStore && status.summary
            ? t('viewRoute', 'Ver ruta')
            : t('getDirections', 'Cómo llegar');

    routeButton.disabled =
        !currentOrigin || isLoading;

    routeButton.addEventListener('click', () => {
        onRouteRequest?.();
    });

    content.appendChild(routeButton);

    /*
     * Google Maps
     */
    if (currentOrigin && googleMapsUrl) {
        const googleMapsLink = createElement(
            'a',
            `
                mt-3 flex w-full items-center justify-center
                text-sm font-medium text-slate-500
                transition hover:text-[#26659E]
            `,
            `${t(
                'openInGoogleMaps',
                'Abrir en Google Maps'
            )} →`
        );

        googleMapsLink.href = googleMapsUrl;
        googleMapsLink.target = '_blank';
        googleMapsLink.rel = 'noopener noreferrer';

        content.appendChild(googleMapsLink);
    }

    /*
     * Sin ubicación del usuario
     */
    if (!currentOrigin) {
        const locationNotice = createElement(
            'p',
            'mt-3 text-center text-xs leading-relaxed text-slate-400',
            t(
                'searchLocationFirst',
                'Indica tu ubicación para calcular cómo llegar.'
            )
        );

        content.appendChild(locationNotice);
    }

    return container;
}