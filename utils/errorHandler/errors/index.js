const ApplicationError = require('./ApplicationError');
const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const ForbiddenError = require('./ForbiddenError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
    ApplicationError,
    NotFoundError,
    BadRequestError,
    ForbiddenError,
    UnauthorizedError
};
