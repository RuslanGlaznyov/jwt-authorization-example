const user = require('./user.model');
const {BadRequestError} = require("../utils/errorHandler/errors");
const _ = require('lodash');

/* GET user listing. */
const allUsers = async (req, res) => {
    user.find()
        .then(data => res.status(200).send(data))
};

const createUser = async (req, res, next) => {
    try {
        const {login, password} = req.body;
        if (_.isEmpty(login) || _.isEmpty(password)) {
            throw new BadRequestError();
        }

        const data = await user.create({
            login,
            password,
        });
        res.status(200).send(data)
    } catch (e) {
        next(e);
    }
};

module.exports = {
    allUsers,
    createUser
};