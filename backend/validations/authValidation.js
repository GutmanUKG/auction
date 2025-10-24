import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(2),
    phone: z.string().min(5).max(32).optional().or(z.literal('').transform(() => undefined)),
    password: z.string().min(6),
    avatarUrl: z.string().url().optional()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export function validate(schema) {
    return (req, res, next) => {
        const body = { ...req.body };
        if (body.email) body.email = String(body.email).trim().toLowerCase();

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json({ status: false, message: 'Validation error', details: issues });
        }
        req.body = parsed.data;
        next();
    };
}
