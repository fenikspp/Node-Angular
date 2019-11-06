const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(cors());
    app.use(session({
        secret: 'da illest developer',
        resave: true,
        saveUninitialized: true
    }))
};