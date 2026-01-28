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

export async function getAll(filters = {}) {
    let query = db('users').select('id', 'full_name', 'email', 'phone', 'avatar_url', 'role', 'created_at', 'updated_at');

    if (filters.role) {
        query = query.where('role', filters.role);
    }

    if (filters.search) {
        query = query.where(function() {
            this.where('full_name', 'like', `%${filters.search}%`)
                .orWhere('email', 'like', `%${filters.search}%`);
        });
    }

    query = query.orderBy('created_at', 'desc');

    const rows = await query;
    return rows.map(mapRow);
}

export async function update(id, data) {
    const updateData = {};

    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.passwordHash !== undefined) updateData.password_hash = data.passwordHash;

    updateData.updated_at = db.fn.now();

    await db('users').where({ id }).update(updateData);
    return getById(id);
}

export async function remove(id) {
    await db('users').where({ id }).delete();
}

export async function count(filters = {}) {
    let query = db('users').count('id as total');

    if (filters.role) {
        query = query.where('role', filters.role);
    }

    const result = await query.first();
    return result.total;
}
