let user = require('../model/user')
const AuthenticationError = require("../error/authentication-error");
const AuthenticationErrorCode = require("../error/authentication-error-code");
const userTokenUtils = require('../utils/user-token-utils');
const bcrypt = require("bcrypt");

const userService = {
    authenticate: async function (id, password) {
        user = await user;
        const userFromRepo = await user.findOne({
            where: {
                id
            }
        });

        if (userFromRepo === null) {
            throw new AuthenticationError(AuthenticationErrorCode.NOT_FOUND_ID);
        }

        const passwordCompareResult = await bcrypt.compare(password, userFromRepo.password)
        if (!passwordCompareResult) {
            throw new AuthenticationError(AuthenticationErrorCode.WRONG_PASSWORD);
        }

        return await userTokenUtils.getAccessToken({
            userPk: userFromRepo.pk
        })
    }
}

module.exports = userService