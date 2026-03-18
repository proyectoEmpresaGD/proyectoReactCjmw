import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {
  signCustomerToken,
  setAuthCookie,
  clearAuthCookie,
} from '../utils/authCookies.js';

export class AuthController {
  constructor({ authModel, emailService }) {
    this.authModel = authModel;
    this.emailService = emailService;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.me = this.me.bind(this);
    this.register = this.register.bind(this);

    this.forgotPassword = this.forgotPassword.bind(this);
    this.passwordResetEntry = this.passwordResetEntry.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body ?? {};

      const normalizedEmail = this.normalizeEmail(email);

      if (!normalizedEmail || !password) {
        return res.status(400).json({
          ok: false,
          message: 'El correo y la contraseña son obligatorios.',
        });
      }

      const account = await this.authModel.findAccountByEmail(normalizedEmail);

      if (!account) {
        return res.status(401).json({
          ok: false,
          message: 'Credenciales incorrectas.',
        });
      }

      const passwordMatches = await bcrypt.compare(password, account.password_hash);

      if (!passwordMatches) {
        return res.status(401).json({
          ok: false,
          message: 'Credenciales incorrectas.',
        });
      }

      if (account.status === 'denied') {
        return res.status(403).json({
          ok: false,
          code: 'ACCOUNT_DENIED',
          message: 'Tu solicitud ha sido denegada.',
        });
      }

      if (account.status !== 'approved') {
        return res.status(403).json({
          ok: false,
          code: 'ACCOUNT_NOT_APPROVED',
          message: 'Tu cuenta todavía no está aprobada.',
        });
      }

      if (!account.is_active) {
        return res.status(403).json({
          ok: false,
          code: 'ACCOUNT_INACTIVE',
          message: 'Tu cuenta no está activa.',
        });
      }

      if (!account.email_verified) {
        return res.status(403).json({
          ok: false,
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Debes verificar tu correo antes de iniciar sesión.',
        });
      }

      const primaryCustomerLink =
        account.role === 'admin'
          ? null
          : await this.authModel.getPrimaryCustomerLink(account.id);

      if (account.role !== 'admin' && !primaryCustomerLink?.codclien) {
        return res.status(403).json({
          ok: false,
          code: 'CUSTOMER_LINK_NOT_FOUND',
          message: 'Tu cuenta no tiene un cliente asociado.',
        });
      }

      const linkedCustomers =
        account.role === 'admin'
          ? []
          : await this.authModel.getLinkedCustomers(account.id);

      const primaryCustomer = linkedCustomers[0] ?? null;

      const tokenPayload = {
        sub: account.id,
        accountId: account.id,
        email: account.email,
        role: account.role || 'customer',
        codclien: primaryCustomerLink?.codclien ?? null,
        nif: primaryCustomer?.nif ?? null,
      };

      const token = signCustomerToken(tokenPayload);

      clearAuthCookie(res);
      setAuthCookie(res, token);

      await this.authModel.touchLastLogin(account.id);

      return res.status(200).json({
        ok: true,
        message: 'Inicio de sesión correcto.',
        data: {
          user: {
            id: account.id,
            email: account.email,
            role: account.role || 'customer',
            status: account.status,
            emailVerified: account.email_verified,
            isActive: account.is_active,
          },
          customers: linkedCustomers,
        },
      });
    } catch (error) {
      console.error('authController.login', error);

      return res.status(500).json({
        ok: false,
        message: 'No se pudo iniciar sesión.',
      });
    }
  };

  logout = async (_req, res) => {
    try {
      clearAuthCookie(res);

      return res.status(200).json({
        ok: true,
        message: 'Sesión cerrada correctamente.',
      });
    } catch (error) {
      console.error('authController.logout', error);

      return res.status(500).json({
        ok: false,
        message: 'No se pudo cerrar la sesión.',
      });
    }
  };

  me = async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          ok: false,
          message: 'No autenticado.',
        });
      }

      const account = await this.authModel.findAccountById(req.user.id);

      if (!account) {
        return res.status(404).json({
          ok: false,
          message: 'Cuenta no encontrada.',
        });
      }

      const linkedCustomers =
        account.role === 'admin'
          ? []
          : await this.authModel.getLinkedCustomers(account.id);

      return res.status(200).json({
        ok: true,
        data: {
          user: {
            id: account.id,
            email: account.email,
            role: account.role || 'customer',
            status: account.status,
            emailVerified: account.email_verified,
            emailVerifiedAt: account.email_verified_at,
            isActive: account.is_active,
            approvedAt: account.approved_at,
            deniedAt: account.denied_at,
          },
          customers: linkedCustomers,
        },
      });
    } catch (error) {
      console.error('authController.me', error);

      return res.status(500).json({
        ok: false,
        message: 'No se pudo obtener la sesión.',
      });
    }
  };

  register = async (_req, res) => {
    return res.status(410).json({
      ok: false,
      message: 'El registro directo ya no está disponible. Usa la solicitud de registro.',
    });
  };

  async forgotPassword(req, res) {
    try {
      const { email } = req.body ?? {};
      const normalizedEmail = this.normalizeEmail(email);

      if (!normalizedEmail) {
        return res.status(400).json({
          ok: false,
          message: 'El correo es obligatorio.',
        });
      }

      const account = await this.authModel.findAccountByEmail(normalizedEmail);

      if (account) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3 * 60 * 60 * 1000);

        await this.authModel.setPasswordResetToken(account.id, token, expires);

        const resetUrl = `${process.env.BACKEND_URL}/api/auth/password-reset/${token}`;

        await this.emailService.sendPasswordResetEmail({
          to: account.email,
          firstName: account.email,
          resetUrl,
        });
      }

      return res.status(200).json({
        ok: true,
        message: 'Si el correo está registrado, recibirás un enlace para cambiar tu contraseña.',
      });
    } catch (error) {
      console.error('authController.forgotPassword', error);

      return res.status(500).json({
        ok: false,
        message: 'No se pudo procesar la recuperación de contraseña.',
      });
    }
  }

  async passwordResetEntry(req, res) {
    try {
      const { token } = req.params;

      const account = await this.authModel.findByPasswordResetToken(token);

      if (!account) {
        return res.redirect(`${process.env.FRONTEND_URL}/#/login`);
      }

      if (!account.password_reset_expires_at) {
        return res.redirect(`${process.env.FRONTEND_URL}/#/login`);
      }

      if (new Date(account.password_reset_expires_at) < new Date()) {
        return res.redirect(`${process.env.FRONTEND_URL}/#/login`);
      }

      res.cookie('password_reset_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 3 * 60 * 60 * 1000,
      });

      return res.redirect(`${process.env.FRONTEND_URL}/#/restablecer-password`);
    } catch (error) {
      console.error('authController.passwordResetEntry', error);
      return res.redirect(`${process.env.FRONTEND_URL}/#/login`);
    }
  }

  async resetPassword(req, res) {
    try {
      const { password } = req.body ?? {};
      const token = req.cookies.password_reset_session;

      if (!token) {
        return res.status(400).json({
          ok: false,
          message: 'Token inválido.',
        });
      }

      if (!password || String(password).trim().length < 8) {
        return res.status(400).json({
          ok: false,
          message: 'La contraseña debe tener al menos 8 caracteres.',
        });
      }

      const account = await this.authModel.findByPasswordResetToken(token);

      if (!account) {
        return res.status(400).json({
          ok: false,
          message: 'Token inválido.',
        });
      }

      if (!account.password_reset_expires_at) {
        return res.status(400).json({
          ok: false,
          message: 'Token inválido.',
        });
      }

      if (new Date(account.password_reset_expires_at) < new Date()) {
        return res.status(400).json({
          ok: false,
          message: 'Token expirado.',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await this.authModel.updatePassword(account.id, passwordHash);
      await this.authModel.clearPasswordReset(account.id);

      res.clearCookie('password_reset_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      });

      return res.status(200).json({
        ok: true,
        message: 'Contraseña actualizada correctamente.',
      });
    } catch (error) {
      console.error('authController.resetPassword', error);

      return res.status(500).json({
        ok: false,
        message: 'No se pudo cambiar la contraseña.',
      });
    }
  }

  normalizeEmail(email = '') {
    return String(email).trim().toLowerCase();
  }
}