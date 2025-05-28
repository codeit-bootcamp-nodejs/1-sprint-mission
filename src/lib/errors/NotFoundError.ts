<<<<<<< HEAD
class NotFoundError extends Error {
  constructor(modelName: string, id: number) {
    super(`${modelName} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
=======
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
>>>>>>> origin/main
