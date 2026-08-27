import { useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
    CONTACT_CONSENT_VERSION,
    PDF_LINKS,
} from '../../Constants/constants';
import TurnstileWidget from './TurnstileWidget';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
];

const SECURITY_ERROR_CODES = [
    'SECURITY_VERIFICATION_REQUIRED',
    'SECURITY_VERIFICATION_FAILED',
    'SECURITY_VERIFICATION_UNAVAILABLE',
];

const API_BASE =
    (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        (import.meta.env.VITE_API_BASE_URL || '')) ||
    '';

const TURNSTILE_SITE_KEY =
    (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        (import.meta.env.VITE_TURNSTILE_SITE_KEY || '')) ||
    '';

const initialState = {
    profile: 'private',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    postalCode: '',
    province: '',
    reason: 'general',
    message: '',
    marketing: false,
    consent: false,
};

function trimStr(value) {
    return typeof value === 'string'
        ? value.trim()
        : value;
}

function sanitizePayload(state) {
    return {
        profile: state.profile,
        firstName: trimStr(state.firstName),
        lastName: trimStr(state.lastName),
        email: trimStr(state.email).toLowerCase(),
        phone: trimStr(state.phone),
        company: trimStr(state.company),
        country: trimStr(state.country),
        postalCode: trimStr(state.postalCode),
        province: trimStr(state.province),
        reason: trimStr(state.reason),
        message: trimStr(state.message),
        marketing: !!state.marketing,
        consent: !!state.consent,
    };
}

const norm = (value) =>
    (value ?? '')
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

const isSpain = (country) => {
    if (!country) {
        return false;
    }

    const raw = String(country).trim();

    if (raw.length === 2) {
        return raw.toUpperCase() === 'ES';
    }

    const normalizedCountry = norm(raw);

    return (
        normalizedCountry === 'espana' ||
        normalizedCountry === 'españa' ||
        normalizedCountry === 'spain'
    );
};

