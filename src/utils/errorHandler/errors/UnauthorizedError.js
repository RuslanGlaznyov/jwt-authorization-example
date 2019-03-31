const ApplicationError = require('./ApplicationError');

class UnauthorizedError extends ApplicationError {
    constructor(message, status = 401) {
        super(message || 'Unauthorized.', status);
    }
}
module.exports = UnauthorizedError;
