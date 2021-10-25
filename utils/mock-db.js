let user = require('../model/user');
let article = require('../model/article');
const passwordUtils = require("./password-utils");

module.exports = async function () {
    user = await user;
    article = await article;

    user.sync({force: true});
    article.sync({force: true});

    const userCreatePromises = [];
    const password = await passwordUtils.hash('1234');
    for (let i = 0; i < 100; ++i) {
        const userPromise = user.create({
            nickname: 'jane' + i + 'nickname',
            id: 'jane' + i,
            password: password
        })
        userCreatePromises.push(userPromise);
    }
    await Promise.all(userCreatePromises);

    const articleCreatePromises = [];
    for (let i = 1; i < 20; ++i) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const articleCreatePromise = article.create({
            userPk: i,
            title: 'title' + i,
            body: 'body' + i,
            createdAt: createdAt.setDate(createdAt.getDate() - i),
            updatedAt: updatedAt.setDate(createdAt.getDate() - i)
        })
        articleCreatePromises.push(articleCreatePromise);
    }
    await Promise.all(articleCreatePromises);
}