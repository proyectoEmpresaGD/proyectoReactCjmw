-- Geografía inicial: 21 establecimientos proporcionados en octubre de 2026.
-- Se añaden SOLO puntos que realmente existan en puntos_venta y cuyas
-- coordenadas sigan siendo las mismas. No inserta ni modifica tiendas.
-- Ejecutar DESPUÉS de 001_puntos_venta_geografia.sql
WITH referencia (codpunto, lat, lng, pais, provincia) AS (
    VALUES
        (2, 37.586784324249166, -4.658694292094171, 'España', 'Córdoba'),
        (3, 36.42922354580339, -5.159631118892461, 'España', 'Málaga'),
        (4, 36.51254673169135, -4.905043607819556, 'España', 'Málaga'),
        (5, 36.48195147648294, -4.99383859545655, 'España', 'Málaga'),
        (6, 36.70691487900119, -4.46788387043145, 'España', 'Málaga'),
        (7, 40.42126384054199, -3.686159246195406, 'España', 'Madrid'),
        (8, 40.42575768247665, -3.6817537054880294, 'España', 'Madrid'),
        (9, 40.42619930095491, -3.682414714808484, 'España', 'Madrid'),
        (10, 40.42409200413065, -3.6957327754449825, 'España', 'Madrid'),
        (11, 40.44755031575113, -3.6730568431495314, 'España', 'Madrid'),
        (12, 40.43846531268905, -3.634704247472065, 'España', 'Madrid'),
        (13, 40.429672308903186, -3.681004668378678, 'España', 'Madrid'),
        (14, 40.41381784812596, -3.699832652981245, 'España', 'Madrid'),
        (15, 41.1517459168177, -8.628341240515946, 'Portugal', 'Porto'),
        (16, 52.292102209674276, 4.577443641546199, 'Países Bajos', 'Zuid-Holland'),
        (17, 52.06891817515861, 4.365991624333963, 'Países Bajos', 'Zuid-Holland'),
        (18, 51.97234223558989, 5.346069851779655, 'Países Bajos', 'Utrecht'),
        (19, 51.931896548802264, 4.485197454539532, 'Países Bajos', 'Zuid-Holland'),
        (20, 52.09124810919306, 4.30451582433533, 'Países Bajos', 'Zuid-Holland'),
        (21, 43.57722499289682, 7.02037709687001, 'Francia', 'Alpes-Maritimes'),
        (22, 37.12125, -3.60525, 'España', 'Granada')
)
INSERT INTO public.puntos_venta_geografia
    (codpunto, lat, lng, pais, provincia, actualizado_en)
SELECT p.codpunto::TEXT, p.coordenadasy::DOUBLE PRECISION,
       p.coordenadasx::DOUBLE PRECISION, r.pais, r.provincia, NOW()
FROM public.puntos_venta p
JOIN referencia r ON r.codpunto::TEXT = p.codpunto::TEXT
  AND ABS(p.coordenadasy::DOUBLE PRECISION - r.lat) <= 0.00001
  AND ABS(p.coordenadasx::DOUBLE PRECISION - r.lng) <= 0.00001
ON CONFLICT (codpunto) DO UPDATE SET
    lat = EXCLUDED.lat, lng = EXCLUDED.lng,
    pais = EXCLUDED.pais, provincia = EXCLUDED.provincia,
    actualizado_en = NOW();

-- Verificar los países/provincias que realmente tienen tiendas actualmente:
SELECT g.pais, g.provincia, COUNT(*) AS tiendas
FROM public.puntos_venta_geografia g
JOIN public.puntos_venta p ON p.codpunto::TEXT = g.codpunto
 AND p.coordenadasy::DOUBLE PRECISION = g.lat
 AND p.coordenadasx::DOUBLE PRECISION = g.lng
GROUP BY g.pais, g.provincia
ORDER BY g.pais, g.provincia;
