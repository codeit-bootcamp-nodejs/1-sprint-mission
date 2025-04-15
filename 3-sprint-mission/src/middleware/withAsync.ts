export function withAsync(handler: any) {
  // (실행 할 비동기 함수)
  return async function (req: any, res: any, next: any) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
