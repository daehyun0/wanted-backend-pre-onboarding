var express = require('express');
const articleService = require("../service/article-service");
const userService = require("../service/user-service");
var router = express.Router();

router.get('/articles', async function(req, res, next) {
    const pageNum = req.query.pageNum || 1;
    const countPerPage = req.query.count || 10;

    try {
        const articlesList = await articleService.readList(pageNum, countPerPage);
        const articleNicknameList = await Promise.all(
            articlesList.map(async article => (await userService.findByPk(article.userPk)).nickname)
        )

        const responseArticleList = [];
        for (let i = 0; i < articlesList.length; ++i) {
            const article = articlesList[i];
            responseArticleList.push({
                no: article.pk,
                title: article.title,
                body: article.body,
                writer: articleNicknameList[i],
                createdAt: article.createdAt
            });
        }
        res.send(responseArticleList);
    } catch (e) {
        res.status(e.status);
        res.send(e.message);
    }
});

router.get('/article/:id', async function (req, res) {
    const articlePk = req.params.id;
    try {
        const article = await articleService.read(articlePk)
        const writer = (await userService.findByPk(article.userPk)).nickname;
        res.send({
            no: article.pk,
            title: article.title,
            body: article.body,
            writer,
            createdAt: article.createdAt
        });
    } catch (e) {
        res.status(e.status);
        res.send(e.message);
    }
});

router.post('/article/', async function (req, res) {
    const authorizationMethodIsValid = req.headers.authorization.split(' ')[0];
    const authorizationToken = req.headers.authorization.split(' ')[1];
    const jwtToken = req.cookies.access_token || (authorizationMethodIsValid && authorizationToken);
    const title = req.body.title;
    const body = req.body.body;
    try {
        const article = await articleService.write(jwtToken, title, body);
        res.send({
            articlePk: article.pk
        });
    } catch (e) {
        res.status(e.status);
        res.send(e.message);
    }
});

router.patch('/article/:id', async function (req, res) {
    const articlePk = req.params.id;
    const authorizationMethodIsValid = req.headers.authorization.split(' ')[0];
    const authorizationToken = req.headers.authorization.split(' ')[1];
    const jwtToken = req.cookies.access_token || (authorizationMethodIsValid && authorizationToken);
    const title = req.body.title;
    const body = req.body.body;
    try {
        const article = await articleService.update(jwtToken, articlePk, title, body);
        res.send({
            articlePk: article.pk
        });
    } catch (e) {
        res.status(e.status);
        res.send(e.message);
    }
});

router.delete('/article/:id', async function (req, res) {
    const articlePk = req.params.id;
    const authorizationMethodIsValid = req.headers.authorization.split(' ')[0];
    const authorizationToken = req.headers.authorization.split(' ')[1];
    const jwtToken = req.cookies.access_token || (authorizationMethodIsValid && authorizationToken);
    try {
        await articleService.delete(jwtToken, articlePk);
        res.status(204);
        res.send();
    } catch (e) {
        res.status(e.status);
        res.send(e.message);
    }
});

module.exports = router;
