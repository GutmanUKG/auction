import { verifyJwt } from '../utils/jwt.js';

export default function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Нет токена' });

    try {
        const payload = verifyJwt(token);
        req.userId = payload.id;
        req.userRole = payload.role || 'user';
        next();
    } catch {
        return res.status(401).json({ message: 'Неверный/просроченный токен' });
    }
}
