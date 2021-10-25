const articleService = require("../service/article-service");
const NotAuthenticationError = require("../error/not-authentication-error");
const mock = require('../utils/mock-db');
const ArgumentError = require("../error/argument-error");
const {NO_TITLE, NO_BODY} = require("../error/argument-error-code");
const {INVALID_TOKEN, EXPIRED_TOKEN} = require("../error/not-authenticated-error-code");
const NotFoundResource = require("../error/not-found-resource-error");
const {NOT_FOUND_ARTICLE} = require("../error/not-found-resource-error-code");
const ArticleDto = require("../dto/article");
const AuthorizedError = require("../error/authorized-error");
const {NOT_MATCHED_USER} = require('../error/authorized-error-code.js');

const jwtValid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUGsiOjIsImlhdCI6MTYzNTEwNTU4MSwiZXhwIjozMzE5MjcwNTU4MSwic3ViIjoidXNlckluZm8ifQ.qvrojqGcxdy21BvR-JyJtpSUcJKlSNVPcHpQ9BXWt6I';
const jwtExpired = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUGsiOjIsImlhdCI6MTYzNTEwNTI3NiwiZXhwIjoxNjM1MTA1Mjc2LCJzdWIiOiJ1c2VySW5mbyJ9.Pw3HJW05kpnl-Zy_rl900hM9GJ8sCUuQkyyBg2crPNg';
const jwtFailed = '';

beforeEach(async () => {
    await mock();
});

describe('write', () => {
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
            await articleService.write(jwtValid, '', 'b');
        }).rejects.toEqual(new ArgumentError(NO_TITLE));
    });

    test('write 내용 없으면 실패', async () => {
        await expect(async () => {
            await articleService.write(jwtValid, 'a', '');
        }).rejects.toEqual(new ArgumentError(NO_BODY));
    });

    test('write 성공', async () => {
        const result = await articleService.write(jwtValid, 'a', 'b');
        expect(result).toBeInstanceOf(ArticleDto);
    });
})

describe('read', () => {
    test('read one 게시물 없다면 실패', async () => {
        await expect(async () => {
            await articleService.read(1023120232);
        }).rejects.toEqual(new NotFoundResource(NOT_FOUND_ARTICLE));
    })

    test('read one 성공', async () => {
        const result = await articleService.read(5);
        expect(result).toBeInstanceOf(ArticleDto);
    })
})

describe('update', () => {
    test('update 유효하지 않은 토큰인 경우 실패', async () => {
        await expect(async () => {
            await articleService.update(jwtFailed, 1, 'title_updated', 'body_updated');
        }).rejects.toEqual(new NotAuthenticationError(INVALID_TOKEN));
    });

    test('update 유효기간이 지난 토큰인 경우 실패', async () => {
        await expect(async () => {
            await articleService.update(jwtExpired, 1, 'title_updated', 'body_updated');
        }).rejects.toEqual(new NotAuthenticationError(EXPIRED_TOKEN));
    });

    test('update 존재하지 않는 게시물의 경우 실패', async () => {
        await expect(async () => {
            await articleService.update(jwtValid, 125891828, 'title_updated', 'body_updated');
        }).rejects.toEqual(new NotFoundResource(NOT_FOUND_ARTICLE));
    });

    test('update 게시물을 쓴 계정이 아닌 경우 실패', async () => {
        await expect(async () => {
            await articleService.update(jwtValid, 5, 'title_updated', 'body_updated');
        }).rejects.toEqual(new AuthorizedError(NOT_MATCHED_USER));
    });

    test('update 제목이 비어있으면 실패', async () => {
        await expect(async () => {
            await articleService.update(jwtValid, 2, '', 'body_updated');
        }).rejects.toEqual(new ArgumentError(NO_TITLE));
    });

    test('update 내용이 비어있으면 실패', async () => {
        await expect(async () => {
            await articleService.update(jwtValid, 2, 'title_updated', '');
        }).rejects.toEqual(new ArgumentError(NO_BODY));
    });

    test('update 성공', async () => {
        const beforeArticle = await articleService.read(2);
        const titleWillUpdate = 'title_updated';
        const bodyWillUpdate = 'body_updated';
        const result = await articleService.update(jwtValid, 2, titleWillUpdate, bodyWillUpdate);
        expect(result).toBeInstanceOf(ArticleDto);
        expect(result.title).toEqual(titleWillUpdate);
        expect(result.body).toEqual(bodyWillUpdate);
        expect(result.updatedAt).not.toEqual(beforeArticle.updatedAt);
    });
});

describe('delete', () => {
    test('delete 유효하지 않은 토큰인 경우 실패', async () => {
        await expect(async () => {
            await articleService.delete(jwtFailed, 1);
        }).rejects.toEqual(new NotAuthenticationError(INVALID_TOKEN));
    });

    test('delete 유효기간이 지난 토큰인 경우 실패', async () => {
        await expect(async () => {
            await articleService.delete(jwtExpired, 1);
        }).rejects.toEqual(new NotAuthenticationError(EXPIRED_TOKEN));
    });

    test('delete 존재하지 않는 게시물의 경우 실패', async () => {
        await expect(async () => {
            await articleService.delete(jwtValid, 125891828);
        }).rejects.toEqual(new NotFoundResource(NOT_FOUND_ARTICLE));
    });

    test('delete 게시물을 쓴 계정이 아닌 경우 실패', async () => {
        await expect(async () => {
            await articleService.delete(jwtValid, 5);
        }).rejects.toEqual(new AuthorizedError(NOT_MATCHED_USER));
    });

    test('delete 성공', async () => {
        await articleService.delete(jwtValid, 2)
        await expect(async () => {
            await articleService.read(2);
        }).rejects.toEqual(new NotFoundResource(NOT_FOUND_ARTICLE));
    });
})

describe('read-list', function () {
    test('read-list pagination되어 반환', async () => {
        const pageNum1 = 1;
        const pageNum2 = 2;
        const articlePerPage = 10;
        const articleList1 = await articleService.readList(pageNum1, articlePerPage);
        const articleList2 = await articleService.readList(pageNum2, articlePerPage);

        expect(articleList1.length).toEqual(articlePerPage);
        expect(articleList2.length).toEqual(9);
        expect(articleList1[0].title).toEqual('title19');
        expect(articleList2[0].title).toEqual('title9');
    });
});