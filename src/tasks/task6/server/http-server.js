const http = require('http');
const fs = require('fs');
const path = require('path');

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.resolve('src/assets/index.html');
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';

        request.on('data', chunk => {
            data += chunk;
        });

        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);

            response.writeHead(200, {'Content-Type': 'json'});
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

module.exports = app;
