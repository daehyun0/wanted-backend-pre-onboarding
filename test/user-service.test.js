const userService = require('../service/user-service');
const AuthenticationError = require("../error/authentication-error");
const {NOT_FOUND_ID, WRONG_PASSWORD} = require("../error/authentication-error-code");
const mock = require('../utils/mock-db');

test('authenticate_id가 맞지 않으면 error', async () => {
    await expect(async () => {
        await userService.authenticate('unknown_id', '1234')
    }).rejects.toEqual(new AuthenticationError(NOT_FOUND_ID));
});

test('authenticate_password가 맞지 않으면 error', async () => {
    await mock();
    await expect(async () => {
        return await userService.authenticate('jane1', 'unknown_password');
    }).rejects.toEqual(new AuthenticationError(WRONG_PASSWORD))
});

test('authenticate_성공', async () => {
    await mock();
    const result = await userService.authenticate('jane1', '1234')
    expect(result).toBeTruthy();
});
