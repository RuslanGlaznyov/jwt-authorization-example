const user = require('./user.model');

/* GET user listing. */
const allUsers = async (req, res) => {
    user.find()
        .then(data => res.status(200).send(data))
};

const createUser = async (req, res) => {
    user.create({
        username: req.body.username,
    })
        .then(data => res.status(200).send(data));
};

module.exports = {
    allUsers,
    createUser
};