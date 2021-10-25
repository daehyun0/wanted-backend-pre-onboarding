const bcrypt = require("bcrypt");

const salt = 10;

module.exports = {
    hash: async function (password) {
        return bcrypt.hash(password, salt);
    },

    compare: async function (plainPassword, hash) {
        return bcrypt.compare(plainPassword, hash);
    }
}