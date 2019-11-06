module.exports = app => {
    const { existsOrError, notExistsOrError } = app["api"]["validation"];

    const save = async (req, res) => {
        const product = { ...req.body };

        if (req.params.id) product.id = req.params.id;

        try {
            existsOrError(product.name, 'Enter a product name!');
            existsOrError(product["segment"], 'Enter a product segment');
            existsOrError(product.points, 'Enter a product points');

        const productFromDB = await app.db('NodeProject_01.products')
            .where({ name: product.name, segment: product.segment }).first();

        if (!product.id) {
            notExistsOrError(productFromDB, 'Product already exists!');
        }

        } catch (msg) {
            return res.status(400).send(msg);
        }

        if (product.id) {
            try {
                await app.db('NodeProject_01.products')
                    .update(product)
                    .where({ id:product.id });
                await app.db('NodeProject_01.products')
                    .update({ updated_at: new Date() })
                    .where({ id:product.id });
                res.status(204).send();
            } catch (msg) {
                res.status(500).send(msg);
            }
        } else {
            app.db('NodeProject_01.products')
                .insert(product)
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }
    };

    const get = async (req, res) => {
        try {
            if (req.query.segment) {
                const products = await app.db('NodeProject_01.products as prd')
                    .select('prd.id','prd.name','prd.segment','prd.points')
                    .where({segment: req.query.segment})
                    .whereNull('deleted_at');
                res.json(products);
            } else {
                const products = await app.db('NodeProject_01.products as prd')
                    .select('prd.id','prd.name','prd.segment','prd.points')
                    .whereNull('deleted_at')
                    .orderBy('segment');
                res.json(products);
            }
        } catch (msg) {
            res.status(500).send(msg)
        }
    };

    const getById = async (req, res) => {
        try {
            const products = await app.db('NodeProject_01.products as prd')
                .select('prd.id','prd.name','prd.segment','prd.points')
                .where({id:req.params.id})
                .whereNull('deleted_at')
                .orderBy('segment');
            res.json(products);
        } catch (msg) {
            res.status(500).send(msg)
        }
    };

    const remove = async (req, res) => {

    };

    return { save, get, getById, remove }

};