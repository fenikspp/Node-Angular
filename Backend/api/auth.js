const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {

    const signin = async (req, res) => {

        if (!req.body.userName || !req.body.password) {
            return res.status(400).send('Enter a User Name and Password');
        }

        const employee = await app.db('NodeProject_01.employees')
            .where({userName:req.body.userName}).first();

        if (!employee) return res.status(400).send('User not found!');

        const supervisor = await app.db('NodeProject_01.teams')
            .where({supervisor:employee.id});

        if (supervisor) {
            employee.supervisor = supervisor;
        }

        const isMatch = bcrypt.compareSync(req.body.password, employee.password);
        if (!isMatch) return res.status(401).send('Invalid UserName or Password!');

        const now = Math.floor( Date.now() / 1000 );

        const payload = {
            id: employee.id,
            type: employee.type,
            supervise: employee.supervisor,
            created_at: employee.created_at,
            iat: now,
            exp: now + (60 * 60 * 24)
        };

        res.json({
            ...payload,
            token: jwt.encode( payload, authSecret)
        });

    };

    const validateToken = async (req, res) => {
        const employeeData = req.body || null;
        try {
            if(employeeData) {
                const token = jwt.decode(employeeData.token, authSecret);
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true);
                }
            }
        } catch (e) {
            // problem with token
        }

        res.send(false);
    };

    return { signin , validateToken }

};
