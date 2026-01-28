import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import houseRoutes from './routes/houses.js';
import userRoutes from './routes/users.js';
import cors from 'cors';
import { db } from './db.js';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost',
            'http://localhost:80',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://127.0.0.1',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

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
app.use(houseRoutes);
app.use(userRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

// Socket.IO обработчики
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Обновление количества участников
    socket.on('addPeople', async (data) => {
        try {
            await db('houses')
                .where({ id: data.id })
                .increment('user_count', 1);

            const house = await db('houses').where({ id: data.id }).first();

            const resData = {
                id: data.id,
                counter: house.user_count
            };

            io.emit('counterUpdated', resData);
            console.log('User count updated successfully!');
        } catch (err) {
            console.error('Error updating user count:', err);
        }
    });

    // Обновление цены лота
    socket.on('updatePrice', async (data) => {
        try {
            await db('houses')
                .where({ id: data.id })
                .update({ current_price: data.price });

            const resData = {
                id: data.id,
                price: data.price,
                isNew: false,
                isStart: true,
                isLoseText: true,
                isShowLose: true
            };

            // Отправляем всем, кроме отправителя
            socket.broadcast.emit('PriceUpdated', resData);
            console.log('Price updated successfully!');
        } catch (err) {
            console.error('Error updating price:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Глобальный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    const status = err?.status || 500;
    const payload = err?.payload || {};
    res.status(status).json({ status: false, message: err?.message || 'Internal error', ...payload });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log('API with Socket.IO on', PORT));
