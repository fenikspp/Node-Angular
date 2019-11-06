const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app["api"]["validation"];

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    };

    const save = async (req, res) => {
        const response = { ...req.body };
        let newObj = {};
        function getEmployee(obj) {
            if ('teams' in obj) {
                for (let i = 0; i < (Object.keys(obj).length - 1); i++) {
                    newObj[`${(Object.entries(obj)[i][0])}`] = `${Object.entries(obj)[i][1]}`;
                }
            } else {
                for (let i = 0; i < (Object.keys(obj).length); i++) {
                    newObj[`${(Object.entries(obj)[i][0])}`] = `${Object.entries(obj)[i][1]}`;
                }
            }

            return newObj;
        }

        function getTeams(obj) {
            if ('teams' in obj) {
                return obj.teams;
            } else {
                return undefined;
            }
        }

        const employee = getEmployee(response);
        const teams = getTeams(response);

        if (req.params.id) employee.id = req.params.id;

        try {
            existsOrError(employee.name, 'Enter a name!');
            existsOrError(employee["userName"], 'Enter a UserName!');
            existsOrError(employee.password, 'Enter a password!');
            existsOrError(employee["confirmPassword"], 'Confirm password!');
            equalsOrError(employee.password, employee["confirmPassword"],
                'The password and confirmation password do not match!');

            const employeeFromDB = await app.db('NodeProject_01.employees')
                .where({ userName: employee.userName }).first();

            if (!employee.id) {
                notExistsOrError(employeeFromDB, 'User already exists!');
            }

        } catch (msg) {
            return res.status(400).send(msg);
        }

        employee.password = encryptPassword(employee.password);
        delete employee["confirmPassword"];

        if (employee.id) {
            try {
                await app.db('NodeProject_01.employees')
                    .update(employee)
                    .where({ id : employee.id })
                    .whereNull('deleted_at');

                await app.db('NodeProject_01.employees')
                    .update({ updated_at: new Date() })
                    .where({ id : employee.id })
                    .whereNull('deleted_at');

                if (teams) {
                    for (let i = 0; i < Object.keys(teams).length; i++) {
                        let obj = Object.entries(teams)[i][1];
                        obj.employee = employee.id;
                        await app.db('NodeProject_01.employees_has_teams')
                            .insert(obj);
                    }
                }

                res.status(204).send('Successful')
            } catch (msg) {
                res.status(500).send(msg)
            }
        } else {
            try {
                 await app.db('NodeProject_01.employees')
                    .insert(employee);

                 const id = await  app.db('NodeProject_01.employees')
                    .select('id').where({userName: employee.userName}).first();

                if (teams) {
                    for (let i = 0; i < Object.keys(teams).length; i++) {
                        let obj = Object.entries(teams)[i][1];
                        obj.employee = parseInt(id.id);
                        await app.db('NodeProject_01.employees_has_teams')
                            .insert(obj);
                    }
                }



                res.status(204).send('Successful')
            } catch (msg) {
                res.status(500).send(msg)
            }
        }


    };

    const limit = 30;

    const get = async (req, res) => {
        try {
            const page = req.query.page || 1;

            const result = await app.db('NodeProject_01.employees')
                .count('employees.id').whereNull('deleted_at').first();
            const count = parseInt(result.count);


            let count_all = await app.db('NodeProject_01.employees')
                .count('employees.id').first();

            let employees = [];
            let supervisors = 0;

            for (let i = 0; i < parseInt(count_all.count) + 1; i++) {
                let teams = [];
                let supervisor = '';
                let employee = await app.db('NodeProject_01.employees')
                    .select('id', 'name', 'type', 'created_at' ,'deleted_at').where({id:i});

                if (employee.length !== 0) {
                    teams = await app.db('NodeProject_01.employees_has_teams as team')
                        .select('teams.id','teams.name', 'emp.name as supervisor')
                        .where({employee: employee[0].id})
                        .join('NodeProject_01.teams', 'teams.id', 'team.team')
                        .join('NodeProject_01.employees as emp', 'teams.supervisor', 'emp.id')
                        .orderBy('teams.id');

                    supervisor = await app.db('NodeProject_01.teams')
                        .where({supervisor:employee[0].id});

                    if (supervisor) {
                        employee[0].supervisor = supervisor;
                        if (supervisor.length) {
                            supervisors++;
                        }
                    }

                    employee[0].teams = teams;
                    if (!employee[0].deleted_at) {
                        employees.push(employee[0])
                    }
                }
            }
            res.json({ data: employees, count, supervisors, limit })
        } catch (err) {
            res.status(500).send(err)
        }
    };

    const getById = async (req, res) => {
        try {
            const employee = await app.db('NodeProject_01.employees as emp')
                .select('emp.id', 'emp.name', 'emp.userName', 'emp.type', 'deleted_at')
                .where({ id: req.params.id })
                .first();

            employee.teams = await app.db('NodeProject_01.employees_has_teams as team')
                .select('teams.id','teams.name', 'emp.name as supervisor')
                .where({employee: employee.id})
                .join('NodeProject_01.teams', 'teams.id', 'team.team')
                .join('NodeProject_01.employees as emp', 'teams.supervisor', 'emp.id')
                .orderBy('teams.id');

            if (!employee.deleted_at) {
                res.json(employee)
            } else {
                res.status(404).send("User was removed")
            }

        } catch (msg) {
            res.status(500).send(msg)
        }
    };

    const remove = async (req, res) => {
        if (req.query.team && req.params.id) {
            /* remove team */
            try {
                const rowsDeleted = await app.db('NodeProject_01.employees_has_teams')
                    .where({employee:req.params.id, team:req.query.team}).del();
                try {
                    existsOrError(rowsDeleted, 'Team not found')
                } catch(msg) {
                    return res.status(400).send(msg)
                }
                res.status(204).send()
            } catch (msg) {
                res.status(500).send(msg)
            }
        } else {
            /* remove user */
            try {

                const teams = await app.db('NodeProject_01.teams')
                    .where({ supervisor: req.params.id });
                notExistsOrError(teams, 'User is a supervisor');

                const rowsUpdated = await app.db('NodeProject_01.employees')
                    .update({ deleted_at: new Date() })
                    .where({ id: req.params.id});

                existsOrError(rowsUpdated, 'User not found!');


                res.status(204).send('Successful')

            } catch (msg) {
                res.status(400).send(msg)
            }
        }

    };

    return { save, get, getById, remove }

};
