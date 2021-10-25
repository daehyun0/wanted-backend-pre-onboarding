const mock = require('../utils/mock-db');
let user = require('../model/user');
let article = require('../model/article');
const passwordUtils = require("../utils/password-utils");

test('mock 제대로 되었는지 확인', async () => {
    user = await user;
    article = await article;
    // given, when
    await mock();

    const users = await user.findAll();
    const articles = await article.findAll();


    const expectComparePasswordResult = await passwordUtils.compare(users[0].password, '1234');

    // then
    expect(users.length).toEqual(100);
    for (let i = 0; i < 100; ++i) {
        expect(users[i].nickname).toEqual('jane' + i + 'nickname');
        expect(users[i].id).toEqual('jane' + i,);
        expect(expectComparePasswordResult).toEqual(true);
    }

    expect(articles.length).toEqual(19);
    for (let i = 1; i < 20; ++i) {
        expect(articles[i - 1].userPk).toEqual(i);
        expect(articles[i - 1].title).toEqual('title' + i);
        expect(articles[i - 1].body).toEqual('body' + i);
    }
})