const NotAuthenticatedError = require("../error/not-authentication-error");
const {NO_TITLE, NO_BODY} = require("../error/argument-error-code");
const {INVALID_TOKEN, EXPIRED_TOKEN} = require('../error/not-authenticated-error-code')
const ArgumentError = require("../error/argument-error");
const userTokenUtils = require("../utils/user-token-utils");
const {TokenExpiredError} = require("jsonwebtoken");
const NotFoundResourceError = require("../error/not-found-resource-error");
const {NOT_FOUND_ARTICLE} = require("../error/not-found-resource-error-code");
const ArticleDto = require("../dto/article");
const AuthorizedError = require("../error/authorized-error");
const {NOT_MATCHED_USER} = require("../error/authorized-error-code");
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
            throw new NotFoundResourceError(NOT_FOUND_ARTICLE);
        }

        return ArticleDto.builder().of(articles[0]).build();
    },

    update: async function (jwtToken, articlePk, title, body) {
        let decoded = null;
        try {
            decoded = await userTokenUtils.verifyAccessToken(jwtToken)
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new NotAuthenticatedError(EXPIRED_TOKEN);
            } else {
                throw new NotAuthenticatedError(INVALID_TOKEN);
            }
        }

        const articles = await article.findAll({
            where: {
                pk: articlePk
            }
        });

        if (articles.length === 0) {
            throw new NotFoundResourceError(NOT_FOUND_ARTICLE);
        }

        const articleFromRepo = articles[0];

        if (decoded.userPk !== articleFromRepo.userPk) {
            throw new AuthorizedError(NOT_MATCHED_USER);
        }

        if (title.trim().length === 0) {
            throw new ArgumentError(NO_TITLE);
        }

        if (body.trim().length === 0) {
            throw new ArgumentError(NO_BODY);
        }

        articleFromRepo.title = title;
        articleFromRepo.body = body;
        articleFromRepo.updatedAt = new Date();
        await articleFromRepo.save();

        return ArticleDto.builder().of(articleFromRepo).build();
    }
}

module.exports = articleService;