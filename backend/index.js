import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.js';
import cors from 'cors';


const app = express();
app.use(cors({
    origin: [
        'http://localhost',
        'http://localhost:80',
        'http://localhost:5173', // Vite
        'http://localhost:8080', // Vue-CLI dev
        'http://127.0.0.1',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
    ],
    credentials: true,
}));
app.use(express.json());

app.options('*', cors());
app.use(authRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

// Глобальный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    const status = err?.status || 500;
    const payload = err?.payload || {};
    res.status(status).json({ status: false, message: err?.message || 'Internal error', ...payload });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API on', PORT));
