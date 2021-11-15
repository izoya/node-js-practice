/**
 * По ссылке вы найдете файл с логами запросов к серверу весом более 2 Гб.
 * Напишите программу, которая находит в этом файле все записи с ip-адресами 89.123.1.41 и 34.48.240.111,
 * а также сохраняет их в отдельные файлы с названием “%ip-адрес%_requests.log”.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {EOL} = require('os');

const storagePath = path.join('storage');
const filename = path.join(storagePath, 'access.log');
const resultFileSuffix = '_requests.log';
const defaultIpList = ['89.123.1.41', '34.48.240.111'];

const getOutputFile = (ip) => path.join(storagePath, ip + resultFileSuffix);

const startParsing = (args) => {
    console.log('Script call example: yarn dev --task=3 [--ip=127.0.0.1,192.168.0.1]');

    const ipList = args.ip ? args.ip.split(',') : defaultIpList;
    const outputFiles = ipList.map(ip => getOutputFile(ip));
    const writeStreams = [];

    console.log('Getting access logs for ips: ', ipList);

    const readStream = fs.createReadStream(filename, 'utf8');
    const readlineInterface = readline.createInterface({input: readStream});

    outputFiles.forEach(file => writeStreams.push(fs.createWriteStream(file, 'utf-8')));

    readStream.on('open', () => console.log('Start parsing...'));
    readStream.on('close', () => {
        console.log('Parsing finished. Report files: ');
        outputFiles.forEach(file => console.log('   * ' + file));
        writeStreams.forEach(stream => stream.end());
    });

    readlineInterface.on('line', line => {
        ipList.forEach((ip, index) => {
            const regexp = new RegExp(ip);
            regexp.test(line) && writeStreams[index].write(line + EOL);
        });
    });
};

module.exports = {startParsing};
