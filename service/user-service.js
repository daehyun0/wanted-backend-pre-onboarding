let user = require('../model/user')
const AuthenticationError = require("../error/authentication-error");
const AuthenticationErrorCode = require("../error/authentication-error-code");
const userTokenUtils = require('../utils/user-token-utils');
const bcrypt = require("bcrypt");

const userService = {
    authenticate: async function (id, password) {
        user = await user;
        const users = await user.findAll({
            where: {
                id
            }
        });

        if (users.length === 0) {
            throw new AuthenticationError(AuthenticationErrorCode.NOT_FOUND_ID);
        }

        const passwordCompareResult = await bcrypt.compare(password, users[0].password)
        if (!passwordCompareResult) {
            throw new AuthenticationError(AuthenticationErrorCode.WRONG_PASSWORD);
        }

        return await userTokenUtils.getAccessToken({
            userPk: users[0].pk
        })
    }
}

module.exports = userService