export function withAsync(handler) {
  // (실행 할 비동기 함수)
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}
