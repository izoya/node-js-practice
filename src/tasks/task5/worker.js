const {workerData, parentPort} = require('worker_threads');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const {search, filePath} = workerData;
const readStream = fs.createReadStream(filePath, 'utf8');
const readlineInterface = readline.createInterface(readStream);

let result = '';

readlineInterface.on('close', () => {
    fs.writeFile(path.join(__dirname, 'test.txt'), result, () => {});
    parentPort.postMessage(result);
});

readlineInterface.on('line', line => {
    const regexp = new RegExp(search, 'g');
    result += regexp.test(line)
        ? line.replace(regexp, `<span style="color:red;"><b>${search}</b></span>`)
        : line;
    result += '\n';
});
