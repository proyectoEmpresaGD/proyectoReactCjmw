import { Router } from 'express';
import { AuthModel } from '../models/Postgres/authModel.js';
import { AuthController } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

export function createAuthRouter({ pool, emailService }) {
  const router = Router();

  const authModel = new AuthModel({ pool });
  const authController = new AuthController({ authModel, emailService });

  router.post('/login', authController.login);
  router.post('/logout', authController.logout);
  router.get('/me', requireAuth, authController.me);

  router.post('/register', authController.register);
  router.post('/forgot-password', authController.forgotPassword);
  router.get('/password-reset/:token', authController.passwordResetEntry);
  router.post('/reset-password', authController.resetPassword);

  return router;
}