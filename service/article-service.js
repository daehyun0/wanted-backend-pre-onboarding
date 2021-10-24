const NotAuthenticatedError = require("../error/not-authentication-error");
const {NO_TITLE, NO_BODY} = require("../error/argument-error-code");
const {INVALID_TOKEN, EXPIRED_TOKEN} = require('../error/not-authenticated-error-code')
const ArgumentError = require("../error/argument-error");
const userTokenUtils = require("../utils/user-token-utils");
const {TokenExpiredError} = require("jsonwebtoken");
let article = require('../model/article').then(articlePromise => {
    article = articlePromise;
});

const articleService = {
    write: async function (jwtToken, title, body) {
        let decoded = null;
        try {
            decoded = await userTokenUtils.verifyAccessToken(jwtToken);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new NotAuthenticatedError(EXPIRED_TOKEN);
            } else {
                throw new NotAuthenticatedError(INVALID_TOKEN);
            }
        }

        const trimmingTitle = title.trim();
        if (trimmingTitle.length === 0) {
            throw new ArgumentError(NO_TITLE);
        }

        const trimmingBody = body.trim();
        if (trimmingBody.length === 0) {
            throw new ArgumentError(NO_BODY);
        }

        const createdAt = new Date();
        const articleResult = await article.create({
            userPk: decoded.userPk,
            title,
            body,
            createdAt,
            updatedAt: createdAt
        });

        return articleResult.pk;
    }
}

module.exports = articleService;