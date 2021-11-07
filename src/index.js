#!/usr/bin/env node
'use strict';
const minimist = require('minimist');
const {printPrimeNumbersWithColors} = require('./tasks/task1');
const {runTimers} = require('./tasks/task2');
const {fileManager} = require('./tasks/task4');

const info = (args) => {
    console.log('You should pass correct args to the script call.');
    console.log('Example: yarn dev --task <task-number> --arg1 <value> -- <other args>');
    console.log('You\'ve passed:');
    console.table(args);
};

const notFoundInfo = (args) => {
    console.log('Task #' + args.task + ' doesn\'t exists.');
    console.log('You\'ve passed args:');
    console.table(args);
};

const methods = {
    info,
    notFoundInfo,
    task1: printPrimeNumbersWithColors,
    task2: runTimers,
    task4: fileManager,
};

const args = minimist(process.argv.slice(2));
let method = args.task ? 'task' + args.task : 'info';

if (typeof methods[method] !== 'function') method = 'notFoundInfo';

methods[method](args);
