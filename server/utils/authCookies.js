import jwt from 'jsonwebtoken';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'customer_token';
const DEFAULT_EXPIRATION = '7d';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en variables de entorno');
  }

  return process.env.JWT_SECRET;
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getCookieOptions() {
  const production = isProduction();

  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function signCustomerToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRATION,
  });
}

export function verifyCustomerToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
}

export function clearAuthCookie(res) {
  const clearOptions = {
    ...getCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  };

  res.clearCookie(AUTH_COOKIE_NAME, clearOptions);
  res.clearCookie('customer_session', clearOptions);
}

export function getAuthCookieToken(req) {
  return req.cookies?.[AUTH_COOKIE_NAME] || null;
}

export { AUTH_COOKIE_NAME };