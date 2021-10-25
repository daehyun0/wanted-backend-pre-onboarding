const BaseException = require("./base-error");

class NotFoundResourceError extends BaseException {
    constructor(message) {
        super(404, message);
    }
}

module.exports = NotFoundResourceError;