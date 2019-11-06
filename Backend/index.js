const app = require('express')();
const consign = require('consign');
const db = require('./config/db');
const { port, address } = require('./.env');

app.db = db;

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api/function.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app);

app.listen(port, address, () => {
    console.log(`Server listening on address:\u001b[34m http://${address}:${port}\u001b[0m`);
});