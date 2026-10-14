-- Estado de reintentos para el enriquecimiento automatico.
-- Los registros de puntos_venta no se modifican; esta tabla solo
-- evita repetir solicitudes a la API ante caidas o cuotas agotadas.
CREATE TABLE IF NOT EXISTS public.puntos_venta_geografia_reintentos (
    codpunto TEXT PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    intentos INTEGER NOT NULL DEFAULT 0,
    proximo_intento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ultimo_error TEXT,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_puntos_venta_geografia_reintentos_proximo
    ON public.puntos_venta_geografia_reintentos(proximo_intento);
