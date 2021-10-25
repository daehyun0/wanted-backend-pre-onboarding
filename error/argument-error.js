const BaseException = require("./base-error");

class ArgumentError extends BaseException {
    constructor(message) {
        super(400, message);
    }
}

module.exports = ArgumentError;