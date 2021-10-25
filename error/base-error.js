class BaseError extends Error {
    #status

    constructor(status, message) {
        super(message);
        this.#status = status;
        this._status = status;
    }

    get status() {
        return this._status;
    }
}

module.exports = BaseError;