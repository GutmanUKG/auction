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

app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM houses_items', (err, results) => {
        if (err) {
            res.json(err);
        }
        results.forEach(item => {
            if (item.slider_img != '') {
                let newImageList = item.slider_img.split(/,\s*/)
                item.slider_img = newImageList
            }
        })
        res.json(results)
    });
});

connection.on('error', (err) => {
    console.error('Database error: ', err);
});
let counter = 0;
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
                console.log('Field updated successfully!');
            }
        );
        io.emit('counterUpdated', resData); // Отправляем событие обновления счетчика всем клиентам
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
