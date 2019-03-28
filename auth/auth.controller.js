const config = require('../config');

const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const _ = require('lodash');

const userModel = require('../user/user.model');
const refreshTokenModel = require('./refreshToken.model');
const {UnauthorizedError} = require("../utils/errorHandler/errors");


async function issueTokenPair(userId) {
    const newRefreshToken = uuid();
    await refreshTokenModel.create({
            refreshToken: newRefreshToken,
            userId,
        }
    );

    return {
        token: jwt.sign({ id: userId }, config.SECRET, { expiresIn: '1m' }),
        refreshToken: newRefreshToken,
    };
}

const login = async (req, res, next) => {
    if (_.isEmpty(req.body.login) || _.isEmpty(req.body.password)) {
        return res.status(400).json({error: 'Required parameters'});
    }

    try {
        const {login, password} = req.body;
        const user = await userModel.findOne({login}).exec();
        // console.log(password !== user.password);
        if (!user || (password !== user.password)) {
            throw new UnauthorizedError();
        }

        const TokenPair = await issueTokenPair(user.id);
        res.status(200).send(TokenPair);
    }catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    if (_.isEmpty(req.body.refreshToken)) {
        return res.status(400).json({error: 'Required parameters'});
    }
    try {
        const { refreshToken } = req.body;

        const dbToken = await refreshTokenModel.findOne({ refreshToken: refreshToken }).exec();
        console.log(dbToken);
        if (!dbToken) {
            throw new UnauthorizedError();
        }
        await refreshTokenModel.remove({
            refreshToken: refreshToken,
        });

        const TokenPair = await issueTokenPair(dbToken.userId);
        res.status(200).send(TokenPair);
    }catch (error) {
        next(error);
    }


};

const logout = async (req, res, next) => {
    try{
        const  userId  = req.context.user._id;
        await refreshTokenModel.remove({
            userId,
        });
        res.status(200).send({ success: true });
    }catch (error) {
        next(error);
    }
};


module.exports = {
    login,
    refresh,
    logout
};
