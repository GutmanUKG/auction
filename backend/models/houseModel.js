import { db } from '../db.js';

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        prevText: row.prev_text,
        text: row.text,
        startPrice: parseFloat(row.start_price),
        currentPrice: row.current_price ? parseFloat(row.current_price) : null,
        finishPrice: row.finish_price ? parseFloat(row.finish_price) : null,
        winnerUser: row.winner_user ? JSON.parse(row.winner_user) : [],
        images: row.images ? JSON.parse(row.images) : [],
        mainImage: row.main_image || '',
        country: row.country,
        city: row.city,
        street: row.street,
        address: row.address,
        area: row.area,
        countRoom: row.count_room,
        year: row.year,
        auctionStartDate: row.auction_start_date,
        viewsCount: row.views_count,
        userCount: row.user_count,
        userId: row.user_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        // Если есть данные пользователя из JOIN
        user: row.user_id ? {
            id: row.user_id,
            fullName: row.user_full_name,
            email: row.user_email,
            avatarUrl: row.user_avatar_url
        } : null
    };
}

export async function getById(id) {
    const row = await db('houses')
        .leftJoin('users', 'houses.user_id', 'users.id')
        .select(
            'houses.*',
            'users.full_name as user_full_name',
            'users.email as user_email',
            'users.avatar_url as user_avatar_url'
        )
        .where('houses.id', id)
        .first();
    return mapRow(row);
}

export async function getAll() {
    const rows = await db('houses')
        .leftJoin('users', 'houses.user_id', 'users.id')
        .select(
            'houses.*',
            'users.full_name as user_full_name',
            'users.email as user_email',
            'users.avatar_url as user_avatar_url'
        )
        .orderBy('houses.created_at', 'desc');
    return rows.map(mapRow);
}

export async function create(data) {
    const {
        name,
        prevText,
        text,
        startPrice,
        currentPrice,
        finishPrice,
        winnerUser = [],
        images = [],
        mainImage = '',
        country,
        city,
        street,
        address,
        area,
        countRoom,
        year,
        auctionStartDate,
        viewsCount = 0,
        userCount = 0,
        userId
    } = data;

    const [id] = await db('houses').insert({
        name,
        prev_text: prevText || null,
        text: text || null,
        start_price: startPrice,
        current_price: currentPrice || null,
        finish_price: finishPrice || null,
        winner_user: JSON.stringify(winnerUser),
        images: JSON.stringify(images),
        main_image: mainImage,
        country,
        city,
        street: street || null,
        address: address || null,
        area,
        count_room: countRoom,
        year: year || null,
        auction_start_date: auctionStartDate || null,
        views_count: viewsCount,
        user_count: userCount,
        user_id: userId
    });

    return getById(id);
}

export async function update(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.prevText !== undefined) updateData.prev_text = data.prevText;
    if (data.text !== undefined) updateData.text = data.text;
    if (data.startPrice !== undefined) updateData.start_price = data.startPrice;
    if (data.currentPrice !== undefined) updateData.current_price = data.currentPrice;
    if (data.finishPrice !== undefined) updateData.finish_price = data.finishPrice;
    if (data.winnerUser !== undefined) updateData.winner_user = JSON.stringify(data.winnerUser);
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.mainImage !== undefined) updateData.main_image = data.mainImage;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.area !== undefined) updateData.area = data.area;
    if (data.countRoom !== undefined) updateData.count_room = data.countRoom;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.auctionStartDate !== undefined) updateData.auction_start_date = data.auctionStartDate;
    if (data.viewsCount !== undefined) updateData.views_count = data.viewsCount;
    if (data.userCount !== undefined) updateData.user_count = data.userCount;

    updateData.updated_at = db.fn.now();

    await db('houses').where({ id }).update(updateData);
    return getById(id);
}

export async function remove(id) {
    await db('houses').where({ id }).delete();
}

export async function incrementViewsCount(id) {
    await db('houses').where({ id }).increment('views_count', 1);
}

export async function incrementUserCount(id) {
    await db('houses').where({ id }).increment('user_count', 1);
}
