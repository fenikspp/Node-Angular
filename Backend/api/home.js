module.exports = app => {

    const home = (req, res) => {
        res.sendFile('D:\\PEDRO\\Projetos\\Projeto Node\\Backend\\views\\index.html')
    };

    return { home }

};