import { getAuthCookieToken, verifyCustomerToken } from '../utils/authCookies.js';

export function optionalSessionAuth(req, _res, next) {
  try {
    const token = getAuthCookieToken(req);

    if (!token) {
      req.user = null;
      req.customer = null;
      return next();
    }

    const payload = verifyCustomerToken(token);

    req.user = {
      id: payload.accountId ?? payload.sub ?? null,
      email: payload.email ?? null,
      nif: payload.nif ?? null,
      role: payload.role ?? 'customer',
      codclien: payload.codclien ?? null,
    };

    req.customer = {
      accountId: payload.accountId ?? payload.sub ?? null,
      codclien: payload.codclien ?? null,
      nif: payload.nif ?? null,
    };

    return next();
  } catch (error) {
    console.error('AUTH MIDDLEWARE ERROR =>', error.message);
    req.user = null;
    req.customer = null;
    return next();
  }
}

export function optionalCustomerAuth(req, res, next) {
  return optionalSessionAuth(req, res, next);
}

export function requireAuth(req, res, next) {
  optionalSessionAuth(req, res, () => {
    if (!req.user?.id) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado.',
      });
    }

    return next();
  });
}

export function requireCustomerAuth(req, res, next) {
  optionalSessionAuth(req, res, () => {
    if (!req.customer?.codclien) {
      return res.status(401).json({
        ok: false,
        message: 'Cliente no autenticado',
      });
    }

    return next();
  });
}