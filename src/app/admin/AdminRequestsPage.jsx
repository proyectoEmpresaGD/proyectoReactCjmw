import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authClient } from '../../services/authClient';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/header';
import { CartProvider } from '../../components/CartContext';
import AccountHero from '../../components/account/AccountHero';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'denied', label: 'Denegadas' },
];

export default function AdminRequestsPage() {
    const { isAdmin, loading: authLoading, user } = useAuth();

    const [status, setStatus] = useState('pending');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState('');
    const [denialReasons, setDenialReasons] = useState({});

    const title = useMemo(() => {
        const current = STATUS_OPTIONS.find((item) => item.value === status);
        return current?.label || 'Solicitudes';
    }, [status]);

    const linkedCustomersCount = useMemo(() => {
        if (Array.isArray(user?.linkedCustomers)) return user.linkedCustomers.length;
        if (Array.isArray(user?.customers)) return user.customers.length;
        if (Array.isArray(user?.customerLinks)) return user.customerLinks.length;
        if (user?.activeCustomer) return 1;
        return 0;
    }, [user]);

    useEffect(() => {
        if (!authLoading && isAdmin) {
            loadRequests(status);
        }
    }, [authLoading, isAdmin, status]);

    const loadRequests = async (currentStatus) => {
        try {
            setLoading(true);
            setError('');

            const response = await authClient.getAdminRequests({
                status: currentStatus,
                limit: 100,
                offset: 0,
            });

            setRequests(Array.isArray(response?.data) ? response.data : []);
        } catch (requestError) {
            setError(requestError?.message || 'No se pudieron cargar las solicitudes.');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            setActionLoadingId(requestId);
            setError('');

            await authClient.approveAdminRequest(requestId);
            await loadRequests(status);
        } catch (requestError) {
            setError(requestError?.message || 'No se pudo aprobar la solicitud.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeny = async (requestId) => {
        try {
            setActionLoadingId(requestId);
            setError('');

            await authClient.denyAdminRequest(requestId, {
                denialReason: denialReasons[requestId]?.trim() || null,
            });

            await loadRequests(status);
        } catch (requestError) {
            setError(requestError?.message || 'No se pudo denegar la solicitud.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const updateDenialReason = (requestId, value) => {
        setDenialReasons((current) => ({
            ...current,
            [requestId]: value,
        }));
    };

    if (authLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-sm text-stone-600">Cargando sesión...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <CartProvider>
            <div className="mx-auto max-w-7xl px-4 py-8">
                <Header />

                <div className="mt-[5%] space-y-6">
                    <AccountHero
                        linkedCustomersCount={linkedCustomersCount}
                        title="Panel de administrador"
                        subtitle="Gestiona las solicitudes de acceso de clientes, revisa su estado y decide si aprobarlas o denegarlas desde un entorno visual unificado."
                    />

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-stone-900">Panel de administrador</h1>
                            <p className="mt-1 text-sm text-stone-600">
                                Revisa las solicitudes de acceso de clientes y decide si aprobarlas o denegarlas.
                            </p>
                        </div>

                        <div className="w-full md:w-64">
                            <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="status">
                                Estado
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-500"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="border-b border-stone-200 px-5 py-4">
                            <h2 className="text-lg font-medium text-stone-900">{title}</h2>
                        </div>

                        {loading ? (
                            <div className="px-5 py-8 text-sm text-stone-600">Cargando solicitudes...</div>
                        ) : requests.length === 0 ? (
                            <div className="px-5 py-8 text-sm text-stone-600">
                                No hay solicitudes en este estado.
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-200">
                                {requests.map((request) => {
                                    const isActionLoading = actionLoadingId === request.id;

                                    return (
                                        <article key={request.id} className="p-5">
                                            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                <div>
                                                    <h3 className="text-base font-semibold text-stone-900">
                                                        {request.first_name} {request.last_name}
                                                    </h3>
                                                    <p className="text-sm text-stone-600">{request.email}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Badge>{request.status}</Badge>
                                                    <Badge>{request.codclien}</Badge>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                                <InfoItem label="Codigo de cliente" value={request.codclien} />
                                                <InfoItem label="Teléfono" value={request.phone} />
                                                <InfoItem label="Móvil" value={request.mobile_phone} />
                                                <InfoItem label="Ciudad" value={request.city} />
                                                <InfoItem label="Provincia" value={request.state_province} />
                                                <InfoItem label="Código postal" value={request.postcode} />
                                                <InfoItem label="País" value={request.country} />
                                                <InfoItem label="Dirección" value={request.street_address} />
                                                <InfoItem label="Dirección adicional" value={request.address_line_2} />
                                                <InfoItem label="Creada" value={formatDate(request.created_at)} />
                                                <InfoItem label="Revisada" value={formatDate(request.reviewed_at)} />
                                                <InfoItem label="Revisada por" value={request.reviewed_by} />
                                                <InfoItem label="Motivo denegación" value={request.denial_reason} />
                                            </div>

                                            {request.status === 'pending' ? (
                                                <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
                                                    <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                                                        <div>
                                                            <label
                                                                className="mb-1 block text-sm font-medium text-stone-700"
                                                                htmlFor={`denialReason-${request.id}`}
                                                            >
                                                                Motivo de denegación
                                                            </label>
                                                            <input
                                                                id={`denialReason-${request.id}`}
                                                                type="text"
                                                                value={denialReasons[request.id] || ''}
                                                                onChange={(event) =>
                                                                    updateDenialReason(request.id, event.target.value)
                                                                }
                                                                placeholder="Opcional"
                                                                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-stone-500"
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleApprove(request.id)}
                                                            disabled={isActionLoading}
                                                            className="rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                                                        >
                                                            {isActionLoading ? 'Procesando...' : 'Aprobar'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeny(request.id)}
                                                            disabled={isActionLoading}
                                                            className="rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70"
                                                        >
                                                            {isActionLoading ? 'Procesando...' : 'Denegar'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CartProvider>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
            <p className="mt-1 text-sm text-stone-900">{value || '—'}</p>
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-stone-700">
            {children}
        </span>
    );
}

function formatDate(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleString('es-ES');
}