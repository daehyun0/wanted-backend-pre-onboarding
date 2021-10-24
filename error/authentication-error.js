const BaseException = require("./base-error");

class AuthenticationError extends BaseException {
    constructor(message) {
        super(message);
    }
}

module.exports = AuthenticationError;