let user = require('../model/user')
const userTokenUtils = require('../utils/user-token-utils');
const passwordUtils = require("../utils/password-utils");

const AuthenticationError = require("../error/authentication-error");
const AuthenticationErrorCode = require("../error/code/authentication-error-code");
const NotFoundResourceError = require("../error/not-found-resource-error");
const {NOT_FOUND_USER} = require('../error/code/not-found-resource-error-code');

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

        const passwordCompareResult = await passwordUtils.compare(password, userFromRepo.password)
        if (!passwordCompareResult) {
            throw new AuthenticationError(AuthenticationErrorCode.WRONG_PASSWORD);
        }

        return await userTokenUtils.getAccessToken({
            userPk: userFromRepo.pk
        })
    },

    findByPk: async function(pk) {
        user = await user;
        const userFromRepo = await user.findOne({
            where: {
                pk
            }
        });

        if (userFromRepo === null) {
            throw new NotFoundResourceError(NOT_FOUND_USER);
        }

        return userFromRepo;
    }
}

module.exports = userService