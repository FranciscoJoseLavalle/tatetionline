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

const server = app.listen(8080, () => {
    console.log("Escuchando en puerto 8080");
})

const io = new Server(server);

io.on('connection', async socket => {
    console.log('Socket connected');
    // socket.broadcast.emit('newUser')

    socket.on('movement', async (data) => {
        console.log(data);
        socket.broadcast.emit('movement', data);
    })
    socket.on('connected', async (data) => {
        socket.broadcast.emit('connected', data);
    })
})