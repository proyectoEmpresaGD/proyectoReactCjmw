import fetch from 'node-fetch';

const TURNSTILE_VERIFY_URL =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const TURNSTILE_ACTION = 'contact';
const MAX_TOKEN_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 8000;

const getAllowedHostnames = () => {
    return new Set(
        (process.env.TURNSTILE_ALLOWED_HOSTNAMES || '')
            .split(',')
            .map((hostname) => hostname.trim().toLowerCase())
            .filter(Boolean)
    );
};

export const verifyTurnstileToken = async ({
    token,
    remoteIp,
}) => {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
        throw new Error(
            'TURNSTILE_SECRET_KEY_NOT_CONFIGURED'
        );
    }

    const normalizedToken =
        typeof token === 'string'
            ? token.trim()
            : '';

    if (
        !normalizedToken ||
        normalizedToken.length > MAX_TOKEN_LENGTH
    ) {
        return {
            success: false,
            reason: 'invalid-token',
        };
    }

    const body = new URLSearchParams({
        secret: secretKey,
        response: normalizedToken,
    });

    if (remoteIp) {
        body.set('remoteip', remoteIp);
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, VERIFY_TIMEOUT_MS);

    try {
        const response = await fetch(
            TURNSTILE_VERIFY_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded',
                },
                body,
                signal: controller.signal,
            }
        );

        if (!response.ok) {
            throw new Error(
                `TURNSTILE_HTTP_${response.status}`
            );
        }

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                reason: 'turnstile-rejected',
                errorCodes:
                    result['error-codes'] || [],
            };
        }

        if (result.action !== TURNSTILE_ACTION) {
            return {
                success: false,
                reason: 'invalid-action',
            };
        }

        const allowedHostnames =
            getAllowedHostnames();

        if (
            allowedHostnames.size > 0 &&
            !allowedHostnames.has(
                String(result.hostname || '')
                    .toLowerCase()
            )
        ) {
            return {
                success: false,
                reason: 'invalid-hostname',
            };
        }

        return {
            success: true,
            hostname: result.hostname,
            action: result.action,
        };
    } finally {
        clearTimeout(timeout);
    }
};