let user = require('../model/user');
let article = require('../model/article');

module.exports = async function () {
    user = await user;
    article = await article;

    const userCreatePromises = [];
    for (let i = 0; i < 100; ++i) {
        const userPromise = user.create({
            nickname: 'jane' + i + 'nickname',
            id: 'jane' + i,
            password: 'asdf'
        })
        userCreatePromises.push(userPromise);
    }
    await Promise.all(userCreatePromises);

    const articleCreatePromises = [];
    for (let i = 1; i < 20; ++i) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const articleCreatePromise = article.create({
            userPk: i * 5,
            title: 'title' + i,
            body: 'body' + i,
            createdAt: createdAt.setDate(createdAt.getDate() - i),
            updatedAt: updatedAt.setDate(createdAt.getDate() - i)
        })
        articleCreatePromises.push(articleCreatePromise);
    }
    await Promise.all(articleCreatePromises);
}