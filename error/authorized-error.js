const BaseException = require("./base-error");

class AuthorizedError extends BaseException {
    constructor(message) {
        super(403, message);
    }
}

module.exports = AuthorizedError;