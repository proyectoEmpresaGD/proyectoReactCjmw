import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../components/CartContext';

const VERIFIED_MESSAGE_KEY = 'login_verified_message';
const VERIFIED_SUCCESS = '1';
const VERIFIED_ERROR = '0';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified');

  const [verificationStatus, setVerificationStatus] = useState(() => {
    return sessionStorage.getItem(VERIFIED_MESSAGE_KEY);
  });

  useEffect(() => {
    if (!verified) return;

    sessionStorage.setItem(VERIFIED_MESSAGE_KEY, verified);
    setVerificationStatus(verified);
    navigate('/login', { replace: true });
  }, [verified, navigate]);

  const handleDismissVerificationMessage = () => {
    sessionStorage.removeItem(VERIFIED_MESSAGE_KEY);
    setVerificationStatus(null);
  };

  if (!loading && isAuthenticated && !verificationStatus) {
    return <Navigate to="/mis-datos" replace />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen mt-[5%] bg-stone-50">
        <Header />
        <main className="mx-auto md:max-w-[60%] max-w-[95%] px-4 py-16">
          {verificationStatus === VERIFIED_SUCCESS && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <div className="flex items-start justify-between gap-4">
                <p>Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.</p>
                <button
                  type="button"
                  onClick={handleDismissVerificationMessage}
                  className="shrink-0 text-green-700 underline underline-offset-2"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {verificationStatus === VERIFIED_ERROR && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-start justify-between gap-4">
                <p>No se ha podido verificar tu cuenta. El enlace puede haber caducado.</p>
                <button
                  type="button"
                  onClick={handleDismissVerificationMessage}
                  className="shrink-0 text-red-700 underline underline-offset-2"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <LoginForm />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}