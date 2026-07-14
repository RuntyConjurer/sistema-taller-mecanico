'use strict';

class AppError extends Error {
  constructor(status, code, message, fieldErrors = undefined) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

module.exports = { AppError };
