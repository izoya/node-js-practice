const os = require('os');
const fs = require('fs');
const faker = require('faker');
const express = require('express');
const {Server} = require('socket.io');
const {createServer} = require('http');
const startWorker = require('./worker-init');
const {handler, chooseAction} = require('./handler');

const app = express();
const httpServer = createServer(app);
app.get('*', handler);

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log('Connection ', socket.id);
    socket.data.username = faker.name.findName();

    socket.broadcast.emit('NEW_CONN_EVENT', {msg: socket.data.username + ' joined the channel'});
    socketServer.emit('TOTAL_CONN', {count: socketServer.engine.clientsCount});

    socket.on('FOLLOW_LINK', async (link, callback) => {
        const filePath = link !== '/' ? link : os.homedir();

        if (!fs.existsSync(filePath)) {
            callback({status: 'error', message: 'Invalid path: ' + filePath});

            return;
        }

        callback({status: 'ok', data: await chooseAction(filePath)});
    });

    socket.on('SEARCH', async (searchData, callback) => {
        let data = await startWorker(searchData);
        data = data ? `<pre>${data}</pre>` : 'Nothing found.';

        callback({status: 'ok', data});
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('NEW_CONN_EVENT', {msg: socket.data.username + ' left the channel'});
    });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server started: http://localhost:${port}`));

module.exports = {app};
