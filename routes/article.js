var express = require('express');
const articleService = require("../service/article-service");
const userService = require("../service/user-service");
var router = express.Router();

router.get('/', async function(req, res, next) {
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

router.get('/:id', async function (req, res) {
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

router.post('/', async function (req, res) {
    const jwtToken = req.cookies.access_token;
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

router.patch('/:id', async function (req, res) {
    const articlePk = req.params.id;
    const jwtToken = req.cookies.access_token;
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

router.delete('/:id', async function (req, res) {
    const articlePk = req.params.id;
    const jwtToken = req.cookies.access_token;
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
