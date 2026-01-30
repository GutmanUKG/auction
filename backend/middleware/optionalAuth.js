import jwt from 'jsonwebtoken';

export default function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            req.userRole = decoded.role;
        }
        
        // Продолжаем даже если нет токена
        next();
    } catch (error) {
        // Игнорируем ошибки токена и продолжаем без userId
        next();
    }
}