const ContactForm = ({ onSuccess }) => {
    const { t } = useTranslation('contacts');

    const [formState, setFormState] = useState(initialState);
    const [attachment, setAttachment] = useState(null);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [feedback, setFeedback] = useState(null);

    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);

    const fileRef = useRef(null);
    const honeypotRef = useRef(null);

    const profileOptions = useMemo(
        () => [
            {
                value: 'private',
                label: t('form.profile.options.private'),
            },
            {
                value: 'professional',
                label: t('form.profile.options.professional'),
            },
        ],
        [t]
    );

    const reasonOptions = useMemo(
        () => [
            {
                value: 'general',
                label: t('form.reason.options.general'),
            },
            {
                value: 'catalogue',
                label: t('form.reason.options.catalogue'),
            },
            {
                value: 'partnership',
                label: t('form.reason.options.partnership'),
            },
            {
                value: 'press',
                label: t('form.reason.options.press'),
            },
            {
                value: 'other',
                label: t('form.reason.options.other'),
            },
        ],
        [t]
    );

    const resetForm = () => {
        setFormState(initialState);
        setAttachment(null);
        setErrors({});
        setTurnstileToken('');

        if (fileRef.current) {
            fileRef.current.value = '';
        }

        if (honeypotRef.current) {
            honeypotRef.current.value = '';
        }
    };

    const validate = (
        state = formState,
        file = attachment
    ) => {
        const values = sanitizePayload(state);
        const newErrors = {};

        if (
            !values.profile ||
            !['private', 'professional'].includes(values.profile)
        ) {
            newErrors.profile = t('form.errors.profile');
        }

        const nameRe = /^[\p{L}\s.'-]+$/u;

        if (!values.firstName) {
            newErrors.firstName = t(
                'form.errors.firstName'
            );
        } else if (values.firstName.length > 120) {
            newErrors.firstName = t(
                'form.errors.firstNameMax'
            );
        } else if (!nameRe.test(values.firstName)) {
            newErrors.firstName = t(
                'form.errors.firstNameFormat'
            );
        }

        if (!values.lastName) {
            newErrors.lastName = t(
                'form.errors.lastName'
            );
        } else if (values.lastName.length > 120) {
            newErrors.lastName = t(
                'form.errors.lastNameMax'
            );
        } else if (!nameRe.test(values.lastName)) {
            newErrors.lastName = t(
                'form.errors.lastNameFormat'
            );
        }

        if (!values.email) {
            newErrors.email = t(
                'form.errors.emailRequired'
            );
        } else if (
            !/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/u.test(
                values.email
            )
        ) {
            newErrors.email = t(
                'form.errors.emailInvalid'
            );
        }

        if (!values.phone) {
            newErrors.phone = t(
                'form.errors.phoneRequired'
            );
        } else if (
            !/^[0-9+()\s-]{6,20}$/.test(values.phone)
        ) {
            newErrors.phone = t(
                'form.errors.phoneInvalid'
            );
        }

        if (!values.country) {
            newErrors.country = t(
                'form.errors.country'
            );
        } else if (values.country.length > 120) {
            newErrors.country = t(
                'form.errors.countryMax'
            );
        }

        if (!values.postalCode) {
            newErrors.postalCode = t(
                'form.errors.postalCode'
            );
        } else if (isSpain(values.country)) {
            if (
                !/^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/.test(
                    values.postalCode
                )
            ) {
                newErrors.postalCode = t(
                    'form.errors.postalCodeES'
                );
            }
        } else if (
            !/^[A-Za-z0-9\- ]{2,20}$/.test(
                values.postalCode
            )
        ) {
            newErrors.postalCode = t(
                'form.errors.postalCodeGeneric'
            );
        }

        if (
            values.province &&
            values.province.length > 120
        ) {
            newErrors.province = t(
                'form.errors.provinceMax'
            );
        }

        if (values.profile === 'professional') {
            if (!values.company) {
                newErrors.company = t(
                    'form.errors.companyRequired'
                );
            } else if (values.company.length > 160) {
                newErrors.company = t(
                    'form.errors.companyMax'
                );
            }
        } else if (
            values.company &&
            values.company.length > 160
        ) {
            newErrors.company = t(
                'form.errors.companyMax'
            );
        }

        if (!values.reason) {
            newErrors.reason = t(
                'form.errors.reason'
            );
        } else if (values.reason.length > 160) {
            newErrors.reason = t(
                'form.errors.reasonMax'
            );
        }

        if (!values.message) {
            newErrors.message = t(
                'form.errors.messageRequired'
            );
        } else if (
            values.message.length >
            MAX_MESSAGE_LENGTH
        ) {
            newErrors.message = t(
                'form.errors.messageLength',
                {
                    max: MAX_MESSAGE_LENGTH,
                }
            );
        }

        if (!values.consent) {
            newErrors.consent = t(
                'form.errors.consent'
            );
        }

        if (file) {
            if (
                !ALLOWED_FILE_TYPES.includes(
                    file.type
                )
            ) {
                newErrors.attachment = t(
                    'form.errors.invalidFileType'
                );
            } else if (
                file.size > MAX_FILE_SIZE
            ) {
                newErrors.attachment = t(
                    'form.errors.invalidFileSize'
                );
            }
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    const handleChange = (event) => {
        const {
            name,
            type,
            value,
            checked,
        } = event.target;

        setFormState((prev) => {
            const next = {
                ...prev,
                [name]:
                    type === 'checkbox'
                        ? checked
                        : value,
            };

            if (errors[name]) {
                setErrors((prevErrors) => {
                    const copy = {
                        ...prevErrors,
                    };

                    delete copy[name];

                    return copy;
                });
            }

            if (
                name === 'profile' &&
                value === 'professional' &&
                !prev.company
            ) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    company: t(
                        'form.errors.companyRequired'
                    ),
                }));
            }

            if (
                name === 'profile' &&
                value === 'private'
            ) {
                setErrors((prevErrors) => {
                    const {
                        company,
                        ...rest
                    } = prevErrors;

                    return rest;
                });
            }

            return next;
        });
    };

    const handleFileChange = (event) => {
        const file =
            event.target.files?.[0] || null;

        if (!file) {
            setAttachment(null);

            setErrors((prev) => {
                if (!prev.attachment) {
                    return prev;
                }

                const copy = { ...prev };

                delete copy.attachment;

                return copy;
            });

            return;
        }

        if (
            !ALLOWED_FILE_TYPES.includes(file.type)
        ) {
            setAttachment(null);

            setErrors((prev) => ({
                ...prev,
                attachment: t(
                    'form.errors.invalidFileType'
                ),
            }));

            event.target.value = '';

            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setAttachment(null);

            setErrors((prev) => ({
                ...prev,
                attachment: t(
                    'form.errors.invalidFileSize'
                ),
            }));

            event.target.value = '';

            return;
        }

        setAttachment(file);

        setErrors((prev) => {
            if (!prev.attachment) {
                return prev;
            }

            const copy = { ...prev };

            delete copy.attachment;

            return copy;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback(null);

        const isValid = validate();

        if (!isValid) {
            return;
        }

        if (!turnstileToken) {
            setStatus('error');
            setFeedback(
                t('form.feedback.securityRequired')
            );

            return;
        }

        setStatus('loading');

        try {
            const values =
                sanitizePayload(formState);

            const payload = new FormData();

            Object.entries(values).forEach(
                ([key, value]) => {
                    if (
                        key === 'marketing' ||
                        key === 'consent'
                    ) {
                        payload.append(
                            key,
                            value
                                ? 'true'
                                : 'false'
                        );
                    } else {
                        payload.append(
                            key,
                            value ?? ''
                        );
                    }
                }
            );

            payload.append(
                'consentVersion',
                CONTACT_CONSENT_VERSION
            );

            payload.append(
                'website',
                honeypotRef.current?.value || ''
            );

            if (attachment) {
                payload.append(
                    'attachment',
                    attachment
                );
            }

            const response = await fetch(
                `${API_BASE}/api/contact`,
                {
                    method: 'POST',

                    headers: {
                        'X-Turnstile-Token':
                            turnstileToken,
                    },

                    body: payload,
                }
            );

            let data = {};

            try {
                data = await response.json();
            } catch (_) {
                data = {};
            }

            if (!response.ok) {
                if (
                    SECURITY_ERROR_CODES.includes(
                        data?.error
                    )
                ) {
                    throw new Error(
                        t(
                            'form.feedback.securityError'
                        )
                    );
                }

                throw new Error(
                    data?.error ??
                    t('form.feedback.error')
                );
            }

            setStatus('success');
            setFeedback(
                t('form.feedback.success')
            );

            resetForm();

            onSuccess?.(data);
        } catch (error) {
            setStatus('error');

            setFeedback(
                error.message ||
                t('form.feedback.error')
            );
        } finally {
            /*
             * Los tokens Turnstile son de un solo uso.
             * Después de cualquier petición enviada al
             * backend generamos un nuevo widget/token.
             */
            setTurnstileToken('');

            setTurnstileResetKey(
                (prev) => prev + 1
            );
        }
    };

    const isSubmitting =
        status === 'loading';

    const hasErrors =
        Object.keys(errors).length > 0;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
            encType="multipart/form-data"
            aria-busy={
                isSubmitting
                    ? 'true'
                    : 'false'
            }
        >
            {/* Honeypot antibots */}
            <div
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
                aria-hidden="true"
            >
                <label htmlFor="website">
                    Website
                </label>

                <input
                    ref={honeypotRef}
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div>
                <h2 className="text-3xl font-semibold text-neutral-900">
                    {t('form.title')}
                </h2>

                <p className="mt-2 text-sm text-neutral-600">
                    {t('form.description')}
                </p>
            </div>

            {feedback && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className={`rounded-lg border px-4 py-3 text-sm ${status === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                        }`}
                >
                    {feedback}
                </div>
            )}

            {hasErrors && !feedback && (
                <div
                    role="alert"
                    className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                >
                    {t(
                        'form.feedback.validation'
                    )}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="profile"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.profile.label'
                        )}
                    </label>

                    <select
                        id="profile"
                        name="profile"
                        value={
                            formState.profile
                        }
                        onChange={
                            handleChange
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.profile
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.profile
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.profile
                                ? 'profile-error'
                                : undefined
                        }
                    >
                        {profileOptions.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            )
                        )}
                    </select>

                    {errors.profile && (
                        <p
                            id="profile-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {
                                errors.profile
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.reason.label'
                        )}
                    </label>

                    <select
                        id="reason"
                        name="reason"
                        value={
                            formState.reason
                        }
                        onChange={
                            handleChange
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.reason
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.reason
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.reason
                                ? 'reason-error'
                                : undefined
                        }
                    >
                        {reasonOptions.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            )
                        )}
                    </select>

                    {errors.reason && (
                        <p
                            id="reason-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {errors.reason}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.firstName.label'
                        )}
                    </label>

                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={
                            formState.firstName
                        }
                        onChange={
                            handleChange
                        }
                        maxLength={120}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.firstName
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.firstName
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.firstName
                                ? 'firstName-error'
                                : undefined
                        }
                    />

                    {errors.firstName && (
                        <p
                            id="firstName-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {
                                errors.firstName
                            }
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.lastName.label'
                        )}
                    </label>

                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={
                            formState.lastName
                        }
                        onChange={
                            handleChange
                        }
                        maxLength={120}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.lastName
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.lastName
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.lastName
                                ? 'lastName-error'
                                : undefined
                        }
                    />

                    {errors.lastName && (
                        <p
                            id="lastName-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {
                                errors.lastName
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.email.label'
                        )}
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={
                            formState.email
                        }
                        onChange={
                            handleChange
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.email
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.email
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.email
                                ? 'email-error'
                                : undefined
                        }
                    />

                    {errors.email && (
                        <p
                            id="email-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.phone.label'
                        )}{' '}
                        *
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={
                            formState.phone
                        }
                        onChange={
                            handleChange
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.phone
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.phone
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.phone
                                ? 'phone-error'
                                : undefined
                        }
                    />

                    {errors.phone && (
                        <p
                            id="phone-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="company"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {formState.profile ===
                            'professional'
                            ? `${t(
                                'form.company.label'
                            )}*`
                            : t(
                                'form.company.label'
                            )}
                    </label>

                    <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        value={
                            formState.company
                        }
                        onChange={
                            handleChange
                        }
                        maxLength={160}
                        placeholder={
                            formState.profile ===
                                'professional'
                                ? t(
                                    'form.company.requiredPlaceholder'
                                )
                                : t(
                                    'form.company.help'
                                )
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.company
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.company
                                ? 'true'
                                : 'false'
                        }
                    />

                    {errors.company && (
                        <p
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {
                                errors.company
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                    <label
                        htmlFor="country"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.country.label'
                        )}
                    </label>

                    <input
                        id="country"
                        name="country"
                        type="text"
                        autoComplete="country-name"
                        value={
                            formState.country
                        }
                        onChange={
                            handleChange
                        }
                        maxLength={120}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.country
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.country
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.country
                                ? 'country-error'
                                : undefined
                        }
                    />

                    {errors.country && (
                        <p
                            id="country-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {
                                errors.country
                            }
                        </p>
                    )}
                </div>

                <div className="md:col-span-1">
                    <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.postalCode.label'
                        )}
                    </label>

                    <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        autoComplete="postal-code"
                        value={
                            formState.postalCode
                        }
                        onChange={
                            handleChange
                        }
                        maxLength={20}
                        placeholder={
                            isSpain(
                                formState.country
                            )
                                ? 'Ej: 28013'
                                : 'Ej: 90210'
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.postalCode
                            ? 'border-red-400'
                            : 'border-neutral-300'
                            }`}
                        aria-invalid={
                            errors.postalCode
                                ? 'true'
                                : 'false'
                        }
                        aria-describedby={
                            errors.postalCode
                                ? 'postalCode-error'
                                : undefined
                        }
                    />

                    {errors.postalCode && (
                        <p
                            id="postalCode-error"
                            role="alert"
                            className="mt-1 text-xs text-red-600"
                        >
                            {
                                errors.postalCode
                            }
                        </p>
                    )}
                </div>

                <div className="md:col-span-1">
                    <label
                        htmlFor="province"
                        className="block text-sm font-medium text-neutral-800"
                    >
                        {t(
                            'form.province.label'
                        )}
                    </label>

                    <input
                        id="province"
                        name="province"
                        type="text"
                        value={
                            formState.province
                        }
                        onChange={
                            handleChange
                        }
                        maxLength={120}
                        className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-800"
                >
                    {t(
                        'form.message.label'
                    )}
                </label>

                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={
                        formState.message
                    }
                    onChange={
                        handleChange
                    }
                    maxLength={
                        MAX_MESSAGE_LENGTH
                    }
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 ${errors.message
                        ? 'border-red-400'
                        : 'border-neutral-300'
                        }`}
                    aria-invalid={
                        errors.message
                            ? 'true'
                            : 'false'
                    }
                    aria-describedby={
                        errors.message
                            ? 'message-error'
                            : 'message-help'
                    }
                />

                <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                    <span id="message-help">
                        {t(
                            'form.message.help',
                            {
                                max: MAX_MESSAGE_LENGTH,
                            }
                        )}
                    </span>

                    <span>
                        {
                            formState
                                .message
                                .length
                        }
                        /
                        {
                            MAX_MESSAGE_LENGTH
                        }
                    </span>
                </div>

                {errors.message && (
                    <p
                        id="message-error"
                        role="alert"
                        className="mt-1 text-xs text-red-600"
                    >
                        {errors.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="attachment"
                    className="block text-sm font-medium text-neutral-800"
                >
                    {t(
                        'form.attachment.label'
                    )}
                </label>

                <input
                    ref={fileRef}
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={
                        handleFileChange
                    }
                    className="mt-1 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-700"
                    aria-describedby={
                        errors.attachment
                            ? 'attachment-error'
                            : 'attachment-help'
                    }
                />

                <p
                    id="attachment-help"
                    className="mt-1 text-xs text-neutral-500"
                >
                    {t(
                        'form.attachment.help'
                    )}
                </p>

                {errors.attachment && (
                    <p
                        id="attachment-error"
                        role="alert"
                        className="mt-1 text-xs text-red-600"
                    >
                        {
                            errors.attachment
                        }
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <label className="flex items-start gap-3">
                    <input
                        id="consent"
                        name="consent"
                        type="checkbox"
                        checked={
                            formState.consent
                        }
                        onChange={
                            handleChange
                        }
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                        aria-describedby={
                            errors.consent
                                ? 'consent-error'
                                : 'consent-help'
                        }
                    />

                    <span className="text-sm text-neutral-700">
                        <Trans
                            i18nKey="contacts:form.legal.consentLabel"
                            values={{
                                version:
                                    CONTACT_CONSENT_VERSION,
                            }}
                        />
                    </span>
                </label>

                {errors.consent && (
                    <p
                        id="consent-error"
                        role="alert"
                        className="text-xs text-red-600"
                    >
                        {
                            errors.consent
                        }
                    </p>
                )}

                <p
                    id="consent-help"
                    className="text-xs text-neutral-500"
                >
                    {t(
                        'form.legal.dataRetention'
                    )}
                </p>

                <p className="text-xs text-neutral-500">
                    <Trans
                        i18nKey="contacts:form.legal.privacy"
                        components={{
                            privacyLink: (
                                <a
                                    href={
                                        PDF_LINKS.politicaPrivacidad
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-neutral-900 underline"
                                />
                            ),
                        }}
                    />
                </p>

                <p className="text-xs text-neutral-500">
                    {t(
                        'form.legal.rights'
                    )}
                </p>
            </div>

            {TURNSTILE_SITE_KEY && (
                <div className="flex justify-center">
                    <TurnstileWidget
                        siteKey={
                            TURNSTILE_SITE_KEY
                        }
                        resetKey={
                            turnstileResetKey
                        }
                        onVerify={(
                            token
                        ) => {
                            setTurnstileToken(
                                token
                            );
                        }}
                        onExpire={() => {
                            setTurnstileToken(
                                ''
                            );
                        }}
                        onError={() => {
                            setTurnstileToken(
                                ''
                            );

                            setStatus(
                                'error'
                            );

                            setFeedback(
                                t(
                                    'form.feedback.securityError'
                                )
                            );
                        }}
                    />
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !turnstileToken
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                    {isSubmitting
                        ? t(
                            'form.actions.sending'
                        )
                        : t(
                            'form.actions.submit'
                        )}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;