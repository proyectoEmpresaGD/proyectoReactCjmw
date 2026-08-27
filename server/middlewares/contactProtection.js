import { verifyTurnstileToken } from '../services/turnstileService.js';

export const verifyTurnstile = async (
    req,
    res,
    next
) => {
    const token = req.get('x-turnstile-token');

    if (!token) {
        return res.status(403).json({
            error: 'SECURITY_VERIFICATION_REQUIRED',
        });
    }

    try {
        const verification =
            await verifyTurnstileToken({
                token,
                remoteIp: req.ip,
            });

        if (!verification.success) {
            console.warn(
                '[contact] Turnstile rejected:',
                verification.reason
            );

            return res.status(403).json({
                error: 'SECURITY_VERIFICATION_FAILED',
            });
        }

        req.turnstile = {
            hostname: verification.hostname,
            action: verification.action,
        };

        return next();
    } catch (error) {
        console.error(
            '[contact] Turnstile verification error:',
            error.message
        );

        return res.status(503).json({
            error: 'SECURITY_VERIFICATION_UNAVAILABLE',
        });
    }
};

export const blockHoneypot = (
    req,
    res,
    next
) => {
    const website =
        typeof req.body?.website === 'string'
            ? req.body.website.trim()
            : '';

    if (website) {
        return res.status(200).json({
            message: 'Request received.',
        });
    }

    return next();
};