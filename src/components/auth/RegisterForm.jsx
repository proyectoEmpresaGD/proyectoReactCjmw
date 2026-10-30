import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import {
    useTranslation,
} from "react-i18next";

import {
    authClient,
} from "../../services/authClient";

import AuthCard from "./AuthCard";


const initialForm = {
    email: "",
    confirmEmail: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    mobilePhone: "",
    streetAddress: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postcode: "",
    country: "",
    codclien: "",
};


export default function RegisterForm() {
    const {
        t,
    } = useTranslation(
        "registerPage"
    );

    const [
        form,
        setForm,
    ] = useState(
        initialForm
    );

    const [
        fieldErrors,
        setFieldErrors,
    ] = useState({});

    const [
        serverError,
        setServerError,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);


    const isSubmitted =
        useMemo(
            () =>
                Boolean(
                    successMessage
                ),
            [
                successMessage,
            ]
        );


    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setForm(
            (
                current
            ) => ({
                ...current,

                [name]:
                    name ===
                        "email" ||
                    name ===
                        "confirmEmail"
                        ? value.toLowerCase()
                        : name ===
                          "codclien"
                        ? value.toUpperCase()
                        : value,
            })
        );

        setFieldErrors(
            (
                current
            ) => ({
                ...current,
                [name]: "",
            })
        );

        setServerError("");
    };


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setServerError("");
        setSuccessMessage("");

        const validationErrors =
            validateForm(
                form,
                t
            );

        setFieldErrors(
            validationErrors
        );

        if (
            Object.keys(
                validationErrors
            ).length > 0
        ) {
            return;
        }

        setSubmitting(
            true
        );

        try {
            const response =
                await authClient.registerRequest({
                    email:
                        form.email
                            .trim()
                            .toLowerCase(),

                    confirmEmail:
                        form.confirmEmail
                            .trim()
                            .toLowerCase(),

                    firstName:
                        form.firstName
                            .trim(),

                    lastName:
                        form.lastName
                            .trim(),

                    password:
                        form.password,

                    confirmPassword:
                        form.confirmPassword,

                    phone:
                        form.phone.trim(),

                    mobilePhone:
                        form.mobilePhone.trim(),

                    streetAddress:
                        form.streetAddress.trim(),

                    addressLine2:
                        form.addressLine2.trim(),

                    city:
                        form.city.trim(),

                    stateProvince:
                        form.stateProvince.trim(),

                    postcode:
                        form.postcode.trim(),

                    country:
                        form.country.trim(),

                    codclien:
                        form.codclien
                            .trim()
                            .toUpperCase(),
                });


            setSuccessMessage(
                response?.message ||
                    t(
                        "success.message"
                    )
            );

            setForm(
                initialForm
            );

            setFieldErrors(
                {}
            );
        } catch (
            error
        ) {
            const apiErrors =
                Array.isArray(
                    error?.data
                        ?.errors
                )
                    ? error.data
                          .errors
                    : [];


            if (
                apiErrors.length >
                0
            ) {
                setFieldErrors(
                    apiErrors.reduce(
                        (
                            acc,
                            item
                        ) => {
                            if (
                                item?.field
                            ) {
                                acc[
                                    item.field
                                ] =
                                    item.message ||
                                    t(
                                        "errors.invalidField"
                                    );
                            }

                            return acc;
                        },
                        {}
                    )
                );
            }


            setServerError(
                error?.message ||
                    t(
                        "errors.submit"
                    )
            );
        } finally {
            setSubmitting(
                false
            );
        }
    };


    return (
        <AuthCard
            eyebrow={t(
                "eyebrow"
            )}
            title={t(
                "form.title"
            )}
            subtitle={t(
                "form.subtitle"
            )}
            sideLabel={t(
                "hero.label"
            )}
            sideTitle={t(
                "hero.title"
            )}
            sideDescription={t(
                "hero.description"
            )}
        >
            {isSubmitted ? (
                <div>
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-50
                            text-emerald-700
                        "
                    >
                        <CheckCircle2
                            className="
                                h-6
                                w-6
                            "
                        />
                    </div>

                    <h2
                        className="
                            mt-6
                            text-2xl
                            font-light
                            tracking-[-0.03em]
                            text-stone-950
                        "
                    >
                        {t(
                            "success.title"
                        )}
                    </h2>

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-7
                            text-stone-600
                        "
                    >
                        {
                            successMessage
                        }
                    </p>

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-7
                            text-stone-500
                        "
                    >
                        {t(
                            "success.description"
                        )}
                    </p>

                    <Link
                        to="/login"
                        className="
                            group
                            mt-8
                            flex
                            w-full
                            items-center
                            justify-between
                            bg-stone-950
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-white
                            transition

                            hover:bg-stone-800
                        "
                    >
                        <span>
                            {t(
                                "success.back"
                            )}
                        </span>

                        <ArrowRight
                            className="
                                h-4
                                w-4
                                transition-transform
                                group-hover:translate-x-1
                            "
                        />
                    </Link>
                </div>
            ) : (
                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-9
                    "
                >
                    <FormSection
                        number="01"
                        title={t(
                            "sections.access.title"
                        )}
                        description={t(
                            "sections.access.description"
                        )}
                    >
                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                            "
                        >
                            <FormField
                                label={t(
                                    "fields.email"
                                )}
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.email
                                }
                                placeholder={t(
                                    "fields.emailPlaceholder"
                                )}
                                autoComplete="email"
                                required
                            />

                            <FormField
                                label={t(
                                    "fields.confirmEmail"
                                )}
                                name="confirmEmail"
                                type="email"
                                value={
                                    form.confirmEmail
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.confirmEmail
                                }
                                placeholder={t(
                                    "fields.confirmEmailPlaceholder"
                                )}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                            "
                        >
                            <FormField
                                label={t(
                                    "fields.password"
                                )}
                                name="password"
                                type="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.password
                                }
                                placeholder={t(
                                    "fields.passwordPlaceholder"
                                )}
                                autoComplete="new-password"
                                required
                            />

                            <FormField
                                label={t(
                                    "fields.confirmPassword"
                                )}
                                name="confirmPassword"
                                type="password"
                                value={
                                    form.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.confirmPassword
                                }
                                placeholder={t(
                                    "fields.confirmPasswordPlaceholder"
                                )}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </FormSection>


                    <FormSection
                        number="02"
                        title={t(
                            "sections.personal.title"
                        )}
                    >
                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                            "
                        >
                            <FormField
                                label={t(
                                    "fields.firstName"
                                )}
                                name="firstName"
                                value={
                                    form.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.firstName
                                }
                                placeholder={t(
                                    "fields.firstNamePlaceholder"
                                )}
                                autoComplete="given-name"
                                required
                            />

                            <FormField
                                label={t(
                                    "fields.lastName"
                                )}
                                name="lastName"
                                value={
                                    form.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.lastName
                                }
                                placeholder={t(
                                    "fields.lastNamePlaceholder"
                                )}
                                autoComplete="family-name"
                                required
                            />
                        </div>

                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                            "
                        >
                            <FormField
                                label={t(
                                    "fields.phone"
                                )}
                                name="phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.phone
                                }
                                placeholder={t(
                                    "fields.phonePlaceholder"
                                )}
                                autoComplete="tel"
                            />

                            <FormField
                                label={t(
                                    "fields.mobilePhone"
                                )}
                                name="mobilePhone"
                                value={
                                    form.mobilePhone
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.mobilePhone
                                }
                                placeholder={t(
                                    "fields.mobilePhonePlaceholder"
                                )}
                                autoComplete="tel"
                            />
                        </div>
                    </FormSection>


                    <FormSection
                        number="03"
                        title={t(
                            "sections.address.title"
                        )}
                    >
                        <FormField
                            label={t(
                                "fields.streetAddress"
                            )}
                            name="streetAddress"
                            value={
                                form.streetAddress
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                fieldErrors.streetAddress
                            }
                            placeholder={t(
                                "fields.streetAddressPlaceholder"
                            )}
                            autoComplete="street-address"
                        />

                        <FormField
                            label={t(
                                "fields.addressLine2"
                            )}
                            name="addressLine2"
                            value={
                                form.addressLine2
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                fieldErrors.addressLine2
                            }
                            placeholder={t(
                                "fields.addressLine2Placeholder"
                            )}
                        />

                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                            "
                        >
                            <FormField
                                label={t(
                                    "fields.city"
                                )}
                                name="city"
                                value={
                                    form.city
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.city
                                }
                                placeholder={t(
                                    "fields.cityPlaceholder"
                                )}
                                autoComplete="address-level2"
                            />

                            <FormField
                                label={t(
                                    "fields.stateProvince"
                                )}
                                name="stateProvince"
                                value={
                                    form.stateProvince
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.stateProvince
                                }
                                placeholder={t(
                                    "fields.stateProvincePlaceholder"
                                )}
                                autoComplete="address-level1"
                            />
                        </div>

                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                            "
                        >
                            <FormField
                                label={t(
                                    "fields.postcode"
                                )}
                                name="postcode"
                                value={
                                    form.postcode
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.postcode
                                }
                                placeholder={t(
                                    "fields.postcodePlaceholder"
                                )}
                                autoComplete="postal-code"
                            />

                            <FormField
                                label={t(
                                    "fields.country"
                                )}
                                name="country"
                                value={
                                    form.country
                                }
                                onChange={
                                    handleChange
                                }
                                error={
                                    fieldErrors.country
                                }
                                placeholder={t(
                                    "fields.countryPlaceholder"
                                )}
                                autoComplete="country-name"
                            />
                        </div>
                    </FormSection>


                    <FormSection
                        number="04"
                        title={t(
                            "sections.customer.title"
                        )}
                        description={t(
                            "sections.customer.description"
                        )}
                    >
                        <FormField
                            label={t(
                                "fields.codclien"
                            )}
                            name="codclien"
                            value={
                                form.codclien
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                fieldErrors.codclien
                            }
                            placeholder={t(
                                "fields.codclienPlaceholder"
                            )}
                            required
                        />
                    </FormSection>


                    {serverError ? (
                        <div
                            role="alert"
                            className="
                                border-l-2
                                border-red-400
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                leading-6
                                text-red-700
                            "
                        >
                            {
                                serverError
                            }
                        </div>
                    ) : null}


                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
                        className="
                            group
                            flex
                            w-full
                            items-center
                            justify-between
                            bg-stone-950
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-white
                            transition

                            hover:bg-stone-800

                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        <span>
                            {submitting
                                ? t(
                                    "form.submitting"
                                )
                                : t(
                                    "form.submit"
                                )}
                        </span>

                        <ArrowRight
                            className="
                                h-4
                                w-4
                                transition-transform
                                group-hover:translate-x-1
                            "
                        />
                    </button>


                    <p
                        className="
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        {t(
                            "form.haveAccess"
                        )}{" "}
                        <Link
                            to="/login"
                            className="
                                font-medium
                                text-stone-950
                                underline
                                decoration-stone-300
                                underline-offset-4
                                transition

                                hover:decoration-stone-950
                            "
                        >
                            {t(
                                "form.login"
                            )}
                        </Link>
                    </p>
                </form>
            )}
        </AuthCard>
    );
}


