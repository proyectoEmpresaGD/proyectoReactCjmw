export function requireAdmin(req, res, next) {
    try {
        console.log('REQ.USER ADMIN CHECK =>', req.user);

        if (!req.user) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado.',
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                ok: false,
                message: 'No autorizado.',
            });
        }

        return next();
    } catch (error) {
        console.error('requireAdmin middleware', error);

        return res.status(500).json({
            ok: false,
            message: 'No se pudo validar el acceso de administrador.',
        });
    }
}