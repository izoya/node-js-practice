const { workerData, parentPort } = require('worker_threads');
const crypto = require('crypto');

const password = crypto.randomBytes(workerData).toString('hex');
parentPort.postMessage({ result: `Password was generated: ${password}` });
