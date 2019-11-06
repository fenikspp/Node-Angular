module.exports = app => {
    const { existsOrError, notExistsOrError } = app["api"]["validation"];

    const save = async (req, res) => {

        const seller = req.query.seller;

        let sale = {};
        if (req.params.id) sale.id = req.params.id;

        try {
            existsOrError(seller, 'Enter a seller in url, ex: sale/?seller=id');

            const response = { ...req.body };

            function getClient(obj) {
                let newObject = Object.assign(obj);
                if ('phones' in newObject) {
                    for (let i = 0; i < Object.entries(newObject).length; i++) {
                        if (Object.entries(newObject)[i].indexOf('phones') !== -1) {
                            phones = Object.entries(newObject)[i][1];
                        }
                    }
                }
                if ('address' in newObject) {
                    for (let i = 0; i < Object.entries(newObject).length; i++) {
                        if (Object.entries(newObject)[i].indexOf('address') !== -1) {
                            address = Object.entries(newObject)[i][1];
                        }
                    }
                }
                if ('products' in newObject) {
                    for (let i = 0; i < Object.entries(newObject).length; i++) {
                        if (Object.entries(newObject)[i].indexOf('products') !== -1) {
                            products = Object.entries(newObject)[i][1];
                        }
                    }
                }
                let client = {};
                if ('name' in newObject) {
                    for (let i = 0; i < Object.entries(newObject).length; i++) {
                        if (Object.entries(newObject)[i].indexOf('products') === -1 &&
                            Object.entries(newObject)[i].indexOf('address') === -1 &&
                            Object.entries(newObject)[i].indexOf('phones') === -1) {
                            client[`${(Object.entries(newObject)[i][0])}`] = `${Object.entries(newObject)[i][1]}`;
                        }
                    }
                }
                if (client["cpf"]) {
                    individual = Object.assign(client)
                } else if (client["cnpj"]) {
                    company = Object.assign(client)
                }
            }

            let individual = {};
            let company = {};
            let phones = [];
            let address = {};
            let products = [];

            existsOrError(response.name, 'Enter a name!');
            if (!response["cpf"] && !response["cnpj"]) {
                existsOrError(response["cpf"], 'Identify Client!')
            }

            getClient(response);

            if (Object.keys(individual).length === 0 && Object.keys(company).length !== 0) {
                /* COMPANY */
                try {
                    existsOrError(phones, 'Enter a phone number!');
                    existsOrError(address[0]["uf"], 'Enter a UF');
                    existsOrError(address[0]["city"], 'Enter a City');
                    existsOrError(address[0]["address"], 'Enter a address');
                    existsOrError(address[0]["cep"], 'Enter a CEP');
                    existsOrError(products, 'Enter products');

                    res.status(204).send()
                } catch (msg) {
                    return res.status(400).send(msg);
                }
            } else {
                /* INDIVIDUAL */
                try {
                    existsOrError(phones, 'Enter a phone number!');
                    existsOrError(address[0]["uf"], 'Enter a UF');
                    existsOrError(address[0]["city"], 'Enter a City');
                    existsOrError(address[0]["address"], 'Enter a address');
                    existsOrError(address[0]["cep"], 'Enter a CEP');
                    existsOrError(products, 'Enter products');

                    res.status(204).send()
                } catch (msg) {
                    return res.status(400).send(msg);
                }

                if (sale.id) {

                } else {
                    /* Insert Sale */
                    try {
                        /* Check if individuals is in database */
                        let individualID = await app.db('NodeProject_01.individuals')
                            .select('id').where({cpf: individual.cpf});

                        if (individualID.length !== 0 || req.query.individual)
                            individual.id = parseInt(individualID[0].id) || req.query.individual;

                        if (individual.id) {

                            await app.db('NodeProject_01.individuals')
                                .update(individual).where({id:individual.id});

                            await app.db('NodeProject_01.individuals')
                                .update({ updated_at:new Date() }).where({id:individual.id});

                            let addressFromDB = await app.db('NodeProject_01.individuals_has_addresses')
                                .select('address').where({individual:individual.id}).first();

                            let newAddressFromDB = await app.db('NodeProject_01.addresses')
                                .where({address:address[0].address}).first();

                            if (newAddressFromDB) {

                                await app.db('NodeProject_01.individuals_has_addresses')
                                    .where({individual:individual.id}).first().del();

                                let insertData = {
                                    individual: individual.id,
                                    address: newAddressFromDB.id
                                };
                                await app.db('NodeProject_01.individuals_has_addresses')
                                    .insert(insertData);
                            }
                            let addresses = {};
                            if (addressFromDB) {
                                addresses = await app.db('NodeProject_01.individuals_has_addresses as has')
                                    .select('individuals.id').where('has.address', addressFromDB.address)
                                    .join('NodeProject_01.individuals', 'individuals.id', 'has.individual');
                            }
                            if (addresses.length === 1) {
                                let addressID = await app.db('NodeProject_01.individuals_has_addresses as has')
                                    .select('addresses.id')
                                    .where('has.individual', individual.id)
                                    .join('NodeProject_01.addresses', 'addresses.id', 'has.address')
                                    .first();
                                await app.db('NodeProject_01.addresses')
                                    .update(address[0]).where({id:addressID.id});
                                await app.db('NodeProject_01.addresses')
                                    .update({ updated_at:new Date() }).where({id:addressID.id});
                            } else {
                                const idAddress = await app.db('NodeProject_01.addresses')
                                    .select('id').where({address: address[0].address}).first();

                                if (!idAddress) {
                                    /* Insert Address */
                                    await app.db('NodeProject_01.individuals_has_addresses')
                                        .where({individual:individual.id}).first().del();
                                    await app.db('NodeProject_01.addresses')
                                        .insert(address[0]);
                                    const idAddress = await app.db('NodeProject_01.addresses')
                                        .select('id').where({
                                            cep: address[0].cep,
                                            address: address[0].address
                                        });
                                    /* Insert Individual and Address relation */
                                    let addressRelation = {
                                        address: parseInt(idAddress[0].id),
                                        individual: individual.id
                                    };
                                    await app.db('NodeProject_01.individuals_has_addresses')
                                        .insert(addressRelation);
                                }
                            }

                        } else {
                            /* Insert Individual */
                            await app.db('NodeProject_01.individuals')
                                .insert(individual);

                            const idIndividual = await app.db('NodeProject_01.individuals')
                                .select('id').where({ cpf: individual.cpf });

                            /* Checks if address is in database  */
                            const idAddress = await app.db('NodeProject_01.addresses')
                                .select('id').where({address: address[0].address}).first();

                            if (idAddress) {
                                /* Insert Individual and Address relation */
                                let addressRelation = {
                                    address: parseInt(idAddress.id),
                                    individual: parseInt(idIndividual[0].id)
                                };
                                await app.db('NodeProject_01.individuals_has_addresses')
                                    .insert(addressRelation);
                            } else {
                                /* Insert Address */
                                await app.db('NodeProject_01.addresses')
                                    .insert(address[0]);
                                const idAddress = await app.db('NodeProject_01.addresses')
                                    .select('id').where({cep: address[0].cep,
                                        address:address[0].address});
                                /* Insert Individual and Address relation */
                                let addressRelation = {
                                    address: parseInt(idAddress[0].id),
                                    individual: parseInt(idIndividual[0].id)
                                };
                                await app.db('NodeProject_01.individuals_has_addresses')
                                    .insert(addressRelation);
                            }

                            for (let i = 0; i < Object.keys(phones).length; i++) {
                                /* Checks if phone is in database */
                                let hasNumber = await app.db('NodeProject_01.phones')
                                    .select('id').where({number:phones[i].number});

                                let individualId = parseInt(idIndividual[0].id);
                                let hasNumberId = null;
                                if (hasNumber.length !== 0) hasNumberId = parseInt(hasNumber[0].id);
                                /* If phone is in database */
                                if (hasNumberId) {
                                    /* Checks if phone relation is in database */
                                    const hasRelation = await app.db('NodeProject_01.individuals_has_phones')
                                        .select('*')
                                        .where({individual:individualId, phone: hasNumberId});

                                    if (hasRelation.length !== 0) {
                                        /* If phone relation is in database */
                                        await app.db('NodeProject_01.phones')
                                            .update(phones[i]).where({number:phones[i].number});

                                        await app.db('NodeProject_01.phones')
                                            .update({updated_at:new Date()}).where({number:phones[i].number});

                                    } else {
                                        /* If the phone is in the database,
                                        it creates a relationship with the new user.  */
                                        let phoneRelation = {
                                            phone: hasNumberId,
                                            individual: parseInt(idIndividual[0].id)
                                        };

                                        await app.db('NodeProject_01.individuals_has_phones')
                                            .insert(phoneRelation)
                                    }

                                } else {
                                    /* Insert Phone */
                                    await app.db('NodeProject_01.phones')
                                        .insert(phones[i]);

                                    let phonesID = await app.db('NodeProject_01.phones')
                                        .select('id').where({number: phones[i].number});

                                    let phoneRelation = {
                                        phone: parseInt(phonesID[0].id),
                                        individual: parseInt(idIndividual[0].id)
                                    };
                                    /* Insert Phones relation */
                                    await app.db('NodeProject_01.individuals_has_phones')
                                        .insert(phoneRelation);
                                }
                            }

                        }

                    } catch (msg) {
                        res.status(400).send(msg)
                    }
                }

            }


        } catch (msg) {
            res.status(500).send(msg)
        }

    };

    const get = async (req, res) => {

    };

    const getById = async (req, res) => {

    };

    return { save, get, getById }

};