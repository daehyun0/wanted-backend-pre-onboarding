let article = require('../model/article').then(articlePromise => {
    article = articlePromise;
});
const userTokenUtils = require("../utils/user-token-utils");
const ArticleDto = require("../dto/article");

const AuthenticationError = require("../error/authentication-error");
const ArgumentError = require("../error/argument-error");
const NotFoundResourceError = require("../error/not-found-resource-error");
const AuthorizedError = require("../error/authorized-error");
const {NO_TITLE, NO_BODY, EXPIRED_TOKEN, INVALID_TOKEN} = require("../error/code/argument-error-code");
const {TokenExpiredError} = require("jsonwebtoken");
const {NOT_FOUND_ARTICLE} = require("../error/code/not-found-resource-error-code");
const {NOT_MATCHED_USER} = require("../error/code/authorized-error-code");

const articleService = {
    write: async function (jwtToken, title, body) {
        await article;
        let decoded = null;
        try {
            decoded = await userTokenUtils.verifyAccessToken(jwtToken);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new AuthenticationError(EXPIRED_TOKEN);
            } else {
                throw new AuthenticationError(INVALID_TOKEN);
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
        await article;
        const articleFromRepo = await article.findOne({
            where: {
                pk: articlePk
            }
        });

        if (articleFromRepo === null) {
            throw new NotFoundResourceError(NOT_FOUND_ARTICLE);
        }

        return ArticleDto.builder().of(articleFromRepo).build();
    },

    update: async function (jwtToken, articlePk, title, body) {
        await article;
        let decoded = null;
        try {
            decoded = await userTokenUtils.verifyAccessToken(jwtToken)
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new AuthenticationError(EXPIRED_TOKEN);
            } else {
                throw new AuthenticationError(INVALID_TOKEN);
            }
        }

        const articleFromRepo = await article.findOne({
            where: {
                pk: articlePk
            }
        });

        if (articleFromRepo === null) {
            throw new NotFoundResourceError(NOT_FOUND_ARTICLE);
        }

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
    },

    delete: async function (jwtToken, articlePk) {
        await article;
        let decoded = null;
        try {
            decoded = await userTokenUtils.verifyAccessToken(jwtToken);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new AuthenticationError(EXPIRED_TOKEN);
            } else {
                throw new AuthenticationError(INVALID_TOKEN);
            }
        }

        const articleFromRepo = await article.findOne({
            where: {
                pk: articlePk
            }
        });

        if (articleFromRepo === null) {
            throw new NotFoundResourceError(NOT_FOUND_ARTICLE);
        }

        if (decoded.userPk !== articleFromRepo.userPk) {
            throw new AuthorizedError(NOT_MATCHED_USER);
        }

        await articleFromRepo.destroy();
    },

    readList: async function (pageNum, countPerPage) {
        await article;
        const articleList = await article.findAll({
            offset: (pageNum - 1) * countPerPage,
            limit: countPerPage,
            order: [['pk', 'DESC']]
        })

        return articleList.map(articleModel => ArticleDto.builder().of(articleModel).build());
    }
}

module.exports = articleService;