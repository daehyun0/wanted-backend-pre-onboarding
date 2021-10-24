const mock = require('../utils/mock-db');
let user = require('../model/user');
let article = require('../model/article');

test('mock 제대로 되었는지 확인', async () => {
    user = await user;
    article = await article;
    // given, when
    await mock();

    const users = await user.findAll();
    const articles = await article.findAll();

    // then
    expect(users.length).toEqual(100);
    for (let i = 0; i < 100; ++i) {
        expect(users[i].nickname).toEqual('jane' + i + 'nickname');
        expect(users[i].id).toEqual('jane' + i,);
        expect(users[i].password).toEqual('asdf');
    }

    expect(articles.length).toEqual(19);
    for (let i = 1; i < 20; ++i) {
        expect(articles[i - 1].userPk).toEqual(i * 5);
        expect(articles[i - 1].title).toEqual('title' + i);
        expect(articles[i - 1].body).toEqual('body' + i);
    }
})