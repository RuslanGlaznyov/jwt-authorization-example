const ApplicationError = require('./ApplicationError');

class BadRequestError extends ApplicationError {
  constructor(message, status = 400) {
    super(message || 'Bad request.', status);
  }
}
module.exports = BadRequestError;
