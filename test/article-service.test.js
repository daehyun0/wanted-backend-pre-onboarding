const articleService = require("../service/article-service");
const NotAuthenticationError = require("../error/not-authentication-error");
const mock = require('../utils/mock-db');
const ArgumentError = require("../error/argument-error");
const {NO_TITLE, NO_BODY} = require("../error/argument-error-code");
const {INVALID_TOKEN, EXPIRED_TOKEN} = require("../error/not-authenticated-error-code");
const NotFoundResource = require("../error/not-found-error-resource");
const {NOT_FOUND_ARTICLE} = require("../error/not-found-error-resource-code");
const ArticleDto = require("../dto/article");

const jwtNotExpiredVerified = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUGsiOjIsImlhdCI6MTYzNTEwNTU4MSwiZXhwIjozMzE5MjcwNTU4MSwic3ViIjoidXNlckluZm8ifQ.qvrojqGcxdy21BvR-JyJtpSUcJKlSNVPcHpQ9BXWt6I';
const jwtExpired = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUGsiOjIsImlhdCI6MTYzNTEwNTI3NiwiZXhwIjoxNjM1MTA1Mjc2LCJzdWIiOiJ1c2VySW5mbyJ9.Pw3HJW05kpnl-Zy_rl900hM9GJ8sCUuQkyyBg2crPNg';
const jwtFailed = '';

beforeEach(async () => {
    await mock();
});

test('write 로그인 안되있으면 실패', async () => {
    await expect(async () => {
        await articleService.write(jwtFailed, 'a', 'b');
    }).rejects.toEqual(new NotAuthenticationError(INVALID_TOKEN));
});

test('write 로그인은 되어있으나 유효기간이 지나있으면 실패', async () => {
    await expect(async () => {
        await articleService.write(jwtExpired, 'a', 'b');
    }).rejects.toEqual(new NotAuthenticationError(EXPIRED_TOKEN));
});

test('write 제목 없으면 실패', async () => {
    await expect(async () => {
        await articleService.write(jwtNotExpiredVerified, '', 'b');
    }).rejects.toEqual(new ArgumentError(NO_TITLE));
});

test('write 내용 없으면 실패', async () => {
    await expect(async () => {
        await articleService.write(jwtNotExpiredVerified, 'a', '');
    }).rejects.toEqual(new ArgumentError(NO_BODY));
});

test('write 성공', async () => {
    const result = await articleService.write(jwtNotExpiredVerified, 'a', 'b');
    expect(result).toBeInstanceOf(ArticleDto);
});

test('read one 게시물 없다면 실패', async () => {
    await expect(async () => {
        await articleService.read(1023120232);
    }).rejects.toEqual(new NotFoundResource(NOT_FOUND_ARTICLE));
})

test('read one 성공', async () => {
    const result = await articleService.read(5);
    expect(result).toBeInstanceOf(ArticleDto);
})