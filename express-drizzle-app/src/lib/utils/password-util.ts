import * as bcrypt from "bcrypt"

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
}

async function comparePasswords(plainPassword: string, storedHash: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(plainPassword, storedHash);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Failed to compare passwords');
    }
}

export const PasswordUtil = {
    hashPassword,
    comparePasswords
}