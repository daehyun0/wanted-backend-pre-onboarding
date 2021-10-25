class ArticleDtoBuilder {
    #article

    constructor() {
        const ArticleDto = require('../dto/article');
        this.#article = new ArticleDto();
    }

    of(articleModel) {
        this.pk(articleModel.pk)
        this.userPk(articleModel.userPk)
        this.title(articleModel.title)
        this.body(articleModel.body)
        this.createdAt(articleModel.createdAt)
        this.updatedAt(articleModel.updatedAt)
        return this;
    }

    pk(value) {
        this.#article.pk = value;
        return this;
    }

    userPk(value) {
        this.#article.userPk = value;
        return this;
    }

    title(value) {
        this.#article.title = value;
        return this;
    }

    body(value) {
        this.#article.body = value;
        return this;
    }

    createdAt(value) {
        this.#article.createdAt = value;
        return this;
    }

    updatedAt(value) {
        this.#article.updatedAt = value;
        return this;
    }

    build() {
        return this.#article;
    }
}

module.exports = ArticleDtoBuilder;