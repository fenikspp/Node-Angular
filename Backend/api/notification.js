module.exports = app => {
    const { existsOrError, notExistsOrError } = app["api"]["validation"];
    const { formatDate } = app["api"]["function"];

    const save = async (req, res) => {
        const notification = { ...req.body };

        try {
            existsOrError(notification["to"], 'Enter a userName to sent a notification!');
            existsOrError(notification.subject, 'Enter a subject!');
            existsOrError(notification.content, 'Enter a content!');
        } catch (msg) {
            return res.status(400).send(msg)
        }

        app.db('NodeProject_01.notifications')
            .insert(notification)
            .then(() => res.status(204).send())
            .catch(err => res.status(500).send(err))

    };

    const limit = 20;

    const get = async (req, res) => {

        try {
            const employee = req.query.employee || null;
            const page = req.query.page || 1;

            if (employee) {
                const result = await app.db('NodeProject_01.notifications')
                    .count('notifications.id').where({to:employee}).first();
                const allNotifications = parseInt(result.count);

                const newResult = await app.db('NodeProject_01.notifications')
                    .count('notifications.id').where({status: 'sent', to: employee}).first();
                const newNotifications = parseInt(newResult.count);

                const notifications = await app.db('NodeProject_01.notifications')
                    .select('employees.userName', 'notifications.subject', 'notifications.sent_date', 'notifications.status')
                    .where('notifications.to', employee)
                    .join('NodeProject_01.employees', 'notifications.from','employees.id')
                    .limit(limit).offset(page * limit - limit);

                for (let i = 0; i < notifications.length; i++ ) {
                    notifications[i].sent_date = formatDate(notifications[i].sent_date)
                }

                res.json({ data: notifications, allNotifications, newNotifications, limit });
            } else {

            }

        } catch (err) {
            res.status(500).send(err)
        }

    };

    const getById = async (req, res) => {
        try {
                const notification = await app.db('NodeProject_01.notifications as not')
                    .select('empFrom.name as from', 'empTo.name as to', 'not.subject', 'not.content',
                        'not.sent_date', 'not.status')
                    .where('not.id', req.params.id)
                    .join('NodeProject_01.employees as empFrom', 'not.from', 'empFrom.id')
                    .join('NodeProject_01.employees as empTo', 'not.to', 'empTo.id')
                    .first();

                notification.sent_date = formatDate(notification.sent_date);

                res.json(notification);

        } catch (err) {
            res.status(500).send(err)
        }
    };

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('NodeProject_01.notifications')
                .where({id:req.params.id}).del();
            
            try {
                existsOrError(rowsDeleted, 'Notification not found!.');
            } catch (err) {
                return res.status(400).send(err)
            }
            res.status(204).send()
        } catch (err) {
            res.status(500).send(err)
        }
    };

    return { save, get, getById, remove }

};
