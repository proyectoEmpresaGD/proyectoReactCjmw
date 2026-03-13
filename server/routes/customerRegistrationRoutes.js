import { Router } from 'express';
import { CustomerRegistrationModel } from '../models/Postgres/customerRegistrationModel.js';
import { CustomerRegistrationController } from '../controllers/customerRegistrationController.js';
import { CustomerValidationService } from '../services/customerValidationService.js';
import { PasswordService } from '../services/passwordService.js';

export function createCustomerRegistrationRoutes({
    pool,
    requireAuth,
    requireAdmin,
    emailService,
}) {
    const router = Router();

    const customerRegistrationModel = new CustomerRegistrationModel({ pool });

    const customerValidationService = new CustomerValidationService({
        pool,
        tableName: 'clientes',
    });

    const passwordService = new PasswordService();

    const customerRegistrationController = new CustomerRegistrationController({
        customerRegistrationModel,
        passwordService,
        customerValidationService,
        emailService,
    });

    router.post(
        '/register-request',
        customerRegistrationController.registerRequest
    );

    router.get('/verify-email', customerRegistrationController.verifyEmail.bind(customerRegistrationController));
    router.post('/verify-email', customerRegistrationController.verifyEmail.bind(customerRegistrationController));

    router.get(
        '/admin/requests',
        requireAuth,
        requireAdmin,
        customerRegistrationController.adminListRequests
    );

    router.post(
        '/admin/requests/:requestId/approve',
        requireAuth,
        requireAdmin,
        customerRegistrationController.adminApproveRequest
    );

    router.post(
        '/admin/requests/:requestId/deny',
        requireAuth,
        requireAdmin,
        customerRegistrationController.adminDenyRequest
    );

    return router;
}