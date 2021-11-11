const express = require('express');
const {handler} = require('./handler');

const app = express();
app.get('*', handler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started: http://localhost:${port}`));
