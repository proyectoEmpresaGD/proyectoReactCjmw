import bcrypt from 'bcrypt';

export class PasswordService {
    constructor({ saltRounds = 10 } = {}) {
        this.saltRounds = saltRounds;
    }

    async hash(value) {
        const plainValue = String(value ?? '');

        if (!plainValue) {
            throw new Error('PASSWORD_REQUIRED');
        }

        return bcrypt.hash(plainValue, this.saltRounds);
    }

    async compare(value, hash) {
        const plainValue = String(value ?? '');
        const hashedValue = String(hash ?? '');

        if (!plainValue || !hashedValue) {
            return false;
        }

        return bcrypt.compare(plainValue, hashedValue);
    }
}