import { HttpError } from '../utils/httpError.js';

export default function adminAuth(req, res, next) {
    if (req.userRole !== 'admin') {
        throw new HttpError(403, 'Доступ запрещен. Требуются права администратора');
    }
    next();
}
