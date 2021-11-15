const os = require('os');
const fs = require('fs');
const express = require('express');
const {Server} = require('socket.io');
const {createServer} = require('http');
const {handler, chooseAction} = require('./handler');

const app = express();
const httpServer = createServer(app);
app.get('*', handler);

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log('Connection ', socket.id);

    socket.on('FOLLOW_LINK', async (link, callback) => {
        const filePath = link !== '/' ? link : os.homedir();

        if (!fs.existsSync(filePath)) {
            callback({status: 'error', message: 'Invalid path: ' + filePath});

            return;
        }

        callback({status: 'ok', data: await chooseAction(filePath)});
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('NEW_CONN_EVENT', {msg: socket.data.username + ' left the channel'});
    });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server started: http://localhost:${port}`));

module.exports = {app};
