import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';
import { authClient } from '../../services/authClient';

const initialForm = {
  email: '',
  confirmEmail: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  phone: '',
  mobilePhone: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  stateProvince: '',
  postcode: '',
  country: '',
  codclien: '',
};

export default function RegisterForm() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted = useMemo(() => Boolean(successMessage), [successMessage]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === 'email' || name === 'confirmEmail'
          ? value.trim().toLowerCase()
          : name === 'codclien'
            ? value.trim().toUpperCase()
            : value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setServerError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const validationErrors = validateForm(form);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await authClient.registerRequest({
        email: form.email,
        confirmEmail: form.confirmEmail,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        mobilePhone: form.mobilePhone,
        streetAddress: form.streetAddress,
        addressLine2: form.addressLine2,
        city: form.city,
        stateProvince: form.stateProvince,
        postcode: form.postcode,
        country: form.country,
        codclien: form.codclien,
      });

      setSuccessMessage(
        response?.message ||
        'Solicitud registrada correctamente. Queda pendiente de revisión por un administrador.'
      );
      setForm(initialForm);
      setFieldErrors({});
    } catch (error) {
      const apiErrors = Array.isArray(error?.data?.errors) ? error.data.errors : [];

      if (apiErrors.length > 0) {
        setFieldErrors(
          apiErrors.reduce((acc, item) => {
            if (item?.field) {
              acc[item.field] = item.message || 'Campo no válido.';
            }
            return acc;
          }, {})
        );
      }

      setServerError(error?.message || 'No se pudo enviar la solicitud de registro.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Solicitar acceso"
      subtitle="Rellena tus datos y un administrador revisará tu solicitud antes de activar el acceso."
    >
      {isSubmitted ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {successMessage}
          </div>

          <p className="text-sm text-stone-600">
            Cuando tu solicitud sea aprobada, recibirás un correo para verificar tu identidad y
            activar tu acceso.
          </p>

          <Link
            to="/login"
            className="inline-flex rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Volver al login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-800">
                Datos de acceso
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Correo electrónico"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={fieldErrors.email}
                placeholder="tuemail@empresa.com"
                required
              />

              <FormField
                label="Confirmar correo electrónico"
                name="confirmEmail"
                type="email"
                value={form.confirmEmail}
                onChange={handleChange}
                error={fieldErrors.confirmEmail}
                placeholder="Repite tu correo"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={fieldErrors.password}
                placeholder="Mínimo 8 caracteres"
                required
              />

              <FormField
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={fieldErrors.confirmPassword}
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-800">
                Datos personales
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Nombre"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={fieldErrors.firstName}
                placeholder="Nombre"
                required
              />

              <FormField
                label="Apellidos"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={fieldErrors.lastName}
                placeholder="Apellidos"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Teléfono"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={fieldErrors.phone}
                placeholder="Teléfono"
              />

              <FormField
                label="Móvil"
                name="mobilePhone"
                value={form.mobilePhone}
                onChange={handleChange}
                error={fieldErrors.mobilePhone}
                placeholder="Móvil"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-800">
                Dirección
              </h3>
            </div>

            <FormField
              label="Dirección"
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
              error={fieldErrors.streetAddress}
              placeholder="Dirección"
            />

            <FormField
              label="Dirección adicional"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              error={fieldErrors.addressLine2}
              placeholder="Piso, nave, puerta, etc."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Ciudad"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={fieldErrors.city}
                placeholder="Ciudad"
              />

              <FormField
                label="Provincia"
                name="stateProvince"
                value={form.stateProvince}
                onChange={handleChange}
                error={fieldErrors.stateProvince}
                placeholder="Provincia"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Código postal"
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                error={fieldErrors.postcode}
                placeholder="Código postal"
              />

              <FormField
                label="País"
                name="country"
                value={form.country}
                onChange={handleChange}
                error={fieldErrors.country}
                placeholder="País"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-800">
                Validación de cliente
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Introduce un código de cliente válido que aparezca en una factura, pedido o
                presupuesto recibido.
              </p>
            </div>

            <FormField
              label="Código de cliente"
              name="codclien"
              value={form.codclien}
              onChange={handleChange}
              error={fieldErrors.codclien}
              placeholder="Código de cliente"
              required
            />
          </section>

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Enviando solicitud...' : 'Enviar solicitud'}
          </button>

          <p className="text-sm text-stone-600">
            ¿Ya tienes acceso?{' '}
            <Link to="/login" className="font-medium text-stone-900 underline">
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition ${error ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-stone-500'
          }`}
      />

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function validateForm(form) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'El correo no es válido.';
  }

  if (!form.confirmEmail.trim()) {
    errors.confirmEmail = 'Debes confirmar el correo.';
  } else if (form.email.trim().toLowerCase() !== form.confirmEmail.trim().toLowerCase()) {
    errors.confirmEmail = 'Los correos no coinciden.';
  }

  if (!form.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio.';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Los apellidos son obligatorios.';
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (!form.codclien.trim()) {
    errors.codclien = 'El código de cliente es obligatorio.';
  }

  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}