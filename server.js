const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'dom_tvoy',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database!');
});

app.get('/api/data/', (req, res) => {
    const { start, end } = req.query;
    const query = `SELECT * FROM houses_items LIMIT ${start}, ${end - start + 1}`;
    console.log(start + ' start');
    console.log(end + ' end')
    connection.query(query, (err, results) => {
        if (err) {
            res.json(err);
        } else {
            results.forEach(item => {
                if (item.slider_img !== '') {
                    let newImageList = item.slider_img.split(/,\s*/);
                    item.slider_img = newImageList;
                }
            });
            res.json(results);
        }
    });
});

app.get('/api/data/:id', (req, res) => {
    const itemId = req.params.id;
    console.log(itemId)
    connection.query('SELECT * FROM `houses_items` WHERE id = ?', [itemId], (err, results) => {
        if(err){
            console.log(err)
        }
        if(results.length === 0){
            console.log('не найдено')
            return res.status(404).json({error: 'Элемент не найден'})
        }
        const item = results[0]
        res.json(item)
    })
});
connection.on('error', (err) => {
    console.error('Database error: ', err);
});

let resData = {}
io.on('connection', (socket) => {
    //Обновление кол-ва участников
    socket.on('addPeople', (data)=>{
        resData = {
            id : data.id,
            counter: data.count
        }
        connection.query(`UPDATE houses_items SET current_people = ? WHERE id = ?`,
            [data.count, data.id],
            (err, results) => {
                if (err) {
                    console.error('Error updating field: ', err);
                    return;
                }
                console.log('Field updated current People successfully!');
            }
        );
        //Отправка кол-ва участников по всем пользователям
        io.emit('counterUpdated', resData); // Отправляем событие обновления счетчика всем клиентам
    })
    //Обновление цены лота
    socket.on('updatePrice', (data)=>{
        connection.query(`UPDATE houses_items SET price = ? WHERE id = ?`,
            [data.price, data.id],
            (err, results) => {
                if (err) {
                    console.error('Error updating field: ', err);
                    return;
                }
                console.log('Field updated Price successfully!');
            }
        );
        resData = {
            id : data.id,
            price: data.price,
            isNew: false,
            isStart : true,
            isLoseText: true,
            isShowLose: true
        }
        // Отправляем событие обновления цены всем пользователям, кроме обновившего
        socket.broadcast.emit('PriceUpdated', resData);
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
