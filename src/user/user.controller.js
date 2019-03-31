const user = require('./user.model');
const {BadRequestError} = require("../utils/errorHandler/errors/index");
const _ = require('lodash');

/* GET user listing. */
const allUsers = async (req, res) => {
    const allUsers = await user.find().exec();
    res.status(200).send(allUsers);
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
        res.status(201).send(data)
    } catch (e) {
        next(e);
    }
};

module.exports = {
    allUsers,
    createUser
};