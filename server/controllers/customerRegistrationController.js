import crypto from 'node:crypto';

export class CustomerRegistrationController {
    constructor({
        customerRegistrationModel,
        passwordService,
        customerValidationService,
        emailService,
    }) {
        this.customerRegistrationModel = customerRegistrationModel;
        this.passwordService = passwordService;
        this.customerValidationService = customerValidationService;
        this.emailService = emailService;
    }

    registerRequest = async (req, res) => {
        try {
            const {
                email,
                confirmEmail,
                firstName,
                lastName,
                password,
                confirmPassword,
                phone,
                mobilePhone,
                streetAddress,
                addressLine2,
                city,
                stateProvince,
                postcode,
                country,
                codclien,
            } = req.body ?? {};

            const normalizedEmail = this.normalizeEmail(email);
            const normalizedConfirmEmail = this.normalizeEmail(confirmEmail);
            const normalizedCodclien = this.normalizeCustomerCode(codclien);

            const validationErrors = this.validateRegisterPayload({
                email: normalizedEmail,
                confirmEmail: normalizedConfirmEmail,
                firstName,
                lastName,
                password,
                confirmPassword,
                codclien: normalizedCodclien,
            });

            if (validationErrors.length > 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Datos de registro no válidos.',
                    errors: validationErrors,
                });
            }

            const existingRequest = await this.customerRegistrationModel.findRequestByEmail(normalizedEmail);
            if (existingRequest) {
                return res.status(409).json({
                    ok: false,
                    message: 'Ya existe una solicitud registrada con ese correo.',
                });
            }

            const existingAccount = await this.customerRegistrationModel.findAccountByEmail(normalizedEmail);
            if (existingAccount) {
                return res.status(409).json({
                    ok: false,
                    message: 'Ya existe una cuenta registrada con ese correo.',
                });
            }

            const customerValidationResult = await this.customerValidationService.validateCustomerCode({
                codclien: normalizedCodclien,
            });

            if (!customerValidationResult?.isValid) {
                return res.status(400).json({
                    ok: false,
                    message: 'El código de cliente no es válido.',
                });
            }

            const passwordHash = await this.passwordService.hash(password);

            const createdRequest = await this.customerRegistrationModel.createRequest({
                email: normalizedEmail,
                firstName: this.cleanRequiredText(firstName),
                lastName: this.cleanRequiredText(lastName),
                passwordHash,
                phone: this.cleanNullableText(phone),
                mobilePhone: this.cleanNullableText(mobilePhone),
                streetAddress: this.cleanNullableText(streetAddress),
                addressLine2: this.cleanNullableText(addressLine2),
                city: this.cleanNullableText(city),
                stateProvince: this.cleanNullableText(stateProvince),
                postcode: this.cleanNullableText(postcode),
                country: this.cleanNullableText(country),
                codclien: normalizedCodclien,
            });

