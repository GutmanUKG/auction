import { HttpError } from '../utils/httpError.js';

export default function adminAuth(req, res, next) {
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            status: false,
            message: 'Доступ запрещен. Требуются права администратора'
        });
    }
    next();
}
