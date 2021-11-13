const { Worker } = require('worker_threads');
const path = require('path')

function start(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './worker.js'), { workerData });

        worker.on('message', resolve);
        worker.on('error', reject);
    })
}

module.exports = start;


