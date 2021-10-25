const ArticleDtoBuilder = require('../builder/article-dto-builder');

class ArticleDto {
    #_pk
    #_userPk
    #_title
    #_body
    #_createdAt
    #_updatedAt

    static builder() {
        return new ArticleDtoBuilder();
    }

    set pk(value) {
        this.#_pk = value;
    }

    set userPk(value) {
        this.#_userPk = value;
    }

    set title(value) {
        this.#_title = value;
    }

    set body(value) {
        this.#_body = value;
    }

    set createdAt(value) {
        this.#_createdAt = value;
    }

    set updatedAt(value) {
        this.#_updatedAt = value;
    }
}

module.exports = ArticleDto