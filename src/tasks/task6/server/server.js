const io = require('socket.io');
const app = require('./http-server');
const faker = require('faker');
const startWorker = require('./worker-init');

const socketServer = io(app);

socketServer.on('connection', (socket) => {
    console.log('Connection', socket.id);
    socket.data.username = faker.name.findName();

    socket.broadcast.emit('NEW_CONN_EVENT', {msg: socket.data.username + ' joined the channel'});
    socketServer.emit('TOTAL_CONN', {count: socketServer.engine.clientsCount});

    socket.on('CLIENT_MSG', (data) => {
        socketServer.emit('SERVER_MSG', {
            author: socket.data.username,
            msg: data.msg,
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('NEW_CONN_EVENT', {msg: socket.data.username + ' left the channel'});
    });
});

app.listen(3031, () => {
    console.log('Server started: http://localhost:3030');
});

startWorker(24).then(result => console.log(result));
