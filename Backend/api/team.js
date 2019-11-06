module.exports = app => {
    const { existsOrError, notExistsOrError } = app["api"]["validation"];

    const save = async (req, res) => {
        const team = { ...req.body } ;

        if (req.params.id)  team.id = req.params.id;

        try {
            existsOrError(team.name, 'Enter a team name!');
            existsOrError(team.supervisor, 'Enter a supervisor');

            const teamFromDB = await app.db('NodeProject_01.teams')
                .where({ name: team.name }).first();

            if (!team.id) {
                notExistsOrError(teamFromDB, 'Team already exists!')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (team.id) {
            app.db('NodeProject_01.teams')
                .update(team)
                .update({ updated_at: new Date() })
                .where({ id: team.id })
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('NodeProject_01.teams')
                .insert(team)
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    };

    const limit = 10;

    const get = async (req, res) => {
        const page = req.query.page || 1;

        const result = await app.db('NodeProject_01.teams as tm')
            .count('tm.id').whereNull('deleted_at').first();
        const count = parseInt(result.count);

        app.db('NodeProject_01.teams as tm')
            .select('tm.id', 'tm.name', 'emp.name as supervisor')
            .join('NodeProject_01.employees as emp', 'tm.supervisor', 'emp.id')
            .limit(limit).offset(page * limit - limit)
            .then(teams => res.json({ data : teams, count, limit}))
            .catch(err => res.status(500).send(err))
    };

    const getById = async (req, res) => {
        const id = req.params.id;

        if (req.query["employees"] === "all") {
            try {
                const team = await app.db('NodeProject_01.teams')
                    .select('teams.id', 'teams.name', 'employees.name as supervisor')
                    .join('NodeProject_01.employees', 'teams.id', 'employees.id')
                    .where('teams.id', `${id}`).first();

                team.employees = await app.db('NodeProject_01.employees_has_teams as team')
                    .select('emp.id', 'emp.name','emp.userName','emp.type')
                    .where({ team:team.id })
                    .join('NodeProject_01.employees as emp',
                        'emp.id', 'team.employee')
                    .orderBy('emp.id');

                const response = await app.db('NodeProject_01.employees_has_teams as team')
                    .count('employee').where({ team:team.id }).first();
                const countEmployees = parseInt(response.count);

                res.json({data: team, countEmployees})

            } catch (msg) {
                res.status(500).send(msg)
            }
        } else {
            try {
                const team = await app.db('NodeProject_01.teams')
                    .select('teams.id', 'teams.name', 'employees.name as supervisor')
                    .join('NodeProject_01.employees', 'teams.id', 'employees.id')
                    .where('teams.id', `${id}`);

                res.json(team)

            } catch (msg) {
                res.status(500).send(msg)
            }
        }

    };

    return { save, get, getById }

};
