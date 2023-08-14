import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('tateti')
});
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Escuchando en puerto http://localhost:${PORT}/`);
})

const io = new Server(server);

let rooms = [];

io.on('connection', async socket => {
    console.log('Socket connected');
    // socket.broadcast.emit('newUser')

    socket.on('join', async ({ room }) => {
        console.log(`Conectado al room ${room}`);
        console.log(rooms);
        socket.join(room);
    })

    socket.on('create_room', async ({ room }) => {
        console.log(`Conectado al room ${room}`);
        socket.join(room);
    })

    socket.on('start', async ({ room }) => {
        io.to(room).emit('start');
    })

    socket.on('movement', async ({ movement, room }) => {
        console.log(movement, room);
        socket.to(room).emit('movement', movement);
    })

    socket.on('reset', async ({ room }) => {
        console.log(room);
        socket.to(room).emit('reset');
    })

    socket.on('message', async ({ room, message }) => {
        console.log(room, message);
        socket.to(room).emit('message', message);
    })

    socket.on('connected', async (data) => {
        socket.broadcast.emit('connected', data);
    })
})