function FormSection({
    number,
    title,
    description,
    children,
}) {
    return (
        <section>
            <div
                className="
                    mb-5
                    flex
                    items-start
                    gap-4
                    border-b
                    border-stone-200
                    pb-4
                "
            >
                <span
                    className="
                        pt-0.5
                        text-[10px]
                        font-semibold
                        tracking-[0.16em]
                        text-stone-350
                    "
                >
                    {number}
                </span>

                <div>
                    <h3
                        className="
                            text-sm
                            font-medium
                            text-stone-950
                        "
                    >
                        {title}
                    </h3>

                    {description ? (
                        <p
                            className="
                                mt-1.5
                                max-w-lg
                                text-xs
                                leading-5
                                text-stone-500
                            "
                        >
                            {
                                description
                            }
                        </p>
                    ) : null}
                </div>
            </div>

            <div
                className="
                    space-y-5
                "
            >
                {children}
            </div>
        </section>
    );
}


function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={
                    name
                }
                className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-stone-500
                "
            >
                {label}
            </label>

            <input
                id={
                    name
                }
                name={
                    name
                }
                type={
                    type
                }
                value={
                    value
                }
                onChange={
                    onChange
                }
                placeholder={
                    placeholder
                }
                autoComplete={
                    autoComplete
                }
                required={
                    required
                }
                className={`
                    w-full
                    border-b
                    bg-transparent
                    py-3
                    text-[15px]
                    text-stone-950
                    outline-none
                    transition

                    placeholder:text-stone-350

                    ${
                        error
                            ? "border-red-400 focus:border-red-500"
                            : "border-stone-300 focus:border-stone-950"
                    }
                `}
            />

            {error ? (
                <p
                    className="
                        mt-2
                        text-xs
                        leading-5
                        text-red-600
                    "
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}


function validateForm(
    form,
    t
) {
    const errors =
        {};


    if (
        !form.email.trim()
    ) {
        errors.email =
            t(
                "validation.emailRequired"
            );
    } else if (
        !isValidEmail(
            form.email
        )
    ) {
        errors.email =
            t(
                "validation.emailInvalid"
            );
    }


    if (
        !form.confirmEmail
            .trim()
    ) {
        errors.confirmEmail =
            t(
                "validation.confirmEmailRequired"
            );
    } else if (
        form.email
            .trim()
            .toLowerCase() !==
        form.confirmEmail
            .trim()
            .toLowerCase()
    ) {
        errors.confirmEmail =
            t(
                "validation.emailsNotMatch"
            );
    }


    if (
        !form.firstName
            .trim()
    ) {
        errors.firstName =
            t(
                "validation.firstNameRequired"
            );
    }


    if (
        !form.lastName
            .trim()
    ) {
        errors.lastName =
            t(
                "validation.lastNameRequired"
            );
    }


    if (
        !form.password
    ) {
        errors.password =
            t(
                "validation.passwordRequired"
            );
    } else if (
        form.password
            .length < 8
    ) {
        errors.password =
            t(
                "validation.passwordMinLength"
            );
    }


    if (
        !form.confirmPassword
    ) {
        errors.confirmPassword =
            t(
                "validation.confirmPasswordRequired"
            );
    } else if (
        form.password !==
        form.confirmPassword
    ) {
        errors.confirmPassword =
            t(
                "validation.passwordsNotMatch"
            );
    }


    if (
        !form.codclien
            .trim()
    ) {
        errors.codclien =
            t(
                "validation.codclienRequired"
            );
    }


    return errors;
}


function isValidEmail(
    email
) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}
