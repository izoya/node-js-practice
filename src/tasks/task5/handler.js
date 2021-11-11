const path = require('path');
const fs = require('fs');
const os = require('os');
const FileType = require('file-type');

const lineHtml = fs.readFileSync('src/assets/includes/file-item.html', 'utf-8');
const fileHtml = fs.readFileSync('src/assets/includes/file-content.html', 'utf-8');
const imageHtml = fs.readFileSync('src/assets/includes/image-content.html', 'utf-8');

const PARENT_DIR = '..';
const PLACEHOLDER_HREF = '{{ href }}';
const PLACEHOLDER_BACK = '{{ back }}';
const PLACEHOLDER_CONTENT = '{{ content }}';

const showDir = (filePath) => {
    const dirList = fs.readdirSync(filePath);
    dirList.unshift(PARENT_DIR);

    return dirList.map(dir => lineHtml
        .replace(PLACEHOLDER_HREF, path.join(filePath, dir))
        .replace(PLACEHOLDER_CONTENT, dir))
        .join('');
};

const showFile = async (filePath) => {
    const fileContent = fs.readFileSync(filePath);
    const type = await FileType.fromFile(filePath);
    let html = fileHtml;

    if (type && type.mime.indexOf('image') !== -1) {
        html = imageHtml.replace(PLACEHOLDER_HREF, `data:${type.mime};base64,${fileContent.toString('base64')}`);
    }

    return html
        .replace(PLACEHOLDER_CONTENT, fileContent.toString('utf-8'))
        .replace(PLACEHOLDER_BACK, path.join(filePath, PARENT_DIR));
};

const chooseAction = async (filePath) => {
    if (fs.lstatSync(filePath).isFile()) {
        return await showFile(filePath);
    } else {
        return showDir(filePath);
    }
};

const handler = async (req, res) => {
    const filePath = req.params[0] !== '/' ? req.params[0] : os.homedir();

    if (!fs.existsSync(filePath)) {
        res.send('Invalid path: ' + filePath);

        return;
    }

    res.set('Content-Type', 'text/html');
    res.send(await chooseAction(filePath));
};

module.exports = {handler};
