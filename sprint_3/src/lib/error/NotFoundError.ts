class NotFoundError extends Error {
  constructor(entityName: string) {
    super(`해당 ${entityName}을 찾을 수 없습니다.`);
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
