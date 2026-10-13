-- Cache de pais y provincia para los puntos de venta.
-- No cambia la estructura original de puntos_venta.
-- Los datos se obtienen una sola vez por coordenada con la tarea de enriquecimiento.
CREATE TABLE IF NOT EXISTS public.puntos_venta_geografia (
    codpunto TEXT PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    pais TEXT NOT NULL,
    provincia TEXT,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_puntos_venta_geografia_pais_provincia
    ON public.puntos_venta_geografia (pais, provincia);
