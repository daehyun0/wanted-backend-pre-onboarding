const NotAuthenticatedError = require("../error/not-authentication-error");
const {NO_TITLE, NO_BODY} = require("../error/argument-error-code");
const {INVALID_TOKEN, EXPIRED_TOKEN} = require('../error/not-authenticated-error-code')
const ArgumentError = require("../error/argument-error");
const userTokenUtils = require("../utils/user-token-utils");
const {TokenExpiredError} = require("jsonwebtoken");
const NotFoundResource = require("../error/not-found-error-resource");
const {NOT_FOUND_ARTICLE} = require("../error/not-found-error-resource-code");
const ArticleDto = require("../dto/article");
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

        return ArticleDto.builder().of(articleResult).build();
    },

    read: async function (articlePk) {
        const articles = await article.findAll({
            where: {
                pk: articlePk
            }
        });

        if (articles.length === 0) {
            throw new NotFoundResource(NOT_FOUND_ARTICLE);
        }

        return ArticleDto.builder().of(articles[0]).build();
    }
}

module.exports = articleService;