            return res.status(201).json({
                ok: true,
                message: 'Solicitud registrada correctamente. Queda pendiente de revisión por un administrador.',
                data: {
                    id: createdRequest.id,
                    email: createdRequest.email,
                    firstName: createdRequest.first_name,
                    lastName: createdRequest.last_name,
                    codclien: createdRequest.codclien,
                    status: createdRequest.status,
                    createdAt: createdRequest.created_at,
                },
            });
        } catch (error) {
            console.error('customerRegistrationController.registerRequest', error);

            return res.status(500).json({
                ok: false,
                message: 'No se pudo registrar la solicitud.',
            });
        }
    };

    adminListRequests = async (req, res) => {
        try {
            const { status = 'pending', limit = 50, offset = 0 } = req.query ?? {};

            const requests = await this.customerRegistrationModel.listRequests({
                status: status || null,
                limit: Number(limit) || 50,
                offset: Number(offset) || 0,
            });

            return res.status(200).json({
                ok: true,
                data: requests,
            });
        } catch (error) {
            console.error('customerRegistrationController.adminListRequests', error);

            return res.status(500).json({
                ok: false,
                message: 'No se pudieron cargar las solicitudes.',
            });
        }
    };

    adminApproveRequest = async (req, res) => {
        try {
            const requestId = Number(req.params?.requestId);
            const reviewedBy = this.resolveAdminIdentity(req);

            if (!Number.isInteger(requestId) || requestId <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'El identificador de la solicitud no es válido.',
                });
            }

            const approvalResult = await this.customerRegistrationModel.createApprovedAccountFromRequest({
                requestId,
                reviewedBy,
            });

            const verificationToken = crypto.randomBytes(32).toString('hex');

            await this.customerRegistrationModel.saveEmailVerificationToken({
                accountId: approvalResult.account.id,
                token: verificationToken,
            });

            const verificationUrl = this.buildVerificationUrl(req, verificationToken);

            if (this.emailService?.sendCustomerVerificationEmail) {
                await this.emailService.sendCustomerVerificationEmail({
                    to: approvalResult.account.email,
                    firstName: approvalResult.request.first_name,
                    verificationUrl,
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Solicitud aprobada correctamente. Se ha enviado el correo de verificación.',
                data: {
                    request: approvalResult.request,
                    account: {
                        id: approvalResult.account.id,
                        email: approvalResult.account.email,
                        status: approvalResult.account.status,
                        emailVerified: approvalResult.account.email_verified,
                        approvedAt: approvalResult.account.approved_at,
                    },
                },
            });
        } catch (error) {
            console.error('customerRegistrationController.adminApproveRequest', error);

            if (error.message === 'REQUEST_NOT_FOUND') {
                return res.status(404).json({
                    ok: false,
                    message: 'La solicitud no existe.',
                });
            }

            if (error.message === 'REQUEST_NOT_PENDING') {
                return res.status(409).json({
                    ok: false,
                    message: 'La solicitud ya no está pendiente.',
                });
            }

            if (error.message === 'ACCOUNT_ALREADY_EXISTS') {
                return res.status(409).json({
                    ok: false,
                    message: 'Ya existe una cuenta con ese correo.',
                });
            }

            return res.status(500).json({
                ok: false,
                message: 'No se pudo aprobar la solicitud.',
            });
        }
    };

    adminDenyRequest = async (req, res) => {
        try {
            const requestId = Number(req.params?.requestId);
            const { denialReason } = req.body ?? {};
            const reviewedBy = this.resolveAdminIdentity(req);

            if (!Number.isInteger(requestId) || requestId <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'El identificador de la solicitud no es válido.',
                });
            }

            const deniedRequest = await this.customerRegistrationModel.denyRequest({
                requestId,
                reviewedBy,
                denialReason: this.cleanNullableText(denialReason),
            });

            if (!deniedRequest) {
                return res.status(404).json({
                    ok: false,
                    message: 'La solicitud no existe o ya no está pendiente.',
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Solicitud denegada correctamente.',
                data: deniedRequest,
            });
        } catch (error) {
            console.error('customerRegistrationController.adminDenyRequest', error);

            return res.status(500).json({
                ok: false,
                message: 'No se pudo denegar la solicitud.',
            });
        }
    };

    async verifyEmail(req, res, next) {
        const frontendUrl =
            process.env.FRONTEND_URL?.trim() ||
            'http://localhost:5173';

        const successUrl = `${frontendUrl}/#/login?verified=1`;
        const errorUrl = `${frontendUrl}/#/login?verified=0`;

        try {
            const token = req.query?.token?.trim();

            console.log('TOKEN RECIBIDO:', token);

            if (!token) {
                console.log('No llega token');
                return res.redirect(302, errorUrl);
            }

            const result = await this.customerRegistrationModel.verifyEmailByToken(token);
            console.log('RESULTADO VERIFY:', result);

            return res.redirect(302, successUrl);
        } catch (error) {
            console.error('ERROR VERIFY EMAIL:', error);
            return res.redirect(302, errorUrl);
        }
    }

    validateRegisterPayload({
        email,
        confirmEmail,
        firstName,
        lastName,
        password,
        confirmPassword,
        codclien,
    }) {
        const errors = [];

        if (!email) {
            errors.push({ field: 'email', message: 'El correo es obligatorio.' });
        }

        if (!confirmEmail) {
            errors.push({ field: 'confirmEmail', message: 'La confirmación del correo es obligatoria.' });
        }

        if (email && confirmEmail && email !== confirmEmail) {
            errors.push({ field: 'confirmEmail', message: 'Los correos no coinciden.' });
        }

        if (email && !this.isValidEmail(email)) {
            errors.push({ field: 'email', message: 'El correo no tiene un formato válido.' });
        }

        if (!this.cleanRequiredText(firstName)) {
            errors.push({ field: 'firstName', message: 'El nombre es obligatorio.' });
        }

        if (!this.cleanRequiredText(lastName)) {
            errors.push({ field: 'lastName', message: 'Los apellidos son obligatorios.' });
        }

        if (!password) {
            errors.push({ field: 'password', message: 'La contraseña es obligatoria.' });
        }

        if (!confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'La confirmación de contraseña es obligatoria.' });
        }

        if (password && confirmPassword && password !== confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Las contraseñas no coinciden.' });
        }

        if (password && password.length < 8) {
            errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        if (!codclien) {
            errors.push({ field: 'codclien', message: 'El código de cliente es obligatorio.' });
        }

        return errors;
    }

    buildVerificationUrl(req, token) {
        const configuredBaseUrl = process.env.CUSTOMER_VERIFY_EMAIL_URL?.trim();

        if (configuredBaseUrl) {
            const separator = configuredBaseUrl.includes('?') ? '&' : '?';
            return `${configuredBaseUrl}${separator}token=${encodeURIComponent(token)}`;
        }

        return `${req.protocol}://${req.get('host')}/api/customer-registration/verify-email?token=${encodeURIComponent(token)}`;
    }

    resolveAdminIdentity(req) {
        return (
            req.user?.email ||
            req.user?.username ||
            req.user?.id ||
            'admin'
        );
    }

    normalizeEmail(email = '') {
        return String(email).trim().toLowerCase();
    }

    normalizeCustomerCode(codclien = '') {
        return String(codclien).trim().toUpperCase();
    }

    cleanRequiredText(value) {
        const normalizedValue = String(value ?? '').trim();
        return normalizedValue.length ? normalizedValue : '';
    }

    cleanNullableText(value) {
        const normalizedValue = String(value ?? '').trim();
        return normalizedValue.length ? normalizedValue : null;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}