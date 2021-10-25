const BaseException = require("./base-error");

class AuthenticationError extends BaseException {
    constructor(message) {
        super(401, message);
    }
}

module.exports = AuthenticationError;