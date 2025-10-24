import { db } from '../db.js';

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        avatarUrl: row.avatar_url,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function getById(id) {
    const row = await db('users').where({ id }).first();
    return mapRow(row);
}
export async function getAuthRowByEmail(email) {
    return db('users').where({ email }).first();
}
export async function getByEmail(email) {
    const row = await db('users').where({ email }).first();
    return mapRow(row);
}
export async function create({ fullName, email, phone, passwordHash, avatarUrl, role = 'user' }) {
    const [id] = await db('users').insert({
        full_name: fullName,
        email,
        phone: phone || null,
        password_hash: passwordHash,
        avatar_url: avatarUrl || null,
        role
    });
    return getById(id);
}
