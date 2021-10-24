let user = null;

beforeEach(async () => {
    user = await require("../model/user.js");
    await user.sync({ force: true });
})

test('insert', async () => {
    // given, when
    await user.create({
        nickname: 'jane',
        id: 'jane',
        password: 'asdf'
    })
    const users = await user.findAll();

    // then
    expect(users.length).toEqual(1);
});

test('update', async () => {
    // given
    await user.create({
        nickname: 'jane',
        id: 'jane',
        password: 'asdf'
    })

    const jane2 = await user.create({
        nickname: 'jane2',
        id: 'jane2',
        password: 'asdf2'
    })

    // when
    jane2.nickname = 'jane2_updated';
    await jane2.save();

    // then
    const expected = await user.findAll({
        where: {
            id: 'jane2'
        }
    });
    expect(expected[0].nickname).toEqual('jane2_updated');
});

test('delete', async () => {
    // given
    await user.create({
        nickname: 'jane',
        id: 'jane',
        password: 'asdf'
    })

    const jane2 = await user.create({
        nickname: 'jane2',
        id: 'jane2',
        password: 'asdf2'
    })

    // when
    await jane2.destroy();

    // then
    const users = await user.findAll();
    expect(users.length).toEqual(1);
    expect(users[0].id).toEqual('jane');
})