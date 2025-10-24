import bcrypt from 'bcrypt';

const ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

export async function hashPassword(plain) {
    const salt = await bcrypt.genSalt(ROUNDS);
    return bcrypt.hash(plain, salt);
}
export function comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
