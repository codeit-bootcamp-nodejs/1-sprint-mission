class Article {
  constructor(title, content, writer = "", likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date();
  }

  set likeCount(count) {
    throw new Error("call like()");
  }

  get likeCount() {
    return this._likeCount;
  }

  like() {
    this.likeCount += 1;
  }
}

export { Article };
