import { Navigate } from 'react-router-dom';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';
import { CartProvider } from '../../components/CartContext';

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/mis-datos" replace />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen mt-[5%] bg-stone-50">
        <Header />
        <main className="px-4 py-16">
          <RegisterForm />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}