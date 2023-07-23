//Node Server to handle IO Connections
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 8000;

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users_online = {};

io.on('connection', socket => {
    socket.on('new-user', name => {
        users_online[socket.id] = name;
        console.log(`${users_online[socket.id]} joined`)
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', msg => {
        socket.broadcast.emit('newmsg', { msg: msg, name: users_online[socket.id] })
    });

    socket.on('disconnect', msg => {
        console.log(`${users_online[socket.id]} left`)
        socket.broadcast.emit('left', users_online[socket.id]);
        delete users_online[socket.id];
    });
})

server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});