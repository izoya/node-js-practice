/**
 * В домашнем задании вам нужно будет применить полученные знания к программе, которую вы написали по итогам прошлого урока.
 * Для этого превратите её в консольное приложение, по аналогии с разобранным примером и добавьте следующие функции:
 * Возможность передавать путь к директории в программу.
 * Это актуально, когда вы не хотите покидать текущую директорию, но вам необходимо просмотреть файл, находящийся в другом месте;
 * В содержимом директории переходить во вложенные каталоги;
 * При чтении файлов искать в них заданную строку или паттерн.
 */

const fs = require('fs');
const path = require('path');
const colors = require('colors');
const inquirer = require('inquirer');
const readline = require('readline');

const ACTION_QUIT = 'quit';
const ACTION_CONTINUE = 'continue';
const PARENT_DIR = '..';

const cwd = process.cwd();

const showDir = (filePath) => {
    const dirList = fs.readdirSync(filePath);
    dirList.unshift(PARENT_DIR);

    inquirer
        .prompt({
            name: 'newPath',
            type: 'list',
            message: filePath,
            choices: dirList,
            prefix: 'Browse directory:',
            loop: false,
        })
        .then(({newPath}) => chooseAction(path.join(filePath, newPath)));
};

const showFile = (filePath) => {
    inquirer
        .prompt({
            name: 'search',
            type: 'input',
            message: 'What exactly are you looking for? ',
            suffix: '(specify the search string)',
        })
        .then(({search}) => {
            const readStream = fs.createReadStream(filePath, 'utf8');
            const readlineInterface = readline.createInterface(readStream);

            let matchesCount = 0;

            readlineInterface.on('close', () => {
                search && console.log(colors.yellow.bold(matchesCount + ' matches found.'));

                inquirer
                    .prompt({
                        name: 'action',
                        type: 'list',
                        message: 'Select an option',
                        choices: [
                            {name: 'Continue browsing', value: ACTION_CONTINUE},
                            {name: 'Exit', value: ACTION_QUIT},
                        ],
                    }).then(({action}) => {
                        if (action === ACTION_QUIT) return;
                        chooseAction(path.join(filePath, PARENT_DIR));
                    });
            });

            readlineInterface.on('line', line => {
                const regexp = new RegExp(search, 'g');

                if (regexp.test(line)) {
                    matchesCount++;
                    console.log(line.replace(regexp, colors.red.bold(search)));
                }
            });
        });
};

const chooseAction = (filePath) => {
    if (fs.lstatSync(filePath).isFile()) {
        showFile(filePath);
    } else {
        showDir(filePath);
    }
};

const fileManager = (args) => {
    if (!args.p) console.log('App call example: node-me --task=4 [--p=path/to/file]');

    const filePath = path.isAbsolute(args.p) ? args.p : path.join(cwd, args.p);

    if (!fs.existsSync(filePath)) {
        console.log('Invalid path: ' + filePath);

        return;
    }
    chooseAction(filePath);
};

module.exports = {fileManager};
