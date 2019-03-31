const config = require('../config');

const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const _ = require('lodash');

const userModel = require('../user/user.model');
const refreshTokenModel = require('./refreshToken.model');
const {UnauthorizedError, BadRequestError} = require("../utils/errorHandler/errors/index");


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
    try {
        const {password, login} = req.body;
        if (_.isEmpty(password) || _.isEmpty(login)) {
            throw new BadRequestError('Required parameters');
        }
        const user = await userModel.findOne({login}).exec();
        if (!user) {
            throw new BadRequestError('The login does not exist');
        }

        const isMatchPassword = await user.comparePassword(password);
        if(!isMatchPassword){
            throw new BadRequestError('The password is invalid');
        }

        const TokenPair = await issueTokenPair(user.id);
        res.status(200).send(TokenPair);
    }catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    if (_.isEmpty(req.body.refreshToken)) {
        return new BadRequestError('Required parameters');
    }
    try {
        const { refreshToken } = req.body;

        const dbToken = await refreshTokenModel.findOne({ refreshToken: refreshToken }).exec();
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
    logout,
};
