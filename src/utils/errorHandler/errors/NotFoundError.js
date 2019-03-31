const ApplicationError = require('./ApplicationError');

class NotFoundError extends ApplicationError {
  constructor(message, status = 404) {
    super(message || 'Not found.', status);
  }
}
module.exports = NotFoundError;
