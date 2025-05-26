class UnauthorizedError extends Error {
  constructor() {
    super("로그인이 필요합니다.");
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
