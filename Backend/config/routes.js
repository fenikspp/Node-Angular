module.exports = app => {
    app.post('/signin', app["api"].auth.signin);
    app.post('/signup', app["api"].employee.save);
    app.post('/validateToken', app["api"].auth.validateToken);
    /* HOME MESSAGE */
    app.route('/')
        .get(app["api"].home.home);

    /* EMPLOYEE API */

    app.route('/employees')
        .get(app["api"]["employee"].get)
        .post(app["api"]["employee"].save);

    app.route('/employees/:id')
        .get(app["api"]["employee"].getById)
        .put(app["api"]["employee"].save)
        .delete(app["api"]["employee"].remove);

    /* TEAM API */

    app.route('/teams')
        .get(app["api"]["team"].get)
        .post(app["api"]["team"].save);

    app.route('/teams/:id')
        .put(app["api"]["team"].save)
        .get(app["api"]["team"].getById);

    /* PRODUCT API */

    app.route('/products')
        .post(app["api"]["product"].save)
        .get(app["api"]["product"].get);

    app.route('/products/:id')
        .put(app["api"]["product"].save)
        .get(app["api"]["product"].getById);

    /* SALE API */
    app.route('/sale')
        .post(app["api"]["sale"].save)
        .get(app["api"]["sale"].get);

    /* NOTIFICATIONS */
    app.route('/notifications')
        .post(app["api"]["notification"].save)
        .get(app["api"]["notification"].get);

    app.route('/notifications/:id')
        .get(app["api"]["notification"].getById)
        .delete(app["api"]["notification"].remove);

    /* ERROR 404 MESSAGE */
    app.get('*', (req, res) => {
        res.status(400).send('ERROR 404');
    });

};