const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
  constructor(message, status = 403) {
    super(message || 'Forbidden.', status);
  }
}

module.exports = ForbiddenError;
