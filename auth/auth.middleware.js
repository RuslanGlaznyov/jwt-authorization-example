const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../user/user.model')

const {UnauthorizedError} = require('../utils/errorHandler/errors');


const decodeJWT = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            return resolve(decoded);
        });
    });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */
const isAuthMiddleware = async(req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        if (!bearerHeader) {
            throw new UnauthorizedError();
        }
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const decoded = await decodeJWT(bearerToken);
        if (!decoded.id) {
            throw new UnauthorizedError();
        }
        const user = await userModel.findOne({_id: decoded.id }).exec();
        if (!user) {
            throw new UnauthorizedError();
        }
        req.context = {
            user: user.toJSON(),
            token: bearerToken,
        };
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAuthMiddleware;
