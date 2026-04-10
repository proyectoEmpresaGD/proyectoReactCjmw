import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from './AuthCard';
import ForgotPasswordModal from "./ForgotPasswordModal";

const initialForm = {
  email: '',
  password: '',
};

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === 'email' ? value.trim().toLowerCase() : value,
    }));
  };

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({
        email: form.email,
        password: form.password,
      });

      const redirectTo = location.state?.from?.pathname || '/mis-datos';
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(thisLoginMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Acceso clientes"
      subtitle="Entra con tu correo y contraseña para acceder a tu zona privada."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="tuemail@empresa.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Tu contraseña"
            required
          />
          <button
            type="button"
            onClick={() => setForgotPasswordOpen(true)}
            className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-2"
          >
            ¿Has olvidado tu contraseña?
          </button>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Entrando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-5 text-sm text-stone-600">
        ¿Todavía no tienes acceso?{' '}
        <Link className="font-medium text-stone-900 underline" to="/register">
          Solicita tu alta aquí
        </Link>
      </p>
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </AuthCard>

  );
}

function thisLoginMessage(error) {
  if (error?.code === 'ACCOUNT_DENIED') {
    return 'Tu solicitud ha sido denegada. Si crees que es un error, contacta con nosotros.';
  }

  if (error?.code === 'ACCOUNT_NOT_APPROVED') {
    return 'Tu solicitud todavía está pendiente de aprobación.';
  }

  if (error?.code === 'ACCOUNT_INACTIVE') {
    return 'Tu cuenta todavía no está activa.';
  }

  if (error?.code === 'EMAIL_NOT_VERIFIED') {
    return 'Tu cuenta ha sido aprobada, pero todavía debes verificar tu correo electrónico.';
  }

  return error?.message || 'No se pudo iniciar sesión.';
}