const io = require('socket.io');
const app = require('./http-server');
const startWorker = require('./worker-init');

const socketServer = io(app);

const DATABASE = {
    storage: {},
    async saveUser(data) {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.storage[data.payload.username] = data.payload;
    },
};

socketServer.on('connection', function (socket) {
    console.log('Connection', socket.id);

    socket.on('CLIENT_MSG', (data) => {
        console.log(data);
        // socket.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('')});
        // socket.broadcast.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('')});

        socketServer.emit('SERVER_MSG', {msg: data.msg.split('').reverse().join('')});
    });

    socket.on('SAVE_USER_DATA', async function ({payload, id}, ackFn) {
        await DATABASE.saveUser({payload});
        ackFn({error: 'ASd'});
    });
});

app.listen(3030, () => {
    console.log('Server started: http://localhost:3030');
});

startWorker(24).then(result => console.log(result));
